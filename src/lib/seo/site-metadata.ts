import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

import { OG_IMAGE_SIZE, ogImageUrl } from "@/lib/seo/og-image";
import { INDEXABLE_ROBOTS } from "@/lib/seo/robots-policy";
import { BRAND_DISPLAY, BRAND_LEGAL } from "@/lib/seo/e-e-a-t";

/** Zichtbare merknaam in titles, OG en UI. */
export const SITE_NAME = BRAND_DISPLAY;

/** Technische / juridische naam (schema alternateName, e-mail domein). */
export const SITE_NAME_LEGAL = BRAND_LEGAL;

export const HOME_PAGE_TITLE =
  "Online marketing manager voor je groei | Meneer Marketing";

export const HOME_PAGE_DESCRIPTION =
  "Websites from scratch, SEO, Google Ads, Meta Ads, Shopify en e-mail. Twaalf jaar ervaring met wat online echt werkt. Zo help ik je bedrijf groeien.";

export function buildOpenGraph(input: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  ogImageUrl?: string;
}): NonNullable<Metadata["openGraph"]> {
  const imageUrl =
    input.ogImageUrl ??
    ogImageUrl({ title: input.title, subtitle: input.description });
  return {
    type: input.type ?? "website",
    locale: "nl_NL",
    siteName: SITE_NAME,
    title: input.title,
    description: input.description,
    url: absoluteUrl(input.path),
    images: [
      {
        url: imageUrl,
        width: OG_IMAGE_SIZE.width,
        height: OG_IMAGE_SIZE.height,
        alt: input.title,
      },
    ],
    ...(input.publishedTime ? { publishedTime: input.publishedTime } : {}),
    ...(input.modifiedTime ? { modifiedTime: input.modifiedTime } : {}),
  };
}

export function buildTwitter(input: {
  title: string;
  description: string;
  ogImageUrl?: string;
}): NonNullable<Metadata["twitter"]> {
  const imageUrl =
    input.ogImageUrl ??
    ogImageUrl({ title: input.title, subtitle: input.description });
  return {
    card: "summary_large_image",
    title: input.title,
    description: input.description,
    images: [imageUrl],
  };
}
/**
 * Alleen canonical, geen hreflang: de site is eentalig (nl). Hreflang-tags
 * die naar zichzelf wijzen voegen niets toe en zijn alleen signaalruis.
 * Pas toevoegen zodra er echt een tweede taal- of regioversie bestaat.
 */
export function buildAlternates(path: string): NonNullable<Metadata["alternates"]> {
  return {
    canonical: absoluteUrl(path),
  };
}

/** Centrale metadata-builder: canonical, hreflang, robots, OG en Twitter. */
export function buildPageMetadata(input: {
  title: string;
  description: string;
  path: string;
  /** Gebruik absolute title om dubbele suffix van layout-template te vermijden. */
  titleAbsolute?: boolean;
  keywords?: string[];
  type?: "website" | "article";
  robots?: Metadata["robots"];
  publishedTime?: string;
  modifiedTime?: string;
  ogAccent?: string;
}): Metadata {
  const ogTitle = input.titleAbsolute
    ? input.title
    : `${input.title} | ${SITE_NAME}`;
  const dynamicOg = ogImageUrl({
    title: ogTitle,
    subtitle: input.description,
    accent: input.ogAccent,
  });

  return {
    title: input.titleAbsolute ? { absolute: input.title } : input.title,
    description: input.description,
    ...(input.keywords?.length ? { keywords: input.keywords } : {}),
    alternates: buildAlternates(input.path),
    robots: input.robots ?? INDEXABLE_ROBOTS,
    openGraph: buildOpenGraph({
      title: ogTitle,
      description: input.description,
      path: input.path,
      type: input.type,
      publishedTime: input.publishedTime,
      modifiedTime: input.modifiedTime,
      ogImageUrl: dynamicOg,
    }),
    twitter: buildTwitter({
      title: ogTitle,
      description: input.description,
      ogImageUrl: dynamicOg,
    }),
  };
}