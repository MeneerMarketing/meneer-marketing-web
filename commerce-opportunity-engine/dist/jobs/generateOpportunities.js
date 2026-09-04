import { config } from "dotenv";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "../config/env.js";
import { createSupabaseServerClient } from "../services/supabase/client.js";
import { createRun, completeRun } from "../services/supabase/runsRepository.js";
import { generateOpportunitiesFromAds } from "../services/supabase/opportunityGenerator.js";
import { logger } from "../utils/logger.js";
const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, "../../");
config({ path: resolve(projectRoot, ".env"), quiet: true });
async function main() {
    const env = loadEnv();
    const supabase = createSupabaseServerClient(env);
    const run = await createRun(supabase, "generate_opportunities", {
        milestone: "4",
    });
    try {
        const stats = await generateOpportunitiesFromAds(supabase);
        await completeRun(supabase, run.id, "completed", { ...stats, dataForSeoCost: 0 });
        console.log("");
        console.log("OPPORTUNITY GENERATION COMPLETE");
        console.log("--------------------------------------------");
        console.log(`Brands processed: ${stats.brandsProcessed}`);
        console.log(`Opportunities upserted: ${stats.opportunitiesUpserted}`);
        console.log(`Ad links created: ${stats.linksCreated}`);
        console.log(`Skipped (no brand): ${stats.skippedNoBrand}`);
        console.log("");
        process.exit(0);
    }
    catch (error) {
        await completeRun(supabase, run.id, "failed", {
            error: error instanceof Error ? error.message : "unknown",
        });
        logger.error("Opportunity generation failed", {
            error: error instanceof Error ? error.message : "unknown",
        });
        process.exit(1);
    }
}
main();
//# sourceMappingURL=generateOpportunities.js.map