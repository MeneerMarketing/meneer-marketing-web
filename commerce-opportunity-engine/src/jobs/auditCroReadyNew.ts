import { config } from "dotenv";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "../config/env.js";
import { createSupabaseServerClient } from "../services/supabase/client.js";
import { createRun, completeRun } from "../services/supabase/runsRepository.js";
import {
  auditOpportunity,
  loadAuditCandidateById,
  type AuditCandidate,
  type AuditRunResult,
} from "../services/audit/auditRunner.js";
import { classifyProductMerchantRelationship } from "../services/scoring/productMerchantRelationship.js";
import {
  buildInternalSalesAngle,
  recommendProjectType,
} from "../services/scoring/projectType.js";
import { logger } from "../utils/logger.js";
import { one } from "../utils/one.js";
import type { ProductMerchantRelationship } from "../config/commercialFit.js";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, "../../");
config({ path: resolve(projectRoot, ".env"), quiet: true });

/**
 * Milestone 7.3 — CRO audit of NEW confirmed prospects only.
 * No DataForSEO. Max 2 Anthropic audits. Skip existing valid audits.
 */

const NEW_AUDIT_TARGETS: Array<{
  domain: string;
  opportunityId: string;
  expectedUrlIncludes: string;
}> = [
  {
    domain: "boozyshop.nl",
    opportunityId: "f193f69e-9125-4f63-a1e9-58a918f77879",
    expectedUrlIncludes: "cerave-skin-renewing-vitamin-c-serum",
  },
  {
    domain: "huisdierspullen.nl",
    opportunityId: "17b015ba-f3e6-4b61-922b-0b713eadc084",
    expectedUrlIncludes: "trixie-hondentuig-premium-touring",
  },
];

const EXISTING_KEEP: Array<{
  domain: string;
  opportunityId: string;
}> = [
  {
    domain: "currentbody.nl",
    opportunityId: "dc1d09e5-98e6-40de-9cac-52e4fddcc252",
  },
  {
    domain: "dekbed-discounter.nl",
    opportunityId: "7082f47f-d851-4adc-92a2-e0ce2b203fd0",
  },
];

const SKIP_DOMAINS = new Set(["haarshop.nl"]);

type GateResult =
  | { ok: true; candidate: AuditCandidate }
  | { ok: false; reason: string; domain: string; opportunityId: string };

async function gateCandidate(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  target: (typeof NEW_AUDIT_TARGETS)[number]
): Promise<GateResult> {
  const candidate = await loadAuditCandidateById(supabase, target.opportunityId);
  if (!candidate) {
    return {
      ok: false,
      reason: "opportunity_not_found_or_not_cro_ready_level",
      domain: target.domain,
      opportunityId: target.opportunityId,
    };
  }

  if (candidate.domain !== target.domain) {
    return {
      ok: false,
      reason: `domain_mismatch:${candidate.domain}`,
      domain: target.domain,
      opportunityId: target.opportunityId,
    };
  }

  if (candidate.manualExcluded) {
    return {
      ok: false,
      reason: "manual_excluded",
      domain: target.domain,
      opportunityId: target.opportunityId,
    };
  }

  if (SKIP_DOMAINS.has(candidate.domain)) {
    return {
      ok: false,
      reason: "technical_blocked_skip_list",
      domain: target.domain,
      opportunityId: target.opportunityId,
    };
  }

  if (!candidate.targetUrl) {
    return {
      ok: false,
      reason: "missing_target_url",
      domain: target.domain,
      opportunityId: target.opportunityId,
    };
  }

  if (!candidate.targetUrl.toLowerCase().includes(target.expectedUrlIncludes)) {
    return {
      ok: false,
      reason: `target_url_mismatch:${candidate.targetUrl}`,
      domain: target.domain,
      opportunityId: target.opportunityId,
    };
  }

  if (candidate.auditType !== "HIGH_CONFIDENCE_PRODUCT_TARGET") {
    return {
      ok: false,
      reason: `unexpected_audit_type:${candidate.auditType}`,
      domain: target.domain,
      opportunityId: target.opportunityId,
    };
  }

  const { data: opp } = await supabase
    .from("opportunities")
    .select("cro_audit_status, opportunity_score, last_audited_at, cro_audit_eligible")
    .eq("id", target.opportunityId)
    .maybeSingle();

  if (
    opp?.cro_audit_status === "COMPLETED" &&
    opp?.opportunity_score != null &&
    process.env.CRO_AUDIT_FORCE_REAUDIT !== "true"
  ) {
    return {
      ok: false,
      reason: "already_completed_valid_audit",
      domain: target.domain,
      opportunityId: target.opportunityId,
    };
  }

  if (
    opp?.cro_audit_status === "FAILED_TECHNICAL" ||
    opp?.cro_audit_status === "NEEDS_RETRY" ||
    opp?.cro_audit_status === "BLOCKED"
  ) {
    // Still allow if never completed — technical retry only via retry job; M7.3 skips haarshop-style failures when already failed.
    // For first-time targets these statuses should be null.
  }

  if (opp && opp.cro_audit_eligible === false) {
    return {
      ok: false,
      reason: "not_cro_audit_eligible",
      domain: target.domain,
      opportunityId: target.opportunityId,
    };
  }

  return { ok: true, candidate };
}

/** Backfill commercial-fit columns on existing COMPLETED audits (no Anthropic). */
async function backfillCommercialFit(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  opportunityId: string
): Promise<Record<string, unknown>> {
  const { data: opp, error } = await supabase
    .from("opportunities")
    .select(
      `
      id, opportunity_score, meneer_marketing_fit_score, audit_confidence, rebuild_potential,
      product_merchant_relationship, pdp_improvement_potential, full_rebuild_potential,
      recommended_project_type, cro_audit_status, latest_audit_id,
      brands!inner (
        normalized_domain, platform, platform_candidate, business_type,
        retailer_scale_score, manual_excluded, confirmed_google_advertiser, lead_eligible
      ),
      pages ( product_name, product_brand, final_url, url )
    `
    )
    .eq("id", opportunityId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!opp) return { opportunityId, skipped: true, reason: "not_found" };

  const brand = one(opp.brands as Record<string, unknown> | Record<string, unknown>[]);
  const page = one(opp.pages as Record<string, unknown> | Record<string, unknown>[]);
  const domain = String(brand?.normalized_domain ?? "");

  let audit: Record<string, unknown> | null = null;
  if (opp.latest_audit_id) {
    const { data } = await supabase
      .from("audits")
      .select(
        "id, rebuild_potential, sales_angle, product_merchant_relationship, pdp_improvement_potential, full_rebuild_potential"
      )
      .eq("id", opp.latest_audit_id)
      .maybeSingle();
    audit = data;
  }

  if (opp.product_merchant_relationship && opp.recommended_project_type) {
    return {
      domain,
      opportunityId,
      skipped: true,
      reason: "commercial_fit_already_present",
      productMerchantRelationship: opp.product_merchant_relationship,
      recommendedProjectType: opp.recommended_project_type,
      opportunityScore: opp.opportunity_score,
      mmFit: opp.meneer_marketing_fit_score,
    };
  }

  const productBrand = (page?.product_brand as string | null) ?? null;
  const productName = (page?.product_name as string | null) ?? null;
  const merchant = classifyProductMerchantRelationship({
    productBrand,
    productName,
    shopName: null,
    domain,
    businessType: (brand?.business_type as string | null) ?? null,
    pageTitle: null,
    adHeadline: null,
  });

  const fullRebuild =
    opp.full_rebuild_potential != null
      ? Number(opp.full_rebuild_potential)
      : opp.rebuild_potential != null
        ? Number(opp.rebuild_potential)
        : audit?.rebuild_potential != null
          ? Number(audit.rebuild_potential)
          : null;

  const pdp =
    opp.pdp_improvement_potential != null
      ? Number(opp.pdp_improvement_potential)
      : fullRebuild != null
        ? Math.min(
            100,
            Math.round(
              fullRebuild +
                (merchant.relationship === "RESELLER_PRODUCT" ? 20 : 10)
            )
          )
        : null;

  const mmFit = Number(opp.meneer_marketing_fit_score ?? 0);
  const project = recommendProjectType({
    platform: (brand?.platform as string | null) ?? null,
    platformCandidate: (brand?.platform_candidate as string | null) ?? null,
    businessType: (brand?.business_type as string | null) ?? null,
    productRelationship: merchant.relationship as ProductMerchantRelationship,
    fullRebuildPotential: fullRebuild,
    pdpImprovementPotential: pdp,
    mmFitScore: mmFit,
    manualExcluded: Boolean(brand?.manual_excluded),
    retailerScale:
      brand?.retailer_scale_score != null ? Number(brand.retailer_scale_score) : null,
  });

  const salesAngle = buildInternalSalesAngle({
    domain,
    platform: (brand?.platform as string | null) ?? null,
    productRelationship: merchant.relationship,
    projectType: project.projectType,
    pdpPotential: pdp,
    fullRebuildPotential: fullRebuild,
    aiSalesAngle: (audit?.sales_angle as string | null) ?? null,
    confirmedAdvertiser: Boolean(brand?.confirmed_google_advertiser),
  });

  const patch = {
    product_merchant_relationship: merchant.relationship,
    product_merchant_relationship_confidence: merchant.confidence,
    product_merchant_relationship_evidence: merchant.evidence,
    pdp_improvement_potential: pdp,
    full_rebuild_potential: fullRebuild,
    recommended_project_type: project.projectType,
    recommended_project_reason: project.reason,
    updated_at: new Date().toISOString(),
  };

  await supabase.from("opportunities").update(patch).eq("id", opportunityId);
  if (audit?.id) {
    await supabase
      .from("audits")
      .update({ ...patch, sales_angle: salesAngle })
      .eq("id", audit.id);
  }

  return {
    domain,
    opportunityId,
    skipped: false,
    backfilled: true,
    productMerchantRelationship: merchant.relationship,
    pdpImprovementPotential: pdp,
    fullRebuildPotential: fullRebuild,
    recommendedProjectType: project.projectType,
    opportunityScore: opp.opportunity_score,
    mmFit,
    salesAngle,
    auditConfidence: opp.audit_confidence,
  };
}

async function main(): Promise<void> {
  const env = loadEnv();
  const supabase = createSupabaseServerClient(env);
  const maxAudits = env.M73_MAX_NEW_AUDITS;
  const costCap = env.M73_MAX_ANTHROPIC_COST;

  logger.info("Milestone 7.3 — CRO audit cro-ready-new", {
    maxAudits,
    costCap,
    targets: NEW_AUDIT_TARGETS.map((t) => t.domain),
  });

  const run = await createRun(supabase, "cro_ready_new_audit", {
    milestone: "7.3",
    maxAudits,
    costCap,
    dataForSeo: 0,
  });

  let anthropicCost = 0;
  const gatedOut: Array<Record<string, unknown>> = [];
  const auditResults: AuditRunResult[] = [];
  const existingBackfill: Array<Record<string, unknown>> = [];

  try {
    for (const existing of EXISTING_KEEP) {
      const row = await backfillCommercialFit(supabase, existing.opportunityId);
      existingBackfill.push(row);
    }

    const toAudit: AuditCandidate[] = [];
    for (const target of NEW_AUDIT_TARGETS) {
      const gated = await gateCandidate(supabase, target);
      if (!gated.ok) {
        gatedOut.push({
          domain: gated.domain,
          opportunityId: gated.opportunityId,
          notAudited: true,
          reason: gated.reason,
        });
        logger.warn("M7.3 target not audited", gated);
        continue;
      }
      toAudit.push(gated.candidate);
    }

    for (const candidate of toAudit.slice(0, maxAudits)) {
      if (anthropicCost >= costCap) {
        logger.warn("Stopping: M73 Anthropic cost cap reached", {
          anthropicCost,
          cap: costCap,
        });
        gatedOut.push({
          domain: candidate.domain,
          opportunityId: candidate.opportunityId,
          notAudited: true,
          reason: "anthropic_cost_cap",
        });
        break;
      }

      const result = await auditOpportunity(env, supabase, candidate, run.id);
      anthropicCost += result.anthropicCost;
      auditResults.push(result);

      if (anthropicCost >= costCap) {
        logger.warn("M73 Anthropic cost cap reached after audit", {
          anthropicCost,
          cap: costCap,
        });
        break;
      }
    }

    // Comparison snapshot
    const compareIds = [
      ...EXISTING_KEEP.map((e) => e.opportunityId),
      ...NEW_AUDIT_TARGETS.map((t) => t.opportunityId),
    ];
    const { data: compareRows } = await supabase
      .from("opportunities")
      .select(
        `
        id, opportunity_score, meneer_marketing_fit_score, audit_confidence,
        product_merchant_relationship, pdp_improvement_potential, full_rebuild_potential,
        recommended_project_type, cro_audit_status,
        brands!inner ( normalized_domain, platform, business_type )
      `
      )
      .in("id", compareIds);

    const comparison = (compareRows ?? []).map((row) => {
      const brand = one(row.brands as Record<string, unknown> | Record<string, unknown>[]);
      return {
        domain: brand?.normalized_domain,
        platform: brand?.platform,
        businessType: brand?.business_type,
        opportunityScore: row.opportunity_score,
        mmFit: row.meneer_marketing_fit_score,
        productRelationship: row.product_merchant_relationship,
        pdpImprovement: row.pdp_improvement_potential,
        fullRebuild: row.full_rebuild_potential,
        recommendedProject: row.recommended_project_type,
        auditConfidence: row.audit_confidence,
        croAuditStatus: row.cro_audit_status,
      };
    });

    const { data: haarshop } = await supabase
      .from("opportunities")
      .select("id, cro_audit_status, brands!inner(normalized_domain)")
      .eq("brands.normalized_domain", "haarshop.nl")
      .eq("cro_audit_eligible", true)
      .limit(3);

    await completeRun(supabase, run.id, "completed", {
      anthropicCost,
      dataForSeoCost: 0,
      auditResults,
      gatedOut,
      existingBackfill,
      comparison,
      haarshop: (haarshop ?? []).map((h) => ({
        id: h.id,
        status: h.cro_audit_status,
        domain: one(h.brands as Record<string, unknown> | Record<string, unknown>[])
          ?.normalized_domain,
      })),
    });

    console.log("");
    console.log("MILESTONE 7.3 — CRO READY NEW AUDIT");
    console.log("============================================");
    console.log(`Anthropic: $${anthropicCost.toFixed(6)}`);
    console.log(`DataForSEO: $0.000000`);
    console.log("");

    for (const result of auditResults) {
      console.log(result.domain.toUpperCase());
      if (result.skipped) {
        console.log(`  skipped: ${result.skipReason}`);
      } else {
        console.log(`  Opportunity Score: ${result.opportunityScore ?? "null"}`);
        console.log(`  MM Fit: ${result.meneerMarketingFitScore}`);
        console.log(`  Product relationship: ${result.productMerchantRelationship}`);
        console.log(`  PDP potential: ${result.pdpImprovementPotential}`);
        console.log(`  Full rebuild: ${result.fullRebuildPotential}`);
        console.log(`  Project: ${result.recommendedProjectType}`);
        console.log(`  Confidence: ${result.auditConfidence}`);
        console.log(`  Status: ${result.croAuditStatus}`);
        if (result.salesAngle) console.log(`  Sales angle: ${result.salesAngle}`);
      }
      console.log("");
    }

    if (gatedOut.length) {
      console.log("NOT AUDITED");
      for (const g of gatedOut) {
        console.log(`  ${g.domain}: ${g.reason}`);
      }
      console.log("");
    }

    console.log("COMPARISON");
    for (const row of comparison) {
      console.log(
        `  ${row.domain}: Opp ${row.opportunityScore} | MM ${row.mmFit} | ${row.platform} | ${row.businessType} | ${row.productRelationship} | PDP ${row.pdpImprovement} | Rebuild ${row.fullRebuild} | ${row.recommendedProject} | conf ${row.auditConfidence}`
      );
    }
    console.log("");
    console.log("HAARSHOP: NEEDS_RETRY / FAILED_TECHNICAL (not audited)");
    console.log("STOP — no discovery, no outreach.");

    process.exit(0);
  } catch (error) {
    await completeRun(supabase, run.id, "failed", {
      error: error instanceof Error ? error.message : "unknown",
      anthropicCost,
      dataForSeoCost: 0,
    });
    logger.error("M7.3 audit job failed", {
      error: error instanceof Error ? error.message : "unknown",
    });
    process.exit(1);
  }
}

main();
