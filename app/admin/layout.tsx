import Link from "next/link";

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: "▦" },
  { href: "/admin/users", label: "Users", icon: "👥" },
  { href: "/admin/programs", label: "Programs", icon: "📋" },
  { href: "/admin/blog", label: "Blog Posts", icon: "📝" },
];

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen">
      <aside className="flex w-64 flex-col border-r bg-white">
        <div className="flex h-16 items-center gap-3 border-b px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
            H
          </div>
          <span className="text-sm font-semibold text-primary">Admin Panel</span>
        </div>

        <nav className="flex-1 space-y-1 p-4">
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

      <main className="flex-1 bg-zinc-50">{children}</main>
    </div>
  );
}
