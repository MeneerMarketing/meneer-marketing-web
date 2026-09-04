/**
 * Normalize NL ecommerce keywords for near-duplicate detection.
 * Keeps commercial intent variants like "led masker" vs "led masker kopen" distinct.
 */
export declare function normalizeKeyword(raw: string): string;
/**
 * Near-duplicate key: strips light commercial suffixes only for merge decisions
 * when the remaining core is identical AND the stripped form is a pure plural/hyphen variant.
 * Does NOT strip "kopen" / "bestellen" — those stay separate commercial intents.
 */
export declare function nearDuplicateKey(raw: string): string;
export declare function isSameCommercialTarget(a: string, b: string): boolean;
//# sourceMappingURL=normalizeKeyword.d.ts.map