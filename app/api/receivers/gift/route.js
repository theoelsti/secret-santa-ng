import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req) {
  const { gift, receiver: receiverId, token } = await req.json();

  const sender = await prisma.member.findUnique({
    where: { token },
    include: { gifts: true },
  });

  if (!sender)
    return Response.json(
      { ok: false, message: "Token invalide" },
      { status: 404 }
    );

  const receiver = await prisma.member.findUnique({
    where: { id: parseInt(receiverId) },
  });

  if (!receiver) {
    return Response.json(
      { ok: false, message: "Receiver introuvable" },
      { status: 404 }
    );
  }

  if (sender.gifts.some((g) => g.proposerId === sender.id)) {
    return Response.json(
      {
        ok: false,
        message: "Vous avez déjà utilisé votre crédit pour proposer un cadeau",
      },
      { status: 400 }
    );
  }

  const relation = await prisma.santaRelation.findFirst({
    where: {
      santaId: sender.id,
      receiverId: parseInt(receiverId),
    },
  });

  if (relation) {
    return Response.json(
      {
        ok: false,
        message:
          "Vous offrez déja à cette personne ! Notez votre idée autre part :)",
      },
      { status: 400 }
    );
  }

  await prisma.gift.create({
    data: {
      gift,
      proposerId: sender.id,
      receiverId: parseInt(receiverId),
      timestamp: new Date(),
    },
  });

  await prisma.member.update({
    where: { id: sender.id },
    data: { lastSeen: new Date() },
  });

  return Response.json({
    ok: true,
    message: `Ton souhait de cadeau pour <strong>${receiver.name}</strong> a bien été envoyé au Père-Noël !<br/>`,
  });
}
