/**
 * Milestone 8.2 — hard Anthropic pre-call budget gate.
 * Never start an API call if current + conservative estimate would exceed cap.
 */
export type BudgetGateInput = {
    currentRunCost: number;
    configuredCap: number;
    /** Conservative max estimated cost for the NEXT call only. */
    conservativeNextCallCost: number;
    label?: string;
};
export type BudgetGateResult = {
    allowed: true;
    remaining: number;
    estimatedAfter: number;
} | {
    allowed: false;
    status: "BUDGET_BLOCKED";
    remaining: number;
    estimatedAfter: number;
    reason: string;
};
/**
 * Personalisation-only calls are tiny. Use a conservative ceiling so we never
 * "discover" an overrun after the fact.
 *
 * Sonnet-class: ~800 in + ~200 out ≈ $0.0054 at $3/$15 per MTok.
 * We reserve $0.012 per call as hard conservative estimate.
 */
export declare const CONSERVATIVE_PERSONALISATION_CALL_COST = 0.012;
export declare function evaluateAnthropicBudgetGate(input: BudgetGateInput): BudgetGateResult;
export declare function assertAnthropicBudgetOrThrow(input: BudgetGateInput): void;
/** Actual Anthropic cost from token usage (Sonnet default rates). */
export declare function estimateAnthropicCostFromUsage(input: {
    inputTokens: number;
    outputTokens: number;
    inputPerMillion?: number;
    outputPerMillion?: number;
}): number;
//# sourceMappingURL=anthropicBudget.d.ts.map