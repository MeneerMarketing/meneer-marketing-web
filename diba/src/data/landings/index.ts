import { CHEMISCHE_PEELING_ROTTERDAM } from "@/data/landings/chemische-peeling-rotterdam";
import { COSMELAN_DERMAMELAN_ROTTERDAM } from "@/data/landings/cosmelan-dermamelan-rotterdam";
import { DERMAPLANING_ROTTERDAM } from "@/data/landings/dermaplaning-rotterdam";
import { ELEKTRISCHE_EPILATIE_ROTTERDAM } from "@/data/landings/elektrische-epilatie-rotterdam";
import { FITZPATRICK_HUIDTYPE } from "@/data/landings/fitzpatrick-huidtype";
import { FOTONA_4D_ROTTERDAM } from "@/data/landings/fotona-4d-rotterdam";
import { HOEVEEL_SESSIES } from "@/data/landings/hoeveel-sessies";
import { HUIDKLINIEK_KIEZEN } from "@/data/landings/huidkliniek-kiezen";
import { ZON_EN_JE_HUID } from "@/data/landings/zon-en-je-huid";
import { ZWANGER_OF_BORSTVOEDING } from "@/data/landings/zwanger-of-borstvoeding";
import { OXYGENEO_ROTTERDAM } from "@/data/landings/oxygeneo-rotterdam";
import { SKINBOOSTERS_ROTTERDAM } from "@/data/landings/skinboosters-rotterdam";
import { HUIDANALYSE_ROTTERDAM } from "@/data/landings/huidanalyse-rotterdam";
import { HUIDTHERAPEUT_ROTTERDAM } from "@/data/landings/huidtherapeut-rotterdam";
import { HYDRAFACIAL_ROTTERDAM } from "@/data/landings/hydrafacial-rotterdam";
import { IPL_ROTTERDAM } from "@/data/landings/ipl-rotterdam";
import { MICRONEEDLING_ROTTERDAM } from "@/data/landings/microneedling-rotterdam";
import type { Landing } from "@/data/landings/types";
import { publicCopy } from "@/lib/copy-flags";

/**
 * Het register van de landingspagina's.
 *
 * Een pagina toevoegen is een databestand schrijven en het hier in de lijst zetten. De route
 * (/kennisbank/[slug]), de sitemap, de kennisbank en de verwijzingen onderaan de andere
 * landingspagina's lezen allemaal deze lijst, dus een nieuwe pagina staat op al die plekken
 * tegelijk, en een pagina die hier niet staat bestaat niet.
 *
 * DE VOLGORDE is die van de kennisbank en van het rijtje onderaan elke landingspagina: het
 * vak eerst, dan de meting waarmee het begint, dan de behandelingen van licht naar zwaar:
 * de gezichtsbehandelingen, dan structuur en laser, dan pigment, en als laatste ontharen.
 *
 * DAARNA DE VRAAGPAGINA'S (`soort: "vraag"`). Die gaan niet over één behandeling bij ons
 * maar over de vraag zonder plaatsnaam die eraan voorafgaat: je huidtype, het aantal
 * sessies, de zon, de zwangerschap, en hoe je een kliniek beoordeelt. Ze staan achteraan
 * omdat de plaatspagina's de verwijzingen bovenaan het hardst nodig hebben.
 *
 * DE CONTROLES HIERONDER DRAAIEN BIJ ELKE BUILD.
 *
 * Een landingspagina die de maten uit het masterplan niet haalt, laat de build falen met een
 * zin die zegt wat er mis is. Dat is streng met opzet: een titel die in Google wordt
 * afgekapt of een antwoordblok van honderd woorden zie je in de browser niet, en daarom
 * glippen ze erdoor zolang niemand er actief naar kijkt.
 */
export const LANDINGS: readonly Landing[] = [
  HUIDTHERAPEUT_ROTTERDAM,
  HUIDANALYSE_ROTTERDAM,
  HYDRAFACIAL_ROTTERDAM,
  OXYGENEO_ROTTERDAM,
  DERMAPLANING_ROTTERDAM,
  SKINBOOSTERS_ROTTERDAM,
  MICRONEEDLING_ROTTERDAM,
  CHEMISCHE_PEELING_ROTTERDAM,
  FOTONA_4D_ROTTERDAM,
  IPL_ROTTERDAM,
  COSMELAN_DERMAMELAN_ROTTERDAM,
  ELEKTRISCHE_EPILATIE_ROTTERDAM,

  FITZPATRICK_HUIDTYPE,
  HOEVEEL_SESSIES,
  ZON_EN_JE_HUID,
  ZWANGER_OF_BORSTVOEDING,
  HUIDKLINIEK_KIEZEN,
];

export function landingVoorSlug(slug: string): Landing | undefined {
  return LANDINGS.find((l) => l.slug === slug);
}

/** De naam zoals hij in een link staat: "HydraFacial in Rotterdam". */
export function landingNaam(l: Landing): string {
  return `${l.h1.kop} ${l.h1.accent}`;
}

/* ── Controles ─────────────────────────────────────────────────────────── */

const MERK = " | Diba Clinics";
const LINK = /\]\(\//;

function controleer(l: Landing): string[] {
  const fouten: string[] = [];
  const titel = `${l.titel}${MERK}`;
  if (titel.length > 60) {
    fouten.push(
      `de titel is met de merknaam erbij ${titel.length} tekens; Google kapt af na zestig`,
    );
  }
  if (l.omschrijving.length > 158) {
    fouten.push(
      `de omschrijving is ${l.omschrijving.length} tekens; maximaal 158`,
    );
  }
  const woorden = publicCopy(l.antwoord).split(/\s+/).filter(Boolean).length;
  if (woorden < 40 || woorden > 70) {
    fouten.push(
      `het antwoordblok is ${woorden} woorden; het hoort tussen de 40 en de 70 te zitten`,
    );
  }
  if (LINK.test(l.antwoord)) {
    fouten.push("het antwoordblok bevat een link; dat gaat het schema in");
  }
  if (l.feiten.length !== 4) {
    fouten.push(`er staan ${l.feiten.length} feiten; het zijn er vier`);
  }
  /* Een plaatspagina zonder tarieven bestaat niet: de vraag met de plaats erin is bijna
     altijd de vraag wat het daar kost. En tarieven op de pagina zonder dienst in het
     schema levert een Service zonder aanbod op, of erger: een aanbod zonder bedrag. */
  const soort = l.soort ?? "plaats";
  if (soort === "plaats" && !l.tarief) {
    fouten.push("een plaatspagina hoort een tariefblok te hebben");
  }
  if (l.tarief && !l.schema.dienst) {
    fouten.push(
      "er staan tarieven op de pagina, maar geen dienst in het schema",
    );
  }
  if (!l.tarief && l.schema.dienst) {
    fouten.push(
      "er staat een dienst in het schema, maar er zijn geen tarieven",
    );
  }
  if (l.welNiet.wel.length !== l.welNiet.niet.length) {
    fouten.push(
      `de wel-lijst heeft ${l.welNiet.wel.length} punten en de niet-lijst ${l.welNiet.niet.length}; die horen even lang te zijn`,
    );
  }
  if (l.faq.length < 8 || l.faq.length > 12) {
    fouten.push(`er staan ${l.faq.length} vragen; het zijn er acht tot twaalf`);
  }
  for (const v of l.faq) {
    if (LINK.test(v.vraag) || LINK.test(v.antwoord)) {
      fouten.push(
        `de vraag "${v.vraag}" bevat een link; die gaat het schema in`,
      );
    }
  }
  const kolommen = l.vergelijking.kolommen.length - 1;
  for (const r of l.vergelijking.rijen) {
    if (r.cellen.length !== kolommen) {
      fouten.push(
        `de rij "${r.naam}" in de vergelijking heeft ${r.cellen.length} cellen en de tabel ${kolommen} kolommen`,
      );
    }
  }
  return fouten;
}

const slugs = new Set<string>();
const alleFouten: string[] = [];
for (const l of LANDINGS) {
  if (slugs.has(l.slug))
    alleFouten.push(`${l.slug}: staat twee keer in het register`);
  slugs.add(l.slug);
  for (const f of controleer(l)) alleFouten.push(`${l.slug}: ${f}`);
}
if (alleFouten.length) {
  throw new Error(
    `De landingspagina's halen de maten niet:\n  ${alleFouten.join("\n  ")}`,
  );
}
