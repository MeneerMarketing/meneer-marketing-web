import { kostenVraag } from "@/data/pillar-kosten";

/**
 * Inhoud van de pagina over keratosis pilaris, ofwel kippenvelhuid.
 *
 * WAAROM DEZE PAGINA BESTAAT.
 *
 * Omdat het veel voorkomt, mensen er jaren mee rondlopen zonder de naam te kennen, en de
 * zoektermen die ze gebruiken nergens op deze site stonden: kippenvelhuid, aardbeienhuid,
 * bultjes op mijn bovenarmen.
 *
 * WAT DEZE PAGINA MOEILIJK MAAKT, EN JUIST GOED.
 *
 * Er is geen genezing. Keratosis pilaris is grotendeels erfelijk, het is onschuldig, en het
 * gaat bij veel mensen vanzelf minder worden met de jaren. Wat er wel kan is de huid
 * geleidelijk soepeler maken, met onderhoud dat je zelf volhoudt.
 *
 * Dat is een verhaal dat niet verkoopt, en precies daarom moet het hier staan. Een kliniek
 * die hier een reeks van zes tegenover zet, verkoopt hoop en levert een teleurstelling.
 * Wat wij hier verkopen is duidelijkheid, en dat scheelt mensen ook geld.
 *
 * DE VERGISSING DIE HET VAAKST GEMAAKT WORDT.
 *
 * Schuren. De huid voelt als schuurpapier, dus mensen gaan schuren, en dan wordt de
 * roodheid erger terwijl de bultjes blijven. De verhoorning zit rond het haarzakje en niet
 * op de oppervlakte, dus daar kom je er niet bij.
 *
 * MEDISCH.
 *
 * Alles wat een bewering doet is gemarkeerd voor Rojda.
 */

export type KpBeeld = {
  readonly id: string;
  readonly naam: string;
  readonly klanttaal: string;
  readonly vakterm: string;
  readonly zelfcheck: string;
  readonly watHetIs: string;
  readonly watWijDoen: string;
  readonly binnenBereik: boolean;
};

export const KP_BEELDEN: readonly KpBeeld[] = [
  {
    id: "klassiek",
    naam: "Ruwe bultjes op je bovenarmen",
    klanttaal: "Kippenvel dat niet weggaat, ook niet als je het warm hebt",
    vakterm: "keratosis pilaris",
    zelfcheck:
      "Voelt een groot vlak als schuurpapier, zitten de bultjes vlak bij elkaar, en zit het aan beide armen ongeveer gelijk?",
    watHetIs:
      "Verhoorning rond de haarzakjes: er vormt zich een propje hoorncellen boven elk haartje. Onschuldig, grotendeels erfelijk, en het wordt bij veel mensen met de jaren minder. [MEDISCHE-CHECK-ROJDA]",
    watWijDoen:
      "De bovenlaag geleidelijk soepeler maken en de propjes losser, in een tempo dat je huid aankan. Onderhoud hoort erbij; dit is geen kuur met een eindpunt.",
    binnenBereik: true,
  },
  {
    id: "rood",
    naam: "Rode wangen met kleine bultjes",
    klanttaal: "Een blijvend rode blos op de wangen, vaak vanaf de kindertijd",
    vakterm: "keratosis pilaris rubra faciei",
    zelfcheck:
      "Zit de roodheid op de wangen of langs de kaaklijn, met minieme bultjes erin, en is dat er al zolang je je kunt herinneren?",
    watHetIs:
      "Dezelfde verhoorning, maar in het gezicht en met meer roodheid eromheen. Het wordt vaak aangezien voor acne of rosacea en is geen van beide. [MEDISCHE-CHECK-ROJDA]",
    watWijDoen:
      "Voorzichtiger dan op een arm, want gezichtshuid reageert sterker. Eerst de roodheid, dan pas de structuur.",
    binnenBereik: true,
  },
  {
    id: "droog",
    naam: "Ruw door droogte",
    klanttaal:
      "Een schrale, ruwe huid die 's winters erger is en 's zomers weg",
    vakterm: "xerosis",
    zelfcheck:
      "Voelt het ruw zonder dat je losse bultjes voelt, en verdwijnt het grotendeels als je een tijd goed insmeert?",
    watHetIs:
      "Een droge huid en geen verhoorning rond de haarzakjes. Dit lijkt erop en vraagt om iets veel eenvoudigers. [MEDISCHE-CHECK-ROJDA]",
    watWijDoen:
      "Niets ingrijpends. De barrière herstellen en volhouden; als het daarvan weggaat was het dit.",
    binnenBereik: false,
  },
  {
    id: "haren",
    naam: "Bultjes met een haar erin",
    klanttaal:
      "Bultjes op plekken die je scheert, met soms een donkere krul erin",
    vakterm: "pseudofolliculitis",
    zelfcheck:
      "Zitten de bultjes vooral op geschoren zones, en zie je bij fel licht een donkere lus onder het velletje?",
    watHetIs:
      "Ingegroeide haren, en geen keratosis pilaris. Het onderscheid zit in de plek en in de vraag of er een haar in zit. [MEDISCHE-CHECK-ROJDA]",
    watWijDoen:
      "Dat is een ander verhaal met een andere behandeling, en daar is een eigen pagina voor.",
    binnenBereik: false,
  },
];

/**
 * De schuurpapiertest.
 *
 * Twee vragen die het onderscheid maken tussen verhoorning en droogte, en tegelijk het
 * belangrijkste advies bevatten: niet schuren. De verhoorning zit rond het haarzakje en
 * niet aan de oppervlakte, dus schuren maakt de roodheid erger zonder een bultje te raken.
 */
export const CONSULT_BEOORDELING: readonly {
  readonly kop: string;
  readonly tekst: string;
}[] = [
  {
    kop: "Hoe de bultjes aanvoelen",
    tekst:
      "Verhoorning voelt als fijn schuurpapier en zit vast in de porie. Droogte voelt ruw, maar laat zich wegwrijven.",
  },
  {
    kop: "Of het aan beide kanten zit",
    tekst:
      "Keratosis pilaris is vrijwel altijd symmetrisch. Zit het aan een kant of op geschoren zones, dan is het iets anders.",
  },
  {
    kop: "Hoe het door het jaar loopt",
    tekst:
      "In de winter duidelijker en in de zomer rustiger past bij verhoorning. Bij droogte verdwijnt het ’s zomers vrijwel.",
  },
];

export const KP_WEL_NIET = {
  wel: [
    "Eerlijk zeggen dat dit niet te genezen is, en wat er dan wel kan",
    "De bovenlaag geleidelijk soepeler maken, met een tempo dat de huid aankan",
    "Onderhoud dat je zelf volhoudt, want zonder dat komt het beeld terug",
    "De roodheid apart aanpakken, want die stoort vaak meer dan de bultjes zelf [MEDISCHE-CHECK-ROJDA]",
    "Meewegen dat het in de winter erger is; dat is geen terugval maar het seizoen [MEDISCHE-CHECK-ROJDA]",
  ],
  niet: [
    "Schuren. De propjes zitten rond het haarzakje en niet aan de oppervlakte; je maakt alleen de roodheid erger [MEDISCHE-CHECK-ROJDA]",
    "Uitknijpen of pulken. Daar houd je donkere vlekjes en soms kuiltjes aan over",
    "Een kuur als definitieve oplossing presenteren Keratosis pilaris vraagt meestal om blijvende verzorging en onderhoud.",
    "Beloven dat de huid glad wordt. Soepeler en minder rood is realistisch [MEDISCHE-CHECK-ROJDA]",
    "Het behandelen als acne. Er zit geen ontsteking en geen bacterie in [MEDISCHE-CHECK-ROJDA]",
  ],
} as const;

export const KP_WIJ_DOEN_NIET = [
  {
    titel: "Geen kuur met een belofte van gladde huid",
    tekst:
      "Keratosis pilaris is grotendeels erfelijk en niet te genezen. Wat wij kunnen is de huid soepeler en de roodheid minder maken, met onderhoud erbij. Wie hier een reeks van zes tegenover zet verkoopt hoop en levert een teleurstelling. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    titel: "Geen behandeling als het gewoon droogte is",
    tekst:
      "Verdwijnt het grotendeels als je een paar weken goed insmeert, dan was het geen verhoorning. Dan is er niets te behandelen en heb je een tube nodig en geen afspraak.",
  },
];

export const KP_FAQ = [
  {
    vraag: "Gaat kippenvelhuid ooit weg?",
    antwoord:
      "Genezen kan niet, maar bij veel mensen wordt het met de jaren vanzelf minder, vaak vanaf een jaar of dertig. In de tussentijd is het beeld wel te verzachten. Dat is geen mooi verhaal, en het is wel het eerlijke. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Waarom werkt scrubben niet?",
    antwoord:
      "Omdat de verhoorning rond het haarzakje zit en niet op de oppervlakte. Je schuurt dus over de bultjes heen in plaats van erin. Wat je wel bereikt is meer roodheid en een beschadigde barrière. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Komt het door iets dat ik doe?",
    antwoord:
      "Nee. Het is grotendeels erfelijk en het heeft niets te maken met hygiëne, voeding of hoe je je huid verzorgt. Dat is voor veel mensen de nuttigste zin op deze pagina. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Waarom is het 's winters erger?",
    antwoord:
      "Koude lucht en binnenverwarming drogen de huid uit, en een drogere huid maakt de verhoorning zichtbaarder en ruwer. Bij bijna iedereen is het in de zomer minder. Dat is het seizoen en geen terugval. [MEDISCHE-CHECK-ROJDA]",
  },
  kostenVraag(),
];
