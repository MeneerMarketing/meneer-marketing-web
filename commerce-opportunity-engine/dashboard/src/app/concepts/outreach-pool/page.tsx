import { readFile } from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { Badge, EmptyValue, SectionTitle } from "@/components/ui";
import { ConceptContrastSection, loadContrastReport } from "./ConceptContrastSection";

export const dynamic = "force-dynamic";

type RankedRow = {
  domain: string;
  category: string | null;
  platform: string | null;
  commerceModel: string;
  catalogFocus: number | null;
  heroProduct: string | null;
  productPrice: number | null;
  adsStatus: string;
  currentPdpQuality: number | null;
  transformation: number | null;
  assetReadiness: number | null;
  deepDiveFit: number;
  economicFit: number;
  outreachFit: number;
  scoreConfidence: number;
  croDataSource: string;
  gateEligible: boolean;
  conceptId: string;
};

type CoverageReport = {
  milestone: string;
  generatedAt: string;
  costs: { anthropic: number; dataforseo: number; budgetCap: number };
  newOutreachRanking: { top10: RankedRow[] };
  tensfactComparison: {
    tensfact: RankedRow | null;
    top3: RankedRow[];
    tensfactStillNumberOne: boolean;
    note: string;
  };
  trueOutreachPilot: {
    winner: RankedRow | null;
    runnerUps: RankedRow[];
    why: string[];
  };
  audits: Array<{
    domain: string;
    skipped: boolean;
    skipReason?: string;
    currentPdpQuality?: number | null;
    croDataSource?: string;
  }>;
};

function croSourceTone(
  source: string
): "success" | "warn" | "danger" | "neutral" {
  if (source === "AUDITED") return "success";
  if (source === "PROXY") return "warn";
  return "neutral";
}

async function loadReport(): Promise<CoverageReport | null> {
  const reportPath = path.resolve(
    process.cwd(),
    "src/preview/concepts/data/outreach-coverage-report.json"
  );
  try {
    const raw = await readFile(reportPath, "utf8");
    return JSON.parse(raw) as CoverageReport;
  } catch {
    return null;
  }
}

export default async function OutreachPoolPage() {
  const [report, contrast] = await Promise.all([loadReport(), loadContrastReport()]);

  return (
    <AppShell activePath="/concepts/outreach-pool">
      <div className="space-y-8 p-6 lg:p-10">
        {contrast && <ConceptContrastSection report={contrast} />}

        <div>
          <SectionTitle eyebrow="M9.2.1" title="Outreach pool · CRO coverage" />
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            Milestone 9.2.1 ranking met echte auditdata waar beschikbaar. Score
            confidence en CRO data source tonen of outreach fit op proxies leunt.
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Run:{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5">
              npm run concepts:audit-outreach-pool
            </code>
          </p>
        </div>

        {!report ? (
          <div className="rounded-2xl border border-mm-border bg-white p-8 text-sm text-slate-600">
            Geen rapport gevonden. Voer eerst{" "}
            <code>npm run concepts:audit-outreach-pool</code> uit in{" "}
            <code>commerce-opportunity-engine</code>.
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-mm-border bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Anthropic cost
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  ${report.costs.anthropic.toFixed(3)}
                </p>
                <p className="text-xs text-slate-500">
                  cap ${report.costs.budgetCap.toFixed(2)}
                </p>
              </div>
              <div className="rounded-2xl border border-mm-border bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  TRUE outreach pilot
                </p>
                <p className="mt-2 text-lg font-bold text-slate-900">
                  {report.trueOutreachPilot.winner?.domain ?? "—"}
                </p>
                {report.trueOutreachPilot.winner && (
                  <Badge tone="success">
                    {report.trueOutreachPilot.winner.croDataSource}
                  </Badge>
                )}
              </div>
              <div className="rounded-2xl border border-mm-border bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Tensfact vs #1
                </p>
                <p className="mt-2 text-sm text-slate-700">
                  {report.tensfactComparison.note}
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-mm-border bg-white">
              <div className="border-b border-mm-border px-5 py-4">
                <h2 className="text-sm font-bold text-slate-900">Top 10 outreach</h2>
                <p className="text-xs text-slate-500">
                  Generated {new Date(report.generatedAt).toLocaleString("nl-NL")}
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Domain</th>
                      <th className="px-4 py-3">Outreach</th>
                      <th className="px-4 py-3">Confidence</th>
                      <th className="px-4 py-3">CRO source</th>
                      <th className="px-4 py-3">PDP quality</th>
                      <th className="px-4 py-3">Transform</th>
                      <th className="px-4 py-3">Deep dive</th>
                      <th className="px-4 py-3">Gate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.newOutreachRanking.top10.map((row) => (
                      <tr key={row.conceptId} className="border-t border-mm-border">
                        <td className="px-4 py-3">
                          <Link
                            href={`/concepts/${row.conceptId}`}
                            className="font-semibold text-[#C2410C] hover:underline"
                          >
                            {row.domain}
                          </Link>
                        </td>
                        <td className="px-4 py-3 font-mono">{row.outreachFit}</td>
                        <td className="px-4 py-3 font-mono">
                          {row.scoreConfidence}
                        </td>
                        <td className="px-4 py-3">
                          <Badge tone={croSourceTone(row.croDataSource)}>
                            {row.croDataSource}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          {row.currentPdpQuality ?? <EmptyValue />}
                        </td>
                        <td className="px-4 py-3">
                          {row.transformation ?? <EmptyValue />}
                        </td>
                        <td className="px-4 py-3">{row.deepDiveFit}</td>
                        <td className="px-4 py-3">
                          <Badge tone={row.gateEligible ? "success" : "warn"}>
                            {row.gateEligible ? "pass" : "fail"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {report.trueOutreachPilot.why.length > 0 && (
              <div className="rounded-2xl border border-mm-border bg-white p-5">
                <h2 className="text-sm font-bold text-slate-900">Why pilot wins</h2>
                <ul className="mt-3 space-y-1 text-sm text-slate-700">
                  {report.trueOutreachPilot.why.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}
