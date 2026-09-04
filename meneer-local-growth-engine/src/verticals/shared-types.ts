export type DiscoveryScope = "NL" | "VL" | "BOTH";
export type DiscoveryMode = "TEST" | "FULL";

export interface CitySeed {
  slug: string;
  name: string;
  country_code: "NL" | "BE";
  region: string;
  region_group: "NL" | "VL";
  latitude: number;
  longitude: number;
  /** Search radius in km for Business Listings */
  radius_km: number;
}
