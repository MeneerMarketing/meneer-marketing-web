/**
 * Milestone 9.9.2 — visual_redesign_sales_fit (visual weakness primary).
 */
import { computeProductCommercialValueSignal, computeProductStoryValue, } from "./focusedBrandSalesFit.js";
import { visualQualityBand } from "./visualQualityScore.js";
function clamp(n) {
    return Math.max(0, Math.min(100, Math.round(n)));
}
function norm(v, fallback = 45) {
    if (v == null || !Number.isFinite(v))
        return fallback;
    return clamp(v);
}
const WEIGHTS = {
    currentVisualWeakness: 0.32,
    visualGap: 0.1,
    businessModelOwnBrand: 0.18,
    companyScaleFit: 0.12,
    materialFeasibility: 0.12,
    purchaseMobileGap: 0.08,
    catalogFocus: 0.06,
    productStory: 0.06,
    businessMaturity: 0.04,
    paidEvidence: 0.03,
    priceSignal: 0.02,
};
function visualWeaknessScore(currentVisualQuality) {
    if (currentVisualQuality == null)
        return 45;
    return clamp(100 - currentVisualQuality);
}
function businessModelScore(model, salesCandidate) {
    let score = 38;
    switch (model) {
        case "DTC_OWN_BRAND":
            score = 96;
            break;
        case "MOSTLY_OWN_BRAND":
            score = 84;
            break;
        case "FOCUSED_SPECIALIST_RESELLER":
            score = 22;
            break;
        case "GENERAL_RESELLER":
            score = 10;
            break;
        case "GENERAL_RETAILER":
            score = 6;
            break;
        default:
            score = 38;
    }
    if (!salesCandidate)
        score = Math.min(score, 28);
    return score;
}
export function computeVisualRedesignSalesFit(input) {
    const evidence = [];
    const weakness = visualWeaknessScore(input.currentVisualQualityScore);
    const visualGap = norm(input.preauditVisualGap);
    const purchase = norm(input.preauditPurchaseGap);
    const mobile = norm(input.mobileGap);
    const purchaseMobile = clamp(purchase * 0.55 + mobile * 0.45);
    const material = norm(input.redesignMaterialFeasibility);
    const model = businessModelScore(input.businessModel, input.businessModelSalesCandidate);
    const scale = norm(input.companyScaleFit);
    const catalog = norm(input.catalogFocus);
    const own = norm(input.ownBrandSignal);
    const catalogScore = clamp(catalog * 0.6 + own * 0.4);
    const maturity = norm(input.businessMaturityScore, 48);
    const story = computeProductStoryValue({
        contentAvailable: input.contentAvailable,
        assetQualityProxy: input.assetQualityProxy,
        contentPresentation: input.contentPresentation,
        heroCandidateScore: input.heroCandidateScore,
        rawPdpRedesignOpportunity: input.rawPdpRedesignOpportunity,
        brandDistinctivenessProxy: input.brandDistinctivenessProxy,
        productComplexityProxy: input.heroCandidateScore,
    });
    const commercial = computeProductCommercialValueSignal({
        heroPrice: input.heroPrice,
        priceConfidence: input.priceConfidence,
        purchaseMode: input.purchaseMode,
        productSimplicityProxy: story.score,
    });
    let paidScore = 42;
    if (input.paidAcquisitionLevel === "CONFIRMED")
        paidScore = 88;
    else if (input.paidAcquisitionLevel === "LIKELY")
        paidScore = 68;
    const score = clamp(weakness * WEIGHTS.currentVisualWeakness +
        visualGap * WEIGHTS.visualGap +
        model * WEIGHTS.businessModelOwnBrand +
        scale * WEIGHTS.companyScaleFit +
        material * WEIGHTS.materialFeasibility +
        purchaseMobile * WEIGHTS.purchaseMobileGap +
        catalogScore * WEIGHTS.catalogFocus +
        story.score * WEIGHTS.productStory +
        maturity * WEIGHTS.businessMaturity +
        paidScore * WEIGHTS.paidEvidence +
        commercial.score * WEIGHTS.priceSignal);
    if (weakness >= 55)
        evidence.push("visually_underdesigned");
    if (input.currentVisualQualityScore != null && input.currentVisualQualityScore < 45) {
        evidence.push("very_weak_visual");
    }
    let confidence = "LOW";
    if (score >= 68 && input.businessModelSalesCandidate)
        confidence = "HIGH";
    else if (score >= 55)
        confidence = "MEDIUM";
    return {
        score,
        confidence,
        visualQualityBand: visualQualityBand(input.currentVisualQualityScore),
        evidence,
    };
}
export function classifyVisualRedesignOpportunity(input) {
    const cvq = input.currentVisualQualityScore;
    const purchase = input.preauditPurchaseGap ?? 0;
    const mobile = input.mobileGap ?? 0;
    const threshold = input.visualThreshold ?? 55;
    const businessOk = input.businessModelSalesCandidate &&
        input.businessModel !== "GENERAL_RETAILER" &&
        input.businessModel !== "GENERAL_RESELLER" &&
        input.businessModel !== "FOCUSED_SPECIALIST_RESELLER";
    const materialOk = (input.redesignMaterialFeasibility ?? 0) >= 55;
    if (cvq != null &&
        cvq < threshold &&
        businessOk &&
        materialOk) {
        return {
            type: "VISUAL_REDESIGN_OPPORTUNITY",
            reason: `current_visual_${cvq}_underdesigned`,
        };
    }
    if (purchase >= 65 || mobile >= 65) {
        return {
            type: "CRO_ONLY_OPPORTUNITY",
            reason: `purchase_mobile_heavy_visual_${cvq ?? "unknown"}`,
        };
    }
    return {
        type: "CRO_ONLY_OPPORTUNITY",
        reason: "insufficient_visual_weakness",
    };
}
export function classifyVisualShowcaseSignal(input) {
    if (input.pageEntityType !== "PRODUCT_DETAIL")
        return false;
    return (input.visualRedesignType === "VISUAL_REDESIGN_OPPORTUNITY" &&
        input.businessModelSalesCandidate &&
        input.visualRedesignSalesFit >= 58 &&
        (input.currentVisualQualityScore ?? 100) < 55);
}
export function classifyShowcaseSalesCandidate(input) {
    if (!input.visualShowcaseSignal || !input.businessQualified)
        return false;
    if (input.pageEntityType !== "PRODUCT_DETAIL")
        return false;
    if (input.businessModel === "GENERAL_RETAILER" ||
        input.businessModel === "GENERAL_RESELLER" ||
        input.businessModel === "FOCUSED_SPECIALIST_RESELLER") {
        return false;
    }
    return true;
}
export function classifyM992LeadType(input) {
    if (input.pageEntityType !== "PRODUCT_DETAIL") {
        return {
            leadType: "REJECT",
            opportunityTier: "NO_VALUE",
            visualShowcaseSignal: false,
            showcaseSalesCandidate: false,
        };
    }
    if (input.businessModel === "GENERAL_RETAILER" ||
        input.businessModel === "GENERAL_RESELLER") {
        return {
            leadType: "REJECT",
            opportunityTier: "NO_VALUE",
            visualShowcaseSignal: false,
            showcaseSalesCandidate: false,
        };
    }
    const visualShowcaseSignal = classifyVisualShowcaseSignal({
        visualRedesignType: input.visualRedesignType,
        visualRedesignSalesFit: input.visualRedesignSalesFit,
        businessModelSalesCandidate: input.businessModelSalesCandidate,
        currentVisualQualityScore: input.currentVisualQualityScore,
        pageEntityType: input.pageEntityType,
    });
    const showcaseSalesCandidate = classifyShowcaseSalesCandidate({
        visualShowcaseSignal,
        businessQualified: input.businessQualified ?? false,
        pageEntityType: input.pageEntityType,
        businessModel: input.businessModel,
    });
    if (showcaseSalesCandidate) {
        return {
            leadType: "SHOWCASE_SALES_CANDIDATE",
            opportunityTier: "SHOWCASE_SALES_CANDIDATE",
            visualShowcaseSignal,
            showcaseSalesCandidate,
        };
    }
    if (visualShowcaseSignal) {
        return {
            leadType: "VISUAL_SHOWCASE_SIGNAL",
            opportunityTier: "VISUAL_SHOWCASE_SIGNAL",
            visualShowcaseSignal,
            showcaseSalesCandidate: false,
        };
    }
    if (input.visualRedesignType === "CRO_ONLY_OPPORTUNITY" &&
        input.visualRedesignSalesFit >= 52) {
        return {
            leadType: "CRO_ONLY",
            opportunityTier: "CRO_ONLY_OPPORTUNITY",
            visualShowcaseSignal: false,
            showcaseSalesCandidate: false,
        };
    }
    if (input.visualRedesignSalesFit >= 58 &&
        input.businessModelSalesCandidate &&
        (input.redesignMaterialFeasibility ?? 0) >= 55) {
        return {
            leadType: "STRONG_SALES",
            opportunityTier: "STRONG_SALES_PROSPECT",
            visualShowcaseSignal: false,
            showcaseSalesCandidate: false,
        };
    }
    return {
        leadType: "REJECT",
        opportunityTier: "NO_VALUE",
        visualShowcaseSignal: false,
        showcaseSalesCandidate: false,
    };
}
//# sourceMappingURL=visualRedesignSalesFit.js.map