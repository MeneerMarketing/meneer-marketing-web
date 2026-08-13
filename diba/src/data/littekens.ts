/**
 * Inhoud van de littekens- en striaepagina.
 *
 * De klinische waarheid die deze pagina eigen maakt: bij littekens en striae bepaalt de
 * léértijd de uitkomst meer dan de techniek. Rood en jong betekent dat er nog bloedvaten
 * en actief collageen zijn, en dan valt er iets te sturen. Wit en oud betekent dat het
 * weefsel is uitgerijpt, en dan kun je textuur verbeteren maar kleur nauwelijks.
 *
 * Bijna elke kliniek verzwijgt dat, want het betekent "u bent te laat". Wij zetten er een
 * schuifbalk van: hoe verder je schuift, hoe eerlijker het antwoord wordt. Aan het einde
 * praat de pagina je van een behandeling af.
 *
 * Elegant detail: dezelfde as werkt voor striae. Striae rubrae zijn rood en nieuw, striae
 * albae wit en oud, en het verhaal is identiek. Eén interactie dekt beide.
 *
 * COPY-STATUS: concept in de Diba-stem. Medische beweringen gemarkeerd voor Rojda. Geen
 * percentages: geen belofte zonder meting (A7).
 */

import { kostenVraag } from "@/data/pillar-kosten";

export type Fase = {
  readonly id: string;
  /** Wat er op de schuifbalk staat. */
  readonly label: string;
  /** Kortere variant voor smalle schermen; vijf volledige labels naast elkaar rafelen. */
  readonly kort: string;
  /**
   * Klasse die --fase-kleur zet (zie globals.css). Bewust een klasse en geen hex:
   * de kleuren horen in het tokenblok, en een token dat alleen vanuit TSX wordt
   * gelezen overleeft de gebouwde stylesheet niet.
   */
  readonly kleurKlasse: string;
  /** De vaktermen die bij dit stadium horen. */
  readonly vakterm: string;
  readonly watErGebeurt: string;
  readonly watRealistischIs: string;
  readonly watWijDoen: string;
  /** Hoe open het venster nog is: bepaalt de balk en de toon. */
  readonly venster: "open" | "sluit" | "gesloten";
};

export const LITTEKEN_FASES: readonly Fase[] = [
  {
    id: "vers",
    label: "Net ontstaan",
    kort: "Net",
    kleurKlasse: "fase-vers",
    vakterm: "inflammatoire fase",
    watErGebeurt:
      "De wond is dicht maar de huid is nog aan het opruimen. Rood, soms verheven, vaak gevoelig. Er komen nieuwe bloedvaten bij en er wordt collageen aangelegd zonder ordening. [MEDISCHE-CHECK-ROJDA]",
    watRealistischIs:
      "Nu is er nog niets te behandelen, en dat is goed nieuws. Wat je nu doet bepaalt hoe het litteken eruit gaat zien, meer dan welke sessie dan ook.",
    watWijDoen:
      "We behandelen niet. We vertellen je wat je thuis doet: uit de zon houden, niet trekken, en geduld. Dat kost je niets en levert het meeste op.",
    venster: "open",
  },
  {
    id: "rijpend",
    label: "3 tot 12 maanden",
    kort: "3 mnd",
    kleurKlasse: "fase-rijpend",
    vakterm: "proliferatieve fase",
    watErGebeurt:
      "Het collageen wordt herschikt. Het litteken kan in deze periode nog alle kanten op: platter en lichter, of juist dikker als de aanmaak doorschiet. [MEDISCHE-CHECK-ROJDA]",
    watRealistischIs:
      "Dit is het venster. Hier is de meeste winst te halen, bij zowel littekens als bij rode striae. Wie hier komt, komt op het juiste moment.",
    watWijDoen:
      "Meten en dan gericht behandelen. Bij rood en verheven werken we vaak eerst op de bloedvaten, daarna op de structuur.",
    venster: "open",
  },
  {
    id: "verkleurend",
    label: "1 tot 3 jaar",
    kort: "1 jaar",
    kleurKlasse: "fase-verkleurend",
    vakterm: "remodelleringsfase",
    watErGebeurt:
      "De roodheid trekt weg en het litteken wordt bleker. Het weefsel wordt steviger en minder beweeglijk. De vorm ligt nu grotendeels vast.",
    watRealistischIs:
      "Er valt nog wat te winnen, vooral in textuur. De kleur volgt uit zichzelf. Verwacht verbetering, geen verdwijning.",
    watWijDoen:
      "We meten eerst of er genoeg te halen valt om de sessies te rechtvaardigen. Zo niet, dan zeggen we dat.",
    venster: "sluit",
  },
  {
    id: "rijp",
    label: "3 tot 5 jaar",
    kort: "3 jaar",
    kleurKlasse: "fase-rijp",
    vakterm: "uitgerijpt litteken",
    watErGebeurt:
      "Het litteken is uitgerijpt. De bloedvaten zijn grotendeels verdwenen en het collageen ligt in zijn eindstand. Er verandert van nature bijna niets meer. [MEDISCHE-CHECK-ROJDA]",
    watRealistischIs:
      "Textuur is nog te verbeteren, kuiltjes deels op te vullen. Kleur is lastig: wit weefsel maakt geen pigment meer aan.",
    watWijDoen:
      "Eerlijk rekenen. We laten je zien wat de meting zegt en wat dat in sessies betekent, en dan beslis jij of het je dat waard is.",
    venster: "sluit",
  },
  {
    id: "oud",
    label: "Ouder dan 5 jaar",
    kort: "5 jaar+",
    kleurKlasse: "fase-oud",
    vakterm: "striae albae, atrofisch litteken",
    watErGebeurt:
      "Wit, dun en definitief. Bij striae heet dit striae albae. Het weefsel mist pigmentcellen en heeft een andere structuur dan de huid eromheen. [MEDISCHE-CHECK-ROJDA]",
    watRealistischIs:
      "Hier is het eerlijke antwoord dat we weinig kunnen beloven. De structuur is deels te verbeteren, de witte kleur vrijwel niet. Wie je hier volledige verdwijning belooft, verkoopt je iets.",
    watWijDoen:
      "Meestal raden we het af, of we stellen een korte proef voor met een meetmoment erna. Dan zie je zelf of doorgaan zin heeft.",
    venster: "gesloten",
  },
] as const;

export const VENSTER_TEKST = {
  open: {
    kop: "Het venster staat open",
    tekst: "Dit is de periode waarin je het meest kunt beïnvloeden.",
  },
  sluit: {
    kop: "Het venster sluit",
    tekst: "Er valt nog iets te halen, maar minder dan een jaar geleden.",
  },
  gesloten: {
    kop: "Het venster is gesloten",
    tekst: "Wat er nu is, is grotendeels blijvend. Dat mag je van ons horen.",
  },
} as const;

/* ── De soorten ────────────────────────────────────────────────────────── */

export const LITTEKEN_SOORTEN = [
  {
    id: "ingezonken",
    naam: "Kuiltjes in de huid",
    klanttaal: "Putjes die je vooral ziet bij zijlicht",
    vakterm: "atrofische littekens",
    watJeZiet:
      "Kleine indeukingen, vaak op de wangen en slapen. Ze vallen op bij strijklicht en veel minder recht van voren.",
    watHetBetekent:
      "Er is weefsel verloren gegaan tijdens de genezing. De huid eromheen is normaal. [MEDISCHE-CHECK-ROJDA]",
    aanpak:
      "Dit type reageert het beste van alle littekens. We werken op de rand van het kuiltje, niet op de bodem.",
    verwarring:
      "Dit zijn geen grote poriën. Een porie is rond en heeft een opening; een kuiltje heeft dat niet.",
  },
  {
    id: "verheven",
    naam: "Verheven, stevige littekens",
    klanttaal: "Een bult of streng die boven de huid uitsteekt",
    vakterm: "hypertrofisch litteken, keloïd",
    watJeZiet:
      "Verhoogd weefsel, vaak roder en steviger dan de huid eromheen. Bij keloïd groeit het over de oorspronkelijke wond heen.",
    watHetBetekent:
      "De aanmaak van collageen is doorgeschoten. Keloïd hoort bij de arts en niet bij ons. [MEDISCHE-CHECK-ROJDA]",
    aanpak:
      "Bij keloïd verwijzen we door. Bij hypertrofisch kijken we mee, vaak in overleg met je arts.",
    verwarring:
      "Keloïd komt vaker voor bij een donkere huid, en dat is geen kwestie van slechte verzorging maar van aanleg.",
  },
  {
    id: "striae-rood",
    naam: "Rode of paarse striae",
    klanttaal: "Strepen die er nieuw uitzien en nog rood zijn",
    vakterm: "striae rubrae",
    watJeZiet:
      "Rode tot paarse strepen, vaak op buik, borsten, dijen of onderrug. Soms licht verheven, soms wat jeukend.",
    watHetBetekent:
      "De huid is sneller uitgerekt dan hij kon meegroeien. Rood betekent dat het recent is en dat er nog bloedvaten in zitten. [MEDISCHE-CHECK-ROJDA]",
    aanpak:
      "Dit is het moment waarop striae het beste reageren. Wachten tot ze wit zijn is de meest gemaakte fout.",
    verwarring:
      "Striae zijn geen teken dat je iets fout deed. Ze horen bij groei, zwangerschap en spieropbouw, en ze komen ook bij sporters voor.",
  },
  {
    id: "striae-wit",
    naam: "Witte striae",
    klanttaal: "Strepen die al lang wit en dun zijn",
    vakterm: "striae albae",
    watJeZiet: "Bleke, iets ingezonken strepen die glanzen in het licht.",
    watHetBetekent:
      "De striae zijn uitgerijpt. Het weefsel mist pigment en is dunner dan de huid eromheen. [MEDISCHE-CHECK-ROJDA]",
    aanpak:
      "Hier is ons antwoord vaak dat de winst beperkt is. We laten dat zien met de meting in plaats van dat je het moet geloven.",
    verwarring:
      "Crèmes die witte striae beloven weg te halen, doen dat niet. Dat is geen mening maar wat de meting laat zien.",
  },
] as const;

export const LITTEKEN_WEL_NIET = {
  wel: [
    "Bij een vers litteken: uit de zon, elke dag, een jaar lang. Dit is de goedkoopste behandeling die bestaat",
    "Op tijd komen. Rood en jong reageert beter dan wit en oud, en dat scheelt meer dan de keuze van de behandeling",
    "Eerst de acne of het onderliggende probleem rustig krijgen, dan pas het litteken",
    "Meten voordat we starten, want littekens veranderen traag en je oog went eraan",
    "Bij striae in de zwangerschap: wachten tot na de borstvoeding en dan meten",
  ],
  niet: [
    "Wachten tot het wit is. Dat is de meest gemaakte fout, en hij is niet terug te draaien",
    "Littekens behandelen terwijl de acne nog actief is. Dan maak je er nieuwe bij",
    "Crèmes die beloven dat witte striae verdwijnen. Dat gebeurt niet, ongeacht de prijs",
    "Zonnebank om het verschil weg te camoufleren. Litteken weefsel wordt niet bruin, dus het verschil wordt juist groter",
    "Zelf schuren of prikken. Je maakt een nieuwe wond op de plek van de oude",
  ],
} as const;

export const LITTEKEN_WIJ_DOEN_NIET = [
  {
    titel: "Geen behandeling op een vers litteken",
    tekst:
      "In de eerste maanden doen we niets. Behandelen in die fase verstoort de genezing en kan het litteken juist dikker maken. Je krijgt advies mee en een afspraak over drie maanden. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    titel: "Geen belofte bij witte striae",
    tekst:
      "Witte striae en oude littekens verdwijnen niet. Structuur verbeteren kan, kleur terugbrengen niet. Dat zeggen we vóór je iets betaalt.",
  },
  {
    titel: "Geen keloïd bij ons",
    tekst:
      "Keloïd hoort bij de dermatoloog. Behandelen wij dat, dan is de kans op verergering reëel, en dat risico nemen we niet. [MEDISCHE-CHECK-ROJDA]",
  },
] as const;

export const LITTEKEN_FAQ = [
  {
    vraag: "Gaan mijn littekens helemaal weg?",
    antwoord:
      "Nee. Een litteken is blijvend weefsel; wat we doen is het minder opvallend maken. Bij verse littekens is dat verschil groot, bij oude klein. We zeggen vooraf in welke categorie het jouwe valt. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Ik heb striae van de zwangerschap. Kan ik nu al komen?",
    antwoord:
      "Komen kan altijd, meten ook. Behandelen doen we liever na de borstvoeding. Zijn je striae nog rood, dan is het wel het beste moment om het gesprek te voeren, want dat venster sluit.",
  },
  {
    vraag: "Waarom moet mijn acne eerst rustig zijn?",
    antwoord:
      "Omdat behandelen in een ontstoken huid nieuwe littekens kan geven. Je zou dan betalen om er meer bij te krijgen. Dat is de reden dat we soms nee zeggen tegen iemand die er speciaal voor komt.",
  },
  {
    vraag: "Werken die littekencrèmes uit de drogist?",
    antwoord:
      "Bij verse littekens kan siliconen iets doen, vooral bij verheven littekens. Bij witte striae en oude littekens niet. De prijs zegt daar niets over. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Ik schaam me voor mijn striae bij het zwemmen.",
    antwoord:
      "Dat horen we vaak, en het is een echte reden om te komen. We gaan alleen niet doen alsof we ze kunnen wegtoveren. Wat we wel doen is eerlijk zeggen hoeveel verschil er in jouw geval te verwachten is.",
  },
  {
    /* Zelfde als op de acnepagina: dit antwoord was al compleet, de vlag vroeg om een
       bedrag dat pas ná de meting bestaat. De kostenvraag staat er nu apart onder. */
    vraag: "Hoeveel sessies heb ik nodig?",
    antwoord:
      "Dat hangt af van de leeftijd van het litteken en het type. Na de meting krijg je een aantal en een prijs, en een moment waarop we opnieuw kijken of het werkt.",
  },
  kostenVraag(),
] as const;
