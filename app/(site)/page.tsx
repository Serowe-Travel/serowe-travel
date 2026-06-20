import Link from "next/link";
import Image from "next/image";
import {
  Award,
  Leaf,
  Globe2,
  ArrowRight,
  Plane,
  ShieldCheck,
} from "lucide-react";
import { Hero } from "@/components/site/Hero";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PackageCard } from "@/components/site/PackageCard";
import { valueProps, services, destinations } from "@/lib/site";
import { getFeaturedPackages } from "@/lib/queries";

const VP_ICON = {
  badge: Award,
  leaf: Leaf,
  globe: Globe2,
} as const;

export default async function HomePage() {
  const featured = await getFeaturedPackages(3);

  return (
    <>
      <Hero />

      {/* Value propositions */}
      <section className="relative -mt-16 z-20">
        <Container>
          <div className="grid gap-5 sm:grid-cols-3">
            {valueProps.map((vp, i) => {
              const Icon = VP_ICON[vp.icon as keyof typeof VP_ICON];
              return (
                <Reveal
                  key={vp.title}
                  delay={i * 120}
                  className="rounded-2xl bg-white p-7 shadow-card ring-1 ring-sand/70"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/12 text-gold-dark">
                    <Icon size={24} />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold text-ink">
                    {vp.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {vp.body}
                  </p>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* About preview */}
      <section className="py-24">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-card">
                <Image
                  src="/images/gallery/heritage-homestead.jpg"
                  alt="Heritage homestead in the Central Region"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-2 hidden rounded-2xl bg-ember px-6 py-5 text-white shadow-card sm:block">
                <p className="font-display text-3xl font-semibold">10+</p>
                <p className="text-xs uppercase tracking-widest">
                  Years of expertise
                </p>
              </div>
            </Reveal>

            <div>
              <SectionHeading
                align="left"
                eyebrow="Who We Are"
                title="Local roots in Serowe, connections across the world"
                intro="Established in 2013 and operating since 2015 from the Mokgampo Investment Centre, Serowe Travel is an independent travel and tours company specialising in luxury and sustainable travel. We brand and market Botswana's Central Region as a destination of choice — while opening the world to our travellers."
              />
              <ul className="mt-6 space-y-3">
                {[
                  "IATA accredited & Amadeus Central Reservation System partner",
                  "Licensed Category D — Department of Tourism",
                  "Customised packages that enhance heritage & tourism",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-ink-soft">
                    <ShieldCheck
                      size={20}
                      className="mt-0.5 shrink-0 text-gold"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button href="/about" variant="outline" className="mt-8">
                Read Our Story <ArrowRight size={18} />
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Services */}
      <section className="bg-cream py-24">
        <Container>
          <SectionHeading
            eyebrow="What We Do"
            title="Travel, expertly arranged"
            intro="From managed corporate travel to once-in-a-lifetime journeys, every Serowe Travel experience is tailored to you."
          />
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map((svc, i) => (
              <Reveal
                key={svc.key}
                delay={(i % 3) * 100}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-sand/70 transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={svc.image}
                    alt={svc.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/55 to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-lg font-semibold text-ink">
                    {svc.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {svc.short}
                  </p>
                </div>
              </Reveal>
            ))}
            <Reveal
              delay={200}
              className="flex flex-col items-start justify-center rounded-2xl bg-ink p-7 text-white shadow-soft"
            >
              <Plane size={28} className="text-gold-light" />
              <h3 className="mt-4 font-display text-xl font-semibold">
                Something bespoke in mind?
              </h3>
              <p className="mt-2 text-sm text-cream/80">
                Tell us where you dream of going and we&apos;ll craft the
                journey around you.
              </p>
              <Button href="/services" variant="primary" className="mt-5">
                All Services <ArrowRight size={16} />
              </Button>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Featured packages — hidden when none are published */}
      {featured.length > 0 && (
        <section className="py-24">
          <Container>
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row sm:text-left">
              <SectionHeading
                align="left"
                eyebrow="Featured"
                title="Hand-picked journeys"
                className="mx-0"
              />
              <Button href="/packages" variant="outline">
                View All Packages <ArrowRight size={16} />
              </Button>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featured.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Destinations preview */}
      <section className="bg-cream py-24">
        <Container>
          <SectionHeading
            eyebrow="Where To Next"
            title="Destinations we love"
            intro="From the waterways of the Okavango to the islands of Mauritius and the wellness retreats of Thailand."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {destinations.map((d, i) => (
              <Reveal
                key={d.region}
                delay={i * 120}
                className="group relative overflow-hidden rounded-3xl shadow-card"
              >
                <div className="relative aspect-[3/4]">
                  <Image
                    src={d.image}
                    alt={d.region}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <h3 className="font-display text-2xl font-semibold">
                    {d.region}
                  </h3>
                  <p className="mt-1 text-sm text-cream/85 line-clamp-2">
                    {d.blurb}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button href="/destinations" variant="primary">
              Explore Destinations <ArrowRight size={16} />
            </Button>
          </div>
        </Container>
      </section>

      {/* CTA band */}
      <section className="relative overflow-hidden py-24">
        <Image
          src="/images/hero/safari-vehicle.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-ink/75" />
        <Container className="relative text-center">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
              Your journey starts here
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-cream/85">
              Tell us about the trip you&apos;re dreaming of. Our team will be in
              touch to start planning.
            </p>
            <Button href="/contact" variant="ember" size="lg" className="mt-8">
              Plan Your Trip <ArrowRight size={18} />
            </Button>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
