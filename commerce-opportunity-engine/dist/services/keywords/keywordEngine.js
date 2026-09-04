import { estimateKeywordIdeasCost, fetchKeywordIdeas, } from "../dataforseo/keywordIdeas.js";
import { assignKeywordCluster, scoreCategoryRelevance } from "./clusterKeywords.js";
import { scoreCommercialIntent } from "./commercialIntent.js";
import { evaluateKeywordExclusion } from "./exclusionRules.js";
import { normalizeKeyword, nearDuplicateKey } from "./normalizeKeyword.js";
import { scoreProductIntent } from "./productIntent.js";
import { scoreKeywordQuality } from "./qualityScore.js";
import { classifyVolumeTier } from "./volumeTier.js";
import { KEYWORD_LOCALE, ensureKeywordCategories, loadActiveCategorySeeds, upsertKeywordIntelligenceRows, } from "../supabase/keywordIntelligenceRepository.js";
import { logger } from "../../utils/logger.js";
function pickBestSeed(keyword, seeds) {
    const norm = normalizeKeyword(keyword);
    let best = seeds[0] ?? keyword;
    let bestScore = -1;
    for (const seed of seeds) {
        const seedTokens = normalizeKeyword(seed).split(" ");
        const score = seedTokens.filter((t) => norm.includes(t)).length;
        if (score > bestScore) {
            bestScore = score;
            best = seed;
        }
    }
    return best;
}
function mapIdeaToRow(input) {
    const exclusion = evaluateKeywordExclusion(input.item.keyword);
    const seed = pickBestSeed(input.item.keyword, input.seeds);
    const commercial = scoreCommercialIntent({
        keyword: input.item.keyword,
        searchIntentMain: input.item.searchIntentMain,
        cpc: input.item.cpc,
        competition: input.item.competition,
    });
    const product = scoreProductIntent(input.item.keyword);
    const categoryRelevance = scoreCategoryRelevance({
        keyword: input.item.keyword,
        categoryId: input.categoryId,
        seedKeyword: seed,
        dfsCategories: input.item.categories,
    });
    const quality = scoreKeywordQuality({
        commercialIntent: commercial.score,
        productIntent: product.score,
        searchVolume: input.item.searchVolume,
        cpc: input.item.cpc,
        competition: input.item.competition,
        categoryRelevance,
    });
    let rejectedReason = null;
    let status = "DISCOVERED";
    let active = true;
    let rejected = false;
    if (exclusion.excluded) {
        rejectedReason = exclusion.reason;
        status = "REJECTED";
        active = false;
        rejected = true;
    }
    else if (product.score < 35 || commercial.score < 30) {
        rejectedReason =
            product.score < 35 ? "low_product_intent" : "low_commercial_intent";
        status = "REJECTED";
        active = false;
        rejected = true;
    }
    else if (categoryRelevance < 40) {
        rejectedReason = "low_category_relevance";
        status = "REJECTED";
        active = false;
        rejected = true;
    }
    else if (quality.score >= 55 && commercial.score >= 50 && product.score >= 50) {
        status = "QUALIFIED";
    }
    const cluster = assignKeywordCluster({
        keyword: input.item.keyword,
        categoryId: input.categoryId,
        seedKeyword: seed,
    });
    const row = {
        keyword: input.item.keyword,
        locale: KEYWORD_LOCALE,
        category: input.categoryId,
        cluster,
        seed_keyword: seed,
        normalized_keyword: normalizeKeyword(input.item.keyword),
        search_volume: input.item.searchVolume,
        cpc: input.item.cpc,
        competition: input.item.competition,
        competition_index: input.item.competitionIndex,
        competition_level: input.item.competitionLevel,
        commercial_intent_score: commercial.score,
        product_intent_score: product.score,
        keyword_quality_score: quality.score,
        volume_tier: classifyVolumeTier(input.item.searchVolume),
        keyword_source: "dataforseo_labs_keyword_ideas",
        discovery_status: status,
        active,
        approved: false,
        rejected,
        paused: false,
        rejection_reason: rejectedReason,
        manual_review_override: false,
        last_metrics_update: input.now,
        monthly_searches: input.item.monthlySearches,
        dfs_categories: input.item.categories ?? [],
        search_intent_main: input.item.searchIntentMain,
        search_metrics: {
            commercial_reasons: commercial.reasons,
            product_reasons: product.reasons,
            quality_breakdown: quality.breakdown,
            core_keyword: input.item.coreKeyword,
        },
        estimated_serp_cost: input.estimatedSerpCost,
        updated_at: input.now,
    };
    return { row, rejectedReason };
}
function dedupeIdeas(items) {
    const byKey = new Map();
    for (const item of items) {
        const key = nearDuplicateKey(item.keyword);
        const existing = byKey.get(key);
        if (!existing) {
            byKey.set(key, item);
            continue;
        }
        // Prefer higher volume, then higher CPC presence
        const volA = existing.searchVolume ?? -1;
        const volB = item.searchVolume ?? -1;
        if (volB > volA) {
            byKey.set(key, item);
        }
    }
    return [...byKey.values()];
}
export async function runKeywordGeneration(input) {
    const categoryId = input.categoryId ?? "BEAUTY_SKINCARE";
    const maxSeeds = input.env.KEYWORD_ENGINE_MAX_SEEDS;
    const maxCandidates = input.env.KEYWORD_ENGINE_MAX_CANDIDATES;
    const maxCost = input.env.KEYWORD_ENGINE_MAX_DATAFORSEO_COST_PER_RUN;
    const estimatedSerpCost = input.env.KEYWORD_SERP_ESTIMATED_COST_PER_KEYWORD;
    await ensureKeywordCategories(input.supabase);
    const category = await loadActiveCategorySeeds(input.supabase, categoryId, maxSeeds);
    if (!category.active || category.paused) {
        return {
            categoryId,
            categoryLabel: category.label,
            seeds: category.seeds,
            estimatedCost: 0,
            actualCost: 0,
            rawCandidates: 0,
            afterDedupe: 0,
            upserted: 0,
            skippedManual: 0,
            qualified: 0,
            rejected: 0,
            discovered: 0,
            top30: [],
            rejectedSamples: [],
            stoppedReason: `Category ${categoryId} is inactive or paused`,
        };
    }
    if (category.seeds.length === 0) {
        return {
            categoryId,
            categoryLabel: category.label,
            seeds: [],
            estimatedCost: 0,
            actualCost: 0,
            rawCandidates: 0,
            afterDedupe: 0,
            upserted: 0,
            skippedManual: 0,
            qualified: 0,
            rejected: 0,
            discovered: 0,
            top30: [],
            rejectedSamples: [],
            stoppedReason: "No seeds configured",
        };
    }
    const estimatedCost = estimateKeywordIdeasCost(maxCandidates);
    if (estimatedCost > maxCost) {
        logger.warn("Keyword engine estimated cost exceeds budget — STOP", {
            estimatedCost,
            maxCost,
            endpoint: "dataforseo_labs/google/keyword_ideas/live",
        });
        return {
            categoryId,
            categoryLabel: category.label,
            seeds: category.seeds,
            estimatedCost,
            actualCost: 0,
            rawCandidates: 0,
            afterDedupe: 0,
            upserted: 0,
            skippedManual: 0,
            qualified: 0,
            rejected: 0,
            discovered: 0,
            top30: [],
            rejectedSamples: [],
            stoppedReason: `Estimated cost $${estimatedCost} exceeds budget $${maxCost}`,
        };
    }
    if (input.dryEstimateOnly) {
        return {
            categoryId,
            categoryLabel: category.label,
            seeds: category.seeds,
            estimatedCost,
            actualCost: 0,
            rawCandidates: 0,
            afterDedupe: 0,
            upserted: 0,
            skippedManual: 0,
            qualified: 0,
            rejected: 0,
            discovered: 0,
            top30: [],
            rejectedSamples: [],
            stoppedReason: "dry_estimate_only",
        };
    }
    const ideas = await fetchKeywordIdeas({
        client: input.client,
        env: input.env,
        seeds: category.seeds,
        limit: maxCandidates,
    });
    if (ideas.cost > maxCost) {
        logger.error("Actual keyword ideas cost exceeded budget after call", {
            cost: ideas.cost,
            maxCost,
        });
    }
    const deduped = dedupeIdeas(ideas.items).slice(0, maxCandidates);
    const now = new Date().toISOString();
    const rows = [];
    const rejectedSamples = [];
    for (const item of deduped) {
        const mapped = mapIdeaToRow({
            item,
            categoryId,
            seeds: category.seeds,
            estimatedSerpCost,
            now,
        });
        rows.push(mapped.row);
        if (mapped.rejectedReason && rejectedSamples.length < 10) {
            rejectedSamples.push({
                keyword: item.keyword,
                reason: mapped.rejectedReason,
            });
        }
    }
    // Fill rejected samples if auto-reject produced fewer than 10
    if (rejectedSamples.length < 10) {
        for (const row of rows) {
            if (row.rejected && row.rejection_reason) {
                if (!rejectedSamples.some((r) => r.keyword === row.keyword)) {
                    rejectedSamples.push({
                        keyword: row.keyword,
                        reason: row.rejection_reason,
                    });
                }
            }
            if (rejectedSamples.length >= 10)
                break;
        }
    }
    const { upserted, skippedManual } = await upsertKeywordIntelligenceRows(input.supabase, rows);
    const qualified = rows.filter((r) => r.discovery_status === "QUALIFIED").length;
    const rejected = rows.filter((r) => r.discovery_status === "REJECTED").length;
    const discovered = rows.filter((r) => r.discovery_status === "DISCOVERED").length;
    const top30 = [...rows]
        .filter((r) => !r.rejected)
        .sort((a, b) => (b.keyword_quality_score ?? 0) - (a.keyword_quality_score ?? 0))
        .slice(0, 30)
        .map((r) => ({
        keyword: r.keyword,
        quality: r.keyword_quality_score,
        commercial: r.commercial_intent_score,
        product: r.product_intent_score,
        volume: r.search_volume,
        cpc: r.cpc,
        cluster: r.cluster,
        status: r.discovery_status,
    }));
    return {
        categoryId,
        categoryLabel: category.label,
        seeds: category.seeds,
        estimatedCost,
        actualCost: ideas.cost,
        rawCandidates: ideas.itemsCount,
        afterDedupe: deduped.length,
        upserted,
        skippedManual,
        qualified,
        rejected,
        discovered,
        top30,
        rejectedSamples,
        stoppedReason: null,
    };
}
export function detectKeywordQualityProblems(result) {
    const problems = [];
    if (result.stoppedReason) {
        problems.push(result.stoppedReason);
        return problems;
    }
    if (result.afterDedupe < 10) {
        problems.push("Too few candidates after dedupe");
    }
    if (result.qualified < 5) {
        problems.push("Fewer than 5 qualified keywords");
    }
    const junkInTop = result.top30.filter((k) => {
        const n = normalizeKeyword(k.keyword);
        return (n.includes("vacature") ||
            n.includes("opleiding") ||
            n.includes("cursus") ||
            n.startsWith("wat ") ||
            n.includes("hoe werkt"));
    });
    if (junkInTop.length > 0) {
        problems.push(`Junk in top 30: ${junkInTop.map((j) => j.keyword).join(", ")}`);
    }
    return problems;
}
//# sourceMappingURL=keywordEngine.js.map