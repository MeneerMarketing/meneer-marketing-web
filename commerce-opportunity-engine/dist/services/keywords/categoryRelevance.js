import { CATEGORY_RELEVANCE_CONFIG, PETS_PRODUCT_CONTEXT_TOKENS, } from "../../config/categoryRelevance.js";
import { getCategoryConfig } from "../../config/keywordCategories.js";
import { normalizeKeyword } from "./normalizeKeyword.js";
function tokenize(keyword) {
    return normalizeKeyword(keyword)
        .split(/\s+/)
        .map((t) => t.trim())
        .filter(Boolean);
}
function includesPhrase(haystack, phrase) {
    return haystack.includes(normalizeKeyword(phrase));
}
/**
 * Deterministic category_relevance_score 0-100.
 * High commercial intent alone is not enough — keyword must fit the category.
 */
export function scoreCategoryRelevance(keyword, categoryId, cluster = null) {
    const config = CATEGORY_RELEVANCE_CONFIG[categoryId];
    if (!config) {
        return {
            score: 55,
            reasons: ["no_category_config_neutral"],
            matchedAllow: [],
            matchedDeny: [],
        };
    }
    const normalized = normalizeKeyword(keyword);
    const tokens = tokenize(keyword);
    const reasons = [];
    const matchedAllow = [];
    const matchedDeny = [];
    let score = 35;
    for (const phrase of config.denyPhrases) {
        if (includesPhrase(normalized, phrase)) {
            matchedDeny.push(phrase);
            score -= 55;
            reasons.push(`deny_phrase:${phrase}`);
        }
    }
    for (const deny of config.denyTokens) {
        if (tokens.includes(normalizeKeyword(deny)) || normalized.includes(normalizeKeyword(deny))) {
            matchedDeny.push(deny);
            score -= 40;
            reasons.push(`deny_token:${deny}`);
        }
    }
    for (const phrase of config.allowPhrases) {
        if (includesPhrase(normalized, phrase)) {
            matchedAllow.push(phrase);
            score += 28;
            reasons.push(`allow_phrase:${phrase}`);
        }
    }
    let allowHits = 0;
    for (const allow of config.allowTokens) {
        const a = normalizeKeyword(allow);
        if (tokens.includes(a) || normalized.includes(a)) {
            matchedAllow.push(allow);
            allowHits += 1;
            score += allowHits === 1 ? 30 : 8;
            reasons.push(`allow_token:${allow}`);
        }
    }
    const catConfig = getCategoryConfig(categoryId);
    if (catConfig) {
        for (const seed of catConfig.seedTopics) {
            const seedNorm = normalizeKeyword(seed);
            if (normalized.includes(seedNorm) || seedNorm.includes(normalized)) {
                score += 12;
                reasons.push(`seed_overlap:${seed}`);
                break;
            }
            const seedTokens = seedNorm.split(/\s+/).filter(Boolean);
            const overlap = seedTokens.filter((t) => tokens.includes(t) || normalized.includes(t));
            if (overlap.length >= Math.min(2, seedTokens.length) && overlap.length > 0) {
                score += 8;
                reasons.push(`seed_token_overlap:${overlap.join("+")}`);
                break;
            }
        }
        if (cluster) {
            const clusterUpper = cluster.toUpperCase();
            const knownClusters = new Set(Object.values(catConfig.clusterRoots));
            if (knownClusters.has(clusterUpper) || [...knownClusters].some((c) => c === cluster)) {
                score += 6;
                reasons.push(`cluster_known:${cluster}`);
            }
        }
    }
    // Ambiguous stems (e.g. "elektrische") need an allow companion.
    const hasRequireStem = config.requireAllowWhenTokens.some((t) => tokens.includes(normalizeKeyword(t)));
    if (hasRequireStem && allowHits === 0 && matchedAllow.length === 0) {
        score -= 35;
        reasons.push("ambiguous_stem_without_allow");
    }
    // PETS: bare "kat kopen" / "hond kopen" without product context.
    if (categoryId === "PETS") {
        const hasPetNoun = tokens.some((t) => t === "kat" || t === "hond" || t === "katten" || t === "honden");
        const hasProduct = PETS_PRODUCT_CONTEXT_TOKENS.some((t) => tokens.includes(t) || normalized.includes(t));
        if (hasPetNoun && !hasProduct && tokens.length <= 3) {
            score -= 45;
            reasons.push("pets_generic_without_product");
        }
    }
    // HOME: lone "deken" without home context is weak but not auto-reject if allow hit.
    if (categoryId === "HOME_LIVING" && tokens.includes("deken") && allowHits <= 1) {
        const homeExtras = ["lucht", "diffuser", "plaid", "woon", "opberg", "warmte", "zwaarte"];
        if (!homeExtras.some((t) => normalized.includes(t))) {
            score -= 10;
            reasons.push("home_deken_weak_context");
        }
    }
    if (matchedDeny.length > 0 && allowHits === 0) {
        score = Math.min(score, 18);
        reasons.push("deny_without_allow_hard_cap");
    }
    const finalScore = Math.max(0, Math.min(100, Math.round(score)));
    return {
        score: finalScore,
        reasons,
        matchedAllow: [...new Set(matchedAllow)],
        matchedDeny: [...new Set(matchedDeny)],
    };
}
//# sourceMappingURL=categoryRelevance.js.map