import type { Metadata } from "next";
import { Suspense } from "react";
import { Mail, Phone, MapPin, MessageCircle, Clock } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/components/site/ContactForm";
import { site } from "@/lib/site";
import { getSiteImages } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Serowe Travel for general enquiries, package requests and corporate travel management. Call, email or send us a message.",
};

export default async function ContactPage() {
  const images = await getSiteImages();
  return (
    <>
      <PageHero
        eyebrow="Contact Us"
        title="Let's plan your next journey"
        subtitle="General enquiries, package requests or corporate travel — we're here to help."
        image={images.page_hero_contact}
      />

      <section className="py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-5">
            {/* Details */}
            <div className="lg:col-span-2">
              <h2 className="font-display text-2xl font-semibold text-ink">
                Get in touch
              </h2>
              <p className="mt-3 text-ink-soft">
                Reach us directly or send a message and our team will respond as
                soon as possible.
              </p>

              <ul className="mt-8 space-y-5">
                <ContactRow
                  icon={<MapPin size={20} />}
                  label="Visit us"
                  value={site.address.physical}
                />
                <ContactRow
                  icon={<Mail size={20} />}
                  label="Email"
                  value={site.email}
                  href={`mailto:${site.email}`}
                />
                <ContactRow
                  icon={<Phone size={20} />}
                  label="Call us"
                  value={site.phones.join("  ·  ")}
                  href={`tel:${site.phones[0].replace(/\s/g, "")}`}
                />
                <ContactRow
                  icon={<MessageCircle size={20} />}
                  label="WhatsApp"
                  value={site.whatsapp}
                />
                <ContactRow
                  icon={<MapPin size={20} />}
                  label="Postal address"
                  value={site.address.postal}
                />
                <ContactRow
                  icon={<Clock size={20} />}
                  label="Office hours"
                  value="Mon – Fri, 08:00 – 17:00"
                />
              </ul>

              <div className="mt-8 overflow-hidden rounded-2xl border border-sand shadow-soft">
                <iframe
                  title="Serowe Travel location"
                  src="https://www.google.com/maps?q=Mokgampo%20Investment%20Centre%2C%20Serowe%2C%20Botswana&output=embed"
                  width="100%"
                  height="260"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <Suspense
                fallback={
                  <div className="rounded-3xl border border-sand bg-white p-9 text-ink-soft shadow-card">
                    Loading form…
                  </div>
                }
              >
                <ContactForm />
              </Suspense>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <li className="flex items-start gap-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/12 text-gold-dark">
        {icon}
      </span>
      <div>
        <p className="text-xs uppercase tracking-widest text-ink-soft">
          {label}
        </p>
        {href ? (
          <a
            href={href}
            className="font-medium text-ink transition-colors hover:text-gold-dark"
          >
            {value}
          </a>
        ) : (
          <p className="font-medium text-ink">{value}</p>
        )}
      </div>
    </li>
  );
}
