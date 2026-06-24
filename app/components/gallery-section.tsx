"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import SlideIn from "@/app/components/slide-in";

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
  coverImage: string | null;
  images: GalleryImage[];
};

export default function GallerySection() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((data) => setGalleries(data))
      .catch(() => {});
  }, []);

  const allImages = galleries.flatMap((g) => g.images);
  const featured = allImages.slice(0, 4);

  if (galleries.length === 0 || featured.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SlideIn>
          <div className="mb-10 text-center">
            <span className="mb-4 inline-block rounded-full border border-primary/10 bg-primary/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-primary">
              Gallery
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-5xl">
              Our Work in Photos
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-zinc-500">
              A glimpse into our programs and the communities we serve across Sierra Leone.
            </p>
          </div>
        </SlideIn>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
          {featured.map((img, i) => (
            <div
              key={img.id}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-zinc-100 shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
            >
              <Image
                src={img.url}
                alt={img.alt ?? "Gallery image"}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              {img.caption && (
                <div className="absolute bottom-0 left-0 right-0 translate-y-2 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="text-sm font-medium text-white drop-shadow-lg">
                    {img.caption}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {allImages.length > 4 && (
          <div className="mt-8 text-center">
            <Link
              href="/gallery"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-dark px-8 py-3 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary/25"
            >
              View Full Gallery
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
