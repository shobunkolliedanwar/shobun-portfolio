"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDialog";
import { deleteProject } from "@/lib/actions/projects";
import type { Project } from "@/types/database";

export function ProjectRow({ project }: { project: Project }) {
  return (
    <tr>
      <td className="px-4 py-3 text-foreground">{project.title}</td>
      <td className="px-4 py-3 font-mono text-xs text-muted">{project.slug}</td>
      <td className="px-4 py-3 text-muted">{project.project_year ?? "—"}</td>
      <td className="px-4 py-3">
        <span
          className={
            project.published
              ? "rounded-full bg-success/10 px-2 py-0.5 text-xs text-success"
              : "rounded-full bg-white/5 px-2 py-0.5 text-xs text-muted"
          }
        >
          {project.published ? "Published" : "Draft"}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-4">
          <Link
            href={`/admin/dashboard/projects/${project.id}`}
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
          >
            <Pencil size={14} /> Edit
          </Link>
          <ConfirmDeleteButton onConfirm={() => deleteProject(project.id)} />
        </div>
      </td>
    </tr>
  );
}
