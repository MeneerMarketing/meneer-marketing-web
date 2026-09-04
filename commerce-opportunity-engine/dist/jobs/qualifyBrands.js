import { config } from "dotenv";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "../config/env.js";
import { createSupabaseServerClient } from "../services/supabase/client.js";
import { createRun, completeRun } from "../services/supabase/runsRepository.js";
import { loadBrandsForQualification, saveBrandQualification, } from "../services/supabase/brandsQualificationRepository.js";
import { upsertQualifiedPage } from "../services/supabase/pagesRepository.js";
import { qualifyBrandCandidate } from "../services/qualification/brandQualificationRunner.js";
import { closeCrawlerBrowser } from "../services/crawler/websiteCrawler.js";
import { mapWithConcurrency } from "../utils/concurrency.js";
import { logger } from "../utils/logger.js";
import { domainHomepage } from "../utils/urlHelpers.js";
import { emptyProductPageResult } from "../services/crawler/productPageFinder.js";
const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, "../../");
config({ path: resolve(projectRoot, ".env"), quiet: true });
function printReport(stats) {
    console.log("");
    console.log("WEBSITE QUALIFICATION COMPLETE (M3.1)");
    console.log("--------------------------------------------");
    console.log(`Brands crawled: ${stats.brandsCrawled}`);
    console.log(`Ecommerce: ${stats.ecommerceCount}`);
    console.log(`Shopify: ${stats.shopifyCount}`);
    console.log(`WooCommerce: ${stats.wooCommerceCount}`);
    console.log(`Products resolved: ${stats.productsResolved}`);
    console.log(`Prices found: ${stats.pricesFound}`);
    console.log("");
    console.log(`BRAND: ${stats.brandTypeCounts.BRAND ?? 0}`);
    console.log(`SPECIALIST_WEBSHOP: ${stats.brandTypeCounts.SPECIALIST_WEBSHOP ?? 0}`);
    console.log(`GENERAL_RETAILER: ${stats.brandTypeCounts.GENERAL_RETAILER ?? 0}`);
    console.log(`MARKETPLACE: ${stats.brandTypeCounts.MARKETPLACE ?? 0}`);
    console.log(`COMPARISON_SITE: ${stats.brandTypeCounts.COMPARISON_SITE ?? 0}`);
    console.log(`SERVICE_BUSINESS: ${stats.brandTypeCounts.SERVICE_BUSINESS ?? 0}`);
    console.log(`NON_ECOMMERCE: ${stats.brandTypeCounts.NON_ECOMMERCE ?? 0}`);
    console.log(`UNKNOWN: ${stats.brandTypeCounts.UNKNOWN ?? 0}`);
    console.log("");
    console.log(`Lead eligible: ${stats.leadEligible}`);
    console.log(`Excluded: ${stats.excluded}`);
    console.log(`Errors: ${stats.errors}`);
    console.log(`Haiku cost estimate: $${stats.haikuCost.toFixed(6)}`);
    console.log(`DataForSEO cost: $0.000000`);
    console.log("");
    console.log("PER DOMAIN");
    console.log("");
    for (const result of stats.results) {
        console.log(`${result.normalizedDomain}`);
        console.log(`  ecommerce: ${result.isEcommerce} (${result.ecommerceConfidence})`);
        console.log(`  business_type: ${result.businessType} (${result.businessTypeConfidence})`);
        console.log(`  platform: ${result.platform} conf=${result.platformConfidence} candidate=${result.platformCandidate}`);
        console.log(`  retailer_scale: ${result.retailerScaleScore}/100`);
        console.log(`  maturity: ${result.businessMaturityScore}/100`);
        console.log(`  lead_eligible: ${result.leadEligible}`);
        console.log(`  reason: ${result.qualificationReason}`);
        console.log(`  product: ${result.productPage.productUrl ?? "null"} (conf=${result.productPage.productResolutionConfidence})`);
        console.log(`  product_name: ${result.productPage.productName ?? "null"}`);
        console.log(`  price: ${result.productPage.price != null ? `${result.productPage.currency ?? "EUR"} ${result.productPage.price}` : "null"}`);
        console.log(`  reviews: ${result.productPage.reviewCount ?? "null"} rating=${result.productPage.rating ?? "null"}`);
        if (result.errors.length > 0) {
            console.log(`  crawl_errors: ${result.errors.join(" | ")}`);
        }
        console.log("");
    }
    const eligible = stats.results.filter((r) => r.leadEligible);
    console.log("LEAD ELIGIBLE");
    console.log("");
    if (eligible.length === 0) {
        console.log("None.");
    }
    else {
        eligible.forEach((result, index) => {
            console.log(`${index + 1}. ${result.normalizedDomain}`);
            console.log(`   Platform: ${result.platform} (candidate: ${result.platformCandidate})`);
            console.log(`   Type: ${result.businessType}`);
            console.log(`   Scale: ${result.retailerScaleScore}/100`);
            console.log(`   Maturity: ${result.businessMaturityScore}/100`);
            console.log(`   Product: ${result.productPage.productName ?? "n/a"}`);
            if (result.productPage.price != null) {
                console.log(`   Price: ${result.productPage.currency ?? "EUR"} ${result.productPage.price}`);
            }
            console.log("");
        });
    }
    console.log("EXCLUDED");
    console.log("");
    for (const result of stats.results.filter((r) => !r.leadEligible)) {
        console.log(`${result.normalizedDomain}`);
        console.log(`Reason: ${result.qualificationReason}`);
        console.log("");
    }
}
async function saveQualificationOutputs(supabase, result) {
    await saveBrandQualification(supabase, {
        brandId: result.brandId,
        crawlStatus: result.crawlStatus,
        isEcommerce: result.isEcommerce,
        ecommerceConfidence: result.ecommerceConfidence,
        platform: result.platform,
        platformConfidence: result.platformConfidence,
        platformCandidate: result.platformCandidate,
        platformEvidence: result.platformEvidence,
        shopifyConfidence: result.shopifyConfidence,
        businessType: result.businessType,
        businessTypeConfidence: result.businessTypeConfidence,
        businessTypeReasoning: result.businessTypeReasoning,
        leadEligible: result.leadEligible,
        qualificationReason: result.qualificationReason,
        qualificationEvidence: result.qualificationEvidence,
        businessMaturityScore: result.businessMaturityScore,
        businessMaturityComponents: result.businessMaturityComponents,
        retailerScaleScore: result.retailerScaleScore,
        crawlMetadata: {
            errors: result.errors,
            haikuCostEstimate: result.haikuCostEstimate,
            extracted: result.extractedData,
            maturity: result.maturity,
        },
    });
    if (result.crawlStatus === "success") {
        await upsertQualifiedPage(supabase, {
            brandId: result.brandId,
            url: result.crawlStartUrl,
            finalUrl: result.crawlFinalUrl,
            crawlStatus: result.crawlStatus,
            productPage: result.productPage,
            signals: result.pageSignals,
            maturityScore: result.businessMaturityScore,
        });
    }
}
export async function runBrandQualification() {
    const env = loadEnv();
    const supabase = createSupabaseServerClient(env);
    const candidates = await loadBrandsForQualification(supabase, env.CRAWLER_MAX_BRANDS_PER_RUN, { forcePriorityDomains: env.QUALIFY_FORCE_PRIORITY_DOMAINS });
    logger.info("Starting brand qualification M3.1", {
        candidateCount: candidates.length,
        concurrency: env.CRAWLER_CONCURRENCY,
        domains: candidates.map((c) => c.normalizedDomain),
    });
    const run = await createRun(supabase, "brand_qualification_v2", {
        maxBrands: env.CRAWLER_MAX_BRANDS_PER_RUN,
        milestone: "3.1",
    });
    const results = await mapWithConcurrency(candidates, env.CRAWLER_CONCURRENCY, async (candidate) => {
        try {
            const result = await qualifyBrandCandidate(env, candidate);
            result.extractedData.confirmedGoogleAdvertiser =
                candidate.confirmedGoogleAdvertiser || candidate.transparencyConfirmed;
            await saveQualificationOutputs(supabase, result);
            return result;
        }
        catch (error) {
            logger.error("Brand qualification failed", {
                domain: candidate.normalizedDomain,
                error: error instanceof Error ? error.message : "unknown",
            });
            const failed = {
                brandId: candidate.id,
                normalizedDomain: candidate.normalizedDomain,
                crawlStartUrl: candidate.landingUrl ?? domainHomepage(candidate.normalizedDomain),
                crawlFinalUrl: candidate.landingUrl ?? domainHomepage(candidate.normalizedDomain),
                pageSignals: null,
                crawlStatus: "failed",
                isEcommerce: false,
                ecommerceConfidence: 0,
                platform: "UNKNOWN",
                platformConfidence: 0,
                platformCandidate: "UNKNOWN",
                platformEvidence: {},
                shopifyConfidence: 0,
                businessType: "UNKNOWN",
                businessTypeConfidence: 0,
                businessTypeReasoning: "Qualification job error",
                leadEligible: false,
                qualificationReason: "qualification_error",
                qualificationEvidence: {},
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
                errors: [error instanceof Error ? error.message : "unknown error"],
            };
            return failed;
        }
    });
    await closeCrawlerBrowser();
    const stats = {
        brandsCrawled: results.length,
        ecommerceCount: results.filter((r) => r.isEcommerce).length,
        shopifyCount: results.filter((r) => r.platform === "SHOPIFY").length,
        wooCommerceCount: results.filter((r) => r.platform === "WOOCOMMERCE").length,
        brandTypeCounts: {},
        leadEligible: results.filter((r) => r.leadEligible).length,
        excluded: results.filter((r) => !r.leadEligible).length,
        errors: results.filter((r) => r.errors.length > 0 || r.crawlStatus !== "success").length,
        haikuCost: results.reduce((sum, r) => sum + r.haikuCostEstimate, 0),
        productsResolved: results.filter((r) => r.productPage.productUrl).length,
        pricesFound: results.filter((r) => r.productPage.price != null).length,
        results,
    };
    for (const result of results) {
        stats.brandTypeCounts[result.businessType] =
            (stats.brandTypeCounts[result.businessType] ?? 0) + 1;
    }
    await completeRun(supabase, run.id, "completed", { ...stats, dataForSeoCost: 0 });
    printReport(stats);
    return stats;
}
async function main() {
    try {
        await runBrandQualification();
        process.exit(0);
    }
    catch (error) {
        await closeCrawlerBrowser();
        logger.error("Qualification job failed", {
            error: error instanceof Error ? error.message : "unknown error",
        });
        process.exit(1);
    }
}
main();
//# sourceMappingURL=qualifyBrands.js.map