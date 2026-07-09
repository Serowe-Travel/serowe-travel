import Image from "next/image";
import type { Airline } from "@/lib/types";

/**
 * Responsive grid of airline logos — image only (no name, link or
 * description). Each logo sits in a white 2:1 rectangle with a soft shadow.
 */
export function AirlineGrid({ airlines }: { airlines: Airline[] }) {
  if (airlines.length === 0) return null;

  return (
    <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
      {airlines.map((airline) => (
        <li key={airline.id}>
          <div className="relative aspect-[2/1] rounded-2xl border border-sand/70 bg-white shadow-soft">
            <Image
              src={airline.logo_url}
              alt={airline.name || "Airline logo"}
              fill
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
              className="object-contain p-6"
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
