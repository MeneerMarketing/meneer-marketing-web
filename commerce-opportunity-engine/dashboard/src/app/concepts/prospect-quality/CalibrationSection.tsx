import { readFile } from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { Badge } from "@/components/ui";

type BranchResult = {
  archetypeId: string;
  label: string;
  keywordsTested: number;
  approvedKeywords: number;
  marginalKeywords: number;
  rawAdvertisers: number;
  uniqueAdvertisers: number;
  prospectEligible: number;
  nicheBrands: number;
  specialists: number;
  retailersExcluded: number;
  comparisonExcluded: number;
  marketplacesExcluded: number;
  specialistYieldPercent: number;
  prospectYieldPercent: number;
  cost: number;
  costPerProspectEligible: number | null;
  unresolvedShoppingSellers: number;
  verdict: "STRONG" | "PROMISING" | "WEAK" | "REJECT";
  bestFamily: string | null;
  worstFamily: string | null;
};

type KeywordResult = {
  keyword: string;
  archetypeLabel: string;
  familyLabel: string;
  archetypeFit: number;
  rawAdvertisers: number;
  nicheBrands: number;
  specialists: number;
  retailers: number;
  comparison: number;
  marketplaces: number;
  serpQualityScore: number;
  status: string;
  reason: string | null;
  domains: string[];
  unresolvedShoppingSellers: string[];
};

type BestDomain = {
  domain: string;
  brandId: string | null;
  businessType: string | null;
  platform: string | null;
  isEcommerce: boolean | null;
  ownBrandSignal: number | null;
  retailerScaleScore: number | null;
  familyId: string;
  keywords: string[];
  checked: boolean;
};

export type CalibrationReport = {
  version: string;
  runId: string;
  finishedAt: string;
  classifier: {
    version: string;
    scanned: number;
    corrected: number;
    flaggedForRecrawl: number;
    corrections: Array<{ domain: string; from: string | null; to: string; reason: string }>;
    regression: string;
  };
  branchResults: BranchResult[];
  keywordResults: KeywordResult[];
  bestDomains: BestDomain[];
  rejectedLandscape: Array<{
    domain: string;
    prospectClass: string;
    reason: string | null;
  }>;
  sellerRecovery?: { recovered: number; stillUnresolved: number };
  cost: { dataForSeo: number; dataForSeoCap: number; anthropic: number; lightChecks: number };
};

export async function loadCalibrationReport(): Promise<CalibrationReport | null> {
  const reportPath = path.resolve(
    process.cwd(),
    "src/preview/concepts/data/prospect-calibration-report.json"
  );
  try {
    return JSON.parse(await readFile(reportPath, "utf8")) as CalibrationReport;
  } catch {
    return null;
  }
}

function verdictTone(verdict: BranchResult["verdict"]): "success" | "warn" | "danger" | "neutral" {
  if (verdict === "STRONG") return "success";
  if (verdict === "PROMISING") return "success";
  if (verdict === "WEAK") return "warn";
  return "danger";
}

function statusTone(status: string): "success" | "warn" | "danger" | "neutral" {
  if (status === "APPROVED") return "success";
  if (status === "MARGINAL") return "warn";
  if (status === "NO_SAMPLE") return "neutral";
  return "danger";
}

export function CalibrationSection({ report }: { report: CalibrationReport }) {
  const totalUnresolved = report.branchResults.reduce(
    (sum, branch) => sum + branch.unresolvedShoppingSellers,
    0
  );
  const recovered = report.sellerRecovery?.recovered ?? 0;

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-mm-border bg-white p-5">
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone="neutral">M9.3.2</Badge>
          <h2 className="text-sm font-bold">Discovery calibration</h2>
          <span className="text-xs text-slate-500">
            {new Date(report.finishedAt).toLocaleString("nl-NL")} · DataForSEO $
            {report.cost.dataForSeo.toFixed(4)} van ${report.cost.dataForSeoCap.toFixed(2)} ·
            Anthropic $0.00
          </span>
        </div>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Kleine SERP-sample over de nieuwe archetype keyword families. Hier zie je per branch of het
          advertentielandschap daadwerkelijk niche merken en gefocuste specialisten bevat. Geen CRO,
          geen concepts, geen outreach.
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Classifier {report.classifier.version} · {report.classifier.corrected} classificaties
          gecorrigeerd · {report.classifier.flaggedForRecrawl} in wachtrij voor hercheck · regressie{" "}
          {report.classifier.regression}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {report.branchResults.map((branch) => (
          <div key={branch.archetypeId} className="rounded-2xl border border-mm-border bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold">{branch.label}</h3>
                <p className="text-xs text-slate-500">{branch.archetypeId}</p>
              </div>
              <Badge tone={verdictTone(branch.verdict)}>{branch.verdict}</Badge>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
              <div>
                <dt className="text-slate-500">Keywords</dt>
                <dd className="font-mono font-semibold">
                  {branch.keywordsTested} · {branch.approvedKeywords} approved
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Advertisers</dt>
                <dd className="font-mono font-semibold">
                  {branch.rawAdvertisers} raw · {branch.uniqueAdvertisers} uniek
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Prospect eligible</dt>
                <dd className="font-mono font-semibold text-emerald-700">
                  {branch.prospectEligible} ({branch.prospectYieldPercent}%)
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Merk / specialist</dt>
                <dd className="font-mono font-semibold text-emerald-700">
                  {branch.nicheBrands} / {branch.specialists}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Geblokkeerd</dt>
                <dd className="font-mono font-semibold text-rose-700">
                  {branch.retailersExcluded} retail · {branch.comparisonExcluded} vergelijk
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Kosten</dt>
                <dd className="font-mono font-semibold">
                  ${branch.cost.toFixed(4)}
                  {branch.costPerProspectEligible !== null && (
                    <span className="block text-slate-500">
                      ${branch.costPerProspectEligible.toFixed(4)} per eligible
                    </span>
                  )}
                </dd>
              </div>
            </dl>

            <div className="mt-4 space-y-1 border-t border-mm-border pt-3 text-xs">
              {branch.bestFamily && (
                <p>
                  <span className="text-slate-500">Beste familie:</span>{" "}
                  <span className="font-semibold">{branch.bestFamily}</span>
                </p>
              )}
              {branch.worstFamily && branch.worstFamily !== branch.bestFamily && (
                <p>
                  <span className="text-slate-500">Zwakste familie:</span>{" "}
                  <span className="font-semibold">{branch.worstFamily}</span>
                </p>
              )}
              {branch.unresolvedShoppingSellers > 0 && (
                <p className="text-amber-700">
                  {branch.unresolvedShoppingSellers} shopping-verkopers zonder domein weggevallen
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {(recovered > 0 || totalUnresolved > 0) && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-900">
          <p className="font-semibold">Shopping-verkopers naar domein</p>
          {recovered > 0 && (
            <p className="mt-1">
              {recovered} verkopers stonden in de shopping-resultaten zonder domein en zijn alsnog
              herleid en geverifieerd met een eigen HTTP-check. Dat zijn juist vaak de kleine
              specialisten, dus zonder die stap zou de yield hieronder te laag uitvallen.
            </p>
          )}
          {totalUnresolved > 0 && (
            <p className="mt-1">
              {totalUnresolved} verkopers blijven onherleidbaar. De branch yield is daardoor een
              ondergrens, geen exacte waarde.
            </p>
          )}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-mm-border bg-white">
        <div className="flex items-center justify-between border-b border-mm-border px-5 py-4">
          <h3 className="text-sm font-bold">Keyword resultaten</h3>
          <p className="text-xs text-slate-500">
            APPROVED vraagt 40% merk of specialist en maximaal 50% retail, marketplace en vergelijkers
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-3 py-2">Keyword</th>
                <th className="px-3 py-2">Branch / familie</th>
                <th className="px-3 py-2">Fit</th>
                <th className="px-3 py-2">Raw</th>
                <th className="px-3 py-2">Merk/spec</th>
                <th className="px-3 py-2">Retail</th>
                <th className="px-3 py-2">Vergelijk</th>
                <th className="px-3 py-2">Market</th>
                <th className="px-3 py-2">Quality</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {report.keywordResults.map((row) => (
                <tr key={row.keyword} className="border-t border-mm-border align-top">
                  <td className="px-3 py-2">
                    <span className="font-semibold">{row.keyword}</span>
                    {row.reason && (
                      <span className="block text-xs text-slate-500">{row.reason}</span>
                    )}
                    {row.domains.length > 0 && (
                      <span className="block text-[11px] text-slate-400">
                        {row.domains.join(", ")}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-xs">
                    {row.archetypeLabel}
                    <span className="block text-slate-400">{row.familyLabel}</span>
                  </td>
                  <td className="px-3 py-2 font-mono text-xs">{row.archetypeFit}</td>
                  <td className="px-3 py-2 font-mono text-xs">{row.rawAdvertisers}</td>
                  <td className="px-3 py-2 font-mono text-xs text-emerald-700">
                    {row.nicheBrands + row.specialists}
                  </td>
                  <td className="px-3 py-2 font-mono text-xs text-rose-700">{row.retailers}</td>
                  <td className="px-3 py-2 font-mono text-xs text-rose-700">{row.comparison}</td>
                  <td className="px-3 py-2 font-mono text-xs text-rose-700">{row.marketplaces}</td>
                  <td className="px-3 py-2 font-mono text-xs font-bold">{row.serpQualityScore}</td>
                  <td className="px-3 py-2">
                    <Badge tone={statusTone(row.status)}>{row.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-mm-border bg-white">
          <div className="border-b border-mm-border px-5 py-4">
            <h3 className="text-sm font-bold">Gevonden prospects</h3>
            <p className="text-xs text-slate-500">
              Klik door om zelf te beoordelen. Alleen goedkope checks gedaan: 1 homepage fetch.
            </p>
          </div>
          <ul className="divide-y divide-mm-border">
            {report.bestDomains.map((domain) => (
              <li key={domain.domain} className="px-5 py-3 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={`https://${domain.domain}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-mm-orange hover:underline"
                  >
                    {domain.domain}
                  </a>
                  {domain.brandId && (
                    <Link
                      href={`/brands/${domain.brandId}`}
                      className="text-xs text-slate-500 underline"
                    >
                      details
                    </Link>
                  )}
                  <Badge tone="neutral">{domain.businessType ?? "onbekend"}</Badge>
                  {domain.platform && domain.platform !== "UNKNOWN" && (
                    <Badge tone="neutral">{domain.platform}</Badge>
                  )}
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  gevonden op {domain.keywords.join(", ")}
                  {domain.ownBrandSignal !== null && ` · eigen-merk signaal ${domain.ownBrandSignal}`}
                  {domain.retailerScaleScore !== null &&
                    ` · retail scale ${domain.retailerScaleScore}`}
                </p>
              </li>
            ))}
            {report.bestDomains.length === 0 && (
              <li className="px-5 py-4 text-sm text-slate-500">
                Geen prospect-eligible domeinen in deze sample.
              </li>
            )}
          </ul>
        </div>

        <div className="overflow-hidden rounded-2xl border border-mm-border bg-white">
          <div className="border-b border-mm-border px-5 py-4">
            <h3 className="text-sm font-bold">Vroeg gestopt</h3>
            <p className="text-xs text-slate-500">
              Deze partijen zijn direct geblokkeerd en gaan nooit downstream.
            </p>
          </div>
          <ul className="divide-y divide-mm-border">
            {report.rejectedLandscape.map((domain) => (
              <li key={domain.domain} className="flex items-center justify-between px-5 py-2 text-sm">
                <span className="font-medium">{domain.domain}</span>
                <span className="text-xs text-slate-500">
                  {domain.prospectClass}
                  {domain.reason ? ` · ${domain.reason}` : ""}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {report.classifier.corrections.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-mm-border bg-white">
          <div className="border-b border-mm-border px-5 py-4">
            <h3 className="text-sm font-bold">Gecorrigeerde classificaties</h3>
            <p className="text-xs text-slate-500">
              Via de classifier zelf, versie {report.classifier.version}. Geen losse database-patches.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-3 py-2">Domein</th>
                  <th className="px-3 py-2">Was</th>
                  <th className="px-3 py-2">Wordt</th>
                  <th className="px-3 py-2">Reden</th>
                </tr>
              </thead>
              <tbody>
                {report.classifier.corrections.map((correction) => (
                  <tr key={correction.domain} className="border-t border-mm-border">
                    <td className="px-3 py-2 font-medium">{correction.domain}</td>
                    <td className="px-3 py-2 text-xs text-slate-500">
                      {correction.from ?? "onbekend"}
                    </td>
                    <td className="px-3 py-2 text-xs font-semibold">{correction.to}</td>
                    <td className="px-3 py-2 text-xs text-slate-500">{correction.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
