/**
 * Milestone 9.8.1 — redesign material feasibility + validated gap sales fit.
 */
function clamp(n) {
    return Math.max(0, Math.min(100, Math.round(n)));
}
export function computeRedesignMaterialFeasibility(input) {
    const evidence = [];
    const available = input.contentAvailable ?? 40;
    const presentation = input.contentPresentation ?? 55;
    const assets = input.assetQualityProxy ?? 40;
    let score = available * 0.42 + assets * 0.38 + (100 - presentation) * 0.2;
    if (input.materialSweetSpot) {
        score += 10;
        evidence.push("material_sweet_spot");
    }
    if (available >= 70 && presentation <= 50) {
        evidence.push("high_available_low_presentation");
    }
    if (assets >= 65 && presentation <= 55) {
        evidence.push("assets_underused");
    }
    if (available < 35 && assets < 40) {
        score -= 18;
        evidence.push("thin_material_base");
    }
    const final = clamp(score);
    const band = final >= 68 ? "HIGH" : final >= 52 ? "MEDIUM" : "LOW";
    return { score: final, band, evidence };
}
export function computeHeroCandidateScore(input) {
    const evidence = [];
    let score = 40;
    if (input.isValidProductDetail && input.heroProductUrl) {
        score += 18;
        evidence.push("valid_hero_url");
    }
    else if (input.isValidProductDetail &&
        input.discoveredProductUrl === input.heroProductUrl) {
        score += 22;
        evidence.push("discovered_pdp_is_hero");
    }
    else if (input.isValidProductDetail) {
        score += 12;
        evidence.push("discovered_pdp_only");
    }
    const price = input.heroPrice;
    if (price != null) {
        if (price >= 150 && price <= 750) {
            score += 22;
            evidence.push("price_sweet_spot");
        }
        else if (price >= 100) {
            score += 12;
            evidence.push("price_acceptable");
        }
        else if (price < 80) {
            score -= 14;
            evidence.push("low_price_penalty");
        }
    }
    if (input.productFamilyRelevance) {
        score += 8;
        evidence.push("family_relevant");
    }
    if ((input.assetContentAvailability ?? 0) >= 55) {
        score += 10;
        evidence.push("asset_richness");
    }
    const heroConf = input.heroConfidence ?? 50;
    const confidence = clamp(score * 0.65 + heroConf * 0.35);
    return { score: clamp(score), confidence, evidence };
}
export function computeValidatedGapSalesFit(input) {
    const evidence = [];
    let businessModelScore = 35;
    switch (input.businessModel) {
        case "DTC_OWN_BRAND":
            businessModelScore = 95;
            evidence.push("dtc_own_brand");
            break;
        case "MOSTLY_OWN_BRAND":
            businessModelScore = 82;
            evidence.push("mostly_own_brand");
            break;
        case "FOCUSED_SPECIALIST_RESELLER":
            businessModelScore = 38;
            evidence.push("specialist_reseller");
            break;
        case "GENERAL_RESELLER":
            businessModelScore = 18;
            evidence.push("general_reseller");
            break;
        case "GENERAL_RETAILER":
            businessModelScore = 8;
            evidence.push("general_retailer");
            break;
        default:
            businessModelScore = 42;
    }
    if (!input.businessModelSalesCandidate) {
        businessModelScore = Math.min(businessModelScore, 35);
        evidence.push("business_model_reject");
    }
    let paidBonus = 0;
    if (input.paidAcquisitionLevel === "CONFIRMED")
        paidBonus = 5;
    else if (input.paidAcquisitionLevel === "LIKELY")
        paidBonus = 3;
    const score = clamp(input.rawPdpRedesignOpportunity * 0.28 +
        input.redesignMaterialFeasibility * 0.18 +
        businessModelScore * 0.22 +
        (input.companyScaleFit ?? 45) * 0.1 +
        (input.catalogFocus ?? 45) * 0.08 +
        input.catalogBandScore * 0.06 +
        (input.ownBrandSignal ?? 45) * 0.06 +
        input.heroCandidateScore * 0.1 +
        input.heroEconomicsScore * 0.08 +
        paidBonus);
    let confidence = "LOW";
    if (score >= 72 && input.businessModelSalesCandidate)
        confidence = "HIGH";
    else if (score >= 58)
        confidence = "MEDIUM";
    return { score, confidence, evidence };
}
export function passesPreAuditGate(input) {
    const failures = [];
    if (!input.isValidProductDetail)
        failures.push("not_product_detail");
    if (input.rawPdpRedesignOpportunity < 58)
        failures.push("raw_gap_low");
    if (input.redesignMaterialFeasibility < 60)
        failures.push("material_feasibility_low");
    if ((input.companyScaleFit ?? 0) < 40)
        failures.push("company_scale_low");
    if ((input.catalogFocus ?? 0) < 45)
        failures.push("catalog_focus_low");
    if (!input.businessModelSalesCandidate)
        failures.push("business_model_reject");
    if (input.businessModel === "GENERAL_RETAILER" ||
        input.businessModel === "GENERAL_RESELLER") {
        failures.push("general_retailer_or_reseller");
    }
    const compactCatalog = input.catalogEstimate != null
        ? input.catalogEstimate <= 80
        : (input.catalogFocus ?? 0) >= 50;
    const lowPriceOwnBrandException = (input.heroPrice ?? 0) >= 40 &&
        (input.heroPrice ?? 0) < 80 &&
        (input.ownBrandSignal ?? 0) >= 65 &&
        compactCatalog &&
        input.redesignMaterialFeasibility >= 68 &&
        (input.businessModel === "DTC_OWN_BRAND" ||
            input.businessModel === "MOSTLY_OWN_BRAND");
    if (input.heroCandidateScore < 45)
        failures.push("hero_candidate_weak");
    if (input.heroEconomicsScore < 40 && !lowPriceOwnBrandException) {
        failures.push("hero_economics_weak");
    }
    if ((input.businessMaturityScore ?? 50) < 28)
        failures.push("maturity_very_low");
    return { pass: failures.length === 0, failures };
}
//# sourceMappingURL=validatedGapSalesFit.js.map