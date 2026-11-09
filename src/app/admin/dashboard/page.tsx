import { createClient } from "@/lib/supabase/server";
import { EmptyState } from "@/components/admin/EmptyState";
import { MessageCard } from "@/components/admin/MessageCard";

export default async function AdminMessagesPage() {
  const supabase = await createClient();
  const { data: messages } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-medium text-foreground">Messages</h1>
      <p className="mt-1 text-sm text-muted">Submissions from your contact form.</p>

      <div className="mt-8 space-y-4">
        {messages && messages.length > 0 ? (
          messages.map((m) => <MessageCard key={m.id} message={m} />)
        ) : (
          <EmptyState title="No messages yet." description="Contact form submissions will show up here." />
        )}
      </div>
    </div>
  );
}
