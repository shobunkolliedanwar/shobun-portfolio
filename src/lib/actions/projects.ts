"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { optionalUrl, optionalText } from "@/lib/validations/shared";

const projectSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens"),
  short_description: optionalText,
  long_description: optionalText,
  problem: optionalText,
  solution: optionalText,
  architecture: optionalText,
  challenges: optionalText,
  results: optionalText,
  lessons_learned: optionalText,
  technologies: z.string().optional(), // comma-separated in the form
  responsibilities: z.string().optional(), // one per line in the form
  thumbnail_url: optionalUrl,
  hero_image_url: optionalUrl,
  og_image_url: optionalUrl,
  github_url: optionalUrl,
  live_url: optionalUrl,
  project_type: optionalText,
  project_year: z.coerce.number().optional(),
  sort_order: z.coerce.number().default(0),
  featured: z.boolean(),
  published: z.boolean(),
  seo_title: optionalText,
  seo_description: optionalText,
});

function parseFormData(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = projectSchema.safeParse({
    ...raw,
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid project data.");
  }

  return {
    title: parsed.data.title,
    slug: parsed.data.slug,
    short_description: parsed.data.short_description ?? null,
    long_description: parsed.data.long_description ?? null,
    problem: parsed.data.problem ?? null,
    solution: parsed.data.solution ?? null,
    architecture: parsed.data.architecture ?? null,
    challenges: parsed.data.challenges ?? null,
    results: parsed.data.results ?? null,
    lessons_learned: parsed.data.lessons_learned ?? null,
    technologies: parsed.data.technologies
      ? parsed.data.technologies.split(",").map((t) => t.trim()).filter(Boolean)
      : [],
    responsibilities: parsed.data.responsibilities
      ? parsed.data.responsibilities.split("\n").map((r) => r.trim()).filter(Boolean)
      : [],
    thumbnail_url: parsed.data.thumbnail_url ?? null,
    hero_image_url: parsed.data.hero_image_url ?? null,
    og_image_url: parsed.data.og_image_url ?? null,
    github_url: parsed.data.github_url ?? null,
    live_url: parsed.data.live_url ?? null,
    project_type: parsed.data.project_type ?? null,
    project_year: parsed.data.project_year ?? null,
    sort_order: parsed.data.sort_order,
    featured: parsed.data.featured,
    published: parsed.data.published,
    seo_title: parsed.data.seo_title ?? null,
    seo_description: parsed.data.seo_description ?? null,
  };
}

export async function createProject(formData: FormData) {
  const data = parseFormData(formData);
  const supabase = await createClient();

  const { error } = await supabase.from("projects").insert(data);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/dashboard/projects");
  revalidatePath("/");
  redirect("/admin/dashboard/projects");
}

export async function updateProject(id: string, formData: FormData) {
  const data = parseFormData(formData);
  const supabase = await createClient();

  const { error } = await supabase.from("projects").update(data).eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/dashboard/projects");
  revalidatePath(`/projects/${data.slug}`);
  revalidatePath("/");
  redirect("/admin/dashboard/projects");
}

export async function deleteProject(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/dashboard/projects");
  revalidatePath("/");
}

// --- Project gallery (project_images) ---

const galleryImageSchema = z.object({
  project_id: z.string().uuid(),
  image_url: z.string().trim().url("Must be a valid URL"),
  alt_text: optionalText,
  sort_order: z.coerce.number().default(0),
});

export async function addProjectImage(formData: FormData) {
  const parsed = galleryImageSchema.safeParse({
    project_id: formData.get("project_id"),
    image_url: formData.get("image_url"),
    alt_text: formData.get("alt_text"),
    sort_order: formData.get("sort_order") || 0,
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid image data.");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("project_images").insert({
    project_id: parsed.data.project_id,
    image_url: parsed.data.image_url,
    alt_text: parsed.data.alt_text ?? null,
    sort_order: parsed.data.sort_order,
  });

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/dashboard/projects/${parsed.data.project_id}/gallery`);
  revalidatePath("/");
}

export async function deleteProjectImage(id: string, projectId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("project_images").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/dashboard/projects/${projectId}/gallery`);
  revalidatePath("/");
}
