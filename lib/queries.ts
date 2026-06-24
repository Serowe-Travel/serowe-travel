import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Airline, Package, SiteImage, SiteSettings } from "@/lib/types";
import { FALLBACK_IMAGES, type SiteImageMap } from "@/lib/site-images";

/** Published packages for the public site. Empty when not configured. */
export async function getPublishedPackages(): Promise<Package[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("packages")
      .select("*")
      .eq("status", "published")
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data as Package[]) ?? [];
  } catch {
    return [];
  }
}

export async function getFeaturedPackages(limit = 4): Promise<Package[]> {
  const all = await getPublishedPackages();
  const featured = all.filter((p) => p.is_featured);
  return (featured.length > 0 ? featured : all).slice(0, limit);
}

export async function getPackageBySlug(
  slug: string,
): Promise<Package | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("packages")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();
    if (error) throw error;
    return (data as Package) ?? null;
  } catch {
    return null;
  }
}

const DEFAULT_SETTINGS: SiteSettings = {
  id: 1,
  facebook_url: "https://www.facebook.com/",
  instagram_url: null,
  linkedin_url: null,
  updated_at: new Date().toISOString(),
};

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isSupabaseConfigured) return DEFAULT_SETTINGS;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    if (error) throw error;
    return (data as SiteSettings) ?? DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

/**
 * Resolved map of every image slot to a usable URL. Starts from the bundled
 * fallbacks and overlays any admin-uploaded overrides from `site_images`.
 */
export async function getSiteImages(): Promise<SiteImageMap> {
  const map: SiteImageMap = { ...FALLBACK_IMAGES };
  if (!isSupabaseConfigured) return map;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_images")
      .select("slot,url");
    if (error) throw error;
    for (const row of (data as Pick<SiteImage, "slot" | "url">[]) ?? []) {
      if (row.url) map[row.slot] = row.url;
    }
    return map;
  } catch {
    return map;
  }
}

/** Raw rows from `site_images` (admin overrides only), keyed by slot. */
export async function getSiteImageOverrides(): Promise<
  Record<string, SiteImage>
> {
  if (!isSupabaseConfigured) return {};
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("site_images").select("*");
    if (error) throw error;
    const out: Record<string, SiteImage> = {};
    for (const row of (data as SiteImage[]) ?? []) out[row.slot] = row;
    return out;
  } catch {
    return {};
  }
}

/** Active airlines for the public carousel, in display order. */
export async function getAirlines(activeOnly = true): Promise<Airline[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const supabase = await createClient();
    let query = supabase
      .from("airlines")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (activeOnly) query = query.eq("is_active", true);
    const { data, error } = await query;
    if (error) throw error;
    return (data as Airline[]) ?? [];
  } catch {
    return [];
  }
}
