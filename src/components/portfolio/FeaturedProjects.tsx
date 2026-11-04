"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading, Section } from "@/components/ui/Section";
import { TechBadge } from "@/components/ui/Badge";

import type { Project } from "@/types/database";

export function FeaturedProjects({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;

  return (
    <Section id="projects">
      <SectionHeading
        label="Selected work"
        title="Projects built end to end."
        description="Backend architecture, APIs, and the systems behind them."
      />

      <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
        {projects.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="portfolio-card group overflow-hidden"
          >
            <div className="relative aspect-[16/10] overflow-hidden border-b border-border bg-bg-elevated">
              {project.thumbnail_url ? (
                <Image
                  src={project.thumbnail_url}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-mono text-xs text-muted-2">
                  {project.title}
                </div>
              )}
            </div>

            <div className="p-7">
              <p className="font-mono text-sm text-muted-2">
                {String(i + 1).padStart(2, "0")}
                {project.project_year ? ` · ${project.project_year}` : ""}
              </p>
              <h3 className="mt-3 text-2xl font-medium tracking-tight text-foreground md:text-3xl">
                {project.title}
              </h3>
              {project.short_description && (
                <p className="mt-3 max-w-md text-muted">{project.short_description}</p>
              )}
              {project.technologies && project.technologies.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {project.technologies.map((t) => (
                    <TechBadge key={t}>{t}</TechBadge>
                  ))}
                </div>
              )}
              <Link
                href={`/projects/${project.slug}`}
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-accent"
              >
                View case study <ArrowUpRight size={16} />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
