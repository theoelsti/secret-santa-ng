import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const members = await prisma.member.findMany({
    select: { id: true, name: true },
  });

  return Response.json({
    ok: true,
    receivers: members.map((m) => [m.id, m.name]),
  });
}
