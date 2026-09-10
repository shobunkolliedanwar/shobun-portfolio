"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Briefcase,
  FolderKanban,
  Wrench,
  Quote,
  BarChart3,
  Share2,
  Image as ImageIcon,
  Inbox,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { createClient } from "@/lib/supabase/client";

const NAV = [
  { section: "", items: [{ label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard }] },
  {
    section: "Content",
    items: [
      { label: "Profile", href: "/admin/dashboard/profile", icon: User },
      { label: "Experiences", href: "/admin/dashboard/experiences", icon: Briefcase },
      { label: "Projects", href: "/admin/dashboard/projects", icon: FolderKanban },
      { label: "Skills", href: "/admin/dashboard/skills", icon: Wrench },
      { label: "Philosophy", href: "/admin/dashboard/philosophy", icon: Quote },
      { label: "Metrics", href: "/admin/dashboard/metrics", icon: BarChart3 },
      { label: "Social Links", href: "/admin/dashboard/social-links", icon: Share2 },
    ],
  },
  { section: "Media", items: [{ label: "Media Library", href: "/admin/dashboard/media", icon: ImageIcon }] },
  { section: "Inbox", items: [{ label: "Messages", href: "/admin/dashboard/messages", icon: Inbox }] },
  { section: "Settings", items: [{ label: "Site Settings", href: "/admin/dashboard/settings", icon: Settings }] },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="mt-8 flex-1 space-y-6 overflow-y-auto">
      {NAV.map((group) => (
        <div key={group.section || "root"}>
          {group.section && <p className="mb-2 px-3 text-xs text-muted-2">{group.section}</p>}
          <div className="space-y-1">
            {group.items.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-white/[0.06] text-foreground"
                      : "text-muted hover:bg-white/[0.03] hover:text-foreground"
                  )}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

function SignOutButton() {
  const router = useRouter();
  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }
  return (
    <button
      onClick={handleLogout}
      className="mt-4 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted hover:bg-white/[0.03] hover:text-foreground"
    >
      <LogOut size={16} /> Sign out
    </button>
  );
}

export function AdminSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop: fixed sidebar */}
      <aside className="hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-bg-elevated p-5 md:sticky md:top-0 md:flex">
        <Link href="/admin/dashboard" className="font-mono text-sm text-foreground">
          Admin<span className="text-accent">.</span>CMS
        </Link>
        <NavLinks />
        <SignOutButton />
      </aside>

      {/* Mobile: top bar + drawer */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-bg-elevated p-4 md:hidden">
        <Link href="/admin/dashboard" className="font-mono text-sm text-foreground">
          Admin<span className="text-accent">.</span>CMS
        </Link>
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          className="p-2 text-foreground"
        >
          <Menu size={20} />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            aria-label="Close menu"
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col border-r border-border bg-bg-elevated p-5">
            <div className="flex items-center justify-between">
              <Link href="/admin/dashboard" className="font-mono text-sm text-foreground" onClick={() => setOpen(false)}>
                Admin<span className="text-accent">.</span>CMS
              </Link>
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="p-1 text-muted">
                <X size={18} />
              </button>
            </div>
            <NavLinks onNavigate={() => setOpen(false)} />
            <SignOutButton />
          </aside>
        </div>
      )}
    </>
  );
}
