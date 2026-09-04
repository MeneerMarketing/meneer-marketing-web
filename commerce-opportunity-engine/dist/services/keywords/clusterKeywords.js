import { getCategoryConfig, } from "../../config/keywordCategories.js";
import { normalizeKeyword } from "./normalizeKeyword.js";
export function assignKeywordCluster(input) {
    const config = getCategoryConfig(input.categoryId);
    const normalized = normalizeKeyword(input.keyword);
    const seedNorm = input.seedKeyword ? normalizeKeyword(input.seedKeyword) : "";
    if (config) {
        // Longer roots first for multi-word matches
        const roots = Object.entries(config.clusterRoots).sort((a, b) => b[0].length - a[0].length);
        for (const [root, cluster] of roots) {
            if (normalized.includes(root)) {
                return cluster;
            }
        }
        for (const [root, cluster] of roots) {
            if (seedNorm.includes(root)) {
                return cluster;
            }
        }
    }
    // Fallback: first 1-2 meaningful tokens
    const tokens = normalized.split(" ").filter((t) => t.length > 2);
    if (tokens.length === 0)
        return "GENERAL";
    return tokens
        .slice(0, 2)
        .join("_")
        .toUpperCase()
        .replace(/[^A-Z0-9_]/g, "");
}
export function scoreCategoryRelevance(input) {
    const config = getCategoryConfig(input.categoryId);
    const normalized = normalizeKeyword(input.keyword);
    let score = 50;
    if (config) {
        for (const seed of config.seedTopics) {
            const seedNorm = normalizeKeyword(seed);
            const seedTokens = seedNorm.split(" ");
            const overlap = seedTokens.filter((t) => normalized.includes(t)).length;
            if (overlap > 0) {
                score = Math.max(score, 55 + overlap * 12);
            }
        }
        for (const root of Object.keys(config.clusterRoots)) {
            if (normalized.includes(root)) {
                score = Math.max(score, 72);
            }
        }
    }
    if (input.seedKeyword) {
        const seedTokens = normalizeKeyword(input.seedKeyword).split(" ");
        const hit = seedTokens.filter((t) => normalized.includes(t)).length;
        score = Math.max(score, 50 + hit * 10);
    }
    return Math.max(0, Math.min(100, Math.round(score)));
}
//# sourceMappingURL=clusterKeywords.js.map