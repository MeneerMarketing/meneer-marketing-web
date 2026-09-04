import { readFile } from "node:fs/promises";
import path from "node:path";
import { Badge } from "@/components/ui";

type M982Candidate = {
  rank: number | null;
  domain: string;
  productUrl: string;
  sourceQuery: string;
  serpPosition: number | null;
  serpPositionBand: string;
  pageEntityType: string;
  productTitle: string | null;
  observedPrice: number | null;
  priceConfidence: string;
  platform: string | null;
  businessModel: string;
  companyScaleFit: number | null;
  businessMaturityScore: number | null;
  catalogEstimate: number | null;
  catalogFocus: number | null;
  ownBrand: number | null;
  purchaseMode: string;
  preauditVisualGap: number | null;
  preauditPurchaseGap: number | null;
  mobileGap: number | null;
  showcaseGapPotential: number | null;
  showcaseReady: boolean;
  productEconomicFit: number | null;
  businessEconomicFit: number | null;
  highTicketGapSalesFit: number | null;
  highTicketConfidence: string;
  redesignMaterialFeasibility: number | null;
  rawPdpRedesignOpportunity: number | null;
  paidAcquisition: string;
  preAuditGatePass: boolean;
  heroTarget: {
    heroTitle: string | null;
    heroPrice: number | null;
    heroProductUrl: string | null;
  };
  heroCandidateScore: number | null;
  manualReview: Record<string, string> | null;
};

export type HighTicketPdpGapFirstReport = {
  milestone: string;
  version: string;
  discoveryRoute: string;
  targetProfile: string;
  finishedAt: string;
  earlyStopTriggered: boolean;
  earlySuccessCount: number;
  funnel: Record<string, number>;
  positionBandHarvest: Record<string, number>;
  positionBandYield: Record<string, { screened: number; highGap: number }>;
  rawPdpHarvest: {
    price_distribution: Record<string, number>;
    price_hard_rejected: number;
  };
  preAuditFinalists: M982Candidate[];
  highGapReview: M982Candidate[];
  cost: {
    dataForSeo: number;
    dataForSeoCap: number;
    anthropic: number;
    anthropicCap: number;
    visionScreens: number;
  };
};

export async function loadHighTicketPdpGapFirstReport(): Promise<HighTicketPdpGapFirstReport | null> {
  const reportPath = path.resolve(
    process.cwd(),
    "src/preview/concepts/data/high-ticket-pdp-gap-first-report.json"
  );
  try {
    return JSON.parse(await readFile(reportPath, "utf8")) as HighTicketPdpGapFirstReport;
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

function passesShowcaseFilter(c: M982Candidate): boolean {
  const price = c.heroTarget.heroPrice ?? c.observedPrice;
  return (
    c.pageEntityType === "PRODUCT_DETAIL" &&
    (price ?? 0) >= 100 &&
    (c.showcaseGapPotential ?? 0) >= 60 &&
    (c.ownBrand ?? 0) >= 50 &&
    c.purchaseMode === "DIRECT_ECOMMERCE" &&
    (c.redesignMaterialFeasibility ?? 0) >= 60 &&
    (c.businessModel === "DTC_OWN_BRAND" || c.businessModel === "MOSTLY_OWN_BRAND")
  );
}

export function HighTicketPdpGapFirstSection({
  report,
}: {
  report: HighTicketPdpGapFirstReport;
}) {
  const showcaseFiltered = report.preAuditFinalists.filter(passesShowcaseFilter);

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-[#C2410C]">
          {report.milestone}
        </p>
        <h2 className="mt-1 text-xl font-bold text-slate-900">
          High-ticket PDP-gap-first · PRIMARY hook
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          €100+ hero economics · showcase gap · own/mostly-own brand · direct ecommerce. Geen CRO
          in deze fase.
        </p>
        <p className="mt-2 text-xs text-slate-500">
          {report.version} · {report.targetProfile} · {report.finishedAt}
        </p>
      </div>

      <div className="rounded-2xl border border-orange-200 bg-orange-50/40 p-4">
        <p className="text-sm font-semibold text-slate-900">Filter: HIGH-TICKET SHOWCASE</p>
        <p className="mt-1 text-xs text-slate-600">
          Product €100+ · PRODUCT_DETAIL · Showcase ≥60 · Own/Mostly-own · Direct ecommerce ·
          Material ≥60
        </p>
        <p className="mt-2 text-sm text-slate-700">
          {showcaseFiltered.length} van {report.preAuditFinalists.length} finalists passeren preset
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(report.funnel).map(([key, val]) => (
          <Score key={key} label={key.replace(/_/g, " ")} value={val} />
        ))}
      </div>

      <div className="rounded-2xl border border-mm-border bg-white p-5">
        <h3 className="text-sm font-semibold text-slate-900">Position-band yield</h3>
        <ul className="mt-2 flex flex-wrap gap-4 text-sm text-slate-700">
          {Object.entries(report.positionBandYield).map(([band, stats]) => (
            <li key={band}>
              {band}: screened {stats.screened} · high-gap {stats.highGap}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-mm-border bg-white p-5">
        <h3 className="text-sm font-semibold text-slate-900">Price distribution (valid PDPs)</h3>
        <ul className="mt-2 flex flex-wrap gap-3 text-sm text-slate-700">
          {Object.entries(report.rawPdpHarvest.price_distribution).map(([band, count]) => (
            <li key={band}>{band}: {count}</li>
          ))}
          <li>hard rejected: {report.rawPdpHarvest.price_hard_rejected}</li>
        </ul>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-900">
          Pre-audit finalists (max 5)
        </h3>
        <div className="mt-3 space-y-4">
          {report.preAuditFinalists.map((c) => (
            <div
              key={c.productUrl}
              className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-slate-900">
                  #{c.rank ?? "—"} {c.domain}
                </span>
                <Badge tone={c.preAuditGatePass ? "success" : "neutral"}>
                  {c.preAuditGatePass ? "GATE PASS" : "GATE FAIL"}
                </Badge>
                {passesShowcaseFilter(c) && <Badge tone="success">SHOWCASE</Badge>}
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-4 lg:grid-cols-7">
                <Score label="HT fit" value={c.highTicketGapSalesFit} />
                <Score label="Showcase" value={c.showcaseGapPotential} />
                <Score label="Visual" value={c.preauditVisualGap} />
                <Score label="Purchase" value={c.preauditPurchaseGap} />
                <Score label="Product econ" value={c.productEconomicFit} />
                <Score label="Business econ" value={c.businessEconomicFit} />
                <Score label="Paid" value={c.paidAcquisition} />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                {c.productTitle ?? "—"} · €{c.heroTarget.heroPrice ?? c.observedPrice ?? "—"} ·
                {c.businessModel} · pos {c.serpPosition ?? "—"} ({c.serpPositionBand})
              </p>
              {c.manualReview &&
                Object.entries(c.manualReview).map(([k, v]) => (
                  <p key={k} className="mt-2 text-sm text-slate-700">
                    <span className="font-medium">{k}:</span> {v}
                  </p>
                ))}
            </div>
          ))}
          {report.preAuditFinalists.length === 0 && (
            <p className="text-sm text-slate-600">Geen finalists in deze run.</p>
          )}
        </div>
      </div>

      <p className="text-xs text-slate-500">
        Cost: DataForSEO ${report.cost.dataForSeo.toFixed(4)} · Anthropic $
        {report.cost.anthropic.toFixed(4)} · vision {report.cost.visionScreens}
        {report.earlyStopTriggered && ` · early stop (${report.earlySuccessCount} success)`}
      </p>
    </section>
  );
}
