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

/**
 * Een dienst met een tarief, gekoppeld aan deze kliniek en aan dit verzorgingsgebied.
 *
 * WAAROM DIT NAAST `behandelingSchema` STAAT EN HET NIET VERVANGT.
 *
 * `MedicalProcedure` beschrijft wat een behandeling ís: de ingreep, medisch gezien. Het kent
 * geen prijs en geen plaats. `Service` beschrijft wat een bedrijf aanbiedt: met een tarief,
 * een aanbieder en een gebied waar dat aanbod geldt. Voor een zoekopdracht als "hydrafacial
 * rotterdam" is dat tweede het antwoord, en voor een taalmodel dat de vraag "wat kost een
 * hydrafacial in Rotterdam" krijgt is het de enige plek waar het bedrag machineleesbaar
 * staat. De twee sluiten elkaar niet uit; een pagina mag ze allebei dragen.
 *
 * WAT ER IN MOET, EN WAT NIET.
 *
 * `offers` alleen met bedragen die ook zichtbaar op de pagina staan. Een prijs die in het
 * schema staat maar niet op het scherm is precies het soort verschil waar Google een
 * handmatige maatregel voor uitdeelt, en het is bovendien onaardig tegen wie het leest.
 *
 * Geen `aggregateRating`. Een waardering die de aanbieder zelf over zichzelf meldt telt niet
 * en hoort hier niet (zie de kop van dit bestand).
 */
export function dienstSchema(opts: {
  naam: string;
  omschrijving: string;
  /** De volledige URL van de pagina waar dit aanbod op staat. */
  url: string;
  siteUrl: string;
  /** Waar het aanbod onder valt: "Gezichtsbehandeling", "Laserontharing". */
  soort: string;
  /** Waar we het aanbieden. Een stad, eventueel met de wijk erbij. */
  gebied: readonly string[];
  /** De varianten met hun tarief. Alleen bedragen die op de pagina staan. */
  varianten: readonly {
    readonly naam: string;
    readonly prijs: number;
    readonly zin?: string;
  }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${opts.url}#dienst`,
    name: opts.naam,
    serviceType: opts.soort,
    description: opts.omschrijving,
    url: opts.url,
    provider: { "@id": `${opts.siteUrl}#kliniek` },
    areaServed: opts.gebied.map((plaats) => ({
      "@type": "City",
      name: plaats,
    })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: opts.naam,
      itemListElement: opts.varianten.map((v) => ({
        "@type": "Offer",
        name: v.naam,
        ...(v.zin ? { description: v.zin } : {}),
        price: v.prijs,
        priceCurrency: "EUR",
        url: opts.url,
        availability: "https://schema.org/InStock",
        /* Zonder deze datum mag een zoekmachine het tarief als verlopen beschouwen. Een
           jaar vooruit, en de tarieven worden hoe dan ook vaker nagelopen dan dat. */
        priceValidUntil: `${new Date().getFullYear() + 1}-12-31`,
      })),
    },
  } as const;
}

/**
 * De pagina zelf, als medische uitlegpagina.
 *
 * WAAROM HET TYPE ERTOE DOET. `MedicalWebPage` zegt tegen een zoekmachine: dit is geen
 * winkelpagina maar uitleg over een behandeling, geschreven door een zorgaanbieder. Dat is
 * het type waar Google zijn strengere beoordeling op loslaat, en tegelijk het type dat in
 * antwoorden wordt aangehaald. Je kunt het niet half doen: wie het type claimt, hoort ook de
 * datum en de controleur te leveren.
 *
 * `reviewedBy` IS EEN BEWERING OVER EEN MENS. Vul die alleen als die persoon de tekst
 * werkelijk heeft nagekeken. Een naam neerzetten omdat het goed staat in een schema is
 * precies het soort onwaarheid dat een kliniek zich niet kan veroorloven, en het is niet te
 * verdedigen als iemand ernaar vraagt. Zolang de controle er niet is, blijft het veld leeg
 * en staat er op de pagina ook geen controleur.
 */
export function medischePaginaSchema(opts: {
  url: string;
  siteUrl: string;
  naam: string;
  omschrijving: string;
  /** Datum in ISO, de dag waarop de inhoud voor het laatst is aangepast. */
  gewijzigd: string;
  /** Waar de pagina over gaat, als verwijzing naar het MedicalProcedure op dezelfde pagina. */
  overProcedure?: string;
  /** Alleen invullen na een echte inhoudelijke controle. Zie de toelichting hierboven. */
  nagekekenDoor?: { readonly naam: string; readonly functie: string };
  /** Datum van die controle, in ISO. */
  nagekekenOp?: string;
  beeld?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "@id": `${opts.url}#pagina`,
    name: opts.naam,
    description: opts.omschrijving,
    url: opts.url,
    inLanguage: "nl-NL",
    dateModified: opts.gewijzigd,
    isPartOf: { "@id": `${opts.siteUrl}#kliniek` },
    ...(opts.overProcedure ? { about: { "@id": opts.overProcedure } } : {}),
    ...(opts.beeld ? { primaryImageOfPage: opts.beeld } : {}),
    ...(opts.nagekekenDoor && opts.nagekekenOp
      ? {
          lastReviewed: opts.nagekekenOp,
          reviewedBy: {
            "@type": "Person",
            name: opts.nagekekenDoor.naam,
            jobTitle: opts.nagekekenDoor.functie,
            worksFor: { "@id": `${opts.siteUrl}#kliniek` },
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
