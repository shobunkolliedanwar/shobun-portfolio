import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { DataTable } from "@/components/admin/DataTable";
import { EmptyState } from "@/components/admin/EmptyState";
import { ExperienceRow } from "@/components/admin/ExperienceRow";

export default async function AdminExperiencesPage() {
  const supabase = await createClient();
  const { data: experiences } = await supabase
    .from("experiences")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-foreground">Experiences</h1>
          <p className="mt-1 text-sm text-muted">Your professional work history.</p>
        </div>
        <Link
          href="/admin/dashboard/experiences/new"
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-bg"
        >
          <Plus size={16} /> New experience
        </Link>
      </div>

      <div className="mt-8">
        {experiences && experiences.length > 0 ? (
          <DataTable columns={["Role", "Company", "Period", ""]}>
            {experiences.map((exp) => (
              <ExperienceRow key={exp.id} experience={exp} />
            ))}
          </DataTable>
        ) : (
          <EmptyState
            title="No experiences yet."
            description="Add your first role to build your timeline."
            action={
              <Link
                href="/admin/dashboard/experiences/new"
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-bg"
              >
                <Plus size={16} /> Add experience
              </Link>
            }
          />
        )}
      </div>
    </div>
  );
}
