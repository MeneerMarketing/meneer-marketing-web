/**
 * Wat we niet behandelen, en waar je dan wél terechtkunt.
 *
 * WAAROM DIT MEER IS DAN EEN LIJST MET NEE.
 *
 * Hier stonden negen placeholders. Een pagina die alleen zegt wat ze niet doet is een
 * disclaimer; wat hem bruikbaar maakt is de tweede helft: waar je dan wel heen moet. Een
 * kliniek die je wegstuurt zonder adres heeft je niet geholpen, ze heeft zichzelf
 * ingedekt.
 *
 * DRIE SOORTEN NEE, EN HET VERSCHIL ERTUSSEN IS BELANGRIJK.
 *
 *   arts        Dit hoort bij een arts. Niet omdat wij het niet leuk vinden maar omdat
 *               het buiten het vak van een huidtherapeut valt.
 *   aanbod      Dit bestaat, wij doen het gewoon niet. Geen oordeel over wie het wel doet.
 *   moment      Dit kan wel, alleen nu niet. Bijna altijd tijdelijk.
 *
 * Wie die drie op één hoop gooit, laat iemand met een verdachte moedervlek denken dat het
 * een kwestie van aanbod is. Dat is het verschil tussen een ongemak en een gemist moment.
 *
 * [MEDISCHE-CHECK-ROJDA] elke regel hieronder.
 * [BESLUIT-OKAN] de lijst onder "aanbod": dat is wat de kliniek wel of niet aanbiedt, en
 * die lijst is afgeleid van wat er op dibaclinics.nl staat. Klopt er iets niet, dan is dat
 * hier het snelst aan te passen.
 */

export type WeigerSoort = "arts" | "aanbod" | "moment";

export type Weigering = {
  readonly id: string;
  readonly soort: WeigerSoort;
  readonly wat: string;
  /** Waarom dit hier niet gebeurt. Eén zin, geen omhaal. */
  readonly waarom: string;
  /** Waar je dan wel heen kunt. Dit is de reden dat de pagina bestaat. */
  readonly waarheen: string;
  /**
   * Wat wij er wél bij kunnen doen.
   *
   * DIT ONTBRAK, EN DAT MAAKTE DE PAGINA ONWAAR.
   *
   * De lijst hieronder klopt medisch: dit zijn dingen die hier niet horen of nu niet
   * kunnen. Maar zonder dit veld leest elke regel als een dichte deur, terwijl er bij
   * bijna elk punt wél iets is dat we voor je doen. Bij eczeem stond dat weggestopt in
   * een bijzin ("wij kunnen wel meedenken over de huid eromheen"), bij de rest nergens.
   *
   * Iemand met eczeem las dus "ga naar de huisarts" en was weg, terwijl we aan de droge
   * huid en de barrière naast die behandeling gewoon iets kunnen doen. Dat is geen
   * marketing maar de werkelijkheid, en hem verzwijgen kost de bezoeker net zo goed iets
   * als de kliniek.
   *
   * Leeg laten mag. Bij chirurgie en permanente make-up is er echt niets, en dan is een
   * regel verzinnen erger dan hem weglaten.
   *
   * [MEDISCHE-CHECK-ROJDA] elke regel in dit veld, want hier staat wat we wél doen bij
   * mensen die tegelijk onder behandeling van een arts zijn.
   */
  readonly watWel?: string;
  /** Een pagina op deze site die verder helpt, als die er is. */
  readonly link?: { readonly label: string; readonly href: string };
};

export const WEIGER_SOORTEN: readonly {
  readonly id: WeigerSoort;
  readonly label: string;
  readonly zin: string;
}[] = [
  {
    id: "arts",
    label: "Dit hoort bij een arts",
    zin: "Niet omdat we er geen zin in hebben, maar omdat het buiten het vak van een huidtherapeut valt. Hier stuurt een goede kliniek je weg.",
  },
  {
    id: "aanbod",
    label: "Dit doen wij niet",
    zin: "Het bestaat en er zijn plekken die het goed doen. Wij bieden het alleen niet aan, en dan is doorverwijzen eerlijker dan iets erbij verzinnen.",
  },
  {
    id: "moment",
    label: "Dit kan nu even niet",
    zin: "Bijna altijd tijdelijk. Er staat bij hoe lang, zodat je weet wanneer je wél kunt komen.",
  },
];

export const WEIGERINGEN: readonly Weigering[] = [
  /* ── Bij een arts ── */
  {
    id: "verdachte-plek",
    soort: "arts",
    wat: "Een moedervlek of plek die verandert",
    waarom:
      "Verandering van vorm, kleur, grootte of gevoel hoort beoordeeld te worden door iemand die ook weefsel kan laten onderzoeken. Wij kunnen kijken; we kunnen niet uitsluiten.",
    waarheen:
      "Je huisarts. Die beoordeelt en verwijst zo nodig door naar een dermatoloog. Wacht daar niet mee tot een afspraak hier uitkomt.",
    link: {
      label: "Waar je op let bij een moedervlek",
      href: "/huidproblemen/moedervlekken",
    },
  },
  {
    id: "weghalen-moedervlek",
    soort: "arts",
    wat: "Een moedervlek laten weghalen",
    waarom:
      "Wat weggehaald wordt hoort onderzocht te worden, en dat vraagt een arts en een laboratorium. Cosmetisch weglaseren maakt onderzoek achteraf onmogelijk.",
    waarheen: "Je huisarts, of via een verwijzing een dermatoloog.",
    watWel:
      "Steelwratjes en fibromen halen we wel weg. Die worden vaak met moedervlekken verward terwijl het iets anders is: een steelwratje hangt aan een steeltje en zit los van de huid eronder. Twijfel je welke van de twee je hebt, laat het dan zien; dat kost je niets.",
    link: { label: "Fibromen verwijderen", href: "/behandelingen/fibromen" },
  },
  {
    id: "recept",
    soort: "arts",
    wat: "Medicatie op recept, zoals isotretinoïne",
    waarom:
      "Een huidtherapeut schrijft geen medicijnen voor. Bij zware acne is dat soms precies wat er nodig is, en dan is doorsturen het juiste advies.",
    waarheen:
      "Je huisarts. Loopt er al een traject met isotretinoïne, meld dat hier dan wel: het bepaalt wat er de eerste maanden daarna kan.",
    watWel:
      "Het hele acnetraject naast de medicatie, mits de timing klopt. Veel mensen komen juist ná zo een kuur voor de littekens en de textuur die overblijven, en dat is precies waar wij voor zijn. Tijdens de kuur kijken we mee zonder te behandelen.",
    link: { label: "Wat we bij acne wel doen", href: "/huidproblemen/acne" },
  },
  {
    id: "eczeem-psoriasis",
    soort: "arts",
    wat: "Eczeem of psoriasis behandelen",
    waarom:
      "Dat zijn aandoeningen met een medische behandeling, en die valt onder de huisarts of dermatoloog.",
    waarheen: "Je huisarts voor de aandoening zelf.",
    watWel:
      "De huid eromheen. Een droge, beschadigde barrière scheurt sneller open en dat lokt nieuwe plekken uit, dus daar valt naast de behandeling van je arts wel degelijk winst te halen. Loopt er iets bij de dermatoloog, zeg dat dan; we stemmen erop af in plaats van eroverheen te werken.",
    link: {
      label: "Wat eczeem met je huid doet",
      href: "/huidproblemen/eczeem",
    },
  },

  /* ── Niet in ons aanbod ── */
  {
    id: "botox-fillers",
    soort: "aanbod",
    wat: "Botox en fillers",
    waarom:
      "Wij werken aan de huid zelf: de structuur, de kleur en wat eronder zit. Volume en spierwerking zijn een ander vak.",
    waarheen:
      "Een kliniek die injectables als hoofdvak heeft, bij voorkeur met een arts die ze zet.",
    watWel:
      "Aan de kwaliteit van de huid zelf werken we wel: structuur, kleur, stevigheid en fijne lijntjes. Dat is een ander resultaat dan volume terugbrengen, en voor een deel van de mensen die voor fillers komen is het precies wat ze eigenlijk zochten.",
    link: {
      label: "Wat we bij verslapping wél doen",
      href: "/huidproblemen/huidveroudering",
    },
  },
  {
    id: "permanente-makeup",
    soort: "aanbod",
    wat: "Permanente make-up en tatoeages",
    waarom: "Dat is pigment aanbrengen. Wij zijn er om het weg te krijgen.",
    waarheen: "Een gespecialiseerde PMU-studio.",
  },
  {
    id: "draadlift",
    soort: "aanbod",
    wat: "Draadliften en chirurgie",
    waarom:
      "Alles wat door de huid heen gaat om iets op te hangen of weg te snijden is chirurgie, en dat is artsenwerk.",
    waarheen: "Een cosmetisch arts of plastisch chirurg.",
  },

  /* ── Nu even niet ── */
  {
    id: "gebruind",
    soort: "moment",
    wat: "Laser op een gebruinde huid",
    waarom:
      "Licht mikt op pigment. Zit er verse kleur in je huid van zon of zonnebank, dan neemt die het licht op en gaat de energie naar de verkeerde plek.",
    waarheen:
      "Kom terug als je huid haar eigen kleur terug heeft. Hoeveel weken dat duurt hoor je in de intake, want dat verschilt per huid.",
    watWel:
      "De meting kan nu gewoon, en behandelingen die niet met licht werken meestal ook. Dan staat je nulpunt vast en kun je beginnen zodra je kleur eruit is, in plaats van dan pas aan de wachtlijst te denken.",
    link: { label: "Hoe laserontharing werkt", href: "/laserontharing" },
  },
  {
    id: "zon-op-komst",
    soort: "moment",
    wat: "Behandelen vlak voor een zonvakantie",
    waarom:
      "Een net behandelde huid is gevoeliger voor zon, en dat is precies de periode waarin je hem niet uit de zon houdt.",
    waarheen:
      "Plan het erna. Of plan het ruim ervoor, zodat je huid tot rust is voordat je vertrekt.",
    watWel:
      "De meting en het advies kunnen wel, en dat is juist voor vertrek nuttig: je weet dan waar je op moet letten in de zon. Terug van vakantie begin je met een vertrekpunt dat er al ligt.",
  },
  {
    id: "zwanger",
    soort: "moment",
    wat: "Een deel van de lijst tijdens zwangerschap of borstvoeding",
    waarom:
      "Voor een aantal behandelingen ontbreekt het onderzoek om te kunnen zeggen dat het veilig is. Dan is niet doen de enige verdedigbare keuze.",
    waarheen:
      "Er blijft genoeg over dat wel kan, zoals dermaplaning en een rustige gezichtsbehandeling. Zeg het bij het maken van de afspraak, dan kiezen we daaruit.",
    link: { label: "Zet het in je huidprofiel", href: "/huidprofiel" },
  },
  {
    id: "geen-doel",
    soort: "moment",
    wat: "Behandelen zonder dat duidelijk is waarvoor",
    waarom:
      "Zonder meting en zonder doel is elke behandeling een gok, en dan is achteraf niet vast te stellen of er iets is veranderd.",
    waarheen:
      "Begin met de meting. Komt daar niets uit wat behandeling vraagt, dan hoor je dat en heb je vijftig euro besteed in plaats van een traject.",
    link: { label: "Wat er in Behandeling Nul gebeurt", href: "/intake" },
  },
];
