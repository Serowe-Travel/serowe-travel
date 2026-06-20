"use client";

import { useActionState } from "react";
import { Check, AlertCircle } from "lucide-react";
import {
  updateSettings,
  type SettingsState,
} from "@/app/(admin)/admin/settings/actions";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
} from "@/components/site/SocialIcons";
import type { SiteSettings } from "@/lib/types";

const initial: SettingsState = { ok: false, message: "" };

const fieldCls =
  "w-full rounded-xl border border-sand bg-white py-2.5 pl-11 pr-4 text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/30";

export function SettingsForm({
  settings,
  canEdit,
}: {
  settings: SiteSettings;
  canEdit: boolean;
}) {
  const [state, action, pending] = useActionState(updateSettings, initial);

  const rows = [
    {
      name: "facebook_url",
      label: "Facebook",
      Icon: FacebookIcon,
      def: settings.facebook_url ?? "",
      ph: "https://facebook.com/serowetravel",
    },
    {
      name: "instagram_url",
      label: "Instagram",
      Icon: InstagramIcon,
      def: settings.instagram_url ?? "",
      ph: "https://instagram.com/serowetravel",
    },
    {
      name: "linkedin_url",
      label: "LinkedIn",
      Icon: LinkedinIcon,
      def: settings.linkedin_url ?? "",
      ph: "https://linkedin.com/company/serowetravel",
    },
  ];

  return (
    <form
      action={action}
      className="rounded-2xl border border-sand bg-white p-6 shadow-soft"
    >
      <h2 className="font-display text-lg font-semibold text-ink">
        Social media links
      </h2>
      <p className="mt-1 text-sm text-ink-soft">
        These links appear in the website footer. Leave blank to hide an icon.
      </p>

      <div className="mt-5 space-y-4">
        {rows.map((r) => (
          <label key={r.name} className="block">
            <span className="text-sm font-medium text-ink">{r.label}</span>
            <div className="relative mt-1.5">
              <r.Icon
                size={18}
                className="pointer-events-none absolute left-3.5 top-3 text-ink-soft"
              />
              <input
                name={r.name}
                type="url"
                defaultValue={r.def}
                placeholder={r.ph}
                disabled={!canEdit}
                className={fieldCls}
              />
            </div>
          </label>
        ))}
      </div>

      {state.message && (
        <div
          className={`mt-5 flex items-start gap-2 rounded-xl p-3 text-sm ${
            state.ok
              ? "bg-green-50 text-green-700"
              : "bg-ember/10 text-ember-dark"
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

      {canEdit ? (
        <button
          type="submit"
          disabled={pending}
          className="mt-6 rounded-full bg-gold px-7 py-3 font-medium text-white shadow-soft transition-colors hover:bg-gold-dark disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save Settings"}
        </button>
      ) : (
        <p className="mt-6 rounded-xl bg-sand px-4 py-3 text-sm text-ink-soft">
          Only administrators can edit these settings.
        </p>
      )}
    </form>
  );
}
