import { createClient } from "@/lib/supabase/server";
import { FormField, fieldClass } from "@/components/admin/FormField";
import { EmptyState } from "@/components/admin/EmptyState";
import { InlineDeleteButton } from "@/components/admin/InlineDeleteButton";
import { CmsForm } from "@/components/admin/CmsForm";
import { createSocialLink } from "@/lib/actions/social-links";

export default async function AdminSocialLinksPage() {
  const supabase = await createClient();
  const { data: items } = await supabase.from("social_links").select("*").order("sort_order", { ascending: true });

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-medium text-foreground">Social links</h1>
      <p className="mt-1 text-sm text-muted">Shown in the footer.</p>

      <CmsForm action={createSocialLink} successMessage="Link added." className="mt-8 grid grid-cols-1 gap-4 rounded-2xl border border-border bg-bg-elevated p-6 sm:grid-cols-3">
        <FormField label="Label" htmlFor="label">
          <input id="label" name="label" required className={fieldClass} placeholder="GitHub" />
        </FormField>
        <FormField label="URL" htmlFor="url">
          <input id="url" name="url" required className={fieldClass} placeholder="https://github.com/..." />
        </FormField>
        <FormField label="Sort order" htmlFor="sort_order">
          <input id="sort_order" name="sort_order" type="number" defaultValue={0} className={fieldClass} />
        </FormField>
        <button type="submit" className="col-span-full rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-bg sm:w-fit">
          Add link
        </button>
      </CmsForm>

      <div className="mt-8 space-y-3">
        {items && items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-2xl border border-border p-4">
              <div>
                <p className="font-medium text-foreground">{item.label}</p>
                <p className="text-sm text-muted">{item.url}</p>
              </div>
              <InlineDeleteButton
                id={item.id}
                type="social-link"
              />
            </div>
          ))
        ) : (
          <EmptyState title="No social links yet." description="Add GitHub, LinkedIn, or anything else you'd like in the footer." />
        )}
      </div>
    </div>
  );
}
