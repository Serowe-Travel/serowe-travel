"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { EnquiryStatus } from "@/lib/types";

export async function updateEnquiry(
  id: string,
  patch: { status?: EnquiryStatus; notes?: string },
): Promise<{ ok: boolean; message?: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("enquiries")
    .update(patch)
    .eq("id", id);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
  return { ok: true };
}

export async function deleteEnquiry(id: string) {
  const supabase = await createClient();
  await supabase.from("enquiries").delete().eq("id", id);
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
}
