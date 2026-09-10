export function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-bg-elevated p-6">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 font-mono text-3xl text-foreground">{value}</p>
    </div>
  );
}
