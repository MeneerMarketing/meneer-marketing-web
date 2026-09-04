/**
 * Milestone 8.1.1 — structured allowed claims with evidence scope.
 * Claude may only use these facts; never expand beyond scope.
 */
export const EVIDENCE_SCOPES = [
    "PAGE_SPECIFIC",
    "MULTI_PAGE",
    "SITE_WIDE",
    "BRAND_LEVEL",
];
function inferScopeFromEvidence(evidence) {
    const e = evidence.toLowerCase();
    if (/across (the )?site|site[- ]wide|multiple pages|meerdere pagina|door de hele/i.test(e)) {
        return "SITE_WIDE";
    }
    if (/multiple products|meerdere producten|across products/i.test(e)) {
        return "MULTI_PAGE";
    }
    return "PAGE_SPECIFIC";
}
function observationExternalNl(finding, productName) {
    const product = productName?.trim() || "dit product";
    const title = finding.title.toLowerCase();
    if (/price|prijs/i.test(title) || /price|prijs/i.test(finding.evidence)) {
        return `Op mobiel viel me bij ${product} op dat de prijs niet direct duidelijk in beeld staat.`;
    }
    if (/review|social proof|rating/i.test(title)) {
        return `Op die productpagina zag ik geen reviews of beoordelingen terug.`;
    }
    if (/stock|voorraad|availability|fulfillment/i.test(title)) {
        return `Op die productpagina is de voorraadstatus nogal vaag geformuleerd.`;
    }
    if (/imagery|image|visual/i.test(title)) {
        return `Op die productpagina zag ik vooral één productbeeld, zonder veel contextfoto's.`;
    }
    if (/value proposition|benefit/i.test(title)) {
        return `Op die productpagina las ik vooral technische specs, weinig concrete voordelen.`;
    }
    return `Op die productpagina viel me iets op rond ${finding.title.toLowerCase()}.`;
}
function strengthExternalNl(strength) {
    const title = strength.title.toLowerCase();
    if (/variant|color|kleur/i.test(title)) {
        return "De variantkeuze op die pagina vond ik juist netjes opgelost.";
    }
    if (/trust|service|garantie|verzending/i.test(title)) {
        return "De service-informatie op die pagina staat duidelijk.";
    }
    if (/navigation|breadcrumb|categorie/i.test(title)) {
        return "De navigatie op die pagina oogt overzichtelijk.";
    }
    return "Op die pagina zag ik ook iets dat netjes was opgelost.";
}
function observationAllowedFact(finding) {
    const title = finding.title.toLowerCase();
    const evidence = finding.evidence;
    if (/price|prijs/i.test(title) || /price|prijs/i.test(evidence)) {
        return "On this specific product page, the price is not immediately visible in the first viewport on mobile and desktop; structured extract shows price as null.";
    }
    if (/review|social proof|rating/i.test(title)) {
        return "On this specific product page, no reviews, ratings, or visible social proof are present.";
    }
    if (/stock|voorraad|availability|fulfillment/i.test(title)) {
        return "On this specific product page, stock/availability messaging is vague (awaiting stock / soon shipped) without a clear restock date.";
    }
    if (/imagery|image|visual/i.test(title)) {
        return "On this specific product page, product imagery above the fold is limited and lacks contextual lifestyle visuals.";
    }
    if (/value proposition|benefit/i.test(title)) {
        return "On this specific product page, benefit messaging is mostly technical specs rather than clear outcomes.";
    }
    // Fallback: compress evidence without inventing scope
    return `On this specific audited page: ${evidence.slice(0, 220)}`;
}
function strengthAllowedFact(strength) {
    const title = strength.title.toLowerCase();
    if (/variant|color|kleur/i.test(title)) {
        return "On this specific product page, variant/color selection is clearly presented.";
    }
    if (/trust|service|garantie|verzending/i.test(title)) {
        return "On this specific product page, trust/service signals (shipping threshold, garantie, help) are clearly visible.";
    }
    if (/navigation|breadcrumb|categorie/i.test(title)) {
        return "On this audited page view, navigation and category structure are clear.";
    }
    return `On this specific audited page: ${strength.evidence.slice(0, 200)}`;
}
function pageSpecificForbiddenExpansions() {
    return [
        "meerdere producten",
        "productpagina's",
        "overal",
        "de hele site",
        "de hele webshop",
        "door de hele",
        "altijd",
        "ook als je verder scrollt",
        "ook niet als je naar beneden scrollt",
        "bezoekers haken af",
        "klanten haken af",
        "jullie verliezen omzet",
        "conversies",
        "advertenties sturen",
    ];
}
/**
 * Build the only claims Claude is allowed to use in outreach copy.
 */
export function buildAllowedClaims(input) {
    const supportedOnly = input.supportedOnly !== false;
    const claims = [];
    for (const finding of input.findings) {
        const status = (finding.validationStatus ?? "SUPPORTED").toUpperCase();
        if (supportedOnly && status !== "SUPPORTED")
            continue;
        if (!supportedOnly && status === "REJECTED")
            continue;
        const scope = inferScopeFromEvidence(finding.evidence);
        claims.push({
            id: finding.id,
            type: "OBSERVATION",
            scope,
            page_url: input.pageUrl,
            product_name: input.productName,
            subject: finding.title,
            source_title: finding.title,
            allowed_fact: observationAllowedFact(finding),
            external_sentence_nl: observationExternalNl(finding, input.productName),
            forbidden_expansions: scope === "PAGE_SPECIFIC" ? pageSpecificForbiddenExpansions() : [],
            evidence_excerpt: finding.evidence.slice(0, 400),
            validation_status: status,
        });
    }
    for (const [idx, strength] of input.strengths.entries()) {
        const scope = inferScopeFromEvidence(strength.evidence);
        claims.push({
            id: `strength_${idx}`,
            type: "STRENGTH",
            scope,
            page_url: input.pageUrl,
            product_name: input.productName,
            subject: strength.title,
            source_title: strength.title,
            allowed_fact: strengthAllowedFact(strength),
            external_sentence_nl: strengthExternalNl(strength),
            forbidden_expansions: scope === "PAGE_SPECIFIC" ? pageSpecificForbiddenExpansions() : [],
            evidence_excerpt: strength.evidence.slice(0, 400),
            validation_status: "SUPPORTED",
        });
    }
    return claims;
}
export function pickPrimaryObservation(claims) {
    const observations = claims.filter((c) => c.type === "OBSERVATION");
    if (!observations.length)
        return null;
    // Prefer price visibility if present (common commercial hook), else first
    return (observations.find((c) => /price|prijs/i.test(c.subject)) ??
        observations[0] ??
        null);
}
export function pickPrimaryStrength(claims) {
    const strengths = claims.filter((c) => c.type === "STRENGTH");
    if (!strengths.length)
        return null;
    return (strengths.find((c) => /variant|color|kleur/i.test(c.subject)) ??
        strengths[0] ??
        null);
}
/** Attach validation status from finding_validations array onto findings. */
export function attachValidationStatus(findings, validations) {
    const vals = Array.isArray(validations) ? validations : [];
    return findings.map((f) => {
        const match = vals.find((v) => v &&
            typeof v === "object" &&
            String(v.title ?? "") === f.title);
        return {
            ...f,
            validationStatus: match
                ? String(match.status ?? "SUPPORTED").toUpperCase()
                : "SUPPORTED",
        };
    });
}
//# sourceMappingURL=allowedClaims.js.map