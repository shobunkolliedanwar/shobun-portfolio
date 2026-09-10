-- =========================================================
-- 0002_security_hardening.sql
--
-- Fixes found in code review of 0001_init.sql:
--
-- 1. RLS admin policies used `auth.role() = 'authenticated'`,
--    which treats ANY signed-in Supabase user as an admin. This
--    migration introduces an explicit admin_users allowlist and
--    a public.is_admin() helper, then rewires every admin policy
--    (tables + storage) to check membership in that table.
--
-- 2. contact_messages had a public INSERT policy, so a browser
--    could write directly to Postgres with the anon key and skip
--    the Zod validation, honeypot, and rate limiting that live in
--    /api/contact. That policy is removed; inserts now happen
--    only via the server's service-role client.
--
-- 3. The seed data in 0001 used `on conflict do nothing` without a
--    matching unique constraint on `profiles` and `skill_categories`,
--    so re-running the migration would create duplicate rows. This
--    adds proper singleton/unique constraints and idempotent seeds.
--
-- Run this AFTER 0001_init.sql, on top of an existing database.
-- Nothing here drops or truncates existing data. If your database
-- already has more than one `profiles`/`site_settings` row, or
-- duplicate `skill_categories.name` values, this migration will
-- fail LOUDLY with a clear message rather than silently deleting
-- rows to make a unique index fit — see step 4 below.
-- =========================================================

-- ---------------------------------------------------------
-- 1. Explicit admin allowlist (table -> RLS -> function -> policies,
--    in that exact order, since admin_users' own policy depends on
--    public.is_admin() existing first)
-- ---------------------------------------------------------
create table if not exists admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

alter table admin_users enable row level security;

-- public.is_admin() must exist BEFORE any policy references it.
-- SECURITY DEFINER so it can read admin_users even though the calling
-- role's own RLS on admin_users would otherwise block it (avoids a
-- recursive-policy deadlock) — it only ever checks auth.uid() against
-- the row, never returns data to the caller.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from admin_users where user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated, anon;

-- Now that public.is_admin() exists, it's safe to create policies
-- that call it — including on admin_users itself.
drop policy if exists "admin can read admin_users" on admin_users;
create policy "admin can read admin_users" on admin_users
  for select using (public.is_admin());

-- ---------------------------------------------------------
-- 2. Rewire every admin policy from "any authenticated user"
--    to "public.is_admin()"
-- ---------------------------------------------------------
drop policy if exists "admin full access profiles" on profiles;
create policy "admin full access profiles" on profiles
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin full access social_links" on social_links;
create policy "admin full access social_links" on social_links
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin full access experiences" on experiences;
create policy "admin full access experiences" on experiences
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin full access projects" on projects;
create policy "admin full access projects" on projects
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin full access project_images" on project_images;
create policy "admin full access project_images" on project_images
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin full access skill_categories" on skill_categories;
create policy "admin full access skill_categories" on skill_categories
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin full access skills" on skills;
create policy "admin full access skills" on skills
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin full access philosophies" on philosophies;
create policy "admin full access philosophies" on philosophies
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin full access metrics" on metrics;
create policy "admin full access metrics" on metrics
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin full access site_settings" on site_settings;
create policy "admin full access site_settings" on site_settings
  for all using (public.is_admin()) with check (public.is_admin());

-- contact_messages: remove the public INSERT policy. All inserts now
-- go through the server's service-role client in /api/contact, which
-- bypasses RLS entirely and is never reachable from the browser.
-- Admin (select/update/delete) stays gated by is_admin().
drop policy if exists "public can submit contact message" on contact_messages;
drop policy if exists "admin full access contact_messages" on contact_messages;
create policy "admin full access contact_messages" on contact_messages
  for all using (public.is_admin()) with check (public.is_admin());

-- Storage: same admin rewire.
drop policy if exists "admin write media bucket" on storage.objects;
create policy "admin write media bucket"
  on storage.objects for insert
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "admin update media bucket" on storage.objects;
create policy "admin update media bucket"
  on storage.objects for update
  using (bucket_id = 'media' and public.is_admin());

drop policy if exists "admin delete media bucket" on storage.objects;
create policy "admin delete media bucket"
  on storage.objects for delete
  using (bucket_id = 'media' and public.is_admin());

-- ---------------------------------------------------------
-- 3. Add the singleton/unique columns (no constraint yet — the
--    constraint comes in step 4, after checking for pre-existing
--    duplicates, so this never fails on a table that already has
--    rows).
-- ---------------------------------------------------------
alter table profiles add column if not exists is_singleton boolean not null default true;
alter table site_settings add column if not exists is_singleton boolean not null default true;

-- ---------------------------------------------------------
-- 4. Fail loudly on pre-existing duplicates instead of silently
--    reconciling them. Deleting "extra" profile/settings/category
--    rows to force a unique index to fit would be a genuine data-loss
--    decision (which row is "the real one"?) that this migration is
--    not in a position to make safely. If you hit one of these
--    exceptions, manually review and merge/delete the duplicate rows
--    yourself, then re-run this migration.
-- ---------------------------------------------------------
do $$
begin
  if (select count(*) from profiles) > 1 then
    raise exception
      'profiles has % rows — this table is meant to hold exactly one. '
      'Manually review and delete/merge the extra row(s), then re-run this migration.',
      (select count(*) from profiles);
  end if;

  if (select count(*) from site_settings) > 1 then
    raise exception
      'site_settings has % rows — this table is meant to hold exactly one. '
      'Manually review and delete/merge the extra row(s), then re-run this migration.',
      (select count(*) from site_settings);
  end if;

  if exists (
    select 1 from skill_categories group by name having count(*) > 1
  ) then
    raise exception
      'skill_categories has duplicate name values. Deleting duplicates '
      'automatically would cascade-delete the skills under them, so this '
      'migration will not do it silently. Manually reassign skills to one '
      'category per name, delete the duplicate category rows, then re-run.';
  end if;
end $$;

-- Safe now: at most one profiles/site_settings row, and skill_categories
-- names are already unique, so these indexes/constraints cannot fail.
create unique index if not exists profiles_singleton on profiles(is_singleton);
create unique index if not exists site_settings_singleton on site_settings(is_singleton);
create unique index if not exists skill_categories_name_unique on skill_categories(name);

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'profiles_singleton_true') then
    alter table profiles add constraint profiles_singleton_true check (is_singleton = true);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'site_settings_singleton_true') then
    alter table site_settings add constraint site_settings_singleton_true check (is_singleton = true);
  end if;
end $$;

-- ---------------------------------------------------------
-- 5. Idempotent re-seed. Safe to run multiple times.
-- ---------------------------------------------------------
insert into profiles (full_name, profession, hero_headline, hero_description, bio, location, availability, years_experience, published)
select 'Shobun Kollied Anwar',
       'Backend Developer & Software Engineer',
       'Engineering reliable systems behind great digital experiences.',
       'Backend-focused software engineer building APIs, web platforms, and systems designed to be understood, trusted, and safely changed.',
       'Backend-focused software engineer with 4+ years of experience building APIs, web platforms, and reliable backend systems. Primary experience in Laravel and Next.js, with a focus on backend architecture, database design, and API integration.',
       'Indonesia',
       'Available from January 2027',
       4,
       true
where not exists (select 1 from profiles);

insert into skill_categories (name, sort_order)
select v.name, v.sort_order
from (values ('Backend', 1), ('Frontend', 2), ('Database', 3), ('Infrastructure', 4), ('Tools', 5)) as v(name, sort_order)
on conflict (name) do nothing;

-- The Coin Catcher seed year in 0001 was an invented placeholder —
-- clear it here so the CMS doesn't display a fabricated date.
update projects set project_year = null where slug = 'coin-catcher' and project_year = 2025;
