import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  GraduationCap,
  Laptop,
  BedDouble,
  Users,
  Mail,
  Phone,
  BadgeCheck,
  Link2,
  BookOpen,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { getSiteImages } from "@/lib/queries";

export const metadata: Metadata = {
  title: "DLM Group",
  description:
    "DLM Group (Pty) Ltd — a one-stop global service centre and solution-driven service in the travel and tourism industry. Training, virtual assist, hospitality, recruitment and more.",
};

// DLM brand palette (kept local to this page so it doesn't affect the
// site-wide Serowe Travel gold theme).
// burgundy #560000 · red #C0202B · gray #58595B · white

const featuredServices = [
  {
    Icon: GraduationCap,
    title: "DLM Training & Development",
    body: "Short courses that enhance your qualifications in the travel & tourism space.",
    points: [],
  },
  {
    Icon: Laptop,
    title: "DLM Virtual Assist Services",
    body: "Remote business support for travel operators.",
    points: [
      "Company secretarial services",
      "Tourism License & IATA applications",
      "Visa services",
      "Travel policy management",
    ],
  },
  {
    Icon: BedDouble,
    title: "DLM Hospitality",
    body: "Hotel, lodge and guest house marketing and management.",
    points: [],
  },
  {
    Icon: Users,
    title: "DLM Tourism Recruitment Agency",
    body: "Matching entities in need of travel staff with travel staff in need of employment.",
    points: ["Recruitment of staff", "Placement", "Internship programme"],
  },
];

const motto = [
  { Icon: Link2, label: "Connect" },
  { Icon: BookOpen, label: "Learn" },
  { Icon: TrendingUp, label: "Grow" },
];

const contacts = [
  { name: "Dimakatso Leteane", phones: ["71 459 292", "76 991 195"] },
];

export default async function DlmGroupPage() {
  const images = await getSiteImages();

  return (
    <>
      <PageHero
        eyebrow="DLM Group (Pty) Ltd"
        title="A one-stop global service centre"
        subtitle="A solution-driven service in the travel and tourism industry."
        image={images.page_hero_dlm}
      />

      {/* Intro — logo, motto & accreditation */}
      <section className="bg-white py-20">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal className="flex justify-center lg:justify-start">
              <div className="relative h-56 w-56 overflow-hidden rounded-3xl border border-[#560000]/15 bg-white p-6 shadow-card">
                <Image
                  src={images.dlm_logo}
                  alt="DLM Group"
                  fill
                  sizes="224px"
                  className="object-contain p-6"
                />
              </div>
            </Reveal>

            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-[#C0202B]">
                Who we are
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-[#560000]">
                Solution-driven service, globally connected
              </h2>
              <p className="mt-4 leading-relaxed text-[#58595B]">
                DLM Group is a one-stop global service centre and a
                solution-driven service in the travel and tourism industry —
                bringing together training, business support, hospitality,
                recruitment, distribution and more under one roof. Serowe Travel
                is part of the DLM Group.
              </p>

              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#560000]/8 px-4 py-2 text-sm font-medium text-[#560000]">
                <BadgeCheck size={18} className="text-[#C0202B]" />
                IATA accredited
              </div>

              {/* Motto: Connect · Learn · Grow */}
              <div className="mt-7 flex flex-wrap gap-3">
                {motto.map(({ Icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-2 rounded-full bg-[#560000] px-5 py-2.5 text-sm font-semibold text-white"
                  >
                    <Icon size={16} className="text-[#E8A0A8]" />
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Featured services */}
      <section className="bg-[#F6F1F2] py-20">
        <Container>
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#C0202B]">
              What we do
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-[#560000]">
              Our core services
            </h2>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {featuredServices.map((svc, i) => (
              <Reveal
                key={svc.title}
                delay={(i % 2) * 100}
                className="group rounded-3xl border border-[#560000]/10 bg-white p-8 shadow-soft transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#560000]/8 text-[#560000]">
                  <svc.Icon size={28} />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold text-[#560000]">
                  {svc.title}
                </h3>
                <p className="mt-2 leading-relaxed text-[#58595B]">{svc.body}</p>
                {svc.points.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {svc.points.map((p) => (
                      <li
                        key={p}
                        className="flex items-start gap-2.5 text-sm text-[#58595B]"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C0202B]" />
                        {p}
                      </li>
                    ))}
                  </ul>
                )}
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Available — flyer */}
      <section className="bg-white py-20">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-[#C0202B]">
                Available
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-[#560000]">
                Flight reservations, ready when you are
              </h2>
              <p className="mt-4 leading-relaxed text-[#58595B]">
                Book your next flight through DLM Group and Serowe Travel. From
                local departures to international routes, we secure competitive
                fares and handle the reservation from start to finish.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Local, regional & international flights",
                  "Competitive, real-time fares",
                  "Reservations handled end-to-end",
                ].map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-2.5 text-[#58595B]"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C0202B]" />
                    {point}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-[#560000] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#3D0000]"
              >
                Make a reservation <ArrowRight size={16} />
              </Link>
            </div>

            <Reveal className="flex justify-center">
              <div className="overflow-hidden rounded-3xl border border-[#560000]/10 bg-white shadow-card">
                <Image
                  src="/images/flightreservationflyer.jpeg"
                  alt="DLM Group flight reservation flyer"
                  width={854}
                  height={1280}
                  className="h-auto w-full max-w-md"
                />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Contact + motto footer */}
      <section className="bg-[#560000] py-20 text-white">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl font-semibold">
                Get in touch
              </h2>
              <p className="mt-3 text-white/80">
                Talk to the DLM Group team about training, business support,
                hospitality, recruitment and more.
              </p>

              <div className="mt-8 space-y-5">
                {contacts.map((c) => (
                  <div
                    key={c.name}
                    className="rounded-2xl border border-white/15 bg-white/5 p-5"
                  >
                    <p className="font-medium text-white">{c.name}</p>
                    <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1.5">
                      {c.phones.map((p) => (
                        <a
                          key={p}
                          href={`tel:+267${p.replace(/\s/g, "")}`}
                          className="inline-flex items-center gap-2 text-sm text-white/85 transition-colors hover:text-[#E8A0A8]"
                        >
                          <Phone size={15} className="text-[#E8A0A8]" />
                          {p}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
                <a
                  href="mailto:info@serowetravel.com"
                  className="inline-flex items-center gap-2 text-sm font-medium text-white transition-colors hover:text-[#E8A0A8]"
                >
                  <Mail size={16} className="text-[#E8A0A8]" />
                  info@serowetravel.com
                </a>
              </div>
            </div>

            <div className="flex flex-col justify-center rounded-3xl bg-white/5 p-9 ring-1 ring-white/10">
              <div className="flex flex-wrap gap-3">
                {motto.map(({ Icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#560000]"
                  >
                    <Icon size={16} className="text-[#C0202B]" />
                    {label}
                  </span>
                ))}
              </div>
              <p className="mt-6 font-display text-4xl font-semibold leading-tight">
                Connect. Learn. Grow.
              </p>
              <p className="mt-3 text-lg italic text-[#E8A0A8]">
                Consider it done.
              </p>
              <Button
                href="/contact"
                variant="light"
                className="mt-8 w-fit !text-[#560000]"
              >
                Start a conversation <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
