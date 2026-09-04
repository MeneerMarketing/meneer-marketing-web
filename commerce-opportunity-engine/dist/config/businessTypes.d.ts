import type { BusinessClassification, BusinessType } from "../types/signals.js";
/** Overduidelijke domein → business type mapping. Geen uitbreiding met grote retailers als leads. */
export declare const domainBusinessTypes: Record<string, BusinessType>;
export declare function classifyBusinessType(normalizedDomain: string): BusinessClassification;
//# sourceMappingURL=businessTypes.d.ts.map