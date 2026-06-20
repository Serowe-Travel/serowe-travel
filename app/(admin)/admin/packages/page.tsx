import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Eye, Star, Package as PackageIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Package } from "@/lib/types";
import { formatPrice, cn } from "@/lib/utils";
import { DeletePackageButton } from "@/components/admin/DeletePackageButton";

export const dynamic = "force-dynamic";

const STATUS_STYLE: Record<string, string> = {
  published: "bg-green-100 text-green-700",
  draft: "bg-sand text-ink-soft",
  archived: "bg-ember/10 text-ember-dark",
};

export default async function AdminPackagesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("packages")
    .select("*")
    .order("created_at", { ascending: false });
  const packages = (data as Package[]) ?? [];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">
            Packages
          </h1>
          <p className="mt-1 text-ink-soft">
            {packages.length} package{packages.length === 1 ? "" : "s"} total
          </p>
        </div>
        <Link
          href="/admin/packages/new"
          className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-medium text-white shadow-soft transition-colors hover:bg-gold-dark"
        >
          <Plus size={18} /> New Package
        </Link>
      </div>

      {packages.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-sand bg-white p-12 text-center">
          <PackageIcon size={36} className="mx-auto text-gold" />
          <h2 className="mt-4 font-display text-xl font-semibold text-ink">
            No packages yet
          </h2>
          <p className="mt-2 text-ink-soft">
            Create your first travel package to display it on the website.
          </p>
          <Link
            href="/admin/packages/new"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-medium text-white hover:bg-gold-dark"
          >
            <Plus size={18} /> Create Package
          </Link>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border border-sand bg-white shadow-soft">
          <ul className="divide-y divide-sand">
            {packages.map((pkg) => (
              <li
                key={pkg.id}
                className="flex items-center gap-4 px-4 py-4 sm:px-6"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-sand">
                  {pkg.featured_image ? (
                    <Image
                      src={pkg.featured_image}
                      alt=""
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gold/50">
                      <PackageIcon size={20} />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium text-ink">
                      {pkg.title}
                    </p>
                    {pkg.is_featured && (
                      <Star size={14} className="shrink-0 fill-gold text-gold" />
                    )}
                  </div>
                  <p className="truncate text-sm text-ink-soft">
                    {[pkg.destination, pkg.duration, formatPrice(pkg.price, pkg.price_currency)]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>

                <span
                  className={cn(
                    "hidden shrink-0 rounded-full px-3 py-1 text-xs font-medium capitalize sm:inline",
                    STATUS_STYLE[pkg.status],
                  )}
                >
                  {pkg.status}
                </span>

                <div className="flex shrink-0 items-center gap-3">
                  {pkg.status === "published" && (
                    <Link
                      href={`/packages/${pkg.slug}`}
                      target="_blank"
                      className="text-ink-soft hover:text-gold-dark"
                      aria-label="View"
                    >
                      <Eye size={16} />
                    </Link>
                  )}
                  <Link
                    href={`/admin/packages/${pkg.id}/edit`}
                    className="text-ink-soft hover:text-gold-dark"
                    aria-label="Edit"
                  >
                    <Pencil size={16} />
                  </Link>
                  <DeletePackageButton id={pkg.id} title={pkg.title} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
