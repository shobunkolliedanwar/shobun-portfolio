import { getProfile } from "@/lib/queries/portfolio";

export async function GET() {
  const profile = await getProfile();
  if (!profile?.resume_url) return Response.json({ error: "No CV is available yet." }, { status: 404 });
  // Only fetch files in this project's public CV or existing media bucket.
  // Never use arbitrary external URLs as a server-side download proxy.
  let url: URL;
  try {
    url = new URL(profile.resume_url);
    const origin = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).origin;
    if (url.origin !== origin || url.username || url.password || !/^\/storage\/v1\/object\/public\/(cvs|media)\/[^?]+\.pdf$/i.test(url.pathname)) {
      return Response.json({ error: "Please upload your PDF CV through Admin → Profile." }, { status: 404 });
    }
  } catch {
    return Response.json({ error: "CV is not configured correctly." }, { status: 404 });
  }
  try {
    const file = await fetch(url, { cache: "no-store", redirect: "error", signal: AbortSignal.timeout(15000) });
    if (!file.ok || !file.body) return Response.json({ error: "CV is currently unavailable." }, { status: 502 });
    const filename = (profile.full_name.normalize("NFKD").replace(/[^a-zA-Z0-9 -]/g, "").trim().replace(/\s+/g, "-").slice(0, 100) || "Portfolio") + "-CV.pdf";
    return new Response(file.body, { headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "no-store",
    } });
  } catch {
    return Response.json({ error: "Unable to download CV. Please try again." }, { status: 502 });
  }
}
