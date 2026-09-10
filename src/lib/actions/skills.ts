"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { optionalUrl } from "@/lib/validations/shared";

const skillCategorySchema = z.object({
  name: z.string().trim().min(1, "Category name is required"),
  sort_order: z.coerce.number().default(0),
});

const skillSchema = z.object({
  category_id: z.string().trim().uuid("Invalid category"),
  name: z.string().trim().min(1, "Skill name is required"),
  icon_url: optionalUrl,
  sort_order: z.coerce.number().default(0),
});

export async function createSkillCategory(formData: FormData) {
  const parsed = skillCategorySchema.safeParse({
    name: formData.get("name"),
    sort_order: formData.get("sort_order") || 0,
  });
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid category.");

  const supabase = await createClient();
  const { error } = await supabase.from("skill_categories").insert(parsed.data);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/dashboard/skills");
  revalidatePath("/");
}

export async function deleteSkillCategory(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("skill_categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/dashboard/skills");
  revalidatePath("/");
}

export async function createSkill(formData: FormData) {
  const parsed = skillSchema.safeParse({
    category_id: formData.get("category_id"),
    name: formData.get("name"),
    icon_url: formData.get("icon_url"),
    sort_order: formData.get("sort_order") || 0,
  });
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid skill.");

  const supabase = await createClient();
  const { error } = await supabase.from("skills").insert({
    category_id: parsed.data.category_id,
    name: parsed.data.name,
    icon_url: parsed.data.icon_url ?? null,
    sort_order: parsed.data.sort_order,
    published: true,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/dashboard/skills");
  revalidatePath("/");
}

export async function deleteSkill(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("skills").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/dashboard/skills");
  revalidatePath("/");
}
