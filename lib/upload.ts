import { put, del, list } from "@vercel/blob";
import { randomUUID } from "node:crypto";

export async function uploadImage(
  file: File,
  folder = "general"
): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const key = `${folder}/${randomUUID()}.${ext}`;

  const blob = await put(key, file, {
    access: "public",
    addRandomSuffix: false,
  });

  return blob.url;
}

export async function uploadImages(
  files: File[],
  folder = "general"
): Promise<string[]> {
  return Promise.all(files.map((file) => uploadImage(file, folder)));
}

export async function deleteImage(url: string) {
  await del(url);
}

export async function listImages(folder: string) {
  const { blobs } = await list({ prefix: folder });
  return blobs;
}
