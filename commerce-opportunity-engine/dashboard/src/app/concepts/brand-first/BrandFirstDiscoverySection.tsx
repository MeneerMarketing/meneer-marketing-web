import { readFile } from "node:fs/promises";
import path from "node:path";
import { Badge } from "@/components/ui";

type HeroTarget = {
  heroProductUrl: string | null;
  heroTitle: string | null;
  heroPrice: number | null;
  heroConfidence: number | null;
};

type ManualReview = {
  whyBusinessFits: string;
  whyProductFits: string;
  whatPdpLeavesOnTable: string;
  expectedBeforeAfter: string;
};

type BrandCandidate = {
  rank: number | null;
  domain: string;
  brandName: string;
  productFamilyId: string;
  productFamilyLabel: string;
  discoverySource: string;
  sourceQuery: string;
  platform: string | null;
  businessType: string | null;
  firstPartyConfidence: number;
  brandScaleFit: number;
  businessMaturity: number | null;
  catalogEstimate: number | null;
  catalogFocus: number | null;
  catalogVerified: boolean;
  ownBrand: number | null;
  heroTarget: HeroTarget;
  productStoryPotential: number | null;
  assetContentAvailability: number | null;
  preauditVisualGap: number | null;
  preauditPurchaseGap: number | null;
  mobileGap: number | null;
  contentAvailable: number | null;
  contentPresentation: number | null;
  rawDesignGapOpportunity: number | null;
  visualGapBand: string;
  purchaseGapBand: string;
  paidAcquisition: string;
  paidEvidence: string[];
  brandFirstOpportunityScore: number | null;
  sweetSpotProfile: string | null;
  overallConfidence: string;
  designGapScreened: boolean;
  manualReview: ManualReview | null;
  screenshots: Record<string, string> | null;
};

export type BrandFirstReport = {
  milestone: string;
  version: string;
  profileVersion: string;
  finishedAt: string;
  sources: {
    primary: string;
    discoveryRoute: string;
    paidValidation: string;
  };
  productFamilies: Array<{ id: string; label: string; queries: string[] }>;
  funnel: Record<string, number>;
  top10: BrandCandidate[];
  manualReview: BrandCandidate[];
  cost: {
    dataForSeo: number;
    dataForSeoCap: number;
    anthropic: number;
    anthropicCap: number;
    visionScreens: number;
  };
};

const FUNNEL_LABELS: Record<string, string> = {
  organic_queries: "Organic queries",
  organic_rows: "Organic SERP rijen",
  retailer_extractions_attempted: "Retailer extracties",
  brands_discovered: "Merken ontdekt",
  first_party_passed: "First-party passed",
  economic_qualified: "Economisch gekwalificeerd",
  design_gap_screened: "Design-gap screen",
  paid_validated: "Paid validatie",
};

export async function loadBrandFirstReport(): Promise<BrandFirstReport | null> {
  const reportPath = path.resolve(
    process.cwd(),
    "src/preview/concepts/data/brand-first-discovery-report.json"
  );
  try {
    return JSON.parse(await readFile(reportPath, "utf8")) as BrandFirstReport;
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

function paidTone(level: string): "success" | "warn" | "neutral" {
  if (level === "CONFIRMED" || level === "LIKELY") return "success";
  if (level === "NOT_FOUND") return "warn";
  return "neutral";
}

export function BrandFirstDiscoverySection({ report }: { report: BrandFirstReport }) {
  const { cost, sources } = report;

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-[#C2410C]">
          {report.milestone}
        </p>
        <h2 className="mt-1 text-xl font-bold text-slate-900">Brand-first opportunities</h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Organic product discovery eerst. Merk en economische fit vóór paid validation. Google Ads
          is een bonus-signaal, geen primaire discovery-bron.
        </p>
        <p className="mt-2 text-xs text-slate-500">
          {new Date(report.finishedAt).toLocaleString("nl-NL")} · route {sources.discoveryRoute} ·
          DataForSEO ${cost.dataForSeo.toFixed(4)} van ${cost.dataForSeoCap.toFixed(2)} · Anthropic
          ${cost.anthropic.toFixed(4)} van ${cost.anthropicCap.toFixed(2)} · {cost.visionScreens}{" "}
          vision screens
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-4 lg:grid-cols-8">
        {Object.entries(report.funnel).map(([stage, count]) => (
          <Score key={stage} label={FUNNEL_LABELS[stage] ?? stage} value={count} />
        ))}
      </div>

      <div className="rounded-2xl border border-mm-border bg-white p-5">
        <h3 className="text-sm font-bold text-slate-900">Pipeline</h3>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <Badge tone="neutral">Discovery: {sources.primary}</Badge>
          <Badge tone="neutral">Brand validation</Badge>
          <Badge tone="neutral">Economic fit</Badge>
          <Badge tone="neutral">Design gap</Badge>
          <Badge tone="neutral">Paid: {sources.paidValidation}</Badge>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Top 10 brand-first kandidaten</h3>

        {report.top10.map((candidate) => (
          <div
            key={candidate.domain}
            className="rounded-2xl border border-mm-border bg-white p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs text-slate-500">
                  #{candidate.rank} · {candidate.productFamilyLabel} · {candidate.discoverySource}
                </p>
                <h4 className="text-lg font-bold text-slate-900">
                  {candidate.brandName} · {candidate.domain}
                </h4>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="success">{candidate.sweetSpotProfile ?? "MIXED"}</Badge>
                <Badge tone={paidTone(candidate.paidAcquisition)}>
                  paid {candidate.paidAcquisition}
                </Badge>
                <Badge tone="neutral">{candidate.overallConfidence}</Badge>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
              <Score label="Opportunity" value={candidate.brandFirstOpportunityScore} />
              <Score label="First-party" value={candidate.firstPartyConfidence} />
              <Score label="Scale fit" value={candidate.brandScaleFit} />
              <Score label="Visual gap" value={candidate.preauditVisualGap} />
              <Score label="Purchase gap" value={candidate.preauditPurchaseGap} />
              <Score label="Mobile gap" value={candidate.mobileGap} />
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
              <Score label="Catalog" value={candidate.catalogEstimate} />
              <Score label="Catalog focus" value={candidate.catalogFocus} />
              <Score label="Own brand" value={candidate.ownBrand} />
              <Score label="Hero €" value={candidate.heroTarget.heroPrice} />
              <Score label="Assets" value={candidate.assetContentAvailability} />
              <Score label="Presentatie" value={candidate.contentPresentation} />
            </div>

            <div className="mt-4 text-sm text-slate-600">
              <p>
                <span className="font-semibold text-slate-900">Hero:</span>{" "}
                {candidate.heroTarget.heroTitle ?? "onbekend"}
              </p>
              <p className="text-xs text-slate-500">
                Query: {candidate.sourceQuery} · {candidate.platform ?? "platform onbekend"} ·{" "}
                {candidate.businessType ?? "type onbekend"}
              </p>
              <p className="mt-2 flex flex-wrap gap-3 text-xs">
                <a
                  className="font-semibold text-[#C2410C] hover:underline"
                  href={`https://${candidate.domain}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  homepage
                </a>
                {candidate.heroTarget.heroProductUrl && (
                  <a
                    className="font-semibold text-[#C2410C] hover:underline"
                    href={candidate.heroTarget.heroProductUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    hero PDP
                  </a>
                )}
              </p>
              {candidate.paidEvidence.length > 0 && (
                <p className="mt-2 text-xs text-slate-500">
                  Paid evidence: {candidate.paidEvidence.join(" · ")}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {report.manualReview.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Top 5 handmatige review</h3>
          {report.manualReview.map((candidate) => (
            <div
              key={`review-${candidate.domain}`}
              className="rounded-2xl border-2 border-emerald-500 bg-white p-5"
            >
              <h4 className="text-lg font-bold text-slate-900">
                #{candidate.rank} {candidate.domain}
              </h4>
              {candidate.manualReview && (
                <dl className="mt-4 space-y-3 text-sm text-slate-600">
                  <div>
                    <dt className="font-semibold text-slate-900">Waarom business fit</dt>
                    <dd>{candidate.manualReview.whyBusinessFits}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-900">Waarom product fit</dt>
                    <dd>{candidate.manualReview.whyProductFits}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-900">Wat de PDP nu mist</dt>
                    <dd>{candidate.manualReview.whatPdpLeavesOnTable}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-900">Before/after potentie</dt>
                    <dd>{candidate.manualReview.expectedBeforeAfter}</dd>
                  </div>
                </dl>
              )}
              {candidate.screenshots && (
                <p className="mt-3 text-[11px] text-slate-400">
                  Screenshots: {Object.keys(candidate.screenshots).join(" · ")}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
