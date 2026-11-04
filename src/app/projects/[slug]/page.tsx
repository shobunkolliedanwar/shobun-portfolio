import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Code2, Globe } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { TechBadge } from "@/components/ui/Badge";
import { getAllProjects, getProjectBySlug, getProfile, getSiteSettings } from "@/lib/queries/portfolio";
import { createStaticClient } from "@/lib/supabase/server";

export async function generateStaticParams() {
  // generateStaticParams runs at build time with no HTTP request, so it
  // cannot use the cookie-based server client (getAllProjects() does,
  // via createClient() -> cookies()). Query directly with the cookie-free
  // static client instead — RLS still restricts this to published rows.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return [];
  const supabase = createStaticClient();
  const { data: projects } = await supabase.from("projects").select("slug").eq("published", true);
  return (projects ?? []).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [project, settings] = await Promise.all([getProjectBySlug(slug), getSiteSettings()]);
  if (!project) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  // Fallback hierarchy: project's own OG image -> hero/thumbnail image ->
  // site-wide default OG image. Never fabricated.
  const ogImage =
    project.og_image_url || project.hero_image_url || project.thumbnail_url || settings?.default_og_image_url || undefined;

  return {
    title: project.seo_title || project.title,
    description: project.seo_description || project.short_description || undefined,
    alternates: { canonical: `${siteUrl}/projects/${project.slug}` },
    openGraph: ogImage ? { images: [ogImage] } : undefined,
    twitter: {
      card: "summary_large_image",
      title: project.seo_title || project.title,
      description: project.seo_description || project.short_description || undefined,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

// A labelled block that hides itself entirely when the section is empty.
function CaseStudySection({ title, children }: { title: string; children?: React.ReactNode }) {
  if (!children) return null;
  return (
    <div className="border-t border-border py-10">
      <h2 className="font-mono text-sm text-accent">{title}</h2>
      <div className="mt-4 max-w-2xl text-muted">{children}</div>
    </div>
  );
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const allProjects = await getAllProjects();
  const currentIndex = allProjects.findIndex((p) => p.slug === slug);
  const nextProject = allProjects[(currentIndex + 1) % allProjects.length];

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const profile = await getProfile();

  // Real fields only — omit anything the project doesn't actually have
  // rather than fabricating a date, author, or metric.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    url: `${siteUrl}/projects/${project.slug}`,
    ...(project.short_description ? { description: project.short_description } : {}),
    ...(project.project_year ? { dateCreated: String(project.project_year) } : {}),
    ...(profile ? { author: { "@type": "Person", name: profile.full_name } } : {}),
    ...(project.technologies && project.technologies.length > 0
      ? { keywords: project.technologies.join(", ") }
      : {}),
  };

  return (
    <main className="pb-24 pt-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Container>
        <Link href="/#projects" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground">
          <ArrowLeft size={14} /> Back to projects
        </Link>

        <header className="mt-10 max-w-3xl">
          {project.project_year && (
            <p className="font-mono text-sm text-muted-2">{project.project_year}</p>
          )}
          <h1 className="mt-3 text-balance text-5xl font-medium leading-[1.05] tracking-tight text-foreground md:text-6xl">
            {project.title}
          </h1>
          {project.short_description && (
            <p className="mt-5 max-w-xl text-balance text-lg text-muted">{project.short_description}</p>
          )}
          <div className="mt-7 flex flex-wrap gap-3">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-border-strong px-4 py-2 text-sm hover:border-accent/60 hover:text-accent"
              >
                <Code2 size={14} /> Source
              </a>
            )}
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-border-strong px-4 py-2 text-sm hover:border-accent/60 hover:text-accent"
              >
                <Globe size={14} /> Live site
              </a>
            )}
          </div>
        </header>

        {/* Project at a glance — only the fields that actually have data */}
        {(project.project_type || project.project_year || (project.technologies && project.technologies.length > 0)) && (
          <dl className="mt-10 grid max-w-3xl grid-cols-2 gap-x-8 gap-y-5 border-y border-border py-6 sm:grid-cols-3">
            {project.project_type && (
              <div>
                <dt className="font-mono text-xs text-muted-2">Type</dt>
                <dd className="mt-1 text-sm text-foreground">{project.project_type}</dd>
              </div>
            )}
            {project.project_year && (
              <div>
                <dt className="font-mono text-xs text-muted-2">Year</dt>
                <dd className="mt-1 text-sm text-foreground">{project.project_year}</dd>
              </div>
            )}
            {project.technologies && project.technologies.length > 0 && (
              <div className="col-span-2 sm:col-span-1">
                <dt className="font-mono text-xs text-muted-2">Stack</dt>
                <dd className="mt-1 text-sm text-foreground">{project.technologies.join(", ")}</dd>
              </div>
            )}
          </dl>
        )}

        {project.hero_image_url && (
          <div className="relative mt-14 aspect-video overflow-hidden rounded-2xl border border-border bg-bg-elevated">
            <Image src={project.hero_image_url} alt={project.title} fill className="object-cover" priority />
          </div>
        )}

        <div className="mt-4 max-w-3xl">
          <CaseStudySection title="Overview">{project.long_description}</CaseStudySection>
          <CaseStudySection title="Problem">{project.problem}</CaseStudySection>
          <CaseStudySection title="Solution">{project.solution}</CaseStudySection>
          {project.responsibilities && project.responsibilities.length > 0 && (
            <CaseStudySection title="Responsibilities">
              <ul className="space-y-2">
                {project.responsibilities.map((r, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-2" /> {r}
                  </li>
                ))}
              </ul>
            </CaseStudySection>
          )}

          {/* Technical approach gets distinct treatment — an inset panel
              with an accent rule, since this content is structural
              (how it's built) rather than narrative prose like the
              sections around it. */}
          {project.architecture && (
            <div className="border-t border-border py-10">
              <h2 className="font-mono text-sm text-accent">Technical Approach</h2>
              <div className="mt-4 max-w-2xl border-l-2 border-accent/30 bg-bg-elevated/60 py-4 pl-6 text-muted">
                {project.architecture}
              </div>
            </div>
          )}

          <CaseStudySection title="Challenges">{project.challenges}</CaseStudySection>
          <CaseStudySection title="Results">{project.results}</CaseStudySection>
          <CaseStudySection title="Lessons Learned">{project.lessons_learned}</CaseStudySection>

          {project.technologies && project.technologies.length > 0 && (
            <div className="border-t border-border py-10">
              <h2 className="font-mono text-sm text-accent">Tech stack</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.technologies.map((t) => (
                  <TechBadge key={t}>{t}</TechBadge>
                ))}
              </div>
            </div>
          )}
        </div>

        {project.images.length > 0 && (
          <div className="mt-4 border-t border-border py-12">
            <h2 className="font-mono text-sm text-accent">Gallery</h2>
            <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2">
              {project.images.map((img) => (
                <figure key={img.id}>
                  <div className="relative aspect-video overflow-hidden rounded-xl border border-border">
                    <Image src={img.image_url} alt={img.alt_text ?? ""} fill className="object-cover" />
                  </div>
                  {img.alt_text && (
                    <figcaption className="mt-2 text-sm text-muted-2">{img.alt_text}</figcaption>
                  )}
                </figure>
              ))}
            </div>
          </div>
        )}

        {nextProject && nextProject.slug !== project.slug && (
          <Link
            href={`/projects/${nextProject.slug}`}
            className="mt-16 flex items-center justify-between border-t border-border pt-10 group"
          >
            <div>
              <p className="text-sm text-muted-2">Next project</p>
              <p className="mt-1 text-xl font-medium text-foreground">{nextProject.title}</p>
            </div>
            <ArrowRight className="text-muted transition-transform group-hover:translate-x-1 group-hover:text-accent" />
          </Link>
        )}
      </Container>
    </main>
  );
}
