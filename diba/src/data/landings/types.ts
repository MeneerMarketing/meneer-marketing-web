import { BEHANDELINGEN, type Behandeling } from "@/data/behandelingen";
import { ADVIES_MINUTEN, INTAKE_MINUTEN } from "@/data/intake";
import type { ReviewTopic } from "@/data/reviews";
import { eersteZin, publicCopy } from "@/lib/copy-flags";

/**
 * De landingspagina's van de kennisbank: de vorm, en wat ze met elkaar delen.
 *
 * WAAROM ER EEN SJABLOON IS EN GEEN ZES LOSSE PAGINA'S.
 *
 * Het masterplan (DIBA-SEO-MASTERPLAN.md, hoofdstuk 4) schrijft voor hoe een
 * landingspagina eruitziet: antwoordblok, vier feiten, werking, onderscheid, tarief met de
 * intakeregeling, wel en niet, een vergelijkingstabel, het lokale blok, reviews, vragen. Zes
 * losse bestanden met die opbouw lopen binnen een maand uit elkaar, en dan is "het sjabloon"
 * een herinnering in plaats van een regel. Hier is het een type: een pagina zonder
 * vergelijkingstabel compileert niet, en `index.ts` controleert bij elke build de maten.
 *
 * WAT ER UIT ÉÉN BRON KOMT EN DUS NOOIT OVERGESCHREVEN WORDT.
 *
 * - Tarieven, behandelduur en hersteltijd: uit `behandelingen.ts`, via de helpers hieronder.
 * - De tijden van de intake: uit `intake.ts`. Die stonden eerst als tekst in de
 *   HydraFacial-pagina, en daar stond "maximaal zestig minuten" terwijl /intake dertig zegt.
 *   Een taalmodel dat twee getallen vindt, noemt er geen.
 * - Het bedrag van de intake: het tarief van de huidanalyse, want dat is dezelfde afspraak.
 *
 * LINKS IN LOPENDE TEKST.
 *
 * In alinea's mag `[tekst](/pad)` staan; het sjabloon maakt daar een link van. Alleen
 * interne paden, en nooit in het antwoordblok of in de antwoorden op vragen: die gaan ook
 * het schema in, en daar hoort geen opmaak. Het register controleert dat bij de build.
 *
 * TWEE SOORTEN, ÉÉN SJABLOON.
 *
 * Golf 1 en 2 zijn plaatspagina's: "wat kost een HydraFacial in Rotterdam". Golf 3 zijn
 * vraagpagina's zonder plaatsnaam: "welk huidtype heb je", "hoeveel sessies heb je nodig".
 * Ze hebben dezelfde opbouw en dezelfde maten, op één ding na: een vraagpagina heeft geen
 * eigen tarief. Een prijslijst op een pagina over zwangerschap is misplaatst, en een
 * Service-schema met aanbiedingen die niets met de vraag te maken hebben is erger dan
 * misplaatst. Vandaar `soort`, een tariefblok dat mag ontbreken en een dienst die dan
 * meegaat. Al het andere blijft verplicht, ook voor een vraagpagina.
 */

export type Beeld = { readonly src: string; readonly alt: string };

export type Verwijzing = { readonly href: string; readonly tekst: string };

/** De kop van een sectie, en het woord waarmee hij in de ankerbalk staat. */
export type Kopregel = {
  readonly label: string;
  /** Maximaal zo'n twintig tekens: kop en accent staan elk op een eigen regel. */
  readonly kop: string;
  readonly accent: string;
  readonly intro: string;
  readonly anker: string;
};

export type Tariefrij = {
  readonly naam: string;
  readonly prijs: number;
  /** "vanaf" ervoor, als het bedrag de ondergrens van een reeks tarieven is. */
  readonly vanaf?: boolean;
};

export type Tabelrij = {
  readonly naam: string;
  readonly href?: string;
  readonly cellen: readonly string[];
};

export type Vraag = { readonly vraag: string; readonly antwoord: string };

export type Landing = {
  readonly slug: string;
  /**
   * Waar de pagina op mikt.
   *
   * `plaats` is de zoekvraag met Rotterdam erin en gaat over één behandeling bij ons.
   * `vraag` is de landelijke vraag zonder plaatsnaam. Het verschil bepaalt of er een
   * tariefblok is, welk schema eronder hangt en in welke groep van de kennisbank de
   * pagina staat. Zonder opgave: een plaatspagina.
   */
  readonly soort?: "plaats" | "vraag";
  /** De dag waarop de inhoud voor het laatst is aangepast, in ISO. Pagina, schema en sitemap. */
  readonly gewijzigd: string;
  /** De tabbladtitel zonder merknaam. Met " | Diba Clinics" erachter maximaal 60 tekens. */
  readonly titel: string;
  /** Maximaal 158 tekens. */
  readonly omschrijving: string;
  readonly kruimel: string;
  readonly h1: { readonly kop: string; readonly accent: string };
  /**
   * Het antwoordblok: 40 tot 70 woorden, los van de pagina te lezen, met wat het is, waar,
   * hoe lang en wat het kost. Dit is het deel dat wordt aangehaald.
   */
  readonly antwoord: string;
  /** Precies vier. */
  readonly feiten: readonly { readonly kop: string; readonly waarde: string }[];
  readonly beeld: Beeld;
  /** Wat er op de kaart in de kennisbank staat. */
  readonly kaart: { readonly vraag: string; readonly zin: string };
  readonly werking: Kopregel & {
    readonly alineas: readonly string[];
    /** De alinea met de verwijzingen, onderaan en rustiger gezet. */
    readonly verder?: string;
  };
  readonly onderscheid: Kopregel & {
    readonly alineas: readonly string[];
    readonly beeld: Beeld;
    readonly knop?: Verwijzing;
  };
  /** Verplicht op een plaatspagina; een vraagpagina heeft geen eigen tarief. */
  readonly tarief?: Kopregel & {
    readonly rijen: readonly Tariefrij[];
    readonly zin?: string;
    readonly afspraak: readonly {
      readonly kop: string;
      readonly zin: string;
    }[];
  };
  /** Even lang. Een lijstje van zes voordelen met één nadeeltje eronder is opmaak. */
  readonly welNiet: {
    readonly intro: string;
    readonly wel: readonly string[];
    readonly niet: readonly string[];
  };
  readonly vergelijking: Kopregel & {
    /** De eerste kolom is de naam; de rest hoort bij `cellen`. */
    readonly kolommen: readonly string[];
    readonly rijen: readonly Tabelrij[];
    /** Voor wie voorleest: waar de tabel over gaat. */
    readonly bijschrift: string;
  };
  readonly wie: { readonly label: string; readonly zin: string };
  /** Weglaten als er geen reviews over dit onderwerp zijn. Een review over iets anders misleidt. */
  readonly reviews?: {
    readonly onderwerp: Exclude<ReviewTopic, "alle">;
    readonly intro: string;
    /**
     * Welk drietal, als meer landingspagina's hetzelfde onderwerp tonen. Zonder dit zagen
     * vier gezichtspagina's precies dezelfde drie reviews. Zie `ReviewsBijOnderwerp`.
     */
    readonly reeks?: number;
  };
  readonly faq: readonly Vraag[];
  /** De kop onder "twijfel je". Samen maximaal zo'n 45 tekens, anders drie regels. */
  readonly twijfel: {
    readonly voor: string;
    readonly accent: string;
    readonly na?: string;
    readonly zin: string;
  };
  readonly cta: {
    readonly kop: string;
    readonly accent: string;
    readonly tekst: string;
    readonly topic: string;
  };
  readonly schema: {
    /** Weglaten als de pagina niet over één behandeling gaat, zoals bij het vak. */
    readonly procedure?: {
      readonly naam: string;
      readonly omschrijving: string;
    };
    /**
     * De dienst waar de tarieven bij horen. Alleen op een plaatspagina: zonder tarieven
     * zou het een aanbod zijn zonder bedrag, en dat hoort niet in een Service-schema.
     */
    readonly dienst?: { readonly naam: string; readonly soort: string };
  };
};

/* ── Uit de behandelingentabel ─────────────────────────────────────────── */

export function behandeling(slug: string): Behandeling {
  const b = BEHANDELINGEN.find((x) => x.slug === slug);
  if (!b) {
    throw new Error(
      `Een landingspagina verwijst naar een onbekende behandeling: ${slug}`,
    );
  }
  return b;
}

/** Een bedrag zoals het op de site staat: "€ 170", "€ 1.000". */
export function euro(bedrag: number): string {
  return `€ ${bedrag.toLocaleString("nl-NL")}`;
}

/** De varianten van een behandeling als tariefrijen. */
export function tariefrijen(slug: string): Tariefrij[] {
  const b = behandeling(slug);
  const varianten = b.varianten?.length
    ? b.varianten
    : [{ naam: b.naam, prijs: b.prijs }];
  return varianten.map((v) => ({ naam: v.naam, prijs: v.prijs }));
}

/** Het laagste en het hoogste tarief van een behandeling. */
export function bereik(slug: string): { laag: number; hoog: number } {
  const prijzen = tariefrijen(slug).map((r) => r.prijs);
  return { laag: Math.min(...prijzen), hoog: Math.max(...prijzen) };
}

/**
 * Het tarief van één variant: eerst op de precieze naam, anders op het begin ervan.
 *
 * Bestaat de variant niet, dan faalt de build. Dat is de bedoeling: een bedrag op een
 * landingspagina dat stilletjes op iets anders terugvalt, is precies de fout die je pas ziet
 * als een klant ernaar vraagt.
 */
export function variantPrijs(slug: string, naam: string): number {
  const rijen = tariefrijen(slug);
  const rij =
    rijen.find((r) => r.naam === naam) ??
    rijen.find((r) => r.naam.startsWith(naam));
  if (!rij) {
    throw new Error(`De behandeling ${slug} heeft geen variant "${naam}"`);
  }
  return rij.prijs;
}

/** De eerste zin van de hersteltijd, zonder redactievlaggen. */
export function herstelKort(slug: string): string {
  return publicCopy(
    eersteZin(publicCopy(behandeling(slug).herstel)),
    "In overleg",
  );
}

/**
 * Een rij voor de vergelijkingstabel: naam, tarief en hersteltijd uit de tabel, en alleen
 * het verschil hier geschreven. Dat verschil is het enige wat nergens anders staat.
 */
export function vergelijkingsrij(slug: string, verschil: string): Tabelrij {
  const b = behandeling(slug);
  return {
    naam: b.naam,
    href: `/behandelingen/${slug}`,
    /* Een behandeling zonder vast tarief staat in de tabel als "op aanvraag", en niet
       als "€ 0": dat laatste leest als gratis. */
    cellen: [
      verschil,
      herstelKort(slug),
      b.prijs > 0 ? euro(b.prijs) : "Op aanvraag",
    ],
  };
}

/**
 * Een rij voor de tabel met het aantal sessies: naam, hoe vaak, en wat één keer kost.
 *
 * "Hoe vaak" komt letterlijk uit het veld `sessies` van de behandeling. Dat staat daar al
 * per behandeling en is door Rojda na te kijken op één plek; overschrijven zou betekenen
 * dat een pagina over het aantal sessies het aantal sessies zelf verzint.
 */
export function sessieRij(slug: string): Tabelrij {
  const b = behandeling(slug);
  return {
    naam: b.naam,
    href: `/behandelingen/${slug}`,
    cellen: [b.sessies, b.prijs > 0 ? euro(b.prijs) : "Op aanvraag"],
  };
}

/** Wat een intake kost: het tarief van de huidanalyse, want dat is dezelfde afspraak. */
export const INTAKE_PRIJS = behandeling("huidanalyse").prijs;

/* ── Taal ──────────────────────────────────────────────────────────────── */

/** Getallen tot twaalf als woord, zoals ze in een zin horen. */
export function alsWoord(n: number): string {
  const woorden = [
    "nul",
    "een",
    "twee",
    "drie",
    "vier",
    "vijf",
    "zes",
    "zeven",
    "acht",
    "negen",
    "tien",
    "elf",
    "twaalf",
  ];
  return woorden[n] ?? String(n);
}

/** "a, b en c". */
export function opsomming(delen: readonly string[]): string {
  if (delen.length <= 1) return delen[0] ?? "";
  return `${delen.slice(0, -1).join(", ")} en ${delen[delen.length - 1]}`;
}

/* ── De afspraak, overal hetzelfde uitgelegd ───────────────────────────── */

/**
 * Hoe een afspraak verloopt, in drie blokken.
 *
 * De stijlgids: "Deze informatie moet op alle pagina's hetzelfde worden uitgelegd." Dus
 * staat hij hier één keer, met de getallen uit `intake.ts`, en vult elke pagina alleen de
 * naam van de behandeling en de duur in.
 */
export function afspraakBlokken({
  naam,
  duurMinuten,
  extra,
}: {
  /** Met lidwoord, zoals hij midden in een zin staat: "de HydraFacial". */
  readonly naam: string;
  readonly duurMinuten?: number;
  /** Een zin die alleen bij deze behandeling hoort, achter het derde blok. */
  readonly extra?: string;
}): { kop: string; zin: string }[] {
  const uren = alsWoord(ADVIES_MINUTEN.nieuw / 60);
  const behandeltijd =
    ADVIES_MINUTEN.minimaalBehandelen === 60
      ? "een uur"
      : `${ADVIES_MINUTEN.minimaalBehandelen} minuten`;
  const opnieuw = naam.replace(/^de eerste /, "de ");
  return [
    {
      kop: "Kom je voor het eerst",
      zin: `Dan boek je een behandeling op advies. We reserveren daar maximaal ${uren} uur voor: de intake, en daarna minstens ${behandeltijd} om te behandelen. Is behandelen op dat moment verantwoord en wil je dat, dan doen we ${naam} in dezelfde afspraak.`,
    },
    {
      kop: "Wat de intake kost",
      zin: `Wordt er in dezelfde afspraak behandeld, dan vervallen de intakekosten en betaal je alleen de behandeling. Gaat de behandeling niet door, dan kost de intake ${euro(INTAKE_PRIJS)}. Een losse intake zonder behandeling duurt maximaal ${INTAKE_MINUTEN} minuten en kost altijd ${euro(INTAKE_PRIJS)}.`,
    },
    {
      kop: "Ben je hier al eerder geweest",
      zin: `Dan boek je ${opnieuw} rechtstreeks in de agenda.${
        duurMinuten ? ` Reken op ${duurMinuten} minuten.` : ""
      } Is er sinds je laatste bezoek iets veranderd aan je huid, je medicatie of je verwachting, zeg dat dan bij binnenkomst.${
        extra ? ` ${extra}` : ""
      }`,
    },
  ];
}

/** De vraag die op elke landingspagina hoort, met het antwoord overal gelijk. */
export const VRAAG_WAAR: Vraag = {
  vraag: "Waar in Rotterdam zitten jullie?",
  antwoord:
    "Aan de Weissenbruchlaan 166 in Rotterdam, aan de noordkant van de stad in een woonwijk. Je parkeert in de straat. De route en de openingstijden staan op onze contactpagina.",
};

/** De tweede alinea onder "twijfel je", overal dezelfde. */
export const TWIJFEL_WHATSAPP =
  "Weet je al wel wat je zoekt maar twijfel je over het moment of de combinatie met iets anders, stel je vraag dan via WhatsApp. Daar zit een behandelaar aan de andere kant en geen formulier.";
