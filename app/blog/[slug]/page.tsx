"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { use } from "react";
import SlideIn from "@/app/components/slide-in";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  image: string | null;
  publishedAt: string | null;
  createdAt: string;
};

function formatDate(date: string | null) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

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

export default function BlogDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/blog/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((data) => { setPost(data); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-white">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-white">
        <p className="text-zinc-400">Blog post not found.</p>
        <Link href="/blog" className="text-sm font-medium text-primary underline underline-offset-4">
          Back to Blog
        </Link>
      </div>
    );
  }

  const blocks = formatContent(post.content);

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-primary pt-20 sm:pt-24">
        <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/[0.03] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-white/[0.05] blur-3xl" />
        {post.image && (
          <div className="absolute inset-0">
            <Image
              src={post.image}
              alt={post.title}
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
            {formatDate(post.publishedAt ?? post.createdAt)}
          </span>
          <h1 className="animate-slide-up text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="animate-slide-up mt-4 max-w-2xl text-base text-white/70 sm:text-lg" style={{ animationDelay: "0.1s" }}>
              {post.excerpt}
            </p>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="py-16 sm:py-20">
        <SlideIn>
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="mb-8">
              <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-primary/60 transition-colors hover:text-primary">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Back to Blog
              </Link>
            </div>

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
        </SlideIn>
      </section>

      {/* CTA */}
      <SlideIn direction="up">
        <section className="bg-primary py-16 text-center">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">Stay Connected</h2>
            <p className="mb-8 text-base text-white/70 sm:text-lg">
              Follow our journey and be part of the change in communities across Sierra Leone.
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-primary shadow-xl transition-all duration-300 hover:translate-y-[-2px] hover:shadow-2xl"
            >
              <span>More News</span>
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
