"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import LoadingSpinner from "@/app/components/loading-spinner";

type Section = {
  id: string;
  title: string;
  content: string | null;
  image: string | null;
};

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
      trimmed.length < 80
    ) {
      if (current) blocks.push(current);
      current = { heading: trimmed, body: [] };
    } else if (
      trimmed.endsWith(":") &&
      trimmed.length < 80
    ) {
      if (current) blocks.push(current);
      current = { heading: trimmed.replace(":", ""), body: [] };
    } else {
      if (!current) {
        current = { heading: "", body: [] };
      }
      current.body.push(trimmed);
    }
  }
  if (current) blocks.push(current);

  if (blocks.length === 0) {
    blocks.push({ heading: "", body: lines });
  }

  return blocks;
}

function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rx = ((y - cy) / cy) * -8;
    const ry = ((x - cx) / cx) * 8;
    el.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02,1.02,1.02)`;
  };

  const handleMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-all duration-200 ease-out ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
}

function SectionImage({ src, alt }: { src: string | null; alt: string }) {
  if (!src) return null;
  return (
    <div className="relative h-64 w-full overflow-hidden rounded-2xl shadow-xl sm:h-80 lg:h-96">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-[8s] ease-out hover:scale-105"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
    </div>
  );
}

export default function AboutContent() {
  const [org, setOrg] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => { setOrg(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-white">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const sections: Section[] = [
    { id: "who-we-are", title: "Who We Are", content: org?.whoWeAre ?? null, image: org?.whoWeAreImage ?? null },
    { id: "mission", title: "Our Mission", content: org?.mission ?? null, image: org?.missionImage ?? null },
    { id: "vision", title: "Our Vision", content: org?.vision ?? null, image: org?.visionImage ?? null },
    { id: "history", title: "Our History", content: org?.history ?? null, image: org?.historyImage ?? null },
    { id: "what-we-do", title: "What We Do", content: org?.whatWeDo ?? null, image: org?.whatWeDoImage ?? null },
  ];

  const whoWeAreSection = sections.find((s) => s.id === "who-we-are");
  const missionSection = sections.find((s) => s.id === "mission");
  const visionSection = sections.find((s) => s.id === "vision");
  const historySection = sections.find((s) => s.id === "history");
  const whatWeDoSection = sections.find((s) => s.id === "what-we-do");

  const whoBlocks = formatContent(whoWeAreSection?.content ?? null);
  const missionBlocks = formatContent(missionSection?.content ?? null);
  const visionBlocks = formatContent(visionSection?.content ?? null);
  const historyBlocks = formatContent(historySection?.content ?? null);
  const whatBlocks = formatContent(whatWeDoSection?.content ?? null);

  return (
    <div className="bg-white">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-primary pt-20 sm:pt-24">
        <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/[0.03] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-white/[0.05] blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-4 pb-20 pt-12 text-center sm:px-6 sm:pb-28 sm:pt-16">
          <span className="animate-fade-in mb-4 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-white/80">
            About Us
          </span>
          <h1 className="animate-slide-up mb-4 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Know Us Better
          </h1>
          <p className="animate-slide-up mx-auto max-w-2xl text-base text-white/70 sm:text-lg" style={{ animationDelay: "0.1s" }}>
            Discover our journey, our mission, and the impact we create together in communities across Sierra Leone.
          </p>
        </div>
      </section>

      {/* Who We Are */}
      {whoBlocks.length > 0 && (
        <section className="relative overflow-hidden py-20 sm:py-28">
          <div className="pointer-events-none absolute -left-40 top-1/3 h-80 w-80 rounded-full bg-primary/[0.02] blur-3xl" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="order-2 lg:order-1">
                <span className="mb-4 inline-block rounded-full border border-primary/10 bg-primary/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-primary">
                  Who We Are
                </span>
                <div className="space-y-4">
                  {whoBlocks.map((block, i) => (
                    <div key={i} className="animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
                      {block.heading && (
                        <h2 className="mb-3 text-2xl font-bold text-primary sm:text-3xl">{block.heading}</h2>
                      )}
                      {block.body.map((p, j) => (
                        <p key={j} className="text-base leading-relaxed text-zinc-500">{p}</p>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <TiltCard>
                  <div className="relative overflow-hidden rounded-2xl shadow-2xl shadow-primary/10">
                    {whoWeAreSection?.image ? (
                      <Image
                        src={whoWeAreSection.image}
                        alt="Who We Are"
                        width={600}
                        height={700}
                        className="h-[400px] w-full object-cover sm:h-[500px] lg:h-[600px]"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="flex h-[400px] w-full items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 sm:h-[500px] lg:h-[600px]">
                        <div className="text-center" style={{ transform: "translateZ(30px)" }}>
                          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
                            <svg className="h-10 w-10 text-primary/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21m0 0h15M3 21h15" />
                            </svg>
                          </div>
                          <p className="text-sm font-medium text-primary/40">Photo coming soon</p>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6" style={{ transform: "translateZ(20px)" }}>
                      <div className="inline-block rounded-xl bg-white/90 px-4 py-2 backdrop-blur-sm">
                        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Est. 2003</p>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Mission & Vision */}
      {(missionBlocks.length > 0 || visionBlocks.length > 0) && (
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/[0.02] via-white to-primary/[0.02] py-20 sm:py-28">
          <div className="pointer-events-none absolute -right-40 -top-40 h-80 w-80 rounded-full bg-primary/[0.03] blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/[0.02] blur-3xl" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-14 text-center">
              <span className="mb-4 inline-block rounded-full border border-primary/10 bg-primary/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-primary">
                Our Purpose
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-5xl">
                Mission & Vision
              </h2>
            </div>
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
              {/* Mission Card */}
              {missionBlocks.length > 0 && (
                <TiltCard>
                  <div className="group relative h-full overflow-hidden rounded-2xl border border-primary/10 bg-white p-8 shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 sm:p-10">
                    <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/[0.03] blur-2xl transition-all duration-500 group-hover:scale-150" />
                    <div style={{ transform: "translateZ(20px)" }}>
                      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                        <svg className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                        </svg>
                      </div>
                      <h3 className="mb-4 text-2xl font-bold text-primary">Our Mission</h3>
                      <div className="space-y-3">
                        {missionBlocks.map((block, i) => (
                          <div key={i}>
                            {block.heading && (
                              <h4 className="mb-1 text-sm font-bold uppercase tracking-wider text-primary/60">{block.heading}</h4>
                            )}
                            {block.body.map((p, j) => (
                              <p key={j} className="text-base leading-relaxed text-zinc-500">{p}</p>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TiltCard>
              )}

              {/* Vision Card */}
              {visionBlocks.length > 0 && (
                <TiltCard>
                  <div className="group relative h-full overflow-hidden rounded-2xl border border-primary/10 bg-white p-8 shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 sm:p-10">
                    <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/[0.03] blur-2xl transition-all duration-500 group-hover:scale-150" />
                    <div style={{ transform: "translateZ(20px)" }}>
                      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                        <svg className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <h3 className="mb-4 text-2xl font-bold text-primary">Our Vision</h3>
                      <div className="space-y-3">
                        {visionBlocks.map((block, i) => (
                          <div key={i}>
                            {block.heading && (
                              <h4 className="mb-1 text-sm font-bold uppercase tracking-wider text-primary/60">{block.heading}</h4>
                            )}
                            {block.body.map((p, j) => (
                              <p key={j} className="text-base leading-relaxed text-zinc-500">{p}</p>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TiltCard>
              )}
            </div>
          </div>
        </section>
      )}

      {/* History */}
      {historyBlocks.length > 0 && (
        <section className="relative overflow-hidden py-20 sm:py-28">
          <div className="pointer-events-none absolute -top-40 left-1/3 h-80 w-80 rounded-full bg-primary/[0.02] blur-3xl" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <TiltCard>
                  <div className="relative overflow-hidden rounded-2xl shadow-2xl shadow-primary/10">
                    {historySection?.image ? (
                      <Image
                        src={historySection.image}
                        alt="Our History"
                        width={600}
                        height={500}
                        className="h-[350px] w-full object-cover sm:h-[450px]"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="flex h-[350px] w-full items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 sm:h-[450px]">
                        <div className="text-center" style={{ transform: "translateZ(30px)" }}>
                          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
                            <svg className="h-10 w-10 text-primary/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                            </svg>
                          </div>
                          <p className="text-sm font-medium text-primary/40">History photo coming soon</p>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6" style={{ transform: "translateZ(20px)" }}>
                      <div className="inline-block rounded-xl bg-white/90 px-4 py-2 backdrop-blur-sm">
                        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Our Journey</p>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </div>
              <div>
                <span className="mb-4 inline-block rounded-full border border-primary/10 bg-primary/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-primary">
                  Our History
                </span>
                <div className="space-y-4">
                  {historyBlocks.map((block, i) => (
                    <div key={i} className="animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
                      {block.heading && (
                        <h2 className="mb-3 text-2xl font-bold text-primary sm:text-3xl">{block.heading}</h2>
                      )}
                      {block.body.map((p, j) => (
                        <p key={j} className="text-base leading-relaxed text-zinc-500">{p}</p>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* What We Do */}
      {whatBlocks.length > 0 && (
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/[0.02] via-white to-primary/[0.02] py-20 sm:py-28">
          <div className="pointer-events-none absolute -left-40 -top-40 h-80 w-80 rounded-full bg-primary/[0.03] blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-primary/[0.02] blur-3xl" />

          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="mb-14 text-center">
              <span className="mb-4 inline-block rounded-full border border-primary/10 bg-primary/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-primary">
                Our Work
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-5xl">
                What We Do
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-zinc-500">
                HUWASAL works in highly deprived and mostly isolated communities with limited social infrastructures.
              </p>
            </div>

            <div className="space-y-6">
              {whatBlocks.map((block, i) => (
                <TiltCard key={i}>
                  <div className="group rounded-2xl border border-primary/10 bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 sm:p-10">
                    <div className="grid items-center gap-6 sm:grid-cols-[auto_1fr] sm:gap-8">
                      {!block.heading.toLowerCase().includes("huwasal") &&
                        !block.heading.toLowerCase().includes("who we are") &&
                        !block.heading.toLowerCase().includes("we are") &&
                        block.heading && (
                        <div
                          className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10"
                          style={{ transform: "translateZ(20px)" }}
                        >
                          <span className="text-lg font-bold text-primary">{String(i + 1).padStart(2, "0")}</span>
                        </div>
                      )}
                      <div style={{ transform: "translateZ(10px)" }}>
                        {block.heading && !block.heading.toLowerCase().includes("who we are") && !block.heading.toLowerCase().includes("we are") && (
                          <h3 className="mb-2 text-xl font-bold text-primary">{block.heading}</h3>
                        )}
                        {block.body.map((p, j) => (
                          <p key={j} className="text-base leading-relaxed text-zinc-500">{p}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </TiltCard>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="relative overflow-hidden bg-primary py-16 sm:py-20">
        <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/[0.03] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-white/[0.05] blur-3xl" />

        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">Join Us in Making a Difference</h2>
          <p className="mb-8 text-base text-white/70 sm:text-lg">
            Every helping hand can uplift marginalized communities and shape a better future for all.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/donate"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-primary shadow-xl transition-all duration-300 hover:translate-y-[-2px] hover:shadow-2xl"
            >
              <span>Donate Now</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 px-7 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:border-white/60 hover:bg-white/10"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
