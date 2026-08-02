/**
 * P0.3 cannibal slice 2 — Shopify, Meta, e-com, CRO, AI (+ social synonym).
 * Secondaries: 301 → primary + uit registry.
 */

export const SEO_LANDING_CANNIBAL_REDIRECTS_SLICE2 = [
  // Shopify → shopify-expert
  {
    source: "/zoeken/shopify-webshop-laten-maken",
    destination: "/zoeken/shopify-expert",
    permanent: true,
  },
  {
    source: "/zoeken/shopify-theme-laten-maken",
    destination: "/zoeken/shopify-expert",
    permanent: true,
  },
  // Meta → meta-ads-bureau
  {
    source: "/zoeken/facebook-ads-bureau",
    destination: "/zoeken/meta-ads-bureau",
    permanent: true,
  },
  {
    source: "/zoeken/instagram-ads-bureau",
    destination: "/zoeken/meta-ads-bureau",
    permanent: true,
  },
  // E-com → e-commerce-marketing
  {
    source: "/zoeken/ecommerce-specialist",
    destination: "/zoeken/e-commerce-marketing",
    permanent: true,
  },
  {
    source: "/zoeken/webshop-marketing",
    destination: "/zoeken/e-commerce-marketing",
    permanent: true,
  },
  // CRO → conversie-optimalisatie
  {
    source: "/zoeken/cro-bureau",
    destination: "/zoeken/conversie-optimalisatie",
    permanent: true,
  },
  // AI → vindbaarheid-ai
  {
    source: "/zoeken/chatgpt-vindbaarheid",
    destination: "/zoeken/vindbaarheid-ai",
    permanent: true,
  },
  // Social synonym → social-media-advertising
  {
    source: "/zoeken/social-media-marketing-bureau",
    destination: "/zoeken/social-media-advertising",
    permanent: true,
  },
] as const;

export const SEO_LANDING_CANNIBAL_PRUNE_SLUGS_SLICE2: ReadonlySet<string> = new Set(
  SEO_LANDING_CANNIBAL_REDIRECTS_SLICE2.map((r) =>
    r.source.replace("/zoeken/", ""),
  ),
);

export const SEO_LANDING_CANNIBAL_PRIMARY_BY_SLUG_SLICE2: Readonly<
  Record<string, string>
> = Object.fromEntries(
  SEO_LANDING_CANNIBAL_REDIRECTS_SLICE2.map((r) => [
    r.source.replace("/zoeken/", ""),
    r.destination.replace("/zoeken/", ""),
  ]),
);
