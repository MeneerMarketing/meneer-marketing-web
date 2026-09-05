import { DIBA_ADDRESS, DIBA_EMAIL, DIBA_SITE } from "@/lib/site";

/**
 * De vacatures, en waarom ze een eigen pagina hebben.
 *
 * WAAROM APART VAN /werken-bij.
 *
 * Op /werken-bij stonden twee vacatures als kaartje met een mailto eronder. Dat is genoeg
 * om iemand te laten solliciteren die de site al gevonden heeft, en te weinig om gevonden
 * te worden. Wie "huidtherapeut vacature rotterdam" typt, komt uit bij Indeed en bij
 * Nationale Vacaturebank, want die hebben per functie een eigen adres met een eigen titel.
 *
 * Google for Jobs is de tweede reden. Dat blok bovenaan de zoekresultaten trekt de meeste
 * kliks weg bij de gewone tien, en je komt er alleen in met JobPosting-structuurdata op een
 * pagina die over precies die ene functie gaat. Een verzamelpagina met twee vacatures erop
 * valt af.
 *
 * WAT GOOGLE VERPLICHT STELT.
 *
 * `title`, `description`, `hiringOrganization`, `jobLocation` en `datePosted`. Daarnaast
 * telt `validThrough` zwaar: staat die datum in het verleden, dan valt de vacature uit
 * Google for Jobs. Hij wordt daarom hieronder uitgerekend uit `geplaatst`, zodat er één
 * datum is om bij te werken in plaats van twee die uit de pas kunnen lopen.
 *
 * `title` mag alleen de functietitel zijn. Niet "Huidtherapeut gezocht in Rotterdam!" en
 * geen uitroeptekens: Google keurt dat af. De plaats komt uit `jobLocation`.
 *
 * WAT ER NOG MIST.
 *
 * Het salaris. `baseSalary` is de sterkste aanbeveling die Google doet en vacatures mét
 * salaris scoren aantoonbaar beter, maar ik ken de schaal niet en verzin er geen.
 * [GEGEVEN-NODIG: salarisrange per maand bij 36 uur, van Okan]
 */

/** De dag waarop deze vacature online ging. Bijwerken bij elke herplaatsing. */
const GEPLAATST = "2026-09-04";

/** Google laat een vacature vallen zodra deze datum voorbij is. Zes maanden na plaatsing. */
function geldigTot(geplaatst: string): string {
  const d = new Date(geplaatst);
  d.setMonth(d.getMonth() + 6);
  return d.toISOString().slice(0, 10);
}

export type Vacature = {
  readonly slug: string;
  /** Alleen de functietitel; dit gaat een-op-een in de structuurdata. */
  readonly functie: string;
  /** De kop op de pagina zelf, waar de plaats wel in mag. */
  readonly paginaTitel: { readonly kop: string; readonly accent: string };
  readonly tabTitel: string;
  readonly omschrijving: string;
  /** Eén alinea, direct onder de kop. */
  readonly intro: readonly string[];
  readonly geplaatst: string;
  readonly dienstverband: readonly ("FULL_TIME" | "PART_TIME")[];
  readonly urenPerWeek: string;
  readonly watJeDoet: readonly { readonly kop: string; readonly zin: string }[];
  readonly watWeVragen: readonly string[];
  readonly watWeBieden: readonly string[];
  readonly sollicitatie: readonly {
    readonly kop: string;
    readonly zin: string;
  }[];
  readonly faq: readonly {
    readonly vraag: string;
    readonly antwoord: string;
  }[];
  readonly onderwerp: string;
};

export const VACATURES: readonly Vacature[] = [
  {
    slug: "huidtherapeut",
    /* Precies de titel en niets erbij. Zie de toelichting bovenaan. */
    functie: "Huidtherapeut",
    paginaTitel: { kop: "Vacature huidtherapeut", accent: "in Rotterdam" },
    tabTitel: "Vacature huidtherapeut Rotterdam",
    omschrijving:
      "Vacature huidtherapeut bij Diba Clinics in Rotterdam. Werken met EVE-M, Fotona, Nordlys, SkinPen en peelings, in een team van acht. Parttime of fulltime.",
    intro: [
      "Diba Clinics is een huidkliniek in Rotterdam-Noord. We behandelen acne, pigment, littekens, huidverbetering en ongewenste haargroei, en we werken sinds 2017 met een vast team van acht.",
      "We zoeken een huidtherapeut die zelfstandig een spreekuur draait: meten, een behandelplan opstellen en dat plan zelf uitvoeren op de apparatuur die er staat.",
    ],
    geplaatst: GEPLAATST,
    /* [BESLUIT-OKAN] Allebei aanvinken past bij een kliniek van deze omvang, maar het is
       wel een toezegging. Als er alleen parttime ruimte is, haal FULL_TIME hier weg. */
    dienstverband: ["FULL_TIME", "PART_TIME"],
    urenPerWeek: "24 tot 38 uur, in overleg",
    watJeDoet: [
      {
        kop: "Meten en beoordelen",
        zin: "Elk traject begint met een huidanalyse op de EVE-M. Je beoordeelt wat je ziet, legt het vast onder vaste belichting en bespreekt de uitkomst met de client.",
      },
      {
        kop: "Een plan dat klopt",
        zin: "Je stelt vast welke behandeling erbij past, in welke volgorde en over hoeveel sessies. Contra-indicaties beoordeel je zelf en je legt uit waarom iets wel of niet kan.",
      },
      {
        kop: "Zelf behandelen",
        zin: "Laser, IPL, microneedling, peelings en mesotherapie. Je stelt de apparatuur in op het huidtype en de zone, en je stuurt bij op wat de huid tussentijds doet.",
      },
      {
        kop: "Het traject bewaken",
        zin: "Bij elke controle leg je de opnames naast elkaar. Levert een aanpak te weinig op, dan verander je hem in plaats van hem uit te zitten.",
      },
    ],
    watWeVragen: [
      "Een afgeronde hbo-bachelor Huidtherapie (Haagse Hogeschool of Hogeschool Utrecht)",
      "Ingeschreven in het Kwaliteitsregister Paramedici, of daar op korte termijn aan kunnen voldoen",
      "Ervaring met laser, IPL of microneedling, of de bereidheid je daarop in te werken",
      "Je kunt uitleggen wat je doet in gewone taal, ook als het antwoord tegenvalt",
      "Beschikbaar op minimaal twee avonden per maand, want dinsdag en donderdag lopen door tot 21:00",
    ],
    watWeBieden: [
      "Een vaste plek in een team van acht, met huidtherapeuten en orthomoleculair huidspecialisten naast elkaar",
      "Apparatuur die er staat en werkt: Fotona TimeWalker, Nordlys IPL, GentleMax Pro, SkinPen, Dermapen 4, U225 en de EVE-M",
      "Tijd voor een intake van een uur, want daar begint elk traject mee",
      "Ruimte voor bij- en nascholing, ook omdat het Kwaliteitsregister die punten vraagt",
      "Een kliniek in Rotterdam-Noord met parkeergelegenheid in de straat",
    ],
    sollicitatie: [
      {
        kop: "Je stuurt iets",
        zin: `Een mail naar ${DIBA_EMAIL} met je cv. Een motivatiebrief hoeft niet; een paar regels over waar je nu werkt en wat je zoekt is genoeg.`,
      },
      {
        kop: "We bellen",
        zin: "Binnen een week hoor je iets. Dat gesprek duurt een kwartier en gaat over wat je nu doet en wat je hier zou willen doen.",
      },
      {
        kop: "Je loopt een dag mee",
        zin: "Je draait mee in de kliniek, ziet de apparatuur en spreekt het team. Daarna weet je allebei genoeg om iets te vinden.",
      },
    ],
    faq: [
      {
        vraag: "Kan ik solliciteren als starter?",
        antwoord:
          "Ja. Een diploma huidtherapie is de eis; ervaring met specifieke apparatuur is dat niet. Je wordt ingewerkt op de toestellen die je nog niet kent.",
      },
      {
        vraag: "Werk ik met een eigen agenda?",
        antwoord:
          "Je draait een eigen spreekuur en ziet je eigen clienten terug bij de controles. De agenda wordt door de praktijkmanager gepland.",
      },
      {
        vraag: "Hoeveel uur is er beschikbaar?",
        antwoord:
          "24 tot 38 uur, in overleg. Dinsdag en donderdag lopen door tot 21:00 en zaterdag tot 16:00, dus avonden en zaterdagen horen bij het rooster.",
      },
      {
        vraag: "Zit er een salarisindicatie bij?",
        antwoord:
          "Die bespreken we in het eerste gesprek, samen met de uren en de startdatum. [GEGEVEN-NODIG: salarisrange per maand bij 36 uur, van Okan]",
      },
      {
        vraag: "Waar zit de kliniek precies?",
        antwoord: `Aan de ${DIBA_ADDRESS.line}, in Rotterdam-Noord. Met de auto sta je in de straat en met het openbaar vervoer ben je vanaf Rotterdam Centraal in een klein half uur binnen.`,
      },
    ],
    onderwerp: "Sollicitatie huidtherapeut",
  },
];

export function vacatureVoorSlug(slug: string): Vacature | undefined {
  return VACATURES.find((v) => v.slug === slug);
}

/**
 * De omschrijving die in de structuurdata gaat.
 *
 * Google wil hier de volledige vacaturetekst als HTML, en niet een samenvatting: hij
 * vergelijkt hem met wat er op de pagina staat. Daarom wordt hij hier uit dezelfde velden
 * opgebouwd als de pagina zelf, zodat de twee niet uit elkaar kunnen lopen.
 */
export function vacatureBeschrijvingHtml(v: Vacature): string {
  const lijst = (items: readonly string[]) =>
    `<ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul>`;

  return [
    v.intro.map((p) => `<p>${p}</p>`).join(""),
    "<h2>Wat je doet</h2>",
    `<ul>${v.watJeDoet
      .map((w) => `<li><strong>${w.kop}.</strong> ${w.zin}</li>`)
      .join("")}</ul>`,
    "<h2>Wat we vragen</h2>",
    lijst(v.watWeVragen),
    "<h2>Wat we bieden</h2>",
    lijst(v.watWeBieden),
    "<h2>De sollicitatie</h2>",
    `<ul>${v.sollicitatie
      .map((s) => `<li><strong>${s.kop}.</strong> ${s.zin}</li>`)
      .join("")}</ul>`,
    `<p>Diba Clinics, ${DIBA_ADDRESS.line}. Reageren kan via ${DIBA_EMAIL}.</p>`,
  ].join("");
}

/** Wanneer de vacature uit Google for Jobs valt als er niets gebeurt. */
export function vacatureGeldigTot(v: Vacature): string {
  return geldigTot(v.geplaatst);
}

/** Het kenmerk dat Google gebruikt om de vacature te herkennen bij een herplaatsing. */
export function vacatureKenmerk(v: Vacature): string {
  return `${DIBA_SITE.domain}-${v.slug}-${v.geplaatst}`;
}
