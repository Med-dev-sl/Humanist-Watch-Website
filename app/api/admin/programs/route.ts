import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const q = searchParams.get("q");

    const where: Record<string, unknown> = {};

    if (status === "published") where.published = true;
    if (status === "draft") where.published = false;

    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
    }

    const programs = await prisma.program.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ programs });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch programs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyToken(token);
    const body = await request.json();

    const program = await prisma.program.create({
      data: {
        title: body.title,
        slug: body.slug,
        description: body.description || null,
        content: body.content || null,
        image: body.image || null,
        icon: body.icon || null,
        published: body.published ?? false,
        userId: payload.id,
      },
    });

    return NextResponse.json({ program }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create program";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
