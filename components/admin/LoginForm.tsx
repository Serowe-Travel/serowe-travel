"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isSupabaseConfigured) {
      setError(
        "Supabase is not configured yet. Add your project keys to .env.local.",
      );
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }
    router.push(redirect);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block">
        <span className="text-sm font-medium text-ink">Email</span>
        <div className="relative mt-1.5">
          <Mail
            size={18}
            className="pointer-events-none absolute left-3 top-3.5 text-ink-soft"
          />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@serowetravel.com"
            className="w-full rounded-xl border border-sand bg-white py-3 pl-10 pr-4 text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
          />
        </div>
      </label>

      <label className="block">
        <span className="text-sm font-medium text-ink">Password</span>
        <div className="relative mt-1.5">
          <Lock
            size={18}
            className="pointer-events-none absolute left-3 top-3.5 text-ink-soft"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl border border-sand bg-white py-3 pl-10 pr-4 text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
          />
        </div>
      </label>

      {error && (
        <div className="flex items-start gap-2 rounded-xl bg-ember/10 p-3 text-sm text-ember-dark">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="h-12 w-full rounded-full bg-gold font-medium text-white shadow-soft transition-all hover:bg-gold-dark disabled:opacity-60"
      >
        {loading ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}
