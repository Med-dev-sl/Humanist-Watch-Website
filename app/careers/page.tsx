"use client";

import { useState, useEffect } from "react";

type Job = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  content: string | null;
  location: string | null;
  type: string;
  deadline: string | null;
  createdAt: string;
};

export default function CareersPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/jobs")
      .then((r) => r.json())
      .then((data) => setJobs(data))
      .catch(() => {});
  }, []);

  const typeBadge = (type: string) => {
    const colors: Record<string, string> = {
      "full-time": "bg-green-100 text-green-700",
      "part-time": "bg-blue-100 text-blue-700",
      contract: "bg-amber-100 text-amber-700",
      internship: "bg-purple-100 text-purple-700",
    };
    const labels: Record<string, string> = {
      "full-time": "Full Time",
      "part-time": "Part Time",
      contract: "Contract",
      internship: "Internship",
    };
    return (
      <span className={`rounded-full px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${colors[type] ?? "bg-zinc-100 text-zinc-700"}`}>
        {labels[type] ?? type}
      </span>
    );
  };

  return (
    <div className="bg-white pt-20 sm:pt-24">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-primary">
        <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/[0.03] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-white/[0.05] blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-4 pb-20 pt-12 text-center sm:px-6 sm:pb-28 sm:pt-16">
          <span className="animate-fade-in mb-4 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-white/80">
            Careers
          </span>
          <h1 className="animate-slide-up mb-4 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Join Our Team
          </h1>
          <p className="animate-slide-up mx-auto max-w-2xl text-base text-white/70 sm:text-lg" style={{ animationDelay: "0.1s" }}>
            Help us empower communities and defend rights across Sierra Leone. Explore current opportunities below.
          </p>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          {jobs.length === 0 ? (
            <div className="rounded-2xl border border-primary/10 bg-primary/[0.02] p-12 text-center">
              <svg className="mx-auto h-12 w-12 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
              </svg>
              <h3 className="mt-4 text-lg font-semibold text-primary">No Open Positions</h3>
              <p className="mt-1 text-sm text-zinc-500">There are no job openings at the moment. Check back later.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {jobs.map((job) => {
                const isOpen = expanded === job.id;
                return (
                  <div
                    key={job.id}
                    className="overflow-hidden rounded-xl border border-primary/10 bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
                  >
                    <button
                      onClick={() => setExpanded(isOpen ? null : job.id)}
                      className="flex w-full items-start justify-between gap-4 p-5 text-left sm:p-6"
                    >
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-bold text-primary sm:text-xl">{job.title}</h3>
                        <div className="mt-2 flex flex-wrap items-center gap-2.5">
                          {typeBadge(job.type)}
                          {job.location && (
                            <span className="flex items-center gap-1 text-xs text-zinc-500">
                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                              </svg>
                              {job.location}
                            </span>
                          )}
                          {job.deadline && (
                            <span className="flex items-center gap-1 text-xs text-zinc-500">
                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Deadline: {new Date(job.deadline).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                            </span>
                          )}
                        </div>
                        {job.description && (
                          <p className="mt-2 text-sm leading-relaxed text-zinc-500">{job.description}</p>
                        )}
                      </div>
                      <svg
                        className={`mt-1 h-5 w-5 flex-shrink-0 text-primary transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </button>
                    {isOpen && job.content && (
                      <div className="border-t border-primary/10 px-5 pb-5 pt-4 sm:px-6 sm:pb-6 sm:pt-4">
                        <div className="rounded-xl bg-primary/[0.03] p-4 sm:p-5">
                          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary/50">Full Description</h4>
                          <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-600 sm:text-base">{job.content}</p>
                        </div>
                        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <p className="text-xs text-zinc-400">
                            Posted {new Date(job.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                          </p>
                          <a
                            href={`mailto:careers@huwasal.com?subject=Application for ${encodeURIComponent(job.title)}`}
                            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:bg-primary-dark hover:shadow-xl"
                          >
                            Apply Now
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-primary/[0.02] via-white to-primary/[0.02] py-16 sm:py-20">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold text-primary sm:text-3xl">Don&apos;t See a Fit?</h2>
          <p className="mt-2 text-sm text-zinc-500 sm:text-base">
            We&apos;re always looking for passionate individuals. Send us your resume and we&apos;ll keep you in mind for future opportunities.
          </p>
          <a
            href="mailto:careers@huwasal.com"
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-white px-6 py-3 text-sm font-bold text-primary shadow-lg transition-all duration-300 hover:bg-primary hover:text-white hover:shadow-xl"
          >
            Send Open Application
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </a>
        </div>
      </section>
    </div>
  );
}
