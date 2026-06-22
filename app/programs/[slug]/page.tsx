"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { use } from "react";
import SlideIn from "@/app/components/slide-in";

type Program = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  content: string | null;
  image: string | null;
  icon: string | null;
};

function formatContent(text: string | null): { heading: string; body: string[] }[] {
  if (!text) return [];
  const blocks: { heading: string; body: string[] }[] = [];
  const lines = text.split("\n").filter(Boolean);
  let current: { heading: string; body: string[] } | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (
      !trimmed.endsWith(".") &&
      !trimmed.endsWith(":") &&
      trimmed === trimmed.toUpperCase() &&
      trimmed.length > 0 &&
      trimmed.length < 100
    ) {
      if (current) blocks.push(current);
      current = { heading: trimmed, body: [] };
    } else if (trimmed.endsWith(":") && trimmed.length < 100) {
      if (current) blocks.push(current);
      current = { heading: trimmed.replace(":", ""), body: [] };
    } else {
      if (!current) current = { heading: "", body: [] };
      current.body.push(trimmed);
    }
  }
  if (current) blocks.push(current);
  if (blocks.length === 0) blocks.push({ heading: "", body: lines });
  return blocks;
}

function DetailContent({ program }: { program: Program }) {
  const blocks = formatContent(program.content);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <Link href="/programs" className="inline-flex items-center gap-2 text-sm font-medium text-primary/60 transition-colors hover:text-primary">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Programs
        </Link>
      </div>

      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
      </div>

      <h1 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-primary sm:text-4xl lg:text-5xl">
        {program.title}
      </h1>

      {program.description && (
        <p className="mb-8 text-lg leading-relaxed text-zinc-500">
          {program.description}
        </p>
      )}

      <div className="space-y-6">
        {blocks.map((block, i) => (
          <div key={i} className="animate-slide-up" style={{ animationDelay: `${i * 0.05}s`, animationFillMode: "both" }}>
            {block.heading && (
              <h2 className="mb-3 text-2xl font-bold text-primary">{block.heading}</h2>
            )}
            {block.body.map((p, j) => (
              <p key={j} className="mb-3 text-base leading-relaxed text-zinc-500 last:mb-0">{p}</p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProgramDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/programs/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((data) => { setProgram(data); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-white">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-white">
        <p className="text-zinc-400">Program not found.</p>
        <Link href="/programs" className="text-sm font-medium text-primary underline underline-offset-4">
          Back to Programs
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-primary pt-20 sm:pt-24">
        <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/[0.03] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-white/[0.05] blur-3xl" />
{program.image && (
  <div className="absolute inset-0">
    <Image
      src={program.image}
      alt={program.title}
      fill
      className="object-cover opacity-40"
      sizes="100vw"
      priority
    />
    <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary-dark/80 to-primary/80" />
  </div>
)}
        <div className="relative mx-auto max-w-4xl px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16">
          <span className="animate-fade-in mb-4 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-white/80">
            Program Detail
          </span>
          <h1 className="animate-slide-up text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            {program.title}
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 sm:py-20">
        <SlideIn>
          <DetailContent program={program} />
        </SlideIn>
      </section>

      {/* CTA */}
      <SlideIn direction="up">
        <section className="bg-primary py-16 text-center">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">Support Our Work</h2>
            <p className="mb-8 text-base text-white/70 sm:text-lg">
              Your support helps us continue these programs and reach more communities in need.
            </p>
            <Link
              href="/donate"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-primary shadow-xl transition-all duration-300 hover:translate-y-[-2px] hover:shadow-2xl"
            >
              <span>Donate Now</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </section>
      </SlideIn>
    </div>
  );
}
