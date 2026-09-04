/**
 * Milestone 8.2 — deterministic human-first mail assembler.
 * Assembler owns structure. AI only supplies optional personalisation snippets.
 */
import { countWords } from "./contentHash.js";
import { MM_COMPANY, renderOutreachHtml } from "./emailRender.js";
export const SUBJECT_POOL = {
    EVEN_IETS: (brand) => `Even iets over ${brand}`,
    EEN_IDEE: (brand) => `Een idee voor ${brand}`,
    IETS_OPGEVALLEN: (brand) => `Iets opgevallen bij ${brand}`,
};
function brandLabelFromName(name) {
    return name.replace(/\.(nl|com|be|eu)$/i, "").trim() || name;
}
export function normalizeBrandLabel(brandName, domain) {
    if (brandName?.trim())
        return brandLabelFromName(brandName.trim());
    return brandLabelFromName(domain);
}
function positioningLine(projectType) {
    const t = (projectType ?? "").toUpperCase();
    if (t.includes("WOO") ||
        t.includes("MIGRATION") ||
        t === "SHOPIFY_MIGRATION") {
        return "Ik help vanuit Meneer Marketing webshops met webdesign en Shopify en werk ook aan overstappen van WooCommerce naar Shopify.";
    }
    return "Ik help vanuit Meneer Marketing webshops met webdesign en Shopify en zag hier een paar dingen die ik zelf anders zou aanpakken.";
}
function signatureBlock(kvk) {
    return `Groet,\n\nMeneer Marketing\nmeneermarketing.nl\nKVK ${kvk}`;
}
/**
 * Deterministic first-touch assembly. ~80-90% fixed human copy.
 */
export function assembleHumanFirstMail(input) {
    const brand = input.brandLabel.trim();
    const kvk = input.kvkNumber ?? MM_COMPANY.kvkNumber;
    const subjectFn = SUBJECT_POOL[input.subjectKey ?? "EVEN_IETS"];
    const subject = subjectFn(brand);
    const greeting = input.contactFirstName?.trim()
        ? `Hoi ${input.contactFirstName.trim()},`
        : "Hoi,";
    const opening = input.openingOverride?.trim() ||
        `Ik kwam ${brand} laatst tegen en heb even naar jullie webshop gekeken.`;
    const observation = input.verifiedObservation.trim();
    const strength = input.verifiedStrength?.trim() || null;
    const positioning = positioningLine(input.recommendedProjectType);
    const experience = input.includeExperienceLine === true
        ? `Ik werk inmiddels zo'n ${MM_COMPANY.yearsActive} jaar aan websites en online vindbaarheid.`
        : null;
    const cta = "Als je wilt, laat ik graag even zien wat ik bedoel.";
    const signature = signatureBlock(kvk);
    const parts = {
        greeting,
        opening,
        observation,
        strength,
        positioning,
        experience,
        cta,
        signature,
    };
    const blocks = [
        greeting,
        "",
        opening,
        "",
        observation,
        strength ? `\n${strength}` : null,
        "",
        positioning,
        experience,
        "",
        cta,
        "",
        signature,
    ]
        .filter((b) => b !== null)
        .join("\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
    const bodyText = blocks;
    const bodyHtml = renderOutreachHtml({
        bodyText,
        fromName: MM_COMPANY.fromDisplayName,
        websiteUrl: MM_COMPANY.websiteUrl,
        websiteLabel: MM_COMPANY.websiteLabel,
        kvkNumber: kvk,
    });
    const fixedCopy = [
        greeting,
        opening,
        positioning,
        experience,
        cta,
        signature,
    ]
        .filter(Boolean)
        .join("\n\n");
    const personalisationCopy = [observation, strength]
        .filter(Boolean)
        .join("\n\n");
    return {
        subject,
        bodyText,
        bodyHtml,
        parts,
        fixedCopy,
        personalisationCopy,
        wordCount: countWords(bodyText),
        claimsUsed: [],
    };
}
export function deterministicPersonalisationFromClaims(input) {
    return {
        observation: input.observation.external_sentence_nl,
        strength: input.strength?.external_sentence_nl ?? null,
        claimsUsed: [
            `observation:${input.observation.id}`,
            ...(input.strength ? [`strength:${input.strength.id}`] : []),
        ],
    };
}
//# sourceMappingURL=mailAssembler.js.map