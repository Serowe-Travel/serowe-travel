"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import type { ItineraryDay } from "@/lib/types";

export type PackageFormState = { ok: boolean; message: string };

function parseLines(value: string): string[] {
  return value
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function parseItinerary(value: string): ItineraryDay[] {
  if (!value.trim()) return [];
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((d, i) => ({
        day: Number(d.day) || i + 1,
        title: String(d.title ?? "").trim(),
        description: String(d.description ?? "").trim(),
      }))
      .filter((d) => d.title || d.description);
  } catch {
    return [];
  }
}

function buildPayload(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const slugRaw = String(formData.get("slug") ?? "").trim();
  const priceRaw = String(formData.get("price") ?? "").trim();
  const galleryRaw = String(formData.get("gallery_images") ?? "[]");
  let gallery: string[] = [];
  try {
    const g = JSON.parse(galleryRaw);
    if (Array.isArray(g)) gallery = g.filter(Boolean);
  } catch {
    gallery = [];
  }

  return {
    title,
    slug: slugify(slugRaw || title),
    type: String(formData.get("type") ?? "custom"),
    destination: String(formData.get("destination") ?? "").trim(),
    duration: String(formData.get("duration") ?? "").trim() || null,
    price: priceRaw ? Number(priceRaw) : null,
    price_currency: String(formData.get("price_currency") ?? "BWP").trim(),
    description: String(formData.get("description") ?? "").trim() || null,
    inclusions: parseLines(String(formData.get("inclusions") ?? "")),
    exclusions: parseLines(String(formData.get("exclusions") ?? "")),
    itinerary: parseItinerary(String(formData.get("itinerary") ?? "")),
    featured_image:
      String(formData.get("featured_image") ?? "").trim() || null,
    gallery_images: gallery,
    status: String(formData.get("status") ?? "draft"),
    is_featured: formData.get("is_featured") === "on",
  };
}

export async function createPackage(
  _prev: PackageFormState,
  formData: FormData,
): Promise<PackageFormState> {
  const payload = buildPayload(formData);
  if (!payload.title) return { ok: false, message: "Title is required." };

  const supabase = await createClient();
  const user = await getCurrentUser();

  const { error } = await supabase
    .from("packages")
    .insert({ ...payload, created_by: user?.id ?? null });

  if (error) {
    return {
      ok: false,
      message: error.message.includes("duplicate")
        ? "A package with this slug already exists. Choose a different title/slug."
        : error.message,
    };
  }

  revalidatePath("/admin/packages");
  revalidatePath("/packages");
  redirect("/admin/packages");
}

export async function updatePackage(
  id: string,
  _prev: PackageFormState,
  formData: FormData,
): Promise<PackageFormState> {
  const payload = buildPayload(formData);
  if (!payload.title) return { ok: false, message: "Title is required." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("packages")
    .update(payload)
    .eq("id", id);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/admin/packages");
  revalidatePath("/packages");
  revalidatePath(`/packages/${payload.slug}`);
  redirect("/admin/packages");
}

export async function deletePackage(id: string) {
  const supabase = await createClient();
  await supabase.from("packages").delete().eq("id", id);
  revalidatePath("/admin/packages");
  revalidatePath("/packages");
}
