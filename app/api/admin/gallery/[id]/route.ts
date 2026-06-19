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

  const gallery = await prisma.gallery.findUnique({
    where: { id },
    include: { images: { orderBy: { order: "asc" } } },
  });

  if (!gallery) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(gallery);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const payload = await auth();
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { title, slug, description, coverImage, published, images } = body;

  if (slug) {
    const existing = await prisma.gallery.findUnique({ where: { slug } });
    if (existing && existing.id !== id) {
      return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
    }
  }

  const data: Record<string, unknown> = {};
  if (title !== undefined) data.title = title;
  if (slug !== undefined) data.slug = slug;
  if (description !== undefined) data.description = description;
  if (coverImage !== undefined) data.coverImage = coverImage;
  if (published !== undefined) data.published = published;

  if (images) {
    await prisma.galleryImage.deleteMany({ where: { galleryId: id } });
    data.images = {
      create: images.map((img: { url: string; alt?: string; caption?: string; order?: number }) => ({
        url: img.url,
        alt: img.alt,
        caption: img.caption,
        order: img.order ?? 0,
      })),
    };
  }

  const gallery = await prisma.gallery.update({
    where: { id },
    data,
    include: { images: { orderBy: { order: "asc" } } },
  });

  return NextResponse.json(gallery);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const payload = await auth();
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  await prisma.gallery.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
