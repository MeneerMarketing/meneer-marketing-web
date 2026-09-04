/**
 * Known Dutch retailer name → domain mappings for Shopping SERP blocks
 * where DataForSEO returns a seller label without a full domain.
 */
export const knownRetailerDomains = {
    etos: "etos.nl",
    decathlon: "decathlon.nl",
    kieskeurig: "kieskeurig.nl",
    "currentbody skin nl": "currentbody.nl",
    amazon: "amazon.nl",
    "amazon.nl": "amazon.nl",
    coolblue: "coolblue.nl",
    lyko: "lyko.nl",
    kruidvat: "kruidvat.nl",
    notino: "notino.nl",
    "renpho eu": "renpho.nl",
};
export function lookupKnownRetailerDomain(seller) {
    const key = seller.trim().toLowerCase();
    return knownRetailerDomains[key] ?? null;
}
//# sourceMappingURL=knownRetailers.js.map