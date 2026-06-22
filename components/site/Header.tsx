"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { mainNav } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-[0_2px_20px_-8px_rgba(33,27,18,0.25)]"
          : "bg-white/70 backdrop-blur-sm",
      )}
    >
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/images/brand/logo.png"
            alt="Serowe Travel"
            width={52}
            height={52}
            className="h-12 w-12 object-contain transition-transform duration-500 group-hover:rotate-[18deg]"
            priority
          />
          <span className="font-display text-xl font-semibold text-ink leading-none">
            Serowe<span className="text-gold"> Travel</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {mainNav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative text-sm font-medium transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:bg-gold after:transition-all after:duration-300",
                  active
                    ? "text-gold-dark after:w-full"
                    : "text-ink-soft hover:text-ink after:w-0 hover:after:w-full",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2.5 lg:flex">
          <Button href="/login" variant="outline" size="sm">
            Login
          </Button>
          <Button href="/contact" variant="ember" size="sm">
            Plan Your Trip
          </Button>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden p-2 text-ink"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "lg:hidden overflow-hidden border-t border-sand bg-white transition-[max-height] duration-300",
          open ? "max-h-[420px]" : "max-h-0 border-t-0",
        )}
      >
        <nav className="flex flex-col px-5 py-3">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="py-3 text-base font-medium text-ink-soft hover:text-gold-dark border-b border-sand/60 last:border-0"
            >
              {item.label}
            </Link>
          ))}
          <Button href="/login" variant="outline" className="mt-4 w-full">
            Login
          </Button>
          <Button href="/contact" variant="ember" className="mt-2 mb-2 w-full">
            Plan Your Trip
          </Button>
        </nav>
      </div>
    </header>
  );
}
