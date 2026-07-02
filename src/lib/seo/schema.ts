import { businessEmail, businessKvk } from "@/lib/contact";
import { absoluteUrl, siteUrl } from "@/lib/site";

/**
 * Centrale JSON-LD builders. Elke pagina bouwt hier zijn structured data mee,
 * zodat Organization, Article, Service, FAQ en Breadcrumb overal consistent
 * zijn opgebouwd.
 */

export type JsonLdObject = Record<string, unknown>;

export const organizationJsonLd: JsonLdObject = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "MeneerMarketing",
  url: siteUrl,
  email: businessEmail,
  identifier: {
    "@type": "PropertyValue",
    propertyID: "KVK",
    value: businessKvk,
  },
  description:
    "Marketingbureau voor groei: websites from scratch, Shopify-webshops, SEO, Google Ads, Meta Ads, e-mailmarketing en slimme koppelingen.",
  areaServed: "NL",
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: businessEmail,
      availableLanguage: ["nl-NL", "Dutch"],
    },
  ],
};

export const websiteJsonLd: JsonLdObject = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "MeneerMarketing",
  url: siteUrl,
  description:
    "Groei, web, marketing en automatisering. Strategisch partner voor ondernemers.",
  publisher: {
    "@type": "Organization",
    name: "MeneerMarketing",
    url: siteUrl,
  },
  inLanguage: "nl-NL",
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
    author: {
      "@type": "Organization",
      name: "MeneerMarketing",
    },
    publisher: {
      "@type": "Organization",
      name: "MeneerMarketing",
      url: siteUrl,
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
}): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    provider: {
      "@type": "Organization",
      name: "MeneerMarketing",
      url: siteUrl,
    },
    areaServed: "NL",
    url: absoluteUrl(input.path),
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
