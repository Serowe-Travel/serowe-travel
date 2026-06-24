import { createClient } from "@/lib/supabase/client";

/**
 * Uploads an image to the shared public storage bucket and returns its public
 * URL. Used by the admin image/airline managers and the package form.
 */
const BUCKET = "package-images";

export async function uploadImage(
  file: File,
  folder = "uploads",
): Promise<string> {
  const supabase = createClient();
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${folder}/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}.${ext}`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { cacheControl: "3600", upsert: false });
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
