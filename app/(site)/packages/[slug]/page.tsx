import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Clock,
  MapPin,
  Check,
  X,
  ArrowRight,
  CalendarDays,
} from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { getPackageBySlug, getSiteImages } from "@/lib/queries";
import { formatPrice } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);
  if (!pkg) return { title: "Package not found" };
  return {
    title: pkg.title,
    description: pkg.description?.slice(0, 155) ?? undefined,
  };
}

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);
  if (!pkg) notFound();

  const images = await getSiteImages();
  const price = formatPrice(pkg.price, pkg.price_currency);
  const gallery = (pkg.gallery_images ?? []).filter(Boolean);

  return (
    <>
      <PageHero
        eyebrow={pkg.destination}
        title={pkg.title}
        subtitle={pkg.duration ?? undefined}
        image={pkg.featured_image ?? images.page_hero_packages}
      />

      <section className="py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Main content */}
            <div className="lg:col-span-2">
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-soft">
                {pkg.destination && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={16} className="text-gold" />
                    {pkg.destination}
                  </span>
                )}
                {pkg.duration && (
                  <span className="inline-flex items-center gap-1.5">
                    <Clock size={16} className="text-gold" />
                    {pkg.duration}
                  </span>
                )}
              </div>

              {pkg.description && (
                <div className="mt-6 whitespace-pre-line text-lg leading-relaxed text-ink-soft">
                  {pkg.description}
                </div>
              )}

              {/* Itinerary */}
              {pkg.itinerary && pkg.itinerary.length > 0 && (
                <div className="mt-12">
                  <h2 className="font-display text-2xl font-semibold text-ink">
                    Itinerary
                  </h2>
                  <div className="mt-6 space-y-4">
                    {pkg.itinerary.map((day) => (
                      <div
                        key={day.day}
                        className="rounded-2xl border border-sand bg-white p-6 shadow-soft"
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/15 text-sm font-semibold text-gold-dark">
                            {day.day}
                          </span>
                          <h3 className="font-display text-lg font-semibold text-ink">
                            {day.title}
                          </h3>
                        </div>
                        {day.description && (
                          <p className="mt-3 text-ink-soft leading-relaxed">
                            {day.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Inclusions / exclusions */}
              <div className="mt-12 grid gap-6 sm:grid-cols-2">
                {pkg.inclusions && pkg.inclusions.length > 0 && (
                  <div className="rounded-2xl bg-cream p-6">
                    <h3 className="font-display text-lg font-semibold text-ink">
                      What&apos;s included
                    </h3>
                    <ul className="mt-4 space-y-2.5">
                      {pkg.inclusions.map((inc) => (
                        <li key={inc} className="flex items-start gap-2.5">
                          <Check
                            size={18}
                            className="mt-0.5 shrink-0 text-green-600"
                          />
                          <span className="text-sm text-ink-soft">{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {pkg.exclusions && pkg.exclusions.length > 0 && (
                  <div className="rounded-2xl bg-cream p-6">
                    <h3 className="font-display text-lg font-semibold text-ink">
                      Not included
                    </h3>
                    <ul className="mt-4 space-y-2.5">
                      {pkg.exclusions.map((exc) => (
                        <li key={exc} className="flex items-start gap-2.5">
                          <X
                            size={18}
                            className="mt-0.5 shrink-0 text-ember"
                          />
                          <span className="text-sm text-ink-soft">{exc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Gallery */}
              {gallery.length > 0 && (
                <div className="mt-12">
                  <h2 className="font-display text-2xl font-semibold text-ink">
                    Gallery
                  </h2>
                  <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {gallery.map((img, i) => (
                      <div
                        key={`${img}-${i}`}
                        className="relative aspect-square overflow-hidden rounded-xl"
                      >
                        <Image
                          src={img}
                          alt={`${pkg.title} photo ${i + 1}`}
                          fill
                          sizes="(max-width: 640px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 hover:scale-110"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sticky booking card */}
            <aside className="lg:col-span-1">
              <div className="sticky top-28 rounded-3xl border border-sand bg-white p-7 shadow-card">
                {price ? (
                  <>
                    <span className="text-xs uppercase tracking-wide text-ink-soft">
                      From
                    </span>
                    <p className="font-display text-3xl font-semibold text-ink">
                      {price}
                    </p>
                  </>
                ) : (
                  <p className="font-display text-2xl font-semibold text-ink">
                    Enquire for pricing
                  </p>
                )}
                <p className="mt-2 text-sm text-ink-soft">
                  Per person, subject to availability and season.
                </p>

                <Button
                  href={`/contact?package=${encodeURIComponent(pkg.title)}`}
                  variant="ember"
                  className="mt-6 w-full"
                >
                  Enquire About This Trip <ArrowRight size={16} />
                </Button>

                <div className="mt-6 flex items-center gap-3 rounded-xl bg-cream p-4 text-sm text-ink-soft">
                  <CalendarDays size={20} className="shrink-0 text-gold" />
                  Flexible dates available — we tailor every journey to you.
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
