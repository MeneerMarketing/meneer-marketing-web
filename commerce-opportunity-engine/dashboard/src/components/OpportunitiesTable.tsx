"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BulkActionsBar } from "@/components/BulkActionsBar";
import { Badge, EmptyValue, signalTone } from "@/components/ui";
import { AuditStatusBadge, formatSupportingCount } from "@/lib/auditStatus";
import {
  formatDomain,
  formatPrice,
  signalLabel,
} from "@/lib/format";
import {
  eligibilityLabel,
  eligibilityTone,
  isBrandExcluded,
  resolveEligibilityStatus,
} from "@/lib/eligibility";
import type { OpportunityRow } from "@/lib/types";
import { one } from "@/lib/types";

export function OpportunitiesTable({ rows }: { rows: OpportunityRow[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const allSelected = rows.length > 0 && selected.size === rows.length;

  const selectedIds = useMemo(() => Array.from(selected), [selected]);

  function toggleAll() {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(rows.map((row) => row.id)));
    }
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <>
      <div className="hidden overflow-x-auto rounded-2xl border border-mm-border bg-white shadow-mm-card lg:block">
        <table className="w-full min-w-[1180px] text-left text-sm">
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
              <th className="px-4 py-3">Brand</th>
              <th className="px-4 py-3">Gevonden via</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Opp. Score</th>
              <th className="px-4 py-3">MM Fit</th>
              <th className="px-4 py-3">Audit status</th>
              <th className="px-4 py-3">Audit type</th>
              <th className="px-4 py-3">Verdict</th>
              <th className="px-4 py-3">Conf.</th>
              <th className="px-4 py-3">Paid</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((opp) => {
              const brand = one(opp.brands);
              const pageRow = one(opp.pages);
              const keyword = one(opp.keywords);
              const brandExcluded = isBrandExcluded(brand);
              return (
                <tr
                  key={opp.id}
                  className="border-t border-slate-100 hover:bg-mm-sky-subtle/40"
                >
                  <td className="px-3 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(opp.id)}
                      onChange={() => toggleOne(opp.id)}
                      aria-label={`Selecteer ${formatDomain(brand?.normalized_domain)}`}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-start gap-2">
                      {opp.is_favorite ? (
                        <span className="text-amber-500" title="Favoriet">
                          ★
                        </span>
                      ) : null}
                      <div>
                        <Link
                          href={`/opportunities/${opp.id}`}
                          className="font-bold text-slate-900 hover:text-[#C2410C]"
                        >
                          {formatDomain(brand?.normalized_domain)}
                        </Link>
                        <p className="text-[11px] text-slate-400">{brand?.business_type}</p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          <Badge tone={eligibilityTone(resolveEligibilityStatus(brand))}>
                            {eligibilityLabel(resolveEligibilityStatus(brand))}
                          </Badge>
                          {brand?.do_not_contact ? (
                            <Badge tone="danger">DNC</Badge>
                          ) : null}
                          {opp.is_shortlisted ? (
                            <Badge tone="brand">Shortlist</Badge>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800">
                      {keyword?.keyword ?? <EmptyValue label="Onbekend" />}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {Number(opp.source_quality_score ?? 0) >= 45 &&
                      Number(opp.primary_keyword_confidence ?? 0) >= 55
                        ? "Gevonden via"
                        : "Mogelijk via"}
                      {keyword?.category ? ` · ${keyword.category}` : ""}
                      {opp.source_quality_score != null
                        ? ` · Q${Math.round(Number(opp.source_quality_score))}`
                        : ""}
                    </p>
                  </td>
                  <td className="max-w-[200px] px-4 py-3">
                    {pageRow?.product_name ? (
                      <span className="line-clamp-2">{pageRow.product_name}</span>
                    ) : (
                      <EmptyValue label="Geen product gevonden" />
                    )}
                    <p className="text-[11px] text-slate-400">
                      {pageRow?.price != null
                        ? formatPrice(pageRow.price, pageRow.currency)
                        : "Geen prijs"}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {formatSupportingCount(opp.supporting_keyword_count, "Keywords")} ·{" "}
                      {formatSupportingCount(opp.supporting_source_count, "Sources")}
                    </p>
                  </td>
                  <td className="px-4 py-3 font-extrabold">
                    {opp.opportunity_score != null
                      ? Math.round(Number(opp.opportunity_score))
                      : "—"}
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-700">
                    {opp.meneer_marketing_fit_score != null
                      ? Math.round(Number(opp.meneer_marketing_fit_score))
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <AuditStatusBadge status={opp.cro_audit_status} />
                  </td>
                  <td className="px-4 py-3">
                    {opp.audit_type === "EXACT_PAID_FUNNEL" ? (
                      <Badge tone="brand">EXACT PAID FUNNEL</Badge>
                    ) : opp.audit_type === "HIGH_CONFIDENCE_PRODUCT_TARGET" ||
                      opp.cro_readiness_level === "HIGH_CONFIDENCE_TARGET" ? (
                      <Badge tone="sky">HIGH CONFIDENCE TARGET</Badge>
                    ) : opp.cro_readiness_level === "EXACT_PAID_FUNNEL" ? (
                      <Badge tone="brand">EXACT PAID FUNNEL</Badge>
                    ) : (
                      <EmptyValue label="—" />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {opp.opportunity_verdict ? (
                      <Badge tone="brand">
                        {opp.opportunity_verdict.replaceAll("_", " ")}
                      </Badge>
                    ) : (
                      <EmptyValue label="Niet geaudit" />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {opp.audit_confidence != null
                      ? Math.round(Number(opp.audit_confidence))
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={signalTone(opp.paid_signal_type)}>
                      {opp.paid_confirmed
                        ? "Confirmed"
                        : signalLabel(opp.paid_signal_type)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={brandExcluded ? "danger" : "neutral"}>
                      {brandExcluded ? "EXCLUDED" : opp.status}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 lg:hidden">
        {rows.map((opp) => {
          const brand = one(opp.brands);
          const pageRow = one(opp.pages);
          const keyword = one(opp.keywords);
          return (
            <div
              key={opp.id}
              className="rounded-2xl border border-mm-border bg-white p-4 shadow-mm-card"
            >
              <div className="mb-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selected.has(opp.id)}
                  onChange={() => toggleOne(opp.id)}
                  aria-label="Selecteer"
                />
                <Link
                  href={`/opportunities/${opp.id}`}
                  className="flex-1 font-extrabold text-slate-900"
                >
                  {formatDomain(brand?.normalized_domain)}
                </Link>
              </div>
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs text-slate-500">
                  {keyword?.keyword ?? "Onbekend"}
                </p>
                <div className="text-right">
                  <p className="text-lg font-extrabold text-[#C2410C]">
                    {opp.opportunity_score != null
                      ? Math.round(Number(opp.opportunity_score))
                      : "—"}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    MM{" "}
                    {opp.meneer_marketing_fit_score != null
                      ? Math.round(Number(opp.meneer_marketing_fit_score))
                      : "—"}
                  </p>
                </div>
              </div>
              <p className="mt-1 text-sm text-slate-600">
                {pageRow?.product_name ?? (
                  <EmptyValue label="Geen product gevonden" />
                )}
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                {formatSupportingCount(opp.supporting_keyword_count, "Keywords")} ·{" "}
                {formatSupportingCount(opp.supporting_source_count, "Sources")}
              </p>
            </div>
          );
        })}
      </div>

      <BulkActionsBar
        entity="opportunities"
        selectedIds={selectedIds}
        onClear={() => setSelected(new Set())}
      />
    </>
  );
}
