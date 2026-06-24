import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const members = await prisma.teamMember.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    select: {
      id: true,
      name: true,
      role: true,
      bio: true,
      image: true,
      email: true,
    },
  });

  return NextResponse.json(members);
}
