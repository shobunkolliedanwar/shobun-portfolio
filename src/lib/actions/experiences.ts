"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { optionalUrl, optionalText } from "@/lib/validations/shared";

const experienceSchema = z.object({
  company: z.string().trim().min(1, "Company is required"),
  role: z.string().trim().min(1, "Role is required"),
  employment_type: optionalText,
  location: optionalText,
  start_date: z.string().trim().min(1, "Start date is required"),
  end_date: optionalText,
  is_current: z.boolean(),
  description: optionalText,
  achievements: z.string().optional(), // one per line in the form
  technologies: z.string().optional(), // comma-separated in the form
  company_logo_url: optionalUrl,
  company_url: optionalUrl,
  sort_order: z.coerce.number().default(0),
  published: z.boolean(),
});

function parseExperienceForm(formData: FormData) {
  const parsed = experienceSchema.safeParse({
    company: formData.get("company"),
    role: formData.get("role"),
    employment_type: formData.get("employment_type"),
    location: formData.get("location"),
    start_date: formData.get("start_date"),
    end_date: formData.get("end_date"),
    is_current: formData.get("is_current") === "on",
    description: formData.get("description"),
    achievements: formData.get("achievements"),
    technologies: formData.get("technologies"),
    company_logo_url: formData.get("company_logo_url"),
    company_url: formData.get("company_url"),
    sort_order: formData.get("sort_order") || 0,
    published: formData.get("published") === "on",
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid experience data.");
  }

  return {
    company: parsed.data.company,
    role: parsed.data.role,
    employment_type: parsed.data.employment_type ?? null,
    location: parsed.data.location ?? null,
    start_date: parsed.data.start_date,
    end_date: parsed.data.end_date ?? null,
    is_current: parsed.data.is_current,
    description: parsed.data.description ?? null,
    achievements: parsed.data.achievements
      ? parsed.data.achievements.split("\n").map((s) => s.trim()).filter(Boolean)
      : [],
    technologies: parsed.data.technologies
      ? parsed.data.technologies.split(",").map((s) => s.trim()).filter(Boolean)
      : [],
    company_logo_url: parsed.data.company_logo_url ?? null,
    company_url: parsed.data.company_url ?? null,
    sort_order: parsed.data.sort_order,
    published: parsed.data.published,
  };
}

export async function createExperience(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("experiences").insert(parseExperienceForm(formData));
  if (error) throw new Error(error.message);
  revalidatePath("/admin/dashboard/experiences");
  revalidatePath("/");
  redirect("/admin/dashboard/experiences");
}

export async function updateExperience(id: string, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("experiences")
    .update(parseExperienceForm(formData))
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/dashboard/experiences");
  revalidatePath("/");
  redirect("/admin/dashboard/experiences");
}

export async function deleteExperience(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("experiences").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/dashboard/experiences");
  revalidatePath("/");
}
