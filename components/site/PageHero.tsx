import Image from "next/image";
import { Container } from "@/components/ui/Container";

export function PageHero({
  title,
  subtitle,
  image,
  eyebrow,
}: {
  title: string;
  subtitle?: string;
  image: string;
  eyebrow?: string;
}) {
  return (
    <section className="relative flex min-h-[46vh] items-end overflow-hidden">
      <Image
        src={image}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/45 to-ink/25" />
      <Container className="relative z-10 pb-14 pt-32">
        <div className="max-w-2xl">
          {eyebrow && (
            <p className="eyebrow !text-gold-light">{eyebrow}</p>
          )}
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-white sm:text-5xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-4 max-w-xl text-lg text-cream/90">{subtitle}</p>
          )}
        </div>
      </Container>
    </section>
  );
}
