/**
 * Milestone 9 — score concept candidates from existing DB only.
 * No DataForSEO / Anthropic / live crawls.
 *
 * npm run concepts:score
 */

import { config } from "dotenv";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "../config/env.js";
import {
  BRIEF_READY_MIN_ASSET_SCORE,
  HERO_PRODUCT_MIN_CONFIDENCE,
  type BrandCommerceModel,
  type ConceptStatus,
} from "../config/conceptScoring.js";
import { createSupabaseServerClient } from "../services/supabase/client.js";
import { createRun, completeRun } from "../services/supabase/runsRepository.js";
import { scoreCatalogIntelligence } from "../services/concept/catalogIntelligence.js";
import { scoreOwnBrandIntelligence } from "../services/concept/ownBrandIntelligence.js";
import { detectHeroProducts } from "../services/concept/heroProductDetector.js";
import type { HeroCandidateInput } from "../services/concept/heroProductDetector.js";
import { scoreProductCommercialSignal } from "../services/concept/productCommercialSignal.js";
import { scoreConceptAssetReadiness } from "../services/concept/assetReadiness.js";
import { scorePdpTransformationPotential } from "../services/concept/pdpTransformation.js";
import { computeConceptContrastPotential } from "../services/concept/conceptContrastPotential.js";
import { scoreConceptReady } from "../services/concept/conceptReadyScore.js";
import { suggestTemplateFamily } from "../services/concept/conceptBriefGenerator.js";
import { logger } from "../utils/logger.js";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, "../../");
config({ path: resolve(projectRoot, ".env"), quiet: true });

type BrandRow = {
  id: string;
  name: string | null;
  domain: string | null;
  normalized_domain: string | null;
  business_type: string | null;
  platform: string | null;
  business_maturity_score: number | null;
  retailer_scale_score: number | null;
  pre_fit_score: number | null;
  confirmed_google_advertiser: boolean | null;
  is_ecommerce: boolean | null;
  manual_excluded: boolean | null;
  eligibility_status: string | null;
  crawl_metadata: Record<string, unknown> | null;
  do_not_contact?: boolean | null;
};

type OppRow = {
  id: string;
  brand_id: string;
  landing_url: string | null;
  resolved_url: string | null;
  resolved_page_id: string | null;
  ad_headline: string | null;
  paid_confirmed: boolean | null;
  opportunity_score: number | null;
  product_merchant_relationship: string | null;
  product_merchant_relationship_confidence: number | null;
  product_merchant_relationship_evidence: unknown;
  recommended_project_type: string | null;
  pdp_improvement_potential: number | null;
  full_rebuild_potential: number | null;
  meneer_marketing_fit_score: number | null;
  keyword_id: string | null;
  latest_audit_id: string | null;
};

type PageRow = {
  id: string;
  brand_id: string | null;
  url: string;
  product_name: string | null;
  price: number | null;
  currency: string | null;
  review_count: number | null;
  rating: number | null;
  availability: string | null;
  product_brand: string | null;
  product_description: string | null;
  page_type: string | null;
  extracted_data: Record<string, unknown> | null;
};

type AuditRow = {
  id: string;
  opportunity_id: string | null;
  brand_id: string | null;
  status: string | null;
  score: number | null;
  cro_scores: Record<string, number | null> | null;
  conversion_leaks: unknown;
  strengths: unknown;
  screenshot_paths: Record<string, string | null> | null;
  meneer_marketing_fit_score: number | null;
  page_representation: Record<string, unknown> | null;
};

function num(v: unknown): number | null {
  if (v == null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function arrLen(v: unknown): number {
  return Array.isArray(v) ? v.length : 0;
}

function titleFromUrl(url: string | null): string | null {
  if (!url) return null;
  try {
    const path = new URL(url).pathname;
    const slug = path.split("/").filter(Boolean).pop() ?? "";
    if (!slug || slug.length < 4) return null;
    return decodeURIComponent(slug)
      .replace(/[-_]+/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .slice(0, 120);
  } catch {
    return null;
  }
}

function imageCountFromPage(page: PageRow | null): number | null {
  if (!page?.extracted_data) return null;
  const ed = page.extracted_data;
  const images = ed.images ?? ed.product_images ?? ed.imageUrls;
  if (Array.isArray(images)) return images.length;
  if (typeof ed.image_count === "number") return ed.image_count;
  return null;
}

function categoryHintsForBrand(
  domain: string | null,
  keywords: Array<{ keyword: string; category: string | null }>
): string[] {
  const hints: string[] = [];
  for (const k of keywords) {
    if (k.category) hints.push(k.category);
    if (k.keyword) hints.push(k.keyword);
  }
  const d = (domain ?? "").toLowerCase();
  if (/huid|skin|beauty|cosmetic|body|boozy|currentbody/.test(d)) {
    hints.push("beauty", "skincare");
  }
  if (/huisdier|pet|hond|dog|dier/.test(d)) hints.push("pets");
  if (/dekbed|slaap|sleep|kussen|matras/.test(d)) hints.push("sleep");
  return hints;
}

function deriveStatus(
  score: number,
  needsAssets: boolean,
  existingStatus: string | null
): ConceptStatus {
  // Preserve operator workflow states beyond candidate
  const preserve = new Set([
    "BRIEF_READY",
    "DESIGN_PENDING",
    "READY_FOR_PREVIEW",
    "PREVIEW_READY",
    "APPROVED_FOR_OUTREACH",
    "ARCHIVED",
  ]);
  if (existingStatus && preserve.has(existingStatus)) {
    return existingStatus as ConceptStatus;
  }
  if (score < 50) return "NOT_SUITABLE";
  if (needsAssets) return "CONCEPT_CANDIDATE";
  return "CONCEPT_CANDIDATE";
}

async function main(): Promise<void> {
  const env = loadEnv();
  const supabase = createSupabaseServerClient(env);
  const run = await createRun(supabase, "concepts_score", {
    milestone: "M9",
    apis: { dataforseo: 0, anthropic: 0 },
  });

  try {
    const { data: brandsRaw, error: brandsError } = await supabase
      .from("brands")
      .select(
        `id, name, domain, normalized_domain, business_type, platform,
         business_maturity_score, retailer_scale_score, pre_fit_score,
         confirmed_google_advertiser, is_ecommerce, manual_excluded,
         eligibility_status, crawl_metadata, do_not_contact`
      )
      .or(
        "is_ecommerce.eq.true,pre_fit_score.gte.30,confirmed_google_advertiser.eq.true,platform.eq.SHOPIFY"
      )
      .limit(500);

    if (brandsError) throw brandsError;
    let brands = (brandsRaw ?? []) as BrandRow[];

    const brandIdFilter =
      process.env.M93_SCORE_BRAND_IDS?.split(",").map((s) => s.trim()).filter(Boolean) ??
      [];
    if (brandIdFilter.length) {
      brands = brands.filter((b) => brandIdFilter.includes(b.id));
    }

    const brandIds = brands.map((b) => b.id);
    if (!brandIds.length) {
      logger.info("No brands to score");
      await completeRun(supabase, run.id, "completed", { scored: 0 });
      return;
    }

    const [
      { data: opps },
      { data: pages },
      { data: audits },
      { data: existingCandidates },
      { data: keywords },
    ] = await Promise.all([
      supabase
        .from("opportunities")
        .select(
          `id, brand_id, landing_url, resolved_url, resolved_page_id, ad_headline,
           paid_confirmed, opportunity_score, product_merchant_relationship,
           product_merchant_relationship_confidence, product_merchant_relationship_evidence,
           recommended_project_type, pdp_improvement_potential, full_rebuild_potential,
           meneer_marketing_fit_score, keyword_id, latest_audit_id`
        )
        .in("brand_id", brandIds),
      supabase
        .from("pages")
        .select(
          `id, brand_id, url, product_name, price, currency, review_count, rating,
           availability, product_brand, product_description, page_type, extracted_data`
        )
        .in("brand_id", brandIds),
      supabase
        .from("audits")
        .select(
          `id, opportunity_id, brand_id, status, score, cro_scores, conversion_leaks,
           strengths, screenshot_paths, meneer_marketing_fit_score, page_representation`
        )
        .in("brand_id", brandIds),
      supabase
        .from("coe_concept_candidates")
        .select("id, brand_id, status, manual_product_override, primary_concept_product_title, manual_template_family, operator_note, needs_assets")
        .in("brand_id", brandIds),
      supabase.from("keywords").select("id, keyword, category").limit(500),
    ]);

    const oppByBrand = new Map<string, OppRow[]>();
    for (const o of (opps ?? []) as OppRow[]) {
      const list = oppByBrand.get(o.brand_id) ?? [];
      list.push(o);
      oppByBrand.set(o.brand_id, list);
    }
    const pagesByBrand = new Map<string, PageRow[]>();
    for (const p of (pages ?? []) as PageRow[]) {
      if (!p.brand_id) continue;
      const list = pagesByBrand.get(p.brand_id) ?? [];
      list.push(p);
      pagesByBrand.set(p.brand_id, list);
    }
    const auditsByOpp = new Map<string, AuditRow[]>();
    for (const a of (audits ?? []) as AuditRow[]) {
      if (!a.opportunity_id) continue;
      const list = auditsByOpp.get(a.opportunity_id) ?? [];
      list.push(a);
      auditsByOpp.set(a.opportunity_id, list);
    }
    const existingByBrand = new Map(
      ((existingCandidates ?? []) as Array<{ brand_id: string; [k: string]: unknown }>).map(
        (c) => [c.brand_id, c]
      )
    );
    const kwById = new Map(
      ((keywords ?? []) as Array<{ id: string; keyword: string; category: string | null }>).map(
        (k) => [k.id, k]
      )
    );

    const scoredRows: Array<Record<string, unknown>> = [];
    const ranked: Array<{ domain: string; score: number; verdict: string }> = [];

    for (const brand of brands) {
      if (brand.business_type === "COMPARISON_SITE") {
        // Still score but expect low
      }

      const brandPages = pagesByBrand.get(brand.id) ?? [];
      const brandOpps = oppByBrand.get(brand.id) ?? [];

      // Prefer opportunity with completed audit, else highest opportunity_score
      const rankedOpps = [...brandOpps].sort((a, b) => {
        const aAud = (auditsByOpp.get(a.id) ?? []).some((x) =>
          String(x.status).toUpperCase().includes("COMPLETED")
        )
          ? 1
          : 0;
        const bAud = (auditsByOpp.get(b.id) ?? []).some((x) =>
          String(x.status).toUpperCase().includes("COMPLETED")
        )
          ? 1
          : 0;
        if (bAud !== aAud) return bAud - aAud;
        return (num(b.opportunity_score) ?? 0) - (num(a.opportunity_score) ?? 0);
      });
      const opp = rankedOpps[0] ?? null;

      const oppAudits = opp ? auditsByOpp.get(opp.id) ?? [] : [];
      const audit =
        oppAudits.find((a) => String(a.status).toUpperCase() === "COMPLETED") ??
        oppAudits[0] ??
        null;

      let page: PageRow | null = null;
      if (opp?.resolved_page_id) {
        page = brandPages.find((p) => p.id === opp.resolved_page_id) ?? null;
      }
      if (!page && opp?.resolved_url) {
        page =
          brandPages.find(
            (p) =>
              p.url === opp.resolved_url ||
              p.url.includes(
                (opp.resolved_url ?? "").split("/products/")[1] ?? "___"
              )
          ) ?? null;
      }
      if (!page && opp?.landing_url) {
        page =
          brandPages.find(
            (p) =>
              p.url === opp.landing_url ||
              (opp.landing_url && p.url.includes(opp.landing_url.split("/").pop() ?? "___"))
          ) ?? null;
      }
      if (!page) {
        page =
          brandPages
            .filter((p) => p.product_name && (p.page_type ?? "").toUpperCase().includes("PRODUCT"))
            .sort((a, b) => (num(b.price) ?? 0) - (num(a.price) ?? 0))[0] ?? null;
      }

      const distinctBrands = new Set(
        brandPages.map((p) => p.product_brand).filter(Boolean) as string[]
      ).size;

      const catalog = scoreCatalogIntelligence({
        businessType: brand.business_type,
        retailerScaleScore: brand.retailer_scale_score,
        productMerchantRelationship: opp?.product_merchant_relationship ?? null,
        domain: brand.normalized_domain ?? brand.domain ?? "",
        pageCountForBrand: brandPages.length,
        distinctProductBrandsOnPages: distinctBrands,
        hasProductPage: brandPages.some(
          (p) => (p.page_type ?? "").toUpperCase().includes("PRODUCT") || Boolean(p.product_name)
        ),
        crawlMetadata: brand.crawl_metadata,
        businessMaturityHint: brand.business_maturity_score,
      });

      const ownBrand = scoreOwnBrandIntelligence({
        businessType: brand.business_type,
        productMerchantRelationship: opp?.product_merchant_relationship ?? null,
        productMerchantConfidence: num(
          opp?.product_merchant_relationship_confidence
        ),
        productMerchantEvidence: opp?.product_merchant_relationship_evidence,
        retailerScaleScore: brand.retailer_scale_score,
        domain: brand.normalized_domain ?? brand.domain ?? "",
        productBrand: page?.product_brand ?? null,
        distinctProductBrands: distinctBrands,
      });

      const existing = existingByBrand.get(brand.id) as
        | {
            status: string;
            manual_product_override: boolean;
            primary_concept_product_title: string | null;
            manual_template_family: string | null;
            needs_assets: boolean;
          }
        | undefined;

      const kw = opp?.keyword_id ? kwById.get(opp.keyword_id) : null;
      const pageIsOpportunityTarget =
        Boolean(page) &&
        Boolean(opp) &&
        (page!.id === opp!.resolved_page_id ||
          (opp!.landing_url != null &&
            page!.url.includes(
              opp!.landing_url.split("/").pop()?.split("?")[0] ?? "___"
            )) ||
          (opp!.resolved_url != null && page!.url === opp!.resolved_url));

      const productTitle: string | null =
        existing?.manual_product_override && existing.primary_concept_product_title
          ? existing.primary_concept_product_title
          : pageIsOpportunityTarget && page?.product_name
            ? page.product_name
            : opp?.ad_headline
              ? opp.ad_headline
              : titleFromUrl(opp?.resolved_url ?? opp?.landing_url) ??
                (!pageIsOpportunityTarget ? page?.product_name ?? null : null);

      const heroInputs: HeroCandidateInput[] = brandPages
        .filter((p): p is PageRow & { product_name: string } =>
          Boolean(p.product_name)
        )
        .slice(0, 8)
        .map((p) => ({
          productTitle: p.product_name,
          productUrl: p.url,
          productBrand: p.product_brand,
          price: num(p.price),
          currency: p.currency,
          reviewCount: p.review_count,
          rating: num(p.rating),
          availability: p.availability,
          adHeadline: opp?.ad_headline ?? null,
          keyword: kw?.keyword ?? null,
          paidConfirmed: Boolean(opp?.paid_confirmed),
          isResolvedPage: p.id === page?.id,
          hasScreenshots: Boolean(
            audit?.screenshot_paths &&
              Object.values(audit.screenshot_paths).some(Boolean)
          ),
          descriptionLength: (p.product_description ?? "").length,
          imageCountEstimate: imageCountFromPage(p),
        }));

      if (
        productTitle &&
        !heroInputs.some((h) => h.productTitle === productTitle)
      ) {
        heroInputs.unshift({
          productTitle: productTitle as string,
          productUrl:
            (pageIsOpportunityTarget ? page?.url : null) ??
            opp?.resolved_url ??
            opp?.landing_url ??
            null,
          productBrand: pageIsOpportunityTarget
            ? page?.product_brand ?? null
            : null,
          price: pageIsOpportunityTarget ? num(page?.price) : null,
          currency: pageIsOpportunityTarget ? page?.currency ?? null : null,
          reviewCount: pageIsOpportunityTarget ? page?.review_count ?? null : null,
          rating: pageIsOpportunityTarget ? num(page?.rating) : null,
          availability: pageIsOpportunityTarget
            ? page?.availability ?? null
            : null,
          adHeadline: opp?.ad_headline ?? null,
          keyword: kw?.keyword ?? null,
          paidConfirmed: Boolean(opp?.paid_confirmed),
          isResolvedPage: true,
          hasScreenshots: Boolean(
            audit?.screenshot_paths &&
              Object.values(audit.screenshot_paths).some(Boolean)
          ),
          descriptionLength: pageIsOpportunityTarget
            ? (page?.product_description ?? "").length
            : 0,
          imageCountEstimate: pageIsOpportunityTarget
            ? imageCountFromPage(page)
            : null,
        });
      }

      const hero = detectHeroProducts(heroInputs);
      const cro = audit?.cro_scores ?? {};

      let primaryHero =
        existing?.manual_product_override && existing.primary_concept_product_title
          ? hero.candidates.find(
              (c) => c.product_title === existing.primary_concept_product_title
            ) ??
            ({
              product_title: existing.primary_concept_product_title,
              product_url: page?.url ?? null,
              product_brand: page?.product_brand ?? null,
              price: num(page?.price),
              currency: page?.currency ?? null,
              hero_product_score: 70,
              hero_product_confidence: 80,
              hero_product_reasoning: "Manual operator product override",
              hero_product_evidence: ["manual_override"],
            } as const)
          : hero.primary;

      // Prefer paid/opportunity target product over random catalog sample
      if (!existing?.manual_product_override && productTitle) {
        const targetMatch = hero.candidates.find(
          (c) =>
            c.product_title === productTitle ||
            (opp?.landing_url &&
              c.product_url &&
              c.product_url.includes(
                opp.landing_url.split("/").pop()?.split("?")[0] ?? "___"
              ))
        );
        if (targetMatch) {
          primaryHero = {
            ...targetMatch,
            hero_product_score: Math.min(100, targetMatch.hero_product_score + 12),
            hero_product_confidence: Math.max(
              targetMatch.hero_product_confidence,
              HERO_PRODUCT_MIN_CONFIDENCE
            ),
            hero_product_reasoning: `${targetMatch.hero_product_reasoning} Prioritized as paid/opportunity target.`,
            hero_product_evidence: [
              ...targetMatch.hero_product_evidence,
              "opportunity_target_priority",
            ],
          };
        } else if (opp?.ad_headline || opp?.landing_url) {
          // No page match: still lock to opportunity target (no random fallback)
          primaryHero = {
            product_title: productTitle,
            product_url: opp.resolved_url ?? opp.landing_url,
            product_brand: page?.product_brand ?? null,
            price: num(page?.price),
            currency: page?.currency ?? null,
            hero_product_score: 68,
            hero_product_confidence: 55,
            hero_product_reasoning:
              "Selected from opportunity ad/landing target (no richer page sample).",
            hero_product_evidence: [
              "opportunity_target_priority",
              "no_random_fallback",
            ],
          };
        }
      }

      const commercial = scoreProductCommercialSignal({
        price: primaryHero?.price ?? num(page?.price),
        reviewCount: page?.review_count ?? null,
        rating: num(page?.rating),
        paidOrDiscoveryRelevant: Boolean(
          opp?.paid_confirmed || brand.confirmed_google_advertiser
        ),
        heroProminenceScore: primaryHero?.hero_product_score ?? null,
        availability: page?.availability ?? null,
        descriptionLength: (page?.product_description ?? "").length,
        variantCountEstimate: null,
        purchaseIntentKeyword: Boolean(kw?.keyword),
      });

      const desc = page?.product_description ?? "";
      const assets = scoreConceptAssetReadiness({
        productTitle: primaryHero?.product_title ?? productTitle,
        price: primaryHero?.price ?? num(page?.price),
        descriptionLength: desc.length,
        reviewCount: page?.review_count ?? null,
        rating: num(page?.rating),
        hasLogo: null,
        brandColorsDetected: null,
        imageCount: imageCountFromPage(page),
        highResImagesLikely: null,
        lifestyleImageryLikely: null,
        benefitsPresent: desc.length >= 200 ? true : null,
        featuresPresent: /specificatie|feature|kenmerk/i.test(desc) ? true : null,
        faqPresent: /faq|veelgestelde/i.test(desc) ? true : null,
        deliveryReturnsPresent: /verzending|retour|delivery|return/i.test(desc)
          ? true
          : null,
        specsPresent: /specificatie|afmeting|materiaal/i.test(desc) ? true : null,
        videoPresent: null,
        beforeAfterPresent: /before|after|voor.?na/i.test(desc) ? true : null,
        hasScreenshots: Boolean(
          audit?.screenshot_paths &&
            Object.values(audit.screenshot_paths).some(Boolean)
        ),
      });

      const croQualityParts = [
        num(cro.desktop_cro_quality),
        num(cro.product_presentation_quality),
        num(cro.product_storytelling_quality),
        num(cro.above_fold_quality),
      ].filter((n): n is number => n != null);
      const croQuality =
        croQualityParts.length > 0
          ? Math.round(
              croQualityParts.reduce((a, b) => a + b, 0) / croQualityParts.length
            )
          : num(audit?.score);

      const transform = scorePdpTransformationPotential({
        croQualityScore: croQuality,
        leakCount: arrLen(audit?.conversion_leaks),
        strengthCount: arrLen(audit?.strengths),
        productCommercialSignal: commercial.product_commercial_signal_score,
        assetReadiness: assets.concept_asset_readiness_score,
        catalogFocus: catalog.catalog_focus_score,
        brandCommerceModel: ownBrand.brand_commerce_model,
        retailerScaleScore: brand.retailer_scale_score,
        mmFitScore:
          num(opp?.meneer_marketing_fit_score) ??
          num(audit?.meneer_marketing_fit_score) ??
          num(brand.pre_fit_score),
        siteTechnicallyBroken: String(audit?.status ?? "")
          .toUpperCase()
          .includes("FAILED"),
        storytellingWeak:
          cro.product_storytelling_quality != null
            ? Number(cro.product_storytelling_quality) < 55
            : null,
        aboveFoldWeak:
          cro.above_fold_quality != null
            ? Number(cro.above_fold_quality) < 55
            : null,
        trustNearBuyblockWeak:
          cro.trust_quality != null ? Number(cro.trust_quality) < 55 : null,
        deepDiveWeak:
          cro.product_presentation_quality != null
            ? Number(cro.product_presentation_quality) < 60
            : null,
      });

      // M9.3.4 — will a preview of this page actually look different?
      const contrast = computeConceptContrastPotential({
        currentPdpQuality: croQuality,
        croQualityComposite: croQuality,
        croDataSource: croQuality != null ? "PROXY" : "MISSING",
        auditConfidence: null,
        visualDesignQuality: num(cro.visual_design_quality),
        productStorytellingQuality: num(cro.product_storytelling_quality),
        productPresentationQuality: num(cro.product_presentation_quality),
        deepDiveQuality: num(cro.product_presentation_quality),
        conceptAssetReadiness: assets.concept_asset_readiness_score,
        productCommercialSignal: commercial.product_commercial_signal_score,
        catalogFocus: catalog.catalog_focus_score,
        businessMaturity: brand.business_maturity_score,
        brandCommerceModel: ownBrand.brand_commerce_model,
        productDescriptionLength: desc.length,
        reviewCount: page?.review_count ?? null,
        siteTechnicallyBroken: String(audit?.status ?? "")
          .toUpperCase()
          .includes("FAILED"),
      });

      const mmFit =
        num(opp?.meneer_marketing_fit_score) ??
        num(audit?.meneer_marketing_fit_score) ??
        num(brand.pre_fit_score) ??
        40;

      const googleSignal = brand.confirmed_google_advertiser
        ? 90
        : opp?.paid_confirmed
          ? 70
          : 25;

      const ready = scoreConceptReady({
        mmOrPreFit: mmFit,
        businessMaturity: brand.business_maturity_score ?? 40,
        platform: brand.platform,
        catalogFocus: catalog.catalog_focus_score,
        brandCommerceModel: ownBrand.brand_commerce_model as BrandCommerceModel,
        heroProductScore: primaryHero?.hero_product_score ?? null,
        productCommercialSignal: commercial.product_commercial_signal_score,
        pdpTransformationPotential: transform.pdp_transformation_potential,
        conceptAssetReadiness: assets.concept_asset_readiness_score,
        googleAdvertiserSignal: googleSignal,
        retailerScaleScore: brand.retailer_scale_score,
        isShopify: (brand.platform ?? "").toUpperCase() === "SHOPIFY",
        isWoo: (brand.platform ?? "").toUpperCase() === "WOOCOMMERCE",
        mobileWeak:
          cro.mobile_cro_quality != null
            ? Number(cro.mobile_cro_quality) < 50
            : null,
        buyblockWeak:
          cro.cta_quality != null ? Number(cro.cta_quality) < 50 : null,
        deepDiveWeak:
          cro.product_presentation_quality != null
            ? Number(cro.product_presentation_quality) < 60
            : null,
      });

      const needsAssets =
        assets.concept_asset_readiness_score < BRIEF_READY_MIN_ASSET_SCORE ||
        assets.missing_assets.includes("product_images");

      const status = deriveStatus(
        ready.concept_ready_score,
        needsAssets,
        existing?.status ?? null
      );

      const hints = categoryHintsForBrand(
        brand.normalized_domain,
        kw ? [{ keyword: kw.keyword, category: kw.category }] : []
      );
      const templateFamily =
        (existing?.manual_template_family as
          | "PREMIUM_DTC"
          | "PRODUCT_ENGINEERING"
          | "EDITORIAL_COMMERCE"
          | undefined) ??
        suggestTemplateFamily(hints, ownBrand.brand_commerce_model);

      const row = {
        brand_id: brand.id,
        opportunity_id: opp?.id ?? null,
        page_id: page?.id ?? null,
        status,
        concept_ready_score: ready.concept_ready_score,
        concept_verdict: ready.concept_verdict,
        concept_ready_components: {
          ...ready.components,
          weights: ready.weights,
          retailer_scale_penalty: ready.retailer_scale_penalty,
          formula: ready.formula,
        },
        brand_commerce_model: ownBrand.brand_commerce_model,
        own_brand_ratio_estimate: ownBrand.own_brand_ratio_estimate,
        own_brand_confidence: ownBrand.own_brand_confidence,
        own_brand_evidence: ownBrand.own_brand_evidence,
        estimated_product_count: catalog.estimated_product_count,
        estimated_category_count: catalog.estimated_category_count,
        estimated_brand_count: catalog.estimated_brand_count,
        catalog_focus_score: catalog.catalog_focus_score,
        catalog_size_tier: catalog.catalog_size_tier,
        catalog_confidence: catalog.catalog_confidence,
        catalog_evidence: catalog.evidence,
        primary_concept_product_title: primaryHero?.product_title ?? null,
        primary_concept_product_url: primaryHero?.product_url ?? null,
        primary_concept_product_price: primaryHero?.price ?? null,
        primary_concept_product_currency: primaryHero?.currency ?? null,
        hero_product_score: primaryHero?.hero_product_score ?? null,
        hero_product_confidence: primaryHero?.hero_product_confidence ?? null,
        hero_product_reasoning: primaryHero?.hero_product_reasoning ?? null,
        hero_product_evidence: primaryHero?.hero_product_evidence ?? [],
        hero_candidates: hero.candidates,
        product_commercial_signal_score:
          commercial.product_commercial_signal_score,
        concept_asset_readiness_score: assets.concept_asset_readiness_score,
        asset_readiness_components: assets.asset_readiness_components,
        pdp_transformation_potential: transform.pdp_transformation_potential,
        concept_contrast_potential: contrast.concept_contrast_potential,
        concept_contrast_band: contrast.band,
        concept_contrast_confidence: contrast.confidence,
        concept_contrast_ceiling: contrast.ceilingApplied,
        concept_contrast_evidence: contrast.evidence,
        concept_contrast_computed_at: new Date().toISOString(),
        recommended_concept_type: ready.recommended_concept_type,
        recommended_project_type: opp?.recommended_project_type ?? null,
        suggested_template_family: templateFamily,
        suggested_template_id: null,
        needs_assets: needsAssets,
        scored_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Don't overwrite manual override flags
      if (existing?.manual_product_override) {
        (row as Record<string, unknown>).manual_product_override = true;
      }

      scoredRows.push(row);
      ranked.push({
        domain: brand.normalized_domain ?? brand.domain ?? brand.id,
        score: ready.concept_ready_score,
        verdict: ready.concept_verdict,
      });
    }

    // Upsert in chunks
    for (let i = 0; i < scoredRows.length; i += 25) {
      const chunk = scoredRows.slice(i, i + 25);
      const { error } = await supabase
        .from("coe_concept_candidates")
        .upsert(chunk, { onConflict: "brand_id" });
      if (error) throw error;
    }

    ranked.sort((a, b) => b.score - a.score);
    logger.info("=== CONCEPT READY TOP 15 ===");
    for (const r of ranked.slice(0, 15)) {
      logger.info(`${r.score}\t${r.verdict}\t${r.domain}`);
    }

    await completeRun(supabase, run.id, "completed", {
      scored: scoredRows.length,
      top15: ranked.slice(0, 15),
      dataforseo_cost: 0,
      anthropic_cost: 0,
    });
  } catch (err) {
    await completeRun(supabase, run.id, "failed", {
      error: err instanceof Error ? err.message : String(err),
    });
    throw err;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
