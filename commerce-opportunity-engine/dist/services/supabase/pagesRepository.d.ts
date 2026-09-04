import type { SupabaseClient } from "@supabase/supabase-js";
import type { ProductPageResult } from "../../types/crawler.js";
import type { PageExtractedSignals } from "../../types/crawler.js";
export declare function upsertQualifiedPage(client: SupabaseClient, input: {
    brandId: string;
    url: string;
    finalUrl: string;
    crawlStatus: string;
    productPage: ProductPageResult;
    signals: PageExtractedSignals | null;
    maturityScore: number;
}): Promise<void>;
//# sourceMappingURL=pagesRepository.d.ts.map