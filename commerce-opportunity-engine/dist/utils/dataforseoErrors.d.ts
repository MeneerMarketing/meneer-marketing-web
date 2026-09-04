export type DataForSeoApiStatus = "SUCCESS" | "PAYMENT_REQUIRED" | "RATE_LIMITED" | "ERROR";
export interface ClassifiedDataForSeoError {
    apiStatus: Exclude<DataForSeoApiStatus, "SUCCESS">;
    message: string;
    httpStatus: number | null;
    /** True when this must NOT overwrite semantic advertiser status. */
    isTechnicalFailure: true;
}
export declare function classifyDataForSeoError(err: unknown): ClassifiedDataForSeoError;
//# sourceMappingURL=dataforseoErrors.d.ts.map