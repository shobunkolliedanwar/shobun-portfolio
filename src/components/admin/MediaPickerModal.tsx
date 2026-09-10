"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { useMediaLibrary, MEDIA_ALLOWED_TYPES, MEDIA_MAX_SIZE_MB } from "@/lib/hooks/useMediaLibrary";

export function MediaPickerModal({
  onSelect,
  onClose,
}: {
  onSelect: (url: string) => void;
  onClose: () => void;
}) {
  const { files, loading, uploading, error, upload } = useMediaLibrary();
  const dialogRef = useRef<HTMLDivElement>(null);

  // Keyboard accessibility: Escape closes, Tab/Shift+Tab is trapped
  // within the dialog while it's open, and focus returns to whatever
  // triggered the picker once it closes.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();

    function getFocusable(): HTMLElement[] {
      if (!dialogRef.current) return [];
      return Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const focusable = getFocusable();
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      } else if (!dialogRef.current?.contains(active)) {
        // Focus somehow escaped the dialog — pull it back in.
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    const url = await upload(file);
    if (url) onSelect(url);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <button aria-label="Close" className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Choose media"
        tabIndex={-1}
        className="relative flex max-h-[85vh] w-full max-w-2xl flex-col rounded-2xl border border-border bg-bg-elevated p-5 outline-none sm:p-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-foreground">Choose media</h2>
          <button onClick={onClose} aria-label="Close" className="p-1 text-muted hover:text-foreground">
            <X size={18} />
          </button>
        </div>

        <label className="mt-4 inline-flex w-fit cursor-pointer items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-bg">
          <Upload size={14} /> {uploading ? "Uploading…" : "Upload new image"}
          <input
            type="file"
            accept={MEDIA_ALLOWED_TYPES.join(",")}
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
        <p className="mt-1.5 text-xs text-muted-2">JPEG, PNG, WebP, or AVIF — up to {MEDIA_MAX_SIZE_MB}MB.</p>
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}

        <div className="mt-5 flex-1 overflow-y-auto">
          {loading ? (
            <p className="text-sm text-muted">Loading…</p>
          ) : files.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border-strong px-4 py-10 text-center text-sm text-muted">
              No media yet — upload your first image above.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {files.map((file) => (
                <button
                  key={file.name}
                  onClick={() => onSelect(file.url)}
                  className="group relative aspect-square overflow-hidden rounded-lg border border-border focus-visible:border-accent"
                  aria-label={`Choose ${file.name}`}
                >
                  <Image src={file.url} alt={file.name} fill className="object-cover" unoptimized />
                  <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/30" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
