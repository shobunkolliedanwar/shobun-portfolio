"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteProjectImage } from "@/lib/actions/projects";

export function GalleryImageDelete({ id, projectId }: { id: string; projectId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      try {
        await deleteProjectImage(id, projectId);
        toast.success("Image removed.");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Couldn't remove this image.");
      }
    });
  }

  return (
    <button
      disabled={isPending}
      onClick={handleClick}
      className="inline-flex items-center gap-1 rounded-full bg-bg/80 p-1.5 text-white hover:bg-red-500/90 disabled:opacity-50"
      aria-label="Remove image"
    >
      <Trash2 size={14} />
    </button>
  );
}
