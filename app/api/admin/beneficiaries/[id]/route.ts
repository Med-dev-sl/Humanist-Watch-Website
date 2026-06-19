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

  const beneficiary = await prisma.beneficiary.findUnique({ where: { id } });

  if (!beneficiary) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(beneficiary);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const payload = await auth();
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { name, slug, story, description, image, location, age, published } = body;

  if (slug) {
    const existing = await prisma.beneficiary.findUnique({ where: { slug } });
    if (existing && existing.id !== id) {
      return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
    }
  }

  const data: Record<string, unknown> = {};
  if (name !== undefined) data.name = name;
  if (slug !== undefined) data.slug = slug;
  if (story !== undefined) data.story = story;
  if (description !== undefined) data.description = description;
  if (image !== undefined) data.image = image;
  if (location !== undefined) data.location = location;
  if (age !== undefined) data.age = age;
  if (published !== undefined) data.published = published;

  const beneficiary = await prisma.beneficiary.update({ where: { id }, data });

  return NextResponse.json(beneficiary);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const payload = await auth();
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  await prisma.beneficiary.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
