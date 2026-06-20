import { Inbox } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Enquiry } from "@/lib/types";
import { EnquiryCard } from "@/components/admin/EnquiryCard";

export const dynamic = "force-dynamic";

export default async function AdminEnquiriesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false });
  const enquiries = (data as Enquiry[]) ?? [];
  const newCount = enquiries.filter((e) => e.status === "new").length;

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink">
        Enquiries
      </h1>
      <p className="mt-1 text-ink-soft">
        {enquiries.length} total
        {newCount > 0 && (
          <span className="ml-2 rounded-full bg-ember/12 px-2.5 py-0.5 text-xs font-medium text-ember">
            {newCount} new
          </span>
        )}
      </p>

      {enquiries.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-sand bg-white p-12 text-center">
          <Inbox size={36} className="mx-auto text-gold" />
          <h2 className="mt-4 font-display text-xl font-semibold text-ink">
            No enquiries yet
          </h2>
          <p className="mt-2 text-ink-soft">
            Submissions from the website contact form will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {enquiries.map((e) => (
            <EnquiryCard key={e.id} enquiry={e} />
          ))}
        </div>
      )}
    </div>
  );
}
