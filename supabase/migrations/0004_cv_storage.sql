-- Apply once using Supabase SQL Editor, after migrations 0001 and 0002.
-- Existing profiles.resume_url stores the CV URL; no new table is needed.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('cvs', 'cvs', true, 5242880, array['application/pdf'])
on conflict (id) do update set public = true, file_size_limit = 5242880, allowed_mime_types = array['application/pdf'];

drop policy if exists "public read CVs" on storage.objects;
create policy "public read CVs" on storage.objects for select to public using (bucket_id = 'cvs');
drop policy if exists "admin insert CVs" on storage.objects;
create policy "admin insert CVs" on storage.objects for insert to authenticated with check (bucket_id = 'cvs' and public.is_admin());
drop policy if exists "admin update CVs" on storage.objects;
create policy "admin update CVs" on storage.objects for update to authenticated using (bucket_id = 'cvs' and public.is_admin()) with check (bucket_id = 'cvs' and public.is_admin());
drop policy if exists "admin delete CVs" on storage.objects;
create policy "admin delete CVs" on storage.objects for delete to authenticated using (bucket_id = 'cvs' and public.is_admin());
