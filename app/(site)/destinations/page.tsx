import type { Metadata } from "next";
import Image from "next/image";
import { MapPin, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { destinations } from "@/lib/site";

export const metadata: Metadata = {
  title: "Destinations",
  description:
    "Discover Botswana, the SADC region and international destinations including Mauritius, Florida, Thailand and Indonesia with Serowe Travel.",
};

export default function DestinationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Destinations"
        title="The world, expertly arranged"
        subtitle="From the heart of Botswana to islands and wellness retreats across the globe."
        image="/images/hero/mokoro-delta.png"
      />

      <section className="py-24">
        <Container>
          <SectionHeading
            eyebrow="Where We Travel"
            title="Choose your horizon"
            intro="Three worlds of experience, each crafted with local insight and global standards."
          />

          <div className="mt-16 space-y-16">
            {destinations.map((d, i) => {
              const reversed = i % 2 === 1;
              return (
                <div
                  key={d.region}
                  className="grid items-center gap-10 lg:grid-cols-2"
                >
                  <Reveal
                    className={cn(
                      "relative aspect-[16/11] overflow-hidden rounded-3xl shadow-card",
                      reversed && "lg:order-2",
                    )}
                  >
                    <Image
                      src={d.image}
                      alt={d.region}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </Reveal>
                  <div className={cn(reversed && "lg:order-1")}>
                    <h2 className="font-display text-3xl font-semibold text-ink">
                      {d.region}
                    </h2>
                    <p className="mt-4 text-ink-soft leading-relaxed">
                      {d.blurb}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2.5">
                      {d.places.map((place) => (
                        <span
                          key={place}
                          className="inline-flex items-center gap-1.5 rounded-full bg-sand px-3.5 py-1.5 text-sm text-ink-soft"
                        >
                          <MapPin size={13} className="text-gold" />
                          {place}
                        </span>
                      ))}
                    </div>
                    <Button href="/contact" variant="outline" className="mt-8">
                      Plan a {d.region} trip <ArrowRight size={16} />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}
