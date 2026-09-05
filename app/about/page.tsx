"use client";

import { Award, User } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { languageFontClass } from "@/lib/i18n/translations";

export default function AboutPage() {
  const { t, language } = useLanguage();

  return (
    <div className={languageFontClass[language]}>
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold sm:text-4xl">{t.about.pageTitle}</h1>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-navy">{t.about.overviewTitle}</h2>
        <p className="mt-4 leading-relaxed text-slate-700">{t.about.overviewBody}</p>
      </section>

      <section className="bg-slate-50 py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-navy text-white">
                <User size={20} />
              </span>
              <div>
                <h2 className="text-xl font-bold text-navy">{t.about.founderNoteTitle}</h2>
                <p className="text-sm text-slate-500">
                  {t.about.founderName} — {t.about.founderTitle}
                </p>
              </div>
            </div>
            <p className="mt-5 leading-relaxed text-slate-700">{t.about.founderNoteBody}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/20 text-accent">
            <Award size={20} />
          </span>
          <div>
            <h2 className="text-xl font-bold text-navy">{t.about.certificationsTitle}</h2>
            <p className="text-sm text-slate-500">{t.about.certificationsSubtitle}</p>
          </div>
        </div>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {t.about.certifications.map((cert, i) => (
            <li
              key={i}
              className="flex items-start gap-3 rounded-lg border border-slate-200 p-4 text-sm text-slate-700"
            >
              <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
              {cert}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
