import type { Metadata } from "next";
import Image from "next/image";
import {
  Target,
  Eye,
  Award,
  Building2,
  BedDouble,
  ShieldCheck,
  GraduationCap,
  BookOpen,
  Users,
  Package,
  Globe2,
  type LucideIcon,
} from "lucide-react";
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

const credentials: {
  Icon: LucideIcon;
  title: string;
  body: string;
  image?: string;
}[] = [
  {
    Icon: Award,
    title: "IATA Accreditation & Amadeus Partner",
    body: "Internationally recognised IATA accreditation for ticketing and travel services, backed by an Amadeus Central Reservation System partnership for flights, hotels and car hire worldwide.",
    image: "/images/IATA%20LOGO%20TRANS.png",
  },
  {
    Icon: Building2,
    title: "Tourism Licence",
    body: "Fully licensed through Botswana's Department of Tourism under Category D — every booking is handled by an accredited, fully compliant travel agency you can rely on.",
  },
  {
    Icon: BedDouble,
    title: "RateHawk & Stay Global",
    body: "Partnered with RateHawk and Stay Global for instant access to hundreds of thousands of hotels worldwide, with competitive rates and real-time availability.",
  },
];

const qualityAreas: { Icon: LucideIcon; area: string; body: string }[] = [
  {
    Icon: ShieldCheck,
    area: "Management",
    body: "Top management quality leadership and commitment.",
  },
  {
    Icon: GraduationCap,
    area: "Employees",
    body: "Quality training and education, involvement and empowerment, rewards and recognition.",
  },
  {
    Icon: BookOpen,
    area: "Information",
    body: "Quality information availability and usage.",
  },
  {
    Icon: Users,
    area: "Customer",
    body: "Customer orientation and meeting their expectations.",
  },
  {
    Icon: Package,
    area: "Supplier",
    body: "Preferred supplier quality development.",
  },
  {
    Icon: Globe2,
    area: "Community",
    body: "Social quality practices.",
  },
];

export default async function AboutPage() {
  const images = await getSiteImages();
  return (
    <>
      <PageHero
        eyebrow="About Serowe Travel"
        title="Local expertise, global connections"
        subtitle="A service oriented travel company branding Botswana's Central Region as a destination of choice."
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

      {/* Our team */}
      <section className="bg-cream py-24">
        <Container>
          <SectionHeading
            eyebrow="Our People"
            title="Our team"
            intro="Our travel professionals are empowered with the Global Distribution System (GDS) qualification to deliver real-time competence in meeting client expectations. Our management provides quality management to fulfil customer needs and expectations."
          />
          <p className="mx-auto mt-5 max-w-2xl text-center font-medium text-ink">
            Our quality management entails, but is not limited to:
          </p>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {qualityAreas.map((q, i) => (
              <Reveal
                key={q.area}
                delay={(i % 3) * 90}
                className="rounded-2xl border border-sand bg-white p-6 shadow-soft"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/12 text-gold-dark">
                  <q.Icon size={24} />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-ink">
                  {q.area}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {q.body}
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
            {credentials.map((c, i) => (
              <Reveal
                key={c.title}
                delay={i * 110}
                className="rounded-2xl border border-cream/15 bg-white/5 p-7"
              >
                <div className="flex h-16 w-28 items-center justify-center rounded-xl bg-white px-3">
                  {c.image ? (
                    <Image
                      src={c.image}
                      alt={c.title}
                      width={96}
                      height={40}
                      className="max-h-10 w-auto object-contain"
                    />
                  ) : (
                    <c.Icon size={30} className="text-gold-dark" />
                  )}
                </div>
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
