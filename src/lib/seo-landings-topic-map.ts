/**
 * Expliciete topical links voor /zoeken-hubs.
 * Voorkomt hash-mismatch (Google Ads → willekeurig SEO-artikel).
 */

/** Hub slug → kennisbank article slug */
export const KENNISBANK_BY_HUB_SLUG: Readonly<Record<string, string>> = {
  "google-ads-bureau": "zoektermenrapport-google-ads",
  "google-ads-beheer": "google-ads-vijf-fouten-elke-account",
  "google-ads-specialist": "roas-vs-cpa-bankrekening",
  "google-ads-uitbesteden": "broad-match-google-ads-verrassingsbox",
  "google-ads-of-seo": "seo-eerst-dan-ads",
  "performance-max": "performance-max-zwarte-doos",
  "google-shopping-ads": "merchant-center-feed-afgekeurd",
  "meta-ads-bureau": "meta-boost-knop-budget-verbranden",
  "instagram-ads": "instagram-ads-geen-leads",
  "tiktok-ads-bureau": "instagram-ads-geen-leads",
  "linkedin-ads-bureau": "leads-gmail-opvolging",
  remarketing: "remarketing-zonder-stalken",
  "seo-bureau": "concurrent-hoger-in-google",
  "seo-specialist": "semantische-seo-2026",
  "hoger-in-google": "concurrent-hoger-in-google",
  "technische-seo": "wordpress-theme-groeien-nextjs",
  "lokale-seo": "google-business-profile-spookhuis",
  "google-maps-marketing": "google-reviews-lokale-seo",
  "content-marketing-bureau": "ai-content-bulk-onzichtbaar",
  "vindbaarheid-ai": "ai-zoek-vindbaarheid-chatgpt",
  "chatgpt-seo": "ai-zoek-vindbaarheid-chatgpt",
  "productpagina-seo": "shopify-performance-roas",
  "shopify-seo": "shopify-performance-roas",
  "shopify-expert": "b2b-verkopen-via-shopify",
  "webshop-laten-maken": "wordpress-theme-groeien-nextjs",
  "website-laten-maken": "brochure-o-meter-website-teksten",
  "nextjs-website-laten-maken": "wordpress-theme-groeien-nextjs",
  "e-mailmarketing": "klaviyo-flows-elke-shop-nodig",
  "email-marketing-bureau": "klaviyo-flows-elke-shop-nodig",
  "klaviyo-specialist": "klaviyo-flows-elke-shop-nodig",
  "marketing-automatisering": "n8n-eerste-workflow",
  "conversie-optimalisatie": "cro-checkout-vertrouwen",
  "growth-marketing-bureau": "marketingbudget-volgorde-mkb",
  "performance-marketing-bureau": "roas-vs-cpa-bankrekening",
  "online-marketing-bureau": "marketingbudget-volgorde-mkb",
  "online-marketing-manager": "marketing-vergadering-vs-uitvoering",
  "linkbuilding-bureau": "semantische-seo-2026",
  "tracking-google-analytics": "google-analytics-4-mkb",
  "social-media-advertising": "meta-boost-knop-budget-verbranden",
  "ugc-marketing": "instagram-ads-geen-leads",
  "influencer-marketing-bureau": "instagram-ads-geen-leads",
  "e-commerce-marketing": "abandoned-cart-emails-die-converteren",
  "ecommerce-specialist": "shopify-performance-roas",
  "webshop-marketing": "abandoned-cart-emails-die-converteren",
  "b2b-marketing-bureau": "b2b-verkopen-via-shopify",
  "marketing-consultant-mkb": "marketingbudget-volgorde-mkb",
  "core-web-vitals-verbeteren": "wordpress-theme-groeien-nextjs",
};

/** Hub slug → /diensten/{slug} */
export const DIENST_BY_HUB_SLUG: Readonly<Record<string, string>> = {
  "google-ads-bureau": "google-ads",
  "google-ads-beheer": "google-ads",
  "google-ads-specialist": "google-ads",
  "google-ads-uitbesteden": "google-ads",
  "google-ads-of-seo": "google-ads",
  "performance-max": "google-ads",
  "google-shopping-ads": "google-ads",
  "meta-ads-bureau": "meta-ads",
  "instagram-ads": "meta-ads",
  "tiktok-ads-bureau": "meta-ads",
  "linkedin-ads-bureau": "meta-ads",
  remarketing: "google-ads",
  "seo-bureau": "seo",
  "seo-specialist": "seo",
  "hoger-in-google": "seo",
  "technische-seo": "seo",
  "lokale-seo": "local-seo",
  "google-maps-marketing": "local-seo",
  "content-marketing-bureau": "content-marketing",
  "vindbaarheid-ai": "ai-zoek",
  "chatgpt-seo": "ai-zoek",
  "productpagina-seo": "seo",
  "shopify-seo": "shopify-enterprise",
  "shopify-expert": "shopify-enterprise",
  "webshop-laten-maken": "shopify-enterprise",
  "website-laten-maken": "webdevelopment",
  "nextjs-website-laten-maken": "webdevelopment",
  "e-mailmarketing": "email",
  "email-marketing-bureau": "email",
  "klaviyo-specialist": "email",
  "marketing-automatisering": "automatisering",
  "conversie-optimalisatie": "cro",
  "growth-marketing-bureau": "strategie",
  "performance-marketing-bureau": "adverteren",
  "online-marketing-bureau": "strategie",
  "online-marketing-manager": "strategie",
  "linkbuilding-bureau": "seo",
  "tracking-google-analytics": "tracking",
  "social-media-advertising": "social-media",
  "ugc-marketing": "ugc",
  "influencer-marketing-bureau": "influencer-marketing",
  "e-commerce-marketing": "shopify-enterprise",
  "ecommerce-specialist": "shopify-enterprise",
  "webshop-marketing": "shopify-enterprise",
  "b2b-marketing-bureau": "leadgeneratie",
  "marketing-consultant-mkb": "strategie",
  "core-web-vitals-verbeteren": "optimalisatie",
};

/** Hub slug → JSON-LD serviceType (anders category-fallback) */
export const SERVICE_TYPE_BY_HUB_SLUG: Readonly<Record<string, string>> = {
  "google-ads-bureau": "Google Ads beheer",
  "google-ads-beheer": "Google Ads beheer",
  "google-ads-specialist": "Google Ads beheer",
  "meta-ads-bureau": "Meta Ads beheer",
  "instagram-ads": "Meta Ads beheer",
  "tiktok-ads-bureau": "TikTok Ads beheer",
  "linkedin-ads-bureau": "LinkedIn Ads beheer",
  "seo-bureau": "Zoekmachine optimalisatie",
  "seo-specialist": "Zoekmachine optimalisatie",
  "lokale-seo": "Lokale SEO",
  "google-maps-marketing": "Lokale SEO",
  "vindbaarheid-ai": "AI-zoekoptimalisatie",
  "chatgpt-seo": "AI-zoekoptimalisatie",
  "shopify-expert": "Shopify ontwikkeling",
  "shopify-seo": "Shopify SEO",
  "webshop-laten-maken": "Shopify webshop",
  "website-laten-maken": "Website ontwikkeling",
  "nextjs-website-laten-maken": "Website ontwikkeling",
  "e-mailmarketing": "E-mailmarketing",
  "email-marketing-bureau": "E-mailmarketing",
  "klaviyo-specialist": "Klaviyo e-mailmarketing",
  "marketing-automatisering": "Marketingautomatisering",
  "conversie-optimalisatie": "Conversie optimalisatie",
  "ugc-marketing": "UGC marketing",
  "influencer-marketing-bureau": "Influencer marketing",
  "tracking-google-analytics": "Web analytics",
  "core-web-vitals-verbeteren": "Website performance",
  "productpagina-seo": "Productpagina SEO",
};

function citySlugFromName(city: string): string {
  return city
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['']/g, "")
    .replace(/\s+/g, "-");
}

/** Strip city suffix from hub slug when location is known. */
export function nationalBaseSlug(
  hubSlug: string,
  cityName?: string,
): string | undefined {
  if (!cityName) return undefined;
  const suffix = `-${citySlugFromName(cityName)}`;
  if (hubSlug.endsWith(suffix) && hubSlug.length > suffix.length) {
    return hubSlug.slice(0, -suffix.length);
  }
  return undefined;
}

export function resolveKennisbankSlugForHub(
  hubSlug: string,
  cityName: string | undefined,
  categoryFallback: readonly string[],
  pickFn: (seed: string, pool: readonly string[], salt: string) => string,
): string {
  const explicit = KENNISBANK_BY_HUB_SLUG[hubSlug];
  if (explicit) return explicit;
  const base = nationalBaseSlug(hubSlug, cityName);
  if (base && KENNISBANK_BY_HUB_SLUG[base]) return KENNISBANK_BY_HUB_SLUG[base];
  return pickFn(hubSlug, categoryFallback, "kb");
}

export function resolveDienstSlugForHub(
  hubSlug: string,
  cityName?: string,
): string | undefined {
  if (DIENST_BY_HUB_SLUG[hubSlug]) return DIENST_BY_HUB_SLUG[hubSlug];
  const base = nationalBaseSlug(hubSlug, cityName);
  if (base) return DIENST_BY_HUB_SLUG[base];
  return undefined;
}

export function resolveServiceTypeForHub(
  hubSlug: string,
  cityName: string | undefined,
  categoryFallback: string,
): string {
  if (SERVICE_TYPE_BY_HUB_SLUG[hubSlug]) {
    return SERVICE_TYPE_BY_HUB_SLUG[hubSlug];
  }
  const base = nationalBaseSlug(hubSlug, cityName);
  if (base && SERVICE_TYPE_BY_HUB_SLUG[base]) {
    return SERVICE_TYPE_BY_HUB_SLUG[base];
  }
  return categoryFallback;
}
