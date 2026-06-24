import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const galleries = await prisma.gallery.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: { images: { orderBy: { order: "asc" } } },
  });
  return NextResponse.json(galleries);
}
