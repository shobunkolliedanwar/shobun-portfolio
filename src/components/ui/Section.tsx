import { cn } from "@/lib/utils/cn";
import { Container } from "./Container";

export function Section({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("py-24 md:py-32", className)}>
      <Container>{children}</Container>
    </section>
  );
}

export function SectionHeading({
  label,
  title,
  description,
}: {
  label?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-14 max-w-2xl">
      {label && (
        <p className="mb-3 font-mono text-sm text-accent">{label}</p>
      )}
      <h2 className="text-balance text-3xl font-medium tracking-tight text-foreground md:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 max-w-lg text-balance text-muted">{description}</p>
      )}
    </div>
  );
}
