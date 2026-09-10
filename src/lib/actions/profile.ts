"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { optionalUrl, optionalText } from "@/lib/validations/shared";

const profileSchema = z.object({
  full_name: z.string().trim().min(1, "Full name is required"),
  profession: z.string().trim().min(1, "Profession is required"),
  hero_headline: z.string().trim().min(1, "Hero headline is required"),
  hero_description: z.string().trim().min(1, "Hero description is required"),
  bio: optionalText,
  profile_photo_url: optionalUrl,
  resume_url: optionalUrl,
  location: optionalText,
  availability: optionalText,
  email: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? v : undefined))
    .refine((v) => v === undefined || z.string().email().safeParse(v).success, {
      message: "Must be a valid email address",
    }),
  years_experience: z.coerce.number().optional(),
  published: z.boolean(),
});

export async function updateProfile(id: string | null, formData: FormData) {
  const parsed = profileSchema.safeParse({
    full_name: formData.get("full_name"),
    profession: formData.get("profession"),
    hero_headline: formData.get("hero_headline"),
    hero_description: formData.get("hero_description"),
    bio: formData.get("bio"),
    profile_photo_url: formData.get("profile_photo_url"),
    resume_url: formData.get("resume_url"),
    location: formData.get("location"),
    availability: formData.get("availability"),
    email: formData.get("email"),
    years_experience: formData.get("years_experience") || undefined,
    published: formData.get("published") === "on",
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid profile data.");
  }

  const supabase = await createClient();
  const payload = {
    full_name: parsed.data.full_name,
    profession: parsed.data.profession,
    hero_headline: parsed.data.hero_headline,
    hero_description: parsed.data.hero_description,
    bio: parsed.data.bio ?? null,
    profile_photo_url: parsed.data.profile_photo_url ?? null,
    resume_url: parsed.data.resume_url ?? null,
    location: parsed.data.location ?? null,
    availability: parsed.data.availability ?? null,
    email: parsed.data.email ?? null,
    years_experience: parsed.data.years_experience ?? null,
    published: parsed.data.published,
    // github_url / linkedin_url are intentionally NOT written here —
    // social_links is the single source of truth for social profiles
    // (see Hero.tsx and Footer.tsx). The columns remain on the table
    // for backward compatibility but the CMS no longer edits them.
  };

  const { error } = id
    ? await supabase.from("profiles").update(payload).eq("id", id)
    : await supabase.from("profiles").insert(payload);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/dashboard/profile");
  revalidatePath("/");
}
