import { readFile } from "node:fs/promises";
import path from "node:path";
import { Badge } from "@/components/ui";

type MinedCandidate = {
  rank: number | null;
  productBrandName: string;
  officialDomain: string | null;
  productFamilyLabel: string;
  independentSourceCount: number;
  brandMarketPresenceScore: number;
  discoveredProductTitle: string | null;
  discoveredProductModel: string | null;
  observedSourcePrice: number | null;
  platform: string | null;
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
  thirdPartyBrandOpportunityScore: number | null;
  opportunityConfidence: string;
  manualReviewVerdict: string;
  sources: Array<{
    sourceDomain: string;
    sourceType: string;
    sourceQuery: string;
  }>;
  manualReview: Record<string, string> | null;
};

export type ThirdPartyBrandMiningReport = {
  milestone: string;
  version: string;
  discoveryRoute: string;
  finishedAt: string;
  funnel: Record<string, number>;
  falsePositives: Record<string, number>;
  hookComparison: {
    organicFirstParty: Record<string, number> | null;
    thirdPartyMining: Record<string, number> | null;
  };
  top10: MinedCandidate[];
  manualReview: MinedCandidate[];
  cost: {
    dataForSeo: number;
    dataForSeoCap: number;
    anthropic: number;
    anthropicCap: number;
    visionScreens: number;
  };
};

export async function loadThirdPartyBrandMiningReport(): Promise<ThirdPartyBrandMiningReport | null> {
  const reportPath = path.resolve(
    process.cwd(),
    "src/preview/concepts/data/third-party-brand-mining-report.json"
  );
  try {
    return JSON.parse(await readFile(reportPath, "utf8")) as ThirdPartyBrandMiningReport;
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

export function ThirdPartyBrandMiningSection({
  report,
}: {
  report: ThirdPartyBrandMiningReport;
}) {
  const cmp = report.hookComparison;

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-[#C2410C]">
          {report.milestone}
        </p>
        <h2 className="mt-1 text-xl font-bold text-slate-900">Third-party brand mining</h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Retailers, marketplaces en editorial als discovery sources. Merk → official domain → DTC
          → economics → design gap. Sources zijn nooit prospects.
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

      {cmp && (
        <div className="rounded-2xl border border-mm-border bg-white p-5">
          <h3 className="text-sm font-semibold text-slate-900">Organic-first vs brand mining</h3>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">Organic first-party</p>
              {cmp.organicFirstParty ? (
                <ul className="mt-2 space-y-1 text-sm text-slate-700">
                  {Object.entries(cmp.organicFirstParty).map(([k, v]) => (
                    <li key={k}>{k}: {v}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-slate-500">Geen baseline rapport</p>
              )}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">Third-party mining</p>
              {cmp.thirdPartyMining ? (
                <ul className="mt-2 space-y-1 text-sm text-slate-700">
                  {Object.entries(cmp.thirdPartyMining).map(([k, v]) => (
                    <li key={k}>{k}: {v}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-slate-500">—</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-mm-border bg-white p-5">
        <h3 className="text-sm font-semibold text-slate-900">False positive safety</h3>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2 text-sm text-slate-700">
          {Object.entries(report.falsePositives).map(([k, v]) => (
            <li key={k}>{k.replace(/_/g, " ")}: {v}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-900">Top 10 mined brands</h3>
        <div className="mt-3 space-y-3">
          {report.top10.map((c) => (
            <div
              key={c.productBrandName}
              className="rounded-2xl border border-mm-border bg-white p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-slate-900">
                  #{c.rank ?? "—"} {c.productBrandName}
                </span>
                {c.officialDomain && (
                  <a
                    href={`https://${c.officialDomain}`}
                    className="text-sm text-[#C2410C] hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {c.officialDomain}
                  </a>
                )}
                <Badge tone={c.manualReviewVerdict.includes("TRUE") ? "success" : "neutral"}>
                  {c.manualReviewVerdict}
                </Badge>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-4 lg:grid-cols-6">
                <Score label="Opportunity" value={c.thirdPartyBrandOpportunityScore} />
                <Score label="Presence" value={c.brandMarketPresenceScore} />
                <Score label="Sources" value={c.independentSourceCount} />
                <Score label="Visual gap" value={c.preauditVisualGap} />
                <Score label="Purchase gap" value={c.preauditPurchaseGap} />
                <Score label="Paid" value={c.paidAcquisition} />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                {c.productFamilyLabel} · {c.discoveredProductTitle ?? "—"} · source €
                {c.observedSourcePrice ?? "—"}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Sources: {c.sources.slice(0, 3).map((s) => s.sourceDomain).join(", ")}
              </p>
            </div>
          ))}
        </div>
      </div>

      {report.manualReview.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Manual review (top 5)</h3>
          <div className="mt-3 space-y-4">
            {report.manualReview.map((c) => (
              <div
                key={c.productBrandName}
                className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4"
              >
                <p className="font-semibold text-slate-900">{c.productBrandName}</p>
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
        Anthropic ${report.cost.anthropic.toFixed(4)} / ${report.cost.anthropicCap}
      </p>
    </section>
  );
}
