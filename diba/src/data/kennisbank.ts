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

import { LANDINGS, landingNaam } from "@/data/landings";
import type { Landing } from "@/data/landings/types";

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

/**
 * De landingspagina's, uitgesplitst naar waar ze horen.
 *
 * De plaatspagina's gaan over een behandeling bij ons in Rotterdam en staan bovenaan. De
 * vraagpagina's gaan over de vraag die daaraan voorafgaat en horen bij elkaar, op één na:
 * "hoe kies je een huidkliniek" gaat niet over behandelen maar over kiezen, en dat is
 * precies het hoofdstuk onderaan. Vandaar deze ene naam als uitzondering en niet als
 * veld in de data: het is een plek in deze index, geen eigenschap van de pagina.
 */
const PLAATS = LANDINGS.filter((l) => (l.soort ?? "plaats") === "plaats");
const VRAAG = LANDINGS.filter((l) => l.soort === "vraag");
const BEOORDELEN = new Set(["huidkliniek-kiezen"]);

const alsStuk = (l: Landing): Kennisstuk => ({
  id: l.slug,
  vraag: l.kaart.vraag,
  naam: landingNaam(l),
  zin: l.kaart.zin,
  href: `/kennisbank/${l.slug}`,
});

export const KENNISBANK: readonly Kennisgroep[] = [
  {
    id: "in-rotterdam",
    tint: "zacht",
    kop: "Een behandeling bij ons in Rotterdam",
    zin: "Wat een behandeling hier inhoudt en kost, voor wie hij past en hoe een afspraak verloopt, en wat een huidtherapeut eigenlijk doet. Dit zijn de pagina's van de kennisbank die over onze kliniek zelf gaan.",
    /* Uit het register van de landingspagina's, zodat een nieuwe pagina hier vanzelf
       verschijnt. Dit is ook de enige plek op de site die naar al die pagina's tegelijk
       wijst, en daarom staat de groep bovenaan: een verwijzing hoger op een pagina telt
       zwaarder. */
    stukken: PLAATS.map(alsStuk),
  },
  {
    id: "elke-behandeling",
    tint: "wit",
    kop: "Wat voor elke behandeling geldt",
    zin: "Vier vragen die niet over één behandeling gaan maar over allemaal: je huidtype, het aantal sessies, de zon en de zwangerschap.",
    stukken: VRAAG.filter((l) => !BEOORDELEN.has(l.slug)).map(alsStuk),
  },
  {
    id: "beginnen",
    tint: "mint",
    kop: "Weet je nog niet waar je moet beginnen",
    zin: "Twee ingangen, afhankelijk van of je al een naam hebt voor wat je ziet.",
    /* Deze groep stond hier leeg, met kop en al. Een hoofdstuk zonder inhoud belooft
       iets wat er niet is, en dat is precies waarom deze pagina bestaat. Het zijn de
       twee ingangen die de kop noemt. */
    stukken: [
      {
        id: "symptoomzoeker",
        vraag: "Ik weet niet hoe het heet",
        naam: "Symptoomzoeker",
        zin: "Je klikt aan wat je ziet en waar het zit, en komt uit bij de pagina die erover gaat.",
        href: "/huidproblemen/symptoomzoeker",
      },
      {
        id: "huidprofiel",
        vraag: "Wat geef ik vooraf door",
        naam: "Je huidprofiel",
        zin: "Negen korte vragen over je huid, je medicatie en je grenzen. De uitkomst neem je mee naar de afspraak.",
        href: "/huidprofiel",
      },
    ],
  },
  {
    id: "beoordelen",
    tint: "zacht",
    kop: "Zelf beoordelen wat je voorgeschoteld krijgt",
    zin: "Ook bij een andere kliniek. Dit deel is niet geschreven om jou hier te houden.",
    stukken: [
      ...VRAAG.filter((l) => BEOORDELEN.has(l.slug)).map(alsStuk),
      {
        id: "kwaliteit",
        vraag: "Waar mag ik jullie aan houden",
        naam: "Kwaliteit en registraties",
        zin: "Bij welke registers we horen, wat dat inhoudt en hoe je het zelf nakijkt.",
        href: "/kwaliteit-en-registraties",
      },
    ],
  },
];
