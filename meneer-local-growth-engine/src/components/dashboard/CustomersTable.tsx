"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { Badge, Panel, SectionTitle } from "@/components/dashboard/ui";
import type { CustomerListRow } from "@/lib/data/inbound-customers";
import {
  paymentStatusLabel,
  paymentStatusTone,
} from "@/lib/data/customer-labels";

function formatEuro(cents: number | null): string {
  if (cents === null) return "—";
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function CustomersTable({ rows }: { rows: CustomerListRow[] }) {
  const [filter, setFilter] = useState<"all" | "paid" | "aanvraag">("all");

  const filtered = useMemo(() => {
    if (filter === "paid") {
      return rows.filter((r) => r.paymentStatus === "paid");
    }
    if (filter === "aanvraag") {
      return rows.filter((r) => r.paymentStatus !== "paid");
    }
    return rows;
  }, [rows, filter]);

  return (
    <div>
      <SectionTitle
        eyebrow="Commerce"
        title="Klanten & aanvragen"
        description="Inbound van pilates-studios en huidklinieken. Outreach-ref koppelt aan campagne en prospect."
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {(
          [
            ["all", "Alles"],
            ["paid", "Betaald"],
            ["aanvraag", "Alleen aanvraag"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilter(id)}
            className={
              filter === id
                ? "bg-[#FF5722] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-white"
                : "border border-mm-border bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-600"
            }
          >
            {label}
          </button>
        ))}
      </div>

      <Panel title={`${filtered.length} records`}>
        {filtered.length === 0 ? (
          <p className="text-sm text-slate-500">
            Nog geen aanvragen in Supabase. Draai de migratie en stuur een test
            via meneermarketing.nl.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  <th className="px-2 py-2">Datum</th>
                  <th className="px-2 py-2">Studio</th>
                  <th className="px-2 py-2">Pakket</th>
                  <th className="px-2 py-2">Bron</th>
                  <th className="px-2 py-2">Outreach</th>
                  <th className="px-2 py-2">Betaling</th>
                  <th className="px-2 py-2">Bedrag</th>
                  <th className="px-2 py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((row) => (
                  <tr key={row.id} className="align-top hover:bg-slate-50/80">
                    <td className="whitespace-nowrap px-2 py-3 text-xs text-slate-500">
                      {new Date(row.createdAt).toLocaleString("nl-NL", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-2 py-3">
                      <Link
                        href={`/dashboard/klanten/${row.id}`}
                        className="font-semibold text-slate-900 hover:text-[#C2410C]"
                      >
                        {row.studioName}
                      </Link>
                      <p className="text-xs text-slate-500">
                        {row.city ?? "—"} · {row.email}
                      </p>
                    </td>
                    <td className="px-2 py-3 text-slate-700">
                      {row.packageInterest ?? "—"}
                    </td>
                    <td className="px-2 py-3">
                      <Badge tone="neutral">{row.source}</Badge>
                    </td>
                    <td className="px-2 py-3 text-xs">
                      {row.campaignRef ? (
                        <div className="space-y-1">
                          <p className="font-mono text-[10px] text-slate-500">
                            {row.campaignRef.slice(0, 14)}…
                          </p>
                          {row.businessId ? (
                            <Link
                              href={`/dashboard/leads/${row.businessId}`}
                              className="font-semibold text-[#C2410C] hover:underline"
                            >
                              {row.businessName ?? "Prospect"}
                            </Link>
                          ) : (
                            <span className="text-slate-400">Geen prospect</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400">Direct</span>
                      )}
                    </td>
                    <td className="px-2 py-3">
                      <Badge tone={paymentStatusTone(row.paymentStatus)}>
                        {paymentStatusLabel(row.paymentStatus)}
                      </Badge>
                      {row.paymentMethod ? (
                        <p className="mt-1 text-[10px] uppercase text-slate-400">
                          {row.paymentMethod}
                        </p>
                      ) : null}
                    </td>
                    <td className="whitespace-nowrap px-2 py-3 font-semibold text-slate-800">
                      {row.amountPaidCents !== null
                        ? formatEuro(row.amountPaidCents)
                        : row.paymentStatus === "waived"
                          ? "€0"
                          : formatEuro(row.launchAmountCents)}
                    </td>
                    <td className="px-2 py-3">
                      <Link
                        href={`/dashboard/klanten/${row.id}`}
                        className="whitespace-nowrap text-xs font-semibold text-[#C2410C] hover:underline"
                      >
                        Detail →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}
