/**
 * Milestone 9.2 — Load concept prospect pool from existing DB (no new discovery).
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { PilotCandidateRow } from "./selectPremiumDtcPilot.js";
import type { OutreachScoringInput, CroDataSource } from "./outreachScoring.js";
import {
  computeCurrentPdpQualityScore,
  type ConceptFirstPdpSignals,
} from "./currentPdpQuality.js";
import type { CroQualityScores } from "../../types/audit.js";

type BrandRow = {
  id: string;
  name: string | null;
  normalized_domain: string | null;
  business_type: string | null;
  platform: string | null;
  business_maturity_score: number | null;
  retailer_scale_score: number | null;
  confirmed_google_advertiser: boolean | null;
  transparency_confirmed: boolean | null;
  manual_excluded: boolean | null;
  do_not_contact: boolean | null;
  eligibility_status: string | null;
};

type CandidateRow = {
  id: string;
  brand_id: string;
  status: string;
  concept_ready_score: number;
  brand_commerce_model: string;
  catalog_focus_score: number | null;
  concept_asset_readiness_score: number | null;
  pdp_transformation_potential: number | null;
  hero_product_score: number | null;
  primary_concept_product_title: string | null;
  primary_concept_product_url: string | null;
  primary_concept_product_price: number | null;
  suggested_template_family: string | null;
  needs_assets: boolean | null;
  estimated_product_count: number | null;
  estimated_brand_count: number | null;
  product_commercial_signal_score: number | null;
  page_id: string | null;
  opportunity_id: string | null;
};

type OppRow = {
  id: string;
  brand_id: string;
  paid_confirmed: boolean | null;
  resolved_page_id: string | null;
  landing_url: string | null;
  meneer_marketing_fit_score: number | null;
  latest_audit_id: string | null;
};

type PageRow = {
  id: string;
  brand_id: string | null;
  url: string;
  review_count: number | null;
  rating: number | null;
  product_description: string | null;
};

type AuditRow = {
  id: string;
  brand_id: string | null;
  opportunity_id: string | null;
  status: string | null;
  audit_valid: boolean | null;
  audit_confidence: number | null;
  cro_scores: Record<string, number | null> | null;
  conversion_leaks: unknown;
  strengths: unknown;
  meneer_marketing_fit_score: number | null;
  page_health_status: string | null;
  page_representation: Record<string, unknown> | null;
  resolved_url?: string | null;
  findings?: Record<string, unknown> | null;
};

export type ProspectPoolEntry = {
  pilotRow: PilotCandidateRow;
  outreachInput: OutreachScoringInput;
  pageHealthOk: boolean;
  croQualityComposite: number | null;
  categoryHint: string | null;
  adsStatus: string;
  engineeringFixture: boolean;
};

function num(v: unknown): number | null {
  if (v == null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function arrLen(v: unknown): number {
  return Array.isArray(v) ? v.length : 0;
}

function croComposite(cro: Record<string, number | null> | null): number | null {
  if (!cro) return null;
  const parts = [
    num(cro.desktop_cro_quality),
    num(cro.product_presentation_quality),
    num(cro.product_storytelling_quality),
    num(cro.above_fold_quality),
  ].filter((n): n is number => n != null);
  if (!parts.length) return null;
  return Math.round(parts.reduce((a, b) => a + b, 0) / parts.length);
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

function auditUrl(audit: AuditRow | undefined): string | null {
  if (!audit?.page_representation) return null;
  const rep = audit.page_representation as { url?: string };
  return rep.url ?? null;
}

function resolveCroDataSource(
  audit: AuditRow | undefined,
  productUrl: string | null
): CroDataSource {
  if (!audit?.audit_valid || !audit.cro_scores) return "MISSING";
  const keys = Object.keys(audit.cro_scores);
  if (!keys.length) return "MISSING";
  const audited = auditUrl(audit);
  if (productUrl && audited && !urlPathsMatch(audited, productUrl)) {
    return "PROXY";
  }
  if (audit.status === "COMPLETED" || audit.audit_valid) return "AUDITED";
  return "PROXY";
}

function conceptFirstFromAudit(audit: AuditRow | undefined): ConceptFirstPdpSignals | null {
  const findings = audit?.findings;
  if (!findings || typeof findings !== "object") return null;
  const signals = (findings as { concept_first_signals?: ConceptFirstPdpSignals })
    .concept_first_signals;
  return signals ?? null;
}

function pageHealthUsable(audit: AuditRow | undefined, hasProductUrl: boolean): boolean {
  if (!hasProductUrl) return false;
  const status = String(audit?.page_health_status ?? "").toUpperCase();
  if (!status) return true;
  if (status === "HEALTHY" || status === "PARTIAL") return true;
  if (status === "BLOCKED" || status === "ERROR" || status === "EMPTY" || status === "CHALLENGE") {
    return false;
  }
  const auditStatus = String(audit?.status ?? "").toUpperCase();
  if (auditStatus.includes("FAILED")) return false;
  return true;
}

function isExactPaidFunnel(
  opp: OppRow | undefined,
  page: PageRow | undefined,
  productUrl: string | null
): boolean {
  if (!opp?.paid_confirmed || !productUrl) return false;
  const landing = opp.landing_url ?? "";
  const pageUrl = page?.url ?? "";
  if (!landing && !pageUrl) return false;
  try {
    const targetPath = new URL(productUrl).pathname.replace(/\/$/, "");
    const landingPath = landing ? new URL(landing).pathname.replace(/\/$/, "") : "";
    const pagePath = pageUrl ? new URL(pageUrl).pathname.replace(/\/$/, "") : "";
    return landingPath === targetPath || pagePath === targetPath;
  } catch {
    return false;
  }
}

export async function loadConceptProspectPool(
  supabase: SupabaseClient
): Promise<ProspectPoolEntry[]> {
  const { data: candidatesRaw, error: candErr } = await supabase
    .from("coe_concept_candidates")
    .select(
      `id, brand_id, status, concept_ready_score, brand_commerce_model,
       catalog_focus_score, concept_asset_readiness_score, pdp_transformation_potential,
       hero_product_score, primary_concept_product_title, primary_concept_product_url,
       primary_concept_product_price, suggested_template_family, needs_assets,
       estimated_product_count, estimated_brand_count, product_commercial_signal_score,
       page_id, opportunity_id`
    )
    .eq("suggested_template_family", "PREMIUM_DTC")
    .in("status", ["BRIEF_READY", "CONCEPT_CANDIDATE"])
    .gte("concept_ready_score", 50);

  if (candErr) throw candErr;
  const candidates = (candidatesRaw ?? []) as CandidateRow[];
  if (!candidates.length) return [];

  const brandIds = [...new Set(candidates.map((c) => c.brand_id))];

  const [{ data: brandsRaw }, { data: oppsRaw }, { data: pagesRaw }, { data: auditsRaw }] =
    await Promise.all([
      supabase
        .from("brands")
        .select(
          `id, name, normalized_domain, business_type, platform, business_maturity_score,
           retailer_scale_score, confirmed_google_advertiser, transparency_confirmed,
           manual_excluded, do_not_contact, eligibility_status`
        )
        .in("id", brandIds),
      supabase
        .from("opportunities")
        .select(
          `id, brand_id, paid_confirmed, resolved_page_id, landing_url,
           meneer_marketing_fit_score, latest_audit_id`
        )
        .in("brand_id", brandIds),
      supabase
        .from("pages")
        .select(`id, brand_id, url, review_count, rating, product_description`)
        .in("brand_id", brandIds),
      supabase
        .from("audits")
        .select(
          `id, brand_id, opportunity_id, status, audit_valid, audit_confidence, cro_scores,
           conversion_leaks, strengths, meneer_marketing_fit_score, page_health_status,
           page_representation, findings`
        )
        .in("brand_id", brandIds),
    ]);

  const brandById = new Map(
    ((brandsRaw ?? []) as BrandRow[]).map((b) => [b.id, b])
  );
  const oppsByBrand = new Map<string, OppRow[]>();
  for (const o of (oppsRaw ?? []) as OppRow[]) {
    const list = oppsByBrand.get(o.brand_id) ?? [];
    list.push(o);
    oppsByBrand.set(o.brand_id, list);
  }
  const pageById = new Map(((pagesRaw ?? []) as PageRow[]).map((p) => [p.id, p]));
  const auditsByBrand = new Map<string, AuditRow[]>();
  for (const a of (auditsRaw ?? []) as AuditRow[]) {
    if (!a.brand_id) continue;
    const list = auditsByBrand.get(a.brand_id) ?? [];
    list.push(a);
    auditsByBrand.set(a.brand_id, list);
  }

  const entries: ProspectPoolEntry[] = [];

  for (const c of candidates) {
    const brand = brandById.get(c.brand_id);
    if (!brand) continue;

    const opps = oppsByBrand.get(c.brand_id) ?? [];
    const opp =
      opps.find((o) => o.id === c.opportunity_id) ??
      opps.find((o) => o.paid_confirmed) ??
      opps[0];
    const page =
      (c.page_id ? pageById.get(c.page_id) : undefined) ??
      (opp?.resolved_page_id ? pageById.get(opp.resolved_page_id) : undefined);

    const audits = auditsByBrand.get(c.brand_id) ?? [];
    const audit =
      audits.find((a) => a.id === opp?.latest_audit_id) ??
      audits.find((a) => a.opportunity_id === opp?.id) ??
      audits[0];

    const cro = audit?.cro_scores ?? null;
    const croQuality = croComposite(cro);
    const desc = page?.product_description ?? "";
    const domain = brand.normalized_domain ?? "";
    const engineeringFixture = domain === "tensfact.com";

    const exactPaid = isExactPaidFunnel(opp, page, c.primary_concept_product_url);

    let adsStatus = "none";
    if (brand.confirmed_google_advertiser && exactPaid) adsStatus = "confirmed_exact_paid";
    else if (brand.confirmed_google_advertiser) adsStatus = "confirmed_advertiser";
    else if (opp?.paid_confirmed) adsStatus = "paid_opportunity";
    else if (brand.transparency_confirmed) adsStatus = "transparency_confirmed";

    const siteBroken = String(audit?.status ?? "")
      .toUpperCase()
      .includes("FAILED");
    const pageHealthOk = pageHealthUsable(audit, Boolean(c.primary_concept_product_url));

    const croDataSource = resolveCroDataSource(audit, c.primary_concept_product_url);
    const conceptSignals = conceptFirstFromAudit(audit);
    let currentPdpQualityScore: number | null = null;
    if (croDataSource === "AUDITED" && cro) {
      const quality = computeCurrentPdpQualityScore(
        cro as CroQualityScores,
        conceptSignals
      );
      currentPdpQualityScore = quality.score;
    }

    const outreachInput: OutreachScoringInput = {
      domain,
      brandCommerceModel: c.brand_commerce_model,
      platform: brand.platform,
      businessMaturityScore: brand.business_maturity_score,
      retailerScaleScore: brand.retailer_scale_score,
      confirmedGoogleAdvertiser: Boolean(brand.confirmed_google_advertiser),
      paidConfirmed: Boolean(opp?.paid_confirmed),
      transparencyConfirmed: Boolean(brand.transparency_confirmed),
      exactPaidFunnelLikely: exactPaid,
      pdpTransformationPotential: c.pdp_transformation_potential,
      conceptAssetReadinessScore: c.concept_asset_readiness_score,
      catalogFocusScore: c.catalog_focus_score,
      estimatedProductCount: c.estimated_product_count,
      estimatedBrandCount: c.estimated_brand_count,
      heroProductScore: c.hero_product_score,
      productCommercialSignalScore: c.product_commercial_signal_score,
      primaryProductPrice: c.primary_concept_product_price,
      croQualityComposite: croQuality,
      currentPdpQualityScore,
      croDataSource,
      auditConfidence: audit?.audit_confidence ?? null,
      productStorytellingQuality: num(cro?.product_storytelling_quality),
      aboveFoldQuality: num(cro?.above_fold_quality),
      productPresentationQuality: num(cro?.product_presentation_quality),
      trustNearBuyblockQuality: num(cro?.trust_quality),
      // Concept-first audit signals are the sharper read on how premium the
      // page already feels; the CRO scores are the fallback.
      visualDesignQuality:
        conceptSignals?.premium_design_perception ?? num(cro?.visual_design_quality),
      deepDiveQuality:
        conceptSignals?.deep_dive_quality ?? num(cro?.product_presentation_quality),
      conversionLeakCount: arrLen(audit?.conversion_leaks),
      strengthCount: arrLen(audit?.strengths),
      siteTechnicallyBroken: siteBroken,
      mmFitScore:
        num(opp?.meneer_marketing_fit_score) ?? num(audit?.meneer_marketing_fit_score),
      reviewCount: page?.review_count ?? null,
      rating: num(page?.rating),
      productDescriptionLength: desc.length,
      benefitsRichnessHint: desc.length >= 200 || /voordeel|benefit|kenmerk/i.test(desc),
    };

    const pilotRow: PilotCandidateRow = {
      id: c.id,
      brand_id: c.brand_id,
      concept_ready_score: c.concept_ready_score,
      brand_commerce_model: c.brand_commerce_model,
      catalog_focus_score: c.catalog_focus_score,
      concept_asset_readiness_score: c.concept_asset_readiness_score,
      pdp_transformation_potential: c.pdp_transformation_potential,
      hero_product_score: c.hero_product_score,
      primary_concept_product_title: c.primary_concept_product_title,
      primary_concept_product_url: c.primary_concept_product_url,
      primary_concept_product_price: c.primary_concept_product_price,
      suggested_template_family: c.suggested_template_family,
      needs_assets: c.needs_assets,
      status: c.status,
      normalized_domain: domain,
      brand_name: brand.name ?? domain,
      do_not_contact: Boolean(brand.do_not_contact),
      manual_excluded: Boolean(brand.manual_excluded),
      eligibility_status: brand.eligibility_status,
      estimated_product_count: c.estimated_product_count,
      product_commercial_signal_score: c.product_commercial_signal_score,
      business_type: brand.business_type,
      platform: brand.platform,
      opportunity_id: c.opportunity_id ?? opp?.id ?? null,
      page_id: c.page_id ?? opp?.resolved_page_id ?? null,
    };

    entries.push({
      pilotRow,
      outreachInput,
      pageHealthOk,
      croQualityComposite: croQuality,
      categoryHint: brand.business_type,
      adsStatus,
      engineeringFixture,
    });
  }

  return entries;
}
