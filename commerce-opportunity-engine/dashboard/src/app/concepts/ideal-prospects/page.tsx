import { readFile } from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { Badge, EmptyValue, SectionTitle } from "@/components/ui";

export const dynamic = "force-dynamic";

type TrueSalesRow = {
  domain: string;
  conceptId: string;
  category: string | null;
  platform: string | null;
  commerceModel: string;
  catalogFocus: number | null;
  catalogSize: number | null;
  heroProduct: string | null;
  productPrice: number | null;
  adsStatus: string;
  currentPdpQuality: number | null;
  transformation: number | null;
  assetReadiness: number | null;
  deepDiveFit: number;
  economicFit: number;
  salesFit: number;
  scoreConfidence: number;
  croDataSource: string;
  engineeringFixture: boolean;
  contrastGatePass: boolean;
  idealPreScore: number | null;
  source: string;
};

type IdealReport = {
  generatedAt: string;
  costs: {
    dataforseo: number;
    anthropic: number;
  };
  trueSalesRanking: {
    top10: TrueSalesRow[];
    designTarget: {
      recommended: TrueSalesRow | null;
      why: string[];
      note: string;
    };
  };
  prequalification?: {
    top20: Array<{
      domain: string;
      preScore: number;
      pdpWeakness: number;
    }>;
  };
};

async function loadReport(): Promise<IdealReport | null> {
  const reportPath = path.resolve(
    process.cwd(),
    "src/preview/concepts/data/ideal-prospect-report.json"
  );
  try {
    const raw = await readFile(reportPath, "utf8");
    return JSON.parse(raw) as IdealReport;
  } catch {
    return null;
  }
}

/**
 * The central prospect gate decides what may appear here. Domains that the
 * hardening run rejected never reach this screen, so no one mistakes a keten
 * for a prospect.
 */
async function loadGateBlockedDomains(): Promise<Set<string>> {
  const reportPath = path.resolve(
    process.cwd(),
    "src/preview/concepts/data/prospect-hardening-report.json"
  );
  try {
    const raw = await readFile(reportPath, "utf8");
    const parsed = JSON.parse(raw) as {
      domains?: Array<{ domain: string; eligible: boolean }>;
    };
    return new Set(
      (parsed.domains ?? [])
        .filter((d) => !d.eligible)
        .map((d) => d.domain.toLowerCase())
    );
  } catch {
    return new Set();
  }
}

export default async function IdealProspectsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const shopify = sp.shopify === "1";
  const ownBrand = sp.ownBrand === "1";
  const pdpLt60 = sp.pdpLt60 === "1";
  const transform70 = sp.transform70 === "1";
  const deepDive70 = sp.deepDive70 === "1";
  const sales75 = sp.sales75 === "1";
  const newOnly = sp.new === "1";

  const [report, gateBlocked] = await Promise.all([loadReport(), loadGateBlockedDomains()]);
  const allRows = report?.trueSalesRanking?.top10 ?? [];
  const gateFiltered = allRows.filter((r) => !gateBlocked.has(r.domain.toLowerCase()));
  const blockedByGate = allRows.length - gateFiltered.length;
  let rows = gateFiltered;

  if (shopify) rows = rows.filter((r) => r.platform === "SHOPIFY");
  if (ownBrand)
    rows = rows.filter((r) =>
      ["DTC_OWN_BRAND", "MOSTLY_OWN_BRAND"].includes(r.commerceModel)
    );
  if (pdpLt60)
    rows = rows.filter((r) => (r.currentPdpQuality ?? 100) < 60);
  if (transform70)
    rows = rows.filter((r) => (r.transformation ?? 0) >= 70);
  if (deepDive70) rows = rows.filter((r) => r.deepDiveFit >= 70);
  if (sales75) rows = rows.filter((r) => r.salesFit >= 75);
  if (newOnly) rows = rows.filter((r) => r.source === "M93_NEW");

  const filterHref = (params: Record<string, string | undefined>) => {
    const q = new URLSearchParams();
    if (shopify) q.set("shopify", "1");
    if (ownBrand) q.set("ownBrand", "1");
    if (pdpLt60) q.set("pdpLt60", "1");
    if (transform70) q.set("transform70", "1");
    if (deepDive70) q.set("deepDive70", "1");
    if (sales75) q.set("sales75", "1");
    if (newOnly) q.set("new", "1");
    for (const [k, v] of Object.entries(params)) {
      if (v) q.set(k, v);
      else q.delete(k);
    }
    const s = q.toString();
    return s ? `?${s}` : "";
  };

  return (
    <AppShell activePath="/concepts/ideal-prospects">
      <div className="space-y-8 p-6 lg:p-10">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
          <Badge tone="success">Prospect discovery</Badge>
          <p className="mt-2 text-sm text-emerald-900">
            Alleen domeinen die door de centrale prospect gate komen. Ketens, marketplaces en
            vergelijkers worden hier nooit getoond
            {blockedByGate > 0 ? `, ${blockedByGate} rij(en) uit deze ranking geblokkeerd` : ""}. Het
            ruwe advertentielandschap staat op{" "}
            <Link href="/discovery" className="font-semibold underline">
              Google Discovery (raw)
            </Link>
            , de keyword-verklaring op{" "}
            <Link href="/concepts/prospect-quality" className="font-semibold underline">
              Prospect quality
            </Link>
            .
          </p>
        </div>

        <div>
          <SectionTitle eyebrow="M9.3" title="Ideal prospects" />
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            Profile-aware discovery voor concept-first premium PDP redesign. TRUE
            SALES ranking combineert bestaande + nieuwe geaudite pool. Geen preview
            automatisch gebouwd.
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Run:{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5">
              npm run discover:ideal-prospects
            </code>
          </p>
        </div>

        {!report ? (
          <div className="rounded-2xl border border-mm-border bg-white p-8 text-sm text-slate-600">
            Geen rapport. Voer eerst{" "}
            <code>npm run discover:ideal-prospects</code> uit.
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-mm-border bg-white p-5">
                <p className="text-xs font-semibold uppercase text-slate-500">
                  DataForSEO
                </p>
                <p className="mt-2 text-2xl font-bold">
                  ${report.costs.dataforseo.toFixed(3)}
                </p>
              </div>
              <div className="rounded-2xl border border-mm-border bg-white p-5">
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Anthropic
                </p>
                <p className="mt-2 text-2xl font-bold">
                  ${report.costs.anthropic.toFixed(3)}
                </p>
              </div>
              <div className="rounded-2xl border border-mm-border bg-white p-5">
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Design target
                </p>
                <p className="mt-2 text-lg font-bold">
                  {report.trueSalesRanking.designTarget.recommended?.domain ??
                    "—"}
                </p>
                <p className="text-xs text-slate-500">
                  {report.trueSalesRanking.designTarget.note}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href={filterHref({ shopify: shopify ? undefined : "1" })}
                className={`rounded-full px-3 py-1 text-xs font-bold ${shopify ? "bg-[#FF5722] text-white" : "border border-mm-border bg-white"}`}
              >
                Shopify
              </Link>
              <Link
                href={filterHref({ ownBrand: ownBrand ? undefined : "1" })}
                className={`rounded-full px-3 py-1 text-xs font-bold ${ownBrand ? "bg-[#FF5722] text-white" : "border border-mm-border bg-white"}`}
              >
                Own brand
              </Link>
              <Link
                href={filterHref({ new: newOnly ? undefined : "1" })}
                className={`rounded-full px-3 py-1 text-xs font-bold ${newOnly ? "bg-[#FF5722] text-white" : "border border-mm-border bg-white"}`}
              >
                NEW
              </Link>
              <Link
                href={filterHref({ pdpLt60: pdpLt60 ? undefined : "1" })}
                className={`rounded-full px-3 py-1 text-xs font-bold ${pdpLt60 ? "bg-[#FF5722] text-white" : "border border-mm-border bg-white"}`}
              >
                PDP &lt; 60
              </Link>
              <Link
                href={filterHref({ transform70: transform70 ? undefined : "1" })}
                className={`rounded-full px-3 py-1 text-xs font-bold ${transform70 ? "bg-[#FF5722] text-white" : "border border-mm-border bg-white"}`}
              >
                Transform 70+
              </Link>
              <Link
                href={filterHref({ deepDive70: deepDive70 ? undefined : "1" })}
                className={`rounded-full px-3 py-1 text-xs font-bold ${deepDive70 ? "bg-[#FF5722] text-white" : "border border-mm-border bg-white"}`}
              >
                Deep dive 70+
              </Link>
              <Link
                href={filterHref({ sales75: sales75 ? undefined : "1" })}
                className={`rounded-full px-3 py-1 text-xs font-bold ${sales75 ? "bg-[#FF5722] text-white" : "border border-mm-border bg-white"}`}
              >
                Sales fit 75+
              </Link>
            </div>

            <div className="overflow-hidden rounded-2xl border border-mm-border bg-white">
              <div className="border-b border-mm-border px-5 py-4">
                <h2 className="text-sm font-bold">TRUE SALES ranking</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-3 py-2">Brand</th>
                      <th className="px-3 py-2">Sales</th>
                      <th className="px-3 py-2">PDP</th>
                      <th className="px-3 py-2">Transform</th>
                      <th className="px-3 py-2">Assets</th>
                      <th className="px-3 py-2">Deep dive</th>
                      <th className="px-3 py-2">Economic</th>
                      <th className="px-3 py-2">CRO</th>
                      <th className="px-3 py-2">Gate</th>
                      <th className="px-3 py-2">Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.conceptId} className="border-t border-mm-border">
                        <td className="px-3 py-2">
                          <Link
                            href={`/concepts/${row.conceptId}`}
                            className="font-semibold text-[#C2410C] hover:underline"
                          >
                            {row.domain}
                          </Link>
                          {row.engineeringFixture && (
                            <Badge tone="neutral">ENGINEERING</Badge>
                          )}
                        </td>
                        <td className="px-3 py-2 font-mono">{row.salesFit}</td>
                        <td className="px-3 py-2">
                          {row.currentPdpQuality ?? <EmptyValue />}
                        </td>
                        <td className="px-3 py-2">
                          {row.transformation ?? <EmptyValue />}
                        </td>
                        <td className="px-3 py-2">
                          {row.assetReadiness ?? <EmptyValue />}
                        </td>
                        <td className="px-3 py-2">{row.deepDiveFit}</td>
                        <td className="px-3 py-2">{row.economicFit}</td>
                        <td className="px-3 py-2">
                          <Badge
                            tone={
                              row.croDataSource === "AUDITED" ? "success" : "warn"
                            }
                          >
                            {row.croDataSource}
                          </Badge>
                        </td>
                        <td className="px-3 py-2">
                          <Badge
                            tone={row.contrastGatePass ? "success" : "warn"}
                          >
                            {row.contrastGatePass ? "pass" : "fail"}
                          </Badge>
                        </td>
                        <td className="px-3 py-2 text-xs">{row.source}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {report.trueSalesRanking.designTarget.why.length > 0 && (
              <div className="rounded-2xl border border-mm-border bg-white p-5">
                <h2 className="text-sm font-bold">Design target rationale</h2>
                <ul className="mt-2 space-y-1 text-sm text-slate-700">
                  {report.trueSalesRanking.designTarget.why.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}
