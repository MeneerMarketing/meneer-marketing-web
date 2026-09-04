import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { CategoryCards } from "@/components/CategoryCards";
import { KeywordsOperatorClient } from "@/components/KeywordsOperatorClient";
import { Badge, EmptyValue, SectionTitle, StatCard } from "@/components/ui";
import {
  getDiscoveryFunnelMetrics,
  getKeywordCategories,
  getKeywordCategoryOverview,
  getKeywordIntelligenceList,
  getKeywordIntelligenceSummary,
  getKeywordProspectingQuality,
} from "@/lib/queries";
import type {
  DiscoveryFunnelMetrics,
  KeywordCategoryOverview,
  KeywordCategoryRow,
  KeywordIntelligenceRow,
  KeywordIntelligenceSummary,
  KeywordProspectingQuality,
} from "@/lib/types";

export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function param(sp: Record<string, string | string[] | undefined>, key: string) {
  const value = sp[key];
  return Array.isArray(value) ? value[0] : value;
}

function buildHref(base: Record<string, string | number | undefined>) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(base)) {
    if (value !== undefined && value !== "" && key !== "page") {
      params.set(key, String(value));
    }
  }
  if (base.page && Number(base.page) > 1) {
    params.set("page", String(base.page));
  }
  const qs = params.toString();
  return qs ? `/keywords?${qs}` : "/keywords";
}

function formatUsd(value: number): string {
  return `$${value.toFixed(4)}`;
}

function formatScore(value: number | null | undefined) {
  if (value === null || value === undefined) return null;
  return value;
}

const QUICK_FILTERS = [
  { key: "primary", label: "Primary", value: "true" },
  { key: "secondary", label: "Secondary", value: "true" },
  {
    key: "highProspecting",
    label: "High Prospecting Value",
    value: "true",
  },
  { key: "highYield", label: "High Yield", value: "true" },
  { key: "poorYield", label: "Poor Yield", value: "true" },
  { key: "retailerHeavy", label: "Retailer-heavy", value: "true" },
  { key: "nonBrandedOnly", label: "Non-branded only", value: "true" },
] as const;

const FUNNEL_STEPS: Array<{
  key: keyof DiscoveryFunnelMetrics;
  label: string;
}> = [
  { key: "total", label: "Total" },
  { key: "ecommerce", label: "Ecommerce" },
  { key: "brandOrSpecialist", label: "Brand/Specialist" },
  { key: "generalRetailer", label: "Retailers" },
  { key: "comparisonOrMarketplace", label: "Comparison/Marketplace" },
  { key: "shopify", label: "Shopify" },
  { key: "leadEligible", label: "Lead eligible" },
];

function ProspectingCard({
  row,
  tone,
}: {
  row: KeywordIntelligenceRow;
  tone: "top" | "worst";
}) {
  const score = formatScore(row.prospecting_value_score);
  return (
    <div className="rounded-xl border border-mm-border bg-white p-3 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-bold text-slate-900 line-clamp-2">
          {row.keyword}
        </p>
        <span
          className={`shrink-0 text-sm font-extrabold tabular-nums ${
            tone === "top" ? "text-emerald-700" : "text-rose-700"
          }`}
        >
          {score !== null ? score : <EmptyValue label="—" />}
        </span>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {row.keyword_intent_type ? (
          <Badge tone="sky">{row.keyword_intent_type}</Badge>
        ) : (
          <EmptyValue label="—" />
        )}
        {row.prospecting_tier ? (
          <Badge tone={tone === "top" ? "brand" : "warn"}>
            {row.prospecting_tier}
          </Badge>
        ) : null}
      </div>
      <p className="mt-2 text-[11px] text-slate-500">
        Yield{" "}
        {row.prospect_yield_score !== null &&
        row.prospect_yield_score !== undefined ? (
          <span className="font-bold text-slate-700">
            {row.prospect_yield_score}
          </span>
        ) : (
          <EmptyValue label="—" />
        )}
        {" · "}
        Advertisers{" "}
        {row.unique_domains_found !== null &&
        row.unique_domains_found !== undefined ? (
          <span className="font-bold text-slate-700">
            {row.unique_domains_found}
          </span>
        ) : (
          <EmptyValue label="—" />
        )}
      </p>
    </div>
  );
}

export default async function KeywordsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const filters = {
    category: param(sp, "category"),
    cluster: param(sp, "cluster"),
    volumeTier: param(sp, "volumeTier"),
    quality80: param(sp, "quality80"),
    commercial80: param(sp, "commercial80"),
    approved: param(sp, "approved"),
    notReviewed: param(sp, "notReviewed"),
    scanned: param(sp, "scanned"),
    search: param(sp, "search") ?? param(sp, "q"),
    intentType: param(sp, "intentType"),
    prospectingTier: param(sp, "prospectingTier"),
    primary: param(sp, "primary"),
    secondary: param(sp, "secondary"),
    highProspecting: param(sp, "highProspecting"),
    highYield: param(sp, "highYield"),
    poorYield: param(sp, "poorYield"),
    retailerHeavy: param(sp, "retailerHeavy"),
    nonBrandedOnly: param(sp, "nonBrandedOnly"),
    page: Number(param(sp, "page") ?? "1"),
  };

  let summary: KeywordIntelligenceSummary = {
    total: 0,
    qualified: 0,
    approved: 0,
    rejected: 0,
    scanned: 0,
    estimatedSerpCost: 0,
  };
  let rows: KeywordIntelligenceRow[] = [];
  let total = 0;
  let page = 1;
  let pageSize = 30;
  let categories: KeywordCategoryRow[] = [];
  let categoryOverview: KeywordCategoryOverview[] = [];
  let funnel: DiscoveryFunnelMetrics = {
    total: 0,
    ecommerce: 0,
    brandOrSpecialist: 0,
    generalRetailer: 0,
    comparisonOrMarketplace: 0,
    shopify: 0,
    leadEligible: 0,
  };
  let prospectingQuality: KeywordProspectingQuality = { top: [], worst: [] };
  let loadError: string | null = null;

  try {
    const [summaryResult, listResult, cats, overview, funnelResult, quality] =
      await Promise.all([
        getKeywordIntelligenceSummary(),
        getKeywordIntelligenceList(filters),
        getKeywordCategories(),
        getKeywordCategoryOverview(),
        getDiscoveryFunnelMetrics(),
        getKeywordProspectingQuality(),
      ]);
    summary = summaryResult;
    rows = listResult.rows;
    total = listResult.total;
    page = listResult.page;
    pageSize = listResult.pageSize;
    categories = cats;
    categoryOverview = overview;
    funnel = funnelResult;
    prospectingQuality = quality;
  } catch (err) {
    loadError = err instanceof Error ? err.message : "Kon keywords niet laden";
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const VOLUME_TIERS = [
    "HIGH_VOLUME",
    "MEDIUM_VOLUME",
    "LOW_VOLUME",
    "VERY_LOW_VOLUME",
    "UNKNOWN",
  ] as const;

  const baseFilters = { ...filters, page: undefined as number | undefined };

  return (
    <AppShell activePath="/keywords">
      <SectionTitle
        eyebrow="Keyword Intelligence"
        title="Keywords goedkeuren vóór SERP-scans"
        description="Alleen approved keywords gaan de discovery-pipeline in. Houd quality, commercial intent en prospecting value scherp, zodat je budget niet op ruis verdwijnt."
      />

      {loadError ? (
        <p className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {loadError}
        </p>
      ) : null}

      <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        <StatCard label="Total" value={summary.total} />
        <StatCard label="Qualified" value={summary.qualified} />
        <StatCard label="Approved" value={summary.approved} />
        <StatCard label="Rejected" value={summary.rejected} />
        <StatCard label="Scanned" value={summary.scanned} />
        <StatCard
          label="Estimated SERP scan cost"
          value={formatUsd(summary.estimatedSerpCost)}
          hint="Approved keywords · fallback $0.002"
        />
      </div>

      <div className="mb-8 overflow-x-auto rounded-2xl border border-[#FF5722]/25 bg-gradient-to-br from-white to-[#FF5722]/5 p-5 shadow-mm-card">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF5722]">
          Discovery Funnel
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Unieke domains uit scanned keywords (via ad occurrences)
        </p>
        <div className="mt-4 flex min-w-[720px] items-end gap-2">
          {FUNNEL_STEPS.map((step, index) => {
            const value = funnel[step.key];
            return (
              <div key={step.key} className="flex flex-1 items-end gap-2">
                <div className="flex-1 rounded-xl border border-white/80 bg-white/90 px-3 py-3 text-center shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                    {step.label}
                  </p>
                  <p className="mt-1 text-2xl font-extrabold tabular-nums text-slate-900">
                    {value}
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
        <section>
          <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF5722]">
            Top Prospecting Keywords
          </h3>
          {prospectingQuality.top.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500">
              <EmptyValue label="Nog geen prospecting scores" />
            </div>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {prospectingQuality.top.map((row) => (
                <ProspectingCard key={row.id} row={row} tone="top" />
              ))}
            </div>
          )}
        </section>
        <section>
          <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-rose-600">
            Worst Prospecting Keywords
          </h3>
          {prospectingQuality.worst.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500">
              <EmptyValue label="Nog geen scanned yields" />
            </div>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {prospectingQuality.worst.map((row) => (
                <ProspectingCard key={row.id} row={row} tone="worst" />
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="mb-8 rounded-2xl border border-mm-border bg-white p-5 shadow-mm-card">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF5722]">
          Cost preview
        </p>
        <div className="mt-3 flex flex-wrap items-end gap-6">
          <div>
            <p className="text-xs text-slate-500">Approved keywords</p>
            <p className="text-2xl font-extrabold text-slate-900">
              {summary.approved}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Estimated SERP requests</p>
            <p className="text-2xl font-extrabold text-slate-900">
              {summary.approved}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Geschatte kosten</p>
            <p className="text-2xl font-extrabold text-slate-900">
              {formatUsd(summary.estimatedSerpCost)}
            </p>
          </div>
        </div>
        <p className="mt-3 max-w-2xl text-sm text-slate-600">
          Elke approved keyword triggert naar schatting één SERP-request. Houd dit
          onder je DataForSEO-budget voordat je discovery start.
        </p>
      </div>

      <div className="mb-8">
        <h3 className="mb-3 text-sm font-extrabold text-slate-900">
          Category overview
        </h3>
        <CategoryCards categories={categoryOverview} />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {QUICK_FILTERS.map((filter) => {
          const active = filters[filter.key] === filter.value;
          const next: Record<string, string | number | undefined> = {
            ...baseFilters,
          };
          if (active) {
            delete next[filter.key];
          } else {
            next[filter.key] = filter.value;
            if (filter.key === "primary") delete next.secondary;
            if (filter.key === "secondary") delete next.primary;
            if (filter.key === "highYield") delete next.poorYield;
            if (filter.key === "poorYield") delete next.highYield;
          }
          return (
            <Link
              key={filter.key}
              href={buildHref(next)}
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                active
                  ? "bg-[#FF5722] text-white"
                  : "border border-mm-border bg-white text-slate-600 hover:border-[#FF5722]/40 hover:text-[#C2410C]"
              }`}
            >
              {filter.label}
            </Link>
          );
        })}
      </div>

      <form className="mb-6 grid gap-3 rounded-2xl border border-mm-border bg-white p-4 shadow-mm-card md:grid-cols-3 xl:grid-cols-4">
        <input
          name="search"
          defaultValue={filters.search ?? ""}
          placeholder="Zoek keyword…"
          className="rounded-xl border border-mm-border bg-mm-bg px-3 py-2.5 text-sm outline-none focus:border-mm-sky-deep md:col-span-2"
        />
        <select
          name="category"
          defaultValue={filters.category ?? ""}
          className="rounded-xl border border-mm-border bg-mm-bg px-3 py-2.5 text-sm"
        >
          <option value="">Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>
        <input
          name="cluster"
          defaultValue={filters.cluster ?? ""}
          placeholder="Cluster (exact)"
          className="rounded-xl border border-mm-border bg-mm-bg px-3 py-2.5 text-sm outline-none focus:border-mm-sky-deep"
        />
        <select
          name="volumeTier"
          defaultValue={filters.volumeTier ?? ""}
          className="rounded-xl border border-mm-border bg-mm-bg px-3 py-2.5 text-sm"
        >
          <option value="">Volume tier</option>
          {VOLUME_TIERS.map((tier) => (
            <option key={tier} value={tier}>
              {tier}
            </option>
          ))}
          {filters.volumeTier &&
          !(VOLUME_TIERS as readonly string[]).includes(filters.volumeTier) ? (
            <option value={filters.volumeTier}>{filters.volumeTier}</option>
          ) : null}
        </select>
        <select
          name="intentType"
          defaultValue={filters.intentType ?? ""}
          className="rounded-xl border border-mm-border bg-mm-bg px-3 py-2.5 text-sm"
        >
          <option value="">Intent type</option>
          <option value="NON_BRANDED_PRODUCT">NON_BRANDED_PRODUCT</option>
          <option value="PRODUCT_BRANDED">PRODUCT_BRANDED</option>
          <option value="RETAILER_BRANDED">RETAILER_BRANDED</option>
          <option value="BRAND_NAVIGATIONAL">BRAND_NAVIGATIONAL</option>
          <option value="REVIEW_RESEARCH">REVIEW_RESEARCH</option>
          <option value="INFORMATIONAL">INFORMATIONAL</option>
          <option value="SERVICE">SERVICE</option>
          <option value="OTHER">OTHER</option>
        </select>
        <select
          name="prospectingTier"
          defaultValue={filters.prospectingTier ?? ""}
          className="rounded-xl border border-mm-border bg-mm-bg px-3 py-2.5 text-sm"
        >
          <option value="">Prospecting tier</option>
          <option value="PRIMARY">PRIMARY</option>
          <option value="SECONDARY">SECONDARY</option>
          <option value="LOW_VALUE">LOW_VALUE</option>
          <option value="REJECT">REJECT</option>
        </select>
        <select
          name="quality80"
          defaultValue={filters.quality80 ?? ""}
          className="rounded-xl border border-mm-border bg-mm-bg px-3 py-2.5 text-sm"
        >
          <option value="">Quality</option>
          <option value="true">Quality ≥ 80</option>
        </select>
        <select
          name="commercial80"
          defaultValue={filters.commercial80 ?? ""}
          className="rounded-xl border border-mm-border bg-mm-bg px-3 py-2.5 text-sm"
        >
          <option value="">Commercial</option>
          <option value="true">Commercial ≥ 80</option>
        </select>
        <select
          name="approved"
          defaultValue={filters.approved ?? ""}
          className="rounded-xl border border-mm-border bg-mm-bg px-3 py-2.5 text-sm"
        >
          <option value="">Approved filter</option>
          <option value="true">Approved only</option>
          <option value="false">Not approved</option>
        </select>
        <select
          name="notReviewed"
          defaultValue={filters.notReviewed ?? ""}
          className="rounded-xl border border-mm-border bg-mm-bg px-3 py-2.5 text-sm"
        >
          <option value="">Review status</option>
          <option value="true">Not reviewed</option>
        </select>
        <select
          name="scanned"
          defaultValue={filters.scanned ?? ""}
          className="rounded-xl border border-mm-border bg-mm-bg px-3 py-2.5 text-sm"
        >
          <option value="">Scan status</option>
          <option value="true">Scanned only</option>
        </select>
        {QUICK_FILTERS.map((filter) =>
          filters[filter.key] === filter.value ? (
            <input
              key={`hidden-${filter.key}`}
              type="hidden"
              name={filter.key}
              value={filter.value}
            />
          ) : null
        )}
        <button
          type="submit"
          className="rounded-xl bg-[#FF5722] px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-600"
        >
          Filter
        </button>
      </form>

      <p className="mb-3 text-xs text-slate-500">
        {total} keywords · pagina {page}/{totalPages}
      </p>

      <KeywordsOperatorClient rows={rows} categories={categories} />

      {totalPages > 1 ? (
        <div className="mt-6 flex justify-center gap-2">
          {page > 1 ? (
            <Link
              href={buildHref({ ...filters, page: page - 1 })}
              className="rounded-full border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700"
            >
              Vorige
            </Link>
          ) : null}
          {page < totalPages ? (
            <Link
              href={buildHref({ ...filters, page: page + 1 })}
              className="rounded-full border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700"
            >
              Volgende
            </Link>
          ) : null}
        </div>
      ) : null}
    </AppShell>
  );
}
