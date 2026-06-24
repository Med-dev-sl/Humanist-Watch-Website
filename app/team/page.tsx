"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import SlideIn from "@/app/components/slide-in";
import TiltCard from "@/app/components/tilt-card";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  image: string | null;
  email: string | null;
};

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/team")
      .then((r) => r.json())
      .then((data) => { setMembers(data); setLoading(false); })
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
            Our People
          </span>
          <h1 className="animate-slide-up mb-4 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Meet Our Team
          </h1>
          <p className="animate-slide-up mx-auto max-w-2xl text-base text-white/70 sm:text-lg" style={{ animationDelay: "0.1s" }}>
            Dedicated individuals working together to empower communities and drive positive change across Sierra Leone.
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <SlideIn>
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
              </div>
            ) : members.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-zinc-400">No team members published yet.</p>
              </div>
            ) : (
              <div className="flex flex-col items-stretch gap-6 sm:gap-8 md:grid md:grid-cols-2 lg:grid-cols-3">
                {members.map((member, i) => (
                  <TiltCard key={member.id}>
                    <Link
                      href={`/team/${member.id}`}
                      className="group block w-full border border-primary/10 bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary/10"
                      style={{ animation: `slide-up 0.5s ease-out ${i * 0.08}s both` }}
                    >
                      {member.image ? (
                        <div className="relative h-56 w-full overflow-hidden">
                          <Image
                            src={member.image}
                            alt={member.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        </div>
                      ) : (
                        <div className="flex h-56 w-full items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
                          <svg className="h-16 w-16 text-primary/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                          </svg>
                        </div>
                      )}
                      <div className="p-5 sm:p-8 text-center" style={{ transform: "translateZ(20px)" }}>
                        <h2 className="mb-1 text-lg sm:text-xl font-bold text-primary group-hover:text-primary-dark transition-colors duration-300">
                          {member.name}
                        </h2>
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary/50">
                          {member.role}
                        </p>
                        {member.bio && (
                          <p className="text-sm leading-relaxed text-zinc-500 line-clamp-2">
                            {member.bio}
                          </p>
                        )}
                        <div className="mt-4 flex items-center justify-center gap-1 text-sm font-semibold text-primary">
                          <span>View Profile</span>
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
