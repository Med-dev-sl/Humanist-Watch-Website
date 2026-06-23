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

export default function EventsSection() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((data) => setEvents(data.slice(0, 4)))
      .catch(() => {});
  }, []);

  if (events.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/[0.02] via-white to-primary/[0.02] py-20 sm:py-28">
      <div className="pointer-events-none absolute -right-40 -top-40 h-80 w-80 rounded-full bg-primary/[0.03] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/[0.02] blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SlideIn>
          <div className="mb-14 text-center">
            <span className="mb-4 inline-block rounded-full border border-primary/10 bg-primary/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-primary">
              Events
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-5xl">
              Upcoming & Past Events
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-zinc-500">
              Stay connected with our community activities, workshops, and outreach programs.
            </p>
          </div>
        </SlideIn>

        <div className="flex flex-col items-stretch gap-5 sm:gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-4">
          {events.map((event, i) => (
            <TiltCard key={event.id}>
              <Link
                href={`/events/${event.slug}`}
                className="group block w-full border border-primary/10 bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary/10"
                style={{ animation: `slide-up 0.5s ease-out ${i * 0.1}s both` }}
              >
                {event.image ? (
                  <div className="relative h-44 w-full overflow-hidden">
                    <Image
                      src={event.image}
                      alt={event.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                  </div>
                ) : (
                  <div className="flex h-44 w-full items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
                    <svg className="h-10 w-10 text-primary/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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

                  <h3 className="mb-3 text-base sm:text-lg font-bold text-primary text-center sm:text-left">
                    {event.name}
                  </h3>

                  {event.description && (
                    <p className="text-sm leading-relaxed text-zinc-500 line-clamp-3 text-center sm:text-left">
                      {event.description}
                    </p>
                  )}

                  <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-primary opacity-0 transition-all duration-300 group-hover:opacity-100 justify-center sm:justify-start">
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

        <SlideIn direction="up">
          <div className="mt-10 text-center">
            <Link
              href="/events"
              className="group inline-flex items-center gap-2 bg-primary px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:translate-y-[-2px] hover:bg-primary-dark hover:shadow-xl"
            >
              <span>View All Events</span>
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
