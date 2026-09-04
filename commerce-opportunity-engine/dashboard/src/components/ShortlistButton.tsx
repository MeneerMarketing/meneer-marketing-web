"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function ShortlistButton({
  opportunityId,
  isShortlisted,
}: {
  opportunityId: string;
  isShortlisted: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [shortlisted, setShortlisted] = useState(isShortlisted);
  const [error, setError] = useState<string | null>(null);

  async function toggle() {
    setError(null);
    const next = !shortlisted;
    const res = await fetch(`/api/opportunities/${opportunityId}/shortlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled: next }),
    });
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      setError(body.error ?? "Shortlist opslaan mislukt");
      return;
    }
    setShortlisted(next);
    startTransition(() => router.refresh());
  }

  return (
    <div>
      <button
        type="button"
        disabled={pending}
        onClick={toggle}
        className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] transition disabled:opacity-60 ${
          shortlisted
            ? "bg-[#FF5722] text-white"
            : "border border-slate-300 bg-white text-slate-700 hover:border-[#FF5722] hover:text-[#C2410C]"
        }`}
      >
        {shortlisted ? "Op shortlist" : "Shortlisten"}
      </button>
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}
