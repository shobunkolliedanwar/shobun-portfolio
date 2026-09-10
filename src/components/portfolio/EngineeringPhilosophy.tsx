import { SectionHeading, Section } from "@/components/ui/Section";
import type { Philosophy } from "@/types/database";

export function EngineeringPhilosophy({ items }: { items: Philosophy[] }) {
  if (items.length === 0) return null;

  return (
    <Section id="philosophy" className="border-y border-border bg-bg-elevated/40">
      <SectionHeading title="Good software isn't only about making things work." />
      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.id} className="bg-bg p-8">
            <p className="font-medium text-foreground">{item.headline}</p>
            <p className="mt-2 text-sm text-muted">{item.statement}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
