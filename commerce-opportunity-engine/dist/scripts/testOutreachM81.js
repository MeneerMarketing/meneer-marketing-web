/**
 * Milestone 8.1 safety suite — no real prospect mail.
 */
import { config } from "dotenv";
import { resolve, dirname } from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { loadEnv } from "../config/env.js";
import { createSupabaseServerClient } from "../services/supabase/client.js";
import { evaluateOutreachEligibility } from "../services/outreach/outreachEligibility.js";
import { createEmailProvider, evaluateSendSafety, getOutreachDeliverabilityChecklist, } from "../services/outreach/emailProvider.js";
import { validateOutreachDraft } from "../services/outreach/claimValidation.js";
import { syncOutreachMessagesForBrand } from "../services/outreach/outreachStateSync.js";
import { outreachContentHash } from "../services/outreach/contentHash.js";
const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, "../../");
config({ path: resolve(projectRoot, ".env"), quiet: true });
function assert(cond, msg) {
    if (!cond)
        throw new Error(msg);
}
async function main() {
    const env = loadEnv();
    const supabase = createSupabaseServerClient(env);
    console.log("M8.1 SAFETY TESTS");
    console.log("=================");
    // --- Unit: eligibility ---
    const baseEligible = {
        manualExcluded: false,
        doNotContact: false,
        eligibilityStatus: "LEAD_ELIGIBLE",
        leadEligible: true,
        businessType: "SPECIALIST_WEBSHOP",
        croAuditStatus: "COMPLETED",
        auditValid: true,
        auditConfidence: 92,
        supportedFindingsCount: 3,
        mmFit: 75,
        opportunityScore: 72,
        recommendedProjectType: "SHOPIFY_CRO_REDESIGN",
        websiteReachable: true,
        suppressed: false,
        firstTouchSent: false,
    };
    assert(evaluateOutreachEligibility(baseEligible).eligible, "eligible base");
    assert(!evaluateOutreachEligibility({ ...baseEligible, doNotContact: true })
        .eligible, "DNC blocks");
    assert(!evaluateOutreachEligibility({ ...baseEligible, manualExcluded: true })
        .eligible, "manual exclude blocks");
    assert(!evaluateOutreachEligibility({
        ...baseEligible,
        eligibilityStatus: "EXCLUDED",
        leadEligible: false,
    }).eligible, "eligibility EXCLUDED blocks");
    console.log("✓ eligibility gates");
    // --- Unit: claim validator V2 ---
    const draft = {
        subject: "Even iets over Huisdierspullen",
        body: `Hallo,

Ik kwam Huisdierspullen tegen toen ik naar webshops binnen de huisdierenmarkt keek en heb jullie shop even bekeken.

De webshop oogt verder netjes. Op mobiel viel me bijvoorbeeld op dat de prijs bij dit product niet direct duidelijk in beeld staat.

Ik help vanuit Meneer Marketing webshops met Shopify, webdesign en online vindbaarheid. Ik werk inmiddels zo'n 12 jaar aan websites en online vindbaarheid.

Als je wilt, stuur ik mijn ideeën graag even door.

Groet,

Meneer Marketing
meneermarketing.nl
KVK 42095913`,
        selected_finding_id: "finding_0_missing-price",
        selected_finding_title: "Missing price visibility above the fold",
        selected_strength_title: "Clear service information",
        strategy: "SHOPIFY_CRO_REDESIGN",
        copy_style: "SOFT_OBSERVATION",
        personalization_used: {
            first_name: false,
            brand: true,
            product: true,
            category: true,
            platform: false,
        },
        claims_used: ["reviewed shop", "one observation"],
    };
    const ok = validateOutreachDraft({
        draft,
        auditType: "HIGH_CONFIDENCE_PRODUCT_TARGET",
        contactFirstName: null,
        productName: "Trixie",
        brandDomain: "huisdierspullen.nl",
        findingTitles: ["Missing price visibility above the fold"],
        strengthTitles: ["Clear service information"],
        confirmedGoogleAdvertiser: true,
    });
    assert(ok.status === "PASSED", `good draft failed: ${ok.errors.join(",")}`);
    const jargon = validateOutreachDraft({
        draft: {
            ...draft,
            body: draft.body + "\nJullie CRO score en conversion architecture zijn zwak.",
        },
        auditType: "HIGH_CONFIDENCE_PRODUCT_TARGET",
        contactFirstName: null,
        productName: "Trixie",
        brandDomain: "huisdierspullen.nl",
        findingTitles: ["Missing price visibility above the fold"],
        strengthTitles: ["Clear service information"],
        confirmedGoogleAdvertiser: true,
    });
    assert(jargon.status === "FAILED", "jargon must fail");
    const ads = validateOutreachDraft({
        draft: {
            ...draft,
            body: draft.body + "\nJullie Ads gaan naar deze productpagina.",
        },
        auditType: "HIGH_CONFIDENCE_PRODUCT_TARGET",
        contactFirstName: null,
        productName: "Trixie",
        brandDomain: "huisdierspullen.nl",
        findingTitles: ["Missing price visibility above the fold"],
        strengthTitles: ["Clear service information"],
        confirmedGoogleAdvertiser: true,
    });
    assert(ads.status === "FAILED", "unproven ads claim must fail");
    console.log("✓ claim validator V2");
    // --- Unit: send gate ---
    const realBlocked = evaluateSendSafety({
        status: "APPROVED",
        doNotContact: false,
        manualExcluded: false,
        eligibilityStatus: "LEAD_ELIGIBLE",
        leadEligible: true,
        contactEmail: "info@example.nl",
        contactUsable: true,
        claimValidationPassed: true,
        outreachEligible: true,
        realSendEnabled: false,
        suppressed: false,
        firstTouchAlreadySent: false,
        isTestSend: false,
        testEmail: env.OUTREACH_TEST_EMAIL ?? null,
    });
    assert(!realBlocked.allowed, "real send must lock");
    assert(realBlocked.blockers.includes("OUTREACH_REAL_SEND_ENABLED=false"), "must cite lock");
    const excludedSend = evaluateSendSafety({
        status: "APPROVED",
        doNotContact: false,
        manualExcluded: false,
        eligibilityStatus: "EXCLUDED",
        leadEligible: false,
        contactEmail: "info@example.nl",
        contactUsable: true,
        claimValidationPassed: true,
        outreachEligible: true,
        realSendEnabled: true,
        suppressed: false,
        firstTouchAlreadySent: false,
        isTestSend: false,
        testEmail: env.OUTREACH_TEST_EMAIL ?? null,
    });
    assert(!excludedSend.allowed, "excluded brand must hard-block send");
    console.log("✓ send gate live checks");
    // --- Provider without credentials ---
    const provider = createEmailProvider({
        RESEND_API_KEY: undefined,
        OUTREACH_FROM_EMAIL: undefined,
    });
    assert(provider.status === "NOT_CONFIGURED", "noop status");
    const sendResult = await provider.send({
        to: "nobody@example.com",
        subject: "x",
        bodyText: "y",
    });
    assert(!sendResult.ok, "missing key must not pretend success");
    console.log("✓ Resend NOT_CONFIGURED without credentials");
    // --- Content hash ---
    const h1 = outreachContentHash("A", "Body");
    const h2 = outreachContentHash("A", "Body changed");
    assert(h1 !== h2, "hash must change on edit");
    assert(h1 ===
        createHash("sha256")
            .update("A\n---\nBody", "utf8")
            .digest("hex"), "hash stable");
    console.log("✓ approval content hash");
    // --- DB: huisdierspullen state sync ---
    const { data: brand } = await supabase
        .from("brands")
        .select("id, normalized_domain, eligibility_status, manual_excluded")
        .eq("normalized_domain", "huisdierspullen.nl")
        .maybeSingle();
    assert(brand?.id, "huisdierspullen brand missing");
    const synced = await syncOutreachMessagesForBrand(supabase, String(brand.id));
    const changed = synced.filter((s) => s.nextStatus);
    console.log(`✓ huisdierspullen sync: ${changed.length} message(s) updated`, changed.map((c) => `${c.previousStatus}→${c.nextStatus}`).join(", ") ||
        "(already safe)");
    const { data: msgs } = await supabase
        .from("coe_outreach_messages")
        .select("id, status, blocked_reason, subject, approved_at")
        .eq("brand_id", brand.id)
        .order("version", { ascending: true });
    for (const m of msgs ?? []) {
        assert(!["APPROVED"].includes(String(m.status)), `message ${m.id} still APPROVED after sync`);
        console.log(`  · ${m.id.slice(0, 8)}… ${m.status} · ${m.blocked_reason ?? "—"}`);
    }
    // --- Suppression simulation ---
    const { data: contact } = await supabase
        .from("coe_brand_contacts")
        .select("email")
        .eq("brand_id", brand.id)
        .eq("is_usable_for_outreach", true)
        .limit(1)
        .maybeSingle();
    if (contact?.email) {
        const emailNorm = String(contact.email).trim().toLowerCase();
        const { data: inserted } = await supabase
            .from("coe_outreach_suppression")
            .insert({
            email_normalized: emailNorm,
            reason: "m81_test_suppression",
            source: "m81_test",
        })
            .select("id")
            .single();
        const afterSupp = await syncOutreachMessagesForBrand(supabase, String(brand.id), "suppression");
        console.log(`✓ suppression sync touched ${afterSupp.filter((s) => s.nextStatus).length} (or already blocked)`);
        if (inserted?.id) {
            await supabase
                .from("coe_outreach_suppression")
                .delete()
                .eq("id", inserted.id);
        }
        console.log("✓ test suppression row removed");
    }
    // Deliverability checklist
    const checklist = getOutreachDeliverabilityChecklist({
        RESEND_API_KEY: env.RESEND_API_KEY,
        OUTREACH_FROM_EMAIL: env.OUTREACH_FROM_EMAIL,
        RESEND_FROM_EMAIL: env.RESEND_FROM_EMAIL,
        OUTREACH_TEST_EMAIL: env.OUTREACH_TEST_EMAIL,
        OUTREACH_REAL_SEND_ENABLED: env.OUTREACH_REAL_SEND_ENABLED,
        RESEND_DOMAIN_VERIFIED: env.RESEND_DOMAIN_VERIFIED,
        RESEND_SPF_STATUS: env.RESEND_SPF_STATUS,
        RESEND_DKIM_STATUS: env.RESEND_DKIM_STATUS,
    });
    console.log("✓ deliverability checklist");
    for (const c of checklist) {
        console.log(`  · ${c.label}: ${c.status}`);
    }
    console.log("");
    console.log("ALL M8.1 SAFETY CHECKS PASSED");
    console.log("STOP — geen echte prospectmails.");
}
main().catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=testOutreachM81.js.map