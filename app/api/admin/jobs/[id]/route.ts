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

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const payload = await auth();
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const job = await prisma.job.findUnique({ where: { id } });

  if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(job);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const payload = await auth();
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { title, slug, description, content, location, type, deadline, published } = body;

  if (slug) {
    const existing = await prisma.job.findUnique({ where: { slug } });
    if (existing && existing.id !== id) {
      return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
    }
  }

  const data: Record<string, unknown> = {};
  if (title !== undefined) data.title = title;
  if (slug !== undefined) data.slug = slug;
  if (description !== undefined) data.description = description;
  if (content !== undefined) data.content = content;
  if (location !== undefined) data.location = location;
  if (type !== undefined) data.type = type;
  if (deadline !== undefined) data.deadline = deadline ? new Date(deadline) : null;
  if (published !== undefined) data.published = published;

  const job = await prisma.job.update({ where: { id }, data });

  return NextResponse.json(job);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const payload = await auth();
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  await prisma.job.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
