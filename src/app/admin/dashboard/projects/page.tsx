import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { DataTable } from "@/components/admin/DataTable";
import { EmptyState } from "@/components/admin/EmptyState";
import { ProjectRow } from "@/components/admin/ProjectRow";

export default async function AdminProjectsPage() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-foreground">Projects</h1>
          <p className="mt-1 text-sm text-muted">Manage your featured work and case studies.</p>
        </div>
        <Link
          href="/admin/dashboard/projects/new"
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-bg"
        >
          <Plus size={16} /> New project
        </Link>
      </div>

      <div className="mt-8">
        {projects && projects.length > 0 ? (
          <DataTable columns={["Title", "Slug", "Year", "Status", ""]}>
            {projects.map((project) => (
              <ProjectRow key={project.id} project={project} />
            ))}
          </DataTable>
        ) : (
          <EmptyState
            title="No projects yet."
            description="Add your first project to start filling in your case studies."
            action={
              <Link
                href="/admin/dashboard/projects/new"
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-bg"
              >
                <Plus size={16} /> Add project
              </Link>
            }
          />
        )}
      </div>
    </div>
  );
}
