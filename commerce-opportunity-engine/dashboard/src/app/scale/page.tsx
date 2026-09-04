import { AppShell } from "@/components/AppShell";
import {
  Badge,
  EmptyValue,
  Panel,
  SectionTitle,
  StatCard,
} from "@/components/ui";
import { formatDate } from "@/lib/format";
import {
  getCategoryProspectYield,
  getLatestControlledScaleRun,
} from "@/lib/queries";
import type {
  CategoryProspectYieldRow,
  ControlledScaleBestProspect,
  ControlledScaleCategoryStat,
  ControlledScaleFunnel,
  ControlledScaleRunRow,
  PrequalifiedProspectRow,
} from "@/lib/types";

export const dynamic = "force-dynamic";

const FUNNEL_STEPS: Array<{
  key: keyof ControlledScaleFunnel;
  label: string;
}> = [
  { key: "keywords", label: "Keywords" },
  { key: "placements", label: "Placements" },
  { key: "uniqueDomains", label: "Domains" },
  { key: "ecommerce", label: "Ecommerce" },
  { key: "brandSpecialist", label: "Brand/Specialist" },
  { key: "prequalified", label: "Prequalified" },
  { key: "shopify", label: "Shopify" },
  { key: "transparencyChecked", label: "Transparency" },
  { key: "confirmedAdvertisers", label: "Confirmed" },
  { key: "targetResolutionChecked", label: "Targets" },
  { key: "exactPaidFunnels", label: "Exact paid" },
  { key: "highConfidenceTargets", label: "High confidence" },
  { key: "croReadyShortlist", label: "CRO ready" },
];

function formatUsd(value: number | null | undefined) {
  if (value === null || value === undefined) return null;
  return `$${Number(value).toFixed(4)}`;
}

function numOrNull(value: number | null | undefined): number | null {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return null;
  }
  return Number(value);
}

function categoryRowsFromStats(
  stats: Record<string, ControlledScaleCategoryStat> | null | undefined
): CategoryProspectYieldRow[] {
  if (!stats) return [];
  return Object.entries(stats)
    .map(([category_id, row]) => ({
      category_id,
      keywords_scanned: numOrNull(row.keywordsScanned),
      serp_cost: numOrNull(row.serpCost),
      domains_found: numOrNull(row.domainsFound),
      specialists_brands: numOrNull(row.specialistsBrands),
      prequalified: numOrNull(row.prequalified),
      shopify: numOrNull(row.shopify),
      confirmed_advertisers: numOrNull(row.confirmedAdvertisers),
      paid_targets: null,
      category_prospect_yield_score: numOrNull(row.categoryProspectYieldScore),
      last_run_id: null,
      updated_at: null,
    }))
    .sort(
      (a, b) =>
        (b.category_prospect_yield_score ?? -1) -
        (a.category_prospect_yield_score ?? -1)
    );
}

function FunnelValue({ value }: { value: number | null | undefined }) {
  if (value === null || value === undefined) {
    return <EmptyValue label="—" />;
  }
  return <>{value}</>;
}

function ProspectCard({ prospect }: { prospect: ControlledScaleBestProspect }) {
  const sources = (prospect.sourceKeywords ?? [])
    .map((s) => s?.keyword)
    .filter((k): k is string => Boolean(k))
    .slice(0, 3);

  return (
    <div className="rounded-xl border border-mm-border bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-extrabold text-slate-900">
            {prospect.domain ? (
              prospect.domain
            ) : (
              <EmptyValue label="—" />
            )}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {prospect.category ? (
              prospect.category
            ) : (
              <EmptyValue label="—" />
            )}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
            Pre-fit
          </p>
          <p className="text-lg font-extrabold tabular-nums text-[#C2410C]">
            {prospect.preFit !== null && prospect.preFit !== undefined ? (
              prospect.preFit
            ) : (
              <EmptyValue label="—" />
            )}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {prospect.businessType ? (
          <Badge tone="sky">{prospect.businessType}</Badge>
        ) : (
          <EmptyValue label="—" />
        )}
        {prospect.platform ? (
          <Badge tone="neutral">{prospect.platform}</Badge>
        ) : null}
        {prospect.shopify ? <Badge tone="brand">Shopify</Badge> : null}
        {prospect.leadEligible ? (
          <Badge tone="success">Lead eligible</Badge>
        ) : null}
        {prospect.transparencyStatus ? (
          <Badge
            tone={
              prospect.transparencyStatus === "CONFIRMED" ? "success" : "warn"
            }
          >
            {prospect.transparencyStatus}
          </Badge>
        ) : null}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
        <p>
          Maturity{" "}
          <span className="font-bold text-slate-800">
            {prospect.maturity !== null && prospect.maturity !== undefined ? (
              prospect.maturity
            ) : (
              <EmptyValue label="—" />
            )}
          </span>
        </p>
        <p>
          Retailer scale{" "}
          <span className="font-bold text-slate-800">
            {prospect.retailerScale !== null &&
            prospect.retailerScale !== undefined ? (
              prospect.retailerScale
            ) : (
              <EmptyValue label="—" />
            )}
          </span>
        </p>
      </div>

      {sources.length > 0 ? (
        <p className="mt-3 text-[11px] text-slate-500">
          Via {sources.join(", ")}
        </p>
      ) : (
        <p className="mt-3 text-[11px] text-slate-400">
          <EmptyValue label="—" />
        </p>
      )}
    </div>
  );
}

export default async function ScalePage() {
  let run: ControlledScaleRunRow | null = null;
  let yieldRows: CategoryProspectYieldRow[] = [];
  let loadError: string | null = null;

  try {
    const [latest, yields] = await Promise.all([
      getLatestControlledScaleRun(),
      getCategoryProspectYield(),
    ]);
    run = latest;
    yieldRows = yields;
  } catch (err) {
    loadError =
      err instanceof Error ? err.message : "Kon Controlled Scale niet laden";
  }

  const categoryRows =
    yieldRows.length > 0
      ? yieldRows
      : categoryRowsFromStats(run?.category_stats ?? null);

  const prospects = (run?.best_prospects ?? []).slice(0, 15);
  const funnel = run?.funnel ?? null;
  const dfsCost = formatUsd(run?.dataforseo_cost);
  const anthCost = formatUsd(run?.anthropic_cost);
  const m721 =
    run?.noise_report &&
    typeof run.noise_report === "object" &&
    "m721" in run.noise_report
      ? (run.noise_report.m721 as {
          prequalifiedProspects?: PrequalifiedProspectRow[];
        })
      : null;
  const prequalifiedRows = (m721?.prequalifiedProspects ?? []).slice(0, 40);

  return (
    <AppShell activePath="/scale">
      <SectionTitle
        eyebrow="Controlled Scale · Milestone 7.2.1"
        title="Prequalified pipeline onder budgetcontrole"
        description="Unieke funnel-metrics, category relevance cleanup, en selectieve Ads/target verification zonder nieuwe SERP of CRO."
      />

      {loadError ? (
        <p className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {loadError}
        </p>
      ) : null}

      <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Run status"
          value={run?.status ?? "Geen run"}
          hint={
            run?.completed_at
              ? `Completed ${formatDate(run.completed_at)}`
              : "Nog geen completed controlled_scale_runs"
          }
        />
        <StatCard
          label="DataForSEO"
          value={dfsCost ?? "—"}
          hint="Laatste completed run"
        />
        <StatCard
          label="Anthropic"
          value={anthCost ?? "—"}
          hint="Laatste completed run"
        />
        <StatCard
          label="Best prospects"
          value={prospects.length}
          hint="Max 15 uit best_prospects"
        />
      </div>

      <div className="mb-8 overflow-x-auto rounded-2xl border border-[#FF5722]/25 bg-gradient-to-br from-white to-[#FF5722]/5 p-5 shadow-mm-card">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF5722]">
          Controlled Scale Funnel
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Unique domains per stap. Ads checks alleen voor top prequalified.
        </p>
        <div className="mt-4 flex min-w-[1100px] items-end gap-2">
          {FUNNEL_STEPS.map((step, index) => {
            const value = funnel ? numOrNull(funnel[step.key] as number) : null;
            return (
              <div key={step.key} className="flex flex-1 items-end gap-2">
                <div className="flex-1 rounded-xl border border-white/80 bg-white/90 px-2.5 py-3 text-center shadow-sm">
                  <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400">
                    {step.label}
                  </p>
                  <p className="mt-1 text-xl font-extrabold tabular-nums text-slate-900 sm:text-2xl">
                    <FunnelValue value={value} />
                  </p>
                </div>
                {index < FUNNEL_STEPS.length - 1 ? (
                  <span
                    className="mb-5 shrink-0 text-lg font-bold text-[#FF5722]/50"
                    aria-hidden
                  >
                    →
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mb-8 grid gap-4 lg:grid-cols-2">
        <Panel title="Costs summary">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-mm-surface px-4 py-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                DataForSEO
              </p>
              <p className="mt-2 text-2xl font-extrabold tabular-nums text-slate-900">
                {dfsCost ?? <EmptyValue label="—" />}
              </p>
            </div>
            <div className="rounded-xl bg-mm-surface px-4 py-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Anthropic
              </p>
              <p className="mt-2 text-2xl font-extrabold tabular-nums text-slate-900">
                {anthCost ?? <EmptyValue label="—" />}
              </p>
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-600">
            Budget blijft hard begrensd. Scale alleen als yield en funnel meewerken.
          </p>
        </Panel>

        <Panel title="Noise snapshot">
          {run?.noise_report ? (
            <div className="grid gap-3 sm:grid-cols-3">
              {(
                [
                  ["retailers", "Retailers"],
                  ["comparison", "Comparison"],
                  ["marketplaces", "Marketplaces"],
                ] as const
              ).map(([key, label]) => {
                const list = run?.noise_report?.[key];
                const count = Array.isArray(list) ? list.length : null;
                return (
                  <div
                    key={key}
                    className="rounded-xl border border-mm-border bg-white px-3 py-3 text-center"
                  >
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                      {label}
                    </p>
                    <p className="mt-1 text-xl font-extrabold tabular-nums text-slate-900">
                      {count !== null ? count : <EmptyValue label="—" />}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyValue label="—" />
          )}
        </Panel>
      </div>

      <div className="mb-8 overflow-x-auto rounded-2xl border border-mm-border bg-white shadow-mm-card">
        <div className="border-b border-mm-border px-5 py-4">
          <h3 className="text-sm font-extrabold tracking-tight text-slate-900">
            Category Performance
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            {yieldRows.length > 0
              ? "UNIQUE domains per category (M7.2.1 fix)"
              : "Fallback uit run.category_stats"}
          </p>
        </div>
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-mm-surface text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
            <tr>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Keywords</th>
              <th className="px-4 py-3">Domains</th>
              <th className="px-4 py-3">Specialists</th>
              <th className="px-4 py-3">Prequalified</th>
              <th className="px-4 py-3">Shopify</th>
              <th className="px-4 py-3">Confirmed</th>
              <th className="px-4 py-3">SERP cost</th>
              <th className="px-4 py-3">Yield score</th>
            </tr>
          </thead>
          <tbody>
            {categoryRows.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-10 text-center text-slate-500"
                >
                  <EmptyValue label="—" />
                </td>
              </tr>
            ) : (
              categoryRows.map((row) => (
                <tr
                  key={row.category_id}
                  className="border-t border-slate-100 hover:bg-mm-sky-subtle/40"
                >
                  <td className="px-4 py-3 font-bold text-slate-900">
                    {row.category_id}
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    {row.keywords_scanned !== null &&
                    row.keywords_scanned !== undefined ? (
                      row.keywords_scanned
                    ) : (
                      <EmptyValue label="—" />
                    )}
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    {row.domains_found !== null &&
                    row.domains_found !== undefined ? (
                      row.domains_found
                    ) : (
                      <EmptyValue label="—" />
                    )}
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    {row.specialists_brands !== null &&
                    row.specialists_brands !== undefined ? (
                      row.specialists_brands
                    ) : (
                      <EmptyValue label="—" />
                    )}
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    {row.prequalified !== null &&
                    row.prequalified !== undefined ? (
                      row.prequalified
                    ) : (
                      <EmptyValue label="—" />
                    )}
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    {row.shopify !== null && row.shopify !== undefined ? (
                      row.shopify
                    ) : (
                      <EmptyValue label="—" />
                    )}
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    {row.confirmed_advertisers !== null &&
                    row.confirmed_advertisers !== undefined ? (
                      row.confirmed_advertisers
                    ) : (
                      <EmptyValue label="—" />
                    )}
                  </td>
                  <td className="px-4 py-3 tabular-nums text-xs">
                    {formatUsd(row.serp_cost) ?? <EmptyValue label="—" />}
                  </td>
                  <td className="px-4 py-3">
                    {row.category_prospect_yield_score !== null &&
                    row.category_prospect_yield_score !== undefined ? (
                      <span className="font-extrabold tabular-nums text-emerald-700">
                        {row.category_prospect_yield_score}
                      </span>
                    ) : (
                      <EmptyValue label="—" />
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mb-8 overflow-x-auto rounded-2xl border border-mm-border bg-white shadow-mm-card">
        <div className="border-b border-mm-border px-5 py-4">
          <h3 className="text-sm font-extrabold tracking-tight text-slate-900">
            Prequalified Prospects
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Gesorteerd op verification priority / pre-fit. Geen CRO-score.
          </p>
        </div>
        <table className="w-full min-w-[1100px] text-left text-sm">
          <thead className="bg-mm-surface text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
            <tr>
              <th className="px-3 py-3">Domain</th>
              <th className="px-3 py-3">Category</th>
              <th className="px-3 py-3">Best keyword</th>
              <th className="px-3 py-3">Platform</th>
              <th className="px-3 py-3">Type</th>
              <th className="px-3 py-3">Maturity</th>
              <th className="px-3 py-3">Retailer</th>
              <th className="px-3 py-3">Pre-fit</th>
              <th className="px-3 py-3">Signals</th>
              <th className="px-3 py-3">Ads</th>
              <th className="px-3 py-3">Targets</th>
            </tr>
          </thead>
          <tbody>
            {prequalifiedRows.length === 0 ? (
              <tr>
                <td colSpan={11} className="px-4 py-10 text-center text-slate-500">
                  <EmptyValue label="—" />
                  <span className="mt-1 block text-xs">
                    Run npm run verify:prequalified om deze tabel te vullen
                  </span>
                </td>
              </tr>
            ) : (
              prequalifiedRows.map((row, i) => (
                <tr
                  key={`${row.domain ?? "d"}-${i}`}
                  className="border-t border-slate-100 hover:bg-mm-sky-subtle/40"
                >
                  <td className="px-3 py-2.5 font-bold text-slate-900">
                    {row.domain ?? <EmptyValue label="—" />}
                  </td>
                  <td className="px-3 py-2.5 text-xs text-slate-600">
                    {row.category ?? <EmptyValue label="—" />}
                  </td>
                  <td className="max-w-[180px] truncate px-3 py-2.5 text-xs text-slate-600">
                    {row.bestSourceKeyword ?? <EmptyValue label="—" />}
                  </td>
                  <td className="px-3 py-2.5">
                    {row.platform ? (
                      <Badge tone="neutral">{row.platform}</Badge>
                    ) : (
                      <EmptyValue label="—" />
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-xs">
                    {row.businessType ?? <EmptyValue label="—" />}
                  </td>
                  <td className="px-3 py-2.5 tabular-nums">
                    {row.maturity ?? <EmptyValue label="—" />}
                  </td>
                  <td className="px-3 py-2.5 tabular-nums">
                    {row.retailerScale ?? <EmptyValue label="—" />}
                  </td>
                  <td className="px-3 py-2.5 font-extrabold tabular-nums text-[#C2410C]">
                    {row.preFit ?? <EmptyValue label="—" />}
                  </td>
                  <td className="px-3 py-2.5 tabular-nums">
                    {row.keywordSignals ?? <EmptyValue label="—" />}
                  </td>
                  <td className="px-3 py-2.5">
                    {row.adsStatus ? (
                      <Badge
                        tone={
                          row.adsStatus === "CONFIRMED" ? "success" : "warn"
                        }
                      >
                        {row.adsStatus}
                      </Badge>
                    ) : (
                      <EmptyValue label="—" />
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-xs">
                    {row.paidTargetStatus ?? <EmptyValue label="—" />}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <section>
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">
              Best Prospects
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Top prequalified domains uit de laatste run (max 15)
            </p>
          </div>
          <Badge tone="brand">{prospects.length} prospects</Badge>
        </div>
        {prospects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-10 text-center text-sm text-slate-500">
            <EmptyValue label="—" />
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {prospects.map((prospect, index) => (
              <ProspectCard
                key={`${prospect.domain ?? "p"}-${index}`}
                prospect={prospect}
              />
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}
