/**
 * Milestone 9.3.3 — cheap catalog focus check.
 *
 * One extra fetch of the widest collection page. Enough to estimate catalog
 * size and judge whether the assortment is focused enough for a hero-product
 * deep dive. No full catalog crawl, no pagination walking, no Claude.
 */
import { crawlWebsite } from "../crawler/websiteCrawler.js";
import { extractPageSignals } from "../crawler/pageExtractor.js";
import { TARGET_PROFILE } from "../../config/productionDiscovery.js";
/** Below this a listing tells us nothing: it is blocked, empty or not a listing. */
const MIN_TRUSTWORTHY_PRODUCT_LINKS = 8;
/** Score ceiling for anything we could not verify. */
const UNVERIFIED_SCORE_CEILING = 50;
/** Collection paths worth one fetch, most informative first. */
const COLLECTION_PATHS = [
    "/collections/all",
    "/collections/alle-producten",
    "/shop",
    "/producten",
    "/webshop",
    "/alle-producten",
];
/** Numbers a listing page prints about itself: "128 producten". */
const COUNT_PATTERNS = [
    /(\d{1,4})\s*(?:producten|artikelen|resultaten|items|products)/i,
    /(?:van|of)\s*(\d{1,4})\s*(?:producten|artikelen|results|resultaten)/i,
];
function parsePrintedCount(text) {
    for (const pattern of COUNT_PATTERNS) {
        const match = text.match(pattern);
        if (match) {
            const value = Number(match[1]);
            if (Number.isFinite(value) && value > 0)
                return value;
        }
    }
    return null;
}
function scoreFocus(size, categoryLinks) {
    const evidence = [];
    let score = 50;
    if (size === null) {
        evidence.push("catalogusomvang niet af te lezen, schatting op navigatie");
    }
    else if (size <= TARGET_PROFILE.catalogSweetSpotMax) {
        score += 30;
        evidence.push(`${size} producten: binnen de sweet spot voor een deep-dive PDP`);
    }
    else if (size <= TARGET_PROFILE.catalogHardMax) {
        score += 5;
        evidence.push(`${size} producten: breder dan ideaal, nog werkbaar`);
    }
    else {
        score -= 30;
        evidence.push(`${size} producten: te breed voor één heroverhaal`);
    }
    if (size !== null && size < TARGET_PROFILE.catalogSweetSpotMin) {
        score -= 15;
        evidence.push("erg weinig producten, mogelijk nog geen echte shop");
    }
    if (categoryLinks <= 12) {
        score += 12;
        evidence.push("smalle categoriestructuur");
    }
    else if (categoryLinks >= 35) {
        score -= 18;
        evidence.push(`${categoryLinks} categorielinks wijst op een brede winkel`);
    }
    return { score: Math.max(0, Math.min(100, score)), evidence };
}
export async function runCatalogFocusCheck(domain, timeoutMs, homepageProductLinks, homepageCategoryLinks) {
    const base = {
        domain,
        collectionUrl: null,
        estimatedCatalogSize: null,
        catalogFocusScore: 50,
        inSweetSpot: false,
        verified: false,
        evidence: [],
        error: null,
    };
    for (const path of COLLECTION_PATHS) {
        const url = `https://${domain}${path}`;
        let crawl;
        try {
            crawl = await crawlWebsite(url, timeoutMs);
        }
        catch {
            continue;
        }
        if (crawl.status !== "success")
            continue;
        const signals = extractPageSignals(crawl.html, crawl.finalUrl);
        // A page without product links is a 404 dressed as a 200.
        if (signals.estimatedProductLinks < 3)
            continue;
        const printed = parsePrintedCount(signals.bodyTextSample);
        const size = printed ?? signals.estimatedProductLinks;
        const focus = scoreFocus(size, signals.estimatedCategoryLinks);
        // A printed count is real evidence. A handful of links is not: that is what
        // a consent wall or a JavaScript grid looks like from the outside.
        const verified = printed !== null || signals.estimatedProductLinks >= MIN_TRUSTWORTHY_PRODUCT_LINKS;
        return {
            ...base,
            collectionUrl: crawl.finalUrl,
            estimatedCatalogSize: verified ? size : null,
            catalogFocusScore: verified
                ? focus.score
                : Math.min(focus.score, UNVERIFIED_SCORE_CEILING),
            inSweetSpot: verified &&
                size >= TARGET_PROFILE.catalogSweetSpotMin &&
                size <= TARGET_PROFILE.catalogSweetSpotMax,
            verified,
            evidence: verified
                ? printed !== null
                    ? [`listing meldt ${printed} producten`, ...focus.evidence]
                    : [`${size} productlinks geteld op de listing`, ...focus.evidence]
                : [
                    `listing gaf maar ${signals.estimatedProductLinks} productlinks zonder aantal: niet te verifiëren`,
                ],
            error: verified ? null : "listing_unverifiable",
        };
    }
    // No listing page reachable. The homepage says nothing reliable about how
    // large the catalog is, so this stays unverified rather than optimistic.
    const focus = scoreFocus(null, homepageCategoryLinks);
    return {
        ...base,
        estimatedCatalogSize: null,
        catalogFocusScore: Math.min(focus.score, UNVERIFIED_SCORE_CEILING),
        inSweetSpot: false,
        verified: false,
        evidence: [
            "geen bereikbare collectiepagina",
            `homepage toonde ${homepageProductLinks} productlinks`,
            ...focus.evidence,
        ],
        error: "no_collection_page",
    };
}
//# sourceMappingURL=catalogFocusCheck.js.map