import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

async function getSettings() {
  let org = await prisma.organization.findFirst();
  if (!org) {
    org = await prisma.organization.create({ data: { name: "Humanist Watch Salone" } });
  }
  return org;
}

export async function GET() {
  const token = (await cookies()).get("token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try { verifyToken(token); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }

  const org = await getSettings();
  return NextResponse.json(org);
}

export async function PUT(request: Request) {
  const token = (await cookies()).get("token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try { verifyToken(token); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }

  const body = await request.json();
  const org = await getSettings();

  const updated = await prisma.organization.update({
    where: { id: org.id },
    data: {
      name: body.name,
      tagline: body.tagline ?? null,
      description: body.description ?? null,
      logo: body.logo ?? null,
      favicon: body.favicon ?? null,
      email: body.email ?? null,
      phone: body.phone ?? null,
      address: body.address ?? null,
      website: body.website ?? null,
      facebook: body.facebook ?? null,
      twitter: body.twitter ?? null,
      instagram: body.instagram ?? null,
      linkedin: body.linkedin ?? null,
      youtube: body.youtube ?? null,
      mission: body.mission ?? null,
      missionImage: body.missionImage ?? null,
      vision: body.vision ?? null,
      visionImage: body.visionImage ?? null,
      aboutUs: body.aboutUs ?? null,
      aboutImage: body.aboutImage ?? null,
      whoWeAre: body.whoWeAre ?? null,
      whoWeAreImage: body.whoWeAreImage ?? null,
      history: body.history ?? null,
      historyImage: body.historyImage ?? null,
    },
  });

  return NextResponse.json(updated);
}
