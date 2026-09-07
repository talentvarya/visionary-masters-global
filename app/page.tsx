"use client";

import Link from "next/link";
import { ArrowRight, Bot, CalendarCheck, ClipboardList, MessageSquareText } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { languageFontClass } from "@/lib/i18n/translations";
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
          <p className="mx-auto mt-4 max-w-2xl text-sm text-white/65">
            Written and reviewed by <Link href="/about" className="font-semibold text-accent hover:text-accent-light">Vineet Grover</Link>, Founder &amp; Director, based on practical business and AI automation experience. <time dateTime="2026-09-07">Updated September 7, 2026</time>.
          </p>
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

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 text-center sm:grid-cols-3 sm:px-6 lg:px-8">
          {t.home.trustPoints.map((point) => (
            <div key={point.title}>
              <p className="font-bold text-navy">{point.title}</p>
              <p className="mt-1 text-sm text-slate-600">{point.body}</p>
            </div>
          ))}
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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">{t.home.processEyebrow}</p>
            <h2 className="mt-2 text-2xl font-bold text-navy sm:text-3xl">{t.home.processTitle}</h2>
            <p className="mt-3 text-slate-600">{t.home.processSubtitle}</p>
          </div>
          <ol className="mt-10 grid gap-5 md:grid-cols-4">
            {t.home.processSteps.map((step, index) => (
              <li key={step.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
                  {index + 1}
                </span>
                <h3 className="mt-4 font-bold text-navy">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden rounded-2xl bg-navy text-white lg:grid-cols-[1.05fr_0.95fr]">
          <div className="p-7 sm:p-10 lg:p-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">{t.home.exampleEyebrow}</p>
            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">{t.home.exampleTitle}</h2>
            <p className="mt-4 leading-relaxed text-white/80">{t.home.exampleBody}</p>
            <Link href="/contact" className="mt-7 inline-flex items-center gap-2 font-semibold text-accent hover:text-accent-light">
              {t.home.exampleCta} <ArrowRight size={17} />
            </Link>
          </div>
          <div className="grid gap-4 bg-white/5 p-7 sm:grid-cols-2 sm:p-10 lg:grid-cols-1 lg:p-12">
            {[
              { icon: MessageSquareText, text: t.home.exampleSteps[0] },
              { icon: CalendarCheck, text: t.home.exampleSteps[1] },
              { icon: ClipboardList, text: t.home.exampleSteps[2] },
              { icon: Bot, text: t.home.exampleSteps[3] },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-4">
                <Icon className="shrink-0 text-accent" size={21} />
                <p className="text-sm text-white/90">{text}</p>
              </div>
            ))}
          </div>
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

      <section className="border-y border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">Training &amp; Trust</p>
          <h2 className="mt-2 text-2xl font-bold text-navy">Practical AI skills backed by recognised training</h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">Vineet Grover combines 18 years of live-events experience with training in AI systems, autonomous workflows, office productivity and data analytics.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2 text-sm text-slate-700">
            {['AI Fundamentals & Ecosystem Mastery','AI Agents & Autonomous Systems (n8n)','AI Office & Productivity Specialist','AI-Powered Data Analytics Specialist'].map((item) => <span key={item} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2">{item}</span>)}
          </div>
          <Link href="/about" className="mt-6 inline-flex font-semibold text-navy hover:text-accent">View qualifications and experience <ArrowRight size={16} className="ml-1" /></Link>
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

      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-navy sm:text-3xl">Common questions</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 p-6"><h3 className="font-bold text-navy">What can you help me improve?</h3><p className="mt-2 text-sm leading-relaxed text-slate-600">I can improve customer calls, appointment handling, spreadsheet work, reporting, presentations, websites and marketing content. We start with the task that is slowing your team down.</p></div>
            <div className="rounded-xl border border-slate-200 p-6"><h3 className="font-bold text-navy">Do I need to change my current tools?</h3><p className="mt-2 text-sm leading-relaxed text-slate-600">Usually no. I connect with the tools you already use, such as Excel, Google Sheets, Power BI, forms and messaging apps, wherever the workflow allows it.</p></div>
            <div className="rounded-xl border border-slate-200 p-6"><h3 className="font-bold text-navy">How does a project begin?</h3><p className="mt-2 text-sm leading-relaxed text-slate-600">Send your requirement through the contact page. I will ask a few practical questions, outline the approach and confirm the scope before any build work starts.</p></div>
            <div className="rounded-xl border border-slate-200 p-6"><h3 className="font-bold text-navy">Can you support the solution after launch?</h3><p className="mt-2 text-sm leading-relaxed text-slate-600">Yes. Handover guidance and ongoing support can be included so your team can use the solution confidently and request improvements as your needs change.</p></div>
          </div>
        </div>
      </section>

      <section className="bg-navy py-16 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold sm:text-3xl">{t.home.finalCtaTitle}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/80">{t.home.finalCtaBody}</p>
          <Link
            href="/contact"
            className="mt-7 inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 font-semibold text-navy transition-colors hover:bg-accent-light"
          >
            {t.home.finalCtaButton} <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}



