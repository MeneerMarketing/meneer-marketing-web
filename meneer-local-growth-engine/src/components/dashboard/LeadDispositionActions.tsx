"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { LeadStatus } from "@/types/domain";

interface Props {
  businessId: string;
  studioName: string;
  leadStatus: LeadStatus;
  compact?: boolean;
}

const DISMISSED: LeadStatus[] = ["REJECTED", "DO_NOT_CONTACT"];

export function LeadDispositionActions({
  businessId,
  studioName,
  leadStatus,
  compact = false,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const isDismissed = DISMISSED.includes(leadStatus);

  async function submit(disposition: "reject" | "dismiss" | "restore") {
    setError(null);

    if (disposition === "dismiss") {
      const ok = window.confirm(
        `${studioName} nooit meer benaderen? De lead verdwijnt uit je actieve lijst en mail-lijst.`
      );
      if (!ok) return;
    }

    if (disposition === "reject") {
      const ok = window.confirm(
        `${studioName} afwijzen? De lead gaat uit je actieve lijst maar blijft zichtbaar via filter.`
      );
      if (!ok) return;
    }

    const res = await fetch("/api/leads/disposition", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessId, disposition }),
    });
    const json = (await res.json()) as { ok: boolean; error?: string };
    if (!json.ok) {
      setError(json.error ?? "Actie mislukt");
      return;
    }
    startTransition(() => router.refresh());
  }

  const btnBase =
    "border px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] disabled:opacity-50";

  if (compact) {
    return (
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap gap-1">
          {isDismissed ? (
            <button
              type="button"
              disabled={pending}
              onClick={() => submit("restore")}
              className={`${btnBase} border-emerald-200 text-emerald-800`}
              title="Terug in actieve leads"
            >
              ↩
            </button>
          ) : (
            <>
              <button
                type="button"
                disabled={pending}
                onClick={() => submit("reject")}
                className={`${btnBase} border-amber-200 text-amber-800`}
                title="Afwijzen"
              >
                ✕
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={() => submit("dismiss")}
                className={`${btnBase} border-rose-200 text-rose-700`}
                title="Niet benaderen"
              >
                ⊘
              </button>
            </>
          )}
        </div>
        {error ? <p className="max-w-[8rem] text-[10px] text-rose-600">{error}</p> : null}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex flex-wrap justify-end gap-2">
        {isDismissed ? (
          <button
            type="button"
            disabled={pending}
            onClick={() => submit("restore")}
            className={`${btnBase} border-emerald-200 px-4 text-emerald-800`}
          >
            Herstellen
          </button>
        ) : (
          <>
            <button
              type="button"
              disabled={pending}
              onClick={() => submit("reject")}
              className={`${btnBase} border-amber-200 px-4 text-amber-800`}
            >
              Afwijzen
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => submit("dismiss")}
              className={`${btnBase} border-rose-200 px-4 text-rose-700`}
            >
              Niet benaderen
            </button>
          </>
        )}
      </div>
      {error ? <p className="text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}
