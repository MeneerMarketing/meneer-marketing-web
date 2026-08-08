/**
 * 301-redirects van oude URL's naar nieuwe routes.
 * Uitbreiden zodra Okan de oude sitemap levert.
 */
export const LEGACY_REDIRECTS: readonly {
  source: string;
  destination: string;
}[] = [
  { source: "/over", destination: "/over-ons" },
  { source: "/about", destination: "/over-ons" },
  { source: "/tarieven", destination: "/prijzen" },
  { source: "/prijs", destination: "/prijzen" },
  { source: "/afspraak", destination: "/intake" },
  { source: "/boeken", destination: "/intake" },
  { source: "/laser", destination: "/laserontharing" },
  {
    source: "/laserontharing/prijzen",
    destination: "/laserontharing/configurator",
  },
] as const;
