"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function GenerateOutreachButton({
  opportunityId,
  eligible,
  latestDraftId,
}: {
  opportunityId: string;
  eligible: boolean;
  latestDraftId: string | null;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  if (!eligible && !latestDraftId) {
    return (
      <p className="text-xs text-slate-500">
        Niet outreach-eligible. Geen draft-knop.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {latestDraftId ? (
        <Link
          href={`/outreach/${latestDraftId}`}
          className="inline-flex rounded-full bg-[#FF5722] px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white"
        >
          Open outreach draft
        </Link>
      ) : null}
      {eligible ? (
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            setError(null);
            setInfo(
              "Drafts worden via CLI gegenereerd: npm run outreach:generate-drafts (cost-controlled)."
            );
            startTransition(() => router.refresh());
          }}
          className="ml-0 block rounded-full border border-mm-border bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-700 disabled:opacity-50"
        >
          Genereer outreach
        </button>
      ) : null}
      {info ? <p className="text-xs text-slate-500">{info}</p> : null}
      {error ? <p className="text-xs text-rose-600">{error}</p> : null}
      <p className="text-[10px] text-slate-400">Opportunity: {opportunityId}</p>
    </div>
  );
}
