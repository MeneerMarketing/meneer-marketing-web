import { config } from "dotenv";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "../config/env.js";
import { createSupabaseServerClient } from "../services/supabase/client.js";
import { createRun, completeRun } from "../services/supabase/runsRepository.js";
import { logger } from "../utils/logger.js";
import { runGoogleAdsDiscovery } from "./discoverGoogleAds.js";
const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, "../../");
config({ path: resolve(projectRoot, ".env"), quiet: true });
/**
 * Fase B — approve max 10 diverse high-quality keywords, then run existing Google discovery.
 * No CRO audits. Respects GOOGLE_DISCOVERY_MAX_KEYWORDS and DATAFORSEO_MAX_COST_PER_RUN.
 */
async function selectAndApproveTestKeywords(limit) {
    const env = loadEnv();
    const supabase = createSupabaseServerClient(env);
    const preferredClusters = new Set([
        "LED_THERAPY",
        "FACE_MASKS",
        "SERUMS",
        "RETINOL",
        "ANTI_AGING",
        "EYE_CARE",
        "ACNE_CARE",
        "CLEANSERS",
        "COLLAGEN",
        "SKINCARE_DEVICES",
    ]);
    const blockedTokens = ["shampoo", "scheer", "conditioner", "haarkleur"];
    const { data, error } = await supabase
        .from("keywords")
        .select("id, keyword, cluster, keyword_quality_score, commercial_intent_score, product_intent_score, category, discovery_status, manual_review_override")
        .eq("category", env.KEYWORD_ENGINE_CATEGORY || "BEAUTY_SKINCARE")
        .eq("rejected", false)
        .eq("paused", false)
        .gte("keyword_quality_score", 70)
        .gte("commercial_intent_score", 65)
        .gte("product_intent_score", 55)
        .order("keyword_quality_score", { ascending: false })
        .limit(120);
    if (error) {
        throw new Error(`Failed to select test keywords: ${error.message}`);
    }
    const eligible = (data ?? []).filter((row) => {
        const kw = row.keyword.toLowerCase();
        if (blockedTokens.some((t) => kw.includes(t)))
            return false;
        if (row.cluster && preferredClusters.has(row.cluster))
            return true;
        // Allow non-preferred only if clearly beauty seed-related
        return (kw.includes("serum") ||
            kw.includes("masker") ||
            kw.includes("retinol") ||
            kw.includes("led") ||
            kw.includes("oog") ||
            kw.includes("acne") ||
            kw.includes("reiniger"));
    });
    const picked = [];
    const clusters = new Set();
    for (const row of eligible) {
        if (picked.length >= limit)
            break;
        const cluster = row.cluster ?? `kw:${row.id}`;
        if (clusters.has(cluster) && clusters.size < Math.min(limit, preferredClusters.size)) {
            continue;
        }
        clusters.add(cluster);
        picked.push(row);
    }
    if (picked.length < limit) {
        for (const row of eligible) {
            if (picked.length >= limit)
                break;
            if (picked.some((p) => p.id === row.id))
                continue;
            picked.push(row);
        }
    }
    const now = new Date().toISOString();
    for (const row of picked) {
        if (row.manual_review_override)
            continue;
        const { error: updError } = await supabase
            .from("keywords")
            .update({
            approved: true,
            rejected: false,
            paused: false,
            active: true,
            discovery_status: "APPROVED",
            updated_at: now,
        })
            .eq("id", row.id);
        if (updError) {
            throw new Error(`Failed to approve ${row.keyword}: ${updError.message}`);
        }
    }
    return picked.map((p) => ({
        id: p.id,
        keyword: p.keyword,
        cluster: p.cluster,
        quality: p.keyword_quality_score,
    }));
}
async function main() {
    // Fase B hard caps — never inherit a parked GOOGLE_DISCOVERY_MAX_KEYWORDS=0 / SKIP_SERP=true
    const testMaxKeywords = 10;
    process.env.GOOGLE_DISCOVERY_MAX_KEYWORDS = String(testMaxKeywords);
    process.env.GOOGLE_DISCOVERY_SKIP_SERP_FETCH = "false";
    process.env.KEYWORD_DISCOVERY_APPROVED_ONLY = "true";
    process.env.GOOGLE_ADS_CONFIRMATION_MAX_DOMAINS_PER_RUN = "2";
    process.env.GOOGLE_ADS_CONFIRMATION_MAX_COST_PER_RUN = "0.03";
    if (!process.env.DATAFORSEO_MAX_COST_PER_RUN) {
        process.env.DATAFORSEO_MAX_COST_PER_RUN = "0.10";
    }
    const env = loadEnv();
    const maxKeywords = Math.min(env.GOOGLE_DISCOVERY_MAX_KEYWORDS, testMaxKeywords);
    const estimatedSerp = maxKeywords * env.KEYWORD_SERP_ESTIMATED_COST_PER_KEYWORD;
    console.log("");
    console.log("KEYWORD INTELLIGENCE — FASE B (discover-test)");
    console.log(`Max keywords: ${maxKeywords}`);
    console.log(`Estimated SERP cost: $${estimatedSerp.toFixed(4)}`);
    console.log(`SERP budget (DATAFORSEO_MAX_COST_PER_RUN): $${env.DATAFORSEO_MAX_COST_PER_RUN}`);
    console.log("Approved-only discovery. No CRO audits. No Anthropic.");
    console.log("");
    if (estimatedSerp > env.DATAFORSEO_MAX_COST_PER_RUN) {
        console.error("STOP: projected SERP cost exceeds DATAFORSEO_MAX_COST_PER_RUN");
        process.exitCode = 1;
        return;
    }
    const supabase = createSupabaseServerClient(env);
    const run = await createRun(supabase, "keyword_intelligence_discover_test", {
        phase: "B",
        maxKeywords,
        estimatedSerp,
    });
    try {
        const selected = await selectAndApproveTestKeywords(maxKeywords);
        console.log("SELECTED / TEMP APPROVED");
        selected.forEach((k, i) => {
            console.log(`  ${i + 1}. ${k.keyword} [${k.cluster}] q=${k.quality ?? "—"}`);
        });
        console.log("");
        if (selected.length === 0) {
            await completeRun(supabase, run.id, "failed", {
                phase: "B",
                error: "No keywords met quality gates for Fase B",
                dataForSeoCost: 0,
                anthropicCost: 0,
            });
            console.error("STOP: no keywords selected");
            process.exitCode = 1;
            return;
        }
        const discoveryStats = await runGoogleAdsDiscovery();
        await completeRun(supabase, run.id, "completed", {
            phase: "B",
            selected,
            dataForSeoCost: discoveryStats.dataForSeoCost,
            anthropicCost: 0,
            keywordsProcessed: discoveryStats.keywordsProcessed,
            paidAdsFound: discoveryStats.paidAdsFound,
            uniqueDomains: discoveryStats.uniqueDomains,
            serpCost: discoveryStats.serpCost,
            transparencyCost: discoveryStats.transparencyCost,
        });
        console.log("");
        console.log("FASE B COMPLETE");
        console.log(`  Keywords processed: ${discoveryStats.keywordsProcessed}`);
        console.log(`  Paid ads found: ${discoveryStats.paidAdsFound}`);
        console.log(`  Unique domains: ${discoveryStats.uniqueDomains}`);
        console.log(`  DataForSEO cost: $${discoveryStats.dataForSeoCost.toFixed(4)}`);
        console.log(`  Anthropic cost: $0.0000`);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        logger.error("Fase B discover-test failed", { message });
        await completeRun(supabase, run.id, "failed", {
            phase: "B",
            error: message,
            dataForSeoCost: 0,
            anthropicCost: 0,
        });
        process.exitCode = 1;
    }
}
main();
//# sourceMappingURL=discoverKeywordsTest.js.map