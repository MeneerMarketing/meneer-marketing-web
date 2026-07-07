import { withSeoLandingLocation } from "@/lib/seo-landings-location";
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
import {
  LOKALE_SEO,
  CONVERSIE_OPTIMALISATIE,
} from "@/data/seo-landings/pages/national-batch2";
import {
  GOOGLE_ADS_SPECIALIST,
  SHOPIFY_SEO,
  ONLINE_MARKETING_MANAGER,
  SEO_UITBESTEDEN,
} from "@/data/seo-landings/pages/national-batch3";
import { DIGITAL_MARKETING_BUREAU } from "@/data/seo-landings/pages/national-batch4";

const GELDERLAND = "Gelderland";

/** Stad-varianten Gelderland: Arnhem, Nijmegen, Veluwe, Achterhoek. */
export const SEO_LANDING_GELDERLAND_PAGES = [
  withSeoLandingLocation(
    GOOGLE_ADS_BUREAU,
    { city: "Arnhem", region: GELDERLAND },
    "arnhem",
  ),
  withSeoLandingLocation(
    GOOGLE_ADS_BUREAU,
    { city: "Nijmegen", region: GELDERLAND },
    "nijmegen",
  ),
  withSeoLandingLocation(
    WEBSITE_LATEN_MAKEN,
    { city: "Ede", region: GELDERLAND },
    "ede",
  ),
  withSeoLandingLocation(
    GOOGLE_ADS_BEHEER,
    { city: "Doetinchem", region: GELDERLAND },
    "doetinchem",
  ),
  withSeoLandingLocation(
    LOKALE_SEO,
    { city: "Zutphen", region: GELDERLAND },
    "zutphen",
  ),
  withSeoLandingLocation(
    WEBSHOP_LATEN_MAKEN,
    { city: "Tiel", region: GELDERLAND },
    "tiel",
  ),
  withSeoLandingLocation(
    META_ADS_BUREAU,
    { city: "Harderwijk", region: GELDERLAND },
    "harderwijk",
  ),
  withSeoLandingLocation(
    DIGITAL_MARKETING_BUREAU,
    { city: "Wageningen", region: GELDERLAND },
    "wageningen",
  ),
  withSeoLandingLocation(
    SHOPIFY_EXPERT,
    { city: "Winterswijk", region: GELDERLAND },
    "winterswijk",
  ),
  withSeoLandingLocation(
    SEO_SPECIALIST,
    { city: "Arnhem", region: GELDERLAND },
    "arnhem",
  ),
  withSeoLandingLocation(
    HOGER_IN_GOOGLE,
    { city: "Nijmegen", region: GELDERLAND },
    "nijmegen",
  ),
  withSeoLandingLocation(
    CONVERSIE_OPTIMALISATIE,
    { city: "Ede", region: GELDERLAND },
    "ede",
  ),
  withSeoLandingLocation(
    SEO_UITBESTEDEN,
    { city: "Doetinchem", region: GELDERLAND },
    "doetinchem",
  ),
  withSeoLandingLocation(
    WEBSITE_LATEN_MAKEN,
    { city: "Zutphen", region: GELDERLAND },
    "zutphen",
  ),
  withSeoLandingLocation(
    SHOPIFY_SEO,
    { city: "Tiel", region: GELDERLAND },
    "tiel",
  ),
  withSeoLandingLocation(
    LANDING_PAGE_LATEN_MAKEN,
    { city: "Culemborg", region: GELDERLAND },
    "culemborg",
  ),
  withSeoLandingLocation(
    ONLINE_MARKETING_MANAGER,
    { city: "Nijmegen", region: GELDERLAND },
    "nijmegen",
  ),
  withSeoLandingLocation(
    LOKALE_SEO,
    { city: "Harderwijk", region: GELDERLAND },
    "harderwijk",
  ),
] as const;
