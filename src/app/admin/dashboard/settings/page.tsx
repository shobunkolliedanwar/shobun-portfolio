import { createClient } from "@/lib/supabase/server";
import { FormField, fieldClass } from "@/components/admin/FormField";
import { MediaPickerField } from "@/components/admin/MediaPickerField";
import { CmsForm } from "@/components/admin/CmsForm";
import { updateSiteSettings } from "@/lib/actions/settings";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data: settings, error } = await supabase.from("site_settings").select("*").limit(1).maybeSingle();

  if (error) throw new Error("Unable to load site settings. Please try again.");

  const boundAction = updateSiteSettings.bind(null, settings?.id ?? null);

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-medium text-foreground">Site settings</h1>
      <p className="mt-1 text-sm text-muted">Set the browser tab title, search description, favicon, and default social share image. Page-specific project SEO takes priority.</p>

      <CmsForm resetOnSuccess={false} action={boundAction} successMessage="Settings saved." className="mt-8 space-y-5">
        <FormField label="Site title" htmlFor="site_title">
          <input id="site_title" name="site_title" defaultValue={settings?.site_title ?? ""} className={fieldClass} />
        </FormField>
        <FormField label="Site description" htmlFor="site_description">
          <textarea id="site_description" name="site_description" rows={2} defaultValue={settings?.site_description ?? ""} className={fieldClass} />
        </FormField>
        <MediaPickerField name="favicon_url" label="Favicon" defaultValue={settings?.favicon_url} />
        <MediaPickerField name="default_og_image_url" label="Default OG image" defaultValue={settings?.default_og_image_url} />
        <button type="submit" className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-bg">
          Save settings
        </button>
      </CmsForm>
    </div>
  );
}
