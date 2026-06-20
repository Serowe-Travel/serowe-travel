"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type SettingsState = { ok: boolean; message: string };

function normaliseUrl(v: string): string | null {
  const t = v.trim();
  if (!t) return null;
  if (/^https?:\/\//i.test(t)) return t;
  return `https://${t}`;
}

export async function updateSettings(
  _prev: SettingsState,
  formData: FormData,
): Promise<SettingsState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("site_settings")
    .update({
      facebook_url: normaliseUrl(String(formData.get("facebook_url") ?? "")),
      instagram_url: normaliseUrl(String(formData.get("instagram_url") ?? "")),
      linkedin_url: normaliseUrl(String(formData.get("linkedin_url") ?? "")),
    })
    .eq("id", 1);

  if (error) {
    return {
      ok: false,
      message:
        error.message.includes("policy") || error.message.includes("denied")
          ? "Only administrators can update settings."
          : error.message,
    };
  }

  revalidatePath("/", "layout");
  return { ok: true, message: "Settings saved." };
}
