import { config } from "dotenv";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "../config/env.js";
import { createSupabaseServerClient } from "../services/supabase/client.js";
import { validateOpportunitySourceIntegrity } from "../services/scoring/sourceIntegrityRunner.js";
import { logger } from "../utils/logger.js";
const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, "../../");
config({ path: resolve(projectRoot, ".env"), quiet: true });
async function main() {
    const env = loadEnv();
    const supabase = createSupabaseServerClient(env);
    logger.info("Starting source integrity validation (no external API calls)");
    const result = await validateOpportunitySourceIntegrity(supabase);
    console.log("");
    console.log("SOURCE INTEGRITY VALIDATION");
    console.log("--------------------------------------------");
    console.log(`Processed: ${result.processed}`);
    console.log(`Updated: ${result.updated}`);
    console.log(`DataForSEO: $0`);
    console.log(`Anthropic: $0`);
    console.log("");
    for (const row of result.results) {
        console.log(`${row.domain}`);
        console.log(`  keyword: ${row.primaryKeyword} (conf ${row.primaryKeywordConfidence})`);
        console.log(`  source: ${row.sourceType} · quality ${row.sourceQualityScore}`);
        console.log(`  score: ${row.opportunityScore ?? "n/a"} (${row.verdict ?? "n/a"})${row.capApplied != null ? ` · capped@${row.capApplied}` : ""}`);
        const findings = row.findingValidations ?? [];
        if (findings.length) {
            console.log(`  findings: ${findings.map((f) => `${f.status}:${f.title.slice(0, 40)}`).join(" | ")}`);
        }
        console.log("");
    }
    process.exit(0);
}
main().catch((error) => {
    logger.error("Source integrity validation failed", {
        error: error instanceof Error ? error.message : "unknown",
    });
    process.exit(1);
});
//# sourceMappingURL=validateSourceIntegrity.js.map