/**
 * Milestone 9.2.1 — deterministic pre-audit ranking for outreach CRO coverage.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import { M921_MAX_NEW_AUDITS } from "../../config/outreachCroCoverage.js";
import { OWN_BRAND_FIT_SCORES } from "../../config/outreachScoring.js";
import type { AuditCandidate } from "../audit/auditRunner.js";
import { loadAuditCandidateById } from "../audit/auditRunner.js";
import {
  loadConceptProspectPool,
  type ProspectPoolEntry,
} from "./loadConceptProspectPool.js";
import {
  scoreDeepDivePdpFit,
  scoreOutreachConceptFit,
  scoreProjectEconomicFit,
  type CroDataSource,
} from "./outreachScoring.js";
import { scoreEngineeringPilotRow } from "./selectPremiumDtcPilot.js";

const MASSIVE_RETAILER_SCALE = 75;
const STRONG_CONCEPT_MIN_SCORE = 80;
const SUFFICIENT_AUDIT_CONFIDENCE = 55;
const SUFFICIENT_CURRENT_PDP_COVERAGE = 65;

export type OutreachAuditCandidate = {
  entry: ProspectPoolEntry;
  preAuditRank: number;
  rankEvidence: string[];
  opportunityId: string;
  productUrl: string;
  skipReason?: string;
};

function cleanTargetUrl(url: string): string {
  try {
    const u = new URL(url);
    u.searchParams.delete("srsltid");
    u.searchParams.delete("gclid");
    u.searchParams.delete("fbclid");
    return u.toString().replace(/\?$/, "");
  } catch {
    return url;
  }
}

function urlPathsMatch(a: string | null | undefined, b: string | null | undefined): boolean {
  if (!a || !b) return false;
  try {
    return (
      new URL(a).pathname.replace(/\/$/, "").toLowerCase() ===
      new URL(b).pathname.replace(/\/$/, "").toLowerCase()
    );
  } catch {
    return a === b;
  }
}

function ownBrandFitScore(model: string): number {
  return OWN_BRAND_FIT_SCORES[model as keyof typeof OWN_BRAND_FIT_SCORES] ?? 40;
}

function scorePreAuditRank(entry: ProspectPoolEntry): {
  score: number;
  evidence: string[];
} {
  const row = entry.pilotRow;
  const input = entry.outreachInput;
  const engineering = scoreEngineeringPilotRow(row);
  const outreach = scoreOutreachConceptFit(input, engineering);
  const deepDive = scoreDeepDivePdpFit(input);
  const economic = scoreProjectEconomicFit(input);

  const evidence: string[] = [];
  let score = 0;

  score += (row.concept_ready_score ?? 0) * 0.22;
  score += outreach.outreachConceptFitScore * 0.18;
  score += (row.catalog_focus_score ?? 0) * 0.1;
  score += ownBrandFitScore(String(row.brand_commerce_model)) * 0.08;
  score += (row.hero_product_score ?? 0) * 0.1;
  score += row.primary_concept_product_url ? 12 : 0;
  score += (row.concept_asset_readiness_score ?? 0) * 0.12;
  score += (input.businessMaturityScore ?? 0) * 0.06;
  score += outreach.components.googleAdsConfirmation * 0.05;
  score += economic.score * 0.08;
  score += deepDive.score * 0.09;

  if (row.primary_concept_product_url) evidence.push("valid_product_target");
  if ((row.concept_asset_readiness_score ?? 0) >= 60) evidence.push("assets_ready");
  if (input.confirmedGoogleAdvertiser) evidence.push("google_advertiser");

  return { score: Math.round(score), evidence };
}

function needsNewAudit(entry: ProspectPoolEntry): {
  needs: boolean;
  reason: string;
} {
  const source: CroDataSource = entry.outreachInput.croDataSource;

  if (source === "AUDITED" && entry.outreachInput.auditConfidence != null) {
    if (entry.outreachInput.auditConfidence >= SUFFICIENT_AUDIT_CONFIDENCE) {
      return { needs: false, reason: "valid_audited_cro_on_hero_product" };
    }
  }

  if (
    source === "AUDITED" &&
    entry.outreachInput.currentPdpQualityScore != null &&
    entry.outreachInput.currentPdpQualityScore >= SUFFICIENT_CURRENT_PDP_COVERAGE
  ) {
    return { needs: false, reason: "sufficient_current_pdp_quality_audited" };
  }

  return { needs: true, reason: "missing_or_proxy_cro_coverage" };
}

function exclusionReason(entry: ProspectPoolEntry): string | null {
  const row = entry.pilotRow;
  const model = String(row.brand_commerce_model);

  if (row.manual_excluded) return "manual_excluded";
  if (row.do_not_contact) return "do_not_contact";
  if (model === "GENERAL_RESELLER" || model === "MARKETPLACE") {
    return "general_retailer_or_marketplace";
  }

  const retailerScale = entry.outreachInput.retailerScaleScore ?? 0;
  if (retailerScale >= MASSIVE_RETAILER_SCALE) return "massive_retailer";

  if ((row.estimated_product_count ?? 0) >= 800) return "huge_catalog";

  if (!row.primary_concept_product_url) return "missing_hero_product_url";

  if (row.suggested_template_family !== "PREMIUM_DTC") return "not_premium_dtc";

  const statusOk =
    row.status === "BRIEF_READY" ||
    (row.status === "CONCEPT_CANDIDATE" &&
      (row.concept_ready_score ?? 0) >= STRONG_CONCEPT_MIN_SCORE);
  if (!statusOk) return `status_not_eligible:${row.status}`;

  if (entry.outreachInput.siteTechnicallyBroken) return "technical_unusable_target";

  const auditCheck = needsNewAudit(entry);
  if (!auditCheck.needs) return auditCheck.reason;

  return null;
}

export async function buildConceptAuditCandidate(
  supabase: SupabaseClient,
  opportunityId: string,
  productUrl: string
): Promise<AuditCandidate | null> {
  const base = await loadAuditCandidateById(supabase, opportunityId);
  const cleaned = cleanTargetUrl(productUrl);

  if (base) {
    return { ...base, targetUrl: cleaned, resolvedUrl: cleaned };
  }

  const { data: opp, error } = await supabase
    .from("opportunities")
    .select(
      `id, brand_id, landing_url, resolved_url, resolved_page_id, paid_confirmed,
       brands!inner (
         id, normalized_domain, platform, platform_candidate, business_type,
         business_maturity_score, retailer_scale_score, confirmed_google_advertiser,
         manual_excluded, lead_eligible
       ),
       pages ( id, product_name, product_brand, price, currency, review_count, rating, url, final_url )`
    )
    .eq("id", opportunityId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!opp) return null;

  const brand = Array.isArray(opp.brands) ? opp.brands[0] : opp.brands;
  const page = Array.isArray(opp.pages) ? opp.pages[0] : opp.pages;
  if (!brand?.normalized_domain) return null;

  return {
    opportunityId: opp.id as string,
    brandId: opp.brand_id as string,
    domain: brand.normalized_domain as string,
    auditType: "HIGH_CONFIDENCE_PRODUCT_TARGET",
    croReadinessLevel: "HIGH_CONFIDENCE_TARGET",
    croAuditEligible: true,
    landingUrl: (opp.landing_url as string | null) ?? null,
    resolvedUrl: cleaned,
    targetUrl: cleaned,
    pageId: (page?.id as string | null) ?? (opp.resolved_page_id as string | null),
    productName: (page?.product_name as string | null) ?? null,
    productBrand: (page?.product_brand as string | null) ?? null,
    price: page?.price != null ? Number(page.price) : null,
    currency: (page?.currency as string | null) ?? null,
    reviewCount: page?.review_count != null ? Number(page.review_count) : null,
    rating: page?.rating != null ? Number(page.rating) : null,
    productResolutionConfidence: null,
    adHeadline: null,
    adDescription: null,
    paidSignalType: null,
    paidConfirmed: Boolean(opp.paid_confirmed),
    confirmedGoogleAdvertiser: Boolean(brand.confirmed_google_advertiser),
    keyword: null,
    category: null,
    confirmationSource: null,
    platform: (brand.platform as string | null) ?? null,
    platformCandidate: (brand.platform_candidate as string | null) ?? null,
    businessType: (brand.business_type as string | null) ?? null,
    maturity: brand.business_maturity_score != null ? Number(brand.business_maturity_score) : null,
    retailerScale:
      brand.retailer_scale_score != null ? Number(brand.retailer_scale_score) : null,
    sourceQualityScore: null,
    groundTruthSourceType: null,
    sourceType: null,
    manualExcluded: Boolean(brand.manual_excluded),
    leadEligible: Boolean(brand.lead_eligible),
    exactPaidEvidence: false,
  };
}

export async function selectOutreachAuditCandidates(
  supabase: SupabaseClient,
  maxAudits = M921_MAX_NEW_AUDITS
): Promise<{
  selected: OutreachAuditCandidate[];
  skipped: OutreachAuditCandidate[];
}> {
  const pool = await loadConceptProspectPool(supabase);
  const candidates: OutreachAuditCandidate[] = [];

  for (const entry of pool) {
    const row = entry.pilotRow;
    const exclusion = exclusionReason(entry);
    const productUrl = row.primary_concept_product_url ?? "";
    const opportunityId = row.opportunity_id ?? "";

    if (exclusion) {
      candidates.push({
        entry,
        preAuditRank: 0,
        rankEvidence: [exclusion],
        opportunityId,
        productUrl,
        skipReason: exclusion,
      });
      continue;
    }

    const { score, evidence } = scorePreAuditRank(entry);
    candidates.push({
      entry,
      preAuditRank: score,
      rankEvidence: evidence,
      opportunityId,
      productUrl,
    });
  }

  const skipped = candidates.filter((c) => c.skipReason);
  const eligible = candidates
    .filter((c) => !c.skipReason)
    .sort((a, b) => b.preAuditRank - a.preAuditRank);

  const selected = eligible.slice(0, maxAudits);

  for (const c of selected) {
    const auditUrl =
      c.entry.outreachInput.croDataSource === "AUDITED"
        ? c.productUrl
        : null;
    if (auditUrl && !urlPathsMatch(auditUrl, c.productUrl)) {
      c.rankEvidence.push("reaudit_wrong_url");
    }
  }

  return { selected, skipped };
}
