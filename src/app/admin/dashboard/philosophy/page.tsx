import { createClient } from "@/lib/supabase/server";
import { FormField, fieldClass } from "@/components/admin/FormField";
import { EmptyState } from "@/components/admin/EmptyState";
import { InlineDeleteButton } from "@/components/admin/InlineDeleteButton";
import { CmsForm } from "@/components/admin/CmsForm";
import { createPhilosophy, deletePhilosophy } from "@/lib/actions/philosophy";

export default async function AdminPhilosophyPage() {
  const supabase = await createClient();
  const { data: items } = await supabase
    .from("philosophies")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-medium text-foreground">Engineering philosophy</h1>
      <p className="mt-1 text-sm text-muted">Short statements that show how you think about the work.</p>

      <CmsForm action={createPhilosophy} successMessage="Statement added." className="mt-8 space-y-4 rounded-2xl border border-border bg-bg-elevated p-6">
        <FormField label="Headline" htmlFor="headline">
          <input id="headline" name="headline" required className={fieldClass} placeholder="Reliability over cleverness" />
        </FormField>
        <FormField label="Statement" htmlFor="statement">
          <textarea id="statement" name="statement" rows={2} required className={fieldClass} />
        </FormField>
        <FormField label="Sort order" htmlFor="sort_order">
          <input id="sort_order" name="sort_order" type="number" defaultValue={0} className={fieldClass} />
        </FormField>
        <button type="submit" className="rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-bg">
          Add statement
        </button>
      </CmsForm>

      <div className="mt-8 space-y-3">
        {items && items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className="flex items-start justify-between gap-4 rounded-2xl border border-border p-5">
              <div>
                <p className="font-medium text-foreground">{item.headline}</p>
                <p className="mt-1 text-sm text-muted">{item.statement}</p>
              </div>
              <InlineDeleteButton onConfirm={() => deletePhilosophy(item.id)} />
            </div>
          ))
        ) : (
          <EmptyState title="No statements yet." description="Add your first engineering philosophy statement above." />
        )}
      </div>
    </div>
  );
}
