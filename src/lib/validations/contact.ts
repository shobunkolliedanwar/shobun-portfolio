import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(120),
  email: z.string().trim().email("Enter a valid email address").max(200),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(4000),
  // honeypot — hidden from real users via CSS in the form; a bot that
  // fills every field will fill this too. It must be ALLOWED to parse
  // with any value here (real users always leave it empty) — the
  // actual "reject/allow" decision on a filled honeypot happens in
  // /api/contact, which returns a fake success without touching the
  // database. If this schema rejected a non-empty value outright, a
  // bot's request would never reach that fake-success branch at all.
  website: z.string().max(200).optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;
