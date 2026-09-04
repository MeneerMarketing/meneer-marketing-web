import { readFile } from "node:fs/promises";
import path from "node:path";
import { Badge } from "@/components/ui";

type FamilyYieldRow = {
  familyId: string;
  familyLabel: string;
  queriesTested: number;
  organicRows: number;
  candidateBrands: number;
  validatedFirstParty: number;
  economicQualified: number;
  designGapScreened: number;
  highGapBrands: number;
  firstPartyYield: number;
  economicYield: number;
  designGapYield: number;
  verdict: string;
  verdictReason: string;
};

type BalancedCandidate = {
  rank: number | null;
  domain: string;
  brandName: string;
  productFamilyLabel: string;
  discoverySource: string;
  sourceQuery: string;
  firstPartyConfidence: number;
  brandScaleFit: number;
  catalogEstimate: number | null;
  catalogFocus: number | null;
  ownBrand: number | null;
  heroTarget: {
    heroTitle: string | null;
    heroPrice: number | null;
    heroConfidence: number | null;
    heroProductUrl: string | null;
  };
  purchaseMode: string;
  assetContentAvailability: number | null;
  preauditVisualGap: number | null;
  preauditPurchaseGap: number | null;
  mobileGap: number | null;
  contentPresentation: number | null;
  paidAcquisition: string;
  brandFirstOpportunityScoreV2: number | null;
  sweetSpotProfile: string | null;
  manualReviewVerdict: string;
  manualReview: {
    whyBusinessFits: string;
    whyProductFits: string;
    whatIsAlreadyGood: string;
    whatPdpUnderuses: string;
    expectedBeforeAfter: string;
  } | null;
};

export type BrandFirstBalancedReport = {
  milestone: string;
  version: string;
  finishedAt: string;
  familyBalance: Record<string, number>;
  retailerBrandExtractionTest: { passed: number; total: number };
  familyYield: FamilyYieldRow[];
  purchaseModes: Record<string, number>;
  top10: BalancedCandidate[];
  manualReview: BalancedCandidate[];
  recommendation: { productionWorthyFamilies: string[]; note: string };
  funnel: Record<string, number>;
  cost: {
    dataForSeo: number;
    dataForSeoCap: number;
    anthropic: number;
    anthropicCap: number;
    visionScreens: number;
  };
};

export async function loadBrandFirstBalancedReport(): Promise<BrandFirstBalancedReport | null> {
  const reportPath = path.resolve(
    process.cwd(),
    "src/preview/concepts/data/brand-first-balanced-report.json"
  );
  try {
    return JSON.parse(await readFile(reportPath, "utf8")) as BrandFirstBalancedReport;
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

function verdictTone(verdict: string): "success" | "warn" | "neutral" {
  if (verdict === "STRONG") return "success";
  if (verdict === "PROMISING") return "neutral";
  if (verdict === "PARK") return "warn";
  return "warn";
}

export function BrandFirstBalancedSection({ report }: { report: BrandFirstBalancedReport }) {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-[#C2410C]">
          {report.milestone}
        </p>
        <h2 className="mt-1 text-xl font-bold text-slate-900">Balanced brand-first calibration</h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Family-round-robin over high-ticket archetypes. Yield per family, purchase modes, en geen
          LED-mask park.
        </p>
        <p className="mt-2 text-xs text-slate-500">
          {new Date(report.finishedAt).toLocaleString("nl-NL")} · extraction regression{" "}
          {report.retailerBrandExtractionTest.passed}/{report.retailerBrandExtractionTest.total} ·
          DataForSEO ${report.cost.dataForSeo.toFixed(4)} · Anthropic $
          {report.cost.anthropic.toFixed(4)}
        </p>
      </div>

      <div className="rounded-2xl border border-mm-border bg-white p-5">
        <h3 className="text-sm font-bold text-slate-900">Family balance</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-4">
          <Score label="Queries uitgevoerd" value={report.familyBalance.queriesExecuted} />
          <Score label="Families getest" value={report.familyBalance.familiesTested} />
          <Score label="Max per family" value={report.familyBalance.maxBrandsPerFamily} />
          <Score label="Max candidates" value={report.familyBalance.maxTotalCandidates} />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-mm-border bg-white">
        <div className="border-b border-mm-border px-5 py-4">
          <h3 className="text-sm font-bold">Family yield & verdict</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-2 text-left">Family</th>
                <th className="px-4 py-2 text-right">Queries</th>
                <th className="px-4 py-2 text-right">Organic</th>
                <th className="px-4 py-2 text-right">Brands</th>
                <th className="px-4 py-2 text-right">Economic</th>
                <th className="px-4 py-2 text-right">High gap</th>
                <th className="px-4 py-2 text-left">Verdict</th>
              </tr>
            </thead>
            <tbody>
              {report.familyYield.map((row) => (
                <tr key={row.familyId} className="border-t border-slate-100">
                  <td className="px-4 py-2 font-medium">{row.familyLabel}</td>
                  <td className="px-4 py-2 text-right">{row.queriesTested}</td>
                  <td className="px-4 py-2 text-right">{row.organicRows}</td>
                  <td className="px-4 py-2 text-right">{row.validatedFirstParty}</td>
                  <td className="px-4 py-2 text-right">{row.economicQualified}</td>
                  <td className="px-4 py-2 text-right">{row.highGapBrands}</td>
                  <td className="px-4 py-2">
                    <Badge tone={verdictTone(row.verdict)}>{row.verdict}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5">
        <h3 className="text-sm font-bold text-slate-900">Recommendation</h3>
        <p className="mt-2 text-sm text-slate-700">
          Production-worthy families:{" "}
          <strong>{report.recommendation.productionWorthyFamilies.join(", ") || "geen"}</strong>
        </p>
        <p className="mt-1 text-xs text-slate-600">{report.recommendation.note}</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Top 10</h3>
        {report.top10.map((c) => (
          <div key={c.domain} className="rounded-2xl border border-mm-border bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs text-slate-500">
                  #{c.rank} · {c.productFamilyLabel} · {c.discoverySource}
                </p>
                <h4 className="text-lg font-bold text-slate-900">
                  {c.brandName} · {c.domain}
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge tone="success">v2 {c.brandFirstOpportunityScoreV2}</Badge>
                <Badge tone="neutral">{c.manualReviewVerdict}</Badge>
                <Badge tone="neutral">{c.purchaseMode}</Badge>
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
              <Score label="Visual gap" value={c.preauditVisualGap} />
              <Score label="Purchase gap" value={c.preauditPurchaseGap} />
              <Score label="Hero €" value={c.heroTarget.heroPrice} />
              <Score label="First-party" value={c.firstPartyConfidence} />
              <Score label="Paid" value={c.paidAcquisition} />
              <Score label="Presentatie" value={c.contentPresentation} />
            </div>
          </div>
        ))}
      </div>

      {report.manualReview.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Manual review (TRUE candidates)</h3>
          {report.manualReview.map((c) => (
            <div
              key={`review-${c.domain}`}
              className="rounded-2xl border-2 border-emerald-500 bg-white p-5"
            >
              <h4 className="text-lg font-bold">{c.domain}</h4>
              {c.manualReview && (
                <dl className="mt-4 space-y-2 text-sm text-slate-600">
                  <div>
                    <dt className="font-semibold text-slate-900">Business fit</dt>
                    <dd>{c.manualReview.whyBusinessFits}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-900">Product fit</dt>
                    <dd>{c.manualReview.whyProductFits}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-900">Al goed</dt>
                    <dd>{c.manualReview.whatIsAlreadyGood}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-900">PDP onderbenut</dt>
                    <dd>{c.manualReview.whatPdpUnderuses}</dd>
                  </div>
                </dl>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
