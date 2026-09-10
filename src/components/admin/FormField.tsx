export function FormField({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="mb-2 block text-sm text-muted">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-muted-2">{hint}</span>}
    </label>
  );
}

export const fieldClass =
  "w-full rounded-xl border border-border-strong bg-bg px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent";
