import { KEYWORD_CATEGORY_CONFIGS, } from "../../config/keywordCategories.js";
export const KEYWORD_LOCALE = "nl-NL";
export async function ensureKeywordCategories(client) {
    const rows = KEYWORD_CATEGORY_CONFIGS.map((c) => ({
        id: c.id,
        label: c.label,
        active: true,
        paused: c.defaultPaused,
        seed_topics: c.seedTopics,
        updated_at: new Date().toISOString(),
    }));
    // Do not overwrite active/paused on existing rows (operator + scale runs own that).
    for (const row of rows) {
        const { data: existing } = await client
            .from("keyword_categories")
            .select("id")
            .eq("id", row.id)
            .maybeSingle();
        if (existing) {
            const { error } = await client
                .from("keyword_categories")
                .update({
                label: row.label,
                seed_topics: row.seed_topics,
                updated_at: row.updated_at,
            })
                .eq("id", row.id);
            if (error)
                throw new Error(`Failed to update keyword_categories: ${error.message}`);
        }
        else {
            const { error } = await client.from("keyword_categories").insert(row);
            if (error)
                throw new Error(`Failed to insert keyword_categories: ${error.message}`);
        }
    }
}
export async function loadActiveCategorySeeds(client, categoryId, maxSeeds) {
    const { data, error } = await client
        .from("keyword_categories")
        .select("id, label, active, paused, seed_topics")
        .eq("id", categoryId)
        .maybeSingle();
    if (error) {
        throw new Error(`Failed to load category: ${error.message}`);
    }
    const fallback = KEYWORD_CATEGORY_CONFIGS.find((c) => c.id === categoryId);
    const seedsRaw = data?.seed_topics ?? fallback?.seedTopics ?? [];
    const seeds = seedsRaw.map((s) => String(s).trim()).filter(Boolean).slice(0, maxSeeds);
    return {
        label: data?.label ?? fallback?.label ?? categoryId,
        seeds,
        paused: Boolean(data?.paused ?? fallback?.defaultPaused ?? true),
        active: data?.active ?? true,
    };
}
export async function upsertKeywordIntelligenceRows(client, rows) {
    let upserted = 0;
    let skippedManual = 0;
    for (const row of rows) {
        const { data: existing, error: findError } = await client
            .from("keywords")
            .select("id, manual_review_override, discovery_status, approved, rejected, paused")
            .eq("keyword", row.keyword)
            .eq("locale", row.locale)
            .maybeSingle();
        if (findError) {
            throw new Error(`Failed to lookup keyword: ${findError.message}`);
        }
        if (existing?.manual_review_override) {
            // Preserve operator status; refresh metrics only
            const { error } = await client
                .from("keywords")
                .update({
                search_volume: row.search_volume,
                cpc: row.cpc,
                competition: row.competition,
                competition_index: row.competition_index,
                competition_level: row.competition_level,
                commercial_intent_score: row.commercial_intent_score,
                product_intent_score: row.product_intent_score,
                keyword_quality_score: row.keyword_quality_score,
                volume_tier: row.volume_tier,
                monthly_searches: row.monthly_searches,
                dfs_categories: row.dfs_categories,
                search_intent_main: row.search_intent_main,
                search_metrics: row.search_metrics,
                last_metrics_update: row.last_metrics_update,
                cluster: row.cluster,
                seed_keyword: row.seed_keyword,
                normalized_keyword: row.normalized_keyword,
                category: row.category,
                keyword_source: row.keyword_source,
                estimated_serp_cost: row.estimated_serp_cost,
                updated_at: row.updated_at,
            })
                .eq("id", existing.id);
            if (error)
                throw new Error(`Failed to update override keyword: ${error.message}`);
            skippedManual += 1;
            continue;
        }
        const payload = { ...row };
        const { error } = await client.from("keywords").upsert(payload, {
            onConflict: "keyword,locale",
            ignoreDuplicates: false,
        });
        if (error) {
            throw new Error(`Failed to upsert keyword ${row.keyword}: ${error.message}`);
        }
        upserted += 1;
    }
    return { upserted, skippedManual };
}
export async function loadApprovedKeywordsForDiscovery(client, limit) {
    const { data, error } = await client
        .from("keywords")
        .select("id, keyword, locale, category")
        .eq("approved", true)
        .eq("active", true)
        .eq("rejected", false)
        .eq("paused", false)
        .eq("discovery_status", "APPROVED")
        .order("keyword_quality_score", { ascending: false, nullsFirst: false })
        .limit(limit);
    if (error) {
        throw new Error(`Failed to load approved keywords: ${error.message}`);
    }
    return data ?? [];
}
export async function loadKeywordsByIds(client, keywordIds) {
    if (keywordIds.length === 0)
        return [];
    const { data, error } = await client
        .from("keywords")
        .select("id, keyword, locale, category")
        .in("id", keywordIds);
    if (error) {
        throw new Error(`Failed to load keywords by id: ${error.message}`);
    }
    // Preserve requested order
    const byId = new Map((data ?? []).map((row) => [row.id, row]));
    return keywordIds.map((id) => byId.get(id)).filter(Boolean);
}
export async function markKeywordsScanned(client, keywordIds, scannedAt) {
    if (keywordIds.length === 0)
        return;
    const { error } = await client
        .from("keywords")
        .update({
        last_scanned_at: scannedAt,
        discovery_status: "SCANNED",
        updated_at: scannedAt,
    })
        .in("id", keywordIds)
        .eq("manual_review_override", false);
    // Also update scanned keywords that have manual override (keep APPROVED status if override)
    await client
        .from("keywords")
        .update({ last_scanned_at: scannedAt, updated_at: scannedAt })
        .in("id", keywordIds)
        .eq("manual_review_override", true);
    if (error) {
        throw new Error(`Failed to mark keywords scanned: ${error.message}`);
    }
}
export async function setKeywordOperatorStatus(client, keywordId, action, reason) {
    const now = new Date().toISOString();
    const patch = {
        manual_review_override: true,
        manual_review_at: now,
        updated_at: now,
    };
    if (action === "approve") {
        Object.assign(patch, {
            approved: true,
            rejected: false,
            paused: false,
            active: true,
            discovery_status: "APPROVED",
            rejection_reason: null,
        });
    }
    else if (action === "reject") {
        Object.assign(patch, {
            approved: false,
            rejected: true,
            paused: false,
            active: false,
            discovery_status: "REJECTED",
            rejection_reason: reason ?? "manual_reject",
        });
    }
    else {
        Object.assign(patch, {
            paused: true,
            approved: false,
            discovery_status: "PAUSED",
            active: false,
        });
    }
    const { error } = await client.from("keywords").update(patch).eq("id", keywordId);
    if (error)
        throw new Error(`Failed to set keyword status: ${error.message}`);
}
//# sourceMappingURL=keywordIntelligenceRepository.js.map