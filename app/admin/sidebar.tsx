"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@/app/components/mui-icon";

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/users", label: "Users", icon: "group" },
  { href: "/admin/programs", label: "Programs & Projects", icon: "assignment" },
  { href: "/admin/blog", label: "Blog Posts", icon: "article" },
  { href: "/admin/gallery", label: "Gallery", icon: "photo_library" },
  { href: "/admin/beneficiaries", label: "Beneficiaries", icon: "volunteer_activism" },
  { href: "/admin/events", label: "Events", icon: "event" },
  { href: "/admin/team", label: "Team Members", icon: "badge" },
  { href: "/admin/jobs", label: "Jobs", icon: "work" },
  { href: "/admin/contacts", label: "Contact Messages", icon: "mail" },
  { href: "/admin/volunteers", label: "Volunteers", icon: "handshake" },
  { href: "/admin/donations", label: "Donations", icon: "payments" },
];

export default function AdminSidebar({ userName }: { userName: string }) {
  const pathname = usePathname();

  return (
    <aside className="animate-slide-right flex w-64 flex-col border-r bg-white shadow-sm">
      <div className="flex h-16 items-center gap-3 border-b bg-gradient-to-r from-primary to-primary-dark px-4">
        <Image
          src="/Huwasal%20Logo.png"
          alt="Humanist Watch Salone"
          width={36}
          height={36}
          className="h-9 w-9 animate-float object-contain"
        />
        <span className="font-alt text-sm font-semibold text-white">Admin Panel</span>
      </div>

      <div className="border-b bg-gradient-to-r from-primary/[0.03] to-transparent px-4 py-3">
        <p className="text-xs text-zinc-400">Signed in as</p>
        <p className="font-alt text-sm font-bold text-primary">{userName}</p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {sidebarLinks.map((link, i) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              style={{ animationDelay: `${i * 30}ms` }}
              className={`group relative flex items-center gap-3 overflow-hidden rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 ${
                isActive
                  ? "bg-primary text-white shadow-md"
                  : "text-zinc-600 hover:bg-primary/5 hover:text-primary"
              }`}
            >
              {isActive && (
                <span className="absolute inset-0 animate-pulse-glow rounded-xl" />
              )}
              <Icon name={link.icon} className="relative z-10 text-xl" />
              <span className="relative z-10">{link.label}</span>
              {isActive && (
                <span className="absolute right-2 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-white/60" />
              )}
              {!isActive && (
                <span className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 bg-primary transition-all duration-300 group-hover:w-full" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t bg-zinc-50/50 p-4">
        <Link
          href="/login"
          className="group flex items-center gap-2 text-sm text-zinc-500 transition-all duration-300 hover:text-red-500"
        >
          <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1">←</span>
          Sign out
        </Link>
      </div>
    </aside>
  );
}
