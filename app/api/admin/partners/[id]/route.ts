import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

async function auth() {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;
  try { return verifyToken(token); } catch { return null; }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const payload = await auth();
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const partner = await prisma.partner.findUnique({ where: { id } });
  if (!partner) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(partner);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const payload = await auth();
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();

  const data: Record<string, unknown> = {};
  if (body.name !== undefined) data.name = body.name;
  if (body.logo !== undefined) data.logo = body.logo;
  if (body.website !== undefined) data.website = body.website;
  if (body.order !== undefined) data.order = body.order;
  if (body.published !== undefined) data.published = body.published;

  const partner = await prisma.partner.update({ where: { id }, data });
  return NextResponse.json(partner);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const payload = await auth();
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await prisma.partner.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
