"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const metricSchema = z.object({
  value: z.string().trim().min(1, "Value is required"),
  label: z.string().trim().min(1, "Label is required"),
  sort_order: z.coerce.number().default(0),
});

export async function createMetric(formData: FormData) {
  const parsed = metricSchema.safeParse({
    value: formData.get("value"),
    label: formData.get("label"),
    sort_order: formData.get("sort_order") || 0,
  });
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid metric.");

  const supabase = await createClient();
  const { error } = await supabase.from("metrics").insert({ ...parsed.data, published: true });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/dashboard/metrics");
  revalidatePath("/");
}

export async function deleteMetric(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("metrics").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/dashboard/metrics");
  revalidatePath("/");
}
