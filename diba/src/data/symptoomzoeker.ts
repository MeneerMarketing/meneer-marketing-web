import type { HuidIconNaam } from "@/components/ui/HuidIcon";

/**
 * De symptoomzoeker.
 *
 * Vijftien pagina's is te veel om doorheen te bladeren als je niet weet hoe je het noemt,
 * en dat is precies de situatie waarin de meeste mensen hier binnenkomen. Ze weten wat ze
 * zien en niet hoe het heet.
 *
 * Daarom staat er hier geen lijst met aandoeningsnamen maar een lijst met wat je ziet en
 * voelt, in gewone woorden. Je kruist aan wat er speelt en de pagina's schuiven zich in
 * volgorde van hoeveel ze dekken. Geen enkel woord in de linkerkolom is een vakterm.
 *
 * Twee kenmerken zijn anders dan de rest: "het verandert" en "ik voel me er ziek bij".
 * Die zetten de huisarts bovenaan, ongeacht wat er verder is aangevinkt.
 *
 * COPY-STATUS: concept. De koppeling tussen kenmerken en pagina's langs Rojda.
 */

export type Kenmerk = {
  readonly id: string;
  readonly tekst: string;
  /** Zet de huisarts bovenaan, wat er verder ook aangevinkt staat. */
  readonly urgent?: true;
};

export const KENMERKEN: readonly Kenmerk[] = [
  { id: "rood", tekst: "Rood of rode plekken" },
  { id: "puistjes", tekst: "Puistjes of mee-eters" },
  { id: "bultjes", tekst: "Bultjes zonder puistje" },
  { id: "adertjes", tekst: "Zichtbare adertjes of rode lijntjes" },
  { id: "jeuk", tekst: "Het jeukt" },
  { id: "schilfers", tekst: "Schilfers of vellen" },
  { id: "droog", tekst: "Droog of trekkerig" },
  { id: "prikt", tekst: "Producten prikken of branden" },
  { id: "bruine-vlek", tekst: "Bruine vlekken" },
  { id: "witte-vlek", tekst: "Witte of lichtere plekken" },
  { id: "kringen", tekst: "Donkere kringen onder mijn ogen" },
  { id: "kuiltjes", tekst: "Kuiltjes of putjes" },
  { id: "strepen", tekst: "Strepen of littekens" },
  { id: "lijntjes", tekst: "Fijne lijntjes" },
  { id: "ruw", tekst: "Ruw of dof" },
  { id: "glans", tekst: "Glimt snel of grove poriën" },
  { id: "verandert", tekst: "Een plekje dat verandert", urgent: true },
  { id: "ziek", tekst: "Ik voel me er ziek bij", urgent: true },
];

/**
 * Waar een onderwerp thuishoort. Dit is niet zomaar een indeling: het is de indeling.
 * Geen enkele andere kliniek zet op zijn overzicht welke onderwerpen ze wegsturen, en
 * precies daarom staat het hier bovenaan in plaats van in de kleine lettertjes.
 */
export type Groep = "behandelen" | "doorverwijzen" | "niet" | "wegwijzer";

export type Bestemming = {
  readonly naam: string;
  readonly pad: string;
  readonly zin: string;
  /**
   * De vraag waarmee de pagina begint. Dit is het onderscheidende van de hele reeks:
   * elk huidprobleem heeft een andere eerste vraag, en wie met de verkeerde begint
   * behandelt maanden het verkeerde.
   */
  readonly eersteVraag: string;
  readonly groep: Groep;

  /**
   * Het icoon uit de set, als sleutel uit HUIDICONEN.
   *
   * De sleutel beschrijft wat je op het icoon ziet en niet de aandoening, want één icoon
   * draagt meerdere problemen: alles wat om een verstopte porie draait krijgt dezelfde
   * porie. Twee kaarten met hetzelfde icoon zeggen dan iets — dit zijn verwante dingen.
   */
  readonly icoon: HuidIconNaam;
  readonly kenmerken: readonly string[];
};

export const BESTEMMINGEN: readonly Bestemming[] = [
  {
    naam: "Acne",
    icoon: "verstopte-porie",
    pad: "/huidproblemen/acne",
    zin: "Waar het zit op je gezicht zegt iets over waar het vandaan komt.",
    eersteVraag: "Waar op je gezicht zit het?",
    groep: "behandelen",
    kenmerken: ["puistjes", "rood", "glans", "bultjes"],
  },
  {
    /* Staat naast acne en niet eronder. "Acnelittekens" is een eigen zoekterm en vaak
       de eerste die iemand intikt, ook als hij nog actieve acne heeft; de pagina zelf
       stuurt hem dan door. */
    naam: "Acnelittekens",
    icoon: "huid-bultje",
    pad: "/huidproblemen/acne-littekens",
    zin: "Wat er na de puistjes achterbleef: kuiltjes, rood of pigment.",
    eersteVraag: "Litteken of kleur?",
    groep: "behandelen",
    kenmerken: ["kuiltjes", "bruine-vlek", "rood"],
  },
  {
    naam: "Rimpels en fijne lijntjes",
    icoon: "huid-strakker",
    pad: "/huidproblemen/rimpels",
    zin: "Lijnen die blijven staan als je gezicht in rust is.",
    eersteVraag: "Beweegt de lijn mee?",
    groep: "behandelen",
    kenmerken: ["lijntjes"],
  },
  {
    naam: "Wallen",
    icoon: "huid-strakker",
    pad: "/huidproblemen/wallen",
    zin: "Volume onder je ogen: vocht, vet of een schaduw.",
    eersteVraag: "Is het 's avonds minder?",
    groep: "behandelen",
    kenmerken: ["kringen"],
  },
  {
    naam: "Ouderdomsvlekken",
    icoon: "huid-glans",
    pad: "/huidproblemen/ouderdomsvlekken",
    zin: "Platte bruine plekken op handen, slapen of decollete.",
    eersteVraag: "Is de plek veranderd?",
    groep: "behandelen",
    kenmerken: ["bruine-vlek"],
  },
  {
    naam: "Gerstekorrels en milia",
    icoon: "verstopte-porie",
    pad: "/huidproblemen/gerstekorrels",
    zin: "Harde witte bolletjes die je niet kunt uitdrukken.",
    eersteVraag: "Wit en hard, of rood en pijnlijk?",
    groep: "behandelen",
    kenmerken: ["bultjes"],
  },
  {
    naam: "Huidverslapping",
    icoon: "huid-strakker",
    pad: "/huidproblemen/huidverslapping",
    zin: "Een vagere kaaklijn en wangen die zakken.",
    eersteVraag: "Wat zie je liggend?",
    groep: "behandelen",
    kenmerken: ["lijntjes"],
  },
  {
    naam: "Ingegroeide haren",
    icoon: "haarzakje",
    pad: "/huidproblemen/ingegroeide-haren",
    zin: "Bultjes na het scheren, met een haar die niet naar buiten komt.",
    eersteVraag: "Zit er een haar in?",
    groep: "behandelen",
    kenmerken: ["bultjes", "puistjes"],
  },
  {
    naam: "Onzuivere huid en mee-eters",
    icoon: "verstopte-porie",
    pad: "/huidproblemen/onzuivere-huid",
    zin: "Verstopte porien en af en toe een puistje, zonder echte acne.",
    eersteVraag: "Mee-eter of gewoon een porie?",
    groep: "behandelen",
    kenmerken: ["puistjes", "glans"],
  },
  {
    naam: "Keratosis pilaris",
    icoon: "huid-bultje",
    pad: "/huidproblemen/keratosis-pilaris",
    zin: "Kippenvelhuid: ruwe bultjes op bovenarmen of dijen.",
    eersteVraag: "Losse bultjes of alleen ruw?",
    groep: "behandelen",
    kenmerken: ["bultjes", "ruw", "droog"],
  },
  {
    naam: "Doffe huid",
    icoon: "huid-glans",
    pad: "/huidproblemen/doffe-huid",
    zin: "Een grauwe tint en weinig glans, zonder duidelijke vlekken.",
    eersteVraag: "Waar komt het vandaan?",
    groep: "behandelen",
    kenmerken: ["ruw", "droog"],
  },
  {
    naam: "Steelwratjes",
    icoon: "huid-bultje",
    pad: "/huidproblemen/steelwratjes",
    zin: "Zachte hangende velletjes in hals, oksel of lies.",
    eersteVraag: "Hangt het aan een steeltje?",
    groep: "behandelen",
    kenmerken: ["bultjes"],
  },
  {
    naam: "Rosacea",
    icoon: "huid-glans",
    pad: "/huidproblemen/rosacea",
    zin: "Roodheid die blijft, met opvlammingen na warmte of inspanning.",
    eersteVraag: "Wat zet het aan?",
    groep: "behandelen",
    kenmerken: ["rood", "bultjes", "prikt", "adertjes"],
  },
  {
    /* Staat naast rosacea en niet eronder verstopt. Wie de losse lijntjes zoekt
       gebruikt dit woord en niet dat andere; wie meer herkent dan vaatjes wordt op de
       couperosepagina zelf doorgestuurd. */
    naam: "Couperose",
    icoon: "huid-glans",
    pad: "/huidproblemen/couperose",
    zin: "Zichtbare adertjes die blijven staan als je erop drukt.",
    eersteVraag: "Losse vaatjes of een gloed?",
    groep: "behandelen",
    kenmerken: ["rood", "adertjes"],
  },
  {
    naam: "Pigmentvlekken",
    icoon: "huid-glans",
    pad: "/huidproblemen/pigmentvlekken",
    zin: "Bruine plekjes van opgebouwde zon, en het seizoen bepaalt wanneer je begint.",
    eersteVraag: "Welk seizoen is het?",
    groep: "behandelen",
    kenmerken: ["bruine-vlek"],
  },
  {
    naam: "Melasma",
    icoon: "huid-glans",
    pad: "/huidproblemen/melasma",
    zin: "Grotere bruine vlakken met een hormonale kant. De diepte bepaalt alles.",
    eersteVraag: "Hoe diep zit het pigment?",
    groep: "behandelen",
    kenmerken: ["bruine-vlek"],
  },
  {
    naam: "Littekens en striae",
    icoon: "huid-bultje",
    pad: "/huidproblemen/littekens",
    zin: "Hoe oud het is bepaalt meer dan welke techniek dan ook.",
    eersteVraag: "Hoe oud is het litteken?",
    groep: "behandelen",
    kenmerken: ["strepen", "kuiltjes", "witte-vlek"],
  },
  {
    naam: "Huidveroudering",
    icoon: "huid-strakker",
    pad: "/huidproblemen/huidveroudering",
    zin: "Wat komt door tijd en wat komt door zon, en alleen op dat tweede zit een knop.",
    eersteVraag: "Is dit tijd of is dit zon?",
    groep: "behandelen",
    kenmerken: ["lijntjes", "ruw", "bruine-vlek"],
  },
  {
    naam: "Poriën",
    icoon: "verstopte-porie",
    pad: "/huidproblemen/porien",
    zin: "Kleiner maken kan niet. Minder zichtbaar wel, en dat scheelt meer dan je denkt.",
    eersteVraag: "Wat valt er eigenlijk te veranderen?",
    groep: "behandelen",
    kenmerken: ["glans", "ruw"],
  },
  {
    naam: "Droge huid",
    icoon: "porie-vocht",
    pad: "/huidproblemen/droge-huid",
    zin: "Droog en uitgedroogd zijn twee losse assen, en daar gaat het meestal mis.",
    eersteVraag: "Mist er vet of mist er water?",
    groep: "behandelen",
    kenmerken: ["droog", "ruw", "schilfers"],
  },
  {
    naam: "Gevoelige huid",
    icoon: "porie-vocht",
    pad: "/huidproblemen/gevoelige-huid",
    zin: "Meestal geen huidtype maar een routine die is volgestapeld.",
    eersteVraag: "Wat staat er allemaal aan?",
    groep: "behandelen",
    kenmerken: ["prikt", "rood", "droog", "jeuk"],
  },
  {
    naam: "Donkere kringen",
    icoon: "huid-glans",
    pad: "/huidproblemen/donkere-kringen",
    zin: "Drie oorzaken die er hetzelfde uitzien, en bij één kunnen wij niets.",
    eersteVraag: "Is het kleur of is het schaduw?",
    groep: "behandelen",
    kenmerken: ["kringen"],
  },
  {
    naam: "Eczeem",
    icoon: "porie-vocht",
    pad: "/huidproblemen/eczeem",
    zin: "Een cirkel en geen plek. Hoort bij de huisarts, en die heeft er behandeling voor.",
    eersteVraag: "Waar valt de cirkel te breken?",
    groep: "doorverwijzen",
    kenmerken: ["jeuk", "schilfers", "rood", "droog"],
  },
  {
    naam: "Psoriasis",
    icoon: "porie-vocht",
    pad: "/huidproblemen/psoriasis",
    zin: "Meer dan huid. Let vooral op je nagels en je gewrichten.",
    eersteVraag: "Zitten je nagels en gewrichten er ook bij?",
    groep: "doorverwijzen",
    kenmerken: ["schilfers", "rood"],
  },
  {
    naam: "Huiduitslag",
    icoon: "cremepotje",
    pad: "/huidproblemen/huiduitslag",
    zin: "Eerst de vraag of je vandaag belt of morgen. Doe de glastest.",
    eersteVraag: "Bel je vandaag of morgen?",
    groep: "doorverwijzen",
    kenmerken: ["rood", "jeuk", "ziek"],
  },
  {
    naam: "Cellulitis",
    icoon: "huid-bultje",
    pad: "/huidproblemen/cellulitis",
    zin: "Geen vet maar bouw. Wij behandelen het niet en leggen uit waarom niemand dat kan.",
    eersteVraag: "Gaat dit over vet of over bouw?",
    groep: "niet",
    kenmerken: ["kuiltjes"],
  },
  {
    naam: "Moedervlekken",
    icoon: "pincet-haar",
    pad: "/huidproblemen/moedervlekken",
    zin: "Hiervoor moet je niet bij ons zijn. Wel staat hier waar je op let.",
    eersteVraag: "Is er iets veranderd?",
    groep: "doorverwijzen",
    kenmerken: ["verandert"],
  },
  {
    naam: "Huidverkleuring",
    icoon: "huid-glans",
    pad: "/huidproblemen/huidverkleuring",
    zin: "Weet je niet hoe je het noemt? Begin dan bij de kleur.",
    eersteVraag: "Welke kleur heeft het?",
    groep: "wegwijzer",
    kenmerken: ["bruine-vlek", "witte-vlek", "rood"],
  },
];

export const SPOED_TEKST = {
  kop: "Ga hier eerst mee naar je huisarts",
  tekst:
    "Je gaf iets aan waarbij een arts hoort te kijken. Dat gaat vóór alles wat hieronder staat, en het is geen reden tot paniek maar wel om het niet te laten liggen. Bij ziek zijn met uitslag: bel vandaag. [MEDISCHE-CHECK-ROJDA]",
} as const;

export const ZOEKER_LEEG =
  "Kruis aan wat er speelt. Je mag er meerdere kiezen, en de lijst rechts schuift mee. Er staat bewust geen enkele vakterm bij: als je wist hoe het heette, was je hier niet.";
