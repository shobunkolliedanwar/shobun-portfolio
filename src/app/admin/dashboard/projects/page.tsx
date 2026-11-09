import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { DataTable } from "@/components/admin/DataTable";
import { ProjectRow } from "@/components/admin/ProjectRow";

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  if (error) throw new Error("Unable to load projects. Please try again.");

  return (
    <div className="max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1>Projects</h1>
          <p className="mt-2 text-sm text-muted">Manage your published projects and drafts.</p>
        </div>
        <Link href="/admin/dashboard/projects/new" className="inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-3 text-sm text-bg">
          <Plus size={16} /> Add project
        </Link>
      </div>
      <div className="mt-8">
        {projects?.length ? (
          <DataTable columns={["Title", "Slug", "Year", "Status", "Actions"]}>
            {projects.map((project) => <ProjectRow key={project.id} project={project} />)}
          </DataTable>
        ) : (
          <div className="rounded-2xl border border-dashed border-border-strong bg-bg-elevated p-10 text-center">
            <h2 className="text-lg font-semibold">No projects yet</h2>
            <p className="mt-2 text-sm text-muted">Add your first project to start building your portfolio.</p>
          </div>
        )}
      </div>
    </div>
  );
}
