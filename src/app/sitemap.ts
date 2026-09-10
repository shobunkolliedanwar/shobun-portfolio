import type { MetadataRoute } from "next";
import { getAllProjects, getProfile } from "@/lib/queries/portfolio";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const [projects, profile] = await Promise.all([getAllProjects(), getProfile()]);

  return [
    {
      url: siteUrl,
      lastModified: profile?.updated_at ? new Date(profile.updated_at) : undefined,
      priority: 1,
    },
    // getAllProjects() already filters to published = true only.
    ...projects.map((project) => ({
      url: `${siteUrl}/projects/${project.slug}`,
      lastModified: project.updated_at ? new Date(project.updated_at) : undefined,
      priority: 0.8,
    })),
  ];
}
