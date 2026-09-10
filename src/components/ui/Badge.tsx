import { cn } from "@/lib/utils/cn";

export function TechBadge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "rounded-full border border-border px-3 py-1 font-mono text-xs text-muted",
        className
      )}
    >
      {children}
    </span>
  );
}
