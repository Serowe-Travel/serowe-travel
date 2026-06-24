import type { Metadata } from "next";
import { Compass } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { PackagesExplorer } from "@/components/site/PackagesExplorer";
import { getPublishedPackages, getSiteImages } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Travel Packages",
  description:
    "Browse curated travel packages from Serowe Travel — luxury, family, health & wellness and adventure journeys.",
};

// Always reflect the latest published packages.
export const revalidate = 60;

export default async function PackagesPage() {
  const [packages, images] = await Promise.all([
    getPublishedPackages(),
    getSiteImages(),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Packages"
        title="Curated journeys, ready to book"
        subtitle="Explore our latest travel packages — or ask us to design one just for you."
        image={images.page_hero_packages}
      />

      <section className="py-24">
        <Container>
          {packages.length > 0 ? (
            <PackagesExplorer packages={packages} />
          ) : (
            <div className="mx-auto max-w-xl rounded-3xl border border-sand bg-cream/60 p-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold/15 text-gold-dark">
                <Compass size={30} />
              </div>
              <h2 className="mt-6 font-display text-2xl font-semibold text-ink">
                New packages are on the way
              </h2>
              <p className="mt-3 text-ink-soft">
                We&apos;re curating our next collection of journeys. In the
                meantime, tell us where you&apos;d love to go and we&apos;ll
                craft a bespoke itinerary for you.
              </p>
              <Button href="/contact" variant="ember" className="mt-7">
                Request a Custom Trip
              </Button>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
