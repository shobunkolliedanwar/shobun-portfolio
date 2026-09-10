"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const socialLinkSchema = z.object({
  label: z.string().trim().min(1, "Label is required"),
  url: z
    .string()
    .trim()
    .min(1, "URL is required")
    .regex(/^https?:\/\/.+/, "Must be a valid URL starting with http:// or https://"),
  sort_order: z.coerce.number().default(0),
});

export async function createSocialLink(formData: FormData) {
  const parsed = socialLinkSchema.safeParse({
    label: formData.get("label"),
    url: formData.get("url"),
    sort_order: formData.get("sort_order") || 0,
  });
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid social link.");

  const supabase = await createClient();
  const { error } = await supabase.from("social_links").insert({ ...parsed.data, published: true });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/dashboard/social-links");
  revalidatePath("/");
}

export async function deleteSocialLink(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("social_links").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/dashboard/social-links");
  revalidatePath("/");
}
