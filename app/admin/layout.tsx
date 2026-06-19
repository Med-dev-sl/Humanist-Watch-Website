import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ToastProvider } from "@/app/admin/toast";

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: "▦" },
  { href: "/admin/users", label: "Users", icon: "👥" },
  { href: "/admin/programs", label: "Programs & Projects", icon: "📋" },
  { href: "/admin/blog", label: "Blog Posts", icon: "📝" },
  { href: "/admin/gallery", label: "Gallery", icon: "🖼️" },
  { href: "/admin/beneficiaries", label: "Beneficiaries", icon: "🤝" },
  { href: "/admin/team", label: "Team Members", icon: "👤" },
  { href: "/admin/jobs", label: "Jobs", icon: "💼" },
  { href: "/admin/contacts", label: "Contact Messages", icon: "✉️" },
  { href: "/admin/volunteers", label: "Volunteers", icon: "🙋" },
  { href: "/admin/donations", label: "Donations", icon: "💰" },
];

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
    <div className="flex min-h-screen">
      <aside className="flex w-64 flex-col border-r bg-white">
        <div className="flex h-16 items-center gap-3 border-b px-4">
          <Image
            src="/Huwasal%20Logo.png"
            alt="Humanist Watch Salone"
            width={36}
            height={36}
            className="h-9 w-9 object-contain"
          />
          <span className="font-alt text-sm font-semibold text-primary">Admin Panel</span>
        </div>

        <div className="border-b px-4 py-3">
          <p className="text-xs text-zinc-400">Signed in as</p>
          <p className="font-alt text-sm font-medium text-primary">{userName}</p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-primary/5 hover:text-primary"
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="border-t p-4">
          <Link
            href="/login"
            className="flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-red-500"
          >
            ← Sign out
          </Link>
        </div>
      </aside>

      <main className="flex-1 bg-zinc-50">
        <ToastProvider>{children}</ToastProvider>
      </main>
    </div>
  );
}
