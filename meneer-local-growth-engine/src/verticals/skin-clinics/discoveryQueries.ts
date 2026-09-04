/**
 * Skin clinics vertical — multi-intent discovery queries.
 *
 * Zelfde principe als Pilates: losse hoeken per veld (title / description / category),
 * overlap via deduplicatie, brede categorieën alleen voor dekking.
 */

export type {
  DiscoveryIntentKind,
  DiscoveryQueryIntent,
  CoverageThresholds,
} from "@/verticals/pilates/discoveryQueries";

export {
  intentLabelForCity,
  intentsFromTerms,
} from "@/verticals/pilates/discoveryQueries";

import type {
  CoverageThresholds,
  DiscoveryQueryIntent,
} from "@/verticals/pilates/discoveryQueries";

export const skinClinicsDiscoveryIntents: DiscoveryQueryIntent[] = [
  {
    id: "title-huidkliniek",
    label: "Huidkliniek {city}",
    kind: "TITLE",
    title: "Huidkliniek",
    priority: 1,
  },
  {
    id: "title-cosmetische-kliniek",
    label: "Cosmetische kliniek {city}",
    kind: "TITLE",
    title: "Cosmetische kliniek",
    priority: 2,
  },
  {
    id: "title-skin-clinic",
    label: "Skin clinic {city}",
    kind: "TITLE",
    title: "Skin clinic",
    priority: 3,
  },
  {
    id: "category-skin-care-clinic",
    label: "Huidverzorgingskliniek (Google categorie) {city}",
    kind: "CATEGORY",
    categories: ["skin_care_clinic", "medical_spa"],
    priority: 4,
  },
  {
    id: "desc-botox-fillers",
    label: "Botox en fillers {city}",
    kind: "DESCRIPTION",
    description: "Botox",
    priority: 5,
  },
  {
    id: "desc-laserbehandeling",
    label: "Laserbehandeling {city}",
    kind: "DESCRIPTION",
    description: "Laserbehandeling",
    priority: 6,
  },
  {
    id: "desc-hydrafacial",
    label: "Hydrafacial {city}",
    kind: "DESCRIPTION",
    description: "Hydrafacial",
    priority: 7,
  },
  {
    id: "desc-huidanalyse",
    label: "Huidanalyse {city}",
    kind: "DESCRIPTION",
    description: "Huidanalyse",
    priority: 8,
  },
  {
    id: "title-aesthetic",
    label: "Aesthetic clinic {city}",
    kind: "TITLE",
    title: "Aesthetic",
    priority: 9,
  },
  {
    id: "desc-microneedling",
    label: "Microneedling {city}",
    kind: "DESCRIPTION",
    description: "Microneedling",
    priority: 10,
  },
  {
    id: "category-beauty-broad",
    label: "Schoonheidssalon met behandelingen {city}",
    kind: "CATEGORY",
    categories: ["beauty_salon", "spa"],
    broad: true,
    priority: 11,
  },
];

export const skinClinicsCoverageThresholds: CoverageThresholds = {
  saturationNewRatio: Number(process.env.DISCOVERY_SATURATION_NEW_RATIO ?? 0.05),
  saturationTrailingQueries: Number(process.env.DISCOVERY_SATURATION_TRAILING ?? 2),
  minIntentsForHighConfidence: Number(process.env.DISCOVERY_MIN_INTENTS_HIGH ?? 6),
};
