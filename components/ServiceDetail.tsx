"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { languageFontClass } from "@/lib/i18n/translations";

export default function ServiceDetail({ serviceId }: { serviceId: string }) {
  const { t, language } = useLanguage();
  const item = t.services.items.find((service) => service.id === serviceId);

  if (!item) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-navy">Service not found</h1>
        <Link href="/services" className="mt-6 inline-block font-semibold text-accent hover:text-navy">
          ← Back to services
        </Link>
      </div>
    );
  }

  return (
    <div className={languageFontClass[language]}>
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <Link href="/services" className="inline-flex items-center gap-2 text-sm text-white/75 hover:text-white">
            <ArrowLeft size={16} /> Back to Services &amp; Work
          </Link>
          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-accent">What I can build for you</p>
          <h1 className="mt-3 max-w-4xl text-3xl font-extrabold sm:text-5xl">{item.title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-white/80">{item.shortDescription}</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <div>
          <h2 className="text-2xl font-bold text-navy">{t.services.whatItIs}</h2>
          <p className="mt-4 leading-relaxed text-slate-600">{item.whatItIs}</p>

          <h2 className="mt-10 text-2xl font-bold text-navy">{t.services.whatsIncluded}</h2>
          <ul className="mt-4 space-y-3">
            {item.whatsIncluded.map((point) => (
              <li key={point} className="flex gap-3 text-slate-600">
                <CheckCircle2 className="mt-0.5 shrink-0 text-accent" size={19} />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <aside className="h-fit rounded-2xl bg-slate-50 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-navy">{t.services.outcome}</h2>
          <p className="mt-3 leading-relaxed text-slate-600">{item.outcome}</p>
          <Link
            href="/contact"
            className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-accent px-5 py-3 text-center font-bold text-navy transition hover:bg-white hover:ring-2 hover:ring-accent"
          >
            Discuss this project
          </Link>
        </aside>
      </section>
    </div>
  );
}
