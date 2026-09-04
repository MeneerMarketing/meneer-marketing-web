import { isBlacklistedDomain } from "./blacklist.js";
/** Overduidelijke domein → business type mapping. Geen uitbreiding met grote retailers als leads. */
export const domainBusinessTypes = {
    "kruidvat.nl": "GENERAL_RETAILER",
    "douglas.nl": "GENERAL_RETAILER",
    "etos.nl": "GENERAL_RETAILER",
    "hema.nl": "GENERAL_RETAILER",
    "notino.nl": "GENERAL_RETAILER",
    "vergelijk.nl": "COMPARISON_SITE",
    "beslist.nl": "COMPARISON_SITE",
    "kieskeurig.nl": "COMPARISON_SITE",
    "haarshop.nl": "SPECIALIST_WEBSHOP",
    "boozyshop.nl": "SPECIALIST_WEBSHOP",
    "currentbody.nl": "BRAND",
};
const NON_LEAD_TYPES = [
    "GENERAL_RETAILER",
    "MASS_RETAILER",
    "MARKETPLACE",
    "COMPARISON_SITE",
    "SERVICE_BUSINESS",
    "NON_ECOMMERCE",
];
export function classifyBusinessType(normalizedDomain) {
    const domain = normalizedDomain.toLowerCase().trim();
    if (isBlacklistedDomain(domain)) {
        return {
            businessType: "MARKETPLACE",
            leadEligible: false,
            excludedReason: "marketplace_blacklist",
        };
    }
    const mapped = domainBusinessTypes[domain];
    if (mapped) {
        const leadEligible = !NON_LEAD_TYPES.includes(mapped);
        return {
            businessType: mapped,
            leadEligible,
            excludedReason: leadEligible ? null : `${mapped.toLowerCase()}_excluded`,
        };
    }
    return {
        businessType: "UNKNOWN",
        leadEligible: false,
        excludedReason: "pending_qualification",
    };
}
//# sourceMappingURL=businessTypes.js.map