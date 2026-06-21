"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

type OrgData = {
  whoWeAre: string | null;
  whoWeAreImage: string | null;
};

function extractBrief(text: string): string {
  const lines = text.split("\n").filter(Boolean);
  const start = lines.findIndex(
    (l) => l.toLowerCase().includes("who we are") || l.toLowerCase().includes("huwasal")
  );
  const relevant = start >= 0 ? lines.slice(start + 1) : lines;
  const joined = relevant.join(" ").trim();
  return joined.length > 300 ? joined.slice(0, 300) + "..." : joined;
}

export default function WhoWeAreSection() {
  const [org, setOrg] = useState<OrgData | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => setOrg(data))
      .catch(() => {});
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  };

  if (!org?.whoWeAre) return null;

  const brief = extractBrief(org.whoWeAre);

  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-28">
      {/* Background decorations */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-80 w-80 rounded-full bg-primary/[0.02] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/[0.03] blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-5 lg:gap-16">
          {/* Text side */}
          <div className="lg:col-span-3">
            <div className="animate-fade-in">
              <span className="mb-4 inline-block rounded-full border border-primary/10 bg-primary/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-primary">
                Who We Are
              </span>
              <h2 className="animate-slide-up mb-6 text-3xl font-bold leading-tight tracking-tight text-primary sm:text-4xl lg:text-5xl">
                We are{" "}
                <span className="relative inline-block">
                  <span className="relative z-10">change-makers</span>
                  <span className="absolute bottom-1 left-0 right-0 h-3 bg-primary/10 -z-10" />
                </span>
              </h2>
              <p className="animate-slide-up mb-8 text-base leading-relaxed text-zinc-500 sm:text-lg" style={{ animationDelay: "0.1s" }}>
                {brief}
              </p>
              <div className="animate-slide-up flex flex-wrap gap-4" style={{ animationDelay: "0.2s" }}>
                <Link
                  href="/about"
                  className="group inline-flex items-center gap-2 bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:translate-y-[-2px] hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30"
                >
                  <span>Know More</span>
                  <svg
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2 border-2 border-primary/15 px-6 py-3 text-sm font-bold text-primary transition-all duration-300 hover:border-primary/40 hover:bg-primary/5"
                >
                  <span>Get in Touch</span>
                </Link>
              </div>
            </div>
          </div>

          {/* 3D Card side */}
          <div className="lg:col-span-2">
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="animate-fade-in group relative cursor-default rounded-2xl bg-gradient-to-br from-primary to-primary-dark p-8 shadow-2xl transition-all duration-200 ease-out sm:p-10"
              style={{ transformStyle: "preserve-3d", animationDelay: "0.15s" }}
            >
              {/* Shine effect */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 via-transparent to-black/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              {/* Content with 3D depth layers */}
              <div style={{ transform: "translateZ(30px)" }}>
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
                  <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21m0 0h15M3 21h15" />
                  </svg>
                </div>
                <h3 className="mb-3 text-xl font-bold text-white" style={{ transform: "translateZ(20px)" }}>
                  Our Impact
                </h3>
                <ul className="space-y-2.5 text-sm text-white/80" style={{ transform: "translateZ(15px)" }}>
                  {[
                    "Promoting human rights & good governance",
                    "Empowering women, youth & children",
                    "Environmental & climate justice",
                    "Community health & sanitation",
                    "Peace building & inclusive development",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Decorative 3D elements */}
              <div
                className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full border border-white/10"
                style={{ transform: "translateZ(-10px)" }}
              />
              <div
                className="pointer-events-none absolute -bottom-3 -left-3 h-16 w-16 rounded-xl border border-white/5"
                style={{ transform: "translateZ(-5px)" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
