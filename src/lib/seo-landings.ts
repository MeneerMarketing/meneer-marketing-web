import type { Metadata } from "next";
import type { SeoLandingPage } from "@/data/seo-landings/types";
import {
  getAllSeoLandingPages,
  getAllSeoLandingSlugs,
  getSeoLandingBySlug,
} from "@/data/seo-landings/registry";
import { buildPageMetadata } from "@/lib/seo/site-metadata";
import { absoluteUrl } from "@/lib/site";

export { getAllSeoLandingPages, getAllSeoLandingSlugs, getSeoLandingBySlug };

export function seoLandingPath(slug: string): string {
  return `/zoeken/${slug}`;
}

export function seoLandingUrl(slug: string): string {
  return absoluteUrl(seoLandingPath(slug));
}

export function buildSeoLandingMetadata(page: SeoLandingPage): Metadata {
  return buildPageMetadata({
    title: page.metaTitle,
    titleAbsolute: true,
    description: page.metaDescription,
    path: seoLandingPath(page.slug),
    keywords: [...page.keywords],
  });
}

/** Basis voor stad-varianten: pas slug, keyword en locatie aan. */
export function withSeoLandingLocation(
  page: SeoLandingPage,
  location: SeoLandingPage["location"],
  slugSuffix: string,
): SeoLandingPage {
  if (!location) return page;

  const city = location.city;
  const cityLower = city.toLowerCase();
  const keyword = `${page.primaryKeyword} ${cityLower}`;
  const baseTitle = page.metaTitle.split("·")[0]?.trim() ?? page.metaTitle;
  const isApeldoorn = city === "Apeldoorn";

  const localIntro = isApeldoorn
    ? `Meneer Marketing is gevestigd in Apeldoorn. Ik werk hier met MKB op de Veluwe en landelijk met dezelfde aanpak. `
    : location.region === "Gelderland"
      ? `Ondernemers in ${city} en Gelderland zoeken steeds vaker online voordat ze bellen. `
      : `Lokaal relevant in ${city}${location.region ? ` (${location.region})` : ""}: `;

  const localSub = isApeldoorn
    ? `${page.subheadline} Ik zit in Apeldoorn. Geen bureau op afstand dat de Veluwe alleen van de A1 kent. ${page.primaryKeyword} hier pak ik aan met lokale context én dezelfde custom build en campagnes als voor SkinComplete en BestRest.`
    : `${page.subheadline} Ik help ondernemers in ${city}${location.region ? ` en ${location.region}` : ""} met ${page.primaryKeyword} dat rankt én converteert. Ook landelijk, als je online wilt groeien.`;

  return {
    ...page,
    slug: `${page.slug}-${slugSuffix}`,
    primaryKeyword: keyword,
    location,
    metaTitle: isApeldoorn
      ? `${baseTitle} Apeldoorn · thuisbasis Meneer Marketing`
      : `${baseTitle} ${city} · Meneer Marketing`,
    metaDescription: `${localIntro}${page.metaDescription.replace(/\.$/, "")} voor MKB in ${city} en omgeving.`,
    eyebrow: isApeldoorn ? `${page.eyebrow} · Apeldoorn · thuisbasis` : `${page.eyebrow} · ${city}`,
    headline: page.headline,
    headlineAccent: page.headlineAccent,
    subheadline: localSub,
    keywords: [
      ...page.keywords,
      keyword,
      `${page.primaryKeyword} ${cityLower}`,
      `${cityLower} ${page.category === "google-ads" ? "google ads" : page.primaryKeyword}`,
    ],
    visualCaption:
      page.visualCaption ??
      `Zo pakken we ${page.primaryKeyword} aan voor ondernemers rond ${city}.`,
  };
}
