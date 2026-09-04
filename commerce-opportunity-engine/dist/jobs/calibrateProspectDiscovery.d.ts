/**
 * Milestone 9.3.2 — PROSPECT DISCOVERY CALIBRATION.
 *
 * A small controlled SERP sample over the new archetype keyword families, to
 * prove whether they surface niche brands and focused specialists.
 *
 * Hard boundaries: no CRO audit, no Claude, no concepts, no preview, no contact
 * discovery, no outreach. DataForSEO spend is capped and checked before every
 * call.
 */
import { type ProductArchetypeId } from "../config/idealProductArchetypes.js";
export declare function runProspectDiscoveryCalibration(options?: {
    dryRun?: boolean;
    /** Recompute verdicts from a stored run instead of buying new SERPs. */
    replayRunId?: string;
    /** Re-measure a subset of branches without paying for the others again. */
    branches?: ProductArchetypeId[];
}): Promise<void>;
//# sourceMappingURL=calibrateProspectDiscovery.d.ts.map