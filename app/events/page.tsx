"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import SlideIn from "@/app/components/slide-in";
import TiltCard from "@/app/components/tilt-card";

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

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((data) => { setEvents(data); setLoading(false); })
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
            Events
          </span>
          <h1 className="animate-slide-up mb-4 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Events & Activities
          </h1>
          <p className="animate-slide-up mx-auto max-w-2xl text-base text-white/70 sm:text-lg" style={{ animationDelay: "0.1s" }}>
            Discover our community events, workshops, and outreach activities across Sierra Leone.
          </p>
        </div>
      </section>

      {/* Events Grid */}
      <SlideIn>
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
              </div>
            ) : events.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-zinc-400">No events published yet.</p>
              </div>
            ) : (
              <div className="flex flex-col items-stretch gap-6 sm:gap-8 md:grid md:grid-cols-2 lg:grid-cols-3">
                {events.map((event, i) => (
                  <TiltCard key={event.id}>
                    <Link
                      href={`/events/${event.slug}`}
                      className="group block w-full border border-primary/10 bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary/10"
                      style={{ animation: `slide-up 0.5s ease-out ${i * 0.08}s both` }}
                    >
                      {event.image ? (
                        <div className="relative h-48 w-full overflow-hidden">
                          <Image
                            src={event.image}
                            alt={event.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        </div>
                      ) : (
                        <div className="flex h-48 w-full items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
                          <svg className="h-12 w-12 text-primary/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                          </svg>
                        </div>
                      )}

                      <div className="p-5 sm:p-8" style={{ transform: "translateZ(20px)" }}>
                        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary/50">
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                          </svg>
                          {formatDate(event.date ?? event.createdAt)}
                        </div>

                        {event.location && (
                          <div className="mb-2 flex items-center gap-1.5 text-xs text-primary/40">
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                            </svg>
                            {event.location}
                          </div>
                        )}

                        <h2 className="mb-3 text-lg sm:text-xl font-bold text-primary group-hover:text-primary-dark transition-colors duration-300 text-center sm:text-left">
                          {event.name}
                        </h2>

                        {event.description && (
                          <p className="text-sm leading-relaxed text-zinc-500 line-clamp-3 text-center sm:text-left">
                            {event.description}
                          </p>
                        )}

                        <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-primary justify-center sm:justify-start">
                          <span>View Event</span>
                          <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  </TiltCard>
                ))}
              </div>
            )}
          </div>
        </section>
      </SlideIn>
    </div>
  );
}
