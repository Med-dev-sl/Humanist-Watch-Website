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

export default function TeamSection() {
  const [members, setMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    fetch("/api/team")
      .then((r) => r.json())
      .then((data) => setMembers(data.slice(0, 4)))
      .catch(() => {});
  }, []);

  if (members.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/[0.02] via-white to-primary/[0.02] py-20 sm:py-28">
      <div className="pointer-events-none absolute -right-40 -top-40 h-80 w-80 rounded-full bg-primary/[0.03] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/[0.02] blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SlideIn>
          <div className="mb-14 text-center">
            <span className="mb-4 inline-block rounded-full border border-primary/10 bg-primary/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-primary">
              Our Team
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-5xl">
              Meet Our Team
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-zinc-500">
              Dedicated individuals working tirelessly to empower communities across Sierra Leone.
            </p>
          </div>
        </SlideIn>

        <div className="flex flex-col items-stretch gap-5 sm:gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-4">
          {members.map((member, i) => (
            <TiltCard key={member.id}>
              <Link
                href={`/team/${member.id}`}
                className="group block w-full border border-primary/10 bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary/10"
                style={{ animation: `slide-up 0.5s ease-out ${i * 0.1}s both` }}
              >
                {member.image ? (
                  <div className="relative h-56 w-full overflow-hidden">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                  </div>
                ) : (
                  <div className="flex h-56 w-full items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
                    <svg className="h-14 w-14 text-primary/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                )}
                <div className="p-5 sm:p-8 text-center" style={{ transform: "translateZ(20px)" }}>
                  <h3 className="mb-1 text-base sm:text-lg font-bold text-primary">
                    {member.name}
                  </h3>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary/50">
                    {member.role}
                  </p>
                  {member.bio && (
                    <p className="text-sm leading-relaxed text-zinc-500 line-clamp-2">
                      {member.bio}
                    </p>
                  )}
                  <div className="mt-4 flex items-center justify-center gap-1 text-sm font-semibold text-primary opacity-0 transition-all duration-300 group-hover:opacity-100">
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

        <SlideIn direction="up">
          <div className="mt-10 text-center">
            <Link
              href="/team"
              className="group inline-flex items-center gap-2 bg-primary px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:translate-y-[-2px] hover:bg-primary-dark hover:shadow-xl"
            >
              <span>View Full Team</span>
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
