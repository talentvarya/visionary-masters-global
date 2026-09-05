"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Search, RotateCcw, Save } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { flattenContent } from "@/lib/i18n/contentOverrides";
import { translations, languageLabels, type Language } from "@/lib/i18n/translations";

const LANGUAGES: Language[] = ["en", "hi", "hinglish", "pa"];

/**
 * Internal keys, not visible copy: `id` links a service to its icon and its
 * uploaded image, `image` is a filename, `badge` flags the "launching soon"
 * marker. Editing them would break the page, so they're kept out of the editor.
 */
const NON_EDITABLE = /\.(id|image|badge)$/;

// Friendly names for the top-level groups in the locale files.
const SECTION_LABELS: Record<string, string> = {
  seo: "SEO (page title & description)",
  nav: "Menu",
  home: "Home page",
  about: "About Us page",
  services: "Services & Work page",
  portfolio: "Our Work section",
  gallery: "Gallery page",
  clients: "Our Clients page",
  contact: "Contact page",
  updates: "Updates banner labels",
  footer: "Footer",
};

/** "services.items.1.whatsIncluded.2" -> "Services item 2 › whats included › 3" */
function humanKey(key: string) {
  return key
    .split(".")
    .slice(1)
    .map((part) => {
      if (/^\d+$/.test(part)) return `#${Number(part) + 1}`;
      return part
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (c) => c.toUpperCase())
        .trim();
    })
    .join(" › ");
}

export default function SiteTextManager() {
  const [language, setLanguage] = useState<Language>("en");
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Defaults straight from the locale file for the selected language.
  const defaults = useMemo(() => {
    const all = flattenContent(translations[language] as never);
    return Object.fromEntries(Object.entries(all).filter(([key]) => !NON_EDITABLE.test(key)));
  }, [language]);

  const sections = useMemo(() => {
    const grouped: Record<string, string[]> = {};
    for (const key of Object.keys(defaults)) {
      const section = key.split(".")[0];
      (grouped[section] ??= []).push(key);
    }
    return grouped;
  }, [defaults]);

  async function loadOverrides(lang: Language) {
    const supabase = createClient();
    const { data } = await supabase
      .from("site_content")
      .select("content_key, value")
      .eq("language", lang);

    const map: Record<string, string> = {};
    (data as { content_key: string; value: string }[] | null)?.forEach((row) => {
      map[row.content_key] = row.value;
    });
    setOverrides(map);
    setDrafts({});
  }

  useEffect(() => {
    loadOverrides(language);
  }, [language]);

  const dirtyKeys = Object.keys(drafts).filter(
    (key) => drafts[key] !== (overrides[key] ?? defaults[key])
  );

  async function handleSave() {
    if (dirtyKeys.length === 0) return;
    setSaving(true);
    setMessage(null);

    try {
      const supabase = createClient();
      const rows = dirtyKeys.map((key) => ({
        content_key: key,
        language,
        value: drafts[key],
        updated_at: new Date().toISOString(),
      }));

      const { error } = await supabase.from("site_content").upsert(rows);
      if (error) throw error;

      setMessage(`Saved ${rows.length} change${rows.length === 1 ? "" : "s"}.`);
      loadOverrides(language);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not save");
    } finally {
      setSaving(false);
    }
  }

  async function handleReset(key: string) {
    const supabase = createClient();
    await supabase.from("site_content").delete().eq("content_key", key).eq("language", language);
    setDrafts((d) => {
      const next = { ...d };
      delete next[key];
      return next;
    });
    loadOverrides(language);
  }

  const query = search.trim().toLowerCase();

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-navy">Site Text</h2>
      <p className="mt-1 text-sm text-slate-500">
        Every fixed line of copy on the public site — headings, service descriptions, menu labels,
        footer, SEO title. Edit here and it changes on the site; leave a box untouched and the
        original wording stays. Each language is edited separately.
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>
              {languageLabels[lang]}
            </option>
          ))}
        </select>

        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search the text you want to change..."
            className="w-full rounded-md border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
          />
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving || dirtyKeys.length === 0}
          className="inline-flex items-center gap-2 rounded-md bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-light disabled:opacity-50"
        >
          <Save size={15} />
          {saving ? "Saving..." : dirtyKeys.length > 0 ? `Save ${dirtyKeys.length}` : "Save"}
        </button>
      </div>

      {message && (
        <p className="mt-3 rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-700">{message}</p>
      )}

      <div className="mt-5 space-y-2">
        {Object.entries(sections).map(([section, keys]) => {
          const matching = query
            ? keys.filter(
                (k) =>
                  (overrides[k] ?? defaults[k]).toLowerCase().includes(query) ||
                  k.toLowerCase().includes(query)
              )
            : keys;

          if (matching.length === 0) return null;
          const open = query ? true : openSections[section] ?? false;
          const changedCount = keys.filter((k) => overrides[k] !== undefined).length;

          return (
            <div key={section} className="rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => setOpenSections((s) => ({ ...s, [section]: !open }))}
                className="flex w-full items-center justify-between px-4 py-3 text-left"
              >
                <span className="text-sm font-semibold text-navy">
                  {SECTION_LABELS[section] ?? section}
                  <span className="ml-2 font-normal text-slate-400">
                    ({matching.length} item{matching.length === 1 ? "" : "s"}
                    {changedCount > 0 ? `, ${changedCount} edited` : ""})
                  </span>
                </span>
                <ChevronDown
                  size={16}
                  className={`shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
                />
              </button>

              {open && (
                <div className="space-y-4 border-t border-slate-100 px-4 py-4">
                  {matching.map((key) => {
                    const original = defaults[key];
                    const current = drafts[key] ?? overrides[key] ?? original;
                    const isEdited = overrides[key] !== undefined;
                    const isLong = original.length > 90;

                    return (
                      <div key={key}>
                        <div className="flex items-center justify-between gap-2">
                          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            {humanKey(key)}
                          </label>
                          {isEdited && (
                            <button
                              type="button"
                              onClick={() => handleReset(key)}
                              className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-navy"
                              title="Restore the original wording"
                            >
                              <RotateCcw size={12} /> Reset
                            </button>
                          )}
                        </div>

                        {isLong ? (
                          <textarea
                            rows={3}
                            value={current}
                            onChange={(e) => setDrafts((d) => ({ ...d, [key]: e.target.value }))}
                            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                          />
                        ) : (
                          <input
                            type="text"
                            value={current}
                            onChange={(e) => setDrafts((d) => ({ ...d, [key]: e.target.value }))}
                            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
