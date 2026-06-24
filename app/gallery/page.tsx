"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

type GalleryImage = {
  id: string;
  url: string;
  alt: string | null;
  caption: string | null;
  order: number;
};

type Gallery = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  images: GalleryImage[];
};

export default function GalleryPage() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [lightbox, setLightbox] = useState<{ url: string; alt: string | null; caption: string | null } | null>(null);

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((data) => setGalleries(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (lightbox) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

  if (galleries.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-white pt-20">
        <p className="text-zinc-400">No gallery images available yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white pt-20 sm:pt-24">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-primary">
        <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/[0.03] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-white/[0.05] blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-4 pb-20 pt-12 text-center sm:px-6 sm:pb-28 sm:pt-16">
          <span className="animate-fade-in mb-4 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-white/80">
            Gallery
          </span>
          <h1 className="animate-slide-up mb-4 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Our Work in Photos
          </h1>
          <p className="animate-slide-up mx-auto max-w-2xl text-base text-white/70 sm:text-lg" style={{ animationDelay: "0.1s" }}>
            Browse through images from our programs, community outreach, and events across Sierra Leone.
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {galleries.map((gallery) => (
            <div key={gallery.id} className="mb-14 last:mb-0">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-primary sm:text-3xl">{gallery.title}</h2>
                {gallery.description && (
                  <p className="mt-1.5 text-sm text-zinc-500 sm:text-base">{gallery.description}</p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                {gallery.images.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setLightbox({ url: img.url, alt: img.alt, caption: img.caption })}
                    className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-zinc-100 shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
                  >
                    <Image
                      src={img.url}
                      alt={img.alt ?? "Gallery image"}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    {img.caption && (
                      <div className="absolute bottom-0 left-0 right-0 translate-y-2 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        <p className="text-sm font-medium text-white drop-shadow-lg">{img.caption}</p>
                      </div>
                    )}
                    <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 opacity-0 shadow-sm backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
                      <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white shadow-sm backdrop-blur transition-colors hover:bg-black/70"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="relative flex items-center justify-center bg-black/5">
              <Image
                src={lightbox.url}
                alt={lightbox.alt ?? "Gallery image"}
                width={1200}
                height={900}
                className="h-auto max-h-[80vh] w-full object-contain"
                style={{ objectFit: "contain" }}
              />
            </div>
            {lightbox.caption && (
              <div className="border-t border-primary/10 bg-white px-6 py-4">
                <p className="text-sm text-zinc-600">{lightbox.caption}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
