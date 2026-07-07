import {
  businessEmail,
  businessKvk,
  businessKvkDisplay,
  businessLocation,
  businessSameAs,
} from "@/lib/contact";
import { absoluteUrl } from "@/lib/site";

/** Publieke merknaam voor copy en schema (met spatie). */
export const BRAND_DISPLAY = "Meneer Marketing";

/** Juridische / site-naam (zonder spatie). */
export const BRAND_LEGAL = "MeneerMarketing";

export const FOUNDER_NAME = "Meneer Marketing";

export const FOUNDER_JOB_TITLE =
  "Online marketing manager, developer & founder";

export const FOUNDER_EXPERIENCE = "12+ jaar webdesign en marketing";

export const FOUNDER_BIO =
  "Afgestudeerd als applicatieontwikkelaar. Twaalf jaar webdesign en marketing op eigen naam. Websites from scratch, Shopify, SEO, Google Ads, Meta Ads en automatisering voor MKB in Nederland.";

/** Optioneel: echte foto via env. Fallback: merk-icoon. */
export const founderImageUrl: string =
  process.env.NEXT_PUBLIC_FOUNDER_IMAGE_URL?.trim() ||
  absoluteUrl("/icon.svg");

export const founderProfileUrl = absoluteUrl("/over");

export const organizationTrustLine = `${businessKvkDisplay} · ${businessLocation.city}, ${businessLocation.region}`;

export function founderPersonSchema(): Record<string, unknown> {
  return {
    "@type": "Person",
    name: FOUNDER_NAME,
    alternateName: BRAND_LEGAL,
    jobTitle: FOUNDER_JOB_TITLE,
    description: FOUNDER_BIO,
    url: founderProfileUrl,
    image: founderImageUrl,
    email: businessEmail,
    knowsAbout: [
      "Marketingstrategie",
      "Shopify",
      "SEO",
      "Google Ads",
      "Meta Ads",
      "Next.js",
      "E-mailmarketing",
      "Marketingautomatisering",
    ],
    worksFor: {
      "@type": "Organization",
      name: BRAND_LEGAL,
      alternateName: BRAND_DISPLAY,
      url: absoluteUrl("/"),
      identifier: {
        "@type": "PropertyValue",
        propertyID: "KVK",
        value: businessKvk,
      },
    },
    ...(businessSameAs.length > 0 ? { sameAs: businessSameAs } : {}),
  };
}
