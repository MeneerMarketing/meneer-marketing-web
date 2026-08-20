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

import { BEHANDELINGEN } from "@/data/behandelingen";
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
  /**
   * De tweede ingang, als tekstlink onder de knop.
   *
   * Er zijn er twee die hier thuishoren en ze sluiten elkaar niet uit: het huidprofiel is
   * voor wie weet wat hij heeft, de symptoomzoeker voor wie dat juist niet weet. Dat is
   * precies dezelfde tweedeling als op de site zelf, dus ze horen hier naast elkaar.
   *
   * Wel in rangorde en niet als twee gelijke knoppen: één primaire stap per vlak blijft
   * staan, anders is het weer kiezen in plaats van beginnen.
   */
  readonly tweede?: { readonly tekst: string; readonly href: string };
  /**
   * Het beeld boven het blok.
   *
   * De rechterkolom van een paneel is een halve pagina hoog en droeg vier regels tekst.
   * Dat is veel wit voor weinig, en het maakte van het uitgelichte blok een voetnoot in
   * plaats van een uitnodiging. Per paneel een andere opname, passend bij waar je net op
   * geklikt hebt.
   */
  readonly foto?: { readonly src: string; readonly alt: string };
};

export type NavItem = {
  readonly label: string;
  readonly href: string;
  /** Zonder kolommen is het een gewone link, met kolommen een paneel. */
  readonly kolommen?: readonly NavKolom[];
  readonly uitgelicht?: NavUitgelicht;
};

/**
 * De eerste zin van `kort` bij een behandeling.
 *
 * Deze zinnen stonden hier leeg met de reden dat een behandeling in vier woorden
 * omschrijven een medische uitspraak is die ik niet zonder Rojda schrijf. Dat klopt nog
 * steeds, en daarom staat hier geen nieuwe tekst maar de eerste zin van het `kort`-veld
 * dat de behandelpagina zelf al draagt. Dezelfde woorden, minder ervan.
 *
 * Zo is er ook maar één bron: past Rojda de omschrijving aan, dan verandert het menu mee
 * en kan het er nooit iets anders beweren dan de pagina eronder.
 */
function kortZin(slug: string): string | undefined {
  const b = BEHANDELINGEN.find((x) => x.slug === slug);
  if (!b) return undefined;
  const grens = b.kort.indexOf(". ");
  const zin = grens === -1 ? b.kort : b.kort.slice(0, grens);
  return zin.endsWith(".") ? zin.slice(0, -1) : zin;
}

/** Haalt een groep uit de bron en zet er de eerste vraag onder. */
function uitGroep(groep: Groep): readonly NavLink[] {
  return BESTEMMINGEN.filter((b) => b.groep === groep).map((b) => ({
    label: b.naam,
    href: b.pad,
    zin: b.eersteVraag,
  }));
}

/**
 * De blokken rechts in de menupanelen.
 *
 * Ze stonden eerst alle drie op hetzelfde: het huidprofiel. Dat was een correctie op een
 * eerdere versie waarin ze alle drie iets anders deden zonder samenhang, maar het sloeg
 * door naar de andere kant: het menu bood drie keer dezelfde stap aan, ook als die niet
 * paste bij waar je net op geklikt had.
 *
 * Nu volgt elk blok de ingang waar je vandaan komt, en dat is precies de volgorde die de
 * site zelf ook aanhoudt:
 *
 * - Huidproblemen: je weet nog niet hoe het heet. Dus de symptoomzoeker, met het
 *   huidprofiel als tweede stap.
 * - Behandelingen: je weet wat er speelt en zoekt wat erbij past. Dus het huidprofiel, met
 *   Behandeling Nul als tweede stap.
 * - Over Diba: je kijkt naar ons en niet naar je huid. Dus wat klanten schrijven, want dat
 *   is het enige oordeel dat niet van onszelf komt.
 *
 * Elk blok draagt een eigen opname. Geen van drieën is versiering: ze laten zien waar je
 * terechtkomt.
 */
const ZOEKER_BLOK: NavUitgelicht = {
  label: "Weet je niet hoe het heet",
  kop: "Symptoomzoeker",
  zin: "Kruis aan wat je ziet en wat je voelt, in gewone woorden. Geen vakterm nodig, en aan het eind weet je waar je moet zijn.",
  href: "/huidproblemen/symptoomzoeker",
  knop: "Naar de zoeker",
  tweede: {
    tekst: "Weet je het al? Vul je huidprofiel in",
    href: "/huidprofiel",
  },
  foto: {
    src: "/images/shoot/uitleg-huidlagen.jpg",
    alt: "Behandelaar legt aan de hand van een doorsnedemodel van de huid uit wat er waar zit",
  },
};

const HUIDPROFIEL_BLOK: NavUitgelicht = {
  label: "Begin hier",
  kop: "Je huidprofiel",
  zin: "Negen vragen over je huid, je routine en wat je al geprobeerd hebt. De site onthoudt je antwoorden, dus je hoeft ze bij de intake niet opnieuw te vertellen.",
  href: "/huidprofiel",
  knop: "Vul het in",
  tweede: {
    tekst: "Liever eerst meten? Naar Behandeling Nul",
    href: "/intake",
  },
  foto: {
    src: "/images/shoot/apparaat-eve-m.jpg",
    alt: "Behandelaar plaatst een cliënt in de Eve-M huidscanner",
  },
};

const REVIEWS_BLOK: NavUitgelicht = {
  label: "Openbaar en ongefilterd",
  kop: "Wat klanten zeggen",
  zin: "Alle reviews staan op Salonized, met datum en zonder selectie vooraf. Wij kunnen er niets uithalen en niets bijzetten.",
  href: "/reviews",
  knop: "Lees de reviews",
  tweede: {
    tekst: "Liever eerst het team zien?",
    href: "/team",
  },
  foto: {
    src: "/images/shoot/ontvangst-koffie.jpg",
    alt: "Een cliënt krijgt koffie aangereikt bij Diba Clinics",
  },
};

export const HOOFDNAV: readonly NavItem[] = [
  {
    label: "Huidproblemen",
    href: "/huidproblemen",
    kolommen: [
      {
        kop: "Weet je niet hoe het heet",
        items: [
          {
            label: "Symptoomzoeker",
            href: "/huidproblemen/symptoomzoeker",
            zin: "Kruis aan wat je ziet en voelt, zonder vakterm",
          },
          {
            label: "Kennisbank",
            href: "/kennisbank",
            zin: "Alles wat hier uitgelegd staat, op één plek",
          },
        ],
      },
      { kop: "Wij behandelen dit", items: uitGroep("behandelen"), breed: true },
      {
        kop: "Hier hoort een arts bij",
        items: [...uitGroep("doorverwijzen"), ...uitGroep("niet")],
      },
      {
        /* Twee pagina's die geen huidprobleem zijn en toch bij Diba terechtkomen.

           Ze stonden allebei nergens in de navigatie. /pcos was daarmee een weespagina:
           bereikbaar via de URL en verder nergens vandaan gelinkt, wat voor een
           zoekmachine betekent dat de rest van de site hem niet belangrijk genoeg vindt om
           naar te wijzen. /snurken zou datzelfde lot krijgen.

           Ze horen niet tussen de huidproblemen, want dat zijn ze niet. Vandaar een eigen
           kop die precies zegt wat ze wel zijn. */
        kop: "Ook zonder huidklacht",
        items: [
          {
            label: "Snurken",
            href: "/snurken",
            zin: "Waar het geluid ontstaat bepaalt of wij iets kunnen",
          },
          {
            label: "PCOS",
            href: "/pcos",
            zin: "Wat er van binnenuit meespeelt bij je huid",
          },
        ],
      },
    ],
    uitgelicht: ZOEKER_BLOK,
  },
  {
    label: "Behandelingen",
    href: "/behandelingen",
    kolommen: [
      {
        kop: "Begin hier",
        items: [
          {
            label: "Behandeling Nul",
            href: "/intake",
            zin: "De afspraak waarin niet behandeld wordt",
          },
          {
            label: "Je huidprofiel",
            href: "/huidprofiel",
            zin: "Negen stappen, en de site onthoudt het",
          },
          {
            label: "Alle behandelingen",
            href: "/behandelingen",
            zin: "Filter op doel en op hersteltijd",
          },
          {
            label: "Onze apparatuur",
            href: "/apparatuur",
            zin: "Wat er staat, en wat het niet kan",
          },
        ],
      },
      {
        kop: "Meest gevraagd",
        items: [
          {
            label: "Consult met Eve-M",
            href: "/behandelingen/huidanalyse",
            zin: kortZin("huidanalyse"),
          },
          {
            label: "HydraFacial",
            href: "/behandelingen/hydrafacial",
            zin: kortZin("hydrafacial"),
          },
          {
            label: "SkinPen Microneedling",
            href: "/behandelingen/skinpen",
            zin: kortZin("skinpen"),
          },
          {
            label: "Medische peelings",
            href: "/behandelingen/peelings",
            zin: kortZin("peelings"),
          },
          {
            label: "Fotona TimeWalker",
            href: "/behandelingen/fotona",
            zin: kortZin("fotona"),
          },
          {
            label: "Nordlys IPL",
            href: "/behandelingen/nordlys-ipl",
            zin: kortZin("nordlys-ipl"),
          },
        ],
      },
      {
        kop: "Laserontharing",
        items: [
          {
            label: "Hoe het werkt",
            href: "/laserontharing",
            zin: kortZin("laserontharing"),
            binnenkort: true,
          },
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
    uitgelicht: HUIDPROFIEL_BLOK,
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
          {
            label: "Over ons",
            href: "/over-ons",
            zin: "De kliniek in Hillegersberg",
            binnenkort: true,
          },
          {
            label: "Ons verhaal",
            href: "/ons-verhaal",
            zin: "Vijf regels, en wat ze kosten",
            binnenkort: true,
          },
          {
            label: "Het team",
            href: "/team",
            zin: "Acht mensen, en wie wat doet",
            binnenkort: true,
          },
          {
            label: "Werken bij Diba",
            href: "/werken-bij",
            zin: "Twee vacatures en een open sollicitatie",
            binnenkort: true,
          },
          {
            label: "Contact",
            href: "/contact",
            zin: "Adres, tijden en hoe snel we antwoorden",
            binnenkort: true,
          },
        ],
      },
      {
        kop: "Waar wij voor staan",
        items: [
          {
            label: "Wat klanten zeggen",
            href: "/reviews",
            zin: "Alles op Salonized, zonder selectie vooraf",
          },
          {
            label: "Ons verbond",
            href: "/ons-verbond",
            zin: "Wat wij beloven en wat niet",
          },
          {
            label: "Dit behandelen wij niet",
            href: "/dit-behandelen-wij-niet",
            zin: "Drie soorten nee, en waar dan wel",
          },
          {
            label: "Is het wel nodig",
            href: "/is-het-nodig",
            zin: "Wat er gebeurt als je niets doet",
            binnenkort: true,
          },
          {
            label: "Nazorg",
            href: "/nazorg",
            zin: "Per behandeling: wanneer alles weer mag",
            binnenkort: true,
          },
          {
            label: "Voor wie",
            href: "/doelgroep",
            zin: "Vier groepen, dezelfde behandellijst",
            binnenkort: true,
          },
          {
            label: "Voor verwijzers",
            href: "/verwijzers",
            zin: "Waar de grens ligt en hoe je verwijst",
          },
        ],
      },
    ],
    uitgelicht: REVIEWS_BLOK,
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
