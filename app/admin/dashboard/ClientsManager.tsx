"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import type { Session } from "@supabase/supabase-js";
import { Trash2, Building2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { uploadWithProgress } from "@/lib/supabase/uploadWithProgress";
import type { Client } from "@/types/database";

const IMAGE_BUCKET = "portfolio-images";

export default function ClientsManager({ session }: { session: Session }) {
  const [clients, setClients] = useState<Client[]>([]);
  const [name, setName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadClients() {
    const supabase = createClient();
    const { data } = await supabase
      .from("clients")
      .select("*")
      .order("created_at", { ascending: false });
    setClients(data ?? []);
  }

  useEffect(() => {
    loadClients();
  }, []);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError(null);

    try {
      const supabase = createClient();
      let logoUrl: string | null = null;

      if (logoFile) {
        const path = `clients/${Date.now()}-${logoFile.name.replace(/\s+/g, "-")}`;
        await uploadWithProgress(IMAGE_BUCKET, path, logoFile, session, setProgress);
        logoUrl = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path).data.publicUrl;
      }

      const { error: insertError } = await supabase.from("clients").insert({
        name,
        logo_url: logoUrl,
        website_url: websiteUrl || null,
        is_active: true,
      });
      if (insertError) throw insertError;

      setName("");
      setWebsiteUrl("");
      setLogoFile(null);
      setProgress(0);
      loadClients();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save client");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(client: Client) {
    const supabase = createClient();
    await supabase.from("clients").update({ is_active: !client.is_active }).eq("id", client.id);
    loadClients();
  }

  async function handleDelete(client: Client) {
    if (!confirm(`Delete client "${client.name}"?`)) return;
    const supabase = createClient();
    await supabase.from("clients").delete().eq("id", client.id);
    loadClients();
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-navy">Our Clients</h2>
      <p className="mt-1 text-sm text-slate-500">
        Client logos and names. The public page lives at <code>/clients</code> but is{" "}
        <strong>not linked in the menu and is hidden from search</strong> — add clients here now,
        and tell me when you want it made visible.
      </p>

      <form onSubmit={handleAdd} className="mt-4 space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">Company name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Website (optional)</label>
            <input
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://example.com"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Logo (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
            className="mt-1 w-full text-sm"
          />
          {logoFile && progress > 0 && progress < 100 && (
            <div className="mt-1 h-1.5 w-full rounded-full bg-slate-200">
              <div className="h-1.5 rounded-full bg-navy" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>

        {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-light disabled:opacity-60"
        >
          {saving ? "Saving..." : "Add Client"}
        </button>
      </form>

      <div className="mt-6 space-y-2">
        {clients.map((client) => (
          <div
            key={client.id}
            className={`flex items-center justify-between gap-3 rounded-lg border p-3 ${
              client.is_active ? "border-slate-200" : "border-slate-100 bg-slate-50 opacity-60"
            }`}
          >
            <div className="flex min-w-0 items-center gap-3">
              {client.logo_url ? (
                <div className="relative h-8 w-16 shrink-0">
                  <Image
                    src={client.logo_url}
                    alt={client.name}
                    fill
                    sizes="64px"
                    className="object-contain"
                  />
                </div>
              ) : (
                <Building2 size={16} className="shrink-0 text-navy" />
              )}
              <span className="truncate text-sm text-slate-700">{client.name}</span>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => toggleActive(client)}
                className="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
              >
                {client.is_active ? "Active" : "Hidden"}
              </button>
              <button
                type="button"
                onClick={() => handleDelete(client)}
                className="rounded-md border border-red-200 p-1.5 text-red-500 hover:bg-red-50"
                aria-label="Delete"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        {clients.length === 0 && <p className="text-sm text-slate-500">No clients yet.</p>}
      </div>
    </div>
  );
}
