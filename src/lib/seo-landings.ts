import type { Metadata } from "next";
import type { SeoLandingPage } from "@/data/seo-landings/types";
import {
  getAllSeoLandingPages,
  getAllSeoLandingSlugs,
  getSeoLandingBySlug,
} from "@/data/seo-landings/registry";
import { absoluteUrl } from "@/lib/site";

export { getAllSeoLandingPages, getAllSeoLandingSlugs, getSeoLandingBySlug };

export function seoLandingPath(slug: string): string {
  return `/zoeken/${slug}`;
}

export function seoLandingUrl(slug: string): string {
  return absoluteUrl(seoLandingPath(slug));
}

export function buildSeoLandingMetadata(page: SeoLandingPage): Metadata {
  const url = seoLandingUrl(page.slug);

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    keywords: [...page.keywords],
    alternates: { canonical: url },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url,
      siteName: "MeneerMarketing",
      locale: "nl_NL",
      type: "website",
      images: [
        {
          url: absoluteUrl("/og/og-default.svg"),
          width: 1200,
          height: 630,
          alt: page.metaTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.metaTitle,
      description: page.metaDescription,
      images: [absoluteUrl("/og/og-default.svg")],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  };
}

/** Basis voor stad-varianten: pas slug, keyword en locatie aan. */
export function withSeoLandingLocation(
  page: SeoLandingPage,
  location: SeoLandingPage["location"],
  slugSuffix: string,
): SeoLandingPage {
  if (!location) return page;

  const city = location.city;
  const keyword = `${page.primaryKeyword} ${city.toLowerCase()}`;

  return {
    ...page,
    slug: `${page.slug}-${slugSuffix}`,
    primaryKeyword: keyword,
    location,
    metaTitle: `${page.metaTitle.split("·")[0]?.trim()} ${city} · Meneer Marketing`,
    metaDescription: page.metaDescription.replace(
      /\.$/,
      ` in ${city} en omgeving.`,
    ),
    eyebrow: `${page.eyebrow} · ${city}`,
    headline: page.headline,
    subheadline: `${page.subheadline} Ook actief rond ${city}${location.region ? ` (${location.region})` : ""}.`,
    keywords: [...page.keywords, `${page.primaryKeyword} ${city.toLowerCase()}`],
  };
}
