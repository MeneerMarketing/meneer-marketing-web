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

export type BudgetGateResult =
  | {
      allowed: true;
      remaining: number;
      estimatedAfter: number;
    }
  | {
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
export const CONSERVATIVE_PERSONALISATION_CALL_COST = 0.012;

export function evaluateAnthropicBudgetGate(
  input: BudgetGateInput
): BudgetGateResult {
  const remaining = Math.max(0, input.configuredCap - input.currentRunCost);
  const estimatedAfter =
    input.currentRunCost + input.conservativeNextCallCost;

  if (estimatedAfter > input.configuredCap + 1e-12) {
    return {
      allowed: false,
      status: "BUDGET_BLOCKED",
      remaining,
      estimatedAfter,
      reason: `Pre-call gate blocked${input.label ? ` (${input.label})` : ""}: current $${input.currentRunCost.toFixed(6)} + estimate $${input.conservativeNextCallCost.toFixed(6)} = $${estimatedAfter.toFixed(6)} > cap $${input.configuredCap.toFixed(6)}`,
    };
  }

  return {
    allowed: true,
    remaining,
    estimatedAfter,
  };
}

export function assertAnthropicBudgetOrThrow(input: BudgetGateInput): void {
  const gate = evaluateAnthropicBudgetGate(input);
  if (!gate.allowed) {
    const err = new Error(gate.reason) as Error & {
      code: "BUDGET_BLOCKED";
      gate: BudgetGateResult;
    };
    err.code = "BUDGET_BLOCKED";
    err.gate = gate;
    throw err;
  }
}

/** Actual Anthropic cost from token usage (Sonnet default rates). */
export function estimateAnthropicCostFromUsage(input: {
  inputTokens: number;
  outputTokens: number;
  inputPerMillion?: number;
  outputPerMillion?: number;
}): number {
  const inRate = input.inputPerMillion ?? 3.0;
  const outRate = input.outputPerMillion ?? 15.0;
  return (
    (input.inputTokens / 1_000_000) * inRate +
    (input.outputTokens / 1_000_000) * outRate
  );
}
