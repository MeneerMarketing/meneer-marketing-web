export declare function mapWithConcurrency<T, R>(items: T[], concurrency: number, mapper: (item: T, index: number) => Promise<R>): Promise<R[]>;
//# sourceMappingURL=concurrency.d.ts.map