/**
 * Milestone 9.1 / 9.1.1 — targeted public crawl for ONE pilot product (+ homepage).
 */
import { type NormalisedBenefit, type NormalisedTrustItem } from "./contentNormalisation.js";
export type MediaKind = "packshot" | "lifestyle" | "feature_graphic" | "app_screen" | "use_case" | "detail" | "comparison" | "logo" | "other";
export type CrawledImage = {
    url: string;
    alt: string | null;
    kind: MediaKind;
    source_url: string;
};
export type CrawledReview = {
    author: string | null;
    rating: number | null;
    text: string;
    source_url: string;
};
export type PilotCrawlResult = {
    productUrl: string;
    homepageUrl: string;
    pagesCrawled: string[];
    title: string | null;
    description: string | null;
    metaDescription: string | null;
    price: number | null;
    compareAtPrice: number | null;
    currency: string | null;
    brandName: string | null;
    rating: number | null;
    reviewCount: number | null;
    availability: string | null;
    images: CrawledImage[];
    logoUrl: string | null;
    brandColors: string[];
    brandAccentCandidates: string[];
    navLabels: string[];
    benefits: NormalisedBenefit[];
    features: Array<{
        title: string;
        body: string;
    }>;
    specs: Array<{
        label: string;
        value: string;
    }>;
    howSteps: Array<{
        title: string;
        body: string;
    }>;
    faqs: Array<{
        question: string;
        answer: string;
    }>;
    reviews: CrawledReview[];
    trustItems: NormalisedTrustItem[];
    socialProofLabel: string | null;
    shippingText: string | null;
    returnsText: string | null;
    guaranteeText: string | null;
    paymentSignals: string[];
    cssColorCandidates: string[];
    fontCandidates: string[];
    rawBodyText: string;
    rawDescriptionHtmlLength: number;
};
export declare function crawlPilotAssets(input: {
    productUrl: string;
    homepageUrl: string;
}): Promise<PilotCrawlResult>;
//# sourceMappingURL=pilotAssetCrawl.d.ts.map