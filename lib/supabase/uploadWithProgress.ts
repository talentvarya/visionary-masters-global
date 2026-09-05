import type { Session } from "@supabase/supabase-js";

/**
 * Supabase Storage rejects object keys containing anything outside a small safe
 * set — an ellipsis, accented letter, comma or bracket fails the upload with
 * "InvalidKey", and a run of dots ("report...final.png") is refused outright as
 * a path-traversal risk. Everything unsafe becomes a hyphen, repeated dots
 * collapse to one, and the name is capped to stay within key limits.
 */
export function safeStorageName(fileName: string): string {
  const dot = fileName.lastIndexOf(".");
  const rawBase = dot > 0 ? fileName.slice(0, dot) : fileName;
  const rawExt = dot > 0 ? fileName.slice(dot + 1) : "";

  const clean = (value: string) =>
    value
      .normalize("NFKD")
      .replace(/[^a-zA-Z0-9._-]+/g, "-")
      .replace(/\.{2,}/g, ".")
      .replace(/-{2,}/g, "-")
      .replace(/^[-._]+|[-._]+$/g, "");

  const base = clean(rawBase).slice(0, 60) || "file";
  const ext = clean(rawExt).toLowerCase().slice(0, 10);

  return ext ? `${base}.${ext}` : base;
}

export function uploadWithProgress(
  bucket: string,
  path: string,
  file: File,
  session: Session,
  onProgress: (percent: number) => void
): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/${bucket}/${path}`;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.setRequestHeader("Authorization", `Bearer ${session.access_token}`);
    xhr.setRequestHeader("apikey", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    xhr.setRequestHeader("x-upsert", "true");
    xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(xhr.responseText || "Upload failed"));
      }
    };

    xhr.onerror = () => reject(new Error("Upload failed"));
    xhr.send(file);
  });
}
