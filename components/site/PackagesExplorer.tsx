"use client";

import { useMemo, useState } from "react";
import type { Package } from "@/lib/types";
import { PackageCard } from "@/components/site/PackageCard";
import { cn } from "@/lib/utils";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "luxury", label: "Luxury" },
  { key: "family", label: "Family" },
  { key: "health", label: "Health & Wellness" },
  { key: "adventure", label: "Adventure" },
  { key: "custom", label: "Bespoke" },
] as const;

export function PackagesExplorer({ packages }: { packages: Package[] }) {
  const [filter, setFilter] = useState<string>("all");

  const available = useMemo(() => {
    const types = new Set(packages.map((p) => p.type));
    return FILTERS.filter((f) => f.key === "all" || types.has(f.key));
  }, [packages]);

  const filtered = useMemo(
    () =>
      filter === "all"
        ? packages
        : packages.filter((p) => p.type === filter),
    [packages, filter],
  );

  return (
    <div>
      {available.length > 2 && (
        <div className="flex flex-wrap justify-center gap-2.5">
          {available.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-medium transition-all duration-300",
                filter === f.key
                  ? "bg-gold text-white shadow-soft"
                  : "bg-sand text-ink-soft hover:bg-gold/15",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((pkg) => (
          <PackageCard key={pkg.id} pkg={pkg} />
        ))}
      </div>
    </div>
  );
}
