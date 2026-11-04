import { ArrowUpRight } from "lucide-react";
export function StatCard({ label, value }: { label: string; value: number }) {
 return <div className="rounded-2xl border border-border bg-bg-elevated p-6 shadow-sm"><div className="flex items-center justify-between"><p className="text-sm text-muted">{label}</p><span className="rounded-lg bg-accent-soft p-2 text-accent"><ArrowUpRight size={16}/></span></div><p className="mt-5 text-4xl font-semibold tracking-tight text-foreground">{value}</p><p className="mt-2 text-xs text-muted-2">In your workspace</p></div>;
}
