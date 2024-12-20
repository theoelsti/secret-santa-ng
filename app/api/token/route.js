import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  const { token } = await req.json();

  const member = await prisma.member.findUnique({
    where: { token },
    include: {
      isSantaFor: {
        include: {
          receiver: true,
        },
      },
    },
  });

  if (!member) {
    return Response.json(
      { ok: false, message: "Token introuvable" },
      { status: 404 }
    );
  }

  await prisma.member.update({
    where: { id: member.id },
    data: {
      lastSeen: new Date(),
    },
  });

  const santaRelation = member.isSantaFor[0];

  return Response.json({
    ok: true,
    santa: member.name,
    receiver: santaRelation ? santaRelation.receiver.name : null,
    receiver_id: santaRelation ? santaRelation.receiverId : null,
  });
}
