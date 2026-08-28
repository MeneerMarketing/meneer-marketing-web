/**
 * Wat een voor-en-na-foto verzwijgt.
 *
 * WAAROM DIT BESTAAT.
 *
 * Op /resultaten horen voor-en-na-foto's te staan en die zijn er nog niet. Stockbeeld en
 * gegenereerde huid mogen niet (huisregels), en dat is maar goed ook: een resultaatfoto die
 * niet van een echte klant is, is een leugen met een bijschrift.
 *
 * In plaats van een lege pagina staat er nu wat er in de tussentijd waardevoller is dan
 * drie foto's: waarom je vrijwel geen enkele voor-en-na-foto op internet kunt vertrouwen,
 * en onder welke voorwaarden dat wel kan. Dat is kennis die de bezoeker meeneemt naar elke
 * andere kliniekwebsite, en dat is precies de bedoeling.
 *
 * ALLES HIERONDER IS CONTROLEERBAAR.
 *
 * Dit zijn geen meningen. Standaardisatie van licht, afstand, hoek en tijdstip is de reden
 * dat klinische fotografie protocollen kent; zonder die standaardisatie meet je de foto en
 * niet de huid. De EVE-M op deze site doet in feite hetzelfde: vast licht, vaste afstand,
 * elke keer hetzelfde (zie `apparatuur.ts`, fasen van de EVE-M).
 *
 * [MEDISCHE-CHECK-ROJDA] met name `zwelling` en `vocht`: daar staan uitspraken over hoe
 * een huid zich vlak na een behandeling gedraagt.
 */

export type Fotovariabele = {
  readonly id: string;
  readonly label: string;
  /** Wat er verandert als je dit niet gelijk houdt. */
  readonly effect: string;
  /** Waarom dat zo werkt. Zonder reden is het een bewering. */
  readonly waarom: string;
  /** Wat wij eraan doen zodra we onze eigen beelden publiceren. */
  readonly onzeRegel: string;
  /** De zwaarste weegt het meest in het oordeel. */
  readonly gewicht: 1 | 2;
};

export const FOTOVARIABELEN: readonly Fotovariabele[] = [
  {
    id: "licht",
    label: "Dezelfde lichtrichting",
    effect:
      "Dit is de grootste. Licht dat van opzij scheert legt een schaduw in elke porie, rimpel en oneffenheid. Recht van voren vult diezelfde schaduwen op en dan is de structuur weg.",
    waarom:
      "Je ziet textuur alleen doordat er schaduw in zit. Verplaats de lamp en je verplaatst de schaduw, terwijl de huid geen millimeter veranderd is.",
    onzeRegel:
      "Dezelfde lamp op dezelfde plek, bij beide foto's. Geen raamlicht, want dat is nooit twee keer hetzelfde.",
    gewicht: 2,
  },
  {
    id: "hoek",
    label: "Dezelfde hoek en afstand",
    effect:
      "Een kin iets omhoog strakt de kaaklijn. Een halve stap dichterbij met een telefoon maakt de neus groter en de wangen smaller.",
    waarom:
      "Een korte lens dichtbij vergroot wat het dichtst bij de camera zit. Twee foto's van verschillende afstand zijn twee verschillende gezichten.",
    onzeRegel:
      "Vaste afstand, vaste hoogte, hoofd in dezelfde stand. Bij de huidscan gebeurt dat automatisch.",
    gewicht: 2,
  },
  {
    id: "selectie",
    label: "Niet alleen de beste eruit",
    effect:
      "Een perfect protocol zegt nog steeds niets als je drie geslaagde trajecten publiceert en de rest niet.",
    waarom:
      "Bij elke behandeling reageert een deel van de mensen beter dan gemiddeld en een deel minder. Wie alleen de bovenkant laat zien, laat de behandeling er beter uitzien dan hij is.",
    onzeRegel:
      "Bij elk beeld komt te staan hoeveel mensen zo'n traject deden en hoe dit geval zich daartoe verhoudt.",
    gewicht: 2,
  },
  {
    id: "zwelling",
    label: "Even lang na de behandeling",
    effect:
      "Vlak na een behandeling die de huid prikkelt zit er tijdelijk wat vocht in het weefsel. Dat vult fijne lijntjes op, en het verdwijnt binnen een paar dagen.",
    waarom:
      "Wat je dan op de foto ziet is de zwelling en niet het resultaat. Een nafoto die te vroeg genomen is, laat iets zien wat over een week niet meer bestaat.",
    onzeRegel:
      "De nafoto komt pas als de huid rustig is, en er staat bij hoeveel weken na de laatste sessie hij gemaakt is.",
    gewicht: 1,
  },
  {
    id: "makeup",
    label: "Geen make-up, geen filter",
    effect:
      "Foundation is letterlijk een laagje dat structuur verbergt. En veel telefoons verzachten de huid uit zichzelf, zonder dat je daarom gevraagd hebt.",
    waarom:
      "Beide effecten lijken op precies wat een huidbehandeling zou moeten doen. Daarom zijn ze op een resultaatfoto niet van elkaar te onderscheiden.",
    onzeRegel:
      "Schone huid op beide foto's, en geen bewerking behalve bijsnijden.",
    gewicht: 1,
  },
  {
    id: "vocht",
    label: "Dezelfde staat van de huid",
    effect:
      "Een net verzorgde huid weerkaatst het licht gelijkmatiger en oogt daardoor gladder. Een huid die net gereinigd en gehydrateerd is fotografeert beter dan dezelfde huid aan het eind van de dag.",
    waarom:
      "Vocht in de bovenste laag verandert hoe het oppervlak licht terugkaatst. Dat is een echt effect, maar het houdt uren aan en geen maanden.",
    onzeRegel:
      "Beide foto's op hetzelfde punt in de routine, en bij voorkeur op hetzelfde tijdstip van de dag.",
    gewicht: 1,
  },
  {
    id: "moment",
    label: "Vergelijkbaar moment",
    effect:
      "Roodheid na een warme douche of na het sporten, of een huid die meeloopt met de cyclus: dat verschilt van dag tot dag meer dan sommige behandelingen in maanden doen.",
    waarom:
      "Als de dagvariatie groter is dan het effect dat je wil laten zien, zegt één foto per moment niets.",
    onzeRegel:
      "Rustig moment, geen sport of hitte vooraf, en de datum staat erbij.",
    gewicht: 1,
  },
];

/** Het maximaal haalbare gewicht, voor het oordeel in de Fotocheck. */
export const FOTO_MAX = FOTOVARIABELEN.reduce((t, v) => t + v.gewicht, 0);

export type Fotooordeel = {
  readonly kop: string;
  readonly zin: string;
  readonly niveau: "geen" | "zwak" | "redelijk" | "goed";
};

/**
 * Het oordeel bij een score.
 *
 * De drempels liggen hoog en dat is met opzet. Bij voor-en-na-fotografie helpt het niet om
 * de meeste dingen goed te doen: één variabele die verschilt is genoeg om het verschil te
 * verklaren, en dan bewijst de rest van het protocol niets meer.
 */
export function fotooordeel(score: number): Fotooordeel {
  const deel = score / FOTO_MAX;
  if (deel >= 1) {
    return {
      niveau: "goed",
      kop: "Nu vergelijk je de huid",
      zin: "Alles wat de foto zelf kon veranderen ligt vast. Wat er dan nog verschilt, komt van de huid. Dit is de enige stand waarin een voor-en-na iets bewijst.",
    };
  }
  if (deel >= 0.7) {
    return {
      niveau: "redelijk",
      kop: "Bijna, en dat is niet genoeg",
      zin: "Het meeste ligt vast, maar er is nog iets anders dat het verschil kan verklaren. Bij deze foto's kun je niet uitsluiten dat je naar de omstandigheden kijkt.",
    };
  }
  if (deel >= 0.4) {
    return {
      niveau: "zwak",
      kop: "Je ziet een verschil, maar niet waarvan",
      zin: "Er is genoeg veranderd buiten de huid om het verschil te verklaren. Zulke beelden zijn niet per se onwaar; ze zijn alleen geen bewijs.",
    };
  }
  return {
    niveau: "geen",
    kop: "Deze foto's zeggen niets",
    zin: "Zo goed als alles wat je ziet kan uit de fotografie komen. Dit is de stand waarin de meeste voor-en-na-beelden op internet gemaakt zijn.",
  };
}
