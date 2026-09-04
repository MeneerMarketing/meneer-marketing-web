/**
 * Milestone 9.2.1 — Outreach CRO coverage expansion.
 * Max 8 new audits. No DataForSEO. No preview. No mail.
 *
 * npm run concepts:audit-outreach-pool
 */
import { config } from "dotenv";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "../config/env.js";
import { M921_CONSERVATIVE_AUDIT_COST, OUTREACH_PILOT_GATE, } from "../config/outreachCroCoverage.js";
import { createSupabaseServerClient } from "../services/supabase/client.js";
import { createRun, completeRun } from "../services/supabase/runsRepository.js";
import { auditOpportunity } from "../services/audit/auditRunner.js";
import { loadConceptProspectPool } from "../services/concept/loadConceptProspectPool.js";
import { buildConceptAuditCandidate, selectOutreachAuditCandidates, } from "../services/concept/selectOutreachAuditCandidates.js";
import { ensureConceptAuditOpportunity } from "../services/concept/ensureConceptAuditOpportunity.js";
import { scoreEngineeringPilotRow } from "../services/concept/selectPremiumDtcPilot.js";
import { scoreOutreachConceptFit } from "../services/concept/outreachScoring.js";
import { evaluateOutreachCandidateGate } from "../services/concept/outreachCandidateGate.js";
import { scorePdpTransformationPotential } from "../services/concept/pdpTransformation.js";
import { computeConceptContrastPotential } from "../services/concept/conceptContrastPotential.js";
import { computeCurrentPdpQualityScore, } from "../services/concept/currentPdpQuality.js";
import { evaluateAnthropicBudgetGate, } from "../services/outreach/anthropicBudget.js";
import { logger } from "../utils/logger.js";
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "../../");
config({ path: path.resolve(projectRoot, ".env"), quiet: true });
function num(v) {
    return v ?? 0;
}
async function patchAuditTarget(
// eslint-disable-next-line @typescript-eslint/no-explicit-any
supabase, opportunityId, productUrl) {
    const { data: opp } = await supabase
        .from("opportunities")
        .select("latest_audit_id")
        .eq("id", opportunityId)
        .maybeSingle();
    if (!opp?.latest_audit_id)
        return;
    const { data: audit } = await supabase
        .from("audits")
        .select("findings")
        .eq("id", opp.latest_audit_id)
        .maybeSingle();
    const findings = audit?.findings && typeof audit.findings === "object"
        ? { ...audit.findings }
        : {};
    findings.audit_target = {
        audited_product_url: productUrl,
        target_source: "concept_brief_hero",
        target_confidence: "high",
    };
    await supabase
        .from("audits")
        .update({ findings, updated_at: new Date().toISOString() })
        .eq("id", opp.latest_audit_id);
}
async function recomputeConceptTransformation(
// eslint-disable-next-line @typescript-eslint/no-explicit-any
supabase, conceptId, cro, signals, entry) {
    const quality = computeCurrentPdpQualityScore(cro, signals);
    const row = entry.pilotRow;
    const transform = scorePdpTransformationPotential({
        croQualityScore: quality.score,
        leakCount: entry.outreachInput.conversionLeakCount,
        strengthCount: entry.outreachInput.strengthCount,
        productCommercialSignal: num(row.product_commercial_signal_score),
        assetReadiness: num(row.concept_asset_readiness_score),
        catalogFocus: num(row.catalog_focus_score),
        brandCommerceModel: String(row.brand_commerce_model),
        retailerScaleScore: entry.outreachInput.retailerScaleScore,
        mmFitScore: entry.outreachInput.mmFitScore,
        siteTechnicallyBroken: false,
        storytellingWeak: num(cro.product_storytelling_quality) < 55,
        aboveFoldWeak: num(cro.above_fold_quality) < 55,
        trustNearBuyblockWeak: num(cro.trust_quality) < 55,
        deepDiveWeak: signals?.deep_dive_quality != null
            ? signals.deep_dive_quality < 55
            : num(cro.product_presentation_quality) < 55,
    });
    // Fresh audit data is the best moment to re-answer the before/after question.
    const contrast = computeConceptContrastPotential({
        currentPdpQuality: quality.score,
        croQualityComposite: entry.croQualityComposite,
        croDataSource: "AUDITED",
        auditConfidence: entry.outreachInput.auditConfidence,
        visualDesignQuality: signals?.premium_design_perception ?? num(cro.visual_design_quality) ?? null,
        productStorytellingQuality: num(cro.product_storytelling_quality),
        productPresentationQuality: num(cro.product_presentation_quality),
        deepDiveQuality: signals?.deep_dive_quality ?? num(cro.product_presentation_quality),
        conceptAssetReadiness: row.concept_asset_readiness_score,
        productCommercialSignal: row.product_commercial_signal_score ?? null,
        catalogFocus: row.catalog_focus_score,
        businessMaturity: entry.outreachInput.businessMaturityScore,
        brandCommerceModel: String(row.brand_commerce_model),
        productDescriptionLength: entry.outreachInput.productDescriptionLength,
        reviewCount: entry.outreachInput.reviewCount,
        siteTechnicallyBroken: false,
    });
    await supabase
        .from("coe_concept_candidates")
        .update({
        pdp_transformation_potential: transform.pdp_transformation_potential,
        concept_contrast_potential: contrast.concept_contrast_potential,
        concept_contrast_band: contrast.band,
        concept_contrast_confidence: contrast.confidence,
        concept_contrast_ceiling: contrast.ceilingApplied,
        concept_contrast_evidence: contrast.evidence,
        concept_contrast_computed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    })
        .eq("id", conceptId);
    return transform.pdp_transformation_potential;
}
function selectTrueOutreachPilot(scored) {
    const auditedEligible = scored
        .filter((s) => s.gate.eligible &&
        s.outreach.croDataSource === "AUDITED" &&
        (s.entry.outreachInput.currentPdpQualityScore ?? 100) < 75 &&
        (s.entry.pilotRow.pdp_transformation_potential ?? 0) >= 55)
        .sort((a, b) => b.outreach.outreachConceptFitScore - a.outreach.outreachConceptFitScore);
    const pick = auditedEligible[0];
    if (!pick) {
        const proxyFallback = scored
            .filter((s) => s.gate.eligible)
            .sort((a, b) => b.outreach.outreachConceptFitScore - a.outreach.outreachConceptFitScore)[0];
        if (!proxyFallback)
            return { winner: null, runnerUps: [], why: ["no_gate_eligible_candidates"] };
        return {
            winner: null,
            runnerUps: [],
            why: [
                "no_audited_gate_eligible_winner",
                `best_proxy=${proxyFallback.entry.pilotRow.normalized_domain}:${proxyFallback.outreach.outreachConceptFitScore}`,
            ],
        };
    }
    const row = pick.entry.pilotRow;
    const winner = {
        domain: row.normalized_domain,
        category: pick.entry.categoryHint,
        platform: row.platform ?? null,
        commerceModel: String(row.brand_commerce_model),
        catalogFocus: row.catalog_focus_score,
        heroProduct: row.primary_concept_product_title,
        productPrice: row.primary_concept_product_price,
        adsStatus: pick.entry.adsStatus,
        currentPdpQuality: pick.entry.outreachInput.currentPdpQualityScore,
        transformation: row.pdp_transformation_potential,
        assetReadiness: row.concept_asset_readiness_score,
        deepDiveFit: pick.outreach.components.deepDivePdpFit,
        economicFit: pick.outreach.components.projectEconomicFit,
        outreachFit: pick.outreach.outreachConceptFitScore,
        scoreConfidence: pick.outreach.outreachScoreConfidence,
        croDataSource: pick.outreach.croDataSource,
        gateEligible: true,
        conceptId: row.id,
    };
    const runnerUps = auditedEligible.slice(1, 3).map((s) => ({
        domain: s.entry.pilotRow.normalized_domain,
        category: s.entry.categoryHint,
        platform: s.entry.pilotRow.platform ?? null,
        commerceModel: String(s.entry.pilotRow.brand_commerce_model),
        catalogFocus: s.entry.pilotRow.catalog_focus_score,
        heroProduct: s.entry.pilotRow.primary_concept_product_title,
        productPrice: s.entry.pilotRow.primary_concept_product_price,
        adsStatus: s.entry.adsStatus,
        currentPdpQuality: s.entry.outreachInput.currentPdpQualityScore,
        transformation: s.entry.pilotRow.pdp_transformation_potential,
        assetReadiness: s.entry.pilotRow.concept_asset_readiness_score,
        deepDiveFit: s.outreach.components.deepDivePdpFit,
        economicFit: s.outreach.components.projectEconomicFit,
        outreachFit: s.outreach.outreachConceptFitScore,
        scoreConfidence: s.outreach.outreachScoreConfidence,
        croDataSource: s.outreach.croDataSource,
        gateEligible: true,
        conceptId: s.entry.pilotRow.id,
    }));
    const why = [
        `Highest audited outreach fit (${pick.outreach.outreachConceptFitScore}) among gate-eligible briefs`,
        `CRO data source=${pick.outreach.croDataSource}, confidence=${pick.outreach.outreachScoreConfidence}`,
        `Current PDP quality=${pick.entry.outreachInput.currentPdpQualityScore ?? "n/a"}`,
        `Transformation=${row.pdp_transformation_potential}`,
        `Deep-dive fit=${pick.outreach.components.deepDivePdpFit}`,
        `Asset readiness=${row.concept_asset_readiness_score}`,
    ];
    return { winner, runnerUps, why };
}
async function main() {
    const env = loadEnv();
    const supabase = createSupabaseServerClient(env);
    const budgetCap = env.M921_MAX_ANTHROPIC_COST;
    let anthropicCost = 0;
    const run = await createRun(supabase, "concepts_audit_outreach_pool", {
        milestone: "M9.2.1",
        apis: { dataforseo: 0, anthropic: 0 },
    });
    try {
        const { selected, skipped } = await selectOutreachAuditCandidates(supabase);
        const auditRuns = [];
        for (const candidate of selected) {
            const row = candidate.entry.pilotRow;
            let opportunityId = candidate.opportunityId;
            try {
                opportunityId = await ensureConceptAuditOpportunity(supabase, {
                    conceptId: row.id,
                    brandId: row.brand_id,
                    productUrl: candidate.productUrl,
                    pageId: row.page_id,
                });
            }
            catch (ensureError) {
                auditRuns.push({
                    domain: row.normalized_domain,
                    conceptId: row.id,
                    opportunityId: candidate.opportunityId,
                    productUrl: candidate.productUrl,
                    preAuditRank: candidate.preAuditRank,
                    skipped: true,
                    skipReason: "ensure_opportunity_failed",
                    anthropicCost: 0,
                    errors: [
                        ensureError instanceof Error ? ensureError.message : String(ensureError),
                    ],
                });
                continue;
            }
            const gate = evaluateAnthropicBudgetGate({
                currentRunCost: anthropicCost,
                configuredCap: budgetCap,
                conservativeNextCallCost: M921_CONSERVATIVE_AUDIT_COST,
                label: row.normalized_domain,
            });
            if (!gate.allowed) {
                auditRuns.push({
                    domain: row.normalized_domain,
                    conceptId: row.id,
                    opportunityId: candidate.opportunityId,
                    productUrl: candidate.productUrl,
                    preAuditRank: candidate.preAuditRank,
                    skipped: true,
                    skipReason: gate.reason,
                    anthropicCost: 0,
                    errors: [gate.reason],
                });
                continue;
            }
            const auditCandidate = await buildConceptAuditCandidate(supabase, opportunityId, candidate.productUrl);
            if (!auditCandidate) {
                auditRuns.push({
                    domain: row.normalized_domain,
                    conceptId: row.id,
                    opportunityId,
                    productUrl: candidate.productUrl,
                    preAuditRank: candidate.preAuditRank,
                    skipped: true,
                    skipReason: "could_not_build_audit_candidate",
                    anthropicCost: 0,
                    errors: ["could_not_build_audit_candidate"],
                });
                continue;
            }
            const result = await auditOpportunity(env, supabase, auditCandidate, run.id);
            anthropicCost += result.anthropicCost;
            if (result.skipped) {
                auditRuns.push({
                    domain: row.normalized_domain,
                    conceptId: row.id,
                    opportunityId,
                    productUrl: candidate.productUrl,
                    preAuditRank: candidate.preAuditRank,
                    skipped: true,
                    skipReason: result.skipReason ?? "audit_skipped",
                    pageHealthStatus: result.pageHealthStatus,
                    anthropicCost: result.anthropicCost,
                    errors: result.errors,
                });
                continue;
            }
            await patchAuditTarget(supabase, opportunityId, candidate.productUrl);
            const { data: auditRow } = await supabase
                .from("audits")
                .select("cro_scores, findings, audit_confidence, page_health_status")
                .eq("opportunity_id", opportunityId)
                .order("audited_at", { ascending: false })
                .limit(1)
                .maybeSingle();
            const cro = (auditRow?.cro_scores ?? {});
            const findings = auditRow?.findings;
            const signals = findings?.concept_first_signals ?? null;
            const quality = computeCurrentPdpQualityScore(cro, signals);
            await recomputeConceptTransformation(supabase, row.id, cro, signals, candidate.entry);
            auditRuns.push({
                domain: row.normalized_domain,
                conceptId: row.id,
                opportunityId,
                productUrl: candidate.productUrl,
                preAuditRank: candidate.preAuditRank,
                skipped: false,
                pageHealthStatus: auditRow?.page_health_status ?? result.pageHealthStatus,
                currentPdpQuality: quality.score,
                currentPdpBand: quality.band,
                buyblock: quality.components.buyblock,
                storytelling: quality.components.storytelling,
                media: quality.components.media,
                deepDive: quality.components.deepDive,
                mobile: quality.components.mobile,
                design: quality.components.design,
                auditConfidence: auditRow?.audit_confidence ?? result.auditConfidence,
                anthropicCost: result.anthropicCost,
                errors: result.errors,
            });
        }
        const pool = await loadConceptProspectPool(supabase);
        const scored = pool.map((entry) => {
            const engineeringScore = scoreEngineeringPilotRow(entry.pilotRow);
            const outreach = scoreOutreachConceptFit(entry.outreachInput, engineeringScore);
            const gate = evaluateOutreachCandidateGate({
                row: entry.pilotRow,
                outreach,
                pageHealthOk: entry.pageHealthOk,
                croQualityComposite: entry.croQualityComposite,
                auditConfidence: entry.outreachInput.auditConfidence,
            });
            return { entry, outreach, gate, engineeringScore };
        });
        const ranked = scored
            .map(({ entry, outreach, gate }) => ({
            domain: entry.pilotRow.normalized_domain,
            category: entry.categoryHint,
            platform: entry.pilotRow.platform ?? null,
            commerceModel: String(entry.pilotRow.brand_commerce_model),
            catalogFocus: entry.pilotRow.catalog_focus_score,
            heroProduct: entry.pilotRow.primary_concept_product_title,
            productPrice: entry.pilotRow.primary_concept_product_price,
            adsStatus: entry.adsStatus,
            currentPdpQuality: entry.outreachInput.currentPdpQualityScore,
            transformation: entry.pilotRow.pdp_transformation_potential,
            assetReadiness: entry.pilotRow.concept_asset_readiness_score,
            deepDiveFit: outreach.components.deepDivePdpFit,
            economicFit: outreach.components.projectEconomicFit,
            outreachFit: outreach.outreachConceptFitScore,
            scoreConfidence: outreach.outreachScoreConfidence,
            croDataSource: outreach.croDataSource,
            gateEligible: gate.eligible,
            conceptId: entry.pilotRow.id,
        }))
            .sort((a, b) => b.outreachFit - a.outreachFit);
        const top10 = ranked.slice(0, 10);
        const tensfact = ranked.find((r) => r.domain === "tensfact.com");
        const top3 = top10.slice(0, 3);
        const pilot = selectTrueOutreachPilot(scored);
        const selectionReport = {
            selectedForAudit: selected.map((c) => ({
                domain: c.entry.pilotRow.normalized_domain,
                conceptId: c.entry.pilotRow.id,
                preAuditRank: c.preAuditRank,
                productUrl: c.productUrl,
                rankEvidence: c.rankEvidence,
            })),
            skippedFromPool: skipped.slice(0, 40).map((c) => ({
                domain: c.entry.pilotRow.normalized_domain,
                reason: c.skipReason,
            })),
        };
        const tensfactComparison = {
            tensfact: tensfact ?? null,
            top3,
            tensfactStillNumberOne: tensfact != null && top10[0]?.domain === "tensfact.com",
            note: tensfact != null && top10[0]?.domain !== "tensfact.com"
                ? `${top10[0]?.domain} leads outreach fit (${top10[0]?.outreachFit}) vs Tensfact (${tensfact.outreachFit})`
                : "Tensfact still leads or absent from pool",
        };
        const report = {
            milestone: "M9.2.1",
            generatedAt: new Date().toISOString(),
            costs: {
                anthropic: anthropicCost,
                dataforseo: 0,
                budgetCap,
            },
            auditSelection: selectionReport,
            audits: auditRuns,
            newOutreachRanking: { top10 },
            tensfactComparison,
            trueOutreachPilot: {
                winner: pilot.winner,
                runnerUps: pilot.runnerUps,
                why: pilot.why,
                gate: OUTREACH_PILOT_GATE,
            },
        };
        const reportDir = path.resolve(projectRoot, "dashboard/src/preview/concepts/data");
        await mkdir(reportDir, { recursive: true });
        const reportPath = path.join(reportDir, "outreach-coverage-report.json");
        await writeFile(reportPath, JSON.stringify(report, null, 2), "utf8");
        logger.info("M9.2.1 outreach CRO coverage complete", {
            auditsRun: auditRuns.filter((a) => !a.skipped).length,
            anthropicCost,
            topDomain: top10[0]?.domain,
            pilotWinner: pilot.winner?.domain,
            reportPath,
        });
        await completeRun(supabase, run.id, "completed", {
            anthropicCost,
            dataForSeoCost: 0,
            audits: auditRuns.length,
            topDomain: top10[0]?.domain,
        });
    }
    catch (error) {
        await completeRun(supabase, run.id, "failed", {
            error: error instanceof Error ? error.message : "unknown",
            anthropicCost,
            dataForSeoCost: 0,
        });
        logger.error("M9.2.1 audit outreach pool failed", {
            error: error instanceof Error ? error.message : "unknown",
        });
        process.exit(1);
    }
}
main();
//# sourceMappingURL=auditOutreachPool.js.map