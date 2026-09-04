import { config } from "dotenv";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "../config/env.js";
import { classifyShoppingTarget } from "../services/scoring/shoppingClassification.js";
import { createSupabaseServerClient } from "../services/supabase/client.js";
import { createRun, completeRun } from "../services/supabase/runsRepository.js";
import { logger } from "../utils/logger.js";
const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, "../../");
config({ path: resolve(projectRoot, ".env"), quiet: true });
async function main() {
    loadEnv();
    const supabase = createSupabaseServerClient(loadEnv());
    const run = await createRun(supabase, "reclassify_shopping_sources", {
        milestone: "5.3.1",
        dataForSeoCost: 0,
        anthropicCost: 0,
    });
    const counts = {
        GOOGLE_SHOPPING_PAID_EXACT: 0,
        GOOGLE_SHOPPING_EXACT_LISTING: 0,
        GOOGLE_SHOPPING_FREE_LISTING: 0,
        GOOGLE_SHOPPING_CANDIDATE: 0,
        EXACT_PAID_FUNNEL: 0,
        HIGH_CONFIDENCE_TARGET: 0,
        DISCOVERY_ONLY: 0,
    };
    const examples = [];
    try {
        const { data: targets, error } = await supabase
            .from("paid_search_targets")
            .select("id, brand_id, keyword, ad_title, landing_url, ad_url, ad_url_redirects, shop_ad_aclk, product_id, seller, domain_match_status, source_type, raw_payload, merchant_item_type")
            .eq("channel", "SHOPPING");
        if (error)
            throw new Error(error.message);
        const brandIds = [...new Set((targets ?? []).map((t) => t.brand_id))];
        const { data: brands } = await supabase
            .from("brands")
            .select("id, normalized_domain, confirmed_google_advertiser, transparency_confirmed")
            .in("id", brandIds);
        const brandById = new Map((brands ?? []).map((b) => [b.id, b]));
        for (const raw of (targets ?? [])) {
            const brand = brandById.get(raw.brand_id);
            const listingType = raw.merchant_item_type ??
                (raw.raw_payload?.listing?.type ??
                    null);
            const classified = classifyShoppingTarget({
                merchantItemType: listingType,
                shopAdAclk: raw.shop_ad_aclk,
                landingUrl: raw.landing_url,
                adUrl: raw.ad_url,
                adUrlRedirects: Array.isArray(raw.ad_url_redirects) ? raw.ad_url_redirects : [],
                seller: raw.seller,
                productId: raw.product_id,
                title: raw.ad_title,
                keyword: raw.keyword,
                domainMatchStatus: raw.domain_match_status,
                brandConfirmedAdvertiser: Boolean(brand?.confirmed_google_advertiser || brand?.transparency_confirmed),
                rawPayload: raw.raw_payload,
            });
            counts[classified.sourceType] =
                (counts[classified.sourceType] ?? 0) + 1;
            counts[classified.croReadinessLevel] =
                (counts[classified.croReadinessLevel] ?? 0) + 1;
            const now = new Date().toISOString();
            const { error: updErr } = await supabase
                .from("paid_search_targets")
                .update({
                source_type: classified.sourceType,
                source_quality_score: classified.sourceQualityScore,
                listing_target_confidence: classified.listingTargetConfidence,
                paid_evidence_confidence: classified.paidEvidenceConfidence,
                merchant_item_type: classified.merchantItemType,
                paid_evidence: classified.paidEvidence,
                free_listing_evidence: classified.freeListingEvidence,
                cro_readiness_level: classified.croReadinessLevel,
                updated_at: now,
            })
                .eq("id", raw.id);
            if (updErr)
                throw new Error(updErr.message);
            // Sync linked opportunities by paid_search_target_id first
            const { data: byTarget } = await supabase
                .from("opportunities")
                .select("id, source_evidence, paid_search_target_id, landing_url")
                .eq("paid_search_target_id", raw.id);
            let related = byTarget ?? [];
            if (related.length === 0 && raw.landing_url) {
                const { data: byLanding } = await supabase
                    .from("opportunities")
                    .select("id, source_evidence, paid_search_target_id, landing_url")
                    .eq("brand_id", raw.brand_id)
                    .eq("landing_url", raw.landing_url);
                related = byLanding ?? [];
            }
            for (const opp of related) {
                const prevEvidence = (opp.source_evidence ?? {});
                const shoppingLabel = classified.sourceType === "GOOGLE_SHOPPING_PAID_EXACT"
                    ? "paid_exact"
                    : classified.sourceType === "GOOGLE_SHOPPING_EXACT_LISTING"
                        ? "exact_listing"
                        : classified.sourceType === "GOOGLE_SHOPPING_FREE_LISTING"
                            ? "free_listing"
                            : "candidate";
                const sourceEvidence = {
                    ...prevEvidence,
                    transparency: Boolean(brand?.transparency_confirmed || brand?.confirmed_google_advertiser),
                    paidShopping: {
                        status: classified.sourceType === "GOOGLE_SHOPPING_PAID_EXACT"
                            ? "exact"
                            : classified.sourceType === "GOOGLE_SHOPPING_EXACT_LISTING"
                                ? "exact_listing"
                                : classified.sourceType === "GOOGLE_SHOPPING_FREE_LISTING"
                                    ? "free_listing"
                                    : "not_found",
                        sourceType: classified.sourceType,
                        keyword: raw.keyword,
                        productTitle: raw.ad_title,
                        seller: raw.seller,
                        landingUrl: raw.landing_url,
                        listingTargetConfidence: classified.listingTargetConfidence,
                        paidEvidenceConfidence: classified.paidEvidenceConfidence,
                        specificListingPaid: classified.sourceType === "GOOGLE_SHOPPING_PAID_EXACT",
                    },
                    shoppingTargetLabel: shoppingLabel,
                };
                await supabase
                    .from("opportunities")
                    .update({
                    source_type: classified.sourceType,
                    ground_truth_source_type: classified.sourceType,
                    source_quality_score: classified.sourceQualityScore,
                    cro_ready: classified.croReady,
                    cro_readiness_level: classified.croReadinessLevel,
                    listing_target_confidence: classified.listingTargetConfidence,
                    paid_evidence_confidence: classified.paidEvidenceConfidence,
                    primary_keyword_reason: classified.sourceType === "GOOGLE_SHOPPING_PAID_EXACT"
                        ? "google_shopping_paid_exact_landing"
                        : classified.sourceType === "GOOGLE_SHOPPING_EXACT_LISTING"
                            ? "google_shopping_exact_listing"
                            : classified.sourceType === "GOOGLE_SHOPPING_FREE_LISTING"
                                ? "google_shopping_free_listing"
                                : "google_shopping_candidate",
                    discovery_confirmation_source: classified.sourceType === "GOOGLE_SHOPPING_PAID_EXACT"
                        ? "dataforseo_merchant_shopping_paid"
                        : classified.sourceType === "GOOGLE_SHOPPING_FREE_LISTING"
                            ? "dataforseo_merchant_free_listing"
                            : "dataforseo_merchant_exact_listing",
                    source_evidence: sourceEvidence,
                    paid_target_status: classified.croReadinessLevel === "EXACT_PAID_FUNNEL"
                        ? "RESOLVED"
                        : classified.croReadinessLevel === "HIGH_CONFIDENCE_TARGET"
                            ? "EXACT_LISTING"
                            : "DISCOVERY",
                    updated_at: now,
                })
                    .eq("id", opp.id);
            }
            examples.push({
                seller: raw.seller,
                domain: brand?.normalized_domain,
                product: raw.ad_title,
                from: raw.source_type,
                to: classified.sourceType,
                listingConf: classified.listingTargetConfidence,
                paidConf: classified.paidEvidenceConfidence,
                croLevel: classified.croReadinessLevel,
                free: classified.freeListingEvidence,
                paid: classified.paidEvidence,
                reasons: classified.reasons,
            });
            console.log(`${raw.seller ?? "?"} · ${classified.sourceType} · listing=${classified.listingTargetConfidence} paid=${classified.paidEvidenceConfidence} · ${classified.croReadinessLevel}`);
        }
        // Labs / Search opportunities stay EXACT_PAID_FUNNEL when cro_ready
        await supabase
            .from("opportunities")
            .update({ cro_readiness_level: "EXACT_PAID_FUNNEL" })
            .eq("cro_ready", true)
            .in("ground_truth_source_type", ["LABS_PAID_KEYWORD", "LIVE_PAID_SERP"])
            .is("cro_readiness_level", null);
        await supabase
            .from("opportunities")
            .update({ cro_readiness_level: "DISCOVERY_ONLY" })
            .eq("cro_ready", false)
            .is("cro_readiness_level", null);
        const { count: exactPaidFunnels } = await supabase
            .from("opportunities")
            .select("id", { count: "exact", head: true })
            .eq("cro_readiness_level", "EXACT_PAID_FUNNEL");
        const { count: highConf } = await supabase
            .from("opportunities")
            .select("id", { count: "exact", head: true })
            .eq("cro_readiness_level", "HIGH_CONFIDENCE_TARGET");
        const { count: discovery } = await supabase
            .from("opportunities")
            .select("id", { count: "exact", head: true })
            .eq("cro_readiness_level", "DISCOVERY_ONLY");
        await completeRun(supabase, run.id, "completed", {
            counts,
            exactPaidFunnels: exactPaidFunnels ?? 0,
            highConfidenceTargets: highConf ?? 0,
            discoveryOnly: discovery ?? 0,
            examples,
            dataForSeoCost: 0,
            anthropicCost: 0,
        });
        console.log("");
        console.log("SHOPPING SOURCE RECLASSIFICATION COMPLETE");
        console.log("--------------------------------------------");
        console.log(`PAID_EXACT: ${counts.GOOGLE_SHOPPING_PAID_EXACT}`);
        console.log(`EXACT_LISTING: ${counts.GOOGLE_SHOPPING_EXACT_LISTING}`);
        console.log(`FREE_LISTING: ${counts.GOOGLE_SHOPPING_FREE_LISTING}`);
        console.log(`CANDIDATE: ${counts.GOOGLE_SHOPPING_CANDIDATE}`);
        console.log(`EXACT_PAID_FUNNEL opps: ${exactPaidFunnels ?? 0}`);
        console.log(`HIGH_CONFIDENCE_TARGET opps: ${highConf ?? 0}`);
        console.log(`DISCOVERY_ONLY opps: ${discovery ?? 0}`);
        console.log(`DataForSEO: $0 · Anthropic: $0`);
        const focus = examples.filter((e) => String(e.domain).includes("currentbody") ||
            String(e.domain).includes("haarshop") ||
            String(e.seller).toLowerCase().includes("currentbody") ||
            String(e.seller).toLowerCase().includes("haarshop"));
        for (const f of focus) {
            console.log(`FOCUS: ${f.seller} → ${f.to} (listing ${f.listingConf}, paid ${f.paidConf}, ${f.croLevel})`);
        }
        process.exit(0);
    }
    catch (error) {
        await completeRun(supabase, run.id, "failed", {
            error: error instanceof Error ? error.message : "unknown",
        });
        logger.error("reclassify shopping failed", {
            error: error instanceof Error ? error.message : "unknown",
        });
        process.exit(1);
    }
}
main();
//# sourceMappingURL=reclassifyShoppingSources.js.map