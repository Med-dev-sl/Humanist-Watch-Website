"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/programs", label: "Programs & Projects" },
  { href: "/blog", label: "News & Blog" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact Us" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? "bg-white shadow-lg"
          : "bg-white"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Image
              src="/Huwasal%20Logo.png"
              alt="Humanist Watch Salone"
              width={48}
              height={48}
              className="h-12 w-12 object-contain transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <span className="hidden text-lg font-bold tracking-tight text-primary sm:inline">
            Humanist Watch Salone
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group relative px-3 py-2 text-sm font-medium text-primary/70 transition-colors hover:text-primary"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>
          <Link
            href="/donate"
            className="bg-primary px-5 py-2 text-sm font-bold text-white transition-all duration-300 hover:bg-primary-dark"
          >
            DONATE
          </Link>
        </div>
      </div>
    </header>
  );
}
