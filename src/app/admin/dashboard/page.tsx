import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/admin/StatCard";
import { EmptyState } from "@/components/admin/EmptyState";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [projects, experiences, skills, messages, unread, recentMessages] = await Promise.all([
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase.from("experiences").select("id", { count: "exact", head: true }),
    supabase.from("skills").select("id", { count: "exact", head: true }),
    supabase.from("contact_messages").select("id", { count: "exact", head: true }),
    supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("is_read", false),
    supabase
      .from("contact_messages")
      .select("id, name, email, message, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-medium text-foreground">Dashboard</h1>
      <p className="mt-1 text-sm text-muted">An overview of your portfolio content.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Projects" value={projects.count ?? 0} />
        <StatCard label="Experiences" value={experiences.count ?? 0} />
        <StatCard label="Skills" value={skills.count ?? 0} />
        <StatCard label="Unread messages" value={unread.count ?? 0} />
      </div>

      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium text-foreground">Recent messages</h2>
          <Link href="/admin/dashboard/messages" className="text-sm text-accent hover:underline">
            View all ({messages.count ?? 0})
          </Link>
        </div>

        {recentMessages.data && recentMessages.data.length > 0 ? (
          <div className="divide-y divide-border rounded-2xl border border-border bg-bg-elevated">
            {recentMessages.data.map((m) => (
              <div key={m.id} className="p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-foreground">{m.name}</p>
                  <p className="text-xs text-muted-2">
                    {new Date(m.created_at).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-sm text-muted">{m.email}</p>
                <p className="mt-2 line-clamp-2 text-sm text-muted">{m.message}</p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No messages yet."
            description="Contact form submissions will show up here."
          />
        )}
      </div>
    </div>
  );
}
