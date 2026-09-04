import type { BrandQualificationCandidate, BusinessClassificationResult, EcommerceDetectionResult, MaturitySignals, ProductPageResult, QualificationResult } from "../../types/crawler.js";
/**
 * Lead eligibility V2.
 * Flow: crawl → ecommerce → business type → paid → commercial fit → eligible
 */
export declare function qualifyLead(input: {
    candidate: BrandQualificationCandidate;
    crawlStatus: string;
    ecommerce: EcommerceDetectionResult;
    business: BusinessClassificationResult;
    productPage: ProductPageResult;
    maturity: MaturitySignals;
    platform: string;
    platformCandidate: string;
    retailerScaleScore: number;
}): Pick<QualificationResult, "leadEligible" | "qualificationReason" | "qualificationEvidence">;
//# sourceMappingURL=leadQualificationService.d.ts.map