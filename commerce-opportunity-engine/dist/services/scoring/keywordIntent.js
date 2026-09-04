const NL_PLACE_NAMES = new Set([
    "amsterdam",
    "rotterdam",
    "den haag",
    "utrecht",
    "eindhoven",
    "groningen",
    "tilburg",
    "almere",
    "breda",
    "nijmegen",
    "apeldoorn",
    "haarlem",
    "arnhem",
    "enschede",
    "amersfoort",
    "zaanstad",
    "haarlemmermeer",
    "den bosch",
    "zwolle",
    "zoetermeer",
    "leiden",
    "maastricht",
    "dordrecht",
    "ede",
    "leeuwarden",
    "heerlen",
    "hilversum",
    "hengelo",
    "alkmaar",
    "deventer",
    "venlo",
    "delft",
    "helmond",
    "oss",
    "roosendaal",
    "schiedam",
    "spijkenisse",
    "purmerend",
    "gouda",
    "vlaardingen",
    "almelo",
    "hoorn",
    "bergen op zoom",
    "capelle",
    "veenendaal",
    "katwijk",
    "zeist",
    "nieuwegein",
    "hardenberg",
    "doetinchem",
    "kampen",
    "middelburg",
].map((p) => p.replace(/\s+/g, "")));
const COMMERCIAL_GENERICS = new Set([
    "koop",
    "kopen",
    "bestel",
    "bestellen",
    "goedkoop",
    "goedkope",
    "prijs",
    "prijzen",
    "aanbieding",
    "korting",
    "sale",
    "orthopedisch",
    "orthopedische",
    "ergonomisch",
    "ergonomische",
    "memory",
    "foam",
    "kussen",
    "kussens",
    "matras",
    "matrassen",
    "dekbed",
    "dekbedden",
    "topper",
    "led",
    "masker",
    "mask",
    "therapie",
    "therapy",
    "huid",
    "skin",
    "anti",
    "rimpel",
    "acne",
    "webshop",
    "online",
]);
const NAV_HINTS = new Set([
    "login",
    "inloggen",
    "klantenservice",
    "contact",
    "openingstijden",
    "vestiging",
    "filiaal",
    "winkel",
    "adres",
    "route",
    "telefoon",
]);
export function classifyKeywordIntent(input) {
    const keyword = (input.keyword ?? "").trim().toLowerCase();
    if (!keyword) {
        return {
            intent: "UNKNOWN",
            confidence: 40,
            reason: "Geen keyword beschikbaar",
        };
    }
    const kwTokens = tokenize(keyword);
    const brandTokens = brandTokensFrom(input.domain, input.brandName);
    const productTokens = tokenize(input.productName ?? "");
    const compactKeyword = keyword.replace(/\s+/g, "");
    const brandOverlap = overlapCount(kwTokens, brandTokens);
    const productOverlap = overlapCount(kwTokens, productTokens);
    const hasPlace = kwTokens.some((t) => NL_PLACE_NAMES.has(t)) ||
        [...NL_PLACE_NAMES].some((p) => compactKeyword.includes(p));
    const hasCommercial = kwTokens.some((t) => COMMERCIAL_GENERICS.has(t));
    const hasNavHint = kwTokens.some((t) => NAV_HINTS.has(t));
    const shortLocal = kwTokens.length <= 3 && hasPlace;
    // Strong brand match on advertiser name/domain
    if (brandOverlap >= 1 && kwTokens.length <= 4 && !hasCommercial) {
        if (hasPlace || hasNavHint) {
            return {
                intent: "NAVIGATIONAL",
                confidence: 88,
                reason: `Keyword overlapt merk/domein (${brandTokens
                    .slice(0, 3)
                    .join(", ")}) plus plaats/navigatie-signaal`,
            };
        }
        return {
            intent: "BRANDED",
            confidence: 90,
            reason: `Keyword bevat merksignaal van adverteerder (${brandTokens
                .slice(0, 3)
                .join(", ")})`,
        };
    }
    // Product + brand combo (e.g. "currentbody led mask")
    if (brandOverlap >= 1 && (productOverlap >= 1 || hasCommercial)) {
        return {
            intent: "PRODUCT_BRANDED",
            confidence: 82,
            reason: "Merk + product/commercieel token in keyword",
        };
    }
    // Local store / competitor brand style: place + non-advertiser name, no commercial generics
    // Example: "textielhuis hengelo" for dekbed-discounter.nl
    if (hasPlace && !hasCommercial && brandOverlap === 0 && kwTokens.length <= 4) {
        return {
            intent: "NAVIGATIONAL",
            confidence: 86,
            reason: "Plaatsnaam + bedrijfsachtige naam zonder overlap met adverteerderdomein (lokale/navigatie-zoekintentie)",
        };
    }
    if (hasNavHint && !hasCommercial) {
        return {
            intent: "NAVIGATIONAL",
            confidence: 75,
            reason: "Navigatie-hint in keyword zonder sterke commerciele generieke termen",
        };
    }
    // Competitor brand-ish tokens without place (multi-token proper noun, no commercial)
    if (brandOverlap === 0 &&
        !hasCommercial &&
        kwTokens.length >= 2 &&
        kwTokens.length <= 3 &&
        kwTokens.every((t) => t.length >= 4)) {
        return {
            intent: "BRANDED",
            confidence: 68,
            reason: "Korte proprium-achtige keyword zonder commerciele generieken en zonder eigen merkopverlap",
        };
    }
    if (hasCommercial || productOverlap >= 1) {
        return {
            intent: "NON_BRANDED_COMMERCIAL",
            confidence: hasCommercial ? 84 : 72,
            reason: hasCommercial
                ? "Generieke commerciele termen in keyword"
                : "Productoverlap zonder merkopverlap",
        };
    }
    if (shortLocal) {
        return {
            intent: "NAVIGATIONAL",
            confidence: 70,
            reason: "Kort keyword met plaatsnaam",
        };
    }
    return {
        intent: "UNKNOWN",
        confidence: 45,
        reason: "Onvoldoende deterministische signalen",
    };
}
function brandTokensFrom(domain, brandName) {
    const fromDomain = (domain ?? "")
        .toLowerCase()
        .replace(/\.(nl|com|eu|be|de|shop|store)$/g, "")
        .replace(/[^a-z0-9]+/g, " ");
    return [...new Set([...tokenize(fromDomain), ...tokenize(brandName ?? "")])];
}
function tokenize(value) {
    return value
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, " ")
        .split(/[\s/_-]+/)
        .filter((t) => t.length >= 3);
}
function overlapCount(a, b) {
    if (a.length === 0 || b.length === 0)
        return 0;
    const setB = new Set(b);
    return a.filter((t) => setB.has(t)).length;
}
//# sourceMappingURL=keywordIntent.js.map