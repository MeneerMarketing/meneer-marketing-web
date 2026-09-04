/**
 * Milestone 8.2 — human-first outreach orchestration.
 */
import { pickPrimaryObservation, pickPrimaryStrength, } from "./allowedClaims.js";
import { assembleHumanFirstMail, deterministicPersonalisationFromClaims, } from "./mailAssembler.js";
import { generatePersonalisationSnippets } from "./personalisationGenerator.js";
import { OUTREACH_PROMPT_VERSION } from "../../config/outreach.js";
import { countWords } from "./contentHash.js";
import { validateOutreachDraft } from "./claimValidation.js";
export async function buildHumanFirstOutreach(input) {
    const observation = pickPrimaryObservation(input.allowedClaims);
    if (!observation) {
        throw new Error("No allowed OBSERVATION claim");
    }
    const strength = pickPrimaryStrength(input.allowedClaims);
    const notes = [];
    let mode = input.mode;
    let anthropicCost = 0;
    let model = null;
    let promptVersion = OUTREACH_PROMPT_VERSION;
    let budgetBlocked = false;
    let budgetBlockReason = null;
    let observationSentence = observation.external_sentence_nl;
    let strengthSentence = strength?.external_sentence_nl ?? null;
    let claimsUsed = deterministicPersonalisationFromClaims({
        observation,
        strength,
    }).claimsUsed;
    if (input.mode === "AI_PERSONALIZED") {
        const snippets = await generatePersonalisationSnippets({
            env: input.env,
            currentRunCost: input.currentRunCost,
            costCap: input.costCap,
            brandLabel: input.brandLabel,
            productName: input.productName,
            observation,
            strength,
        });
        if (snippets.budgetBlocked) {
            budgetBlocked = true;
            budgetBlockReason = snippets.reason;
            mode = "DETERMINISTIC";
            notes.push("BUDGET_BLOCKED — fell back to DETERMINISTIC personalisation");
        }
        else {
            observationSentence = snippets.observation;
            strengthSentence = snippets.strength;
            anthropicCost = snippets.estimatedCost;
            model = snippets.model;
            promptVersion = snippets.promptVersion;
            notes.push("AI personalisation snippets used");
        }
    }
    else {
        notes.push("Deterministic external_sentence_nl used (no Anthropic call)");
    }
    const openingOverride = input.usePaidFunnelOpening &&
        input.auditType === "EXACT_PAID_FUNNEL" &&
        input.keyword
        ? `Ik kwam jullie tegen toen ik op ${input.keyword} zocht en heb daarna de website even bekeken.`
        : null;
    const mail = assembleHumanFirstMail({
        brandLabel: input.brandLabel,
        contactFirstName: input.contactFirstName,
        verifiedObservation: observationSentence,
        verifiedStrength: strengthSentence,
        recommendedProjectType: input.recommendedProjectType,
        includeExperienceLine: input.includeExperienceLine === true,
        subjectKey: input.subjectKey ?? "EVEN_IETS",
        openingOverride,
    });
    mail.claimsUsed = claimsUsed;
    const draft = {
        subject: mail.subject,
        body: mail.bodyText,
        selected_finding_id: observation.id,
        selected_finding_title: observation.source_title,
        selected_strength_title: strength?.source_title ?? null,
        strategy: input.recommendedProjectType ?? "HUMAN_FIRST",
        copy_style: "SOFT_OBSERVATION",
        personalization_used: {
            first_name: Boolean(input.contactFirstName),
            brand: true,
            product: Boolean(input.productName),
            category: false,
            platform: false,
        },
        claims_used: claimsUsed,
    };
    const validation = validateOutreachDraft({
        draft,
        auditType: input.auditType,
        contactFirstName: input.contactFirstName,
        productName: input.productName,
        brandDomain: input.brandDomain,
        findingTitles: input.allowedClaims
            .filter((c) => c.type === "OBSERVATION")
            .map((c) => c.source_title),
        strengthTitles: input.allowedClaims
            .filter((c) => c.type === "STRENGTH")
            .map((c) => c.source_title),
        confirmedGoogleAdvertiser: input.confirmedGoogleAdvertiser,
        allowedClaims: input.allowedClaims,
        observationScope: observation.scope,
        availabilityProven: input.allowedClaims.some((c) => c.type === "OBSERVATION" &&
            /stock|voorraad|availability|fulfillment/i.test(c.subject)),
    });
    // Soft length guidance for human-first: prefer ≤140
    if (mail.wordCount > 140 && validation.status === "PASSED") {
        validation.errors.push(`body_too_long_human_first:${mail.wordCount}`);
        validation.status = "FAILED";
    }
    return {
        mode,
        mail: { ...mail, wordCount: countWords(mail.bodyText) },
        observationClaim: observation,
        strengthClaim: strength,
        claimsUsed,
        anthropicCost,
        model,
        promptVersion,
        validation,
        budgetBlocked,
        budgetBlockReason,
        notes,
    };
}
//# sourceMappingURL=humanFirstOutreach.js.map