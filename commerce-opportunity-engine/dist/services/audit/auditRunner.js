import { CRO_AUDIT_VERSION, } from "../../config/scoringWeights.js";
import { buildPageRepresentation } from "./pageRepresentation.js";
import { captureOpportunityScreenshots, downloadScreenshotBuffers, hashPageContent, } from "./screenshotService.js";
import { runCroAuditWithClaude } from "./croAuditor.js";
import { computeAuditConfidence, computeOpportunityScore, } from "../scoring/opportunityScorer.js";
import { classifyKeywordIntent } from "../scoring/keywordIntent.js";
import { computeMeneerMarketingFit } from "../scoring/meneerMarketingFit.js";
import { classifyProductMerchantRelationship } from "../scoring/productMerchantRelationship.js";
import { extractProductMerchantSignals } from "../scoring/extractProductMerchantSignals.js";
import { buildInternalSalesAngle, recommendProjectType, } from "../scoring/projectType.js";
import { validateConversionLeaks } from "../scoring/sourceIntegrity.js";
import { assessPageHealth, auditConfidenceFromHealth, verdictForFailedAudit, } from "./pageHealth.js";
import { detectBrandAliasMismatch } from "./brandAlias.js";
import { logger } from "../../utils/logger.js";
import { one } from "../../utils/one.js";
function mapAuditType(level) {
    if (level === "EXACT_PAID_FUNNEL")
        return "EXACT_PAID_FUNNEL";
    if (level === "HIGH_CONFIDENCE_TARGET")
        return "HIGH_CONFIDENCE_PRODUCT_TARGET";
    return null;
}
function cleanTargetUrl(url) {
    try {
        const u = new URL(url);
        u.searchParams.delete("srsltid");
        u.searchParams.delete("gclid");
        u.searchParams.delete("fbclid");
        return u.toString().replace(/\?$/, "");
    }
    catch {
        return url;
    }
}
function mapRowToCandidate(row) {
    const brand = one(row.brands);
    const page = one(row.pages);
    const keyword = one(row.keywords);
    if (!brand)
        return null;
    const auditType = mapAuditType(row.cro_readiness_level);
    if (!auditType)
        return null;
    if (auditType === "EXACT_PAID_FUNNEL" && row.cro_ready !== true)
        return null;
    if (auditType === "EXACT_PAID_FUNNEL" && row.paid_confirmed !== true)
        return null;
    const domain = brand.normalized_domain;
    const rawTarget = row.landing_url ??
        row.resolved_url ??
        page?.final_url ??
        page?.url;
    if (!rawTarget)
        return null;
    return {
        opportunityId: row.id,
        brandId: row.brand_id,
        domain,
        auditType,
        croReadinessLevel: row.cro_readiness_level ?? null,
        croAuditEligible: Boolean(row.cro_audit_eligible),
        landingUrl: row.landing_url,
        resolvedUrl: row.resolved_url,
        targetUrl: cleanTargetUrl(rawTarget),
        pageId: page?.id ?? row.resolved_page_id,
        productName: page?.product_name ?? null,
        productBrand: page?.product_brand ?? null,
        price: page?.price != null ? Number(page.price) : null,
        currency: page?.currency ?? null,
        reviewCount: page?.review_count != null ? Number(page.review_count) : null,
        rating: page?.rating != null ? Number(page.rating) : null,
        productResolutionConfidence: page?.product_resolution_confidence != null
            ? Number(page.product_resolution_confidence)
            : row.product_resolution_confidence != null
                ? Number(row.product_resolution_confidence)
                : null,
        adHeadline: row.ad_headline,
        adDescription: row.ad_description,
        paidSignalType: row.paid_signal_type,
        paidConfirmed: Boolean(row.paid_confirmed),
        confirmedGoogleAdvertiser: Boolean(brand.confirmed_google_advertiser),
        keyword: keyword?.keyword ?? null,
        category: keyword?.category ?? null,
        confirmationSource: brand.confirmation_source ?? null,
        platform: brand.platform ?? null,
        platformCandidate: brand.platform_candidate ?? null,
        businessType: brand.business_type ?? null,
        maturity: brand.business_maturity_score != null
            ? Number(brand.business_maturity_score)
            : null,
        retailerScale: brand.retailer_scale_score != null ? Number(brand.retailer_scale_score) : null,
        sourceQualityScore: row.source_quality_score != null ? Number(row.source_quality_score) : null,
        groundTruthSourceType: row.ground_truth_source_type ?? null,
        sourceType: row.source_type ?? null,
        manualExcluded: Boolean(brand.manual_excluded),
        leadEligible: Boolean(brand.lead_eligible),
        exactPaidEvidence: auditType === "EXACT_PAID_FUNNEL" &&
            (row.ground_truth_source_type === "LABS_PAID_KEYWORD" ||
                row.ground_truth_source_type === "GOOGLE_SEARCH_PAID_EXACT" ||
                Boolean(row.landing_url)),
    };
}
const OPPORTUNITY_SELECT = `
  id, brand_id, landing_url, resolved_url, resolved_page_id, ad_headline, ad_description,
  paid_signal_type, paid_confirmed, product_resolution_confidence, last_audited_at,
  cro_ready, cro_readiness_level, cro_audit_eligible, source_quality_score, ground_truth_source_type, source_type,
  cro_audit_status,
  brands!inner (
    id, normalized_domain, lead_eligible, platform, platform_candidate, business_type,
    business_maturity_score, retailer_scale_score, confirmation_source,
    confirmed_google_advertiser, transparency_confirmed, manual_excluded, eligibility_status
  ),
  pages (
    id, product_name, product_brand, price, currency, review_count, rating, final_url, url,
    product_resolution_confidence
  ),
  keywords!opportunities_keyword_id_fkey ( keyword, category )
`;
export async function loadAuditCandidates(client, limit, preferredDomains) {
    const { data, error } = await client
        .from("opportunities")
        .select(OPPORTUNITY_SELECT)
        .eq("brands.lead_eligible", true)
        .eq("brands.eligibility_status", "LEAD_ELIGIBLE")
        .eq("brands.manual_excluded", false)
        .in("cro_readiness_level", ["EXACT_PAID_FUNNEL", "HIGH_CONFIDENCE_TARGET"])
        .order("last_seen_at", { ascending: false });
    if (error)
        throw new Error(error.message);
    const mapped = [];
    for (const row of data ?? []) {
        if (row.last_audited_at && process.env.CRO_AUDIT_FORCE_REAUDIT !== "true") {
            continue;
        }
        const candidate = mapRowToCandidate(row);
        if (candidate)
            mapped.push(candidate);
    }
    const preferred = preferredDomains
        .map((domain) => mapped.find((c) => c.domain === domain))
        .filter((c) => Boolean(c));
    const preferredIds = new Set(preferred.map((c) => c.opportunityId));
    const rest = mapped.filter((c) => !preferredIds.has(c.opportunityId));
    const seenDomains = new Set(preferred.map((c) => c.domain));
    const uniqueRest = [];
    for (const c of rest) {
        if (seenDomains.has(c.domain))
            continue;
        seenDomains.add(c.domain);
        uniqueRest.push(c);
    }
    return [...preferred, ...uniqueRest].slice(0, limit);
}
/** Technical failures only — never re-runs COMPLETED valid audits. */
export async function loadRetryAuditCandidates(client, limit) {
    const { data, error } = await client
        .from("opportunities")
        .select(OPPORTUNITY_SELECT)
        .eq("brands.lead_eligible", true)
        .eq("brands.manual_excluded", false)
        .in("cro_audit_status", ["NEEDS_RETRY", "FAILED_TECHNICAL", "BLOCKED"])
        .in("cro_readiness_level", ["EXACT_PAID_FUNNEL", "HIGH_CONFIDENCE_TARGET"])
        .order("updated_at", { ascending: true })
        .limit(limit);
    if (error)
        throw new Error(error.message);
    const mapped = [];
    for (const row of data ?? []) {
        const candidate = mapRowToCandidate(row);
        if (candidate)
            mapped.push(candidate);
    }
    return mapped;
}
export async function loadAuditCandidateById(client, opportunityId) {
    const { data, error } = await client
        .from("opportunities")
        .select(OPPORTUNITY_SELECT)
        .eq("id", opportunityId)
        .maybeSingle();
    if (error)
        throw new Error(error.message);
    if (!data)
        return null;
    return mapRowToCandidate(data);
}
export async function auditOpportunity(env, client, candidate, runId) {
    const errors = [];
    const targetUrl = candidate.targetUrl;
    if (!targetUrl) {
        return {
            opportunityId: candidate.opportunityId,
            domain: candidate.domain,
            skipped: true,
            skipReason: "no_target_url",
            anthropicCost: 0,
            errors: ["No target URL"],
        };
    }
    await client
        .from("opportunities")
        .update({
        cro_audit_status: "IN_PROGRESS",
        updated_at: new Date().toISOString(),
    })
        .eq("id", candidate.opportunityId);
    const keywordIntent = classifyKeywordIntent({
        keyword: candidate.keyword,
        domain: candidate.domain,
        productName: candidate.productName,
    });
    const brandAlias = detectBrandAliasMismatch({
        keyword: candidate.keyword,
        adHeadline: candidate.adHeadline,
        domain: candidate.domain,
    });
    /** CRO-ready confirmed targets may be commercially scoreable even if legacy lead_eligible is stale. */
    const commercialLeadEligible = candidate.leadEligible ||
        (candidate.croAuditEligible &&
            candidate.confirmedGoogleAdvertiser &&
            !candidate.manualExcluded);
    const capture = await captureOpportunityScreenshots({
        supabase: client,
        bucket: env.CRO_SCREENSHOT_BUCKET,
        brandId: candidate.brandId,
        opportunityId: candidate.opportunityId,
        url: targetUrl,
        timeoutMs: env.CRAWLER_TIMEOUT_MS,
        maxRetries: env.AUDIT_PAGE_MAX_RETRIES,
        retryDelayMs: env.AUDIT_RETRY_DELAY_MS,
    });
    errors.push(...capture.errors);
    const extracted = extractProductMerchantSignals(capture.html, capture.finalUrl || targetUrl);
    const productBrand = extracted.productBrand ?? candidate.productBrand;
    const productName = extracted.productName ?? candidate.productName;
    const merchant = classifyProductMerchantRelationship({
        productBrand,
        productName,
        shopName: extracted.shopName,
        domain: candidate.domain,
        businessType: candidate.businessType,
        pageTitle: extracted.pageTitle,
        adHeadline: candidate.adHeadline,
    });
    merchant.evidence.push(...extracted.evidence);
    const health = assessPageHealth({
        html: capture.html,
        finalUrl: capture.finalUrl || targetUrl,
        httpStatus: capture.httpStatus,
        captureErrors: capture.errors,
        hasMobileScreenshot: Boolean(capture.paths.mobile),
        hasDesktopScreenshot: Boolean(capture.paths.desktop),
    });
    const allowClaude = health.allowClaudeAudit &&
        (health.status === "HEALTHY" ||
            (health.status === "PARTIAL" &&
                health.confidence >= env.AUDIT_PARTIAL_MIN_CONFIDENCE));
    const representation = buildPageRepresentation({
        html: capture.html,
        url: capture.finalUrl || targetUrl,
        advertisement: {
            keyword: candidate.keyword,
            category: candidate.category,
            headline: candidate.adHeadline,
            description: candidate.adDescription,
            originalLandingUrl: candidate.landingUrl,
            paidSignalType: candidate.paidSignalType,
            confirmationSource: candidate.confirmationSource,
        },
        business: {
            domain: candidate.domain,
            platform: candidate.platform,
            platformCandidate: candidate.platformCandidate,
            businessType: candidate.businessType,
            maturity: candidate.maturity,
            retailerScale: candidate.retailerScale,
            confirmedPaid: candidate.paidConfirmed,
            confirmedGoogleAdvertiser: candidate.confirmedGoogleAdvertiser,
            productPrice: candidate.price,
            reviewCount: candidate.reviewCount,
        },
        source: {
            auditType: candidate.auditType,
            sourceQuality: candidate.sourceQualityScore,
            keyword: candidate.keyword,
            keywordIntent: keywordIntent.intent,
            exactPaidEvidence: candidate.exactPaidEvidence,
        },
        knownProduct: {
            name: productName,
            price: candidate.price,
            currency: candidate.currency,
            reviewCount: candidate.reviewCount,
            rating: candidate.rating,
        },
    });
    const now = new Date().toISOString();
    const commercialFieldsBase = {
        product_merchant_relationship: merchant.relationship,
        product_merchant_relationship_confidence: merchant.confidence,
        product_merchant_relationship_evidence: merchant.evidence,
    };
    if (!allowClaude) {
        const failureStatus = health.failureAuditStatus ?? "NEEDS_RETRY";
        const invalidReason = /520|521|522|cloudflare|challenge/i.test(`${health.reason} ${health.signatures.join(" ")}`)
            ? health.status === "CHALLENGE"
                ? "cloudflare_challenge"
                : /520/.test(`${health.reason} ${JSON.stringify(health.evidence)}`)
                    ? "cloudflare_error_520"
                    : "cloudflare_or_bot_block"
            : `page_health_${health.status.toLowerCase()}`;
        const mmFitEarly = computeMeneerMarketingFit({
            platform: candidate.platform,
            platformCandidate: candidate.platformCandidate,
            businessType: candidate.businessType,
            businessMaturityScore: candidate.maturity,
            retailerScaleScore: candidate.retailerScale,
            confirmedGoogleAdvertiser: candidate.confirmedGoogleAdvertiser,
            paidConfirmed: candidate.paidConfirmed,
            productPrice: candidate.price,
            reviewCount: candidate.reviewCount,
            hasExactProductTarget: candidate.auditType === "HIGH_CONFIDENCE_PRODUCT_TARGET",
            manualExcluded: candidate.manualExcluded,
            leadEligible: commercialLeadEligible,
            productMerchantRelationship: merchant.relationship,
            fullRebuildPotential: null,
        });
        const { data: auditRow, error: insertError } = await client
            .from("audits")
            .insert({
            opportunity_id: candidate.opportunityId,
            brand_id: candidate.brandId,
            page_id: candidate.pageId,
            run_id: runId,
            status: failureStatus,
            error_message: health.reason,
            screenshot_paths: capture.paths,
            page_representation: representation,
            page_content_hash: null,
            audit_version: CRO_AUDIT_VERSION,
            audit_type: candidate.auditType,
            keyword_intent: keywordIntent.intent,
            keyword_intent_confidence: keywordIntent.confidence,
            keyword_intent_reason: keywordIntent.reason,
            meneer_marketing_fit_score: mmFitEarly.score,
            audit_valid: false,
            invalid_reason: invalidReason,
            audit_confidence: 0,
            opportunity_score: null,
            opportunity_verdict: verdictForFailedAudit(failureStatus),
            cro_scores: {},
            conversion_leaks: [],
            strengths: [],
            page_health_status: health.status,
            page_health_confidence: health.confidence,
            page_health_reason: health.reason,
            page_health_evidence: health.evidence,
            screenshot_quality: health.screenshotQuality,
            brand_alias_mismatch: brandAlias.detected,
            brand_alias_evidence: brandAlias,
            ...commercialFieldsBase,
            pdp_improvement_potential: null,
            full_rebuild_potential: null,
            recommended_project_type: null,
            recommended_project_reason: null,
            audited_at: now,
            updated_at: now,
        })
            .select("id")
            .single();
        if (insertError) {
            throw new Error(`Failed to save technical audit: ${insertError.message}`);
        }
        await client
            .from("opportunities")
            .update({
            opportunity_score: null,
            opportunity_verdict: verdictForFailedAudit(failureStatus),
            audit_confidence: 0,
            cro_gap: null,
            ad_landing_gap: null,
            rebuild_potential: null,
            ad_landing_match_quality: null,
            audit_type: candidate.auditType,
            keyword_intent: keywordIntent.intent,
            keyword_intent_confidence: keywordIntent.confidence,
            meneer_marketing_fit_score: mmFitEarly.score,
            cro_audit_status: failureStatus,
            page_health_status: health.status,
            page_health_reason: health.reason,
            screenshot_quality: health.screenshotQuality,
            brand_alias_mismatch: brandAlias.detected,
            brand_alias_note: brandAlias.detected ? brandAlias.reason : null,
            ...commercialFieldsBase,
            pdp_improvement_potential: null,
            full_rebuild_potential: null,
            recommended_project_type: null,
            recommended_project_reason: null,
            last_audited_at: now,
            latest_audit_id: auditRow.id,
            updated_at: now,
        })
            .eq("id", candidate.opportunityId);
        logger.warn("CRO audit gated: unhealthy page (no Anthropic call)", {
            domain: candidate.domain,
            pageHealth: health.status,
            reason: health.reason,
            croAuditStatus: failureStatus,
            productMerchant: merchant.relationship,
        });
        return {
            opportunityId: candidate.opportunityId,
            domain: candidate.domain,
            skipped: false,
            opportunityScore: null,
            meneerMarketingFitScore: mmFitEarly.score,
            verdict: verdictForFailedAudit(failureStatus),
            auditConfidence: 0,
            auditType: candidate.auditType,
            keywordIntent: keywordIntent.intent,
            croAuditStatus: failureStatus,
            pageHealthStatus: health.status,
            productMerchantRelationship: merchant.relationship,
            anthropicCost: 0,
            errors: [...errors, health.reason],
        };
    }
    const contentHash = hashPageContent(capture.html, JSON.stringify(representation));
    if (!env.CRO_AUDIT_FORCE_REAUDIT) {
        const { data: existing } = await client
            .from("audits")
            .select("id")
            .eq("opportunity_id", candidate.opportunityId)
            .eq("audit_version", CRO_AUDIT_VERSION)
            .eq("page_content_hash", contentHash)
            .eq("status", "COMPLETED")
            .eq("audit_valid", true)
            .maybeSingle();
        if (existing?.id) {
            await client
                .from("opportunities")
                .update({ cro_audit_status: "COMPLETED", updated_at: now })
                .eq("id", candidate.opportunityId);
            return {
                opportunityId: candidate.opportunityId,
                domain: candidate.domain,
                skipped: true,
                skipReason: "unchanged_page_hash",
                croAuditStatus: "COMPLETED",
                pageHealthStatus: health.status,
                productMerchantRelationship: merchant.relationship,
                anthropicCost: 0,
                errors,
            };
        }
    }
    const buffers = await downloadScreenshotBuffers(client, env.CRO_SCREENSHOT_BUCKET, {
        mobile: capture.paths.mobile,
        desktop: capture.paths.desktop,
        fullMobile: null,
        fullDesktop: null,
    });
    const cro = await runCroAuditWithClaude({
        env,
        auditType: candidate.auditType,
        representation,
        screenshots: buffers,
    });
    if (candidate.auditType === "HIGH_CONFIDENCE_PRODUCT_TARGET") {
        cro.ai.scores.ad_landing_match_quality = null;
        cro.ai.ad_landing_analysis = null;
    }
    const findingValidations = validateConversionLeaks({
        leaks: cro.ai.conversion_leaks,
        pageRepresentation: representation,
        adHeadline: candidate.adHeadline,
        productName,
        keyword: candidate.keyword,
    }).map((v) => {
        if (candidate.auditType === "HIGH_CONFIDENCE_PRODUCT_TARGET" &&
            /\b(ad[-\s]?landing|advertentiebelofte|advertentie|message match|paid landing)\b/i.test(v.title)) {
            return {
                ...v,
                status: "UNSUPPORTED",
                reason: "Ad/landing claim not allowed for HIGH_CONFIDENCE_PRODUCT_TARGET",
            };
        }
        return v;
    });
    cro.ai.conversion_leaks = cro.ai.conversion_leaks.filter((leak) => {
        const v = findingValidations.find((f) => f.title === leak.title);
        return !v || v.status !== "UNSUPPORTED";
    });
    const hasProductPage = candidate.auditType === "HIGH_CONFIDENCE_PRODUCT_TARGET" ||
        /\/products?\//i.test(targetUrl) ||
        Boolean(productName);
    const score = computeOpportunityScore({
        auditType: candidate.auditType,
        ai: cro.ai,
        confirmedPaid: candidate.paidConfirmed,
        confirmedGoogleAdvertiser: candidate.confirmedGoogleAdvertiser,
        paidSignalType: candidate.paidSignalType,
        businessMaturityScore: candidate.maturity,
        retailerScaleScore: candidate.retailerScale,
        platform: candidate.platform,
        platformCandidate: candidate.platformCandidate,
        productPrice: candidate.price,
        reviewCount: candidate.reviewCount,
        hasProductPage: candidate.auditType === "EXACT_PAID_FUNNEL" ? true : hasProductPage,
        sourceQualityScore: candidate.sourceQualityScore,
        sourceType: candidate.groundTruthSourceType ?? candidate.sourceType,
        keywordIntent: keywordIntent.intent,
    });
    const fullRebuildPotential = Math.round(clamp0to100(cro.ai.custom_shopify_rebuild_potential));
    const pdpImprovementPotential = Math.round(clamp0to100(cro.ai.pdp_improvement_potential));
    const mmFit = computeMeneerMarketingFit({
        platform: candidate.platform,
        platformCandidate: candidate.platformCandidate,
        businessType: candidate.businessType,
        businessMaturityScore: candidate.maturity,
        retailerScaleScore: candidate.retailerScale,
        confirmedGoogleAdvertiser: candidate.confirmedGoogleAdvertiser,
        paidConfirmed: candidate.paidConfirmed,
        productPrice: candidate.price,
        reviewCount: candidate.reviewCount,
        hasExactProductTarget: candidate.auditType === "HIGH_CONFIDENCE_PRODUCT_TARGET",
        manualExcluded: candidate.manualExcluded,
        leadEligible: commercialLeadEligible,
        productMerchantRelationship: merchant.relationship,
        fullRebuildPotential,
    });
    const project = recommendProjectType({
        platform: candidate.platform,
        platformCandidate: candidate.platformCandidate,
        businessType: candidate.businessType,
        productRelationship: merchant.relationship,
        fullRebuildPotential,
        pdpImprovementPotential,
        mmFitScore: mmFit.score,
        manualExcluded: candidate.manualExcluded,
        retailerScale: candidate.retailerScale,
    });
    const salesAngle = buildInternalSalesAngle({
        domain: candidate.domain,
        platform: candidate.platform ?? candidate.platformCandidate,
        productRelationship: merchant.relationship,
        projectType: project.projectType,
        pdpPotential: pdpImprovementPotential,
        fullRebuildPotential,
        aiSalesAngle: cro.ai.sales_angle,
        confirmedAdvertiser: candidate.confirmedGoogleAdvertiser,
    });
    const baseConfidence = computeAuditConfidence({
        auditType: candidate.auditType,
        hasProductPage: candidate.auditType === "EXACT_PAID_FUNNEL"
            ? Boolean(candidate.landingUrl)
            : hasProductPage,
        screenshotOk: Boolean(capture.paths.mobile || capture.paths.desktop),
        hasAdCopy: Boolean(candidate.adHeadline || candidate.adDescription),
        productResolutionConfidence: candidate.productResolutionConfidence,
        representationSparse: !representation.aboveTheFold.productTitle &&
            representation.page.benefits.length === 0,
        blockedHints: false,
        exactPaidEvidence: candidate.exactPaidEvidence,
    });
    const auditConfidence = auditConfidenceFromHealth(health, baseConfidence);
    const adLandingMatchQuality = cro.ai.scores.ad_landing_match_quality;
    const commercialFields = {
        ...commercialFieldsBase,
        pdp_improvement_potential: pdpImprovementPotential,
        full_rebuild_potential: fullRebuildPotential,
        recommended_project_type: project.projectType,
        recommended_project_reason: project.reason,
    };
    const { data: auditRow, error: insertError } = await client
        .from("audits")
        .insert({
        opportunity_id: candidate.opportunityId,
        brand_id: candidate.brandId,
        page_id: candidate.pageId,
        run_id: runId,
        status: "COMPLETED",
        score: score.opportunityScore,
        findings: {
            conversion_leaks: cro.ai.conversion_leaks,
            strengths: cro.ai.strengths,
            sales_angle: salesAngle,
            concept_first_signals: cro.ai.concept_first_signals ?? null,
            audit_target: {
                audited_product_url: targetUrl,
                target_source: "opportunity_target",
                target_confidence: "medium",
            },
        },
        audit_version: cro.auditVersion,
        prompt_version: cro.promptVersion,
        model: cro.model,
        page_content_hash: contentHash,
        audited_at: now,
        anthropic_cost: cro.estimatedCost,
        audit_confidence: auditConfidence,
        opportunity_score: score.opportunityScore,
        opportunity_verdict: score.verdict,
        cro_scores: cro.ai.scores,
        conversion_leaks: cro.ai.conversion_leaks,
        strengths: cro.ai.strengths,
        sales_angle: salesAngle,
        rebuild_potential: score.rebuildPotential,
        ad_landing_analysis: cro.ai.ad_landing_analysis ?? {},
        screenshot_paths: capture.paths,
        page_representation: representation,
        finding_validations: findingValidations,
        audit_type: candidate.auditType,
        keyword_intent: keywordIntent.intent,
        keyword_intent_confidence: keywordIntent.confidence,
        keyword_intent_reason: keywordIntent.reason,
        ad_landing_match_quality: adLandingMatchQuality,
        meneer_marketing_fit_score: mmFit.score,
        audit_valid: true,
        page_health_status: health.status,
        page_health_confidence: health.confidence,
        page_health_reason: health.reason,
        page_health_evidence: health.evidence,
        screenshot_quality: health.screenshotQuality,
        brand_alias_mismatch: brandAlias.detected,
        brand_alias_evidence: brandAlias,
        ...commercialFields,
        scoring_breakdown: {
            auditType: candidate.auditType,
            components: score.components,
            penalty: score.penalty,
            keywordIntentPenalty: score.keywordIntentPenalty,
            formula: score.formula,
            croGap: score.croGap,
            adLandingGap: score.adLandingGap,
            designTrustGap: score.designTrustGap,
            uncappedScore: score.uncappedScore,
            sourceQualityCap: score.sourceQualityCap,
            formulaLines: score.formulaLines,
            meneerMarketingFit: mmFit,
            productMerchant: merchant,
            projectType: project,
            keywordIntent,
            pageHealth: health,
            brandAlias,
        },
        score_formula_breakdown: {
            auditType: candidate.auditType,
            lines: score.formulaLines,
            penalty: score.penalty,
            keywordIntentPenalty: score.keywordIntentPenalty,
            uncappedScore: score.uncappedScore,
            sourceQualityCap: score.sourceQualityCap,
            finalScore: score.opportunityScore,
            verdict: score.verdict,
            meneerMarketingFitScore: mmFit.score,
            productMerchantRelationship: merchant.relationship,
            recommendedProjectType: project.projectType,
        },
        raw_ai_response: { text: cro.rawText.slice(0, 20000) },
        updated_at: now,
    })
        .select("id")
        .single();
    if (insertError) {
        throw new Error(`Failed to save audit: ${insertError.message}`);
    }
    const { error: oppError } = await client
        .from("opportunities")
        .update({
        opportunity_score: score.opportunityScore,
        opportunity_verdict: score.verdict,
        audit_confidence: auditConfidence,
        cro_gap: score.croGap,
        ad_landing_gap: score.adLandingGap,
        rebuild_potential: score.rebuildPotential,
        audit_type: candidate.auditType,
        keyword_intent: keywordIntent.intent,
        keyword_intent_confidence: keywordIntent.confidence,
        ad_landing_match_quality: adLandingMatchQuality,
        meneer_marketing_fit_score: mmFit.score,
        cro_audit_status: "COMPLETED",
        page_health_status: health.status,
        page_health_reason: health.reason,
        screenshot_quality: health.screenshotQuality,
        brand_alias_mismatch: brandAlias.detected,
        brand_alias_note: brandAlias.detected ? brandAlias.reason : null,
        ...commercialFields,
        last_audited_at: now,
        latest_audit_id: auditRow.id,
        updated_at: now,
    })
        .eq("id", candidate.opportunityId);
    if (oppError) {
        throw new Error(`Failed to update opportunity scores: ${oppError.message}`);
    }
    // Persist extracted product brand onto page when missing
    if (candidate.pageId && (productBrand || productName)) {
        const pagePatch = { updated_at: now };
        if (productBrand)
            pagePatch.product_brand = productBrand;
        if (productName)
            pagePatch.product_name = productName;
        await client.from("pages").update(pagePatch).eq("id", candidate.pageId);
    }
    logger.info("Opportunity audited", {
        domain: candidate.domain,
        auditType: candidate.auditType,
        score: score.opportunityScore,
        mmFit: mmFit.score,
        verdict: score.verdict,
        confidence: auditConfidence,
        pageHealth: health.status,
        productMerchant: merchant.relationship,
        projectType: project.projectType,
        brandAlias: brandAlias.detected,
        cost: cro.estimatedCost,
    });
    return {
        opportunityId: candidate.opportunityId,
        domain: candidate.domain,
        skipped: false,
        opportunityScore: score.opportunityScore,
        meneerMarketingFitScore: mmFit.score,
        verdict: score.verdict,
        auditConfidence,
        auditType: candidate.auditType,
        keywordIntent: keywordIntent.intent,
        croAuditStatus: "COMPLETED",
        pageHealthStatus: health.status,
        productMerchantRelationship: merchant.relationship,
        recommendedProjectType: project.projectType,
        pdpImprovementPotential,
        fullRebuildPotential,
        salesAngle,
        anthropicCost: cro.estimatedCost,
        errors,
    };
}
function clamp0to100(value) {
    return Math.min(100, Math.max(0, value));
}
//# sourceMappingURL=auditRunner.js.map