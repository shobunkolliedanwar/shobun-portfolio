"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff, X } from "lucide-react";
import { MediaPickerModal } from "./MediaPickerModal";
import { fieldClass } from "./FormField";

/**
 * A drop-in replacement for a plain <input name="..." /> URL field,
 * for any image field in the CMS (profile photo, project thumbnail/
 * hero/OG image, gallery image, site default OG image). Renders a
 * hidden input so it still submits through the same server action
 * <form action={...}> as every other field — no extra client-side
 * wiring needed at the call site.
 *
 * A raw URL text input remains available as an advanced fallback for
 * pasting an external image URL directly.
 */
export function MediaPickerField({
  name,
  label,
  defaultValue,
  hint,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  hint?: string;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [showRawInput, setShowRawInput] = useState(false);

  return (
    <div>
      <span className="mb-2 block text-sm text-muted">{label}</span>
      <input type="hidden" name={name} value={value} />

      <div className="flex items-center gap-3">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-border bg-bg-elevated">
          {value ? (
            <Image src={value} alt="" fill className="object-cover" unoptimized />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-2">
              <ImageOff size={18} />
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="rounded-full border border-border-strong px-4 py-2 text-sm text-foreground hover:border-accent/60 hover:text-accent"
          >
            Choose media
          </button>
          {value && (
            <button
              type="button"
              onClick={() => setValue("")}
              className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm text-muted hover:text-red-400"
            >
              <X size={14} /> Clear
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowRawInput((v) => !v)}
            className="rounded-full px-3 py-2 text-sm text-muted-2 hover:text-muted"
          >
            {showRawInput ? "Hide URL field" : "Paste URL instead"}
          </button>
        </div>
      </div>

      {showRawInput && (
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="https://..."
          className={`${fieldClass} mt-3`}
        />
      )}

      {hint && <span className="mt-1.5 block text-xs text-muted-2">{hint}</span>}

      {pickerOpen && (
        <MediaPickerModal
          onSelect={(url) => {
            setValue(url);
            setPickerOpen(false);
          }}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  );
}
