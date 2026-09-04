import { getSupabase } from "./supabase";
import type {
  ActivityLogRow,
  BrandRow,
  CategoryProspectYieldRow,
  ControlledScaleRunRow,
  DiscoveryFunnelMetrics,
  EngineSettingRow,
  KeywordCategoryOverview,
  KeywordCategoryRow,
  KeywordIntelligenceRow,
  KeywordIntelligenceSummary,
  KeywordProspectingQuality,
  NeedsAttentionRow,
  OperatorNoteRow,
  OperatorTagRow,
  OpportunityRow,
  OpportunityStatus,
  PageRow,
} from "./types";
import { one } from "./types";

const SERP_COST_FALLBACK = 0.002;

const KEYWORD_INTELLIGENCE_SELECT =
  "id, keyword, category, cluster, seed_keyword, normalized_keyword, search_volume, cpc, competition, competition_index, commercial_intent_score, product_intent_score, keyword_quality_score, volume_tier, keyword_source, discovery_status, active, approved, rejected, paused, rejection_reason, last_scanned_at, last_metrics_update, estimated_serp_cost, keyword_intent_type, keyword_intent_confidence, prospecting_value_score, prospecting_tier, prospect_yield_score, eligible_for_auto_approval, placements_found, unique_domains_found, lead_eligible_found, shopify_found, general_retailers_found, comparison_sites_found, retailer_ratio, serp_cost, cost_per_lead_eligible, cost_per_shopify_prospect, discovery_priority_score";

async function fetchIdsInChunks(
  ids: string[],
  chunkSize: number,
  fetchChunk: (chunk: string[]) => Promise<string[]>
): Promise<string[]> {
  const out: string[] = [];
  for (let i = 0; i < ids.length; i += chunkSize) {
    const chunk = ids.slice(i, i + chunkSize);
    out.push(...(await fetchChunk(chunk)));
  }
  return out;
}

export type OverviewStats = {
  brandsDiscovered: number;
  confirmedAdvertisers: number;
  leadEligible: number;
  shopifyStores: number;
  resolvedProducts: number;
  excludedRetailers: number;
  opportunities: number;
  recentRuns: number;
  highPriority: number;
  contactImmediately: number;
  averageOpportunityScore: number | null;
  auditedCount: number;
  exactPaidFunnels: number;
  highConfidenceTargets: number;
  discoveryOnly: number;
};

export async function getOverviewStats(): Promise<OverviewStats> {
  const supabase = getSupabase();

  const [
    brands,
    confirmed,
    eligible,
    shopify,
    products,
    excluded,
    opportunities,
    runs,
    highPriority,
    contactImmediately,
    audited,
    scored,
    exactPaidFunnels,
    highConfidenceTargets,
    discoveryOnly,
  ] = await Promise.all([
    supabase.from("brands").select("id", { count: "exact", head: true }),
    // Semantic brand-level confirmation only — never rely on stale transparency_confirmed alone.
    // PostgREST boolean OR filters have silently returned count=0; use eq + status OR.
    supabase
      .from("brands")
      .select("id", { count: "exact", head: true })
      .or(
        "confirmed_google_advertiser.eq.true,transparency_status.eq.CONFIRMED"
      ),
    supabase
      .from("brands")
      .select("id", { count: "exact", head: true })
      .eq("eligibility_status", "LEAD_ELIGIBLE"),
    supabase
      .from("brands")
      .select("id", { count: "exact", head: true })
      .eq("platform", "SHOPIFY"),
    supabase
      .from("pages")
      .select("id", { count: "exact", head: true })
      .eq("page_type", "PRODUCT")
      .not("product_name", "is", null),
    supabase
      .from("brands")
      .select("id", { count: "exact", head: true })
      .eq("eligibility_status", "EXCLUDED"),
    supabase.from("opportunities").select("id", { count: "exact", head: true }),
    supabase
      .from("runs")
      .select("id", { count: "exact", head: true })
      .gte(
        "created_at",
        new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
      ),
    supabase
      .from("opportunities")
      .select("id", { count: "exact", head: true })
      .eq("opportunity_verdict", "HIGH_PRIORITY")
      .eq("cro_audit_status", "COMPLETED")
      .not("opportunity_score", "is", null),
    supabase
      .from("opportunities")
      .select("id", { count: "exact", head: true })
      .eq("opportunity_verdict", "CONTACT_IMMEDIATELY")
      .eq("cro_audit_status", "COMPLETED")
      .not("opportunity_score", "is", null),
    supabase
      .from("opportunities")
      .select("id", { count: "exact", head: true })
      .eq("cro_audit_status", "COMPLETED")
      .not("opportunity_score", "is", null),
    supabase
      .from("opportunities")
      .select("opportunity_score")
      .eq("cro_audit_status", "COMPLETED")
      .not("opportunity_score", "is", null),
    supabase
      .from("opportunities")
      .select("id", { count: "exact", head: true })
      .eq("cro_readiness_level", "EXACT_PAID_FUNNEL"),
    supabase
      .from("opportunities")
      .select("id", { count: "exact", head: true })
      .eq("cro_readiness_level", "HIGH_CONFIDENCE_TARGET"),
    supabase
      .from("opportunities")
      .select("id", { count: "exact", head: true })
      .eq("cro_readiness_level", "DISCOVERY_ONLY"),
  ]);

  if (confirmed.error) {
    throw new Error(
      `Confirmed advertisers count failed: ${confirmed.error.message}`
    );
  }

  const scores = (scored.data ?? [])
    .map((r) => Number(r.opportunity_score))
    .filter((n) => !Number.isNaN(n));
  const averageOpportunityScore =
    scores.length > 0
      ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
      : null;

  return {
    brandsDiscovered: brands.count ?? 0,
    confirmedAdvertisers: confirmed.count ?? 0,
    leadEligible: eligible.count ?? 0,
    shopifyStores: shopify.count ?? 0,
    resolvedProducts: products.count ?? 0,
    excludedRetailers: excluded.count ?? 0,
    opportunities: opportunities.count ?? 0,
    recentRuns: runs.count ?? 0,
    highPriority: highPriority.count ?? 0,
    contactImmediately: contactImmediately.count ?? 0,
    averageOpportunityScore,
    auditedCount: audited.count ?? 0,
    exactPaidFunnels: exactPaidFunnels.count ?? 0,
    highConfidenceTargets: highConfidenceTargets.count ?? 0,
    discoveryOnly: discoveryOnly.count ?? 0,
  };
}

export async function getRecentOpportunities(limit = 8): Promise<OpportunityRow[]> {
  const supabase = getSupabase();

  // Prefer commercially interesting opportunities for the overview strip
  const { data: preferred, error: preferredError } = await supabase
    .from("opportunities")
    .select(
      `
      *,
      brands!inner (
        id, name, normalized_domain, business_type, platform, platform_candidate,
        lead_eligible, eligibility_status, manual_excluded, confirmed_google_advertiser, transparency_confirmed,
        business_maturity_score, retailer_scale_score
      ),
      pages (
        id, product_name, price, currency, review_count, rating, page_type, final_url
      ),
      keywords!opportunities_keyword_id_fkey ( id, keyword, category )
    `
    )
    .eq("brands.eligibility_status", "LEAD_ELIGIBLE")
    .eq("brands.manual_excluded", false)
    .eq("paid_confirmed", true)
    .or("is_merged.is.null,is_merged.eq.false")
    .order("last_seen_at", { ascending: false, nullsFirst: false })
    .limit(limit);

  if (preferredError) throw new Error(preferredError.message);
  if ((preferred?.length ?? 0) >= limit) {
    return (preferred ?? []) as OpportunityRow[];
  }

  const { data, error } = await supabase
    .from("opportunities")
    .select(
      `
      *,
      brands (
        id, name, normalized_domain, business_type, platform, platform_candidate,
        lead_eligible, eligibility_status, manual_excluded, confirmed_google_advertiser, transparency_confirmed,
        business_maturity_score, retailer_scale_score
      ),
      pages (
        id, product_name, price, currency, review_count, rating, page_type, final_url
      ),
      keywords!opportunities_keyword_id_fkey ( id, keyword )
    `
    )
    .or("is_merged.is.null,is_merged.eq.false")
    .order("last_seen_at", { ascending: false, nullsFirst: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  const preferredIds = new Set((preferred ?? []).map((row) => row.id as string));
  const merged = [
    ...((preferred ?? []) as OpportunityRow[]),
    ...((data ?? []) as OpportunityRow[]).filter((row) => !preferredIds.has(row.id)),
  ].slice(0, limit);

  return merged;
}

export type OpportunityQuickView =
  | "best"
  | "shopify"
  | "mmFit85"
  | "opp85"
  | "exactPaid"
  | "highConf"
  | "needsRetry"
  | "notAudited"
  | "shortlisted"
  | "favorites";

export type OpportunityFilters = {
  q?: string;
  status?: string;
  confirmed?: string;
  platform?: string;
  businessType?: string;
  leadEligible?: string;
  hasProduct?: string;
  maturityMin?: string;
  scaleMax?: string;
  keywordCategory?: string;
  verdict?: string;
  audited?: string;
  auditStatus?: string;
  scoreMin?: string;
  confidenceMin?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
  favorite?: string;
  shortlisted?: string;
  quickView?: string;
  tagSlug?: string;
};

function applyMergedFilter<T extends { or: (filters: string) => T }>(query: T): T {
  return query.or("is_merged.is.null,is_merged.eq.false");
}

function applyQuickViewFilter(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any,
  quickView: string
) {
  switch (quickView as OpportunityQuickView) {
    case "best":
      return query
        .eq("cro_audit_status", "COMPLETED")
        .not("opportunity_score", "is", null)
        .order("opportunity_score", { ascending: false, nullsFirst: false });
    case "shopify":
      return query.eq("brands.platform", "SHOPIFY");
    case "mmFit85":
      return query.gte("meneer_marketing_fit_score", 85);
    case "opp85":
      return query.gte("opportunity_score", 85);
    case "exactPaid":
      return query.or(
        "cro_readiness_level.eq.EXACT_PAID_FUNNEL,audit_type.eq.EXACT_PAID_FUNNEL"
      );
    case "highConf":
      return query.or(
        "cro_readiness_level.eq.HIGH_CONFIDENCE_TARGET,audit_type.eq.HIGH_CONFIDENCE_PRODUCT_TARGET"
      );
    case "needsRetry":
      return query.in("cro_audit_status", ["NEEDS_RETRY", "FAILED_TECHNICAL", "BLOCKED"]);
    case "notAudited":
      return query.or(
        "cro_audit_status.is.null,cro_audit_status.eq.PENDING,cro_audit_status.eq.NOT_AUDITED"
      );
    case "shortlisted":
      return query.eq("is_shortlisted", true);
    case "favorites":
      return query.eq("is_favorite", true);
    default:
      return query;
  }
}

export async function listOpportunities(filters: OpportunityFilters): Promise<{
  rows: OpportunityRow[];
  total: number;
  page: number;
  pageSize: number;
}> {
  const supabase = getSupabase();
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = Math.min(50, Math.max(10, filters.pageSize ?? 20));
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase.from("opportunities").select(
    `
      *,
      brands!inner (
        id, name, normalized_domain, business_type, platform, platform_candidate,
        platform_confidence, lead_eligible, eligibility_status, manual_excluded, confirmed_google_advertiser,
        transparency_confirmed, business_maturity_score, retailer_scale_score,
        is_ecommerce, qualification_reason, do_not_contact, is_favorite
      ),
      pages (
        id, product_name, price, currency, review_count, rating, page_type,
        final_url, product_resolution_confidence, product_resolution_source
      ),
      keywords!opportunities_keyword_id_fkey ( id, keyword, category )
    `,
    { count: "exact" }
  );

  query = applyMergedFilter(query);

  if (filters.favorite === "true") {
    query = query.eq("is_favorite", true);
  }
  if (filters.shortlisted === "true") {
    query = query.eq("is_shortlisted", true);
  }
  if (filters.quickView) {
    query = applyQuickViewFilter(query, filters.quickView);
  }
  if (filters.tagSlug) {
    const { data: tag } = await supabase
      .from("operator_tags")
      .select("id")
      .eq("slug", filters.tagSlug)
      .maybeSingle();
    if (tag?.id) {
      const { data: tagged } = await supabase
        .from("operator_opportunity_tags")
        .select("opportunity_id")
        .eq("tag_id", tag.id);
      const ids = (tagged ?? []).map((row) => row.opportunity_id as string);
      if (ids.length === 0) {
        return { rows: [], total: 0, page, pageSize };
      }
      query = query.in("id", ids);
    } else {
      return { rows: [], total: 0, page, pageSize };
    }
  }

  if (filters.status) {
    query = query.eq("status", filters.status);
  }
  if (filters.confirmed === "true") {
    query = query.eq("paid_confirmed", true);
  }
  if (filters.confirmed === "false") {
    query = query.eq("paid_confirmed", false);
  }
  if (filters.platform === "SHOPIFY") {
    query = query.eq("brands.platform", "SHOPIFY");
  }
  if (filters.platform === "WOOCOMMERCE") {
    query = query.eq("brands.platform_candidate", "WOOCOMMERCE");
  }
  if (filters.businessType) {
    query = query.eq("brands.business_type", filters.businessType);
  }
  if (filters.leadEligible === "true") {
    query = query.eq("brands.lead_eligible", true);
  }
  if (filters.leadEligible === "false") {
    query = query.eq("brands.lead_eligible", false);
  }
  if (filters.hasProduct === "true") {
    query = query.not("resolved_page_id", "is", null);
  }
  if (filters.hasProduct === "false") {
    query = query.is("resolved_page_id", null);
  }
  if (filters.maturityMin) {
    query = query.gte("brands.business_maturity_score", Number(filters.maturityMin));
  }
  if (filters.scaleMax) {
    query = query.lte("brands.retailer_scale_score", Number(filters.scaleMax));
  }
  if (filters.keywordCategory) {
    query = query.eq("keywords.category", filters.keywordCategory);
  }
  if (filters.verdict) {
    query = query.eq("opportunity_verdict", filters.verdict);
  }
  if (filters.audited === "true") {
    query = query.eq("cro_audit_status", "COMPLETED").not("opportunity_score", "is", null);
  }
  if (filters.audited === "false") {
    query = query.or(
      "cro_audit_status.is.null,cro_audit_status.eq.PENDING,cro_audit_status.eq.NOT_AUDITED"
    );
  }
  if (filters.auditStatus === "completed") {
    query = query.eq("cro_audit_status", "COMPLETED");
  }
  if (filters.auditStatus === "needs_retry") {
    query = query.in("cro_audit_status", ["NEEDS_RETRY", "FAILED_TECHNICAL"]);
  }
  if (filters.auditStatus === "blocked") {
    query = query.eq("cro_audit_status", "BLOCKED");
  }
  if (filters.auditStatus === "not_audited") {
    query = query.or(
      "cro_audit_status.is.null,cro_audit_status.eq.PENDING,cro_audit_status.eq.NOT_AUDITED"
    );
  }
  if (filters.scoreMin) {
    query = query.gte("opportunity_score", Number(filters.scoreMin));
  }
  if (filters.confidenceMin) {
    query = query.gte("audit_confidence", Number(filters.confidenceMin));
  }
  if (filters.q) {
    const q = filters.q.trim();
    query = query.or(
      `ad_headline.ilike.%${q}%,landing_url.ilike.%${q}%,resolved_url.ilike.%${q}%`
    );
  }

  switch (filters.sort) {
    case "best":
      query = query
        .order("opportunity_score", { ascending: false, nullsFirst: false })
        .order("meneer_marketing_fit_score", { ascending: false, nullsFirst: false });
      break;
    case "score":
      query = query.order("opportunity_score", { ascending: false, nullsFirst: false });
      break;
    case "mmFit":
      query = query.order("meneer_marketing_fit_score", {
        ascending: false,
        nullsFirst: false,
      });
      break;
    case "maturity":
      query = query.order("business_maturity_score", {
        ascending: false,
        foreignTable: "brands",
        nullsFirst: false,
      });
      break;
    case "keywords":
      query = query.order("supporting_keyword_count", { ascending: false });
      break;
    case "price":
      query = query.order("price", {
        ascending: false,
        foreignTable: "pages",
        nullsFirst: false,
      });
      break;
    case "reviews":
      query = query.order("review_count", {
        ascending: false,
        foreignTable: "pages",
        nullsFirst: false,
      });
      break;
    default:
      query = query.order("last_seen_at", { ascending: false, nullsFirst: false });
  }

  const { data, error, count } = await query.range(from, to);
  if (error) throw new Error(error.message);

  return {
    rows: (data ?? []) as OpportunityRow[],
    total: count ?? 0,
    page,
    pageSize,
  };
}

export async function getOpportunityDetail(id: string) {
  const supabase = getSupabase();

  const { data: opportunity, error } = await supabase
    .from("opportunities")
    .select(
      `
      *,
      brands (*),
      pages (*),
      keywords!opportunities_keyword_id_fkey ( id, keyword, category )
    `
    )
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);

  const { data: adLinks } = await supabase
    .from("opportunity_ad_occurrences")
    .select(
      `
      ad_occurrence_id,
      ad_occurrences (
        id, headline, description, landing_url, displayed_url, ad_signal_type,
        paid_confidence, confirmation_source, found_at, observed_at, source, rank,
        keywords ( id, keyword, category )
      )
    `
    )
    .eq("opportunity_id", id);

  const { data: keywordLinks } = await supabase
    .from("opportunity_keywords")
    .select("keyword_id, keywords ( id, keyword, category )")
    .eq("opportunity_id", id);

  let audit = null;
  if (opportunity.latest_audit_id) {
    const { data } = await supabase
      .from("audits")
      .select("*")
      .eq("id", opportunity.latest_audit_id)
      .maybeSingle();
    audit = data;
  }

  const technicalStatuses = new Set([
    "FAILED_TECHNICAL",
    "BLOCKED",
    "NEEDS_RETRY",
  ]);
  const keepTechnicalLatest =
    technicalStatuses.has(String(opportunity.cro_audit_status ?? "")) ||
    technicalStatuses.has(String(audit?.status ?? ""));

  // Prefer a valid completed CRO audit only when the opportunity is not in a technical failure state.
  if ((!audit || audit.audit_valid === false) && !keepTechnicalLatest) {
    const { data } = await supabase
      .from("audits")
      .select("*")
      .eq("opportunity_id", id)
      .in("status", ["COMPLETED", "completed"])
      .eq("audit_valid", true)
      .order("audited_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (data) audit = data;
  }

  let paidTarget = null;
  if (opportunity.paid_search_target_id) {
    const { data } = await supabase
      .from("paid_search_targets")
      .select("*")
      .eq("id", opportunity.paid_search_target_id)
      .maybeSingle();
    paidTarget = data;
  }

  const bucket = process.env.CRO_SCREENSHOT_BUCKET ?? "opportunity-screenshots";
  const paths = (audit?.screenshot_paths ?? {}) as Record<string, string | null>;
  const screenshotUrls: Record<string, string | null> = {
    mobile: null,
    desktop: null,
  };

  for (const key of ["mobile", "desktop"] as const) {
    const path = paths[key];
    if (!path) continue;
    const { data } = await supabase.storage.from(bucket).createSignedUrl(path, 3600);
    screenshotUrls[key] = data?.signedUrl ?? null;
  }

  return {
    opportunity: opportunity as OpportunityRow,
    ads: (adLinks ?? []).map((row) => one(row.ad_occurrences)).filter(Boolean),
    keywords: (keywordLinks ?? [])
      .map((row) => one(row.keywords))
      .filter(Boolean) as Array<{ id: string; keyword: string; category?: string | null }>,
    audit,
    paidTarget,
    screenshotUrls,
  };
}

export async function updateOpportunityStatus(
  id: string,
  status: OpportunityStatus
): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from("opportunities")
    .update({
      status,
      status_updated_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function listBrands(filters: {
  q?: string;
  leadEligible?: string;
  eligibility?: string;
  page?: number;
}): Promise<{ rows: BrandRow[]; total: number; page: number }> {
  const supabase = getSupabase();
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = 24;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase.from("brands").select("*", { count: "exact" });

  if (filters.eligibility) {
    query = query.eq("eligibility_status", filters.eligibility);
  } else if (filters.leadEligible === "true") {
    query = query.eq("eligibility_status", "LEAD_ELIGIBLE");
  } else if (filters.leadEligible === "false") {
    query = query.neq("eligibility_status", "LEAD_ELIGIBLE");
  }
  if (filters.q) {
    const q = filters.q.trim();
    query = query.or(`name.ilike.%${q}%,normalized_domain.ilike.%${q}%,domain.ilike.%${q}%`);
  }

  const { data, error, count } = await query
    .order("last_seen_at", { ascending: false, nullsFirst: false })
    .range(from, to);

  if (error) throw new Error(error.message);
  return { rows: (data ?? []) as BrandRow[], total: count ?? 0, page };
}

export async function getBrandDetail(id: string) {
  const supabase = getSupabase();

  const { data: brand, error } = await supabase
    .from("brands")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);

  const [{ data: opportunities }, { data: ads }, { data: pages }] = await Promise.all([
    supabase
      .from("opportunities")
      .select(
        "*, pages ( product_name, price, currency ), keywords!opportunities_keyword_id_fkey ( keyword )"
      )
      .eq("brand_id", id)
      .or("is_merged.is.null,is_merged.eq.false")
      .order("last_seen_at", { ascending: false }),
    supabase
      .from("ad_occurrences")
      .select(
        "id, headline, description, landing_url, ad_signal_type, found_at, keywords ( keyword )"
      )
      .eq("brand_id", id)
      .order("found_at", { ascending: false })
      .limit(50),
    supabase
      .from("pages")
      .select("*")
      .eq("brand_id", id)
      .order("updated_at", { ascending: false }),
  ]);

  return {
    brand: brand as BrandRow,
    opportunities: (opportunities ?? []) as OpportunityRow[],
    ads: ads ?? [],
    pages: (pages ?? []) as PageRow[],
  };
}

export async function getDiscoveryData(filters: {
  q?: string;
  signal?: string;
  page?: number;
}) {
  const supabase = getSupabase();
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = 30;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase.from("ad_occurrences").select(
    `
      id, headline, description, landing_url, displayed_url, ad_signal_type,
      paid_confidence, confirmation_source, found_at, serp_item_type, source,
      brands ( id, name, normalized_domain, confirmed_google_advertiser, transparency_confirmed ),
      keywords ( id, keyword )
    `,
    { count: "exact" }
  );

  if (filters.signal) {
    query = query.eq("ad_signal_type", filters.signal);
  }
  if (filters.q) {
    const q = filters.q.trim();
    query = query.or(`headline.ilike.%${q}%,landing_url.ilike.%${q}%`);
  }

  const [{ data, error, count }, { data: keywords }, confirmedBrands] = await Promise.all([
    query.order("found_at", { ascending: false, nullsFirst: false }).range(from, to),
    supabase.from("keywords").select("id, keyword, last_scanned_at, active").order("keyword"),
    supabase
      .from("brands")
      .select("id", { count: "exact", head: true })
      .or(
        "confirmed_google_advertiser.eq.true,transparency_status.eq.CONFIRMED"
      ),
  ]);

  if (error) throw new Error(error.message);
  if (confirmedBrands.error) {
    throw new Error(
      `Confirmed advertisers count failed: ${confirmedBrands.error.message}`
    );
  }

  const signalCounts = await Promise.all([
    supabase
      .from("ad_occurrences")
      .select("id", { count: "exact", head: true })
      .eq("ad_signal_type", "CONFIRMED_PAID"),
    supabase
      .from("ad_occurrences")
      .select("id", { count: "exact", head: true })
      .eq("ad_signal_type", "PAID_CANDIDATE"),
    supabase
      .from("ad_occurrences")
      .select("id", { count: "exact", head: true })
      .eq("ad_signal_type", "NON_PAID"),
  ]);

  return {
    rows: data ?? [],
    total: count ?? 0,
    page,
    keywords: keywords ?? [],
    confirmedAdvertisers: confirmedBrands.count ?? 0,
    signalCounts: {
      CONFIRMED_PAID: signalCounts[0].count ?? 0,
      PAID_CANDIDATE: signalCounts[1].count ?? 0,
      NON_PAID: signalCounts[2].count ?? 0,
    },
  };
}

export async function getRunsAndUsage() {
  const supabase = getSupabase();
  const { data: runs, error } = await supabase
    .from("runs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) throw new Error(error.message);

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  type CostBucket = {
    dataForSeo: number | null;
    anthropic: number | null;
    hasDataForSeo: boolean;
    hasAnthropic: boolean;
  };

  const emptyBucket = (): CostBucket => ({
    dataForSeo: null,
    anthropic: null,
    hasDataForSeo: false,
    hasAnthropic: false,
  });

  const today = emptyBucket();
  const month = emptyBucket();
  const total = emptyBucket();

  let validAuditCount = 0;
  let anthropicAuditCost = 0;
  let hasAuditCost = false;

  for (const run of runs ?? []) {
    const meta = (run.metadata ?? {}) as Record<string, unknown>;
    const createdAt = run.created_at ? new Date(String(run.created_at)) : null;

    const dfs =
      typeof meta.dataForSeoCost === "number"
        ? meta.dataForSeoCost
        : typeof meta.totalCost === "number"
          ? meta.totalCost
          : null;
    const anth =
      typeof meta.haikuCost === "number"
        ? meta.haikuCost
        : typeof meta.anthropicCost === "number"
          ? meta.anthropicCost
          : null;

    const auditsCompleted =
      typeof meta.auditsCompleted === "number" ? meta.auditsCompleted : null;
    if (auditsCompleted != null && auditsCompleted > 0 && anth !== null) {
      validAuditCount += auditsCompleted;
      anthropicAuditCost += anth;
      hasAuditCost = true;
    }

    const buckets = [total];
    if (createdAt && createdAt >= startOfMonth) buckets.push(month);
    if (createdAt && createdAt >= startOfToday) buckets.push(today);

    for (const bucket of buckets) {
      if (dfs !== null) {
        bucket.dataForSeo = (bucket.dataForSeo ?? 0) + dfs;
        bucket.hasDataForSeo = true;
      }
      if (anth !== null) {
        bucket.anthropic = (bucket.anthropic ?? 0) + anth;
        bucket.hasAnthropic = true;
      }
    }
  }

  const costPerValidAudit =
    hasAuditCost && validAuditCount > 0
      ? anthropicAuditCost / validAuditCount
      : null;

  return {
    runs: (runs ?? []).slice(0, 50),
    usage: {
      dataForSeoToday: today.hasDataForSeo ? today.dataForSeo : null,
      dataForSeoMonth: month.hasDataForSeo ? month.dataForSeo : null,
      dataForSeoTotal: total.hasDataForSeo ? total.dataForSeo : null,
      anthropicToday: today.hasAnthropic ? today.anthropic : null,
      anthropicMonth: month.hasAnthropic ? month.anthropic : null,
      anthropicTotal: total.hasAnthropic ? total.anthropic : null,
      costPerValidAudit,
      validAuditCount: validAuditCount > 0 ? validAuditCount : null,
      runCount: runs?.length ?? 0,
    },
  };
}

export async function listNeedsAttention(limit = 50): Promise<NeedsAttentionRow[]> {
  const supabase = getSupabase();

  const { data: opportunities, error } = await supabase
    .from("opportunities")
    .select(
      `
      id, brand_id, cro_audit_status, page_health_status, last_audit_error,
      audit_retry_count, last_audit_attempt_at,
      brands ( id, normalized_domain, name ),
      pages ( product_name )
    `
    )
    .or("is_merged.is.null,is_merged.eq.false")
    .or(
      "cro_audit_status.in.(FAILED_TECHNICAL,BLOCKED,NEEDS_RETRY),page_health_status.eq.ERROR"
    )
    .order("last_audit_attempt_at", { ascending: false, nullsFirst: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  const { data: invalidAudits } = await supabase
    .from("audits")
    .select(
      `
      id, opportunity_id, audit_valid, invalid_reason, status,
      opportunities (
        id, brand_id, cro_audit_status, page_health_status, last_audit_error,
        audit_retry_count, last_audit_attempt_at, is_merged,
        brands ( normalized_domain, name ),
        pages ( product_name )
      )
    `
    )
    .eq("audit_valid", false)
    .not("opportunity_score", "is", null)
    .order("audited_at", { ascending: false })
    .limit(limit);

  const rows: NeedsAttentionRow[] = [];
  const seen = new Set<string>();

  for (const opp of opportunities ?? []) {
    const brand = one(opp.brands as BrandRow | BrandRow[] | null);
    const page = one(opp.pages as PageRow | PageRow[] | null);
    const issueType =
      opp.cro_audit_status === "BLOCKED"
        ? "BLOCKED"
        : opp.cro_audit_status === "FAILED_TECHNICAL"
          ? "FAILED_TECHNICAL"
          : opp.cro_audit_status === "NEEDS_RETRY"
            ? "NEEDS_RETRY"
            : opp.page_health_status === "ERROR"
              ? "PAGE_HEALTH_ERROR"
              : "ATTENTION";
    const key = `opp:${opp.id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    rows.push({
      id: opp.id as string,
      kind: "opportunity",
      brand_id: opp.brand_id as string,
      opportunity_id: opp.id as string,
      domain: brand?.normalized_domain ?? null,
      product_name: page?.product_name ?? null,
      issue_type: issueType,
      issue_label: issueLabel(issueType),
      cro_audit_status: opp.cro_audit_status as string | null,
      page_health_status: opp.page_health_status as string | null,
      last_audit_error: opp.last_audit_error as string | null,
      audit_retry_count: opp.audit_retry_count as number | null,
      last_audit_attempt_at: opp.last_audit_attempt_at as string | null,
    });
  }

  for (const audit of invalidAudits ?? []) {
    const opp = one(
      audit.opportunities as OpportunityRow | OpportunityRow[] | null
    );
    if (!opp || opp.is_merged) continue;
    const key = `opp:${opp.id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const brand = one(opp.brands as BrandRow | BrandRow[] | null);
    const page = one(opp.pages as PageRow | PageRow[] | null);
    rows.push({
      id: opp.id,
      kind: "opportunity",
      brand_id: opp.brand_id,
      opportunity_id: opp.id,
      domain: brand?.normalized_domain ?? null,
      product_name: page?.product_name ?? null,
      issue_type: "INVALID_AUDIT",
      issue_label: `Ongeldige audit${audit.invalid_reason ? `: ${audit.invalid_reason}` : ""}`,
      cro_audit_status: opp.cro_audit_status,
      page_health_status: opp.page_health_status ?? null,
      last_audit_error: opp.last_audit_error ?? (audit.invalid_reason as string | null),
      audit_retry_count: opp.audit_retry_count ?? null,
      last_audit_attempt_at: opp.last_audit_attempt_at ?? null,
    });
  }

  return rows.slice(0, limit);
}

function issueLabel(issueType: string): string {
  switch (issueType) {
    case "BLOCKED":
      return "Audit geblokkeerd";
    case "FAILED_TECHNICAL":
      return "Technische fout";
    case "NEEDS_RETRY":
      return "Retry nodig";
    case "PAGE_HEALTH_ERROR":
      return "Pagina niet gezond";
    case "INVALID_AUDIT":
      return "Ongeldige audit";
    default:
      return "Aandacht nodig";
  }
}

export async function getSettings(): Promise<EngineSettingRow[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("engine_settings")
    .select("*")
    .order("key", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => {
    const raw = row as {
      key: string;
      value: unknown;
      label?: string | null;
      description?: string | null;
      updated_at?: string | null;
    };
    return {
      key: raw.key,
      value: raw.value,
      label: raw.label ?? null,
      description: raw.label ?? raw.description ?? null,
      updated_at: raw.updated_at ?? null,
    } satisfies EngineSettingRow;
  });
}

export async function getKeywordIntelligenceSummary(): Promise<KeywordIntelligenceSummary> {
  const supabase = getSupabase();

  const [total, qualified, approved, rejected, scanned, approvedCostRows] =
    await Promise.all([
      supabase.from("keywords").select("id", { count: "exact", head: true }),
      supabase
        .from("keywords")
        .select("id", { count: "exact", head: true })
        .eq("discovery_status", "QUALIFIED"),
      supabase
        .from("keywords")
        .select("id", { count: "exact", head: true })
        .eq("approved", true),
      supabase
        .from("keywords")
        .select("id", { count: "exact", head: true })
        .eq("rejected", true),
      supabase
        .from("keywords")
        .select("id", { count: "exact", head: true })
        .eq("discovery_status", "SCANNED"),
      supabase
        .from("keywords")
        .select("estimated_serp_cost")
        .eq("approved", true),
    ]);

  const approvedCount = approved.count ?? 0;
  const costRows = (approvedCostRows.data ?? []) as Array<{
    estimated_serp_cost: number | null;
  }>;

  let estimatedSerpCost = 0;
  if (costRows.length > 0) {
    for (const row of costRows) {
      estimatedSerpCost +=
        row.estimated_serp_cost !== null && row.estimated_serp_cost !== undefined
          ? Number(row.estimated_serp_cost)
          : SERP_COST_FALLBACK;
    }
  } else if (approvedCount > 0) {
    estimatedSerpCost = approvedCount * SERP_COST_FALLBACK;
  }

  return {
    total: total.count ?? 0,
    qualified: qualified.count ?? 0,
    approved: approvedCount,
    rejected: rejected.count ?? 0,
    scanned: scanned.count ?? 0,
    estimatedSerpCost,
  };
}

export type KeywordIntelligenceFilters = {
  category?: string;
  cluster?: string;
  volumeTier?: string;
  quality80?: string;
  commercial80?: string;
  approved?: string;
  notReviewed?: string;
  scanned?: string;
  search?: string;
  intentType?: string;
  prospectingTier?: string;
  primary?: string;
  secondary?: string;
  highProspecting?: string;
  highYield?: string;
  poorYield?: string;
  retailerHeavy?: string;
  nonBrandedOnly?: string;
  page?: number;
  pageSize?: number;
};

export async function getKeywordIntelligenceList(
  filters: KeywordIntelligenceFilters
): Promise<{
  rows: KeywordIntelligenceRow[];
  total: number;
  page: number;
  pageSize: number;
}> {
  const supabase = getSupabase();
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = Math.min(50, Math.max(10, filters.pageSize ?? 30));
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("keywords")
    .select(KEYWORD_INTELLIGENCE_SELECT, { count: "exact" });

  if (filters.category) query = query.eq("category", filters.category);
  if (filters.cluster) query = query.eq("cluster", filters.cluster);
  if (filters.volumeTier) query = query.eq("volume_tier", filters.volumeTier);
  if (filters.quality80 === "true") {
    query = query.gte("keyword_quality_score", 80);
  }
  if (filters.commercial80 === "true") {
    query = query.gte("commercial_intent_score", 80);
  }
  if (filters.approved === "true") query = query.eq("approved", true);
  if (filters.approved === "false") query = query.eq("approved", false);
  if (filters.notReviewed === "true") {
    query = query.eq("approved", false).eq("rejected", false);
  }
  if (filters.scanned === "true") {
    query = query.eq("discovery_status", "SCANNED");
  }
  if (filters.intentType) {
    query = query.eq("keyword_intent_type", filters.intentType);
  }
  if (filters.prospectingTier) {
    query = query.eq("prospecting_tier", filters.prospectingTier);
  }
  if (filters.primary === "true") {
    query = query.eq("prospecting_tier", "PRIMARY");
  }
  if (filters.secondary === "true") {
    query = query.eq("prospecting_tier", "SECONDARY");
  }
  if (filters.highProspecting === "true") {
    query = query.gte("prospecting_value_score", 75);
  }
  if (filters.highYield === "true") {
    query = query.gte("prospect_yield_score", 70);
  }
  if (filters.poorYield === "true") {
    query = query
      .not("prospect_yield_score", "is", null)
      .lt("prospect_yield_score", 40);
  }
  if (filters.retailerHeavy === "true") {
    query = query.gte("retailer_ratio", 0.5);
  }
  if (filters.nonBrandedOnly === "true") {
    query = query.eq("keyword_intent_type", "NON_BRANDED_PRODUCT");
  }
  if (filters.search?.trim()) {
    query = query.ilike("keyword", `%${filters.search.trim()}%`);
  }

  const { data, error, count } = await query
    .order("keyword_quality_score", { ascending: false, nullsFirst: false })
    .order("search_volume", { ascending: false, nullsFirst: false })
    .range(from, to);

  if (error) throw new Error(error.message);

  return {
    rows: (data ?? []) as unknown as KeywordIntelligenceRow[],
    total: count ?? 0,
    page,
    pageSize,
  };
}

export async function getDiscoveryFunnelMetrics(): Promise<DiscoveryFunnelMetrics> {
  const empty: DiscoveryFunnelMetrics = {
    total: 0,
    ecommerce: 0,
    brandOrSpecialist: 0,
    generalRetailer: 0,
    comparisonOrMarketplace: 0,
    shopify: 0,
    leadEligible: 0,
  };

  const supabase = getSupabase();

  const { data: scannedKeywords, error: kwError } = await supabase
    .from("keywords")
    .select("id")
    .or("discovery_status.eq.SCANNED,last_scanned_at.not.is.null");

  if (kwError) throw new Error(kwError.message);

  const keywordIds = (scannedKeywords ?? []).map(
    (row) => (row as { id: string }).id
  );
  if (keywordIds.length === 0) return empty;

  const brandIdList = await fetchIdsInChunks(keywordIds, 100, async (chunk) => {
    const { data, error } = await supabase
      .from("ad_occurrences")
      .select("brand_id")
      .in("keyword_id", chunk)
      .not("brand_id", "is", null);
    if (error) throw new Error(error.message);
    return (data ?? [])
      .map((row) => (row as { brand_id: string | null }).brand_id)
      .filter((id): id is string => Boolean(id));
  });

  const brandIds = Array.from(new Set(brandIdList));
  if (brandIds.length === 0) return empty;

  type FunnelBrand = {
    id: string;
    is_ecommerce: boolean | null;
    business_type: string | null;
    platform: string | null;
    lead_eligible: boolean | null;
    eligibility_status: string | null;
  };

  const brands: FunnelBrand[] = [];
  for (let i = 0; i < brandIds.length; i += 100) {
    const chunk = brandIds.slice(i, i + 100);
    const { data, error } = await supabase
      .from("brands")
      .select(
        "id, is_ecommerce, business_type, platform, lead_eligible, eligibility_status"
      )
      .in("id", chunk);
    if (error) throw new Error(error.message);
    brands.push(...((data ?? []) as FunnelBrand[]));
  }

  const metrics: DiscoveryFunnelMetrics = { ...empty, total: brands.length };

  for (const brand of brands) {
    if (brand.is_ecommerce) metrics.ecommerce += 1;
    const type = (brand.business_type ?? "").toUpperCase();
    if (type === "BRAND" || type === "SPECIALIST_WEBSHOP") {
      metrics.brandOrSpecialist += 1;
    }
    if (type === "GENERAL_RETAILER") metrics.generalRetailer += 1;
    if (type === "COMPARISON_SITE" || type === "MARKETPLACE") {
      metrics.comparisonOrMarketplace += 1;
    }
    if ((brand.platform ?? "").toUpperCase() === "SHOPIFY") {
      metrics.shopify += 1;
    }
    if (
      brand.lead_eligible === true ||
      brand.eligibility_status === "LEAD_ELIGIBLE"
    ) {
      metrics.leadEligible += 1;
    }
  }

  return metrics;
}

export async function getKeywordProspectingQuality(): Promise<KeywordProspectingQuality> {
  const supabase = getSupabase();

  const [topResult, worstResult] = await Promise.all([
    supabase
      .from("keywords")
      .select(KEYWORD_INTELLIGENCE_SELECT)
      .not("prospecting_value_score", "is", null)
      .order("prospecting_value_score", { ascending: false, nullsFirst: false })
      .limit(8),
    supabase
      .from("keywords")
      .select(KEYWORD_INTELLIGENCE_SELECT)
      .not("prospecting_value_score", "is", null)
      .or(
        "discovery_status.eq.SCANNED,last_scanned_at.not.is.null,placements_found.gt.0"
      )
      .order("prospecting_value_score", { ascending: true, nullsFirst: false })
      .limit(8),
  ]);

  if (topResult.error) throw new Error(topResult.error.message);
  if (worstResult.error) throw new Error(worstResult.error.message);

  return {
    top: (topResult.data ?? []) as unknown as KeywordIntelligenceRow[],
    worst: (worstResult.data ?? []) as unknown as KeywordIntelligenceRow[],
  };
}

export async function getKeywordCategories(): Promise<KeywordCategoryRow[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("keyword_categories")
    .select("id, label, active, paused, seed_topics")
    .order("label", { ascending: true });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => {
    const raw = row as {
      id: string;
      label: string;
      active: boolean;
      paused: boolean;
      seed_topics: unknown;
    };
    const seeds = Array.isArray(raw.seed_topics)
      ? (raw.seed_topics as string[])
      : null;
    return {
      id: raw.id,
      label: raw.label,
      active: Boolean(raw.active),
      paused: Boolean(raw.paused),
      seed_topics: seeds,
    } satisfies KeywordCategoryRow;
  });
}

export async function getKeywordCategoryOverview(): Promise<KeywordCategoryOverview[]> {
  const categories = await getKeywordCategories();
  if (categories.length === 0) return [];

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("keywords")
    .select("category, keyword_quality_score, approved");

  if (error) throw new Error(error.message);

  const stats = new Map<
    string,
    { keywordCount: number; highQualityCount: number; approvedCount: number }
  >();

  for (const row of data ?? []) {
    const category = (row as { category: string | null }).category;
    if (!category) continue;
    const current = stats.get(category) ?? {
      keywordCount: 0,
      highQualityCount: 0,
      approvedCount: 0,
    };
    current.keywordCount += 1;
    const quality = (row as { keyword_quality_score: number | null })
      .keyword_quality_score;
    if (quality !== null && quality >= 80) current.highQualityCount += 1;
    if ((row as { approved: boolean | null }).approved) current.approvedCount += 1;
    stats.set(category, current);
  }

  return categories.map((cat) => {
    const s = stats.get(cat.id) ?? {
      keywordCount: 0,
      highQualityCount: 0,
      approvedCount: 0,
    };
    return {
      ...cat,
      ...s,
    };
  });
}

export async function getOperatorNotes(filters: {
  brandId?: string;
  opportunityId?: string;
}): Promise<OperatorNoteRow[]> {
  const supabase = getSupabase();
  let query = supabase
    .from("operator_notes")
    .select("*")
    .order("created_at", { ascending: false });

  if (filters.brandId) query = query.eq("brand_id", filters.brandId);
  if (filters.opportunityId) query = query.eq("opportunity_id", filters.opportunityId);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as OperatorNoteRow[];
}

export async function getActivity(filters: {
  brandId?: string;
  opportunityId?: string;
  limit?: number;
}): Promise<ActivityLogRow[]> {
  const supabase = getSupabase();
  let query = supabase
    .from("operator_activity_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(filters.limit ?? 40);

  if (filters.brandId) query = query.eq("brand_id", filters.brandId);
  if (filters.opportunityId) query = query.eq("opportunity_id", filters.opportunityId);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as ActivityLogRow[];
}

export async function getTags(): Promise<OperatorTagRow[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("operator_tags")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as OperatorTagRow[];
}

export async function getLatestControlledScaleRun(): Promise<ControlledScaleRunRow | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("controlled_scale_runs")
    .select(
      "id, run_id, status, funnel, category_stats, best_prospects, noise_report, dataforseo_cost, anthropic_cost, completed_at, created_at"
    )
    .eq("status", "completed")
    .order("completed_at", { ascending: false, nullsFirst: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;
  return data as unknown as ControlledScaleRunRow;
}

export async function getCategoryProspectYield(): Promise<
  CategoryProspectYieldRow[]
> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("category_prospect_yield")
    .select(
      "category_id, keywords_scanned, serp_cost, domains_found, specialists_brands, prequalified, shopify, confirmed_advertisers, paid_targets, category_prospect_yield_score, last_run_id, updated_at"
    )
    .order("category_prospect_yield_score", {
      ascending: false,
      nullsFirst: false,
    });

  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as CategoryProspectYieldRow[];
}

export async function getEntityTags(filters: {
  brandId?: string;
  opportunityId?: string;
}): Promise<OperatorTagRow[]> {
  const supabase = getSupabase();

  if (filters.brandId) {
    const { data, error } = await supabase
      .from("operator_brand_tags")
      .select("operator_tags ( id, name, slug, created_at )")
      .eq("brand_id", filters.brandId);
    if (error) throw new Error(error.message);
    return (data ?? [])
      .map((row) => one(row.operator_tags as OperatorTagRow | OperatorTagRow[]))
      .filter((tag): tag is OperatorTagRow => Boolean(tag));
  }

  if (filters.opportunityId) {
    const { data, error } = await supabase
      .from("operator_opportunity_tags")
      .select("operator_tags ( id, name, slug, created_at )")
      .eq("opportunity_id", filters.opportunityId);
    if (error) throw new Error(error.message);
    return (data ?? [])
      .map((row) => one(row.operator_tags as OperatorTagRow | OperatorTagRow[]))
      .filter((tag): tag is OperatorTagRow => Boolean(tag));
  }

  return [];
}
