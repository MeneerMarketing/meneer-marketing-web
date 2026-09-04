/**
 * Milestone 9.5.1 — rehydrate the M9.5 prospect pool from a stored run (no SERP spend).
 */
import { ARCHETYPE_BY_ID } from "../../config/idealProductArchetypes.js";
import { classifyProspectExclusion } from "./prospectPipelineGate.js";
import { extractAdProduct } from "./heroProductResolver.js";
export async function loadDesignGapPoolFromRun(supabase, runId) {
    const { data, error } = await supabase
        .from("ad_occurrences")
        .select("keyword_id, brand_id, landing_url, headline, serp_item_type, raw_payload, keywords(keyword, product_archetype_id, cluster, product_family_id), brands(normalized_domain, name, business_type, platform, is_ecommerce, retailer_scale_score, business_maturity_score, own_brand_signal_score, manual_excluded)")
        .eq("run_id", runId);
    if (error)
        throw new Error(`pool load failed: ${error.message}`);
    const byDomain = new Map();
    for (const row of data ?? []) {
        const brandRaw = row.brands;
        const brand = (Array.isArray(brandRaw) ? brandRaw[0] : brandRaw);
        const domain = String(brand?.normalized_domain ?? "");
        if (!domain)
            continue;
        const keywordRaw = row.keywords;
        const keywordRow = (Array.isArray(keywordRaw) ? keywordRaw[0] : keywordRaw);
        const keyword = String(keywordRow?.keyword ?? "");
        const archetypeId = String(keywordRow?.product_archetype_id ?? "NICHE_CONSUMER_TECH");
        const familyId = String(keywordRow?.cluster ?? keywordRow?.product_family_id ?? "");
        const family = ARCHETYPE_BY_ID.get(archetypeId)?.families.find((f) => f.id === familyId);
        let entry = byDomain.get(domain);
        if (!entry) {
            const verdict = classifyProspectExclusion({
                domain,
                businessType: brand?.business_type,
                isEcommerce: brand?.is_ecommerce,
                manualExcluded: brand?.manual_excluded,
                retailerScaleScore: brand?.retailer_scale_score,
                businessMaturityScore: brand?.business_maturity_score,
            });
            const serpType = String(row.serp_item_type ?? "");
            const isShopping = /shopping|product/i.test(serpType);
            entry = {
                domain,
                brandId: row.brand_id ? String(row.brand_id) : null,
                brandName: String(brand?.name ?? domain),
                archetypeId,
                familyId,
                familyLabel: family?.label ?? familyId,
                keywords: [],
                landingUrls: [],
                adProducts: [],
                discoveryRoute: isShopping ? "shopping_first" : "ads_first",
                discoverySource: isShopping ? "SHOPPING_MERCHANT" : "ORGANIC_PRODUCT_SERP",
                sourceQuery: keyword || null,
                sourceEvidence: isShopping ? ["shopping_serp_item"] : ["paid_serp_item"],
                businessType: brand?.business_type,
                platform: brand?.platform,
                isEcommerce: brand?.is_ecommerce,
                retailerScaleScore: brand?.retailer_scale_score,
                businessMaturityScore: brand?.business_maturity_score,
                ownBrandSignal: brand?.own_brand_signal_score,
                prospectClass: verdict.prospectClass,
                gateEligible: verdict.eligible,
                gateReason: verdict.reason,
            };
            byDomain.set(domain, entry);
        }
        if (keyword && !entry.keywords.includes(keyword))
            entry.keywords.push(keyword);
        const landingUrl = row.landing_url;
        if (landingUrl && !entry.landingUrls.includes(landingUrl))
            entry.landingUrls.push(landingUrl);
        const adProduct = extractAdProduct({
            headline: row.headline ?? null,
            landingUrl,
            serpItemType: String(row.serp_item_type ?? ""),
            rawItem: (row.raw_payload ?? {}),
        });
        if (adProduct && !entry.adProducts.some((p) => p.title === adProduct.title)) {
            entry.adProducts.push(adProduct);
        }
    }
    return [...byDomain.values()];
}
export async function loadKeywordMeta(supabase, runId) {
    const { data: run } = await supabase.from("runs").select("metadata").eq("id", runId).maybeSingle();
    const names = (run?.metadata ?? {}).keywords ?? [];
    if (names.length === 0)
        return new Map();
    const { data, error } = await supabase
        .from("keywords")
        .select("id, keyword, product_archetype_id, cluster, product_family_id")
        .in("keyword", names);
    if (error)
        throw new Error(`keyword meta load failed: ${error.message}`);
    const map = new Map();
    for (const row of data ?? []) {
        const archetypeId = String(row.product_archetype_id);
        const familyId = String(row.cluster ?? row.product_family_id ?? "");
        const family = ARCHETYPE_BY_ID.get(archetypeId)?.families.find((f) => f.id === familyId);
        map.set(String(row.keyword), {
            keyword: String(row.keyword),
            archetypeId,
            familyId,
            familyLabel: family?.label ?? familyId,
        });
    }
    return map;
}
//# sourceMappingURL=designGapPoolLoader.js.map