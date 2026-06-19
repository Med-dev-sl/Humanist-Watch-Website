import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ToastProvider } from "@/app/admin/toast";
import AdminSidebar from "@/app/admin/sidebar";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = (await cookies()).get("token")?.value;
  let userName = "User";

  if (token) {
    try {
      const payload = verifyToken(token);
      const user = await prisma.user.findUnique({ where: { id: payload.id } });
      if (user) userName = user.name;
    } catch {}
  }

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <AdminSidebar userName={userName} />
      <main className="flex-1 animate-fade-in">
        <ToastProvider>{children}</ToastProvider>
      </main>
    </div>
  );
}
