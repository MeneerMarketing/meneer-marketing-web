/**
 * Milestone 9.3.2 — cheap domain quality check.
 *
 * One homepage fetch. No secondary crawl, no catalog crawl, no hero resolution,
 * no Claude. Enough to answer: webshop, platform, business type, retail scale,
 * and a basic own-brand signal.
 */
import { crawlWebsite } from "../crawler/websiteCrawler.js";
import { extractPageSignals } from "../crawler/pageExtractor.js";
import { detectPlatform } from "../crawler/platformDetector.js";
import { detectEcommerce } from "../crawler/ecommerceDetector.js";
import { BUSINESS_CLASSIFIER_VERSION, classifyBusinessFromWebsite, } from "../crawler/businessClassifier.js";
import { computeRetailerScaleScore } from "../crawler/retailerScaleScorer.js";
import { classifyProspectExclusion } from "./prospectPipelineGate.js";
function domainHomepage(domain) {
    return `https://${domain.replace(/^https?:\/\//, "").replace(/\/$/, "")}`;
}
function domainWords(domain) {
    return domain
        .toLowerCase()
        .replace(/^www\./, "")
        .replace(/\.(nl|com|eu|net|be|de|co\.uk)$/i, "")
        .split(/[^a-z0-9]+/)
        .filter((word) => word.length >= 4);
}
/**
 * Own-brand proxy: a shop that mostly sells its own label repeats its own name
 * in product titles and structured data, and carries little external brand talk.
 */
function scoreOwnBrandSignal(domain, title, bodyTextSample, jsonLdProductCount) {
    const evidence = [];
    let score = 40;
    const words = domainWords(domain);
    const brandToken = words[0] ?? "";
    if (brandToken && title && title.toLowerCase().includes(brandToken)) {
        score += 15;
        evidence.push("merknaam in page title");
    }
    if (brandToken) {
        const mentions = bodyTextSample.split(brandToken).length - 1;
        if (mentions >= 6) {
            score += 20;
            evidence.push(`eigen merknaam ${mentions}x op de homepage`);
        }
        else if (mentions >= 3) {
            score += 10;
            evidence.push(`eigen merknaam ${mentions}x op de homepage`);
        }
    }
    if (/\b(ons merk|onze producten|eigen ontwerp|zelf ontwikkeld|our brand|designed by us)\b/i.test(bodyTextSample)) {
        score += 15;
        evidence.push("eigen-merk taal in de copy");
    }
    if (/\b(merken|brands|alle merken|shop by brand|topmerken)\b/i.test(bodyTextSample)) {
        score -= 20;
        evidence.push("merkenoverzicht wijst op reseller");
    }
    if (jsonLdProductCount > 0) {
        score += 5;
        evidence.push("product structured data aanwezig");
    }
    return { score: Math.max(0, Math.min(100, score)), evidence };
}
export async function runLightBrandCheck(domain, timeoutMs) {
    const base = {
        domain,
        crawlStatus: "unknown",
        isEcommerce: false,
        ecommerceConfidence: 0,
        platform: "UNKNOWN",
        platformConfidence: 0,
        businessType: "UNKNOWN",
        businessTypeConfidence: 0,
        businessTypeReasoning: "",
        retailerScaleScore: 0,
        retailerBreadthScore: 0,
        categoryBreadthScore: 0,
        internationalPresenceScore: 0,
        storeLocatorMentions: 0,
        ownBrandSignal: 0,
        ownBrandEvidence: [],
        categoryLinks: 0,
        productLinks: 0,
        prospectClass: "UNKNOWN",
        gateEligible: false,
        gateReason: null,
        classifierVersion: BUSINESS_CLASSIFIER_VERSION,
        title: null,
        error: null,
    };
    const crawl = await crawlWebsite(domainHomepage(domain), timeoutMs);
    base.crawlStatus = crawl.status;
    if (crawl.status !== "success") {
        base.error = crawl.errorMessage ?? "crawl failed";
        const verdict = classifyProspectExclusion({ domain });
        base.prospectClass = verdict.prospectClass;
        base.gateEligible = verdict.eligible;
        base.gateReason = verdict.reason;
        return base;
    }
    const signals = extractPageSignals(crawl.html, crawl.finalUrl);
    const platform = detectPlatform(crawl.html, crawl.finalUrl);
    const ecommerce = detectEcommerce(signals, platform);
    const business = classifyBusinessFromWebsite(domain, signals, ecommerce);
    const retailerScaleScore = computeRetailerScaleScore({
        signals,
        businessType: business.businessType,
    });
    const ownBrand = scoreOwnBrandSignal(domain, signals.title, signals.bodyTextSample, signals.jsonLdProducts.length);
    const verdict = classifyProspectExclusion({
        domain,
        businessType: business.businessType,
        isEcommerce: ecommerce.isEcommerce,
        retailerScaleScore,
    });
    return {
        ...base,
        isEcommerce: ecommerce.isEcommerce,
        ecommerceConfidence: ecommerce.ecommerceConfidence,
        platform: platform.platform,
        platformConfidence: platform.platformConfidence,
        businessType: business.businessType,
        businessTypeConfidence: business.businessTypeConfidence,
        businessTypeReasoning: business.businessTypeReasoning,
        retailerScaleScore,
        retailerBreadthScore: business.retailerBreadthScore,
        categoryBreadthScore: business.categoryBreadthScore,
        internationalPresenceScore: business.internationalPresenceScore,
        storeLocatorMentions: signals.storeLocatorMentions,
        ownBrandSignal: ownBrand.score,
        ownBrandEvidence: ownBrand.evidence,
        categoryLinks: signals.estimatedCategoryLinks,
        productLinks: signals.estimatedProductLinks,
        prospectClass: verdict.prospectClass,
        gateEligible: verdict.eligible,
        gateReason: verdict.reason,
        title: signals.title,
        error: null,
    };
}
//# sourceMappingURL=lightBrandCheck.js.map