"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Linkedin, Newspaper, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { localized } from "@/lib/i18n/localized";
import { ClaudeIcon, OpenAIIcon } from "@/components/BrandIcons";
import type { HomeSlide, SlideTopic, TextSize, FontChoice } from "@/types/database";

const SECONDS_PER_SLIDE = 6;
const MIN_SLIDES_IN_TRACK = 5;

type IconComponent = (props: { size?: number; className?: string }) => JSX.Element;

const TOPIC_STYLES: Record<
  SlideTopic,
  { label: string; icon: IconComponent; chip: string; ring: string }
> = {
  claude: {
    label: "Claude",
    icon: ClaudeIcon,
    chip: "bg-[#D97757] text-white",
    ring: "ring-[#D97757]/40",
  },
  chatgpt: {
    label: "ChatGPT",
    icon: OpenAIIcon,
    chip: "bg-[#10A37F] text-white",
    ring: "ring-[#10A37F]/40",
  },
  linkedin: {
    label: "LinkedIn",
    icon: Linkedin as IconComponent,
    chip: "bg-[#0A66C2] text-white",
    ring: "ring-[#0A66C2]/40",
  },
  news: {
    label: "News",
    icon: Newspaper as IconComponent,
    chip: "bg-accent text-navy",
    ring: "ring-accent/40",
  },
};

const TITLE_SIZES: Record<TextSize, string> = {
  small: "text-xs",
  medium: "text-sm",
  large: "text-base",
};

const BODY_SIZES: Record<TextSize, string> = {
  small: "text-[11px]",
  medium: "text-xs",
  large: "text-sm",
};

const FONTS: Record<FontChoice, string> = {
  sans: "",
  serif: "font-serif",
  mono: "font-mono",
};

function SlideCard({ slide }: { slide: HomeSlide }) {
  const { language } = useLanguage();
  const style = TOPIC_STYLES[slide.topic] ?? TOPIC_STYLES.news;
  const Icon = style.icon;
  const title = localized(slide, "title", language);
  const body = localized(slide, "body", language);
  const fitClass = slide.image_fit === "cover" ? "object-cover" : "object-contain";
  const titleClass = `${TITLE_SIZES[slide.title_size] ?? TITLE_SIZES.medium} ${
    FONTS[slide.title_font] ?? ""
  }`;
  const bodyClass = `${BODY_SIZES[slide.body_size] ?? BODY_SIZES.medium} ${
    FONTS[slide.body_font] ?? ""
  }`;

  // Screenshot mode: the image is the whole card — no title/description text
  // laid over it, and shown uncropped so small on-screen text stays readable.
  // Screenshots arrive in every shape (wide chat windows, tall phone grabs), so
  // a blurred copy of the image fills whatever the contained image doesn't —
  // otherwise a portrait shot leaves ugly blank slabs down both sides.
  if (slide.image_only && slide.image_url) {
    const screenshot = (
      <div
        className={`relative h-full overflow-hidden rounded-xl bg-slate-900 shadow-lg ring-1 ${style.ring} transition-transform hover:scale-[1.02]`}
      >
        <Image
          src={slide.image_url}
          alt=""
          aria-hidden="true"
          fill
          sizes="(max-width: 640px) 80vw, 28vw"
          className="scale-110 object-cover opacity-40 blur-xl"
        />
        <span
          className={`absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${style.chip}`}
        >
          <Icon size={12} />
          {style.label}
        </span>
        <Image
          src={slide.image_url}
          alt={title ?? style.label}
          fill
          sizes="(max-width: 640px) 80vw, 28vw"
          className={`${fitClass} ${slide.image_fit === "cover" ? "" : "p-2"}`}
        />
      </div>
    );

    return slide.link_url ? (
      <a href={slide.link_url} target="_blank" rel="noopener noreferrer" className="block h-full">
        {screenshot}
      </a>
    ) : (
      screenshot
    );
  }

  const inner = (
    <div
      className={`flex h-full flex-col overflow-hidden rounded-xl bg-white/95 text-left shadow-lg ring-1 ${style.ring} transition-transform hover:scale-[1.02]`}
    >
      {slide.image_url && (
        <div className="relative h-36 w-full shrink-0 bg-slate-100">
          <Image
            src={slide.image_url}
            alt=""
            fill
            sizes="(max-width: 640px) 80vw, 28vw"
            className={fitClass}
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-4">
        <span
          className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${style.chip}`}
        >
          <Icon size={12} />
          {style.label}
        </span>
        <h3 className={`mt-2.5 line-clamp-2 font-bold text-navy ${titleClass}`}>{title}</h3>
        {body && (
          <p className={`mt-1.5 line-clamp-3 leading-relaxed text-slate-600 ${bodyClass}`}>{body}</p>
        )}
        {slide.link_url && (
          <span className="mt-auto flex items-center gap-1 pt-2.5 text-xs font-semibold text-navy">
            Read more <ExternalLink size={11} />
          </span>
        )}
      </div>
    </div>
  );

  if (slide.link_url) {
    return (
      <a href={slide.link_url} target="_blank" rel="noopener noreferrer" className="block h-full">
        {inner}
      </a>
    );
  }

  return inner;
}

export default function HomeSlides() {
  const [slides, setSlides] = useState<HomeSlide[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("home_slides")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(12)
      .then(({ data }) => setSlides(data ?? []));
  }, []);

  if (slides.length === 0) return null;

  // Repeat so short lists fill the strip, then duplicate for a seamless loop.
  const repeated: HomeSlide[] = [];
  while (repeated.length < MIN_SLIDES_IN_TRACK) {
    repeated.push(...slides);
  }
  const track = [...repeated, ...repeated];

  return (
    <div className="w-full overflow-hidden py-2">
      <div
        className="flex w-max items-stretch gap-4 animate-marquee hover:[animation-play-state:paused]"
        style={
          { "--marquee-duration": `${repeated.length * SECONDS_PER_SLIDE}s` } as React.CSSProperties
        }
      >
        {track.map((slide, i) => (
          // Every card is the same size — text and screenshot alike — so the
          // strip reads as one even row rather than a jumble of heights.
          <div
            key={`${slide.id}-${i}`}
            className="h-72 w-[80vw] shrink-0 sm:h-80 sm:w-[48vw] lg:w-[28vw]"
          >
            <SlideCard slide={slide} />
          </div>
        ))}
      </div>
    </div>
  );
}
