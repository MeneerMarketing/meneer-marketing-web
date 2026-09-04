import { readFile } from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { Badge, SectionTitle } from "@/components/ui";
import { CalibrationSection, loadCalibrationReport } from "./CalibrationSection";
import {
  ProductionDiscoverySection,
  loadProductionDiscoveryReport,
} from "./ProductionDiscoverySection";

export const dynamic = "force-dynamic";

type KeywordRow = {
  keyword: string;
  category: string | null;
  archetype: string | null;
  family: string | null;
  archetypeFit: number;
  searchVolume: number | null;
  cpc: number | null;
  commercialIntent: number;
  prospectingValue: number;
  preGateClass: string;
  preGateAccepted: boolean;
  advertisersSampled: number;
  brandsSpecialists: number;
  retailers: number;
  comparison: number;
  marketplaces: number;
  prospectSerpQuality: number;
  status: string;
  stopReason: string | null;
  previousIntent: string | null;
  wouldRunDiscovery: boolean;
  exampleAdvertisers: string[];
};

type DomainRow = {
  domain: string;
  previousBusinessType: string | null;
  previousEligibility: string | null;
  prospectClass: string;
  eligible: boolean;
  reason: string | null;
  evidence: string[];
  categorySpread: number;
  keywordSpread: number;
  previouslyPrequalified: boolean;
};

type BranchRow = {
  id: string;
  label: string;
  enabled: boolean;
  keywordCategory: string;
  budgetShare: number;
  families: Array<{ id: string; label: string; seeds: string[] }>;
  keywordsInRun: number;
  keywordsApproved: number;
  advertisersSampled: number;
  specialistsFound: number;
  specialistYield: number;
  spend: number;
  costPerPrequalifiedProspect: number | null;
  notes: string;
};

type HardeningReport = {
  generatedAt: string;
  archetypeVersion: string;
  costs: { dataforseo: number; anthropic: number };
  summary: {
    rawDomains: number;
    prospectEligible: number;
    excluded: number;
    excludedTooLatePreviously: number;
    keywordsAnalyzed: number;
    keywordsApprovedUnderNewLogic: number;
    keywordsRejectedUnderNewLogic: number;
    specialistYieldPercent: number;
  };
  costReview: {
    serpCostPerKeyword: number;
    totalSerpCost: number;
    wastedSerpCost: number;
    wastedSharePercent: number;
    costPerUsefulProspect: number | null;
  };
  branches: { budgetShares: Record<string, number>; stats: BranchRow[] };
  categories: Array<{
    category: string;
    keywords: number;
    advertisers: number;
    specialists: number;
    specialistYield: number;
    approvedUnderNewLogic: number;
    spend: number;
  }>;
  keywords: KeywordRow[];
  domains: DomainRow[];
  rootCause: Array<{
    domain: string;
    producedByKeywords: string[];
    previousBusinessType: string | null;
    previousEligibility: string | null;
    newProspectClass: string;
    newReason: string | null;
    newEvidence: string[];
    keywordsNowBlocked: number;
    keywordsTotal: number;
  }>;
  regression: {
    total: number;
    passed: number;
    failed: number;
    results: Array<{
      domain: string;
      expectEligible: boolean;
      expectReason: string | null;
      actualEligible: boolean;
      actualReason: string | null;
      prospectClass: string;
      pass: boolean;
    }>;
  };
};

async function loadReport(): Promise<HardeningReport | null> {
  const reportPath = path.resolve(
    process.cwd(),
    "src/preview/concepts/data/prospect-hardening-report.json"
  );
  try {
    return JSON.parse(await readFile(reportPath, "utf8")) as HardeningReport;
  } catch {
    return null;
  }
}

function statusTone(status: string): "success" | "warn" | "danger" | "neutral" {
  if (status === "APPROVED") return "success";
  if (status === "LOW_SPECIALIST_YIELD" || status === "NO_SAMPLE") return "warn";
  return "danger";
}

export default async function ProspectQualityPage() {
  const [report, calibration, production] = await Promise.all([
    loadReport(),
    loadCalibrationReport(),
    loadProductionDiscoveryReport(),
  ]);

  if (!report) {
    if (calibration || production) {
      return (
        <AppShell activePath="/concepts/prospect-quality">
          <div className="space-y-8 p-6 lg:p-10">
            {production && <ProductionDiscoverySection report={production} />}
            {calibration && <CalibrationSection report={calibration} />}
          </div>
        </AppShell>
      );
    }

    return (
      <AppShell activePath="/concepts/prospect-quality">
        <div className="space-y-6 p-6 lg:p-10">
          <SectionTitle
            eyebrow="M9.3.1"
            title="Prospect quality"
            description="Reclassificatie van de bestaande discovery-run. Geen nieuwe API-calls."
          />
          <div className="rounded-2xl border border-mm-border bg-white p-8 text-sm text-slate-600">
            Geen rapport gevonden. Draai eerst{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5">npm run prospects:harden</code>.
          </div>
        </div>
      </AppShell>
    );
  }

  const { summary, costReview, regression } = report;
  const enabledBranches = report.branches.stats.filter((b) => b.enabled);
  const disabledBranches = report.branches.stats.filter((b) => !b.enabled);

  return (
    <AppShell activePath="/concepts/prospect-quality">
      <div className="space-y-8 p-6 lg:p-10">
        {production && <ProductionDiscoverySection report={production} />}
        {calibration && <CalibrationSection report={calibration} />}

        <div>
          <SectionTitle
            eyebrow="M9.3.1"
            title="Prospect quality & keyword gates"
          />
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            Hier zie je waarom discovery goede of slechte bedrijven vindt. Een keyword met hoge
            zoekvolume en CPC kan alsnog waardeloos zijn voor prospecting wanneer het advertentie
            landschap uit ketens en vergelijkers bestaat.
          </p>
          <p className="mt-2 text-xs text-slate-500">
            {report.archetypeVersion} · gereclassificeerd op{" "}
            {new Date(report.generatedAt).toLocaleString("nl-NL")} · DataForSEO $
            {report.costs.dataforseo.toFixed(2)} · Anthropic ${report.costs.anthropic.toFixed(2)}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-mm-border bg-white p-5">
            <p className="text-xs font-semibold uppercase text-slate-500">Raw domains</p>
            <p className="mt-2 text-2xl font-bold">{summary.rawDomains}</p>
            <p className="text-xs text-slate-500">ruwe advertentie-intelligentie</p>
          </div>
          <div className="rounded-2xl border border-mm-border bg-white p-5">
            <p className="text-xs font-semibold uppercase text-slate-500">Prospect eligible</p>
            <p className="mt-2 text-2xl font-bold text-emerald-700">{summary.prospectEligible}</p>
            <p className="text-xs text-slate-500">
              specialist yield {summary.specialistYieldPercent}%
            </p>
          </div>
          <div className="rounded-2xl border border-mm-border bg-white p-5">
            <p className="text-xs font-semibold uppercase text-slate-500">Direct uitgesloten</p>
            <p className="mt-2 text-2xl font-bold text-rose-700">{summary.excluded}</p>
            <p className="text-xs text-slate-500">
              {summary.excludedTooLatePreviously} gingen eerder te ver door de pipeline
            </p>
          </div>
          <div className="rounded-2xl border border-mm-border bg-white p-5">
            <p className="text-xs font-semibold uppercase text-slate-500">Verspilde SERP-kosten</p>
            <p className="mt-2 text-2xl font-bold">${costReview.wastedSerpCost.toFixed(3)}</p>
            <p className="text-xs text-slate-500">
              {costReview.wastedSharePercent}% van de keywords zou nu stoppen
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-mm-border bg-white">
          <div className="flex items-center justify-between border-b border-mm-border px-5 py-4">
            <h2 className="text-sm font-bold">Keyword quality</h2>
            <p className="text-xs text-slate-500">
              {summary.keywordsApprovedUnderNewLogic} van {summary.keywordsAnalyzed} keywords zou nu
              discovery krijgen
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-3 py-2">Keyword</th>
                  <th className="px-3 py-2">Archetype</th>
                  <th className="px-3 py-2">Vol</th>
                  <th className="px-3 py-2">CPC</th>
                  <th className="px-3 py-2">Intent</th>
                  <th className="px-3 py-2">Prospect value</th>
                  <th className="px-3 py-2">Sampled</th>
                  <th className="px-3 py-2">Merk/spec</th>
                  <th className="px-3 py-2">Retail</th>
                  <th className="px-3 py-2">Vergelijk</th>
                  <th className="px-3 py-2">SERP quality</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {report.keywords.map((row) => (
                  <tr key={row.keyword} className="border-t border-mm-border align-top">
                    <td className="px-3 py-2">
                      <span className="font-semibold">{row.keyword}</span>
                      {row.stopReason && (
                        <span className="block text-xs text-slate-500">{row.stopReason}</span>
                      )}
                      {row.exampleAdvertisers.length > 0 && (
                        <span className="block text-[11px] text-slate-400">
                          {row.exampleAdvertisers.join(", ")}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-xs">
                      {row.archetype ?? <span className="text-slate-400">geen match</span>}
                      {row.family && <span className="block text-slate-400">{row.family}</span>}
                      <span className="block text-slate-400">fit {row.archetypeFit}</span>
                    </td>
                    <td className="px-3 py-2 font-mono text-xs">{row.searchVolume ?? "—"}</td>
                    <td className="px-3 py-2 font-mono text-xs">
                      {row.cpc === null ? "—" : row.cpc.toFixed(2)}
                    </td>
                    <td className="px-3 py-2 font-mono text-xs">{row.commercialIntent}</td>
                    <td className="px-3 py-2 font-mono text-xs font-bold">{row.prospectingValue}</td>
                    <td className="px-3 py-2 font-mono text-xs">{row.advertisersSampled}</td>
                    <td className="px-3 py-2 font-mono text-xs text-emerald-700">
                      {row.brandsSpecialists}
                    </td>
                    <td className="px-3 py-2 font-mono text-xs text-rose-700">{row.retailers}</td>
                    <td className="px-3 py-2 font-mono text-xs text-rose-700">{row.comparison}</td>
                    <td className="px-3 py-2 font-mono text-xs">{row.prospectSerpQuality}</td>
                    <td className="px-3 py-2">
                      <Badge tone={statusTone(row.status)}>{row.status}</Badge>
                      {!row.preGateAccepted && (
                        <span className="mt-1 block text-[11px] text-slate-500">
                          {row.preGateClass}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-mm-border bg-white">
          <div className="border-b border-mm-border px-5 py-4">
            <h2 className="text-sm font-bold">Branch controls</h2>
            <p className="text-xs text-slate-500">
              Product archetypes bepalen waar discovery mag zoeken. Aanpassen in{" "}
              <code className="rounded bg-slate-100 px-1 py-0.5">
                src/config/idealProductArchetypes.ts
              </code>
              .
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-3 py-2">Branch</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Budget</th>
                  <th className="px-3 py-2">Product families</th>
                  <th className="px-3 py-2">Keywords</th>
                  <th className="px-3 py-2">Specialists</th>
                  <th className="px-3 py-2">Yield</th>
                  <th className="px-3 py-2">Kosten/prospect</th>
                </tr>
              </thead>
              <tbody>
                {[...enabledBranches, ...disabledBranches].map((branch) => (
                  <tr key={branch.id} className="border-t border-mm-border align-top">
                    <td className="px-3 py-2">
                      <span className="font-semibold">{branch.label}</span>
                      <span className="block text-xs text-slate-500">{branch.notes}</span>
                    </td>
                    <td className="px-3 py-2">
                      <Badge tone={branch.enabled ? "success" : "neutral"}>
                        {branch.enabled ? "AAN" : "UIT"}
                      </Badge>
                    </td>
                    <td className="px-3 py-2 font-mono text-xs">
                      {branch.enabled
                        ? `${Math.round((report.branches.budgetShares[branch.id] ?? 0) * 100)}%`
                        : "—"}
                    </td>
                    <td className="px-3 py-2 text-xs">
                      {branch.families.map((f) => (
                        <span key={f.id} className="block">
                          {f.label}
                          <span className="block text-slate-400">{f.seeds.join(" · ")}</span>
                        </span>
                      ))}
                    </td>
                    <td className="px-3 py-2 font-mono text-xs">
                      {branch.keywordsApproved}/{branch.keywordsInRun}
                    </td>
                    <td className="px-3 py-2 font-mono text-xs">{branch.specialistsFound}</td>
                    <td className="px-3 py-2 font-mono text-xs">{branch.specialistYield}%</td>
                    <td className="px-3 py-2 font-mono text-xs">
                      {branch.costPerPrequalifiedProspect === null
                        ? "—"
                        : `$${branch.costPerPrequalifiedProspect.toFixed(3)}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-mm-border bg-white">
          <div className="border-b border-mm-border px-5 py-4">
            <h2 className="text-sm font-bold">Root cause · welke keywords brachten ketens binnen</h2>
          </div>
          <div className="divide-y divide-mm-border">
            {report.rootCause.map((entry) => (
              <div key={entry.domain} className="px-5 py-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold">{entry.domain}</span>
                  <Badge tone="danger">{entry.newProspectClass}</Badge>
                  <span className="text-xs text-slate-500">
                    was {entry.previousBusinessType ?? "onbekend"} ·{" "}
                    {entry.previousEligibility ?? "geen status"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-600">
                  Nieuwe reden: {entry.newReason ?? "geen"} · {entry.newEvidence.join(" · ")}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Kwam binnen via {entry.keywordsTotal} keywords, waarvan{" "}
                  {entry.keywordsNowBlocked} nu geblokkeerd: {entry.producedByKeywords.join(", ")}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-mm-border bg-white">
            <div className="border-b border-mm-border px-5 py-4">
              <h2 className="text-sm font-bold">Exclusion funnel</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-3 py-2">Domein</th>
                    <th className="px-3 py-2">Klasse</th>
                    <th className="px-3 py-2">Reden</th>
                    <th className="px-3 py-2">Spread</th>
                  </tr>
                </thead>
                <tbody>
                  {report.domains
                    .filter((d) => !d.eligible)
                    .map((d) => (
                      <tr key={d.domain} className="border-t border-mm-border">
                        <td className="px-3 py-2">
                          {d.domain}
                          {d.previouslyPrequalified && (
                            <Badge tone="warn">was prequalified</Badge>
                          )}
                        </td>
                        <td className="px-3 py-2 text-xs">{d.prospectClass}</td>
                        <td className="px-3 py-2 text-xs">{d.reason}</td>
                        <td className="px-3 py-2 font-mono text-xs">
                          {d.categorySpread}c / {d.keywordSpread}k
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-mm-border bg-white">
            <div className="flex items-center justify-between border-b border-mm-border px-5 py-4">
              <h2 className="text-sm font-bold">Classifier regression</h2>
              <Badge tone={regression.failed === 0 ? "success" : "danger"}>
                {regression.passed}/{regression.total}
              </Badge>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-3 py-2">Domein</th>
                    <th className="px-3 py-2">Verwacht</th>
                    <th className="px-3 py-2">Resultaat</th>
                    <th className="px-3 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {regression.results.map((r) => (
                    <tr key={r.domain} className="border-t border-mm-border">
                      <td className="px-3 py-2">{r.domain}</td>
                      <td className="px-3 py-2 text-xs">
                        {r.expectEligible ? "prospect" : (r.expectReason ?? "excluded")}
                      </td>
                      <td className="px-3 py-2 text-xs">
                        {r.actualEligible ? r.prospectClass : (r.actualReason ?? "excluded")}
                      </td>
                      <td className="px-3 py-2">
                        <Badge tone={r.pass ? "success" : "danger"}>{r.pass ? "ok" : "fail"}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-mm-border bg-white p-5 text-sm text-slate-600">
          <h2 className="text-sm font-bold text-slate-900">Waar kijk je verder</h2>
          <p className="mt-2">
            <Link href="/discovery" className="font-semibold text-[#C2410C] hover:underline">
              Google Discovery
            </Link>{" "}
            toont ruwe advertentie-intelligentie inclusief ketens, puur voor debugging.{" "}
            <Link
              href="/concepts/ideal-prospects"
              className="font-semibold text-[#C2410C] hover:underline"
            >
              Ideal prospects
            </Link>{" "}
            toont uitsluitend domeinen die door de centrale prospect gate komen.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
