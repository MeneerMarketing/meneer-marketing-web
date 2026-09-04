import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { ActivityTimeline } from "@/components/ActivityTimeline";
import { BrandExclusionActions } from "@/components/BrandExclusionActions";
import { BrandOperatorActions } from "@/components/BrandOperatorActions";
import { DecisionTrail } from "@/components/DecisionTrail";
import { FavoriteButton } from "@/components/FavoriteButton";
import { NotesPanel } from "@/components/NotesPanel";
import { TagsPanel } from "@/components/TagsPanel";
import {
  Badge,
  EmptyValue,
  KeyValue,
  Panel,
  SectionTitle,
  signalTone,
} from "@/components/ui";
import { formatSupportingCount } from "@/lib/auditStatus";
import {
  eligibilityLabel,
  eligibilityTone,
  isBrandExcluded,
  resolveEligibilityStatus,
} from "@/lib/eligibility";
import {
  formatConfidence,
  formatDate,
  formatDomain,
  formatPrice,
  formatScore,
  signalLabel,
} from "@/lib/format";
import {
  getActivity,
  getBrandDetail,
  getEntityTags,
  getOperatorNotes,
} from "@/lib/queries";
import { one } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function BrandDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let detail;
  try {
    detail = await getBrandDetail(id);
  } catch {
    notFound();
  }

  const [notes, activity, tags] = await Promise.all([
    getOperatorNotes({ brandId: id }),
    getActivity({ brandId: id }),
    getEntityTags({ brandId: id }),
  ]);

  const { brand, opportunities, ads, pages } = detail;
  const eligibility = resolveEligibilityStatus(brand);
  const brandExcluded = isBrandExcluded(brand);

  const decisionItems = [
    {
      label: "Eligibility",
      value: eligibilityLabel(eligibility),
    },
    {
      label: "Qualification",
      value: brand.qualification_reason ?? <EmptyValue label="Onbekend" />,
    },
    {
      label: "Business type",
      value: brand.business_type,
    },
    {
      label: "Google advertiser",
      value:
        brand.confirmed_google_advertiser || brand.transparency_confirmed
          ? "Bevestigd"
          : "Niet bevestigd",
    },
    {
      label: "Platform",
      value:
        brand.platform && brand.platform !== "UNKNOWN"
          ? brand.platform
          : brand.platform_candidate ?? "Onbekend",
    },
    {
      label: "Maturity",
      value: formatScore(brand.business_maturity_score),
    },
    {
      label: "Retailer scale",
      value: formatScore(brand.retailer_scale_score),
    },
    {
      label: "Paid targets",
      value: brand.paid_target_status ?? "—",
    },
  ];

  return (
    <AppShell activePath="/brands">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <SectionTitle
          eyebrow="Brand detail"
          title={formatDomain(brand.normalized_domain)}
          description="Alle opportunities, ads en pages van dit merk."
        />
        <FavoriteButton
          entity="brands"
          id={brand.id}
          isFavorite={Boolean(brand.is_favorite)}
        />
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <Badge tone={eligibilityTone(eligibility)}>
          {eligibilityLabel(eligibility)}
        </Badge>
        {brand.manual_excluded ? <Badge tone="danger">Manual exclude</Badge> : null}
        {brand.do_not_contact ? <Badge tone="danger">DNC</Badge> : null}
        {brand.is_favorite ? <Badge tone="brand">Favoriet</Badge> : null}
        <Badge tone="sky">{brand.business_type}</Badge>
        {(brand.confirmed_google_advertiser || brand.transparency_confirmed) && (
          <Badge tone="success">Confirmed Google advertiser</Badge>
        )}
        {brand.paid_target_status === "RESOLVED" ? (
          <Badge tone="success">Exact paid targets</Badge>
        ) : brand.paid_target_status ? (
          <Badge tone="warn">Paid targets: {brand.paid_target_status}</Badge>
        ) : null}
      </div>

      <div className="mb-6 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Panel title="Brand intelligence">
          <dl>
            <KeyValue label="Domain" value={formatDomain(brand.normalized_domain)} />
            <KeyValue label="Eligibility" value={eligibilityLabel(eligibility)} />
            <KeyValue label="Business type" value={brand.business_type} />
            <KeyValue
              label="Reasoning"
              value={brand.business_type_reasoning ?? <EmptyValue />}
            />
            <KeyValue
              label="Platform"
              value={
                brand.platform && brand.platform !== "UNKNOWN"
                  ? `${brand.platform} (${formatConfidence(brand.platform_confidence)})`
                  : brand.platform_candidate && brand.platform_candidate !== "UNKNOWN"
                    ? `Candidate ${brand.platform_candidate} (${formatConfidence(brand.platform_confidence)})`
                    : "Onbekend"
              }
            />
            <KeyValue
              label="Maturity"
              value={formatScore(brand.business_maturity_score)}
            />
            <KeyValue label="Scale" value={formatScore(brand.retailer_scale_score)} />
            <KeyValue
              label="Qualification"
              value={brand.qualification_reason ?? <EmptyValue />}
            />
            <KeyValue
              label="Brand confidence"
              value={
                brand.confirmed_google_advertiser || brand.transparency_confirmed
                  ? "Google advertiser confirmed: JA"
                  : "Google advertiser confirmed: NEE"
              }
            />
            <KeyValue
              label="Paid target status"
              value={
                brand.paid_target_status
                  ? `${brand.paid_target_status}${
                      brand.paid_targets_count != null
                        ? ` · ${brand.paid_targets_count} targets`
                        : ""
                    }`
                  : <EmptyValue label="Nog niet opgehaald" />
              }
            />
            <KeyValue
              label="Paid targets resolved"
              value={formatDate(brand.paid_targets_resolved_at)}
            />
            <KeyValue
              label="Last crawled"
              value={formatDate(brand.last_crawled_at)}
            />
            <KeyValue
              label="Crawl status"
              value={brand.crawl_status ?? <EmptyValue label="Onbekend" />}
            />
          </dl>
        </Panel>

        <div className="space-y-4">
          <BrandOperatorActions
            brandId={brand.id}
            isFavorite={Boolean(brand.is_favorite)}
            operatorStatus={brand.operator_status}
          />
          <BrandExclusionActions
            brandId={brand.id}
            manualExcluded={Boolean(brand.manual_excluded)}
            exclusionReason={brand.manual_exclusion_reason}
            exclusionNote={brand.manual_exclusion_note}
            doNotContact={Boolean(brand.do_not_contact)}
          />
        </div>
      </div>

      <div className="mb-6">
        <DecisionTrail title="Waarom is dit een lead?" items={decisionItems} />
      </div>

      <div className="mb-6 grid gap-6 xl:grid-cols-2">
        <NotesPanel brandId={brand.id} initialNotes={notes} />
        <TagsPanel brandId={brand.id} initialTags={tags} />
      </div>

      <div className="mb-6">
        <ActivityTimeline events={activity} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title={`Opportunities (${opportunities.length})`}>
          <div className="space-y-3">
            {opportunities.length === 0 ? (
              <EmptyValue label="Nog geen opportunities voor dit merk" />
            ) : (
              opportunities.map((opp) => {
                const page = one(opp.pages);
                return (
                  <Link
                    key={opp.id}
                    href={`/opportunities/${opp.id}`}
                    className="block rounded-xl border border-mm-border bg-mm-bg p-3 hover:border-[#FF5722]/40"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-bold text-slate-900">
                        {page?.product_name ?? "Landing target"}
                      </p>
                      <Badge tone={brandExcluded ? "danger" : "brand"}>
                        {brandExcluded ? "EXCLUDED" : opp.status}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      {page?.price != null
                        ? formatPrice(page.price, page.currency)
                        : "Geen prijs"}{" "}
                      · {formatSupportingCount(opp.supporting_keyword_count, "Keywords")} ·{" "}
                      {formatSupportingCount(opp.supporting_source_count, "Sources")}
                    </p>
                  </Link>
                );
              })
            )}
          </div>
        </Panel>

        <Panel title={`Ad occurrences (${ads.length})`}>
          <div className="space-y-3">
            {ads.map((ad) => {
              const kw = one(
                (ad as { keywords?: { keyword: string } | { keyword: string }[] })
                  .keywords
              );
              return (
                <div
                  key={ad.id as string}
                  className="rounded-xl border border-mm-border bg-mm-bg p-3"
                >
                  <div className="mb-1 flex flex-wrap gap-2">
                    <Badge tone={signalTone(ad.ad_signal_type as string)}>
                      {signalLabel(ad.ad_signal_type as string)}
                    </Badge>
                    {kw?.keyword ? <Badge tone="neutral">{kw.keyword}</Badge> : null}
                  </div>
                  <p className="font-bold">
                    {(ad.headline as string) || <EmptyValue label="Geen headline" />}
                  </p>
                  <p className="mt-1 truncate text-xs text-slate-400">
                    {(ad.landing_url as string) || "Geen landing"}
                  </p>
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel title={`Pages (${pages.length})`}>
          <div className="space-y-3">
            {pages.length === 0 ? (
              <EmptyValue label="Geen pages gecrawld" />
            ) : (
              pages.map((page) => (
                <div
                  key={page.id}
                  className="rounded-xl border border-mm-border bg-mm-bg p-3"
                >
                  <div className="flex flex-wrap gap-2">
                    <Badge tone="sky">{page.page_type ?? "UNKNOWN"}</Badge>
                    {page.price != null ? (
                      <Badge tone="neutral">
                        {formatPrice(page.price, page.currency)}
                      </Badge>
                    ) : null}
                  </div>
                  <p className="mt-2 font-bold text-slate-900">
                    {page.product_name ?? <EmptyValue label="Geen productnaam" />}
                  </p>
                  <p className="mt-1 truncate text-xs text-slate-400">
                    {page.final_url ?? page.url}
                  </p>
                </div>
              ))
            )}
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
