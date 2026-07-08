"use server";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { enquirySchema } from "@/lib/validators";
import { site } from "@/lib/site";

export type EnquiryState = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string>;
};

const CONTACT_EMAIL = process.env.CONTACT_EMAIL ?? site.email;

export async function submitEnquiry(
  _prev: EnquiryState,
  formData: FormData,
): Promise<EnquiryState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    subject: String(formData.get("subject") ?? ""),
    package: String(formData.get("package") ?? ""),
    message: String(formData.get("message") ?? ""),
    company: String(formData.get("company") ?? ""), // honeypot
  };

  const parsed = enquirySchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      fieldErrors,
    };
  }

  const data = parsed.data;

  // Silently succeed on honeypot hit (likely a bot).
  if (data.company) {
    return { ok: true, message: "Thank you — we'll be in touch shortly." };
  }

  // 1) Persist to Supabase so it appears in the staff dashboard.
  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient();
      await supabase.from("enquiries").insert({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        subject:
          data.subject || (data.package ? `Package: ${data.package}` : null),
        message: data.package
          ? `[Interested in: ${data.package}]\n\n${data.message}`
          : data.message,
      });
    } catch {
      // Don't fail the user if DB insert fails; email is the backup.
    }
  }

  // 2) Email notification via FormSubmit.co (no API key required).
  try {
    const res = await fetch(
      `https://formsubmit.co/ajax/${encodeURIComponent(CONTACT_EMAIL)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Referer: site.url,
        },
        body: JSON.stringify({
          _subject: `New enquiry — ${data.subject || data.package || "Website"}`,
          Name: data.name,
          Email: data.email,
          Phone: data.phone || "—",
          Package: data.package || "—",
          Subject: data.subject || "—",
          Message: data.message,
          _template: "table",
        }),
      },
    );
    const json = (await res.json().catch(() => ({}))) as {
      success?: string | boolean;
    };
    console.log("[FormSubmit debug] status:", res.status, "body:", json);
    const emailOk =
      res.ok && (json.success === "true" || json.success === true);

    if (!emailOk && !isSupabaseConfigured) {
      return {
        ok: false,
        message:
          "We couldn't send your message right now. Please email us directly at " +
          CONTACT_EMAIL,
      };
    }
  } catch (err) {
    console.log("[FormSubmit debug] fetch threw:", err);
    if (!isSupabaseConfigured) {
      return {
        ok: false,
        message:
          "We couldn't send your message right now. Please email us directly at " +
          CONTACT_EMAIL,
      };
    }
  }

  return {
    ok: true,
    message:
      "Thank you for reaching out! Our team will be in touch with you shortly.",
  };
}
