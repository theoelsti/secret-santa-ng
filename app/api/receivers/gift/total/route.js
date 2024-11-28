import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const count = await prisma.gift.count();
  return Response.json({ total_gifts: count });
}
