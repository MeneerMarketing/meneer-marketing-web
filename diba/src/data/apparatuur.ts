/**
 * De apparatuur van Diba Clinics.
 *
 * ⚠ HERKOMST: de namen, merken en indeling komen van dibaclinics.nl (augustus 2026). ⚠
 *
 * WAAROM DEZE PAGINA'S BESTAAN, EN WAAROM ZE ANDERS ZIJN.
 *
 * Klinieken verkopen apparaatnamen. "Wij hebben de Fotona." Alsof het apparaat het werk
 * doet en de kliniek alleen de stekker erin steekt. Dat is precies andersom: een apparaat
 * is gereedschap, en wat telt is de instelling, de hand die het vasthoudt en of het bij
 * jouw huid past. Twee klinieken met hetzelfde apparaat geven niet hetzelfde resultaat.
 *
 * Dus staat op elke apparatuurpagina hetzelfde: wat het is, wat erop draait, en wat het
 * níet kan. Dat laatste is de reden dat deze pagina's er mogen zijn. Zonder dat zijn het
 * merkfolders.
 *
 * Wat ik zelf heb ingevuld en wat dus langs Rojda moet: de "waarvoor" en "niet voor"
 * lijsten en de werkingsbeschrijvingen. De namen en merken niet, die staan op hun site.
 *
 * [BEELD-NODIG]: foto's van de apparaten in de kliniek. Geen persfoto's van de fabrikant,
 * want dan zie je een apparaat in een studio en niet die van hier.
 */

export type ApparaatCategorie =
  | "meten"
  | "laser"
  | "licht"
  | "needling"
  | "injectie"
  | "overig";

export const APPARAAT_CATEGORIEEN: readonly {
  readonly id: ApparaatCategorie;
  readonly label: string;
}[] = [
  { id: "meten", label: "Meten" },
  { id: "laser", label: "Laser" },
  { id: "licht", label: "Licht" },
  { id: "needling", label: "Microneedling" },
  { id: "injectie", label: "Injectie" },
  { id: "overig", label: "Overig" },
];

export type Apparaat = {
  readonly slug: string;
  readonly naam: string;
  /** Fabrikant of merk. Leeg als het geen apparaat maar een productlijn is. */
  readonly merk?: string;
  readonly categorie: ApparaatCategorie;
  readonly kort: string;
  readonly wat: string;
  /** Waar dit apparaat voor gemaakt is. */
  readonly waarvoor: readonly string[];
  /** Wat het niet kan. Even lang als de vorige lijst, met opzet. */
  readonly nietVoor: readonly string[];
  /** Slugs uit `behandelingen.ts` die op dit apparaat draaien. */
  readonly behandelingen: readonly string[];
};

export const APPARATUUR: readonly Apparaat[] = [
  {
    slug: "eve-m",
    naam: "Eve-M",
    categorie: "meten",
    kort: "De huidscanner waar elk traject mee begint. Meet, behandelt niet.",
    wat: "De Eve-M brengt de conditie van je huid in kaart en maakt zichtbaar wat met het blote oog niet altijd te zien is: beginnende pigmentatie, vochttekort, poriestructuur en tekenen van huidveroudering. Verschillende huidlagen worden geanalyseerd, en door de meting te herhalen wordt voortgang objectief zichtbaar. [MEDISCHE-CHECK-ROJDA]",
    waarvoor: [
      "Vastleggen wat er nu is, op een manier die over maanden nog vergelijkbaar is",
      "Zien wat er onder de oppervlakte zit voordat het zichtbaar wordt",
      "Voortgang van een traject controleren in plaats van inschatten",
    ],
    nietVoor: [
      "Behandelen. Er gebeurt niets met je huid",
      "Een diagnose stellen. Dat doet een arts",
      "Voorspellen wat een behandeling gaat opleveren",
    ],
    behandelingen: ["huidanalyse"],
  },
  {
    slug: "fotona",
    naam: "Fotona TimeWalker",
    merk: "Fotona",
    categorie: "laser",
    kort: "Laser die op meerdere dieptes werkt. Draagt 4D, SmoothEye, LipLase en VectorLift.",
    wat: "Een laserplatform dat huidveroudering op meerdere niveaus aanpakt: van binnenuit door de mondholte en van buitenaf over de huid. Elke behandeling op dit apparaat mikt op één ding, en dat is precies waarom er meerdere namen op staan. [MEDISCHE-CHECK-ROJDA]",
    waarvoor: [
      "Verslapping en volumeverlies aanpakken zonder injectables",
      "Gericht werken rond de ogen, de lippen of de kaaklijn",
      "Laserpeel en fractionele behandeling van de huid",
    ],
    nietVoor: [
      "Haargroei. Daar staat een ander apparaat voor",
      "Werken op een gebruinde huid [MEDISCHE-CHECK-ROJDA]",
      "Eén sessie met blijvend resultaat; het is altijd een reeks",
    ],
    behandelingen: ["fotona"],
  },
  {
    slug: "gentle-laser-pro-u",
    naam: "Gentle Laser Pro-U",
    merk: "Candela",
    categorie: "laser",
    kort: "De laser voor ontharing. Mikt op het pigment in de haarwortel.",
    wat: "Een laser die ongewenste haargroei bij de kern aanpakt, ingegroeide haren en irritatie vermindert en zorgt voor een langdurig gladde en rustige huid. Wat de energie opneemt warmt op, de rest niet. [MEDISCHE-CHECK-ROJDA]",
    waarvoor: [
      "Haargroei op vrijwel elke zone van het lichaam",
      "Ingegroeide haren en irritatie van scheren verminderen",
      "Instelbaar op verschillende huidtypes [MEDISCHE-CHECK-ROJDA]",
    ],
    nietVoor: [
      "Pigmentvlekken of textuur. Dat zijn andere apparaten",
      "Grijs of heel licht haar, want daar zit te weinig pigment in [MEDISCHE-CHECK-ROJDA]",
      "Een gebruinde huid [MEDISCHE-CHECK-ROJDA]",
    ],
    behandelingen: ["laserontharing"],
  },
  {
    slug: "nordlys-ipl",
    naam: "Nordlys",
    merk: "Candela",
    categorie: "licht",
    kort: "IPL: een bereik aan golflengtes in plaats van één. Breed en ondiep.",
    wat: "IPL stuurt geen enkele golflengte de huid in maar een bereik, met een filter dat het grofste eruit haalt. Daardoor raakt het meerdere doelen tegelijk: roodheid, zichtbare vaatjes en oppervlakkig pigment. Het komt gemiddeld minder diep dan een laser. [MEDISCHE-CHECK-ROJDA]",
    waarvoor: [
      "Roodheid en zichtbare vaatjes in het gelaat",
      "Oppervlakkig pigment over een groot vlak",
      "Snel werken waar precisie minder telt dan bereik",
    ],
    nietVoor: [
      "Wat diep zit. Daar komt het licht niet",
      "Eén specifiek plekje; daar is een laser preciezer voor",
      "Elk huidtype [MEDISCHE-CHECK-ROJDA]",
    ],
    behandelingen: ["nordlys-ipl"],
  },
  {
    slug: "lumi-8",
    naam: "LUMI 8-LED",
    merk: "Lumi",
    categorie: "licht",
    kort: "LED zonder naalden of zuren. Rood, geel en bijna-infrarood in een pulscyclus.",
    wat: "Een niet-invasief LED-toestel dat werkt met een gepatenteerde pulscyclus. Die wisselende pulsen voorkomen dat de huid aan de lichtenergie went, wat bij een constante dosis wel gebeurt. Wordt meestal als toevoeging bij een andere behandeling gedaan. [MEDISCHE-CHECK-ROJDA]",
    waarvoor: [
      "Roodheid en rosacea kalmeren",
      "Fijne lijntjes en diepere rimpels",
      "Toevoegen aan een behandeling zonder extra hersteltijd",
    ],
    nietVoor: [
      "Op zichzelf een traject vervangen",
      "Pigment of haargroei",
      "Snelle zichtbare verandering; dit werkt over een reeks",
    ],
    behandelingen: ["lumi-8-led"],
  },
  {
    slug: "hydrafacial-syndeo",
    naam: "HydraFacial Syndeo",
    merk: "HydraFacial",
    categorie: "overig",
    kort: "Reinigen, exfoliëren, poriën leegzuigen en voeden in één doorloop.",
    wat: "Een apparaat dat in één behandeling reinigt, de bovenste laag losmaakt, poriën leegzuigt en er daarna werkzame stoffen in brengt. Het blijft aan de oppervlakte, en juist daarom zie je het meteen en merk je er verder niets van. [MEDISCHE-CHECK-ROJDA]",
    waarvoor: [
      "Een huid die er meteen frisser uit moet zien",
      "Verstopte poriën en een doffe teint",
      "Combineren met een peeling of microneedling",
    ],
    nietVoor: [
      "Littekens of pigment dat dieper zit",
      "Blijvend resultaat; het is onderhoud",
      "Haargroei",
    ],
    behandelingen: ["hydrafacial"],
  },
  {
    slug: "skinpen-cit",
    naam: "SkinPen CIT",
    merk: "SkinPen",
    categorie: "needling",
    kort: "Medisch gecertificeerd microneedlen. Werkt op het bindweefsel.",
    wat: "Met fijne naalden worden kanaaltjes tot in de bovenste lederhuid gemaakt. De huid reageert daarop met herstel en collageenaanmaak; dat herstel is het doel, de prikjes zijn de aanleiding. Daarom duurt het weken voor je iets ziet. [MEDISCHE-CHECK-ROJDA]",
    waarvoor: [
      "Littekens die door verlies van structuur zijn ontstaan",
      "Fijne lijntjes en ongelijke textuur",
      "De laag bereiken waar een peeling niet komt",
    ],
    nietVoor: [
      "Kleur op zichzelf",
      "Eén sessie met resultaat",
      "Een huid met actieve ontsteking [MEDISCHE-CHECK-ROJDA]",
    ],
    behandelingen: ["skinpen"],
  },
  {
    slug: "dermapen-4",
    naam: "Dermapen 4",
    merk: "Dermapen",
    categorie: "needling",
    kort: "Microneedling met trillende naaldjes. Zelfde principe, ander apparaat.",
    wat: "Een microneedlingapparaat dat met minuscule, trillende naaldjes microscopisch kleine kanaaltjes in de huid maakt om het natuurlijke herstelproces te stimuleren. Dat stimuleert de collageenaanmaak, waardoor de huid steviger, gladder en egaler wordt. [MEDISCHE-CHECK-ROJDA]",
    waarvoor: [
      "Acnelittekens en grove poriën",
      "Fijne lijntjes en een doffe huid",
      "Werken per zone met een aangepaste diepte",
    ],
    nietVoor: [
      "Kleur op zichzelf",
      "Eén sessie met resultaat",
      "Een huid die net iets anders heeft ondergaan [MEDISCHE-CHECK-ROJDA]",
    ],
    behandelingen: ["dermapen-4"],
  },
  {
    slug: "u225",
    naam: "U225 intradermale injector",
    merk: "U225",
    categorie: "injectie",
    kort: "Brengt werkzame stoffen in de huid in plaats van erop, automatisch en regelmatig.",
    wat: "Bij mesotherapie worden werkzame stoffen direct in de huid gebracht. De U225 doet dat automatisch en regelmatig; de naald zit los van de spuit gemonteerd, wat de precisie van de toediening verbetert. Er zijn verschillende skinboosters, ook een depigmentatiebooster voor gezicht, hals en décolleté. [MEDISCHE-CHECK-ROJDA]",
    waarvoor: [
      "Fijne lijnen en verslapping",
      "Hyperpigmentatie, zonneschade en melasma met een depigmentatiebooster",
      "De oogregio, met een aparte formule",
    ],
    nietVoor: [
      "Volume opbouwen zoals een filler dat doet",
      "Haargroei verwijderen",
      "Zwangerschap en borstvoeding [MEDISCHE-CHECK-ROJDA]",
    ],
    behandelingen: ["skinboosters", "xl-hair"],
  },
  {
    slug: "coolifting",
    naam: "CooLift Cryo Therapy",
    merk: "CooLifting",
    categorie: "overig",
    kort: "CO2 van min twintig graden onder hoge druk. Vijf minuten, direct effect.",
    wat: "Een CO2-straal van min twintig graden wordt onder hoge druk op de huid geschoten, samen met een hoge concentratie werkzame stoffen zoals hyaluronzuur en peptiden. De kou laat de vaatjes samentrekken en daarna weer uitzetten; de combinatie met de druk brengt de stoffen dieper. [MEDISCHE-CHECK-ROJDA]",
    waarvoor: [
      "Een huid die er binnen een paar minuten strakker uit moet zien",
      "Vlak voor een gelegenheid, zonder hersteltijd",
      "Combineren met een andere behandeling",
    ],
    nietVoor: [
      "Blijvend resultaat",
      "Littekens of pigment",
      "Een traject vervangen",
    ],
    behandelingen: ["coolift"],
  },
  {
    slug: "dermaplane-pro",
    naam: "Dermaplane PRO",
    merk: "DermaplanePro",
    categorie: "overig",
    kort: "Een chirurgisch mesje onder 45 graden. Geen zuren, dus ook bij een gevoelige huid.",
    wat: "Dode huidcellen en donshaartjes worden verwijderd met een chirurgisch mesje onder een hoek van 45 graden. Er komen geen zuren aan te pas, waardoor het ook kan bij een gevoelige, droge of allergische huid en tijdens de zwangerschap. Het is pijnloos en het resultaat is meteen zichtbaar. [MEDISCHE-CHECK-ROJDA]",
    waarvoor: [
      "Een direct gladde, egale huid",
      "Een huid die chemische exfoliatie niet verdraagt",
      "Combineren met bijna elke andere behandeling",
    ],
    nietVoor: [
      "Werken onder de buitenste laag",
      "Pigment of littekens",
      "Ontharen; de donshaartjes komen terug",
    ],
    behandelingen: ["dermaplaning"],
  },
  {
    slug: "peelinglijnen",
    naam: "Peelinglijnen",
    merk: "Skin Tech Pharma, Image Skincare, ADO, Mesoestetic",
    categorie: "overig",
    kort: "Geen apparaat maar vier merken, in drie niveaus van sterkte.",
    wat: "De kliniek werkt met peelings van Skin Tech Pharma, Image Skincare, ADO en Mesoestetic, in drie niveaus. Welke er gekozen wordt hangt af van je huid van dat moment, niet van wat er het sterkst is. De inwerktijd is het middel: te lang is niet beter maar schadelijker. [MEDISCHE-CHECK-ROJDA]",
    waarvoor: [
      "Oppervlakkige verkleuring lichter maken",
      "Ruwheid en een doffe textuur",
      "Verstopte poriën, doordat de bovenlaag sneller vernieuwt",
    ],
    nietVoor: [
      "Littekens dieper dan de opperhuid",
      "Zwangerschap en borstvoeding [MEDISCHE-CHECK-ROJDA]",
      "Vlak voor veel zon [MEDISCHE-CHECK-ROJDA]",
    ],
    behandelingen: ["peelings", "cosmelan-dermamelan", "happy-intim"],
  },
];

export function apparaatVoorSlug(slug: string): Apparaat | undefined {
  return APPARATUUR.find((a) => a.slug === slug);
}

/** Welke apparaten een behandeling gebruikt. De omgekeerde koppeling. */
export function apparatenVoorBehandeling(
  behandelingSlug: string,
): readonly Apparaat[] {
  return APPARATUUR.filter((a) => a.behandelingen.includes(behandelingSlug));
}
