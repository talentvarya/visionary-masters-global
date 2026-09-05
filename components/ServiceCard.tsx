"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Mail,
  BarChart3,
  FileSpreadsheet,
  Table2,
  Presentation,
  Globe,
  Video,
  Workflow,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const ICONS: Record<string, LucideIcon> = {
  "email-communication": Mail,
  "powerbi-dashboards": BarChart3,
  "mis-reporting": FileSpreadsheet,
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

export default function ServiceCard({ item }: { item: ServiceItem }) {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const Icon = ICONS[item.id] ?? Mail;

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
      {item.image && (
        <div className="relative h-44 w-full bg-slate-100">
          <Image
            src={`/images/${item.image}`}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
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

        <h3 className="mt-4 text-lg font-bold text-navy">{item.title}</h3>
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
      </div>
    </div>
  );
}
