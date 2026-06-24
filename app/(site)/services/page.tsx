import type { Metadata } from "next";
import Image from "next/image";
import { Check, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { services } from "@/lib/site";
import { getSiteImages } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Services & Tours",
  description:
    "Travel management, luxury heritage tours in Serowe, family tours across SADC and beyond, health & wellness journeys, plus adventure tourism and events.",
};

export default async function ServicesPage() {
  const images = await getSiteImages();
  return (
    <>
      <PageHero
        eyebrow="Services & Tours"
        title="Everything for the journey ahead"
        subtitle="From managed corporate travel to curated niche tours — explore how we can help."
        image={images.page_hero_services}
      />

      <section className="py-24">
        <Container>
          <div className="space-y-24">
            {services.map((svc, i) => {
              const reversed = i % 2 === 1;
              return (
                <div
                  key={svc.key}
                  id={svc.key}
                  className="grid scroll-mt-28 items-center gap-10 lg:grid-cols-2"
                >
                  <Reveal
                    className={cn(
                      "relative aspect-[4/3] overflow-hidden rounded-3xl shadow-card",
                      reversed && "lg:order-2",
                    )}
                  >
                    <Image
                      src={images[svc.imageSlot]}
                      alt={svc.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </Reveal>
                  <div className={cn(reversed && "lg:order-1")}>
                    <p className="eyebrow">0{i + 1}</p>
                    <h2 className="mt-3 font-display text-3xl font-semibold text-ink">
                      {svc.title}
                    </h2>
                    <p className="mt-4 text-ink-soft leading-relaxed">
                      {svc.body}
                    </p>
                    <ul className="mt-6 space-y-3">
                      {svc.points.map((p) => (
                        <li key={p} className="flex items-start gap-3">
                          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold-dark">
                            <Check size={14} />
                          </span>
                          <span className="text-ink-soft">{p}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      href="/contact"
                      variant="outline"
                      className="mt-8"
                    >
                      Enquire <ArrowRight size={16} />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="bg-cream py-20">
        <Container className="text-center">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold text-ink">
              Not sure where to start?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-ink-soft">
              Share your ideas and our travel experts will design a package
              tailored to you.
            </p>
            <Button href="/contact" variant="ember" size="lg" className="mt-7">
              Talk to an Expert
            </Button>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
