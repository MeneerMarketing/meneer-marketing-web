"use client";

import { useMemo, useState, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { KeywordBulkBar } from "@/components/KeywordBulkBar";
import { Badge, EmptyValue } from "@/components/ui";
import type { KeywordCategoryRow, KeywordIntelligenceRow } from "@/lib/types";

function formatNum(value: number | null | undefined, digits = 0): ReactNode {
  if (value === null || value === undefined) {
    return <EmptyValue label="—" />;
  }
  return value.toLocaleString("nl-NL", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits > 0 ? Math.min(digits, 2) : 0,
  });
}

function formatRatio(value: number | null | undefined): ReactNode {
  if (value === null || value === undefined) {
    return <EmptyValue label="—" />;
  }
  return `${Math.round(value * 100)}%`;
}

function formatCost(value: number | null | undefined): ReactNode {
  if (value === null || value === undefined) {
    return <EmptyValue label="—" />;
  }
  return `$${Number(value).toFixed(4)}`;
}

function statusBadge(row: KeywordIntelligenceRow) {
  if (row.rejected) return <Badge tone="danger">Rejected</Badge>;
  if (row.paused) return <Badge tone="warn">Paused</Badge>;
  if (row.approved) return <Badge tone="success">Approved</Badge>;
  if (row.discovery_status === "QUALIFIED") {
    return <Badge tone="sky">Qualified</Badge>;
  }
  if (row.discovery_status === "SCANNED") {
    return <Badge tone="brand">Scanned</Badge>;
  }
  if (row.discovery_status) {
    return <Badge tone="neutral">{row.discovery_status}</Badge>;
  }
  return <EmptyValue label="Onbekend" />;
}

function intentLabel(intent: string | null | undefined): ReactNode {
  if (!intent) return <EmptyValue label="—" />;
  const short = intent
    .replace("NON_BRANDED_PRODUCT", "Non-branded")
    .replace("PRODUCT_BRANDED", "Product brand")
    .replace("RETAILER_BRANDED", "Retailer")
    .replace("BRAND_NAVIGATIONAL", "Navigational")
    .replace("REVIEW_RESEARCH", "Review")
    .replace("INFORMATIONAL", "Info")
    .replace("SERVICE", "Service");
  return <span className="text-xs font-semibold text-slate-700">{short}</span>;
}

function tierBadge(tier: string | null | undefined): ReactNode {
  if (!tier) return <EmptyValue label="—" />;
  if (tier === "PRIMARY") return <Badge tone="brand">PRIMARY</Badge>;
  if (tier === "SECONDARY") return <Badge tone="sky">SECONDARY</Badge>;
  if (tier === "LOW_VALUE") return <Badge tone="warn">LOW</Badge>;
  if (tier === "REJECT") return <Badge tone="danger">REJECT</Badge>;
  return <Badge tone="neutral">{tier}</Badge>;
}

function categoryLabel(
  categoryId: string | null,
  categories: KeywordCategoryRow[]
): ReactNode {
  if (!categoryId) return <EmptyValue label="—" />;
  const found = categories.find((c) => c.id === categoryId);
  return found?.label ?? categoryId;
}

export function KeywordsOperatorClient({
  rows,
  categories,
}: {
  rows: KeywordIntelligenceRow[];
  categories: KeywordCategoryRow[];
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [rowError, setRowError] = useState<string | null>(null);

  const allSelected = rows.length > 0 && selected.size === rows.length;
  const selectedIds = useMemo(() => Array.from(selected), [selected]);

  function toggleAll() {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(rows.map((row) => row.id)));
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function runStatus(
    ids: string[],
    action: "approve" | "reject" | "pause",
    reason?: string
  ) {
    setRowError(null);
    setPendingId(ids[0] ?? null);
    const res = await fetch("/api/keywords/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids, action, reason }),
    });
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    setPendingId(null);
    if (!res.ok) {
      setRowError(body.error ?? "Actie mislukt");
      return;
    }
    setSelected((prev) => {
      const next = new Set(prev);
      for (const id of ids) next.delete(id);
      return next;
    });
    startTransition(() => router.refresh());
  }

  const colCount = 22;

  return (
    <>
      {rowError ? (
        <p className="mb-3 text-xs text-rose-600">{rowError}</p>
      ) : null}

      <div className="overflow-x-auto rounded-2xl border border-mm-border bg-white shadow-mm-card">
        <table className="w-full min-w-[1880px] text-left text-sm">
          <thead className="bg-mm-surface text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
            <tr>
              <th className="px-3 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  aria-label="Selecteer alles"
                />
              </th>
              <th className="px-3 py-3">Keyword</th>
              <th className="px-3 py-3">Category</th>
              <th className="px-3 py-3">Cluster</th>
              <th className="px-3 py-3">Vol</th>
              <th className="px-3 py-3">CPC</th>
              <th className="px-3 py-3">Competition</th>
              <th className="px-3 py-3">Commercial</th>
              <th className="px-3 py-3">Product</th>
              <th className="px-3 py-3">Quality</th>
              <th className="px-3 py-3">Intent</th>
              <th className="px-3 py-3">Prospecting</th>
              <th className="px-3 py-3">Tier</th>
              <th className="px-3 py-3">Discovery Priority</th>
              <th className="px-3 py-3">Yield</th>
              <th className="px-3 py-3">Advertisers</th>
              <th className="px-3 py-3">Eligible</th>
              <th className="px-3 py-3">Shopify</th>
              <th className="px-3 py-3">Retailer ratio</th>
              <th className="px-3 py-3">Cost</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Acties</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={colCount}
                  className="px-4 py-10 text-center text-slate-500"
                >
                  <EmptyValue label="Geen keywords voor deze filters" />
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const busy = pending && pendingId === row.id;
                return (
                  <tr
                    key={row.id}
                    className="border-t border-slate-100 hover:bg-mm-sky-subtle/40"
                  >
                    <td className="px-3 py-2.5">
                      <input
                        type="checkbox"
                        checked={selected.has(row.id)}
                        onChange={() => toggleOne(row.id)}
                        aria-label={`Selecteer ${row.keyword}`}
                      />
                    </td>
                    <td className="px-3 py-2.5">
                      <p className="font-bold text-slate-900">{row.keyword}</p>
                      {row.volume_tier ? (
                        <p className="text-[10px] uppercase tracking-[0.1em] text-slate-400">
                          {row.volume_tier}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-3 py-2.5 text-xs text-slate-700">
                      {categoryLabel(row.category, categories)}
                    </td>
                    <td className="px-3 py-2.5 text-xs text-slate-600">
                      {row.cluster ? row.cluster : <EmptyValue label="—" />}
                    </td>
                    <td className="px-3 py-2.5 tabular-nums">
                      {formatNum(row.search_volume)}
                    </td>
                    <td className="px-3 py-2.5 tabular-nums">
                      {formatNum(row.cpc, 2)}
                    </td>
                    <td className="px-3 py-2.5 tabular-nums">
                      {formatNum(row.competition, 3)}
                    </td>
                    <td className="px-3 py-2.5 tabular-nums">
                      {formatNum(row.commercial_intent_score)}
                    </td>
                    <td className="px-3 py-2.5 tabular-nums">
                      {formatNum(row.product_intent_score)}
                    </td>
                    <td className="px-3 py-2.5">
                      {row.keyword_quality_score !== null &&
                      row.keyword_quality_score !== undefined ? (
                        <span
                          className={`font-extrabold tabular-nums ${
                            row.keyword_quality_score >= 80
                              ? "text-emerald-700"
                              : "text-slate-800"
                          }`}
                        >
                          {row.keyword_quality_score}
                        </span>
                      ) : (
                        <EmptyValue label="—" />
                      )}
                    </td>
                    <td className="px-3 py-2.5">
                      {intentLabel(row.keyword_intent_type)}
                    </td>
                    <td className="px-3 py-2.5">
                      {row.prospecting_value_score !== null &&
                      row.prospecting_value_score !== undefined ? (
                        <span
                          className={`font-extrabold tabular-nums ${
                            row.prospecting_value_score >= 75
                              ? "text-emerald-700"
                              : row.prospecting_value_score < 40
                                ? "text-rose-700"
                                : "text-slate-800"
                          }`}
                        >
                          {row.prospecting_value_score}
                        </span>
                      ) : (
                        <EmptyValue label="—" />
                      )}
                    </td>
                    <td className="px-3 py-2.5">
                      {tierBadge(row.prospecting_tier)}
                    </td>
                    <td className="px-3 py-2.5">
                      {row.discovery_priority_score !== null &&
                      row.discovery_priority_score !== undefined ? (
                        <span
                          className={`font-extrabold tabular-nums ${
                            row.discovery_priority_score >= 70
                              ? "text-emerald-700"
                              : row.discovery_priority_score < 40
                                ? "text-rose-700"
                                : "text-slate-800"
                          }`}
                        >
                          {row.discovery_priority_score}
                        </span>
                      ) : (
                        <EmptyValue label="—" />
                      )}
                    </td>
                    <td className="px-3 py-2.5 tabular-nums">
                      {formatNum(row.prospect_yield_score)}
                    </td>
                    <td className="px-3 py-2.5 tabular-nums">
                      {formatNum(row.unique_domains_found)}
                    </td>
                    <td className="px-3 py-2.5 tabular-nums">
                      {formatNum(row.lead_eligible_found)}
                    </td>
                    <td className="px-3 py-2.5 tabular-nums">
                      {formatNum(row.shopify_found)}
                    </td>
                    <td className="px-3 py-2.5 tabular-nums">
                      {formatRatio(row.retailer_ratio)}
                    </td>
                    <td className="px-3 py-2.5 tabular-nums text-xs">
                      {formatCost(row.serp_cost ?? row.estimated_serp_cost)}
                    </td>
                    <td className="px-3 py-2.5">{statusBadge(row)}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex flex-wrap gap-1">
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => runStatus([row.id], "approve")}
                          className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-emerald-700 hover:bg-emerald-100 disabled:opacity-60"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => runStatus([row.id], "reject")}
                          className="rounded-full bg-rose-50 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-rose-700 hover:bg-rose-100 disabled:opacity-60"
                        >
                          Reject
                        </button>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => runStatus([row.id], "pause")}
                          className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-amber-700 hover:bg-amber-100 disabled:opacity-60"
                        >
                          Pause
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <KeywordBulkBar
        selectedIds={selectedIds}
        categories={categories}
        onClear={() => setSelected(new Set())}
      />
    </>
  );
}
