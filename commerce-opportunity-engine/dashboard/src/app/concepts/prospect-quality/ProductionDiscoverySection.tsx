import { readFile } from "node:fs/promises";
import path from "node:path";
import { Badge } from "@/components/ui";

type KeywordOutcome = {
  keyword: string;
  familyLabel: string;
  seed: string;
  generationSource: string;
  archetypeFit: number;
  status: string;
  serpQualityScore: number;
  reason: string | null;
  rawAdvertisers: number;
  approvedForDiscovery: boolean;
  searchVolume: number | null;
};

type TopProspect = {
  domain: string;
  siteUrl: string;
  branchLabel: string;
  sourceKeyword: string | null;
  familyLabel: string;
  platform: string | null;
  businessType: string | null;
  commerceModel: string;
  estimatedCatalogSize: number | null;
  catalogFocusScore: number | null;
  catalogVerified: boolean;
  catalogEvidence: string[];
  ownBrandSignal: number | null;
  ownBrandEvidence: string[];
  retailerBreadthScore: number | null;
  internationalPresenceScore: number | null;
  googleAdsEvidence: {
    keywords: string[];
    landingUrls: string[];
    sellerResolution: string | null;
  };
  heroProduct: string | null;
  heroProductUrl: string | null;
  heroPrice: number | null;
  heroCurrency: string | null;
  assetReadinessProxy: number | null;
  deepDivePdpFitProxy: number | null;
  currentPdpWeaknessProxy: number | null;
  idealProspectPreScore: number | null;
  preScoreEvidence: string[];
};

export type ProductionDiscoveryReport = {
  version: string;
  runId: string;
  finishedAt: string;
  classifier: {
    version: string;
    correctedThisPass: number;
    revertedExclusions: number;
    revertedDomains: Array<{ domain: string; from: string; reason: string }>;
    gateRegression: string;
    classifierRegression: string;
    regressionCases: Array<{
      label: string;
      verdict: string;
      passed: boolean;
      internationalPresenceScore: number;
      retailerBreadthScore: number;
    }>;
  };
  discovery: {
    branches: Array<{ archetypeId: string; families: string[]; evidence: string }>;
    parkedFamilies: Array<{ familyId: string; reason: string }>;
    keywordsGenerated: number;
    keywordsTested: number;
    keywordsApproved: number;
    keywordsNotTested: string[];
    rawAdvertisers: number;
    uniqueAdvertisers: number;
    shoppingSellersResolved: number;
    shoppingSellersUnresolved: number;
  };
  keywords: KeywordOutcome[];
  funnel: Record<string, number>;
  funnelYieldPercent: Record<string, number>;
  excludedRetailers: Array<{ domain: string; prospectClass: string; reason: string | null }>;
  topProspects: TopProspect[];
  cost: {
    dataForSeo: number;
    dataForSeoCap: number;
    anthropic: number;
    costPerStrongProspect: number | null;
    lightChecks: number;
    catalogChecks: number;
    heroResolutions: number;
  };
};

const FUNNEL_LABELS: Record<string, string> = {
  raw_advertisers: "Ruwe advertisers",
  prospect_eligible: "Door de prospect gate",
  ecommerce_specialists: "Ecommerce specialisten",
  focused_catalog: "Gefocuste catalogus",
  own_brand: "Eigen merk",
  strong_hero: "Sterk heroproduct",
  strong_prospect: "Sterke prospect",
};

export async function loadProductionDiscoveryReport(): Promise<ProductionDiscoveryReport | null> {
  const reportPath = path.resolve(
    process.cwd(),
    "src/preview/concepts/data/focused-production-discovery-report.json"
  );
  try {
    return JSON.parse(await readFile(reportPath, "utf8")) as ProductionDiscoveryReport;
  } catch {
    return null;
  }
}

function statusTone(status: string): "success" | "warn" | "danger" | "neutral" {
  if (status === "APPROVED") return "success";
  if (status === "MARGINAL") return "warn";
  if (status === "NO_SAMPLE") return "neutral";
  return "danger";
}

export function ProductionDiscoverySection({ report }: { report: ProductionDiscoveryReport }) {
  const { classifier, discovery, funnel, cost } = report;
  const maxFunnel = Math.max(...Object.values(funnel), 1);

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-[#C2410C]">M9.3.3</p>
        <h2 className="mt-1 text-xl font-bold text-slate-900">
          Focused production discovery
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Alleen de productfamilies die in de calibratie bewezen dat ze echte specialisten
          opleveren. Internationale merken worden niet langer uitgesloten omdat ze in veel landen
          verkopen: alleen assortimentsbreedte telt nog als retailersignaal.
        </p>
        <p className="mt-2 text-xs text-slate-500">
          {report.version} · {new Date(report.finishedAt).toLocaleString("nl-NL")} · classifier{" "}
          {classifier.version} · DataForSEO ${cost.dataForSeo.toFixed(4)} van $
          {cost.dataForSeoCap.toFixed(2)} · Anthropic $0,00
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-mm-border bg-white p-5">
          <p className="text-xs font-semibold uppercase text-slate-500">Sterke prospects</p>
          <p className="mt-2 text-2xl font-bold text-emerald-700">{funnel.strong_prospect ?? 0}</p>
          <p className="text-xs text-slate-500">
            uit {discovery.uniqueAdvertisers} unieke advertisers
          </p>
        </div>
        <div className="rounded-2xl border border-mm-border bg-white p-5">
          <p className="text-xs font-semibold uppercase text-slate-500">Prospect yield</p>
          <p className="mt-2 text-2xl font-bold">{report.funnelYieldPercent.prospectYield}%</p>
          <p className="text-xs text-slate-500">
            sterke prospects {report.funnelYieldPercent.strongProspectYield}%
          </p>
        </div>
        <div className="rounded-2xl border border-mm-border bg-white p-5">
          <p className="text-xs font-semibold uppercase text-slate-500">Kosten per prospect</p>
          <p className="mt-2 text-2xl font-bold">
            {cost.costPerStrongProspect === null
              ? "—"
              : `$${cost.costPerStrongProspect.toFixed(4)}`}
          </p>
          <p className="text-xs text-slate-500">
            {discovery.shoppingSellersResolved} shopping-verkopers herleid
          </p>
        </div>
        <div className="rounded-2xl border border-mm-border bg-white p-5">
          <p className="text-xs font-semibold uppercase text-slate-500">Keywords</p>
          <p className="mt-2 text-2xl font-bold">
            {discovery.keywordsApproved}/{discovery.keywordsTested}
          </p>
          <p className="text-xs text-slate-500">
            goedgekeurd voor discovery, {discovery.keywordsGenerated} gegenereerd
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-mm-border bg-white">
          <div className="border-b border-mm-border px-5 py-4">
            <h3 className="text-sm font-bold">Funnel</h3>
            <p className="text-xs text-slate-500">
              Van ruwe advertentie tot bedrijf dat een CRO-audit waard is.
            </p>
          </div>
          <div className="space-y-3 px-5 py-4">
            {Object.entries(funnel).map(([stage, count]) => (
              <div key={stage}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700">
                    {FUNNEL_LABELS[stage] ?? stage}
                  </span>
                  <span className="font-mono text-slate-500">{count}</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-[#FF5722]"
                    style={{ width: `${Math.round((count / maxFunnel) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-mm-border bg-white">
          <div className="flex items-center justify-between border-b border-mm-border px-5 py-4">
            <h3 className="text-sm font-bold">Classifier: internationaal is geen keten</h3>
            <Badge tone={classifier.classifierRegression.split("/")[0] === classifier.classifierRegression.split("/")[1] ? "success" : "danger"}>
              {classifier.classifierRegression}
            </Badge>
          </div>
          <div className="px-5 py-4 text-sm text-slate-600">
            <p>
              {classifier.revertedExclusions} onterechte uitsluitingen teruggedraaid, gate-regressie{" "}
              {classifier.gateRegression}.
            </p>
            {classifier.revertedDomains.length > 0 && (
              <p className="mt-2 text-xs text-slate-500">
                Terug in de pool: {classifier.revertedDomains.map((d) => d.domain).join(", ")}
              </p>
            )}
            <table className="mt-4 min-w-full text-left text-xs">
              <thead className="text-slate-500">
                <tr>
                  <th className="py-1">Testgeval</th>
                  <th className="py-1">Uitkomst</th>
                  <th className="py-1">Intl</th>
                  <th className="py-1">Breedte</th>
                </tr>
              </thead>
              <tbody>
                {classifier.regressionCases.map((entry) => (
                  <tr key={entry.label} className="border-t border-mm-border">
                    <td className="py-1 pr-2">{entry.label}</td>
                    <td className="py-1 pr-2">
                      <Badge tone={entry.passed ? "success" : "danger"}>{entry.verdict}</Badge>
                    </td>
                    <td className="py-1 pr-2 font-mono">{entry.internationalPresenceScore}</td>
                    <td className="py-1 font-mono">{entry.retailerBreadthScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-mm-border bg-white">
        <div className="border-b border-mm-border px-5 py-4">
          <h3 className="text-sm font-bold">Top prospects</h3>
          <p className="text-xs text-slate-500">
            Deterministisch voorgesorteerd, zonder Claude. De CRO-audit komt pas hierna.
          </p>
        </div>
        <div className="divide-y divide-mm-border">
          {report.topProspects.map((prospect) => (
            <div key={prospect.domain} className="px-5 py-4">
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={prospect.siteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-[#C2410C] hover:underline"
                >
                  {prospect.domain}
                </a>
                <Badge tone="success">score {prospect.idealProspectPreScore}</Badge>
                <span className="text-xs text-slate-500">
                  {prospect.branchLabel} · {prospect.familyLabel}
                </span>
                {prospect.googleAdsEvidence.sellerResolution && (
                  <Badge tone="neutral">shopping seller herleid</Badge>
                )}
              </div>

              <p className="mt-1 text-xs text-slate-600">
                {prospect.platform ?? "platform onbekend"} · {prospect.businessType ?? "type onbekend"} ·{" "}
                catalogus{" "}
                {prospect.estimatedCatalogSize ?? "niet geverifieerd"}
                {prospect.catalogVerified ? "" : " (schatting)"} · focus{" "}
                {prospect.catalogFocusScore ?? "?"} · eigen merk {prospect.ownBrandSignal ?? "?"}
              </p>

              <p className="mt-1 text-xs text-slate-600">
                deep-dive fit {prospect.deepDivePdpFitProxy ?? "?"} · PDP-zwakte{" "}
                {prospect.currentPdpWeaknessProxy ?? "niet gelezen"} · assets{" "}
                {prospect.assetReadinessProxy ?? "?"} · advertentie op &ldquo;
                {prospect.sourceKeyword ?? "onbekend"}&rdquo;
              </p>

              {prospect.heroProduct && (
                <p className="mt-1 text-xs text-slate-700">
                  Hero:{" "}
                  {prospect.heroProductUrl ? (
                    <a
                      href={prospect.heroProductUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-[#C2410C] hover:underline"
                    >
                      {prospect.heroProduct}
                    </a>
                  ) : (
                    <span className="font-medium">{prospect.heroProduct}</span>
                  )}
                  {prospect.heroPrice !== null && (
                    <span className="text-slate-500">
                      {" "}
                      · {prospect.heroCurrency ?? "EUR"} {prospect.heroPrice}
                    </span>
                  )}
                </p>
              )}

              {prospect.preScoreEvidence.length > 0 && (
                <p className="mt-1 text-[11px] text-slate-400">
                  {prospect.preScoreEvidence.join(" · ")}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-mm-border bg-white">
          <div className="border-b border-mm-border px-5 py-4">
            <h3 className="text-sm font-bold">Keywords met lineage</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-3 py-2">Keyword</th>
                  <th className="px-3 py-2">Familie</th>
                  <th className="px-3 py-2">Herkomst</th>
                  <th className="px-3 py-2">Adv</th>
                  <th className="px-3 py-2">Quality</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {report.keywords.map((keyword) => (
                  <tr key={keyword.keyword} className="border-t border-mm-border align-top">
                    <td className="px-3 py-2">
                      <span className="font-medium">{keyword.keyword}</span>
                      {keyword.reason && (
                        <span className="block text-[11px] text-slate-500">{keyword.reason}</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-xs">
                      {keyword.familyLabel}
                      <span className="block text-slate-400">fit {keyword.archetypeFit}</span>
                    </td>
                    <td className="px-3 py-2 text-xs text-slate-500">
                      {keyword.generationSource === "family_seed" ? "familie-seed" : "keyword ideas"}
                      <span className="block text-slate-400">{keyword.seed}</span>
                    </td>
                    <td className="px-3 py-2 font-mono text-xs">{keyword.rawAdvertisers}</td>
                    <td className="px-3 py-2 font-mono text-xs">{keyword.serpQualityScore}</td>
                    <td className="px-3 py-2">
                      <Badge tone={statusTone(keyword.status)}>{keyword.status}</Badge>
                      {!keyword.approvedForDiscovery && (
                        <span className="mt-1 block text-[11px] text-slate-500">gestopt</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {discovery.keywordsNotTested.length > 0 && (
            <p className="border-t border-mm-border px-5 py-3 text-xs text-slate-500">
              Zonder SERP-sample in deze run: {discovery.keywordsNotTested.join(", ")}
            </p>
          )}
        </div>

        <div className="overflow-hidden rounded-2xl border border-mm-border bg-white">
          <div className="border-b border-mm-border px-5 py-4">
            <h3 className="text-sm font-bold">Geblokkeerd door de centrale gate</h3>
            <p className="text-xs text-slate-500">
              Deze domeinen zijn wel als placement bewaard, maar gaan niet verder de pipeline in.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-3 py-2">Domein</th>
                  <th className="px-3 py-2">Klasse</th>
                  <th className="px-3 py-2">Reden</th>
                </tr>
              </thead>
              <tbody>
                {report.excludedRetailers.map((entry) => (
                  <tr key={entry.domain} className="border-t border-mm-border">
                    <td className="px-3 py-2">{entry.domain}</td>
                    <td className="px-3 py-2 text-xs">{entry.prospectClass}</td>
                    <td className="px-3 py-2 text-xs text-slate-500">{entry.reason ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-mm-border bg-white p-5 text-sm text-slate-600">
        <h3 className="text-sm font-bold text-slate-900">Actieve en geparkeerde families</h3>
        <p className="mt-2">
          Actief:{" "}
          {discovery.branches
            .map((branch) => `${branch.archetypeId} (${branch.families.join(", ")})`)
            .join(" · ")}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Geparkeerd:{" "}
          {discovery.parkedFamilies
            .map((family) => `${family.familyId}: ${family.reason}`)
            .join(" · ")}
        </p>
      </div>
    </section>
  );
}
