import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  const members = await prisma.member.findMany({
    select: {
      id: true,
      name: true,
      family: true,
      token: true,
      lastSeen: true,
    },
    orderBy: {
      family: "asc",
    },
  });

  return Response.json({ members });
}
