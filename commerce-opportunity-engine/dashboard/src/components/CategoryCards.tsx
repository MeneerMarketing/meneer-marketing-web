"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Badge } from "@/components/ui";
import type { KeywordCategoryOverview } from "@/lib/types";

export function CategoryCards({
  categories,
}: {
  categories: KeywordCategoryOverview[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function toggle(
    id: string,
    field: "active" | "paused",
    value: boolean
  ) {
    setError(null);
    setBusyId(id);
    const res = await fetch(`/api/keyword-categories/${id}/toggle`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ field, value }),
    });
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    setBusyId(null);
    if (!res.ok) {
      setError(body.error ?? "Toggle mislukt");
      return;
    }
    startTransition(() => router.refresh());
  }

  if (categories.length === 0) {
    return (
      <div className="rounded-2xl border border-mm-border bg-white p-5 text-sm text-slate-500 shadow-mm-card">
        Nog geen keyword categories. Seed ze via de engine.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error ? <p className="text-xs text-rose-600">{error}</p> : null}
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {categories.map((cat) => {
          const loading = pending && busyId === cat.id;
          return (
            <div
              key={cat.id}
              className="rounded-2xl border border-mm-border bg-white p-4 shadow-mm-card"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-extrabold text-slate-900">{cat.label}</p>
                  <p className="mt-0.5 font-mono text-[10px] text-slate-400">{cat.id}</p>
                </div>
                <div className="flex flex-wrap justify-end gap-1">
                  <Badge tone={cat.active ? "success" : "neutral"}>
                    {cat.active ? "Active" : "Inactive"}
                  </Badge>
                  {cat.paused ? <Badge tone="warn">Paused</Badge> : null}
                </div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-mm-surface px-2 py-2">
                  <p className="text-lg font-extrabold text-slate-900">
                    {cat.keywordCount}
                  </p>
                  <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                    Keywords
                  </p>
                </div>
                <div className="rounded-xl bg-mm-surface px-2 py-2">
                  <p className="text-lg font-extrabold text-slate-900">
                    {cat.highQualityCount}
                  </p>
                  <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                    Q≥80
                  </p>
                </div>
                <div className="rounded-xl bg-mm-surface px-2 py-2">
                  <p className="text-lg font-extrabold text-slate-900">
                    {cat.approvedCount}
                  </p>
                  <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                    Approved
                  </p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => toggle(cat.id, "active", !cat.active)}
                  className="rounded-full border border-mm-border bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-700 hover:border-[#FF5722]/40 disabled:opacity-60"
                >
                  {cat.active ? "Deactivate" : "Activate"}
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => toggle(cat.id, "paused", !cat.paused)}
                  className="rounded-full border border-mm-border bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-700 hover:border-[#FF5722]/40 disabled:opacity-60"
                >
                  {cat.paused ? "Unpause" : "Pause"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
