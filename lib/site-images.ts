/**
 * Catalogue of every admin-editable image "slot" on the public website.
 *
 * Each slot has a stable key, a human label + group (for the admin Media
 * manager) and a bundled `fallback` asset under /public. The `site_images`
 * table only stores rows for slots the admin has overridden — until then the
 * site renders the fallback, so nothing ever breaks mid-migration.
 *
 * To expose a new image as editable: add a slot here and read it via
 * `images[slot]` (the resolved map already merges fallbacks).
 */

export type SiteImageGroup =
  | "Branding"
  | "Homepage hero"
  | "Homepage"
  | "Service cards"
  | "Destination cards"
  | "Page banners";

export type SiteImageSlotDef = {
  slot: string;
  label: string;
  group: SiteImageGroup;
  fallback: string;
  /** Default alt text used when the slot has no admin-provided alt. */
  alt?: string;
  /** Optional guidance shown in the admin (e.g. ideal orientation). */
  hint?: string;
};

export const SITE_IMAGE_SLOTS: SiteImageSlotDef[] = [
  // ---- Branding ----
  {
    slot: "logo",
    label: "Logo",
    group: "Branding",
    fallback: "/images/brand/logo.png",
    alt: "Serowe Travel",
    hint: "Square, transparent background works best.",
  },
  {
    slot: "dlm_logo",
    label: "DLM Group logo",
    group: "Branding",
    fallback: "/images/dlm/logo.svg",
    alt: "DLM Group",
    hint: "Square, transparent background works best.",
  },

  // ---- Homepage hero (rotating slideshow) ----
  {
    slot: "hero_1",
    label: "Hero slide 1",
    group: "Homepage hero",
    fallback: "/images/hero/elephant-river.png",
    hint: "Wide, landscape. Shown full-bleed behind the headline.",
  },
  {
    slot: "hero_2",
    label: "Hero slide 2",
    group: "Homepage hero",
    fallback: "/images/hero/tented-camp.png",
    hint: "Wide, landscape.",
  },
  {
    slot: "hero_3",
    label: "Hero slide 3",
    group: "Homepage hero",
    fallback: "/images/hero/mokoro-delta.png",
    hint: "Wide, landscape.",
  },

  // ---- Homepage sections ----
  {
    slot: "home_about",
    label: "Homepage — “Who we are” photo",
    group: "Homepage",
    fallback: "/images/gallery/heritage-homestead.jpg",
    alt: "Heritage homestead in the Central Region",
    hint: "Portrait (4:5).",
  },
  {
    slot: "home_cta",
    label: "Homepage — closing banner",
    group: "Homepage",
    fallback: "/images/hero/safari-vehicle.png",
    hint: "Wide, landscape (darkened behind text).",
  },

  // ---- Service cards (also used on /services) ----
  {
    slot: "service_travel-management",
    label: "Service — Travel Management",
    group: "Service cards",
    fallback: "/images/hero/travel-flatlay.png",
  },
  {
    slot: "service_luxury",
    label: "Service — Luxury Tours",
    group: "Service cards",
    fallback: "/images/gallery/heritage-homestead.jpg",
  },
  {
    slot: "service_family",
    label: "Service — Family Tours",
    group: "Service cards",
    fallback: "/images/gallery/sunset-game-drive.jpg",
  },
  {
    slot: "service_health",
    label: "Service — Health & Wellness",
    group: "Service cards",
    fallback: "/images/gallery/luxury-tent-interior.jpg",
  },
  {
    slot: "service_adventure",
    label: "Service — Adventure & Events",
    group: "Service cards",
    fallback: "/images/hero/safari-vehicle.png",
  },

  // ---- Destination cards (also used on /destinations) ----
  {
    slot: "dest_botswana",
    label: "Destination — Botswana",
    group: "Destination cards",
    fallback: "/images/hero/elephant-river.png",
  },
  {
    slot: "dest_sadc",
    label: "Destination — SADC Region",
    group: "Destination cards",
    fallback: "/images/hero/mokoro-delta.png",
  },
  {
    slot: "dest_international",
    label: "Destination — International",
    group: "Destination cards",
    fallback: "/images/hero/tented-camp.png",
  },

  // ---- Page banners (PageHero) ----
  {
    slot: "page_hero_about",
    label: "About — banner",
    group: "Page banners",
    fallback: "/images/gallery/cultural-performer.jpg",
  },
  {
    slot: "about_story",
    label: "About — “Our story” photo",
    group: "Page banners",
    fallback: "/images/gallery/delta-camp-aerial.jpg",
    alt: "Aerial view of a delta camp",
  },
  {
    slot: "page_hero_services",
    label: "Services — banner",
    group: "Page banners",
    fallback: "/images/hero/travel-flatlay.png",
  },
  {
    slot: "page_hero_airlines",
    label: "Airlines — banner",
    group: "Page banners",
    fallback: "/images/hero/safari-vehicle.png",
  },
  {
    slot: "page_hero_dlm",
    label: "DLM Group — banner",
    group: "Page banners",
    fallback: "/images/hero/travel-flatlay.png",
  },
  {
    slot: "page_hero_destinations",
    label: "Destinations — banner",
    group: "Page banners",
    fallback: "/images/hero/mokoro-delta.png",
  },
  {
    slot: "page_hero_packages",
    label: "Packages — banner",
    group: "Page banners",
    fallback: "/images/hero/tented-camp.png",
  },
  {
    slot: "page_hero_contact",
    label: "Contact — banner",
    group: "Page banners",
    fallback: "/images/gallery/sunset-game-drive.jpg",
  },
];

/** slot -> bundled fallback asset path. */
export const FALLBACK_IMAGES: Record<string, string> = Object.fromEntries(
  SITE_IMAGE_SLOTS.map((s) => [s.slot, s.fallback]),
);

/** A resolved map of every slot to a usable image URL (DB value or fallback). */
export type SiteImageMap = Record<string, string>;

export const GROUP_ORDER: SiteImageGroup[] = [
  "Branding",
  "Homepage hero",
  "Homepage",
  "Service cards",
  "Destination cards",
  "Page banners",
];
