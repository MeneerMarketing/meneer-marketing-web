import { businessEmail, businessKvk, businessLocation, businessPhone, businessPostalCode, businessSameAs, businessStreetAddress } from "@/lib/contact";
import {
  BRAND_DISPLAY,
  BRAND_LEGAL,
  FOUNDER_BIO,
  FOUNDER_JOB_TITLE,
  FOUNDER_NAME,
  founderImageUrl,
  founderPersonSchema,
  founderProfileUrl,
} from "@/lib/seo/e-e-a-t";
import { HOME_PAGE_DESCRIPTION } from "@/lib/seo/site-metadata";
import { absoluteUrl, siteUrl } from "@/lib/site";
/**
 * Centrale JSON-LD builders. Elke pagina bouwt hier zijn structured data mee,
 * zodat Organization, Article, Service, FAQ en Breadcrumb overal consistent
 * zijn opgebouwd.
 */

export type JsonLdObject = Record<string, unknown>;

function postalAddressJsonLd(): JsonLdObject {
  return {
    "@type": "PostalAddress",
    ...(businessStreetAddress ? { streetAddress: businessStreetAddress } : {}),
    ...(businessPostalCode ? { postalCode: businessPostalCode } : {}),
    addressLocality: businessLocation.city,
    addressRegion: businessLocation.region,
    addressCountry: businessLocation.country,
  };
}

function orgRef(extra?: JsonLdObject): JsonLdObject {
  return {
    "@type": "Organization",
    name: BRAND_LEGAL,
    alternateName: BRAND_DISPLAY,
    url: siteUrl,
    ...extra,
  };
}

function websiteRef(): JsonLdObject {
  return {
    "@type": "WebSite",
    name: BRAND_LEGAL,
    alternateName: BRAND_DISPLAY,
    url: siteUrl,
  };
}

export const organizationJsonLd: JsonLdObject = {
  "@context": "https://schema.org",
  "@type": ["Organization", "ProfessionalService"],
  name: BRAND_LEGAL,
  alternateName: BRAND_DISPLAY,
  url: siteUrl,
  logo: absoluteUrl("/icon-512.png"),
  image: absoluteUrl("/og/og-default.svg"),
  email: businessEmail,
  ...(businessPhone ? { telephone: businessPhone } : {}),
  address: postalAddressJsonLd(),
  identifier: {
    "@type": "PropertyValue",
    propertyID: "KVK",
    value: businessKvk,
  },
  description: HOME_PAGE_DESCRIPTION,
  founder: founderPersonSchema(),
  areaServed: [
    { "@type": "Country", name: "Nederland" },
    { "@type": "City", name: businessLocation.city },
  ],
  ...(businessSameAs.length > 0 ? { sameAs: businessSameAs } : {}),
  knowsAbout: [
    "Zoekmachine optimalisatie",
    "Google Ads",
    "Meta Ads",
    "Shopify",
    "Next.js webdevelopment",
    "E-mailmarketing",
    "Marketingautomatisering",
    "Vindbaarheid in AI-antwoorden",
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: businessEmail,
      ...(businessPhone ? { telephone: businessPhone } : {}),
      availableLanguage: ["nl-NL", "Dutch"],
      areaServed: "NL",
    },
  ],
};

export const websiteJsonLd: JsonLdObject = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: BRAND_LEGAL,
  alternateName: BRAND_DISPLAY,
  url: siteUrl,
  description: HOME_PAGE_DESCRIPTION,
  publisher: {
    "@type": "Organization",
    name: BRAND_LEGAL,
    alternateName: BRAND_DISPLAY,
    url: siteUrl,
    logo: absoluteUrl("/icon-512.png"),
  },
  inLanguage: "nl-NL",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${siteUrl}/zoeken?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function articleJsonLd(input: {
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  url: string;
  keywords?: string[];
}): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    author: founderPersonSchema(),
    publisher: {
      "@type": "Organization",
      name: BRAND_LEGAL,
      alternateName: BRAND_DISPLAY,
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/icon-512.png"),
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": input.url,
    },
    inLanguage: "nl-NL",
    ...(input.keywords?.length ? { keywords: input.keywords.join(", ") } : {}),
  };
}

export function faqPageJsonLd(
  faqs: { question: string; answer: string }[],
): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}

export function serviceJsonLd(input: {
  name: string;
  description: string;
  path: string;
  areaServed?: string | { "@type": "City"; name: string };
  serviceType?: string;
}): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    provider: orgRef(),
    areaServed: input.areaServed ?? "NL",
    url: absoluteUrl(input.path),
    ...(input.serviceType ? { serviceType: input.serviceType } : {}),
  };
}

export function aboutPageJsonLd(input: {
  name: string;
  description: string;
  path: string;
}): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    inLanguage: "nl-NL",
    isPartOf: websiteRef(),
    about: orgRef({
      description: organizationJsonLd.description as string,
    }),
  };
}

export function contactPageJsonLd(input: {
  name: string;
  description: string;
  path: string;
}): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    inLanguage: "nl-NL",
    mainEntity: {
      "@type": "ProfessionalService",
      name: BRAND_DISPLAY,
      url: siteUrl,
      email: businessEmail,
      ...(businessPhone ? { telephone: businessPhone } : {}),
      address: postalAddressJsonLd(),
      areaServed: [
        { "@type": "Country", name: "Nederland" },
        { "@type": "City", name: businessLocation.city },
      ],
      identifier: {
        "@type": "PropertyValue",
        propertyID: "KVK",
        value: businessKvk,
      },
    },
  };
}

export function localBusinessJsonLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Meneer Marketing",
    description:
      "Marketingbureau gevestigd in Apeldoorn. Websites from scratch, SEO, Google Ads, Meta Ads en automatisering.",
    url: siteUrl,
    email: businessEmail,
    ...(businessPhone ? { telephone: businessPhone } : {}),
    address: postalAddressJsonLd(),
    areaServed: [
      { "@type": "City", name: businessLocation.city },
      { "@type": "AdministrativeArea", name: businessLocation.region },
      { "@type": "Country", name: "Nederland" },
    ],
    priceRange: "$$",
  };
}

export function casesItemListJsonLd(
  cases: { name: string; description: string; url?: string }[],
): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Cases Meneer Marketing",
    description:
      "Succesverhalen met Shopify, SEO, ads en custom build. Cases die je zelf kunt checken.",
    itemListElement: cases.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "CreativeWork",
        name: item.name,
        description: item.description,
        ...(item.url ? { url: item.url } : {}),
        creator: orgRef(),
      },
    })),
  };
}

export function personJsonLd(input: {
  name?: string;
  jobTitle?: string;
  description?: string;
  url?: string;
}): JsonLdObject {
  const base = founderPersonSchema();
  return {
    "@context": "https://schema.org",
    ...base,
    name: input.name ?? FOUNDER_NAME,
    jobTitle: input.jobTitle ?? FOUNDER_JOB_TITLE,
    description: input.description ?? FOUNDER_BIO,
    url: input.url ?? founderProfileUrl,
    image: founderImageUrl,
  };
}

export function caseStudyJsonLd(input: {
  client: string;
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  keywords?: readonly string[];
  clientWebsite?: string;
}): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    url: input.url,
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    author: founderPersonSchema(),
    publisher: {
      "@type": "Organization",
      name: BRAND_LEGAL,
      alternateName: BRAND_DISPLAY,
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/icon-512.png"),
      },
    },
    ...(input.image
      ? {
          image: {
            "@type": "ImageObject",
            url: input.image.startsWith("http") ? input.image : absoluteUrl(input.image),
          },
        }
      : {}),
    about: {
      "@type": "Organization",
      name: input.client,
      ...(input.clientWebsite ? { url: input.clientWebsite } : {}),
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": input.url,
    },
    inLanguage: "nl-NL",
    ...(input.keywords?.length ? { keywords: input.keywords.join(", ") } : {}),
  };
}

export function collectionPageJsonLd(input: {
  name: string;
  description: string;
  path: string;
  items: { name: string; path: string }[];
}): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    inLanguage: "nl-NL",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: input.items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: absoluteUrl(item.path),
      })),
    },
  };
}

export function webPageJsonLd(input: {
  name: string;
  description: string;
  path: string;
  dateModified?: string;
  datePublished?: string;
}): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    inLanguage: "nl-NL",
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    dateModified: input.dateModified ?? "2026-08-07",
    isPartOf: websiteRef(),
    publisher: orgRef(),
  };
}

/** Default freshness voor SEO-landings (align met sitemap SEO_LANDING_LAST_MOD). */
const SEO_LANDING_SCHEMA_MODIFIED = "2026-08-08";

export function seoLandingPageGraph(input: {
  name: string;
  headline: string;
  description: string;
  path: string;
  breadcrumbs: { name: string; path: string }[];
  faqs: { question: string; answer: string }[];
  areaServed?: string | { "@type": "City"; name: string };
  serviceType?: string;
  isApeldoornHQ?: boolean;
  dateModified?: string;
}): JsonLdObject {
  const url = absoluteUrl(input.path);
  const dateModified = input.dateModified ?? SEO_LANDING_SCHEMA_MODIFIED;
  const graph: JsonLdObject[] = [
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      name: input.name,
      headline: input.headline,
      description: input.description,
      url,
      inLanguage: "nl-NL",
      dateModified,
      isPartOf: websiteRef(),
      publisher: orgRef(),
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["#seo-expert-summary", "h1"],
      },
      mainEntity: { "@id": `${url}#service` },
    },
    {
      "@type": "Service",
      "@id": `${url}#service`,
      name: input.name,
      description: input.description,
      url,
      serviceType: input.serviceType ?? "Marketingdienst",
      provider: orgRef({ email: businessEmail }),
      areaServed: input.areaServed ?? "NL",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: input.breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: absoluteUrl(item.path),
      })),
    },
  ];

  if (input.faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: input.faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    });
  }

  if (input.isApeldoornHQ) {
    graph.push({
      "@type": "ProfessionalService",
      "@id": `${url}#local`,
      name: BRAND_DISPLAY,
      description:
        "Marketingbureau gevestigd in Apeldoorn. Websites from scratch, SEO, Google Ads, Meta Ads en automatisering.",
      url: siteUrl,
      email: businessEmail,
      areaServed: { "@type": "City", name: "Apeldoorn" },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Apeldoorn",
        addressRegion: "Gelderland",
        addressCountry: "NL",
      },
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
