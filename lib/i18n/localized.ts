import type { Language } from "./translations";

/**
 * Picks the right language column off an admin-authored row.
 *
 * Admin content is stored with the English text in the base column (e.g.
 * `title`) and optional translations alongside it (`title_hi`, `title_hinglish`,
 * `title_pa`). A blank translation falls back to English, so the site never
 * shows an empty card just because one language wasn't filled in.
 */
export function localized<T extends Record<string, unknown>>(
  row: T,
  field: string,
  language: Language
): string | null {
  const english = (row[field] as string | null) ?? null;

  if (language === "en") return english;

  const translated = row[`${field}_${language}`] as string | null | undefined;
  const trimmed = typeof translated === "string" ? translated.trim() : "";

  return trimmed.length > 0 ? trimmed : english;
}
