import { getArticlesByCategory, getKennisbankArticleBySlug } from "@/lib/kennisbank";
import { megaMenuColumns, type PillarSlug } from "@/lib/navigation";

export interface InternalLinkItem {
  href: string;
  label: string;
  hint?: string;
}

export interface PillarInternalLinks {
  diensten: InternalLinkItem[];
  kennisbank: InternalLinkItem[];
  zoeken: InternalLinkItem[];
}

export interface CaseLinkItem {
  href: string;
  label: string;
  hook: string;
}

/** Top nationale /zoeken-hubs (P0.5). Primaries na cannibal-consolidatie. */
export const TOP_ZOEKEN_HUB_LINKS = [
  { slug: "google-ads-bureau", label: "Google Ads bureau" },
  { slug: "seo-specialist", label: "SEO specialist" },
  { slug: "website-laten-maken", label: "Website laten maken" },
  { slug: "online-marketing-bureau", label: "Online marketing bureau" },
  { slug: "e-mailmarketing", label: "E-mailmarketing" },
  { slug: "shopify-expert", label: "Shopify expert" },
  { slug: "meta-ads-bureau", label: "Meta Ads bureau" },
  { slug: "hoger-in-google", label: "Hoger in Google" },
] as const;

export const APELDOORN_HQ_HUB = {
  slug: "google-ads-bureau-apeldoorn",
  label: "Google Ads bureau Apeldoorn",
} as const;

/** Commerciële zoek-landings per dienst (max 2). Alleen live hubs, geen 301-slugs. */
export const DIENST_ZOEKEN_LINKS: Readonly<
  Record<string, readonly { slug: string; label: string }[]>
> = {
  strategie: [
    { slug: "online-marketing-bureau", label: "Online marketing bureau" },
    { slug: "seo-specialist", label: "SEO specialist" },
  ],
  adverteren: [
    { slug: "google-ads-bureau", label: "Google Ads bureau" },
    { slug: "meta-ads-bureau", label: "Meta Ads bureau" },
  ],
  cro: [
    { slug: "conversie-optimalisatie", label: "Conversie optimalisatie" },
    { slug: "website-laten-maken", label: "Website laten maken" },
  ],
  leadgeneratie: [
    { slug: "leadgeneratie-website", label: "Leadgeneratie website" },
    { slug: "online-marketing-bureau", label: "Online marketing bureau" },
  ],
  tracking: [
    { slug: "tracking-google-analytics", label: "Tracking & Google Analytics" },
    { slug: "technische-seo", label: "Technische SEO" },
  ],
  webdevelopment: [
    { slug: "website-laten-maken", label: "Website laten maken" },
    { slug: "nextjs-website-laten-maken", label: "Next.js website laten maken" },
  ],
  "shopify-enterprise": [
    { slug: "shopify-expert", label: "Shopify expert" },
    { slug: "shopify-seo", label: "Shopify SEO" },
  ],
  "web-apps": [
    { slug: "b2b-portaal-bouwen", label: "B2B portaal bouwen" },
    { slug: "website-laten-maken", label: "Website laten maken" },
  ],
  optimalisatie: [
    { slug: "technische-seo", label: "Technische SEO" },
    { slug: "website-laten-maken", label: "Website laten maken" },
  ],
  webdesign: [
    { slug: "website-laten-maken", label: "Website laten maken" },
    { slug: "landing-page-laten-maken", label: "Landing page laten maken" },
  ],
  branding: [
    { slug: "website-laten-maken", label: "Website laten maken" },
    { slug: "online-marketing-bureau", label: "Online marketing bureau" },
  ],
  animaties: [
    { slug: "website-laten-maken", label: "Website laten maken" },
    { slug: "landing-page-laten-maken", label: "Landing page laten maken" },
  ],
  seo: [
    { slug: "seo-specialist", label: "SEO specialist" },
    { slug: "hoger-in-google", label: "Hoger in Google" },
  ],
  "ai-zoek": [
    { slug: "vindbaarheid-ai", label: "Vindbaarheid in AI" },
    { slug: "seo-specialist", label: "SEO specialist" },
  ],
  "local-seo": [
    { slug: "lokale-seo", label: "Lokale SEO" },
    { slug: "google-maps-marketing", label: "Google Maps marketing" },
  ],
  "content-marketing": [
    { slug: "seo-specialist", label: "SEO specialist" },
    { slug: "content-marketing-vindbaarheid", label: "Content marketing vindbaarheid" },
  ],
  reviews: [
    { slug: "lokale-seo", label: "Lokale SEO" },
    { slug: "google-maps-marketing", label: "Google Maps marketing" },
  ],
  "google-ads": [
    { slug: "google-ads-bureau", label: "Google Ads bureau" },
    { slug: "google-shopping-ads", label: "Google Shopping ads" },
  ],
  "meta-ads": [
    { slug: "meta-ads-bureau", label: "Meta Ads bureau" },
    { slug: "ugc-marketing", label: "UGC marketing" },
  ],
  "social-media": [
    { slug: "social-media-advertising", label: "Social media advertising" },
    { slug: "meta-ads-bureau", label: "Meta Ads bureau" },
  ],
  ugc: [
    { slug: "ugc-marketing", label: "UGC marketing" },
    { slug: "meta-ads-bureau", label: "Meta Ads bureau" },
  ],
  "influencer-marketing": [
    { slug: "influencer-marketing-bureau", label: "Influencer marketing bureau" },
    { slug: "ugc-marketing", label: "UGC marketing" },
  ],
  marketplaces: [
    { slug: "e-commerce-marketing", label: "E-commerce marketing" },
    { slug: "shopify-expert", label: "Shopify expert" },
  ],
  media: [
    { slug: "meta-ads-bureau", label: "Meta Ads bureau" },
    { slug: "google-ads-bureau", label: "Google Ads bureau" },
  ],
  email: [
    { slug: "e-mailmarketing", label: "E-mailmarketing" },
    { slug: "e-commerce-marketing", label: "E-commerce marketing" },
  ],
  retentie: [
    { slug: "e-mailmarketing", label: "E-mailmarketing" },
    { slug: "e-commerce-marketing", label: "E-commerce marketing" },
  ],
  automatisering: [
    { slug: "marketing-automatisering", label: "Marketing automatisering" },
    { slug: "online-marketing-manager", label: "Online marketing manager" },
  ],
  workflows: [
    { slug: "marketing-automatisering", label: "Marketing automatisering" },
    { slug: "e-commerce-marketing", label: "E-commerce marketing" },
  ],
  chatbots: [
    { slug: "marketing-automatisering", label: "Marketing automatisering" },
    { slug: "online-marketing-manager", label: "Online marketing manager" },
  ],
};

const PILLAR_ZOEKEN_LINKS: Record<PillarSlug, readonly { slug: string; label: string }[]> =
  {
    strategie: [
      { slug: "online-marketing-bureau", label: "Online marketing bureau" },
      { slug: "google-ads-bureau", label: "Google Ads bureau" },
      { slug: "seo-specialist", label: "SEO specialist" },
    ],
    bouwen: [
      { slug: "website-laten-maken", label: "Website laten maken" },
      { slug: "shopify-expert", label: "Shopify expert" },
      { slug: "hoger-in-google", label: "Hoger in Google" },
    ],
    vindbaarheid: [
      { slug: "seo-specialist", label: "SEO specialist" },
      { slug: "hoger-in-google", label: "Hoger in Google" },
      { slug: "vindbaarheid-ai", label: "Vindbaarheid in AI" },
    ],
    campagnes: [
      { slug: "google-ads-bureau", label: "Google Ads bureau" },
      { slug: "meta-ads-bureau", label: "Meta Ads bureau" },
      { slug: "online-marketing-bureau", label: "Online marketing bureau" },
    ],
    behoud: [
      { slug: "e-mailmarketing", label: "E-mailmarketing" },
      { slug: "shopify-expert", label: "Shopify expert" },
      { slug: "online-marketing-bureau", label: "Online marketing bureau" },
    ],
  };

const ARTICLE_ZOEKEN_OVERRIDES: Partial<
  Record<string, readonly { slug: string; label: string }[]>
> = {
  "concurrent-hoger-in-google": [
    { slug: "hoger-in-google", label: "Hoger in Google" },
    { slug: "seo-specialist", label: "SEO specialist" },
  ],
  "google-reviews-lokale-seo": [
    { slug: "lokale-seo", label: "Lokale SEO" },
    { slug: "google-maps-marketing", label: "Google Maps marketing" },
  ],
  "instagram-ads-geen-leads": [
    { slug: "meta-ads-bureau", label: "Meta Ads bureau" },
    { slug: "ugc-marketing", label: "UGC marketing" },
  ],
  "google-business-profile-spookhuis": [
    { slug: "lokale-seo", label: "Lokale SEO" },
    { slug: "google-maps-marketing", label: "Google Maps marketing" },
  ],
  "bestrest-matrassen-eigen-marketingplan": [
    { slug: "google-ads-bureau", label: "Google Ads bureau" },
    { slug: "seo-specialist", label: "SEO specialist" },
  ],
  "b2b-verkopen-via-shopify": [
    { slug: "shopify-expert", label: "Shopify expert" },
    { slug: "b2b-portaal-bouwen", label: "B2B portaal bouwen" },
  ],
  "seo-eerst-dan-ads": [
    { slug: "hoger-in-google", label: "Hoger in Google" },
    { slug: "google-ads-bureau", label: "Google Ads bureau" },
  ],
  "chatgpt-modellen-marketeer-2026": [
    { slug: "vindbaarheid-ai", label: "Vindbaarheid in AI" },
    { slug: "seo-specialist", label: "SEO specialist" },
  ],
  "ai-zoek-vindbaarheid-chatgpt": [
    { slug: "vindbaarheid-ai", label: "Vindbaarheid in AI" },
    { slug: "seo-specialist", label: "SEO specialist" },
  ],
  "ai-content-bulk-onzichtbaar": [
    { slug: "seo-specialist", label: "SEO specialist" },
    { slug: "vindbaarheid-ai", label: "Vindbaarheid in AI" },
  ],
  "shopify-performance-roas": [
    { slug: "shopify-expert", label: "Shopify expert" },
    { slug: "webshop-laten-maken", label: "Webshop laten maken" },
  ],
  "google-ai-overviews-clicks-2026": [
    { slug: "hoger-in-google", label: "Hoger in Google" },
    { slug: "content-marketing-vindbaarheid", label: "Content marketing vindbaarheid" },
  ],
  "consent-mode-google-ads-2026": [
    { slug: "tracking-google-analytics", label: "Tracking & Google Analytics" },
    { slug: "google-ads-bureau", label: "Google Ads bureau" },
  ],
  "performance-max-zwarte-doos": [
    { slug: "google-ads-bureau", label: "Google Ads bureau" },
    { slug: "google-shopping-ads", label: "Google Shopping ads" },
  ],
  "merchant-center-feed-afgekeurd": [
    { slug: "google-shopping-ads", label: "Google Shopping ads" },
    { slug: "google-ads-bureau", label: "Google Ads bureau" },
  ],
  "meta-boost-knop-budget-verbranden": [
    { slug: "meta-ads-bureau", label: "Meta Ads bureau" },
    { slug: "ugc-marketing", label: "UGC marketing" },
  ],
  "klaviyo-flows-elke-shop-nodig": [
    { slug: "e-mailmarketing", label: "E-mailmarketing" },
    { slug: "webshop-laten-maken", label: "Webshop laten maken" },
  ],
};

const ARTICLE_CASE_OVERRIDES: Partial<Record<string, string>> = {
  "bestrest-matrassen-eigen-marketingplan": "bestrest",
  "b2b-verkopen-via-shopify": "skincomplete",
  "shopify-performance-roas": "skincomplete",
  "seo-eerst-dan-ads": "skincomplete",
  "abandoned-cart-emails-die-converteren": "skincomplete",
  "klaviyo-flows-elke-shop-nodig": "skincomplete",
  "wordpress-theme-groeien-nextjs": "hills-pilates",
  "n8n-eerste-workflow": "hills-pilates",
  "cro-checkout-vertrouwen": "bestrest",
  "google-ads-vijf-fouten-elke-account": "bestrest",
  "instagram-ads-geen-leads": "bestrest",
  "chatgpt-modellen-marketeer-2026": "skincomplete",
  "google-ai-overviews-clicks-2026": "skincomplete",
  "consent-mode-google-ads-2026": "bestrest",
};

const PILLAR_CASE_FALLBACK: Record<
  PillarSlug,
  { slug: string; label: string; hook: string }
> = {
  strategie: {
    slug: "bestrest",
    label: "BestRest",
    hook: "Eigen strategie per productlijn in matrassenland.",
  },
  bouwen: {
    slug: "skincomplete",
    label: "SkinComplete",
    hook: "Custom Shopify theme + B2B-portaal from scratch.",
  },
  vindbaarheid: {
    slug: "skincomplete",
    label: "SkinComplete",
    hook: "Organisch vóór paid. SEO eerst, ads daarna.",
  },
  campagnes: {
    slug: "bestrest",
    label: "BestRest",
    hook: "Google Ads en Meta per assortiment, geen copy-paste funnel.",
  },
  behoud: {
    slug: "hills-pilates",
    label: "Hills Pilates",
    hook: "Website, boekingsapp en mail in één lijn.",
  },
};

const CASE_HOOKS: Record<string, string> = {
  skincomplete: "Salons bestellen 24/7 via B2B-portaal. SEO vóór ads.",
  bestrest: "Custom shop in matrassenland. Per lijn eigen marketing.",
  "hills-pilates": "Boekingsapp + site + mail. Geen losse tools meer.",
};

export function getZoekenLinksForDienstSlug(
  dienstSlug: string,
  limit = 2,
): { slug: string; label: string }[] {
  const links = DIENST_ZOEKEN_LINKS[dienstSlug];
  return links ? [...links].slice(0, limit) : [];
}

export function getZoekenLinksForArticleSlug(
  slug: string,
  limit = 2,
): { slug: string; label: string }[] {
  const overrides = ARTICLE_ZOEKEN_OVERRIDES[slug];
  if (overrides?.length) return [...overrides].slice(0, limit);

  const article = getKennisbankArticleBySlug(slug);
  if (!article) return [];

  const seen = new Set<string>();
  const links: { slug: string; label: string }[] = [];

  for (const dienstSlug of article.dienstSlugs) {
    for (const link of getZoekenLinksForDienstSlug(dienstSlug, 2)) {
      if (!seen.has(link.slug)) {
        seen.add(link.slug);
        links.push(link);
        if (links.length >= limit) return links;
      }
    }
  }

  return links;
}

export function getPillarInternalLinks(pillarSlug: PillarSlug): PillarInternalLinks {
  const column = megaMenuColumns.find((c) => c.pillarSlug === pillarSlug)!;

  const diensten = column.items.slice(0, 3).map((item) => ({
    href: item.href,
    label: item.menuLabel ?? item.name,
    hint: item.menuDescription ?? item.description,
  }));

  const kennisbank = getArticlesByCategory(pillarSlug)
    .slice(0, 2)
    .map((article) => ({
      href: `/kennisbank/${article.slug}`,
      label: article.title,
      hint: `${article.readMinutes} min lezen`,
    }));

  const zoeken = (PILLAR_ZOEKEN_LINKS[pillarSlug] ?? []).slice(0, 3).map((z) => ({
    href: `/zoeken/${z.slug}`,
    label: z.label,
  }));

  return { diensten, kennisbank, zoeken };
}

export function getCaseLinkForArticle(articleSlug: string): CaseLinkItem | null {
  const article = getKennisbankArticleBySlug(articleSlug);
  if (!article) return null;

  const caseSlug =
    ARTICLE_CASE_OVERRIDES[articleSlug] ?? PILLAR_CASE_FALLBACK[article.category].slug;

  const label =
    caseSlug === "skincomplete"
      ? "SkinComplete"
      : caseSlug === "bestrest"
        ? "BestRest"
        : "Hills Pilates";

  return {
    href: `/cases/${caseSlug}`,
    label,
    hook: CASE_HOOKS[caseSlug] ?? PILLAR_CASE_FALLBACK[article.category].hook,
  };
}

export const HOME_PILLAR_LINKS: readonly {
  slug: PillarSlug;
  label: string;
  hint: string;
}[] = [
  { slug: "strategie", label: "Strategie", hint: "Eerst het plan, dan budget" },
  { slug: "bouwen", label: "Bouwen", hint: "Sites & Shopify from scratch" },
  { slug: "vindbaarheid", label: "Vindbaarheid", hint: "SEO & AI-antwoorden" },
  { slug: "campagnes", label: "Campagnes", hint: "Google Ads, Meta & UGC" },
  { slug: "behoud", label: "Behoud", hint: "Mail, retentie & koppelingen" },
];
