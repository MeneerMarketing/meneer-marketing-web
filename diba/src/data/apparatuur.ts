/**
 * De apparatuur van Diba Clinics.
 *
 * ⚠ HERKOMST: de namen, merken en indeling komen van dibaclinics.nl (augustus 2026). ⚠
 *
 * WAAROM DEZE PAGINA'S BESTAAN, EN WAAROM ZE ANDERS ZIJN.
 *
 * Een apparaatnaam zegt minder dan hij lijkt te zeggen. "Wij hebben de Fotona" klinkt als
 * een belofte, alsof het apparaat het werk
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
  "meten" | "laser" | "licht" | "needling" | "injectie" | "overig";

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

/**
 * Hoe een apparaat werkt, als mechaniek.
 *
 * Dit is de kern van wat een apparatuurpagina te bieden heeft boven een behandelpagina:
 * niet wát je ermee doet maar hóe het zijn werk doet. Zeven mechanieken dekken alles wat
 * er in de kliniek staat, en ze zien er alle zeven anders uit.
 */
export type Werkwijze =
  "meten" | "licht" | "naald" | "chemisch" | "zuiging" | "kou" | "injectie";

/**
 * Waar de energie of het middel op aangrijpt.
 *
 * Bij licht is dit letterlijk natuurkunde: een golflengte wordt opgenomen door één ding
 * en niet door de rest. Dat is waarom laser precies is, en het is ook waarom je moet
 * weten waar je op mikt. [MEDISCHE-CHECK-ROJDA]
 */
export type Doelwit =
  "melanine" | "bloedvat" | "water" | "bindweefsel" | "hoornlaag" | "geen";

export const DOELWITTEN: Readonly<
  Record<Doelwit, { readonly naam: string; readonly zin: string }>
> = {
  melanine: {
    naam: "Melanine",
    zin: "Het pigment in je huid en in de haarwortel. Neemt licht op en zet het om in warmte.",
  },
  bloedvat: {
    naam: "Bloedvaten",
    zin: "Het rood in bloed neemt bepaalde golflengtes op. Zo raak je een vaatje zonder de huid eromheen.",
  },
  water: {
    naam: "Water",
    zin: "Elke huidcel bestaat grotendeels uit water. Wie daarop mikt raakt weefsel en geen kleur.",
  },
  bindweefsel: {
    naam: "Bindweefsel",
    zin: "Het draagvlak van je huid. Wat je hier prikkelt, herstelt met opbouw.",
  },
  hoornlaag: {
    naam: "De hoornlaag",
    zin: "De behandeling werkt op de buitenste laag met dode huidcellen; de diepere huidlagen worden niet op dezelfde manier behandeld.",
  },
  geen: {
    naam: "Niets",
    zin: "Tijdens de huidanalyse wordt de huid alleen bekeken en niet behandeld.",
  },
};

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
  /* ── Het werkingsvenster ── */
  readonly werkwijze: Werkwijze;
  readonly doelwit: Doelwit;
  /** Tot hoe diep het komt, als percentage van de doorsnede. */
  readonly diepte: number;
  /**
   * Waarin dit apparaat verschilt van de apparaten die er het meest op lijken.
   *
   * Twaalf apparaten waarvan er meerdere hetzelfde soort werk doen, en nergens stond
   * waarom je de ene zou krijgen en niet de andere. Dat is precies de vraag van iemand
   * die op zo een pagina belandt, en het is ook de vraag die een folder nooit
   * beantwoordt: die noemt alleen wat er staat en niet waarom.
   *
   * Alleen ingevuld waar er echt een vergelijkbare buur is. Een apparaat dat het enige
   * in zijn soort is krijgt niets, en dan verdwijnt de sectie in plaats van als lege
   * kop te blijven staan. [MEDISCHE-CHECK-ROJDA]
   */
  readonly verschilMet?: readonly {
    readonly apparaat: string;
    readonly verschil: string;
  }[];

  /** Drie fasen van Zo verloopt de behandeling [MEDISCHE-CHECK-ROJDA] */
  readonly fasen: readonly { readonly kop: string; readonly zin: string }[];

  /**
   * Het apparaat zoals het er bij ons bij staat, uit de eigen shoot.
   *
   * Niet elke pagina heeft er een. Waar hij ontbreekt is dat geen omissie maar een keuze:
   * uit een opname is niet altijd af te leiden welk apparaat er precies op staat, en een
   * foto onder de verkeerde naam is erger dan geen foto. Die paar volgen zodra iemand ze
   * kan aanwijzen.
   */
  readonly foto?: { readonly src: string; readonly alt: string };

  /**
   * De techniek achter dit apparaat, in eigen woorden.
   *
   * Golflengtes, pulsduur en werkingsprincipe staan in de brochure van de fabrikant en zijn
   * dus gewoon na te lezen. Ze staan hier omdat het de vraag beantwoordt van iemand die wil
   * weten waarom hij de ene laser krijgt en niet de andere, en omdat twaalf pagina's die
   * verder grotendeels hetzelfde zeggen elkaar in de weg zitten bij Google.
   *
   * Feiten van de fabrikant staan er zonder vlag. Elke zin over wat het bij een huid doet
   * draagt [MEDISCHE-CHECK-ROJDA], want dat is haar oordeel en niet dat van een brochure.
   */
  readonly techniek?: readonly string[];
};

export const APPARATUUR: readonly Apparaat[] = [
  {
    slug: "eve-m",
    techniek: [
      "De EVE-M meet en behandelt niet. Je gezicht komt in een vaste houder, zodat de afstand en de hoek bij elke opname gelijk zijn, en de belichting komt uit het apparaat zelf en niet uit de kamer.",
      "Dat is de hele reden dat het ding er staat. Een telefoonfoto onder ander licht en vanaf een andere afstand is niet met een vorige te vergelijken, en dan weet je na acht weken nog steeds niet of er iets veranderd is of dat de zon anders stond.",
      "Naast gewoon licht wordt er ook onder UV opgenomen. Pigment dat dieper in de huid zit is in gewoon licht nauwelijks te zien en onder UV wel, en juist die diepte bepaalt wat er mogelijk is. [MEDISCHE-CHECK-ROJDA]",
    ],
    foto: {
      src: "/images/shoot/apparaat-eve-m.jpg",
      alt: "Behandelaar plaatst een cliënt in de EVE-M huidscanner",
    },
    naam: "EVE-M",
    categorie: "meten",
    kort: "De huidscanner waar elk traject mee begint. Meet, behandelt niet.",
    wat: "De EVE-M brengt de conditie van je huid in kaart en maakt zichtbaar wat met het blote oog niet altijd te zien is: beginnende pigmentatie, vochttekort, poriestructuur en tekenen van huidveroudering. Verschillende huidlagen worden geanalyseerd, en door de meting te herhalen wordt voortgang objectief zichtbaar. [MEDISCHE-CHECK-ROJDA]",
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

    werkwijze: "meten",
    doelwit: "geen",
    diepte: 60,
    fasen: [
      {
        kop: "Licht erop",
        zin: "Vast licht vanaf een vaste afstand, elke keer hetzelfde. Dat is wat vergelijken mogelijk maakt.",
      },
      {
        kop: "Doorkijken",
        zin: "De camera leest verschillende lagen uit: pigment, vocht, poriën, structuur.",
      },
      {
        kop: "Vastleggen",
        zin: "Er verandert niets aan je huid. Er ligt alleen vast hoe hij er vandaag uitzag.",
      },
    ],
  },
  {
    slug: "fotona",
    techniek: [
      "De TimeWalker draagt twee lasers in één kast. Een Er:YAG op 2940 nanometer, die vrijwel volledig door water wordt opgenomen en daardoor aan de oppervlakte blijft. En een Nd:YAG op 1064 nanometer, die veel minder door water wordt tegengehouden en dus dieper komt.",
      "Het bijzondere zit in de manier waarop Fotona de Er:YAG aanstuurt. In SMOOTH-modus komt de energie in een reeks trage pulsen in plaats van één harde, waardoor het weefsel opwarmt zonder dat de opperhuid wordt weggenomen. Dat is het verschil tussen verdampen en verwarmen, en het is de reden dat er bij deze modus geen open huid ontstaat. [MEDISCHE-CHECK-ROJDA]",
      "Dezelfde SMOOTH-modus zit achter NightLase, waarbij het zachte gehemelte wordt behandeld in plaats van de huid van je gezicht. De laser is dezelfde; alleen de plek en de instelling verschillen.",
    ],
    foto: {
      src: "/images/shoot/apparaat-fotona.jpg",
      alt: "Het bedieningsscherm van de Fotona met het behandelmenu",
    },
    naam: "Fotona TimeWalker",
    merk: "Fotona",
    categorie: "laser",
    kort: "Laser die op meerdere dieptes werkt. Draagt 4D, SmoothEye, LipLase, VectorLift en NightLase.",
    wat: "Een laserplatform dat huidveroudering op meerdere niveaus aanpakt: van binnenuit door de mondholte en van buitenaf over de huid. Elke behandeling op dit apparaat mikt op één ding, en daarom er meerdere namen op staan. [MEDISCHE-CHECK-ROJDA]",
    waarvoor: [
      "Verslapping en volumeverlies aanpakken zonder injectables",
      "Gericht werken rond de ogen, de lippen of de kaaklijn",
      "Laserpeel en fractionele behandeling van de huid",
      "Snurken aanpakken met NightLase, en dat is het enige waarvoor dit apparaat niet op de huid werkt",
    ],
    nietVoor: [
      "Haargroei. Daar staat een ander apparaat voor",
      "Werken op een gebruinde huid [MEDISCHE-CHECK-ROJDA]",
      "Eén sessie met blijvend resultaat; het is altijd een reeks",
    ],
    behandelingen: ["fotona", "nightlase"],

    werkwijze: "licht",
    doelwit: "water",
    diepte: 85,
    fasen: [
      {
        kop: "Puls omlaag",
        zin: "Het licht mikt op water in het weefsel en niet op kleur. Daarom werkt het ook waar niets bruin is.",
      },
      {
        kop: "Warmte op diepte",
        zin: "Het weefsel warmt gecontroleerd op, precies zo diep als de instelling toelaat.",
      },
      {
        kop: "Weken herstel",
        zin: "De opbouw komt daarna. Wat je die dag ziet is zwelling, geen resultaat.",
      },
    ],
    verschilMet: [
      {
        apparaat: "gentle-laser-pro-u",
        verschil:
          "Mikt op melanine en dus op de haarwortel. De Fotona mikt op water en dus op weefsel: een ander doelwit met een ander gevolg.",
      },
      {
        apparaat: "nordlys-ipl",
        verschil:
          "Stuurt een bundel golflengtes tegelijk en komt minder diep. De Fotona werkt met één golflengte per stand en gaat door tot in de diepe lederhuid.",
      },
      {
        apparaat: "lumi-8",
        verschil:
          "Geeft licht zonder doelwit en dus zonder warmte die iets afbreekt. De Fotona doet precies dat wel.",
      },
    ],
  },
  {
    slug: "gentle-laser-pro-u",
    techniek: [
      "De Gentle-serie van Candela werkt met een alexandrietlaser op 755 nanometer. Die golflengte wordt sterk opgenomen door melanine, het pigment dat een haar zijn kleur geeft. Daardoor loopt de energie langs de haarschacht naar de wortel en blijft de huid eromheen relatief onberoerd.",
      "De pulsduur is instelbaar van een kwart milliseconde tot honderd milliseconden, en de spotgrootte van 6 tot 18 millimeter. Dat zijn de twee knoppen die ertoe doen: een dikke, donkere haar vraagt iets anders dan een fijne, en een grote spot komt dieper dan een kleine.",
      "Wat dit apparaat onderscheidt is de koeling. Candela spuit met de Dynamic Cooling Device een stoot cryogeen op de huid, milliseconden voor en na de puls. De opperhuid koelt daardoor terug terwijl de haarwortel de warmte vasthoudt. Dat is de reden dat er met deze laser hogere energie mogelijk is dan zonder die koeling verantwoord zou zijn. [MEDISCHE-CHECK-ROJDA]",
    ],
    foto: {
      src: "/images/shoot/apparaat-gentle-laser.jpg",
      alt: "Laserontharing met beschermbrillen bij Diba Clinics",
    },
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

    werkwijze: "licht",
    doelwit: "melanine",
    diepte: 90,
    fasen: [
      {
        kop: "Koeling eerst",
        zin: "De bovenlaag wordt gekoeld zodat het licht dieper kan zonder daar schade te doen.",
      },
      {
        kop: "Eén golflengte",
        zin: "Het licht wordt opgenomen door het pigment in de haarwortel en door bijna niets anders.",
      },
      {
        kop: "Alleen wat groeit",
        zin: "Alleen haren die op dat moment groeien worden geraakt. Daarom is het altijd een reeks.",
      },
    ],
    verschilMet: [
      {
        apparaat: "fotona",
        verschil:
          "Mikt op water en werkt op weefsel. Deze laser mikt op melanine, en dat is waarom hij de haarwortel raakt en de huid eromheen niet.",
      },
      {
        apparaat: "nordlys-ipl",
        verschil:
          "Is geen laser maar een lamp met een bundel golflengtes. Dat werkt minder gericht op de haarwortel en komt minder diep.",
      },
      {
        apparaat: "lumi-8",
        verschil:
          "Bouwt geen warmte op en doet dus niets aan haar. Een andere categorie, geen zwakkere versie.",
      },
    ],
  },
  {
    slug: "nordlys-ipl",
    techniek: [
      "De Nordlys van Candela is geen laser maar IPL: intens gepulst licht. Een laser zendt één golflengte uit, IPL een band. Candela noemt zijn variant Selective Waveband Technology: twee filters knippen boven- en onderkant van het spectrum weg, zodat er een smallere band overblijft dan bij gewone IPL, met pulsen korter dan een milliseconde.",
      "Welke band er uit komt hangt af van de applicator. De fabrikant levert er meerdere, van 530 tot 750 nanometer voor pigment tot 645 tot 950 nanometer voor haargroei. Elke band is gekozen rond wat hij moet raken: hemoglobine in een vaatje, melanine in een vlek. [GEGEVEN-NODIG] welke applicators hier in de kast liggen.",
      "Op hetzelfde platform kan ook een Nd:YAG op 1064 nanometer draaien, en fractionele lasers op 1550 en 1940 nanometer. Die komen dieper dan het IPL-licht en doen ander werk.",
    ],
    foto: {
      src: "/images/shoot/apparaat-nordlys.jpg",
      alt: "De Nordlys van Candela met de handstukken in de houder",
    },
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

    werkwijze: "licht",
    doelwit: "bloedvat",
    diepte: 45,
    fasen: [
      {
        kop: "Filter kiezen",
        zin: "Niet één golflengte maar een bereik, met een filter dat het grofste eruit haalt.",
      },
      {
        kop: "Breed raken",
        zin: "Roodheid, vaatjes en oppervlakkig pigment nemen het licht tegelijk op.",
      },
      {
        kop: "Ondiep blijven",
        zin: "Gemiddeld komt het minder diep dan een laser. Dat is soms precies wat je wil.",
      },
    ],
    verschilMet: [
      {
        apparaat: "fotona",
        verschil:
          "Eén golflengte per stand, tot diep in de lederhuid. De Nordlys werkt breder en oppervlakkiger, en dat past bij vaatjes en pigment die vlak onder de huid zitten.",
      },
      {
        apparaat: "gentle-laser-pro-u",
        verschil:
          "Eén golflengte, gericht op de haarwortel. Daar is de Nordlys minder geschikt voor, en op roodheid juist wel.",
      },
      {
        apparaat: "lumi-8",
        verschil:
          "Geen doelwit en geen warmte. De Nordlys mikt wel degelijk op iets, namelijk het rood in bloed.",
      },
    ],
  },
  {
    slug: "lumi-8",
    techniek: [
      "LED is geen laser en geen warmtebron. Er komt licht van één kleur uit, op lage sterkte, en het wordt door de huid opgenomen zonder dat er iets wordt verdampt of losgemaakt. Je voelt er niets van en er is geen hersteltijd, want er is ook geen schade om van te herstellen.",
      "De kleuren die in de vakliteratuur het meest onderzocht zijn liggen rond 415 nanometer (blauw), 633 nanometer (rood) en 830 nanometer (nabij-infrarood). Blauw blijft aan de oppervlakte, rood komt iets dieper, en infrarood komt het verst omdat het het minst door de huid wordt tegengehouden.",
      "Wat LED daarmee doet is het onderwerp van veel onderzoek en weinig zekerheid. Wij zetten het in naast een andere behandeling en niet als vervanging ervan. [MEDISCHE-CHECK-ROJDA]",
    ],
    foto: {
      src: "/images/shoot/apparaat-lumi8.jpg",
      alt: "Het Lumi-8 LED-paneel boven het gezicht van een cliënt",
    },
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

    werkwijze: "licht",
    doelwit: "geen",
    diepte: 25,
    fasen: [
      {
        kop: "Drie kleuren",
        zin: "Rood, geel en bijna-infrarood licht, zonder warmte en zonder naalden.",
      },
      {
        kop: "Wisselende puls",
        zin: "De pulscyclus varieert, zodat de huid niet went aan de dosis.",
      },
      {
        kop: "Geen hersteltijd",
        zin: "Er wordt niets beschadigd, dus er valt ook niets te herstellen.",
      },
    ],
    verschilMet: [
      {
        apparaat: "nordlys-ipl",
        verschil:
          "Mikt op de vaatjes zelf en werkt met warmte. De Lumi 8 doet geen van beide, en heeft daarom ook geen hersteltijd.",
      },
      {
        apparaat: "fotona",
        verschil:
          "Breekt weefsel af om herstel uit te lokken. De Lumi 8 breekt niets af, en dat is meteen zijn grens.",
      },
      {
        apparaat: "coolifting",
        verschil:
          "Werkt ook zonder naalden en zonder hersteltijd, maar met kou en druk in plaats van licht.",
      },
    ],
  },
  {
    slug: "hydrafacial-syndeo",
    techniek: [
      "Het werkzame deel is het mondstuk, niet de kast. In de tip zit een spiraalvormig kanaal waar tegelijk onderdruk op staat en vloeistof doorheen loopt. Die twee samen maken een wervelende beweging over de huid: losgemaakte cellen en poriëninhoud gaan mee naar buiten, door een zijkanaal naar een opvangbak, terwijl er via hetzelfde kanaal serum naar binnen gaat.",
      "Dat is het hele idee achter de naam Vortex-Fusion: reinigen, losmaken, wegzuigen en inbrengen gebeuren in dezelfde doorgang, met één hand, zonder van instrument te wisselen.",
      "De tips zijn wegwerpartikelen en er zijn verschillende soorten, met een grovere of fijnere spiraal. Welke er gebruikt wordt hangt af van je huid en het doel van de behandeling.",
    ],
    foto: {
      src: "/images/shoot/apparaat-hydrafacial.jpg",
      alt: "Het HydraFacial-handstuk op de huid, met het apparaat op de achtergrond",
    },
    naam: "Hydrafacial syndeo",
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

    werkwijze: "zuiging",
    doelwit: "hoornlaag",
    diepte: 18,
    fasen: [
      {
        kop: "Losmaken",
        zin: "Een vloeistof maakt de verbinding tussen de buitenste cellen los.",
      },
      {
        kop: "Wegzuigen",
        zin: "Een wervelend mondstuk trekt losgekomen cellen en poriënvulling weg.",
      },
      {
        kop: "Terugbrengen",
        zin: "Daarna gaan er werkzame stoffen in dezelfde beweging weer in.",
      },
    ],
    verschilMet: [
      {
        apparaat: "peelinglijnen",
        verschil:
          "Gaat dieper en vraagt hersteltijd. De HydraFacial blijft in de hoornlaag, en daar loop je zo weer mee de deur uit.",
      },
      {
        apparaat: "dermaplane-pro",
        verschil:
          "Schraapt alleen. De HydraFacial maakt los, zuigt weg en brengt tegelijk iets in.",
      },
    ],
  },
  {
    slug: "skinpen-cit",
    techniek: [
      "Een microneedling-pen zet een cartridge met naalden in een snelle op-en-neerbeweging. De SkinPen heeft er veertien, en de diepte is instelbaar van een kwart millimeter tot drie millimeter. Dat bereik loopt van net door de hoornlaag tot in het bindweefsel.",
      "De diepte is de enige instelling die er echt toe doet, want die bepaalt in welke laag het kanaaltje eindigt. Ondiep raakt de opperhuid en heelt binnen een dag; drie millimeter komt in de laag waar bindweefsel wordt aangemaakt en vraagt langer. [MEDISCHE-CHECK-ROJDA]",
      "De cartridges zijn steriel en voor eenmalig gebruik. Dat is bij microneedling geen detail: de naalden gaan door de huidbarrière heen, en dat is precies waar die barrière voor bedoeld was.",
    ],
    foto: {
      src: "/images/shoot/apparaat-skinpen.jpg",
      alt: "Het SkinPen-handstuk op het voorhoofd van een cliënt",
    },
    naam: "SkinPen CIT",
    merk: "SkinPen",
    categorie: "needling",
    kort: "Deze medisch gecertificeerde microneedlingbehandeling werkt met gecontroleerde prikjes in de huid.",
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

    werkwijze: "naald",
    doelwit: "bindweefsel",
    diepte: 55,
    fasen: [
      {
        kop: "Verdoven",
        zin: "Een crème krijgt de tijd. Dat wachten hoort erbij en wordt niet overgeslagen.",
      },
      {
        kop: "Kanaaltjes",
        zin: "Fijne naalden maken duizenden kleine kanaaltjes tot in de bovenste lederhuid.",
      },
      {
        kop: "Herstel is het werk",
        zin: "De prikjes zijn de aanleiding. Wat je ziet komt weken later, van de opbouw.",
      },
    ],
    verschilMet: [
      {
        apparaat: "dermapen-4",
        verschil:
          "Doet hetzelfde: kanaaltjes maken zodat je huid zelf herstelt. Het verschil zit in het apparaat en niet in het principe, en welke van de twee past hangt af van je huid en de zone.",
      },
      {
        apparaat: "u225",
        verschil:
          "Prikt ook, maar om iets achter te laten. De SkinPen laat niets achter en werkt met de prikkel alleen.",
      },
    ],
  },
  {
    slug: "dermapen-4",
    techniek: [
      "Dezelfde techniek als de SkinPen, met een ander motorontwerp. De Dermapen 4 haalt tot 1920 prikken per seconde en heeft hetzelfde diepteberereik van 0,25 tot 3,0 millimeter, in stappen instelbaar per zone van je gezicht.",
      "Het verschil dat je merkt zit in de snelheid waarmee een vlak wordt afgewerkt en in de standen die de fabrikant heeft voorgeprogrammeerd, waaronder een litteken-instelling die op de maximale diepte werkt.",
      "Welke van de twee pennen je krijgt hangt niet af van welke beter is, maar van de zone, de diepte die daar past en wat er bij de meting uitkwam. [MEDISCHE-CHECK-ROJDA]",
    ],
    foto: {
      src: "/images/shoot/apparaat-dermapen.jpg",
      alt: "Het Dermapen-handstuk in gebruik bij een cliënt",
    },
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

    werkwijze: "naald",
    doelwit: "bindweefsel",
    diepte: 52,
    fasen: [
      {
        kop: "Diepte per zone",
        zin: "Rond de ogen is de huid dunner dan op de wang. De instelling gaat mee.",
      },
      {
        kop: "Trillende naalden",
        zin: "De naaldjes bewegen verticaal, wat het weefsel minder scheurt dan slepen.",
      },
      {
        kop: "Collageen daarna",
        zin: "De aanmaak komt op gang in de dagen erna, niet tijdens de behandeling.",
      },
    ],
    verschilMet: [
      {
        apparaat: "skinpen-cit",
        verschil:
          "Doet hetzelfde: kanaaltjes maken zodat je huid zelf herstelt. Het verschil zit in het apparaat en niet in het principe, en welke van de twee past hangt af van je huid en de zone.",
      },
      {
        apparaat: "u225",
        verschil:
          "Prikt ook, maar brengt er werkzame stoffen mee naar binnen. De Dermapen werkt met de prikkel alleen.",
      },
    ],
  },
  {
    slug: "u225",
    techniek: [
      "De U225 is een injector, geen laser en geen apparaat dat op de huid werkt. Een luchtdruksysteem duwt een instelbare hoeveelheid vloeistof door een fijne naald, op een diepte tussen één en tien millimeter, tot acht keer per seconde.",
      "Wat hem onderscheidt van met de hand injecteren is dat alleen de naald beweegt en de spuit stilstaat. Daardoor trilt er minder en is de diepte van prik tot prik gelijk, ook als er een paar honderd achter elkaar gaan.",
      "Wat er in de spuit zit bepaalt de behandeling, niet het apparaat. Dat kan een skinbooster zijn of een mesotherapie-mengsel, en die keuze hoort bij de behandelaar. [MEDISCHE-CHECK-ROJDA]",
    ],
    foto: {
      src: "/images/shoot/apparaat-u225.jpg",
      alt: "Het U225-mesotherapiepistool op de hoofdhuid",
    },
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

    werkwijze: "injectie",
    doelwit: "bindweefsel",
    diepte: 48,
    fasen: [
      {
        kop: "Vaste diepte",
        zin: "De naald zit los van de spuit gemonteerd, wat de precisie van elke prik verbetert.",
      },
      {
        kop: "Automatisch tempo",
        zin: "Toediening gebeurt regelmatig en niet op gevoel van de hand.",
      },
      {
        kop: "Verspreiden",
        zin: "Het middel verdeelt zich in de laag waar het werk moet gebeuren.",
      },
    ],
    verschilMet: [
      {
        apparaat: "skinpen-cit",
        verschil:
          "Prikt om de huid te prikkelen en laat niets achter. De U225 brengt er juist iets in.",
      },
      {
        apparaat: "dermapen-4",
        verschil:
          "Zelfde onderscheid: prikkel tegenover toediening. Wie stoffen op diepte wil, komt bij de U225 uit.",
      },
    ],
  },
  {
    slug: "coolifting",
    techniek: [
      "De CooLifting-gun blaast koolzuurgas onder hoge druk over de huid, met daarin een fijn verneveld serum met hyaluronzuur. De gasstroom is koud, en dat is niet toevallig: kou en druk zijn hier de twee werkzame delen.",
      "De koude gasstroom laat de vaatjes eerst samentrekken en daarna weer verwijden. De druk brengt het vernevelde serum tegen de opperhuid aan. De fabrikant noemt die twee cryoforese en baroforese.",
      "Er komt geen naald aan te pas en er wordt niets weggehaald. Het blijft aan de oppervlakte, en dat is meteen de grens van wat het kan. [MEDISCHE-CHECK-ROJDA]",
    ],
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

    werkwijze: "kou",
    doelwit: "bloedvat",
    diepte: 22,
    fasen: [
      {
        kop: "Min twintig graden",
        zin: "CO2 onder hoge druk raakt de huid. De vaatjes trekken samen.",
      },
      {
        kop: "En weer open",
        zin: "Zodra de kou wegtrekt zetten ze weer uit. Dat is de prikkel.",
      },
      {
        kop: "Stoffen mee",
        zin: "De druk brengt hyaluronzuur en peptiden mee naar binnen.",
      },
    ],
    verschilMet: [
      {
        apparaat: "lumi-8",
        verschil:
          "Werkt ook zonder naalden en zonder hersteltijd, maar met licht in plaats van kou en druk.",
      },
      {
        apparaat: "u225",
        verschil:
          "Brengt stoffen in de huid met een naald. De CooLifting duwt ze er zonder naald tegenaan, en komt dus minder ver.",
      },
    ],
  },
  {
    slug: "dermaplane-pro",
    techniek: [
      "Dit is het eenvoudigste wat er in de kliniek staat: een steriel mesje dat onder een vaste hoek over een strak getrokken huid gaat. Er komt geen stroom, licht of warmte aan te pas.",
      "Wat eraf gaat zijn dode cellen uit de hoornlaag en de fijne donshaartjes die daarin vastzitten. Wat blijft is levende huid, want het mesje snijdt niet maar schraapt over het oppervlak.",
      "Het donshaar groeit terug zoals het was: even fijn en even licht. Scheren verandert de haarschacht niet, alleen het uiteinde, en een recht afgesneden punt voelt de eerste dagen stugger dan een punt die nog nooit geknipt is.",
    ],
    naam: "Dermaplane pro",
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

    werkwijze: "chemisch",
    doelwit: "hoornlaag",
    diepte: 10,
    fasen: [
      {
        kop: "Vijfenveertig graden",
        zin: "Het mesje staat schuin en schraapt niet maar glijdt.",
      },
      {
        kop: "Dood eraf",
        zin: "Dode cellen en donshaartjes komen los. Levende huid blijft.",
      },
      {
        kop: "Geen zuur",
        zin: "Er komt geen chemie aan te pas, dus ook een gevoelige huid verdraagt het.",
      },
    ],
    verschilMet: [
      {
        apparaat: "peelinglijnen",
        verschil:
          "Lost de bovenste laag chemisch op. Dermaplaning schraapt hem af, en dat scheelt zowel in gevoel als in hersteltijd.",
      },
      {
        apparaat: "hydrafacial-syndeo",
        verschil:
          "Combineert losmaken met zuigen en inbrengen. Dermaplaning doet alleen het eerste, en komt daarmee het minst diep van de drie.",
      },
    ],
  },
  {
    slug: "peelinglijnen",
    techniek: [
      "Een peeling is geen apparaat maar een vloeistof, en wat hij doet hangt af van drie dingen: welk zuur erin zit, hoe geconcentreerd het is en hoe zuur het mengsel als geheel is. Die drie samen bepalen hoe diep het komt.",
      "Fruitzuren blijven in de hoornlaag en spoelen er na een paar minuten weer af. Salicylzuur lost op in vet en komt daardoor de porie in, waar water-oplosbare zuren niet komen. Sterkere mengsels gaan tot in de opperhuid en soms daaronder, en die vragen voorbereiding en hersteltijd.",
      "Welke lijn en welke sterkte er bij jou past hangt af van je huidtype, van wat je op dit moment gebruikt en van het seizoen. [MEDISCHE-CHECK-ROJDA]",
    ],
    foto: {
      src: "/images/shoot/apparaat-peelinglijn.jpg",
      alt: "Een flacon Dermaceutic TCA naast een cliënt op de behandelbank",
    },
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

    werkwijze: "chemisch",
    doelwit: "hoornlaag",
    diepte: 24,
    fasen: [
      {
        kop: "Sterkte kiezen",
        zin: "Drie niveaus. Welke er past hangt af van je huid van vandaag.",
      },
      {
        kop: "Inwerktijd",
        zin: "De tijd is het middel. Te lang is niet beter maar schadelijker.",
      },
      {
        kop: "Vervellen",
        zin: "De losgemaakte laag komt er in dagen af en wordt sneller vervangen.",
      },
    ],
    verschilMet: [
      {
        apparaat: "dermaplane-pro",
        verschil:
          "Schraapt de bovenste laag af met een mesje. Een peeling lost hem op, en kan afhankelijk van de lijn dieper komen.",
      },
      {
        apparaat: "hydrafacial-syndeo",
        verschil:
          "Werkt met een milde zuur- en zuigcombinatie zonder hersteltijd. Een peeling gaat verder en vraagt er dus ook meer voor terug.",
      },
    ],
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
