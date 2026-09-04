"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { BulkLeadAction, BulkLeadActionResult } from "@/lib/leads/bulkLeadActions.shared";
import { BULK_LEAD_ACTION_MAX } from "@/lib/leads/bulkLeadActions.shared";

const ACTION_LABELS: Record<BulkLeadAction, string> = {
  generate_previews: "Preview genereren",
  add_wishlist: "Op mail-lijst",
  dismiss: "Dismiss",
};

export function LeadBulkActionsBar({
  selectedIds,
  onClear,
}: {
  selectedIds: string[];
  onClear: () => void;
}) {
  const router = useRouter();
  const [pending, setPending] = useState<BulkLeadAction | null>(null);
  const [result, setResult] = useState<BulkLeadActionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (selectedIds.length === 0) return null;

  async function run(action: BulkLeadAction) {
    if (action === "dismiss") {
      const ok = window.confirm(
        `${selectedIds.length} lead(s) markeren als dismissed (DO_NOT_CONTACT)?`,
      );
      if (!ok) return;
    }

    setPending(action);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/leads/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, businessIds: selectedIds }),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        error?: string;
        result?: BulkLeadActionResult;
      };
      if (!res.ok || !json.ok || !json.result) {
        setError(json.error ?? "Bulk actie mislukt");
        return;
      }
      setResult(json.result);
      router.refresh();
    } catch {
      setError("Bulk actie mislukt");
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="sticky top-0 z-30 mb-4 border border-[#FF5722]/30 bg-[#FFF7F3] p-4 shadow-mm-card">
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-sm font-semibold text-slate-900">
          {selectedIds.length} geselecteerd
          {selectedIds.length >= BULK_LEAD_ACTION_MAX ? (
            <span className="ml-2 text-xs font-normal text-slate-500">
              (max {BULK_LEAD_ACTION_MAX})
            </span>
          ) : null}
        </p>
        <button
          type="button"
          disabled={Boolean(pending)}
          onClick={() => void run("generate_previews")}
          className="bg-[#FF5722] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white disabled:opacity-50"
        >
          {pending === "generate_previews" ? "Genereren…" : "Genereer previews"}
        </button>
        <button
          type="button"
          disabled={Boolean(pending)}
          onClick={() => void run("add_wishlist")}
          className="border border-mm-border bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-700 disabled:opacity-50"
        >
          {pending === "add_wishlist" ? "Bezig…" : "Op mail-lijst"}
        </button>
        <button
          type="button"
          disabled={Boolean(pending)}
          onClick={() => void run("dismiss")}
          className="border border-rose-200 bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-rose-700 disabled:opacity-50"
        >
          {pending === "dismiss" ? "Bezig…" : "Dismiss"}
        </button>
        <button
          type="button"
          disabled={Boolean(pending)}
          onClick={onClear}
          className="ml-auto text-xs font-semibold text-slate-500 hover:text-slate-800"
        >
          Selectie wissen
        </button>
      </div>

      {error ? (
        <p className="mt-3 text-sm text-rose-700" role="alert">
          {error}
        </p>
      ) : null}

      {result ? (
        <div className="mt-3 text-sm text-slate-700">
          <p className="font-semibold text-emerald-800">
            {ACTION_LABELS[result.action]}: {result.succeeded}/{result.total} gelukt
          </p>
          {result.failed > 0 ? (
            <ul className="mt-2 max-h-40 space-y-1 overflow-y-auto text-xs text-rose-700">
              {result.results
                .filter((row) => !row.ok)
                .map((row) => (
                  <li key={row.businessId}>
                    {row.studioName}: {row.error ?? "mislukt"}
                  </li>
                ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
