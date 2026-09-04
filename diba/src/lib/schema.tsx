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
  "Diba Clinics is een huidkliniek in Rotterdam. Je krijgt eerlijk advies over huidverbetering, laserontharing en wat er in jouw situatie mogelijk is.";

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

/**
 * JobPosting, voor Google for Jobs.
 *
 * Dat blok bovenaan de zoekresultaten trekt de meeste kliks weg bij de gewone tien, en je
 * komt er alleen in met deze structuurdata op een pagina die over precies een functie gaat.
 *
 * WAT VERPLICHT IS.
 *
 * `title`, `description`, `hiringOrganization`, `jobLocation` en `datePosted`. Daarnaast
 * telt `validThrough` zwaar: staat die datum in het verleden, dan valt de vacature eruit.
 *
 * WAT ER MISGAAT ALS JE NIET OPLET.
 *
 * - `title` mag alleen de functietitel zijn. "Huidtherapeut gezocht in Rotterdam!" wordt
 *   afgekeurd; de plaats hoort in `jobLocation` en uitroeptekens horen nergens.
 * - `description` moet de volledige tekst als HTML zijn en niet een samenvatting. Google
 *   vergelijkt hem met wat er op de pagina staat.
 * - `identifier` houdt de vacature herkenbaar als je hem later opnieuw plaatst.
 * - `directApply` claim je alleen als iemand de sollicitatie op je eigen site kan afronden.
 *   Een mailto telt niet, dus die staat hier niet.
 *
 * `baseSalary` is optioneel maar de sterkste aanbeveling die Google doet; vacatures met
 * salaris doen het aantoonbaar beter. Vul hem zodra de schaal bekend is.
 */
export function jobPostingSchema(opts: {
  functie: string;
  beschrijvingHtml: string;
  kenmerk: string;
  geplaatst: string;
  geldigTot: string;
  dienstverband: readonly string[];
  url: string;
  siteUrl: string;
  organisatie: { name: string; logo: string };
  adres: {
    street: string;
    postalCode: string;
    city: string;
    country: string;
  };
  opleidingsniveau?: string;
  maandenErvaring?: number;
  vaardigheden?: readonly string[];
  branche?: string;
  urenPerWeek?: string;
  salaris?: { valuta: string; van: number; tot: number; eenheid: string };
}) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "@id": `${opts.url}#vacature`,
    title: opts.functie,
    description: opts.beschrijvingHtml,
    identifier: {
      "@type": "PropertyValue",
      name: opts.organisatie.name,
      value: opts.kenmerk,
    },
    datePosted: opts.geplaatst,
    validThrough: opts.geldigTot,
    employmentType: opts.dienstverband,
    hiringOrganization: {
      "@type": "Organization",
      "@id": `${opts.siteUrl}#kliniek`,
      name: opts.organisatie.name,
      sameAs: opts.siteUrl,
      logo: opts.organisatie.logo,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        streetAddress: opts.adres.street,
        postalCode: opts.adres.postalCode,
        addressLocality: opts.adres.city,
        addressRegion: "Zuid-Holland",
        addressCountry: opts.adres.country,
      },
    },
    ...(opts.opleidingsniveau
      ? {
          educationRequirements: {
            "@type": "EducationalOccupationalCredential",
            credentialCategory: opts.opleidingsniveau,
          },
        }
      : {}),
    ...(opts.maandenErvaring !== undefined
      ? {
          experienceRequirements: {
            "@type": "OccupationalExperienceRequirements",
            monthsOfExperience: opts.maandenErvaring,
          },
          experienceInPlaceOfEducation: false,
        }
      : {}),
    ...(opts.vaardigheden?.length
      ? { skills: opts.vaardigheden.join(", ") }
      : {}),
    ...(opts.branche ? { industry: opts.branche } : {}),
    ...(opts.urenPerWeek ? { workHours: opts.urenPerWeek } : {}),
    /* De BLS-code die Google in zijn voorbeelden aanhoudt. Huidtherapie valt onder de
       therapeuten die geen eigen code hebben. */
    occupationalCategory: "29-1129.00 Therapists, All Other",
    ...(opts.salaris
      ? {
          baseSalary: {
            "@type": "MonetaryAmount",
            currency: opts.salaris.valuta,
            value: {
              "@type": "QuantitativeValue",
              minValue: opts.salaris.van,
              maxValue: opts.salaris.tot,
              unitText: opts.salaris.eenheid,
            },
          },
        }
      : {}),
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
