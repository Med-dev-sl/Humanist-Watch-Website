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

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blog")
      .then((r) => r.json())
      .then((data) => { setPosts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-primary pt-20 sm:pt-24">
        <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/[0.03] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-white/[0.05] blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-4 pb-20 pt-12 text-center sm:px-6 sm:pb-28 sm:pt-16">
          <span className="animate-fade-in mb-4 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-white/80">
            Our Blog
          </span>
          <h1 className="animate-slide-up mb-4 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            News & Blogs
          </h1>
          <p className="animate-slide-up mx-auto max-w-2xl text-base text-white/70 sm:text-lg" style={{ animationDelay: "0.1s" }}>
            Stay informed with the latest updates, stories, and insights from HUWASAL.
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <SlideIn>
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
              </div>
            ) : posts.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-zinc-400">No blog posts published yet.</p>
              </div>
            ) : (
              <div className="flex flex-col items-stretch gap-6 sm:gap-8 md:grid md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group block w-full overflow-hidden rounded-2xl border border-primary/10 bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1"
                  >
                    {post.image && (
                      <div className="relative h-48 w-full overflow-hidden">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                    )}

                    <div className="p-5 sm:p-8">
                      <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-wider text-primary/50">
                        {formatDate(post.publishedAt ?? post.createdAt)}
                      </span>

                      <h2 className="mb-3 text-lg sm:text-xl font-bold text-primary group-hover:text-primary-dark transition-colors duration-300 text-center sm:text-left">
                        {post.title}
                      </h2>

                      {post.excerpt && (
                        <p className="text-sm leading-relaxed text-zinc-500 line-clamp-3 text-center sm:text-left">
                          {post.excerpt}
                        </p>
                      )}

                      <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-primary justify-center sm:justify-start">
                        <span>Read More</span>
                        <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </SlideIn>
    </div>
  );
}
