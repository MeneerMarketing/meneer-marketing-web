/**
 * Milestone 9.8.2 — product/business economics + high_ticket_gap_sales_fit.
 */
import { purchaseModeScore } from "./purchaseModeDetector.js";
function clamp(n) {
    return Math.max(0, Math.min(100, Math.round(n)));
}
function norm(v, fallback = 45) {
    if (v == null || !Number.isFinite(v))
        return fallback;
    return clamp(v);
}
export function inferPriceConfidence(input) {
    if (input.observedPrice != null && input.priceFromCrawl)
        return "HIGH";
    if (input.heroPrice != null && input.priceFromCrawl)
        return "HIGH";
    if (input.observedPrice != null || input.heroPrice != null)
        return "MEDIUM";
    return "UNKNOWN";
}
export function evaluatePriceGate(input) {
    if (input.price == null || input.priceConfidence === "UNKNOWN") {
        return { pass: true, hardReject: false, reason: null };
    }
    if (input.price < 60) {
        return { pass: false, hardReject: true, reason: "price_below_60" };
    }
    if (input.price < 100) {
        return { pass: false, hardReject: false, reason: "price_60_99_needs_exception" };
    }
    return { pass: true, hardReject: false, reason: null };
}
export function computeProductEconomicFit(input) {
    const evidence = [];
    let priceScore = 42;
    const price = input.heroPrice;
    if (price != null) {
        if (input.priceConfidence === "LOW") {
            priceScore = 42;
            evidence.push("price_confidence_low");
        }
        else if (price >= 150 && price <= 750) {
            priceScore = 96;
            evidence.push("price_sweet_spot");
        }
        else if (price >= 750 && price <= 2500) {
            priceScore = 88;
            evidence.push("price_premium_band");
        }
        else if (price >= 100 && price < 150) {
            priceScore = 72;
            evidence.push("price_acceptable");
        }
        else if (price >= 60 && price < 100) {
            priceScore = 38;
            evidence.push("price_marginal");
        }
        else if (price < 60) {
            priceScore = 12;
            evidence.push("price_too_low");
        }
    }
    else if (input.priceConfidence === "UNKNOWN") {
        priceScore = 50;
        evidence.push("price_unknown_neutral");
    }
    const purchaseFit = purchaseModeScore(input.purchaseMode);
    const complexity = norm(input.productComplexityProxy, 55);
    const assets = norm(input.assetContentAvailability, 50);
    const hero = clamp(input.heroCandidateScore);
    const score = clamp(priceScore * 0.42 +
        hero * 0.22 +
        purchaseFit * 0.16 +
        complexity * 0.12 +
        assets * 0.12);
    if (input.purchaseMode === "DIRECT_ECOMMERCE")
        evidence.push("direct_ecommerce");
    return { score, evidence };
}
export function computeHighTicketGapSalesFit(input) {
    const evidence = [];
    let modelScore = 40;
    switch (input.businessModel) {
        case "DTC_OWN_BRAND":
            modelScore = 92;
            evidence.push("dtc_own_brand");
            break;
        case "MOSTLY_OWN_BRAND":
            modelScore = 80;
            evidence.push("mostly_own_brand");
            break;
        case "FOCUSED_SPECIALIST_RESELLER":
            modelScore = 42;
            evidence.push("focused_reseller");
            break;
        case "GENERAL_RESELLER":
            modelScore = 18;
            break;
        case "GENERAL_RETAILER":
            modelScore = 8;
            break;
        default:
            modelScore = 38;
    }
    if (!input.businessModelSalesCandidate) {
        modelScore = Math.min(modelScore, 32);
        evidence.push("business_model_reject");
    }
    let paidBonus = 0;
    if (input.paidAcquisitionLevel === "CONFIRMED")
        paidBonus = 4;
    else if (input.paidAcquisitionLevel === "LIKELY")
        paidBonus = 2;
    const score = clamp(input.showcaseGapPotential * 0.3 +
        input.redesignMaterialFeasibility * 0.2 +
        input.productEconomicFit * 0.22 +
        input.businessEconomicFit * 0.18 +
        modelScore * 0.1 +
        paidBonus);
    let confidence = "LOW";
    if (score >= 72 && input.businessModelSalesCandidate)
        confidence = "HIGH";
    else if (score >= 58)
        confidence = "MEDIUM";
    return { score, confidence, evidence };
}
export function passesHighTicketFinalistGate(input) {
    const failures = [];
    if (input.pageEntityType !== "PRODUCT_DETAIL")
        failures.push("not_product_detail");
    const price = input.heroPrice;
    if (price != null && price < 100)
        failures.push("hero_price_below_100");
    if (price != null && price < 60)
        failures.push("hero_price_hard_reject");
    if (input.showcaseGapPotential < 70)
        failures.push("showcase_gap_low");
    if (input.redesignMaterialFeasibility < 65)
        failures.push("material_feasibility_low");
    if (input.productEconomicFit < 55)
        failures.push("product_economics_weak");
    if (input.businessEconomicFit < 50)
        failures.push("business_economics_weak");
    if (!input.businessModelSalesCandidate)
        failures.push("business_model_reject");
    if (input.businessModel === "GENERAL_RETAILER" ||
        input.businessModel === "GENERAL_RESELLER") {
        failures.push("general_retailer_or_reseller");
    }
    if ((input.companyScaleFit ?? 0) < 40)
        failures.push("company_scale_low");
    if ((input.catalogFocus ?? 0) < 45)
        failures.push("catalog_focus_low");
    if (input.purchaseMode === "LEAD_GENERATION" || input.purchaseMode === "SHOWROOM_ASSISTED") {
        failures.push("not_direct_ecommerce");
    }
    if ((input.businessMaturityScore ?? 50) < 28)
        failures.push("maturity_very_low");
    if (!input.showcaseReady)
        failures.push("showcase_profile_weak");
    const compactCatalog = input.catalogEstimate != null
        ? input.catalogEstimate <= 100
        : (input.catalogFocus ?? 0) >= 45;
    const lowPriceException = price != null &&
        price >= 60 &&
        price < 100 &&
        (input.ownBrandSignal ?? 0) >= 65 &&
        compactCatalog &&
        input.redesignMaterialFeasibility >= 70 &&
        input.showcaseGapPotential >= 75;
    if (price != null && price < 100 && !lowPriceException) {
        failures.push("hero_economics_weak");
    }
    return { pass: failures.length === 0, failures };
}
export function meetsEarlySuccessPartialCriteria(input) {
    if (input.pageEntityType !== "PRODUCT_DETAIL")
        return false;
    const price = input.heroPrice;
    if (price != null && price < 100)
        return false;
    if (input.showcaseGapPotential < 70)
        return false;
    if (input.redesignMaterialFeasibility < 65)
        return false;
    if (!input.businessModelSalesCandidate)
        return false;
    if (input.businessModel === "GENERAL_RETAILER" ||
        input.businessModel === "GENERAL_RESELLER") {
        return false;
    }
    if (input.purchaseMode !== "DIRECT_ECOMMERCE")
        return false;
    if ((input.companyScaleFit ?? 0) < 40)
        return false;
    return (input.businessModel === "DTC_OWN_BRAND" ||
        input.businessModel === "MOSTLY_OWN_BRAND" ||
        input.businessModel === "FOCUSED_SPECIALIST_RESELLER");
}
/** Same criteria as PRE_AUDIT_FINALIST gate — early stop only when a true finalist exists. */
export function meetsEarlySuccessFinalistCriteria(input) {
    return passesHighTicketFinalistGate(input).pass;
}
export function isStrongFinalistForEarlyStop(input) {
    if (!input.preAuditGatePass)
        return false;
    const price = input.heroPrice;
    if (price != null && price < 150)
        return false;
    const visual = input.preauditVisualGap ?? 0;
    const purchase = input.preauditPurchaseGap ?? 0;
    const mobile = input.mobileGap ?? 0;
    return ((input.businessModel === "DTC_OWN_BRAND" ||
        input.businessModel === "MOSTLY_OWN_BRAND") &&
        input.redesignMaterialFeasibility >= 80 &&
        visual >= 70 &&
        purchase >= 70 &&
        mobile >= 65 &&
        input.showcaseGapPotential >= 80 &&
        input.businessEconomicFit >= 65 &&
        input.productEconomicFit >= 70 &&
        input.purchaseMode === "DIRECT_ECOMMERCE");
}
//# sourceMappingURL=highTicketGapSalesFit.js.map