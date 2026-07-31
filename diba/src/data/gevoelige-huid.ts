/**
 * Inhoud van de pagina over een gevoelige huid.
 *
 * De klinische waarheid die deze pagina eigen maakt: "gevoelige huid" is geen huidtype
 * maar een klacht, en meestal is het een gevólg. Achter een huid die alles verdraagt tot
 * hij het opeens niet meer doet, zit vaak een routine die in de loop van jaren is
 * volgestapeld met actieve stoffen die elk op zich prima zijn.
 *
 * Daar zit het ongemakkelijke aan: de behandeling is dan aftrekken, en daar valt niets aan
 * te verdienen. Precies daarom hoor je het van ons.
 *
 * Wat deze pagina niet doet is alles op de routine schuiven. Rosacea, eczeem en
 * contactallergie zijn echte aandoeningen met dezelfde beginklacht, en die horen ergens
 * anders thuis. Ze staan er daarom nadrukkelijk bij.
 *
 * COPY-STATUS: concept in de Diba-stem. Medische beweringen gemarkeerd voor Rojda. Geen
 * merknamen, alleen categorieën: een merk noemen maakt het advies een productadvies (§11).
 */

export type Stapelaar = {
  readonly id: string;
  readonly naam: string;
  readonly onder: string;
  /** Hoe zwaar dit meeweegt in de belasting. */
  readonly gewicht: 1 | 2;
  /** Ids waarmee dit slecht samengaat op dezelfde dag. */
  readonly botst: readonly string[];
};

export const STAPELAARS: readonly Stapelaar[] = [
  {
    id: "retinol",
    naam: "Retinol of vitamine A",
    onder: "Ook in lage sterkte en ook als het maar twee keer per week is",
    gewicht: 2,
    botst: ["aha", "bha", "bp", "scrub"],
  },
  {
    id: "aha",
    naam: "Fruitzuren",
    onder: "Glycolzuur, melkzuur, mandelzuur, vaak in een toner of serum",
    gewicht: 2,
    botst: ["retinol", "bha", "scrub", "vitc"],
  },
  {
    id: "bha",
    naam: "Salicylzuur",
    onder: "Zit vaak in producten tegen onzuiverheden",
    gewicht: 1,
    botst: ["retinol", "aha", "scrub"],
  },
  {
    id: "bp",
    naam: "Benzoylperoxide",
    onder: "Tegen acne, op recept of van de drogist",
    gewicht: 2,
    botst: ["retinol", "scrub"],
  },
  {
    id: "vitc",
    naam: "Vitamine C in zure vorm",
    onder: "Meestal een serum voor de ochtend",
    gewicht: 1,
    botst: ["aha"],
  },
  {
    id: "scrub",
    naam: "Scrubben of een reinigingsborstel",
    onder: "Korrels, doekjes met structuur, of een apparaatje",
    gewicht: 2,
    botst: ["retinol", "aha", "bha", "bp"],
  },
  {
    id: "alcohol",
    naam: "Toner met alcohol",
    onder: "Herkenbaar aan het frisse, koude gevoel direct erna",
    gewicht: 1,
    botst: [],
  },
  {
    id: "parfum",
    naam: "Parfum in je verzorging",
    onder: "Staat als parfum of fragrance op de verpakking",
    gewicht: 1,
    botst: [],
  },
  {
    id: "vaak",
    naam: "Vaker dan twee keer per dag reinigen",
    onder: "Sporten en dan nog eens wassen telt mee",
    gewicht: 1,
    botst: [],
  },
  {
    id: "warm",
    naam: "Heet douchen of stomen",
    onder: "Ook een lange warme douche in de winter",
    gewicht: 1,
    botst: [],
  },
];

export type Belasting = "rustig" | "vol" | "te-vol";

export function bepaalBelasting(punten: number): Belasting {
  if (punten <= 2) return "rustig";
  if (punten <= 5) return "vol";
  return "te-vol";
}

export const BELASTING_TEKST: Record<
  Belasting,
  { readonly kop: string; readonly tekst: string; readonly advies: string }
> = {
  rustig: {
    kop: "Je routine is niet de verdachte",
    tekst:
      "Wat je aankruist is op zichzelf niet veel. Als je huid tóch overal op reageert, dan zoeken we de oorzaak liever ergens anders dan in je badkamerkastje.",
    advies:
      "Kijk hieronder of een van de aandoeningen je bekend voorkomt. Zo ja, dan begint het verhaal daar en niet bij je producten.",
  },
  vol: {
    kop: "Hier valt iets weg te laten",
    tekst:
      "Dit is een routine die op een rustige huid geen probleem hoeft te zijn en op een geïrriteerde huid net te veel is. Het draait dan minder om wat je gebruikt en meer om hoeveel tegelijk.",
    advies:
      "Probeer twee weken alles weg te laten behalve reinigen en één verzorgend product. Dat is geen advies dat ons iets oplevert en het werkt vaker dan wat dan ook.",
  },
  "te-vol": {
    kop: "Dit is een routine die vraagt om problemen",
    tekst:
      "Elk product hier kan op zichzelf prima zijn. Bij elkaar opgeteld werken ze allemaal op dezelfde barrière, en die kan maar zoveel hebben. Dan is een gevoelige huid geen aanleg maar het resultaat.",
    advies:
      "Bouw af voordat je iets nieuws probeert, en zeker voordat je een behandeling boekt. Op een kapotte barrière reageert je huid feller en levert dezelfde behandeling minder op. [MEDISCHE-CHECK-ROJDA]",
  },
};

export const BOTSING_UITLEG =
  "Deze combinatie werkt op dezelfde laag en op hetzelfde moment. Los van elkaar kan het prima, samen op één dag is het meestal te veel voor de barrière. [MEDISCHE-CHECK-ROJDA]";

/* ── Wanneer het niet de routine is ────────────────────────────────────── */

export const ANDERE_OORZAKEN = [
  {
    id: "rosacea",
    naam: "Rosacea",
    herken:
      "Blijvende roodheid op wangen en neus, opvlammingen na warmte, alcohol of inspanning, en soms bultjes zonder mee-eters.",
    pad: "/huidproblemen/rosacea",
    link: "Naar de rosaceapagina",
  },
  {
    id: "eczeem",
    naam: "Eczeem",
    herken:
      "Jeuk die voorop staat, droge schilferende plekken die terugkomen op dezelfde plaatsen, soms kloofjes.",
    pad: "/huidproblemen/eczeem",
    link: "Naar de eczeempagina",
  },
  {
    id: "contact",
    naam: "Contactallergie",
    herken:
      "De reactie komt op een afgebakende plek en begint uren tot dagen na contact, vaak met een duidelijke vorm.",
    pad: "/huidproblemen/huiduitslag",
    link: "Naar huiduitslag",
  },
  {
    id: "barriere",
    naam: "Een uitgedroogde barrière",
    herken:
      "Trekkerig na het wassen, prikkende producten die vroeger prima waren, en het is 's winters erger.",
    pad: "/huidproblemen/droge-huid",
    link: "Naar de droge huid",
  },
] as const;

export const GEVOELIG_WEL_NIET = {
  wel: [
    "Afbouwen naar het minimum en van daaruit opbouwen, één product per twee weken. Anders weet je nooit welke het was.",
    "Alles nieuw eerst een paar dagen op één plekje proberen, bijvoorbeeld in je hals.",
    "Op de ingrediëntenlijst kijken en niet op de claim. Op de voorkant staat wat het merk wil, achterop staat wat erin zit.",
    "Bijhouden wat er gebeurde en wanneer. Een gevoelige huid reageert vaak met vertraging, en dan is je geheugen geen goede getuige.",
    "Behandelingen uitstellen tot je huid rustig is. Twee weken wachten levert meer op dan doorzetten.",
  ],
  niet: [
    "Een product dat prikt toch blijven gebruiken omdat het zou moeten wennen. Prikken is geen werkzaamheid.",
    "Meerdere dingen tegelijk veranderen. Dan werkt het misschien wel, maar weet je niet waardoor.",
    "Alles vervangen door producten met gevoelig op de verpakking. Dat woord is niet beschermd en zegt op zichzelf niets.",
    "Je huid met scrubben opruimen als hij al geïrriteerd is.",
    "Aannemen dat het aanleg is voordat je de routine hebt uitgekleed. Bij veel mensen is de aanleg pas zichtbaar als de rest weg is.",
  ],
} as const;

export const GEVOELIG_WIJ_DOEN_NIET = [
  {
    titel: "Geen behandeling op een geïrriteerde huid",
    tekst:
      "Kom je binnen met een huid die overal op reageert, dan behandelen we niet. Je gaat naar huis met minder in plaats van meer, en over twee weken kijken we opnieuw.",
  },
  {
    titel: "Geen routine van acht stappen",
    tekst:
      "Wij verkopen geen schema waarin nog vier producten bij komen. Bij een gevoelige huid is aftrekken bijna altijd de behandeling.",
  },
  {
    titel: "Geen allergietesten",
    tekst:
      "Vermoed je een echte allergie, dan hoort dat bij de huisarts of een dermatoloog. Wij kunnen dat niet vaststellen en gaan het dus ook niet proberen.",
  },
] as const;

export const GEVOELIG_FAQ = [
  {
    vraag: "Is een gevoelige huid iets waarmee je geboren wordt?",
    antwoord:
      "Soms, maar lang niet altijd. Veel mensen krijgen het pas na jaren, en dan is er meestal iets veranderd in wat ze gebruiken of hoe vaak. Aanleg wordt vaak pas zichtbaar als de rest is weggehaald. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Mijn huid prikt van bijna alles. Wat nu?",
    antwoord:
      "Terug naar het minimum, twee weken. Reinigen en één verzorgend product, verder niets. Als het dan rustiger wordt was het de stapel; blijft het gelijk, dan zoeken we het ergens anders.",
  },
  {
    vraag: "Betekent prikken dat het werkt?",
    antwoord:
      "Nee. Dat is een hardnekkig verhaal en het klopt niet. Een lichte tinteling bij bepaalde stoffen kan normaal zijn, maar branden en aanhoudend prikken zijn een signaal om te stoppen. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Kan ik met een gevoelige huid wel behandeld worden?",
    antwoord:
      "Meestal wel, alleen rustiger en in kleinere stappen. Wat niet kan is behandelen terwijl je huid op dat moment geïrriteerd is, want dan reageert hij feller en levert het minder op.",
  },
  {
    vraag: "Wat kost dit?",
    antwoord:
      "[PRIJS-NODIG] Als de uitkomst is dat je twee weken moet afbouwen, dan hoor je dat in het consult en kost het je verder niets.",
  },
] as const;
