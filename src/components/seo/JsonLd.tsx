import {
  aboutPageJsonLd,
  articleJsonLd,
  breadcrumbJsonLd,
  caseStudyJsonLd,
  casesItemListJsonLd,
  collectionPageJsonLd,
  contactPageJsonLd,
  faqPageJsonLd,
  localBusinessJsonLd,
  organizationJsonLd,
  personJsonLd,
  seoLandingPageGraph,
  serviceJsonLd,
  websiteJsonLd,
  webPageJsonLd,
  type JsonLdObject,
} from "@/lib/seo/schema";

/** Sitewide Organization + WebSite schema, geladen in de root layout. */
export function JsonLd() {
  const payload = [organizationJsonLd, websiteJsonLd];
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
  data: JsonLdObject | JsonLdObject[];
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export {
  aboutPageJsonLd,
  articleJsonLd,
  breadcrumbJsonLd,
  caseStudyJsonLd,
  casesItemListJsonLd,
  collectionPageJsonLd,
  contactPageJsonLd,
  faqPageJsonLd,
  localBusinessJsonLd,
  personJsonLd,
  serviceJsonLd,
  seoLandingPageGraph,
  webPageJsonLd,
};
