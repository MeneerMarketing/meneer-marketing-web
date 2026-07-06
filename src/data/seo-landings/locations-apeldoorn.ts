import { withSeoLandingLocation } from "@/lib/seo-landings";
import { GOOGLE_ADS_BUREAU } from "@/data/seo-landings/pages/google-ads-bureau";
import { GOOGLE_ADS_BEHEER } from "@/data/seo-landings/pages/google-ads-beheer";
import { HOGER_IN_GOOGLE } from "@/data/seo-landings/pages/hoger-in-google";
import { SEO_SPECIALIST } from "@/data/seo-landings/pages/seo-specialist";
import { WEBSHOP_LATEN_MAKEN } from "@/data/seo-landings/pages/webshop-laten-maken";
import { WEBSITE_LATEN_MAKEN } from "@/data/seo-landings/pages/website-laten-maken";
import { CONTENT_MARKETING_VINDBAARHEID } from "@/data/seo-landings/pages/content-marketing-vindbaarheid";
import { B2B_PORTAAL_BOUWEN } from "@/data/seo-landings/pages/b2b-portaal-bouwen";
import {
  ONLINE_MARKETING_BUREAU,
  META_ADS_BUREAU,
  LANDING_PAGE_LATEN_MAKEN,
  SHOPIFY_EXPERT,
  GOOGLE_SHOPPING_ADS,
  VINDBAARHEID_AI,
  MARKETING_AUTOMATISERING,
  SEA_SPECIALIST,
} from "@/data/seo-landings/pages/national-extra";
import {
  LOKALE_SEO,
  CONVERSIE_OPTIMALISATIE,
  ZOEKMACHINE_OPTIMALISATIE,
  TECHNISCHE_SEO,
  PPC_BUREAU,
  E_COMMERCE_MARKETING,
  LEADGENERATIE_WEBSITE,
} from "@/data/seo-landings/pages/national-batch2";
import {
  GOOGLE_ADS_SPECIALIST,
  GOOGLE_ADS_UITBESTEDEN,
  SHOPIFY_SEO,
  ONLINE_MARKETING_MANAGER,
  SEO_UITBESTEDEN,
  SEO_AUDIT,
  NEXTJS_WEBSITE_LATEN_MAKEN,
  CRO_BUREAU,
  PERFORMANCE_MARKETING_BUREAU,
  TRACKING_GOOGLE_ANALYTICS,
  LINKBUILDING_BUREAU,
} from "@/data/seo-landings/pages/national-batch3";
import {
  DIGITAL_MARKETING_BUREAU,
  CHATGPT_VINDBAARHEID,
  GOOGLE_MAPS_MARKETING,
  WEBDESIGN_BUREAU,
  GROWTH_MARKETING_BUREAU,
  CORE_WEB_VITALS,
  MARKETING_CONSULTANT_MKB,
  B2B_MARKETING_BUREAU,
  ECOMMERCE_SPECIALIST,
  KLAVIYO_SPECIALIST,
} from "@/data/seo-landings/pages/national-batch4";

const GELDERLAND = "Gelderland";
const APELDOORN = "Apeldoorn";
const SUFFIX = "apeldoorn";

/**
 * Thuisbasis Meneer Marketing: brede dekking Apeldoorn + Veluwe + omliggend MKB.
 * Elke slug uniek; enrichment-layer maakt copy per pagina verschillend.
 */
export const SEO_LANDING_APELDOORN_PAGES = [
  withSeoLandingLocation(GOOGLE_ADS_BUREAU, { city: APELDOORN, region: GELDERLAND }, SUFFIX),
  withSeoLandingLocation(GOOGLE_ADS_BEHEER, { city: APELDOORN, region: GELDERLAND }, SUFFIX),
  withSeoLandingLocation(GOOGLE_ADS_SPECIALIST, { city: APELDOORN, region: GELDERLAND }, SUFFIX),
  withSeoLandingLocation(GOOGLE_ADS_UITBESTEDEN, { city: APELDOORN, region: GELDERLAND }, SUFFIX),
  withSeoLandingLocation(GOOGLE_SHOPPING_ADS, { city: APELDOORN, region: GELDERLAND }, SUFFIX),
  withSeoLandingLocation(SEA_SPECIALIST, { city: APELDOORN, region: GELDERLAND }, SUFFIX),
  withSeoLandingLocation(PPC_BUREAU, { city: APELDOORN, region: GELDERLAND }, SUFFIX),
  withSeoLandingLocation(META_ADS_BUREAU, { city: APELDOORN, region: GELDERLAND }, SUFFIX),
  withSeoLandingLocation(ONLINE_MARKETING_BUREAU, { city: APELDOORN, region: GELDERLAND }, SUFFIX),
  withSeoLandingLocation(ONLINE_MARKETING_MANAGER, { city: APELDOORN, region: GELDERLAND }, SUFFIX),
  withSeoLandingLocation(DIGITAL_MARKETING_BUREAU, { city: APELDOORN, region: GELDERLAND }, SUFFIX),
  withSeoLandingLocation(
    PERFORMANCE_MARKETING_BUREAU,
    { city: APELDOORN, region: GELDERLAND },
    SUFFIX,
  ),
  withSeoLandingLocation(
    MARKETING_CONSULTANT_MKB,
    { city: APELDOORN, region: GELDERLAND },
    SUFFIX,
  ),
  withSeoLandingLocation(GROWTH_MARKETING_BUREAU, { city: APELDOORN, region: GELDERLAND }, SUFFIX),
  withSeoLandingLocation(SEO_SPECIALIST, { city: APELDOORN, region: GELDERLAND }, SUFFIX),
  withSeoLandingLocation(HOGER_IN_GOOGLE, { city: APELDOORN, region: GELDERLAND }, SUFFIX),
  withSeoLandingLocation(LOKALE_SEO, { city: APELDOORN, region: GELDERLAND }, SUFFIX),
  withSeoLandingLocation(
    ZOEKMACHINE_OPTIMALISATIE,
    { city: APELDOORN, region: GELDERLAND },
    SUFFIX,
  ),
  withSeoLandingLocation(TECHNISCHE_SEO, { city: APELDOORN, region: GELDERLAND }, SUFFIX),
  withSeoLandingLocation(SEO_AUDIT, { city: APELDOORN, region: GELDERLAND }, SUFFIX),
  withSeoLandingLocation(SEO_UITBESTEDEN, { city: APELDOORN, region: GELDERLAND }, SUFFIX),
  withSeoLandingLocation(LINKBUILDING_BUREAU, { city: APELDOORN, region: GELDERLAND }, SUFFIX),
  withSeoLandingLocation(CHATGPT_VINDBAARHEID, { city: APELDOORN, region: GELDERLAND }, SUFFIX),
  withSeoLandingLocation(VINDBAARHEID_AI, { city: APELDOORN, region: GELDERLAND }, SUFFIX),
  withSeoLandingLocation(GOOGLE_MAPS_MARKETING, { city: APELDOORN, region: GELDERLAND }, SUFFIX),
  withSeoLandingLocation(WEBSITE_LATEN_MAKEN, { city: APELDOORN, region: GELDERLAND }, SUFFIX),
  withSeoLandingLocation(
    NEXTJS_WEBSITE_LATEN_MAKEN,
    { city: APELDOORN, region: GELDERLAND },
    SUFFIX,
  ),
  withSeoLandingLocation(WEBDESIGN_BUREAU, { city: APELDOORN, region: GELDERLAND }, SUFFIX),
  withSeoLandingLocation(WEBSHOP_LATEN_MAKEN, { city: APELDOORN, region: GELDERLAND }, SUFFIX),
  withSeoLandingLocation(SHOPIFY_EXPERT, { city: APELDOORN, region: GELDERLAND }, SUFFIX),
  withSeoLandingLocation(SHOPIFY_SEO, { city: APELDOORN, region: GELDERLAND }, SUFFIX),
  withSeoLandingLocation(ECOMMERCE_SPECIALIST, { city: APELDOORN, region: GELDERLAND }, SUFFIX),
  withSeoLandingLocation(E_COMMERCE_MARKETING, { city: APELDOORN, region: GELDERLAND }, SUFFIX),
  withSeoLandingLocation(CONVERSIE_OPTIMALISATIE, { city: APELDOORN, region: GELDERLAND }, SUFFIX),
  withSeoLandingLocation(CRO_BUREAU, { city: APELDOORN, region: GELDERLAND }, SUFFIX),
  withSeoLandingLocation(
    LANDING_PAGE_LATEN_MAKEN,
    { city: APELDOORN, region: GELDERLAND },
    SUFFIX,
  ),
  withSeoLandingLocation(LEADGENERATIE_WEBSITE, { city: APELDOORN, region: GELDERLAND }, SUFFIX),
  withSeoLandingLocation(CORE_WEB_VITALS, { city: APELDOORN, region: GELDERLAND }, SUFFIX),
  withSeoLandingLocation(
    TRACKING_GOOGLE_ANALYTICS,
    { city: APELDOORN, region: GELDERLAND },
    SUFFIX,
  ),
  withSeoLandingLocation(
    MARKETING_AUTOMATISERING,
    { city: APELDOORN, region: GELDERLAND },
    SUFFIX,
  ),
  withSeoLandingLocation(B2B_MARKETING_BUREAU, { city: APELDOORN, region: GELDERLAND }, SUFFIX),
  withSeoLandingLocation(B2B_PORTAAL_BOUWEN, { city: APELDOORN, region: GELDERLAND }, SUFFIX),
  withSeoLandingLocation(KLAVIYO_SPECIALIST, { city: APELDOORN, region: GELDERLAND }, SUFFIX),
  withSeoLandingLocation(
    CONTENT_MARKETING_VINDBAARHEID,
    { city: APELDOORN, region: GELDERLAND },
    SUFFIX,
  ),
] as const;
