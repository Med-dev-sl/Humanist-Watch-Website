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
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact Us" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <div className="sticky top-0 z-50">
      {/* Top bar */}
      <div className="animate-slide-down bg-primary">
        <div className="mx-auto flex h-9 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3 text-xs text-white/80 sm:gap-4">
            <a href="mailto:info@huwasal.com" className="flex items-center gap-1.5 transition-colors hover:text-white">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              <span className="hidden sm:inline">info@huwasal.com</span>
            </a>
            <span className="text-white/20">|</span>
            <a href="tel:+232000000000" className="flex items-center gap-1.5 transition-colors hover:text-white">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              <span className="hidden sm:inline">+232 00 000 0000</span>
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
        <div className="flex h-16 items-center justify-between pl-3 pr-4 sm:pl-6 sm:pr-6">
          <Link href="/" className="flex items-center gap-2 sm:gap-3">
            <Image
              src="/Huwasal%20Logo.png"
              alt="Humanist Watch Salone"
              width={64}
              height={64}
              className="h-14 w-14 object-contain transition-transform duration-300 hover:scale-110 sm:h-16 sm:w-16"
            />
            <span className="text-base font-bold tracking-tight text-primary sm:text-lg">
              Humanist Watch Salone
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <nav className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group relative px-2 py-2 text-sm font-medium text-primary/70 transition-colors hover:text-primary lg:px-3"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 bg-primary transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>
            <Link
              href="/donate"
              className="hidden bg-primary px-4 py-2 text-sm font-bold text-white transition-all duration-300 hover:bg-primary-dark md:inline-block lg:px-5"
            >
              DONATE
            </Link>

            {/* Hamburger button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-10 w-10 items-center justify-center md:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <div className="flex w-5 flex-col items-center gap-1">
                <span className={`block h-0.5 w-5 bg-primary transition-all duration-300 ${menuOpen ? 'translate-y-1.5 rotate-45' : ''}`} />
                <span className={`block h-0.5 w-5 bg-primary transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
                <span className={`block h-0.5 w-5 bg-primary transition-all duration-300 ${menuOpen ? '-translate-y-1.5 -rotate-45' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 md:hidden ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile menu panel */}
      <div
        className={`fixed inset-y-0 right-0 z-50 flex w-72 flex-col bg-white shadow-2xl transition-transform duration-300 ease-out md:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-zinc-100 p-4">
          <span className="text-sm font-bold text-primary">Menu</span>
          <button
            onClick={() => setMenuOpen(false)}
            className="flex h-8 w-8 items-center justify-center"
            aria-label="Close menu"
          >
            <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block border-b border-zinc-50 py-3.5 text-base font-medium text-primary transition-all hover:translate-x-1 hover:text-primary-light"
              style={{
                animation: menuOpen ? `slide-left 0.3s ease-out ${i * 0.06}s both` : "none",
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-zinc-100 p-4">
          <Link
            href="/donate"
            onClick={() => setMenuOpen(false)}
            className="block bg-primary px-5 py-3 text-center text-sm font-bold text-white transition-all duration-300 hover:bg-primary-dark"
          >
            DONATE
          </Link>
        </div>
      </div>
    </div>
  );
}
