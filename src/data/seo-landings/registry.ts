import type { SeoLandingPage } from "@/data/seo-landings/types";
import type { EnrichedSeoLandingPage } from "@/data/seo-landings/enriched-types";
import { SEO_LANDING_CANNIBAL_PRUNE_SLUGS } from "@/data/seo-landings/cannibal-slice1";
import { SEO_LANDING_CANNIBAL_PRUNE_SLUGS_SLICE2 } from "@/data/seo-landings/cannibal-slice2";
import { assertSeoLandingGrowthFreeze } from "@/data/seo-landings/growth-freeze";
import { enrichSeoLandingPage } from "@/lib/seo-landings-enrich";
import { GOOGLE_ADS_BUREAU } from "@/data/seo-landings/pages/google-ads-bureau";
import { HOGER_IN_GOOGLE } from "@/data/seo-landings/pages/hoger-in-google";
import { WEBSITE_LATEN_MAKEN } from "@/data/seo-landings/pages/website-laten-maken";
import { WEBSHOP_LATEN_MAKEN } from "@/data/seo-landings/pages/webshop-laten-maken";
import { SEO_SPECIALIST } from "@/data/seo-landings/pages/seo-specialist";
import { CONTENT_MARKETING_VINDBAARHEID } from "@/data/seo-landings/pages/content-marketing-vindbaarheid";
import { B2B_PORTAAL_BOUWEN } from "@/data/seo-landings/pages/b2b-portaal-bouwen";
import {
  META_ADS_BUREAU,
  ONLINE_MARKETING_BUREAU,
  SHOPIFY_EXPERT,
  GOOGLE_SHOPPING_ADS,
  VINDBAARHEID_AI,
  LANDING_PAGE_LATEN_MAKEN,
  MARKETING_AUTOMATISERING,
} from "@/data/seo-landings/pages/national-extra";
import {
  CONVERSIE_OPTIMALISATIE,
  LOKALE_SEO,
  TECHNISCHE_SEO,
  E_COMMERCE_MARKETING,
  EMAILMARKETING,
  TIKTOK_ADS_BUREAU,
  LEADGENERATIE_WEBSITE,
  WOOCOMMERCE_NAAR_SHOPIFY,
} from "@/data/seo-landings/pages/national-batch2";
import {
  REMARKETING_GOOGLE_ADS,
  SHOPIFY_SEO,
  NEXTJS_WEBSITE_LATEN_MAKEN,
  SEO_AUDIT,
  LINKBUILDING_BUREAU,
  ONLINE_MARKETING_MANAGER,
  PERFORMANCE_MARKETING_BUREAU,
  TRACKING_GOOGLE_ANALYTICS,
} from "@/data/seo-landings/pages/national-batch3";
import {
  SOCIAL_MEDIA_ADVERTISING,
  UGC_MARKETING,
  INFLUENCER_MARKETING_BUREAU,
  B2B_MARKETING_BUREAU,
  PRODUCTPAGINA_SEO,
  GOOGLE_MAPS_MARKETING,
  GROWTH_MARKETING_BUREAU,
  LINKEDIN_ADS_BUREAU,
  KLAVIYO_SPECIALIST,
  CORE_WEB_VITALS,
  MARKETING_CONSULTANT_MKB,
  TRAGE_WEBSITE_DURE_ADS,
} from "@/data/seo-landings/pages/national-batch4";
import {
  GOOGLE_ADS_OF_SEO,
  SHOPIFY_OF_WOOCOMMERCE,
  META_ADS_OF_GOOGLE_ADS,
  BUREAU_OF_FREELANCER_MARKETING,
} from "@/data/seo-landings/pages/national-batch4-vergelijk";
import { NATIONAL_BATCH5_PAGES } from "@/data/seo-landings/pages/national-batch5";
import { SEO_LANDING_CITY_PAGES } from "@/data/seo-landings/locations";

const CANNIBAL_PRUNE = new Set([
  ...SEO_LANDING_CANNIBAL_PRUNE_SLUGS,
  ...SEO_LANDING_CANNIBAL_PRUNE_SLUGS_SLICE2,
]);

/** Nationale hubs minus cannibal secondaries (301 via slice 1 + 2). */
const SEO_LANDING_NATIONAL: readonly SeoLandingPage[] = [
  GOOGLE_ADS_BUREAU,
  HOGER_IN_GOOGLE,
  WEBSITE_LATEN_MAKEN,
  WEBSHOP_LATEN_MAKEN,
  SEO_SPECIALIST,
  CONTENT_MARKETING_VINDBAARHEID,
  B2B_PORTAAL_BOUWEN,
  META_ADS_BUREAU,
  ONLINE_MARKETING_BUREAU,
  SHOPIFY_EXPERT,
  GOOGLE_SHOPPING_ADS,
  VINDBAARHEID_AI,
  LANDING_PAGE_LATEN_MAKEN,
  MARKETING_AUTOMATISERING,
  CONVERSIE_OPTIMALISATIE,
  LOKALE_SEO,
  TECHNISCHE_SEO,
  E_COMMERCE_MARKETING,
  EMAILMARKETING,
  TIKTOK_ADS_BUREAU,
  LEADGENERATIE_WEBSITE,
  WOOCOMMERCE_NAAR_SHOPIFY,
  REMARKETING_GOOGLE_ADS,
  SHOPIFY_SEO,
  NEXTJS_WEBSITE_LATEN_MAKEN,
  SEO_AUDIT,
  LINKBUILDING_BUREAU,
  ONLINE_MARKETING_MANAGER,
  PERFORMANCE_MARKETING_BUREAU,
  TRACKING_GOOGLE_ANALYTICS,
  SOCIAL_MEDIA_ADVERTISING,
  UGC_MARKETING,
  INFLUENCER_MARKETING_BUREAU,
  B2B_MARKETING_BUREAU,
  PRODUCTPAGINA_SEO,
  GOOGLE_MAPS_MARKETING,
  GROWTH_MARKETING_BUREAU,
  LINKEDIN_ADS_BUREAU,
  KLAVIYO_SPECIALIST,
  CORE_WEB_VITALS,
  MARKETING_CONSULTANT_MKB,
  TRAGE_WEBSITE_DURE_ADS,
  GOOGLE_ADS_OF_SEO,
  SHOPIFY_OF_WOOCOMMERCE,
  META_ADS_OF_GOOGLE_ADS,
  BUREAU_OF_FREELANCER_MARKETING,
  ...NATIONAL_BATCH5_PAGES.filter((page) => !CANNIBAL_PRUNE.has(page.slug)),
] as const;

const SEO_LANDING_PAGES: readonly SeoLandingPage[] = [
  ...SEO_LANDING_NATIONAL,
  ...SEO_LANDING_CITY_PAGES,
];

assertSeoLandingGrowthFreeze(SEO_LANDING_PAGES.length);

export function getAllSeoLandingPages(): readonly SeoLandingPage[] {
  return SEO_LANDING_PAGES;
}

export function getSeoLandingBySlug(slug: string): EnrichedSeoLandingPage | undefined {
  const page = SEO_LANDING_PAGES.find((p) => p.slug === slug);
  if (!page) return undefined;
  return enrichSeoLandingPage(page);
}

export function getAllSeoLandingSlugs(): string[] {
  return SEO_LANDING_PAGES.map((page) => page.slug);
}
