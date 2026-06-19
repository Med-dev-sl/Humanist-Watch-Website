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
  const type = searchParams.get("type");

  const where: Record<string, unknown> = {};

  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { location: { contains: q, mode: "insensitive" } },
    ];
  }

  if (published === "true") where.published = true;
  else if (published === "false") where.published = false;

  if (type) where.type = type;

  const jobs = await prisma.job.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(jobs);
}

export async function POST(req: NextRequest) {
  const payload = await auth();
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, slug, description, content, location, type, deadline, published } = body;

  if (!title || !slug) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const existing = await prisma.job.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
  }

  const job = await prisma.job.create({
    data: {
      title,
      slug,
      description,
      content,
      location,
      type: type ?? "full-time",
      deadline: deadline ? new Date(deadline) : null,
      published: published ?? false,
    },
  });

  return NextResponse.json(job, { status: 201 });
}
