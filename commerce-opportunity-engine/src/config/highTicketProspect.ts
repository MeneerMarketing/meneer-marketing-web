/**
 * Milestone 9.4 — HIGH_TICKET_FOCUSED_BRAND.
 *
 * The prospect profile, deliberately written without a branch. We are not
 * looking for "a beauty company" but for a commercial shape:
 *
 *   a small or mid-sized brand, a compact catalog, a product of real value
 *   that needs explaining, decent assets, paid traffic already running, and a
 *   product page that does not yet do any of that justice.
 *
 * SkinComplete is the reference for the shape only. Nothing here filters on
 * its category, its competitors or its products.
 */

export const HIGH_TICKET_PROFILE_VERSION = "HIGH_TICKET_FOCUSED_BRAND_V1" as const;

/**
 * Catalog size bands. A compact assortment is what makes one hero product
 * worth a deep-dive page. Very large catalogs are penalised, never rejected on
 * size alone, because a strong brand with a wide range can still qualify.
 */
export const CATALOG_BANDS = [
  { min: 1, max: 2, score: 55, label: "zeer smal, bedrijf moet zichzelf bewijzen" },
  { min: 3, max: 50, score: 100, label: "ideaal" },
  { min: 51, max: 100, score: 78, label: "bruikbaar" },
  { min: 101, max: 200, score: 46, label: "breed" },
  { min: 201, max: 400, score: 24, label: "te breed" },
  { min: 401, max: 999999, score: 8, label: "catalogusshop" },
] as const;

/**
 * Hero price bands. Price is an economics indicator, never a revenue claim:
 * it says how much room a product page has to argue, and whether a redesign
 * pays for itself.
 */
export const PRICE_BANDS = [
  { min: 500, band: "PREMIUM", score: 100, label: "premium ticket" },
  { min: 120, band: "HIGH", score: 96, label: "hoge productwaarde" },
  { min: 80, band: "MID", score: 78, label: "serieuze productwaarde" },
  { min: 40, band: "LOW", score: 46, label: "lage productwaarde" },
  { min: 0, band: "LOW", score: 22, label: "commodity prijspunt" },
] as const;

export type HeroPriceBand = "LOW" | "MID" | "HIGH" | "PREMIUM" | "UNKNOWN";

/**
 * Company scale. Both ends are wrong: a hobby shop cannot buy the work, a
 * national chain does not need it and will never let one page be rebuilt.
 */
export const COMPANY_SCALE = {
  /** Retailer breadth above this reads as chain behaviour. */
  chainBreadthLimit: 45,
  /** Retail scale above this is a national or international retailer. */
  largeRetailerScale: 55,
  /** Maturity below this is an amateur shop, not a business. */
  amateurMaturity: 30,
  /** Maturity above this plus wide reach is a mature international player. */
  matureBusiness: 78,
  /** Fewer homepage product links than this on a webshop reads as unfinished. */
  minHomepageProductLinks: 3,
} as const;

/** Weights for high_ticket_focused_fit_score. They sum to 1. */
export const HIGH_TICKET_FIT_WEIGHTS = {
  productValue: 0.18,
  heroProminence: 0.12,
  catalogCompactness: 0.14,
  ownBrand: 0.14,
  companyScaleFit: 0.12,
  assetReadiness: 0.1,
  deepDiveFit: 0.1,
  currentPdpWeakness: 0.1,
} as const;

/**
 * Penalties. Everything here answers the same question: is this a brand with a
 * product, or a shop with an assortment?
 */
export const HIGH_TICKET_PENALTIES = {
  massRetailer: 40,
  largeCatalog: 18,
  resellerHeavy: 20,
  commodityPrice: 16,
  alreadyPolishedPdp: 22,
  weakBusiness: 18,
  unverifiedCatalog: 8,
  noAdsEvidence: 10,
} as const;

export const HIGH_TICKET_THRESHOLDS = {
  /** Below this a domain is not worth manual review. */
  seriousCandidate: 58,
  /** Own-brand signal below this reads as reseller. */
  minOwnBrandSignal: 45,
  /** Hero price we prefer, without rejecting below it. */
  preferredMinHeroPrice: 80,
  /** Hard floor: under this the project economics never work. */
  hopelessHeroPrice: 25,
} as const;

/**
 * Estimated contrast ceiling, computed before any Claude call.
 *
 * The M9.3.4 run proved the expensive lesson: a shop with a already-polished
 * product page cannot produce a convincing before/after, and finding that out
 * costs a full audit. These rules approximate the ceiling from signals we
 * already have for free, so we stop paying to learn it.
 */
export const CONTRAST_CEILING_RULES = {
  /** Design target needs this much contrast, so the estimate is judged against it. */
  designTargetContrast: 62,
  /** Weak page plus good material: the estimate may reach this. */
  maxCeiling: 92,
  /** Nothing observed: an honest mid estimate, never a promise. */
  unknownCeiling: 55,
  /** Assets below this cap the ceiling: nothing to build a premium page from. */
  thinAssetReadiness: 45,
  thinAssetCeiling: 48,
  /** A page that already looks finished caps the ceiling hard. */
  strongPdpWeaknessFloor: 35,
  strongPdpCeiling: 40,
} as const;

export function catalogBandFor(size: number | null): { score: number; label: string } {
  if (size == null) return { score: 45, label: "onbekend" };
  for (const band of CATALOG_BANDS) {
    if (size >= band.min && size <= band.max) return { score: band.score, label: band.label };
  }
  return { score: 8, label: "catalogusshop" };
}

export function priceBandFor(price: number | null): {
  band: HeroPriceBand;
  score: number;
  label: string;
} {
  if (price == null || !Number.isFinite(price) || price <= 0) {
    return { band: "UNKNOWN", score: 45, label: "prijs onbekend" };
  }
  for (const band of PRICE_BANDS) {
    if (price >= band.min) {
      return { band: band.band as HeroPriceBand, score: band.score, label: band.label };
    }
  }
  return { band: "LOW", score: 22, label: "commodity prijspunt" };
}
