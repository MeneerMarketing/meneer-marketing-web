"use client";

import { Badge } from "@/components/dashboard/ui";
import type { DiscoveryPipelinePhase } from "@/config/discoveryLauncherModes";

const PHASES: DiscoveryPipelinePhase[] = [
  "PREPARING",
  "SEARCHING",
  "DEDUPLICATING",
  "QUALIFYING",
  "WEBSITE_ANALYSIS",
  "COVERAGE_CHECK",
  "COMPLETED",
  "FAILED",
];

const PHASE_LABELS: Record<DiscoveryPipelinePhase, string> = {
  PREPARING: "Voorbereiden",
  SEARCHING: "Zoeken",
  DEDUPLICATING: "Dedupliceren",
  QUALIFYING: "Kwalificeren",
  WEBSITE_ANALYSIS: "Website-analyse",
  COVERAGE_CHECK: "Coverage check",
  COMPLETED: "Voltooid",
  FAILED: "Mislukt",
};

interface CoverageQueryRow {
  label: string;
  results: number;
  unique_new?: number;
  relevant_new?: number;
  duplicates?: number;
}

interface RunSnapshot {
  pipeline_phase?: string | null;
  status?: string;
  businesses_found?: number;
  new_businesses?: number;
  qualified?: number;
  api_cost?: number;
  coverage_summary?: Record<string, unknown>;
}

export function DiscoveryRunProgress({
  phase,
  run,
  coverageQueries,
}: {
  phase: DiscoveryPipelinePhase | string | null;
  run?: RunSnapshot | null;
  coverageQueries?: CoverageQueryRow[];
}) {
  const current = (phase ?? "PREPARING") as DiscoveryPipelinePhase;
  const currentIndex = PHASES.indexOf(current);
  const failed = current === "FAILED";
  const completed = current === "COMPLETED";

  const summary = run?.coverage_summary ?? {};
  const uniqueBusinesses = Number(summary.unique_businesses ?? run?.businesses_found ?? 0);
  const relevant = Number(summary.relevant_businesses ?? 0);
  const qualified = Number(summary.qualified ?? run?.qualified ?? 0);
  const coverageLabel = summary.coverage_label ? String(summary.coverage_label) : null;

  return (
    <div className="mt-5 border border-mm-border bg-mm-surface/40 p-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
        Pipeline status
      </p>
      <ol className="mt-3 flex flex-wrap gap-2">
        {PHASES.filter((p) => p !== "FAILED").map((step, index) => {
          const done = completed || failed || (currentIndex >= 0 && index < currentIndex);
          const active = !failed && !completed && step === current;
          return (
            <li key={step}>
              <Badge tone={done ? "success" : active ? "warn" : "neutral"}>
                {PHASE_LABELS[step]}
              </Badge>
            </li>
          );
        })}
        {failed ? <Badge tone="danger">Mislukt</Badge> : null}
      </ol>

      {(uniqueBusinesses > 0 || qualified > 0) && (
        <div className="mt-4 grid gap-2 text-sm sm:grid-cols-4">
          <div>
            <span className="text-slate-400">Uniek</span>
            <p className="font-bold">{uniqueBusinesses}</p>
          </div>
          <div>
            <span className="text-slate-400">Relevant</span>
            <p className="font-bold">{relevant || "—"}</p>
          </div>
          <div>
            <span className="text-slate-400">Qualified</span>
            <p className="font-bold">{qualified}</p>
          </div>
          <div>
            <span className="text-slate-400">Coverage</span>
            <p className="font-bold">{coverageLabel ?? "—"}</p>
          </div>
        </div>
      )}

      {coverageQueries && coverageQueries.length > 0 ? (
        <ul className="mt-4 divide-y divide-slate-100 text-sm">
          {coverageQueries.map((row) => (
            <li key={row.label} className="flex flex-wrap justify-between gap-2 py-2">
              <span className="font-semibold text-slate-700">{row.label}</span>
              <span className="tabular-nums text-slate-500">
                → {row.results} results
                {row.unique_new != null ? ` → ${row.unique_new} new` : ""}
                {row.relevant_new != null && row.relevant_new > 0
                  ? ` (+${row.relevant_new} relevant)`
                  : ""}
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      {run?.api_cost != null ? (
        <p className="mt-3 text-xs text-slate-500">
          API-kosten tot nu toe: ${Number(run.api_cost).toFixed(4)}
        </p>
      ) : null}
    </div>
  );
}
