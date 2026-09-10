"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export const MEDIA_BUCKET = "media";
export const MEDIA_MAX_SIZE_MB = 5;
// JPEG/PNG/WebP/AVIF only. SVG is intentionally excluded — an uploaded
// SVG can carry an embedded <script> or event-handler attribute, and
// Supabase Storage serves files with their original content type, so
// an "image" upload could execute as script in a browser that opens
// it directly. Raster formats only.
export const MEDIA_ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

// Extension is derived from the (already-validated) MIME type, never
// from the client-supplied filename, which could be anything.
const EXTENSION_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

export interface MediaFile {
  name: string;
  url: string;
}

export function useMediaLibrary() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const refresh = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.storage.from(MEDIA_BUCKET).list("", {
      sortBy: { column: "created_at", order: "desc" },
    });
    if (error) {
      setError(
        error.message.includes("not found")
          ? `Create a public bucket named "${MEDIA_BUCKET}" in your Supabase dashboard first.`
          : error.message
      );
      setFiles([]);
      setLoading(false);
      return;
    }
    const withUrls = (data ?? [])
      .filter((f) => f.name !== ".emptyFolderPlaceholder")
      .map((f) => ({
        name: f.name,
        url: supabase.storage.from(MEDIA_BUCKET).getPublicUrl(f.name).data.publicUrl,
      }));
    setFiles(withUrls);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount
    refresh();
  }, [refresh]);

  async function upload(file: File): Promise<string | null> {
    setError(null);

    if (!MEDIA_ALLOWED_TYPES.includes(file.type)) {
      setError("Only JPEG, PNG, WebP, or AVIF files are allowed.");
      return null;
    }
    if (file.size > MEDIA_MAX_SIZE_MB * 1024 * 1024) {
      setError(`File must be under ${MEDIA_MAX_SIZE_MB}MB.`);
      return null;
    }

    setUploading(true);
    // A generated identifier avoids trusting anything about the client's
    // filename (which could contain path separators, be absurdly long,
    // collide with an existing file, or just be unpredictable). Existing
    // uploads keep whatever name they already have — this only changes
    // the naming for files uploaded from now on.
    const fileName = `${crypto.randomUUID()}.${EXTENSION_BY_TYPE[file.type]}`;
    const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });
    setUploading(false);

    if (error) {
      setError(error.message);
      return null;
    }
    await refresh();
    return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(fileName).data.publicUrl;
  }

  async function remove(name: string) {
    const { error } = await supabase.storage.from(MEDIA_BUCKET).remove([name]);
    if (error) {
      setError(error.message);
      return;
    }
    await refresh();
  }

  return { files, loading, uploading, error, setError, upload, remove, refresh };
}
