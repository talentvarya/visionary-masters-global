"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { languageFontClass } from "@/lib/i18n/translations";
import HomeSlides from "@/components/HomeSlides";
import UpdatesBanner from "@/components/UpdatesBanner";

export default function HomePage() {
  const { t, language } = useLanguage();
  const fontClass = languageFontClass[language];

  return (
    <div className={fontClass}>
      <section className="overflow-hidden bg-gradient-to-br from-navy via-navy to-navy-light text-white">
        <div className="mx-auto max-w-5xl px-4 pt-20 text-center sm:px-6 sm:pt-28 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">
            Visionary Masters Global Pvt Ltd
          </p>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-5xl">
            {t.home.heroTagline}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-white/80 sm:text-lg">
            {t.home.heroIntro}
          </p>
        </div>

        <div className="mt-10">
          <HomeSlides />
        </div>

        <div className="mx-auto max-w-5xl px-4 pb-20 pt-16 text-center sm:px-6 sm:pb-28 sm:pt-20 lg:px-8">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 text-base font-semibold text-navy hover:bg-accent-light transition-colors"
          >
            {t.home.ctaButton}
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <UpdatesBanner />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-navy sm:text-3xl">{t.home.servicesTeaser}</h2>
          <p className="mt-2 text-slate-600">{t.home.servicesTeaserSubtitle}</p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {t.services.items.slice(0, 4).map((item) => (
            <div key={item.id} className="rounded-lg border border-slate-200 p-5 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-navy">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600 line-clamp-3">{item.shortDescription}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/services" className="inline-flex items-center gap-1 font-semibold text-navy hover:text-accent">
            {t.home.viewAllServices} <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-navy sm:text-3xl">{t.home.aboutTeaser}</h2>
          <p className="mt-4 text-slate-600">{t.home.aboutTeaserBody}</p>
          <div className="mt-6">
            <Link href="/about" className="inline-flex items-center gap-1 font-semibold text-navy hover:text-accent">
              {t.home.learnMore} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-navy sm:text-3xl">{t.home.portfolioTeaser}</h2>
        <p className="mt-2 text-slate-600">{t.home.portfolioTeaserSubtitle}</p>
        <div className="mt-6">
          <Link
            href="/services#our-work"
            className="inline-flex items-center gap-2 rounded-md border border-navy px-6 py-3 font-semibold text-navy hover:bg-navy hover:text-white transition-colors"
          >
            {t.home.viewPortfolio} <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
