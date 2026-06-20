"use client";

import { useActionState, useState } from "react";
import { Plus, Trash2, AlertCircle } from "lucide-react";
import type { Package, ItineraryDay } from "@/lib/types";
import type { PackageFormState } from "@/app/(admin)/admin/packages/actions";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { slugify } from "@/lib/utils";

const initialState: PackageFormState = { ok: false, message: "" };

const fieldCls =
  "mt-1.5 w-full rounded-xl border border-sand bg-white px-4 py-2.5 text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/30";

export function PackageForm({
  action,
  pkg,
  submitLabel,
}: {
  action: (
    prev: PackageFormState,
    formData: FormData,
  ) => Promise<PackageFormState>;
  pkg?: Package;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  const [title, setTitle] = useState(pkg?.title ?? "");
  const [slug, setSlug] = useState(pkg?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(pkg?.slug));
  const [featured, setFeatured] = useState<string[]>(
    pkg?.featured_image ? [pkg.featured_image] : [],
  );
  const [gallery, setGallery] = useState<string[]>(pkg?.gallery_images ?? []);
  const [itinerary, setItinerary] = useState<ItineraryDay[]>(
    pkg?.itinerary ?? [],
  );

  function addDay() {
    setItinerary((d) => [
      ...d,
      { day: d.length + 1, title: "", description: "" },
    ]);
  }
  function updateDay(i: number, patch: Partial<ItineraryDay>) {
    setItinerary((d) =>
      d.map((day, idx) => (idx === i ? { ...day, ...patch } : day)),
    );
  }
  function removeDay(i: number) {
    setItinerary((d) =>
      d.filter((_, idx) => idx !== i).map((day, idx) => ({ ...day, day: idx + 1 })),
    );
  }

  return (
    <form action={formAction} className="space-y-8">
      {/* hidden synced fields */}
      <input type="hidden" name="featured_image" value={featured[0] ?? ""} />
      <input
        type="hidden"
        name="gallery_images"
        value={JSON.stringify(gallery)}
      />
      <input
        type="hidden"
        name="itinerary"
        value={JSON.stringify(itinerary)}
      />

      <section className="rounded-2xl border border-sand bg-white p-6 shadow-soft">
        <h2 className="font-display text-lg font-semibold text-ink">
          Basic details
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-ink">Title *</span>
            <input
              name="title"
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!slugEdited) setSlug(slugify(e.target.value));
              }}
              className={fieldCls}
              placeholder="3-Day Serowe Heritage & Wildlife Tour"
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-ink">
              Slug (URL) *
            </span>
            <input
              name="slug"
              required
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugEdited(true);
              }}
              className={fieldCls}
              placeholder="3-day-serowe-heritage-wildlife-tour"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-ink">Type</span>
            <select name="type" defaultValue={pkg?.type ?? "luxury"} className={fieldCls}>
              <option value="luxury">Luxury</option>
              <option value="family">Family</option>
              <option value="health">Health & Wellness</option>
              <option value="adventure">Adventure</option>
              <option value="custom">Bespoke / Custom</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-ink">Destination</span>
            <input
              name="destination"
              defaultValue={pkg?.destination ?? ""}
              className={fieldCls}
              placeholder="Serowe, Botswana"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-ink">Duration</span>
            <input
              name="duration"
              defaultValue={pkg?.duration ?? ""}
              className={fieldCls}
              placeholder="3 Days / 2 Nights"
            />
          </label>

          <div className="grid grid-cols-3 gap-2">
            <label className="col-span-2 block">
              <span className="text-sm font-medium text-ink">Price (from)</span>
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                defaultValue={pkg?.price ?? ""}
                className={fieldCls}
                placeholder="0.00"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-ink">Currency</span>
              <input
                name="price_currency"
                defaultValue={pkg?.price_currency ?? "BWP"}
                className={fieldCls}
              />
            </label>
          </div>
        </div>

        <label className="mt-4 block">
          <span className="text-sm font-medium text-ink">Description</span>
          <textarea
            name="description"
            rows={5}
            defaultValue={pkg?.description ?? ""}
            className={fieldCls}
            placeholder="Rich, detailed description of the package..."
          />
        </label>
      </section>

      <section className="rounded-2xl border border-sand bg-white p-6 shadow-soft">
        <h2 className="font-display text-lg font-semibold text-ink">Images</h2>
        <div className="mt-4 space-y-5">
          <ImageUploader
            label="Featured image"
            value={featured}
            onChange={setFeatured}
          />
          <ImageUploader
            label="Gallery images"
            multiple
            value={gallery}
            onChange={setGallery}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-sand bg-white p-6 shadow-soft">
        <h2 className="font-display text-lg font-semibold text-ink">
          Inclusions & exclusions
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-ink">
              Inclusions (one per line)
            </span>
            <textarea
              name="inclusions"
              rows={5}
              defaultValue={(pkg?.inclusions ?? []).join("\n")}
              className={fieldCls}
              placeholder={"Accommodation\nMeals\nGame drives"}
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-ink">
              Exclusions (one per line)
            </span>
            <textarea
              name="exclusions"
              rows={5}
              defaultValue={(pkg?.exclusions ?? []).join("\n")}
              className={fieldCls}
              placeholder={"Flights\nVisa fees\nTravel insurance"}
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-sand bg-white p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink">
            Itinerary
          </h2>
          <button
            type="button"
            onClick={addDay}
            className="inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-3.5 py-1.5 text-sm font-medium text-gold-dark hover:bg-gold/25"
          >
            <Plus size={16} /> Add day
          </button>
        </div>
        <div className="mt-4 space-y-3">
          {itinerary.length === 0 && (
            <p className="text-sm text-ink-soft">No itinerary days yet.</p>
          )}
          {itinerary.map((day, i) => (
            <div
              key={i}
              className="rounded-xl border border-sand bg-cream/50 p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gold-dark">
                  Day {day.day}
                </span>
                <button
                  type="button"
                  onClick={() => removeDay(i)}
                  className="text-ember hover:text-ember-dark"
                  aria-label="Remove day"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <input
                value={day.title}
                onChange={(e) => updateDay(i, { title: e.target.value })}
                placeholder="Day title"
                className={fieldCls}
              />
              <textarea
                value={day.description}
                onChange={(e) =>
                  updateDay(i, { description: e.target.value })
                }
                rows={2}
                placeholder="What happens on this day..."
                className={fieldCls}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-sand bg-white p-6 shadow-soft">
        <h2 className="font-display text-lg font-semibold text-ink">
          Publishing
        </h2>
        <div className="mt-4 flex flex-wrap items-end gap-6">
          <label className="block">
            <span className="text-sm font-medium text-ink">Status</span>
            <select
              name="status"
              defaultValue={pkg?.status ?? "draft"}
              className={fieldCls}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </label>
          <label className="flex items-center gap-2.5 pb-3">
            <input
              type="checkbox"
              name="is_featured"
              defaultChecked={pkg?.is_featured ?? false}
              className="h-5 w-5 rounded border-sand text-gold focus:ring-gold"
            />
            <span className="text-sm font-medium text-ink">
              Feature on homepage
            </span>
          </label>
        </div>
      </section>

      {state.message && !state.ok && (
        <div className="flex items-start gap-2 rounded-xl bg-ember/10 p-3 text-sm text-ember-dark">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          {state.message}
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-gold px-7 py-3 font-medium text-white shadow-soft transition-colors hover:bg-gold-dark disabled:opacity-60"
        >
          {pending ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
