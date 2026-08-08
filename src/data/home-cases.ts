export type CaseSceneId = "skincomplete" | "bestrest" | "hills-pilates";

export type CaseServiceId =
  | "portal"
  | "seo"
  | "email"
  | "google-ads"
  | "meta-ads"
  | "ugc"
  | "shopify"
  | "website"
  | "app";

export interface CaseService {
  id: CaseServiceId;
  label: string;
  blurb: string;
}

export interface CaseWebsite {
  url: string;
  hostname: string;
}

export interface CasePalette {
  accent: string;
  surface: string;
  deep: string;
  onAccent: string;
}

export interface HomeCase {
  id: string;
  client: string;
  eyebrow: string;
  title: string;
  /** Eén regel voor de home-casekaart */
  homeHook: string;
  metric: string;
  metricHint: string;
  body: string;
  challenge: string;
  move: string;
  result: string;
  tags: readonly string[];
  palette: CasePalette;
  /** @deprecated gebruik palette.accent */
  accent: string;
  scene: CaseSceneId;
  href: string;
  website?: CaseWebsite;
  /** Optioneel: screenshot in public/cases/ (bijv. /cases/skincomplete.webp) */
  previewImage?: string;
  /** Optioneel: loop-video in public/cases/ of externe CDN-URL */
  previewVideo?: string;
  /** Lichtere MP4 voor mobiel / traag netwerk (bijv. H.264 ~1–5 MB) */
  previewVideoMobile?: string;
  /** Poster voor video (eerste frame); fallback als reduced motion aan staat */
  previewPoster?: string;
  /** Media-crop in browserframe (standaard top voor hero) */
  previewObjectPosition?: string;
  services: readonly CaseService[];
}

const SC_PALETTE = {
  accent: "#45382C",
  surface: "#F5F0EA",
  deep: "#2C2217",
  onAccent: "#FEFCFC",
} as const;

const BR_PALETTE = {
  accent: "#FF5722",
  surface: "#FFF7ED",
  deep: "#C2410C",
  onAccent: "#FFFFFF",
} as const;

const HP_PALETTE = {
  accent: "#8B7355",
  surface: "#F5F0EA",
  deep: "#45382C",
  onAccent: "#FEFCFC",
} as const;

export const HOME_CASES: HomeCase[] = [
  {
    id: "skincomplete",
    client: "SkinComplete",
    eyebrow: "B2B-portaal · SEO · Campagnes",
    title: "B2B-portaal, vindbaarheid en campagnes op één lijn",
    homeHook: "B2B-portaal, SEO en ads. SEO eerst, ads als het fundament staat.",
    metric: "24/7",
    metricHint: "salons bestellen zelf via het portaal",
    body: "Bestaande shop geoptimaliseerd met custom B2B-portaal, SEO, e-mailmarketing, Google Ads, Meta Ads en UGC via influencers. Alles op elkaar afgestemd.",
    challenge:
      "Salons bestelden via mail en Excel. Tegelijk moest het merk vindbaar worden, e-mail en ads moesten meewerken zonder budget te verbranden.",
    move:
      "Custom B2B-portaal in Shopify met eigen accounts en prijzen. SEO en content eerst, e-mailautomatisering erna. Ads en UGC/influencer pas op een fundament dat al verkocht.",
    result:
      "Salons bestellen zelfstandig. Organisch verkeer en e-mail droegen omzet voordat ads opschalen. Influencers leveren content die ook in campagnes terugkomt.",
    tags: [
      "Shopify theme from scratch",
      "B2B-portaal",
      "SEO",
      "E-mailmarketing",
      "Google Ads",
      "Meta Ads",
      "UGC & influencers",
    ],
    palette: SC_PALETTE,
    accent: SC_PALETTE.accent,
    scene: "skincomplete",
    href: "/cases/skincomplete",
    website: { url: "https://skincomplete.eu", hostname: "skincomplete.eu" },
    previewVideo: "/cases/skincomplete-hero.mp4",
    previewVideoMobile: "/cases/skincomplete-hero-mobile.mp4",
    previewPoster: "/cases/skincomplete-hero-poster.jpg",
    previewObjectPosition: "center top",
    services: [
      {
        id: "shopify",
        label: "Shopify theme from scratch",
        blurb: "Custom theme op maat, geen standaard template",
      },
      { id: "portal", label: "B2B-portaal", blurb: "Salons loggen in en bestellen zelf" },
      { id: "seo", label: "SEO", blurb: "Organisch vóór paid opschalen" },
      { id: "email", label: "E-mail", blurb: "Mail gekoppeld aan het portaal" },
      { id: "google-ads", label: "Google Ads", blurb: "Pas als SEO en e-mail dragen" },
      { id: "meta-ads", label: "Meta Ads", blurb: "Creatives met UGC erin" },
      { id: "ugc", label: "UGC", blurb: "Influencers i.p.v. stockbeelden" },
    ],
  },
  {
    id: "bestrest",
    client: "BestRest",
    eyebrow: "Shopify · Full stack",
    title: "Custom Shopify-webshop met SEO, e-mail en ads",
    homeHook: "Custom Shopify from scratch in een markt met miljoenenbudgetten.",
    metric: "Custom shop",
    metricHint: "Shopify from scratch, SEO en ads",
    body: "In een markt met miljoenenbudgetten geen schreeuwen, wel een eigen webshop from scratch met vindbaarheid, e-mail en campagnes die bij elkaar passen.",
    challenge:
      "Grote spelers domineren met budget. Een standaard thema en losse marketing hielden BestRest niet scherp genoeg in de ruis.",
    move:
      "Custom Shopify-webshop gebouwd from scratch. SEO-structuur, e-mailmarketing en Google Ads en Meta Ads per assortimentsstuk. Eigen funnel, geen copy-paste.",
    result:
      "Een shop en marketinglijn die past bij toppers en matrassen: meetbaar, eigen en klaar om op te schalen wat werkt.",
    tags: [
      "Shopify from scratch",
      "SEO",
      "E-mailmarketing",
      "Google Ads",
      "Meta Ads",
    ],
    palette: BR_PALETTE,
    accent: BR_PALETTE.accent,
    scene: "bestrest",
    href: "/cases/bestrest",
    website: { url: "https://bestrest.nl", hostname: "bestrest.nl" },
    previewImage: "/cases/bestrest-hero.png",
    previewObjectPosition: "center center",
    services: [
      { id: "shopify", label: "Shopify", blurb: "Custom theme from scratch" },
      { id: "seo", label: "SEO", blurb: "Per productlijn, niet generiek" },
      { id: "email", label: "E-mail", blurb: "Mail per assortiment" },
      { id: "google-ads", label: "Google Ads", blurb: "Landingspagina's op maat" },
      { id: "meta-ads", label: "Meta Ads", blurb: "Creatives die bij het merk passen" },
    ],
  },
  {
    id: "hills-pilates",
    client: "Hills Pilates",
    eyebrow: "From scratch · App",
    title: "Website, e-mail en boekingsapp met agenda",
    homeHook: "Website from scratch, mail en boekingsapp. Alles op één stack.",
    metric: "Boekingsapp",
    metricHint: "website en mail in dezelfde lijn",
    body: "Website from scratch, e-mailmarketing en een eigen app met agenda en boekingen. Alles gekoppeld, geen losse tools die langs elkaar praten.",
    challenge:
      "Lessen plannen, aanmeldingen en communicatie liepen versnipperd. Ontbrekende centrale plek waar klanten boeken en Hills Pilates haar planning beheert.",
    move:
      "Custom website gebouwd from scratch. Automatische mails voor welkom, herinneringen en retentie. App met agenda, boekingen en overzicht voor het team.",
    result:
      "Klanten boeken via de app. Hills Pilates ziet haar agenda op één plek. E-mail en site trekken dezelfde kant op.",
    tags: [
      "Website from scratch",
      "E-mailmarketing",
      "App & agenda",
      "Boekingen",
    ],
    palette: HP_PALETTE,
    accent: HP_PALETTE.accent,
    scene: "hills-pilates",
    href: "/cases/hills-pilates",
    website: { url: "https://hillsstudio.nl", hostname: "hillsstudio.nl" },
    previewImage: "/cases/hills-pilates-hero.png",
    previewObjectPosition: "center center",
    services: [
      { id: "website", label: "Website", blurb: "From scratch, geen template" },
      { id: "email", label: "E-mail", blurb: "Welkom, herinnering, retentie" },
      { id: "app", label: "Boekingsapp", blurb: "Agenda voor klant én team" },
    ],
  },
] as const;

/** Alleen cases op de homepage proof-strip (SkinComplete zit al in bouw-sectie) */
export const HOME_PROOF_CASES = HOME_CASES.filter(
  (c) => c.id === "bestrest" || c.id === "hills-pilates",
);

/** Alias voor cases-pagina en andere imports */
export const CASE_STUDIES = HOME_CASES;
