import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

function generateToken(length = 20) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
}

function secretSanta(members) {
  let maxAttempts = 100;
  let attempt = 0;

  while (attempt < maxAttempts) {
    try {
      let assignments = new Map();
      let available = [...members];
      let givers = [...members];

      for (let i = givers.length - 1; i >= 0; i--) {
        const giver = givers[i];
        const validReceivers = available.filter(
          (r) => r.family !== giver.family && r.name !== giver.name
        );

        if (validReceivers.length === 0) {
          throw new Error("No valid receiver found");
        }

        const randomIndex = Math.floor(Math.random() * validReceivers.length);
        const receiver = validReceivers[randomIndex];

        assignments.set(giver.name, receiver.name);
        available = available.filter((m) => m.name !== receiver.name);
      }

      return assignments;
    } catch (error) {
      attempt++;
      if (attempt === maxAttempts) {
        throw new Error("Could not generate valid secret santa assignments");
      }
    }
  }
}
export async function POST(req) {
  try {
    const { families } = await req.json();

    // Récupérer le cookie admin_session
    const adminSession = req.cookies.get("admin_session")?.value;

    // Vérifier que le cookie admin_session correspond à admin_token
    if (adminSession !== process.env.ADMIN_TOKEN) {
      return NextResponse.json(
        { ok: false, message: "Session admin invalide" },
        { status: 403 }
      );
    }
    await prisma.santaRelation.deleteMany();
    await prisma.member.deleteMany();
    await prisma.gift.deleteMany();

    const allMembers = [];
    const memberTokens = [];

    // Création des membres
    for (const family of families) {
      for (const member of family.members) {
        const memberToken = generateToken();
        memberTokens.push({ name: member.name, token: memberToken });

        const createdMember = await prisma.member.create({
          data: {
            name: member.name,
            family: family.name,
            token: memberToken,
          },
        });

        allMembers.push({
          ...member,
          id: createdMember.id,
          prismaId: createdMember.id,
          family: family.name,
        });
      }
    }

    // Génération des assignations
    const assignments = secretSanta(allMembers);

    // Création des relations
    for (const [santaName, receiverName] of assignments) {
      const santa = allMembers.find((m) => m.name === santaName);
      const receiver = allMembers.find((m) => m.name === receiverName);

      if (santa && receiver) {
        await prisma.santaRelation.create({
          data: {
            receiverId: receiver.prismaId,
            santaId: santa.prismaId,
          },
        });
      }
    }

    return NextResponse.json({ ok: true, tokens: memberTokens });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        ok: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}
