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

  const member = await prisma.teamMember.findUnique({ where: { id } });

  if (!member) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(member);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const payload = await auth();
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { name, role, bio, image, email, order, published } = body;

  const data: Record<string, unknown> = {};
  if (name !== undefined) data.name = name;
  if (role !== undefined) data.role = role;
  if (bio !== undefined) data.bio = bio;
  if (image !== undefined) data.image = image;
  if (email !== undefined) data.email = email;
  if (order !== undefined) data.order = order;
  if (published !== undefined) data.published = published;

  const member = await prisma.teamMember.update({ where: { id }, data });

  return NextResponse.json(member);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const payload = await auth();
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  await prisma.teamMember.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
