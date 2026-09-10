"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  deleteSkill,
  deleteSkillCategory,
} from "@/lib/actions/skills";
import { deleteSocialLink } from "@/lib/actions/social-links";

type DeleteType =
  | "skill"
  | "skill-category"
  | "social-link";

export function InlineDeleteButton({
  id,
  type,
}: {
  id: string;
  type: DeleteType;
}) {
  const [isPending, startTransition] = useTransition();

   function handleClick() {
    startTransition(async () => {
      try {
        if (type === "skill-category") {
          await deleteSkillCategory(id);
        } else if (type === "skill") {
          await deleteSkill(id);
        } else if (type === "social-link") {
          await deleteSocialLink(id);
        }

        toast.success("Removed.");
      } catch (err) {
        toast.error(
          err instanceof Error
            ? err.message
            : "Couldn't remove this item."
        );
      }
    });
  }

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={handleClick}
      className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-red-400 disabled:opacity-50"
    >
      <Trash2 size={14} />
      {isPending ? "Removing…" : "Remove"}
    </button>
  );
}