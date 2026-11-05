# Get My CV

1. Run `supabase/migrations/0004_cv_storage.sql` in your Supabase SQL Editor. Existing migrations 0001 and 0002 must already be applied. This creates a public PDF-only `cvs` bucket, limits files to 5 MB, and restricts writes to admins. It does not create a new database table.
2. Keep your existing `.env.local`; it is not included in the archive. Restart `npm run dev` after updating the files because next.config.ts changed.
3. Go to Admin → Profile → CV / Résumé. Select your PDF and click Save profile. Keep Published enabled for the profile to be visible publicly.
4. Open Home and click Get My CV. `/api/cv` returns the PDF as an attachment using the profile owner's name.

Storage URL is saved in the existing `profiles.resume_url` column. Uploads validate size, MIME type, extension and PDF signature. Current CV remains linked if upload fails. Replacements use unique filenames. Removing the CV unlinks it from the profile; previously uploaded public files remain in Storage and can be managed there.

If an old resume URL points outside your Supabase project, upload its PDF again in Profile to enable direct download. Files in this project's public media bucket remain compatible if their URL ends in .pdf.

Changed files:
- next.config.ts
- src/app/api/cv/route.ts (new)
- src/app/admin/dashboard/profile/page.tsx
- src/lib/actions/profile.ts
- src/components/portfolio/Hero.tsx
- supabase/migrations/0004_cv_storage.sql (new)
