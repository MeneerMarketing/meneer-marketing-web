import {
  articleJsonLd,
  breadcrumbJsonLd,
  collectionPageJsonLd,
  faqPageJsonLd,
  organizationJsonLd,
  serviceJsonLd,
  websiteJsonLd,
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
  articleJsonLd,
  breadcrumbJsonLd,
  collectionPageJsonLd,
  faqPageJsonLd,
  serviceJsonLd,
};
