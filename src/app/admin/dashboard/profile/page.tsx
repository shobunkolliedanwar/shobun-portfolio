import { createClient } from "@/lib/supabase/server";
import { FormField, fieldClass } from "@/components/admin/FormField";
import { MediaPickerField } from "@/components/admin/MediaPickerField";
import { CmsForm } from "@/components/admin/CmsForm";
import { updateProfile } from "@/lib/actions/profile";

export default async function AdminProfilePage() {
  const supabase = await createClient();
  const { data: profile } = await supabase.from("profiles").select("*").limit(1).maybeSingle();

  const boundAction = updateProfile.bind(null, profile?.id ?? null);

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-medium text-foreground">Profile</h1>
      <p className="mt-1 text-sm text-muted">
        This powers your hero section and site-wide contact details.
      </p>

      <CmsForm key={`${profile?.id ?? "new"}:${profile?.updated_at ?? ""}:${profile?.resume_url ?? ""}`} resetOnSuccess={false} action={boundAction} successMessage="Profile saved." className="mt-8 space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="Full name" htmlFor="full_name">
            <input id="full_name" name="full_name" defaultValue={profile?.full_name} required className={fieldClass} />
          </FormField>
          <FormField label="Profession" htmlFor="profession">
            <input id="profession" name="profession" defaultValue={profile?.profession} required className={fieldClass} />
          </FormField>
        </div>

        <FormField label="Hero headline" htmlFor="hero_headline" hint="The confident one-liner under your name">
          <input id="hero_headline" name="hero_headline" defaultValue={profile?.hero_headline} required className={fieldClass} />
        </FormField>

        <FormField label="Hero description" htmlFor="hero_description">
          <textarea id="hero_description" name="hero_description" rows={2} defaultValue={profile?.hero_description} required className={fieldClass} />
        </FormField>

        <FormField label="Bio" htmlFor="bio" hint="Shown in the About section">
          <textarea id="bio" name="bio" rows={4} defaultValue={profile?.bio ?? ""} className={fieldClass} />
        </FormField>

        <MediaPickerField
          name="profile_photo_url"
          label="Profile photo"
          defaultValue={profile?.profile_photo_url}
        />

        <div className="rounded-2xl border border-border bg-bg p-5">
          <h2 className="font-semibold text-foreground">CV / Résumé</h2>
          <p className="mt-2 text-sm text-muted">Upload a PDF (maximum 5 MB). The file is uploaded when you save your profile. Your published CV will be publicly downloadable.</p>
          <input type="hidden" name="resume_url" value={profile?.resume_url ?? ""} />
          <label htmlFor="resume_file" className="mt-4 block text-sm text-muted">Upload or replace CV</label>
          <input id="resume_file" name="resume_file" type="file" accept=".pdf,application/pdf" className="mt-2 block w-full rounded-xl border border-border-strong bg-bg-elevated p-3 text-sm text-foreground file:mr-4 file:rounded-lg file:border-0 file:bg-accent-soft file:px-4 file:py-2 file:text-accent" />
          {profile?.resume_url && <div className="mt-4 space-y-3">
            <a href={profile.resume_url} target="_blank" rel="noopener noreferrer" className="inline-block text-sm text-accent hover:underline">View current CV ↗</a>
            <label className="flex items-center gap-2 text-sm text-muted"><input type="checkbox" name="resume_remove" />Remove CV from profile</label>
          </div>}
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="Location" htmlFor="location">
            <input id="location" name="location" defaultValue={profile?.location ?? ""} className={fieldClass} />
          </FormField>
          <FormField label="Availability" htmlFor="availability" hint='e.g. "Available from January 2027" — be specific, not generic'>
            <input id="availability" name="availability" defaultValue={profile?.availability ?? ""} className={fieldClass} />
          </FormField>
          <FormField label="Email" htmlFor="email">
            <input id="email" name="email" type="email" defaultValue={profile?.email ?? ""} className={fieldClass} />
          </FormField>
          <FormField label="Years of experience" htmlFor="years_experience">
            <input id="years_experience" name="years_experience" type="number" step="0.5" defaultValue={profile?.years_experience ?? ""} className={fieldClass} />
          </FormField>
        </div>

        <p className="text-xs text-muted-2">
          GitHub, LinkedIn, and other social profiles are managed on the{" "}
          <a href="/admin/dashboard/social-links" className="text-accent hover:underline">
            Social Links
          </a>{" "}
          page — that&apos;s the single source of truth used by both the hero and the footer.
        </p>

        <label className="flex items-center gap-2 text-sm text-muted">
          <input type="checkbox" name="published" defaultChecked={profile?.published ?? true} /> Published
        </label>

        <button type="submit" className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-bg">
          Save profile
        </button>
      </CmsForm>
    </div>
  );
}
