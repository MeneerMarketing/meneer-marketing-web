/**
 * Pilates vertical — multi-intent discovery queries (M8.3)
 *
 * DataForSEO Business Listings Search matches on `title`, `description` and
 * `categories` separately. Passing title AND description at the same time
 * narrows results to businesses that carry the term in both fields, which
 * silently hides studios that offer Pilates without "Pilates" in their name.
 *
 * Each intent below is therefore a single, deliberate search angle. Overlap is
 * expected and handled by deduplication; the coverage summary shows how much
 * each extra intent still adds.
 */

export type DiscoveryIntentKind = "TITLE" | "DESCRIPTION" | "CATEGORY";

export interface DiscoveryQueryIntent {
  id: string;
  /** Human label used in the dashboard and reports, `{city}` is replaced. */
  label: string;
  kind: DiscoveryIntentKind;
  title?: string;
  description?: string;
  categories?: string[];
  /**
   * Broad angles can return non-Pilates businesses. Those are counted for
   * coverage but never written to the database.
   */
  broad?: boolean;
  /** Lower number = run earlier. Budget stops cut from the bottom. */
  priority: number;
}

export const pilatesDiscoveryIntents: DiscoveryQueryIntent[] = [
  {
    id: "title-pilates",
    label: "Pilates {city}",
    kind: "TITLE",
    title: "Pilates",
    priority: 1,
  },
  {
    id: "title-pilates-studio",
    label: "Pilates studio {city}",
    kind: "TITLE",
    title: "Pilates studio",
    priority: 2,
  },
  {
    id: "category-pilates-studio",
    label: "Pilates studio (Google categorie) {city}",
    kind: "CATEGORY",
    categories: ["pilates_studio"],
    priority: 3,
  },
  {
    id: "desc-reformer-pilates",
    label: "Reformer Pilates {city}",
    kind: "DESCRIPTION",
    description: "Reformer Pilates",
    priority: 4,
  },
  {
    id: "title-reformer",
    label: "Reformer {city}",
    kind: "TITLE",
    title: "Reformer",
    priority: 5,
  },
  {
    id: "desc-pilates-lessen",
    label: "Pilates lessen {city}",
    kind: "DESCRIPTION",
    description: "Pilates lessen",
    priority: 6,
  },
  {
    id: "desc-classical-pilates",
    label: "Classical Pilates {city}",
    kind: "DESCRIPTION",
    description: "Classical Pilates",
    priority: 7,
  },
  {
    id: "desc-private-pilates",
    label: "Private Pilates {city}",
    kind: "DESCRIPTION",
    description: "Private Pilates",
    priority: 8,
  },
  {
    id: "category-movement-studios",
    label: "Yoga- en bewegingsstudio's met Pilates {city}",
    kind: "CATEGORY",
    categories: ["yoga_studio", "physical_fitness_program"],
    broad: true,
    priority: 9,
  },
];

export interface CoverageThresholds {
  /** Below this share of new uniques a query counts as "no longer adding". */
  saturationNewRatio: number;
  /** Number of trailing queries that must add nothing before we call it saturated. */
  saturationTrailingQueries: number;
  /** Minimum intents that must have run before coverage confidence can be HIGH. */
  minIntentsForHighConfidence: number;
}

export const pilatesCoverageThresholds: CoverageThresholds = {
  saturationNewRatio: Number(process.env.DISCOVERY_SATURATION_NEW_RATIO ?? 0.05),
  saturationTrailingQueries: Number(process.env.DISCOVERY_SATURATION_TRAILING ?? 2),
  minIntentsForHighConfidence: Number(process.env.DISCOVERY_MIN_INTENTS_HIGH ?? 6),
};

export function intentLabelForCity(intent: DiscoveryQueryIntent, city: string): string {
  return intent.label.replace("{city}", city);
}

/** Backward compatible: plain term strings keep the legacy title+description shape. */
export function intentsFromTerms(terms: string[]): DiscoveryQueryIntent[] {
  return terms.map((term, index) => ({
    id: `legacy-${index}-${term.toLowerCase().replace(/\s+/g, "-")}`,
    label: `${term} {city}`,
    kind: "TITLE" as const,
    title: term,
    description: term,
    priority: index + 1,
  }));
}
