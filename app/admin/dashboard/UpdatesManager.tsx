"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Trash2, Megaphone, Lightbulb } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { SiteUpdate } from "@/types/database";

export default function UpdatesManager() {
  const [updates, setUpdates] = useState<SiteUpdate[]>([]);
  const [message, setMessage] = useState("");
  const [kind, setKind] = useState<"update" | "tip">("update");
  const [saving, setSaving] = useState(false);
  const [showTranslations, setShowTranslations] = useState(false);
  const [messageHi, setMessageHi] = useState("");
  const [messageHinglish, setMessageHinglish] = useState("");
  const [messagePa, setMessagePa] = useState("");

  async function loadUpdates() {
    const supabase = createClient();
    const { data } = await supabase
      .from("site_updates")
      .select("*")
      .order("created_at", { ascending: false });
    setUpdates(data ?? []);
  }

  useEffect(() => {
    loadUpdates();
  }, []);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setSaving(true);
    const supabase = createClient();
    await supabase.from("site_updates").insert({
      message,
      message_hi: messageHi || null,
      message_hinglish: messageHinglish || null,
      message_pa: messagePa || null,
      kind,
      is_active: true,
    });
    setMessage("");
    setMessageHi("");
    setMessageHinglish("");
    setMessagePa("");
    setShowTranslations(false);
    setSaving(false);
    loadUpdates();
  }

  async function toggleActive(update: SiteUpdate) {
    const supabase = createClient();
    await supabase.from("site_updates").update({ is_active: !update.is_active }).eq("id", update.id);
    loadUpdates();
  }

  async function handleDelete(update: SiteUpdate) {
    if (!confirm("Delete this update?")) return;
    const supabase = createClient();
    await supabase.from("site_updates").delete().eq("id", update.id);
    loadUpdates();
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-navy">Daily Updates &amp; Tips (&quot;What&apos;s New&quot; banner)</h2>
      <p className="mt-1 text-sm text-slate-500">
        Active items rotate as a banner on the home page. Toggle one off to hide it without deleting it.
      </p>

      <form onSubmit={handleAdd} className="mt-4 space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row">
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value as "update" | "tip")}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
          >
            <option value="update">Update</option>
            <option value="tip">Tip</option>
          </select>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="English text — e.g. New Power BI templates now available for retail clients"
            className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
          />
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-light disabled:opacity-60"
          >
            Add
          </button>
        </div>

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
            Leave blank and the English text is shown for that language instead.
          </p>

          {showTranslations && (
            <div className="mt-3 space-y-2">
              <input
                type="text"
                value={messageHi}
                onChange={(e) => setMessageHi(e.target.value)}
                placeholder="हिन्दी (Hindi)"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
              />
              <input
                type="text"
                value={messageHinglish}
                onChange={(e) => setMessageHinglish(e.target.value)}
                placeholder="Hinglish"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
              />
              <input
                type="text"
                value={messagePa}
                onChange={(e) => setMessagePa(e.target.value)}
                placeholder="ਪੰਜਾਬੀ (Punjabi)"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
              />
            </div>
          )}
        </div>
      </form>

      <div className="mt-5 space-y-2">
        {updates.map((update) => {
          const Icon = update.kind === "tip" ? Lightbulb : Megaphone;
          return (
            <div
              key={update.id}
              className={`flex items-center justify-between gap-3 rounded-lg border p-3 ${
                update.is_active ? "border-slate-200" : "border-slate-100 bg-slate-50 opacity-60"
              }`}
            >
              <div className="flex min-w-0 items-center gap-2">
                <Icon size={16} className="shrink-0 text-navy" />
                <span className="truncate text-sm text-slate-700">{update.message}</span>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleActive(update)}
                  className="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  {update.is_active ? "Active" : "Hidden"}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(update)}
                  className="rounded-md border border-red-200 p-1.5 text-red-500 hover:bg-red-50"
                  aria-label="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
        {updates.length === 0 && <p className="text-sm text-slate-500">No updates yet.</p>}
      </div>
    </div>
  );
}
