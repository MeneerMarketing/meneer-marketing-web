import { CONTROLLED_SCALE_CATEGORIES, CONTROLLED_SCALE_CATEGORY_QUOTAS, CONTROLLED_SCALE_DEFAULTS, } from "../../config/controlledScale.js";
import { PAID_VERIFY_DEFAULTS } from "../../config/paidVerify.js";
import { scoreDiscoveryPriority } from "./discoveryPriority.js";
import { normalizeKeyword } from "./normalizeKeyword.js";
function nearDupeKey(keyword) {
    return normalizeKeyword(keyword)
        .replace(/\b(kopen|bestellen|beste|goedkoop|prijs)\b/g, "")
        .replace(/\s+/g, " ")
        .trim();
}
export async function selectControlledScaleKeywords(client, options) {
    const maxKeywords = options?.maxKeywords ?? CONTROLLED_SCALE_DEFAULTS.maxKeywords;
    const maxCluster = options?.maxCluster ?? CONTROLLED_SCALE_DEFAULTS.maxClusterPerCategory;
    const maxBrandedShare = options?.maxBrandedShare ?? CONTROLLED_SCALE_DEFAULTS.maxProductBrandedShare;
    const cooldownDays = options?.cooldownDays ?? CONTROLLED_SCALE_DEFAULTS.rescanCooldownDays;
    const cooldownMs = cooldownDays * 24 * 60 * 60 * 1000;
    const now = Date.now();
    const { data, error } = await client
        .from("keywords")
        .select(`id, keyword, category, cluster, keyword_intent_type, prospecting_tier,
       prospecting_value_score, keyword_quality_score, commercial_intent_score,
       product_intent_score, prospect_yield_score, unique_domains_found, retailer_ratio,
       category_relevance_score, last_scanned_at, rejected, paused, active`)
        .in("category", [...CONTROLLED_SCALE_CATEGORIES])
        .eq("rejected", false)
        .eq("paused", false)
        .or("prospecting_tier.is.null,prospecting_tier.neq.REJECT")
        .not("keyword_intent_type", "in", "(RETAILER_BRANDED,REVIEW_RESEARCH,INFORMATIONAL,SERVICE)");
    if (error)
        throw new Error(`Failed to load keywords for selection: ${error.message}`);
    const scored = [];
    let skippedCooldown = 0;
    for (const row of data ?? []) {
        // Prefer PRIMARY; allow PRODUCT_BRANDED later with share cap.
        // Cooldown: skip only if scanned within cooldown AND we still have enough
        // unscanned candidates later — applied as soft preference via sort, hard skip
        // only when last_scanned within cooldownDays/2 to avoid starving categories.
        if (row.last_scanned_at) {
            const age = now - new Date(row.last_scanned_at).getTime();
            if (age < cooldownMs / 2) {
                skippedCooldown += 1;
                continue;
            }
        }
        const intent = row.keyword_intent_type ?? "";
        const tier = row.prospecting_tier ?? "";
        // Prefer PRIMARY; allow SECONDARY / PRODUCT_BRANDED later with share cap
        if (tier === "LOW_VALUE" && intent !== "NON_BRANDED_PRODUCT") {
            continue;
        }
        const relevance = row.category_relevance_score != null ? Number(row.category_relevance_score) : null;
        // Off-category keywords must not enter PRIMARY discovery selection.
        if (relevance != null &&
            relevance < PAID_VERIFY_DEFAULTS.minRelevanceForPrimary &&
            (tier === "PRIMARY" || intent === "NON_BRANDED_PRODUCT")) {
            continue;
        }
        const priority = scoreDiscoveryPriority({
            prospectingValue: row.prospecting_value_score,
            keywordQuality: row.keyword_quality_score,
            commercialIntent: row.commercial_intent_score,
            productIntent: row.product_intent_score,
            historicalYield: row.prospect_yield_score,
            uniqueDomainsFound: row.unique_domains_found,
            retailerRatio: row.retailer_ratio != null ? Number(row.retailer_ratio) : null,
            categoryRelevance: relevance,
        });
        scored.push({
            id: row.id,
            keyword: row.keyword,
            category: row.category ?? "",
            cluster: row.cluster,
            keyword_intent_type: row.keyword_intent_type,
            prospecting_tier: row.prospecting_tier,
            prospecting_value_score: row.prospecting_value_score,
            keyword_quality_score: row.keyword_quality_score,
            commercial_intent_score: row.commercial_intent_score,
            product_intent_score: row.product_intent_score,
            prospect_yield_score: row.prospect_yield_score,
            unique_domains_found: row.unique_domains_found,
            retailer_ratio: row.retailer_ratio != null ? Number(row.retailer_ratio) : null,
            last_scanned_at: row.last_scanned_at,
            discovery_priority_score: priority.score,
        });
    }
    scored.sort((a, b) => b.discovery_priority_score - a.discovery_priority_score);
    // Persist priority scores for dashboard
    for (const row of scored.slice(0, 200)) {
        await client
            .from("keywords")
            .update({
            discovery_priority_score: row.discovery_priority_score,
            updated_at: new Date().toISOString(),
        })
            .eq("id", row.id);
    }
    const selected = [];
    const byCategory = {};
    const byCluster = {};
    const nearDupes = new Set();
    let brandedCount = 0;
    const maxBranded = Math.floor(maxKeywords * maxBrandedShare);
    const tryAdd = (row, respectQuota) => {
        if (selected.length >= maxKeywords)
            return false;
        if (selected.some((s) => s.id === row.id))
            return false;
        const cat = row.category;
        const quota = CONTROLLED_SCALE_CATEGORY_QUOTAS[cat] ?? 15;
        if (respectQuota && (byCategory[cat] ?? 0) >= quota)
            return false;
        const clusterKey = `${row.category}:${row.cluster ?? "GENERAL"}`;
        if ((byCluster[clusterKey] ?? 0) >= maxCluster)
            return false;
        const nd = nearDupeKey(row.keyword);
        if (nd && nearDupes.has(nd))
            return false;
        const isBranded = row.keyword_intent_type === "PRODUCT_BRANDED";
        if (isBranded && brandedCount >= maxBranded)
            return false;
        // PRIMARY non-branded first preference already via sort + filters
        if (row.keyword_intent_type === "RETAILER_BRANDED")
            return false;
        if (row.keyword_intent_type === "REVIEW_RESEARCH")
            return false;
        selected.push(row);
        byCategory[row.category] = (byCategory[row.category] ?? 0) + 1;
        byCluster[clusterKey] = (byCluster[clusterKey] ?? 0) + 1;
        if (nd)
            nearDupes.add(nd);
        if (isBranded)
            brandedCount += 1;
        return true;
    };
    // Pass 1: PRIMARY non-branded with quotas
    for (const row of scored) {
        if (row.prospecting_tier !== "PRIMARY")
            continue;
        if (row.keyword_intent_type !== "NON_BRANDED_PRODUCT")
            continue;
        tryAdd(row, true);
    }
    // Pass 2: fill quotas with remaining PRIMARY
    for (const row of scored) {
        if (selected.length >= maxKeywords)
            break;
        if (row.prospecting_tier !== "PRIMARY")
            continue;
        tryAdd(row, true);
    }
    // Pass 3: SECONDARY / product branded within share + quotas
    for (const row of scored) {
        if (selected.length >= maxKeywords)
            break;
        tryAdd(row, true);
    }
    // Pass 4: relax quotas if under-filled
    if (selected.length < maxKeywords) {
        for (const row of scored) {
            if (selected.length >= maxKeywords)
                break;
            tryAdd(row, false);
        }
    }
    const avgProspecting = selected.length === 0
        ? 0
        : Math.round(selected.reduce((s, k) => s + (k.prospecting_value_score ?? 0), 0) / selected.length);
    const avgPriority = selected.length === 0
        ? 0
        : Math.round(selected.reduce((s, k) => s + k.discovery_priority_score, 0) / selected.length);
    return {
        selected,
        byCategory,
        byCluster,
        brandedCount,
        skippedCooldown,
        avgProspecting,
        avgPriority,
    };
}
export function ensureCategoryList() {
    return [...CONTROLLED_SCALE_CATEGORIES];
}
//# sourceMappingURL=controlledKeywordSelector.js.map