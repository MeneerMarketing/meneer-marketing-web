/**
 * Milestone 9 — build concept briefs for approved / high candidates.
 * Max status: BRIEF_READY. No visual design. No mail copy.
 *
 * npm run concepts:build-briefs
 */

import { config } from "dotenv";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "../config/env.js";
import {
  BRIEF_READY_MIN_ASSET_SCORE,
  BRIEF_READY_MIN_CONCEPT_SCORE,
  CONCEPT_TEMPLATE_REGISTRY,
  type ConceptTemplateFamily,
} from "../config/conceptScoring.js";
import { createSupabaseServerClient } from "../services/supabase/client.js";
import { createRun, completeRun } from "../services/supabase/runsRepository.js";
import {
  generateConceptBrief,
  suggestTemplateFamily,
} from "../services/concept/conceptBriefGenerator.js";
import { evaluateConceptGenerationGate } from "../services/concept/generationGate.js";
import { logger } from "../utils/logger.js";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, "../../");
config({ path: resolve(projectRoot, ".env"), quiet: true });

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

async function main(): Promise<void> {
  const env = loadEnv();
  const supabase = createSupabaseServerClient(env);
  const run = await createRun(supabase, "concepts_build_briefs", {
    milestone: "M9",
    apis: { dataforseo: 0, anthropic: 0 },
  });

  try {
    const { data: candidates, error } = await supabase
      .from("coe_concept_candidates")
      .select("*")
      .in("status", ["CONCEPT_CANDIDATE", "BRIEF_READY"])
      .gte("concept_ready_score", BRIEF_READY_MIN_CONCEPT_SCORE)
      .order("concept_ready_score", { ascending: false })
      .limit(25);

    if (error) throw error;
    if (!candidates?.length) {
      logger.info("No concept candidates eligible for briefs");
      await completeRun(supabase, run.id, "completed", { briefs: 0 });
      return;
    }

    let built = 0;
    const examples: Array<Record<string, unknown>> = [];

    for (const c of candidates) {
      if (c.needs_assets && Number(c.concept_asset_readiness_score) < BRIEF_READY_MIN_ASSET_SCORE) {
        logger.info(`Skip ${c.brand_id}: needs_assets`);
        continue;
      }
      if (!c.primary_concept_product_title) {
        logger.info(`Skip ${c.brand_id}: no hero product`);
        continue;
      }

      const { data: brand } = await supabase
        .from("brands")
        .select(
          "id, name, domain, normalized_domain, platform, business_type, do_not_contact, manual_excluded, eligibility_status, lead_eligible"
        )
        .eq("id", c.brand_id)
        .maybeSingle();
      if (!brand) continue;
      if (brand.manual_excluded || brand.do_not_contact) continue;

      let page: {
        product_description: string | null;
        review_count: number | null;
        rating: number | null;
        currency: string | null;
        extracted_data: Record<string, unknown> | null;
        url: string | null;
      } | null = null;
      if (c.page_id) {
        const { data } = await supabase
          .from("pages")
          .select(
            "product_description, review_count, rating, currency, extracted_data, url"
          )
          .eq("id", c.page_id)
          .maybeSingle();
        page = data;
      }

      let audit: {
        conversion_leaks: unknown;
        strengths: unknown;
        screenshot_paths: Record<string, string | null> | null;
      } | null = null;
      if (c.opportunity_id) {
        const { data } = await supabase
          .from("audits")
          .select("conversion_leaks, strengths, screenshot_paths, status")
          .eq("opportunity_id", c.opportunity_id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        audit = data;
      }

      const family = (c.manual_template_family ||
        c.suggested_template_family ||
        suggestTemplateFamily(
          [brand.normalized_domain ?? ""],
          c.brand_commerce_model ?? "UNKNOWN"
        )) as ConceptTemplateFamily;

      const registry = CONCEPT_TEMPLATE_REGISTRY.find(
        (t) => t.template_family === family
      );

      const brandSlug = slugify(brand.normalized_domain ?? brand.name ?? "brand");
      const productSlug = slugify(c.primary_concept_product_title);

      const desc = page?.product_description ?? "";
      const screenshots = Object.entries(audit?.screenshot_paths ?? {})
        .filter(([, v]) => Boolean(v))
        .map(([kind, url]) => ({ url: String(url), kind }));

      const leakLabels = Array.isArray(audit?.conversion_leaks)
        ? audit!.conversion_leaks.map((l: unknown) => {
            if (typeof l === "string") return l;
            if (l && typeof l === "object" && "title" in l)
              return String((l as { title: string }).title);
            if (l && typeof l === "object" && "leak" in l)
              return String((l as { leak: string }).leak);
            return JSON.stringify(l).slice(0, 80);
          })
        : [];
      const strengthLabels = Array.isArray(audit?.strengths)
        ? audit!.strengths.map((s: unknown) => {
            if (typeof s === "string") return s;
            if (s && typeof s === "object" && "title" in s)
              return String((s as { title: string }).title);
            return JSON.stringify(s).slice(0, 80);
          })
        : [];

      const missingAssets = Object.entries(
        (c.asset_readiness_components ?? {}) as Record<string, number | null>
      )
        .filter(([, v]) => v == null || v < 40)
        .map(([k]) => k);

      const brief = generateConceptBrief({
        brandName: brand.name ?? brand.normalized_domain ?? "Unknown",
        domain: brand.normalized_domain ?? brand.domain ?? "",
        brandSlug,
        logoAssetUrl: null,
        brandColors: null,
        productTitle: c.primary_concept_product_title,
        productSlug,
        productUrl: c.primary_concept_product_url,
        productRelationship: c.brand_commerce_model,
        price: c.primary_concept_product_price
          ? Number(c.primary_concept_product_price)
          : null,
        currency: c.primary_concept_product_currency ?? page?.currency ?? "EUR",
        reviewCount: page?.review_count ?? null,
        rating: page?.rating != null ? Number(page.rating) : null,
        usableImages: [],
        currentScreenshots: screenshots,
        croStrengths: strengthLabels,
        croLeaks: leakLabels,
        catalog: {
          focus: c.catalog_focus_score,
          tier: c.catalog_size_tier,
          estimated_products: c.estimated_product_count,
          confidence: c.catalog_confidence,
        },
        heroEvidence: Array.isArray(c.hero_product_evidence)
          ? c.hero_product_evidence.map(String)
          : [],
        assetReadiness: c.asset_readiness_components ?? {},
        missingAssets,
        recommendedProject: c.recommended_project_type,
        recommendedConceptType: c.recommended_concept_type,
        categoryHints: [brand.normalized_domain ?? "", family],
        suggestedTemplateFamily: family,
        hasReviews: (page?.review_count ?? 0) > 0,
        hasIngredients: /ingredient|formule/i.test(desc) ? true : null,
        hasMaterials: /materiaal|material/i.test(desc) ? true : null,
        hasSpecs: /specificatie|afmeting/i.test(desc) ? true : null,
        hasSizeGuide: /maattabel|size guide|maten/i.test(desc) ? true : null,
        hasBeforeAfter: /before|after|voor.?na/i.test(desc) ? true : null,
        hasHowToUse: /gebruik|how to use|aanbrengen/i.test(desc) ? true : null,
        hasHowItWorks: /werking|how it works|technologie/i.test(desc)
          ? true
          : null,
        hasFaq: /faq|veelgestelde/i.test(desc) ? true : null,
        hasDeliveryReturns: /verzending|retour/i.test(desc) ? true : null,
        hasGuarantee: /garantie|guarantee/i.test(desc) ? true : null,
        hasLifestyle: null,
        descriptionLength: desc.length,
        hasBenefits: desc.length >= 120 ? true : null,
        hasFeatures: /feature|kenmerk/i.test(desc) ? true : null,
      });

      // Versioning: next version for this candidate
      const { data: prior } = await supabase
        .from("coe_concept_briefs")
        .select("concept_version")
        .eq("concept_candidate_id", c.id)
        .order("concept_version", { ascending: false })
        .limit(1)
        .maybeSingle();
      const nextVersion = (prior?.concept_version ?? 0) + 1;
      brief.concept_version = nextVersion;

      const { error: briefErr } = await supabase.from("coe_concept_briefs").insert({
        concept_candidate_id: c.id,
        brand_id: c.brand_id,
        concept_version: nextVersion,
        status: "BRIEF_READY",
        brief,
        recommended_section_plan: brief.recommended_section_plan,
        copy_slots: brief.design_copy_slots,
        source_snapshot_date: new Date().toISOString(),
        template_id: registry?.template_id ?? null,
        template_variant: registry?.template_variant ?? null,
        template_version: registry?.template_version ?? null,
        template_family: family,
        preview_slug: brief.preview_slug,
        preview_url: null,
        preview_version: null,
      });
      if (briefErr) throw briefErr;

      await supabase
        .from("coe_concept_candidates")
        .update({
          status: "BRIEF_READY",
          suggested_template_family: family,
          suggested_template_id: registry?.template_id ?? null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", c.id);

      await supabase.from("coe_concept_events").insert({
        concept_candidate_id: c.id,
        brand_id: c.brand_id,
        event_type: "BRIEF_BUILT",
        payload: {
          concept_version: nextVersion,
          concept_ready_score: c.concept_ready_score,
          recommended_concept_type: c.recommended_concept_type,
          template_family: family,
        },
      });

      // Safety gate demo: preview generation still blocked (no designs)
      const gate = evaluateConceptGenerationGate({
        concept_status: "BRIEF_READY",
        hero_product_selected: true,
        asset_readiness_score: Number(c.concept_asset_readiness_score),
        is_excluded: Boolean(brand.manual_excluded),
        is_dnc: Boolean(brand.do_not_contact),
        brand_eligible: brand.eligibility_status !== "EXCLUDED",
        template_id: registry?.template_id ?? null,
        template_design_available: false,
      });

      built += 1;
      if (examples.length < 5) {
        examples.push({
          domain: brand.normalized_domain,
          product: c.primary_concept_product_title,
          concept_type: c.recommended_concept_type,
          section_plan: brief.recommended_section_plan.map((s) => s.section),
          template_family: family,
          missing_assets: brief.missing_assets.slice(0, 8),
          missing_content: brief.missing_content.slice(0, 8),
          generation_gate_allowed: gate.allowed,
          generation_gate_blocked: gate.blocked_reasons,
          preview_url: null,
        });
      }
    }

    logger.info(`Built ${built} concept briefs (max BRIEF_READY)`);
    for (const ex of examples) {
      logger.info(JSON.stringify(ex));
    }

    await completeRun(supabase, run.id, "completed", {
      briefs: built,
      examples,
      dataforseo_cost: 0,
      anthropic_cost: 0,
    });
  } catch (err) {
    await completeRun(supabase, run.id, "failed", {
      error: err instanceof Error ? err.message : String(err),
    });
    throw err;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
