import type { EmailType } from "../../config/outreach.js";
export declare function normalizeEmail(email: string): string;
export declare function classifyEmailType(email: string): EmailType;
export declare function isUsableForOutreach(emailType: EmailType): boolean;
export declare function emailTypePreferenceRank(emailType: EmailType): number;
export declare function emailDomainMatchesBrand(email: string, brandDomain: string): boolean;
//# sourceMappingURL=emailClassification.d.ts.map