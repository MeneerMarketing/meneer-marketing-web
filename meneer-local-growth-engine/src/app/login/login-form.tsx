"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";
  const configError = searchParams.get("error") === "supabase_not_configured";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const configured = isSupabaseConfigured();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!configured) {
        setError("Supabase is niet geconfigureerd. Zet NEXT_PUBLIC_SUPABASE_URL en ANON_KEY in .env.local.");
        return;
      }

      const supabase = createClient();
      if (mode === "login") {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (authError) {
          setError(authError.message);
          return;
        }
      } else {
        const { error: authError } = await supabase.auth.signUp({ email, password });
        if (authError) {
          setError(authError.message);
          return;
        }
      }

      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login mislukt");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md border border-mm-border bg-white p-8 shadow-mm-card">
      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#FF5722]">
        Meneer Marketing
      </p>
      <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
        Local Growth Engine
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        Privé dashboard. Alleen voor intern gebruik.
      </p>

      {configError || !configured ? (
        <div className="mt-6 border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Supabase env ontbreekt. Vul <code>.env.local</code> in, of zet{" "}
          <code>LGE_DEV_AUTH_BYPASS=true</code> voor lokale UI-tests.
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <label className="block">
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
            E-mail
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full border border-mm-border bg-mm-bg px-3 py-2.5 text-sm outline-none focus:border-[#FF5722]"
            autoComplete="email"
          />
        </label>
        <label className="block">
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
            Wachtwoord
          </span>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full border border-mm-border bg-mm-bg px-3 py-2.5 text-sm outline-none focus:border-[#FF5722]"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />
        </label>

        {error ? (
          <p className="text-sm text-rose-600" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading || !configured}
          className="w-full bg-[#FF5722] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#C2410C] disabled:opacity-50"
        >
          {loading ? "Bezig…" : mode === "login" ? "Inloggen" : "Account aanmaken"}
        </button>
      </form>

      <button
        type="button"
        className="mt-4 text-sm font-semibold text-slate-500 hover:text-slate-800"
        onClick={() => setMode(mode === "login" ? "signup" : "login")}
      >
        {mode === "login" ? "Nog geen account? Aanmaken" : "Heb je al een account? Inloggen"}
      </button>
    </div>
  );
}
