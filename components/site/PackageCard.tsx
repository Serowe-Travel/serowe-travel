import Link from "next/link";
import Image from "next/image";
import { Clock, MapPin, ArrowRight } from "lucide-react";
import type { Package } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

const TYPE_LABEL: Record<string, string> = {
  luxury: "Luxury",
  family: "Family",
  health: "Health & Wellness",
  adventure: "Adventure",
  custom: "Bespoke",
};

export function PackageCard({ pkg }: { pkg: Package }) {
  const price = formatPrice(pkg.price, pkg.price_currency);
  return (
    <Link
      href={`/packages/${pkg.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-sand/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_-24px_rgba(33,27,18,0.4)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-sand">
        {pkg.featured_image ? (
          <Image
            src={pkg.featured_image}
            alt={pkg.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gold/40 font-display text-xl">
            Serowe Travel
          </div>
        )}
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold-dark backdrop-blur">
          {TYPE_LABEL[pkg.type] ?? pkg.type}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-soft">
          {pkg.destination && (
            <span className="inline-flex items-center gap-1">
              <MapPin size={14} className="text-gold" /> {pkg.destination}
            </span>
          )}
          {pkg.duration && (
            <span className="inline-flex items-center gap-1">
              <Clock size={14} className="text-gold" /> {pkg.duration}
            </span>
          )}
        </div>
        <h3 className="mt-3 font-display text-xl font-semibold text-ink transition-colors group-hover:text-gold-dark">
          {pkg.title}
        </h3>
        {pkg.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-soft">
            {pkg.description}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between pt-5">
          <div>
            {price ? (
              <>
                <span className="block text-[11px] uppercase tracking-wide text-ink-soft">
                  From
                </span>
                <span className="font-display text-lg font-semibold text-ink">
                  {price}
                </span>
              </>
            ) : (
              <span className="text-sm font-medium text-gold-dark">
                Enquire for pricing
              </span>
            )}
          </div>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-gold-dark transition-transform group-hover:translate-x-1">
            View <ArrowRight size={16} />
          </span>
        </div>
      </div>
    </Link>
  );
}
