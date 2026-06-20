import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

async function auth() {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;
  try { return verifyToken(token); } catch { return null; }
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
      { name: { contains: q, mode: "insensitive" as const } },
      { description: { contains: q, mode: "insensitive" as const } },
      { location: { contains: q, mode: "insensitive" as const } },
    ];
  }

  if (published === "true") where.published = true;
  else if (published === "false") where.published = false;

  const events = await prisma.event.findMany({ where, orderBy: { createdAt: "desc" } });
  return NextResponse.json(events);
}

export async function POST(req: NextRequest) {
  const payload = await auth();
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, slug, description, image, location, date, published } = body;

  if (!name || !slug) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const existing = await prisma.event.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
  }

  const event = await prisma.event.create({
    data: { name, slug, description, image, location, date: date ? new Date(date) : null, published: published ?? false },
  });

  return NextResponse.json(event, { status: 201 });
}
