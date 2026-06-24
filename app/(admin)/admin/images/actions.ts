"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { FALLBACK_IMAGES } from "@/lib/site-images";

export type ImageActionState = { ok: boolean; message: string; slot?: string };

/** Save (upsert) an admin override for a single image slot. */
export async function saveSiteImage(
  slot: string,
  url: string,
  alt?: string | null,
): Promise<ImageActionState> {
  if (!(slot in FALLBACK_IMAGES)) {
    return { ok: false, message: "Unknown image slot.", slot };
  }
  if (!url) return { ok: false, message: "No image URL provided.", slot };

  const supabase = await createClient();
  const { error } = await supabase
    .from("site_images")
    .upsert(
      { slot, url, alt: alt?.trim() || null },
      { onConflict: "slot" },
    );

  if (error) {
    return {
      ok: false,
      message:
        error.message.includes("policy") || error.message.includes("denied")
          ? "You don't have permission to edit website images."
          : error.message,
      slot,
    };
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/images");
  return { ok: true, message: "Image updated.", slot };
}

/** Remove an override, reverting the slot to its bundled default image. */
export async function resetSiteImage(slot: string): Promise<ImageActionState> {
  const supabase = await createClient();
  const { error } = await supabase.from("site_images").delete().eq("slot", slot);

  if (error) {
    return { ok: false, message: error.message, slot };
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/images");
  return { ok: true, message: "Reverted to default.", slot };
}
