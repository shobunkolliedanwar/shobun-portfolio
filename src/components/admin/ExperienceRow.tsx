"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDialog";
import { deleteExperience } from "@/lib/actions/experiences";
import type { Experience } from "@/types/database";

export function ExperienceRow({ experience }: { experience: Experience }) {
  return (
    <tr>
      <td className="px-4 py-3 text-foreground">{experience.role}</td>
      <td className="px-4 py-3 text-muted">{experience.company}</td>
      <td className="px-4 py-3 text-muted">
        {new Date(experience.start_date).getFullYear()}
        {experience.is_current ? " — Present" : experience.end_date ? ` — ${new Date(experience.end_date).getFullYear()}` : ""}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-4">
          <Link
            href={`/admin/dashboard/experiences/${experience.id}`}
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
          >
            <Pencil size={14} /> Edit
          </Link>
          <ConfirmDeleteButton onConfirm={() => deleteExperience(experience.id)} />
        </div>
      </td>
    </tr>
  );
}
