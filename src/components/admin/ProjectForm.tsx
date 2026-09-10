import { FormField, fieldClass } from "@/components/admin/FormField";
import { MediaPickerField } from "@/components/admin/MediaPickerField";
import type { Project } from "@/types/database";

export function ProjectForm({
  action,
  project,
}: {
  action: (formData: FormData) => Promise<void>;
  project?: Project;
}) {
  return (
    <form action={action} className="space-y-10">
      <section>
        <h2 className="text-sm text-accent">Basic information</h2>
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="Title" htmlFor="title">
            <input id="title" name="title" defaultValue={project?.title} required className={fieldClass} />
          </FormField>
          <FormField label="Slug" htmlFor="slug" hint="Lowercase letters, numbers, hyphens only">
            <input id="slug" name="slug" defaultValue={project?.slug} required className={fieldClass} />
          </FormField>
          <FormField label="Year" htmlFor="project_year">
            <input
              id="project_year"
              name="project_year"
              type="number"
              defaultValue={project?.project_year ?? undefined}
              className={fieldClass}
            />
          </FormField>
          <FormField label="Type" htmlFor="project_type">
            <input id="project_type" name="project_type" defaultValue={project?.project_type ?? ""} className={fieldClass} />
          </FormField>
          <FormField label="Sort order" htmlFor="sort_order" hint="Lower numbers show first">
            <input id="sort_order" name="sort_order" type="number" defaultValue={project?.sort_order ?? 0} className={fieldClass} />
          </FormField>
        </div>
        <FormField label="Short description" htmlFor="short_description">
          <textarea
            id="short_description"
            name="short_description"
            rows={2}
            defaultValue={project?.short_description ?? ""}
            className={`${fieldClass} mt-4`}
          />
        </FormField>
        <div className="mt-4 flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm text-muted">
            <input type="checkbox" name="featured" defaultChecked={project?.featured} /> Featured
          </label>
          <label className="flex items-center gap-2 text-sm text-muted">
            <input type="checkbox" name="published" defaultChecked={project?.published ?? true} /> Published
          </label>
        </div>
      </section>

      <section>
        <h2 className="text-sm text-accent">Media</h2>
        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <MediaPickerField name="thumbnail_url" label="Thumbnail" defaultValue={project?.thumbnail_url} />
          <MediaPickerField name="hero_image_url" label="Hero image" defaultValue={project?.hero_image_url} />
        </div>
      </section>

      <section>
        <h2 className="text-sm text-accent">Case study</h2>
        <div className="mt-4 space-y-5">
          <FormField label="Overview" htmlFor="long_description">
            <textarea id="long_description" name="long_description" rows={3} defaultValue={project?.long_description ?? ""} className={fieldClass} />
          </FormField>
          <FormField label="Problem" htmlFor="problem">
            <textarea id="problem" name="problem" rows={2} defaultValue={project?.problem ?? ""} className={fieldClass} />
          </FormField>
          <FormField label="Solution" htmlFor="solution">
            <textarea id="solution" name="solution" rows={2} defaultValue={project?.solution ?? ""} className={fieldClass} />
          </FormField>
          <FormField label="Responsibilities" htmlFor="responsibilities" hint="One per line — shown as a bullet list on the case study page">
            <textarea
              id="responsibilities"
              name="responsibilities"
              rows={4}
              defaultValue={project?.responsibilities?.join("\n") ?? ""}
              className={fieldClass}
            />
          </FormField>
          <FormField label="Technical approach / architecture" htmlFor="architecture">
            <textarea id="architecture" name="architecture" rows={2} defaultValue={project?.architecture ?? ""} className={fieldClass} />
          </FormField>
          <FormField label="Challenges" htmlFor="challenges">
            <textarea id="challenges" name="challenges" rows={2} defaultValue={project?.challenges ?? ""} className={fieldClass} />
          </FormField>
          <FormField label="Results" htmlFor="results">
            <textarea id="results" name="results" rows={2} defaultValue={project?.results ?? ""} className={fieldClass} />
          </FormField>
          <FormField label="Lessons learned" htmlFor="lessons_learned">
            <textarea id="lessons_learned" name="lessons_learned" rows={2} defaultValue={project?.lessons_learned ?? ""} className={fieldClass} />
          </FormField>
        </div>
      </section>

      <section>
        <h2 className="text-sm text-accent">Technology &amp; links</h2>
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="Technologies" htmlFor="technologies" hint="Comma-separated, e.g. Laravel, PostgreSQL, Next.js">
            <input
              id="technologies"
              name="technologies"
              defaultValue={project?.technologies?.join(", ") ?? ""}
              className={fieldClass}
            />
          </FormField>
          <FormField label="GitHub URL" htmlFor="github_url">
            <input id="github_url" name="github_url" defaultValue={project?.github_url ?? ""} className={fieldClass} />
          </FormField>
          <FormField label="Live URL" htmlFor="live_url">
            <input id="live_url" name="live_url" defaultValue={project?.live_url ?? ""} className={fieldClass} />
          </FormField>
        </div>
      </section>

      <section>
        <h2 className="text-sm text-accent">SEO</h2>
        <div className="mt-4 space-y-5">
          <FormField label="SEO title" htmlFor="seo_title">
            <input id="seo_title" name="seo_title" defaultValue={project?.seo_title ?? ""} className={fieldClass} />
          </FormField>
          <FormField label="SEO description" htmlFor="seo_description">
            <textarea id="seo_description" name="seo_description" rows={2} defaultValue={project?.seo_description ?? ""} className={fieldClass} />
          </FormField>
          <MediaPickerField
            name="og_image_url"
            label="OG image"
            defaultValue={project?.og_image_url}
            hint="Falls back to hero/thumbnail image, then the site default, if left empty"
          />
        </div>
      </section>

      {project && (
        <section>
          <h2 className="text-sm text-accent">Gallery</h2>
          <p className="mt-2 text-sm text-muted">
            Manage this project&apos;s gallery images{" "}
            <a href={`/admin/dashboard/projects/${project.id}/gallery`} className="text-accent hover:underline">
              on its own page
            </a>{" "}
            (save this form first if you have unsaved changes).
          </p>
        </section>
      )}

      <button type="submit" className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-bg">
        {project ? "Save changes" : "Create project"}
      </button>
    </form>
  );
}
