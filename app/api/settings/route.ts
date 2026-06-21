import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  let org = await prisma.organization.findFirst();
  if (!org) {
    org = await prisma.organization.create({ data: { name: "Humanist Watch Salone" } });
  }
  return NextResponse.json(org);
}
