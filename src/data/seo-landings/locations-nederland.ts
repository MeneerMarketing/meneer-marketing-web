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
  SHOPIFY_EXPERT,
  LANDING_PAGE_LATEN_MAKEN,
} from "@/data/seo-landings/pages/national-extra";
import { LOKALE_SEO, CONVERSIE_OPTIMALISATIE } from "@/data/seo-landings/pages/national-batch2";
import {
  GOOGLE_ADS_SPECIALIST,
  ONLINE_MARKETING_MANAGER,
  NEXTJS_WEBSITE_LATEN_MAKEN,
} from "@/data/seo-landings/pages/national-batch3";
import {
  DIGITAL_MARKETING_BUREAU,
  CHATGPT_VINDBAARHEID,
  WEBDESIGN_BUREAU,
  B2B_MARKETING_BUREAU,
} from "@/data/seo-landings/pages/national-batch4";

/** Grote steden en ondernemersregio's in Nederland (buiten bestaande Brabant/Limburg/Gelderland-focus). */
export const SEO_LANDING_NEDERLAND_PAGES = [
  // Randstad & Utrecht
  withSeoLandingLocation(
    GOOGLE_ADS_BUREAU,
    { city: "Amsterdam", region: "Noord-Holland" },
    "amsterdam",
  ),
  withSeoLandingLocation(
    ONLINE_MARKETING_BUREAU,
    { city: "Amsterdam", region: "Noord-Holland" },
    "amsterdam",
  ),
  withSeoLandingLocation(
    SEO_SPECIALIST,
    { city: "Amsterdam", region: "Noord-Holland" },
    "amsterdam",
  ),
  withSeoLandingLocation(
    GOOGLE_ADS_BUREAU,
    { city: "Rotterdam", region: "Zuid-Holland" },
    "rotterdam",
  ),
  withSeoLandingLocation(
    WEBSHOP_LATEN_MAKEN,
    { city: "Rotterdam", region: "Zuid-Holland" },
    "rotterdam",
  ),
  withSeoLandingLocation(
    HOGER_IN_GOOGLE,
    { city: "Rotterdam", region: "Zuid-Holland" },
    "rotterdam",
  ),
  withSeoLandingLocation(
    GOOGLE_ADS_BUREAU,
    { city: "Utrecht", region: "Utrecht" },
    "utrecht",
  ),
  withSeoLandingLocation(
    WEBSITE_LATEN_MAKEN,
    { city: "Utrecht", region: "Utrecht" },
    "utrecht",
  ),
  withSeoLandingLocation(
    CHATGPT_VINDBAARHEID,
    { city: "Utrecht", region: "Utrecht" },
    "utrecht",
  ),
  withSeoLandingLocation(
    GOOGLE_ADS_BUREAU,
    { city: "Den Haag", region: "Zuid-Holland" },
    "den-haag",
  ),
  withSeoLandingLocation(
    ONLINE_MARKETING_MANAGER,
    { city: "Den Haag", region: "Zuid-Holland" },
    "den-haag",
  ),
  withSeoLandingLocation(
    LOKALE_SEO,
    { city: "Den Haag", region: "Zuid-Holland" },
    "den-haag",
  ),
  withSeoLandingLocation(
    ONLINE_MARKETING_BUREAU,
    { city: "Haarlem", region: "Noord-Holland" },
    "haarlem",
  ),
  withSeoLandingLocation(
    META_ADS_BUREAU,
    { city: "Haarlem", region: "Noord-Holland" },
    "haarlem",
  ),
  withSeoLandingLocation(
    WEBSITE_LATEN_MAKEN,
    { city: "Leiden", region: "Zuid-Holland" },
    "leiden",
  ),
  withSeoLandingLocation(
    SEO_SPECIALIST,
    { city: "Leiden", region: "Zuid-Holland" },
    "leiden",
  ),
  withSeoLandingLocation(
    GOOGLE_ADS_SPECIALIST,
    { city: "Almere", region: "Flevoland" },
    "almere",
  ),
  withSeoLandingLocation(
    DIGITAL_MARKETING_BUREAU,
    { city: "Almere", region: "Flevoland" },
    "almere",
  ),
  withSeoLandingLocation(
    ONLINE_MARKETING_BUREAU,
    { city: "Amersfoort", region: "Utrecht" },
    "amersfoort",
  ),
  withSeoLandingLocation(
    GOOGLE_ADS_BEHEER,
    { city: "Amersfoort", region: "Utrecht" },
    "amersfoort",
  ),
  withSeoLandingLocation(
    WEBDESIGN_BUREAU,
    { city: "Delft", region: "Zuid-Holland" },
    "delft",
  ),
  withSeoLandingLocation(
    SHOPIFY_EXPERT,
    { city: "Delft", region: "Zuid-Holland" },
    "delft",
  ),
  // Oost & Noord
  withSeoLandingLocation(
    GOOGLE_ADS_BUREAU,
    { city: "Enschede", region: "Overijssel" },
    "enschede",
  ),
  withSeoLandingLocation(
    SEO_SPECIALIST,
    { city: "Enschede", region: "Overijssel" },
    "enschede",
  ),
  withSeoLandingLocation(
    ONLINE_MARKETING_BUREAU,
    { city: "Zwolle", region: "Overijssel" },
    "zwolle",
  ),
  withSeoLandingLocation(
    HOGER_IN_GOOGLE,
    { city: "Zwolle", region: "Overijssel" },
    "zwolle",
  ),
  withSeoLandingLocation(
    LOKALE_SEO,
    { city: "Deventer", region: "Overijssel" },
    "deventer",
  ),
  withSeoLandingLocation(
    WEBSITE_LATEN_MAKEN,
    { city: "Deventer", region: "Overijssel" },
    "deventer",
  ),
  withSeoLandingLocation(
    GOOGLE_ADS_BUREAU,
    { city: "Groningen", region: "Groningen" },
    "groningen",
  ),
  withSeoLandingLocation(
    ONLINE_MARKETING_BUREAU,
    { city: "Groningen", region: "Groningen" },
    "groningen",
  ),
  withSeoLandingLocation(
    NEXTJS_WEBSITE_LATEN_MAKEN,
    { city: "Groningen", region: "Groningen" },
    "groningen",
  ),
  withSeoLandingLocation(
    SEO_SPECIALIST,
    { city: "Leeuwarden", region: "Friesland" },
    "leeuwarden",
  ),
  withSeoLandingLocation(
    GOOGLE_ADS_BUREAU,
    { city: "Leeuwarden", region: "Friesland" },
    "leeuwarden",
  ),
  // Limburg & Zuid uitbreiding
  withSeoLandingLocation(
    GOOGLE_ADS_BUREAU,
    { city: "Maastricht", region: "Limburg" },
    "maastricht",
  ),
  withSeoLandingLocation(
    ONLINE_MARKETING_BUREAU,
    { city: "Maastricht", region: "Limburg" },
    "maastricht",
  ),
  withSeoLandingLocation(
    META_ADS_BUREAU,
    { city: "Venlo", region: "Limburg" },
    "venlo",
  ),
  withSeoLandingLocation(
    SEO_SPECIALIST,
    { city: "Venlo", region: "Limburg" },
    "venlo",
  ),
  withSeoLandingLocation(
    GOOGLE_ADS_BUREAU,
    { city: "Roermond", region: "Limburg" },
    "roermond",
  ),
  withSeoLandingLocation(
    WEBSHOP_LATEN_MAKEN,
    { city: "Roermond", region: "Limburg" },
    "roermond",
  ),
  // Brabant grote steden extra
  withSeoLandingLocation(
    GOOGLE_ADS_BUREAU,
    { city: "Oss", region: "Noord-Brabant" },
    "oss",
  ),
  withSeoLandingLocation(
    B2B_MARKETING_BUREAU,
    { city: "Oss", region: "Noord-Brabant" },
    "oss",
  ),
  withSeoLandingLocation(
    ONLINE_MARKETING_BUREAU,
    { city: "Roosendaal", region: "Noord-Brabant" },
    "roosendaal",
  ),
  withSeoLandingLocation(
    CONVERSIE_OPTIMALISATIE,
    { city: "Roosendaal", region: "Noord-Brabant" },
    "roosendaal",
  ),
  withSeoLandingLocation(
    SHOPIFY_EXPERT,
    { city: "Alkmaar", region: "Noord-Holland" },
    "alkmaar",
  ),
  withSeoLandingLocation(
    LOKALE_SEO,
    { city: "Alkmaar", region: "Noord-Holland" },
    "alkmaar",
  ),
  withSeoLandingLocation(
    ONLINE_MARKETING_BUREAU,
    { city: "Zoetermeer", region: "Zuid-Holland" },
    "zoetermeer",
  ),
  withSeoLandingLocation(
    GOOGLE_ADS_SPECIALIST,
    { city: "Zoetermeer", region: "Zuid-Holland" },
    "zoetermeer",
  ),
] as const;
