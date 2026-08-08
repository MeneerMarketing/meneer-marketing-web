/**

 * SEO-titles en descriptions voor vaste hub-pagina's.

 * Eén bron: Meneer-stem, keywords vooraan, hook in de description.

 * Title-patroon: [Pagina] | [hook] | Meneer Marketing

 */

export interface HubPageSeo {

  title: string;

  description: string;

  ogAccent?: string;

  keywords?: string[];

}



export const HUB_PAGE_SEO = {

  cases: {

    title: "Cases | Shopify, SEO & ads die je zelf ziet | Meneer Marketing",

    description:

      "SkinComplete, BestRest, Hills Pilates. Geen stockfoto's, wel video en echte resultaten. Zo ziet bouwen plus campagnes eruit als één guy het regelt.",

    ogAccent: "FF5722",

  },

  diensten: {
    title: "Diensten | Website, SEO, Google Ads & Shopify | Meneer Marketing",
    description:
      "Website zonder stagiair aan de lijn. SEO, Google Ads, Meta Ads en Shopify. Jij belt mij, ik voer het uit.",
    ogAccent: "FF5722",
    keywords: [
      "marketing diensten",
      "marketing bureau",
      "online marketing bureau",
      "website laten maken",
      "website laten bouwen",
      "webdesign bureau",
      "shopify webshop laten maken",
      "shopify expert",
      "seo bureau",
      "seo specialist",
      "google ads bureau",
      "meta ads bureau",
      "e-mailmarketing",
      "email marketing",
      "marketingbureau nederland",
    ],
  },

  faq: {

    title: "Veelgestelde vragen | eerlijke antwoorden | Meneer Marketing",

    description:

      "Wat kost het? Werk je alleen? Shopify or scratch? SEO vóór ads? Vragen die klanten écht stellen, beantwoord zonder wollige slides.",

    ogAccent: "FF5722",

  },

  kennisbank: {

    title: "Kennisbank | marketing zonder jargon | Meneer Marketing",

    description:

      "Artikelen over SEO, Shopify, Google Ads, Meta en automatisering. Geschreven alsof ik naast je zit, niet alsof een bureau-PDF je inbox vult.",

    ogAccent: "0284C7",

  },

  zoeken: {

    title: "Zoeken | Google Ads & SEO per regio | Meneer Marketing",

    description:

      "Landingspagina's per zoekwoord en regio: Google Ads Arnhem, SEO Nijmegen, webshops Gelderland en meer. Online groei from scratch, heel Nederland.",

    ogAccent: "FF5722",

    keywords: [

      "google ads arnhem",

      "seo nijmegen",

      "online marketing gelderland",

      "marketing bureau brabant",

      "zoekmachine optimalisatie regio",

    ],

  },

  over: {

    title: "Over mij | twaalf jaar code én campagnes | Meneer Marketing",

    description:

      "Twaalf jaar web en marketing. Begonnen met code, nu Shopify, SEO, Google Ads en Meta Ads onder één dak. Jij praat met mij, niet met een accountmanager.",

    ogAccent: "FF5722",

  },

  contact: {

    title: "Contact | app me, geen formulier-maze | Meneer Marketing",

    description:

      "Chat-achtig contact vanuit Apeldoorn. Site, Shopify, SEO, ads of gewoon sparren. Ik antwoord zelf. Reactie binnen één à twee werkdagen.",

    ogAccent: "FF5722",

  },

  werkwijze: {

    title: "Werkwijze | intake, bouwen, meten, opschalen | Meneer Marketing",

    description:
      "Intake, routekaart, custom build en bijsturen. Vier fases, interactief uitgelegd. Met voorbeelden van volgorde per traject.",

    ogAccent: "FF5722",

  },

  weetjes: {

    title: "Marketing weetjes | feitjes voor aan tafel | Meneer Marketing",

    description:

      "Vijftien harde marketingfeitjes: Google-omzet per minuut, Instagrams exit, waar ads het laten afweten. Grappig op verjaardagen, nuttig voor je strategie.",

    ogAccent: "FF5722",

  },

} as const satisfies Record<string, HubPageSeo>;



export type HubPageSeoKey = keyof typeof HUB_PAGE_SEO;


