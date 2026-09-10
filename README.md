# Shobun Kollied Anwar — Portfolio

A premium, dark-luxury personal engineering portfolio with a custom CMS,
built on Next.js and Supabase. See `DESIGN.md` for the full design rationale.

## 1. Overview

- **Public site** (`/`) — hero, about, experience, projects, tech stack,
  engineering philosophy, metrics, contact form. Every section reads from
  Supabase and hides itself gracefully when empty.
- **Case studies** (`/projects/[slug]`) — a dedicated page per project.
- **Admin CMS** (`/admin`) — a custom dashboard (no WordPress, no paid
  CMS) to manage every piece of content, protected by Supabase Auth.

## 2. Requirements

- Node.js 20+
- A free [Supabase](https://supabase.com) project
- A free [Vercel](https://vercel.com) account (for deployment)

## 3. Installation

```bash
npm install
cp .env.example .env.local
```

## 4. Supabase setup

1. Create a new project at [supabase.com](https://supabase.com) (free tier).
2. Go to **Settings → API** and copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret —
     never commit it, never expose it to the browser)

   Paste these into `.env.local`.

## 5. Running the SQL migrations

Run these **in order** — the second migration hardens security on top of
the first and will error if run alone against a fresh database.

1. In the Supabase dashboard, open **SQL Editor**.
2. Copy the entire contents of `supabase/migrations/0001_init.sql`, paste
   into the SQL Editor, and run it. This creates all tables, indexes,
   baseline RLS policies, and seeds a bit of sample content.
3. Then copy the entire contents of
   `supabase/migrations/0002_security_hardening.sql`, paste it in, and
   run it. This adds the `admin_users` allowlist, the `public.is_admin()`
   check, rewires every admin policy to use it, removes the public
   INSERT policy on `contact_messages`, and fixes seed idempotency.

   Alternatively, with the Supabase CLI:
   ```bash
   supabase link --project-ref <your-project-ref>
   supabase db push
   ```

   Both migrations are safe to re-run — they use `if exists` /
   `if not exists` / `on conflict` guards and never truncate data.

## 6. Creating your admin account

**Being signed in is not enough to be an admin.** RLS checks
`public.is_admin()`, which checks membership in the `admin_users` table —
so a Supabase Auth session alone gives no CMS access.

1. In the Supabase dashboard, go to **Authentication → Users → Add user**.
   Create a user with your email and a password. Confirm the email (or
   disable "confirm email" in Authentication → Providers → Email for
   local development).
2. Copy that user's UUID (shown in the Users table).
3. In the **SQL Editor**, run:
   ```sql
   insert into admin_users (user_id) values ('<paste-the-uuid-here>');
   ```
4. Go to `/admin/login` on your site and sign in with that email/password.

There is no public `/admin/register` route and none should be added —
this project intentionally supports exactly the admin(s) you insert into
`admin_users` by hand. If a Supabase Auth user exists but has no
matching `admin_users` row, `/admin/*` will sign them out and redirect
to `/admin/unauthorized`.

## 7. Setting up the Storage bucket

1. In the Supabase dashboard, go to **Storage → New bucket**.
2. Name it exactly `media` and mark it **Public**.
3. The storage policies for this bucket are created by the two
   migrations above (public read; insert/update/delete gated by
   `public.is_admin()`, not merely "authenticated").
4. Once created, go to `/admin/dashboard/media` in your site to upload
   images. Copy a file's URL and paste it into any image field (profile
   photo, project thumbnail, etc.). Uploads are restricted to JPEG,
   PNG, WebP, and AVIF — SVG is intentionally not accepted, since an
   uploaded SVG can carry an embedded `<script>` that would execute in
   a browser opening the file directly.

## 8. Development

```bash
npm run dev
```

Visit `http://localhost:3000` for the public site and
`http://localhost:3000/admin/login` for the CMS.

> Note: `next/font/google` (used for the Geist typeface) needs internet
> access at build/dev time to fetch font files. If you're behind a
> restrictive proxy, either allow `fonts.googleapis.com` /
> `fonts.gstatic.com`, or switch `src/app/layout.tsx` to `next/font/local`
> with self-hosted font files.

## 9. Production deployment (Vercel)

1. Push this repository to GitHub.
2. In Vercel, **Add New Project** → import the repo.
3. Add the four environment variables from `.env.example` in
   **Project Settings → Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` (your production domain, e.g. `https://shobun.dev`)
4. Deploy. Vercel's free tier is sufficient — no dedicated server needed.

## 10. Supabase configuration checklist

- [ ] Project created, API keys copied into `.env.local` / Vercel env vars
- [ ] `0001_init.sql` then `0002_security_hardening.sql` both run successfully, in order
- [ ] Admin user created under Authentication → Users, and its UUID inserted into `admin_users`
- [ ] `media` Storage bucket created and set to Public
- [ ] `NEXT_PUBLIC_SITE_URL` set to your real production domain (affects
      SEO metadata and `sitemap.xml`)

## 11. Security architecture

**Admin authorization** — being signed in via Supabase Auth is not
sufficient to get CMS access. Every admin-only RLS policy (on tables and
on the `media` storage bucket) checks `public.is_admin()`, which looks
up the caller's `auth.uid()` in the `admin_users` table. The `/admin/*`
middleware check mirrors this (redirects to `/admin/unauthorized` and
signs out anyone authenticated-but-not-admin) as a UX convenience — but
the database is what actually enforces it, so this holds even if a
request bypasses the app entirely.

**Contact form** — the browser never has permission to write to
`contact_messages` (no public INSERT policy exists). The only path in is
`POST /api/contact`, which validates with Zod, checks the honeypot field,
applies the rate limiter, and only then inserts using the service-role
client — a server-only client that bypasses RLS and is never imported
into a Client Component or sent to the browser. Reading, updating, or
deleting messages requires an admin session (RLS `is_admin()` again).

## 12. Project structure

```
src/
├── app/
│   ├── (portfolio)/       # public homepage
│   ├── admin/             # login + CMS dashboard (protected by middleware + RLS)
│   ├── api/contact/       # contact form submission endpoint (service-role insert)
│   └── projects/[slug]/   # dynamic case study pages
├── components/
│   ├── ui/                # Container, Section, Button, Badge
│   ├── portfolio/         # Hero, ProfilePortrait, Navigation, sections...
│   ├── admin/              # AdminSidebar, DataTable, forms, EmptyState...
│   └── animations/        # GlowBackground
├── lib/
│   ├── supabase/          # browser / server / middleware / service-role clients
│   ├── actions/           # server actions for each CMS collection
│   ├── validations/       # Zod schemas (shared.ts has optionalUrl/optionalText helpers)
│   └── queries/           # public read queries
├── types/                 # hand-written types matching the DB schema
└── hooks/
```

## 13. What's editable from the CMS

Content that's meant to change per-person or per-project is fully
CMS-managed: profile, hero copy, experiences, projects (including full
case-study fields, a per-project gallery, and OG image), skills grouped
by category, engineering philosophy statements, selected metrics (hidden
until you add real numbers), social links (the single source of truth
used by both the hero and the footer), site-wide SEO settings, and the
media library. No contact details or social links are ever invented as
a fallback — if that data isn't in the database yet, the relevant
element just stays hidden rather than showing a fake placeholder.

A small amount of **fixed editorial copy** is intentionally left in the
component code rather than the database, because it's page furniture,
not per-person content: the "01/02/03" pillar labels in the About
section (`src/components/portfolio/About.tsx`) and the Contact section's
headline/subhead (`src/components/portfolio/Contact.tsx`). Moving these
into the database would add CMS forms and a database round-trip for
text that's realistically only ever edited by opening the file — the
same trade-off most of this codebase makes (page structure and section
order are code too). If you want these editable without a code change,
they'd follow the same pattern as `philosophies` — a small table with a
CMS list page.

## 14. Notes on scaling the contact form's rate limiting

The `/api/contact` route uses a small in-memory rate limiter (resets on
cold start, and on Vercel each serverless instance keeps its own
counter, so it under-counts under real concurrent traffic across
instances) to avoid needing a paid service. If you get real traffic,
swap it for Upstash Redis or Vercel KV (both have free tiers) — the
function signature in `src/app/api/contact/route.ts` is written so that
swap is a small, isolated change.
