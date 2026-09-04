/**
 * Milestone 9.3.3 — FOCUSED PRODUCTION DISCOVERY.
 *
 * Only the product families that earned their place in calibration run here.
 * Every keyword passes a SERP quality gate before it costs a full discovery
 * call, every domain passes the central prospect gate before anything else
 * touches it, and qualification stays cheap: homepage, listing, one hero page.
 *
 * Hard boundaries: no Claude, no CRO audit, no concept brief, no preview, no
 * contact discovery, no outreach. DataForSEO spend is checked before every call.
 */
export declare function runFocusedProductionDiscovery(options?: {
    dryRun?: boolean;
    /** Re-derive verdicts from a stored run instead of buying the SERPs again. */
    replayRunId?: string;
}): Promise<void>;
//# sourceMappingURL=runFocusedProductionDiscovery.d.ts.map