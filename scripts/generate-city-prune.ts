import fs from "node:fs";
import { SEO_CITY_REGISTRY } from "../src/data/seo-landings/city-registry";
import { SEO_LANDING_CANNIBAL_PRIMARY_BY_SLUG } from "../src/data/seo-landings/cannibal-slice1";
import { SEO_LANDING_CITY_PAGES } from "../src/data/seo-landings/locations";

const APELDOORN_KEEP = new Set([
  "google-ads-bureau-apeldoorn",
  "seo-specialist-apeldoorn",
  "website-laten-maken-apeldoorn",
  "online-marketing-bureau-apeldoorn",
  "webshop-laten-maken-apeldoorn",
  "meta-ads-bureau-apeldoorn",
  "hoger-in-google-apeldoorn",
  "b2b-portaal-bouwen-apeldoorn",
]);

const TIER_A_ADS = new Set([
  "amsterdam",
  "rotterdam",
  "utrecht",
  "den-haag",
  "eindhoven",
  "arnhem",
  "nijmegen",
  "groningen",
  "maastricht",
]);

const CITY_SUFFIXES = SEO_CITY_REGISTRY.map((c) => c.slug).sort(
  (a, b) => b.length - a.length,
);

function splitCitySlug(slug: string): { base: string; city: string } | null {
  for (const city of CITY_SUFFIXES) {
    const suffix = `-${city}`;
    if (slug.endsWith(suffix)) {
      return { base: slug.slice(0, -suffix.length), city };
    }
  }
  return null;
}

function isKept(slug: string): boolean {
  const parts = splitCitySlug(slug);
  if (!parts) return false;
  const { base, city } = parts;

  if (city === "apeldoorn") return APELDOORN_KEEP.has(slug);
  if (base === "website-laten-maken") return true;
  if (base === "seo-specialist") return true;
  if (base === "online-marketing-bureau") return true;
  if (base === "google-ads-bureau") return TIER_A_ADS.has(city);
  return false;
}

const THIN_TO_NATIONAL: Record<string, string> = {
  "hoger-in-google": "hoger-in-google",
  "lokale-seo": "lokale-seo",
  "meta-ads-bureau": "meta-ads-bureau",
  "webshop-laten-maken": "webshop-laten-maken",
  "shopify-expert": "shopify-expert",
  "shopify-seo": "shopify-seo",
  "shopify-webshop-laten-maken": "shopify-expert",
  "conversie-optimalisatie": "conversie-optimalisatie",
  "cro-bureau": "conversie-optimalisatie",
  "landing-page-laten-maken": "website-laten-maken",
  "leadgeneratie-website": "website-laten-maken",
  "nextjs-website-laten-maken": "website-laten-maken",
  "core-web-vitals-verbeteren": "website-laten-maken",
  "core-web-vitals": "website-laten-maken",
  "vindbaarheid-ai": "vindbaarheid-ai",
  "chatgpt-vindbaarheid": "vindbaarheid-ai",
  "google-maps-marketing": "lokale-seo",
  "klaviyo-specialist": "e-mailmarketing",
  "marketing-automatisering": "marketing-automatisering",
  "content-marketing-vindbaarheid": "content-marketing-vindbaarheid",
  "e-commerce-marketing": "webshop-laten-maken",
  "ecommerce-specialist": "webshop-laten-maken",
  "b2b-marketing-bureau": "b2b-portaal-bouwen",
  "b2b-portaal-bouwen": "b2b-portaal-bouwen",
  "online-marketing-manager": "online-marketing-bureau",
  "performance-marketing-bureau": "online-marketing-bureau",
  "growth-marketing-bureau": "online-marketing-bureau",
  "marketing-consultant-mkb": "online-marketing-bureau",
  "google-shopping-ads": "google-ads-bureau",
  "tracking-google-analytics": "google-ads-bureau",
  "technische-seo": "seo-specialist",
  "seo-audit": "seo-specialist",
  "linkbuilding-bureau": "seo-specialist",
};

const keptSlugs = new Set(
  SEO_LANDING_CITY_PAGES.map((p) => p.slug).filter(isKept),
);

function destinationFor(slug: string): string {
  const parts = splitCitySlug(slug);
  if (!parts) return "/zoeken";
  const { base, city } = parts;

  if (city === "apeldoorn") {
    const cannibalPrimary = SEO_LANDING_CANNIBAL_PRIMARY_BY_SLUG[base];
    if (cannibalPrimary) {
      const cityHub = `${cannibalPrimary}-apeldoorn`;
      if (APELDOORN_KEEP.has(cityHub)) return `/zoeken/${cityHub}`;
      return `/zoeken/${cannibalPrimary}`;
    }
    if (base === "marketing-bureau") {
      return "/zoeken/online-marketing-bureau-apeldoorn";
    }
    const thin = THIN_TO_NATIONAL[base];
    if (thin) {
      const cityHub = `${thin}-apeldoorn`;
      if (APELDOORN_KEEP.has(cityHub)) return `/zoeken/${cityHub}`;
      return `/zoeken/${thin}`;
    }
    return "/zoeken/online-marketing-bureau-apeldoorn";
  }

  if (base === "marketing-bureau") {
    const om = `online-marketing-bureau-${city}`;
    if (keptSlugs.has(om)) return `/zoeken/${om}`;
    return "/zoeken/online-marketing-bureau";
  }

  const cannibalPrimary = SEO_LANDING_CANNIBAL_PRIMARY_BY_SLUG[base];
  if (cannibalPrimary) {
    const cityHub = `${cannibalPrimary}-${city}`;
    if (keptSlugs.has(cityHub)) return `/zoeken/${cityHub}`;
    return `/zoeken/${cannibalPrimary}`;
  }

  if (base === "google-ads-bureau") {
    return "/zoeken/google-ads-bureau";
  }

  const thin = THIN_TO_NATIONAL[base];
  if (thin) return `/zoeken/${thin}`;

  const website = `website-laten-maken-${city}`;
  if (keptSlugs.has(website)) return `/zoeken/${website}`;
  const seo = `seo-specialist-${city}`;
  if (keptSlugs.has(seo)) return `/zoeken/${seo}`;
  return "/zoeken";
}

const redirects = SEO_LANDING_CITY_PAGES.filter((p) => !isKept(p.slug))
  .map((page) => ({
    source: `/zoeken/${page.slug}`,
    destination: destinationFor(page.slug),
    permanent: true as const,
  }))
  .sort((a, b) => a.source.localeCompare(b.source));

const redirectsLiteral = redirects
  .map(
    (r) =>
      `  {\n    source: ${JSON.stringify(r.source)},\n    destination: ${JSON.stringify(r.destination)},\n    permanent: true,\n  }`,
  )
  .join(",\n");

const keepFn = `export function isKeptSeoLandingCitySlug(slug: string): boolean {
  const citySuffixes = ${JSON.stringify(CITY_SUFFIXES)} as const;
  let base = slug;
  let city = "";
  for (const c of citySuffixes) {
    const suffix = "-" + c;
    if (slug.endsWith(suffix)) {
      base = slug.slice(0, -suffix.length);
      city = c;
      break;
    }
  }
  if (!city) return false;
  if (city === "apeldoorn") return APELDOORN_KEEP_SLUGS.has(slug);
  if (base === "website-laten-maken") return true;
  if (base === "seo-specialist") return true;
  if (base === "online-marketing-bureau") return true;
  if (base === "google-ads-bureau") return TIER_A_GOOGLE_ADS_CITIES.has(city);
  return false;
}
`;

const out = `/**
 * P0.4 city prune redirects — generated ${new Date().toISOString().slice(0, 10)}.
 * Keep rules: Apeldoorn 8 hubs; other cities website+seo (+ existing online-marketing,
 * tier-A google-ads). Regenerate: npx tsx scripts/generate-city-prune.ts
 * (run BEFORE filtering locations, or from a git snapshot with full city inventory).
 */

export const SEO_LANDING_CITY_PRUNE_REDIRECTS = [
${redirectsLiteral}
] as const;

export const APELDOORN_KEEP_SLUGS = new Set(${JSON.stringify([...APELDOORN_KEEP])});

export const TIER_A_GOOGLE_ADS_CITIES = new Set(${JSON.stringify([...TIER_A_ADS])});

${keepFn}`;

fs.writeFileSync("src/data/seo-landings/city-prune.ts", out);
console.log("kept", keptSlugs.size);
console.log("redirects", redirects.length);
console.log("expected total", 55 + keptSlugs.size);
