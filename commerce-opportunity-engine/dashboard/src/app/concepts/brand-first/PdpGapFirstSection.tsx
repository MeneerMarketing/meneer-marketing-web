import { readFile } from "node:fs/promises";
import path from "node:path";
import { Badge } from "@/components/ui";

type PdpCandidate = {
  rank: number | null;
  domain: string;
  productUrl: string;
  sourceQuery: string;
  serpPosition: number | null;
  serpPositionBand: string;
  productTitle: string | null;
  observedPrice: number | null;
  platform: string | null;
  preauditVisualGap: number | null;
  preauditPurchaseGap: number | null;
  mobileGap: number | null;
  contentAvailable: number | null;
  contentPresentation: number | null;
  assetQualityProxy: number | null;
  rawPdpRedesignOpportunity: number | null;
  businessEconomicFit: number | null;
  gapFirstSalesPotential: number | null;
  opportunityConfidence: string;
  paidAcquisition: string;
  manualReviewVerdict: string;
  heroTarget: {
    heroTitle: string | null;
    heroPrice: number | null;
    heroProductUrl: string | null;
  };
  manualReview: Record<string, string> | null;
};

export type PdpGapFirstReport = {
  milestone: string;
  version: string;
  discoveryRoute: string;
  finishedAt: string;
  funnel: Record<string, number>;
  positionBandHarvest: Record<string, number>;
  hookComparison: Record<string, unknown>;
  top10: PdpCandidate[];
  manualReview: PdpCandidate[];
  cost: {
    dataForSeo: number;
    dataForSeoCap: number;
    anthropic: number;
    anthropicCap: number;
    visionScreens: number;
  };
};

export async function loadPdpGapFirstReport(): Promise<PdpGapFirstReport | null> {
  const reportPath = path.resolve(
    process.cwd(),
    "src/preview/concepts/data/pdp-gap-first-report.json"
  );
  try {
    return JSON.parse(await readFile(reportPath, "utf8")) as PdpGapFirstReport;
  } catch {
    return null;
  }
}

function Score({ label, value }: { label: string; value: number | string | null }) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="text-lg font-bold text-slate-900">{value ?? "—"}</p>
    </div>
  );
}

export function PdpGapFirstSection({ report }: { report: PdpGapFirstReport }) {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-[#C2410C]">
          {report.milestone}
        </p>
        <h2 className="mt-1 text-xl font-bold text-slate-900">PDP-gap-first harvest</h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Eerst underdesigned PDPs screenen, daarna business qualification. Visual weakness vóór
          brand scoring.
        </p>
        <p className="mt-2 text-xs text-slate-500">
          {report.version} · {report.discoveryRoute} · {report.finishedAt}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(report.funnel).map(([key, val]) => (
          <Score key={key} label={key.replace(/_/g, " ")} value={val} />
        ))}
      </div>

      <div className="rounded-2xl border border-mm-border bg-white p-5">
        <h3 className="text-sm font-semibold text-slate-900">SERP position bands (harvest)</h3>
        <ul className="mt-2 flex flex-wrap gap-3 text-sm text-slate-700">
          {Object.entries(report.positionBandHarvest).map(([band, count]) => (
            <li key={band}>{band}: {count}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-900">Top 10 gap-first candidates</h3>
        <div className="mt-3 space-y-3">
          {report.top10.map((c) => (
            <div
              key={c.productUrl}
              className="rounded-2xl border border-mm-border bg-white p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-slate-900">#{c.rank ?? "—"} {c.domain}</span>
                <Badge tone={c.manualReviewVerdict.includes("TRUE") ? "success" : "neutral"}>
                  {c.manualReviewVerdict}
                </Badge>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-4 lg:grid-cols-6">
                <Score label="Gap-first" value={c.gapFirstSalesPotential} />
                <Score label="Raw redesign" value={c.rawPdpRedesignOpportunity} />
                <Score label="Visual" value={c.preauditVisualGap} />
                <Score label="Purchase" value={c.preauditPurchaseGap} />
                <Score label="Business fit" value={c.businessEconomicFit} />
                <Score label="Paid" value={c.paidAcquisition} />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                {c.productTitle ?? "—"} · €{c.observedPrice ?? c.heroTarget.heroPrice ?? "—"} ·
                pos {c.serpPosition ?? "—"} ({c.serpPositionBand})
              </p>
            </div>
          ))}
        </div>
      </div>

      {report.manualReview.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Manual review</h3>
          <div className="mt-3 space-y-4">
            {report.manualReview.map((c) => (
              <div
                key={c.productUrl}
                className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4"
              >
                <p className="font-semibold text-slate-900">{c.domain}</p>
                {c.manualReview &&
                  Object.entries(c.manualReview).map(([k, v]) => (
                    <p key={k} className="mt-2 text-sm text-slate-700">
                      <span className="font-medium">{k}: </span>{v}
                    </p>
                  ))}
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-slate-500">
        Cost DataForSEO ${report.cost.dataForSeo.toFixed(4)} / ${report.cost.dataForSeoCap} ·
        Anthropic ${report.cost.anthropic.toFixed(4)} / ${report.cost.anthropicCap} ·
        {report.cost.visionScreens} vision screens
      </p>
    </section>
  );
}
