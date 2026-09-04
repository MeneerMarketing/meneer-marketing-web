import { config } from "dotenv";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "../config/env.js";
import { createSupabaseServerClient } from "../services/supabase/client.js";
import { createRun, completeRun } from "../services/supabase/runsRepository.js";
import { auditOpportunity, loadRetryAuditCandidates, loadAuditCandidateById, } from "../services/audit/auditRunner.js";
import { logger } from "../utils/logger.js";
const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, "../../");
config({ path: resolve(projectRoot, ".env"), quiet: true });
async function main() {
    const env = loadEnv();
    const supabase = createSupabaseServerClient(env);
    const singleId = process.env.CRO_AUDIT_OPPORTUNITY_ID?.trim();
    const limit = Number(process.env.CRO_AUDIT_MAX_OPPORTUNITIES_PER_RUN ?? "3");
    const candidates = singleId
        ? [await loadAuditCandidateById(supabase, singleId)].filter(Boolean)
        : await loadRetryAuditCandidates(supabase, limit);
    logger.info("Retrying failed/blocked CRO audits", {
        count: candidates.length,
        domains: candidates.map((c) => c.domain),
        singleId: singleId ?? null,
    });
    const run = await createRun(supabase, "cro_audit_retry", {
        milestone: "5.4.1",
        mode: singleId ? "single" : "technical_failures",
        opportunityIds: candidates.map((c) => c.opportunityId),
    });
    let anthropicCost = 0;
    const results = [];
    try {
        for (const candidate of candidates) {
            if (anthropicCost >= env.CRO_AUDIT_MAX_ANTHROPIC_COST_PER_RUN) {
                logger.warn("Stopping retry: Anthropic cost cap reached");
                break;
            }
            try {
                const result = await auditOpportunity(env, supabase, candidate, run.id);
                anthropicCost += result.anthropicCost;
                results.push({
                    domain: result.domain,
                    opportunityId: result.opportunityId,
                    croAuditStatus: result.croAuditStatus ?? null,
                    pageHealthStatus: result.pageHealthStatus ?? null,
                    opportunityScore: result.opportunityScore ?? null,
                    mmFit: result.meneerMarketingFitScore ?? null,
                    anthropicCost: result.anthropicCost,
                    errors: result.errors,
                });
            }
            catch (error) {
                results.push({
                    domain: candidate.domain,
                    opportunityId: candidate.opportunityId,
                    error: error instanceof Error ? error.message : "unknown",
                });
            }
        }
        await completeRun(supabase, run.id, "completed", {
            results,
            anthropicCost,
            dataForSeoCost: 0,
        });
        console.log("");
        console.log("CRO AUDIT RETRY COMPLETE (5.4.1)");
        console.log("--------------------------------------------");
        console.log(`Candidates: ${candidates.length}`);
        console.log(`Anthropic cost: $${anthropicCost.toFixed(6)}`);
        console.log(`DataForSEO cost: $0.000000`);
        for (const r of results) {
            console.log(`${r.domain}`);
            if (r.error)
                console.log(`  error: ${r.error}`);
            else {
                console.log(`  status: ${r.croAuditStatus}`);
                console.log(`  page_health: ${r.pageHealthStatus}`);
                console.log(`  Opportunity Score: ${r.opportunityScore ?? "—"}`);
                console.log(`  MM Fit: ${r.mmFit ?? "—"}`);
                console.log(`  cost: $${Number(r.anthropicCost).toFixed(6)}`);
            }
        }
        process.exit(0);
    }
    catch (error) {
        await completeRun(supabase, run.id, "failed", {
            error: error instanceof Error ? error.message : "unknown",
            anthropicCost,
            dataForSeoCost: 0,
        });
        process.exit(1);
    }
}
main();
//# sourceMappingURL=retryFailedAudits.js.map