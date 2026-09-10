"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export function ConfirmDeleteButton({
  onConfirm,
  label = "Delete",
  confirmLabel = "This can't be undone. Delete this item?",
}: {
  onConfirm: () => Promise<void>;
  label?: string;
  confirmLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-red-400"
      >
        <Trash2 size={14} /> {label}
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-bg-elevated p-6">
        <p className="text-foreground">{confirmLabel}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => setOpen(false)}
            className="rounded-full border border-border-strong px-4 py-2 text-sm text-muted"
          >
            Cancel
          </button>
          <button
            disabled={isPending}
            onClick={() =>
              startTransition(async () => {
                try {
                  await onConfirm();
                  toast.success("Deleted.");
                  setOpen(false);
                } catch (err) {
                  toast.error(err instanceof Error ? err.message : "Couldn't delete this item.");
                }
              })
            }
            className="rounded-full bg-red-500/90 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {isPending ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
