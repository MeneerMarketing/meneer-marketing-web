"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { FavoriteButton } from "@/components/FavoriteButton";

export function BrandOperatorActions({
  brandId,
  isFavorite,
  operatorStatus,
}: {
  brandId: string;
  isFavorite: boolean;
  operatorStatus: string | null;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [overrideReason, setOverrideReason] = useState("");
  const [showOverride, setShowOverride] = useState(false);

  async function refreshIntelligence() {
    setError(null);
    const res = await fetch(`/api/brands/${brandId}/refresh`, { method: "POST" });
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      setError(body.error ?? "Refresh mislukt");
      return;
    }
    startTransition(() => router.refresh());
  }

  async function markReviewed() {
    setError(null);
    const res = await fetch("/api/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entity: "brands",
        ids: [brandId],
        action: "reviewed",
      }),
    });
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      setError(body.error ?? "Reviewed markeren mislukt");
      return;
    }
    startTransition(() => router.refresh());
  }

  async function applyOverride(forceLeadEligible: boolean, forceExcluded: boolean) {
    const reason = overrideReason.trim();
    if (!reason) {
      setError("Reden is verplicht voor override");
      return;
    }
    setError(null);
    const res = await fetch(`/api/brands/${brandId}/override`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ forceLeadEligible, forceExcluded, reason }),
    });
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      setError(body.error ?? "Override mislukt");
      return;
    }
    setShowOverride(false);
    setOverrideReason("");
    startTransition(() => router.refresh());
  }

  return (
    <div className="rounded-2xl border border-mm-border bg-white p-4 shadow-mm-card">
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
        Operator acties
      </p>
      {operatorStatus ? (
        <p className="mt-1 text-xs text-slate-500">Status: {operatorStatus}</p>
      ) : null}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <FavoriteButton entity="brands" id={brandId} isFavorite={isFavorite} size="sm" />
        <button
          type="button"
          disabled={pending}
          onClick={refreshIntelligence}
          className="rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-700 hover:border-[#FF5722] disabled:opacity-60"
        >
          Refresh intelligence
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={markReviewed}
          className="rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-700 hover:border-[#FF5722] disabled:opacity-60"
        >
          Markeer reviewed
        </button>
        <button
          type="button"
          onClick={() => setShowOverride((value) => !value)}
          className="rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-700 hover:border-[#FF5722]"
        >
          Override
        </button>
      </div>

      {showOverride ? (
        <div className="mt-3 space-y-2 rounded-xl border border-mm-border bg-mm-bg p-3">
          <textarea
            value={overrideReason}
            onChange={(e) => setOverrideReason(e.target.value)}
            rows={2}
            placeholder="Reden voor override…"
            className="w-full rounded-xl border border-mm-border bg-white px-3 py-2 text-sm text-slate-800"
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={pending}
              onClick={() => applyOverride(true, false)}
              className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.1em] text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              Force lead eligible
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => applyOverride(false, true)}
              className="rounded-full bg-rose-600 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.1em] text-white hover:bg-rose-700 disabled:opacity-60"
            >
              Force excluded
            </button>
          </div>
        </div>
      ) : null}

      {error ? <p className="mt-2 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}
