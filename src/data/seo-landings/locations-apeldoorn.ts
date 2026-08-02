import { withSeoLandingLocation } from "@/lib/seo-landings-location";
import { GOOGLE_ADS_BUREAU } from "@/data/seo-landings/pages/google-ads-bureau";
import { HOGER_IN_GOOGLE } from "@/data/seo-landings/pages/hoger-in-google";
import { SEO_SPECIALIST } from "@/data/seo-landings/pages/seo-specialist";
import { WEBSHOP_LATEN_MAKEN } from "@/data/seo-landings/pages/webshop-laten-maken";
import { WEBSITE_LATEN_MAKEN } from "@/data/seo-landings/pages/website-laten-maken";
import { B2B_PORTAAL_BOUWEN } from "@/data/seo-landings/pages/b2b-portaal-bouwen";
import {
  ONLINE_MARKETING_BUREAU,
  META_ADS_BUREAU,
} from "@/data/seo-landings/pages/national-extra";

const GELDERLAND = "Gelderland";
const APELDOORN = "Apeldoorn";
const SUFFIX = "apeldoorn";

/**
 * HQ-hubs Apeldoorn (P0.4): 8 money pages. Rest 301 via city-prune.ts.
 */
export const SEO_LANDING_APELDOORN_PAGES = [
  withSeoLandingLocation(GOOGLE_ADS_BUREAU, { city: APELDOORN, region: GELDERLAND }, SUFFIX),
  withSeoLandingLocation(SEO_SPECIALIST, { city: APELDOORN, region: GELDERLAND }, SUFFIX),
  withSeoLandingLocation(WEBSITE_LATEN_MAKEN, { city: APELDOORN, region: GELDERLAND }, SUFFIX),
  withSeoLandingLocation(ONLINE_MARKETING_BUREAU, { city: APELDOORN, region: GELDERLAND }, SUFFIX),
  withSeoLandingLocation(WEBSHOP_LATEN_MAKEN, { city: APELDOORN, region: GELDERLAND }, SUFFIX),
  withSeoLandingLocation(META_ADS_BUREAU, { city: APELDOORN, region: GELDERLAND }, SUFFIX),
  withSeoLandingLocation(HOGER_IN_GOOGLE, { city: APELDOORN, region: GELDERLAND }, SUFFIX),
  withSeoLandingLocation(B2B_PORTAAL_BOUWEN, { city: APELDOORN, region: GELDERLAND }, SUFFIX),
] as const;
