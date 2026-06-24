import type { Metadata } from "next";
import Image from "next/image";
import { Target, Eye, Award, Building2, Compass } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { companyValues } from "@/lib/site";
import { getSiteImages } from "@/lib/queries";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Established in 2013, Serowe Travel is an independent, IATA-accredited travel agency rooted in Botswana's Central Region, specialising in luxury and sustainable travel.",
};

export default async function AboutPage() {
  const images = await getSiteImages();
  return (
    <>
      <PageHero
        eyebrow="About Serowe Travel"
        title="Local expertise, global connections"
        subtitle="A service-oriented travel company branding Botswana's Central Region as a destination of choice."
        image={images.page_hero_about}
      />

      {/* Our story */}
      <section className="py-24">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-card">
                <Image
                  src={images.about_story}
                  alt="Aerial view of a delta camp"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
            <div>
              <SectionHeading
                align="left"
                eyebrow="Our Story"
                title="Rooted in Serowe since 2013"
              />
              <div className="mt-5 space-y-4 text-ink-soft leading-relaxed">
                <p>
                  Serowe Travel was established in 2013 and began operations in
                  2015, based at the Mokgampo Investment Centre in Serowe. We are
                  an independent travel and tours company specialising in luxury
                  and sustainable travel all around the world.
                </p>
                <p>
                  We are a service-oriented business that seeks to brand and
                  market the Central Region as a destination of choice through
                  tours and events — offering customised packages that enhance
                  the tourism and heritage of Serowe, Palapye and their
                  environs.
                </p>
                <p>
                  Our objective is to develop and market family tours to other
                  destinations in the SADC and international regions, and to
                  promote health-oriented tours to destinations such as
                  Indonesia and Thailand.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Mission & Vision */}
      <section className="bg-cream py-24">
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            <Reveal className="rounded-3xl bg-white p-9 shadow-soft ring-1 ring-sand/70">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/12 text-gold-dark">
                <Target size={24} />
              </div>
              <h3 className="mt-5 font-display text-2xl font-semibold text-ink">
                Our Mission
              </h3>
              <p className="mt-3 text-ink-soft leading-relaxed">
                To be the best cost-effective one-stop service provider in the
                travel and tourism industry, and to plough back our expertise
                into the community.
              </p>
            </Reveal>
            <Reveal
              delay={120}
              className="rounded-3xl bg-white p-9 shadow-soft ring-1 ring-sand/70"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ember/12 text-ember">
                <Eye size={24} />
              </div>
              <h3 className="mt-5 font-display text-2xl font-semibold text-ink">
                Our Vision
              </h3>
              <p className="mt-3 text-ink-soft leading-relaxed">
                To be Botswana&apos;s leading travel agency, recognised locally
                and globally for delivering exceptional, personalised travel
                experiences that inspire exploration, connection and lifelong
                memories.
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="py-24">
        <Container>
          <SectionHeading
            eyebrow="What We Stand For"
            title="Our values"
            intro="We pride ourselves on the knowledge and vast experience we bring to everything we do."
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {companyValues.map((v, i) => (
              <Reveal
                key={v.title}
                delay={i * 90}
                className="rounded-2xl border border-sand bg-white p-6 text-center shadow-soft"
              >
                <span className="font-display text-3xl font-semibold text-gold">
                  0{i + 1}
                </span>
                <h3 className="mt-3 font-display text-lg font-semibold text-ink">
                  {v.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {v.body}
                </p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Expertise / accreditation */}
      <section className="bg-ink py-24 text-white">
        <Container>
          <SectionHeading
            light
            eyebrow="Our Expertise"
            title="Accredited, licensed and connected"
            intro="The credentials behind every journey we plan."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              {
                Icon: Award,
                title: "IATA Accreditation",
                body: "Internationally recognised accreditation for ticketing and travel services you can trust.",
              },
              {
                Icon: Compass,
                title: "Amadeus Partner",
                body: "Connected to the Amadeus Central Reservation System for flights, hotels and car hire worldwide.",
              },
              {
                Icon: Building2,
                title: "Licensed — Category D",
                body: "Fully licensed through Botswana's Department of Tourism.",
              },
            ].map((c, i) => (
              <Reveal
                key={c.title}
                delay={i * 110}
                className="rounded-2xl border border-cream/15 bg-white/5 p-7"
              >
                <c.Icon size={28} className="text-gold-light" />
                <h3 className="mt-4 font-display text-lg font-semibold text-white">
                  {c.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-cream/75">
                  {c.body}
                </p>
              </Reveal>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button href="/contact" variant="ember" size="lg">
              Start Planning With Us
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
