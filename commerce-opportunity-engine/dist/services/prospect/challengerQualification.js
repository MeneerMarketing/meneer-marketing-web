/**
 * Milestone 9.4.1 — deterministic challenger qualification (no Claude).
 */
import { CHALLENGER_QUALIFICATION } from "../../config/highTicketValidation.js";
import { runLightBrandCheck } from "./lightBrandCheck.js";
import { runCatalogFocusCheck } from "./catalogFocusCheck.js";
import { isUsableHeroUrl } from "../idealProspect/newProspectPreselection.js";
import { computeCompanyScaleFit } from "./companyScaleFit.js";
import { estimateContrastCeiling } from "./estimatedContrastCeiling.js";
import { computeHighTicketFocusedFit } from "./highTicketFocusedFit.js";
import { computeDeepDivePdpFitProxy } from "./prospectPreScore.js";
export async function qualifyChallenger(input, crawlTimeoutMs) {
    const blockers = [];
    const evidence = [];
    const rules = CHALLENGER_QUALIFICATION;
    const light = await runLightBrandCheck(input.domain, crawlTimeoutMs);
    const catalog = await runCatalogFocusCheck(input.domain, crawlTimeoutMs, light.productLinks, light.categoryLinks);
    let pdpWeakness = input.currentPdpWeaknessProxy;
    const deepDive = input.deepDivePdpFitProxy ??
        computeDeepDivePdpFitProxy({
            archetypeId: input.branch,
            catalogFocusScore: catalog.catalogFocusScore,
            heroScore: input.heroScore,
        });
    const scale = computeCompanyScaleFit({
        businessType: light.businessType,
        isEcommerce: light.isEcommerce,
        retailerScaleScore: light.retailerScaleScore,
        retailerBreadthScore: light.retailerBreadthScore,
        businessMaturityScore: null,
        internationalPresenceScore: light.internationalPresenceScore,
        estimatedCatalogSize: catalog.estimatedCatalogSize,
        homepageProductLinks: light.productLinks,
        ownBrandSignal: light.ownBrandSignal,
    });
    const contrast = estimateContrastCeiling({
        pdpWeaknessProxy: pdpWeakness,
        assetReadinessProxy: input.assetReadinessProxy,
        deepDivePdpFitProxy: deepDive,
        ownBrandSignal: light.ownBrandSignal,
        heroPrice: input.heroPrice,
    });
    const fit = computeHighTicketFocusedFit({
        domain: input.domain,
        businessType: light.businessType,
        prospectClass: light.prospectClass,
        estimatedCatalogSize: catalog.estimatedCatalogSize,
        catalogFocusScore: catalog.catalogFocusScore,
        catalogVerified: catalog.verified,
        ownBrandSignal: light.ownBrandSignal,
        companyScaleFitScore: scale.companyScaleFitScore,
        assetReadinessProxy: input.assetReadinessProxy,
        deepDivePdpFitProxy: deepDive,
        pdpWeaknessProxy: pdpWeakness,
        heroScore: input.heroScore,
        heroPrice: input.heroPrice,
        adKeywordCount: input.googleAdsEvidence.keywords.length,
        retailerBreadthScore: light.retailerBreadthScore,
        businessMaturityScore: null,
    });
    const heroOk = input.heroProductUrl != null && isUsableHeroUrl(input.heroProductUrl, input.domain);
    if (!heroOk)
        blockers.push("geen betrouwbare hero PDP");
    else
        evidence.push("hero PDP URL geverifieerd");
    if (!catalog.verified)
        blockers.push("catalogusomvang niet geverifieerd");
    if ((catalog.catalogFocusScore ?? 0) < rules.minCatalogFocus) {
        blockers.push(`catalog focus ${catalog.catalogFocusScore} < ${rules.minCatalogFocus}`);
    }
    if ((catalog.estimatedCatalogSize ?? 999) > rules.maxCatalogSize) {
        blockers.push(`catalogus te breed (${catalog.estimatedCatalogSize})`);
    }
    const maturity = null;
    if (maturity != null && maturity < rules.minBusinessMaturity) {
        blockers.push(`volwassenheid ${maturity} te laag`);
    }
    else {
        evidence.push("volwassenheid nog niet gemeten, geen harde reject");
    }
    if ((input.assetReadinessProxy ?? 0) < rules.minAssetReadiness) {
        blockers.push(`asset readiness ${input.assetReadinessProxy ?? 0} < ${rules.minAssetReadiness}`);
    }
    if ((fit.highTicketFocusedFitScore ?? 0) < rules.minHighTicketFit) {
        blockers.push(`high-ticket fit ${fit.highTicketFocusedFitScore} < ${rules.minHighTicketFit}`);
    }
    if ((input.heroPrice ?? 0) < rules.minHeroPrice) {
        blockers.push(`hero prijs ${input.heroPrice ?? 0} te laag`);
    }
    return {
        domain: input.domain,
        qualified: blockers.length === 0,
        blockers,
        evidence: [...evidence, ...fit.evidence.slice(0, 4)],
        businessMaturity: maturity,
        estimatedCatalogSize: catalog.estimatedCatalogSize,
        catalogFocusScore: catalog.catalogFocusScore,
        catalogVerified: catalog.verified,
        ownBrandSignal: light.ownBrandSignal,
        platform: light.platform,
        businessType: light.businessType,
        commerceModel: input.commerceModel,
        assetReadinessProxy: input.assetReadinessProxy,
        deepDivePdpFitProxy: deepDive,
        currentPdpWeaknessProxy: pdpWeakness,
        highTicketFocusedFitScore: fit.highTicketFocusedFitScore,
        estimatedContrastCeiling: contrast.estimatedContrastCeiling,
        companyScaleFit: scale.companyScaleFitScore,
        heroProductUrl: heroOk ? input.heroProductUrl : null,
    };
}
//# sourceMappingURL=challengerQualification.js.map