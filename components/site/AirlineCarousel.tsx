"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import type { Airline } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Airline cards in a horizontally scrollable track. When the cards overflow
 * the container, prev/next buttons appear at the far left/right so visitors can
 * page through them; with only a few they're shown centered and the buttons
 * stay hidden. Only the "Visit website" link navigates — the card does not.
 */
export function AirlineCarousel({ airlines }: { airlines: Airline[] }) {
  const trackRef = useRef<HTMLUListElement | null>(null);
  const [canScroll, setCanScroll] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const update = () => {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      setCanScroll(scrollWidth - clientWidth > 1);
      setAtStart(scrollLeft <= 1);
      setAtEnd(scrollLeft >= scrollWidth - clientWidth - 1);
    };
    const observer = new ResizeObserver(update);
    observer.observe(el);
    el.addEventListener("scroll", update, { passive: true });
    return () => {
      observer.disconnect();
      el.removeEventListener("scroll", update);
    };
  }, [airlines.length]);

  if (airlines.length === 0) return null;

  function page(direction: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    // Move roughly one viewport at a time.
    el.scrollBy({ left: direction * el.clientWidth * 0.9, behavior: "smooth" });
  }

  return (
    <div className="relative">
      {canScroll && (
        <button
          type="button"
          onClick={() => page(-1)}
          disabled={atStart}
          aria-label="Previous airlines"
          className="absolute left-0 top-1/2 z-20 hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-sand bg-white p-3 text-ink shadow-card transition-opacity hover:text-gold-dark disabled:opacity-0 sm:flex"
        >
          <ChevronLeft size={22} />
        </button>
      )}

      <ul
        ref={trackRef}
        className={cn(
          "no-scrollbar flex items-stretch gap-6 overflow-x-auto scroll-smooth py-2",
          canScroll ? "justify-start" : "flex-wrap justify-center",
        )}
      >
        {airlines.map((airline) => (
          <li key={airline.id} className="w-80 shrink-0">
            <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-sand bg-white shadow-card">
              {/* Large square image filling its container */}
              <div className="relative aspect-square w-full bg-cream">
                <Image
                  src={airline.logo_url}
                  alt={airline.name}
                  fill
                  sizes="320px"
                  className="object-cover"
                />
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-xl font-semibold text-ink">
                  {airline.name}
                </h3>
                {airline.description && (
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {airline.description}
                  </p>
                )}
                {airline.link_url && (
                  <a
                    href={airline.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-gold-dark transition-colors hover:text-ember"
                  >
                    Visit website <ExternalLink size={15} />
                  </a>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>

      {canScroll && (
        <button
          type="button"
          onClick={() => page(1)}
          disabled={atEnd}
          aria-label="Next airlines"
          className="absolute right-0 top-1/2 z-20 hidden -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border border-sand bg-white p-3 text-ink shadow-card transition-opacity hover:text-gold-dark disabled:opacity-0 sm:flex"
        >
          <ChevronRight size={22} />
        </button>
      )}
    </div>
  );
}
