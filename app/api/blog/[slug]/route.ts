import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PostStatus } from "@/app/generated/prisma/client";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug, status: PostStatus.PUBLISHED },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      content: true,
      image: true,
      publishedAt: true,
      createdAt: true,
    },
  });

  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(post);
}
