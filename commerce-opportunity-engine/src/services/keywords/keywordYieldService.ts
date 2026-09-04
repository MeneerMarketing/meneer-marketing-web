import type { SupabaseClient } from "@supabase/supabase-js";

export interface KeywordYieldMetrics {
  serpCost: number | null;
  placementsFound: number;
  uniqueDomains: number;
  newDomains: number;
  generalRetailersFound: number;
  comparisonSitesFound: number;
  marketplacesFound: number;
  leadEligibleFound: number;
  shopifyFound: number;
  confirmedAdvertisersFound: number;
  highConfidenceTargetsFound: number;
  exactPaidTargetsFound: number;
  retailerRatio: number | null;
  prospectYieldScore: number | null;
  costPerNewBrand: number | null;
  costPerLeadEligible: number | null;
  costPerShopifyProspect: number | null;
  keywordEfficiencyScore: number | null;
  domains: string[];
}

function safeDiv(numerator: number, denominator: number): number | null {
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator <= 0) {
    return null;
  }
  return Number((numerator / denominator).toFixed(6));
}

/**
 * Compute yield metrics for a keyword from existing ad_occurrences + brands.
 * DataForSEO cost comes from keyword.serp_cost / estimated / scan stats when present.
 */
export async function computeKeywordYield(
  client: SupabaseClient,
  keywordId: string,
  serpCostHint: number | null
): Promise<KeywordYieldMetrics> {
  const { data: ads, error } = await client
    .from("ad_occurrences")
    .select(
      `
      id,
      brand_id,
      ad_signal_type,
      paid_confidence,
      brands (
        id,
        normalized_domain,
        business_type,
        lead_eligible,
        platform,
        first_seen_at,
        confirmed_google_advertiser,
        transparency_confirmed
      )
    `
    )
    .eq("keyword_id", keywordId);

  if (error) {
    throw new Error(`Failed to load ad occurrences for yield: ${error.message}`);
  }

  const brandMap = new Map<
    string,
    {
      domain: string;
      businessType: string | null;
      leadEligible: boolean;
      platform: string | null;
      firstSeenAt: string | null;
      confirmed: boolean;
    }
  >();

  let placements = 0;
  let confirmed = 0;

  for (const row of ads ?? []) {
    placements += 1;
    const brandRaw = row.brands;
    const brand = Array.isArray(brandRaw) ? brandRaw[0] : brandRaw;
    if (!brand?.id) continue;

    const confirmedFlag =
      row.ad_signal_type === "CONFIRMED_PAID" ||
      Boolean(brand.confirmed_google_advertiser) ||
      Boolean(brand.transparency_confirmed);
    if (confirmedFlag) confirmed += 1;

    if (!brandMap.has(brand.id)) {
      brandMap.set(brand.id, {
        domain: String(brand.normalized_domain ?? ""),
        businessType: (brand.business_type as string | null) ?? null,
        leadEligible: Boolean(brand.lead_eligible),
        platform: (brand.platform as string | null) ?? null,
        firstSeenAt: (brand.first_seen_at as string | null) ?? null,
        confirmed: confirmedFlag,
      });
    } else if (confirmedFlag) {
      const existing = brandMap.get(brand.id)!;
      existing.confirmed = true;
    }
  }

  // Opportunity / paid target counts linked via brand + keyword
  const { data: opps } = await client
    .from("opportunities")
    .select("id, audit_type, cro_audit_status, brand_id, is_merged")
    .eq("keyword_id", keywordId);

  let highConfidence = 0;
  let exactPaid = 0;
  for (const opp of opps ?? []) {
    if (opp.is_merged) continue;
    const auditType = String(opp.audit_type ?? "");
    if (auditType === "HIGH_CONFIDENCE_PRODUCT_TARGET") highConfidence += 1;
    if (auditType === "EXACT_PAID_FUNNEL") exactPaid += 1;
  }

  let retailers = 0;
  let comparison = 0;
  let marketplaces = 0;
  let eligible = 0;
  let shopify = 0;
  let newDomains = 0;
  const domains: string[] = [];

  for (const brand of brandMap.values()) {
    domains.push(brand.domain);
    const type = (brand.businessType ?? "UNKNOWN").toUpperCase();
    if (type === "GENERAL_RETAILER") retailers += 1;
    if (type === "COMPARISON_SITE") comparison += 1;
    if (type === "MARKETPLACE") marketplaces += 1;
    if (brand.leadEligible) eligible += 1;
    if ((brand.platform ?? "").toUpperCase() === "SHOPIFY") shopify += 1;
    // Approximate "new" as first_seen within last 2 days of M7 test window when available
    if (brand.firstSeenAt) {
      const ageMs = Date.now() - new Date(brand.firstSeenAt).getTime();
      if (ageMs < 1000 * 60 * 60 * 48) newDomains += 1;
    }
  }

  const uniqueDomains = brandMap.size;
  const retailerHeavy = retailers + comparison + marketplaces;
  const retailerRatio =
    uniqueDomains > 0 ? Number((retailerHeavy / uniqueDomains).toFixed(4)) : null;

  const serpCost = serpCostHint;

  // Prospect yield from actual mix
  let yieldScore: number | null = null;
  if (placements > 0 || uniqueDomains > 0) {
    let y = 20;
    y += Math.min(25, uniqueDomains * 3);
    y += Math.min(30, eligible * 12);
    y += Math.min(20, shopify * 8);
    y += Math.min(10, confirmed * 2);
    y -= Math.min(35, retailers * 5 + comparison * 6 + marketplaces * 8);
    if (uniqueDomains > 0 && eligible === 0 && retailerHeavy >= uniqueDomains * 0.5) {
      y -= 15;
    }
    if (uniqueDomains === 0) y = 10;
    yieldScore = Math.max(0, Math.min(100, Math.round(y)));
  }

  const costPerNewBrand = safeDiv(serpCost ?? NaN, newDomains);
  const costPerLeadEligible = safeDiv(serpCost ?? NaN, eligible);
  const costPerShopify = safeDiv(serpCost ?? NaN, shopify);

  let efficiency: number | null = null;
  if (serpCost != null && serpCost > 0 && uniqueDomains >= 3) {
    const good = eligible + shopify;
    const waste = retailers + comparison + marketplaces;
    efficiency = Math.max(
      0,
      Math.min(100, Math.round(40 + good * 15 - waste * 8 - serpCost * 200))
    );
  }

  return {
    serpCost,
    placementsFound: placements,
    uniqueDomains,
    newDomains,
    generalRetailersFound: retailers,
    comparisonSitesFound: comparison,
    marketplacesFound: marketplaces,
    leadEligibleFound: eligible,
    shopifyFound: shopify,
    confirmedAdvertisersFound: [...brandMap.values()].filter((b) => b.confirmed).length,
    highConfidenceTargetsFound: highConfidence,
    exactPaidTargetsFound: exactPaid,
    retailerRatio,
    prospectYieldScore: yieldScore,
    costPerNewBrand,
    costPerLeadEligible,
    costPerShopifyProspect: costPerShopify,
    keywordEfficiencyScore: efficiency,
    domains,
  };
}
