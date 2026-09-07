"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  BarChart3,
  Table2,
  Presentation,
  Globe,
  Video,
  Workflow,
  PhoneCall,
  FileText,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const ICONS: Record<string, LucideIcon> = {
  "email-communication": PhoneCall,
  "powerbi-dashboards": BarChart3,
  "mis-reporting": FileText,
  "excel-solutions": Table2,
  presentations: Presentation,
  "simple-websites": Globe,
  "ai-video-generation": Video,
  "workflow-automation": Workflow,
};

type ServiceItem = {
  id: string;
  title: string;
  shortDescription: string;
  image: string | null;
  badge?: string;
  whatItIs: string;
  whatsIncluded: string[];
  outcome: string;
};

export default function ServiceCard({
  item,
  watermarkUrl,
}: {
  item: ServiceItem;
  /** Uploaded from the admin; falls back to the sample file in /public/images. */
  watermarkUrl?: string | null;
}) {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  // The /public/images sample files may not exist yet — drop the watermark on
  // load failure rather than showing a broken image.
  const [imageFailed, setImageFailed] = useState(false);
  const Icon = ICONS[item.id] ?? Mail;

  const imageSrc = watermarkUrl ?? (item.image ? `/images/${item.image}` : null);
  const showWatermark = Boolean(imageSrc) && !imageFailed;

  return (
    <div className="relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
      {showWatermark && imageSrc && (
        // Watermark: a faint full-bleed wash behind the card, with a white
        // gradient over it so the text keeps its contrast.
        <div className="pointer-events-none absolute inset-0 select-none" aria-hidden="true">
          <Image
            src={imageSrc}
            alt={`${item.title} example`}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover opacity-30"
            onError={() => setImageFailed(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-white/85 via-white/60 to-white/40" />
        </div>
      )}

      <div className="relative flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy/10 text-navy">
            <Icon size={20} />
          </span>
          {item.badge && (
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-navy">
              {t.services.launchingSoon}
            </span>
          )}
        </div>

        <h3 className="mt-4 text-lg font-bold text-navy">
          <Link href={`/services/${item.id}`} className="hover:text-accent">
            {item.title}
          </Link>
        </h3>
        <p className="mt-2 text-sm text-slate-600">{item.shortDescription}</p>

        <button
          onClick={() => setExpanded((e) => !e)}
          className="mt-4 flex items-center gap-1 self-start text-sm font-semibold text-navy hover:text-accent"
        >
          {expanded ? t.services.readLess : t.services.readMore}
          <ChevronDown size={16} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>

        {expanded && (
          <div className="mt-4 space-y-4 border-t border-slate-100 pt-4 text-sm">
            <div>
              <h4 className="font-semibold text-navy">{t.services.whatItIs}</h4>
              <p className="mt-1 text-slate-600">{item.whatItIs}</p>
            </div>
            <div>
              <h4 className="font-semibold text-navy">{t.services.whatsIncluded}</h4>
              <ul className="mt-1 list-disc space-y-1 pl-4 text-slate-600">
                {item.whatsIncluded.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-navy">{t.services.outcome}</h4>
              <p className="mt-1 text-slate-600">{item.outcome}</p>
            </div>
          </div>
        )}

        <Link
          href={`/services/${item.id}`}
          className="mt-5 inline-flex items-center text-sm font-semibold text-accent hover:text-navy"
        >
          View full service →
        </Link>
      </div>
    </div>
  );
}

