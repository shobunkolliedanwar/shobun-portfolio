// Hand-written types matching supabase/migrations/0001_init.sql.
// Once the project is linked to a real Supabase instance, replace with
// generated types: `supabase gen types typescript --linked > src/types/database.ts`

export interface Profile {
  id: string;
  full_name: string;
  profession: string;
  hero_headline: string;
  hero_description: string;
  bio: string | null;
  profile_photo_url: string | null;
  resume_url: string | null;
  location: string | null;
  availability: string | null;
  email: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  years_experience: number | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface SocialLink {
  id: string;
  label: string;
  url: string;
  icon: string | null;
  sort_order: number;
  published: boolean;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  employment_type: string | null;
  location: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
  achievements: string[] | null;
  technologies: string[] | null;
  company_logo_url: string | null;
  company_url: string | null;
  sort_order: number;
  published: boolean;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  long_description: string | null;
  problem: string | null;
  solution: string | null;
  responsibilities: string[] | null;
  architecture: string | null;
  challenges: string | null;
  results: string | null;
  lessons_learned: string | null;
  technologies: string[] | null;
  thumbnail_url: string | null;
  hero_image_url: string | null;
  github_url: string | null;
  live_url: string | null;
  project_type: string | null;
  project_year: number | null;
  featured: boolean;
  published: boolean;
  seo_title: string | null;
  seo_description: string | null;
  og_image_url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
}

export interface SkillCategory {
  id: string;
  name: string;
  sort_order: number;
}

export interface Skill {
  id: string;
  category_id: string;
  name: string;
  icon_url: string | null;
  sort_order: number;
  published: boolean;
}

export interface Philosophy {
  id: string;
  headline: string;
  statement: string;
  sort_order: number;
  published: boolean;
}

export interface Metric {
  id: string;
  value: string;
  label: string;
  sort_order: number;
  published: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  company: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface SiteSettings {
  id: string;
  site_title: string | null;
  site_description: string | null;
  favicon_url: string | null;
  default_og_image_url: string | null;
}

// Minimal Supabase generic Database shape (kept loose deliberately —
// swap for generated types once linked to a live project).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Database = any;
