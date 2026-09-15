# Portfolio review update

Code changes included:
- Hero CTA no longer points to an empty Projects section.
- If projects exist, the primary CTA is `View my work`.
- If projects are empty but a Resume URL exists, the primary CTA becomes `View résumé`.
- If both are empty, the primary CTA becomes `Contact me`.
- When projects and a resume both exist, `View résumé` is shown as a secondary CTA.
- Contact copy is now more focused on remote backend engineering opportunities.
- Fallback profession is now `Backend Software Engineer`.

## CMS content to update

These values live in Supabase, so changing source code alone will not overwrite them.

### Profile
- Profession: `Backend Software Engineer`
- Hero headline: `Engineering reliable systems behind great digital experiences.`
- Hero description: `Backend-focused software engineer building APIs, web platforms, and systems designed to be understood, trusted, and safely changed.`
- Add your real Resume URL when the CV is ready.

### Tech stack organization
Recommended categories:
1. Languages — PHP, Go, Java, Python, JavaScript, TypeScript
2. Frameworks — Laravel, Express.js, Django, Play Framework, Next.js
3. Databases — PostgreSQL, SQL
4. Backend & Architecture — REST APIs, API Integration, Database Design, Query Optimization, Backend Architecture
5. Infrastructure & Tools — Docker, Docker Compose, Git, GitHub, Supabase
6. Engineering Practices — API Testing, Debugging, Code Review

Only keep technologies/practices you can genuinely discuss from experience.

### Experience
Do not invent metrics. Rewrite responsibility-only bullets into Action -> Scope -> Impact when you have factual scope/impact information available.

## Experience copy polish

Added `supabase/migrations/0003_polish_experience_copy.sql` to update the existing Infomedia and Telkomsigma records with the reviewed, impact-oriented copy. It also standardizes the role to `Backend Developer` and `REST APIs` terminology. No fabricated performance, scale, or business-impact metrics were added.

For an already-deployed Supabase database, apply the migration with your normal Supabase migration workflow, or copy its two `UPDATE` statements into the Supabase SQL Editor. The source code alone cannot overwrite CMS records in an existing remote database.
