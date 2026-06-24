"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const FALLBACK_SLIDES = [
  "/images/hero/elephant-river.png",
  "/images/hero/tented-camp.png",
  "/images/hero/mokoro-delta.png",
];

export function Hero({ slides }: { slides?: string[] }) {
  const SLIDES = slides && slides.length > 0 ? slides : FALLBACK_SLIDES;
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setActive((i) => (i + 1) % SLIDES.length),
      6000,
    );
    return () => clearInterval(id);
  }, [SLIDES.length]);

  return (
    <section className="relative flex min-h-[88vh] items-center overflow-hidden">
      {/* Background slides */}
      <div className="absolute inset-0">
        {SLIDES.map((src, i) => (
          <div
            key={src}
            className={cn(
              "absolute inset-0 transition-opacity duration-[1500ms] ease-in-out",
              i === active ? "opacity-100" : "opacity-0",
            )}
          >
            <Image
              src={src}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              className={cn(
                "object-cover",
                i === active && "animate-kenburns",
              )}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/55 to-ink/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-8 py-28">
        <div className="max-w-2xl">
          <div
            className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-white backdrop-blur"
            style={{ animation: "var(--animate-fade-up)" }}
          >
            <Sparkles size={14} className="text-gold-light" />
            Luxury & Sustainable Travel
          </div>

          <h1
            className="mt-6 font-display text-4xl font-semibold leading-[1.08] text-white sm:text-6xl"
            style={{ animation: "var(--animate-fade-up)", animationDelay: "0.1s", animationFillMode: "both" }}
          >
            Explore Botswana
            <span className="block text-gold-light">&amp; Beyond.</span>
          </h1>

          <p
            className="mt-6 max-w-xl text-lg leading-relaxed text-cream/90"
            style={{ animation: "var(--animate-fade-up)", animationDelay: "0.25s", animationFillMode: "both" }}
          >
            A Serowe Travel experience combines local expertise with global
            connections — crafting journeys that inspire exploration,
            connection and lifelong memories.
          </p>

          <div
            className="mt-9 flex flex-wrap gap-4"
            style={{ animation: "var(--animate-fade-up)", animationDelay: "0.4s", animationFillMode: "both" }}
          >
            <Button href="/contact" variant="ember" size="lg">
              Plan Your Trip <ArrowRight size={18} />
            </Button>
            <Button href="/services" variant="light" size="lg">
              Explore Services
            </Button>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2 sm:left-auto sm:right-10 sm:translate-x-0">
        {SLIDES.map((s, i) => (
          <button
            key={s}
            aria-label={`Slide ${i + 1}`}
            onClick={() => setActive(i)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === active ? "w-8 bg-gold-light" : "w-3 bg-white/50",
            )}
          />
        ))}
      </div>
    </section>
  );
}
