import { Section } from "@/components/ui/Section";
import type { Profile } from "@/types/database";

const PILLARS = [
  { n: "01", title: "Backend Engineering", desc: "APIs, services, and data models built to hold up under real usage." },
  { n: "02", title: "System Thinking", desc: "Understanding how a change ripples through the rest of the system." },
  { n: "03", title: "Product Development", desc: "Shipping features that solve the actual business problem." },
];

export function About({ profile }: { profile: Profile }) {
  return (
    <Section id="about">
      <div className="grid grid-cols-1 gap-16 md:grid-cols-[0.7fr_1.3fr]">
        <div>
          <p className="font-mono text-sm text-accent">About</p>
          {profile.years_experience && (
            <p className="mt-4 text-8xl font-medium tracking-tight text-accent md:text-9xl">
              {profile.years_experience}+
            </p>
          )}
          <p className="mt-2 text-muted">Years of experience</p>
        </div>

        <div>
          <p className="text-balance text-2xl font-medium leading-snug tracking-tight text-foreground md:text-3xl">
            {profile.bio ?? profile.hero_description}
          </p>

          <ul className="mt-12 divide-y divide-border border-y border-border">
            {PILLARS.map((pillar) => (
              <li key={pillar.n} className="flex items-start gap-6 py-6">
                <span className="font-mono text-sm text-muted-2">{pillar.n}</span>
                <div>
                  <p className="font-medium text-foreground">{pillar.title}</p>
                  <p className="mt-1 text-sm text-muted">{pillar.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
