"use client";

import { ChevronUp } from "lucide-react";

/** Smooth-scrolls the window back to the top. Used in the site footer. */
export function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="inline-flex items-center gap-2 rounded-full border border-cream/20 px-5 py-2.5 text-sm font-medium text-cream/80 transition-colors hover:border-gold hover:bg-gold hover:text-white"
    >
      <ChevronUp size={16} />
      Back to top
    </button>
  );
}
