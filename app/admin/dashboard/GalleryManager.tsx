"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import type { Session } from "@supabase/supabase-js";
import { Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { uploadWithProgress, safeStorageName } from "@/lib/supabase/uploadWithProgress";
import type { GalleryImage } from "@/types/database";

const IMAGE_BUCKET = "portfolio-images";

export default function GalleryManager({ session }: { session: Session }) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [caption, setCaption] = useState("");
  const [progress, setProgress] = useState(0);
  const [uploadingIndex, setUploadingIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadImages() {
    const supabase = createClient();
    const { data } = await supabase
      .from("gallery_images")
      .select("*")
      .order("created_at", { ascending: false });
    setImages(data ?? []);
  }

  useEffect(() => {
    loadImages();
  }, []);

  async function handleUpload(e: FormEvent) {
    e.preventDefault();
    if (files.length === 0) return;
    setSaving(true);
    setError(null);

    try {
      const supabase = createClient();

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadingIndex(i + 1);
        setProgress(0);

        const path = `gallery/${Date.now()}-${safeStorageName(file.name)}`;
        await uploadWithProgress(IMAGE_BUCKET, path, file, session, setProgress);
        const imageUrl = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path).data.publicUrl;

        const { error: insertError } = await supabase.from("gallery_images").insert({
          image_url: imageUrl,
          // A single caption applies to a single upload; skip it for bulk uploads.
          caption: files.length === 1 && caption ? caption : null,
          is_active: true,
        });
        if (insertError) throw insertError;
      }

      setFiles([]);
      setCaption("");
      setProgress(0);
      setUploadingIndex(0);
      loadImages();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(image: GalleryImage) {
    const supabase = createClient();
    await supabase.from("gallery_images").update({ is_active: !image.is_active }).eq("id", image.id);
    loadImages();
  }

  async function handleDelete(image: GalleryImage) {
    if (!confirm("Delete this image from the gallery?")) return;
    const supabase = createClient();
    await supabase.from("gallery_images").delete().eq("id", image.id);
    loadImages();
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-navy">Gallery</h2>
      <p className="mt-1 text-sm text-slate-500">
        Photos shown on the public Gallery page. You can select several files at once.
      </p>

      <form onSubmit={handleUpload} className="mt-4 space-y-3">
        <div>
          <label className="block text-sm font-medium text-slate-700">Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
            className="mt-1 w-full text-sm"
          />
          {files.length > 0 && (
            <p className="mt-1 text-xs text-slate-500">{files.length} file(s) selected</p>
          )}
        </div>

        {files.length === 1 && (
          <div>
            <label className="block text-sm font-medium text-slate-700">Caption (optional)</label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
            />
          </div>
        )}

        {saving && (
          <div>
            <p className="text-xs text-slate-500">
              Uploading {uploadingIndex} of {files.length}...
            </p>
            <div className="mt-1 h-1.5 w-full rounded-full bg-slate-200">
              <div className="h-1.5 rounded-full bg-navy" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={saving || files.length === 0}
          className="rounded-md bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-light disabled:opacity-60"
        >
          {saving ? "Uploading..." : "Upload to Gallery"}
        </button>
      </form>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {images.map((image) => (
          <div
            key={image.id}
            className={`overflow-hidden rounded-lg border ${
              image.is_active ? "border-slate-200" : "border-slate-100 opacity-50"
            }`}
          >
            <div className="relative aspect-[4/3] bg-slate-100">
              <Image
                src={image.image_url}
                alt={image.caption ?? ""}
                fill
                sizes="200px"
                className="object-cover"
              />
            </div>
            <div className="flex items-center justify-between gap-1 p-2">
              <button
                type="button"
                onClick={() => toggleActive(image)}
                className="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
              >
                {image.is_active ? "Visible" : "Hidden"}
              </button>
              <button
                type="button"
                onClick={() => handleDelete(image)}
                className="rounded-md border border-red-200 p-1.5 text-red-500 hover:bg-red-50"
                aria-label="Delete"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        {images.length === 0 && <p className="text-sm text-slate-500">No images yet.</p>}
      </div>
    </div>
  );
}
