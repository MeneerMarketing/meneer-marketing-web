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
 * staan eigen uitlegstukken verspreid over de site: een doorsnede die je door de vier
 * acnestadia klikt, een golflengtevenster, een dieptevergelijker. Wie er niet toevallig op
 * de goede pagina belandt, ziet er geen enkele van.
 *
 * Het blok "Dingen die je zelf kunt nakijken" stond hier ook. Dat is weg: de tests waar het
 * naar wees bestaan niet meer, en het was de laatste plek op de site die de bezoeker
 * huiswerk aanbood in plaats van hem uit te nodigen.
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
    stukken: [],
  },
  {
    id: "beoordelen",
    tint: "wit",
    kop: "Zelf beoordelen wat je voorgeschoteld krijgt",
    zin: "Ook bij een andere kliniek. Dit deel is niet geschreven om jou hier te houden.",
    stukken: [
      {
        id: "verbond",
        vraag: "Waar mag ik jullie aan houden",
        naam: "Ons verbond",
        zin: "Tien dingen die wij niet doen, met bij elke regel wat hij ons kost. Een belofte zonder prijs is een slogan.",
        href: "/ons-verbond",
      },
    ],
  },
];
