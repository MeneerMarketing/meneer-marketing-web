import { config } from "dotenv";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "../config/env.js";
import { createSupabaseServerClient } from "../services/supabase/client.js";
import { createRun, completeRun } from "../services/supabase/runsRepository.js";
import {
  auditOpportunity,
  loadAuditCandidates,
} from "../services/audit/auditRunner.js";
import { logger } from "../utils/logger.js";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, "../../");
config({ path: resolve(projectRoot, ".env"), quiet: true });

const DEFAULT_PREFERRED = [
  "dekbed-discounter.nl",
  "currentbody.nl",
  "haarshop.nl",
];

async function main(): Promise<void> {
  const env = loadEnv();
  const supabase = createSupabaseServerClient(env);

  const preferredDomains = env.CRO_AUDIT_DOMAIN_FILTER
    ? env.CRO_AUDIT_DOMAIN_FILTER.split(",")
        .map((d) => d.trim().toLowerCase())
        .filter(Boolean)
    : DEFAULT_PREFERRED;

  const candidates = await loadAuditCandidates(
    supabase,
    env.CRO_AUDIT_MAX_OPPORTUNITIES_PER_RUN,
    preferredDomains
  );

  logger.info("Starting dual-mode CRO audits (Milestone 5.4)", {
    count: candidates.length,
    domains: candidates.map((c) => c.domain),
    auditTypes: candidates.map((c) => c.auditType),
    maxCost: env.CRO_AUDIT_MAX_ANTHROPIC_COST_PER_RUN,
  });

  const run = await createRun(supabase, "cro_opportunity_audit", {
    milestone: "5.4",
    maxOpportunities: env.CRO_AUDIT_MAX_OPPORTUNITIES_PER_RUN,
    preferredDomains,
    dualMode: true,
  });

  let anthropicCost = 0;
  const results: Array<Record<string, unknown>> = [];

  try {
    for (const candidate of candidates) {
      if (anthropicCost >= env.CRO_AUDIT_MAX_ANTHROPIC_COST_PER_RUN) {
        logger.warn("Stopping audits: Anthropic cost cap reached", {
          anthropicCost,
          cap: env.CRO_AUDIT_MAX_ANTHROPIC_COST_PER_RUN,
        });
        break;
      }

      try {
        const result = await auditOpportunity(env, supabase, candidate, run.id);
        anthropicCost += result.anthropicCost;
        results.push({
          domain: result.domain,
          opportunityId: result.opportunityId,
          skipped: result.skipped,
          skipReason: result.skipReason ?? null,
          auditType: result.auditType ?? candidate.auditType,
          keywordIntent: result.keywordIntent ?? null,
          opportunityScore: result.opportunityScore ?? null,
          meneerMarketingFitScore: result.meneerMarketingFitScore ?? null,
          verdict: result.verdict ?? null,
          auditConfidence: result.auditConfidence ?? null,
          keyword: candidate.keyword,
          targetUrl: candidate.targetUrl,
          productPrice: candidate.price,
          anthropicCost: result.anthropicCost,
          errors: result.errors,
        });
      } catch (error) {
        results.push({
          domain: candidate.domain,
          opportunityId: candidate.opportunityId,
          auditType: candidate.auditType,
          skipped: false,
          error: error instanceof Error ? error.message : "unknown",
        });
        logger.error("Audit failed for opportunity", {
          domain: candidate.domain,
          error: error instanceof Error ? error.message : "unknown",
        });
      }
    }

    await completeRun(supabase, run.id, "completed", {
      results,
      anthropicCost,
      dataForSeoCost: 0,
      audited: results.filter((r) => !r.skipped && r.opportunityScore != null).length,
    });

    console.log("");
    console.log("DUAL-MODE CRO AUDIT COMPLETE (5.4)");
    console.log("--------------------------------------------");
    console.log(`Candidates: ${candidates.length}`);
    console.log(`Anthropic cost: $${anthropicCost.toFixed(6)}`);
    console.log(`DataForSEO cost: $0.000000`);
    console.log("");
    for (const result of results) {
      console.log(`${result.domain}`);
      if (result.skipped) {
        console.log(`  skipped: ${result.skipReason}`);
      } else if (result.error) {
        console.log(`  error: ${result.error}`);
      } else {
        console.log(`  audit_type: ${result.auditType}`);
        console.log(`  keyword: ${result.keyword}`);
        console.log(`  keyword_intent: ${result.keywordIntent}`);
        console.log(`  target: ${result.targetUrl}`);
        console.log(`  Opportunity Score: ${result.opportunityScore} (${result.verdict})`);
        console.log(`  Meneer Marketing Fit: ${result.meneerMarketingFitScore}`);
        console.log(`  confidence: ${result.auditConfidence}`);
        console.log(`  cost: $${Number(result.anthropicCost).toFixed(6)}`);
      }
      console.log("");
    }

    process.exit(0);
  } catch (error) {
    await completeRun(supabase, run.id, "failed", {
      error: error instanceof Error ? error.message : "unknown",
      anthropicCost,
      dataForSeoCost: 0,
    });
    logger.error("CRO audit job failed", {
      error: error instanceof Error ? error.message : "unknown",
    });
    process.exit(1);
  }
}

main();
