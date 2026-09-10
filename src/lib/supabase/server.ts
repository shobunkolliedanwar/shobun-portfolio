import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

/**
 * Supabase client for use in Server Components, Server Actions, and
 * Route Handlers. Reads/writes the auth session via Next.js cookies.
 * Uses the public anon key — RLS enforces what an authenticated admin
 * session can do. Never import the service role key here.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component with no request context to
            // mutate — safe to ignore because middleware refreshes the
            // session on every request.
          }
        },
      },
    }
  );
}

/**
 * Privileged server-only client using the service role key. Bypasses RLS.
 * Only ever import this inside Route Handlers / Server Actions that need
 * to do something an authenticated admin session legitimately cannot
 * (e.g. reading contact messages from a server-triggered digest job).
 * NEVER import this from a Client Component or expose it to the browser.
 */
export function createServiceRoleClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

/**
 * Cookie-free public client, anon key only. Use this ONLY in contexts
 * that run without an HTTP request — build-time `generateStaticParams`,
 * for example — where Next.js forbids calling `cookies()` at all (it
 * throws, since there's no request to read cookies from). RLS still
 * applies normally, so this only ever sees published/public rows; it
 * carries no admin session and can't be used to bypass anything.
 */
export function createStaticClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
