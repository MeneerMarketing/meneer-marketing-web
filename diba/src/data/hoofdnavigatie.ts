/**
 * De hoofdnavigatie van de hero-variant, inclusief wat er nog niet staat.
 *
 * Dit bestand kijkt vooruit. De site heeft nu zeventien huidprobleempagina's en verder
 * vooral lege routes, maar het menu moet al kloppen voor de site die er komt: anders
 * verbouw je straks de navigatie terwijl je pagina's aan het vullen bent.
 *
 * Daarom staat hier de volledige boom, met de routes zoals ze straks heten. Alles wijst
 * naar een bestaande route, dus er zit geen enkele `#` in en niets loopt op een 404. Wat
 * er nog geen inhoud op heeft draagt `binnenkort`, zodat we in één oogopslag zien wat er
 * nog moet en zodat het menu dat later zelf kan tonen als we dat willen.
 *
 * De huidproblemen komen uit `symptoomzoeker.ts` en worden hier niet overgetypt. Die
 * lijst is de bron: het overzicht, de zoeker en dit menu tonen altijd hetzelfde, en een
 * nieuwe pagina verschijnt vanzelf op alle drie.
 *
 * Elke huidprobleemregel draagt zijn eerste vraag als ondertitel. Dat is het
 * onderscheidende van die hele reeks, en het maakt van een menu meteen een wegwijzer:
 * je ziet vóór het klikken waar we bij dat probleem beginnen.
 *
 * COPY-STATUS: concept. De zinnen bij de behandelingen zijn bewust kaal gehouden; een
 * behandeling in vier woorden omschrijven is een medische uitspraak en die schrijf ik
 * niet zonder Rojda.
 */

import { BESTEMMINGEN, type Groep } from "@/data/symptoomzoeker";

export type NavLink = {
  readonly label: string;
  readonly href: string;
  /** Ondertitel onder het label. Bij huidproblemen: de eerste vraag van die pagina. */
  readonly zin?: string;
  /** De route bestaat, maar de inhoud moet nog. */
  readonly binnenkort?: true;
};

export type NavKolom = {
  readonly kop: string;
  readonly items: readonly NavLink[];
  /** Neemt twee kolommen in beslag; voor lijsten die anders te lang worden. */
  readonly breed?: true;
};

/** Het gekleurde vak rechts in een menupaneel. Eén per paneel, nooit twee. */
export type NavUitgelicht = {
  readonly label: string;
  readonly kop: string;
  readonly zin: string;
  readonly href: string;
  readonly knop: string;
};

export type NavItem = {
  readonly label: string;
  readonly href: string;
  /** Zonder kolommen is het een gewone link, met kolommen een paneel. */
  readonly kolommen?: readonly NavKolom[];
  readonly uitgelicht?: NavUitgelicht;
};

/** Haalt een groep uit de bron en zet er de eerste vraag onder. */
function uitGroep(groep: Groep): readonly NavLink[] {
  return BESTEMMINGEN.filter((b) => b.groep === groep).map((b) => ({
    label: b.naam,
    href: b.pad,
    zin: b.eersteVraag,
  }));
}

export const HOOFDNAV: readonly NavItem[] = [
  {
    label: "Huidproblemen",
    href: "/huidproblemen",
    kolommen: [
      { kop: "Wij behandelen dit", items: uitGroep("behandelen"), breed: true },
      {
        kop: "Hier hoort een arts bij",
        items: [...uitGroep("doorverwijzen"), ...uitGroep("niet")],
      },
    ],
    uitgelicht: {
      label: "Weet je niet hoe het heet",
      kop: "Symptoomzoeker",
      zin: "Kruis aan wat je ziet en voelt, in gewone woorden. Geen vakterm nodig.",
      href: "/huidproblemen/symptoomzoeker",
      knop: "Naar de zoeker",
    },
  },
  {
    label: "Behandelingen",
    href: "/behandelingen",
    kolommen: [
      {
        kop: "Begin hier",
        items: [
          {
            label: "Je huidprofiel",
            href: "/huidprofiel",
            zin: "Acht stappen, en de site onthoudt het",
          },
          {
            label: "Alle behandelingen",
            href: "/behandelingen",
            zin: "Filter op doel en op hersteltijd",
          },
        ],
      },
      {
        kop: "Meest gevraagd",
        items: [
          { label: "Consult met Eve-M", href: "/behandelingen/huidanalyse", zin: "De nulmeting" },
          { label: "HydraFacial", href: "/behandelingen/hydrafacial" },
          { label: "SkinPen microneedling", href: "/behandelingen/skinpen" },
          { label: "Medische peelings", href: "/behandelingen/peelings" },
          { label: "Fotona TimeWalker", href: "/behandelingen/fotona" },
          { label: "Nordlys IPL", href: "/behandelingen/nordlys-ipl" },
        ],
      },
      {
        kop: "Laserontharing",
        items: [
          { label: "Hoe het werkt", href: "/laserontharing", binnenkort: true },
          {
            label: "Zones en prijzen",
            href: "/laserontharing/configurator",
            zin: "Stel je eigen combinatie samen",
          },
          {
            label: "Gentle Laser Pro-U",
            href: "/gentlemax-pro",
            zin: "Het apparaat waar we mee werken",
            binnenkort: true,
          },
        ],
      },
    ],
    uitgelicht: {
      label: "Begin hier",
      kop: "Behandeling Nul",
      zin: "De afspraak waarin niet behandeld wordt. Eerst meten, dan pas een plan, en soms is dat geen plan.",
      href: "/intake",
      knop: "Wat er gebeurt",
    },
  },
  {
    label: "Resultaten",
    href: "/resultaten",
  },
  {
    label: "Prijzen",
    href: "/prijzen",
  },
  {
    label: "Over Diba",
    href: "/over-ons",
    kolommen: [
      {
        kop: "Wie wij zijn",
        items: [
          { label: "Over ons", href: "/over-ons", binnenkort: true },
          { label: "Ons verhaal", href: "/ons-verhaal", binnenkort: true },
          { label: "Het team", href: "/team", binnenkort: true },
          { label: "Werken bij Diba", href: "/werken-bij", binnenkort: true },
          { label: "Contact", href: "/contact", binnenkort: true },
        ],
      },
      {
        kop: "Waar wij voor staan",
        items: [
          { label: "Ons verbond", href: "/ons-verbond", zin: "Wat wij beloven en wat niet" },
          { label: "Dit behandelen wij niet", href: "/dit-behandelen-wij-niet" },
          { label: "Is het wel nodig", href: "/is-het-nodig", binnenkort: true },
          { label: "Nazorg", href: "/nazorg", binnenkort: true },
          { label: "Voor wie", href: "/doelgroep", binnenkort: true },
        ],
      },
    ],
    uitgelicht: {
      label: "Openbaar en ongefilterd",
      kop: "Wat klanten zeggen",
      zin: "Alle reviews staan op Salonized, met datum en zonder selectie vooraf.",
      href: "/reviews",
      knop: "Lees de reviews",
    },
  },
];

/** De praktische links in de topbalk. Kort houden: dit is geen tweede hoofdmenu. */
export const TOPBALK_LINKS: readonly NavLink[] = [
  { label: "Vergoedingen", href: "/vergoedingen" },
  { label: "Voor wie", href: "/doelgroep", binnenkort: true },
  { label: "Contact", href: "/contact", binnenkort: true },
];

/**
 * Mijn Diba — het klantenportaal dat er nog niet is.
 *
 * Het staat al in de balk omdat het de kant is die we op gaan: je meting, je foto's, je
 * plan en je afspraken op één plek, en niet in een map bij ons. Het is geen link maar een
 * uitklapje dat zegt wat het wordt. Een knop die naar niets leidt is erger dan een knop
 * die eerlijk zegt dat hij er nog niet is.
 *
 * BESLUIT-OKAN: of dit portaal er komt, en of het zo heet.
 */
export const MIJN_DIBA = {
  label: "Mijn Diba",
  kop: "Straks je huid op één plek",
  regels: [
    "Je metingen naast elkaar, van de eerste tot de laatste",
    "Je foto's onder hetzelfde licht, dus echt vergelijkbaar",
    "Je plan, je afspraken en wat er nog komt",
  ],
  voetnoot: "Nog in aanbouw. We bouwen eerst de zorg, dan pas het portaal.",
} as const;
