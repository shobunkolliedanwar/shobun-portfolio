"use client";

import Image from "next/image";
import { useState } from "react";
import { Copy, Trash2, Upload } from "lucide-react";
import { useMediaLibrary, MEDIA_ALLOWED_TYPES, MEDIA_MAX_SIZE_MB } from "@/lib/hooks/useMediaLibrary";

export function MediaLibrary() {
  const { files, loading, uploading, error, upload, remove } = useMediaLibrary();
  const [copiedName, setCopiedName] = useState<string | null>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    await upload(file);
  }

  function handleCopy(url: string, name: string) {
    navigator.clipboard.writeText(url);
    setCopiedName(name);
    setTimeout(() => setCopiedName(null), 1500);
  }

  return (
    <div>
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-bg">
        <Upload size={16} /> {uploading ? "Uploading…" : "Upload image"}
        <input
          type="file"
          accept={MEDIA_ALLOWED_TYPES.join(",")}
          className="hidden"
          onChange={handleUpload}
          disabled={uploading}
        />
      </label>
      <p className="mt-2 text-xs text-muted-2">JPEG, PNG, WebP, or AVIF — up to {MEDIA_MAX_SIZE_MB}MB.</p>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      <div className="mt-8">
        {loading ? (
          <p className="text-sm text-muted">Loading…</p>
        ) : files.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border-strong px-6 py-16 text-center">
            <p className="font-medium text-foreground">No media yet.</p>
            <p className="mt-1 text-sm text-muted">Upload your first image to use across the site.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {files.map((file) => (
              <div key={file.name} className="group relative overflow-hidden rounded-xl border border-border">
                <div className="relative aspect-square bg-bg-elevated">
                  <Image src={file.url} alt={file.name} fill className="object-cover" unoptimized />
                </div>
                <div className="flex items-center justify-between gap-2 bg-bg-elevated p-2">
                  <button
                    onClick={() => handleCopy(file.url, file.name)}
                    className="inline-flex items-center gap-1 text-xs text-muted hover:text-foreground"
                  >
                    <Copy size={12} /> {copiedName === file.name ? "Copied" : "Copy URL"}
                  </button>
                  <button
                    onClick={() => remove(file.name)}
                    className="inline-flex items-center gap-1 text-xs text-muted hover:text-red-400"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
