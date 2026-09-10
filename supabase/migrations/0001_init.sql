-- =========================================================
-- Shobun Portfolio — initial schema
-- Run this in Supabase SQL Editor (or `supabase db push`)
-- =========================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------
-- updated_at trigger helper
-- ---------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ---------------------------------------------------------
-- profiles  (single row: the site owner)
-- ---------------------------------------------------------
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  profession text not null,
  hero_headline text not null,
  hero_description text not null,
  bio text,
  profile_photo_url text,
  resume_url text,
  location text,
  availability text, -- e.g. "Available for new roles"
  email text,
  github_url text,
  linkedin_url text,
  years_experience numeric,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_profiles_updated before update on profiles
  for each row execute function set_updated_at();

-- ---------------------------------------------------------
-- social_links
-- ---------------------------------------------------------
create table if not exists social_links (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  url text not null,
  icon text,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_social_links_updated before update on social_links
  for each row execute function set_updated_at();

-- ---------------------------------------------------------
-- experiences
-- ---------------------------------------------------------
create table if not exists experiences (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  role text not null,
  employment_type text, -- Full-time, Contract, Freelance...
  location text,
  start_date date not null,
  end_date date,
  is_current boolean not null default false,
  description text,
  achievements text[], -- bullet list
  technologies text[],
  company_logo_url text,
  company_url text,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_experiences_updated before update on experiences
  for each row execute function set_updated_at();
create index if not exists idx_experiences_sort on experiences(sort_order);

-- ---------------------------------------------------------
-- projects
-- ---------------------------------------------------------
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  short_description text,
  long_description text,
  problem text,
  solution text,
  responsibilities text[],
  architecture text,
  challenges text,
  results text,
  lessons_learned text,
  technologies text[],
  thumbnail_url text,
  hero_image_url text,
  github_url text,
  live_url text,
  project_type text, -- Personal, Client, Open Source...
  project_year int,
  featured boolean not null default false,
  published boolean not null default true,
  seo_title text,
  seo_description text,
  og_image_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_projects_updated before update on projects
  for each row execute function set_updated_at();
create index if not exists idx_projects_slug on projects(slug);
create index if not exists idx_projects_sort on projects(sort_order);
create index if not exists idx_projects_featured on projects(featured) where featured = true;

-- ---------------------------------------------------------
-- project_images (gallery)
-- ---------------------------------------------------------
create table if not exists project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  image_url text not null,
  alt_text text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists idx_project_images_project on project_images(project_id);

-- ---------------------------------------------------------
-- skill_categories + skills
-- ---------------------------------------------------------
create table if not exists skill_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null, -- Backend, Frontend, Database, Infrastructure, Tools
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_skill_categories_updated before update on skill_categories
  for each row execute function set_updated_at();

create table if not exists skills (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references skill_categories(id) on delete cascade,
  name text not null,
  icon_url text,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_skills_updated before update on skills
  for each row execute function set_updated_at();
create index if not exists idx_skills_category on skills(category_id);

-- ---------------------------------------------------------
-- philosophies (engineering philosophy statements)
-- ---------------------------------------------------------
create table if not exists philosophies (
  id uuid primary key default gen_random_uuid(),
  headline text not null,
  statement text not null,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_philosophies_updated before update on philosophies
  for each row execute function set_updated_at();

-- ---------------------------------------------------------
-- metrics (selected impact numbers)
-- ---------------------------------------------------------
create table if not exists metrics (
  id uuid primary key default gen_random_uuid(),
  value text not null, -- "4+", "99.9%"
  label text not null, -- "Years Engineering"
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_metrics_updated before update on metrics
  for each row execute function set_updated_at();

-- ---------------------------------------------------------
-- contact_messages
-- ---------------------------------------------------------
create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  message text not null,
  is_read boolean not null default false,
  ip_hash text, -- for basic rate limiting, never store raw IP
  created_at timestamptz not null default now()
);
create index if not exists idx_contact_messages_created on contact_messages(created_at desc);
create index if not exists idx_contact_messages_unread on contact_messages(is_read) where is_read = false;

-- ---------------------------------------------------------
-- site_settings (single row key/value-ish)
-- ---------------------------------------------------------
create table if not exists site_settings (
  id uuid primary key default gen_random_uuid(),
  site_title text,
  site_description text,
  favicon_url text,
  default_og_image_url text,
  updated_at timestamptz not null default now()
);
create trigger trg_site_settings_updated before update on site_settings
  for each row execute function set_updated_at();

-- =========================================================
-- ROW LEVEL SECURITY
-- Public: read-only, published rows only.
-- Authenticated (admin): full CRUD.
-- contact_messages: public may INSERT only, never SELECT.
-- =========================================================

alter table profiles enable row level security;
alter table social_links enable row level security;
alter table experiences enable row level security;
alter table projects enable row level security;
alter table project_images enable row level security;
alter table skill_categories enable row level security;
alter table skills enable row level security;
alter table philosophies enable row level security;
alter table metrics enable row level security;
alter table contact_messages enable row level security;
alter table site_settings enable row level security;

-- Public SELECT on published content
create policy "public read published profiles" on profiles
  for select using (published = true);
create policy "public read published social_links" on social_links
  for select using (published = true);
create policy "public read published experiences" on experiences
  for select using (published = true);
create policy "public read published projects" on projects
  for select using (published = true);
create policy "public read project_images of published projects" on project_images
  for select using (
    exists (select 1 from projects p where p.id = project_images.project_id and p.published = true)
  );
create policy "public read skill_categories" on skill_categories
  for select using (true);
create policy "public read published skills" on skills
  for select using (published = true);
create policy "public read published philosophies" on philosophies
  for select using (published = true);
create policy "public read published metrics" on metrics
  for select using (published = true);
create policy "public read site_settings" on site_settings
  for select using (true);

-- Authenticated full access (admin is the only authenticated user)
create policy "admin full access profiles" on profiles
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin full access social_links" on social_links
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin full access experiences" on experiences
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin full access projects" on projects
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin full access project_images" on project_images
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin full access skill_categories" on skill_categories
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin full access skills" on skills
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin full access philosophies" on philosophies
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin full access metrics" on metrics
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin full access site_settings" on site_settings
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- contact_messages: public can INSERT, never SELECT/UPDATE/DELETE.
-- Admin can do everything (to read + mark as read).
create policy "public can submit contact message" on contact_messages
  for insert with check (true);
create policy "admin full access contact_messages" on contact_messages
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- =========================================================
-- STORAGE
-- Run after creating a public bucket named "media" in the
-- Supabase dashboard (Storage → New bucket → public = true).
-- =========================================================
-- Public can read all objects in the media bucket.
create policy "public read media bucket"
  on storage.objects for select
  using (bucket_id = 'media');

-- Only authenticated (admin) can upload/update/delete.
create policy "admin write media bucket"
  on storage.objects for insert
  with check (bucket_id = 'media' and auth.role() = 'authenticated');

create policy "admin update media bucket"
  on storage.objects for update
  using (bucket_id = 'media' and auth.role() = 'authenticated');

create policy "admin delete media bucket"
  on storage.objects for delete
  using (bucket_id = 'media' and auth.role() = 'authenticated');

-- =========================================================
-- SEED — sample content so the design is visible immediately.
-- All of this is editable via the CMS afterward.
-- =========================================================
insert into profiles (full_name, profession, hero_headline, hero_description, bio, location, availability, email, github_url, linkedin_url, years_experience, published)
values (
  'Shobun Kollied Anwar',
  'Backend Developer & Software Engineer',
  'Engineering reliable systems behind great digital experiences.',
  'Backend-focused software engineer building APIs, web platforms, and systems designed to be understood, trusted, and safely changed.',
  'Backend-focused software engineer with 4+ years of experience building APIs, web platforms, and reliable backend systems. Primary experience in Laravel and Next.js, with a focus on backend architecture, database design, and API integration.',
  'Indonesia',
  'Available for new opportunities',
  'hello@example.com',
  'https://github.com/',
  'https://linkedin.com/',
  4,
  true
) on conflict do nothing;

insert into skill_categories (name, sort_order) values
  ('Backend', 1), ('Frontend', 2), ('Database', 3), ('Infrastructure', 4), ('Tools', 5)
on conflict do nothing;

insert into projects (title, slug, short_description, technologies, project_type, project_year, featured, published, sort_order)
values (
  'Coin Catcher',
  'coin-catcher',
  'A reward-based web game platform with backend APIs and player progression systems.',
  array['Laravel', 'PostgreSQL', 'Next.js'],
  'Personal',
  2025,
  true,
  true,
  1
) on conflict (slug) do nothing;
