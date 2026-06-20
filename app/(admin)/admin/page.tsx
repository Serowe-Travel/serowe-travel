import Link from "next/link";
import {
  Package,
  Inbox,
  CheckCircle2,
  FileEdit,
  ArrowRight,
  Plus,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Enquiry } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getStats() {
  const supabase = await createClient();
  const [pubP, draftP, newE, totalE, recent] = await Promise.all([
    supabase
      .from("packages")
      .select("id", { count: "exact", head: true })
      .eq("status", "published"),
    supabase
      .from("packages")
      .select("id", { count: "exact", head: true })
      .eq("status", "draft"),
    supabase
      .from("enquiries")
      .select("id", { count: "exact", head: true })
      .eq("status", "new"),
    supabase.from("enquiries").select("id", { count: "exact", head: true }),
    supabase
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);
  return {
    published: pubP.count ?? 0,
    drafts: draftP.count ?? 0,
    newEnquiries: newE.count ?? 0,
    totalEnquiries: totalE.count ?? 0,
    recent: (recent.data as Enquiry[]) ?? [],
  };
}

export default async function DashboardPage() {
  const stats = await getStats();

  const cards = [
    {
      label: "Published packages",
      value: stats.published,
      icon: Package,
      tint: "bg-gold/15 text-gold-dark",
    },
    {
      label: "Draft packages",
      value: stats.drafts,
      icon: FileEdit,
      tint: "bg-sand text-ink-soft",
    },
    {
      label: "New enquiries",
      value: stats.newEnquiries,
      icon: Inbox,
      tint: "bg-ember/12 text-ember",
    },
    {
      label: "Total enquiries",
      value: stats.totalEnquiries,
      icon: CheckCircle2,
      tint: "bg-green-100 text-green-700",
    },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">
            Dashboard
          </h1>
          <p className="mt-1 text-ink-soft">
            Welcome back — here&apos;s your overview.
          </p>
        </div>
        <Link
          href="/admin/packages/new"
          className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-medium text-white shadow-soft transition-colors hover:bg-gold-dark"
        >
          <Plus size={18} /> New Package
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-2xl border border-sand bg-white p-5 shadow-soft"
          >
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl ${c.tint}`}
            >
              <c.icon size={22} />
            </div>
            <p className="mt-4 font-display text-3xl font-semibold text-ink">
              {c.value}
            </p>
            <p className="text-sm text-ink-soft">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-sand bg-white shadow-soft">
        <div className="flex items-center justify-between border-b border-sand px-6 py-4">
          <h2 className="font-display text-lg font-semibold text-ink">
            Recent enquiries
          </h2>
          <Link
            href="/admin/enquiries"
            className="inline-flex items-center gap-1 text-sm font-medium text-gold-dark hover:underline"
          >
            View all <ArrowRight size={15} />
          </Link>
        </div>
        {stats.recent.length === 0 ? (
          <p className="px-6 py-10 text-center text-ink-soft">
            No enquiries yet.
          </p>
        ) : (
          <ul className="divide-y divide-sand">
            {stats.recent.map((e) => (
              <li
                key={e.id}
                className="flex items-center justify-between gap-4 px-6 py-4"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-ink">{e.name}</p>
                  <p className="truncate text-sm text-ink-soft">
                    {e.subject || e.message}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-ink-soft">
                  {new Date(e.created_at).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
