import { z } from "zod";
import type { CroAuditType, KeywordIntent } from "../config/scoringWeights.js";
export declare const CroQualityScoresSchema: z.ZodObject<{
    mobile_cro_quality: z.ZodNumber;
    desktop_cro_quality: z.ZodNumber;
    above_fold_quality: z.ZodNumber;
    product_presentation_quality: z.ZodNumber;
    trust_quality: z.ZodNumber;
    offer_clarity_quality: z.ZodNumber;
    cta_quality: z.ZodNumber;
    social_proof_quality: z.ZodNumber;
    objection_handling_quality: z.ZodNumber;
    product_storytelling_quality: z.ZodNumber;
    ad_landing_match_quality: z.ZodNullable<z.ZodNumber>;
    visual_design_quality: z.ZodNumber;
}, z.core.$strip>;
export declare const ConversionLeakSchema: z.ZodObject<{
    title: z.ZodString;
    severity: z.ZodEnum<{
        MEDIUM: "MEDIUM";
        LOW: "LOW";
        HIGH: "HIGH";
        CRITICAL: "CRITICAL";
    }>;
    evidence: z.ZodString;
    why_it_matters: z.ZodString;
    recommended_fix: z.ZodString;
}, z.core.$strip>;
export declare const StrengthSchema: z.ZodObject<{
    title: z.ZodString;
    evidence: z.ZodString;
}, z.core.$strip>;
export declare const AdLandingAnalysisSchema: z.ZodObject<{
    message_continuity: z.ZodNumber;
    keyword_relevance: z.ZodNumber;
    product_relevance: z.ZodNumber;
    offer_continuity: z.ZodNumber;
    primary_benefit_continuity: z.ZodNumber;
    expectation_match: z.ZodNumber;
    summary: z.ZodString;
}, z.core.$strip>;
export declare const CroAuditAiResponseSchema: z.ZodObject<{
    scores: z.ZodObject<{
        mobile_cro_quality: z.ZodNumber;
        desktop_cro_quality: z.ZodNumber;
        above_fold_quality: z.ZodNumber;
        product_presentation_quality: z.ZodNumber;
        trust_quality: z.ZodNumber;
        offer_clarity_quality: z.ZodNumber;
        cta_quality: z.ZodNumber;
        social_proof_quality: z.ZodNumber;
        objection_handling_quality: z.ZodNumber;
        product_storytelling_quality: z.ZodNumber;
        ad_landing_match_quality: z.ZodNullable<z.ZodNumber>;
        visual_design_quality: z.ZodNumber;
    }, z.core.$strip>;
    conversion_leaks: z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        severity: z.ZodEnum<{
            MEDIUM: "MEDIUM";
            LOW: "LOW";
            HIGH: "HIGH";
            CRITICAL: "CRITICAL";
        }>;
        evidence: z.ZodString;
        why_it_matters: z.ZodString;
        recommended_fix: z.ZodString;
    }, z.core.$strip>>;
    strengths: z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        evidence: z.ZodString;
    }, z.core.$strip>>;
    ad_landing_analysis: z.ZodNullable<z.ZodObject<{
        message_continuity: z.ZodNumber;
        keyword_relevance: z.ZodNumber;
        product_relevance: z.ZodNumber;
        offer_continuity: z.ZodNumber;
        primary_benefit_continuity: z.ZodNumber;
        expectation_match: z.ZodNumber;
        summary: z.ZodString;
    }, z.core.$strip>>;
    sales_angle: z.ZodString;
    custom_shopify_rebuild_potential: z.ZodNumber;
    pdp_improvement_potential: z.ZodNumber;
    evidence_notes: z.ZodOptional<z.ZodString>;
    concept_first_signals: z.ZodOptional<z.ZodObject<{
        buyblock_quality: z.ZodOptional<z.ZodNumber>;
        product_storytelling_depth: z.ZodOptional<z.ZodNumber>;
        media_usage_quality: z.ZodOptional<z.ZodNumber>;
        deep_dive_quality: z.ZodOptional<z.ZodNumber>;
        mobile_purchase_quality: z.ZodOptional<z.ZodNumber>;
        premium_design_perception: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type CroQualityScores = z.infer<typeof CroQualityScoresSchema>;
export type ConversionLeak = z.infer<typeof ConversionLeakSchema>;
export type Strength = z.infer<typeof StrengthSchema>;
export type AdLandingAnalysis = z.infer<typeof AdLandingAnalysisSchema>;
export type CroAuditAiResponse = z.infer<typeof CroAuditAiResponseSchema>;
export interface PageRepresentation {
    url: string;
    aboveTheFold: {
        productTitle: string | null;
        subtitle: string | null;
        price: number | null;
        compareAtPrice: number | null;
        currency: string | null;
        reviews: number | null;
        rating: number | null;
        primaryCta: string | null;
        benefits: string[];
        trust: string[];
        delivery: string | null;
        promotion: string[];
        productMedia: string[];
        shipping: string | null;
        trustBadges: string[];
    };
    page: {
        description: string | null;
        benefits: string[];
        features: string[];
        reviews: string[];
        faq: string[];
        guarantee: string | null;
        shipping: string | null;
        returns: string | null;
        payments: string[];
        comparison: string[];
        beforeAfter: string[];
        ugc: string[];
        testimonials: string[];
    };
    /** @deprecated use `page` — kept for finding-validation blob compatibility */
    pageContent: {
        description: string | null;
        usps: string[];
        features: string[];
        socialProof: string[];
        faq: string[];
        guarantee: string | null;
        shipping: string | null;
        returns: string | null;
        paymentSignals: string[];
        comparisonHints: string[];
    };
    advertisement: {
        keyword: string | null;
        category: string | null;
        headline: string | null;
        description: string | null;
        originalLandingUrl: string | null;
        paidSignalType: string | null;
        confirmationSource: string | null;
    };
    business: {
        domain: string;
        platform: string | null;
        platformCandidate: string | null;
        businessType: string | null;
        maturity: number | null;
        retailerScale: number | null;
        confirmedPaid: boolean;
        confirmedGoogleAdvertiser: boolean;
        productPrice: number | null;
        reviewCount: number | null;
    };
    source: {
        auditType: CroAuditType;
        sourceQuality: number | null;
        keyword: string | null;
        keywordIntent: KeywordIntent | null;
        exactPaidEvidence: boolean;
    };
}
export interface ScreenshotPaths {
    mobile: string | null;
    desktop: string | null;
    fullMobile: string | null;
    fullDesktop: string | null;
}
//# sourceMappingURL=audit.d.ts.map