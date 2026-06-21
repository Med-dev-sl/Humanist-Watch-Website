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
          ? "bg-primary/95 shadow-lg backdrop-blur-md"
          : "bg-primary"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 animate-bounce-arrow text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
            <Image
              src="/Huwasal%20Logo.png"
              alt="Humanist Watch Salone"
              width={56}
              height={56}
              className="h-14 w-14 object-contain transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <span className="hidden text-lg font-semibold tracking-tight text-white sm:inline">
            Humanist Watch Salone
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group relative px-3 py-2 text-sm font-medium text-white/80 transition-colors hover:text-white"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 bg-white transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>
          <Link
            href="/donate"
            className="bg-white px-5 py-2 text-sm font-bold text-primary transition-all duration-300 hover:bg-zinc-100"
          >
            DONATE
          </Link>
        </div>
      </div>
    </header>
  );
}
