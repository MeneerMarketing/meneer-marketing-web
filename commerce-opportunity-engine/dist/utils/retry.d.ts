export interface RetryOptions {
    maxAttempts: number;
    delayMs: number;
    backoffFactor: number;
    isRetryable?: (error: unknown) => boolean;
}
export declare function withRetry<T>(fn: () => Promise<T>, options: RetryOptions): Promise<T>;
//# sourceMappingURL=retry.d.ts.map