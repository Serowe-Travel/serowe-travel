import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";
import { mainNav, site } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
} from "@/components/site/SocialIcons";
import { getSiteSettings } from "@/lib/queries";
import { BackToTop } from "@/components/site/BackToTop";

export async function Footer({ logoSrc }: { logoSrc: string }) {
  const settings = await getSiteSettings();
  const socials = [
    { href: settings.facebook_url, Icon: FacebookIcon, label: "Facebook" },
    { href: settings.instagram_url, Icon: InstagramIcon, label: "Instagram" },
    { href: settings.linkedin_url, Icon: LinkedinIcon, label: "LinkedIn" },
  ].filter((s) => s.href);

  return (
    <footer className="mt-auto bg-ink text-cream/80">
      <Container className="py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3">
              <Image
                src={logoSrc}
                alt="Serowe Travel"
                width={48}
                height={48}
                className="h-12 w-12 object-contain"
              />
              <span className="font-display text-lg font-semibold text-white">
                Serowe Travel
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-cream/70">
              Luxury & sustainable travel, rooted in Botswana&apos;s Central
              Region with global reach. IATA accredited · Amadeus partner.
            </p>
            {socials.length > 0 && (
              <div className="mt-5 flex gap-3">
                {socials.map(({ href, Icon, label }) => (
                  <a
                    key={label}
                    href={href!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 text-cream/80 transition-colors hover:border-gold hover:bg-gold hover:text-white"
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-display text-base font-semibold text-white">
              Explore
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-cream/70 transition-colors hover:text-gold"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-base font-semibold text-white">
              Get in Touch
            </h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-gold" />
                <span>{site.address.physical}</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={18} className="mt-0.5 shrink-0 text-gold" />
                <a
                  href={`mailto:${site.email}`}
                  className="transition-colors hover:text-gold"
                >
                  {site.email}
                </a>
              </li>
              {site.phones.map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <Phone size={18} className="mt-0.5 shrink-0 text-gold" />
                  <a
                    href={`tel:${p.replace(/\s/g, "")}`}
                    className="transition-colors hover:text-gold"
                  >
                    {p}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Postal / hours */}
          <div>
            <h4 className="font-display text-base font-semibold text-white">
              Postal Address
            </h4>
            <p className="mt-4 text-sm leading-relaxed text-cream/70">
              {site.address.postal}
            </p>
            <p className="mt-4 text-xs uppercase tracking-widest text-gold">
              Licensed · Dept. of Tourism (Category D)
            </p>
          </div>
        </div>

        <div className="mt-12 flex justify-center border-t border-cream/15 pt-8">
          <BackToTop />
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 pt-2 text-xs text-cream/50 sm:flex-row">
          <p>
            © {new Date().getFullYear()} Serowe Travel. All rights reserved.
          </p>
          <div className="flex items-center gap-2.5">
            <span className="uppercase tracking-widest text-cream/60">
              Developer:
            </span>
            <a
              href="https://blueappstechnology.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="BlueApps Technology"
              className="inline-flex h-14 w-[164px] items-center justify-center rounded-lg bg-white px-1.5 transition-opacity hover:opacity-90"
            >
              <Image
                src="/blueapps.png"
                alt="BlueApps Technology"
                width={220}
                height={76}
                className="h-11 w-auto object-contain"
              />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
