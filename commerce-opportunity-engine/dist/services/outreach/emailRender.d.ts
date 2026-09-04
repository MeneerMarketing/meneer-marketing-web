/**
 * Minimal personal-business HTML for cold outreach.
 * No tracking pixels, no newsletter layout, no shorteners.
 */
export type OutreachHtmlInput = {
    bodyText: string;
    fromName: string;
    websiteUrl: string;
    websiteLabel: string;
    kvkNumber: string | null;
};
/** Convert plain-text body paragraphs to simple HTML. */
export declare function renderOutreachHtml(input: OutreachHtmlInput): string;
export declare function appendTextSignature(body: string, input: {
    fromName: string;
    websiteLabel: string;
    kvkNumber: string | null;
}): string;
export declare const MM_COMPANY: {
    readonly legalName: "Meneer Marketing";
    readonly fromDisplayName: "Meneer Marketing";
    readonly websiteUrl: "https://meneermarketing.nl";
    readonly websiteLabel: "meneermarketing.nl";
    readonly kvkNumber: "42095913";
    readonly yearsActive: 12;
};
//# sourceMappingURL=emailRender.d.ts.map