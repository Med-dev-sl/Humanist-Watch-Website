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
    where.OR = [{ title: { contains: q, mode: "insensitive" } }];
  }

  if (published === "true") where.published = true;
  else if (published === "false") where.published = false;

  const galleries = await prisma.gallery.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { images: { orderBy: { order: "asc" } } },
  });

  return NextResponse.json(galleries);
}

export async function POST(req: NextRequest) {
  const payload = await auth();
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, slug, description, coverImage, published, images } = body;

  if (!title || !slug) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const existing = await prisma.gallery.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
  }

  const gallery = await prisma.gallery.create({
    data: {
      title,
      slug,
      description,
      coverImage,
      published: published ?? false,
      images: images?.length
        ? {
            create: images.map((img: { url: string; alt?: string; caption?: string; order?: number }) => ({
              url: img.url,
              alt: img.alt,
              caption: img.caption,
              order: img.order ?? 0,
            })),
          }
        : undefined,
    },
    include: { images: { orderBy: { order: "asc" } } },
  });

  return NextResponse.json(gallery, { status: 201 });
}
