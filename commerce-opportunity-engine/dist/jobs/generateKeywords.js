import { config } from "dotenv";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "../config/env.js";
import { createDataForSeoClient } from "../services/dataforseo/client.js";
import { detectKeywordQualityProblems, runKeywordGeneration, } from "../services/keywords/keywordEngine.js";
import { createSupabaseServerClient } from "../services/supabase/client.js";
import { createRun, completeRun } from "../services/supabase/runsRepository.js";
import { logger } from "../utils/logger.js";
const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, "../../");
config({ path: resolve(projectRoot, ".env"), quiet: true });
async function main() {
    const env = loadEnv();
    const supabase = createSupabaseServerClient(env);
    const dfs = createDataForSeoClient(env);
    const categoryId = (env.KEYWORD_ENGINE_CATEGORY || "BEAUTY_SKINCARE");
    console.log("");
    console.log("KEYWORD INTELLIGENCE — FASE A");
    console.log(`Category: ${categoryId}`);
    console.log(`Max seeds: ${env.KEYWORD_ENGINE_MAX_SEEDS}`);
    console.log(`Max candidates: ${env.KEYWORD_ENGINE_MAX_CANDIDATES}`);
    console.log(`Budget: $${env.KEYWORD_ENGINE_MAX_DATAFORSEO_COST_PER_RUN}`);
    console.log("Anthropic: $0 (deterministic scoring only)");
    console.log("");
    const estimate = await runKeywordGeneration({
        client: dfs,
        supabase,
        env,
        categoryId,
        dryEstimateOnly: true,
    });
    console.log("COST PREVIEW");
    console.log(`  Endpoint: dataforseo_labs/google/keyword_ideas/live`);
    console.log(`  Seeds: ${estimate.seeds.join(" | ")}`);
    console.log(`  Estimated cost: $${estimate.estimatedCost.toFixed(4)}`);
    console.log(`  Configured max: $${env.KEYWORD_ENGINE_MAX_DATAFORSEO_COST_PER_RUN}`);
    console.log("");
    if (estimate.stoppedReason && estimate.stoppedReason !== "dry_estimate_only") {
        console.error(`STOP: ${estimate.stoppedReason}`);
        process.exitCode = 1;
        return;
    }
    if (estimate.estimatedCost > env.KEYWORD_ENGINE_MAX_DATAFORSEO_COST_PER_RUN) {
        console.error("STOP: estimated cost exceeds budget. Not raising budget automatically.");
        process.exitCode = 1;
        return;
    }
    const run = await createRun(supabase, "keyword_intelligence_generate", {
        categoryId,
        seeds: estimate.seeds,
        estimatedCost: estimate.estimatedCost,
        phase: "A",
    });
    try {
        const result = await runKeywordGeneration({
            client: dfs,
            supabase,
            env,
            categoryId,
            dryEstimateOnly: false,
        });
        const problems = detectKeywordQualityProblems(result);
        await completeRun(supabase, run.id, "completed", {
            phase: "A",
            categoryId: result.categoryId,
            categoryLabel: result.categoryLabel,
            seeds: result.seeds,
            estimatedCost: result.estimatedCost,
            dataForSeoCost: result.actualCost,
            anthropicCost: 0,
            rawCandidates: result.rawCandidates,
            afterDedupe: result.afterDedupe,
            upserted: result.upserted,
            skippedManual: result.skippedManual,
            qualified: result.qualified,
            rejected: result.rejected,
            discovered: result.discovered,
            top30: result.top30,
            rejectedSamples: result.rejectedSamples,
            qualityProblems: problems,
            stoppedReason: result.stoppedReason,
        });
        console.log("FASE A RESULT");
        console.log(`  Actual DataForSEO cost: $${result.actualCost.toFixed(4)}`);
        console.log(`  Anthropic cost: $0.0000`);
        console.log(`  Raw candidates: ${result.rawCandidates}`);
        console.log(`  After dedupe: ${result.afterDedupe}`);
        console.log(`  Upserted: ${result.upserted} (manual override preserved: ${result.skippedManual})`);
        console.log(`  Qualified: ${result.qualified}`);
        console.log(`  Rejected: ${result.rejected}`);
        console.log(`  Discovered (pending): ${result.discovered}`);
        console.log("");
        console.log("TOP 30 (quality DESC)");
        result.top30.forEach((k, i) => {
            console.log(`${String(i + 1).padStart(2, " ")}. ${k.keyword} | q=${k.quality} c=${k.commercial} p=${k.product} vol=${k.volume ?? "—"} cpc=${k.cpc ?? "—"} [${k.cluster}] ${k.status}`);
        });
        console.log("");
        console.log("REJECTED SAMPLES");
        for (const sample of result.rejectedSamples) {
            console.log(`  - ${sample.keyword} → ${sample.reason}`);
        }
        console.log("");
        if (problems.length > 0) {
            console.log("QUALITY GATE WARNINGS");
            for (const p of problems)
                console.log(`  ! ${p}`);
            console.log("Fase B should NOT run until quality is clean.");
        }
        else {
            console.log("QUALITY GATE: OK — Fase B may run via npm run keywords:discover-test");
        }
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        logger.error("Keyword generation failed", { message });
        await completeRun(supabase, run.id, "failed", {
            phase: "A",
            error: message,
            dataForSeoCost: 0,
            anthropicCost: 0,
        });
        process.exitCode = 1;
    }
}
main();
//# sourceMappingURL=generateKeywords.js.map