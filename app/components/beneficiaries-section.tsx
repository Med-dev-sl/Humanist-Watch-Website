"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import SlideIn from "@/app/components/slide-in";

type Beneficiary = {
  id: string;
  name: string;
  slug: string;
  story: string | null;
  description: string | null;
  image: string | null;
  location: string | null;
  age: number | null;
};

export default function BeneficiariesSection() {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [selected, setSelected] = useState<Beneficiary | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/beneficiaries")
      .then((r) => r.json())
      .then((data) => setBeneficiaries(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (selected) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [selected]);

  if (beneficiaries.length === 0) return null;

  const duplicated = [...beneficiaries, ...beneficiaries];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/[0.02] via-white to-primary/[0.02] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SlideIn>
          <div className="mb-10 text-center">
            <span className="mb-4 inline-block rounded-full border border-primary/10 bg-primary/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-primary">
              Our Impact
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-5xl">
              Lives We Have Touched
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-zinc-500">
              Meet some of the individuals whose lives have been transformed through our programs.
            </p>
          </div>
        </SlideIn>
      </div>

      <div
        ref={scrollerRef}
        className="group/scroller relative mx-auto max-w-7xl overflow-hidden px-4 sm:px-6"
      >
        <div
          className="flex items-stretch gap-6"
          style={{
            animation: "scroll-beneficiaries 60s linear infinite",
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
          {duplicated.map((b, i) => (
            <button
              key={`${b.id}-${i}`}
              onClick={() => setSelected(b)}
              className="group/card flex w-[280px] flex-shrink-0 flex-col overflow-hidden rounded-xl border border-primary/10 bg-white text-left shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 sm:w-[320px]"
            >
              {b.image ? (
                <div className="relative h-36 w-full flex-shrink-0 overflow-hidden bg-zinc-100 sm:h-40">
                  <Image
                    src={b.image}
                    alt={b.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                    sizes="(max-width: 640px) 280px, 320px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className="inline-block rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary shadow-sm">
                      {b.location ?? "Sierra Leone"}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex h-36 w-full flex-shrink-0 items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 sm:h-40">
                  <span className="text-4xl font-bold text-primary/20">
                    {b.name.charAt(0)}
                  </span>
                  <div className="absolute bottom-3 left-3">
                    <span className="inline-block rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary shadow-sm">
                      {b.location ?? "Sierra Leone"}
                    </span>
                  </div>
                </div>
              )}
              <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-primary sm:text-lg">{b.name}</h3>
                    {b.age != null && (
                      <span className="text-xs text-zinc-400">({b.age})</span>
                    )}
                  </div>
                  {b.description && (
                    <p className="mt-1.5 text-sm leading-relaxed text-zinc-500 line-clamp-2">
                      {b.description}
                    </p>
                  )}
                </div>
                <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary transition-colors group-hover/card:text-primary-dark">
                  Read Story
                  <svg className="h-3.5 w-3.5 transition-transform group-hover/card:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-zinc-500 shadow-sm backdrop-blur transition-colors hover:bg-white hover:text-zinc-800"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {selected.image && (
              <div className="relative h-48 w-full flex-shrink-0 overflow-hidden sm:h-56">
                <Image
                  src={selected.image}
                  alt={selected.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 512px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
            )}

            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl font-bold text-primary sm:text-2xl">{selected.name}</h3>
                {selected.age != null && (
                  <span className="text-sm text-zinc-400">({selected.age} yrs)</span>
                )}
              </div>
              {selected.location && (
                <p className="mt-1 text-sm text-zinc-500">{selected.location}</p>
              )}
              {selected.story && (
                <div className="mt-4 rounded-xl bg-primary/[0.03] p-4 sm:p-5">
                  <p className="text-sm leading-relaxed text-zinc-600 sm:text-base">
                    {selected.story}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scroll-beneficiaries {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
