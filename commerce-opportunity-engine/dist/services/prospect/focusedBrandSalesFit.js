/**
 * Milestone 9.9 — focused_brand_sales_fit + product story/commercial value signals.
 *
 * Price is weighted last. Business model and design gap dominate.
 */
import { catalogBandForFocusedBrand, FOCUSED_BRAND_THRESHOLDS, FOCUSED_BRAND_SALES_FIT_WEIGHTS, } from "../../config/focusedBrandGapFirst.js";
function clamp(n) {
    return Math.max(0, Math.min(100, Math.round(n)));
}
function norm(v, fallback = 45) {
    if (v == null || !Number.isFinite(v))
        return fallback;
    return clamp(v);
}
/** Soft commercial signal only — never hard reject. */
export function computeProductCommercialValueSignal(input) {
    const evidence = [];
    const price = input.heroPrice;
    let score = 55;
    if (price == null || input.priceConfidence === "UNKNOWN") {
        score = 55;
        evidence.push("price_unknown_neutral");
    }
    else if (input.priceConfidence === "LOW") {
        score = 50;
        evidence.push("price_confidence_low_neutral");
    }
    else if (price >= 300) {
        const direct = input.purchaseMode === "DIRECT_ECOMMERCE" ||
            input.purchaseMode === "CONFIGURABLE_ECOMMERCE";
        score = direct ? 88 : 72;
        evidence.push(direct ? "premium_direct_ecommerce" : "premium_non_direct");
    }
    else if (price >= 100) {
        score = 86;
        evidence.push("positive_economics_100_300");
    }
    else if (price >= 40) {
        score = 78;
        evidence.push("normal_prospect_range_40_99");
    }
    else if (price >= 25) {
        score = 58;
        evidence.push("low_price_acceptable");
    }
    else {
        const simple = norm(input.productSimplicityProxy, 55);
        score = simple < 45 ? 28 : 42;
        evidence.push("very_low_price_light_penalty");
    }
    return { score: clamp(score), evidence };
}
/** Explainability / differentiation potential — independent of price band. */
export function computeProductStoryValue(input) {
    const evidence = [];
    const available = norm(input.contentAvailable);
    const assets = norm(input.assetQualityProxy);
    const presentation = norm(input.contentPresentation, 55);
    const presentationGap = clamp(100 - presentation);
    const hero = norm(input.heroCandidateScore);
    const raw = norm(input.rawPdpRedesignOpportunity);
    const distinct = norm(input.brandDistinctivenessProxy, 48);
    const complexity = norm(input.productComplexityProxy, 55);
    let score = clamp(available * 0.22 +
        assets * 0.2 +
        presentationGap * 0.16 +
        hero * 0.14 +
        complexity * 0.12 +
        distinct * 0.1 +
        raw * 0.1);
    if (available >= 70 && presentation <= 50) {
        score += 6;
        evidence.push("rich_content_weak_presentation");
    }
    if (assets >= 65 && complexity >= 55) {
        score += 5;
        evidence.push("demonstrable_product_story");
    }
    return { score: clamp(score), evidence };
}
function businessModelScore(model, salesCandidate) {
    const evidence = [];
    let score = 38;
    switch (model) {
        case "DTC_OWN_BRAND":
            score = 96;
            evidence.push("dtc_own_brand");
            break;
        case "MOSTLY_OWN_BRAND":
            score = 84;
            evidence.push("mostly_own_brand");
            break;
        case "FOCUSED_SPECIALIST_RESELLER":
            score = 28;
            evidence.push("focused_reseller_not_primary");
            break;
        case "GENERAL_RESELLER":
            score = 12;
            break;
        case "GENERAL_RETAILER":
            score = 6;
            break;
        default:
            score = 40;
    }
    if (!salesCandidate) {
        score = Math.min(score, 30);
        evidence.push("business_model_reject");
    }
    return { score, evidence };
}
function companyScaleContribution(companyScaleFit, catalogEstimate, businessMaturityScore) {
    const evidence = [];
    const scale = companyScaleFit ?? 45;
    const catalog = catalogEstimate;
    const maturity = businessMaturityScore ?? 45;
    if (scale < FOCUSED_BRAND_THRESHOLDS.companyScaleRejectBelow) {
        evidence.push("amateur_or_unreliable_scale");
        return { score: 18, evidence };
    }
    if (maturity < FOCUSED_BRAND_THRESHOLDS.amateurMaturityBelow) {
        evidence.push("amateur_maturity");
        return { score: Math.min(scale, 28), evidence };
    }
    if (scale > 78 && (catalog ?? 0) > 400) {
        evidence.push("large_chain_penalty");
        return { score: 22, evidence };
    }
    if (scale >= 38 && scale <= 72) {
        evidence.push("small_mid_professional_ecommerce");
    }
    return { score: clamp(scale), evidence };
}
export function computePdpDesignOpportunity(input) {
    const showcase = norm(input.showcaseGapPotential);
    const raw = norm(input.rawPdpRedesignOpportunity);
    const visual = norm(input.preauditVisualGap);
    const purchase = norm(input.preauditPurchaseGap);
    const mobile = norm(input.mobileGap);
    const combinedGap = visual * 0.28 + purchase * 0.22 + mobile * 0.18;
    return clamp(showcase * 0.42 + raw * 0.28 + combinedGap * 0.3);
}
export function computeFocusedBrandSalesFit(input) {
    const evidence = [];
    const w = FOCUSED_BRAND_SALES_FIT_WEIGHTS;
    const pdpDesign = computePdpDesignOpportunity(input);
    const model = businessModelScore(input.businessModel, input.businessModelSalesCandidate);
    const scale = companyScaleContribution(input.companyScaleFit, input.catalogEstimate, input.businessMaturityScore);
    const catalogBand = catalogBandForFocusedBrand(input.catalogEstimate);
    const catalogFocus = norm(input.catalogFocus, input.catalogVerified ? 48 : 42);
    const ownBrand = norm(input.ownBrandSignal);
    const catalogScore = clamp(catalogBand.score * 0.55 + catalogFocus * 0.35 + ownBrand * 0.1 - catalogBand.penalty);
    const material = norm(input.redesignMaterialFeasibility);
    const story = computeProductStoryValue({
        contentAvailable: input.contentAvailable,
        assetQualityProxy: input.assetQualityProxy,
        contentPresentation: input.contentPresentation,
        heroCandidateScore: input.heroCandidateScore,
        rawPdpRedesignOpportunity: input.rawPdpRedesignOpportunity,
        brandDistinctivenessProxy: input.brandDistinctivenessProxy,
        productComplexityProxy: input.productComplexityProxy,
    });
    const commercial = computeProductCommercialValueSignal({
        heroPrice: input.heroPrice,
        priceConfidence: input.priceConfidence,
        purchaseMode: input.purchaseMode,
        productSimplicityProxy: story.score,
    });
    const maturity = norm(input.businessMaturityScore, 48);
    let paidScore = 42;
    if (input.paidAcquisitionLevel === "CONFIRMED")
        paidScore = 88;
    else if (input.paidAcquisitionLevel === "LIKELY")
        paidScore = 68;
    else if (input.paidAcquisitionLevel === "NOT_FOUND")
        paidScore = 40;
    const score = clamp(pdpDesign * w.pdpDesignOpportunity +
        model.score * w.businessModelOwnBrand +
        scale.score * w.companyScaleFit +
        material * w.materialFeasibility +
        catalogScore * w.catalogFocus +
        story.score * w.productStoryQuality +
        maturity * w.businessMaturity +
        paidScore * w.paidCommercialEvidence +
        commercial.score * w.productPriceSignal);
    evidence.push(...model.evidence, ...scale.evidence, ...story.evidence, ...commercial.evidence);
    if (catalogBand.label !== "unknown")
        evidence.push(`catalog_${catalogBand.label}`);
    let confidence = "LOW";
    if (score >= 70 && input.businessModelSalesCandidate)
        confidence = "HIGH";
    else if (score >= 58)
        confidence = "MEDIUM";
    return {
        score,
        confidence,
        productCommercialValueSignal: commercial.score,
        productStoryValue: story.score,
        pdpDesignOpportunity: pdpDesign,
        evidence,
    };
}
export function passesShowcaseDesignGate(input) {
    const failures = [];
    const t = FOCUSED_BRAND_THRESHOLDS;
    if (input.pageEntityType !== "PRODUCT_DETAIL")
        failures.push("not_product_detail");
    if (!input.businessModelSalesCandidate)
        failures.push("business_model_reject");
    if (input.businessModel === "GENERAL_RETAILER" ||
        input.businessModel === "GENERAL_RESELLER" ||
        input.businessModel === "FOCUSED_SPECIALIST_RESELLER") {
        failures.push("retailer_or_reseller");
    }
    if ((input.companyScaleFit ?? 0) < t.companyScalePreferMin) {
        failures.push("company_scale_low");
    }
    const focus = input.catalogFocus ?? 0;
    const own = input.ownBrandSignal ?? 0;
    if (focus < t.catalogFocusPreferMin && own < 60) {
        failures.push("catalog_focus_low");
    }
    if ((input.redesignMaterialFeasibility ?? 0) < t.showcaseDesignMaterialMin) {
        failures.push("material_feasibility_low");
    }
    if ((input.showcaseGapPotential ?? 0) < t.showcaseDesignShowcaseMin) {
        failures.push("showcase_gap_low");
    }
    const visual = input.preauditVisualGap ?? 0;
    const purchase = input.preauditPurchaseGap ?? 0;
    const mobile = input.mobileGap ?? 0;
    const visualProfileOk = input.showcaseReady ||
        (visual >= t.showcaseDesignVisualMin &&
            (purchase >= t.showcaseDesignPurchaseOrMobileMin ||
                mobile >= t.showcaseDesignPurchaseOrMobileMin));
    if (!visualProfileOk)
        failures.push("showcase_profile_weak");
    if (input.purchaseMode === "LEAD_GENERATION" ||
        input.purchaseMode === "SHOWROOM_ASSISTED") {
        failures.push("not_direct_ecommerce");
    }
    return { pass: failures.length === 0, failures };
}
export function passesStrongSalesProspectGate(input) {
    const failures = [];
    const t = FOCUSED_BRAND_THRESHOLDS;
    if (input.pageEntityType !== "PRODUCT_DETAIL")
        failures.push("not_product_detail");
    if (input.businessModel === "GENERAL_RETAILER" ||
        input.businessModel === "GENERAL_RESELLER") {
        failures.push("retailer_or_reseller");
    }
    const businessOk = input.businessModelSalesCandidate ||
        (input.ownBrandSignal ?? 0) >= 60 && (input.companyScaleFit ?? 0) >= 42;
    if (!businessOk)
        failures.push("business_profile_weak");
    if ((input.companyScaleFit ?? 0) < t.companyScaleRejectBelow) {
        failures.push("company_scale_reject");
    }
    if ((input.redesignMaterialFeasibility ?? 0) < t.strongSalesMaterialMin) {
        failures.push("material_feasibility_low");
    }
    if (input.focusedBrandSalesFit < t.strongSalesProspectMin) {
        failures.push("focused_fit_low");
    }
    const visual = input.preauditVisualGap ?? 0;
    const purchase = input.preauditPurchaseGap ?? 0;
    const mobile = input.mobileGap ?? 0;
    const raw = input.rawPdpRedesignOpportunity ?? 0;
    const gapOk = visual >= 45 ||
        purchase >= 60 ||
        mobile >= 58 ||
        raw >= t.strongSalesGapMin;
    if (!gapOk)
        failures.push("gap_signal_weak");
    return { pass: failures.length === 0, failures };
}
/** Focused-brand mode: price never hard-rejects harvest or screen. */
export function evaluateFocusedBrandPriceGate() {
    return { pass: true, hardReject: false, reason: null };
}
//# sourceMappingURL=focusedBrandSalesFit.js.map