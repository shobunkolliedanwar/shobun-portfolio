import { Container } from "@/components/ui/Container";
import type { Metric } from "@/types/database";

export function SelectedMetrics({ metrics }: { metrics: Metric[] }) {
  if (metrics.length === 0) return null;

  return (
    <section className="py-20">
      <Container>
        <div className="grid grid-cols-2 gap-6 rounded-3xl border border-border bg-bg-elevated p-8 md:p-12 sm:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.id}>
              <p className="font-mono text-3xl text-accent md:text-4xl">{metric.value}</p>
              <p className="mt-2 text-sm text-muted">{metric.label}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
