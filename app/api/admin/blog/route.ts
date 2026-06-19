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

export async function GET(req: NextRequest) {
  const payload = await auth();
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const status = searchParams.get("status") as PostStatus | null;

  const where: Record<string, unknown> = {};

  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { excerpt: { contains: q, mode: "insensitive" } },
    ];
  }

  if (status && Object.values(PostStatus).includes(status)) {
    where.status = status;
  }

  const posts = await prisma.blogPost.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, name: true, email: true } },
      tags: { include: { tag: true } },
    },
  });

  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const payload = await auth();
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, slug, excerpt, content, image, status } = body;

  if (!title || !slug) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const existing = await prisma.blogPost.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
  }

  const post = await prisma.blogPost.create({
    data: {
      title,
      slug,
      excerpt,
      content,
      image,
      status: status ?? PostStatus.DRAFT,
      publishedAt: status === PostStatus.PUBLISHED ? new Date() : null,
      userId: payload.id,
    },
    include: {
      user: { select: { id: true, name: true, email: true } },
      tags: { include: { tag: true } },
    },
  });

  return NextResponse.json(post, { status: 201 });
}
