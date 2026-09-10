import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-6">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-bg-elevated p-8 text-center">
        <p className="font-mono text-sm text-accent">403</p>
        <h1 className="mt-2 text-xl font-medium text-foreground">Not authorized</h1>
        <p className="mt-2 text-sm text-muted">
          This account exists but isn&apos;t on the admin allowlist. You&apos;ve been signed out.
        </p>
        <Link
          href="/admin/login"
          className="mt-6 inline-block rounded-full border border-border-strong px-5 py-2.5 text-sm text-foreground hover:border-accent/60 hover:text-accent"
        >
          Back to sign in
        </Link>
      </div>
    </main>
  );
}
