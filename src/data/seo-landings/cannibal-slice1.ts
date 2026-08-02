/**
 * P0.3 cannibal slice 1 — nationale synoniem-clusters.
 * Secondaries: 301 → primary + uit registry (sitemap / SSG).
 * City-clones van dezelfde bases blijven tot P0.4.
 */

export const SEO_LANDING_CANNIBAL_REDIRECTS = [
  // Google Ads → google-ads-bureau
  {
    source: "/zoeken/google-ads-beheer",
    destination: "/zoeken/google-ads-bureau",
    permanent: true,
  },
  {
    source: "/zoeken/google-ads-specialist",
    destination: "/zoeken/google-ads-bureau",
    permanent: true,
  },
  {
    source: "/zoeken/google-ads-uitbesteden",
    destination: "/zoeken/google-ads-bureau",
    permanent: true,
  },
  {
    source: "/zoeken/sea-specialist",
    destination: "/zoeken/google-ads-bureau",
    permanent: true,
  },
  {
    source: "/zoeken/ppc-bureau",
    destination: "/zoeken/google-ads-bureau",
    permanent: true,
  },
  {
    source: "/zoeken/advertentiebeheer",
    destination: "/zoeken/google-ads-bureau",
    permanent: true,
  },
  // SEO → seo-specialist
  {
    source: "/zoeken/seo-bureau",
    destination: "/zoeken/seo-specialist",
    permanent: true,
  },
  {
    source: "/zoeken/seo-uitbesteden",
    destination: "/zoeken/seo-specialist",
    permanent: true,
  },
  {
    source: "/zoeken/zoekmachine-optimalisatie",
    destination: "/zoeken/seo-specialist",
    permanent: true,
  },
  {
    source: "/zoeken/zoekmachine-marketing",
    destination: "/zoeken/seo-specialist",
    permanent: true,
  },
  // Online marketing → online-marketing-bureau
  {
    source: "/zoeken/marketing-bureau",
    destination: "/zoeken/online-marketing-bureau",
    permanent: true,
  },
  {
    source: "/zoeken/digital-marketing-bureau",
    destination: "/zoeken/online-marketing-bureau",
    permanent: true,
  },
  {
    source: "/zoeken/internetmarketing-bureau",
    destination: "/zoeken/online-marketing-bureau",
    permanent: true,
  },
  {
    source: "/zoeken/online-marketing-specialist",
    destination: "/zoeken/online-marketing-bureau",
    permanent: true,
  },
  // Website → website-laten-maken
  {
    source: "/zoeken/website-laten-bouwen",
    destination: "/zoeken/website-laten-maken",
    permanent: true,
  },
  {
    source: "/zoeken/website-laten-ontwerpen",
    destination: "/zoeken/website-laten-maken",
    permanent: true,
  },
  {
    source: "/zoeken/website-specialist",
    destination: "/zoeken/website-laten-maken",
    permanent: true,
  },
  {
    source: "/zoeken/website-ontwikkelaar",
    destination: "/zoeken/website-laten-maken",
    permanent: true,
  },
  {
    source: "/zoeken/webdesign-bureau",
    destination: "/zoeken/website-laten-maken",
    permanent: true,
  },
  {
    source: "/zoeken/webdesign-specialist",
    destination: "/zoeken/website-laten-maken",
    permanent: true,
  },
  // E-mail → e-mailmarketing
  {
    source: "/zoeken/email-marketing",
    destination: "/zoeken/e-mailmarketing",
    permanent: true,
  },
  {
    source: "/zoeken/e-mailmarketing-bureau",
    destination: "/zoeken/e-mailmarketing",
    permanent: true,
  },
] as const;

/** Nationale slugs die uit de registry gaan (city-clones mogen de page-module nog gebruiken). */
export const SEO_LANDING_CANNIBAL_PRUNE_SLUGS: ReadonlySet<string> = new Set(
  SEO_LANDING_CANNIBAL_REDIRECTS.map((r) => r.source.replace("/zoeken/", "")),
);

/** Map secondary → primary voor relatedSlugs-rewrites. */
export const SEO_LANDING_CANNIBAL_PRIMARY_BY_SLUG: Readonly<Record<string, string>> =
  Object.fromEntries(
    SEO_LANDING_CANNIBAL_REDIRECTS.map((r) => [
      r.source.replace("/zoeken/", ""),
      r.destination.replace("/zoeken/", ""),
    ]),
  );
