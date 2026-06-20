"use client";

import { useState, useTransition } from "react";
import {
  Mail,
  Phone,
  ChevronDown,
  ChevronUp,
  Save,
  Trash2,
  Check,
} from "lucide-react";
import type { Enquiry, EnquiryStatus } from "@/lib/types";
import {
  updateEnquiry,
  deleteEnquiry,
} from "@/app/(admin)/admin/enquiries/actions";
import { cn } from "@/lib/utils";

const STATUSES: { value: EnquiryStatus; label: string; cls: string }[] = [
  { value: "new", label: "New", cls: "bg-ember/12 text-ember" },
  { value: "in_progress", label: "In progress", cls: "bg-amber-100 text-amber-700" },
  { value: "replied", label: "Replied", cls: "bg-blue-100 text-blue-700" },
  { value: "closed", label: "Closed", cls: "bg-green-100 text-green-700" },
];

export function EnquiryCard({ enquiry }: { enquiry: Enquiry }) {
  const [open, setOpen] = useState(enquiry.status === "new");
  const [status, setStatus] = useState<EnquiryStatus>(enquiry.status);
  const [notes, setNotes] = useState(enquiry.notes ?? "");
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();
  const [confirmDel, setConfirmDel] = useState(false);

  const current = STATUSES.find((s) => s.value === status) ?? STATUSES[0];

  function changeStatus(next: EnquiryStatus) {
    setStatus(next);
    startTransition(async () => {
      await updateEnquiry(enquiry.id, { status: next });
    });
  }

  function saveNotes() {
    startTransition(async () => {
      await updateEnquiry(enquiry.id, { notes });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-sand bg-white shadow-soft">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-4 px-5 py-4 text-left"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate font-medium text-ink">{enquiry.name}</p>
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-xs font-medium",
                current.cls,
              )}
            >
              {current.label}
            </span>
          </div>
          <p className="truncate text-sm text-ink-soft">
            {enquiry.subject || enquiry.message}
          </p>
        </div>
        <span className="shrink-0 text-xs text-ink-soft">
          {new Date(enquiry.created_at).toLocaleDateString()}
        </span>
        {open ? (
          <ChevronUp size={18} className="text-ink-soft" />
        ) : (
          <ChevronDown size={18} className="text-ink-soft" />
        )}
      </button>

      {open && (
        <div className="border-t border-sand bg-cream/40 px-5 py-5">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <a
              href={`mailto:${enquiry.email}`}
              className="inline-flex items-center gap-1.5 text-ink hover:text-gold-dark"
            >
              <Mail size={15} className="text-gold" /> {enquiry.email}
            </a>
            {enquiry.phone && (
              <a
                href={`tel:${enquiry.phone}`}
                className="inline-flex items-center gap-1.5 text-ink hover:text-gold-dark"
              >
                <Phone size={15} className="text-gold" /> {enquiry.phone}
              </a>
            )}
          </div>

          <div className="mt-4 rounded-xl bg-white p-4 text-sm leading-relaxed text-ink-soft whitespace-pre-line">
            {enquiry.message}
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <span className="text-xs font-medium uppercase tracking-wide text-ink-soft">
                Status
              </span>
              <div className="mt-2 flex flex-wrap gap-2">
                {STATUSES.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => changeStatus(s.value)}
                    disabled={pending}
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium transition-all",
                      status === s.value
                        ? s.cls + " ring-2 ring-offset-1 ring-gold/40"
                        : "bg-sand text-ink-soft hover:bg-gold/15",
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-end justify-end">
              <a
                href={`mailto:${enquiry.email}?subject=RE: ${encodeURIComponent(
                  enquiry.subject || "Your enquiry to Serowe Travel",
                )}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-gold px-4 py-2 text-sm font-medium text-white hover:bg-gold-dark"
              >
                <Mail size={15} /> Reply by email
              </a>
            </div>
          </div>

          <label className="mt-4 block">
            <span className="text-xs font-medium uppercase tracking-wide text-ink-soft">
              Internal notes
            </span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Add a note for the team…"
              className="mt-2 w-full rounded-xl border border-sand bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
            />
          </label>

          <div className="mt-3 flex items-center justify-between">
            <button
              onClick={saveNotes}
              disabled={pending}
              className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-ink/90 disabled:opacity-60"
            >
              {saved ? <Check size={15} /> : <Save size={15} />}
              {saved ? "Saved" : "Save notes"}
            </button>

            {confirmDel ? (
              <span className="inline-flex items-center gap-2 text-xs">
                <span className="text-ink-soft">Delete enquiry?</span>
                <button
                  onClick={() =>
                    startTransition(async () => {
                      await deleteEnquiry(enquiry.id);
                    })
                  }
                  className="font-medium text-ember hover:underline"
                >
                  Yes
                </button>
                <button
                  onClick={() => setConfirmDel(false)}
                  className="text-ink-soft hover:underline"
                >
                  No
                </button>
              </span>
            ) : (
              <button
                onClick={() => setConfirmDel(true)}
                className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ember"
              >
                <Trash2 size={15} /> Delete
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
