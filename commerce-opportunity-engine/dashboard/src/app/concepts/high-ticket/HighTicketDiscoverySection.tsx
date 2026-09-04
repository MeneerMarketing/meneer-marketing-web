import { readFile } from "node:fs/promises";
import path from "node:path";
import { Badge } from "@/components/ui";

type KeywordRow = {
  keyword: string;
  familyLabel: string;
  status: string;
  serpQualityScore: number;
  reason: string | null;
  rawAdvertisers: number;
  prospectEligible: number;
  approvedForDiscovery: boolean;
};

type Candidate = {
  rank: number;
  domain: string;
  siteUrl: string;
  heroProductUrl: string | null;
  branchLabel: string;
  familyLabel: string;
  platform: string | null;
  businessType: string | null;
  commerceModel: string;
  companyScaleFit: number | null;
  companyScaleBand: string | null;
  businessMaturity: number | null;
  estimatedCatalogSize: number | null;
  catalogFocusScore: number | null;
  catalogVerified: boolean;
  catalogBandLabel: string | null;
  ownBrandSignal: number | null;
  heroProduct: string | null;
  heroPrice: number | null;
  heroCurrency: string | null;
  priceBand: string | null;
  priceBandLabel: string | null;
  googleAdsEvidence: { keywords: string[]; landingUrls: string[]; sellerResolution: string | null };
  assetReadinessProxy: number | null;
  deepDivePdpFitProxy: number | null;
  currentPdpWeaknessProxy: number | null;
  estimatedContrastCeiling: number | null;
  contrastCeilingEvidence: string[];
  highTicketFocusedFitScore: number | null;
  evidence: string[];
  penalties: Array<{ reason: string; points: number }>;
  screenshots: Record<string, string> | null;
};

export type HighTicketReport = {
  milestone: string;
  version: string;
  profileVersion: string;
  finishedAt: string;
  discovery: {
    branches: Array<{ archetypeId: string; families: string[]; evidence: string }>;
    parkedArchetypes: Array<{ archetypeId: string; reason: string }>;
    keywordsTested: number;
    keywordsApproved: number;
    rawAdvertisers: number;
    uniqueAdvertisers: number;
    shoppingSellersResolved: number;
  };
  keywords: KeywordRow[];
  funnel: Record<string, number>;
  funnelYieldPercent: Record<string, number>;
  candidates: Candidate[];
  ranked: Candidate[];
  manualReview: Candidate[];
  cost: {
    dataForSeo: number;
    dataForSeoCap: number;
    anthropic: number;
    costPerCandidate: number | null;
    lightChecks: number;
    catalogChecks: number;
    heroResolutions: number;
  };
};

const FUNNEL_LABELS: Record<string, string> = {
  raw_advertisers: "Ruwe advertisers",
  prospect_eligible: "Door de prospect gate",
  ecommerce_specialists: "Ecommerce specialisten",
  compact_catalog: "Compacte catalogus",
  own_brand: "Eigen merk",
  high_ticket_hero: "Hero met serieuze waarde",
  serious_candidate: "Serieuze kandidaat",
};

export async function loadHighTicketReport(): Promise<HighTicketReport | null> {
  const reportPath = path.resolve(
    process.cwd(),
    "src/preview/concepts/data/high-ticket-discovery-report.json"
  );
  try {
    return JSON.parse(await readFile(reportPath, "utf8")) as HighTicketReport;
  } catch {
    return null;
  }
}

function money(value: number | null, currency: string | null): string {
  if (value == null) return "prijs onbekend";
  return `${currency ?? "EUR"} ${value.toLocaleString("nl-NL")}`;
}

function Score({ label, value }: { label: string; value: number | string | null }) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="text-lg font-bold text-slate-900">{value ?? "—"}</p>
    </div>
  );
}

export function HighTicketDiscoverySection({ report }: { report: HighTicketReport }) {
  const { cost, discovery } = report;
  const reviewDomains = new Set(report.manualReview.map((entry) => entry.domain));

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-[#C2410C]">
          {report.milestone}
        </p>
        <h2 className="mt-1 text-xl font-bold text-slate-900">High-ticket focused brands</h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Gezocht op commercieel profiel in plaats van branche: een klein of middelgroot merk, een
          compacte catalogus, een product van serieuze waarde dat uitleg vraagt, advertenties die al
          draaien, en een productpagina die dat nog niet waarmaakt.
        </p>
        <p className="mt-2 text-xs text-slate-500">
          {new Date(report.finishedAt).toLocaleString("nl-NL")} · DataForSEO $
          {cost.dataForSeo.toFixed(4)} van ${cost.dataForSeoCap.toFixed(2)} · Anthropic $0 ·{" "}
          {discovery.keywordsApproved} van {discovery.keywordsTested} keywords goedgekeurd
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Geparkeerd:{" "}
          {discovery.parkedArchetypes.map((entry) => entry.archetypeId).join(" · ") || "geen"}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {Object.entries(report.funnel).map(([stage, count]) => (
          <Score key={stage} label={FUNNEL_LABELS[stage] ?? stage} value={count} />
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          Top {report.ranked.length} kandidaten
          <span className="ml-2 text-xs font-normal text-slate-500">
            {report.candidates.length} serieuze kandidaten in totaal
          </span>
        </h3>

        {report.candidates.map((candidate) => (
          <div
            key={candidate.domain}
            className={`rounded-2xl border bg-white p-5 ${
              reviewDomains.has(candidate.domain)
                ? "border-2 border-emerald-500"
                : "border-mm-border"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs text-slate-500">
                  #{candidate.rank} · {candidate.familyLabel}
                </p>
                <h4 className="text-lg font-bold text-slate-900">{candidate.domain}</h4>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={candidate.priceBand === "LOW" ? "warn" : "success"}>
                  {candidate.priceBandLabel ?? "prijs onbekend"}
                </Badge>
                <Badge tone="neutral">{candidate.commerceModel}</Badge>
                {reviewDomains.has(candidate.domain) && (
                  <Badge tone="success">handmatige review</Badge>
                )}
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
              <Score label="High-ticket fit" value={candidate.highTicketFocusedFitScore} />
              <Score label="Contrastplafond" value={candidate.estimatedContrastCeiling} />
              <Score label="Bedrijfsschaal" value={candidate.companyScaleFit} />
              <Score label="Eigen merk" value={candidate.ownBrandSignal} />
              <Score label="Catalogus" value={candidate.estimatedCatalogSize} />
              <Score label="PDP-zwakte" value={candidate.currentPdpWeaknessProxy} />
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <div className="text-sm text-slate-600">
                <p>
                  <span className="font-semibold text-slate-900">Hero:</span>{" "}
                  {candidate.heroProduct ?? "geen heroproduct gevonden"}
                </p>
                <p className="text-xs text-slate-500">
                  {money(candidate.heroPrice, candidate.heroCurrency)} ·{" "}
                  {candidate.businessType ?? "type onbekend"} op {candidate.platform ?? "onbekend"} ·
                  catalogus {candidate.catalogBandLabel ?? "onbekend"}
                  {candidate.catalogVerified ? "" : " (niet geverifieerd)"}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Advertenties op: {candidate.googleAdsEvidence.keywords.join(", ") || "geen"}
                </p>
                <p className="mt-2 flex flex-wrap gap-3 text-xs">
                  <a
                    className="font-semibold text-[#C2410C] hover:underline"
                    href={candidate.siteUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    homepage
                  </a>
                  {candidate.heroProductUrl && (
                    <a
                      className="font-semibold text-[#C2410C] hover:underline"
                      href={candidate.heroProductUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      hero productpagina
                    </a>
                  )}
                </p>
              </div>

              <div className="text-xs text-slate-600">
                {candidate.evidence.length > 0 && (
                  <ul className="space-y-1">
                    {candidate.evidence.slice(0, 5).map((item) => (
                      <li key={item}>· {item}</li>
                    ))}
                  </ul>
                )}
                {candidate.penalties.length > 0 && (
                  <p className="mt-2 text-amber-700">
                    Aftrek:{" "}
                    {candidate.penalties
                      .map((entry) => `${entry.reason} (-${entry.points})`)
                      .join(" · ")}
                  </p>
                )}
                {candidate.contrastCeilingEvidence.length > 0 && (
                  <p className="mt-2 text-slate-500">
                    {candidate.contrastCeilingEvidence.join(" · ")}
                  </p>
                )}
              </div>
            </div>

            {candidate.screenshots && (
              <p className="mt-3 text-[11px] text-slate-400">
                Screenshots: {Object.keys(candidate.screenshots).join(" · ")}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-mm-border bg-white">
        <div className="border-b border-mm-border px-5 py-4">
          <h3 className="text-sm font-bold">Keywords en hun advertentielandschap</h3>
          <p className="text-xs text-slate-500">
            {discovery.rawAdvertisers} plaatsingen, {discovery.uniqueAdvertisers} unieke adverteerders,{" "}
            {discovery.shoppingSellersResolved} shopping-verkopers herleid naar een domein
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-2 text-left">Keyword</th>
                <th className="px-4 py-2 text-left">Familie</th>
                <th className="px-4 py-2 text-right">Kwaliteit</th>
                <th className="px-4 py-2 text-right">Advertisers</th>
                <th className="px-4 py-2 text-left">Oordeel</th>
              </tr>
            </thead>
            <tbody>
              {report.keywords.map((row) => (
                <tr key={row.keyword} className="border-t border-mm-border">
                  <td className="px-4 py-2 font-medium text-slate-900">{row.keyword}</td>
                  <td className="px-4 py-2 text-xs text-slate-600">{row.familyLabel}</td>
                  <td className="px-4 py-2 text-right font-semibold">{row.serpQualityScore}</td>
                  <td className="px-4 py-2 text-right text-slate-500">
                    {row.prospectEligible}/{row.rawAdvertisers}
                  </td>
                  <td className="px-4 py-2 text-xs">
                    {row.approvedForDiscovery ? (
                      <Badge tone="success">{row.status}</Badge>
                    ) : (
                      <span className="text-slate-500">{row.reason ?? row.status}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
