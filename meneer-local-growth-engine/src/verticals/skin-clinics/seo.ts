import type { KeywordIntent, KeywordTemplate } from "@/verticals/pilates/seo";

export type { KeywordIntent, KeywordTemplate };

export const skinClinicsSeoKeywordStrategy = {
  languageCode: "nl",
  countryLocationCode: 2528,
  templates: [
    {
      intent: "PRIMARY" as const,
      cluster: "huidkliniek_core",
      pattern: (city: string) => `Huidkliniek ${city}`,
    },
    {
      intent: "SECONDARY" as const,
      cluster: "huidkliniek_core",
      pattern: (city: string) => `Cosmetische kliniek ${city}`,
    },
    {
      intent: "SECONDARY" as const,
      cluster: "huidkliniek_core",
      pattern: (city: string) => `Huidbehandeling ${city}`,
    },
    {
      intent: "SERVICE" as const,
      cluster: "botox",
      requires: ["botox"],
      pattern: (city: string) => `Botox ${city}`,
    },
    {
      intent: "SERVICE" as const,
      cluster: "fillers",
      requires: ["fillers"],
      pattern: (city: string) => `Fillers ${city}`,
    },
    {
      intent: "SERVICE" as const,
      cluster: "laser",
      requires: ["laser"],
      pattern: (city: string) => `Laserbehandeling ${city}`,
    },
    {
      intent: "SERVICE" as const,
      cluster: "hydrafacial",
      requires: ["hydrafacial"],
      pattern: (city: string) => `Hydrafacial ${city}`,
    },
    {
      intent: "SERVICE" as const,
      cluster: "microneedling",
      requires: ["microneedling"],
      pattern: (city: string) => `Microneedling ${city}`,
    },
    {
      intent: "SERVICE" as const,
      cluster: "peeling",
      requires: ["peeling"],
      pattern: (city: string) => `Chemische peeling ${city}`,
    },
    {
      intent: "SERVICE" as const,
      cluster: "huidanalyse",
      requires: ["huidanalyse"],
      pattern: (city: string) => `Huidanalyse ${city}`,
    },
    {
      intent: "DISCOVERY" as const,
      cluster: "intake",
      requires: ["intake"],
      pattern: (city: string) => `Intake huidkliniek ${city}`,
    },
    {
      intent: "SERVICE" as const,
      cluster: "acne",
      requires: ["acne"],
      pattern: (city: string) => `Acne behandeling ${city}`,
    },
    {
      intent: "SERVICE" as const,
      cluster: "pigment",
      requires: ["pigment"],
      pattern: (city: string) => `Pigmentvlekken behandeling ${city}`,
    },
  ] satisfies KeywordTemplate[],
};

export const skinClinicsCityLocations: Record<
  string,
  { location_name: string; location_code?: number }
> = {
  arnhem: { location_name: "Arnhem,Gelderland,Netherlands" },
  nijmegen: { location_name: "Nijmegen,Gelderland,Netherlands" },
  apeldoorn: { location_name: "Apeldoorn,Gelderland,Netherlands" },
  utrecht: { location_name: "Utrecht,Utrecht,Netherlands" },
  amsterdam: { location_name: "Amsterdam,North Holland,Netherlands" },
  rotterdam: { location_name: "Rotterdam,South Holland,Netherlands" },
  "den-haag": { location_name: "The Hague,South Holland,Netherlands" },
  breda: { location_name: "Breda,North Brabant,Netherlands" },
  eindhoven: { location_name: "Eindhoven,North Brabant,Netherlands" },
  antwerpen: { location_name: "Antwerp,Flanders,Belgium" },
  gent: { location_name: "Ghent,Flanders,Belgium" },
  brugge: { location_name: "Bruges,Flanders,Belgium" },
  leuven: { location_name: "Leuven,Flanders,Belgium" },
};
