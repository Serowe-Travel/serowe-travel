import type { Metadata } from "next";
import { Plane } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { AirlineGrid } from "@/components/site/AirlineGrid";
import { getAirlines, getSiteImages } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Airlines",
  description:
    "Serowe Travel books with a wide network of trusted airline partners — connecting you to Botswana, the SADC region and destinations worldwide.",
};

export default async function AirlinesPage() {
  const [airlines, images] = await Promise.all([
    getAirlines(),
    getSiteImages(),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Airlines"
        title="Flying you anywhere, with the best in the sky"
        subtitle="As an IATA-accredited, Amadeus-partnered agency we book across a wide network of trusted airline partners."
        image={images.page_hero_airlines}
      />

      <section className="bg-cream py-24">
        <Container>
          <SectionHeading
            eyebrow="Our Airline Partners"
            title="Trusted carriers, worldwide reach"
            intro="From regional hops across Southern Africa to long-haul journeys abroad, we secure the right flights at the right fares."
          />

          {airlines.length > 0 ? (
            <Reveal className="mt-14">
              <AirlineGrid airlines={airlines} />
            </Reveal>
          ) : (
            <div className="mx-auto mt-12 max-w-xl rounded-3xl border border-sand bg-white p-12 text-center shadow-soft">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold/15 text-gold-dark">
                <Plane size={30} />
              </div>
              <h2 className="mt-6 font-display text-2xl font-semibold text-ink">
                Airline partners coming soon
              </h2>
              <p className="mt-3 text-ink-soft">
                We work with a broad network of carriers. Get in touch and
                we&apos;ll find the best flights for your journey.
              </p>
              <Button href="/contact" variant="ember" className="mt-7">
                Plan Your Trip
              </Button>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
