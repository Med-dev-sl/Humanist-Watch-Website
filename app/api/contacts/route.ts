import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, phone, subject, message } = body;

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 });
  }

  const contact = await prisma.contact.create({
    data: {
      name,
      email,
      phone: phone || null,
      subject: subject || null,
      message,
      read: false,
    },
  });

  return NextResponse.json(contact, { status: 201 });
}
