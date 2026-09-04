import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { Badge, EmptyValue, SectionTitle, StatCard, signalTone } from "@/components/ui";
import {
  eligibilityLabel,
  eligibilityTone,
  resolveEligibilityStatus,
} from "@/lib/eligibility";
import {
  formatDomain,
  formatPrice,
  formatScore,
  signalLabel,
} from "@/lib/format";
import { getOverviewStats, getRecentOpportunities } from "@/lib/queries";
import { one } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  const [stats, recent] = await Promise.all([
    getOverviewStats(),
    getRecentOpportunities(8),
  ]);

  return (
    <AppShell activePath="/">
      <SectionTitle
        eyebrow="Overzicht"
        title="Commerce intelligence in één blik"
        description="Discovery, qualification en CRO Opportunity Score uit Supabase. Hoge score = sterk commercieel prospect + duidelijke verbeterkans."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Brands discovered" value={stats.brandsDiscovered} />
        <StatCard
          label="Confirmed Google advertisers"
          value={stats.confirmedAdvertisers}
        />
        <StatCard label="Lead eligible" value={stats.leadEligible} />
        <StatCard label="Shopify stores" value={stats.shopifyStores} />
        <StatCard label="Resolved product pages" value={stats.resolvedProducts} />
        <StatCard label="Excluded retailers" value={stats.excludedRetailers} />
        <StatCard label="Opportunities" value={stats.opportunities} />
        <StatCard
          label="Recent runs"
          value={stats.recentRuns}
          hint="Laatste 14 dagen"
        />
        <StatCard label="Exact paid funnels" value={stats.exactPaidFunnels} />
        <StatCard
          label="High-confidence product targets"
          value={stats.highConfidenceTargets}
        />
        <StatCard label="Discovery-only" value={stats.discoveryOnly} />
        <StatCard label="High Priority" value={stats.highPriority} />
        <StatCard label="Contact Immediately" value={stats.contactImmediately} />
        <StatCard
          label="Average Opportunity Score"
          value={stats.averageOpportunityScore ?? "n/a"}
          hint={
            stats.auditedCount > 0
              ? `${stats.auditedCount} geaudit (paid funnels)`
              : "Alleen exact paid funnels"
          }
        />
        <StatCard label="Audited opportunities" value={stats.auditedCount} />
      </div>

      <div className="mt-10">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF5722]">
              Recent
            </p>
            <h3 className="text-xl font-extrabold tracking-tight text-slate-900">
              Recent opportunities
            </h3>
          </div>
          <Link
            href="/opportunities"
            className="rounded-full bg-[#FF5722] px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white shadow-lg shadow-[#FF5722]/20 hover:bg-orange-600"
          >
            Alles bekijken
          </Link>
        </div>

        <div className="space-y-3">
          {recent.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-mm-border bg-white p-8 text-sm text-slate-500">
              Nog geen opportunities. Run `npm run generate:opportunities`.
            </div>
          ) : (
            recent.map((opp) => {
              const brand = one(opp.brands);
              const page = one(opp.pages);
              return (
                <Link
                  key={opp.id}
                  href={`/opportunities/${opp.id}`}
                  className="block rounded-2xl border border-mm-border bg-white p-4 shadow-mm-card transition hover:-translate-y-0.5 hover:shadow-mm-float sm:p-5"
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-base font-extrabold text-slate-900">
                          {formatDomain(brand?.normalized_domain)}
                        </p>
                        <Badge
                          tone={eligibilityTone(resolveEligibilityStatus(brand))}
                        >
                          {eligibilityLabel(resolveEligibilityStatus(brand))}
                        </Badge>
                        <Badge tone={signalTone(opp.paid_signal_type)}>
                          {signalLabel(opp.paid_signal_type)}
                        </Badge>
                        {opp.opportunity_verdict ? (
                          <Badge tone="brand">{opp.opportunity_verdict}</Badge>
                        ) : null}
                      </div>
                      <p className="mt-1 text-sm text-slate-600">
                        {page?.product_name ? (
                          page.product_name
                        ) : (
                          <EmptyValue label="Geen product gevonden" />
                        )}
                      </p>
                      {one(opp.keywords)?.keyword ? (
                        <p className="mt-1 text-xs text-slate-400">
                          {Number(opp.source_quality_score ?? 0) >= 45 &&
                          Number(opp.primary_keyword_confidence ?? 0) >= 55
                            ? "Gevonden via "
                            : "Mogelijk gevonden via "}
                          <span className="font-bold text-slate-600">
                            {one(opp.keywords)?.keyword}
                          </span>
                          {one(opp.keywords)?.category
                            ? ` · ${one(opp.keywords)?.category}`
                            : ""}
                          {opp.source_quality_score != null
                            ? ` · source ${Math.round(Number(opp.source_quality_score))}`
                            : ""}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
                      {opp.opportunity_score != null ? (
                        <span>
                          <span className="font-bold text-slate-400">Score </span>
                          {Math.round(Number(opp.opportunity_score))}
                        </span>
                      ) : null}
                      <span>
                        <span className="font-bold text-slate-400">Type </span>
                        {brand?.business_type ?? "UNKNOWN"}
                      </span>
                      <span>
                        <span className="font-bold text-slate-400">Platform </span>
                        {brand?.platform && brand.platform !== "UNKNOWN"
                          ? brand.platform
                          : brand?.platform_candidate &&
                              brand.platform_candidate !== "UNKNOWN"
                            ? `${brand.platform_candidate} (candidate)`
                            : "Onbekend"}
                      </span>
                      <span>
                        <span className="font-bold text-slate-400">Prijs </span>
                        {page?.price != null
                          ? formatPrice(page.price, page.currency)
                          : "Geen prijs"}
                      </span>
                      <span>
                        <span className="font-bold text-slate-400">Maturity </span>
                        {formatScore(brand?.business_maturity_score ?? null)}
                      </span>
                      <span>
                        <span className="font-bold text-slate-400">Scale </span>
                        {formatScore(brand?.retailer_scale_score ?? null)}
                      </span>
                      <span>
                        <span className="font-bold text-slate-400">Keywords </span>
                        {opp.supporting_keyword_count}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>

    </AppShell>
  );
}
