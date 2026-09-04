const KEYWORD_LOCALE = "nl-NL";
/** Keyword → category map for seed/development keywords. */
export const KEYWORD_CATEGORIES = {
    "led masker kopen": "Beauty / Skincare",
    "anti aging serum": "Beauty / Skincare",
    wimperserum: "Beauty / Skincare",
    "gezichtsreiniger kopen": "Beauty / Skincare",
    "collageen masker": "Beauty / Skincare",
    "haaruitval shampoo": "Haircare",
    "orthopedisch kussen": "Sleep",
    "matras kopen": "Sleep",
    "elektrische deken": "Sleep",
    "hondenmand kopen": "Pets",
};
export const SEED_KEYWORDS = Object.keys(KEYWORD_CATEGORIES);
export async function seedDevelopmentKeywords(client) {
    const rows = SEED_KEYWORDS.map((keyword) => ({
        keyword,
        locale: KEYWORD_LOCALE,
        category: KEYWORD_CATEGORIES[keyword] ?? null,
        active: true,
    }));
    const { error } = await client.from("keywords").upsert(rows, {
        onConflict: "keyword,locale",
        ignoreDuplicates: false,
    });
    if (error) {
        throw new Error(`Failed to seed keywords: ${error.message}`);
    }
    return rows.length;
}
export async function loadActiveKeywords(client, limit, keywordFilter) {
    let query = client
        .from("keywords")
        .select("id, keyword, locale, category, active, last_scanned_at")
        .eq("active", true)
        .order("last_scanned_at", { ascending: true, nullsFirst: true });
    if (keywordFilter) {
        query = query.eq("keyword", keywordFilter);
    }
    const { data, error } = await query.limit(limit);
    if (error) {
        throw new Error(`Failed to load keywords: ${error.message}`);
    }
    return data ?? [];
}
export async function updateKeywordLastScanned(client, keywordId, scannedAt) {
    const { error } = await client
        .from("keywords")
        .update({ last_scanned_at: scannedAt, updated_at: scannedAt })
        .eq("id", keywordId);
    if (error) {
        throw new Error(`Failed to update keyword scan time: ${error.message}`);
    }
}
//# sourceMappingURL=keywordsRepository.js.map