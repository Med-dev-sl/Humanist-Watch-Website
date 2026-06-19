import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const program = await prisma.program.findUnique({ where: { id } });
    if (!program) return NextResponse.json({ error: "Program not found" }, { status: 404 });
    return NextResponse.json({ program });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch program" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    verifyToken(token);
    const { id } = await params;
    const body = await request.json();

    const program = await prisma.program.update({
      where: { id },
      data: {
        title: body.title,
        slug: body.slug,
        description: body.description || null,
        content: body.content || null,
        image: body.image || null,
        icon: body.icon || null,
        published: body.published ?? false,
      },
    });

    return NextResponse.json({ program });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update program";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    verifyToken(token);
    const { id } = await params;
    await prisma.program.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete program" }, { status: 500 });
  }
}
