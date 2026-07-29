/**
 * Inhoud van de acnepagina.
 *
 * Bewust géén generieke acnepagina. Vier dingen maken hem eigen, en alle vier komen
 * uit de merkregels in plaats van uit SEO-gewoonte:
 *
 * 1. Acne is niet één aandoening. De typekiezer laat je je eigen huid herkennen, omdat
 *    het type bepaalt wat er wél helpt (§10: klanttaal naast vaktaal).
 * 2. De tijdlijn benoemt de dip in week 1–2. Bijna elke kliniek verzwijgt die; ons
 *    merk zegt hem hardop (A5: concreet verslaat mooi).
 * 3. Er staat een sectie in waarin we nee zeggen (A7 en /dit-behandelen-wij-niet).
 * 4. Littekens vóór rust behandelen maakt het erger. Dat is de klinische ordening die
 *    de meeste pagina's overslaan.
 *
 * COPY-STATUS: dit is concepttekst in de Diba-stem, geen definitieve marketingcopy.
 * Alles wat een medische bewering doet is gemarkeerd met [MEDISCHE-CHECK-ROJDA] en moet
 * langs Rojda voordat het live gaat. Er staan bewust geen resultaatpercentages in: geen
 * belofte zonder meting (A7).
 */

export type AcneType = {
  readonly id: string;
  readonly naam: string;
  /** Wat een 15-jarige én een 60-jarige direct snapt. */
  readonly klanttaal: string;
  /** De vakterm, ernaast en niet in plaats daarvan. */
  readonly vakterm: string;
  readonly watJeZiet: string;
  readonly watHetBetekent: string;
  readonly watWijEersteDoen: string;
};

export const ACNE_TYPES: readonly AcneType[] = [
  {
    id: "comedonaal",
    naam: "Mee-eters, weinig rood",
    klanttaal: "Kleine bultjes en zwarte puntjes, maar niet echt ontstoken",
    vakterm: "comedonale acne",
    watJeZiet:
      "Een ruwe huid met open en gesloten mee-eters, vaak op neus, kin en voorhoofd. Nauwelijks rood, nauwelijks pijnlijk.",
    watHetBetekent:
      "De porie zit dicht, maar er is nog weinig ontsteking. Dit is het stadium waarin je het meeste kunt voorkomen. [MEDISCHE-CHECK-ROJDA]",
    watWijEersteDoen:
      "Poriën openmaken en de verhoorning aanpakken, zonder de huid te irriteren. Vaak is dit het traject met de minste sessies.",
  },
  {
    id: "papulopustuleus",
    naam: "Rode bultjes en puskopjes",
    klanttaal: "Rode plekjes die opkomen, soms met een wit kopje",
    vakterm: "papulopustuleuze acne",
    watJeZiet:
      "Rode, verheven plekjes die gevoelig aanvoelen. Sommige met een puskopje, meestal in golven over de wangen en kin.",
    watHetBetekent:
      "Er is actieve ontsteking. De huid heeft eerst rust nodig; dit is niet het moment voor agressieve behandelingen. [MEDISCHE-CHECK-ROJDA]",
    watWijEersteDoen:
      "Ontsteking omlaag brengen. Pas als de huid rustiger is, kijken we naar textuur en littekens.",
  },
  {
    id: "nodulair",
    naam: "Diepe, pijnlijke knobbels",
    klanttaal: "Harde bultjes onder de huid die dagen of weken blijven zitten",
    vakterm: "nodulocystische acne",
    watJeZiet:
      "Diepe zwellingen die je vooral voelt. Ze komen niet tot een kopje en laten vaker een litteken of donkere vlek achter.",
    watHetBetekent:
      "Dit type hoort bij de arts, niet alleen bij de kliniek. Bij deze vorm sturen we je door en werken we aanvullend. [MEDISCHE-CHECK-ROJDA]",
    watWijEersteDoen:
      "Eerlijk gesprek eerst. We overleggen met je huisarts of dermatoloog voordat we iets doen, en soms is ons advies om nog niet te starten.",
  },
  {
    id: "hormonaal",
    naam: "Vooral op kin en kaaklijn",
    klanttaal: "Puistjes op je kin die met je cyclus meekomen",
    vakterm: "acne mandibulair",
    watJeZiet:
      "Een vast patroon langs de kaaklijn en kin, dat opvlamt rond een vaste periode in de maand.",
    watHetBetekent:
      "Het patroon wijst op een hormonale factor. Huidbehandeling helpt het beeld, maar de oorzaak ligt vaak dieper. [MEDISCHE-CHECK-ROJDA]",
    watWijEersteDoen:
      "We vragen door over je cyclus en eventuele PCOS. Huidzorg en medisch traject lopen hier naast elkaar, niet in plaats van elkaar.",
  },
  {
    id: "mechanica",
    naam: "Door wrijving of contact",
    klanttaal: "Puistjes precies waar iets tegen je huid drukt",
    vakterm: "acne mechanica",
    watJeZiet:
      "Plekjes onder een mondkapje, helmbandje, sportbeha of op de wang waar je telefoon komt. Vaak scherp begrensd.",
    watHetBetekent:
      "De oorzaak is druk en warmte, niet je huidtype. Zonder de oorzaak weg te nemen komt het terug. [MEDISCHE-CHECK-ROJDA]",
    watWijEersteDoen:
      "Eerst uitzoeken wat er tegen je huid komt. Daarna kalmeren. Soms is dit op te lossen zonder één behandeling.",
  },
] as const;

/** Wat er in de huid gebeurt. Vier stappen, geen jargon zonder uitleg. */
export const ACNE_MECHANISME = [
  {
    stap: "Talg",
    tekst: "De talgklier maakt meer vet dan de huid kwijt kan.",
  },
  {
    stap: "Verhoorning",
    tekst: "Dode huidcellen laten niet goed los en sluiten de porie af.",
  },
  {
    stap: "Bacterie",
    tekst: "In die afgesloten porie krijgt een huideigen bacterie ruimte.",
  },
  {
    stap: "Ontsteking",
    tekst: "Je afweer reageert. Dat is de roodheid en de zwelling die je ziet.",
  },
] as const;

/**
 * De eerlijke tijdlijn. Geen percentages, want die hebben we niet gemeten (A7).
 * De dip in week 1–2 staat er bewust in: die is de reden dat mensen te vroeg stoppen.
 */
export const ACNE_TIJDLIJN = [
  {
    periode: "Week 1 – 2",
    kop: "Het kan even slechter lijken",
    tekst:
      "De huid ruimt op wat al onder de oppervlakte zat. Dat ziet er niet beter uit. Dit is normaal en geen reden om te stoppen.",
    isDip: true,
  },
  {
    periode: "Week 3 – 6",
    kop: "Minder nieuwe plekjes",
    tekst:
      "Er komt minder bij. Wat er zit geneest sneller. De huid voelt vaak eerder rustiger dan hij eruitziet.",
    isDip: false,
  },
  {
    periode: "Week 8 – 12",
    kop: "Zichtbaar verschil",
    tekst:
      "Nu zie je het ook op foto's. Dit is het moment waarop we de nulmeting ernaast leggen en het traject bijstellen.",
    isDip: false,
  },
  {
    periode: "Maand 4 en verder",
    kop: "Onderhoud, en pas nu littekens",
    tekst:
      "Met een rustige huid kunnen we naar textuur en littekens kijken. Eerder heeft dat geen zin.",
    isDip: false,
  },
] as const;

/** Wat wél en wat niet. De kruisjes zijn concreet, want daar zit de waarde. */
export const ACNE_WEL_NIET = {
  wel: [
    "Een nulmeting voordat we starten, zodat we weten wat we bijstellen",
    "Poriën openmaken en verhoorning aanpakken, in stappen",
    "Ontsteking eerst omlaag, littekens daarna",
    "Zonbescherming, elke dag, ook in de winter",
    "Doorverwijzen naar de arts als het beeld daarom vraagt",
  ],
  niet: [
    "Tandpasta of citroensap op een plekje. Het irriteert en laat vaker een vlek achter",
    "Onder de zonnebank. Het maskeert roodheid en beschadigt de huid",
    "Dagelijks scrubben. Dat maakt de barrière kapot en de ontsteking erger",
    "Alcoholtoners die de huid laten trekken. Droge huid maakt méér talg",
    "Zelf uitknijpen. Dit is de snelste route naar een litteken",
  ],
} as const;

/** Waar wij nee zeggen. Dit is een merkregel, geen disclaimer (A7). */
export const ACNE_WIJ_DOEN_NIET = [
  {
    titel: "Geen littekenbehandeling op een ontstoken huid",
    tekst:
      "Laseren of needlen in actieve acne verergert de ontsteking. We wachten tot de huid rustig is, ook als dat langer duurt dan je wilt. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    titel: "Geen advies over medicatie",
    tekst:
      "Antibiotica, de pil en isotretinoïne horen bij je huisarts of dermatoloog. Wij werken ernaast, nooit in plaats daarvan.",
  },
  {
    titel: "Geen traject zonder einddatum",
    tekst:
      "Je hoort vooraf hoeveel sessies we verwachten en wanneer we opnieuw meten. Werkt het niet, dan stoppen we en zeggen we dat.",
  },
] as const;

export const ACNE_FAQ = [
  {
    vraag: "Word ik hier van mijn acne af?",
    antwoord:
      "Bij de meeste mensen is acne goed te beheersen. Bij sommigen blijft het terugkomen, bijvoorbeeld door hormonen. We zeggen vooraf wat we in jouw geval realistisch vinden, en meten of het werkt. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Hoeveel sessies heb ik nodig?",
    antwoord:
      "Dat hangt af van het type acne en hoe lang het speelt. Na de nulmeting krijg je een aantal en een prijs. Geen open einde. [PRIJS-NODIG]",
  },
  {
    vraag: "Mag ik make-up blijven gebruiken?",
    antwoord:
      "Ja. We kijken wel samen naar wat je gebruikt, want een aantal producten houdt het beeld in stand.",
  },
  {
    vraag: "Ik heb al alles geprobeerd. Waarom zou dit werken?",
    antwoord:
      "Eerlijk gezegd weten we dat nog niet. Daarom beginnen we met meten in plaats van behandelen. Als wij denken dat het bij ons niet gaat lukken, zeggen we dat.",
  },
  {
    vraag: "Kan ik komen als ik onder behandeling ben bij een dermatoloog?",
    antwoord:
      "Dat kan, en het is vaak juist verstandig. Vertel het ons wel, dan stemmen we af wat veilig combineert. [MEDISCHE-CHECK-ROJDA]",
  },
] as const;
