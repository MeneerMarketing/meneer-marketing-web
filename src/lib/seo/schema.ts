import { businessEmail, businessKvk, businessLocation, businessPhone, businessPostalCode, businessSameAs, businessStreetAddress } from "@/lib/contact";
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

export const organizationJsonLd: JsonLdObject = {
  "@context": "https://schema.org",
  "@type": ["Organization", "ProfessionalService"],
  name: "MeneerMarketing",
  alternateName: "Meneer Marketing",
  url: siteUrl,
  logo: absoluteUrl("/icon.svg"),
  image: absoluteUrl("/og/og-default.svg"),
  email: businessEmail,
  ...(businessPhone ? { telephone: businessPhone } : {}),
  address: postalAddressJsonLd(),
  identifier: {
    "@type": "PropertyValue",
    propertyID: "KVK",
    value: businessKvk,
  },
  description:
    "Marketingbureau voor groei: websites from scratch, Shopify-webshops, SEO, Google Ads, Meta Ads, e-mailmarketing en slimme koppelingen.",
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
  name: "MeneerMarketing",
  url: siteUrl,
  description:
    "Groei, web, marketing en automatisering. Strategisch partner voor ondernemers.",
  publisher: {
    "@type": "Organization",
    name: "MeneerMarketing",
    url: siteUrl,
    logo: absoluteUrl("/icon.svg"),
  },
  inLanguage: "nl-NL",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${siteUrl}/zoeken?stad={search_term_string}`,
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
    author: {
      "@type": "Person",
      name: "Meneer Marketing",
      jobTitle: "Online marketing manager & developer",
      worksFor: {
        "@type": "Organization",
        name: "MeneerMarketing",
        url: siteUrl,
      },
    },
    publisher: {
      "@type": "Organization",
      name: "MeneerMarketing",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/icon.svg"),
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
    areaServed: input.areaServed ?? "NL",
    url: absoluteUrl(input.path),
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
    isPartOf: {
      "@type": "WebSite",
      name: "MeneerMarketing",
      url: siteUrl,
    },
    about: {
      "@type": "Organization",
      name: "MeneerMarketing",
      url: siteUrl,
      description: organizationJsonLd.description as string,
    },
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
      name: "Meneer Marketing",
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
      "Succesverhalen: SkinComplete, BestRest en Hills Pilates. Shopify, SEO, ads en custom build.",
    itemListElement: cases.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "CreativeWork",
        name: item.name,
        description: item.description,
        ...(item.url ? { url: item.url } : {}),
        creator: {
          "@type": "Organization",
          name: "MeneerMarketing",
          url: siteUrl,
        },
      },
    })),
  };
}

export function personJsonLd(input: {
  name: string;
  jobTitle: string;
  description: string;
  url: string;
}): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: input.name,
    jobTitle: input.jobTitle,
    description: input.description,
    url: input.url,
    worksFor: {
      "@type": "Organization",
      name: "MeneerMarketing",
      url: siteUrl,
    },
    knowsAbout: [
      "Marketingstrategie",
      "Shopify",
      "SEO",
      "Google Ads",
      "Webdevelopment",
      "Next.js",
    ],
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
}): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    inLanguage: "nl-NL",
    dateModified: input.dateModified ?? "2026-07-06",
    isPartOf: {
      "@type": "WebSite",
      name: "MeneerMarketing",
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "MeneerMarketing",
      url: siteUrl,
    },
  };
}

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
}): JsonLdObject {
  const url = absoluteUrl(input.path);
  const graph: JsonLdObject[] = [
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      name: input.name,
      headline: input.headline,
      description: input.description,
      url,
      inLanguage: "nl-NL",
      dateModified: "2026-07-06",
      isPartOf: { "@type": "WebSite", name: "MeneerMarketing", url: siteUrl },
      publisher: { "@type": "Organization", name: "MeneerMarketing", url: siteUrl },
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
      provider: {
        "@type": "Organization",
        name: "MeneerMarketing",
        url: siteUrl,
        email: businessEmail,
      },
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
      name: "Meneer Marketing",
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
