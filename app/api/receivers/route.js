import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  const { token } = await req.json();

  const member = await prisma.member.findUnique({
    where: { token },
  });

  if (!member) {
    return Response.json(
      { ok: false, message: "Token introuvable" },
      { status: 404 }
    );
  }

  const santaRelation = await prisma.santaRelation.findFirst({
    where: { santaId: member.id },
    include: {
      receiver: true,
      santa: true,
    },
  });

  return Response.json({
    ok: true,
    receiver: [santaRelation.receiver.name, santaRelation.receiver.id],
    santa: [[santaRelation.santa.name]],
    receiver_id: santaRelation.receiver.id,
  });
}
