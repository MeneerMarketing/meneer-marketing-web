"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { RetryAuditButton } from "@/components/RetryAuditButton";

export function NeedsAttentionActions({
  opportunityId,
  brandId,
}: {
  opportunityId: string;
  brandId: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function markReviewed() {
    setError(null);
    const res = await fetch("/api/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entity: "opportunities",
        ids: [opportunityId],
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

  async function excludeBrand() {
    setError(null);
    const res = await fetch("/api/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entity: "brands",
        ids: [brandId],
        action: "exclude",
        reason: "POOR_PROSPECT",
      }),
    });
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      setError(body.error ?? "Uitsluiten mislukt");
      return;
    }
    startTransition(() => router.refresh());
  }

  return (
    <div className="flex shrink-0 flex-col gap-2">
      <RetryAuditButton opportunityId={opportunityId} />
      <Link
        href={`/opportunities/${opportunityId}`}
        className="rounded-full border border-slate-300 bg-white px-4 py-2 text-center text-xs font-bold uppercase tracking-[0.12em] text-slate-700 hover:border-[#FF5722]"
      >
        Review
      </Link>
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
        disabled={pending}
        onClick={excludeBrand}
        className="rounded-full bg-rose-600 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white hover:bg-rose-700 disabled:opacity-60"
      >
        Brand uitsluiten
      </button>
      {error ? <p className="text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}
