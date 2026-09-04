/**
 * Milestone 9.4.1 — verify paid keyword → hero product alignment.
 *
 * Confirms the audited PDP is the same commercial opportunity as the ad, not a
 * random product page from the catalog.
 */
const STOP = new Set([
    "voor",
    "van",
    "met",
    "een",
    "de",
    "het",
    "en",
    "thuis",
    "the",
    "and",
    "for",
]);
function tokens(value) {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((token) => token.length > 2 && !STOP.has(token));
}
export function verifyPaidProductTarget(input) {
    const evidence = [];
    const keyword = input.expectedKeyword && input.adKeywords.includes(input.expectedKeyword)
        ? input.expectedKeyword
        : input.adKeywords[0] ?? input.expectedKeyword ?? null;
    if (!keyword) {
        return {
            targetConfidence: 35,
            aligned: false,
            evidence: ["geen advertentie-keyword gevonden"],
            keywordUsed: null,
        };
    }
    const keywordTokenList = tokens(keyword);
    const keywordTokens = new Set(keywordTokenList);
    const heroTokens = tokens(input.heroTitle ?? "");
    const familyTokens = tokens(input.familyLabel ?? "");
    const familyTokenSet = new Set(familyTokens);
    const overlapKeyword = heroTokens.filter((token) => keywordTokens.has(token));
    const overlapFamily = heroTokens.filter((token) => familyTokenSet.has(token));
    let score = 45;
    if (overlapKeyword.length >= 2) {
        score += 25;
        evidence.push(`keyword overlap: ${overlapKeyword.join(", ")}`);
    }
    else if (overlapKeyword.length === 1) {
        score += 12;
        evidence.push(`één keyword-token: ${overlapKeyword[0]}`);
    }
    if (overlapFamily.length >= 1) {
        score += 10;
        evidence.push(`familie overlap: ${overlapFamily.join(", ")}`);
    }
    if (input.heroUrlFromAd) {
        score += 15;
        evidence.push("hero URL uit advertentie-landing");
    }
    if (input.heroUrl && /product/i.test(input.heroUrl)) {
        score += 8;
        evidence.push("productpagina URL bevestigd");
    }
    const hairTokens = ["haar", "hair", "haargroei", "scalp", "hoofdhuid", "laser", "led", "licht", "therapie", "pet", "helm", "cap"];
    const heroHasHair = heroTokens.some((token) => hairTokens.includes(token));
    const keywordHasHair = keywordTokenList.some((token) => hairTokens.includes(token));
    if (heroHasHair && keywordHasHair) {
        score += 10;
        evidence.push("haar/LED-therapie thema consistent");
    }
    const targetConfidence = Math.max(0, Math.min(100, Math.round(score)));
    const aligned = targetConfidence >= 62 && overlapKeyword.length >= 1;
    return {
        targetConfidence,
        aligned,
        evidence,
        keywordUsed: keyword,
    };
}
//# sourceMappingURL=paidProductTargetVerification.js.map