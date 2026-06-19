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

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const payload = await auth();
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { read } = body;

  if (typeof read !== "boolean") {
    return NextResponse.json({ error: "read must be a boolean" }, { status: 400 });
  }

  const contact = await prisma.contact.update({
    where: { id },
    data: { read },
  });

  return NextResponse.json(contact);
}
