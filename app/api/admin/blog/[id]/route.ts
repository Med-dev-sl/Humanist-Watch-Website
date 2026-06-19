import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { PostStatus } from "@/app/generated/prisma/client";

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

  const post = await prisma.blogPost.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      tags: { include: { tag: true } },
    },
  });

  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(post);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const payload = await auth();
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { title, slug, excerpt, content, image, status } = body;

  if (slug) {
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (existing && existing.id !== id) {
      return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
    }
  }

  const data: Record<string, unknown> = {};
  if (title !== undefined) data.title = title;
  if (slug !== undefined) data.slug = slug;
  if (excerpt !== undefined) data.excerpt = excerpt;
  if (content !== undefined) data.content = content;
  if (image !== undefined) data.image = image;
  if (status !== undefined) {
    data.status = status;
    if (status === PostStatus.PUBLISHED) {
      data.publishedAt = new Date();
    }
  }

  const post = await prisma.blogPost.update({
    where: { id },
    data,
    include: {
      user: { select: { id: true, name: true, email: true } },
      tags: { include: { tag: true } },
    },
  });

  return NextResponse.json(post);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const payload = await auth();
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  await prisma.blogPost.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
