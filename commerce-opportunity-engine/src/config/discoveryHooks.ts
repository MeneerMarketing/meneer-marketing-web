/**
 * Discovery hook registry — M9.8.1 primary hook designation.
 */

export type DiscoveryHookId =
  | "PDP_GAP_FIRST"
  | "ORGANIC_BRAND_FIRST"
  | "THIRD_PARTY_BRAND_MINING"
  | "ADS_FIRST";

export type DiscoveryHookStatus = "PRIMARY" | "SECONDARY" | "EXPERIMENTAL";

export const DISCOVERY_HOOKS: Record<
  DiscoveryHookId,
  { label: string; status: DiscoveryHookStatus; milestone: string }
> = {
  PDP_GAP_FIRST: {
    label: "PDP-gap-first harvest",
    status: "PRIMARY",
    milestone: "M9.8 / M9.8.2",
  },
  ORGANIC_BRAND_FIRST: {
    label: "Organic brand-first",
    status: "SECONDARY",
    milestone: "M9.6 / M9.6.1",
  },
  THIRD_PARTY_BRAND_MINING: {
    label: "Third-party brand mining",
    status: "EXPERIMENTAL",
    milestone: "M9.7",
  },
  ADS_FIRST: {
    label: "Ads-first / shopping-first",
    status: "EXPERIMENTAL",
    milestone: "M9.5",
  },
};

export const PRIMARY_DISCOVERY_HOOK: DiscoveryHookId = "PDP_GAP_FIRST";
