/**
 * Milestone 9.1.2 — ConceptBrief + crawl → Premium DTC view-model.
 * Conversion-first, editorial art direction, no fake claims, no raw scrape chips.
 */
import type { ConceptBrief } from "./conceptBriefGenerator.js";
import type { PilotCrawlResult } from "./pilotAssetCrawl.js";
import type { ProspectTheme } from "./prospectThemeResolver.js";
import type { SectionPlanItem } from "./sectionPlan.js";
export type PreviewLifecycle = "INTERNAL_PREVIEW" | "VISUAL_REVIEW" | "PREVIEW_READY";
export type ContentSource = "SOURCE_CONTENT" | "DERIVED_COPY" | "PLACEHOLDER_REQUIRED";
export type PremiumDtcViewModel = {
    meta: {
        conceptId: string;
        briefId: string;
        brandSlug: string;
        productSlug: string;
        previewSlug: string;
        previewLifecycle: PreviewLifecycle;
        templateFamily: "PREMIUM_DTC";
        templateId: "premium_dtc_a";
        templateVersion: "0.3.0-internal";
        domain: string;
        productUrl: string;
        generatedAt: string;
        omittedSections: Array<{
            section: string;
            reason: string;
        }>;
        sectionVariants: Record<string, string>;
        themeReport: {
            usedFallback: boolean;
            fallbackReason: string | null;
            sourceColors: string[];
            brandAccent: string;
        };
        crawlPages: string[];
        rationale: Array<{
            title: string;
            body: string;
        }>;
        currentScreenshots: Array<{
            url: string;
            kind: string;
        }>;
        assetUsage: Array<{
            section: string;
            assets: string[];
        }>;
        navSource: "SOURCE_CONTENT" | "DERIVED_COPY";
    };
    model: Record<string, unknown>;
};
export declare function buildPremiumDtcViewModel(input: {
    conceptId: string;
    briefId: string;
    brief: ConceptBrief;
    crawl: PilotCrawlResult;
    theme: ProspectTheme;
    sectionPlan: SectionPlanItem[];
}): PremiumDtcViewModel;
//# sourceMappingURL=premiumDtcModelLoader.d.ts.map