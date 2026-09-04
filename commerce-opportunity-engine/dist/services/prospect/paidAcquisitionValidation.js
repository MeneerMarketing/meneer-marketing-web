/**
 * Milestone 9.6 — paid acquisition validation (bonus signal, not hard reject).
 */
import { fetchGooglePaidAds } from "../dataforseo/googleSerp.js";
export async function validatePaidAcquisition(input) {
    const keywords = input.productKeywords.slice(0, input.maxKeywords);
    if (keywords.length === 0) {
        return {
            level: "UNKNOWN",
            evidence: ["geen_validatie_keywords"],
            keywordsChecked: [],
            matchedKeywords: [],
            cost: 0,
        };
    }
    let cost = 0;
    const matched = [];
    const evidence = [];
    for (const keyword of keywords) {
        try {
            const serp = await fetchGooglePaidAds(input.serpOptions, keyword);
            cost += serp.cost;
            const domainHit = serp.paidAds.some((ad) => ad.normalizedDomain === input.domain);
            if (domainHit) {
                matched.push(keyword);
                evidence.push(`paid_hit:${keyword}`);
            }
        }
        catch {
            evidence.push(`serp_fail:${keyword}`);
        }
    }
    let level = "NOT_FOUND";
    if (matched.length >= 2)
        level = "CONFIRMED";
    else if (matched.length === 1)
        level = "LIKELY";
    else if (keywords.length === 0)
        level = "UNKNOWN";
    return {
        level,
        evidence,
        keywordsChecked: keywords,
        matchedKeywords: matched,
        cost,
    };
}
export function paidAcquisitionBonus(level) {
    if (level === "CONFIRMED")
        return 8;
    if (level === "LIKELY")
        return 4;
    if (level === "NOT_FOUND")
        return -4;
    return 0;
}
//# sourceMappingURL=paidAcquisitionValidation.js.map