import { z } from "zod";
import { countWords } from "./contentHash.js";
export const COPY_STYLES = ["SOFT_OBSERVATION", "DIRECT_IDEA"];
export const OutreachDraftAiSchema = z.object({
    subject: z.string().min(8).max(90),
    body: z.string().min(60).max(1400),
    selected_finding_id: z.string().min(1).max(120),
    selected_finding_title: z.string().min(3).max(200),
    selected_strength_title: z.string().max(200).nullable().optional(),
    strategy: z.string().min(3).max(80),
    copy_style: z.enum(COPY_STYLES).optional(),
    personalization_used: z.object({
        first_name: z.boolean(),
        brand: z.boolean(),
        product: z.boolean(),
        category: z.boolean(),
        platform: z.boolean(),
    }),
    claims_used: z.array(z.string().max(200)).max(8),
});
const FORBIDDEN_PHRASES = [
    /unlock your potential/i,
    /scale your business/i,
    /unlock growth/i,
    /i noticed your website could be improved/i,
    /cro[- ]?score/i,
    /\bcro\b/i,
    /mm fit/i,
    /opportunity score/i,
    /conversion architecture/i,
    /funnel optimization/i,
    /rebuild potential/i,
    /\baudit\b/i,
    /\bopportunity\b/i,
    /boek hier 30 minuten/i,
    /plan een call/i,
    /schedule a call/i,
    /book a call/i,
    /jullie verliezen omzet/i,
    /jullie verliezen conversie/i,
    /gegarandeerde?\s+(omzet|conversie|groei)/i,
    /garanti(e|eren).{0,40}(omzet|conversie)/i,
    /above[- ]the[- ]fold/i,
    /pricing hierarchy/i,
    /conversion leak/i,
];
const UNPROVEN_ADS_CLAIMS = [
    /google ads naar (deze|jullie) productpagina/i,
    /sturen google ads naar/i,
    /advertentie landt op/i,
    /via jullie google advertentie op deze pagina/i,
    /jullie ads gaan naar/i,
    /jullie advertenties gaan naar/i,
    /advertenties sturen/i,
];
/** Scope expansion — forbidden when observation scope is PAGE_SPECIFIC. */
const PAGE_SCOPE_EXPANSION = [
    { re: /meerdere producten/i, code: "scope_multi_products" },
    { re: /productpagina'?s/i, code: "scope_product_pages_plural" },
    { re: /\boveral\b/i, code: "scope_everywhere" },
    { re: /de hele (site|webshop|shop)/i, code: "scope_site_wide" },
    { re: /door de hele/i, code: "scope_site_wide" },
    { re: /\baltijd\b/i, code: "scope_always" },
    {
        re: /ook (niet )?als je (verder |naar beneden )?scrollt/i,
        code: "scope_scroll_unproven",
    },
    {
        re: /niet (direct )?zichtbaar.{0,40}scroll/i,
        code: "scope_scroll_unproven",
    },
];
/** Unsupported business outcomes / invented context. */
const UNSUPPORTED_OUTCOMES = [
    { re: /klanten haken/i, code: "outcome_customers_drop" },
    { re: /bezoekers haken/i, code: "outcome_visitors_drop" },
    { re: /bezoekers verlaten/i, code: "outcome_bounce" },
    { re: /verliezen omzet/i, code: "outcome_revenue_loss" },
    { re: /verliezen conversie/i, code: "outcome_conversion_loss" },
    { re: /\bomzet\b/i, code: "outcome_revenue_mention" },
    { re: /\bconversies?\b/i, code: "outcome_conversion_mention" },
    {
        re: /ook al is (het product|dit) tijdelijk niet leverbaar/i,
        code: "invented_availability_causality",
    },
    {
        re: /doordat.{0,40}(niet leverbaar|niet op voorraad)/i,
        code: "invented_availability_causality",
    },
];
const FAKE_RE = /^(re|fwd|fw)\s*:/i;
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;
const SALES_CLICHES = [
    /laat deze kans niet liggen/i,
    /beperkt aanbod/i,
    /actie eindigt/i,
    /nu of nooit/i,
];
function splitSentences(body) {
    return body
        .replace(/\r\n/g, "\n")
        .split(/\n+/)
        .flatMap((line) => line
        .split(/(?<=[.!?])\s+/)
        .map((s) => s.trim())
        .filter(Boolean))
        .filter((s) => s.length > 2);
}
function isStructuralSentence(sentence) {
    if (/^(hallo|hoi|groet|beste)\b/i.test(sentence))
        return true;
    if (/^meneer marketing$/i.test(sentence))
        return true;
    if (/meneermarketing\.nl/i.test(sentence))
        return true;
    if (/^kvk\b/i.test(sentence))
        return true;
    if (/ik help vanuit meneer marketing/i.test(sentence))
        return true;
    if (/ik help (webshops|bedrijven)/i.test(sentence))
        return true;
    if (/ik werk inmiddels/i.test(sentence))
        return true;
    if (/als je wilt/i.test(sentence))
        return true;
    if (/als het interessant klinkt/i.test(sentence))
        return true;
    if (/ben benieuwd hoe jullie/i.test(sentence))
        return true;
    if (/ik heb daar een idee voor/i.test(sentence))
        return true;
    if (/ik kwam .+ tegen/i.test(sentence))
        return true;
    if (/heb (jullie|de) (shop|website|webshop) even bekeken/i.test(sentence))
        return true;
    return false;
}
function matchClaimEvidence(sentence, claims) {
    const lower = sentence.toLowerCase();
    const ids = [];
    const notes = [];
    for (const claim of claims) {
        const subjectBits = claim.subject.toLowerCase().split(/\s+/).slice(0, 4);
        const factBits = claim.allowed_fact.toLowerCase();
        const hitSubject = subjectBits.some((b) => b.length > 4 && lower.includes(b));
        const hitTheme = (/prijs|price/.test(lower) && /prijs|price/.test(factBits)) ||
            (/variant|kleur|color/.test(lower) &&
                /variant|kleur|color/.test(factBits)) ||
            (/review|social|beoordeling/.test(lower) &&
                /review|social/.test(factBits)) ||
            (/trust|garantie|verzending|service/.test(lower) &&
                /trust|garantie|verzending|service/.test(factBits));
        if (hitSubject || hitTheme) {
            ids.push(claim.id);
            notes.push(`${claim.type}:${claim.scope}:${claim.allowed_fact.slice(0, 80)}`);
        }
    }
    return { ids, notes: notes.join(" | ") || "no_claim_match" };
}
export function validateOutreachDraft(input) {
    const errors = [];
    const auditType = input.auditType ?? "GENERIC";
    const allowedClaimLevel = auditType === "EXACT_PAID_FUNNEL"
        ? "EXACT_PAID_FUNNEL"
        : auditType === "HIGH_CONFIDENCE_PRODUCT_TARGET"
            ? "HIGH_CONFIDENCE_PRODUCT_TARGET"
            : "GENERIC";
    const body = input.draft.body;
    const subject = input.draft.subject;
    const wordCount = countWords(body);
    const claims = input.allowedClaims ?? [];
    const observationScope = input.observationScope ??
        claims.find((c) => c.type === "OBSERVATION")?.scope ??
        "PAGE_SPECIFIC";
    // V3/V8.2 length: preferred 65-110, hard max 140
    if (wordCount > 140)
        errors.push(`body_too_long:${wordCount}_words_max_140`);
    if (wordCount < 50)
        errors.push(`body_too_short:${wordCount}_words`);
    if (FAKE_RE.test(subject.trim()))
        errors.push("fake_re_fwd_subject");
    if (EMOJI.test(subject) || EMOJI.test(body))
        errors.push("emoji_not_allowed");
    if (subject === subject.toUpperCase() && subject.length > 8) {
        errors.push("subject_all_caps");
    }
    for (const phrase of FORBIDDEN_PHRASES) {
        if (phrase.test(body) || phrase.test(subject)) {
            errors.push(`forbidden_phrase:${phrase.source}`);
        }
    }
    for (const c of SALES_CLICHES) {
        if (c.test(body))
            errors.push(`sales_cliche:${c.source}`);
    }
    if (/\b(mm\s*fit|opportunity\s*score|cro\s*score)\b/i.test(body + subject)) {
        errors.push("internal_score_in_mail");
    }
    if (/\b\d{2,3}\s*\/\s*100\b/.test(body)) {
        errors.push("score_fraction_in_mail");
    }
    if (allowedClaimLevel !== "EXACT_PAID_FUNNEL") {
        for (const claim of UNPROVEN_ADS_CLAIMS) {
            if (claim.test(body)) {
                errors.push(`unproven_ads_claim:${claim.source}`);
            }
        }
    }
    if (/jullie actief zichtbaar zijn via google/i.test(body) &&
        !input.confirmedGoogleAdvertiser) {
        errors.push("google_visibility_claim_without_confirmation");
    }
    // Scope expansion for PAGE_SPECIFIC
    if (observationScope === "PAGE_SPECIFIC") {
        for (const rule of PAGE_SCOPE_EXPANSION) {
            if (rule.re.test(body) || rule.re.test(subject)) {
                errors.push(rule.code);
            }
        }
    }
    for (const rule of UNSUPPORTED_OUTCOMES) {
        if (rule.re.test(body)) {
            // availability causality only if not proven
            if (rule.code === "invented_availability_causality" &&
                input.availabilityProven) {
                continue;
            }
            // bare "omzet/conversies" always bad without evidence
            errors.push(rule.code);
        }
    }
    // Quantifiers without MULTI_PAGE / SITE_WIDE evidence
    if (observationScope === "PAGE_SPECIFIC" &&
        /\b(vaak|regelmatig|steeds|overal|meerdere)\b/i.test(body)) {
        if (/meerdere|overal|steeds/i.test(body)) {
            errors.push("unsupported_quantifier");
        }
    }
    if (input.draft.personalization_used.first_name &&
        input.contactFirstName &&
        !new RegExp(escapeReg(input.contactFirstName), "i").test(body)) {
        errors.push("first_name_claimed_but_missing_in_body");
    }
    if (input.draft.personalization_used.first_name && !input.contactFirstName) {
        errors.push("invented_first_name_personalization");
    }
    const halloMatch = body.match(/(?:Hallo|Hoi)\s+([A-ZÁÉÍÓÚ][a-záéíóú-]{2,})/i);
    if (halloMatch?.[1] && !input.contactFirstName) {
        errors.push(`invented_name:${halloMatch[1]}`);
    }
    if (input.findingTitles.length &&
        !input.findingTitles.some((t) => t === input.draft.selected_finding_title ||
            t.toLowerCase() === input.draft.selected_finding_title.toLowerCase())) {
        errors.push("selected_finding_not_in_supported_list");
    }
    if (input.draft.selected_strength_title &&
        input.strengthTitles.length > 0 &&
        !input.strengthTitles.some((t) => t.toLowerCase() ===
            input.draft.selected_strength_title.toLowerCase())) {
        errors.push("selected_strength_not_in_list");
    }
    if (input.draft.selected_strength_title &&
        input.strengthTitles.length === 0) {
        errors.push("unfounded_compliment_no_strengths");
    }
    // Strength scope: block "overal" compliments
    if (/jullie (kleuren)?selectie werkt (overal |overal erg )?/i.test(body) ||
        /werkt overal erg prettig/i.test(body)) {
        errors.push("strength_scope_expanded");
    }
    if (/\b\d{2,3}%\b/.test(body)) {
        const findingBlob = input.findingTitles.join(" ");
        const percents = body.match(/\b\d{2,3}%\b/g) ?? [];
        for (const p of percents) {
            if (!findingBlob.includes(p)) {
                errors.push(`possible_invented_stat:${p}`);
            }
        }
    }
    if (/moet (je|u) (nu|snel)/i.test(body) || /beperkt aanbod/i.test(body)) {
        errors.push("pressure_cta");
    }
    // Max one negative observation + one positive (heuristic)
    const negativeHits = (body.match(/viel me op|opgevallen|niet (direct )?duidelijk|niet (direct )?zichtbaar|mist|ontbreekt/gi) ?? []).length;
    if (negativeHits > 2) {
        errors.push(`too_many_negative_observations:${negativeHits}`);
    }
    // Sentence-to-evidence map (internal)
    const sentences = splitSentences(body);
    const sentenceEvidence = sentences.map((sentence) => {
        if (isStructuralSentence(sentence)) {
            return {
                sentence,
                allowed: true,
                evidence_ids: [],
                notes: "structural_or_positioning",
            };
        }
        const matched = matchClaimEvidence(sentence, claims);
        const allowed = matched.ids.length > 0;
        if (!allowed && /prijs|product|pagina|variant|kleur|review|zichtbaar/i.test(sentence)) {
            errors.push(`ungrounded_sentence:${sentence.slice(0, 60)}`);
        }
        return {
            sentence,
            allowed,
            evidence_ids: matched.ids,
            notes: matched.notes,
        };
    });
    // Deduplicate errors
    const uniqueErrors = [...new Set(errors)];
    return {
        status: uniqueErrors.length ? "FAILED" : "PASSED",
        errors: uniqueErrors,
        allowedClaimLevel,
        wordCount,
        sentenceEvidence,
    };
}
function escapeReg(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
//# sourceMappingURL=claimValidation.js.map