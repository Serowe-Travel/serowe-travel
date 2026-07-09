"use client";

import { useActionState, useState, useTransition } from "react";
import Image from "next/image";
import {
  Check,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Trash2,
  Loader2,
  Eye,
  EyeOff,
  Plane,
} from "lucide-react";
import { ImageUploader } from "@/components/admin/ImageUploader";
import {
  createAirline,
  deleteAirline,
  toggleAirline,
  moveAirline,
  type AirlineActionState,
} from "@/app/(admin)/admin/airlines/actions";
import type { Airline } from "@/lib/types";

const initial: AirlineActionState = { ok: false, message: "" };

export function AirlinesManager({
  airlines,
  canEdit,
}: {
  airlines: Airline[];
  canEdit: boolean;
}) {
  return (
    <div className="grid gap-8 lg:grid-cols-5">
      {canEdit && (
        <div className="lg:col-span-2">
          {/* Remount on successful add (list grows) to clear the form. */}
          <AddAirlineForm key={airlines.length} />
        </div>
      )}
      <div className={canEdit ? "lg:col-span-3" : "lg:col-span-5"}>
        <AirlineList airlines={airlines} canEdit={canEdit} />
      </div>
    </div>
  );
}

function AddAirlineForm() {
  const [state, action, pending] = useActionState(createAirline, initial);
  const [logo, setLogo] = useState<string[]>([]);

  // Styling for the optional text fields (commented out below):
  // const fieldCls =
  //   "mt-1.5 w-full rounded-xl border border-sand bg-white px-4 py-2.5 text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/30";

  return (
    <form
      action={action}
      className="rounded-2xl border border-sand bg-white p-6 shadow-soft"
    >
      <h2 className="font-display text-lg font-semibold text-ink">
        Add an airline
      </h2>
      <p className="mt-1 text-sm text-ink-soft">
        Upload a logo — that&apos;s all that&apos;s shown on the website.
      </p>

      {/*
        Name, website link and description are not shown on the public
        airlines page (logos only), so they're disabled here. Uncomment to
        re-enable — the backend still stores these fields.

      <label className="mt-4 block">
        <span className="text-sm font-medium text-ink">Airline name</span>
        <input name="name" type="text" className={fieldCls} />
      </label>

      <label className="mt-4 block">
        <span className="text-sm font-medium text-ink">
          Website link <span className="text-ink-soft">(optional)</span>
        </span>
        <input
          name="link_url"
          type="text"
          placeholder="airline.com"
          className={fieldCls}
        />
      </label>

      <label className="mt-4 block">
        <span className="text-sm font-medium text-ink">
          Short description <span className="text-ink-soft">(optional)</span>
        </span>
        <textarea
          name="description"
          rows={3}
          maxLength={280}
          placeholder="A line or two about this airline."
          className={`${fieldCls} resize-y`}
        />
      </label>
      */}

      <div className="mt-4">
        <ImageUploader value={logo} onChange={setLogo} label="Logo / image" />
        <input type="hidden" name="logo_url" value={logo[0] ?? ""} />
      </div>

      {state.message && (
        <div
          className={`mt-4 flex items-start gap-2 rounded-xl p-3 text-sm ${
            state.ok ? "bg-green-50 text-green-700" : "bg-ember/10 text-ember-dark"
          }`}
        >
          {state.ok ? (
            <Check size={18} className="mt-0.5 shrink-0" />
          ) : (
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
          )}
          {state.message}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-2.5 font-medium text-white shadow-soft transition-colors hover:bg-gold-dark disabled:opacity-60"
      >
        {pending ? <Loader2 size={16} className="animate-spin" /> : null}
        {pending ? "Adding…" : "Add Airline"}
      </button>
    </form>
  );
}

function AirlineList({
  airlines,
  canEdit,
}: {
  airlines: Airline[];
  canEdit: boolean;
}) {
  if (airlines.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-sand bg-white p-12 text-center">
        <Plane size={32} className="mx-auto text-gold" />
        <h3 className="mt-4 font-display text-lg font-semibold text-ink">
          No airlines yet
        </h3>
        <p className="mt-2 text-sm text-ink-soft">
          Add airline logos to show them in the carousel on the Airlines page.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-sand bg-white shadow-soft">
      <ul className="divide-y divide-sand">
        {airlines.map((airline, i) => (
          <AirlineRow
            key={airline.id}
            airline={airline}
            canEdit={canEdit}
            isFirst={i === 0}
            isLast={i === airlines.length - 1}
          />
        ))}
      </ul>
    </div>
  );
}

function AirlineRow({
  airline,
  canEdit,
  isFirst,
  isLast,
}: {
  airline: Airline;
  canEdit: boolean;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  return (
    <li className="flex items-center gap-4 px-4 py-3 sm:px-5">
      <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-lg border border-sand bg-cream">
        <Image
          src={airline.logo_url}
          alt={airline.name}
          fill
          sizes="80px"
          className="object-contain p-1.5"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-ink">
          {airline.name || "Airline logo"}
        </p>
        {airline.description && (
          <p className="truncate text-sm text-ink-soft">
            {airline.description}
          </p>
        )}
        {airline.link_url && (
          <a
            href={airline.link_url}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate text-xs text-gold-dark hover:underline"
          >
            {airline.link_url}
          </a>
        )}
        {!airline.is_active && (
          <span className="ml-2 text-xs text-ink-soft">· Hidden</span>
        )}
      </div>

      {canEdit && (
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            onClick={() =>
              startTransition(() => moveAirline(airline.id, "up"))
            }
            disabled={pending || isFirst}
            className="rounded-lg p-1.5 text-ink-soft hover:bg-sand disabled:opacity-30"
            aria-label="Move up"
          >
            <ArrowUp size={16} />
          </button>
          <button
            onClick={() =>
              startTransition(() => moveAirline(airline.id, "down"))
            }
            disabled={pending || isLast}
            className="rounded-lg p-1.5 text-ink-soft hover:bg-sand disabled:opacity-30"
            aria-label="Move down"
          >
            <ArrowDown size={16} />
          </button>
          <button
            onClick={() =>
              startTransition(() =>
                toggleAirline(airline.id, !airline.is_active),
              )
            }
            disabled={pending}
            className="rounded-lg p-1.5 text-ink-soft hover:bg-sand disabled:opacity-40"
            aria-label={airline.is_active ? "Hide" : "Show"}
          >
            {airline.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>

          {confirming ? (
            <span className="flex items-center gap-1.5 text-xs">
              <button
                onClick={() =>
                  startTransition(() => deleteAirline(airline.id))
                }
                className="font-medium text-ember hover:underline"
              >
                {pending ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  "Delete"
                )}
              </button>
              <button
                onClick={() => setConfirming(false)}
                className="text-ink-soft hover:underline"
              >
                Cancel
              </button>
            </span>
          ) : (
            <button
              onClick={() => setConfirming(true)}
              className="rounded-lg p-1.5 text-ink-soft hover:bg-ember/10 hover:text-ember"
              aria-label={`Delete ${airline.name}`}
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      )}
    </li>
  );
}
