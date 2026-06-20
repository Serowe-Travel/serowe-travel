import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Package, SiteSettings } from "@/lib/types";

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
