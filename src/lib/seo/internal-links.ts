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

/** Commerciële zoek-landings per dienst (max 2). */
export const DIENST_ZOEKEN_LINKS: Readonly<
  Record<string, readonly { slug: string; label: string }[]>
> = {
  strategie: [
    { slug: "digital-marketing-bureau", label: "Digital marketing bureau" },
    { slug: "online-marketing-bureau", label: "Online marketing bureau" },
  ],
  adverteren: [
    { slug: "google-ads-beheer", label: "Google Ads beheer" },
    { slug: "ppc-bureau", label: "PPC bureau" },
  ],
  cro: [
    { slug: "cro-bureau", label: "CRO bureau" },
    { slug: "conversie-optimalisatie", label: "Conversie optimalisatie" },
  ],
  leadgeneratie: [
    { slug: "leadgeneratie-website", label: "Leadgeneratie website" },
    { slug: "digital-marketing-bureau", label: "Digital marketing bureau" },
  ],
  tracking: [
    { slug: "tracking-google-analytics", label: "Tracking & Google Analytics" },
    { slug: "technische-seo", label: "Technische SEO" },
  ],
  webdevelopment: [
    { slug: "website-laten-bouwen", label: "Website laten bouwen" },
    { slug: "webdesign-bureau", label: "Webdesign bureau" },
  ],
  "shopify-enterprise": [
    { slug: "shopify-webshop-laten-maken", label: "Shopify webshop laten maken" },
    { slug: "shopify-expert", label: "Shopify expert" },
  ],
  "web-apps": [
    { slug: "b2b-portaal-bouwen", label: "B2B portaal bouwen" },
    { slug: "website-laten-bouwen", label: "Website laten bouwen" },
  ],
  optimalisatie: [
    { slug: "technische-seo", label: "Technische SEO" },
    { slug: "website-laten-bouwen", label: "Website laten bouwen" },
  ],
  webdesign: [
    { slug: "webdesign-bureau", label: "Webdesign bureau" },
    { slug: "landing-page-laten-maken", label: "Landing page laten maken" },
  ],
  branding: [
    { slug: "webdesign-bureau", label: "Webdesign bureau" },
    { slug: "website-laten-bouwen", label: "Website laten bouwen" },
  ],
  animaties: [
    { slug: "webdesign-bureau", label: "Webdesign bureau" },
    { slug: "website-laten-bouwen", label: "Website laten bouwen" },
  ],
  seo: [
    { slug: "hoger-in-google", label: "Hoger in Google" },
    { slug: "seo-uitbesteden", label: "SEO uitbesteden" },
  ],
  "ai-zoek": [
    { slug: "chatgpt-vindbaarheid", label: "Vindbaar in ChatGPT" },
    { slug: "vindbaarheid-ai", label: "Vindbaarheid in AI" },
  ],
  "local-seo": [
    { slug: "lokale-seo", label: "Lokale SEO" },
    { slug: "google-maps-marketing", label: "Google Maps marketing" },
  ],
  "content-marketing": [
    { slug: "zoekmachine-optimalisatie", label: "Zoekmachine optimalisatie" },
    { slug: "content-marketing-vindbaarheid", label: "Content marketing vindbaarheid" },
  ],
  reviews: [
    { slug: "lokale-seo", label: "Lokale SEO" },
    { slug: "google-maps-marketing", label: "Google Maps marketing" },
  ],
  "google-ads": [
    { slug: "google-ads-bureau", label: "Google Ads bureau" },
    { slug: "google-ads-specialist", label: "Google Ads specialist" },
  ],
  "meta-ads": [
    { slug: "meta-ads-bureau", label: "Meta Ads bureau" },
    { slug: "facebook-ads-bureau", label: "Facebook Ads bureau" },
  ],
  "social-media": [
    { slug: "social-media-advertising", label: "Social media advertising" },
    { slug: "instagram-ads-bureau", label: "Instagram Ads bureau" },
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
    { slug: "shopify-webshop-laten-maken", label: "Shopify webshop laten maken" },
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
      { slug: "digital-marketing-bureau", label: "Digital marketing bureau" },
      { slug: "online-marketing-bureau", label: "Online marketing bureau" },
    ],
    bouwen: [
      { slug: "website-laten-bouwen", label: "Website laten bouwen" },
      { slug: "shopify-webshop-laten-maken", label: "Shopify webshop laten maken" },
    ],
    vindbaarheid: [
      { slug: "hoger-in-google", label: "Hoger in Google" },
      { slug: "chatgpt-vindbaarheid", label: "Vindbaar in ChatGPT" },
    ],
    campagnes: [
      { slug: "google-ads-bureau", label: "Google Ads bureau" },
      { slug: "meta-ads-bureau", label: "Meta Ads bureau" },
    ],
    behoud: [
      { slug: "e-mailmarketing", label: "E-mailmarketing" },
      { slug: "marketing-automatisering", label: "Marketing automatisering" },
    ],
  };

const ARTICLE_ZOEKEN_OVERRIDES: Partial<
  Record<string, readonly { slug: string; label: string }[]>
> = {
  "concurrent-hoger-in-google": [
    { slug: "hoger-in-google", label: "Hoger in Google" },
    { slug: "seo-uitbesteden", label: "SEO uitbesteden" },
  ],
  "google-reviews-lokale-seo": [
    { slug: "lokale-seo", label: "Lokale SEO" },
    { slug: "google-maps-marketing", label: "Google Maps marketing" },
  ],
  "instagram-ads-geen-leads": [
    { slug: "instagram-ads-bureau", label: "Instagram Ads bureau" },
    { slug: "facebook-ads-bureau", label: "Facebook Ads bureau" },
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
    { slug: "shopify-webshop-laten-maken", label: "Shopify webshop laten maken" },
    { slug: "b2b-portaal-bouwen", label: "B2B portaal bouwen" },
  ],
  "seo-eerst-dan-ads": [
    { slug: "hoger-in-google", label: "Hoger in Google" },
    { slug: "google-ads-bureau", label: "Google Ads bureau" },
  ],
  "chatgpt-modellen-marketeer-2026": [
    { slug: "chatgpt-vindbaarheid", label: "Vindbaar in ChatGPT" },
    { slug: "vindbaarheid-ai", label: "Vindbaarheid in AI" },
  ],
  "google-ai-overviews-clicks-2026": [
    { slug: "hoger-in-google", label: "Hoger in Google" },
    { slug: "content-marketing-vindbaarheid", label: "Content marketing vindbaarheid" },
  ],
  "consent-mode-google-ads-2026": [
    { slug: "tracking-google-analytics", label: "Tracking & Google Analytics" },
    { slug: "google-ads-bureau", label: "Google Ads bureau" },
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

  const zoeken = (PILLAR_ZOEKEN_LINKS[pillarSlug] ?? []).slice(0, 2).map((z) => ({
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
