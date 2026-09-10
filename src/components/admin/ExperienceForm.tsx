import { FormField, fieldClass } from "@/components/admin/FormField";
import type { Experience } from "@/types/database";

export function ExperienceForm({
  action,
  experience,
}: {
  action: (formData: FormData) => Promise<void>;
  experience?: Experience;
}) {
  return (
    <form action={action} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField label="Company" htmlFor="company">
          <input id="company" name="company" defaultValue={experience?.company} required className={fieldClass} />
        </FormField>
        <FormField label="Role" htmlFor="role">
          <input id="role" name="role" defaultValue={experience?.role} required className={fieldClass} />
        </FormField>
        <FormField label="Employment type" htmlFor="employment_type" hint="Full-time, Contract, Freelance...">
          <input id="employment_type" name="employment_type" defaultValue={experience?.employment_type ?? ""} className={fieldClass} />
        </FormField>
        <FormField label="Location" htmlFor="location">
          <input id="location" name="location" defaultValue={experience?.location ?? ""} className={fieldClass} />
        </FormField>
        <FormField label="Start date" htmlFor="start_date">
          <input
            id="start_date"
            name="start_date"
            type="date"
            defaultValue={experience?.start_date}
            required
            className={fieldClass}
          />
        </FormField>
        <FormField label="End date" htmlFor="end_date" hint="Leave blank if current">
          <input id="end_date" name="end_date" type="date" defaultValue={experience?.end_date ?? ""} className={fieldClass} />
        </FormField>
        <FormField label="Sort order" htmlFor="sort_order">
          <input id="sort_order" name="sort_order" type="number" defaultValue={experience?.sort_order ?? 0} className={fieldClass} />
        </FormField>
        <FormField label="Company URL" htmlFor="company_url">
          <input id="company_url" name="company_url" defaultValue={experience?.company_url ?? ""} className={fieldClass} />
        </FormField>
        <FormField label="Company logo URL" htmlFor="company_logo_url">
          <input id="company_logo_url" name="company_logo_url" defaultValue={experience?.company_logo_url ?? ""} className={fieldClass} />
        </FormField>
      </div>

      <FormField label="Description" htmlFor="description">
        <textarea id="description" name="description" rows={3} defaultValue={experience?.description ?? ""} className={fieldClass} />
      </FormField>

      <FormField label="Achievements" htmlFor="achievements" hint="One per line">
        <textarea
          id="achievements"
          name="achievements"
          rows={4}
          defaultValue={experience?.achievements?.join("\n") ?? ""}
          className={fieldClass}
        />
      </FormField>

      <FormField label="Technologies" htmlFor="technologies" hint="Comma-separated">
        <input
          id="technologies"
          name="technologies"
          defaultValue={experience?.technologies?.join(", ") ?? ""}
          className={fieldClass}
        />
      </FormField>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm text-muted">
          <input type="checkbox" name="is_current" defaultChecked={experience?.is_current} /> Current role
        </label>
        <label className="flex items-center gap-2 text-sm text-muted">
          <input type="checkbox" name="published" defaultChecked={experience?.published ?? true} /> Published
        </label>
      </div>

      <button type="submit" className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-bg">
        {experience ? "Save changes" : "Add experience"}
      </button>
    </form>
  );
}
