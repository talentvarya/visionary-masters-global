"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { translations, defaultLanguage, type Language, type Translations } from "./translations";
import { applyOverrides } from "./contentOverrides";
import { createClient } from "@/lib/supabase/client";

const STORAGE_KEY = "vmg-language";

type LanguageContextValue = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(defaultLanguage);
  const [hydrated, setHydrated] = useState(false);
  // Admin-edited copy, keyed by language then dotted content key. The JSON
  // files render immediately; overrides merge in once they arrive.
  const [overrides, setOverrides] = useState<Record<string, Record<string, string>>>({});

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Language | null;
    if (stored && translations[stored]) {
      setLanguageState(stored);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("site_content")
      .select("content_key, language, value")
      .then(({ data }) => {
        if (!data) return;
        const map: Record<string, Record<string, string>> = {};
        for (const row of data as { content_key: string; language: string; value: string }[]) {
          (map[row.language] ??= {})[row.content_key] = row.value;
        }
        setOverrides(map);
      });
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    window.localStorage.setItem(STORAGE_KEY, lang);
  };

  const activeLanguage = hydrated ? language : defaultLanguage;

  const value = useMemo<LanguageContextValue>(
    () => ({
      language: activeLanguage,
      setLanguage,
      t: applyOverrides(translations[activeLanguage], overrides[activeLanguage] ?? {}),
    }),
    [activeLanguage, overrides]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
