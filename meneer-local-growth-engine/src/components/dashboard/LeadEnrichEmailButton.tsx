"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function LeadEnrichEmailButton({
  businessId,
  websiteUrl,
}: {
  businessId: string;
  websiteUrl: string | null;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!websiteUrl) return null;

  async function enrich() {
    setError(null);
    setMessage(null);
    const res = await fetch("/api/leads/enrich-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessId }),
    });
    const json = (await res.json()) as {
      ok: boolean;
      email?: string;
      updated?: boolean;
      error?: string;
    };
    if (!json.ok) {
      setError(json.error ?? "Kon e-mail niet ophalen");
      return;
    }
    if (json.updated && json.email) {
      setMessage(json.email);
    } else if (json.email) {
      setMessage(`Al bekend: ${json.email}`);
    } else {
      setError("Geen e-mail gevonden op de website");
    }
    startTransition(() => router.refresh());
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={pending}
        onClick={enrich}
        className="border border-mm-border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] disabled:opacity-50"
      >
        {pending ? "Scannen…" : "E-mail van website"}
      </button>
      {message ? <p className="text-xs text-emerald-700">{message}</p> : null}
      {error ? <p className="max-w-[14rem] text-right text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}
