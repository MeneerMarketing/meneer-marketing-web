/**
 * Inhoud van de poriënpagina.
 *
 * De klinische waarheid die deze pagina eigen maakt: de doorsnede van een porie ligt
 * grotendeels vast. Je kunt hem niet kleiner maken, en iedereen die dat belooft rekent op
 * je hoop. Wat je wél kunt veranderen is wat erin zit, hoe strak de huid eromheen staat
 * en hoeveel de porie opvalt in het licht. Samen scheelt dat zichtbaar veel.
 *
 * Daarom is de knop "porie kleiner maken" op deze pagina een schakelaar die niet werkt.
 * Dat is geen grap maar het argument zelf, in de vorm van een stukje bediening.
 *
 * COPY-STATUS: concept in de Diba-stem. Medische beweringen gemarkeerd voor Rojda. Geen
 * percentages: geen belofte zonder meting (A7).
 */

import { kostenVraag } from "@/data/pillar-kosten";

export type Knop = {
  readonly id: "inhoud" | "spanning" | "talg";
  readonly label: string;
  readonly aanTekst: string;
  readonly uitTekst: string;
  readonly hoe: string;
};

export const KNOPPEN: readonly Knop[] = [
  {
    id: "inhoud",
    label: "Inhoud eruit",
    aanTekst: "De donkere kern is weg, dus de porie oogt meteen kleiner.",
    uitTekst:
      "Een gevulde porie leest als een donkere stip en lijkt daardoor groter.",
    hoe: "Reinigen dat bij jouw huid past, en waar nodig een behandeling die de porie leegt. Niet uitknijpen: dat maakt de opening juist wijder. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    id: "spanning",
    label: "Huid eromheen steviger",
    aanTekst:
      "De opening trekt rond in plaats van uitgerekt, en valt minder op.",
    uitTekst:
      "Bij minder stevige huid zakt de opening uit tot een druppelvorm, vooral op de wangen.",
    hoe: "Hier werken we aan de huid rondom de porie en niet aan de porie zelf. Dat is het verschil tussen minder zichtbaar en kleiner. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    id: "talg",
    label: "Minder glans erop",
    aanTekst:
      "Zonder glans werpt de rand geen schaduw meer en verdwijnt het reliëf.",
    uitTekst:
      "Een glanzend oppervlak zet elke porierand aan met een schaduwtje.",
    hoe: "Deels verzorging, deels behandeling. Dit is ook de reden dat je poriën op foto's met flits altijd erger lijken dan ze zijn.",
  },
] as const;

/** De vierde schakelaar. Die doet het niet, en dat is precies de boodschap. */
export const VIERDE_KNOP = {
  label: "Porie kleiner maken",
  waarom:
    "Deze knop bestaat niet. De doorsnede van een porie hangt samen met de talgklier eronder en ligt grotendeels vast in je aanleg. Geen crème, stoombeurt of laser maakt die opening blijvend nauwer. Wat hierboven staat werkt wel, en samen scheelt dat zichtbaar veel. [MEDISCHE-CHECK-ROJDA]",
} as const;

/** Wat je in de tekening ziet bij nul, één, twee of drie knoppen aan. */
export const UITKOMST = [
  {
    kop: "Zo ziet het eruit zonder iets",
    tekst:
      "Gevuld, uitgerekt en glanzend. Dit is het beeld waarmee mensen naar binnen lopen en waarvan ze denken dat de porie zelf te groot is.",
  },
  {
    kop: "Eén ding aangepakt",
    tekst:
      "Al zichtbaar rustiger. Wat opvalt is dat er nog geen porie kleiner is geworden; er is alleen minder om naar te kijken.",
  },
  {
    kop: "Twee dingen aangepakt",
    tekst:
      "Nu wordt het verschil groot. Dit is ongeveer het punt waarop mensen zeggen dat hun poriën kleiner zijn geworden, terwijl de doorsnede geen millimeter veranderde.",
  },
  {
    kop: "Alles wat er te doen valt",
    tekst:
      "Dit is het eerlijke maximum. De openingen staan er nog precies zo, en toch zie je ze nauwelijks. Dat is wat wij bedoelen met poriën behandelen.",
  },
] as const;

/* ── De beelden ────────────────────────────────────────────────────────── */

export const PORIEN_SOORTEN = [
  {
    id: "mee-eters",
    naam: "Zwarte puntjes",
    klanttaal: "Kleine donkere stipjes, vooral op de neus",
    vakterm: "open comedonen",
    watJeZiet:
      "Donkere puntjes in de poriën van neus, kin en soms het voorhoofd. Ze komen terug nadat je ze weghaalt.",
    watHetBetekent:
      "Een porie gevuld met talg en dode huidcellen. De donkere kleur is geen vuil maar oxidatie: het bovenste laagje kleurt in contact met lucht. [MEDISCHE-CHECK-ROJDA]",
    aanpak:
      "Leegmaken helpt zichtbaar, maar de porie vult zich weer. Het gaat er dus om hoe snel dat gaat, niet of het gebeurt.",
    verwarring:
      "Dit is geen vuil en het komt niet doordat je je gezicht niet goed wast. Harder schrobben maakt het meestal erger.",
  },
  {
    id: "witte-bultjes",
    naam: "Kleine witte bultjes",
    klanttaal: "Bultjes onder de huid die je vooral voelt",
    vakterm: "gesloten comedonen",
    watJeZiet:
      "Huidkleurige tot witte bultjes zonder rode rand, vaak op voorhoofd en kaaklijn. Je voelt ze eerder dan je ze ziet.",
    watHetBetekent:
      "Dezelfde verstopping als bij een zwart puntje, maar de porie is aan de bovenkant dicht. Daardoor oxideert er niets en blijft het licht. [MEDISCHE-CHECK-ROJDA]",
    aanpak:
      "Dit vraagt geduld en een aanpak die op de verhoorning werkt. Uitknijpen lukt niet en laat meestal een vlekje achter.",
    verwarring:
      "Veel mensen noemen dit acne en gaan er agressief op reinigen. Dat droogt de huid uit, waarna er méér talg komt.",
  },
  {
    id: "verwijd",
    naam: "Zichtbaar wijde poriën",
    klanttaal:
      "Poriën die je van dichtbij duidelijk ziet, zonder dat er iets in zit",
    vakterm: "verwijde poriën",
    watJeZiet:
      "Openingen die opvallen op de wangen en neusvleugels, vaak in de vorm van een druppel in plaats van rond.",
    watHetBetekent:
      "De doorsnede hoort bij je aanleg en de huid eromheen staat minder strak. De druppelvorm wijst op dat tweede. [MEDISCHE-CHECK-ROJDA]",
    aanpak:
      "Hier werken we op de huid rondom en op de glans erop. De opening zelf laten we met rust, want daar valt niets aan te doen.",
    verwarring:
      "Poriën gaan niet open en dicht. Ze hebben geen spiertje, dus stomen opent ze niet en koud water sluit ze niet.",
  },
  {
    id: "kuiltjes",
    naam: "Kuiltjes die op poriën lijken",
    klanttaal: "Putjes die je vooral bij zijlicht ziet",
    vakterm: "atrofische littekens",
    watJeZiet:
      "Kleine indeukingen op de wangen en slapen, meestal onregelmatiger verdeeld dan poriën en zonder opening.",
    watHetBetekent:
      "Dit zijn geen poriën maar littekens van eerdere ontstekingen. Een porie heeft een opening, een kuiltje niet.",
    aanpak:
      "Dit hoort bij de littekenpagina en niet hier, want de aanpak is een andere. We zeggen het liever voordat je aan de verkeerde behandeling begint.",
    verwarring:
      "Dit is het meest gemaakte misverstand op deze pagina, en het kost mensen sessies aan de verkeerde behandeling.",
  },
] as const;

export const PORIEN_WEL_NIET = {
  wel: [
    "Accepteren dat de doorsnede vastligt en sturen op wat er wél verandert. Dat scheelt zichtbaar veel en spaart je een reeks teleurstellingen.",
    "Consequent en mild reinigen. Twee keer per dag rustig werkt beter dan één keer per week grondig.",
    "Werken aan de stevigheid van de huid rondom, want die bepaalt de vorm van de opening.",
    "Weten of je naar poriën kijkt of naar kuiltjes. Dat verschil bepaalt de hele aanpak.",
    "Foto's onder hetzelfde licht vergelijken. Poriën zien er onder licht van opzij altijd erger uit.",
  ],
  niet: [
    "Uitknijpen. Je maakt de opening wijder en de kans op een vlekje of littekentje groter.",
    "Stomen om poriën te openen. Ze hebben geen spier en gaan dus nergens open.",
    "Poriënstrips als vaste gewoonte. Je trekt het bovenste laagje mee en de porie vult zich gewoon weer.",
    "Sterk uitdrogende producten stapelen. Een uitgedroogde huid maakt meestal juist meer talg aan.",
    "Een behandeling boeken op belofte van kleinere poriën. Vraag wat er dan precies verandert.",
  ],
} as const;

export const PORIEN_WIJ_DOEN_NIET = [
  {
    titel: "Geen kleinere poriën",
    tekst:
      "Wij beloven het niet en we schrijven het nergens. Wat we wel beloven is dat ze minder opvallen, en dat kunnen we met een foto onder hetzelfde licht laten zien.",
  },
  {
    titel: "Geen behandeling zonder onderscheid",
    tekst:
      "Eerst vaststellen of het poriën zijn of littekenkuiltjes. Dat lijkt een detail en het is het verschil tussen wel en niet werken.",
  },
  {
    titel: "Geen abonnement op leegmaken",
    tekst:
      "Een porie vult zich weer, dus eindeloos blijven leeghalen is een abonnement en geen behandeling. We kijken liever naar hoe snel het teruggaat.",
  },
] as const;

export const PORIEN_FAQ = [
  {
    vraag: "Kunnen mijn poriën echt niet kleiner?",
    antwoord:
      "De opening zelf niet blijvend, nee. Dat hangt samen met de talgklier eronder en met je aanleg. Wat wel verandert is hoe zichtbaar ze zijn, en dat is uiteindelijk wat je in de spiegel ziet. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Waarom komen zwarte puntjes steeds terug?",
    antwoord:
      "Omdat de porie blijft doen wat hij hoort te doen: talg produceren. Leegmaken is dus onderhoud en geen oplossing. De vraag die telt is hoe snel het teruggaat, en daar valt wel iets aan te sturen.",
  },
  {
    vraag: "Helpt stomen?",
    antwoord:
      "Niet om poriën te openen, want daar zit geen spiertje. Warmte maakt talg wel vloeibaarder, waardoor leegmaken makkelijker gaat. Dat is iets anders dan wat er meestal beloofd wordt.",
  },
  {
    vraag: "Ik heb ook acne. Waar begin ik?",
    antwoord:
      "Bij de acne. Zolang er ontsteking is, is werken aan poriën dweilen met de kraan open, en behandelen in een ontstoken huid geeft meer kans op littekens.",
  },
  {
    vraag: "Werken poriënstrips?",
    antwoord:
      "Voor even. Je trekt het bovenste stukje van de prop mee en het ziet er direct beter uit. De porie vult zich daarna gewoon weer, en bij vaak gebruik raakt de huid eromheen geïrriteerd.",
  },
  kostenVraag(),
] as const;
