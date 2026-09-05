"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Session } from "@supabase/supabase-js";
import { Trash2, ImageIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { uploadWithProgress } from "@/lib/supabase/uploadWithProgress";
import en from "@/locales/en.json";
import type { ServiceImage } from "@/types/database";

const IMAGE_BUCKET = "portfolio-images";

// The eight services come straight from the English locale file, so this list
// can never drift out of sync with what the Services page actually renders.
const SERVICES = en.services.items.map((item) => ({ id: item.id, title: item.title }));

export default function ServiceImagesManager({ session }: { session: Session }) {
  const [images, setImages] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function loadImages() {
    const supabase = createClient();
    const { data } = await supabase.from("service_images").select("*");
    const map: Record<string, string> = {};
    (data as ServiceImage[] | null)?.forEach((row) => {
      map[row.service_id] = row.image_url;
    });
    setImages(map);
  }

  useEffect(() => {
    loadImages();
  }, []);

  async function handleUpload(serviceId: string, file: File) {
    setBusyId(serviceId);
    setProgress(0);
    setError(null);

    try {
      const supabase = createClient();
      const path = `services/${serviceId}-${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      await uploadWithProgress(IMAGE_BUCKET, path, file, session, setProgress);
      const imageUrl = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path).data.publicUrl;

      const { error: upsertError } = await supabase
        .from("service_images")
        .upsert({ service_id: serviceId, image_url: imageUrl, is_active: true });
      if (upsertError) throw upsertError;

      loadImages();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusyId(null);
      setProgress(0);
    }
  }

  async function handleRemove(serviceId: string) {
    if (!confirm("Remove the watermark image from this service card?")) return;
    const supabase = createClient();
    await supabase.from("service_images").delete().eq("service_id", serviceId);
    loadImages();
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-navy">Service Card Images</h2>
      <p className="mt-1 text-sm text-slate-500">
        Each image shows as a faint watermark behind its service card on the Services page —
        subtle enough to keep the text readable. Screenshots of your own work (a dashboard, a
        tracker, a report) work best. Leave any blank to show just the icon.
      </p>

      {error && (
        <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <div className="mt-4 space-y-2">
        {SERVICES.map((service) => {
          const url = images[service.id];
          const busy = busyId === service.id;

          return (
            <div
              key={service.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                {url ? (
                  <div className="relative h-10 w-16 shrink-0 overflow-hidden rounded bg-slate-100">
                    <Image src={url} alt="" fill sizes="64px" className="object-cover" />
                  </div>
                ) : (
                  <span className="flex h-10 w-16 shrink-0 items-center justify-center rounded bg-slate-100 text-slate-400">
                    <ImageIcon size={16} />
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-700">{service.title}</p>
                  {busy && progress > 0 && (
                    <div className="mt-1 h-1.5 w-32 rounded-full bg-slate-200">
                      <div className="h-1.5 rounded-full bg-navy" style={{ width: `${progress}%` }} />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <label className="cursor-pointer rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">
                  {busy ? "Uploading..." : url ? "Replace" : "Upload"}
                  <input
                    type="file"
                    accept="image/*"
                    disabled={busy}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUpload(service.id, file);
                      e.target.value = "";
                    }}
                    className="hidden"
                  />
                </label>
                {url && (
                  <button
                    type="button"
                    onClick={() => handleRemove(service.id)}
                    className="rounded-md border border-red-200 p-1.5 text-red-500 hover:bg-red-50"
                    aria-label="Remove image"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
