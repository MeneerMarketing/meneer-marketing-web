/**
 * Milestone 9.9.3 — showcase candidate integrity on existing M9.9.2 pool.
 */

import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { config } from "dotenv";

import { loadEnv } from "../config/env.js";
import { createSupabaseServerClient } from "../services/supabase/client.js";
import { createRun, completeRun } from "../services/supabase/runsRepository.js";
import {
  M993_DISCOVERY_VERSION,
  M993_REPORT_PATH,
  M993_DASHBOARD_REPORT_PATH,
  M993_MAX_VALIDATED_PROSPECTS,
} from "../config/showcaseIntegrity.js";
import { M992_REPORT_PATH } from "../config/visualUnderdesignedDiscovery.js";
import { closeCrawlerBrowser, crawlWebsite } from "../services/crawler/websiteCrawler.js";
import { runLightBrandCheck } from "../services/prospect/lightBrandCheck.js";
import { runCatalogFocusCheck } from "../services/prospect/catalogFocusCheck.js";
import { detectPurchaseMode } from "../services/prospect/purchaseModeDetector.js";
import { computeBrandScaleFit } from "../services/prospect/brandScaleFit.js";
import { computeFirstPartyBrandConfidence } from "../services/prospect/firstPartyBrandConfidence.js";
import type { BusinessModelClass } from "../services/prospect/businessModelClassifier.js";
import {
  classifyVisualShowcaseSignal,
  classifyVisualRedesignOpportunity,
} from "../services/prospect/visualRedesignSalesFit.js";
import {
  assessBrandOwnership,
  assessCrossDomainMatches,
  compareProductIdentity,
  computeValidatedVisualSalesFit,
  deriveCurrentSiteImpression,
  extractProductIdentityFingerprint,
  hardenShowcasePageEntity,
  passesShowcaseSalesCandidate,
  withProvenance,
  type CrossDomainProductMatch,
  type CurrentSiteImpression,
  type SameProductVerdict,
  type ShowcaseOwnershipClass,
  type ShowcasePageEntityType,
} from "../services/prospect/showcaseCandidateIntegrity.js";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, "../../");
config({ path: resolve(projectRoot, ".env"), quiet: true });

const M992_INPUT = resolve(projectRoot, M992_REPORT_PATH);
const REPORT_PATH = resolve(projectRoot, M993_REPORT_PATH);
const DASHBOARD_REPORT_PATH = resolve(projectRoot, M993_DASHBOARD_REPORT_PATH);

type M992Row = Record<string, unknown>;

function maturityProxy(light: Awaited<ReturnType<typeof runLightBrandCheck>>): number {
  return Math.round(
    light.ecommerceConfidence * 0.35 +
      light.platformConfidence * 0.15 +
      light.ownBrandSignal * 0.25 +
      (100 - Math.min(light.retailerScaleScore, 85)) * 0.25
  );
}

function catalogProvenance(
  estimate: number | null,
  verified: boolean
): "MEASURED" | "INFERRED" | "UNKNOWN" {
  if (estimate != null) return verified ? "MEASURED" : "INFERRED";
  return "UNKNOWN";
}

function catalogFocusProvenance(value: number | null): "MEASURED" | "DEFAULT" | "UNKNOWN" {
  if (value == null) return "UNKNOWN";
  if (value === 50) return "DEFAULT";
  return "MEASURED";
}

function rejectLabel(failures: string[]): string {
  const map: Record<string, string> = {
    not_product_detail: "CATEGORY",
    retailer_or_reseller: "RESELLER",
    focused_specialist_reseller: "EXTERNAL BRAND",
    insufficient_own_brand_evidence: "INSUFFICIENT OWN-BRAND EVIDENCE",
    business_not_qualified: "BUSINESS NOT QUALIFIED",
    company_scale_low: "LARGE BUSINESS",
    amateur_maturity: "AMATEUR MATURITY",
    material_feasibility_low: "INSUFFICIENT ASSETS",
    modern_enough_visual: "MODERN ENOUGH",
    cro_only_not_visual_showcase: "CRO ONLY",
    distributed_product_not_own_brand: "DISTRIBUTED PRODUCT",
  };
  return failures.map((f) => map[f] ?? f).join("; ");
}

function whyGoodProspect(input: {
  domain: string;
  refinedBusinessModel: ShowcaseOwnershipClass;
  brandOwnershipConfidence: number;
  currentSiteImpression: CurrentSiteImpression;
  visualGap: number | null;
  material: number | null;
  companyScaleFit: number | null;
}): string {
  const parts = [
    `${input.domain} is a focused ecommerce shop with ${input.refinedBusinessModel.replace(/_/g, " ").toLowerCase()} signals (${input.brandOwnershipConfidence}% ownership confidence).`,
    `The PDP reads ${input.currentSiteImpression.replace(/_/g, " ").toLowerCase()}, so a visual rebuild would be legible in outreach.`,
    `Visual gap ${input.visualGap ?? "n/a"} with material feasibility ${input.material ?? "n/a"} gives enough assets to design from.`,
    `Scale fit ${input.companyScaleFit ?? "unknown"} keeps this in small/mid professional territory, not mass retail.`,
  ];
  return parts.join(" ");
}

function relScreenshot(path: string | null | undefined): string | null {
  if (!path) return null;
  const normalized = path.replace(/\\/g, "/");
  const idx = normalized.indexOf("m9.9.2-screenshots/");
  if (idx >= 0) return normalized.slice(idx);
  return normalized;
}

export async function runM993ShowcaseCandidateIntegrity(): Promise<void> {
  const env = loadEnv();
  const supabase = createSupabaseServerClient(env);
  const startedAt = new Date().toISOString();
  const crawlTimeout = 15_000;

  const m992Raw = await readFile(M992_INPUT, "utf8");
  const m992 = JSON.parse(m992Raw) as Record<string, unknown>;
  const showcasePool = (m992.showcaseDesignCandidates as M992Row[]) ?? [];
  const allScreened = (m992.allScreened as M992Row[]) ?? [];

  console.log(`\n=== M9.9.3 SHOWCASE INTEGRITY (${showcasePool.length} visual signals) ===`);

  const run = await createRun(supabase, "m993_showcase_integrity", {
    milestone: "M9.9.3",
    source: M992_INPUT,
    poolSize: showcasePool.length,
  });

  const fingerprints: ReturnType<typeof extractProductIdentityFingerprint>[] = [];
  const reviewed: Array<Record<string, unknown>> = [];

  for (const row of showcasePool) {
    const domain = String(row.domain);
    const productUrl = String(row.productUrl);
    const productTitle = row.productTitle as string | null;
    const heroPrice = row.heroPrice as number | null;
    const m992BusinessModel = row.businessModel as BusinessModelClass;

    const crawl = await crawlWebsite(productUrl, crawlTimeout);
    const html = crawl.status === "success" ? crawl.html : "";

    const fp = extractProductIdentityFingerprint(html, productUrl, domain, productTitle);
    fingerprints.push(fp);

    const entity = hardenShowcasePageEntity({
      productUrl,
      domain,
      html,
      productTitle,
      observedPrice: heroPrice,
    });

    const light = await runLightBrandCheck(domain, crawlTimeout);
    const catalog = await runCatalogFocusCheck(
      domain,
      crawlTimeout,
      light.productLinks,
      light.categoryLinks
    );
    const fpBrand = computeFirstPartyBrandConfidence({
      light,
      domain,
      ownBrandSignal: light.ownBrandSignal,
      catalogFocusScore: catalog.catalogFocusScore,
      catalogVerified: catalog.verified,
      estimatedCatalogSize: catalog.estimatedCatalogSize,
    });
    const maturity = (row.businessMaturityScore as number | null) ?? maturityProxy(light);
    const scale = computeBrandScaleFit({
      businessType: light.businessType,
      isEcommerce: light.isEcommerce,
      retailerScaleScore: light.retailerScaleScore,
      retailerBreadthScore: light.retailerBreadthScore,
      businessMaturityScore: maturity,
      estimatedCatalogSize: catalog.estimatedCatalogSize,
      homepageProductLinks: light.productLinks,
      ownBrandSignal: light.ownBrandSignal,
      firstPartyBrandConfidence: fpBrand.score,
    });

    const purchaseMode = detectPurchaseMode({
      html,
      url: productUrl,
      heroPrice,
      isEcommerce: light.isEcommerce,
    }).purchaseMode;

    const isProfessional =
      light.isEcommerce &&
      purchaseMode !== "LEAD_GENERATION" &&
      purchaseMode !== "SHOWROOM_ASSISTED" &&
      scale.brandScaleFitScore >= 35 &&
      (light.retailerScaleScore ?? 100) < 70;

    const businessQualified =
      isProfessional && (row.businessModelSalesCandidate as boolean) === true;

    const cross = { match: "NONE" as CrossDomainProductMatch, peers: [] as string[], evidence: [] as string[] };

    const ownership = assessBrandOwnership({
      domain,
      productTitle,
      productBrand: fp.productBrand,
      manufacturer: fp.manufacturer,
      catalogEstimate: catalog.estimatedCatalogSize,
      ownBrandSignal: (row.ownBrand as number | null) ?? light.ownBrandSignal,
      businessModel: m992BusinessModel,
      crossDomainMatch: cross.match,
      productUrl,
    });

    const currentSiteImpression = deriveCurrentSiteImpression(
      row.currentVisualQualityScore as number | null
    );

    const visualOpp = classifyVisualRedesignOpportunity({
      currentVisualQualityScore: row.currentVisualQualityScore as number | null,
      preauditPurchaseGap: row.purchaseGap as number | null,
      mobileGap: row.mobileGap as number | null,
      businessModelSalesCandidate: row.businessModelSalesCandidate as boolean,
      businessModel: m992BusinessModel,
      redesignMaterialFeasibility: row.materialFeasibility as number | null,
    });

    const visualShowcaseSignal = classifyVisualShowcaseSignal({
      visualRedesignType: visualOpp.type,
      visualRedesignSalesFit: row.visualRedesignSalesFit as number,
      businessModelSalesCandidate: row.businessModelSalesCandidate as boolean,
      currentVisualQualityScore: row.currentVisualQualityScore as number | null,
      pageEntityType: entity.isValidProductDetail ? "PRODUCT_DETAIL" : entity.pageEntityType,
    });

    const m992EntityPass = entity.pageEntityType === "PRODUCT_DETAIL" && entity.isValidProductDetail;

    const gate = passesShowcaseSalesCandidate({
      pageEntityType: entity.pageEntityType,
      isValidProductDetail: m992EntityPass,
      refinedBusinessModel: ownership.refinedBusinessModel,
      brandOwnershipConfidence: ownership.brandOwnershipConfidence,
      businessQualified,
      companyScaleFit: (row.companyScaleFit as number | null) ?? scale.brandScaleFitScore,
      businessMaturityScore: maturity,
      currentSiteImpression,
      redesignMaterialFeasibility: row.materialFeasibility as number | null,
      visualRedesignOpportunityType: row.visualRedesignOpportunityType as string | null,
      crossDomainMatch: cross.match,
    });

    const validatedFit = computeValidatedVisualSalesFit({
      currentVisualQualityScore: row.currentVisualQualityScore as number | null,
      preauditVisualGap: row.visualGap as number | null,
      preauditPurchaseGap: row.purchaseGap as number | null,
      mobileGap: row.mobileGap as number | null,
      brandOwnershipConfidence: ownership.brandOwnershipConfidence,
      companyScaleFit: (row.companyScaleFit as number | null) ?? scale.brandScaleFitScore,
      redesignMaterialFeasibility: row.materialFeasibility as number | null,
      catalogFocus: row.catalogFocus as number | null,
      businessMaturityScore: maturity,
      refinedBusinessModel: ownership.refinedBusinessModel,
      currentSiteImpression,
    });

    const catalogEst = catalog.estimatedCatalogSize;
    const catalogProv = catalogProvenance(catalogEst, catalog.verified);
    const catalogFocusVal = row.catalogFocus as number | null;
    const catalogFocusProv = catalogFocusProvenance(catalogFocusVal);

    const screenshots = row.screenshots as Record<string, string> | null;
    const screenshotRel = screenshots
      ? Object.fromEntries(
          Object.entries(screenshots).map(([k, v]) => [k, relScreenshot(v)])
        )
      : null;

    reviewed.push({
      domain,
      productUrl,
      productTitle,
      m992BusinessModel,
      visualRedesignOpportunityType: row.visualRedesignOpportunityType,
      m992LeadType: row.leadType,
      visualShowcaseSignal,
      businessQualified,
      pageEntityType: entity.pageEntityType,
      pageEntityEvidence: entity.evidence,
      pageEntityRejectReason: entity.rejectReason,
      currentSiteImpression,
      businessModel: ownership.refinedBusinessModel,
      brandOwnershipConfidence: ownership.brandOwnershipConfidence,
      brandOwnershipEvidence: ownership.brandOwnershipEvidence,
      companyScaleFit: withProvenance(
        (row.companyScaleFit as number | null) ?? scale.brandScaleFitScore,
        null
      ),
      businessMaturityScore: withProvenance(maturity, null),
      catalogEstimate: {
        value: catalogEst,
        provenance: catalogProv,
      },
      catalogFocus: {
        value: catalogFocusVal,
        provenance: catalogFocusProv,
      },
      externalBrandBreadth: ownership.externalBrandBreadth,
      productBrand: fp.productBrand,
      sku: fp.sku,
      gtin: fp.gtin,
      manufacturer: fp.manufacturer,
      heroPrice,
      crossDomainProductMatch: cross.match,
      crossDomainPeers: cross.peers,
      crossDomainEvidence: cross.evidence,
      currentVisualQualityScore: row.currentVisualQualityScore,
      visualGap: row.visualGap,
      purchaseGap: row.purchaseGap,
      mobileGap: row.mobileGap,
      assetQuality: row.assetQuality,
      contentAvailable: row.contentAvailable,
      materialFeasibility: row.materialFeasibility,
      validatedVisualSalesFit: validatedFit,
      showcaseSalesCandidate: gate.pass,
      showcaseRejectFailures: gate.failures,
      showcaseRejectLabel: gate.pass ? null : rejectLabel(gate.failures),
      screenshots: screenshotRel,
      purchaseMode,
      ownBrandSignal: (row.ownBrand as number | null) ?? light.ownBrandSignal,
      productIdentity: fp,
    });
  }

  const crossMap = assessCrossDomainMatches(fingerprints);

  for (const item of reviewed) {
    const domain = String(item.domain);
    const cross = crossMap.get(domain);
    if (!cross) continue;
    item.crossDomainProductMatch = cross.match;
    item.crossDomainPeers = cross.peers;
    item.crossDomainEvidence = cross.evidence;

    const ownership = assessBrandOwnership({
      domain,
      productTitle: item.productTitle as string | null,
      productBrand: (item.productIdentity as ReturnType<typeof extractProductIdentityFingerprint>).productBrand,
      manufacturer: (item.productIdentity as ReturnType<typeof extractProductIdentityFingerprint>).manufacturer,
      catalogEstimate: (item.catalogEstimate as { value: number | null }).value,
      ownBrandSignal: item.ownBrandSignal as number | null,
      businessModel: (item.m992BusinessModel as BusinessModelClass) ?? "UNKNOWN",
      crossDomainMatch: cross.match,
      productUrl: String(item.productUrl),
    });

    item.businessModel = ownership.refinedBusinessModel;
    item.brandOwnershipConfidence = ownership.brandOwnershipConfidence;
    item.brandOwnershipEvidence = ownership.brandOwnershipEvidence;
    item.externalBrandBreadth = ownership.externalBrandBreadth;

    const gate = passesShowcaseSalesCandidate({
      pageEntityType: item.pageEntityType as ShowcasePageEntityType,
      isValidProductDetail: item.pageEntityType === "PRODUCT_DETAIL",
      refinedBusinessModel: ownership.refinedBusinessModel,
      brandOwnershipConfidence: ownership.brandOwnershipConfidence,
      businessQualified: item.businessQualified as boolean,
      companyScaleFit: (item.companyScaleFit as { value: number | null }).value,
      businessMaturityScore: (item.businessMaturityScore as { value: number | null }).value,
      currentSiteImpression: item.currentSiteImpression as CurrentSiteImpression,
      redesignMaterialFeasibility: item.materialFeasibility as number | null,
      visualRedesignOpportunityType: item.visualRedesignOpportunityType as string | null,
      crossDomainMatch: cross.match,
    });

    item.validatedVisualSalesFit = computeValidatedVisualSalesFit({
      currentVisualQualityScore: item.currentVisualQualityScore as number | null,
      preauditVisualGap: item.visualGap as number | null,
      preauditPurchaseGap: item.purchaseGap as number | null,
      mobileGap: item.mobileGap as number | null,
      brandOwnershipConfidence: ownership.brandOwnershipConfidence,
      companyScaleFit: (item.companyScaleFit as { value: number | null }).value,
      redesignMaterialFeasibility: item.materialFeasibility as number | null,
      catalogFocus: (item.catalogFocus as { value: number | null }).value,
      businessMaturityScore: (item.businessMaturityScore as { value: number | null }).value,
      refinedBusinessModel: ownership.refinedBusinessModel,
      currentSiteImpression: item.currentSiteImpression as CurrentSiteImpression,
    });

    item.showcaseSalesCandidate = gate.pass;
    item.showcaseRejectFailures = gate.failures;
    item.showcaseRejectLabel = gate.pass ? null : rejectLabel(gate.failures);
  }

  const cleanmaster = reviewed.find((r) => r.domain === "cleanmastershop.nl");
  const neduma = reviewed.find((r) => r.domain === "neduma.nl");
  let cleanmasterVsNeduma: {
    verdict: SameProductVerdict;
    similarity: number;
    evidence: string[];
  } | null = null;
  if (cleanmaster && neduma) {
    const cmp = compareProductIdentity(
      cleanmaster.productIdentity as ReturnType<typeof extractProductIdentityFingerprint>,
      neduma.productIdentity as ReturnType<typeof extractProductIdentityFingerprint>
    );
    cleanmasterVsNeduma = {
      verdict: cmp.verdict,
      similarity: cmp.similarity,
      evidence: cmp.evidence,
    };
  }

  const validatedProspects = reviewed
    .filter((r) => r.showcaseSalesCandidate === true)
    .sort(
      (a, b) =>
        ((b.validatedVisualSalesFit as number) ?? 0) -
        ((a.validatedVisualSalesFit as number) ?? 0)
    )
    .slice(0, M993_MAX_VALIDATED_PROSPECTS)
    .map((r) => ({
      domain: r.domain,
      productUrl: r.productUrl,
      pageEntityType: r.pageEntityType,
      currentSiteImpression: r.currentSiteImpression,
      businessModel: r.businessModel,
      brandOwnershipConfidence: r.brandOwnershipConfidence,
      brandOwnershipEvidence: r.brandOwnershipEvidence,
      companyScaleFit: r.companyScaleFit,
      businessMaturityScore: r.businessMaturityScore,
      catalogEstimate: r.catalogEstimate,
      catalogFocus: r.catalogFocus,
      externalBrandBreadth: r.externalBrandBreadth,
      product: r.productTitle,
      price: r.heroPrice,
      productBrand: r.productBrand,
      heroRelevance: "discovered_pdp",
      crossDomainMatchStatus: r.crossDomainProductMatch,
      cvq: r.currentVisualQualityScore,
      visualGap: r.visualGap,
      purchaseGap: r.purchaseGap,
      mobileGap: r.mobileGap,
      assets: r.assetQuality,
      content: r.contentAvailable,
      materialFeasibility: r.materialFeasibility,
      validatedVisualSalesFit: r.validatedVisualSalesFit,
      whyGoodMeneerProspect: whyGoodProspect({
        domain: String(r.domain),
        refinedBusinessModel: r.businessModel as ShowcaseOwnershipClass,
        brandOwnershipConfidence: r.brandOwnershipConfidence as number,
        currentSiteImpression: r.currentSiteImpression as CurrentSiteImpression,
        visualGap: r.visualGap as number | null,
        material: r.materialFeasibility as number | null,
        companyScaleFit: (r.companyScaleFit as { value: number | null }).value,
      }),
      screenshots: r.screenshots,
    }));

  const rejected = reviewed
    .filter((r) => r.showcaseSalesCandidate !== true)
    .map((r) => ({
      domain: r.domain,
      visualSignal: r.visualShowcaseSignal,
      m992LeadType: r.m992LeadType,
      rejectReason: r.showcaseRejectLabel ?? "FAILED INTEGRITY",
      failures: r.showcaseRejectFailures,
      pageEntityType: r.pageEntityType,
    }));

  const m992Funnel = m992.funnel as Record<string, number>;
  const visualSignalsFromScreened = allScreened.filter(
    (c) => c.leadType === "SHOWCASE_DESIGN" || c.visuallyUnderdesigned === true
  );

  const funnelConsistency = {
    m992_reported: {
      business_qualified: m992Funnel.business_qualified,
      showcase_design_candidates: m992Funnel.showcase_design_candidates,
    },
    root_cause:
      "M9.9.2 SHOWCASE_DESIGN counted visual redesign opportunity without requiring businessQualified. Visual signals can exceed business-qualified upstream pool.",
    semantic_fix: {
      visual_only_tier: "VISUAL_SHOWCASE_SIGNAL",
      sales_tier: "SHOWCASE_SALES_CANDIDATE",
      rule: "SHOWCASE_SALES_CANDIDATE requires VISUAL_SHOWCASE_SIGNAL + businessQualified + PRODUCT_DETAIL + ownership gates",
    },
    recomputed_on_m992_pool: {
      visual_showcase_signals: reviewed.filter((r) => r.visualShowcaseSignal).length,
      business_qualified_in_showcase_pool: reviewed.filter((r) => r.businessQualified).length,
      showcase_sales_candidates_after_integrity: validatedProspects.length,
    },
    visually_weak_screened_count: m992Funnel.visually_weak_shortlist,
    all_screened_with_showcase_lead_type: visualSignalsFromScreened.length,
  };

  const entityValidation = reviewed.map((r) => ({
    domain: r.domain,
    productUrl: r.productUrl,
    pageEntityType: r.pageEntityType,
    validPdp: r.pageEntityType === "PRODUCT_DETAIL",
    rejectReason: r.pageEntityRejectReason,
    evidence: r.pageEntityEvidence,
  }));

  const regressionReviews = {
    cleanmaster: reviewed.find((r) => r.domain === "cleanmastershop.nl") ?? null,
    neduma: reviewed.find((r) => r.domain === "neduma.nl") ?? null,
    cleanmasterVsNeduma,
    swissvax: reviewed.find((r) => r.domain === "swissvax-shop.nl") ?? null,
    theorientalshop: reviewed.find((r) => r.domain === "theorientalshop.nl") ?? null,
  };

  const finishedAt = new Date().toISOString();
  const report = {
    milestone: "M9.9.3",
    version: M993_DISCOVERY_VERSION,
    sourceReport: M992_REPORT_PATH,
    startedAt,
    finishedAt,
    funnelConsistency,
    entityValidation,
    crossDomainProductMatches: reviewed.map((r) => ({
      domain: r.domain,
      match: r.crossDomainProductMatch,
      peers: r.crossDomainPeers,
      evidence: r.crossDomainEvidence,
    })),
    businessModelOwnBrand: reviewed.map((r) => ({
      domain: r.domain,
      businessModel: r.businessModel,
      brandOwnershipConfidence: r.brandOwnershipConfidence,
      brandOwnershipEvidence: r.brandOwnershipEvidence,
      productBrand: r.productBrand,
      externalBrandBreadth: r.externalBrandBreadth,
    })),
    companyScaleCatalog: reviewed.map((r) => ({
      domain: r.domain,
      companyScaleFit: r.companyScaleFit,
      businessMaturityScore: r.businessMaturityScore,
      catalogEstimate: r.catalogEstimate,
      catalogFocus: r.catalogFocus,
    })),
    showcaseSignalReview: reviewed,
    rejectedShowcaseSignals: rejected,
    validatedShowcaseProspects: validatedProspects,
    regressionReviews,
    screenshots: {
      dir: "m9.9.2-screenshots",
      note: "Reused M9.9.2 captures for finalists only",
    },
    cost: {
      dataforseo: 0,
      anthropic: 0,
      note: "Integrity pass only; no SERP or vision",
    },
  };

  await mkdir(dirname(REPORT_PATH), { recursive: true });
  await writeFile(REPORT_PATH, JSON.stringify(report, null, 2), "utf8");
  await mkdir(dirname(DASHBOARD_REPORT_PATH), { recursive: true });
  await writeFile(DASHBOARD_REPORT_PATH, JSON.stringify(report, null, 2), "utf8");

  await completeRun(supabase, run.id, "completed", {
    finishedAt,
    validatedCount: validatedProspects.length,
    rejectedCount: rejected.length,
  });

  console.log(`Validated prospects: ${validatedProspects.length}`);
  console.log(`Rejected signals: ${rejected.length}`);
  console.log(`Report: ${REPORT_PATH}`);

  await closeCrawlerBrowser();
}

const isMain =
  process.argv[1] &&
  resolve(process.argv[1]).endsWith("runM993ShowcaseCandidateIntegrity.js");

if (isMain) {
  runM993ShowcaseCandidateIntegrity().catch(async (err) => {
    console.error(err);
    await closeCrawlerBrowser();
    process.exit(1);
  });
}
