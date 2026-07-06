import { withSeoLandingLocation } from "@/lib/seo-landings";
import { GOOGLE_ADS_BUREAU } from "@/data/seo-landings/pages/google-ads-bureau";
import { GOOGLE_ADS_BEHEER } from "@/data/seo-landings/pages/google-ads-beheer";
import { HOGER_IN_GOOGLE } from "@/data/seo-landings/pages/hoger-in-google";
import { SEO_SPECIALIST } from "@/data/seo-landings/pages/seo-specialist";
import { WEBSHOP_LATEN_MAKEN } from "@/data/seo-landings/pages/webshop-laten-maken";
import { WEBSITE_LATEN_MAKEN } from "@/data/seo-landings/pages/website-laten-maken";
import {
  ONLINE_MARKETING_BUREAU,
  META_ADS_BUREAU,
  LANDING_PAGE_LATEN_MAKEN,
  SHOPIFY_EXPERT,
} from "@/data/seo-landings/pages/national-extra";
import { LOKALE_SEO, CONVERSIE_OPTIMALISATIE } from "@/data/seo-landings/pages/national-batch2";
import { GOOGLE_ADS_SPECIALIST, SHOPIFY_SEO } from "@/data/seo-landings/pages/national-batch3";
import { DIGITAL_MARKETING_BUREAU } from "@/data/seo-landings/pages/national-batch4";
import { SEO_LANDING_GELDERLAND_PAGES } from "@/data/seo-landings/locations-gelderland";
import { SEO_LANDING_APELDOORN_PAGES } from "@/data/seo-landings/locations-apeldoorn";
import { SEO_LANDING_NEDERLAND_PAGES } from "@/data/seo-landings/locations-nederland";

const BRABANT = "Noord-Brabant";

/** Stad-varianten uit Search Console-data en regio-focus. */
export const SEO_LANDING_CITY_PAGES = [
  withSeoLandingLocation(
    GOOGLE_ADS_BUREAU,
    { city: "Eindhoven", region: BRABANT },
    "eindhoven",
  ),
  withSeoLandingLocation(
    GOOGLE_ADS_BUREAU,
    { city: "Someren", region: BRABANT },
    "someren",
  ),
  withSeoLandingLocation(
    GOOGLE_ADS_BUREAU,
    { city: "Gemert", region: BRABANT },
    "gemert",
  ),
  withSeoLandingLocation(
    GOOGLE_ADS_BEHEER,
    { city: "Eindhoven", region: BRABANT },
    "eindhoven",
  ),
  withSeoLandingLocation(
    HOGER_IN_GOOGLE,
    { city: "Helmond", region: BRABANT },
    "helmond",
  ),
  withSeoLandingLocation(
    SEO_SPECIALIST,
    { city: "Weert", region: "Limburg" },
    "weert",
  ),
  withSeoLandingLocation(
    WEBSHOP_LATEN_MAKEN,
    { city: "Eersel", region: BRABANT },
    "eersel",
  ),
  withSeoLandingLocation(
    WEBSITE_LATEN_MAKEN,
    { city: "Eindhoven", region: BRABANT },
    "eindhoven",
  ),
  withSeoLandingLocation(
    ONLINE_MARKETING_BUREAU,
    { city: "Someren", region: BRABANT },
    "someren",
  ),
  withSeoLandingLocation(
    META_ADS_BUREAU,
    { city: "Helmond", region: BRABANT },
    "helmond",
  ),
  withSeoLandingLocation(
    SHOPIFY_EXPERT,
    { city: "Gemert", region: BRABANT },
    "gemert",
  ),
  withSeoLandingLocation(
    LANDING_PAGE_LATEN_MAKEN,
    { city: "Weert", region: "Limburg" },
    "weert",
  ),
  withSeoLandingLocation(
    LOKALE_SEO,
    { city: "Eersel", region: BRABANT },
    "eersel",
  ),
  withSeoLandingLocation(
    HOGER_IN_GOOGLE,
    { city: "Tilburg", region: BRABANT },
    "tilburg",
  ),
  withSeoLandingLocation(
    HOGER_IN_GOOGLE,
    { city: "Breda", region: BRABANT },
    "breda",
  ),
  withSeoLandingLocation(
    HOGER_IN_GOOGLE,
    { city: "'s-Hertogenbosch", region: BRABANT },
    "den-bosch",
  ),
  withSeoLandingLocation(
    SEO_SPECIALIST,
    { city: "Eindhoven", region: BRABANT },
    "eindhoven",
  ),
  withSeoLandingLocation(
    SEO_SPECIALIST,
    { city: "Tilburg", region: BRABANT },
    "tilburg",
  ),
  withSeoLandingLocation(
    ONLINE_MARKETING_BUREAU,
    { city: "Breda", region: BRABANT },
    "breda",
  ),
  withSeoLandingLocation(
    ONLINE_MARKETING_BUREAU,
    { city: "'s-Hertogenbosch", region: BRABANT },
    "den-bosch",
  ),
  withSeoLandingLocation(
    SHOPIFY_SEO,
    { city: "Eindhoven", region: BRABANT },
    "eindhoven",
  ),
  withSeoLandingLocation(
    CONVERSIE_OPTIMALISATIE,
    { city: "Helmond", region: BRABANT },
    "helmond",
  ),
  withSeoLandingLocation(
    GOOGLE_ADS_SPECIALIST,
    { city: "Tilburg", region: BRABANT },
    "tilburg",
  ),
  withSeoLandingLocation(
    WEBSITE_LATEN_MAKEN,
    { city: "Someren", region: BRABANT },
    "someren",
  ),
  withSeoLandingLocation(
    DIGITAL_MARKETING_BUREAU,
    { city: "Tilburg", region: BRABANT },
    "tilburg",
  ),
  ...SEO_LANDING_GELDERLAND_PAGES,
  ...SEO_LANDING_APELDOORN_PAGES,
  ...SEO_LANDING_NEDERLAND_PAGES,
] as const;
