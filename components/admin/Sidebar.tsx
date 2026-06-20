"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Inbox,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/packages", label: "Packages", icon: Package },
  { href: "/admin/enquiries", label: "Enquiries", icon: Inbox },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function Sidebar({
  name,
  role,
}: {
  name: string;
  role: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-sand bg-white px-4 py-3 lg:hidden">
        <Link href="/admin" className="flex items-center gap-2">
          <Image
            src="/images/brand/logo.png"
            alt=""
            width={32}
            height={32}
            className="h-8 w-8 object-contain"
          />
          <span className="font-display font-semibold">Serowe Admin</span>
        </Link>
        <button onClick={() => setOpen((v) => !v)} aria-label="Menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <aside
        className={cn(
          "border-r border-sand bg-white lg:flex lg:w-64 lg:flex-col",
          open ? "block" : "hidden lg:block",
        )}
      >
        <div className="hidden items-center gap-3 border-b border-sand px-6 py-5 lg:flex">
          <Image
            src="/images/brand/logo.png"
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
          />
          <div className="leading-tight">
            <p className="font-display font-semibold text-ink">Serowe Travel</p>
            <p className="text-xs text-ink-soft">Staff Area</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1 p-3">
          {NAV.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-gold/15 text-gold-dark"
                    : "text-ink-soft hover:bg-sand",
                )}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-sand p-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-ink-soft hover:bg-sand"
          >
            <ExternalLink size={18} /> View website
          </Link>
          <div className="mt-2 rounded-xl bg-cream px-4 py-3">
            <p className="truncate text-sm font-medium text-ink">{name}</p>
            <p className="text-xs uppercase tracking-wide text-gold-dark">
              {role}
            </p>
          </div>
          <button
            onClick={signOut}
            className="mt-2 flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-ember hover:bg-ember/10"
          >
            <LogOut size={18} /> Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
