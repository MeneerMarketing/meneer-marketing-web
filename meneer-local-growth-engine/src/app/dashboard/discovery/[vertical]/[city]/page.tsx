import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, MetricTile, Panel, SectionTitle, WebsiteLink } from "@/components/dashboard/ui";
import {
  CityLeadOverrideActions,
  CityRankingActions,
} from "@/components/dashboard/CityRankingActions";
import { CityOutreachPanel } from "@/components/dashboard/CityOutreachPanel";
import { CityAcquisitionSummary } from "@/components/dashboard/CityAcquisitionSummary";
import { VisualAnalysisPanel } from "@/components/dashboard/VisualAnalysisPanel";
import { getCityDetail } from "@/lib/data/dashboard";

interface Props {
  params: Promise<{ vertical: string; city: string }>;
}

type Components = {
  business_quality_score?: number;
  website_opportunity_score?: number;
  seo_opportunity_score?: number;
  local_reputation_score?: number;
  service_fit_score?: number;
  brand_fit_score?: number;
  contactability_score?: number;
  competition_fit_score?: number;
  explanations?: { positives?: string[]; negatives?: string[] };
};

export default async function DiscoveryCityDetailPage({ params }: Props) {
  const { vertical, city: citySlug } = await params;
  const detail = await getCityDetail(vertical, citySlug);
  if (!detail) notFound();

  const { city, exclusivity, businesses, market, coverage, outreach } = detail;
  const businessRows = businesses.map((b) => b.business);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
        <Link href="/dashboard/discovery" className="font-semibold text-[#C2410C]">
          ← Discovery
        </Link>
        <Link
          href={`/dashboard/discovery/${vertical}`}
          className="font-semibold text-slate-500 hover:text-slate-800"
        >
          {vertical}
        </Link>
        <Link
          href={`/dashboard/discovery/new?city=${encodeURIComponent(city.name)}&country=${city.country_code}`}
          className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#C2410C] hover:underline"
        >
          + Nieuwe discovery
        </Link>
      </div>

      <SectionTitle
        eyebrow="City detail"
        title={`${city.name} · ${detail.vertical.name}`}
        description="Gerankte studios met SEO opportunity. Volume is clustered (geen blinde optelling van overlappende keywords)."
      />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Badge
          tone={
            exclusivity?.status === "EXCLUSIVE"
              ? "success"
              : exclusivity?.status === "PRIMARY_CANDIDATE"
                ? "warn"
                : "sky"
          }
        >
          {exclusivity?.status ?? "AVAILABLE"}
        </Badge>
        <CityRankingActions cityId={city.id} verticalSlug={vertical} />
      </div>

      <div className="mb-6 space-y-6">
        {outreach ? (
          <CityOutreachPanel
            verticalSlug={vertical}
            cityId={city.id}
            cityName={city.name}
            verticalName={detail.vertical.name}
            businesses={businessRows}
            capacity={outreach.capacity}
            templateUsage={outreach.template_usage}
            acquisitionProtected={outreach.acquisition_protected}
            protectionReason={outreach.protection_reason}
            activeClientsInCity={outreach.active_clients_in_city}
          />
        ) : null}
        <CityAcquisitionSummary
          cityName={city.name}
          businesses={businessRows}
          coverage={coverage}
        />
        <VisualAnalysisPanel cityId={city.id} verticalSlug={vertical} />
      </div>

      {(() => {
        const primary = businesses.find((b) => b.business.primary_candidate);
        const first = businesses[0];
        const second = businesses[1];
        const margin =
          first && second && first.business.lead_score != null && second.business.lead_score != null
            ? Math.round(
                (Number(first.business.lead_score) - Number(second.business.lead_score)) * 10
              ) / 10
            : null;
        const focus = primary ?? first;
        if (!focus) return null;
        const b = focus.business;
        return (
          <Panel title="Primary candidate">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {b.primary_candidate ? (
                <Badge tone="warn">PRIMARY</Badge>
              ) : (
                <Badge tone="neutral">Geen primary</Badge>
              )}
              {b.lead_status === "READY_FOR_OUTREACH" ? (
                <Badge tone="success">READY FOR OUTREACH</Badge>
              ) : null}
              {b.winner_path ? <Badge tone="sky">{b.winner_path}</Badge> : null}
            </div>
            <p className="text-lg font-extrabold text-slate-900">{b.studio_name}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <MetricTile
                label="Lead score"
                value={b.lead_score != null ? Math.round(Number(b.lead_score)) : "—"}
              />
              <MetricTile
                label="Winner confidence"
                value={
                  b.winner_confidence != null ? Math.round(Number(b.winner_confidence)) : "—"
                }
              />
              <MetricTile label="Margin vs #2" value={margin ?? "—"} />
              <MetricTile
                label="SEO opportunity"
                value={
                  b.seo_opportunity_score != null
                    ? Math.round(Number(b.seo_opportunity_score))
                    : "—"
                }
              />
              <MetricTile label="Preview" value={b.preview_status ?? "—"} />
            </div>
            {b.winner_reason ? (
              <p className="mt-4 text-sm leading-relaxed text-slate-600">{b.winner_reason}</p>
            ) : null}
          </Panel>
        );
      })()}

      <Panel title={`Local search market · ${city.name}`}>
        <div className="mb-4 grid gap-3 sm:grid-cols-3">
          <MetricTile
            label="Total relevant demand"
            value={market.clustered_demand || "—"}
            hint="Som van max volume per keyword_cluster"
          />
          <MetricTile
            label="Highest opportunity"
            value={
              market.highest_opportunity?.score != null
                ? Math.round(Number(market.highest_opportunity.score))
                : "—"
            }
            hint={market.highest_opportunity?.name}
          />
          <MetricTile
            label="Strongest visibility"
            value={
              market.strongest_visibility?.score != null
                ? Math.round(Number(market.strongest_visibility.score))
                : "—"
            }
            hint={market.strongest_visibility?.name}
          />
        </div>
        {market.keywords.length > 0 ? (
          <ul className="divide-y divide-slate-100 text-sm">
            {market.keywords.slice(0, 12).map((k) => (
              <li key={k.keyword} className="flex flex-wrap justify-between gap-2 py-2">
                <span>
                  <span className="font-semibold">{k.keyword}</span>
                  <span className="ml-2 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                    {k.cluster}
                  </span>
                </span>
                <span className="tabular-nums text-slate-600">
                  Volume: {k.volume ?? "—"}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500">Nog geen keyword metrics voor deze stad.</p>
        )}
      </Panel>

      <div className="mt-6 space-y-4">
        {businesses.length === 0 ? (
          <Panel title="Geen studios">
            <p className="text-sm text-slate-500">Nog geen live leads in deze stad.</p>
          </Panel>
        ) : null}

        {businesses.map(({ business, preview, seo }) => {
          const c = (business.score_components ?? {}) as Components;
          return (
            <article
              key={business.id}
              className="border border-mm-border bg-white p-5 shadow-mm-card"
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-slate-400">
                      #{business.city_rank ?? "—"}
                    </span>
                    <Link
                      href={`/dashboard/leads/${business.id}`}
                      className="text-lg font-extrabold text-slate-900 hover:text-[#C2410C]"
                    >
                      {business.studio_name}
                    </Link>
                    {business.primary_candidate ? (
                      <Badge tone="warn">PRIMARY</Badge>
                    ) : null}
                    {business.ranking_version ? (
                      <Badge tone="sky">{business.ranking_version}</Badge>
                    ) : null}
                    <Badge tone="neutral">{business.lead_status}</Badge>
                    <Badge tone="sky">{business.preview_status}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    <WebsiteLink
                      url={business.website_url}
                      domain={business.domain}
                      className="text-sm"
                    />
                    {" · "}rating{" "}
                    {business.google_rating ?? "—"} ({business.google_review_count ?? 0}) ·{" "}
                    {business.primary_service ?? "—"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    Lead score
                  </p>
                  <p className="text-3xl font-extrabold text-slate-900">
                    {business.lead_score != null ? Math.round(Number(business.lead_score)) : "—"}
                  </p>
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    Winner confidence
                  </p>
                  <p className="text-xl font-extrabold text-slate-700">
                    {business.winner_confidence != null
                      ? Math.round(Number(business.winner_confidence))
                      : "—"}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
                {[
                  ["Business", c.business_quality_score],
                  ["Website gap", c.website_opportunity_score],
                  ["SEO opp", business.seo_opportunity_score ?? c.seo_opportunity_score],
                  ["Visibility", business.seo_visibility_score],
                  ["Main rank", seo?.current_rank],
                  ["Reputation", c.local_reputation_score],
                  ["Contact", c.contactability_score],
                ].map(([label, value]) => (
                  <div key={String(label)} className="border border-slate-100 bg-mm-surface/40 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                      {label}
                    </p>
                    <p className="mt-1 text-lg font-extrabold">
                      {label === "Main rank"
                        ? value != null
                          ? `#${value}`
                          : "n/a"
                        : value != null
                          ? Math.round(Number(value))
                          : "—"}
                    </p>
                  </div>
                ))}
              </div>

              {(c.explanations?.positives?.length || c.explanations?.negatives?.length) && (
                <div className="mt-4 grid gap-3 md:grid-cols-2 text-xs">
                  <div>
                    <p className="font-bold text-emerald-800">Waarom sterk</p>
                    <ul className="mt-1 list-disc space-y-0.5 pl-4 text-slate-600">
                      {(c.explanations?.positives ?? []).slice(0, 6).map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-bold text-rose-800">Aandachtspunten</p>
                    <ul className="mt-1 list-disc space-y-0.5 pl-4 text-slate-600">
                      {(c.explanations?.negatives ?? []).slice(0, 6).map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-3">
                {preview ? (
                  <a
                    href={`/preview/${preview.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-bold text-[#C2410C]"
                  >
                    Preview ↗
                  </a>
                ) : null}
                <Link
                  href={`/dashboard/leads/${business.id}?tab=seo`}
                  className="text-sm font-semibold text-slate-600 hover:text-[#C2410C]"
                >
                  SEO tab
                </Link>
                <CityLeadOverrideActions
                  businessId={business.id}
                  cityId={city.id}
                  isPrimary={Boolean(business.primary_candidate)}
                  verticalSlug={vertical}
                />
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
