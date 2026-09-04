import { config } from "dotenv";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "../config/env.js";
import { createDataForSeoClient } from "../services/dataforseo/client.js";
import { fetchPaidRankedKeywords } from "../services/dataforseo/rankedPaidKeywords.js";
import { createSupabaseServerClient } from "../services/supabase/client.js";
import { createRun, completeRun } from "../services/supabase/runsRepository.js";
import {
  generateOpportunitiesFromPaidTargets,
  markBrandWaitingForPaidTarget,
  upsertPaidSearchTargets,
} from "../services/supabase/paidTargetsRepository.js";
import { logger } from "../utils/logger.js";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, "../../");
config({ path: resolve(projectRoot, ".env"), quiet: true });

const DEFAULT_TEST_DOMAINS = ["currentbody.nl", "boozyshop.nl", "dekbed-discounter.nl"];

async function main(): Promise<void> {
  const env = loadEnv();
  const supabase = createSupabaseServerClient(env);
  const dfs = createDataForSeoClient(env);

  const filter = env.PAID_GROUND_TRUTH_DOMAIN_FILTER?.split(",")
    .map((d) => d.trim().toLowerCase())
    .filter(Boolean);

  const preferred = filter?.length ? filter : DEFAULT_TEST_DOMAINS;
  const maxDomains = env.PAID_GROUND_TRUTH_MAX_DOMAINS_PER_RUN;
  const maxCost = env.PAID_GROUND_TRUTH_MAX_DATAFORSEO_COST_PER_RUN;
  const maxResults = env.PAID_GROUND_TRUTH_MAX_RESULTS_PER_DOMAIN;

  const { data: brands, error } = await supabase
    .from("brands")
    .select(
      "id, normalized_domain, confirmed_google_advertiser, transparency_confirmed, lead_eligible, eligibility_status, manual_excluded"
    )
    .eq("manual_excluded", false)
    .or("confirmed_google_advertiser.eq.true,transparency_confirmed.eq.true,eligibility_status.eq.LEAD_ELIGIBLE")
    .order("last_seen_at", { ascending: false });

  if (error) throw new Error(error.message);

  const selected = [];
  for (const domain of preferred) {
    const match = (brands ?? []).find((b) => b.normalized_domain === domain);
    if (match) selected.push(match);
  }
  for (const b of brands ?? []) {
    if (selected.length >= maxDomains) break;
    if (!selected.some((s) => s.id === b.id)) selected.push(b);
  }
  const targets = selected.slice(0, maxDomains);

  logger.info("Starting paid target resolution", {
    domains: targets.map((t) => t.normalized_domain),
    maxCost,
    maxResults,
  });

  const run = await createRun(supabase, "resolve_paid_targets", {
    milestone: "5.2",
    domains: targets.map((t) => t.normalized_domain),
    maxCost,
  });

  let totalCost = 0;
  const results: Array<Record<string, unknown>> = [];

  try {
    for (const brand of targets) {
      if (totalCost >= maxCost) {
        logger.warn("Stopping: DataForSEO cost cap reached", { totalCost, maxCost });
        break;
      }

      const domain = brand.normalized_domain as string;
      const remaining = maxCost - totalCost;

      try {
        const labs = await fetchPaidRankedKeywords({
          client: dfs,
          env,
          target: domain,
          limit: maxResults,
        });

        totalCost += labs.cost;
        if (totalCost > maxCost) {
          logger.warn("Cost exceeded after call; stopping further domains", {
            totalCost,
            maxCost,
            lastDomain: domain,
            lastCost: labs.cost,
          });
        }

        const observedAt = new Date().toISOString();
        const saved = await upsertPaidSearchTargets({
          client: supabase,
          brandId: brand.id as string,
          items: labs.items,
          observedAt,
        });
        logger.info("Paid targets upserted", {
          domain,
          upserted: saved.upserted,
          croReadyLandings: saved.croReadyLandingCount,
        });

        const withLanding = labs.items.filter((i) => i.landingUrl).length;
        const examples = labs.items.slice(0, 5).map((i) => ({
          keyword: i.keyword,
          landingUrl: i.landingUrl,
          title: i.title,
          volume: i.searchVolume,
          cpc: i.cpc,
          rank: i.rankAbsolute,
        }));

        let oppStats = { opportunitiesUpserted: 0, croReady: 0 };
        if (withLanding > 0) {
          oppStats = await generateOpportunitiesFromPaidTargets(
            supabase,
            brand.id as string
          );
        }

        const paidTargetStatus =
          oppStats.croReady > 0
            ? "RESOLVED"
            : labs.items.length > 0
              ? "PARTIAL"
              : "NOT_RESOLVED";

        await supabase
          .from("brands")
          .update({
            paid_target_status: paidTargetStatus,
            paid_targets_count: labs.items.length,
            paid_targets_resolved_at: observedAt,
            // Transparency/brand confirmation stays — Labs miss ≠ no ads
            updated_at: observedAt,
          })
          .eq("id", brand.id);

        if (paidTargetStatus !== "RESOLVED") {
          await markBrandWaitingForPaidTarget(
            supabase,
            brand.id as string,
            labs.items.length
          );
        }

        results.push({
          domain,
          cost: labs.cost,
          totalCount: labs.totalCount,
          paidKeywords: labs.items.length,
          withLandingUrl: withLanding,
          opportunitiesUpserted: oppStats.opportunitiesUpserted,
          croReady: oppStats.croReady,
          paidTargetStatus,
          examples,
        });

        console.log("");
        console.log(`${domain}`);
        console.log(`  cost: $${labs.cost.toFixed(6)}`);
        console.log(`  paid keywords: ${labs.items.length} (total_count=${labs.totalCount})`);
        console.log(`  with landing URL: ${withLanding}`);
        console.log(`  CRO-ready opportunities: ${oppStats.croReady}`);
        console.log(`  status: ${paidTargetStatus}`);
        for (const ex of examples) {
          console.log(
            `  - ${ex.keyword} → ${ex.landingUrl ?? "(no url)"} · vol ${ex.volume ?? "n/a"} · rank ${ex.rank ?? "n/a"}`
          );
        }

        if (totalCost >= maxCost) break;
        void remaining;
      } catch (err) {
        const message = err instanceof Error ? err.message : "unknown";
        logger.error("Paid target resolution failed for domain", { domain, error: message });
        await supabase
          .from("brands")
          .update({
            paid_target_status: "FAILED",
            updated_at: new Date().toISOString(),
          })
          .eq("id", brand.id);
        results.push({ domain, error: message });
      }
    }

    await completeRun(supabase, run.id, "completed", {
      results,
      dataForSeoCost: totalCost,
      anthropicCost: 0,
    });

    console.log("");
    console.log("PAID TARGET RESOLUTION COMPLETE");
    console.log("--------------------------------------------");
    console.log(`Domains: ${results.length}`);
    console.log(`DataForSEO cost: $${totalCost.toFixed(6)}`);
    console.log(`Anthropic cost: $0.000000`);
    console.log("");

    process.exit(0);
  } catch (error) {
    await completeRun(supabase, run.id, "failed", {
      error: error instanceof Error ? error.message : "unknown",
      dataForSeoCost: totalCost,
    });
    logger.error("resolve:paid-targets failed", {
      error: error instanceof Error ? error.message : "unknown",
    });
    process.exit(1);
  }
}

main();
