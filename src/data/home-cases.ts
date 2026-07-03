export type CaseSceneId = "skincomplete" | "bestrest" | "hills-pilates";

export interface HomeCase {
  id: string;
  client: string;
  eyebrow: string;
  title: string;
  metric: string;
  metricHint: string;
  body: string;
  challenge: string;
  move: string;
  result: string;
  tags: readonly string[];
  accent: string;
  scene: CaseSceneId;
  href: string;
}

export const HOME_CASES: HomeCase[] = [
  {
    id: "skincomplete",
    client: "SkinComplete",
    eyebrow: "B2B-portaal · SEO · Campagnes",
    title: "B2B-portaal, vindbaarheid en campagnes op één lijn",
    metric: "24/7",
    metricHint: "salons bestellen zelf via het portaal",
    body: "Geen nieuwe shop from scratch. Wel een custom B2B-portaal, SEO, e-mailmarketing, Google Ads, Meta Ads en UGC via influencers. Alles op elkaar afgestemd.",
    challenge:
      "Salons bestelden via mail en Excel. Tegelijk moest het merk vindbaar worden, e-mail en ads moesten meewerken zonder budget te verbranden.",
    move:
      "Custom B2B-portaal in Shopify met eigen accounts en prijzen. SEO en content eerst, e-mailflows erna. Ads en UGC/influencer pas op een fundament dat al verkocht.",
    result:
      "Salons bestellen zelfstandig. Organisch verkeer en e-mail droegen omzet voordat ads opschalen. Influencers leveren content die ook in campagnes terugkomt.",
    tags: [
      "B2B-portaal",
      "SEO",
      "E-mailmarketing",
      "Google Ads",
      "Meta Ads",
      "UGC & influencers",
    ],
    accent: "#00BCD4",
    scene: "skincomplete",
    href: "/cases#skincomplete",
  },
  {
    id: "bestrest",
    client: "BestRest",
    eyebrow: "Shopify · Full stack",
    title: "Custom Shopify-webshop met SEO, e-mail en ads",
    metric: "Eigen",
    metricHint: "koers per product, geen me-too",
    body: "In een markt met miljoenenbudgetten geen schreeuwen, wel een eigen webshop from scratch met vindbaarheid, e-mail en campagnes die bij elkaar passen.",
    challenge:
      "Grote spelers domineren met budget. Een standaard thema en losse marketing hielden BestRest niet scherp genoeg in de ruis.",
    move:
      "Custom Shopify-webshop gebouwd from scratch. SEO-structuur, e-mailmarketing en Google Ads en Meta Ads per assortimentsstuk. Geen copy-paste funnel.",
    result:
      "Een shop en marketinglijn die past bij toppers en matrassen: meetbaar, eigen en klaar om op te schalen wat werkt.",
    tags: [
      "Shopify from scratch",
      "SEO",
      "E-mailmarketing",
      "Google Ads",
      "Meta Ads",
    ],
    accent: "#45382C",
    scene: "bestrest",
    href: "/cases#bestrest",
  },
  {
    id: "hills-pilates",
    client: "Hills Pilates",
    eyebrow: "From scratch · App",
    title: "Website, e-mail en boekingsapp met agenda",
    metric: "Alles",
    metricHint: "site, mail en app in één lijn",
    body: "Website from scratch, e-mailmarketing en een eigen app met agenda en boekingen. Geen losse tools die niet met elkaar praten.",
    challenge:
      "Lessen plannen, aanmeldingen en communicatie liepen versnipperd. Geen centrale plek waar klanten boeken en Hills Pilates haar planning beheert.",
    move:
      "Custom website gebouwd from scratch. E-mailflows voor welkom, herinneringen en retentie. App met agenda, boekingen en overzicht voor het team.",
    result:
      "Klanten boeken via de app. Hills Pilates ziet haar agenda op één plek. E-mail en site trekken dezelfde kant op.",
    tags: [
      "Website from scratch",
      "E-mailmarketing",
      "App & agenda",
      "Boekingen",
    ],
    accent: "#7C6AEF",
    scene: "hills-pilates",
    href: "/cases#hills-pilates",
  },
] as const;

/** Alias voor cases-pagina en andere imports */
export const CASE_STUDIES = HOME_CASES;
