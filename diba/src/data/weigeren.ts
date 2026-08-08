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
  },
  {
    id: "recept",
    soort: "arts",
    wat: "Medicatie op recept, zoals isotretinoïne",
    waarom:
      "Een huidtherapeut schrijft geen medicijnen voor. Bij zware acne is dat soms precies wat er nodig is, en dan is doorsturen het juiste advies.",
    waarheen:
      "Je huisarts. Loopt er al een traject met isotretinoïne, meld dat hier dan wel: het bepaalt wat er de eerste maanden daarna kan.",
    link: { label: "Wat we bij acne wel doen", href: "/huidproblemen/acne" },
  },
  {
    id: "eczeem-psoriasis",
    soort: "arts",
    wat: "Eczeem of psoriasis behandelen",
    waarom:
      "Dat zijn aandoeningen met een medische behandeling, en die valt onder de huisarts of dermatoloog. Wij kunnen wel meedenken over de huid eromheen.",
    waarheen: "Je huisarts voor de aandoening zelf.",
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
