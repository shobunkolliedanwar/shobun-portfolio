import { createClient } from "@/lib/supabase/server";
import { FormField, fieldClass } from "@/components/admin/FormField";
import { EmptyState } from "@/components/admin/EmptyState";
import { InlineDeleteButton } from "@/components/admin/InlineDeleteButton";
import { CmsForm } from "@/components/admin/CmsForm";
import {
  createMetric,
} from "@/lib/actions/metrics";

export default async function AdminMetricsPage() {
  const supabase = await createClient();
  const { data: items } = await supabase.from("metrics").select("*").order("sort_order", { ascending: true });

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-medium text-foreground">Selected metrics</h1>
      <p className="mt-1 text-sm text-muted">
        Real numbers only — leave this empty until you have genuine metrics to show. The section
        hides itself on the public site when empty.
      </p>

      <CmsForm action={createMetric} successMessage="Metric added." className="mt-8 grid grid-cols-1 gap-4 rounded-2xl border border-border bg-bg-elevated p-6 sm:grid-cols-3">
        <FormField label="Value" htmlFor="value" hint='e.g. "4+", "99.9%"'>
          <input id="value" name="value" required className={fieldClass} />
        </FormField>
        <FormField label="Label" htmlFor="label" hint='e.g. "Years Engineering"'>
          <input id="label" name="label" required className={fieldClass} />
        </FormField>
        <FormField label="Sort order" htmlFor="sort_order">
          <input id="sort_order" name="sort_order" type="number" defaultValue={0} className={fieldClass} />
        </FormField>
        <button type="submit" className="col-span-full rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-bg sm:w-fit">
          Add metric
        </button>
      </CmsForm>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {items && items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className="rounded-2xl border border-border p-5">
              <p className="font-mono text-2xl text-foreground">{item.value}</p>
              <p className="mt-1 text-sm text-muted">{item.label}</p>
              <div className="mt-3">
                <InlineDeleteButton
                  id={item.id}
                  type="metric"
                />
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full">
            <EmptyState title="No metrics yet." description="Add a real number above — the section stays hidden until you do." />
          </div>
        )}
      </div>
    </div>
  );
}
