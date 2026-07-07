import type { Metadata } from "next";
import type { SeoLandingPage } from "@/data/seo-landings/types";
import {
  getAllSeoLandingPages,
  getAllSeoLandingSlugs,
  getSeoLandingBySlug,
} from "@/data/seo-landings/registry";
import { buildPageMetadata } from "@/lib/seo/site-metadata";
import { absoluteUrl } from "@/lib/site";

export { withSeoLandingLocation } from "@/lib/seo-landings-location";
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

