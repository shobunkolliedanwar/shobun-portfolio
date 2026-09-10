"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { optionalUrl, optionalText } from "@/lib/validations/shared";

const siteSettingsSchema = z.object({
  site_title: optionalText,
  site_description: optionalText,
  favicon_url: optionalUrl,
  default_og_image_url: optionalUrl,
});

export async function updateSiteSettings(id: string | null, formData: FormData) {
  const parsed = siteSettingsSchema.safeParse({
    site_title: formData.get("site_title"),
    site_description: formData.get("site_description"),
    favicon_url: formData.get("favicon_url"),
    default_og_image_url: formData.get("default_og_image_url"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid settings.");
  }

  const payload = {
    site_title: parsed.data.site_title ?? null,
    site_description: parsed.data.site_description ?? null,
    favicon_url: parsed.data.favicon_url ?? null,
    default_og_image_url: parsed.data.default_og_image_url ?? null,
  };

  const supabase = await createClient();
  const { error } = id
    ? await supabase.from("site_settings").update(payload).eq("id", id)
    : await supabase.from("site_settings").insert(payload);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/dashboard/settings");
  revalidatePath("/");
}
