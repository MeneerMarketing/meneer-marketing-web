import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { ActivityTimeline } from "@/components/ActivityTimeline";
import { AiFeedbackButtons } from "@/components/AiFeedbackButtons";
import { DecisionTrail } from "@/components/DecisionTrail";
import { FavoriteButton } from "@/components/FavoriteButton";
import { NotesPanel } from "@/components/NotesPanel";
import { ShortlistButton } from "@/components/ShortlistButton";
import { TagsPanel } from "@/components/TagsPanel";
import { StatusActions } from "@/components/StatusActions";
import { RetryAuditButton } from "@/components/RetryAuditButton";
import {
  Badge,
  EmptyValue,
  KeyValue,
  Panel,
  SectionTitle,
  signalTone,
} from "@/components/ui";
import {
  formatConfidence,
  formatDate,
  formatDomain,
  formatPrice,
  formatRating,
  formatReviews,
  formatScore,
  signalLabel,
} from "@/lib/format";
import {
  eligibilityLabel,
  eligibilityTone,
  isBrandExcluded,
  resolveEligibilityStatus,
} from "@/lib/eligibility";
import { getOpportunityDetail, getActivity, getEntityTags, getOperatorNotes } from "@/lib/queries";
import { formatSupportingCount } from "@/lib/auditStatus";
import { one } from "@/lib/types";
import { GenerateOutreachButton } from "@/components/GenerateOutreachButton";
import { getSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

function verdictTone(
  verdict: string | null | undefined
): "success" | "brand" | "warn" | "danger" | "sky" | "neutral" {
  switch (verdict) {
    case "CONTACT_IMMEDIATELY":
      return "danger";
    case "HIGH_PRIORITY":
      return "brand";
    case "INTERESTING":
      return "sky";
    case "LOW_PRIORITY":
      return "warn";
    case "SKIP":
      return "neutral";
    default:
      return "neutral";
  }
}

function formatProductRelationship(value: string): string {
  switch (value) {
    case "OWN_BRAND":
      return "Own Brand";
    case "EXCLUSIVE_BRAND":
      return "Exclusive Brand";
    case "RESELLER_PRODUCT":
      return "Reseller";
    case "UNKNOWN":
      return "Unknown";
    default:
      return value;
  }
}

function formatProjectType(value: string): string {
  switch (value) {
    case "CUSTOM_SHOPIFY_REBUILD":
      return "Custom Shopify Rebuild";
    case "SHOPIFY_CRO_REDESIGN":
      return "Shopify CRO Redesign";
    case "PDP_OPTIMIZATION":
      return "PDP Optimization";
    case "WOOCOMMERCE_TO_SHOPIFY":
      return "WooCommerce → Shopify";
    case "DESIGN_UPGRADE":
      return "Design Upgrade";
    case "NOT_A_GOOD_FIT":
      return "Not a good fit";
    default:
      return value;
  }
}

export default async function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let detail;
  try {
    detail = await getOpportunityDetail(id);
  } catch {
    notFound();
  }

  const { opportunity, ads, keywords, audit, screenshotUrls, paidTarget } = detail;
  const [notes, activity, tags] = await Promise.all([
    getOperatorNotes({ brandId: opportunity.brand_id, opportunityId: id }),
    getActivity({ brandId: opportunity.brand_id, opportunityId: id }),
    getEntityTags({ opportunityId: id }),
  ]);

  const supabase = getSupabase();
  const [{ data: preferredContact }, { data: latestDraft }] = await Promise.all([
    supabase
      .from("coe_brand_contacts")
      .select(
        "id, email, first_name, full_name, email_type, contact_confidence, source_url, is_preferred"
      )
      .eq("brand_id", opportunity.brand_id)
      .order("is_preferred", { ascending: false })
      .order("contact_confidence", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("coe_outreach_messages")
      .select("id, status, subject")
      .eq("opportunity_id", id)
      .order("version", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);
  const brand = one(opportunity.brands);
  const page = one(opportunity.pages);
  const primaryKeyword = one(opportunity.keywords);
  const extracted = (page?.extracted_data ?? {}) as Record<string, unknown>;

  if (!brand) notFound();

  const croScores = (audit?.cro_scores ?? {}) as Record<string, number | null>;
  const leaks = (audit?.conversion_leaks ?? []) as Array<Record<string, string>>;
  const strengths = (audit?.strengths ?? []) as Array<Record<string, string>>;
  const adLanding = (audit?.ad_landing_analysis ?? {}) as Record<string, unknown>;
  const isHighConfidenceAudit =
    opportunity.audit_type === "HIGH_CONFIDENCE_PRODUCT_TARGET" ||
    opportunity.cro_readiness_level === "HIGH_CONFIDENCE_TARGET";
  const technicalAuditFailure =
    opportunity.cro_audit_status === "FAILED_TECHNICAL" ||
    opportunity.cro_audit_status === "BLOCKED" ||
    opportunity.cro_audit_status === "NEEDS_RETRY" ||
    audit?.status === "FAILED_TECHNICAL" ||
    audit?.status === "BLOCKED" ||
    audit?.status === "NEEDS_RETRY" ||
    (audit?.audit_valid === false &&
      /cloudflare|page_health|challenge|520/i.test(audit?.invalid_reason ?? ""));
  const eligibility = resolveEligibilityStatus(brand);
  const brandExcluded = isBrandExcluded(brand);
  const keywordConfidence = Number(opportunity.primary_keyword_confidence ?? 0);
  const sourceQuality = Number(opportunity.source_quality_score ?? 0);
  const exactPaidTarget =
    opportunity.cro_readiness_level === "EXACT_PAID_FUNNEL" ||
    opportunity.ground_truth_source_type === "LABS_PAID_KEYWORD" ||
    opportunity.ground_truth_source_type === "LIVE_PAID_SERP" ||
    opportunity.ground_truth_source_type === "GOOGLE_SHOPPING_PAID_EXACT";
  const isExactShoppingPaid =
    opportunity.ground_truth_source_type === "GOOGLE_SHOPPING_PAID_EXACT";
  const isExactShoppingListing =
    opportunity.ground_truth_source_type === "GOOGLE_SHOPPING_EXACT_LISTING" ||
    opportunity.cro_readiness_level === "HIGH_CONFIDENCE_TARGET";
  const isFreeShopping =
    opportunity.ground_truth_source_type === "GOOGLE_SHOPPING_FREE_LISTING";
  const isDiscoveryOnly =
    opportunity.cro_readiness_level === "DISCOVERY_ONLY" ||
    opportunity.ground_truth_source_type === "POPULAR_PRODUCTS_CANDIDATE" ||
    opportunity.source_type === "POPULAR_PRODUCTS_CANDIDATE";
  const evidence = (opportunity.source_evidence ?? {}) as {
    transparency?: boolean;
    paidSearch?: { status?: string; keyword?: string; landingUrl?: string };
    paidShopping?: {
      status?: string;
      keyword?: string;
      productTitle?: string;
      seller?: string;
      price?: number | null;
      currency?: string | null;
      landingUrl?: string;
      listingTargetConfidence?: number;
      paidEvidenceConfidence?: number;
      specificListingPaid?: boolean;
    };
    discovery?: { popularProductsCandidate?: boolean };
  };
  const foundViaReliable = exactPaidTarget && keywordConfidence >= 55 && sourceQuality >= 85;
  const shoppingStatusLabel =
    isExactShoppingPaid || evidence.paidShopping?.status === "exact"
      ? "Paid exact"
      : isExactShoppingListing || evidence.paidShopping?.status === "exact_listing"
        ? "Exact listing"
        : isFreeShopping || evidence.paidShopping?.status === "free_listing"
          ? "Free listing"
          : "Candidate / niet gevonden";
  const listingConf =
    opportunity.listing_target_confidence ??
    evidence.paidShopping?.listingTargetConfidence ??
    (paidTarget?.listing_target_confidence as number | undefined) ??
    null;
  const paidConf =
    opportunity.paid_evidence_confidence ??
    evidence.paidShopping?.paidEvidenceConfidence ??
    (paidTarget?.paid_evidence_confidence as number | undefined) ??
    null;
  const findingValidations = (audit?.finding_validations ??
    (opportunity.source_integrity_notes?.findingValidations as Array<Record<string, string>>) ??
    []) as Array<{ title?: string; status?: string; reason?: string }>;
  const validationByTitle = new Map(
    findingValidations.map((v) => [v.title ?? "", v])
  );
  const formula =
    (audit?.score_formula_breakdown as Record<string, unknown> | null) ??
    (opportunity.source_integrity_notes?.scoreFormula as Record<string, unknown> | null) ??
    null;
  const auditInvalid = audit?.audit_valid === false;
  const paidFreshness =
    (paidTarget?.source_data_freshness as string | null) ??
    (paidTarget?.source_observed_at
      ? `data ${String(paidTarget.source_observed_at).slice(0, 10)}`
      : null);

  const decisionItems = [
    {
      label: "Opportunity score",
      value:
        opportunity.opportunity_score != null
          ? Math.round(Number(opportunity.opportunity_score))
          : "Niet geaudit",
    },
    {
      label: "MM Fit",
      value:
        opportunity.meneer_marketing_fit_score != null
          ? Math.round(Number(opportunity.meneer_marketing_fit_score))
          : "—",
    },
    {
      label: "Verdict",
      value: opportunity.opportunity_verdict ?? "Niet geaudit",
    },
    {
      label: "CRO readiness",
      value: opportunity.cro_readiness_level ?? "—",
    },
    {
      label: "Paid confirmed",
      value: opportunity.paid_confirmed ? "Ja" : "Nee",
    },
    {
      label: "Source quality",
      value:
        opportunity.source_quality_score != null
          ? Math.round(Number(opportunity.source_quality_score))
          : "—",
    },
    {
      label: "Keywords / sources",
      value: `${formatSupportingCount(opportunity.supporting_keyword_count, "Keywords")} · ${formatSupportingCount(opportunity.supporting_source_count, "Sources")}`,
    },
  ];

  return (
    <AppShell activePath="/opportunities">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <SectionTitle
          eyebrow="Opportunity detail"
          title={formatDomain(brand.normalized_domain)}
          description={
            page?.product_name ??
            "Brand + Google ads + product target. Opportunity Score ≠ website quality."
          }
        />
        <div className="flex flex-wrap items-center gap-2">
          <FavoriteButton
            entity="opportunities"
            id={opportunity.id}
            isFavorite={Boolean(opportunity.is_favorite)}
          />
          <ShortlistButton
            opportunityId={opportunity.id}
            isShortlisted={Boolean(opportunity.is_shortlisted)}
          />
          <Link
            href={`/brands/${brand.id}`}
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-700 hover:border-[#FF5722] hover:text-[#C2410C]"
          >
            Brand openen
          </Link>
        </div>
      </div>

      <div className="mb-6">
        <DecisionTrail title="Waarom deze opportunity?" items={decisionItems} />
      </div>

      <div className="mb-6 grid gap-6 xl:grid-cols-2">
        <NotesPanel
          brandId={brand.id}
          opportunityId={opportunity.id}
          initialNotes={notes}
        />
        <TagsPanel opportunityId={opportunity.id} initialTags={tags} />
      </div>

      <div className="mb-6">
        <ActivityTimeline events={activity} />
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-mm-border bg-white p-5 shadow-mm-card">
          <div className="flex flex-wrap gap-2">
            <Badge tone={eligibilityTone(eligibility)}>
              {eligibilityLabel(eligibility)}
            </Badge>
            {brandExcluded ? <Badge tone="danger">EXCLUDED</Badge> : null}
            {isExactShoppingPaid ? (
              <Badge tone="success">EXACT SHOPPING PAID</Badge>
            ) : isExactShoppingListing ? (
              <Badge tone="sky">EXACT SHOPPING LISTING</Badge>
            ) : isFreeShopping ? (
              <Badge tone="warn">FREE SHOPPING LISTING</Badge>
            ) : exactPaidTarget ? (
              <Badge tone="success">EXACT PAID FUNNEL</Badge>
            ) : isDiscoveryOnly ? (
              <Badge tone="warn">DISCOVERY CANDIDATE</Badge>
            ) : brand.confirmed_google_advertiser || brand.transparency_confirmed ? (
              <Badge tone="sky">CONFIRMED ADVERTISER</Badge>
            ) : (
              <Badge tone="warn">DISCOVERY CANDIDATE</Badge>
            )}
            {opportunity.cro_readiness_level ? (
              <Badge tone={exactPaidTarget ? "success" : isExactShoppingListing ? "sky" : "neutral"}>
                {opportunity.cro_readiness_level.replaceAll("_", " ")}
              </Badge>
            ) : null}
            <Badge tone={signalTone(opportunity.paid_signal_type)}>
              {opportunity.paid_confirmed ? "Google Ads confirmed" : signalLabel(opportunity.paid_signal_type)}
            </Badge>
            {brand.platform === "SHOPIFY" ? <Badge tone="sky">Shopify</Badge> : null}
            <Badge tone={brandExcluded ? "danger" : "brand"}>
              {brandExcluded ? "EXCLUDED" : opportunity.status}
            </Badge>
            {auditInvalid ? (
              <Badge tone="danger">AUDIT INVALID</Badge>
            ) : null}
          </div>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Product
              </p>
              <p className="mt-1 text-sm font-bold text-slate-900">
                {page?.product_name ?? <EmptyValue label="Geen product gevonden" />}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Primary keyword
              </p>
              <p className="mt-1 text-sm font-bold text-slate-900">
                {primaryKeyword?.keyword ?? <EmptyValue label="Onbekend" />}
              </p>
              {primaryKeyword?.category ? (
                <p className="text-xs text-slate-500">{primaryKeyword.category}</p>
              ) : null}
            </div>
          </dl>
          <p className="mt-3 text-xs text-slate-500">
            {formatSupportingCount(opportunity.supporting_keyword_count, "Keywords")} ·{" "}
            {formatSupportingCount(opportunity.supporting_source_count, "Sources")}
          </p>
        </div>

        <div className="rounded-2xl border border-mm-border bg-slate-950 p-5 text-white shadow-mm-card">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF5722]">
                Opportunity Score
              </p>
              <p className="mt-2 text-5xl font-extrabold tracking-tight">
                {opportunity.opportunity_score != null
                  ? Math.round(Number(opportunity.opportunity_score))
                  : "—"}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Commerciële verbeterkans op website/CRO.
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-sky-300">
                Meneer Marketing Fit
              </p>
              <p className="mt-2 text-5xl font-extrabold tracking-tight">
                {opportunity.meneer_marketing_fit_score != null
                  ? Math.round(Number(opportunity.meneer_marketing_fit_score))
                  : "—"}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Hoe goed dit bedrijf als klant bij onze dienstverlening past.
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {opportunity.opportunity_verdict ? (
              <Badge tone={verdictTone(opportunity.opportunity_verdict)}>
                {opportunity.opportunity_verdict.replaceAll("_", " ")}
              </Badge>
            ) : (
              <Badge tone="neutral">Nog niet geaudit</Badge>
            )}
            {opportunity.audit_type === "EXACT_PAID_FUNNEL" ||
            opportunity.cro_readiness_level === "EXACT_PAID_FUNNEL" ? (
              <Badge tone="brand">EXACT PAID FUNNEL</Badge>
            ) : null}
            {opportunity.audit_type === "HIGH_CONFIDENCE_PRODUCT_TARGET" ||
            opportunity.cro_readiness_level === "HIGH_CONFIDENCE_TARGET" ? (
              <Badge tone="sky">HIGH CONFIDENCE TARGET</Badge>
            ) : null}
          </div>
          <p className="mt-3 text-xs text-slate-400">
            Audit confidence:{" "}
            {opportunity.audit_confidence != null
              ? `${Math.round(Number(opportunity.audit_confidence))}/100`
              : "Onbekend"}
          </p>
          {(opportunity.audit_type === "HIGH_CONFIDENCE_PRODUCT_TARGET" ||
            opportunity.cro_readiness_level === "HIGH_CONFIDENCE_TARGET") &&
            !technicalAuditFailure && (
            <p className="mt-3 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
              Specifieke paid landing niet bewezen. Geen ad/landing match-score.
            </p>
          )}
          {technicalAuditFailure ? (
            <p className="mt-3 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-100">
              CRO-audit technisch geblokkeerd. Opportunity Score telt niet mee.
            </p>
          ) : null}
          {opportunity.brand_alias_mismatch ? (
            <p className="mt-3 rounded-lg border border-sky-400/40 bg-sky-500/10 px-3 py-2 text-xs text-sky-100">
              {opportunity.brand_alias_note ??
                "Paid keyword lijkt gericht op andere/voormalige merknaam"}
            </p>
          ) : null}
        </div>
      </div>

      {(screenshotUrls.mobile || screenshotUrls.desktop) && (
        <div className="mb-6 grid gap-4 lg:grid-cols-2">
          <Panel title="Mobile screenshot">
            {screenshotUrls.mobile ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={screenshotUrls.mobile}
                alt="Mobile CRO screenshot"
                className="mx-auto max-h-[640px] rounded-xl border border-mm-border"
              />
            ) : (
              <EmptyValue label="Geen mobile screenshot" />
            )}
          </Panel>
          <Panel title="Desktop screenshot">
            {screenshotUrls.desktop ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={screenshotUrls.desktop}
                alt="Desktop CRO screenshot"
                className="w-full rounded-xl border border-mm-border"
              />
            ) : (
              <EmptyValue label="Geen desktop screenshot" />
            )}
          </Panel>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        <div className="space-y-6">
          <Panel title="Bronbetrouwbaarheid">
            <div className="mb-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Google Ads brand
                </p>
                <p className="mt-1 text-sm font-bold text-slate-900">
                  {brand.confirmed_google_advertiser || brand.transparency_confirmed
                    ? "CONFIRMED"
                    : "NOT CONFIRMED"}
                </p>
                <p className="mt-1 text-xs text-slate-500">Transparency / brand-level</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Search target
                </p>
                <p className="mt-1 text-sm font-bold text-slate-900">
                  {evidence.paidSearch?.status === "exact"
                    ? "Exact paid"
                    : "Unresolved"}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Shopping target
                </p>
                <p className="mt-1 text-sm font-bold text-slate-900">{shoppingStatusLabel}</p>
                <p className="mt-1 text-xs text-slate-500">
                  Specific listing paid:{" "}
                  {isExactShoppingPaid || evidence.paidShopping?.specificListingPaid
                    ? "PROVEN"
                    : "NOT PROVEN"}
                </p>
              </div>
            </div>

            <div className="mb-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 p-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Product match confidence
                </p>
                <p className="mt-1 text-sm font-bold text-slate-900">
                  {listingConf != null ? `${Math.round(Number(listingConf))}/100` : "n/a"}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 p-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Paid evidence confidence
                </p>
                <p className="mt-1 text-sm font-bold text-slate-900">
                  {paidConf != null ? `${Math.round(Number(paidConf))}/100` : "n/a"}
                </p>
              </div>
            </div>

            <dl>
              <KeyValue
                label="Brand confirmation"
                value={
                  evidence.transparency ||
                  brand.transparency_confirmed ||
                  brand.confirmed_google_advertiser
                    ? "Transparency ✅"
                    : "Niet bevestigd"
                }
              />
              <KeyValue
                label="Paid keyword"
                value={
                  (paidTarget?.keyword as string | undefined) ??
                  primaryKeyword?.keyword ?? <EmptyValue label="Onbekend" />
                }
              />
              {paidTarget?.channel === "SHOPPING" ||
              opportunity.ground_truth_source_type?.startsWith("GOOGLE_SHOPPING") ? (
                <>
                  <KeyValue
                    label="Shopping product"
                    value={
                      (paidTarget?.ad_title as string | undefined) ??
                      opportunity.ad_headline ?? <EmptyValue />
                    }
                  />
                  <KeyValue
                    label="Seller"
                    value={(paidTarget?.seller as string | undefined) ?? <EmptyValue />}
                  />
                  <KeyValue
                    label="Price"
                    value={
                      paidTarget?.price != null
                        ? `${paidTarget.price}${paidTarget.currency ? ` ${paidTarget.currency}` : ""}`
                        : <EmptyValue />
                    }
                  />
                </>
              ) : null}
              <KeyValue
                label="Paid source"
                value={
                  opportunity.ground_truth_source_type ??
                  opportunity.source_type ?? <EmptyValue />
                }
              />
              <KeyValue
                label="CRO readiness"
                value={
                  opportunity.cro_readiness_level?.replaceAll("_", " ") ??
                  (exactPaidTarget ? "EXACT PAID FUNNEL" : "DISCOVERY ONLY")
                }
              />
              <KeyValue
                label="Landing URL"
                value={(() => {
                  const url =
                    (paidTarget?.landing_url as string | undefined) ??
                    opportunity.landing_url ??
                    null;
                  return url ? (
                    <span className="break-all">{url}</span>
                  ) : (
                    <EmptyValue label="Geen exacte paid landing" />
                  );
                })()}
              />
              <KeyValue
                label="Source quality"
                value={
                  opportunity.source_quality_score != null ? (
                    <span className="font-extrabold">
                      {Math.round(Number(opportunity.source_quality_score))}/100
                    </span>
                  ) : (
                    <EmptyValue label="Nog niet gevalideerd" />
                  )
                }
              />
              <KeyValue
                label="Data freshness"
                value={
                  paidFreshness ? (
                    `Paid target data: ${paidFreshness}`
                  ) : (
                    <EmptyValue label="Nog geen Labs/Shopping paid target" />
                  )
                }
              />
              <KeyValue
                label="Discovery"
                value={
                  evidence.discovery?.popularProductsCandidate || isDiscoveryOnly
                    ? "popular_products / discovery candidate"
                    : "—"
                }
              />
              <KeyValue
                label="Keyword confidence"
                value={
                  opportunity.primary_keyword_confidence != null
                    ? `${Math.round(Number(opportunity.primary_keyword_confidence))}/100 · ${
                        opportunity.primary_keyword_reason ?? "n/a"
                      }`
                    : <EmptyValue label="Nog niet gevalideerd" />
                }
              />
              <KeyValue
                label="CRO ready (paid funnel)"
                value={opportunity.cro_ready ? "JA" : "NEE"}
              />
            </dl>
            {!exactPaidTarget ? (
              <p className="mt-3 text-xs text-amber-700">
                Exacte Shopping listing zonder target-level paid proof is geen paid funnel.
                Dual-mode CRO: EXACT_PAID_FUNNEL of HIGH_CONFIDENCE_PRODUCT_TARGET.
              </p>
            ) : null}
            {auditInvalid ? (
              <p className="mt-2 text-xs text-rose-700">
                Historische audit gemarkeerd als invalid (
                {audit?.invalid_reason ?? "pre_ground_truth_source_association"}). Telt
                niet mee in metrics.
              </p>
            ) : null}
          </Panel>

          <Panel title="Waarom gevonden">
            <dl>
              <KeyValue
                label={foundViaReliable ? "Gevonden via" : "Mogelijk gevonden via"}
                value={primaryKeyword?.keyword ?? <EmptyValue label="Onbekend" />}
              />
              <KeyValue
                label="Categorie"
                value={primaryKeyword?.category ?? <EmptyValue label="Niet beschikbaar" />}
              />
              <KeyValue
                label="Supporting keywords"
                value={
                  keywords.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {keywords.map((kw) => (
                        <Badge key={kw.id} tone="sky">
                          {kw.keyword}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <EmptyValue label="Geen supporting keywords" />
                  )
                }
              />
              <KeyValue
                label="Google Ads"
                value={
                  opportunity.paid_confirmed
                    ? `Confirmed${brand.confirmation_source ? ` · ${brand.confirmation_source}` : ""}`
                    : signalLabel(opportunity.paid_signal_type)
                }
              />
              <KeyValue
                label="Ad headline"
                value={opportunity.ad_headline ?? <EmptyValue label="Geen headline" />}
              />
              <KeyValue
                label="Ad description"
                value={opportunity.ad_description ?? <EmptyValue label="Geen description" />}
              />
              <KeyValue
                label="Oorspronkelijke landing URL"
                value={
                  opportunity.landing_url ? (
                    <span className="break-all">{opportunity.landing_url}</span>
                  ) : (
                    <EmptyValue label="Geen landing URL (vaak Shopping/popular_products)" />
                  )
                }
              />
              <KeyValue
                label="Resolved product URL"
                value={
                  page?.final_url || opportunity.resolved_url ? (
                    <a
                      href={page?.final_url ?? opportunity.resolved_url ?? "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="break-all text-mm-sky-deep hover:underline"
                    >
                      {page?.final_url ?? opportunity.resolved_url}
                    </a>
                  ) : (
                    <EmptyValue label="Geen product gevonden" />
                  )
                }
              />
            </dl>
          </Panel>

          <Panel title="Commercial signals">
            <dl>
              <KeyValue label="Business type" value={brand.business_type} />
              <KeyValue
                label="Platform"
                value={
                  brand.platform && brand.platform !== "UNKNOWN"
                    ? `${brand.platform} (${formatConfidence(brand.platform_confidence)})`
                    : brand.platform_candidate && brand.platform_candidate !== "UNKNOWN"
                      ? `Candidate ${brand.platform_candidate}`
                      : "Onbekend"
                }
              />
              <KeyValue label="Maturity" value={formatScore(brand.business_maturity_score)} />
              <KeyValue label="Retailer scale" value={formatScore(brand.retailer_scale_score)} />
              <KeyValue
                label="Price"
                value={
                  page?.price != null
                    ? formatPrice(page.price, page.currency)
                    : <EmptyValue label="Geen prijs gevonden" />
                }
              />
              <KeyValue label="Reviews" value={formatReviews(page?.review_count)} />
              <KeyValue label="Rating" value={formatRating(page?.rating)} />
              <KeyValue
                label="Qualification"
                value={brand.qualification_reason ?? <EmptyValue />}
              />
            </dl>
          </Panel>

          <Panel title="Commercial Fit">
            <dl>
              <KeyValue
                label="Product relationship"
                value={
                  opportunity.product_merchant_relationship ? (
                    <Badge
                      tone={
                        opportunity.product_merchant_relationship === "OWN_BRAND"
                          ? "success"
                          : opportunity.product_merchant_relationship === "RESELLER_PRODUCT"
                            ? "warn"
                            : "neutral"
                      }
                    >
                      {formatProductRelationship(opportunity.product_merchant_relationship)}
                    </Badge>
                  ) : (
                    <EmptyValue label="Nog niet geclassificeerd" />
                  )
                }
              />
              <KeyValue
                label="Recommended project"
                value={
                  opportunity.recommended_project_type ? (
                    <span className="font-bold text-slate-900">
                      {formatProjectType(opportunity.recommended_project_type)}
                    </span>
                  ) : (
                    <EmptyValue />
                  )
                }
              />
              <KeyValue
                label="Project reason"
                value={
                  opportunity.recommended_project_reason ?? <EmptyValue />
                }
              />
              <KeyValue
                label="Full rebuild potential"
                value={
                  opportunity.full_rebuild_potential != null
                    ? Math.round(Number(opportunity.full_rebuild_potential))
                    : <EmptyValue />
                }
              />
              <KeyValue
                label="PDP improvement potential"
                value={
                  opportunity.pdp_improvement_potential != null
                    ? Math.round(Number(opportunity.pdp_improvement_potential))
                    : <EmptyValue />
                }
              />
              <KeyValue
                label="Relationship confidence"
                value={
                  opportunity.product_merchant_relationship_confidence != null
                    ? Math.round(
                        Number(opportunity.product_merchant_relationship_confidence)
                      )
                    : <EmptyValue />
                }
              />
            </dl>
          </Panel>

          <Panel title="Outreach">
            <dl className="mb-4">
              <KeyValue
                label="Eligible"
                value={
                  opportunity.outreach_eligible ? (
                    <Badge tone="success">Yes</Badge>
                  ) : (
                    <Badge tone="neutral">No</Badge>
                  )
                }
              />
              <KeyValue
                label="Reason"
                value={
                  opportunity.outreach_eligible_reason ?? <EmptyValue />
                }
              />
              <KeyValue
                label="Priority"
                value={
                  opportunity.outreach_priority_score != null
                    ? Math.round(Number(opportunity.outreach_priority_score))
                    : <EmptyValue />
                }
              />
              <KeyValue
                label="Status"
                value={opportunity.outreach_status ?? <EmptyValue />}
              />
              <KeyValue
                label="Contact"
                value={
                  preferredContact?.email ? (
                    <span>
                      {preferredContact.first_name
                        ? `${preferredContact.first_name} · `
                        : ""}
                      {preferredContact.email}
                      {preferredContact.email_type
                        ? ` (${preferredContact.email_type})`
                        : ""}
                    </span>
                  ) : (
                    <EmptyValue label="Contact niet gevonden" />
                  )
                }
              />
              <KeyValue
                label="Contact confidence"
                value={
                  preferredContact?.contact_confidence != null
                    ? Math.round(Number(preferredContact.contact_confidence))
                    : <EmptyValue />
                }
              />
            </dl>
            <GenerateOutreachButton
              opportunityId={id}
              eligible={Boolean(opportunity.outreach_eligible)}
              latestDraftId={latestDraft?.id ?? null}
            />
          </Panel>

          {audit && technicalAuditFailure ? (
            <Panel title="CRO audit">
              <div className="rounded-xl border border-amber-300 bg-amber-50 p-4">
                <p className="text-sm font-extrabold text-amber-950">
                  Technisch geblokkeerd
                </p>
                <p className="mt-1 text-sm text-amber-900">
                  {opportunity.page_health_reason ??
                    audit.page_health_reason ??
                    audit.invalid_reason ??
                    "Pagina niet betrouwbaar te crawlen"}
                </p>
                <p className="mt-2 text-xs text-amber-800">
                  Status: {opportunity.cro_audit_status ?? audit.status} · Page health:{" "}
                  {opportunity.page_health_status ?? audit.page_health_status ?? "ERROR"} ·
                  Screenshot:{" "}
                  {opportunity.screenshot_quality ?? audit.screenshot_quality ?? "INVALID"}
                </p>
                <p className="mt-3 text-xs text-amber-800">
                  Geen CRO quality-scores getoond: een error/challenge-pagina is geen
                  slechte webshop.
                </p>
                <div className="mt-4">
                  <RetryAuditButton opportunityId={opportunity.id} />
                </div>
              </div>
            </Panel>
          ) : audit ? (
            <>
              <Panel title="CRO intelligence">
                <div className="grid gap-2 sm:grid-cols-2">
                  {Object.entries(croScores)
                    .filter(([key]) =>
                      isHighConfidenceAudit ? key !== "ad_landing_match_quality" : true
                    )
                    .map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between rounded-xl bg-mm-bg px-3 py-2 text-sm"
                    >
                      <span className="text-slate-500">
                        {key.replaceAll("_", " ")}
                      </span>
                      <span className="font-extrabold text-slate-900">
                        {value == null ? "n/a" : Math.round(Number(value))}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-xl bg-mm-bg p-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                      CRO gap
                    </p>
                    <p className="text-xl font-extrabold">{opportunity.cro_gap ?? "—"}</p>
                  </div>
                  <div className="rounded-xl bg-mm-bg p-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                      Ad/landing gap
                    </p>
                    <p className="text-xl font-extrabold">
                      {isHighConfidenceAudit
                        ? "n/a"
                        : (opportunity.ad_landing_gap ?? "—")}
                    </p>
                  </div>
                  <div className="rounded-xl bg-mm-bg p-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                      Rebuild
                    </p>
                    <p className="text-xl font-extrabold">
                      {opportunity.rebuild_potential ?? "—"}
                    </p>
                  </div>
                </div>
              </Panel>

              <Panel title="Conversion leaks">
                <div className="space-y-3">
                  {leaks.length === 0 ? (
                    <EmptyValue label="Geen conversion leaks" />
                  ) : (
                    leaks
                      .filter((leak) => {
                        const status = validationByTitle.get(leak.title)?.status;
                        return status !== "UNSUPPORTED";
                      })
                      .map((leak, index) => {
                        const validation = validationByTitle.get(leak.title);
                        return (
                      <div
                        key={`${leak.title}-${index}`}
                        className="rounded-xl border border-mm-border bg-mm-bg p-4"
                      >
                        <div className="mb-2 flex flex-wrap gap-2">
                          <p className="font-extrabold text-slate-900">{leak.title}</p>
                          <Badge
                            tone={
                              leak.severity === "CRITICAL" || leak.severity === "HIGH"
                                ? "danger"
                                : leak.severity === "MEDIUM"
                                  ? "warn"
                                  : "neutral"
                            }
                          >
                            {leak.severity}
                          </Badge>
                          {validation?.status ? (
                            <Badge
                              tone={
                                validation.status === "SUPPORTED"
                                  ? "success"
                                  : validation.status === "QUESTIONABLE"
                                    ? "warn"
                                    : "danger"
                              }
                            >
                              {validation.status}
                            </Badge>
                          ) : null}
                        </div>
                        <p className="text-sm text-slate-600">
                          <span className="font-bold text-slate-400">Evidence · </span>
                          {leak.evidence}
                        </p>
                        <p className="mt-2 text-sm text-slate-600">
                          <span className="font-bold text-slate-400">Why · </span>
                          {leak.why_it_matters}
                        </p>
                        <p className="mt-2 text-sm text-slate-600">
                          <span className="font-bold text-slate-400">Fix · </span>
                          {leak.recommended_fix}
                        </p>
                        {validation?.reason ? (
                          <p className="mt-2 text-xs text-slate-400">
                            Validatie · {validation.reason}
                          </p>
                        ) : null}
                        <div className="mt-3">
                          <AiFeedbackButtons
                            brandId={brand.id}
                            opportunityId={opportunity.id}
                            auditId={audit?.id}
                            targetType="conversion_leak"
                            targetKey={leak.title ?? `leak-${index}`}
                            originalPayload={leak}
                          />
                        </div>
                      </div>
                        );
                      })
                  )}
                </div>
              </Panel>

              <Panel title="Strengths">
                <div className="space-y-3">
                  {strengths.length === 0 ? (
                    <EmptyValue label="Geen strengths genoteerd" />
                  ) : (
                    strengths.map((item, index) => (
                      <div
                        key={`${item.title}-${index}`}
                        className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4"
                      >
                        <p className="font-extrabold text-slate-900">{item.title}</p>
                        <p className="mt-1 text-sm text-slate-600">{item.evidence}</p>
                      </div>
                    ))
                  )}
                </div>
              </Panel>
            </>
          ) : (
            <Panel title="CRO intelligence">
              <p className="text-sm text-slate-500">
                Nog geen CRO-audit voor deze opportunity. Run{" "}
                <code className="rounded bg-mm-bg px-1.5 py-0.5 text-xs">
                  npm run audit:opportunities
                </code>
                .
              </p>
            </Panel>
          )}
        </div>

        <div className="space-y-6">
          <Panel title="Audit retry">
            <dl className="mb-4 space-y-2 text-sm">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Status
                </p>
                <p className="font-bold text-slate-900">
                  {opportunity.cro_audit_status ?? "Niet geaudit"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Retry count
                </p>
                <p className="font-bold text-slate-900">
                  {opportunity.audit_retry_count != null
                    ? opportunity.audit_retry_count
                    : "—"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Laatste poging
                </p>
                <p className="font-bold text-slate-900">
                  {formatDate(opportunity.last_audit_attempt_at)}
                </p>
              </div>
              {opportunity.last_audit_error ? (
                <div className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-800">
                  {opportunity.last_audit_error}
                </div>
              ) : null}
            </dl>
            {technicalAuditFailure || opportunity.cro_audit_status === "NEEDS_RETRY" ? (
              <>
                <p className="mb-3 text-sm text-slate-600">
                  Probeer opnieuw wanneer de target-URL weer gezond laadt. Geen DataForSEO.
                </p>
                <RetryAuditButton opportunityId={opportunity.id} />
              </>
            ) : (
              <p className="text-sm text-slate-500">Geen open retry nodig.</p>
            )}
            {audit ? (
              <div className="mt-4 border-t border-slate-100 pt-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                  Classificatie feedback
                </p>
                <AiFeedbackButtons
                  brandId={brand.id}
                  opportunityId={opportunity.id}
                  auditId={audit.id}
                  targetType="classification"
                  targetKey={opportunity.opportunity_verdict ?? "verdict"}
                  originalPayload={{
                    verdict: opportunity.opportunity_verdict,
                    score: opportunity.opportunity_score,
                  }}
                />
              </div>
            ) : null}
          </Panel>
          {audit && !technicalAuditFailure ? (
            <>
              {isHighConfidenceAudit ? (
                <Panel title="Ad → landing match">
                  <p className="text-sm text-amber-800">
                    Specifieke paid landing niet bewezen. Ad/landing score niet van toepassing.
                  </p>
                </Panel>
              ) : (
                <Panel title="Ad → landing match">
                  <p className="text-sm leading-relaxed text-slate-600">
                    {(adLanding.summary as string) || <EmptyValue />}
                  </p>
                  <div className="mt-4 space-y-2">
                    {[
                      "message_continuity",
                      "keyword_relevance",
                      "product_relevance",
                      "offer_continuity",
                      "primary_benefit_continuity",
                      "expectation_match",
                    ].map((key) => (
                      <div
                        key={key}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-slate-500">{key.replaceAll("_", " ")}</span>
                        <span className="font-bold">
                          {adLanding[key] != null ? Math.round(Number(adLanding[key])) : "—"}
                        </span>
                      </div>
                    ))}
                  </div>
                </Panel>
              )}

              <Panel title="Sales angle">
                <p className="text-sm leading-relaxed text-slate-700">
                  {audit.sales_angle ?? <EmptyValue />}
                </p>
              </Panel>

              <Panel title="Rebuild potential">
                <p className="text-3xl font-extrabold text-slate-900">
                  {opportunity.rebuild_potential ?? "—"}
                  <span className="text-base font-bold text-slate-400">/100</span>
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Model {audit.model ?? "onbekend"} · audit v{audit.audit_version ?? "?"} ·{" "}
                  {formatDate(audit.audited_at)}
                </p>
              </Panel>
            </>
          ) : null}

          <Panel title="Status">
            <StatusActions
              opportunityId={opportunity.id}
              currentStatus={opportunity.status}
            />
          </Panel>

          <Panel title="Website signals">
            <dl>
              <KeyValue
                label="Ecommerce confidence"
                value={formatConfidence(brand.ecommerce_confidence)}
              />
              <KeyValue
                label="Shipping"
                value={
                  (extracted.shippingText as string) || (
                    <EmptyValue label="Niet gedetecteerd" />
                  )
                }
              />
              <KeyValue
                label="Returns"
                value={
                  (extracted.returnsText as string) || (
                    <EmptyValue label="Niet gedetecteerd" />
                  )
                }
              />
            </dl>
          </Panel>

          <Panel title="Supporting ads">
            <div className="space-y-3">
              {ads.map((ad) => {
                if (!ad) return null;
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
                    <p className="font-bold text-slate-900">
                      {(ad.headline as string) || <EmptyValue label="Geen headline" />}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {(ad.description as string) || (
                        <EmptyValue label="Geen description" />
                      )}
                    </p>
                  </div>
                );
              })}
            </div>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
