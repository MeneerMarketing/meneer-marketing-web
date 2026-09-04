/**
 * Normalize NL ecommerce keywords for near-duplicate detection.
 * Keeps commercial intent variants like "led masker" vs "led masker kopen" distinct.
 */
const PLURAL_MAP = {
    maskers: "masker",
    serums: "serum",
    patches: "patch",
    reinigers: "reiniger",
    apparaten: "apparaat",
    kussens: "kussen",
    matrassen: "matras",
    toppers: "topper",
    dekens: "deken",
};
export function normalizeKeyword(raw) {
    let s = raw
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[''`]/g, "")
        .replace(/[^a-z0-9\s+]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    const tokens = s.split(" ").map((token) => {
        if (PLURAL_MAP[token])
            return PLURAL_MAP[token];
        if (token.endsWith("en") && token.length > 5 && !token.endsWith("een")) {
            // light Dutch plural trim: maskers already mapped; avoid aggressive stems
            return token;
        }
        return token;
    });
    return tokens.join(" ");
}
/**
 * Near-duplicate key: strips light commercial suffixes only for merge decisions
 * when the remaining core is identical AND the stripped form is a pure plural/hyphen variant.
 * Does NOT strip "kopen" / "bestellen" — those stay separate commercial intents.
 */
export function nearDuplicateKey(raw) {
    return normalizeKeyword(raw)
        .replace(/\bled\s*masker\b/g, "led masker")
        .replace(/\s+/g, " ")
        .trim();
}
export function isSameCommercialTarget(a, b) {
    return nearDuplicateKey(a) === nearDuplicateKey(b);
}
//# sourceMappingURL=normalizeKeyword.js.map