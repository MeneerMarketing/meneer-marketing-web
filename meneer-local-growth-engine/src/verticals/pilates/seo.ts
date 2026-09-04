export type KeywordIntent = "PRIMARY" | "SECONDARY" | "SERVICE" | "DISCOVERY";

export interface KeywordTemplate {
  intent: KeywordIntent;
  cluster: string;
  /** Requires one of these service types (empty = always) */
  requires?: string[];
  pattern: (city: string) => string;
}

export const pilatesSeoKeywordStrategy = {
  languageCode: "nl",
  /** Netherlands — used as fallback when city location unresolved */
  countryLocationCode: 2528,
  templates: [
    {
      intent: "PRIMARY" as const,
      cluster: "pilates_core",
      pattern: (city: string) => `Pilates ${city}`,
    },
    {
      intent: "SECONDARY" as const,
      cluster: "pilates_core",
      pattern: (city: string) => `Pilates studio ${city}`,
    },
    {
      intent: "SECONDARY" as const,
      cluster: "pilates_core",
      pattern: (city: string) => `Pilates lessen ${city}`,
    },
    {
      intent: "SERVICE" as const,
      cluster: "reformer",
      requires: ["reformer"],
      pattern: (city: string) => `Reformer Pilates ${city}`,
    },
    {
      intent: "SERVICE" as const,
      cluster: "reformer",
      requires: ["reformer"],
      pattern: (city: string) => `Reformer ${city}`,
    },
    {
      intent: "DISCOVERY" as const,
      cluster: "reformer",
      requires: ["reformer"],
      pattern: (city: string) => `Reformer Pilates studio ${city}`,
    },
    {
      intent: "SERVICE" as const,
      cluster: "private",
      requires: ["private"],
      pattern: (city: string) => `Personal Pilates ${city}`,
    },
    {
      intent: "SERVICE" as const,
      cluster: "private",
      requires: ["private"],
      pattern: (city: string) => `Privé Pilates ${city}`,
    },
    {
      intent: "SERVICE" as const,
      cluster: "prenatal",
      requires: ["prenatal"],
      pattern: (city: string) => `Zwangerschap Pilates ${city}`,
    },
    {
      intent: "SERVICE" as const,
      cluster: "prenatal",
      requires: ["prenatal"],
      pattern: (city: string) => `Prenatal Pilates ${city}`,
    },
    {
      intent: "SERVICE" as const,
      cluster: "mat",
      requires: ["mat"],
      pattern: (city: string) => `Mat Pilates ${city}`,
    },
  ] satisfies KeywordTemplate[],
};

/** City name → DataForSEO location_name for local SERP */
export const pilatesCityLocations: Record<
  string,
  { location_name: string; location_code?: number }
> = {
  arnhem: { location_name: "Arnhem,Gelderland,Netherlands" },
  nijmegen: { location_name: "Nijmegen,Gelderland,Netherlands" },
  utrecht: { location_name: "Utrecht,Utrecht,Netherlands" },
  amsterdam: { location_name: "Amsterdam,North Holland,Netherlands" },
  rotterdam: { location_name: "Rotterdam,South Holland,Netherlands" },
  "den-haag": { location_name: "The Hague,South Holland,Netherlands" },
  antwerpen: { location_name: "Antwerp,Flanders,Belgium" },
  gent: { location_name: "Ghent,Flanders,Belgium" },
  brugge: { location_name: "Bruges,Flanders,Belgium" },
  leuven: { location_name: "Leuven,Flanders,Belgium" },
};
