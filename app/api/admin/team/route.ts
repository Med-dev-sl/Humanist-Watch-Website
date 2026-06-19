import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

async function auth() {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;
  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const payload = await auth();
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const published = searchParams.get("published");

  const where: Record<string, unknown> = {};

  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { role: { contains: q, mode: "insensitive" } },
      { bio: { contains: q, mode: "insensitive" } },
    ];
  }

  if (published === "true") where.published = true;
  else if (published === "false") where.published = false;

  const members = await prisma.teamMember.findMany({
    where,
    orderBy: { order: "asc" },
  });

  return NextResponse.json(members);
}

export async function POST(req: NextRequest) {
  const payload = await auth();
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, role, bio, image, email, order, published } = body;

  if (!name || !role) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const member = await prisma.teamMember.create({
    data: { name, role, bio, image, email, order: order ?? 0, published: published ?? true },
  });

  return NextResponse.json(member, { status: 201 });
}
