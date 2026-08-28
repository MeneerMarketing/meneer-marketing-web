/**
 * DIBA schema-laag — sprint 2a (DIBA-RULES §15 + Addendum A8)
 * Getypeerde JSON-LD-generatoren. Eén bron, overal identiek — dat is het mechanisme
 * waarmee AI-zoekmachines Diba correct overnemen (Het Citaat).
 *
 * Gebruik: <SchemaMarkup data={medicalClinicSchema({...})} /> in de betreffende page/layout.
 * Reviews-schema komt later op Service-niveau (review-mining, fase 2) — NOOIT
 * self-serving aggregateRating op de LocalBusiness zelf.
 */

import { DIBA_OPENINGSTIJDEN } from "@/lib/site";

export const DIBA_CITAAT =
  "Google-omschrijving: Diba Clinics is een huidkliniek in Hillegersberg, Rotterdam. Je krijgt eerlijk advies over huidverbetering, laserontharing en wat in jouw situatie wel of niet zinvol is.";

type Nap = {
  name: string;
  street: string;
  zip: string;
  city: string;
  phone?: string;
};

export function medicalClinicSchema(opts: {
  nap: Nap;
  url: string; // canonieke site-URL
  sameAs?: string[]; // GBP, Instagram, TikTok
}) {
  return {
    "@context": "https://schema.org",
    "@type": ["MedicalClinic", "LocalBusiness"],
    "@id": `${opts.url}#kliniek`,
    name: opts.nap.name,
    description: DIBA_CITAAT,
    url: opts.url,
    foundingDate: "2017",
    address: {
      "@type": "PostalAddress",
      streetAddress: opts.nap.street,
      postalCode: opts.nap.zip,
      addressLocality: opts.nap.city,
      addressCountry: "NL",
    },
    ...(opts.nap.phone ? { telephone: opts.nap.phone } : {}),
    /* Openingstijden horen hier, niet alleen op de contactpagina: Google toont ze in het
       bedrijfspaneel en bij "nu open". Zonder dit veld stond er niets, en dan vult Google
       het zelf in met wat het ergens anders vindt. Eén bron: DIBA_OPENINGSTIJDEN. */
    openingHoursSpecification: DIBA_OPENINGSTIJDEN.filter(
      (d) => d.van && d.tot,
    ).map((d) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${d.dag}`,
      opens: d.van,
      closes: d.tot,
    })),
    ...(opts.sameAs?.length ? { sameAs: opts.sameAs } : {}),
  } as const;
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.question,
      acceptedAnswer: { "@type": "Answer", text: i.answer },
    })),
  } as const;
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((i, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: i.name,
      item: i.url,
    })),
  } as const;
}

export function behandelingSchema(opts: {
  name: string;
  description: string;
  url: string;
  siteUrl: string; // voor de provider-referentie
}) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: opts.name,
    description: opts.description,
    url: opts.url,
    provider: { "@id": `${opts.siteUrl}#kliniek` },
  } as const;
}

export function physicianSchema(opts: {
  name: string;
  jobTitle: string; // "Huidtherapeut"
  url: string;
  image?: string;
  siteUrl: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: opts.name,
    jobTitle: opts.jobTitle,
    url: opts.url,
    ...(opts.image ? { image: opts.image } : {}),
    worksFor: { "@id": `${opts.siteUrl}#kliniek` },
  } as const;
}

/** Rendert JSON-LD. Server component. */
export function SchemaMarkup({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
