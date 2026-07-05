import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

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
}): NonNullable<Metadata["openGraph"]> {
  return {
    type: input.type ?? "website",
    locale: "nl_NL",
    siteName: SITE_NAME,
    title: input.title,
    description: input.description,
    url: absoluteUrl(input.path),
    images: [DEFAULT_OG_IMAGE],
  };
}

export function buildTwitter(input: {
  title: string;
  description: string;
}): NonNullable<Metadata["twitter"]> {
  return {
    card: "summary_large_image",
    title: input.title,
    description: input.description,
    images: [DEFAULT_OG_IMAGE.url],
  };
}
