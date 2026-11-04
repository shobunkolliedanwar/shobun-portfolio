"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, PanelTop } from "lucide-react";
export function AdminTopbar() {
 const pathname = usePathname();
 const segment = pathname.split("/")[3] ?? "Overview";
 const title = segment.replaceAll("-", " ");
 return <header className="admin-topbar flex min-h-20 items-center justify-between gap-4 px-5 md:px-10"><div className="flex items-center gap-3"><PanelTop size={18} className="text-accent"/><p className="text-sm text-muted">Workspace <span className="px-2 text-muted-2">/</span><span className="capitalize font-medium text-foreground">{title}</span></p></div><Link href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl border border-border bg-bg-elevated px-3 py-2 text-xs font-medium">View portfolio <ArrowUpRight size={14}/></Link></header>;
}
