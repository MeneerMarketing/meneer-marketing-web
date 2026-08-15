/**
 * Inhoud van de pagina over huiduitslag.
 *
 * Huiduitslag is geen aandoening maar een symptoom met tientallen oorzaken, van onschuldig
 * tot spoedeisend. Een huidkliniek hoort daar niets over te beweren. Wat wij wél kunnen
 * doen is uitleggen welke test artsen zelf gebruiken om die twee uit elkaar te houden, en
 * dat is de glastest.
 *
 * Vlekjes die niet wegdrukken onder glas kunnen wijzen op bloeding in de huid, en dat is
 * in combinatie met ziek zijn een reden om meteen te bellen. Dat is precies het soort
 * informatie dat levens scheelt en dat een behandeling nooit verkoopt.
 *
 * Daarom eindigt deze pagina nergens bij ons. Geen intake, geen meting, geen prijs.
 *
 * COPY-STATUS: concept. ELKE regel op deze pagina langs Rojda voordat dit online mag,
 * inclusief de alarmsignalen. Geen diagnose, geen geruststelling.
 */

export type Uitkomst = {
  readonly id: "wegdrukbaar" | "niet-wegdrukbaar";
  readonly kop: string;
  readonly watJeZag: string;
  readonly watHetKanBetekenen: string;
  readonly watJeDoet: string;
  readonly spoed: boolean;
};

export const GLASTEST: Record<Uitkomst["id"], Uitkomst> = {
  wegdrukbaar: {
    id: "wegdrukbaar",
    kop: "De vlekken verbleken",
    watJeZag:
      "Onder de druk van het glas wordt de rode kleur lichter of verdwijnt hij, en zodra je loslaat komt hij terug.",
    watHetKanBetekenen:
      "De kleur komt van bloed dat nog in de vaatjes zit. Dat past bij veel gewone oorzaken, van een allergische reactie tot een virus. [MEDISCHE-CHECK-ROJDA]",
    watJeDoet:
      "Dit haalt de haast eraf en niet de vraag. Uitslag die blijft, terugkomt of gepaard gaat met klachten hoort nog steeds bij je huisarts.",
    spoed: false,
  },
  "niet-wegdrukbaar": {
    id: "niet-wegdrukbaar",
    kop: "De vlekken blijven staan",
    watJeZag:
      "De vlekjes veranderen niet onder het glas. Ze blijven even donker, alsof ze in de huid zitten in plaats van erin te stromen.",
    watHetKanBetekenen:
      "Dat kan betekenen dat er bloed buiten de vaatjes zit. In combinatie met ziek zijn, koorts, sufheid, nekpijn of snelle verspreiding is dat een reden om niet af te wachten. [MEDISCHE-CHECK-ROJDA]",
    watJeDoet:
      "Bel vandaag je huisarts of de huisartsenpost, en buiten die tijden 112 bij een zieke indruk. Wacht niet tot morgen om te kijken of het overgaat.",
    spoed: true,
  },
};

export const GLASTEST_UITLEG =
  "Druk de zijkant van een doorzichtig glas stevig op de vlekken en kijk er dwars doorheen. Deze test is geen diagnose en sluit niets uit: een uitslag die wél wegdrukt kan nog steeds ernstig zijn. Hij helpt je alleen inschatten of je vandaag belt of dat het tot een gewone afspraak kan wachten. [MEDISCHE-CHECK-ROJDA]";

/** Alarmsignalen die losstaan van de glastest. Eén ervan is genoeg. */
export const ALARM = [
  "Koorts, rillingen of je voelt je snel zieker worden",
  "De uitslag breidt zich binnen uren duidelijk uit",
  "Zwelling van lippen, tong of keel, of moeite met ademen of slikken",
  "Sufheid, verwardheid, nekpijn of felle hoofdpijn bij licht",
  "Blaren of loslatende huid, of plekken in je mond of ogen",
  "Uitslag bij een baby, of bij iemand met een verminderde afweer",
] as const;

export const ALARM_SLOT =
  "Herken je hier iets van, dan telt de glastest niet meer. Bellen gaat dan voor. [MEDISCHE-CHECK-ROJDA]";

/**
 * Waar je dan naartoe belt.
 *
 * Dit stond als één regel boven de lijst: "Bel vandaag, of 112 buiten kantooruren". Dat
 * zijn twee verschillende handelingen in één zin, zonder dat erbij staat wanneer welke
 * geldt. Iemand die op dat moment op deze pagina staat heeft geen samenvatting nodig maar
 * een nummer.
 *
 * De verdeling hieronder is niet nieuw; hij staat woordelijk al bij de uitkomst van de
 * glastest. Maar wie waarheen belt is een medische keuze en geen redactionele, dus moet
 * juist deze indeling langs Rojda voordat de pagina live gaat. Dat geldt in het bijzonder
 * voor de derde regel: nu hangt 112 aan het tijdstip, en de vraag is of dat klopt of dat
 * hij aan de toestand van de persoon hoort te hangen. [MEDISCHE-CHECK-ROJDA]
 */
export const ALARM_ROUTE = [
  { wanneer: "Binnen kantooruren", waar: "Je eigen huisarts" },
  { wanneer: "Avond, nacht of weekend", waar: "De huisartsenpost" },
  {
    wanneer: "Iemand maakt een zieke indruk en wachten voelt niet goed",
    waar: "112",
  },
] as const;

/* ── De gewone oorzaken ────────────────────────────────────────────────── */

export const OORZAKEN = [
  {
    naam: "Contactreactie",
    herken:
      "Een afgebakende plek met een duidelijke vorm, precies waar iets je huid raakte. Begint uren tot dagen erna.",
    waarheen: "Huisarts, en die kan allergietesten aanvragen als dat nodig is.",
  },
  {
    naam: "Eczeem",
    herken:
      "Jeuk staat voorop, droge schilferende plekken die steeds op dezelfde plaats terugkomen.",
    waarheen: "Huisarts. Er bestaat behandeling voor en die begint daar.",
    pad: "/huidproblemen/eczeem",
    link: "Naar de eczeempagina",
  },
  {
    naam: "Netelroos",
    herken:
      "Verheven, jeukende bulten die van plaats veranderen en binnen een dag weer weg zijn, om elders terug te komen.",
    waarheen:
      "Huisarts. Bij zwelling van lippen, tong of keel of bij benauwdheid direct bellen. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    naam: "Een virus",
    herken:
      "Uitslag samen met koorts of ziek zijn, vaak vrij plotseling en verspreid over het lichaam.",
    waarheen: "Huisarts, en met spoed als iemand er ziek uitziet.",
  },
] as const;

export const UITSLAG_WEL_NIET = {
  wel: [
    "De glastest doen als er rode vlekjes zijn. Het kost je tien seconden en het scheelt of je vandaag belt of morgen.",
    "Een foto maken bij het begin. Uitslag verandert snel en de arts ziet zelden de eerste dag.",
    "Opschrijven wanneer het begon en wat eraan voorafging: nieuw product, nieuw medicijn, iets gegeten, ergens gelopen.",
    "Bij twijfel bellen. De huisartsenpost is er voor precies deze vraag en niemand vindt het gek.",
    "Koelen bij jeuk, en verder afblijven tot je weet wat het is.",
  ],
  niet: [
    "Zalf of crème op onbekende uitslag smeren voordat een arts heeft gekeken. Je verandert er het beeld mee.",
    "Afwachten bij koorts, snelle uitbreiding of vlekjes die niet wegdrukken.",
    "Op internet zoeken naar een foto die erop lijkt. Uitslag ziet er bij iedereen anders uit en dat is precies waarom een arts kijkt.",
    "Een cosmetische behandeling boeken zolang er onbegrepen uitslag is.",
    "Krabben, ook al is het moeilijk. Krabben maakt het beeld onduidelijker en de huid kwetsbaarder.",
  ],
} as const;

export const UITSLAG_WIJ_DOEN_NIET = [
  {
    titel: "Wij stellen geen diagnose bij uitslag",
    tekst:
      "Huiduitslag is een symptoom met tientallen oorzaken, waarvan een deel spoedeisend is. Daar hoort een arts naar te kijken en niet een huidkliniek.",
  },
  {
    titel: "Wij geven geen geruststelling",
    tekst:
      "Ook niet als het er onschuldig uitziet. Wat wij zeggen zou meewegen in of je belt, en die verantwoordelijkheid nemen we niet.",
  },
  {
    titel: "Geen behandeling op onbegrepen uitslag",
    tekst:
      "Zolang niet duidelijk is wat het is, behandelen we het gebied niet. Ook niet als je voor iets anders komt.",
  },
] as const;

export const UITSLAG_FAQ = [
  {
    vraag: "Werkt de glastest altijd?",
    antwoord:
      "Nee, en dat is belangrijk. Hij sluit niets uit: uitslag die wél wegdrukt kan alsnog ernstig zijn, en op een donkere huid is het verschil moeilijker te zien. Kijk dan ook naar de binnenkant van de oogleden of de mond en vertrouw vooral op hoe ziek iemand is. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Mijn uitslag jeukt hevig maar ik voel me verder goed.",
    antwoord:
      "Dan is er meestal geen haast, en blijft het wel een vraag voor de huisarts. Bij zwelling van lippen, tong of keel of bij benauwdheid geldt dat niet en bel je direct.",
  },
  {
    vraag: "Kan het van een nieuw product komen?",
    antwoord:
      "Dat kan, zeker als de plek de vorm heeft van waar het product zat. Stop ermee, bewaar de verpakking en neem die mee naar je afspraak.",
  },
  {
    vraag: "Waarom staat hier geen lijst met foto's?",
    antwoord:
      "Omdat je daarmee gaat zoeken naar de foto die het meest op jou lijkt, en dat is precies de verkeerde manier. Uitslag ziet er bij iedereen anders uit, en op een donkere huid vaak heel anders dan op de foto's die je online vindt.",
  },
  {
    vraag: "Kan ik hiervoor bij jullie terecht?",
    antwoord:
      "Nee. Er staat op deze pagina geen knop om een afspraak te maken en dat is geen omissie.",
  },
] as const;
