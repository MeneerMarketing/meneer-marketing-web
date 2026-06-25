import { businessEmail } from "@/lib/contact";
import { absoluteUrl, siteUrl } from "@/lib/site";

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "MeneerMarketing",
  url: siteUrl,
  email: businessEmail,
  description:
    "Marketingbureau voor groei: maatwerk websites, Shopify-thema's, SEO, ads, e-mailmarketing en automatisering.",
  areaServed: "NL",
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: businessEmail,
      availableLanguage: ["nl-NL", "Dutch"],
    },
  ],
} as const;

const website = {
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
} as const;

export function JsonLd() {
  const payload = [organization, website];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}

export function JsonLdScript({
  data,
}: {
  data: Record<string, unknown> | Record<string, unknown>[];
}) {
  const json = Array.isArray(data) ? data : data;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
): Record<string, unknown> {
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
}): Record<string, unknown> {
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
    ...(input.keywords?.length
      ? { keywords: input.keywords.join(", ") }
      : {}),
  };
}

export function faqPageJsonLd(
  faqs: { question: string; answer: string }[],
): Record<string, unknown> {
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
