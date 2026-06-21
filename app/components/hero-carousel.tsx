"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

interface Slide {
  subtitle: string;
  title: string;
  description: string;
  cta: { label: string; href: string };
  cta2: { label: string; href: string };
  image: string;
}

const slides: Slide[] = [
  {
    subtitle: "Welcome to",
    title: "Humanist Watch Salone",
    description:
      "Empowering communities, defending human rights, and building a better future for all Sierra Leoneans.",
    cta: { label: "Learn More", href: "/about" },
    cta2: { label: "Get Involved", href: "/contact" },
    image: "/h1.png",
  },
  {
    subtitle: "Our Mission",
    title: "Defending Rights, Transforming Lives",
    description:
      "We work tirelessly to promote and protect human rights across Sierra Leone through advocacy, education, and community action.",
    cta: { label: "Our Programs", href: "/programs" },
    cta2: { label: "Contact Us", href: "/contact" },
    image: "/h1.png",
  },
  {
    subtitle: "Get Involved",
    title: "Join Us in Making a Difference",
    description:
      "Whether you volunteer, donate, or partner with us, your support helps us create lasting change in communities across the nation.",
    cta: { label: "Donate Now", href: "/donate" },
    cta2: { label: "Volunteer", href: "/contact" },
    image: "/h1.png",
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  const goTo = useCallback((index: number) => {
    setCurrent(index);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/[0.03] via-white to-primary/[0.03]">
      {/* Abstract background shapes */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute left-1/3 top-1/4 h-48 w-48 rounded-full bg-primary/[0.02] blur-2xl" />

      <div className="mx-auto flex min-h-[90vh] max-w-7xl flex-col-reverse items-center gap-10 px-4 py-16 sm:px-6 lg:flex-row lg:gap-20 lg:py-0">
        {/* Text side */}
        <div className="flex w-full flex-1 flex-col items-center text-center lg:items-start lg:text-left">
          <div key={`text-${current}`}>
            <span
              className="animate-fade-in mb-4 inline-block rounded-full border border-primary/10 bg-primary/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-primary"
              style={{ animationFillMode: "both" }}
            >
              {slide.subtitle}
            </span>

            <h1
              className="animate-slide-up mb-5 text-4xl font-bold leading-[1.1] tracking-tight text-primary sm:text-5xl lg:text-6xl xl:text-7xl"
              style={{ animationDelay: "0.1s", animationFillMode: "both" }}
            >
              {slide.title}
            </h1>

            <p
              className="animate-slide-up mb-8 max-w-lg text-base leading-relaxed text-zinc-500 sm:text-lg"
              style={{ animationDelay: "0.2s", animationFillMode: "both" }}
            >
              {slide.description}
            </p>

            <div
              className="animate-slide-up flex flex-wrap justify-center gap-4 lg:justify-start"
              style={{ animationDelay: "0.3s", animationFillMode: "both" }}
            >
              <Link
                href={slide.cta.href}
                className="group inline-flex items-center gap-2 bg-primary px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:translate-y-[-2px] hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30"
              >
                <span>{slide.cta.label}</span>
                <svg
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href={slide.cta2.href}
                className="group inline-flex items-center gap-2 border-2 border-primary/15 px-7 py-3.5 text-sm font-bold text-primary transition-all duration-300 hover:border-primary/40 hover:bg-primary/5"
              >
                {slide.cta2.label}
              </Link>
            </div>
          </div>

          {/* Carousel dots */}
          <div className="mt-16 flex items-center gap-2.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`rounded-full transition-all duration-500 ${
                  i === current
                    ? "h-2.5 w-10 bg-primary"
                    : "h-2.5 w-2.5 bg-primary/25 hover:bg-primary/50"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Image side */}
        <div className="relative flex w-full flex-1 items-center justify-center" key={`img-${current}`}>
          <div className="animate-fade-in relative aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-2xl shadow-primary/10 lg:aspect-[3/4] lg:max-h-[70vh]">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover transition-transform duration-[10s] ease-out hover:scale-105"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>

          {/* Decorative frames */}
          <div className="absolute -bottom-3 -right-3 -z-10 h-full w-full rounded-3xl border-2 border-primary/10" />
          <div className="absolute -left-3 top-10 -z-10 h-32 w-32 rounded-full border-2 border-primary/10" />
        </div>
      </div>
    </section>
  );
}
