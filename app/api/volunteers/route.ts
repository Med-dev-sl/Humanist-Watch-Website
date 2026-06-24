import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, phone, skills, message } = body;

  if (!name || !email) {
    return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
  }

  const volunteer = await prisma.volunteer.create({
    data: {
      name,
      email,
      phone: phone || null,
      skills: skills || null,
      message: message || null,
      status: "pending",
    },
  });

  return NextResponse.json(volunteer, { status: 201 });
}
