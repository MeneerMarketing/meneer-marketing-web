"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { KeywordCategoryRow } from "@/lib/types";

type BulkAction = "approve" | "reject" | "pause" | "category";

export function KeywordBulkBar({
  selectedIds,
  categories,
  onClear,
}: {
  selectedIds: string[];
  categories: KeywordCategoryRow[];
  onClear: () => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [action, setAction] = useState<BulkAction | "">("");
  const [category, setCategory] = useState(categories[0]?.id ?? "");
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  if (selectedIds.length === 0) return null;

  async function runBulk() {
    if (!action) return;
    setError(null);
    setMessage(null);

    const res = await fetch("/api/keywords/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ids: selectedIds,
        action,
        category: action === "category" ? category : undefined,
        reason: action === "reject" && reason.trim() ? reason.trim() : undefined,
      }),
    });

    const body = (await res.json().catch(() => ({}))) as {
      error?: string;
      succeeded?: number;
    };

    if (!res.ok) {
      setError(body.error ?? "Bulk actie mislukt");
      return;
    }

    setMessage(`${body.succeeded ?? selectedIds.length} bijgewerkt`);
    setAction("");
    onClear();
    startTransition(() => router.refresh());
  }

  return (
    <div className="sticky bottom-4 z-30 rounded-2xl border border-[#FF5722]/30 bg-white p-4 shadow-lg">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <p className="text-sm font-bold text-slate-800">
          {selectedIds.length} geselecteerd
        </p>
        <div className="flex flex-wrap items-end gap-2">
          <label className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
            Actie
            <select
              value={action}
              onChange={(e) => setAction(e.target.value as BulkAction | "")}
              className="mt-1 block rounded-xl border border-mm-border bg-mm-bg px-3 py-2 text-sm font-medium normal-case tracking-normal text-slate-800"
            >
              <option value="">Kies actie…</option>
              <option value="approve">Approve</option>
              <option value="reject">Reject</option>
              <option value="pause">Pause</option>
              <option value="category">Change category</option>
            </select>
          </label>

          {action === "category" ? (
            <label className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
              Category
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 block rounded-xl border border-mm-border bg-mm-bg px-3 py-2 text-sm font-medium normal-case tracking-normal text-slate-800"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          {action === "reject" ? (
            <label className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
              Reden
              <input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Optioneel"
                className="mt-1 block rounded-xl border border-mm-border bg-mm-bg px-3 py-2 text-sm font-medium normal-case tracking-normal text-slate-800"
              />
            </label>
          ) : null}

          <button
            type="button"
            disabled={
              pending ||
              !action ||
              (action === "category" && !category)
            }
            onClick={runBulk}
            className="rounded-full bg-[#FF5722] px-4 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-white hover:bg-orange-600 disabled:opacity-60"
          >
            Uitvoeren
          </button>
          <button
            type="button"
            onClick={onClear}
            className="rounded-full border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-slate-700"
          >
            Wis selectie
          </button>
        </div>
      </div>
      {error ? <p className="mt-2 text-xs text-rose-600">{error}</p> : null}
      {message ? <p className="mt-2 text-xs text-emerald-600">{message}</p> : null}
    </div>
  );
}
