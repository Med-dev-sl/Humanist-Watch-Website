import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const events = await prisma.event.findMany({
    where: { published: true },
    orderBy: { date: "desc" },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      image: true,
      location: true,
      date: true,
      createdAt: true,
    },
  });

  return NextResponse.json(events);
}
