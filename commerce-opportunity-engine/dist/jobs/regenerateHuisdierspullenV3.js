/**
 * Milestone 8.1.1 — regenerate Huisdierspullen SOFT + DIRECT with claim fidelity V3.
 * Max 2 Anthropic calls. Cap $0.02. No Resend. No prospect mail.
 */
import { config } from "dotenv";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "../config/env.js";
import { OUTREACH_COPY_STYLES } from "../config/outreach.js";
import { attachValidationStatus, buildAllowedClaims, } from "../services/outreach/allowedClaims.js";
import { generateOutreachDraft } from "../services/outreach/outreachDraftGenerator.js";
import { findingIdFromTitle } from "../services/outreach/outreachRepository.js";
import { syncOutreachMessagesForBrand } from "../services/outreach/outreachStateSync.js";
import { createSupabaseServerClient } from "../services/supabase/client.js";
import { createRun, completeRun } from "../services/supabase/runsRepository.js";
import { one } from "../utils/one.js";
import { logger } from "../utils/logger.js";
const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, "../../");
config({ path: resolve(projectRoot, ".env"), quiet: true });
async function main() {
    const env = loadEnv();
    const supabase = createSupabaseServerClient(env);
    const costCap = env.M811_MAX_ANTHROPIC_COST;
    const { data: brand, error: brandErr } = await supabase
        .from("brands")
        .select("id, name, normalized_domain, platform, platform_candidate, confirmed_google_advertiser, preferred_contact_id")
        .eq("normalized_domain", "huisdierspullen.nl")
        .single();
    if (brandErr || !brand)
        throw new Error(brandErr?.message ?? "brand missing");
    const { data: opp, error: oppErr } = await supabase
        .from("opportunities")
        .select(`id, audit_type, recommended_project_type, landing_url, resolved_url,
       keywords!opportunities_keyword_id_fkey ( keyword, category ),
       pages ( product_name, product_brand, url )`)
        .eq("id", "17b015ba-f3e6-4b61-922b-0b713eadc084")
        .single();
    if (oppErr || !opp)
        throw new Error(oppErr?.message ?? "opportunity missing");
    const { data: audit, error: auditErr } = await supabase
        .from("audits")
        .select("id, conversion_leaks, strengths, finding_validations, sales_angle, audit_valid")
        .eq("opportunity_id", opp.id)
        .eq("status", "COMPLETED")
        .eq("audit_valid", true)
        .order("audited_at", { ascending: false })
        .limit(1)
        .maybeSingle();
    if (auditErr || !audit)
        throw new Error(auditErr?.message ?? "audit missing");
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
    if (!contact?.email)
        throw new Error("No usable contact for Huisdierspullen");
    const page = one(opp.pages);
    const keyword = one(opp.keywords);
    const leaks = Array.isArray(audit.conversion_leaks)
        ? audit.conversion_leaks
        : [];
    const strengthsRaw = Array.isArray(audit.strengths)
        ? audit.strengths
        : [];
    const findings = attachValidationStatus(leaks
        .filter((l) => l.title)
        .map((l, idx) => ({
        id: findingIdFromTitle(String(l.title), idx),
        title: String(l.title),
        severity: String(l.severity ?? "MEDIUM"),
        evidence: String(l.evidence ?? "").slice(0, 500),
    })), audit.finding_validations);
    const pageUrl = page?.url ??
        opp.resolved_url ??
        opp.landing_url;
    const productName = page?.product_name ??
        "Trixie Premium Touring hondentuig";
    // Include QUESTIONABLE page observations (price) — still PAGE_SPECIFIC only.
    // Rejected findings stay out.
    const allowedClaims = buildAllowedClaims({
        pageUrl,
        productName,
        brandName: brand.name,
        findings: findings.filter((f) => f.validationStatus !== "REJECTED"),
        strengths: strengthsRaw
            .filter((s) => s.title)
            .map((s) => ({
            title: String(s.title),
            evidence: String(s.evidence ?? "").slice(0, 400),
        })),
        supportedOnly: false,
    }).map((c) => {
        // Single audited PDP → force PAGE_SPECIFIC unless evidence explicitly multi-page
        if (c.scope !== "MULTI_PAGE" && c.scope !== "SITE_WIDE") {
            return { ...c, scope: "PAGE_SPECIFIC" };
        }
        return c;
    });
    // Prefer price observation for this calibration (same finding as previous drafts)
    const priceClaim = allowedClaims.find((c) => c.type === "OBSERVATION" && /price|prijs/i.test(c.subject));
    const orderedClaims = priceClaim
        ? [
            priceClaim,
            ...allowedClaims.filter((c) => c.id !== priceClaim.id),
        ]
        : allowedClaims;
    const run = await createRun(supabase, "outreach_claim_fidelity_v3", {
        milestone: "8.1.1",
        domain: "huisdierspullen.nl",
        costCap,
    });
    let anthropicCost = 0;
    const drafts = [];
    try {
        for (const copyStyle of OUTREACH_COPY_STYLES) {
            if (anthropicCost >= costCap) {
                logger.warn("M8.1.1 cost cap reached", { anthropicCost, costCap });
                break;
            }
            // Leave headroom: skip next generation if remaining budget is tiny
            if (anthropicCost > 0 && costCap - anthropicCost < 0.008) {
                logger.warn("M8.1.1 insufficient remaining Anthropic budget for next draft", {
                    anthropicCost,
                    costCap,
                });
                break;
            }
            const generated = await generateOutreachDraft({
                env,
                data: {
                    brandDomain: brand.normalized_domain,
                    brandName: brand.name,
                    contactFirstName: contact.first_name ?? null,
                    contactEmail: String(contact.email),
                    productName,
                    category: "huisdierenbranche",
                    platform: brand.platform ??
                        brand.platform_candidate,
                    auditType: opp.audit_type ?? null,
                    keyword: keyword?.keyword ?? null,
                    pageUrl,
                    confirmedGoogleAdvertiser: Boolean(brand.confirmed_google_advertiser),
                    recommendedProjectType: String(opp.recommended_project_type),
                    salesAngle: audit.sales_angle ?? null,
                    copyStyle,
                    allowedClaims: orderedClaims,
                },
            });
            anthropicCost += generated.estimatedCost;
            const { data: latest } = await supabase
                .from("coe_outreach_messages")
                .select("version")
                .eq("opportunity_id", opp.id)
                .order("version", { ascending: false })
                .limit(1)
                .maybeSingle();
            const version = (latest?.version ?? 0) + 1;
            let status = generated.validation.status === "PASSED"
                ? "READY_FOR_REVIEW"
                : "DRAFT_INVALID";
            const { data: message, error: insertError } = await supabase
                .from("coe_outreach_messages")
                .insert({
                brand_id: brand.id,
                opportunity_id: opp.id,
                contact_id: contact.id,
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
                claim_validation: {
                    ...generated.validation,
                    allowed_claims: orderedClaims,
                },
                claim_validation_status: generated.validation.status,
                source_claim_level: generated.validation.allowedClaimLevel,
                anthropic_cost: generated.estimatedCost,
                word_count: generated.wordCount,
                idempotency_key: `draft_v3_${opp.id}_${copyStyle}_v${version}`,
            })
                .select("id, subject, body, status, copy_style, word_count")
                .single();
            if (insertError)
                throw new Error(insertError.message);
            // Brand remains harvest-excluded → sync to BLOCKED (not sendable)
            const synced = await syncOutreachMessagesForBrand(supabase, String(brand.id), "m8.1.1 copy fidelity test on harvest-excluded brand");
            const thisSync = synced.find((s) => s.messageId === message.id);
            if (thisSync?.nextStatus)
                status = thisSync.nextStatus;
            drafts.push({
                messageId: message.id,
                status,
                copyStyle: generated.copyStyle,
                subject: message.subject,
                body: message.body,
                wordCount: generated.wordCount,
                validation: generated.validation.status,
                validationErrors: generated.validation.errors,
                sentenceEvidence: generated.validation.sentenceEvidence,
                observation: generated.observation,
                strength: generated.strength,
                cost: generated.estimatedCost,
                promptVersion: generated.promptVersion,
            });
        }
        await completeRun(supabase, run.id, "completed", {
            drafts,
            anthropicCost,
            dataForSeoCost: 0,
            allowedClaims: orderedClaims,
        });
        console.log("");
        console.log("MILESTONE 8.1.1 — CLAIM FIDELITY V3");
        console.log("===================================");
        console.log(`Anthropic: $${anthropicCost.toFixed(6)}`);
        console.log(`DataForSEO: $0`);
        console.log("");
        console.log("ALLOWED CLAIMS");
        for (const c of orderedClaims.filter((x) => x.type === "OBSERVATION" || x.type === "STRENGTH").slice(0, 6)) {
            console.log(`  [${c.type}] ${c.scope} · ${c.source_title} · ${c.validation_status}`);
            console.log(`    fact: ${c.allowed_fact}`);
        }
        console.log("");
        for (const d of drafts) {
            console.log(`--- ${d.copyStyle} · ${d.status} · ${d.validation} · ${d.wordCount}w ---`);
            console.log(`subject: ${d.subject}`);
            console.log("");
            console.log(String(d.body));
            console.log("");
            console.log("SENTENCE → EVIDENCE (internal)");
            for (const row of d.sentenceEvidence ?? []) {
                console.log(`  [${row.allowed ? "OK" : "??"}] ${String(row.sentence).slice(0, 100)}`);
                console.log(`       ← ${row.notes}${Array.isArray(row.evidence_ids) && row.evidence_ids.length
                    ? ` · ids=${row.evidence_ids.join(",")}`
                    : ""}`);
            }
            if (Array.isArray(d.validationErrors) &&
                d.validationErrors.length) {
                console.log("ERRORS:", d.validationErrors.join("; "));
            }
            console.log("");
        }
        console.log("STOP — geen Resend, geen prospectmail.");
        process.exit(0);
    }
    catch (err) {
        await completeRun(supabase, run.id, "failed", {
            error: err instanceof Error ? err.message : "unknown",
            anthropicCost,
        });
        logger.error("M8.1.1 regenerate failed", {
            error: err instanceof Error ? err.message : "unknown",
        });
        process.exit(1);
    }
}
main();
//# sourceMappingURL=regenerateHuisdierspullenV3.js.map