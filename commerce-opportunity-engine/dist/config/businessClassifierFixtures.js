/**
 * Milestone 9.3.3 — regression fixtures for the website business classifier.
 *
 * These guard the general logic, not specific companies. Every fixture uses a
 * neutral domain carrying a realistic signal profile, so a passing test proves
 * the rules work rather than that a domain was hardcoded. The labels name the
 * archetype each profile represents.
 *
 * The rule under test: international reach must never on its own produce
 * MASS_RETAILER. Only assortment width may.
 */
export function buildPageSignals(overrides) {
    return {
        title: null,
        metaDescription: null,
        jsonLdProducts: [],
        jsonLdTypes: [],
        internalLinks: [],
        hasCartLink: true,
        hasCheckoutLink: true,
        hasAddToCart: true,
        productUrlCount: 12,
        collectionUrlCount: 4,
        priceMatches: ["€ 149,00"],
        categoryLinkCount: 8,
        sellerMentions: 0,
        compareMentions: 0,
        storeLocatorMentions: 0,
        insuranceServiceMentions: 0,
        ownBrandMentions: 0,
        paymentSignals: ["ideal"],
        shippingText: null,
        returnsText: null,
        guaranteeText: null,
        socialProofSignals: [],
        estimatedProductLinks: 12,
        estimatedCategoryLinks: 8,
        brandNamesInText: [],
        shopRouteHits: 3,
        productGridHints: 2,
        localeAlternateCount: 1,
        ...overrides,
    };
}
export const BUSINESS_CLASSIFIER_FIXTURES = [
    {
        label: "Internationaal specialistmerk: één niche, veel landversies",
        domain: "nichedeviceco.nl",
        isEcommerce: true,
        ecommerceConfidence: 0.9,
        signals: {
            title: "LED Devices",
            bodyTextSample: "onze led apparaten voor beauty en huidverzorging. ons merk ontwikkelt zelf elk apparaat. gratis verzending, 30 dagen bedenktijd.",
            localeAlternateCount: 23,
            estimatedCategoryLinks: 14,
            estimatedProductLinks: 22,
            ownBrandMentions: 4,
        },
        expectOneOf: ["SPECIALIST_WEBSHOP", "BRAND"],
        expectNot: ["MASS_RETAILER", "GENERAL_RETAILER", "MARKETPLACE"],
    },
    {
        label: "DTC merk met veel locales en smalle catalogus",
        domain: "singleproductbrand.com",
        isEcommerce: true,
        ecommerceConfidence: 0.88,
        signals: {
            title: "Recovery Boots",
            bodyTextSample: "eigen ontwerp, zelf ontwikkeld in nederland. onze producten helpen sporters herstellen. bekijk de collectie.",
            localeAlternateCount: 18,
            estimatedCategoryLinks: 6,
            estimatedProductLinks: 9,
            ownBrandMentions: 6,
        },
        expectOneOf: ["SPECIALIST_WEBSHOP", "BRAND"],
        expectNot: ["MASS_RETAILER", "GENERAL_RETAILER"],
    },
    {
        label: "Cross-category elektronicaketen met vestigingen",
        domain: "brededoos.nl",
        isEcommerce: true,
        ecommerceConfidence: 0.92,
        signals: {
            title: "Alles voor huis en vrije tijd",
            bodyTextSample: "elektronica, huishouden, beauty, tuin en sport onder één dak. bekijk al onze vestigingen en filialen door heel het land. alle merken op voorraad.",
            localeAlternateCount: 3,
            estimatedCategoryLinks: 62,
            estimatedProductLinks: 140,
            storeLocatorMentions: 3,
            brandNamesInText: Array.from({ length: 16 }, (_, index) => `merk${index}`),
        },
        expectOneOf: ["MASS_RETAILER"],
        expectNot: ["SPECIALIST_WEBSHOP", "BRAND"],
    },
    {
        label: "Grote cross-category sportretailer",
        domain: "sportwarenhuis.nl",
        isEcommerce: true,
        ecommerceConfidence: 0.9,
        signals: {
            title: "Sport, camping en outdoor",
            bodyTextSample: "sport, kampeer, camping, mode en reis artikelen. onze filialen en vestigingen door heel nederland. topmerken en a-merken in ons warenhuis.",
            localeAlternateCount: 8,
            estimatedCategoryLinks: 55,
            estimatedProductLinks: 120,
            storeLocatorMentions: 4,
            brandNamesInText: Array.from({ length: 20 }, (_, index) => `sportmerk${index}`),
        },
        expectOneOf: ["MASS_RETAILER"],
        expectNot: ["SPECIALIST_WEBSHOP", "BRAND"],
    },
    {
        label: "Nederlandse focused specialist zonder internationale schaal",
        domain: "kussenspecialist.nl",
        isEcommerce: true,
        ecommerceConfidence: 0.85,
        signals: {
            title: "Ergonomische kussens",
            bodyTextSample: "wij verkopen ergonomische hoofdkussens voor nekklachten. persoonlijk slaapadvies en 100 nachten proefslapen.",
            localeAlternateCount: 1,
            estimatedCategoryLinks: 9,
            estimatedProductLinks: 15,
        },
        expectOneOf: ["SPECIALIST_WEBSHOP", "BRAND"],
        expectNot: ["MASS_RETAILER", "GENERAL_RETAILER"],
    },
    {
        label: "Breed assortiment zonder internationale schaal blijft mass retail",
        domain: "allesonderdak.nl",
        isEcommerce: true,
        ecommerceConfidence: 0.9,
        signals: {
            title: "Warenhuis",
            bodyTextSample: "elektronica, mode, tuin, dieren en huishouden. bezoek onze vestigingen of bestel online. alle merken a-z.",
            localeAlternateCount: 1,
            estimatedCategoryLinks: 70,
            estimatedProductLinks: 200,
            storeLocatorMentions: 3,
            brandNamesInText: Array.from({ length: 14 }, (_, index) => `huismerk${index}`),
        },
        expectOneOf: ["MASS_RETAILER"],
        expectNot: ["SPECIALIST_WEBSHOP"],
    },
];
//# sourceMappingURL=businessClassifierFixtures.js.map