/**
 * De kennisbank: een index van wat er op deze site uitgelegd staat.
 *
 * WAAROM DIT GEEN ARTIKELEN ZIJN.
 *
 * De homepage had een sectie "Diba kennisbank · Eerlijke huidkennis" met drie kaarten die
 * eruitzagen als blogposts. Ze linkten naar bestaande pagina's met een heel andere titel,
 * en "Bekijk alles" ging naar het huidprobleemoverzicht. Er was dus geen kennisbank; er was
 * een belofte dat er een was.
 *
 * Die belofte oplossen kan op twee manieren: artikelen gaan schrijven, of laten zien wat er
 * al is. Het eerste zou betekenen dat ik medische teksten verzin die Rojda nog moet
 * nakijken, terwijl deze site al zeventien huidprobleempagina's, twaalf apparaatpagina's en
 * eenentwintig behandelpagina's heeft die precies dat doen.
 *
 * Het echte probleem is niet dat er te weinig staat maar dat het niet te vinden is. Er
 * staan vijfentwintig eigen tools verspreid over de site: een doorsnede die je door de vier
 * acnestadia klikt, een glastest, een golflengtevenster, een dieptevergelijker. Wie er niet
 * toevallig op de goede pagina belandt, ziet er geen enkele van.
 *
 * Deze index is dus de kennisbank: geordend op de vraag die je stelt en niet op de
 * behandeling die wij verkopen.
 *
 * Elke omschrijving hieronder gaat over wat het ding dóet, niet over wat het oplevert. Er
 * staat geen enkele medische bewering in die nog niet ergens anders op de site staat en
 * daar al is gemarkeerd voor controle.
 */

export type Kennisstuk = {
  readonly id: string;
  /** Wat je ermee kunt, in de vorm van de vraag die je stelt. */
  readonly vraag: string;
  readonly naam: string;
  readonly zin: string;
  readonly href: string;
};

export type Kennisgroep = {
  readonly id: string;
  readonly kop: string;
  readonly zin: string;
  /**
   * De ondergrond van deze groep.
   *
   * Vijf groepen achter elkaar op hetzelfde vlak lezen als een lange lijst; de pagina was
   * van boven tot onder wit. Met een wisselende ondergrond wordt elke groep een hoofdstuk
   * dat je herkent zodra je erlangs scrolt, ook zonder de kop te lezen.
   *
   * Precies een van de vijf is donkergroen, en dat is de apparatuur: het enige deel dat
   * over techniek gaat in plaats van over jezelf. Samen met de afsluiter onderaan zijn dat
   * twee donkere vlakken, en dat is het maximum (§5).
   */
  readonly tint: "wit" | "mint" | "zacht" | "donker";
  readonly stukken: readonly Kennisstuk[];
};

export const KENNISBANK: readonly Kennisgroep[] = [
  {
    id: "beginnen",
    tint: "mint",
    kop: "Weet je nog niet waar je moet beginnen",
    zin: "Twee ingangen, afhankelijk van of je al een naam hebt voor wat je ziet.",
    stukken: [
      {
        id: "symptoomzoeker",
        vraag: "Ik weet niet hoe het heet",
        naam: "De symptoomzoeker",
        zin: "Kruis aan wat je ziet en wat je voelt, in gewone woorden. Aan het eind sta je op de pagina die erbij hoort.",
        href: "/huidproblemen/symptoomzoeker",
      },
      {
        id: "huidprofiel",
        vraag: "Ik weet het wel, en nu",
        naam: "Je huidprofiel",
        zin: "Negen stappen over je huid, je routine en wat je al probeerde. De site onthoudt je antwoorden en je neemt ze mee naar de intake.",
        href: "/huidprofiel",
      },
      {
        id: "isnodig",
        vraag: "Moet dit eigenlijk wel behandeld worden",
        naam: "De wachtweegschaal",
        zin: "Wat er gebeurt als je niets doet, naast wat er gebeurt als je wel behandelt. De vraag die een kliniek zelden zelf stelt.",
        href: "/is-het-nodig",
      },
    ],
  },
  {
    id: "onder-de-huid",
    tint: "wit",
    kop: "Wat er onder je huid gebeurt",
    zin: "Doorsnedes en schema's, geen foto's. Het probleem zit onder de oppervlakte en daar kijkt een foto niet.",
    stukken: [
      {
        id: "acne-stadia",
        vraag: "Waarom werkt harder schrobben niet",
        naam: "Onder je huid",
        zin: "Eén porie die je door vier stadia heen ziet dichtslibben. Bij elk stadium zit een andere knop.",
        href: "/huidproblemen/acne",
      },
      {
        id: "cellulitis",
        vraag: "Waarom kuiltjes en geen vet",
        naam: "De dwarsdoorsnede",
        zin: "Twee doorsnedes naast elkaar met dezelfde hoeveelheid vet, en het verschil zit in de richting van het bindweefsel.",
        href: "/huidproblemen/cellulitis",
      },
      {
        id: "droge-huid",
        vraag: "Is mijn huid droog of vochtarm",
        naam: "De huidmatrix",
        zin: "Twee assen in plaats van één schaal: water en vet. Dat verschil bepaalt wat er wel en niet helpt.",
        href: "/huidproblemen/droge-huid",
      },
      {
        id: "veroudering",
        vraag: "Hoeveel is zon en hoeveel is leeftijd",
        naam: "De onderarmtest",
        zin: "Een proef die je zelf kunt doen: de binnenkant van je onderarm tegen de buitenkant, met alles gelijk behalve de zon.",
        href: "/huidproblemen/huidveroudering",
      },
    ],
  },
  {
    id: "zelf-nakijken",
    tint: "zacht",
    kop: "Dingen die je zelf kunt nakijken",
    zin: "De symptoomzoeker stelt geen diagnose, maar helpt je om beter te beschrijven wat je aan de huid ziet.",
    stukken: [
      {
        id: "glastest",
        vraag: "Trekt deze uitslag weg als ik erop druk",
        naam: "De glastest",
        zin: "Wat het betekent als vlekjes wegtrekken onder druk en wat het betekent als ze blijven staan.",
        href: "/huidproblemen/huiduitslag",
      },
      {
        id: "spiegeltest",
        vraag: "Is het kleur of is het schaduw",
        naam: "De spiegeltest",
        zin: "Twee handelingen voor de spiegel die het verschil laten zien tussen pigment, vaatjes en een holte.",
        href: "/huidproblemen/donkere-kringen",
      },
      {
        id: "kleurwijzer",
        vraag: "Wat zegt de kleur van een vlek",
        naam: "De kleurwijzer",
        zin: "Bruin, rood, wit of grijs: welke kleur bij welke oorzaak past en wat dat betekent voor de behandeling.",
        href: "/huidproblemen/huidverkleuring",
      },
      {
        id: "triggers",
        vraag: "Waar reageert mijn rosacea op",
        naam: "De triggersorteerder",
        zin: "Sorteer wat jou opvalt van vaak naar zelden, zodat je bij de intake iets concreters hebt dan een gevoel.",
        href: "/huidproblemen/rosacea",
      },
      {
        id: "stapelteller",
        vraag: "Gebruik ik te veel tegelijk",
        naam: "De stapelteller",
        zin: "Tel op wat er in je routine zit en zie waar het gaat stapelen. Bij een gevoelige huid is dat vaker de oorzaak dan een product.",
        href: "/huidproblemen/gevoelige-huid",
      },
    ],
  },
  {
    id: "apparaten",
    tint: "donker",
    kop: "Hoe de apparatuur werkt",
    zin: "Niet wat een apparaat doet, maar hoe het zijn werk doet en tot hoe diep het komt.",
    stukken: [
      {
        id: "diepte",
        vraag: "Welk apparaat komt hoe diep",
        naam: "De dieptevergelijker",
        zin: "Alle twaalf apparaten op één schaal, in dezelfde doorsnede, zodat je ze naast elkaar kunt leggen.",
        href: "/apparatuur",
      },
      {
        id: "golflengte",
        vraag: "Waarom raakt laser wel het haar en niet de huid",
        naam: "Het golflengtevenster",
        zin: "Welke golflengte door welke stof wordt opgenomen, en waarom dat per huidtype anders uitpakt.",
        href: "/laserontharing",
      },
      {
        id: "configurator",
        vraag: "Wat kost mijn combinatie zones",
        naam: "De zoneconfigurator",
        zin: "Stel je eigen combinatie samen en zie het bedrag meelopen. Geen offerte op aanvraag.",
        href: "/laserontharing/configurator",
      },
    ],
  },
  {
    id: "beoordelen",
    tint: "wit",
    kop: "Zelf beoordelen wat je voorgeschoteld krijgt",
    zin: "Ook bij een andere kliniek. Dit deel is niet geschreven om jou hier te houden.",
    stukken: [
      {
        id: "fotocheck",
        vraag: "Klopt dit voor-en-na-beeld wel",
        naam: "De fotocheck",
        zin: "Zeven dingen die een resultaatfoto kunnen laten liegen: licht, hoek, afstand, houding en meer.",
        href: "/resultaten",
      },
      {
        id: "verbond",
        vraag: "Waar mag ik jullie aan houden",
        naam: "Ons verbond",
        zin: "Tien dingen die wij niet doen, met bij elke regel wat hij ons kost. Een belofte zonder prijs is een slogan.",
        href: "/ons-verbond",
      },
      {
        id: "niet",
        vraag: "Wat sturen jullie weg",
        naam: "Dit behandelen wij niet",
        zin: "Per klacht de reden waarom het hier niet gebeurt, en waar het dan wel thuishoort.",
        href: "/dit-behandelen-wij-niet",
      },
    ],
  },
];
