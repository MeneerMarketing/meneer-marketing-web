/**
 * Discovery Launcher modes. Caps komen uit env — de UI mag geen arbitrary spend
 * doorsturen.
 */

export type DiscoveryLauncherMode = "QUICK" | "STANDARD" | "DEEP";

export type DiscoveryPipelinePhase =
  | "PREPARING"
  | "SEARCHING"
  | "DEDUPLICATING"
  | "QUALIFYING"
  | "WEBSITE_ANALYSIS"
  | "COVERAGE_CHECK"
  | "COMPLETED"
  | "FAILED";

export interface DiscoveryModeConfig {
  mode: DiscoveryLauncherMode;
  label: string;
  description: string;
  maxIntents: number;
  maxResults: number;
  maxCostUsd: number;
  recommended: boolean;
}

function envCost(key: string, fallback: number): number {
  const value = Number(process.env[key]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

export const DISCOVERY_LAUNCHER_MODES: DiscoveryModeConfig[] = [
  {
    mode: "QUICK",
    label: "Quick",
    description: "Kleine queryset, goedkoop, snelle eerste scan.",
    maxIntents: Number(process.env.DISCOVERY_QUICK_MAX_INTENTS ?? 4),
    maxResults: Number(process.env.DISCOVERY_QUICK_MAX_RESULTS ?? 10),
    maxCostUsd: envCost("DISCOVERY_MAX_COST_QUICK", 0.08),
    recommended: false,
  },
  {
    mode: "STANDARD",
    label: "Standard",
    description: "Aanbevolen multi-intent coverage voor één stad.",
    maxIntents: Number(process.env.DISCOVERY_STANDARD_MAX_INTENTS ?? 6),
    maxResults: Number(process.env.DISCOVERY_STANDARD_MAX_RESULTS ?? 15),
    maxCostUsd: envCost("DISCOVERY_MAX_COST_STANDARD", 0.15),
    recommended: true,
  },
  {
    mode: "DEEP",
    label: "Deep",
    description: "Bredere queryset, richting discovery saturation.",
    maxIntents: Number(process.env.DISCOVERY_DEEP_MAX_INTENTS ?? 9),
    maxResults: Number(process.env.DISCOVERY_DEEP_MAX_RESULTS ?? 20),
    maxCostUsd: envCost("DISCOVERY_MAX_COST_DEEP", 0.25),
    recommended: false,
  },
];

export function getDiscoveryModeConfig(
  mode: DiscoveryLauncherMode
): DiscoveryModeConfig {
  const found = DISCOVERY_LAUNCHER_MODES.find((row) => row.mode === mode);
  if (!found) throw new Error(`Onbekende discovery mode: ${mode}`);
  return found;
}

export function estimateDiscoveryCostRange(mode: DiscoveryLauncherMode): {
  minUsd: number;
  maxUsd: number;
  label: string;
} {
  const config = getDiscoveryModeConfig(mode);
  const min = Math.max(0.03, config.maxCostUsd * 0.55);
  return {
    minUsd: min,
    maxUsd: config.maxCostUsd,
    label: `$${min.toFixed(2)} – $${config.maxCostUsd.toFixed(2)}`,
  };
}
