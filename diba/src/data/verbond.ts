/**
 * Het verbond: de tien weigeringen.
 *
 * Elke huidprobleempagina heeft een sectie "waar wij nee zeggen" die hierheen linkt. Deze
 * pagina is dus geen losse belofte maar de optelsom: wat op zeventien pagina's per
 * onderwerp staat, staat hier als regel.
 *
 * Twee dingen zijn nieuw ten opzichte van de eerste versie, en allebei om dezelfde reden.
 * Die versie was een samenvatting van onze eigen huisregels, inclusief dingen als "één
 * primaire stap per scherm" — een ontwerpafspraak waar een klant niets aan heeft. Nu staat
 * er per regel wat hij óns kost, en waar je hem in de praktijk terugziet. Een belofte
 * zonder prijs is geen belofte, en een weigering die nergens terugkomt is een slogan.
 *
 * COPY-STATUS: concept in de Diba-stem. De medische onderbouwing staat op de pagina's
 * zelf en is daar al gemarkeerd voor Rojda.
 */

export type Weigering = {
  readonly nummer: string;
  readonly regel: string;
  readonly uitleg: string;
  /** Wat deze regel ons kost. Zonder die kolom is het geen belofte maar een slogan. */
  readonly kost: string;
  /** Waar je hem in de praktijk terugziet. */
  readonly zieOok?: { readonly tekst: string; readonly pad: string };
};

export const WEIGERINGEN: readonly Weigering[] = [
  {
    nummer: "01",
    regel: "Wij beloven niets wat we niet kunnen meten",
    uitleg:
      "Geen percentages die we niet zelf hebben vastgesteld, geen jaren jonger, en geen aantal sessies dat we niet waar kunnen maken. Staat er een getal op deze site, dan komt het ergens vandaan.",
    kost:
      "Onze teksten klinken voorzichtiger dan die van de buren. Dat scheelt klanten die op een groot getal afkomen.",
    zieOok: {
      tekst: "Zie de verouderingspagina",
      pad: "/huidproblemen/huidveroudering#nee",
    },
  },
  {
    nummer: "02",
    regel: "Wij verkopen niets waarvan we weten dat het te weinig oplevert",
    uitleg:
      "Bij een wit litteken van tien jaar oud, bij diep pigment, bij schaduw onder je ogen: dan rekenen we het voor en raden we het af. Ook als je erom vraagt.",
    kost:
      "Een deel van de mensen dat binnenkomt gaat weg zonder afspraak. Dat is geen omzet die we mislopen, dat is de bedoeling.",
    zieOok: { tekst: "Zie de littekenklok", pad: "/huidproblemen/littekens#hoe-oud" },
  },
  {
    nummer: "03",
    regel: "Wij behandelen niet wat bij een arts hoort",
    uitleg:
      "Moedervlekken, eczeem, psoriasis en onbegrepen uitslag gaan naar de huisarts of de dermatoloog. Die pagina's hebben bij ons niet eens een afspraakknop.",
    kost:
      "Vier onderwerpen waarop veel wordt gezocht leveren ons niets op. We schrijven er wel uitgebreid over.",
    zieOok: { tekst: "Zie de moedervlekkenpagina", pad: "/huidproblemen/moedervlekken" },
  },
  {
    nummer: "04",
    regel: "Wij beoordelen geen moedervlekken en verwijderen ze niet",
    uitleg:
      "Ook niet als je er alleen maar vanaf wilt. Wat weg is kan niet meer onderzocht worden, en dat risico is niet aan ons om te nemen. Bij elke behandeling dekken we ze af.",
    kost:
      "Een veelgevraagde ingreep die wij principieel niet doen, en waarvoor we mensen dus wegsturen.",
    zieOok: { tekst: "Zie de ABCDE-check", pad: "/huidproblemen/moedervlekken#check" },
  },
  {
    nummer: "05",
    regel: "Wij behandelen niet op een huid die daar niet klaar voor is",
    uitleg:
      "Actieve acne, een kapotte barrière, een geïrriteerde huid of een verse zonvakantie: dan gaat de afspraak niet door. Je gaat naar huis met minder in plaats van meer.",
    kost:
      "Verzette afspraken, gaten in de agenda, en soms een teleurgestelde klant die er klaar voor dacht te zijn.",
    zieOok: { tekst: "Zie de stapelteller", pad: "/huidproblemen/gevoelige-huid#teller" },
  },
  {
    nummer: "06",
    regel: "Wij beginnen niet in het verkeerde seizoen",
    uitleg:
      "Pigment en melasma behandelen we liever in het najaar. In juni werk je tegen de zon in, en dan betaal je voor een resultaat dat de zomer niet haalt.",
    kost:
      "Een half jaar wachten in het drukste seizoen, met de kans dat iemand ondertussen ergens anders begint.",
    zieOok: { tekst: "Zie het zonjaar", pad: "/huidproblemen/pigmentvlekken" },
  },
  {
    nummer: "07",
    regel: "Wij doen niets aan volume en niets aan lichaamsvorm",
    uitleg:
      "Geen injectables, geen volumeopbouw, en geen behandeling tegen cellulitis. Dat zijn geen huidbehandelingen, en bij cellulitis kan niemand waarmaken wat er beloofd wordt.",
    kost:
      "Twee van de best verkopende categorieën in deze branche staan bij ons niet op de kaart.",
    zieOok: { tekst: "Zie de cellulitispagina", pad: "/huidproblemen/cellulitis" },
  },
  {
    nummer: "08",
    regel: "Wij verkopen geen pakketten en geen abonnementen",
    uitleg:
      "Geen serie die je vooruit betaalt, geen strippenkaart, en geen routine met acht stappen. We spreken een aantal sessies af met een moment waarop we opnieuw kijken.",
    kost:
      "Vooruitbetaalde pakketten zijn de zekerste omzet die een kliniek kan hebben. Die zekerheid hebben wij niet.",
    zieOok: { tekst: "Zie de poriënpagina", pad: "/huidproblemen/porien#nee" },
  },
  {
    nummer: "09",
    regel: "Wij werken niet met korting, sale of schaarste",
    uitleg:
      "Geen actieprijs, geen nog twee plekken deze week, en geen aanbod dat vandaag afloopt. Een behandeling die je vanwege korting kiest, was niet de behandeling die je nodig had.",
    kost:
      "De hele gereedschapskist waarmee de rest van de branche zijn agenda vult, ligt bij ons dicht.",
  },
  {
    nummer: "10",
    regel: "Wij tonen geen resultaat dat we niet onder hetzelfde licht hebben gemeten",
    uitleg:
      "Geen voor-en-na met andere belichting, een andere hoek of andere make-up. Bij poriën, kringen en cellulitis is de lamp anders het hele resultaat.",
    kost:
      "Onze foto's zijn minder spectaculair dan die van anderen. Dat is precies waarom je ze kunt geloven.",
    zieOok: { tekst: "Zie de poriënpagina", pad: "/huidproblemen/porien#meten" },
  },
];

export const VERBOND_INTRO =
  "Dit zijn geen huisregels maar weigeringen. Bij elke regel staat wat hij ons kost, want een belofte zonder prijs is geen belofte. Ze staan hier bij elkaar en ze staan ook los, op de pagina waar ze gelden.";

export const VERBOND_SLOT = {
  kop: "Houd ons eraan",
  tekst:
    "Merk je dat we ons hier niet aan houden, zeg het dan tegen degene die je behandelt of laat het ons weten. Een verbond dat je niet kunt aanspreken is een advertentie. [BESLUIT-OKAN]",
} as const;

export const VERBOND_FAQ = [
  {
    vraag: "Waarom staat bij elke regel wat het jullie kost?",
    antwoord:
      "Omdat een belofte pas iets waard is als hij ergens pijn doet. Iedereen kan opschrijven dat hij eerlijk is; de vraag is wat je ervoor opgeeft.",
  },
  {
    vraag: "Wat als een behandelaar hiervan afwijkt?",
    antwoord:
      "Dan mag je dat ter plekke zeggen, en dan gaat de behandeling niet door. Deze regels staan boven het gesprek in de behandelkamer en niet eronder.",
  },
  {
    vraag: "Geldt dit ook als ik er zelf om vraag?",
    antwoord:
      "Ja, en bij verschillende regels is dat precies het geval: mensen vragen om een behandeling waarvan wij weten dat hij te weinig oplevert. Het antwoord blijft hetzelfde.",
  },
  {
    vraag: "Verandert dit verbond nog?",
    antwoord:
      "Komt er iets bij, dan komt het erbij. Wat er staat halen we er niet af zonder het te vermelden. [BESLUIT-OKAN]",
  },
] as const;
