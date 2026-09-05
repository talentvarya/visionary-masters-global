"use client";

import { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { languageLabels, type Language } from "@/lib/i18n/translations";

const LANGUAGES: Language[] = ["en", "hi", "hinglish", "pa"];

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-md border border-white/20 px-3 py-1.5 text-sm text-white hover:bg-white/10 transition-colors"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Globe size={16} />
        <span>{languageLabels[language]}</span>
        <ChevronDown size={14} />
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 mt-2 w-40 overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg z-50"
        >
          {LANGUAGES.map((lang) => (
            <li key={lang}>
              <button
                role="option"
                aria-selected={language === lang}
                onClick={() => {
                  setLanguage(lang);
                  setOpen(false);
                }}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-navy/5 transition-colors ${
                  language === lang ? "bg-navy/10 font-semibold text-navy" : "text-slate-700"
                }`}
              >
                {languageLabels[lang]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
