# Portfolio Studio — redesign

## What changed
- Public portfolio: navy and mint identity, larger editorial typography, new hero, architecture illustration when no portrait is configured, floating navigation, two-column project cards, skill cards, contact panel and metric strip.
- Admin: light content workspace, navy navigation, page breadcrumb, portfolio preview link, real database content counts, quick actions, refreshed forms, tables, media and login.
- Responsive mobile navigation and reduced-motion support retained.
- Existing Supabase queries, content editing actions, uploads and contact API retained.
- Repaired the original root layout (it contained the admin shell and lacked html/body). Replaced the original invalid middleware entry with Next.js proxy while preserving session and admin membership checks. Missing Supabase configuration keeps admin routes closed and allows a public fallback.

## Run locally
1. Keep your existing `.env.local` in the project root. It is deliberately excluded from this archive.
2. Run `npm ci`.
3. Run `npm run dev`.
4. Open http://localhost:3000 and http://localhost:3000/admin/login.

No database migration is needed for this redesign. Use the existing Supabase project and admin account. Existing content and real profile photos are read from the CMS.

## Verification
- TypeScript check passed.
- See build result reported with the delivery.
- Browser visual verification was unavailable because the separate preview browser could not reach the local server. Authenticated admin workflows require a valid owner session and should be checked in your environment.
