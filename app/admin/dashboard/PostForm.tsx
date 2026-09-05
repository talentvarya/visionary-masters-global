"use client";

import { useState, type FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { uploadWithProgress } from "@/lib/supabase/uploadWithProgress";
import type { PortfolioPost } from "@/types/database";

const IMAGE_BUCKET = "portfolio-images";
const VIDEO_BUCKET = "portfolio-videos";

type Props = {
  session: Session;
  editingPost: PortfolioPost | null;
  onSaved: () => void;
  onCancel: () => void;
};

export default function PostForm({ session, editingPost, onSaved, onCancel }: Props) {
  const [title, setTitle] = useState(editingPost?.title ?? "");
  const [description, setDescription] = useState(editingPost?.description ?? "");
  const [category, setCategory] = useState(editingPost?.category ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imageProgress, setImageProgress] = useState(0);
  const [videoProgress, setVideoProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [postToLinkedIn, setPostToLinkedIn] = useState(false);
  const [linkedInCaption, setLinkedInCaption] = useState("");
  const [linkedInStatus, setLinkedInStatus] = useState<"idle" | "posting" | "success" | "error">("idle");
  const [linkedInError, setLinkedInError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const supabase = createClient();
      let imageUrl = editingPost?.image_url ?? null;
      let videoUrl = editingPost?.video_url ?? null;

      if (imageFile) {
        const path = `${Date.now()}-${imageFile.name.replace(/\s+/g, "-")}`;
        await uploadWithProgress(IMAGE_BUCKET, path, imageFile, session, setImageProgress);
        imageUrl = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path).data.publicUrl;
      }

      if (videoFile) {
        const path = `${Date.now()}-${videoFile.name.replace(/\s+/g, "-")}`;
        await uploadWithProgress(VIDEO_BUCKET, path, videoFile, session, setVideoProgress);
        videoUrl = supabase.storage.from(VIDEO_BUCKET).getPublicUrl(path).data.publicUrl;
      }

      const payload = {
        title,
        description,
        category: category || null,
        image_url: imageUrl,
        video_url: videoUrl,
      };

      if (editingPost) {
        const { error: updateError } = await supabase
          .from("portfolio_posts")
          .update(payload)
          .eq("id", editingPost.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from("portfolio_posts").insert(payload);
        if (insertError) throw insertError;
      }

      if (postToLinkedIn) {
        setLinkedInStatus("posting");
        try {
          const res = await fetch("/api/linkedin/post", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text: linkedInCaption || `${title}\n\n${description}`,
              imageUrl,
            }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "LinkedIn post failed");
          setLinkedInStatus("success");
        } catch (linkedInErr) {
          setLinkedInStatus("error");
          setLinkedInError(linkedInErr instanceof Error ? linkedInErr.message : "LinkedIn post failed");
          return;
        }
      }

      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-navy">{editingPost ? "Edit Post" : "Add New Work Post"}</h2>

      <div>
        <label className="block text-sm font-medium text-slate-700">Title</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Description (Markdown supported)</label>
        <textarea
          required
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-mono focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Category Tag</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="e.g. Power BI, Website, Video"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Image Upload (optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
          className="mt-1 w-full text-sm"
        />
        {imageFile && imageProgress > 0 && imageProgress < 100 && (
          <div className="mt-1 h-1.5 w-full rounded-full bg-slate-200">
            <div className="h-1.5 rounded-full bg-navy transition-all" style={{ width: `${imageProgress}%` }} />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Video Upload (optional)</label>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)}
          className="mt-1 w-full text-sm"
        />
        {videoFile && videoProgress > 0 && videoProgress < 100 && (
          <div className="mt-1 h-1.5 w-full rounded-full bg-slate-200">
            <div className="h-1.5 rounded-full bg-navy transition-all" style={{ width: `${videoProgress}%` }} />
          </div>
        )}
      </div>

      <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            checked={postToLinkedIn}
            onChange={(e) => setPostToLinkedIn(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300"
          />
          Also post to LinkedIn
        </label>
        <p className="mt-1 text-xs text-slate-500">
          Shares the photo (or text only, if no image) to your LinkedIn profile. Videos are never
          auto-shared — share those manually. Requires LINKEDIN_ACCESS_TOKEN / LINKEDIN_PERSON_URN
          to be configured.
        </p>
        {postToLinkedIn && (
          <textarea
            value={linkedInCaption}
            onChange={(e) => setLinkedInCaption(e.target.value)}
            placeholder="LinkedIn caption (defaults to title + description if left blank)"
            rows={3}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
          />
        )}
        {linkedInStatus === "success" && (
          <p className="mt-2 text-sm text-green-700">Posted to LinkedIn successfully.</p>
        )}
        {linkedInStatus === "error" && (
          <p className="mt-2 text-sm text-red-700">LinkedIn post failed: {linkedInError}</p>
        )}
      </div>

      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-light disabled:opacity-60"
        >
          {saving ? "Saving..." : editingPost ? "Update Post" : "Publish Post"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
