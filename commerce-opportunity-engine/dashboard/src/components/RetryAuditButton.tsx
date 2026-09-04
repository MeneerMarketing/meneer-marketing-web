"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function RetryAuditButton({ opportunityId }: { opportunityId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function retry() {
    setError(null);
    setMessage(null);
    const res = await fetch(`/api/opportunities/${opportunityId}/retry-audit`, {
      method: "POST",
    });
    const body = (await res.json().catch(() => ({}))) as {
      error?: string;
      message?: string;
      queued?: boolean;
    };
    if (!res.ok) {
      setError(body.error ?? "Retry mislukt");
      return;
    }
    setMessage(body.message ?? "Retry gestart");
    startTransition(() => router.refresh());
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => retry()}
        className="rounded-xl bg-[#FF5722] px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-600 disabled:opacity-60"
      >
        {pending ? "Bezig…" : "Audit opnieuw proberen"}
      </button>
      {message ? <p className="text-xs text-emerald-700">{message}</p> : null}
      {error ? <p className="text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}
