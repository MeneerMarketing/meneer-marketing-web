import { z } from "zod";
import type { CroAuditType, KeywordIntent } from "../config/scoringWeights.js";

export const CroQualityScoresSchema = z.object({
  mobile_cro_quality: z.number().min(0).max(100),
  desktop_cro_quality: z.number().min(0).max(100),
  above_fold_quality: z.number().min(0).max(100),
  product_presentation_quality: z.number().min(0).max(100),
  trust_quality: z.number().min(0).max(100),
  offer_clarity_quality: z.number().min(0).max(100),
  cta_quality: z.number().min(0).max(100),
  social_proof_quality: z.number().min(0).max(100),
  objection_handling_quality: z.number().min(0).max(100),
  product_storytelling_quality: z.number().min(0).max(100),
  /** NULL for HIGH_CONFIDENCE_PRODUCT_TARGET — not measurable without proven paid landing. */
  ad_landing_match_quality: z.number().min(0).max(100).nullable(),
  visual_design_quality: z.number().min(0).max(100),
});

export const ConversionLeakSchema = z.object({
  title: z.string().min(3).max(200),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  evidence: z.string().min(10).max(1200),
  why_it_matters: z.string().min(10).max(1200),
  recommended_fix: z.string().min(10).max(1200),
});

export const StrengthSchema = z.object({
  title: z.string().min(3).max(200),
  evidence: z.string().min(5).max(800),
});

export const AdLandingAnalysisSchema = z.object({
  message_continuity: z.number().min(0).max(100),
  keyword_relevance: z.number().min(0).max(100),
  product_relevance: z.number().min(0).max(100),
  offer_continuity: z.number().min(0).max(100),
  primary_benefit_continuity: z.number().min(0).max(100),
  expectation_match: z.number().min(0).max(100),
  summary: z.string().min(10).max(1000),
});

export const CroAuditAiResponseSchema = z.object({
  scores: CroQualityScoresSchema,
  conversion_leaks: z.array(ConversionLeakSchema).max(5),
  strengths: z.array(StrengthSchema).max(3),
  ad_landing_analysis: AdLandingAnalysisSchema.nullable(),
  sales_angle: z.string().min(20).max(1200),
  /** Full custom Shopify rebuild potential (0-100). */
  custom_shopify_rebuild_potential: z.number().min(0).max(100),
  /**
   * PDP-only CRO improvement potential (0-100).
   * Distinct from full rebuild — a reseller can score high here and medium on rebuild.
   */
  pdp_improvement_potential: z.number().min(0).max(100),
  evidence_notes: z.string().max(1500).optional(),
  concept_first_signals: z
    .object({
      buyblock_quality: z.number().min(0).max(100).optional(),
      product_storytelling_depth: z.number().min(0).max(100).optional(),
      media_usage_quality: z.number().min(0).max(100).optional(),
      deep_dive_quality: z.number().min(0).max(100).optional(),
      mobile_purchase_quality: z.number().min(0).max(100).optional(),
      premium_design_perception: z.number().min(0).max(100).optional(),
    })
    .optional(),
});

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
