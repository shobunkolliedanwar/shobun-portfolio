import { SectionHeading, Section } from "@/components/ui/Section";
import { TechBadge } from "@/components/ui/Badge";
import type { Experience } from "@/types/database";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
});

function formatDate(value: string) {
  // Database date values are calendar dates: keep them stable across time zones.
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : dateFormatter.format(date);
}

function formatRange(exp: Experience) {
  const start = formatDate(exp.start_date);
  const end = exp.is_current ? "Present" : exp.end_date ? formatDate(exp.end_date) : "";
  return end ? `${start} — ${end}` : start;
}

export function ExperienceTimeline({ experiences }: { experiences: Experience[] }) {
  if (experiences.length === 0) return null;

  return (
    <Section id="experience">
      <SectionHeading label="Experience" title="Where I've built things." />

      <ol className="relative border-l border-border pl-8">
        {experiences.map((exp) => (
          <li key={exp.id} className="relative pb-14 last:pb-0">
            <span className="absolute -left-[calc(2rem+4.5px)] top-1.5 h-2 w-2 rounded-full bg-accent" />
            <p className="font-mono text-sm text-muted-2">{formatRange(exp)}</p>
            <h3 className="mt-2 text-xl font-medium text-foreground">{exp.role}</h3>
            <p className="mt-1 text-muted">
              {exp.company}
              {exp.employment_type ? ` · ${exp.employment_type}` : ""}
              {exp.location ? ` · ${exp.location}` : ""}
            </p>
            {exp.description && <p className="mt-4 max-w-2xl text-muted">{exp.description}</p>}
            {exp.achievements && exp.achievements.length > 0 && (
              <ul className="mt-4 space-y-2">
                {exp.achievements.map((a, i) => (
                  <li key={i} className="flex gap-3 text-sm text-muted">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-2" />
                    {a}
                  </li>
                ))}
              </ul>
            )}
            {exp.technologies && exp.technologies.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {exp.technologies.map((t) => (
                  <TechBadge key={t}>{t}</TechBadge>
                ))}
              </div>
            )}
          </li>
        ))}
      </ol>
    </Section>
  );
}
