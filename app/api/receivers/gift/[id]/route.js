import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req, { params }) {
  const { token } = await req.json();
  const { id } = await params;
  const userId = parseInt(id);

  const sender = await prisma.member.findUnique({
    where: { token },
  });

  if (!sender) {
    return Response.json(
      { ok: false, message: "Token invalide" },
      { status: 404 }
    );
  }

  if (sender.id === userId) {
    return Response.json(
      {
        ok: false,
        message: "Vous ne pouvez pas voir vos propres cadeaux",
      },
      { status: 400 }
    );
  }

  const relation = await prisma.santaRelation.findFirst({
    where: {
      santaId: sender.id,
      receiverId: userId,
    },
  });

  if (!relation) {
    return Response.json(
      {
        ok: false,
        message: "Vous ne pouvez pas voir les cadeaux de cette personne",
      },
      { status: 400 }
    );
  }

  const gifts = await prisma.gift.findMany({
    where: {
      receiverId: userId,
    },
    select: { gift: true },
  });

  await prisma.member.update({
    where: { id: sender.id },
    data: { lastSeen: new Date() },
  });

  return Response.json({ ok: true, gifts });
}