"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { OpportunityStatus } from "@/lib/types";
import { ACTIVE_STATUSES } from "@/lib/types";

export function StatusActions({
  opportunityId,
  currentStatus,
}: {
  opportunityId: string;
  currentStatus: OpportunityStatus;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function setStatus(status: OpportunityStatus) {
    setError(null);
    const res = await fetch(`/api/opportunities/${opportunityId}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      setError(body.error ?? "Status update mislukt");
      return;
    }
    startTransition(() => router.refresh());
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {ACTIVE_STATUSES.map((status) => {
          const active = currentStatus === status;
          return (
            <button
              key={status}
              type="button"
              disabled={pending || active}
              onClick={() => setStatus(status)}
              className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] transition ${
                active
                  ? "bg-[#FF5722] text-white shadow-lg shadow-[#FF5722]/25"
                  : "border border-slate-300 bg-white text-slate-700 hover:border-[#FF5722] hover:text-[#C2410C]"
              } disabled:opacity-60`}
            >
              {status}
            </button>
          );
        })}
      </div>
      {error ? <p className="text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}
