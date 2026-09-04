/**
 * Milestone 9.1 — hydrate ENGINEERING pilot (template QA).
 * Default mode: ENGINEERING. Tensfact remains valid engineering fixture.
 *
 * npm run concepts:hydrate-pilot
 */

import { config } from "dotenv";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "../config/env.js";
import { createSupabaseServerClient } from "../services/supabase/client.js";
import { hydrateConceptPilot } from "../services/concept/hydrateConceptPilot.js";
import {
  selectPremiumDtcPilot,
  type PilotCandidateRow,
} from "../services/concept/selectPremiumDtcPilot.js";
import { logger } from "../utils/logger.js";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "../../");
config({ path: path.resolve(projectRoot, ".env"), quiet: true });

async function main() {
  const env = loadEnv();
  const supabase = createSupabaseServerClient(env);

  const { data: rows, error } = await supabase
    .from("coe_concept_candidates")
    .select(
      `id, brand_id, concept_ready_score, brand_commerce_model, catalog_focus_score,
       concept_asset_readiness_score, pdp_transformation_potential, hero_product_score,
       primary_concept_product_title, primary_concept_product_url, primary_concept_product_price,
       suggested_template_family, needs_assets, status,
       brands!inner (normalized_domain, name, do_not_contact, manual_excluded, eligibility_status)`
    )
    .eq("status", "BRIEF_READY");

  if (error) throw error;

  const mapped: PilotCandidateRow[] = (rows ?? []).map((r) => {
    const brand = Array.isArray(r.brands) ? r.brands[0] : r.brands;
    const b = brand as {
      normalized_domain: string;
      name: string;
      do_not_contact: boolean;
      manual_excluded: boolean;
      eligibility_status?: string | null;
    };
    return {
      id: r.id as string,
      brand_id: r.brand_id as string,
      concept_ready_score: Number(r.concept_ready_score),
      brand_commerce_model: String(r.brand_commerce_model),
      catalog_focus_score:
        r.catalog_focus_score == null ? null : Number(r.catalog_focus_score),
      concept_asset_readiness_score:
        r.concept_asset_readiness_score == null
          ? null
          : Number(r.concept_asset_readiness_score),
      pdp_transformation_potential:
        r.pdp_transformation_potential == null
          ? null
          : Number(r.pdp_transformation_potential),
      hero_product_score:
        r.hero_product_score == null ? null : Number(r.hero_product_score),
      primary_concept_product_title: r.primary_concept_product_title as string | null,
      primary_concept_product_url: r.primary_concept_product_url as string | null,
      primary_concept_product_price:
        r.primary_concept_product_price == null
          ? null
          : Number(r.primary_concept_product_price),
      suggested_template_family: r.suggested_template_family as string | null,
      needs_assets: r.needs_assets as boolean | null,
      status: r.status as string,
      normalized_domain: b.normalized_domain,
      brand_name: b.name,
      do_not_contact: Boolean(b.do_not_contact),
      manual_excluded: Boolean(b.manual_excluded),
      eligibility_status: b.eligibility_status ?? null,
    };
  });

  const selection = selectPremiumDtcPilot(mapped, { mode: "ENGINEERING" });
  const winner = selection.winner;

  logger.info("M9.1 ENGINEERING pilot selected", {
    domain: winner.normalized_domain,
    score: selection.score,
    mode: selection.mode,
  });

  const hydration = await hydrateConceptPilot(supabase, winner, projectRoot, {
    updateLatest: true,
  });

  const report = {
    milestone: "M9.1",
    mode: "ENGINEERING",
    previewLifecycle: "INTERNAL_PREVIEW",
    selection: {
      conceptId: winner.id,
      brand: winner.brand_name,
      domain: winner.normalized_domain,
      product: winner.primary_concept_product_title,
      productUrl: hydration.productUrl,
      engineeringScore: selection.score,
      reasons: selection.reasons,
      ranked: selection.ranked,
    },
    hydration: hydration.crawlSummary,
    previewPath: hydration.previewPath,
    snapshotPath: hydration.snapshotPath,
    cost: { dataforseo: 0, anthropic: 0 },
  };

  await writeFile(hydration.reportPath, JSON.stringify(report, null, 2), "utf8");

  console.log("\n=== M9.1 ENGINEERING PILOT ===");
  console.log(JSON.stringify(report.selection, null, 2));
  console.log("\nPreview route:", hydration.previewPath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
