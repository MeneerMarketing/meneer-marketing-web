/**
 * Inhoud van de striaepagina.
 *
 * WAAROM DEZE PAGINA ER WEER IS.
 *
 * Striae stonden als redirect naar de littekenpagina, met als redenering dat het verhaal
 * hetzelfde is: rood en jong reageert, wit en oud veel minder. Klopt, maar Yasin wil een
 * eigen pagina en daar valt wat voor te zeggen. Iemand met striae na een zwangerschap
 * zoekt op striae, niet op littekens, en die krijgt op een littekenpagina drie kwart tekst
 * die niet over hem gaat.
 *
 * DE AS DIE ALLES BEPAALT.
 *
 * Striae rubrae zijn rood tot paars en nog jong; daar zit bloedvat in en dat reageert.
 * Striae albae zijn wit en uitgerijpt; het weefsel mist pigmentcellen en is dunner. Dat
 * onderscheid bepaalt wat er te halen valt, en het is een kwestie van maanden.
 *
 * [MEDISCHE-CHECK-ROJDA] alles over wat welke behandeling doet bij welk stadium, en de
 * termijn waarbinnen striae van rood naar wit gaan.
 */

export const STRIAE_BEOORDELING: readonly {
  readonly kop: string;
  readonly tekst: string;
}[] = [
  {
    kop: "De kleur",
    tekst:
      "Rood of paars betekent dat er nog doorbloeding in zit en dat het weefsel jong is. Wit betekent dat het is uitgerijpt.",
  },
  {
    kop: "Hoe lang ze er zitten",
    tekst:
      "De behandelaar vraagt sinds wanneer je ze hebt. Bij striae na een zwangerschap of groeispurt is dat meestal goed te dateren.",
  },
  {
    kop: "Het reliëf",
    tekst:
      "Liggen ze gelijk met de huid of zijn ze ingezonken? Dat bepaalt of we op kleur werken of op structuur.",
  },
];

export const STRIAE_SOORTEN: readonly {
  readonly id: string;
  readonly naam: string;
  readonly klanttaal: string;
  readonly vakterm: string;
  readonly watHetIs: string;
  readonly watWijDoen: string;
  readonly verwachting: string;
}[] = [
  {
    id: "rubrae",
    naam: "Rode of paarse striae",
    klanttaal: "Nog rood of paars, meestal recent ontstaan",
    vakterm: "striae rubrae",
    watHetIs:
      "De huid is uitgerekt en het bindweefsel eronder is gescheurd. De rode kleur komt van de bloedvaten die er nog doorheen lopen.",
    watWijDoen:
      "Microneedling en laser brengen de aanmaak van collageen op gang in het weefsel dat nog reageert. Dit is het stadium waarin de meeste winst zit.",
    verwachting:
      "Bij rode striae is er ruimte voor verbetering van kleur en structuur. Hoeveel, hoor je na de beoordeling. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    id: "albae",
    naam: "Witte striae",
    klanttaal: "Wit of zilverachtig, vaak al jaren aanwezig",
    vakterm: "striae albae",
    watHetIs:
      "Het weefsel is uitgerijpt. Er lopen geen actieve bloedvaten meer doorheen en er zitten minder pigmentcellen in dan in de huid eromheen.",
    watWijDoen:
      "Microneedling verbetert de structuur en maakt de striae minder voelbaar. De kleur terugbrengen lukt niet. [MEDISCHE-CHECK-ROJDA]",
    verwachting:
      "Bij witte striae werken we op structuur en niet op kleur. Dat hoor je vooraf, zodat je weet waar je aan begint.",
  },
];

export const STRIAE_WEL_NIET = {
  wel: [
    "Beginnen zolang ze nog rood of paars zijn, want dan zit er nog wat te winnen",
    "Bij striae in de zwangerschap wachten tot na de borstvoeding, en dan laten beoordelen",
    "De huid soepel houden met een verzorging die je volhoudt",
    "Een reeks afspreken met een moment waarop we opnieuw kijken",
    "Zonbescherming op de plek, want vers weefsel verkleurt sneller",
  ],
  niet: [
    "Wachten tot ze wit zijn. Dat is het moment waarop er het minst overblijft",
    "Crèmes die beloven dat witte striae verdwijnen. Dat gebeurt niet, ongeacht de prijs",
    "Zonnebank of zon op verse striae. Het verschil in kleur wordt daar groter van",
    "Elke week in de spiegel vergelijken. Striae veranderen in maanden, niet in weken",
  ],
} as const;

export const STRIAE_FAQ: readonly {
  readonly vraag: string;
  readonly antwoord: string;
}[] = [
  {
    vraag: "Gaan striae ooit helemaal weg?",
    antwoord:
      "Nee. Wat wel kan, is dat ze minder opvallen: minder rood, vlakker en minder voelbaar. Bij rode striae is er meer te halen dan bij witte. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Waarom heb ik ze en mijn zus niet?",
    antwoord:
      "Aanleg speelt de grootste rol. Hoe snel je huid rekt en hoeveel elastine erin zit, verschilt per persoon. Striae komen ook voor bij mensen die nooit zijn aangekomen.",
  },
  {
    vraag: "Kan ik behandelen tijdens de zwangerschap?",
    antwoord:
      "Nee. We wachten tot na de bevalling en de borstvoeding, en beoordelen dan opnieuw. Vaak zijn ze op dat moment ook al lichter geworden. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Hoeveel afspraken heb ik nodig?",
    antwoord:
      "Dat hangt af van het stadium en van hoe groot het gebied is. Tijdens de intake hoor je wat er in jouw geval nodig is en wat het kost.",
  },
  {
    vraag: "Helpt een crème?",
    antwoord:
      "Een goede verzorging houdt de huid soepel en dat is nuttig. Striae zelf zitten in de laag eronder, en daar komt een crème niet.",
  },
];
