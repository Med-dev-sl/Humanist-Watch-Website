import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PostStatus } from "@/app/generated/prisma/client";

export async function GET() {
  const posts = await prisma.blogPost.findMany({
    where: { status: PostStatus.PUBLISHED },
    orderBy: { publishedAt: "desc" },
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

  return NextResponse.json(posts);
}
