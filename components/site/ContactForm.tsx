"use client";

import { useActionState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Send, AlertCircle } from "lucide-react";
import { submitEnquiry, type EnquiryState } from "@/app/(site)/contact/actions";
import { cn } from "@/lib/utils";

const initial: EnquiryState = { ok: false, message: "" };

function Field({
  label,
  name,
  type = "text",
  required,
  error,
  defaultValue,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  error?: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink">
        {label}
        {required && <span className="text-ember"> *</span>}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className={cn(
          "mt-1.5 w-full rounded-xl border bg-white px-4 py-3 text-ink outline-none transition-colors placeholder:text-ink-soft/50 focus:border-gold focus:ring-2 focus:ring-gold/30",
          error ? "border-ember" : "border-sand",
        )}
      />
      {error && <span className="mt-1 block text-xs text-ember">{error}</span>}
    </label>
  );
}

export function ContactForm() {
  const params = useSearchParams();
  const pkg = params.get("package") ?? "";
  const [state, formAction, pending] = useActionState(submitEnquiry, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  if (state.ok) {
    return (
      <div className="rounded-3xl border border-green-200 bg-green-50 p-10 text-center">
        <CheckCircle2 className="mx-auto text-green-600" size={48} />
        <h3 className="mt-4 font-display text-2xl font-semibold text-ink">
          Message sent!
        </h3>
        <p className="mt-2 text-ink-soft">{state.message}</p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      className="rounded-3xl border border-sand bg-white p-7 shadow-card sm:p-9"
    >
      {/* Honeypot */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Full name"
          name="name"
          required
          error={state.fieldErrors?.name}
          placeholder="Your name"
        />
        <Field
          label="Email"
          name="email"
          type="email"
          required
          error={state.fieldErrors?.email}
          placeholder="you@example.com"
        />
        <Field
          label="Phone / WhatsApp"
          name="phone"
          error={state.fieldErrors?.phone}
          placeholder="+267 ..."
        />
        <Field
          label="Subject"
          name="subject"
          error={state.fieldErrors?.subject}
          placeholder="e.g. Honeymoon to Mauritius"
        />
      </div>

      {pkg && (
        <div className="mt-5">
          <Field
            label="Package of interest"
            name="package"
            defaultValue={pkg}
          />
        </div>
      )}
      {!pkg && <input type="hidden" name="package" value="" />}

      <label className="mt-5 block">
        <span className="text-sm font-medium text-ink">
          Your message<span className="text-ember"> *</span>
        </span>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="Tell us about the trip you have in mind — destinations, dates, number of travellers, budget..."
          className={cn(
            "mt-1.5 w-full resize-y rounded-xl border bg-white px-4 py-3 text-ink outline-none transition-colors placeholder:text-ink-soft/50 focus:border-gold focus:ring-2 focus:ring-gold/30",
            state.fieldErrors?.message ? "border-ember" : "border-sand",
          )}
        />
        {state.fieldErrors?.message && (
          <span className="mt-1 block text-xs text-ember">
            {state.fieldErrors.message}
          </span>
        )}
      </label>

      {state.message && !state.ok && (
        <div className="mt-5 flex items-start gap-2 rounded-xl bg-ember/10 p-3 text-sm text-ember-dark">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          {state.message}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ember px-6 font-medium text-white shadow-soft transition-all duration-300 hover:bg-ember-dark hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {pending ? (
          "Sending..."
        ) : (
          <>
            Send Enquiry <Send size={17} />
          </>
        )}
      </button>
      <p className="mt-3 text-center text-xs text-ink-soft">
        We respect your privacy. Your details are kept confidential.
      </p>
    </form>
  );
}
