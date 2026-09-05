"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { languageFontClass } from "@/lib/i18n/translations";
import { createClient } from "@/lib/supabase/client";
import ServiceCard from "@/components/ServiceCard";
import PortfolioCard from "@/components/PortfolioCard";
import type { PortfolioPost, ServiceImage } from "@/types/database";

export default function ServicesPage() {
  const { t, language } = useLanguage();
  const [posts, setPosts] = useState<PortfolioPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [aiImageFailed, setAiImageFailed] = useState(false);
  const [serviceImages, setServiceImages] = useState<Record<string, string>>({});

  useEffect(() => {
    const supabase = createClient();

    supabase
      .from("portfolio_posts")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setPosts(data ?? []);
        setLoadingPosts(false);
      });

    supabase
      .from("service_images")
      .select("*")
      .eq("is_active", true)
      .then(({ data }) => {
        const map: Record<string, string> = {};
        (data as ServiceImage[] | null)?.forEach((row) => {
          map[row.service_id] = row.image_url;
        });
        setServiceImages(map);
      });
  }, []);

  return (
    <div className={languageFontClass[language]}>
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-5xl px-4 py-14 text-center sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold sm:text-4xl">{t.services.sectionTitle}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/80">{t.services.sectionSubtitle}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {t.services.items.map((item) => (
            <ServiceCard key={item.id} item={item} watermarkUrl={serviceImages[item.id] ?? null} />
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-14">
        <div
          className={`mx-auto grid max-w-6xl items-center gap-8 px-4 sm:px-6 lg:px-8 ${
            aiImageFailed ? "" : "sm:grid-cols-2"
          }`}
        >
          <div className={aiImageFailed ? "mx-auto max-w-3xl text-center" : ""}>
            <h2 className="text-2xl font-bold text-navy">{t.services.aiCapabilitiesTitle}</h2>
            <p className="mt-4 leading-relaxed text-slate-600">{t.services.aiCapabilitiesBody}</p>
          </div>
          {/* Sample image is added to /public/images later — until then this
              collapses so the section stays centred instead of half empty. */}
          {!aiImageFailed && (
            <div className="relative h-64 w-full overflow-hidden rounded-xl bg-slate-200 sm:h-72">
              <Image
                src="/images/ai-image-generation-sample.png"
                alt="AI image generation sample"
                fill
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-cover"
                onError={() => setAiImageFailed(true)}
              />
            </div>
          )}
        </div>
      </section>

      {/* Our Work — same page as Services */}
      <section id="our-work" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-14 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-navy sm:text-3xl">{t.portfolio.pageTitle}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">{t.portfolio.sectionSubtitle}</p>
        </div>

        <div className="mt-10">
          {loadingPosts ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-72 animate-pulse rounded-xl bg-slate-100" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <p className="text-center text-slate-500">{t.portfolio.empty}</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PortfolioCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
