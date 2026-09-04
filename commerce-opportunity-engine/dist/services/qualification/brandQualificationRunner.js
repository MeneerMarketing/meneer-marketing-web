import { classifyBusinessFromWebsite, needsHaikuFallback } from "../crawler/businessClassifier.js";
import { classifyBusinessWithHaiku } from "../crawler/haikuClassifier.js";
import { detectEcommerce } from "../crawler/ecommerceDetector.js";
import { computeMaturityScore } from "../crawler/maturityScorer.js";
import { extractPageSignals } from "../crawler/pageExtractor.js";
import { detectPlatform, mergePlatformDetections, } from "../crawler/platformDetector.js";
import { emptyProductPageResult, resolveProductCandidates, selectBestProductCandidate, } from "../crawler/productPageFinder.js";
import { extractProductPageDetails } from "../crawler/productPageExtractor.js";
import { computeRetailerScaleScore } from "../crawler/retailerScaleScorer.js";
import { crawlSecondaryEcommercePages } from "../crawler/secondaryCrawl.js";
import { crawlWebsite } from "../crawler/websiteCrawler.js";
import { qualifyLead } from "../qualification/leadQualificationService.js";
import { classifyUrlPageType, domainHomepage } from "../../utils/urlHelpers.js";
function isInvalidProductExtraction(product) {
    const name = (product.productName ?? "").toLowerCase();
    if (name.includes("404") ||
        name.includes("niet gevonden") ||
        name.includes("not found") ||
        name.includes("page not found")) {
        return true;
    }
    // Require either a real name or price evidence on a product page
    if (!product.productName && product.price == null) {
        return true;
    }
    return false;
}
function failedResult(candidate, startUrl, finalUrl, status, message) {
    return {
        brandId: candidate.id,
        normalizedDomain: candidate.normalizedDomain,
        crawlStartUrl: startUrl,
        crawlFinalUrl: finalUrl,
        pageSignals: null,
        crawlStatus: status,
        isEcommerce: false,
        ecommerceConfidence: 0,
        platform: "UNKNOWN",
        platformConfidence: 0,
        platformCandidate: "UNKNOWN",
        platformEvidence: {},
        shopifyConfidence: 0,
        businessType: "UNKNOWN",
        businessTypeConfidence: 0,
        businessTypeReasoning: message,
        leadEligible: false,
        qualificationReason: `crawl_${status}`,
        qualificationEvidence: { error: message },
        businessMaturityScore: 0,
        businessMaturityComponents: {},
        retailerScaleScore: 0,
        productPage: emptyProductPageResult(),
        extractedData: {},
        maturity: {
            productPriceSignal: null,
            reviewVolumeSignal: null,
            catalogDepthSignal: null,
            professionalBrandingSignal: null,
            paidActivitySignal: null,
            shippingReturnsSignal: null,
            paymentSignal: null,
            productDataQualitySignal: null,
            platformMaturitySignal: null,
            businessMaturityScore: 0,
            components: {},
        },
        haikuCostEstimate: 0,
        errors: [message],
    };
}
export async function qualifyBrandCandidate(env, candidate) {
    const startUrl = candidate.landingUrl ?? domainHomepage(candidate.normalizedDomain);
    const errors = [];
    let haikuCostEstimate = 0;
    const crawl = await crawlWebsite(startUrl, env.CRAWLER_TIMEOUT_MS);
    if (crawl.status !== "success") {
        return failedResult(candidate, startUrl, crawl.finalUrl, crawl.status, crawl.errorMessage ?? "Crawl failed");
    }
    let homepageSignals = extractPageSignals(crawl.html, crawl.finalUrl);
    let platform = detectPlatform(crawl.html, crawl.finalUrl);
    let ecommerce = detectEcommerce(homepageSignals, platform);
    // Always do a limited secondary crawl for ecommerce/scale/product signal enrichment
    let secondarySignals = [];
    const maxSecondary = Math.min(4, env.PRODUCT_RESOLUTION_MAX_INTERNAL_PAGES);
    {
        const secondary = await crawlSecondaryEcommercePages({
            domain: candidate.normalizedDomain,
            homepageUrl: crawl.finalUrl,
            homepageSignals,
            timeoutMs: Math.min(env.CRAWLER_TIMEOUT_MS, 25000),
            maxPages: maxSecondary,
        });
        secondarySignals = secondary.pages.map((p) => p.signals);
        errors.push(...secondary.errors);
        const platformDetections = [
            platform,
            ...secondary.pages.map((p) => detectPlatform(p.crawl.html, p.crawl.finalUrl)),
        ];
        platform = mergePlatformDetections(platformDetections);
        ecommerce = detectEcommerce(homepageSignals, platform, secondarySignals);
    }
    let business = classifyBusinessFromWebsite(candidate.normalizedDomain, mergeSignalViews(homepageSignals, secondarySignals), ecommerce);
    if (env.QUALIFICATION_HAIKU_FALLBACK_ENABLED && needsHaikuFallback(business)) {
        try {
            const haiku = await classifyBusinessWithHaiku(env, candidate.normalizedDomain, mergeSignalViews(homepageSignals, secondarySignals));
            business = haiku.classification;
            haikuCostEstimate = haiku.estimatedCost;
        }
        catch (error) {
            errors.push(error instanceof Error ? error.message : "Haiku fallback failed");
        }
    }
    const retailerScaleScore = computeRetailerScaleScore({
        signals: homepageSignals,
        secondarySignals,
        businessType: business.businessType,
    });
    // Product resolution
    const candidates = resolveProductCandidates({
        startUrl,
        finalUrl: crawl.finalUrl,
        signals: homepageSignals,
        secondarySignals,
        keyword: candidate.keyword,
        adHeadline: candidate.adHeadline,
        adDescription: candidate.adDescription,
    });
    const bestCandidate = selectBestProductCandidate(candidates);
    let productPage = emptyProductPageResult(classifyUrlPageType(crawl.finalUrl));
    productPage.productCandidateCount = candidates.length;
    if (bestCandidate) {
        const tryUrls = [
            bestCandidate,
            ...candidates
                .filter((c) => c.url !== bestCandidate.url && classifyUrlPageType(c.url) === "PRODUCT")
                .slice(0, 2),
        ];
        let resolved = false;
        for (const tryCandidate of tryUrls) {
            try {
                const productCrawl = await crawlWebsite(tryCandidate.url, env.CRAWLER_TIMEOUT_MS);
                if (productCrawl.status !== "success") {
                    errors.push(`product_crawl_${productCrawl.status}: ${productCrawl.errorMessage ?? tryCandidate.url}`);
                    continue;
                }
                const extracted = extractProductPageDetails({
                    html: productCrawl.html,
                    productUrl: productCrawl.finalUrl,
                    candidate: { ...tryCandidate, url: productCrawl.finalUrl },
                    candidateCount: candidates.length,
                });
                if (isInvalidProductExtraction(extracted)) {
                    errors.push(`invalid_product_page: ${productCrawl.finalUrl}`);
                    continue;
                }
                productPage = extracted;
                const productPlatform = detectPlatform(productCrawl.html, productCrawl.finalUrl);
                platform = mergePlatformDetections([platform, productPlatform]);
                resolved = true;
                break;
            }
            catch (error) {
                errors.push(error instanceof Error ? error.message : "product crawl failed");
            }
        }
        if (!resolved && bestCandidate.score >= 0.7 && bestCandidate.nameHint) {
            productPage = {
                ...emptyProductPageResult("PRODUCT"),
                productUrl: bestCandidate.url,
                productName: bestCandidate.nameHint,
                price: bestCandidate.priceHint,
                currency: bestCandidate.currencyHint,
                productResolutionConfidence: bestCandidate.score,
                productResolutionSource: bestCandidate.source,
                productCandidateCount: candidates.length,
                extractionEvidence: { reasons: bestCandidate.reasons, crawlFailed: true },
            };
        }
    }
    const maturity = computeMaturityScore({
        productPage,
        signals: mergeSignalViews(homepageSignals, secondarySignals),
        paidActivityStrong: candidate.paidSignalStrong,
        confirmedGoogleAdvertiser: candidate.confirmedGoogleAdvertiser,
        platform: platform.platform,
        platformConfidence: platform.platformConfidence,
    });
    const gate = qualifyLead({
        candidate,
        crawlStatus: crawl.status,
        ecommerce,
        business,
        productPage,
        maturity,
        platform: platform.platform,
        platformCandidate: platform.platformCandidate,
        retailerScaleScore,
    });
    return {
        brandId: candidate.id,
        normalizedDomain: candidate.normalizedDomain,
        crawlStartUrl: startUrl,
        crawlFinalUrl: crawl.finalUrl,
        pageSignals: homepageSignals,
        crawlStatus: crawl.status,
        isEcommerce: ecommerce.isEcommerce,
        ecommerceConfidence: ecommerce.ecommerceConfidence,
        platform: platform.platform,
        platformConfidence: platform.platformConfidence,
        platformCandidate: platform.platformCandidate,
        platformEvidence: platform.evidence,
        shopifyConfidence: platform.shopifyConfidence,
        businessType: business.businessType,
        businessTypeConfidence: business.businessTypeConfidence,
        businessTypeReasoning: business.businessTypeReasoning,
        leadEligible: gate.leadEligible,
        qualificationReason: gate.qualificationReason,
        qualificationEvidence: gate.qualificationEvidence,
        businessMaturityScore: maturity.businessMaturityScore,
        businessMaturityComponents: maturity.components,
        retailerScaleScore,
        productPage,
        extractedData: {
            platformSignals: platform.signals,
            ecommerceSignals: ecommerce.signals,
            secondaryPagesCrawled: ecommerce.secondaryPagesCrawled,
            title: homepageSignals.title,
            usedPlaywright: crawl.usedPlaywright,
            keyword: candidate.keyword,
            adHeadline: candidate.adHeadline,
        },
        maturity,
        haikuCostEstimate,
        errors,
    };
}
function mergeSignalViews(primary, secondary) {
    if (secondary.length === 0) {
        return primary;
    }
    return {
        ...primary,
        jsonLdProducts: [...primary.jsonLdProducts, ...secondary.flatMap((s) => s.jsonLdProducts)],
        jsonLdTypes: [...primary.jsonLdTypes, ...secondary.flatMap((s) => s.jsonLdTypes)],
        internalLinks: [
            ...new Set([...primary.internalLinks, ...secondary.flatMap((s) => s.internalLinks)]),
        ],
        hasCartLink: primary.hasCartLink || secondary.some((s) => s.hasCartLink),
        hasCheckoutLink: primary.hasCheckoutLink || secondary.some((s) => s.hasCheckoutLink),
        hasAddToCart: primary.hasAddToCart || secondary.some((s) => s.hasAddToCart),
        productUrlCount: primary.productUrlCount + secondary.reduce((n, s) => n + s.productUrlCount, 0),
        collectionUrlCount: primary.collectionUrlCount + secondary.reduce((n, s) => n + s.collectionUrlCount, 0),
        estimatedProductLinks: primary.estimatedProductLinks +
            secondary.reduce((n, s) => n + s.estimatedProductLinks, 0),
        estimatedCategoryLinks: Math.max(primary.estimatedCategoryLinks, ...secondary.map((s) => s.estimatedCategoryLinks)),
        shopRouteHits: primary.shopRouteHits + secondary.reduce((n, s) => n + s.shopRouteHits, 0),
        productGridHints: primary.productGridHints + secondary.reduce((n, s) => n + s.productGridHints, 0),
        storeLocatorMentions: Math.max(primary.storeLocatorMentions, ...secondary.map((s) => s.storeLocatorMentions)),
        insuranceServiceMentions: Math.max(primary.insuranceServiceMentions, ...secondary.map((s) => s.insuranceServiceMentions)),
        sellerMentions: Math.max(primary.sellerMentions, ...secondary.map((s) => s.sellerMentions)),
        compareMentions: Math.max(primary.compareMentions, ...secondary.map((s) => s.compareMentions)),
        paymentSignals: [
            ...new Set([...primary.paymentSignals, ...secondary.flatMap((s) => s.paymentSignals)]),
        ],
        bodyTextSample: [primary.bodyTextSample, ...secondary.map((s) => s.bodyTextSample)]
            .join(" ")
            .slice(0, 12000),
    };
}
//# sourceMappingURL=brandQualificationRunner.js.map