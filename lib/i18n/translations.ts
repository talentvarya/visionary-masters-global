import en from "@/locales/en.json";
import hi from "@/locales/hi.json";
import hinglish from "@/locales/hinglish.json";
import pa from "@/locales/pa.json";

export type Language = "en" | "hi" | "hinglish" | "pa";

export type Translations = typeof en;

export const translations: Record<Language, Translations> = {
  en,
  hi,
  hinglish,
  pa,
};

export const languageLabels: Record<Language, string> = {
  en: "English",
  hi: "हिन्दी",
  hinglish: "Hinglish",
  pa: "ਪੰਜਾਬੀ",
};

export const languageFontClass: Record<Language, string> = {
  en: "font-sans",
  hi: "font-devanagari",
  hinglish: "font-sans",
  pa: "font-gurmukhi",
};

export const defaultLanguage: Language = "en";
