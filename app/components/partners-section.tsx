"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import SlideIn from "@/app/components/slide-in";

type Partner = {
  id: string;
  name: string;
  logo: string | null;
  website: string | null;
};

export default function PartnersSection() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/partners")
      .then((r) => r.json())
      .then((data) => setPartners(data))
      .catch(() => {});
  }, []);

  if (partners.length === 0) return null;

  const duplicated = [...partners, ...partners];

  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SlideIn>
          <div className="mb-10 text-center">
            <span className="mb-4 inline-block rounded-full border border-primary/10 bg-primary/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-primary">
              Our Partners
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-5xl">
              Trusted By
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-zinc-500">
              We collaborate with local and international organizations to drive sustainable change.
            </p>
          </div>
        </SlideIn>
      </div>

      <div
        ref={scrollerRef}
        className="group/scroller relative mx-auto max-w-7xl overflow-hidden"
      >
        <div
          className="flex items-center gap-16"
          style={{
            animation: "scroll-partners 50s linear infinite",
            width: "max-content",
          }}
          onMouseEnter={() => {
            if (scrollerRef.current) {
              const el = scrollerRef.current.querySelector(":scope > div") as HTMLElement;
              if (el) el.style.animationPlayState = "paused";
            }
          }}
          onMouseLeave={() => {
            if (scrollerRef.current) {
              const el = scrollerRef.current.querySelector(":scope > div") as HTMLElement;
              if (el) el.style.animationPlayState = "running";
            }
          }}
        >
          {duplicated.map((partner, i) => (
            <a
              key={`${partner.id}-${i}`}
              href={partner.website ?? "#"}
              target={partner.website ? "_blank" : undefined}
              rel={partner.website ? "noopener noreferrer" : undefined}
              className="flex h-20 w-44 flex-shrink-0 items-center justify-center grayscale transition-all duration-300 hover:grayscale-0"
            >
              {partner.logo ? (
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={160}
                  height={64}
                  className="max-h-16 w-auto max-w-[160px] object-contain"
                />
              ) : (
                <span className="text-center text-sm font-semibold text-zinc-400 hover:text-primary transition-colors">
                  {partner.name}
                </span>
              )}
            </a>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scroll-partners {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
