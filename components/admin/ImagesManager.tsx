"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { UploadCloud, Loader2, RotateCcw, Check, AlertCircle } from "lucide-react";
import { uploadImage } from "@/lib/upload";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  SITE_IMAGE_SLOTS,
  GROUP_ORDER,
  type SiteImageSlotDef,
} from "@/lib/site-images";
import {
  saveSiteImage,
  resetSiteImage,
} from "@/app/(admin)/admin/images/actions";

export function ImagesManager({
  overrides,
  canEdit,
}: {
  /** slot -> admin-uploaded URL (absent slots use their bundled default). */
  overrides: Record<string, string>;
  canEdit: boolean;
}) {
  const [current, setCurrent] = useState<Record<string, string | null>>(() => {
    const map: Record<string, string | null> = {};
    for (const s of SITE_IMAGE_SLOTS) map[s.slot] = overrides[s.slot] ?? null;
    return map;
  });

  const grouped = GROUP_ORDER.map((group) => ({
    group,
    slots: SITE_IMAGE_SLOTS.filter((s) => s.group === group),
  })).filter((g) => g.slots.length > 0);

  return (
    <div className="space-y-10">
      {grouped.map(({ group, slots }) => (
        <section key={group}>
          <h2 className="font-display text-lg font-semibold text-ink">
            {group}
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {slots.map((def) => (
              <SlotCard
                key={def.slot}
                def={def}
                override={current[def.slot]}
                canEdit={canEdit}
                onSaved={(url) =>
                  setCurrent((m) => ({ ...m, [def.slot]: url }))
                }
                onReset={() =>
                  setCurrent((m) => ({ ...m, [def.slot]: null }))
                }
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function SlotCard({
  def,
  override,
  canEdit,
  onSaved,
  onReset,
}: {
  def: SiteImageSlotDef;
  override: string | null;
  canEdit: boolean;
  onSaved: (url: string) => void;
  onReset: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);

  const effective = override ?? def.fallback;
  const isCustom = Boolean(override);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setFeedback(null);
    if (!isSupabaseConfigured) {
      setFeedback({ ok: false, message: "Connect Supabase to enable uploads." });
      return;
    }
    setBusy(true);
    try {
      const url = await uploadImage(file, "site");
      const res = await saveSiteImage(def.slot, url, def.alt ?? null);
      if (res.ok) {
        onSaved(url);
        setFeedback({ ok: true, message: "Saved." });
      } else {
        setFeedback({ ok: false, message: res.message });
      }
    } catch (e) {
      setFeedback({
        ok: false,
        message: e instanceof Error ? e.message : "Upload failed.",
      });
    } finally {
      setBusy(false);
    }
  }

  function handleReset() {
    setFeedback(null);
    startTransition(async () => {
      const res = await resetSiteImage(def.slot);
      if (res.ok) {
        onReset();
        setFeedback({ ok: true, message: "Reverted to default." });
      } else {
        setFeedback({ ok: false, message: res.message });
      }
    });
  }

  return (
    <div className="rounded-2xl border border-sand bg-white p-4 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-medium text-ink">{def.label}</p>
          {def.hint && (
            <p className="mt-0.5 text-xs text-ink-soft">{def.hint}</p>
          )}
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
            isCustom ? "bg-gold/15 text-gold-dark" : "bg-sand text-ink-soft"
          }`}
        >
          {isCustom ? "Custom" : "Default"}
        </span>
      </div>

      <div className="relative mt-3 aspect-[16/10] overflow-hidden rounded-xl border border-sand bg-cream">
        <Image
          src={effective}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, 320px"
          className="object-contain"
        />
      </div>

      {canEdit ? (
        <div className="mt-3 flex items-center gap-2">
          <label className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gold-dark">
            {busy ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <UploadCloud size={16} />
            )}
            {busy ? "Uploading…" : isCustom ? "Replace" : "Upload"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={busy || pending}
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </label>
          {isCustom && (
            <button
              type="button"
              onClick={handleReset}
              disabled={busy || pending}
              className="inline-flex items-center gap-1.5 rounded-full border border-sand px-3 py-2 text-sm text-ink-soft transition-colors hover:border-ember hover:text-ember disabled:opacity-60"
              aria-label="Reset to default"
            >
              {pending ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <RotateCcw size={15} />
              )}
              Reset
            </button>
          )}
        </div>
      ) : (
        <p className="mt-3 text-xs text-ink-soft">
          Only staff can edit website images.
        </p>
      )}

      {feedback && (
        <div
          className={`mt-2 flex items-start gap-1.5 text-xs ${
            feedback.ok ? "text-green-700" : "text-ember-dark"
          }`}
        >
          {feedback.ok ? (
            <Check size={14} className="mt-0.5 shrink-0" />
          ) : (
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
          )}
          {feedback.message}
        </div>
      )}
    </div>
  );
}
