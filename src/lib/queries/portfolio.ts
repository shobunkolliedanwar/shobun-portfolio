import { createClient } from "@/lib/supabase/server";
import type {
  Experience,
  Metric,
  Philosophy,
  Profile,
  Project,
  ProjectImage,
  SkillCategory,
  Skill,
  SiteSettings,
  SocialLink,
} from "@/types/database";

/**
 * All queries here read only `published = true` rows, enforced twice:
 * once by RLS in Postgres, once by the query itself for clarity.
 * Every function returns `null` / `[]` gracefully on empty data so
 * sections can hide themselves instead of crashing.
 */

export async function getProfile(): Promise<Profile | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("published", true)
    .limit(1)
    .maybeSingle();
  return data;
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("social_links")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getExperiences(): Promise<Experience[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("experiences")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("start_date", { ascending: false });
  return data ?? [];
}

export async function getFeaturedProjects(): Promise<Project[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("published", true)
    .eq("featured", true)
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getAllProjects(): Promise<Project[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getProjectBySlug(
  slug: string
): Promise<(Project & { images: ProjectImage[] }) | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return null;
  const supabase = await createClient();
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (!project) return null;

  const { data: images } = await supabase
    .from("project_images")
    .select("*")
    .eq("project_id", project.id)
    .order("sort_order", { ascending: true });

  return { ...project, images: images ?? [] };
}

export async function getSkillCategoriesWithSkills(): Promise<
  (SkillCategory & { skills: Skill[] })[]
> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return [];
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("skill_categories")
    .select("*")
    .order("sort_order", { ascending: true });

  const { data: skills } = await supabase
    .from("skills")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });

  return (categories ?? [])
    .map((category) => ({
      ...category,
      skills: (skills ?? []).filter((s) => s.category_id === category.id),
    }))
    .filter((category) => category.skills.length > 0);
}

export async function getPhilosophies(): Promise<Philosophy[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("philosophies")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getMetrics(): Promise<Metric[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("metrics")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return null;
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("*").limit(1).maybeSingle();
  return data;
}
