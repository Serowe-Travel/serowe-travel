"use client";

import { useState } from "react";
import Image from "next/image";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { uploadImage } from "@/lib/upload";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export function ImageUploader({
  multiple = false,
  value,
  onChange,
  label,
}: {
  multiple?: boolean;
  value: string[];
  onChange: (urls: string[]) => void;
  label: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    if (!isSupabaseConfigured) {
      setError("Connect Supabase to enable uploads.");
      return;
    }
    setBusy(true);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        uploaded.push(await uploadImage(file));
        if (!multiple) break;
      }
      onChange(multiple ? [...value, ...uploaded] : uploaded.slice(0, 1));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  function remove(url: string) {
    onChange(value.filter((u) => u !== url));
  }

  return (
    <div>
      <span className="text-sm font-medium text-ink">{label}</span>
      <div className="mt-1.5 flex flex-wrap gap-3">
        {value.map((url) => (
          <div
            key={url}
            className="relative h-24 w-24 overflow-hidden rounded-xl border border-sand"
          >
            <Image
              src={url}
              alt=""
              fill
              sizes="96px"
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => remove(url)}
              className="absolute right-1 top-1 rounded-full bg-ink/70 p-1 text-white hover:bg-ember"
              aria-label="Remove image"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-sand text-ink-soft transition-colors hover:border-gold hover:text-gold-dark">
          {busy ? (
            <Loader2 size={22} className="animate-spin" />
          ) : (
            <>
              <UploadCloud size={22} />
              <span className="text-[11px]">Upload</span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            multiple={multiple}
            className="hidden"
            disabled={busy}
            onChange={(e) => handleFiles(e.target.files)}
          />
        </label>
      </div>
      {error && <p className="mt-1 text-xs text-ember">{error}</p>}
    </div>
  );
}
