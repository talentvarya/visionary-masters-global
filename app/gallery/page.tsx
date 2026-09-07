"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { languageFontClass } from "@/lib/i18n/translations";
import type { GalleryImage } from "@/types/database";

export default function GalleryPage() {
  const { t, language } = useLanguage();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<GalleryImage | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("gallery_images")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setImages(data ?? []);
        setLoading(false);
      });
  }, []);

  // Escape closes the lightbox.
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  return (
    <div className={languageFontClass[language]}>
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-5xl px-4 py-14 text-center sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold sm:text-4xl">{t.gallery.pageTitle}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/80">{t.gallery.sectionSubtitle}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-[4/3] animate-pulse rounded-xl bg-slate-100" />
            ))}
          </div>
        ) : images.length === 0 ? (
          <p className="text-center text-slate-500">{t.gallery.empty}</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((image) => (
              <button
                key={image.id}
                onClick={() => setActive(image)}
                className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-100 shadow-sm transition-shadow hover:shadow-md"
              >
                <Image
                  src={image.image_url}
                  alt={image.caption ?? "Visionary Masters Global project gallery image"}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {image.caption && (
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/80 to-transparent p-3 text-left text-sm font-medium text-white">
                    {image.caption}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </section>

      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={() => setActive(null)}
            aria-label="Close"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <X size={22} />
          </button>
          <div className="relative max-h-[85vh] w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={active.image_url}
                alt={active.caption ?? "Visionary Masters Global project gallery image"}
                fill
                sizes="100vw"
                className="rounded-lg object-contain"
              />
            </div>
            {active.caption && (
              <p className="mt-3 text-center text-sm text-white/90">{active.caption}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
