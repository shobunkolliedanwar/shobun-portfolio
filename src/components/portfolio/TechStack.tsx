import Image from "next/image";
import { SectionHeading, Section } from "@/components/ui/Section";
import type { Skill, SkillCategory } from "@/types/database";

export function TechStack({
  categories,
}: {
  categories: (SkillCategory & { skills: Skill[] })[];
}) {
  if (categories.length === 0) return null;

  return (
    <Section id="skills">
      <SectionHeading label="Tech stack" title="Tools I reach for." />
      <div className="grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <div key={category.id} className="portfolio-card p-6">
            <h3 className="text-sm text-muted-2">{category.name}</h3>
            <ul className="mt-4 space-y-3 border-t border-border pt-4">
              {category.skills.map((skill) => (
                <li key={skill.id} className="flex items-center gap-3 text-foreground">
                  {skill.icon_url && (
                    <Image
                      src={skill.icon_url}
                      alt=""
                      width={18}
                      height={18}
                      className="opacity-80"
                    />
                  )}
                  {skill.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
