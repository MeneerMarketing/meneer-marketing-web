import { config } from "dotenv";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "../config/env.js";
import { OUTREACH_ELIGIBILITY, OUTREACH_COPY_STYLES } from "../config/outreach.js";
import { createSupabaseServerClient } from "../services/supabase/client.js";
import { createRun, completeRun } from "../services/supabase/runsRepository.js";
import { evaluateOutreachEligibility } from "../services/outreach/outreachEligibility.js";
import { computeOutreachPriorityScore } from "../services/outreach/outreachPriority.js";
import { generateOutreachDraft } from "../services/outreach/outreachDraftGenerator.js";
import { countSupportedFindings, findingIdFromTitle, isEmailOrDomainSuppressed, } from "../services/outreach/outreachRepository.js";
import { attachValidationStatus, buildAllowedClaims, } from "../services/outreach/allowedClaims.js";
import { syncOutreachMessagesForBrand } from "../services/outreach/outreachStateSync.js";
import { logger } from "../utils/logger.js";
import { one } from "../utils/one.js";
const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, "../../");
config({ path: resolve(projectRoot, ".env"), quiet: true });
/**
 * Milestone 8.1 — generate V2 outreach drafts (copy styles).
 * Max 3. Anthropic cap M81_MAX_ANTHROPIC_COST. No real prospect sends.
 * Copy-test mode may include harvest-excluded brands that are not manual/DNC,
 * then immediately sync-blocks them so they cannot remain "Approved / Ready to Send".
 */
async function main() {
    const env = loadEnv();
    const supabase = createSupabaseServerClient(env);
    const maxDrafts = Math.min(env.M81_COPY_TEST_MAX, env.M8_OUTREACH_DRAFT_MAX);
    const costCap = env.M81_MAX_ANTHROPIC_COST;
    const copyTestAllowHarvestExcluded = env.M81_COPY_TEST_ALLOW_HARVEST_EXCLUDED;
    // Safety first: revoke/block any unsafe open messages
    const { data: unsafeBrands } = await supabase
        .from("brands")
        .select("id, normalized_domain")
        .or("manual_excluded.eq.true,do_not_contact.eq.true,eligibility_status.eq.EXCLUDED,lead_eligible.eq.false");
    const preSync = [];
    for (const b of unsafeBrands ?? []) {
        const synced = await syncOutreachMessagesForBrand(supabase, String(b.id));
        for (const s of synced.filter((x) => x.nextStatus)) {
            preSync.push({
                domain: b.normalized_domain,
                messageId: s.messageId,
                from: s.previousStatus,
                to: s.nextStatus,
                reasons: s.reasons,
            });
        }
    }
    const { data: rows, error } = await supabase
        .from("opportunities")
        .select(`
      id, brand_id, opportunity_score, meneer_marketing_fit_score, audit_confidence,
      cro_audit_status, recommended_project_type, audit_type, keyword_intent,
      source_quality_score, page_health_status, rebuild_potential,
      full_rebuild_potential, pdp_improvement_potential, status,
      landing_url, resolved_url, ad_headline,
      brands!inner (
        id, name, normalized_domain, platform, platform_candidate, business_type,
        business_maturity_score, manual_excluded, do_not_contact, contact_status,
        preferred_contact_id, preferred_contact_reason, first_touch_sent_at,
        confirmed_google_advertiser, eligibility_status, lead_eligible
      ),
      pages ( product_name, product_brand ),
      keywords!opportunities_keyword_id_fkey ( keyword, category )
    `)
        .eq("cro_audit_status", "COMPLETED")
        .not("opportunity_score", "is", null)
        .order("meneer_marketing_fit_score", { ascending: false, nullsFirst: false })
        .limit(30);
    if (error)
        throw new Error(error.message);
    const eligibilityReport = [];
    const ranked = [];
    for (const row of rows ?? []) {
        const brand = one(row.brands);
        if (!brand)
            continue;
        const domain = String(brand.normalized_domain);
        const { data: audit } = await supabase
            .from("audits")
            .select("id, audit_valid, conversion_leaks, strengths, finding_validations, sales_angle, page_health_status")
            .eq("opportunity_id", row.id)
            .eq("status", "COMPLETED")
            .eq("audit_valid", true)
            .order("audited_at", { ascending: false })
            .limit(1)
            .maybeSingle();
        const leaks = Array.isArray(audit?.conversion_leaks)
            ? audit.conversion_leaks
            : [];
        const strengths = Array.isArray(audit?.strengths)
            ? audit.strengths
            : [];
        const supportedCount = countSupportedFindings(leaks, audit?.finding_validations);
        const salesAngle = audit?.sales_angle ?? null;
        let contact = null;
        if (brand.preferred_contact_id) {
            const { data } = await supabase
                .from("coe_brand_contacts")
                .select("*")
                .eq("id", brand.preferred_contact_id)
                .maybeSingle();
            contact = data;
        }
        if (!contact) {
            const { data } = await supabase
                .from("coe_brand_contacts")
                .select("*")
                .eq("brand_id", brand.id)
                .eq("is_usable_for_outreach", true)
                .order("contact_confidence", { ascending: false })
                .limit(1)
                .maybeSingle();
            contact = data;
        }
        const suppressed = await isEmailOrDomainSuppressed(supabase, contact?.email ?? null, domain);
        const harvestExcluded = String(brand.eligibility_status ?? "").toUpperCase() === "EXCLUDED" ||
            brand.lead_eligible === false;
        const eligibility = evaluateOutreachEligibility({
            manualExcluded: Boolean(brand.manual_excluded),
            doNotContact: Boolean(brand.do_not_contact),
            eligibilityStatus: brand.eligibility_status ?? null,
            leadEligible: brand.lead_eligible === null || brand.lead_eligible === undefined
                ? null
                : Boolean(brand.lead_eligible),
            businessType: brand.business_type ?? null,
            croAuditStatus: row.cro_audit_status,
            auditValid: Boolean(audit?.audit_valid),
            auditConfidence: row.audit_confidence != null ? Number(row.audit_confidence) : null,
            supportedFindingsCount: supportedCount,
            mmFit: row.meneer_marketing_fit_score != null
                ? Number(row.meneer_marketing_fit_score)
                : null,
            opportunityScore: row.opportunity_score != null ? Number(row.opportunity_score) : null,
            recommendedProjectType: row.recommended_project_type ?? null,
            fullRebuildPotential: row.full_rebuild_potential != null
                ? Number(row.full_rebuild_potential)
                : null,
            pdpImprovementPotential: row.pdp_improvement_potential != null
                ? Number(row.pdp_improvement_potential)
                : null,
            websiteReachable: row.page_health_status === "HEALTHY" ||
                row.page_health_status === "PARTIAL",
            suppressed,
            firstTouchSent: Boolean(brand.first_touch_sent_at),
        });
        const contactOk = Boolean(contact?.email) &&
            Boolean(contact?.is_usable_for_outreach) &&
            Number(contact?.contact_confidence ?? 0) >=
                OUTREACH_ELIGIBILITY.minContactConfidenceForDraft;
        const priority = computeOutreachPriorityScore({
            opportunityScore: row.opportunity_score != null ? Number(row.opportunity_score) : null,
            mmFit: row.meneer_marketing_fit_score != null
                ? Number(row.meneer_marketing_fit_score)
                : null,
            auditConfidence: row.audit_confidence != null ? Number(row.audit_confidence) : null,
            supportedFindingsCount: supportedCount,
            recommendedProjectType: row.recommended_project_type ?? null,
            businessMaturity: brand.business_maturity_score != null
                ? Number(brand.business_maturity_score)
                : null,
            sourceQualityScore: row.source_quality_score != null
                ? Number(row.source_quality_score)
                : null,
            contactConfidence: contact?.contact_confidence != null
                ? Number(contact.contact_confidence)
                : null,
            contactFound: contactOk,
            pageHealthOk: row.page_health_status === "HEALTHY" ||
                row.page_health_status === "PARTIAL",
        });
        const trulyEligible = eligibility.eligible && contactOk;
        const copyTestCandidate = copyTestAllowHarvestExcluded &&
            !brand.manual_excluded &&
            !brand.do_not_contact &&
            !suppressed &&
            contactOk &&
            Boolean(audit?.audit_valid) &&
            supportedCount >= OUTREACH_ELIGIBILITY.minSupportedFindings &&
            harvestExcluded &&
            !eligibility.blockers.some((b) => [
                "manual_excluded",
                "do_not_contact",
                "suppressed",
                "first_touch_already_sent",
                "insufficient_sales_reason_strong_existing_site",
            ].includes(b));
        await supabase
            .from("opportunities")
            .update({
            outreach_eligible: trulyEligible,
            outreach_eligible_reason: trulyEligible
                ? eligibility.reason
                : eligibility.reason ||
                    (contactOk ? "not_eligible" : "no_usable_contact"),
            outreach_priority_score: priority,
            updated_at: new Date().toISOString(),
        })
            .eq("id", row.id);
        eligibilityReport.push({
            domain,
            opportunityId: row.id,
            eligible: trulyEligible,
            copyTestCandidate,
            reason: trulyEligible
                ? eligibility.reason
                : copyTestCandidate
                    ? "copy_test_only_harvest_excluded"
                    : eligibility.reason,
            priority,
            mmFit: row.meneer_marketing_fit_score,
            project: row.recommended_project_type,
            contact: contact?.email ?? null,
        });
        if ((trulyEligible || copyTestCandidate) && contact) {
            ranked.push({
                opportunityId: row.id,
                brandId: String(brand.id),
                domain,
                priority,
                row: row,
                brand,
                contact,
                supportedCount,
                leaks,
                strengths,
                findingValidations: audit?.finding_validations ?? null,
                salesAngle,
                copyTestOnly: !trulyEligible && copyTestCandidate,
            });
        }
    }
    ranked.sort((a, b) => b.priority - a.priority);
    const toDraft = ranked.slice(0, Math.max(1, Math.ceil(maxDrafts / 2)));
    const run = await createRun(supabase, "outreach_generate_drafts_v2", {
        milestone: "8.1",
        maxDrafts,
        costCap,
    });
    let anthropicCost = 0;
    const drafts = [];
    let draftCount = 0;
    try {
        for (const item of toDraft) {
            if (draftCount >= maxDrafts || anthropicCost >= costCap)
                break;
            // Skip if a real SENT already exists
            const { data: existingSent } = await supabase
                .from("coe_outreach_messages")
                .select("id, status")
                .eq("brand_id", item.brandId)
                .in("status", ["SENT", "DELIVERED"])
                .limit(1)
                .maybeSingle();
            if (existingSent) {
                drafts.push({
                    domain: item.domain,
                    skipped: true,
                    reason: `existing_${existingSent.status}`,
                });
                continue;
            }
            const page = one(item.row.pages);
            const keyword = one(item.row.keywords);
            const supportedFindings = item.leaks
                .filter((l) => l.title)
                .slice(0, 5)
                .map((l, idx) => ({
                id: findingIdFromTitle(String(l.title), idx),
                title: String(l.title),
                severity: String(l.severity ?? "MEDIUM"),
                evidence: String(l.evidence ?? "").slice(0, 400),
            }));
            const pageUrl = page?.url ??
                item.row.resolved_url ??
                item.row.landing_url ??
                null;
            const allowedClaims = buildAllowedClaims({
                pageUrl,
                productName: page?.product_name ?? null,
                brandName: item.brand.name ?? null,
                findings: attachValidationStatus(supportedFindings, item.findingValidations),
                strengths: item.strengths
                    .filter((s) => s.title)
                    .slice(0, 3)
                    .map((s) => ({
                    title: String(s.title),
                    evidence: String(s.evidence ?? "").slice(0, 300),
                })),
                supportedOnly: true,
            });
            if (!allowedClaims.some((c) => c.type === "OBSERVATION")) {
                drafts.push({
                    domain: item.domain,
                    skipped: true,
                    reason: "no_allowed_observation_claims",
                });
                continue;
            }
            for (const copyStyle of OUTREACH_COPY_STYLES) {
                if (draftCount >= maxDrafts || anthropicCost >= costCap)
                    break;
                const generated = await generateOutreachDraft({
                    env,
                    data: {
                        brandDomain: item.domain,
                        brandName: item.brand.name ?? null,
                        contactFirstName: item.contact.first_name ?? null,
                        contactEmail: String(item.contact.email),
                        productName: page?.product_name ?? null,
                        category: keyword?.category ?? null,
                        platform: item.brand.platform ??
                            item.brand.platform_candidate,
                        auditType: item.row.audit_type ?? null,
                        keyword: keyword?.keyword ?? null,
                        pageUrl,
                        confirmedGoogleAdvertiser: Boolean(item.brand.confirmed_google_advertiser),
                        recommendedProjectType: String(item.row.recommended_project_type),
                        salesAngle: item.salesAngle,
                        copyStyle,
                        allowedClaims,
                    },
                });
                anthropicCost += generated.estimatedCost;
                draftCount += 1;
                const { data: latest } = await supabase
                    .from("coe_outreach_messages")
                    .select("version")
                    .eq("opportunity_id", item.opportunityId)
                    .order("version", { ascending: false })
                    .limit(1)
                    .maybeSingle();
                const version = (latest?.version ?? 0) + 1;
                // Clear any lingering approvals on older versions
                await supabase
                    .from("coe_outreach_messages")
                    .update({
                    status: "DRAFT",
                    approved_at: null,
                    approved_by: null,
                    approved_content_hash: null,
                    approval_revoked_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                })
                    .eq("opportunity_id", item.opportunityId)
                    .eq("status", "APPROVED");
                let status = generated.validation.status === "PASSED"
                    ? "READY_FOR_REVIEW"
                    : "DRAFT_INVALID";
                const { data: message, error: insertError } = await supabase
                    .from("coe_outreach_messages")
                    .insert({
                    brand_id: item.brandId,
                    opportunity_id: item.opportunityId,
                    contact_id: item.contact.id,
                    version,
                    strategy: generated.draft.strategy,
                    subject: generated.draft.subject,
                    body: generated.draft.body,
                    body_html: generated.bodyHtml,
                    status,
                    generator_model: generated.model,
                    prompt_version: generated.promptVersion,
                    copy_style: generated.copyStyle,
                    selected_finding_id: generated.draft.selected_finding_id,
                    selected_finding_title: generated.draft.selected_finding_title,
                    selected_strength_title: generated.draft.selected_strength_title ?? null,
                    personalization_used: generated.draft.personalization_used,
                    claims_used: generated.draft.claims_used,
                    claim_validation: generated.validation,
                    claim_validation_status: generated.validation.status,
                    source_claim_level: generated.validation.allowedClaimLevel,
                    anthropic_cost: generated.estimatedCost,
                    word_count: generated.wordCount,
                    idempotency_key: `draft_v2_${item.opportunityId}_${copyStyle}_v${version}`,
                })
                    .select("id, subject, body, status, copy_style, word_count")
                    .single();
                if (insertError)
                    throw new Error(insertError.message);
                // Copy-test / harvest-excluded → immediately block so UI never shows Approved/Ready to Send as sendable
                if (item.copyTestOnly) {
                    const synced = await syncOutreachMessagesForBrand(supabase, item.brandId, "copy test on harvest-excluded brand");
                    const thisSync = synced.find((s) => s.messageId === message.id);
                    if (thisSync?.nextStatus)
                        status = thisSync.nextStatus;
                }
                await supabase
                    .from("opportunities")
                    .update({
                    outreach_status: status,
                    updated_at: new Date().toISOString(),
                })
                    .eq("id", item.opportunityId);
                drafts.push({
                    domain: item.domain,
                    messageId: message.id,
                    status,
                    copyStyle: generated.copyStyle,
                    subject: message.subject,
                    body: message.body,
                    wordCount: generated.wordCount,
                    strategy: generated.draft.strategy,
                    selectedFinding: generated.draft.selected_finding_title,
                    selectedStrength: generated.draft.selected_strength_title ?? null,
                    validation: generated.validation.status,
                    validationErrors: generated.validation.errors,
                    priority: item.priority,
                    cost: generated.estimatedCost,
                    copyTestOnly: item.copyTestOnly,
                    promptVersion: generated.promptVersion,
                    model: generated.model,
                });
            }
        }
        await completeRun(supabase, run.id, "completed", {
            preSync,
            eligibilityReport,
            drafts,
            anthropicCost,
            dataForSeoCost: 0,
        });
        console.log("");
        console.log("MILESTONE 8.1 — OUTREACH V2 DRAFTS");
        console.log("==================================");
        console.log(`Anthropic: $${anthropicCost.toFixed(6)}`);
        console.log(`DataForSEO: $0`);
        console.log("");
        console.log("STATE SAFETY (pre-sync)");
        if (!preSync.length)
            console.log("  (geen wijzigingen)");
        for (const s of preSync) {
            console.log(`  ${s.domain}: ${s.from} → ${s.to} · ${JSON.stringify(s.reasons)}`);
        }
        console.log("");
        console.log("ELIGIBILITY");
        for (const e of eligibilityReport) {
            console.log(`  ${e.domain}: ${e.eligible ? "YES" : e.copyTestCandidate ? "COPY_TEST" : "NO"} · prio ${e.priority} · ${e.reason}`);
        }
        console.log("");
        console.log("DRAFTS");
        for (const d of drafts) {
            console.log(`--- ${d.domain} · ${d.copyStyle} ---`);
            if (d.skipped) {
                console.log(`  skipped: ${d.reason}`);
                continue;
            }
            console.log(`  status: ${d.status} · validation: ${d.validation} · words: ${d.wordCount}`);
            console.log(`  finding: ${d.selectedFinding}`);
            console.log(`  subject: ${d.subject}`);
            console.log("");
            console.log(String(d.body));
            console.log("");
        }
        console.log("STOP — geen echte prospectmails.");
        process.exit(0);
    }
    catch (err) {
        await completeRun(supabase, run.id, "failed", {
            error: err instanceof Error ? err.message : "unknown",
            anthropicCost,
        });
        logger.error("Outreach V2 draft generation failed", {
            error: err instanceof Error ? err.message : "unknown",
        });
        process.exit(1);
    }
}
main();
//# sourceMappingURL=generateOutreachDraftsV2.js.map