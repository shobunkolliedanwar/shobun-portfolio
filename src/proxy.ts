import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refreshes the Supabase auth session on every request and protects
 * /admin routes server-side: a request must have BOTH a valid session
 * AND admin_users membership (via public.is_admin()) to reach the
 * dashboard. This is a UX convenience, not the real security boundary —
 * RLS enforces the same is_admin() check at the database layer
 * regardless of what this middleware does.
 */
export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    if (request.nextUrl.pathname.startsWith("/admin") && !["/admin/login", "/admin/unauthorized"].includes(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return supabaseResponse;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isLoginRoute = request.nextUrl.pathname === "/admin/login";
  const isUnauthorizedRoute = request.nextUrl.pathname === "/admin/unauthorized";

  // Only ever treat someone as admin if BOTH a session exists AND they
  // are listed in admin_users (checked via the public.is_admin() RPC,
  // which is what actually gates every RLS policy too — this is a UX
  // shortcut, not the security boundary itself).
  let isAdmin = false;
  if (user) {
    const { data } = await supabase.rpc("is_admin");
    isAdmin = data === true;
  }

  if (isAdminRoute && !isLoginRoute && !isUnauthorizedRoute) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
    if (!isAdmin) {
      // Authenticated but not an admin — sign the session out (this is
      // a stray/unauthorized account, not someone who should stay
      // half-logged-in) and explain why, rather than silently landing
      // in the dashboard.
      await supabase.auth.signOut();
      const url = request.nextUrl.clone();
      url.pathname = "/admin/unauthorized";
      return NextResponse.redirect(url);
    }
  }

  if (isLoginRoute && user && isAdmin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"] };
