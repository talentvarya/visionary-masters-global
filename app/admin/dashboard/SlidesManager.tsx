"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { Trash2, Sparkles, Bot, Linkedin, Newspaper, type LucideIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { uploadWithProgress } from "@/lib/supabase/uploadWithProgress";
import type { HomeSlide, SlideTopic } from "@/types/database";

const IMAGE_BUCKET = "portfolio-images";

const TOPICS: { value: SlideTopic; label: string; icon: LucideIcon; color: string }[] = [
  { value: "claude", label: "Claude (tips & skills)", icon: Sparkles, color: "text-[#D97757]" },
  { value: "chatgpt", label: "ChatGPT (tips & skills)", icon: Bot, color: "text-[#10A37F]" },
  { value: "linkedin", label: "LinkedIn post", icon: Linkedin, color: "text-[#0A66C2]" },
  { value: "news", label: "News update", icon: Newspaper, color: "text-accent" },
];

export default function SlidesManager({ session }: { session: Session }) {
  const [slides, setSlides] = useState<HomeSlide[]>([]);
  const [topic, setTopic] = useState<SlideTopic>("claude");
  const [imageOnly, setImageOnly] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [showTranslations, setShowTranslations] = useState(false);
  const [titleHi, setTitleHi] = useState("");
  const [bodyHi, setBodyHi] = useState("");
  const [titleHinglish, setTitleHinglish] = useState("");
  const [bodyHinglish, setBodyHinglish] = useState("");
  const [titlePa, setTitlePa] = useState("");
  const [bodyPa, setBodyPa] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadSlides() {
    const supabase = createClient();
    const { data } = await supabase
      .from("home_slides")
      .select("*")
      .order("created_at", { ascending: false });
    setSlides(data ?? []);
  }

  useEffect(() => {
    loadSlides();
  }, []);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();

    if (imageOnly) {
      if (!imageFile) {
        setError("Screenshot mode needs an image — please choose one.");
        return;
      }
    } else if (!title.trim()) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const supabase = createClient();
      let imageUrl: string | null = null;

      if (imageFile) {
        const path = `slides/${Date.now()}-${imageFile.name.replace(/\s+/g, "-")}`;
        await uploadWithProgress(IMAGE_BUCKET, path, imageFile, session, setProgress);
        imageUrl = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path).data.publicUrl;
      }

      const topicLabel = TOPICS.find((tp) => tp.value === topic)?.label ?? topic;

      const { error: insertError } = await supabase.from("home_slides").insert({
        topic,
        // Screenshot mode shows no text on the card — a title is only kept
        // internally so the admin list below has something to display.
        title: imageOnly ? `${topicLabel} screenshot` : title,
        title_hi: imageOnly ? null : titleHi || null,
        title_hinglish: imageOnly ? null : titleHinglish || null,
        title_pa: imageOnly ? null : titlePa || null,
        body: imageOnly ? null : body || null,
        body_hi: imageOnly ? null : bodyHi || null,
        body_hinglish: imageOnly ? null : bodyHinglish || null,
        body_pa: imageOnly ? null : bodyPa || null,
        image_url: imageUrl,
        link_url: linkUrl || null,
        image_only: imageOnly,
        is_active: true,
      });
      if (insertError) throw insertError;

      setTitle("");
      setBody("");
      setLinkUrl("");
      setTitleHi("");
      setBodyHi("");
      setTitleHinglish("");
      setBodyHinglish("");
      setTitlePa("");
      setBodyPa("");
      setShowTranslations(false);
      setImageOnly(false);
      setImageFile(null);
      setProgress(0);
      loadSlides();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save slide");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(slide: HomeSlide) {
    const supabase = createClient();
    await supabase.from("home_slides").update({ is_active: !slide.is_active }).eq("id", slide.id);
    loadSlides();
  }

  async function handleDelete(slide: HomeSlide) {
    if (!confirm(`Delete slide "${slide.title}"?`)) return;
    const supabase = createClient();
    await supabase.from("home_slides").delete().eq("id", slide.id);
    loadSlides();
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-navy">Home Page Slides</h2>
      <p className="mt-1 text-sm text-slate-500">
        These are the cards sliding across the top of the home page — Claude tips, ChatGPT tips,
        LinkedIn posts, and news updates.
      </p>

      <form onSubmit={handleAdd} className="mt-4 space-y-3">
        <div>
          <label className="block text-sm font-medium text-slate-700">Type</label>
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value as SlideTopic)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy sm:max-w-xs"
          >
            {TOPICS.map((tp) => (
              <option key={tp.value} value={tp.value}>
                {tp.label}
              </option>
            ))}
          </select>
        </div>

        <label className="flex items-start gap-2 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm">
          <input
            type="checkbox"
            checked={imageOnly}
            onChange={(e) => setImageOnly(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-slate-300"
          />
          <span>
            <span className="font-medium text-slate-700">
              This is a screenshot (Claude / ChatGPT / LinkedIn) — image only
            </span>
            <span className="block text-xs text-slate-500">
              Shows just the image, full size, with no title or description text on top of it.
            </span>
          </span>
        </label>

        {!imageOnly && (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-700">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Claude can read your whole codebase"
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Description / tip</label>
              <textarea
                rows={2}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Short text shown on the card"
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
              />
            </div>
          </>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">Link (optional)</label>
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://linkedin.com/posts/..."
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Image {imageOnly ? "" : "(optional)"}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              className={`mt-1 w-full rounded-md text-sm ${
                imageOnly ? "border-2 border-dashed border-navy/40 bg-navy/5 p-2" : ""
              }`}
            />
            {imageFile && progress > 0 && progress < 100 && (
              <div className="mt-1 h-1.5 w-full rounded-full bg-slate-200">
                <div className="h-1.5 rounded-full bg-navy" style={{ width: `${progress}%` }} />
              </div>
            )}
          </div>
        </div>

        {!imageOnly && (
        <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
          <button
            type="button"
            onClick={() => setShowTranslations((s) => !s)}
            className="flex w-full items-center justify-between text-left text-sm font-medium text-slate-700"
          >
            <span>Translations (optional) — Hindi, Hinglish, Punjabi</span>
            <span className="text-xs text-slate-500">{showTranslations ? "Hide" : "Show"}</span>
          </button>
          <p className="mt-1 text-xs text-slate-500">
            Leave any of these blank and the English text is shown for that language instead.
          </p>

          {showTranslations && (
            <div className="mt-3 space-y-3">
              {(
                [
                  ["हिन्दी (Hindi)", titleHi, setTitleHi, bodyHi, setBodyHi],
                  ["Hinglish", titleHinglish, setTitleHinglish, bodyHinglish, setBodyHinglish],
                  ["ਪੰਜਾਬੀ (Punjabi)", titlePa, setTitlePa, bodyPa, setBodyPa],
                ] as const
              ).map(([label, titleValue, setTitleValue, bodyValue, setBodyValue]) => (
                <div key={label} className="rounded-md border border-slate-200 bg-white p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {label}
                  </p>
                  <input
                    type="text"
                    value={titleValue}
                    onChange={(e) => setTitleValue(e.target.value)}
                    placeholder="Title"
                    className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                  />
                  <textarea
                    rows={2}
                    value={bodyValue}
                    onChange={(e) => setBodyValue(e.target.value)}
                    placeholder="Description"
                    className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        )}

        {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-light disabled:opacity-60"
        >
          {saving ? "Saving..." : "Add Slide"}
        </button>
      </form>

      <div className="mt-6 space-y-2">
        {slides.map((slide) => {
          const meta = TOPICS.find((tp) => tp.value === slide.topic) ?? TOPICS[3];
          const Icon = meta.icon;
          return (
            <div
              key={slide.id}
              className={`flex items-center justify-between gap-3 rounded-lg border p-3 ${
                slide.is_active ? "border-slate-200" : "border-slate-100 bg-slate-50 opacity-60"
              }`}
            >
              <div className="flex min-w-0 items-center gap-2">
                <Icon size={16} className={`shrink-0 ${meta.color}`} />
                <span className="truncate text-sm text-slate-700">{slide.title}</span>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleActive(slide)}
                  className="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  {slide.is_active ? "Active" : "Hidden"}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(slide)}
                  className="rounded-md border border-red-200 p-1.5 text-red-500 hover:bg-red-50"
                  aria-label="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
        {slides.length === 0 && <p className="text-sm text-slate-500">No slides yet.</p>}
      </div>
    </div>
  );
}
