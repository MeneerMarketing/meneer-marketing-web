import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

import { OG_IMAGE_SIZE, ogImageUrl } from "@/lib/seo/og-image";
import { INDEXABLE_ROBOTS } from "@/lib/seo/robots-policy";
export const SITE_NAME = "MeneerMarketing";

export const DEFAULT_OG_IMAGE = {
  url: absoluteUrl("/og/og-default.svg"),
  width: 1200,
  height: 630,
  alt: "MeneerMarketing. Marketing, websites en Shopify",
} as const;

export const HOME_PAGE_TITLE =
  "MeneerMarketing. Marketing, websites & Shopify";

export const HOME_PAGE_DESCRIPTION =
  "Websites from scratch, Shopify-shops, SEO, Google Ads, Meta Ads en e-mail. Eén strategisch partner voor online groei in Nederland.";

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
export function buildAlternates(path: string): NonNullable<Metadata["alternates"]> {
  const canonical = absoluteUrl(path);
  return {
    canonical,
    languages: {
      "nl-NL": canonical,
      "x-default": canonical,
    },
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