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
    <div className="sticky top-0 z-50">
      {/* Top bar */}
      <div className="hidden animate-slide-down md:block">
        <div className="mx-auto flex h-9 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4 text-xs text-white/80">
            <a href="mailto:info@huwasal.com" className="flex items-center gap-1.5 transition-colors hover:text-white">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              info@huwasal.com
            </a>
            <span className="text-white/20">|</span>
            <a href="tel:+232000000000" className="flex items-center gap-1.5 transition-colors hover:text-white">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              +232 00 000 0000
            </a>
          </div>
          <div className="flex items-center gap-3 text-xs text-white/80">
            <a href="#" className="transition-colors hover:text-white">Facebook</a>
            <span className="text-white/20">|</span>
            <a href="#" className="transition-colors hover:text-white">Twitter</a>
            <span className="text-white/20">|</span>
            <a href="#" className="transition-colors hover:text-white">Instagram</a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header
        className={`w-full animate-fade-in transition-all duration-500 ${
          scrolled ? "bg-white shadow-lg" : "bg-white"
        }`}
        style={{ animationDelay: "0.2s", animationFillMode: "both" }}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="group flex items-center gap-3">
            <Image
              src="/Huwasal%20Logo.png"
              alt="Humanist Watch Salone"
              width={48}
              height={48}
              className="h-12 w-12 object-contain transition-transform duration-300 group-hover:scale-110"
            />
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
    </div>
  );
}
