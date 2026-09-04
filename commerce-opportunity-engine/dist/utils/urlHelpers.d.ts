import type { PageType } from "../types/crawler.js";
export declare function normalizeUrl(url: string): string;
export declare function domainHomepage(domain: string): string;
export declare function isSameHost(url: string, domain: string): boolean;
export declare function classifyUrlPageType(url: string): PageType;
export declare function isEcommerceRoute(url: string): boolean;
export declare function keywordTokens(keyword: string | null): string[];
export declare function scoreKeywordMatch(text: string, keyword: string | null): number;
export declare function slugifyTokens(text: string): string;
//# sourceMappingURL=urlHelpers.d.ts.map