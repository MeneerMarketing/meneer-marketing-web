import type { CroAuditType, KeywordIntent } from "../../config/scoringWeights.js";
import type { PageRepresentation } from "../../types/audit.js";
export declare function buildPageRepresentation(input: {
    html: string;
    url: string;
    advertisement: PageRepresentation["advertisement"];
    business: PageRepresentation["business"];
    source: {
        auditType: CroAuditType;
        sourceQuality: number | null;
        keyword: string | null;
        keywordIntent: KeywordIntent | null;
        exactPaidEvidence: boolean;
    };
    knownProduct?: {
        name: string | null;
        price: number | null;
        currency: string | null;
        reviewCount: number | null;
        rating: number | null;
    };
}): PageRepresentation;
//# sourceMappingURL=pageRepresentation.d.ts.map