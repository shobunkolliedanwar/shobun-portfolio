"use client";

import { useTransition } from "react";
import { Mail, MailOpen, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { markMessageRead, deleteMessage } from "@/lib/actions/messages";
import type { ContactMessage } from "@/types/database";

export function MessageCard({ message }: { message: ContactMessage }) {
  const [isPending, startTransition] = useTransition();

  function handleToggleRead() {
    startTransition(async () => {
      try {
        await markMessageRead(message.id, !message.is_read);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Couldn't update this message.");
      }
    });
  }

  function handleDelete() {
    startTransition(async () => {
      try {
        await deleteMessage(message.id);
        toast.success("Message deleted.");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Couldn't delete this message.");
      }
    });
  }

  return (
    <div
      className={`rounded-2xl border p-5 ${
        message.is_read ? "border-border bg-bg-elevated" : "border-accent/40 bg-accent-soft"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-medium text-foreground">{message.name}</p>
          <a href={`mailto:${message.email}`} className="text-sm text-muted hover:text-foreground">
            {message.email}
          </a>
          {message.company && <p className="text-sm text-muted-2">{message.company}</p>}
        </div>
        <p className="shrink-0 text-xs text-muted-2">
          {new Date(message.created_at).toLocaleString()}
        </p>
      </div>

      <p className="mt-4 whitespace-pre-wrap text-sm text-muted">{message.message}</p>

      <div className="mt-4 flex items-center gap-4">
        <button
          disabled={isPending}
          onClick={handleToggleRead}
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
        >
          {message.is_read ? <Mail size={14} /> : <MailOpen size={14} />}
          {message.is_read ? "Mark unread" : "Mark read"}
        </button>
        <button
          disabled={isPending}
          onClick={handleDelete}
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-red-400"
        >
          <Trash2 size={14} /> Delete
        </button>
      </div>
    </div>
  );
}
