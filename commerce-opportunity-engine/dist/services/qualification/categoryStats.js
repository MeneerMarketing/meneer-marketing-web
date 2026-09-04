import { CONTROLLED_SCALE_CATEGORIES } from "../../config/controlledScale.js";
/**
 * Aggregate category funnel metrics with DISTINCT brand identity.
 * Fixes M7.2 bug where prequalified/specialists were incremented per ad_occurrence row.
 */
export function aggregateUniqueCategoryMetrics(input) {
    let ecommerce = 0;
    let specialists = 0;
    let preq = 0;
    let shop = 0;
    let conf = 0;
    for (const b of input.brandsById.values()) {
        if (b.is_ecommerce)
            ecommerce += 1;
        const t = String(b.business_type ?? "").toUpperCase();
        if (t === "BRAND" || t === "SPECIALIST_WEBSHOP")
            specialists += 1;
        if (b.prequalified_prospect)
            preq += 1;
        if (String(b.platform ?? "").toUpperCase() === "SHOPIFY")
            shop += 1;
        if (b.confirmed_google_advertiser || b.transparency_confirmed)
            conf += 1;
    }
    const domains = input.brandsById.size;
    const yieldScore = Math.max(0, Math.min(100, Math.round(20 +
        domains * 2 +
        specialists * 3 +
        shop * 4 +
        conf * 5 +
        preq * 1.5 -
        (specialists === 0 ? 10 : 0))));
    return {
        categoryId: input.categoryId,
        keywordsScanned: input.keywordsScanned,
        serpCost: input.serpCost,
        uniqueDomains: domains,
        uniqueEcommerceDomains: ecommerce,
        uniqueBrandSpecialistDomains: specialists,
        uniquePrequalifiedDomains: preq,
        uniqueShopifyDomains: shop,
        uniqueConfirmedDomains: conf,
        categoryProspectYieldScore: yieldScore,
    };
}
export async function computeCategoryUniqueStats(client, options) {
    const out = {};
    for (const cat of CONTROLLED_SCALE_CATEGORIES) {
        const kwIds = options.categoryKeywordIds[cat] ?? [];
        const { data: catAds, error } = await client
            .from("ad_occurrences")
            .select(`brand_id,
         brands(
           id, business_type, platform, is_ecommerce,
           prequalified_prospect, confirmed_google_advertiser, transparency_confirmed
         )`)
            .in("keyword_id", kwIds.length ? kwIds : ["00000000-0000-0000-0000-000000000000"]);
        if (error)
            throw new Error(`Category stats load failed (${cat}): ${error.message}`);
        const brandsById = new Map();
        for (const ad of catAds ?? []) {
            if (!ad.brand_id)
                continue;
            const raw = Array.isArray(ad.brands) ? ad.brands[0] : ad.brands;
            if (!raw || typeof raw !== "object")
                continue;
            const b = raw;
            brandsById.set(ad.brand_id, {
                id: ad.brand_id,
                business_type: b.business_type,
                platform: b.platform,
                is_ecommerce: b.is_ecommerce,
                prequalified_prospect: b.prequalified_prospect,
                confirmed_google_advertiser: b.confirmed_google_advertiser,
                transparency_confirmed: b.transparency_confirmed,
            });
        }
        out[cat] = aggregateUniqueCategoryMetrics({
            categoryId: cat,
            keywordsScanned: kwIds.length,
            serpCost: options.serpCostByCategory?.[cat] ?? 0,
            brandsById,
        });
    }
    return out;
}
export function categoryStatsToJson(metrics) {
    return {
        keywordsScanned: metrics.keywordsScanned,
        serpCost: Number(metrics.serpCost.toFixed(4)),
        domainsFound: metrics.uniqueDomains,
        uniqueDomains: metrics.uniqueDomains,
        uniqueEcommerceDomains: metrics.uniqueEcommerceDomains,
        specialistsBrands: metrics.uniqueBrandSpecialistDomains,
        uniqueBrandSpecialistDomains: metrics.uniqueBrandSpecialistDomains,
        prequalified: metrics.uniquePrequalifiedDomains,
        uniquePrequalifiedDomains: metrics.uniquePrequalifiedDomains,
        shopify: metrics.uniqueShopifyDomains,
        uniqueShopifyDomains: metrics.uniqueShopifyDomains,
        confirmedAdvertisers: metrics.uniqueConfirmedDomains,
        uniqueConfirmedDomains: metrics.uniqueConfirmedDomains,
        categoryProspectYieldScore: metrics.categoryProspectYieldScore,
    };
}
//# sourceMappingURL=categoryStats.js.map