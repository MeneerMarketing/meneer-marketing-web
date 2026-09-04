/**
 * Milestone 9.6.1 — agency-owned or actively managed client/project domains.
 * HARD discovery exclusion before any crawl, vision, or paid validation.
 */
export const AGENCY_OWNED_OR_MANAGED_DOMAINS = [
    "skincomplete.eu",
    "meneermarketing.nl",
    "bestrest.nl",
    "dibaclinics.nl",
];
export function isAgencyOwnedOrManagedDomain(normalizedDomain) {
    const domain = normalizedDomain.toLowerCase().replace(/^www\./, "");
    return AGENCY_OWNED_OR_MANAGED_DOMAINS.some((entry) => domain === entry || domain.endsWith(`.${entry}`));
}
//# sourceMappingURL=agencyDomains.js.map