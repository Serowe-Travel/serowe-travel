"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type AirlineActionState = { ok: boolean; message: string };

function revalidateAirlines() {
  revalidatePath("/airlines");
  revalidatePath("/admin/airlines");
}

function normaliseUrl(v: string): string | null {
  const t = v.trim();
  if (!t) return null;
  if (/^https?:\/\//i.test(t)) return t;
  return `https://${t}`;
}

export async function createAirline(
  _prev: AirlineActionState,
  formData: FormData,
): Promise<AirlineActionState> {
  const name = String(formData.get("name") ?? "").trim();
  const logo_url = String(formData.get("logo_url") ?? "").trim();
  const link_url = normaliseUrl(String(formData.get("link_url") ?? ""));
  const description = String(formData.get("description") ?? "").trim() || null;

  if (!name) return { ok: false, message: "Airline name is required." };
  if (!logo_url) return { ok: false, message: "Please upload a logo." };

  const supabase = await createClient();

  // New airlines sort to the end of the list.
  const { data: last } = await supabase
    .from("airlines")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const sort_order = (last?.sort_order ?? 0) + 1;

  const { error } = await supabase
    .from("airlines")
    .insert({ name, logo_url, link_url, description, sort_order, is_active: true });

  if (error) {
    return {
      ok: false,
      message:
        error.message.includes("policy") || error.message.includes("denied")
          ? "You don't have permission to add airlines."
          : error.message,
    };
  }

  revalidateAirlines();
  return { ok: true, message: "Airline added." };
}

export async function deleteAirline(id: string) {
  const supabase = await createClient();
  await supabase.from("airlines").delete().eq("id", id);
  revalidateAirlines();
}

export async function toggleAirline(id: string, isActive: boolean) {
  const supabase = await createClient();
  await supabase.from("airlines").update({ is_active: isActive }).eq("id", id);
  revalidateAirlines();
}

/** Swap sort_order with the adjacent airline in the given direction. */
export async function moveAirline(id: string, direction: "up" | "down") {
  const supabase = await createClient();
  const { data: all } = await supabase
    .from("airlines")
    .select("id,sort_order")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (!all) return;

  const idx = all.findIndex((a) => a.id === id);
  if (idx === -1) return;
  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= all.length) return;

  const a = all[idx];
  const b = all[swapIdx];
  // Persist explicit ordering (normalised to index) to avoid duplicate values.
  await supabase
    .from("airlines")
    .update({ sort_order: b.sort_order })
    .eq("id", a.id);
  await supabase
    .from("airlines")
    .update({ sort_order: a.sort_order })
    .eq("id", b.id);

  revalidateAirlines();
}
