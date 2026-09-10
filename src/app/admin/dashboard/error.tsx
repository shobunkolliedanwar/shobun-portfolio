"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function AdminDashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <div className="rounded-full bg-red-500/10 p-3 text-red-400">
        <AlertTriangle size={20} />
      </div>
      <h1 className="mt-4 text-lg font-medium text-foreground">Something went wrong</h1>
      <p className="mt-2 max-w-sm text-sm text-muted">
        {error.message || "The action couldn't be completed. Nothing else on the site was affected."}
      </p>
      <div className="mt-6 flex gap-3">
        <button
          onClick={reset}
          className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-bg"
        >
          Try again
        </button>
        <Link
          href="/admin/dashboard"
          className="rounded-full border border-border-strong px-5 py-2.5 text-sm text-foreground hover:border-accent/60 hover:text-accent"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
