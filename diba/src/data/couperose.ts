/**
 * Inhoud van de couperosepagina.
 *
 * WAAROM DIT EEN EIGEN PAGINA IS EN STRIAE DAT NIET WERD.
 *
 * Striae zijn in augustus 2026 samengevoegd met littekens, met het argument dat twee
 * pagina's die hetzelfde verhaal vertellen elkaar wegdrukken. Dat argument staat nog. Het
 * geldt hier alleen niet, en dat verschil is de moeite waard om op te schrijven.
 *
 * Striae en littekens lopen langs dezelfde as: jong en rood, later wit en oud, en dezelfde
 * behandeling in dezelfde volgorde. Eén verhaal.
 *
 * Couperose en rosacea zijn twee dingen die vaak samen voorkomen maar anders werken. Een
 * verwijd vaatje is een blijvende structuur die je kunt zien en meten; rosacea is een
 * ontstekingsbeeld met opvlammingen en triggers. Het onderscheid is bovendien iets dat de
 * bezoeker zelf kan maken, in twee seconden, met zijn eigen vinger. Dat is een andere
 * eerste vraag, een ander eerste antwoord en een andere behandeling.
 *
 * En het is de vraag waarmee mensen daadwerkelijk zoeken. "Couperose" en "rosacea" zijn
 * voor Google twee woorden; op de rosaceapagina stond couperose wel in de titel maar
 * nergens als eigen ingang.
 *
 * DE VERHOUDING MET /huidproblemen/rosacea.
 *
 * Geen kopie en geen concurrent. Deze pagina gaat over de zichtbare vaatjes: herkennen,
 * onderscheiden, behandelen. Zodra er meer speelt dan vaatjes alleen (opvlammingen,
 * bultjes, branderigheid) wijst hij door naar rosacea, en die pagina wijst voor de vaatjes
 * hierheen. Beide pagina's zeggen dat met zoveel woorden, want een bezoeker die het
 * verkeerde raadt heeft er niets aan dat wij het onderscheid intern wel kennen.
 *
 * MEDISCH.
 *
 * Alles wat een bewering doet is gemarkeerd voor Rojda. De drukproef hieronder is een
 * herkenningshulp en geen diagnose, en dat staat ook op de pagina zelf.
 */

export type CouperoseBeeld = {
  readonly id: string;
  readonly naam: string;
  /** Wat iemand zonder vakkennis zou zeggen. */
  readonly klanttaal: string;
  /** De vakterm ernaast, niet in plaats daarvan (§10). */
  readonly vakterm: string;
  /** Wat de drukproef bij dit beeld doet. */
  readonly drukproef: string;
  readonly watHetBetekent: string;
  readonly aanpak: string;
  /** Het misverstand dat bij dit beeld het vaakst meekomt. */
  readonly verwarring: string;
};

export const COUPEROSE_BEELDEN: readonly CouperoseBeeld[] = [
  {
    id: "lijntjes",
    naam: "Losse rode lijntjes",
    klanttaal: "Dunne rode of paarse draadjes op je wangen of naast je neus",
    vakterm: "teleangiëctasieën",
    drukproef:
      "Het lijntje blijft zichtbaar terwijl je drukt. Je duwt het bloed er niet uit.",
    watHetBetekent:
      "Een bloedvaatje dat blijvend verwijd is. Het gaat niet vanzelf dicht en trekt niet weg met een crème. [MEDISCHE-CHECK-ROJDA]",
    aanpak:
      "Dit is het beeld waar licht het meest oplevert. We leggen eerst vast hoeveel er zichtbaar is, zodat je het verschil later niet op ons woord hoeft te geloven.",
    verwarring:
      "Dit is geen gesprongen adertje. Er is niets gesprongen; het vaatje is opgerekt en blijft open staan.",
  },
  {
    id: "gloed",
    naam: "Een rode gloed",
    klanttaal: "Een waas van rood over je wangen, zonder losse lijntjes",
    vakterm: "diffuus erytheem",
    drukproef:
      "Het rood trekt weg onder je vinger en komt daarna langzaam terug.",
    watHetBetekent:
      "Veel kleine vaatjes die tegelijk openstaan, meestal als reactie op warmte, inspanning of een trigger. Dit hoort eerder bij rosacea dan bij couperose. [MEDISCHE-CHECK-ROJDA]",
    aanpak:
      "Eerst uitzoeken wat het aanzet, en pas daarna kijken of licht iets toevoegt. Wij beginnen hier niet met een apparaat.",
    verwarring:
      "Een gloed is geen beginnende couperose die je voor moet zijn. Het is een ander mechanisme, en behandelen alsof het vaatjes zijn helpt niet.",
  },
  {
    id: "gemengd",
    naam: "Allebei door elkaar",
    klanttaal: "Een rode ondergrond met daarin een paar duidelijke lijntjes",
    vakterm: "erytheem met teleangiëctasieën",
    drukproef:
      "Het vlak trekt weg, de lijntjes blijven staan. Dat is precies het onderscheid.",
    watHetBetekent:
      "De combinatie die we het vaakst zien. De lijntjes en de gloed vragen elk om iets anders, en in die volgorde. [MEDISCHE-CHECK-ROJDA]",
    aanpak:
      "Twee sporen: de triggers van de gloed in kaart, en de zichtbare vaatjes gericht aanpakken. Wat er eerst gebeurt hangt af van wat jou het meest dwarszit.",
    verwarring:
      "Alles in één sessie wegwerken kan niet. Wie dat belooft, meet niet.",
  },
];

/**
 * De drukproef.
 *
 * Dit is de hele reden dat deze pagina bestaat en niet een alinea op de rosaceapagina is.
 * Het is een test die iemand thuis kan doen, waarvan de uitslag bepaalt welke kant het
 * gesprek op gaat, en die niets kost. Precies de vorm waarin deze site graag uitlegt.
 */
export const DRUKPROEF_STAPPEN: readonly {
  readonly kop: string;
  readonly tekst: string;
}[] = [
  {
    kop: "Druk zachtjes",
    tekst:
      "Leg een schone vinger op de rode plek en druk twee seconden aan. Niet hard; je hoeft de huid niet wit te maken.",
  },
  {
    kop: "Kijk terwijl je drukt",
    tekst:
      "Verdwijnt het rood onder je vinger, of blijft er een lijntje staan? Dat is het enige dat je hoeft te zien.",
  },
  {
    kop: "Laat los",
    tekst:
      "Komt het rood langzaam terug over het hele vlak, dan gaat het om een gloed. Was er een lijntje dat bleef staan, dan is dat een verwijd vaatje.",
  },
];

export const COUPEROSE_WEL_NIET = {
  wel: [
    "Een nulmeting onder vast licht, zodat het aantal zichtbare vaatjes vóór en na te vergelijken is",
    "Gericht licht op de vaatjes die blijven staan bij druk, in meerdere sessies",
    "Zonbescherming, elke dag. UV rekt vaatwanden op en is de belangrijkste reden dat er nieuwe bij komen [MEDISCHE-CHECK-ROJDA]",
    "Uitzoeken wat de gloed aanzet, want zolang die doorgaat komen er nieuwe vaatjes bij",
    "Eerlijk zeggen wanneer wij denken dat het bij één sessie blijft, en wanneer niet",
  ],
  niet: [
    "Stevig scrubben of borstelen. Het maakt de huid rood zonder één vaatje te sluiten",
    "Hete douches en de sauna vlak na een vaatbehandeling, omdat warmte de roodheid opnieuw kan versterken",
    "Camouflage als behandeling presenteren Groene concealer kan roodheid minder zichtbaar maken, maar behandelt de vaatjes of oorzaak niet.",
    "Een crème die belooft vaatjes te laten verdwijnen. Een verwijd vaatje zit onder de opperhuid en daar komt geen crème",
    "Beginnen op een gebruinde huid [MEDISCHE-CHECK-ROJDA]",
  ],
} as const;

/** Waar wij nee zeggen. Dit is een merkregel, geen disclaimer (A7). */
export const COUPEROSE_WIJ_DOEN_NIET = [
  {
    titel: "Geen licht op een actief opvlammende huid",
    tekst:
      "Is je huid op dit moment warm, branderig en aan het opvlammen, dan wachten we tot het rustig is. Licht op een aangedane huid maakt de roodheid vaker erger dan beter. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    titel: "Geen aantal sessies zonder meting",
    tekst:
      "Hoeveel er nodig is hangt af van hoeveel er zichtbaar is en hoe diep het zit. Dat weten we na de nulmeting en niet ervoor.",
  },
];

export const COUPEROSE_FAQ = [
  {
    vraag: "Komen die vaatjes terug na de behandeling?",
    antwoord:
      "Een vaatje dat gesloten is, blijft dicht. Wat wél kan gebeuren is dat er nieuwe bij komen, want de aanleg en de triggers veranderen niet door een behandeling. Daarom besteden we net zoveel aandacht aan wat het aanzet als aan wat er nu zichtbaar is. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Is couperose hetzelfde als rosacea?",
    antwoord:
      "Nee, al lopen ze vaak samen. Couperose zijn de zichtbare, blijvend verwijde vaatjes. Rosacea is een ontstekingsbeeld met opvlammingen, soms bultjes en een branderig gevoel. Je kunt de vaatjes hebben zonder rosacea, en rosacea zonder zichtbare vaatjes. Herken je meer dan de vaatjes alleen, lees dan verder op de rosaceapagina. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Krijg ik dit van alcohol?",
    antwoord:
      "Alcohol zet de vaten wijd open en kan een opvlamming uitlokken, maar het is niet de oorzaak van de aanleg. Dat hardnekkige verband zorgt er vooral voor dat mensen zich schamen voor iets waar ze weinig aan konden doen. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Kan ik make-up blijven gebruiken?",
    antwoord:
      "Ja, ook tussen de sessies door. We vragen alleen om je huid schoon te laten op de dag van de behandeling zelf.",
  },
];
