/** Canonieke basis-URL voor metadata, sitemap en JSON-LD. */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://meneermarketing.nl";

export const siteOrigin = siteUrl.replace(/\/$/, "");

export function absoluteUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${siteOrigin}${p}`;
}
