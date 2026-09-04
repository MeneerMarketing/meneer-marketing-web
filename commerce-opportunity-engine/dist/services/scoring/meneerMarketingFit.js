import { FULL_REBUILD_FIT_BY_RELATIONSHIP, PRODUCT_MERCHANT_MM_FIT_DELTA, } from "../../config/commercialFit.js";
import { MENEER_MARKETING_FIT_WEIGHTS } from "../../config/scoringWeights.js";
/**
 * Deterministic Meneer Marketing Fit (0-100).
 * Separate from Opportunity Score: client-profile fit, not CRO gap size.
 */
export function computeMeneerMarketingFit(input) {
    if (input.manualExcluded) {
        return {
            score: 5,
            components: {},
            formula: "manual_excluded → hard floor 5",
            hardFloorApplied: true,
            reason: "Handmatig uitgesloten merk",
        };
    }
    const type = (input.businessType ?? "").toUpperCase();
    if (type === "MARKETPLACE" || type === "GENERAL_RETAILER") {
        return {
            score: 12,
            components: { businessTypeFit: 5 },
            formula: "marketplace/general_retailer → hard floor 12",
            hardFloorApplied: true,
            reason: "Marketplace of general retailer past niet bij onze dienstverlening",
        };
    }
    const relationship = input.productMerchantRelationship ?? "UNKNOWN";
    const shopifyFit = scoreShopify(input.platform, input.platformCandidate);
    const businessTypeFit = scoreBusinessType(type);
    const retailerScaleFit = scoreRetailerScaleFit(input.retailerScaleScore);
    const commercialMaturity = clamp(input.businessMaturityScore ?? 40);
    const confirmedPaidActivity = input.confirmedGoogleAdvertiser || input.paidConfirmed ? 92 : 25;
    const productSeriousness = scoreProductSeriousness(input.productPrice, input.reviewCount, input.hasExactProductTarget);
    let projectSuitability = scoreProjectSuitability(input, relationship);
    const w = MENEER_MARKETING_FIT_WEIGHTS;
    let weighted = shopifyFit * w.shopifyFit +
        businessTypeFit * w.businessTypeFit +
        retailerScaleFit * w.retailerScaleFit +
        commercialMaturity * w.commercialMaturity +
        confirmedPaidActivity * w.confirmedPaidActivity +
        productSeriousness * w.productSeriousness +
        projectSuitability * w.projectSuitability;
    weighted += PRODUCT_MERCHANT_MM_FIT_DELTA[relationship];
    let score = Math.round(clamp(weighted));
    if (!input.leadEligible) {
        score = Math.min(score, 35);
    }
    return {
        score,
        components: {
            shopifyFit: Math.round(shopifyFit),
            businessTypeFit: Math.round(businessTypeFit),
            retailerScaleFit: Math.round(retailerScaleFit),
            commercialMaturity: Math.round(commercialMaturity),
            confirmedPaidActivity: Math.round(confirmedPaidActivity),
            productSeriousness: Math.round(productSeriousness),
            projectSuitability: Math.round(projectSuitability),
            productMerchantDelta: PRODUCT_MERCHANT_MM_FIT_DELTA[relationship],
        },
        formula: "shopify20 + businessType20 + retailerScaleFit15 + maturity15 + paid10 + product10 + project10 + merchantDelta (OWN_BRAND+/RESELLER-)",
        hardFloorApplied: false,
        reason: buildReason({
            shopifyFit,
            businessTypeFit,
            retailerScaleFit,
            type,
            leadEligible: input.leadEligible,
            relationship,
        }),
    };
}
function scoreShopify(platform, candidate) {
    if (platform === "SHOPIFY")
        return 100;
    if (candidate === "SHOPIFY")
        return 78;
    if (platform === "WOOCOMMERCE" || candidate === "WOOCOMMERCE")
        return 62;
    if (candidate === "MAGENTO" || platform === "MAGENTO")
        return 48;
    if (platform && platform !== "UNKNOWN")
        return 40;
    if (candidate && candidate !== "UNKNOWN")
        return 35;
    return 22;
}
function scoreBusinessType(type) {
    if (type === "BRAND")
        return 100;
    if (type === "SPECIALIST_WEBSHOP")
        return 92;
    if (type === "DTC")
        return 90;
    if (type === "MULTI_BRAND_SPECIALIST")
        return 55;
    if (type === "RETAILER")
        return 30;
    if (!type)
        return 45;
    return 40;
}
function scoreRetailerScaleFit(scale) {
    if (scale == null)
        return 55;
    if (scale <= 20)
        return 70;
    if (scale <= 45)
        return 95;
    if (scale <= 60)
        return 75;
    if (scale <= 75)
        return 40;
    return 15;
}
function scoreProductSeriousness(price, reviews, hasExactProductTarget) {
    let score = hasExactProductTarget ? 55 : 30;
    if (price != null) {
        if (price >= 200)
            score += 30;
        else if (price >= 80)
            score += 22;
        else if (price >= 30)
            score += 12;
        else
            score += 4;
    }
    if (reviews != null) {
        if (reviews >= 500)
            score += 15;
        else if (reviews >= 50)
            score += 10;
        else if (reviews >= 5)
            score += 5;
    }
    return clamp(score);
}
function scoreProjectSuitability(input, relationship) {
    let score = 50;
    if (input.leadEligible)
        score += 25;
    if (input.platform === "SHOPIFY" || input.platformCandidate === "SHOPIFY")
        score += 15;
    if ((input.businessType ?? "").toUpperCase() === "SPECIALIST_WEBSHOP")
        score += 10;
    if ((input.retailerScaleScore ?? 0) > 75)
        score -= 30;
    const rebuildMult = FULL_REBUILD_FIT_BY_RELATIONSHIP[relationship];
    if (input.fullRebuildPotential != null) {
        score = score * 0.55 + input.fullRebuildPotential * rebuildMult * 0.45;
    }
    else {
        score *= rebuildMult;
    }
    return clamp(score);
}
function buildReason(input) {
    const bits = [];
    if (input.shopifyFit >= 90)
        bits.push("Shopify fit hoog");
    else if (input.shopifyFit >= 45)
        bits.push("Platform-kandidaat bruikbaar");
    else
        bits.push("Platform fit matig");
    if (input.businessTypeFit >= 85)
        bits.push(`type ${input.type || "onbekend"} past`);
    if (input.retailerScaleFit >= 80)
        bits.push("retailer scale in sweet spot");
    if (input.relationship === "OWN_BRAND")
        bits.push("eigen merk product");
    if (input.relationship === "RESELLER_PRODUCT")
        bits.push("reseller product (lagere rebuild-fit)");
    if (!input.leadEligible)
        bits.push("niet lead-eligible");
    return bits.join("; ");
}
function clamp(value) {
    return Math.min(100, Math.max(0, value));
}
//# sourceMappingURL=meneerMarketingFit.js.map