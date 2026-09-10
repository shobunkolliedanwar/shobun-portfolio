import { createClient } from "@/lib/supabase/server";
import { FormField, fieldClass } from "@/components/admin/FormField";
import { EmptyState } from "@/components/admin/EmptyState";
import { InlineDeleteButton } from "@/components/admin/InlineDeleteButton";
import { CmsForm } from "@/components/admin/CmsForm";
import {
  createSkill,
  createSkillCategory,
} from "@/lib/actions/skills";

export default async function AdminSkillsPage() {
  const supabase = await createClient();
  const [{ data: categories }, { data: skills }] = await Promise.all([
    supabase.from("skill_categories").select("*").order("sort_order", { ascending: true }),
    supabase.from("skills").select("*").order("sort_order", { ascending: true }),
  ]);

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-medium text-foreground">Tech stack &amp; skills</h1>
      <p className="mt-1 text-sm text-muted">Grouped by category — no percentage bars.</p>

      <CmsForm
        action={createSkillCategory}
        successMessage="Category added."
        className="mt-8 flex flex-wrap items-end gap-4 rounded-2xl border border-border bg-bg-elevated p-6"
      >
        <FormField label="New category" htmlFor="name" hint="e.g. Backend, Frontend, Database">
          <input id="name" name="name" required className={fieldClass} />
        </FormField>
        <FormField label="Sort order" htmlFor="sort_order">
          <input id="sort_order" name="sort_order" type="number" defaultValue={0} className={fieldClass} />
        </FormField>
        <button type="submit" className="rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-bg">
          Add category
        </button>
      </CmsForm>

      <div className="mt-8 space-y-6">
        {categories && categories.length > 0 ? (
          categories.map((category) => {
            const categorySkills = (skills ?? []).filter((s) => s.category_id === category.id);
            return (
              <div key={category.id} className="rounded-2xl border border-border p-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-medium text-foreground">{category.name}</h2>
                  <InlineDeleteButton
                    id={category.id}
                    type="skill-category"
                  />
                </div>

                <ul className="mt-4 space-y-2">
                  {categorySkills.map((skill) => (
                    <li key={skill.id} className="flex items-center justify-between rounded-lg bg-bg-elevated px-3 py-2 text-sm">
                      <span className="text-foreground">{skill.name}</span>
                      <InlineDeleteButton
                        id={skill.id}
                        type="skill"
                      />
                    </li>
                  ))}
                </ul>

                <CmsForm action={createSkill} successMessage="Skill added." className="mt-4 flex flex-wrap items-end gap-3">
                  <input type="hidden" name="category_id" value={category.id} />
                  <FormField label="Add skill" htmlFor={`skill-${category.id}`}>
                    <input id={`skill-${category.id}`} name="name" required className={fieldClass} />
                  </FormField>
                  <button type="submit" className="rounded-full border border-border-strong px-4 py-2 text-sm text-foreground hover:border-accent/60 hover:text-accent">
                    Add
                  </button>
                </CmsForm>
              </div>
            );
          })
        ) : (
          <EmptyState title="No categories yet." description="Add a category above (e.g. Backend) to start listing skills." />
        )}
      </div>
    </div>
  );
}
