import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  const { token } = await req.json();
  const member = await prisma.member.findUnique({
    where: { token },
    include: {
      gifts: true,
    },
  });

  if (!member) {
    return Response.json(
      { ok: false, message: "Token invalide" },
      { status: 404 }
    );
  }

  const selfGift = member.gifts.some((gift) => gift.proposerId === member.id);

  return Response.json({
    ok: true,
    has_credit: !selfGift,
  });
}
