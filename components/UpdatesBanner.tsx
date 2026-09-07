"use client";

import { useEffect, useState } from "react";
import { Megaphone, Lightbulb } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { localized } from "@/lib/i18n/localized";
import type { SiteUpdate } from "@/types/database";

const SECONDS_PER_ITEM = 9;
const MIN_ITEMS_IN_TRACK = 6;


export default function UpdatesBanner() {
  const { t, language } = useLanguage();
  const [updates, setUpdates] = useState<SiteUpdate[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("site_updates")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(10)
      .then(({ data }) => setUpdates(data ?? []));
  }, []);

  if (updates.length === 0) return null;

  // Repeat the list so short lists still fill the strip, then duplicate it
  // so the marquee can loop seamlessly.
  const repeated: SiteUpdate[] = [];
  while (repeated.length < MIN_ITEMS_IN_TRACK) {
    repeated.push(...updates);
  }
  const track = [...repeated, ...repeated];

  return (
    <div className="w-full overflow-hidden border-y border-accent/30 bg-accent/15 py-5">
      <div
        className="flex w-max gap-10 animate-marquee hover:[animation-play-state:paused]"
        style={
          { "--marquee-duration": `${repeated.length * SECONDS_PER_ITEM}s` } as React.CSSProperties
        }
      >
        {track.map((update, i) => {
          const Icon = update.kind === "tip" ? Lightbulb : Megaphone;
          return (
            <div key={`${update.id}-${i}`} aria-hidden={i >= updates.length} className="flex shrink-0 items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-navy">
                <Icon size={18} />
              </span>
              <span className="rounded-full bg-navy px-3 py-1 text-sm font-semibold uppercase tracking-wide text-white">
                {update.kind === "tip" ? t.updates.tipLabel : t.updates.updateLabel}
              </span>
              <span className="whitespace-nowrap text-base font-medium text-navy">
                {localized(update, "message", language)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

