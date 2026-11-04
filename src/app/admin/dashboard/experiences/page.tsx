import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { DataTable } from "@/components/admin/DataTable";
import { ExperienceRow } from "@/components/admin/ExperienceRow";

export default async function ExperiencesPage() {
  const supabase = await createClient();
  const { data: experiences, error } = await supabase
    .from("experiences")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("start_date", { ascending: false });

  if (error) throw new Error("Unable to load experiences. Please try again.");

  return (
    <div className="max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1>Experiences</h1>
          <p className="mt-2 text-sm text-muted">Manage your career history, including published entries and drafts.</p>
        </div>
        <Link href="/admin/dashboard/experiences/new" className="inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-3 text-sm text-bg">
          <Plus size={16} /> Add experience
        </Link>
      </div>
      <div className="mt-8">
        {experiences?.length ? (
          <DataTable columns={["Role", "Company", "Period", "Status", "Actions"]}>
            {experiences.map((experience) => <ExperienceRow key={experience.id} experience={experience} />)}
          </DataTable>
        ) : (
          <div className="rounded-2xl border border-dashed border-border-strong bg-bg-elevated p-10 text-center">
            <h2 className="text-lg font-semibold">No experiences yet</h2>
            <p className="mt-2 text-sm text-muted">Add your first role to start building your career timeline.</p>
            <Link href="/admin/dashboard/experiences/new" className="mt-5 inline-block text-sm font-medium text-accent">Add your first experience →</Link>
          </div>
        )}
      </div>
    </div>
  );
}
