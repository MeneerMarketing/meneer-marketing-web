/**
 * Canonieke site-config voor metadata, sitemap, robots en JSON-LD.
 *
 * Env:
 * - NEXT_PUBLIC_SITE_URL: productiedomein (bijv. https://lasweetbyela.nl).
 *   Default: tijdelijk Vercel-previewdomein.
 * - NEXT_PUBLIC_SEO_INDEX: "true" | "false" om indexatie te forceren.
 *   Zonder waarde: index op productie/lokaal, noindex op Vercel preview.
 */

export const DEFAULT_SITE_URL = "https://lasweet-by-ela.vercel.app";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL
).replace(/\/$/, "");

export function absoluteUrl(path = "/"): string {
  if (path === "/" || path === "") return `${siteUrl}/`;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${normalized}`;
}

/** Of pagina's geïndexeerd mogen worden (meta robots + sitemap-inhoud). */
export function isSeoIndexable(): boolean {
  const explicit = process.env.NEXT_PUBLIC_SEO_INDEX?.trim().toLowerCase();
  if (explicit === "true") return true;
  if (explicit === "false") return false;
  if (process.env.VERCEL_ENV === "preview") return false;
  return true;
}

export const SITE = {
  name: "Lá Sweet by Ela",
  shortName: "Lá Sweet",
  handle: "@la.sweetbyela",
  locale: "nl_NL",
  language: "nl",
  description:
    "Handgemaakte crumble cookies en iced matcha in Enschede. Walk-in op zaterdag van 14:00 tot 20:00 aan de Haaksbergerstraat 302. Bekend van TikTok en Tubantia.",
  streetAddress: "Haaksbergerstraat 302",
  postalCode: "7513 EH",
  addressLocality: "Enschede",
  addressRegion: "Overijssel",
  addressCountry: "NL",
  /** Approx. midpoint Haaksbergerstraat 300-330, Enschede (publieke bron). */
  geo: {
    latitude: 52.212444,
    longitude: 6.881271,
  },
  instagram: "https://www.instagram.com/la.sweetbyela",
  tiktok: "https://www.tiktok.com/@la.sweetbyela",
  tubantiaArticle:
    "https://www.tubantia.nl/enschede/ze-zijn-bijna-te-mooi-om-op-te-eten-de-crumble-cookies-van-ela-19-zijn-een-hit-in-enschede~a2b62938/",
  mapsSearch:
    "https://www.google.com/maps/search/?api=1&query=Haaksbergerstraat+302+Enschede",
  /** Walk-in zaterdag 14:00-20:00 (zichtbaar op /bestellen). */
  walkInNote: "Walk-in op zaterdag tussen 14:00 en 20:00. Updates via Instagram.",
  walkInOpens: "14:00",
  walkInCloses: "20:00",
  priceRange: "€€",
  ogImagePath: "/og-image.png",
} as const;
