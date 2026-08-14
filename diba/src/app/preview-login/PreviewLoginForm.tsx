"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import Label from "@/components/ui/Label";

function PreviewLoginFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/";
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/preview-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as {
        error?: string;
      } | null;
      setError(data?.error ?? "Onjuist wachtwoord.");
      return;
    }

    router.replace(from.startsWith("/") ? from : "/");
    router.refresh();
  }

  return (
    <main className="figma-home flex min-h-screen items-center justify-center bg-[var(--g-010)] px-5 py-16 text-[var(--t-strong)]">
      <div className="w-full max-w-md rounded-[var(--r-lg)] border border-[var(--g-100)] bg-white p-8 shadow-[0_12px_40px_rgba(15,45,28,.06)] sm:p-10">
        <Label>Preview</Label>
        <h1 className="diba-card-title-lg mt-4">Diba Clinics testomgeving</h1>
        <p className="mt-3 text-[15px] leading-7 text-[var(--t-body)]">
          Deze versie is alleen voor het team. Voer het preview-wachtwoord in om
          verder te gaan.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="preview-password" className="diba-label block">
              Wachtwoord
            </label>
            <input
              id="preview-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 h-12 w-full rounded-[var(--r-sm)] border border-[var(--g-100)] bg-[var(--g-010)] px-4 text-[15px] text-[var(--t-strong)] outline-none transition focus:border-[var(--g-300)] focus:ring-2 focus:ring-[var(--g-100)]"
            />
          </div>

          {error ? (
            <p className="text-[14px] text-[var(--warn-text)]" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-12 w-full items-center justify-center rounded-[var(--r-pill)] bg-[var(--g-700)] text-[11px] font-semibold uppercase tracking-[.13em] text-white transition hover:bg-[var(--g-800)] disabled:opacity-60"
          >
            {loading ? "Even geduld…" : "Naar de preview"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function PreviewLoginForm() {
  return (
    <Suspense
      fallback={
        <main className="figma-home grid min-h-screen place-items-center bg-[var(--g-010)]">
          <p className="text-[15px] text-[var(--t-body)]">Laden…</p>
        </main>
      }
    >
      <PreviewLoginFormInner />
    </Suspense>
  );
}
