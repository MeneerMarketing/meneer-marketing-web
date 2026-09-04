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
  | "melanine"
  | "bloedvat"
  | "water"
  | "bindweefsel"
  | "hoornlaag"
  | "licht"
  | "geen";

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
  licht: {
    naam: "De huid zelf",
    zin: "Het licht wordt door de huid opgenomen en ondersteunt daar het herstel. Er is geen los bestanddeel waar het op mikt, zoals bij een laser.",
  },
  geen: {
    naam: "Meet en fotografeert",
    zin: "De EVE-M legt vast hoe je huid er vandaag uitziet en meet wat eronder zit. Er raakt niets je huid.",
  },
};

export type Apparaat = {
  readonly slug: string;
  readonly naam: string;
  /** Fabrikant of merk. */
  readonly merk?: string;
  /**
   * Of dit een apparaat is of een productlijn.
   *
   * De peelinglijnen staan tussen de apparatuur omdat mensen ze daar zoeken, maar een
   * peeling is een vloeistof: hij hangt aan een merk en een sterkte en niet aan een kast.
   * Het sjabloon zei negen keer "dit apparaat", en dat klopte daar dus niet.
   *
   * Standaard "apparaat", zodat de andere tien pagina's blijven zoals ze waren.
   */
  readonly soort?: "apparaat" | "productlijn";
  /** Site van de fabrikant, als die er is. Opent in een nieuw tabblad. */
  readonly merkUrl?: string;
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

  /**
   * De vragen die mensen over dít apparaat stellen.
   *
   * Niet dezelfde als op de behandelpagina: daar gaat het over de afspraak, hier over het
   * apparaat. Waarom dit ding en niet dat andere, wat de instelling uitmaakt, en wat het
   * niet kan. Dat is de vraag van iemand die op een apparaatnaam heeft gezocht.
   */
  readonly vragen?: readonly {
    readonly vraag: string;
    readonly antwoord: string;
  }[];

  /**
   * Een eigen kop boven de doorsnedetekening.
   *
   * Standaard staat er "Hoe dit apparaat op de huid werkt". Dat klopt bij elf van de
   * twaalf. De EVE-M werkt niet op de huid maar meet hem, en dat staat twee alinea's hoger
   * ook zo; dan hoort de kop dat niet tegen te spreken.
   */
  readonly werkingKop?: { readonly kop: string; readonly accent: string };
};

export const APPARATUUR: readonly Apparaat[] = [
  {
    slug: "eve-m",
    vragen: [
      {
        vraag: "Wat doet dit apparaat met mijn huid?",
        antwoord:
          "Je gezicht komt in een vaste houder en de belichting komt uit het apparaat zelf. Het maakt opnames en meet; er raakt niets je huid.",
      },
      {
        vraag: "Waarom niet gewoon een foto met de telefoon?",
        antwoord:
          "Omdat die niet met een vorige te vergelijken is. Andere afstand, ander licht, andere hoek — en dan weet je na acht weken nog steeds niet of er iets veranderd is of dat de zon anders stond.",
      },
      {
        vraag: "Wat zie ik onder UV dat ik anders niet zie?",
        antwoord:
          "Pigment dat dieper in de huid zit. In gewoon licht is dat nauwelijks zichtbaar, en juist die diepte bepaalt wat er mogelijk is. [MEDISCHE-CHECK-ROJDA]",
      },
      {
        vraag: "Krijg ik een diagnose?",
        antwoord:
          "Nee. Een meting is geen diagnose; dat is werk voor een arts. Wat je krijgt is wat er gemeten is en wat dat betekent voor wat er kan.",
      },
    ],
    werkingKop: { kop: "Hoe dit apparaat", accent: "je huid in beeld brengt" },
    techniek: [
      "De EVE-M legt je huid vast en meet. Je gezicht komt in een vaste houder, zodat de afstand en de hoek bij elke opname gelijk zijn, en de belichting komt uit het apparaat zelf en niet uit de kamer.",
      "Een telefoonfoto onder ander licht en vanaf een andere afstand kun je niet met een vorige vergelijken. Na acht weken weet je dan nog steeds niet of er iets veranderd is.",
      "Naast gewoon licht wordt er ook onder UV opgenomen. Pigment dat dieper in de huid zit is in gewoon licht nauwelijks te zien en onder UV wel, en juist die diepte bepaalt wat er mogelijk is. [MEDISCHE-CHECK-ROJDA]",
    ],
    foto: {
      src: "/images/shoot/apparaat-eve-m.jpg",
      alt: "Behandelaar plaatst een cliënt in de EVE-M huidscanner",
    },
    naam: "EVE-M",
    categorie: "meten",
    kort: "Het apparaat waarmee de huidtherapeut je huid vastlegt en meet, onder licht dat elke keer hetzelfde is.",
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
        zin: "Vast licht en een vaste afstand, elke keer hetzelfde, zodat opnames vergelijkbaar blijven.",
      },
      {
        kop: "Doorkijken",
        zin: "De camera leest verschillende lagen uit: pigment, vocht, poriën, structuur.",
      },
      {
        kop: "Vastleggen",
        zin: "Er ligt vast hoe je huid er vandaag uitzag. Dat is het vertrekpunt van je behandelplan.",
      },
    ],
  },
  {
    slug: "fotona",
    vragen: [
      {
        vraag: "Waarom zitten er twee lasers in één apparaat?",
        antwoord:
          "Omdat ze iets anders doen. De Er:YAG op 2940 nanometer wordt bijna volledig door water opgenomen en blijft daardoor aan de oppervlakte; de Nd:YAG op 1064 nanometer komt veel dieper. Samen dekken ze een bereik dat één laser niet haalt.",
      },
      {
        vraag: "Wat is SMOOTH-modus?",
        antwoord:
          "Een manier om de Er:YAG aan te sturen waarbij de energie in een reeks trage pulsen komt in plaats van één harde. Het weefsel warmt daardoor op zonder dat de opperhuid wordt weggenomen: het wordt verwarmd en niet verdampt. [MEDISCHE-CHECK-ROJDA]",
      },
      {
        vraag: "Is dit hetzelfde apparaat als bij NightLase?",
        antwoord:
          "Ja, en dezelfde modus. Alleen de plek verschilt: bij NightLase gaat het over het zachte gehemelte en niet over de huid van je gezicht.",
      },
      {
        vraag: "Voel ik er iets van?",
        antwoord:
          "Je voelt warmte die langzaam oploopt. De behandelaar vraagt er tijdens de sessie naar en stelt het apparaat bij op jouw antwoord.",
      },
    ],
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
    kort: "Een laser die op meerdere dieptes werkt. Hij draagt de behandelingen 4D, SmoothEye, LipLase, VectorLift en NightLase.",
    wat: "Een laserplatform dat huidveroudering op meerdere niveaus aanpakt: van binnenuit door de mondholte en van buitenaf over de huid. Elke behandeling op dit apparaat mikt op één ding, en daarom er meerdere namen op staan. [MEDISCHE-CHECK-ROJDA]",
    waarvoor: [
      "Verslapping en volumeverlies aanpakken zonder injectables",
      "Gericht werken rond de ogen, de lippen of de kaaklijn",
      "Laserpeel en fractionele behandeling van de huid",
      "Snurken behandelen met NightLase, de enige toepassing waarbij dit apparaat op het gehemelte werkt",
    ],
    nietVoor: [
      "Haargroei. Daar staat een ander apparaat voor",
      "Werken op een gebruinde huid [MEDISCHE-CHECK-ROJDA]",
      "Eén sessie met blijvend resultaat; het is altijd een reeks",
    ],
    /* Alle behandelingen die op dit apparaat draaien. Dit veld voedt zowel
       "Hierop draait" hier als "Draait op" op elke behandelpagina, dus beide
       richtingen komen uit dezelfde bron. */
    behandelingen: [
      "fotona",
      "fotona-4d",
      "fotona-4d-men",
      "smoothliftin",
      "frac3",
      "piano",
      "superficial-peel",
      "smootheye",
      "liplase",
      "vectorlift",
      "fotona-acne-control",
      "fotona-scar-repair",
      "fotona-resurfacing",
      "hairestart",
      "nightlase",
    ],

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
        apparaat: "precision-photonic-system",
        verschil:
          "Werkt met licht dat de huid opneemt om tot rust te komen. De Fotona werkt met warmte die weefsel aanzet tot opbouw.",
      },
    ],
  },
  {
    slug: "gentle-laser-pro-u",
    vragen: [
      {
        vraag: "Waarom deze laser en niet de Nordlys?",
        antwoord:
          "De alexandriet op 755 nanometer wordt sterk opgenomen door het pigment in een haar, en dat maakt hem gericht op de haarwortel. De Nordlys werkt met een band in plaats van één golflengte en is daardoor breder maar minder precies op haar. Welke je krijgt hangt af van je huidtype en de zone. [MEDISCHE-CHECK-ROJDA]",
      },
      {
        vraag: "Wat doet die koeling precies?",
        antwoord:
          "Vlak voor en na elke puls spuit het apparaat een stoot cryogeen op je huid. Daardoor koelt de bovenste laag terug terwijl de warmte in de haarwortel blijft zitten. Je voelt het als een koude tik om de warme puls heen.",
      },
      {
        vraag: "Waarom voelt het op mijn bovenlip anders dan op mijn benen?",
        antwoord:
          "De spotgrootte en de pulsduur worden per zone gekozen, en de huid is niet overal even dik of even gevoelig. Op een kleine, gevoelige zone gaat de behandelaar met een andere instelling te werk dan op een groot vlak. [MEDISCHE-CHECK-ROJDA]",
      },
      {
        vraag: "Kan dit bij een donkere huid?",
        antwoord:
          "Dat hangt af van de instelling. Bij meer pigment in de huid is de marge kleiner, dus beoordeelt de behandelaar het vooraf. Is het niet verantwoord, dan doen we het niet. [MEDISCHE-CHECK-ROJDA]",
      },
    ],
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
    kort: "De laser die we voor ontharing gebruiken. Hij mikt op het pigment in de haarwortel, en de huid eromheen wordt gekoeld.",
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
        apparaat: "precision-photonic-system",
        verschil:
          "Werkt met licht op de huid zelf. Deze laser werkt op de haarwortel: twee verschillende doelen.",
      },
    ],
  },
  {
    slug: "nordlys-ipl",
    vragen: [
      {
        vraag: "Is IPL hetzelfde als laser?",
        antwoord:
          "Nee. Een laser zendt één golflengte uit, IPL een band. Die band raakt daardoor meerdere dingen tegelijk — roodheid, vaatjes en oppervlakkig pigment — en komt gemiddeld minder diep.",
      },
      {
        vraag: "Waarom wordt een vlek eerst donkerder?",
        antwoord:
          "Dat hoort erbij. Het pigment komt naar de oppervlakte voordat het vervaagt, en dat duurt een aantal dagen. Het betekent niet dat het erger wordt. [MEDISCHE-CHECK-ROJDA]",
      },
      {
        vraag: "Wat bepaalt welke applicator ik krijg?",
        antwoord:
          "Waar de behandeling op gericht is. Voor pigment kiest de behandelaar een andere band dan voor haargroei; daarom zijn er meerdere.",
      },
      {
        vraag: "Kan dit ook op mijn benen of rug?",
        antwoord:
          "IPL werkt over een groot vlak en dat is juist zijn sterke kant. Of het bij jouw klacht past hangt af van wat er zit en hoe diep. [MEDISCHE-CHECK-ROJDA]",
      },
    ],
    techniek: [
      "De Nordlys van Candela is geen laser maar IPL: intens gepulst licht. Een laser zendt één golflengte uit, IPL een band. Candela noemt zijn variant Selective Waveband Technology: twee filters knippen boven- en onderkant van het spectrum weg, zodat er een smallere band overblijft dan bij gewone IPL, met pulsen korter dan een milliseconde.",
      "Welke band er uit komt hangt af van de applicator. De fabrikant levert er meerdere, van 530 tot 750 nanometer voor pigment tot 645 tot 950 nanometer voor haargroei. Elke band is gekozen rond wat hij moet raken: hemoglobine in een vaatje, melanine in een vlek. [GEGEVEN-NODIG: welke applicators hier in de kast liggen, Okan]",
      "Op hetzelfde platform kan ook een Nd:YAG op 1064 nanometer draaien, en fractionele lasers op 1550 en 1940 nanometer. Die komen dieper dan het IPL-licht en doen ander werk.",
    ],
    foto: {
      src: "/images/shoot/apparaat-nordlys.jpg",
      alt: "De Nordlys van Candela met de handstukken in de houder",
    },
    naam: "Nordlys",
    merk: "Candela",
    categorie: "licht",
    kort: "IPL werkt met een bereik aan golflengtes in plaats van één. Daardoor is hij breed inzetbaar en komt hij minder diep dan een laser.",
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
        apparaat: "precision-photonic-system",
        verschil:
          "Werkt met licht dat de huid kalmeert. De Nordlys mikt op het rood in bloed en werkt daarvoor met warmte.",
      },
    ],
  },
  {
    slug: "precision-photonic-system",
    vragen: [
      {
        vraag: "Voel ik hier iets van?",
        antwoord:
          "Weinig. Er komt licht op lage sterkte en hooguit merk je milde warmte. De meeste mensen vinden het het rustigste kwartier van hun week.",
      },
      {
        vraag: "Waarom verschillende kleuren?",
        antwoord:
          "Elke golflengte komt tot een andere diepte. Blauw blijft in de bovenste lagen, rood komt tot in de lederhuid en nabij-infrarood komt het verst, omdat die kleur het minst door de huid wordt tegengehouden. [MEDISCHE-CHECK-ROJDA]",
      },
      {
        vraag: "Werkt dit op zichzelf?",
        antwoord:
          "Bij roodheid en rosacea plannen mensen het als losse reeks. Verder zetten we het in naast een andere behandeling, waar het de huid tot rust brengt en het herstel ondersteunt. [MEDISCHE-CHECK-ROJDA]",
      },
      {
        vraag: "Is er hersteltijd?",
        antwoord:
          "Nee. Je gaat er direct mee de deur uit en gewoon door met je dag.",
      },
      {
        vraag: "Hoe vaak moet ik komen?",
        antwoord:
          "Licht werkt cumulatief, dus het verschil ontstaat over een reeks met een paar dagen tot een week ertussen. Hoeveel sessies dat zijn hoor je na de huidanalyse. [MEDISCHE-CHECK-ROJDA]",
      },
    ],
    techniek: [
      "LED werkt anders dan een laser of IPL. Die verwarmen een doelwit in de huid, pigment of een vaatje of water, en het resultaat komt uit het herstel dat daarop volgt. LED verwarmt niets: het licht wordt door de huid opgenomen en doet zijn werk in de cel zelf.",
      "In elke cel zitten mitochondriën, de onderdelen die energie leveren. Licht van bepaalde golflengtes wordt daar opgenomen, waarna de cel meer energie beschikbaar heeft voor herstel en aanmaak. Die werking heet fotobiomodulatie. [MEDISCHE-CHECK-ROJDA]",
      "De kleuren die in de vakliteratuur het meest onderzocht zijn liggen rond 415 nanometer (blauw), 633 nanometer (rood) en 830 nanometer (nabij-infrarood). Blauw blijft in de bovenste lagen en wordt ingezet bij onzuiverheden. Rood komt tot in de lederhuid, waar het bindweefsel zit. Nabij-infrarood komt het verst, omdat die golflengte het minst door de huid wordt tegengehouden. [MEDISCHE-CHECK-ROJDA]",
      "De huid blijft intact, dus er is niets dat hoeft te herstellen: geen roodheid, geen wachttijd en geen instructies voor thuis. Juist daarom past het direct na een behandeling die de huid wél prikkelt, zoals microneedling of een peeling.",
      "Het werkt cumulatief. Eén sessie is één prikkel; het verschil ontstaat over een reeks, met een paar dagen tot een week ertussen. De behandelaar kiest de golflengte en de tijd op basis van wat er uit de huidanalyse kwam. [MEDISCHE-CHECK-ROJDA]",
    ],
    foto: {
      src: "/images/shoot/apparaat-precision-photonic-system.jpg",
      alt: "Behandelaar bedient het Precision Photonic System boven het gezicht van een client",
    },
    naam: "Precision Photonic System",
    merk: "Skin Complete",
    merkUrl: "https://skincomplete.eu",
    categorie: "licht",
    kort: "LED-licht in meerdere golflengtes, elk met een eigen diepte in de huid. Zonder naalden, zuren of hersteltijd.",
    wat: "Het LED-systeem van Skin Complete waar wij mee werken. Het licht wordt door de huid opgenomen en ondersteunt daar het herstel; de behandelaar kiest de golflengte en de tijd op basis van de huidanalyse. Meestal aansluitend op een andere behandeling, en bij roodheid of rosacea ook als losse reeks. [MEDISCHE-CHECK-ROJDA]",
    waarvoor: [
      "Roodheid en rosacea rustiger maken [MEDISCHE-CHECK-ROJDA]",
      "Het herstel na needling of een peeling ondersteunen",
      "Toevoegen aan een behandeling zonder extra hersteltijd",
    ],
    nietVoor: [
      "Voor pigment of haargroei kies je laser of IPL",
      "Voor structuur en littekens werkt microneedling dieper",
      "Licht werkt door herhaling, dus je plant een reeks",
    ],
    behandelingen: ["led-therapie"],

    werkwijze: "licht",
    doelwit: "licht",
    diepte: 25,
    fasen: [
      {
        kop: "Golflengte gekozen",
        zin: "De behandelaar stelt de kleur in die bij je huid en het doel van de sessie hoort.",
      },
      {
        kop: "Onder de boog",
        zin: "Je krijgt een bril op en het paneel hangt op een handbreedte boven je gezicht.",
      },
      {
        kop: "Vaste tijd",
        zin: "De sessie loopt op een ingestelde tijd; daarna ga je direct door met je dag.",
      },
    ],
    verschilMet: [
      {
        apparaat: "nordlys-ipl",
        verschil:
          "Mikt op de vaatjes zelf en werkt met warmte. Het Precision Photonic System werkt met licht dat de huid opneemt, en heeft daarom geen hersteltijd.",
      },
      {
        apparaat: "fotona",
        verschil:
          "Breekt weefsel af om herstel uit te lokken. LED werkt zachter: licht dat de huid kalmeert en het herstel ondersteunt.",
      },
    ],
  },
  {
    slug: "hydrafacial-syndeo",
    vragen: [
      {
        vraag: "Wat maakt dit anders dan een gewone gezichtsbehandeling?",
        antwoord:
          "De combinatie in één beweging. In het mondstuk zit een spiraal waar tegelijk onderdruk op staat en vloeistof doorheen loopt: losmaken, wegzuigen en inbrengen gebeuren in dezelfde doorgang.",
      },
      {
        vraag: "Blijft het resultaat?",
        antwoord:
          "Nee, dit is een onderhoudsbehandeling. Hij werkt in de hoornlaag en die vernieuwt zichzelf, dus het effect is tijdelijk. [MEDISCHE-CHECK-ROJDA]",
      },
      {
        vraag: "Waarom zijn er verschillende tips?",
        antwoord:
          "Ze verschillen in hoe grof de spiraal is. Welke er gebruikt wordt hangt af van je huid en van het doel; de tips zijn wegwerpartikelen en gaan per behandeling.",
      },
      {
        vraag: "Kan dit bij een gevoelige huid?",
        antwoord:
          "Vaak wel, want er komen geen zuren aan te pas en het blijft aan de oppervlakte. Of het bij jou past bepaalt de meting. [MEDISCHE-CHECK-ROJDA]",
      },
    ],
    techniek: [
      "Het werkzame deel is het mondstuk, niet de kast. In de tip zit een spiraalvormig kanaal waar tegelijk onderdruk op staat en vloeistof doorheen loopt. Die twee samen maken een wervelende beweging over de huid: losgemaakte cellen en poriëninhoud gaan mee naar buiten, door een zijkanaal naar een opvangbak, terwijl er via hetzelfde kanaal serum naar binnen gaat.",
      "Dat heet Vortex-Fusion: reinigen, losmaken, wegzuigen en inbrengen gebeuren in dezelfde doorgang, met één hand.",
      "De tips zijn wegwerpartikelen en er zijn verschillende soorten, met een grovere of fijnere spiraal. Welke er gebruikt wordt hangt af van je huid en het doel van de behandeling.",
    ],
    foto: {
      src: "/images/shoot/apparaat-hydrafacial.jpg",
      alt: "Het HydraFacial-handstuk op de huid, met het apparaat op de achtergrond",
    },
    naam: "Hydrafacial syndeo",
    merk: "HydraFacial",
    categorie: "overig",
    kort: "Reinigen, exfoliëren, poriën leegzuigen en voeden gebeuren hier in één doorgang, met hetzelfde handstuk.",
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
    vragen: [
      {
        vraag: "Wat is het verschil met de Dermapen?",
        antwoord:
          "Het motorontwerp en het aantal naalden. De SkinPen heeft er veertien en werkt iets bedaarder; de Dermapen haalt meer prikken per seconde. Het diepteberereik is bij allebei 0,25 tot 3 millimeter.",
      },
      {
        vraag: "Waarom is de diepte zo belangrijk?",
        antwoord:
          "Omdat die bepaalt in welke laag het kanaaltje eindigt. Ondiep raakt de opperhuid en heelt binnen een dag; drie millimeter komt in het bindweefsel en vraagt langer. [MEDISCHE-CHECK-ROJDA]",
      },
      {
        vraag: "Zijn de naalden per persoon?",
        antwoord:
          "Ja. De cartridges zijn steriel en voor eenmalig gebruik. Bij microneedling is dat geen detail: de naalden gaan door de huidbarrière heen, en daar was die barrière voor.",
      },
      {
        vraag: "Doet het pijn?",
        antwoord:
          "Er gaat vooraf een verdovende crème op die een half uur intrekt. Wat je daarna voelt is een trilling en druk, het sterkst waar de huid dun over bot ligt.",
      },
    ],
    techniek: [
      "Een microneedling-pen zet een cartridge met naalden in een snelle op-en-neerbeweging. De SkinPen heeft er veertien, en de diepte is instelbaar van een kwart millimeter tot drie millimeter. Dat bereik loopt van net door de hoornlaag tot in het bindweefsel.",
      "De diepte is de enige instelling die er echt toe doet, want die bepaalt in welke laag het kanaaltje eindigt. Ondiep raakt de opperhuid en heelt binnen een dag; drie millimeter komt in de laag waar bindweefsel wordt aangemaakt en vraagt langer. [MEDISCHE-CHECK-ROJDA]",
      "De cartridges zijn steriel en voor eenmalig gebruik. Bij microneedling gaan de naalden door de huidbarrière heen, dus dat luistert nauw.",
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
    vragen: [
      {
        vraag: "Waarom deze pen en niet de SkinPen?",
        antwoord:
          "Dat hangt af van de zone en de diepte die daar past, niet van welke beter is. De Dermapen werkt sneller een vlak af en heeft voorgeprogrammeerde standen, waaronder een litteken-instelling op de maximale diepte. [MEDISCHE-CHECK-ROJDA]",
      },
      {
        vraag: "Wat betekent 1920 prikken per seconde?",
        antwoord:
          "Dat het apparaat een vlak snel afwerkt met kleine, gelijke kanaaltjes. Sneller is hier niet dieper: de diepte stel je apart in.",
      },
      {
        vraag: "Wordt de diepte per zone aangepast?",
        antwoord:
          "Ja. Rond je ogen en op je voorhoofd gaat hij ondieper dan op je wangen, want daar ligt de huid dun over bot. Dat merk je ook: hoe dieper, hoe meer druk.",
      },
      {
        vraag: "Hoe lang ben ik rood?",
        antwoord:
          "Een tot drie dagen, ongeveer als een stevige zonnegloed. De eerste vierentwintig uur laat je je huid met rust. [MEDISCHE-CHECK-ROJDA]",
      },
    ],
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
    kort: "Microneedling met trillende naaldjes. Hetzelfde principe als de SkinPen, met een ander motorontwerp en meer prikken per seconde.",
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
    vragen: [
      {
        vraag: "Wat doet dit apparaat precies?",
        antwoord:
          "Het brengt vloeistof op een ingestelde diepte in de huid, tussen één en tien millimeter, tot acht keer per seconde. Het is een injector en geen apparaat dat op de huid werkt.",
      },
      {
        vraag: "Waarom niet gewoon met de hand injecteren?",
        antwoord:
          "Omdat alleen de naald beweegt en de spuit stilstaat. Daardoor trilt er minder en is de diepte van prik tot prik gelijk, ook als er een paar honderd achter elkaar gaan.",
      },
      {
        vraag: "Wat zit er in de spuit?",
        antwoord:
          "Dat bepaalt de behandeling en niet het apparaat. Het kan een skinbooster zijn of een mesotherapie-mengsel, en die keuze hoort bij de behandelaar. [MEDISCHE-CHECK-ROJDA]",
      },
      {
        vraag: "Zie ik er daarna uit alsof ik geprikt ben?",
        antwoord:
          "Vlak erna zie je kleine bultjes op de plek van elke prik; die zakken doorgaans binnen een dag. Blauwe plekjes kunnen, vooral rond de ogen, en die duren langer.",
      },
    ],
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
    slug: "dermaplane-pro",
    vragen: [
      {
        vraag: "Wordt mijn haar dikker terug?",
        antwoord:
          "Nee. Scheren verandert de haarschacht niet, alleen het uiteinde. Een recht afgesneden punt voelt de eerste dagen stugger dan een punt die nog nooit geknipt is.",
      },
      {
        vraag: "Snijdt het mesje in mijn huid?",
        antwoord:
          "Nee, het schraapt over het oppervlak onder een vaste hoek. Wat eraf gaat zijn dode cellen uit de hoornlaag en de donshaartjes die daarin vastzitten.",
      },
      {
        vraag: "Kan dit bij een gevoelige huid?",
        antwoord:
          "Vaak wel, want er komen geen zuren aan te pas. Bij actieve ontstekingen of een beschadigde barrière doen we het niet. [MEDISCHE-CHECK-ROJDA]",
      },
      {
        vraag: "Waarom neemt mijn crème daarna beter op?",
        antwoord:
          "Omdat de laag dode cellen eraf is die er anders tussen zit. Dat effect is tijdelijk en duurt zolang die laag zich niet heeft hersteld.",
      },
    ],
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
          "Combineert losmaken met zuigen en inbrengen. Dermaplaning richt zich op het losmaken alleen, en geeft daarmee direct een gladde huid.",
      },
    ],
  },
  {
    slug: "peelinglijnen",
    soort: "productlijn",
    vragen: [
      {
        vraag: "Waarom staat hier geen apparaat?",
        antwoord:
          "Omdat een peeling er geen is. Dit is een vloeistof, en wat hij doet hangt af van het zuur, de concentratie en de zuurgraad van het mengsel.",
      },
      {
        vraag: "Wat bepaalt hoe diep een peeling komt?",
        antwoord:
          "Die drie samen. Fruitzuren blijven in de hoornlaag, salicylzuur lost op in vet en komt daardoor de porie in, en sterkere mengsels gaan tot in de opperhuid.",
      },
      {
        vraag: "Ga ik vervellen?",
        antwoord:
          "Bij een lichte peeling meestal niet, bij een sterkere wel. Dat hoor je vooraf, want het bepaalt wanneer je dit het beste inplant. [MEDISCHE-CHECK-ROJDA]",
      },
      {
        vraag: "Kan dit in de zomer?",
        antwoord:
          "Bij pigment liever niet, en bij de sterkere lijnen ook niet. Zon na een peeling is precies de combinatie die het resultaat kost. [MEDISCHE-CHECK-ROJDA]",
      },
    ],
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
    kort: "Geen apparaat maar vier merken peelings, in drie niveaus van sterkte. Welke er past, hangt af van je huid op dat moment.",
    wat: "De kliniek werkt met peelings van Skin Tech Pharma, Image Skincare, ADO en Mesoestetic, in drie niveaus. Welke er gekozen wordt hangt af van hoe je huid er op dat moment voor staat. De inwerktijd wordt daarop afgemeten: te lang is niet beter maar schadelijker. [MEDISCHE-CHECK-ROJDA]",
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
        zin: "De inwerktijd wordt op je huid afgemeten. Langer laten zitten geeft geen beter resultaat.",
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
