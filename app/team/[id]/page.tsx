"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { use } from "react";
import SlideIn from "@/app/components/slide-in";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  image: string | null;
  email: string | null;
};

export default function MemberDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [member, setMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/team/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((data) => { setMember(data); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-white">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-white">
        <p className="text-zinc-400">Team member not found.</p>
        <Link href="/team" className="text-sm font-medium text-primary underline underline-offset-4">
          Back to Team
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
        {member.image && (
          <div className="absolute inset-0">
            <Image
              src={member.image}
              alt={member.name}
              fill
              className="object-cover opacity-30"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary-dark/80 to-primary/80" />
          </div>
        )}
        <div className="relative mx-auto max-w-4xl px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 text-center">
          <h1 className="animate-slide-up text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            {member.name}
          </h1>
          <p className="animate-slide-up mt-3 text-base font-semibold uppercase tracking-wider text-white/60" style={{ animationDelay: "0.05s" }}>
            {member.role}
          </p>
          {member.email && (
            <div className="animate-slide-up mt-4 flex items-center justify-center gap-2 text-white/50" style={{ animationDelay: "0.1s" }}>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              <a href={`mailto:${member.email}`} className="text-sm hover:text-white transition-colors">{member.email}</a>
            </div>
          )}
        </div>
      </section>

      {/* Bio */}
      <section className="py-16 sm:py-20">
        <SlideIn>
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="mb-8">
              <Link href="/team" className="inline-flex items-center gap-2 text-sm font-medium text-primary/60 transition-colors hover:text-primary">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Back to Team
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row gap-8">
              {member.image && (
                <div className="relative mx-auto sm:mx-0 h-56 w-56 flex-shrink-0 overflow-hidden rounded-xl shadow-lg">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="224px"
                  />
                </div>
              )}
              <div className="flex-1">
                <h2 className="mb-2 text-2xl font-bold text-primary">{member.name}</h2>
                <p className="mb-6 text-sm font-semibold uppercase tracking-wider text-primary/50">{member.role}</p>
                {member.email && (
                  <a href={`mailto:${member.email}`} className="mb-6 flex items-center gap-2 text-sm text-primary/60 hover:text-primary transition-colors">
                    <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                    {member.email}
                  </a>
                )}
                {member.bio ? (
                  <div className="prose prose-zinc max-w-none">
                    <p className="text-base leading-relaxed text-zinc-500 whitespace-pre-line">{member.bio}</p>
                  </div>
                ) : (
                  <p className="text-zinc-400">No biography available.</p>
                )}
              </div>
            </div>
          </div>
        </SlideIn>
      </section>

      {/* CTA */}
      <SlideIn direction="up">
        <section className="bg-primary py-16 text-center">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">Join Our Team</h2>
            <p className="mb-8 text-base text-white/70 sm:text-lg">
              Be part of a dedicated team working to create lasting change in communities across Sierra Leone.
            </p>
            <Link
              href="/team"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-primary shadow-xl transition-all duration-300 hover:translate-y-[-2px] hover:shadow-2xl"
            >
              <span>Meet the Team</span>
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
