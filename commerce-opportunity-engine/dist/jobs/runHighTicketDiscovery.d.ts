/**
 * Milestone 9.4 — HIGH-TICKET FOCUSED BRAND DISCOVERY.
 *
 * Looks for a commercial shape instead of a branch: a small or mid-sized brand
 * with a compact catalog, a product of real value that needs explaining, paid
 * traffic already running, and a product page that does not do any of it
 * justice yet.
 *
 * Hard boundaries: no Claude, no CRO audit, no concept brief, no preview, no
 * contact discovery, no outreach. DataForSEO spend is checked before every
 * call, and the sleep and pet branches stay parked.
 */
export declare function runHighTicketDiscovery(options?: {
    dryRun?: boolean;
    /** Re-derive verdicts from a stored run instead of buying the SERPs again. */
    replayRunId?: string;
    /** Ignore stored screenshot paths and shoot the shortlist again. */
    recaptureScreenshots?: boolean;
}): Promise<void>;
//# sourceMappingURL=runHighTicketDiscovery.d.ts.map