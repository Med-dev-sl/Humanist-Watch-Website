"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { use } from "react";
import SlideIn from "@/app/components/slide-in";

type Event = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  location: string | null;
  date: string | null;
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

export default function EventDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/events/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((data) => { setEvent(data); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-white">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-white">
        <p className="text-zinc-400">Event not found.</p>
        <Link href="/events" className="text-sm font-medium text-primary underline underline-offset-4">
          Back to Events
        </Link>
      </div>
    );
  }

  const isPast = event.date ? new Date(event.date) < new Date() : false;

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-primary pt-20 sm:pt-24">
        <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/[0.03] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-white/[0.05] blur-3xl" />
        {event.image && (
          <div className="absolute inset-0">
            <Image
              src={event.image}
              alt={event.name}
              fill
              className="object-cover opacity-40"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary-dark/80 to-primary/80" />
          </div>
        )}
        <div className="relative mx-auto max-w-4xl px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="animate-fade-in inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-white/80">
              {formatDate(event.date ?? event.createdAt)}
            </span>
            {isPast && (
              <span className="animate-fade-in inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-white/50" style={{ animationDelay: "0.05s" }}>
                Past Event
              </span>
            )}
          </div>
          <h1 className="animate-slide-up text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            {event.name}
          </h1>
          {event.location && (
            <div className="animate-slide-up mt-4 flex items-center gap-2 text-white/60" style={{ animationDelay: "0.1s" }}>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              <span className="text-sm sm:text-base">{event.location}</span>
            </div>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="py-16 sm:py-20">
        <SlideIn>
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="mb-8">
              <Link href="/events" className="inline-flex items-center gap-2 text-sm font-medium text-primary/60 transition-colors hover:text-primary">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Back to Events
              </Link>
            </div>

            {event.description ? (
              <div className="prose prose-zinc max-w-none">
                <p className="text-base leading-relaxed text-zinc-500 whitespace-pre-line">
                  {event.description}
                </p>
              </div>
            ) : (
              <p className="text-zinc-400">No additional details available.</p>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-4 rounded-xl border border-primary/10 bg-primary/[0.02] p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-zinc-400">Date</p>
                  <p className="text-sm font-semibold text-primary">{formatDate(event.date ?? event.createdAt)}</p>
                </div>
              </div>
              {event.location && (
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400">Location</p>
                    <p className="text-sm font-semibold text-primary">{event.location}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </SlideIn>
      </section>

      {/* CTA */}
      <SlideIn direction="up">
        <section className="bg-primary py-16 text-center">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">Join Our Events</h2>
            <p className="mb-8 text-base text-white/70 sm:text-lg">
              Be part of our community initiatives and help create lasting change.
            </p>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-primary shadow-xl transition-all duration-300 hover:translate-y-[-2px] hover:shadow-2xl"
            >
              <span>View All Events</span>
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
