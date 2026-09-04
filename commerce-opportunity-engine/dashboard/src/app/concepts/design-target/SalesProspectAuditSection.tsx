import { readFile } from "node:fs/promises";
import path from "node:path";
import { Badge } from "@/components/ui";

type PreselectionRow = {
  rank: number;
  domain: string;
  preselectionScore: number;
  idealPreScore: number | null;
  commerceModel: string;
  catalogBand: string;
  heroFromReport: boolean;
  selected: boolean;
  skipReason: string | null;
  penalties: Array<{ reason: string; points: number }>;
  reasons: string[];
};

type AuditRow = {
  domain: string;
  rank: number;
  preselectionScore: number;
  category: string;
  platform: string | null;
  commerceModel: string;
  catalogEstimate: number | null;
  catalogFocus: number | null;
  heroProduct: string | null;
  heroUrl: string | null;
  heroPrice: number | null;
  adsEvidence: { keywords: string[]; landingUrls: string[]; sellerResolution: string | null };
  auditOutcome: string;
  auditSkipReason: string | null;
  pageHealth: string | null;
  currentPdpQuality: number | null;
  visualQuality: number | null;
  buyblockQuality: number | null;
  storytellingQuality: number | null;
  mediaQuality: number | null;
  deepDiveQuality: number | null;
  mobileQuality: number | null;
  assetReadiness: number | null;
  transformation: number | null;
  contrastRoom: number | null;
  contrastCapability: number | null;
  conceptContrast: number | null;
  contrastBand: string | null;
  deepDiveFit: number | null;
  economicFit: number | null;
  salesFit: number | null;
  trueSalesDesignScore: number | null;
  confidence: number | null;
  gatePassed: boolean;
  gateBlockers: string[];
  gateWarnings: string[];
  leaks: Array<{ severity: string; title: string; evidence: string }>;
};

type DesignCase = {
  domain: string;
  trueSalesDesignScore: number | null;
  rationale: {
    business: string[];
    product: string[];
    pdpProblems: string[];
    ourImprovements: string[];
    beforeAfter: string[];
  };
  screenshots: Record<string, string>;
};

export type SalesProspectAuditReport = {
  milestone: string;
  finishedAt: string;
  preselection: {
    poolSize: number;
    poolSources: string[];
    maxAudits: number;
    selected: number;
    formula: string;
    candidates: PreselectionRow[];
  };
  audits: AuditRow[];
  topThree: DesignCase[];
  designTarget: {
    domain: string;
    trueSalesDesignScore: number | null;
    conceptContrast: number | null;
    currentPdpQuality: number | null;
    transformation: number | null;
    heroUrl: string | null;
    warnings: string[];
    note: string;
  } | null;
  designTargetGate: Record<string, unknown>;
  trueSalesDesignFormula: string;
  regression: Array<{
    domain: string;
    conceptContrast: number | null;
    contrastBand: string | null;
    note: string;
  }>;
  cost: {
    anthropic: number;
    anthropicCap: number;
    dataForSeo: number;
    auditsRun: number;
    auditAttempts: number;
    costPerAudit: number;
  };
};

export async function loadSalesProspectAuditReport(): Promise<SalesProspectAuditReport | null> {
  const reportPath = path.resolve(
    process.cwd(),
    "src/preview/concepts/data/new-sales-prospect-audit-report.json"
  );
  try {
    return JSON.parse(await readFile(reportPath, "utf8")) as SalesProspectAuditReport;
  } catch {
    return null;
  }
}

function scoreTone(score: number | null, good = 70, ok = 55): "success" | "warn" | "danger" | "neutral" {
  if (score == null) return "neutral";
  if (score >= good) return "success";
  if (score >= ok) return "warn";
  return "danger";
}

function ScoreCell({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="text-lg font-bold text-slate-900">{value ?? "—"}</p>
    </div>
  );
}

export function SalesProspectAuditSection({ report }: { report: SalesProspectAuditReport }) {
  const { preselection, audits, cost } = report;
  const auditedRows = audits.filter((row) => row.auditOutcome === "AUDITED");

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-[#C2410C]">
          {report.milestone}
        </p>
        <h2 className="mt-1 text-xl font-bold text-slate-900">
          Nieuwe prospects naar één design target
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          De sterke prospects uit de focused production discovery, deterministisch gerangschikt en
          daarna echt geaudit op hun productpagina. We zoeken niet de slechtste site: we zoeken een
          sterk bedrijf met goed materiaal waarvan de productpagina het zwakke onderdeel is.
        </p>
        <p className="mt-2 text-xs text-slate-500">
          {new Date(report.finishedAt).toLocaleString("nl-NL")} · Anthropic $
          {cost.anthropic.toFixed(4)} van ${cost.anthropicCap.toFixed(2)} · DataForSEO $0,00 ·{" "}
          {cost.auditsRun} audits
        </p>
      </div>

      {report.designTarget ? (
        <div className="rounded-2xl border-2 border-emerald-500 bg-emerald-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
            Aanbevolen design target
          </p>
          <h3 className="mt-1 text-2xl font-bold text-slate-900">{report.designTarget.domain}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-4">
            <ScoreCell label="Sales design" value={report.designTarget.trueSalesDesignScore} />
            <ScoreCell label="Contrast" value={report.designTarget.conceptContrast} />
            <ScoreCell label="Huidige PDP" value={report.designTarget.currentPdpQuality} />
            <ScoreCell label="Transformatie" value={report.designTarget.transformation} />
          </div>
          {report.designTarget.warnings.length > 0 && (
            <p className="mt-3 text-xs text-amber-700">
              Let op: {report.designTarget.warnings.join(" · ")}
            </p>
          )}
          <p className="mt-3 text-xs text-slate-600">{report.designTarget.note}</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-900">
          Geen kandidaat haalt de strong design target gate. Er is niets geforceerd.
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-mm-border bg-white">
        <div className="border-b border-mm-border px-5 py-4">
          <h3 className="text-sm font-bold">Preselectie</h3>
          <p className="text-xs text-slate-500">
            {preselection.poolSize} sterke prospects, {preselection.selected} geaudit.{" "}
            {preselection.formula}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">Domein</th>
                <th className="px-4 py-2 text-right">Score</th>
                <th className="px-4 py-2 text-right">Pre-score</th>
                <th className="px-4 py-2 text-left">Model</th>
                <th className="px-4 py-2 text-left">Catalogus</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {preselection.candidates.map((row) => (
                <tr key={row.domain} className="border-t border-mm-border">
                  <td className="px-4 py-2 text-slate-500">{row.rank}</td>
                  <td className="px-4 py-2 font-medium text-slate-900">{row.domain}</td>
                  <td className="px-4 py-2 text-right font-semibold">{row.preselectionScore}</td>
                  <td className="px-4 py-2 text-right text-slate-500">{row.idealPreScore ?? "—"}</td>
                  <td className="px-4 py-2 text-xs text-slate-600">{row.commerceModel}</td>
                  <td className="px-4 py-2 text-xs text-slate-600">{row.catalogBand}</td>
                  <td className="px-4 py-2 text-xs">
                    {row.selected ? (
                      <Badge tone="success">geaudit</Badge>
                    ) : (
                      <span className="text-slate-500">{row.skipReason ?? "niet geselecteerd"}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Auditresultaten</h3>
        {audits.map((row) => (
          <div key={row.domain} className="rounded-2xl border border-mm-border bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-base font-bold text-slate-900">{row.domain}</p>
                <p className="text-xs text-slate-500">
                  {row.category} · {row.platform ?? "onbekend platform"} · {row.commerceModel} ·
                  catalogus {row.catalogEstimate ?? "?"} (focus {row.catalogFocus ?? "?"})
                </p>
              </div>
              <div className="flex items-center gap-2">
                {row.auditOutcome === "AUDITED" ? (
                  <>
                    <Badge tone={scoreTone(row.trueSalesDesignScore)}>
                      sales design {row.trueSalesDesignScore}
                    </Badge>
                    <Badge tone={row.gatePassed ? "success" : "neutral"}>
                      {row.gatePassed ? "gate OK" : "gate geblokkeerd"}
                    </Badge>
                  </>
                ) : (
                  <Badge tone="danger">geen audit</Badge>
                )}
              </div>
            </div>

            {row.auditOutcome !== "AUDITED" ? (
              <p className="mt-3 text-sm text-slate-600">
                {row.auditSkipReason} (page health {row.pageHealth ?? "onbekend"}). Geen scores uit
                een onleesbare pagina.
              </p>
            ) : (
              <>
                <p className="mt-3 text-sm text-slate-700">
                  Hero:{" "}
                  {row.heroUrl ? (
                    <a
                      className="text-[#C2410C] underline"
                      href={row.heroUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {row.heroProduct}
                    </a>
                  ) : (
                    row.heroProduct
                  )}
                  {row.heroPrice != null ? ` · €${row.heroPrice}` : ""}
                </p>

                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
                  <ScoreCell label="PDP nu" value={row.currentPdpQuality} />
                  <ScoreCell label="Koopblok" value={row.buyblockQuality} />
                  <ScoreCell label="Visueel" value={row.visualQuality} />
                  <ScoreCell label="Verhaal" value={row.storytellingQuality} />
                  <ScoreCell label="Beeld" value={row.mediaQuality} />
                  <ScoreCell label="Verdieping" value={row.deepDiveQuality} />
                  <ScoreCell label="Mobiel" value={row.mobileQuality} />
                  <ScoreCell label="Materiaal" value={row.assetReadiness} />
                  <ScoreCell label="Transformatie" value={row.transformation} />
                  <ScoreCell label="Ruimte" value={row.contrastRoom} />
                  <ScoreCell label="Materiaal (contrast)" value={row.contrastCapability} />
                  <ScoreCell label="Contrast" value={row.conceptContrast} />
                  <ScoreCell label="Deep-dive fit" value={row.deepDiveFit} />
                  <ScoreCell label="Economisch" value={row.economicFit} />
                  <ScoreCell label="Sales fit" value={row.salesFit} />
                  <ScoreCell label="Confidence" value={row.confidence} />
                </div>

                {row.gateBlockers.length > 0 && (
                  <p className="mt-3 text-xs text-slate-500">
                    Gate: {row.gateBlockers.join(" · ")}
                  </p>
                )}
                {row.leaks.length > 0 && (
                  <ul className="mt-3 space-y-1 text-xs text-slate-600">
                    {row.leaks.slice(0, 3).map((leak) => (
                      <li key={leak.title}>
                        <span className="font-semibold">{leak.severity}</span> · {leak.title}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
        ))}
        {auditedRows.length === 0 && (
          <p className="text-sm text-slate-500">Nog geen geldige audits in dit rapport.</p>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Top 3 design cases</h3>
        {report.topThree.map((design, index) => (
          <div key={design.domain} className="rounded-2xl border border-mm-border bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-base font-bold text-slate-900">
                {index + 1}. {design.domain}
              </p>
              <Badge tone={scoreTone(design.trueSalesDesignScore)}>
                sales design {design.trueSalesDesignScore}
              </Badge>
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {(
                [
                  ["Waarom dit bedrijf", design.rationale.business],
                  ["Waarom dit product", design.rationale.product],
                  ["Wat er nu misgaat", design.rationale.pdpProblems],
                  ["Wat wij doen", design.rationale.ourImprovements],
                  ["Before/after", design.rationale.beforeAfter],
                ] as const
              ).map(([title, lines]) => (
                <div key={title}>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {title}
                  </p>
                  <ul className="mt-1 space-y-1 text-sm text-slate-700">
                    {lines.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            {Object.keys(design.screenshots).length > 0 && (
              <p className="mt-4 text-xs text-slate-500">
                Screenshots: {Object.values(design.screenshots).join(" · ")}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-mm-border bg-white p-5">
        <h3 className="text-sm font-bold text-slate-900">Regressie</h3>
        <p className="text-xs text-slate-500">
          Alleen ter vergelijking. Deze twee doen niet mee voor het design target.
        </p>
        <ul className="mt-3 space-y-1 text-sm text-slate-700">
          {report.regression.map((row) => (
            <li key={row.domain}>
              <span className="font-semibold">{row.domain}</span> · contrast{" "}
              {row.conceptContrast ?? "—"} ({row.contrastBand ?? "—"}) · {row.note}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-slate-500">{report.trueSalesDesignFormula}</p>
      </div>
    </section>
  );
}
