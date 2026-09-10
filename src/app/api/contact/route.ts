import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { contactSchema } from "@/lib/validations/contact";
import { createServiceRoleClient } from "@/lib/supabase/server";

// Very small in-memory rate limit — resets on cold start / on each
// serverless instance. This is a known limitation on Vercel: under
// real concurrent traffic across multiple instances it under-counts,
// since each instance keeps its own Map. For a personal portfolio's
// contact form that's an acceptable trade-off to stay on the free
// tier with zero extra dependencies. If this ever sees meaningful
// traffic, swap it for Upstash Redis or Vercel KV (both free-tier
// friendly) — the isRateLimited() call site below is the only thing
// that would need to change.
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const MAX_BODY_BYTES = 10_000; // generous for a contact message, small enough to block abuse
const hits = new Map<string, number[]>();

function isRateLimited(ipHash: string) {
  const now = Date.now();
  const timestamps = (hits.get(ipHash) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );
  timestamps.push(now);
  hits.set(ipHash, timestamps);
  return timestamps.length > RATE_LIMIT_MAX;
}

export async function POST(request: Request) {
  try {
    const contentLength = Number(request.headers.get("content-length") ?? 0);
    if (contentLength > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Request too large." }, { status: 413 });
    }

    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Request too large." }, { status: 413 });
    }

    let body: unknown;
    try {
      body = JSON.parse(raw);
    } catch {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input." },
        { status: 400 }
      );
    }

    // Honeypot tripped — pretend success so bots don't learn anything.
    if (parsed.data.website) {
      return NextResponse.json({ ok: true });
    }

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const ipHash = createHash("sha256").update(ip).digest("hex");

    if (isRateLimited(ipHash)) {
      return NextResponse.json(
        { error: "Too many messages sent. Please try again later." },
        { status: 429 }
      );
    }

    // contact_messages has no public INSERT policy anymore (see
    // supabase/migrations/0002_security_hardening.sql) — a browser
    // with the anon key cannot write to this table at all, only this
    // server route can, and only after the validation/honeypot/rate
    // limit checks above have passed. The service-role client is
    // never imported into a Client Component and never sent to the
    // browser.
    const supabase = createServiceRoleClient();
    const { error } = await supabase.from("contact_messages").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      company: parsed.data.company || null,
      message: parsed.data.message,
      ip_hash: ipHash,
    });

    if (error) {
      // Generic message on purpose — never leak DB error detail to the client.
      return NextResponse.json({ error: "Could not send message." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
