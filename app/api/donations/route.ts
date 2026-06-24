import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, amount, message, anonymous, currency } = body;

  if (!amount || amount <= 0) {
    return NextResponse.json({ error: "Invalid donation amount" }, { status: 400 });
  }

  const donation = await prisma.donation.create({
    data: {
      amount,
      currency: currency ?? "USD",
      name,
      email,
      message,
      anonymous: anonymous ?? false,
    },
  });

  return NextResponse.json({ success: true, id: donation.id }, { status: 201 });
}
