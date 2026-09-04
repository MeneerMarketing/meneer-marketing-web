/**
 * Milestone 9.8.1 — business model classification for sales-fit.
 */
import { isMassRetailerDomain } from "./pdpCandidateGate.js";
import { M96_RETAILER_DOMAIN_HINTS } from "../../config/brandFirstHighTicket.js";
const GENERAL_RETAILER_DOMAINS = [
    "bcc.nl",
    "limango.nl",
    "plein.nl",
    "decathlon.nl",
    "wehkamp.nl",
    "bol.com",
    "coolblue.nl",
    "mediamarkt.nl",
    "amazon.",
    "forbes.com",
];
export function classifyBusinessModel(input) {
    const evidence = [];
    const domain = input.domain.toLowerCase().replace(/^www\./, "");
    const own = input.ownBrandSignal ?? 45;
    const catalog = input.estimatedCatalogSize ?? input.catalogEstimate ?? null;
    const focus = input.catalogFocus ?? 50;
    const scale = input.retailerScaleScore ?? 30;
    const breadth = input.retailerBreadthScore ?? 30;
    const urlLower = (input.productUrl ?? "").toLowerCase();
    const titleLower = (input.productTitle ?? "").toLowerCase();
    const externalBrandHints = [
        "blackroll",
        "philips",
        "sonicare",
        "waterpik",
        "oral-b",
        "braun",
        "foreo",
        "revigurize",
    ];
    for (const brand of externalBrandHints) {
        const inContent = urlLower.includes(brand) || titleLower.includes(brand);
        const inDomain = domain.includes(brand.replace(/-/g, ""));
        if (inContent && !inDomain) {
            return {
                businessModel: "FOCUSED_SPECIALIST_RESELLER",
                salesCandidate: false,
                rejectReason: "third_party_brand_on_shop",
                evidence: [`external_brand_${brand}`],
            };
        }
    }
    if (isMassRetailerDomain(domain)) {
        return {
            businessModel: "GENERAL_RETAILER",
            salesCandidate: false,
            rejectReason: "mass_retailer_domain",
            evidence: ["mass_retailer_hint"],
        };
    }
    if (GENERAL_RETAILER_DOMAINS.some((hint) => domain.includes(hint.replace(/\.$/, "")))) {
        return {
            businessModel: "GENERAL_RETAILER",
            salesCandidate: false,
            rejectReason: "known_general_retailer",
            evidence: ["known_retailer_domain"],
        };
    }
    if (M96_RETAILER_DOMAIN_HINTS.some((hint) => domain.includes(hint))) {
        return {
            businessModel: "GENERAL_RETAILER",
            salesCandidate: false,
            rejectReason: "retailer_domain_hint",
            evidence: ["retailer_hint"],
        };
    }
    if (own >= 68 && focus >= 55 && (catalog == null || catalog <= 120)) {
        evidence.push("high_own_brand_focused_catalog");
        return {
            businessModel: own >= 75 ? "DTC_OWN_BRAND" : "MOSTLY_OWN_BRAND",
            salesCandidate: true,
            rejectReason: null,
            evidence,
        };
    }
    if (own >= 55 && focus >= 50 && (catalog == null || catalog <= 80)) {
        evidence.push("mostly_own_compact");
        return {
            businessModel: "MOSTLY_OWN_BRAND",
            salesCandidate: true,
            rejectReason: null,
            evidence,
        };
    }
    if (own < 42 && (catalog ?? 0) > 150) {
        return {
            businessModel: "GENERAL_RESELLER",
            salesCandidate: false,
            rejectReason: "wide_reseller_catalog",
            evidence: ["low_own_brand_large_catalog"],
        };
    }
    if (scale >= 65 || breadth >= 55 || (catalog ?? 0) > 250) {
        return {
            businessModel: "GENERAL_RESELLER",
            salesCandidate: false,
            rejectReason: "large_retailer_scale",
            evidence: ["high_retailer_scale_or_breadth"],
        };
    }
    const type = (input.businessType ?? "").toUpperCase();
    if (type.includes("RETAILER") || type.includes("RESELLER")) {
        if (own >= 50 && focus >= 60 && (catalog ?? 0) <= 100) {
            evidence.push("focused_specialist_reseller");
            return {
                businessModel: "FOCUSED_SPECIALIST_RESELLER",
                salesCandidate: false,
                rejectReason: "specialist_reseller_not_primary_target",
                evidence,
            };
        }
        return {
            businessModel: "GENERAL_RESELLER",
            salesCandidate: false,
            rejectReason: "reseller_profile",
            evidence: ["reseller_business_type"],
        };
    }
    if (own >= 50) {
        return {
            businessModel: "MOSTLY_OWN_BRAND",
            salesCandidate: true,
            rejectReason: null,
            evidence: ["moderate_own_brand"],
        };
    }
    return {
        businessModel: "UNKNOWN",
        salesCandidate: false,
        rejectReason: "business_model_unclear",
        evidence: ["unknown_model"],
    };
}
export function catalogBandPenalty(catalogEstimate) {
    const c = catalogEstimate;
    if (c == null)
        return { band: "unknown", score: 52, penalty: 0 };
    if (c <= 30)
        return { band: "3_30_sweet", score: 95, penalty: 0 };
    if (c <= 60)
        return { band: "31_60_strong", score: 82, penalty: 0 };
    if (c <= 100)
        return { band: "61_100_ok", score: 68, penalty: 4 };
    if (c <= 250)
        return { band: "101_250_penalty", score: 45, penalty: 14 };
    return { band: "250_plus_strong_penalty", score: 22, penalty: 28 };
}
//# sourceMappingURL=businessModelClassifier.js.map