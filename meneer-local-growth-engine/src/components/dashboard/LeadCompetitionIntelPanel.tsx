"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge, Panel, WebsiteLink } from "@/components/dashboard/ui";
import type { LeadCompetitionIntel } from "@/services/seo/competitionIntelService";

export function LeadCompetitionIntelPanel({
  businessId,
  intel,
}: {
  businessId: string;
  intel: LeadCompetitionIntel | null;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function refreshMetrics() {
    setPending(true);
    setMessage(null);
    try {
      const res = await fetch("/api/leads/competition-intel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId, refreshMetrics: true }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setMessage(data.error ?? "DR ophalen mislukt");
        return;
      }
      setMessage("DR bijgewerkt");
      router.refresh();
    } catch {
      setMessage("DR ophalen mislukt");
    } finally {
      setPending(false);
    }
  }

  if (!intel) {
    return (
      <Panel title="Concurrentie-intel">
        <p className="text-sm text-slate-500">
          Nog geen SERP-data voor deze lead. Run SEO analysis voor {` `}
          de stad om concurrenten en posities te vullen.
        </p>
      </Panel>
    );
  }

  return (
    <Panel title="Concurrentie-intel">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-lg font-extrabold tracking-tight text-slate-900">{intel.headline}</p>
          <p className="mt-1 text-sm text-slate-500">
            Primair zoekwoord: <span className="font-semibold text-slate-700">{intel.keyword}</span>
            {intel.ownRank != null ? (
              <>
                {" "}
                · Eigen positie:{" "}
                <span className="font-semibold text-slate-700">#{intel.ownRank}</span>
              </>
            ) : (
              <> · Nog niet in de top 10</>
            )}
          </p>
        </div>
        <button
          type="button"
          disabled={pending || intel.competitors.length === 0}
          onClick={() => void refreshMetrics()}
          className="shrink-0 border border-mm-border bg-white px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-700 hover:border-[#FF5722] hover:text-[#C2410C] disabled:opacity-50"
        >
          {pending ? "Bezig…" : "DR ophalen"}
        </button>
      </div>

      {intel.growthPlanSnippet ? (
        <div className="mt-4 border border-[#FF5722]/20 bg-[#FFF7F3] px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#C2410C]">
            Growth-plan in mail
          </p>
          <p className="mt-1 text-sm leading-relaxed text-slate-700">{intel.growthPlanSnippet}</p>
        </div>
      ) : null}

      {intel.competitors.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">
          Geen studio-concurrenten in de top 10 gevonden (directories gefilterd).
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-400">
                <th className="py-2 pr-3 font-bold">#</th>
                <th className="py-2 pr-3 font-bold">Domein</th>
                <th className="py-2 pr-3 font-bold">DR</th>
                <th className="py-2 font-bold">Titel</th>
              </tr>
            </thead>
            <tbody>
              {intel.competitors.map((row) => (
                <tr key={row.domain} className="border-b border-slate-50">
                  <td className="py-2 pr-3 font-bold text-slate-900">#{row.rank}</td>
                  <td className="py-2 pr-3">
                    <WebsiteLink domain={row.domain} showIcon={false} />
                  </td>
                  <td className="py-2 pr-3">
                    {row.domainRating != null ? (
                      <Badge tone={row.domainRating >= 40 ? "danger" : "warn"}>
                        DR {row.domainRating}
                      </Badge>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>
                  <td className="py-2 text-xs text-slate-600">{row.title ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {message ? <p className="mt-3 text-xs text-slate-500">{message}</p> : null}
      {!intel.hasSerpData ? (
        <p className="mt-3 text-xs text-amber-800">
          Fallback op oud competitor snapshot. Run SEO analysis opnieuw voor volledige top 10.
        </p>
      ) : null}
    </Panel>
  );
}
