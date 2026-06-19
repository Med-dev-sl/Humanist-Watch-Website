export async function uploadImage(file: File, folder = "general"): Promise<string> {
  const { put } = await import("@vercel/blob");
  const ext = file.name.split(".").pop() || "jpg";
  const key = `${folder}/${crypto.randomUUID()}.${ext}`;

  const blob = await put(key, file, {
    access: "public",
    addRandomSuffix: false,
  });

  return blob.url;
}
