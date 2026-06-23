"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
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

export default function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    fetch("/api/blog")
      .then((r) => r.json())
      .then((data) => setPosts(data.slice(0, 4)))
      .catch(() => {});
  }, []);

  if (posts.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/[0.02] via-white to-primary/[0.02] py-20 sm:py-28">
      <div className="pointer-events-none absolute -right-40 -top-40 h-80 w-80 rounded-full bg-primary/[0.03] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/[0.02] blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SlideIn>
          <div className="mb-14 text-center">
            <span className="mb-4 inline-block rounded-full border border-primary/10 bg-primary/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-primary">
              Our Blog
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-5xl">
              News & Updates
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-zinc-500">
              Latest stories, insights, and announcements from HUWASAL.
            </p>
          </div>
        </SlideIn>

        <div className="flex flex-col items-stretch gap-5 sm:gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-4">
          {posts.map((post, i) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group block w-full overflow-hidden rounded-2xl border border-primary/10 bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1"
              style={{ animation: `slide-up 0.5s ease-out ${i * 0.1}s both` }}
            >
              {post.image && (
                <div className="relative h-44 w-full overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                </div>
              )}

              <div className="p-5 sm:p-8">
                <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-wider text-primary/50">
                  {formatDate(post.publishedAt ?? post.createdAt)}
                </span>

                <h3 className="mb-3 text-base sm:text-lg font-bold text-primary group-hover:text-primary-dark transition-colors duration-300 text-center sm:text-left">
                  {post.title}
                </h3>

                {post.excerpt && (
                  <p className="text-sm leading-relaxed text-zinc-500 line-clamp-3 text-center sm:text-left">
                    {post.excerpt}
                  </p>
                )}

                <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-primary opacity-0 transition-all duration-300 group-hover:opacity-100 justify-center sm:justify-start">
                  <span>Read More</span>
                  <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <SlideIn direction="up">
          <div className="mt-10 text-center">
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 bg-primary px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:translate-y-[-2px] hover:bg-primary-dark hover:shadow-xl"
            >
              <span>View All News</span>
              <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </SlideIn>
      </div>
    </section>
  );
}
