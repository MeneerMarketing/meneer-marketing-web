/**
 * Detect when paid keyword/ad brand tokens diverge from the canonical brand/domain.
 * Diagnostic only — does not invalidate source integrity.
 */
const COMMERCIAL_STOP = new Set([
    "koop",
    "kopen",
    "bestel",
    "bestellen",
    "goedkoop",
    "prijs",
    "online",
    "webshop",
    "shop",
    "store",
    "nl",
    "led",
    "masker",
    "mask",
    "therapie",
    "therapy",
    "skin",
    "huid",
    "dekbed",
    "kussen",
    "matras",
    "orthopedisch",
]);
const PLACE_STOP = new Set([
    "amsterdam",
    "rotterdam",
    "utrecht",
    "eindhoven",
    "groningen",
    "tilburg",
    "almere",
    "breda",
    "nijmegen",
    "apeldoorn",
    "haarlem",
    "arnhem",
    "enschede",
    "amersfoort",
    "hengelo",
    "zwolle",
    "leiden",
    "maastricht",
    "delft",
    "den",
    "haag",
    "bosch",
]);
export function detectBrandAliasMismatch(input) {
    const keywordTokens = brandishTokens(input.keyword);
    const headlineTokens = brandishTokens(input.adHeadline);
    const keywordBrandTokens = unique([...keywordTokens, ...headlineTokens]);
    const canonicalBrandTokens = unique([
        ...domainTokens(input.domain),
        ...tokenize(input.brandName ?? ""),
    ]);
    if (keywordBrandTokens.length === 0) {
        return {
            detected: false,
            confidence: 40,
            reason: "Geen merksignaal in keyword/ad",
            keywordBrandTokens,
            canonicalBrandTokens,
            suggestedAlias: null,
        };
    }
    const overlap = keywordBrandTokens.filter((t) => canonicalBrandTokens.includes(t));
    if (overlap.length > 0) {
        return {
            detected: false,
            confidence: 80,
            reason: `Keyword/ad overlapt canonical brand (${overlap.join(", ")})`,
            keywordBrandTokens,
            canonicalBrandTokens,
            suggestedAlias: null,
        };
    }
    // Proper-noun-ish leftover tokens in keyword that are not commercial/place
    const aliasCandidates = keywordBrandTokens.filter((t) => !COMMERCIAL_STOP.has(t) && !PLACE_STOP.has(t) && t.length >= 4);
    if (aliasCandidates.length === 0) {
        return {
            detected: false,
            confidence: 55,
            reason: "Geen sterke alias-kandidaat na filteren van commerciele/plaats-tokens",
            keywordBrandTokens,
            canonicalBrandTokens,
            suggestedAlias: null,
        };
    }
    const suggestedAlias = aliasCandidates
        .slice(0, 2)
        .map((t) => t.charAt(0).toUpperCase() + t.slice(1))
        .join(" ");
    return {
        detected: true,
        confidence: aliasCandidates.length >= 1 && keywordTokens.length >= 1 ? 82 : 70,
        reason: `Paid keyword/ad lijkt gericht op andere/voormalige merknaam: ${suggestedAlias}`,
        keywordBrandTokens,
        canonicalBrandTokens,
        suggestedAlias,
    };
}
function domainTokens(domain) {
    if (!domain)
        return [];
    const base = domain
        .toLowerCase()
        .replace(/\.(nl|com|eu|be|de|shop|store)$/g, "")
        .replace(/[^a-z0-9]+/g, " ");
    return tokenize(base);
}
function brandishTokens(value) {
    return tokenize(value ?? "").filter((t) => !COMMERCIAL_STOP.has(t) && t.length >= 4);
}
function tokenize(value) {
    return value
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, " ")
        .split(/[\s/_-]+/)
        .filter((t) => t.length >= 3);
}
function unique(values) {
    return [...new Set(values)];
}
//# sourceMappingURL=brandAlias.js.map