import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Staff Login",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-5 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="flex flex-col items-center gap-3">
          <Image
            src="/images/brand/logo.png"
            alt="Serowe Travel"
            width={72}
            height={72}
            className="h-18 w-18 object-contain"
          />
          <span className="font-display text-2xl font-semibold text-ink">
            Serowe Travel
          </span>
        </Link>

        <div className="mt-8 rounded-3xl border border-sand bg-white p-8 shadow-card">
          <h1 className="font-display text-2xl font-semibold text-ink">
            Staff Sign In
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            Access the package & enquiry management area.
          </p>
          <div className="mt-6">
            <Suspense
              fallback={<div className="text-ink-soft">Loading…</div>}
            >
              <LoginForm />
            </Suspense>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-ink-soft">
          <Link href="/" className="hover:text-gold-dark">
            ← Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}
