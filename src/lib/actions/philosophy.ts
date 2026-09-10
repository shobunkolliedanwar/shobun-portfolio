"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const philosophySchema = z.object({
  headline: z.string().trim().min(1, "Headline is required"),
  statement: z.string().trim().min(1, "Statement is required"),
  sort_order: z.coerce.number().default(0),
});

export async function createPhilosophy(formData: FormData) {
  const parsed = philosophySchema.safeParse({
    headline: formData.get("headline"),
    statement: formData.get("statement"),
    sort_order: formData.get("sort_order") || 0,
  });
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid statement.");

  const supabase = await createClient();
  const { error } = await supabase.from("philosophies").insert({ ...parsed.data, published: true });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/dashboard/philosophy");
  revalidatePath("/");
}

export async function deletePhilosophy(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("philosophies").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/dashboard/philosophy");
  revalidatePath("/");
}
