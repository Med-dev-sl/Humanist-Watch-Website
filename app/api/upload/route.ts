import { NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { uploadImage } from "@/lib/upload";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "programs";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const url = await uploadImage(file, folder);
      return NextResponse.json({ url });
    }

    const ext = file.name.split(".").pop() || "jpg";
    const fileName = `${randomUUID()}.${ext}`;
    const dir = `public/uploads/${folder}`;
    const filePath = `${dir}/${fileName}`;

    await mkdir(dir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    const url = `/uploads/${folder}/${fileName}`;
    return NextResponse.json({ url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
