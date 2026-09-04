/**
 * Email provider abstraction — Milestone 8.1.
 * Real prospect sends stay blocked unless OUTREACH_REAL_SEND_ENABLED=true
 * AND all safety gates pass. Test sends always go to OUTREACH_TEST_EMAIL only.
 */
export type ProviderStatus = "READY" | "NOT_CONFIGURED" | "MISCONFIGURED";
export type SendEmailInput = {
    to: string;
    subject: string;
    bodyText: string;
    bodyHtml?: string;
    from?: string;
    replyTo?: string;
};
export type SendEmailResult = {
    ok: boolean;
    provider: string;
    providerStatus: ProviderStatus;
    messageId: string | null;
    error: string | null;
    simulated: boolean;
};
export interface EmailProvider {
    readonly name: string;
    readonly status: ProviderStatus;
    send(input: SendEmailInput): Promise<SendEmailResult>;
}
/** Safe default: never hits a network — used when no provider key is set. */
export declare class NoopEmailProvider implements EmailProvider {
    readonly name = "noop";
    readonly status: ProviderStatus;
    send(_input: SendEmailInput): Promise<SendEmailResult>;
}
export declare class ResendEmailProvider implements EmailProvider {
    private readonly apiKey;
    private readonly fromAddress;
    readonly name = "resend";
    readonly status: ProviderStatus;
    constructor(apiKey: string | null, fromAddress: string | null);
    send(input: SendEmailInput): Promise<SendEmailResult>;
}
export type OutreachSendSafetyInput = {
    status: string;
    doNotContact: boolean;
    manualExcluded: boolean;
    eligibilityStatus?: string | null;
    leadEligible?: boolean | null;
    contactEmail: string | null;
    contactUsable: boolean;
    claimValidationPassed: boolean;
    outreachEligible: boolean;
    realSendEnabled: boolean;
    suppressed: boolean;
    firstTouchAlreadySent: boolean;
    isTestSend: boolean;
    testEmail: string | null;
    /** Live re-check: approval hash still matches current content */
    approvalHashMatches?: boolean;
};
export type OutreachSendSafetyResult = {
    allowed: boolean;
    blockers: string[];
};
export declare function evaluateSendSafety(input: OutreachSendSafetyInput): OutreachSendSafetyResult;
export declare function createEmailProvider(env: {
    RESEND_API_KEY?: string;
    OUTREACH_FROM_EMAIL?: string;
    RESEND_FROM_EMAIL?: string;
}): EmailProvider;
export declare function getOutreachDeliverabilityChecklist(env: {
    RESEND_API_KEY?: string;
    OUTREACH_FROM_EMAIL?: string;
    RESEND_FROM_EMAIL?: string;
    OUTREACH_TEST_EMAIL?: string;
    OUTREACH_REAL_SEND_ENABLED?: boolean | string;
    RESEND_DOMAIN_VERIFIED?: string;
    RESEND_SPF_STATUS?: string;
    RESEND_DKIM_STATUS?: string;
}): Array<{
    key: string;
    label: string;
    status: string;
    detail: string;
}>;
//# sourceMappingURL=emailProvider.d.ts.map