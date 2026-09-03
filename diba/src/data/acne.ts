/**
 * Inhoud van de acnepagina.
 *
 * Bewust géén generieke acnepagina. Wat hem eigen maakt komt uit de merkregels en niet
 * uit SEO-gewoonte:
 *
 * - De acnekaart: waar het zit is informatie (zie `acne-zones.ts`).
 * - Acne is niet één aandoening; vijf beelden in plaats van één belofte.
 * - De tijdlijn benoemt de dip in week 1–2. Bijna elke kliniek verzwijgt die.
 * - Er staat een sectie in waarin we nee zeggen (A7).
 * - Littekens ná rust, als klinische ordening.
 *
 * STEM (A5): korte zinnen, concreet boven mooi, één moment van menselijkheid per stuk
 * tekst, en de klant is slim. Geen percentages: geen belofte zonder meting (A7).
 *
 * COPY-STATUS: concept in de Diba-stem, geen definitieve marketingcopy. Medische
 * beweringen zijn gemarkeerd met [MEDISCHE-CHECK-ROJDA] en moeten langs Rojda.
 */

import { kostenVraag } from "@/data/pillar-kosten";

export type AcneType = {
  readonly id: string;
  readonly naam: string;
  /** Wat een 15-jarige én een 60-jarige direct snapt. */
  readonly klanttaal: string;
  /** De vakterm, ernaast en niet in plaats daarvan (§10). */
  readonly vakterm: string;
  readonly watJeZiet: string;
  readonly watHetBetekent: string;
  readonly watWijEersteDoen: string;
  /** Het onderscheid dat mensen het vaakst verkeerd hebben. */
  readonly verwarMetNiet: string;
};

export const ACNE_TYPES: readonly AcneType[] = [
  {
    id: "comedonaal",
    naam: "Mee-eters, weinig rood",
    klanttaal: "Kleine bultjes en zwarte puntjes, maar niet echt ontstoken",
    vakterm: "comedonale acne",
    watJeZiet:
      "Een huid die ruw aanvoelt als je eroverheen gaat. Open mee-eters met een donker kopje en gesloten mee-eters die je vooral voelt. Weinig rood, nauwelijks pijnlijk.",
    watHetBetekent:
      "De porie zit dicht, maar je afweer is nog niet in actie gekomen. Dit is het stadium waarin je het meeste kunt vóórkomen in plaats van herstellen. [MEDISCHE-CHECK-ROJDA]",
    watWijEersteDoen:
      "Poriën reinigen en de verhoorning aanpakken, in stappen en zonder de huid te irriteren. Dit is vaak het traject met de minste sessies.",
    verwarMetNiet:
      "Die donkere puntjes zijn geen vuil. Het is talg dat aan de lucht is verkleurd. Daarom poetst het er ook niet uit.",
  },
  {
    id: "papulopustuleus",
    naam: "Rode bultjes en puskopjes",
    klanttaal: "Rode plekjes die opkomen, soms met een wit kopje",
    vakterm: "papulopustuleuze acne",
    watJeZiet:
      "Verheven, rode plekjes die gevoelig zijn als je erop drukt. Sommige met een puskopje. Meestal in golven, vaak over wangen en kin.",
    watHetBetekent:
      "Er is actieve ontsteking. De huid heeft eerst rust nodig. Dit is niet het moment voor peelings of laser, hoe verleidelijk dat ook is. [MEDISCHE-CHECK-ROJDA]",
    watWijEersteDoen:
      "Ontsteking omlaag. Pas als de huid rustiger is kijken we naar textuur en littekens. Die volgorde is niet onderhandelbaar.",
    verwarMetNiet:
      "Een puskopje is geen teken dat het rijp is om uit te knijpen. Het is een teken dat je afweer al bezig is.",
  },
  {
    id: "nodulair",
    naam: "Diepe, pijnlijke knobbels",
    klanttaal: "Harde bultjes onder je huid die dagen of weken blijven zitten",
    vakterm: "nodulocystische acne",
    watJeZiet:
      "Zwellingen die je meer voelt dan ziet. Ze komen niet tot een kopje, ze doen zeer, en ze laten vaker een litteken of een donkere vlek achter.",
    watHetBetekent:
      "Deze vorm kunnen wij behandelen. Bij een deel van de mensen is daarnaast een arts nodig, en dan werken we samen in plaats van los van elkaar. [MEDISCHE-CHECK-ROJDA]",
    watWijEersteDoen:
      "Een eerlijk gesprek. We overleggen met je huisarts of dermatoloog vóórdat we iets doen, en soms is ons advies om bij ons nog niet te starten.",
    verwarMetNiet:
      "Dit is niet ernstiger omdat je iets fout doet. Bij deze vorm speelt je afweer diep in de huid, en dat is geen kwestie van beter reinigen.",
  },
  {
    id: "hormonaal",
    naam: "Vooral op kin en kaaklijn",
    klanttaal: "Puistjes op je kin die met je cyclus meekomen",
    vakterm: "acne mandibulair",
    watJeZiet:
      "Een vast patroon langs kaaklijn en kin dat opvlamt rond een vaste periode in de maand. Vaak dieper en gevoeliger dan de rest.",
    watHetBetekent:
      "Het patroon in de tijd wijst op een hormonale factor. Huidbehandeling verbetert het beeld, maar de oorzaak ligt vaak dieper. [MEDISCHE-CHECK-ROJDA]",
    watWijEersteDoen:
      "We vragen door over je cyclus, de pil en eventuele PCOS. Huidzorg en een medisch traject versterken elkaar hier, en we stemmen graag af met je huisarts.",
    verwarMetNiet:
      "Hormonale acne is niet voorbehouden aan tieners. We zien het net zo vaak bij mensen van dertig en veertig.",
  },
  {
    id: "mechanica",
    naam: "Door wrijving of contact",
    klanttaal: "Puistjes precies waar iets tegen je huid drukt",
    vakterm: "acne mechanica",
    watJeZiet:
      "Plekjes onder een mondkapje, een helmbandje, een sportbeha, of op de wang waar je telefoon komt. Vaak scherp begrensd langs de rand van dat contact.",
    watHetBetekent:
      "De oorzaak is druk, warmte en vocht, niet je huidtype. Zonder de oorzaak weg te nemen komt het terug, hoe goed we ook behandelen. [MEDISCHE-CHECK-ROJDA]",
    watWijEersteDoen:
      "Eerst uitzoeken wat er tegen je huid komt. Daarna kalmeren. Soms is dit op te lossen zonder één behandeling, en dan zeggen we dat ook.",
    verwarMetNiet:
      "Dit heeft niets te maken met hygiëne. We zien het bij mensen die zich twee keer per dag wassen.",
  },
] as const;

/**
 * Wat er onder je huid gebeurt, in vier stadia.
 *
 * Bewust zonder nummers in de opmaak: die "01 02 03"-blokjes zijn een sjabloon, niet een
 * gedachte. De volgorde blijkt uit de doorsnede zelf. Elk stadium heeft een eigen lever
 * waar je kunt ingrijpen — dát is de educatieve waarde, niet de opsomming.
 */
export type Stadium = {
  readonly id: string;
  readonly naam: string;
  /** Wat je hiervan aan de buitenkant merkt. */
  readonly merkbaar: string;
  readonly uitleg: string;
  /** Waar je op dit punt iets kunt veranderen. */
  readonly ingrijpen: string;
};

export const ACNE_STADIA: readonly Stadium[] = [
  {
    id: "talg",
    naam: "Talg",
    merkbaar:
      "Je huid glanst sneller dan je wilt, vooral op je neus en voorhoofd.",
    uitleg:
      "De talgklier zit diep in de huid en maakt vet dat langs de haarschacht naar boven loopt. Onder invloed van hormonen maakt hij meer dan de huid kwijt kan. [MEDISCHE-CHECK-ROJDA]",
    ingrijpen:
      "Aan de productie zelf doe je met crème weinig. Wat wél werkt is de afvoer verbeteren, zodat het niet blijft staan.",
  },
  {
    id: "verhoorning",
    naam: "Verhoorning",
    merkbaar: "De huid voelt ruw. Je ziet kleine bultjes zonder rood.",
    uitleg:
      "Dode huidcellen laten aan de rand van de porie niet goed los en plakken samen. De opening wordt smaller en sluit uiteindelijk af.",
    ingrijpen:
      "Hier zit de meeste winst, en hier gaat het ook het vaakst mis. Te hard schrobben beschadigt de barrière en maakt het laatste stadium erger.",
  },
  {
    id: "bacterie",
    naam: "Bacterie",
    merkbaar: "Nog niets. Dit gebeurt onder de oppervlakte.",
    uitleg:
      "In die afgesloten porie zit geen zuurstof meer. Een bacterie die altijd al op je huid leeft, krijgt daar ineens de ruimte. [MEDISCHE-CHECK-ROJDA]",
    ingrijpen:
      "Dit is geen kwestie van vies of schoon. De bacterie hoort bij je huid; alleen de omstandigheden zijn veranderd.",
  },
  {
    id: "ontsteking",
    naam: "Ontsteking",
    merkbaar: "Rood, verheven, gevoelig. Dit is wat je in de spiegel ziet.",
    uitleg:
      "Je afweer ruimt op. De roodheid en de zwelling zijn niet de infectie zelf, maar jouw reactie erop. Daarom is een puistje warm.",
    ingrijpen:
      "Nu is rust het doel. Alles wat prikkelt verlengt deze fase. Uitknijpen duwt de ontsteking dieper en dat is de kortste route naar een litteken.",
  },
] as const;

/**
 * De eerlijke tijdlijn. Geen percentages, want die hebben we niet gemeten (A7).
 * De dip in week 1–2 staat er bewust in.
 */
export const ACNE_TIJDLIJN = [
  {
    periode: "Week 1 – 2",
    kop: "Het kan even slechter lijken",
    tekst:
      "De huid ruimt op wat al onder de oppervlakte klaarlag. Dat komt naar buiten en dat ziet er niet beter uit. Bijna iedereen schrikt hier, en bijna iedereen die doorzet is er blij om.",
    watWijDoen:
      "Dit is normaal en geen reden om te stoppen. Blijf van je gezicht af, houd het simpel, en bel ons als je twijfelt. Dat mag ook zonder afspraak.",
    isDip: true,
  },
  {
    periode: "Week 3 – 6",
    kop: "Minder nieuwe plekjes",
    tekst:
      "Er komt minder bij, en wat er zit geneest sneller. De huid voelt in deze fase vaak eerder rustiger dan hij eruitziet. Dat komt doordat de roodheid het langst blijft.",
    watWijDoen:
      "We bouwen op in kleine stappen. Als je huid het aankan gaan we iets verder; als hij protesteert stappen we terug.",
    isDip: false,
  },
  {
    periode: "Week 8 – 12",
    kop: "Zichtbaar verschil",
    tekst:
      "Nu zie je het ook op foto's, niet alleen in de spiegel op een goede dag. Dit is het moment waarop het verschil met de nulmeting hard wordt in plaats van een gevoel.",
    watWijDoen:
      "Tweede meting met EVE-M. We leggen de twee naast elkaar en stellen het plan bij. Werkt het niet, dan zeggen we dat en stoppen we.",
    isDip: false,
  },
  {
    periode: "Maand 4 en verder",
    kop: "Onderhoud, en pas nu littekens",
    tekst:
      "Met een rustige huid kunnen we naar textuur en littekens gaan kijken. Eerder heeft dat geen zin en maakt het het beeld vaak slechter.",
    watWijDoen:
      "Minder sessies, meer tussenruimte. En een eerlijk gesprek of littekenbehandeling in jouw geval genoeg oplevert om te doen.",
    isDip: false,
  },
] as const;

/** Wat wél en wat niet. De kruisjes zijn concreet, want daar zit de waarde. */
export const ACNE_WEL_NIET = {
  wel: [
    "Een nulmeting voordat we starten, zodat we later onder vergelijkbare omstandigheden kunnen meten",
    "Poriën reinigen en verhoorning aanpakken, in stappen die je huid aankan",
    "Ontsteking eerst omlaag, littekens daarna. Nooit tegelijk",
    "Zonbescherming, elke dag, ook in de winter. Dit voorkomt de donkere vlekken die na een puistje overblijven",
    "Doorverwijzen naar de arts als het beeld daarom vraagt, ook als je bij ons kwam",
  ],
  niet: [
    "Tandpasta of citroensap op een plekje. Het irriteert de huid en laat vaker een donkere vlek achter dan het puistje zelf zou doen",
    "Onder de zonnebank. Het maakt roodheid tijdelijk onzichtbaar en beschadigt intussen je huid",
    "Dagelijks scrubben. Je haalt de barrière weg die de ontsteking moet beperken",
    "Alcoholtoners die je huid laten trekken. Een uitgedroogde huid maakt méér talg, niet minder",
    "Zelf uitknijpen. Je duwt de ontsteking dieper in plaats van eruit. Dit is de snelste route naar een litteken",
  ],
} as const;

/** Waar wij nee zeggen. Dit is een merkregel, geen disclaimer (A7). */
export const ACNE_WIJ_DOEN_NIET = [
  {
    titel: "Eerst de ontsteking, dan het litteken",
    tekst:
      "Laseren of needlen in actieve acne verergert de ontsteking en kan het litteken juist vastzetten. We wachten tot de huid rustig is, ook als dat langer duurt dan je hoopte. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    titel: "Medicatie loopt via je arts, en wij stemmen af",
    tekst:
      "Antibiotica, de pil en isotretinoïne schrijft je huisarts of dermatoloog voor. Wij werken daarmee samen: jouw behandeling hier wordt afgestemd op wat je slikt, en andersom denken we mee over wat de arts ziet.",
  },
  {
    titel: "Een traject met een einddatum",
    tekst:
      "Je hoort vooraf hoeveel sessies we verwachten en wanneer we opnieuw meten. Blijkt het niet te werken, dan stoppen we en zeggen we dat in plaats van door te gaan.",
  },
] as const;

export const ACNE_FAQ = [
  {
    vraag: "Kom ik hier van mijn acne af?",
    antwoord:
      "Bij de meeste mensen is acne goed te beheersen. Bij sommigen blijft het terugkomen, bijvoorbeeld door hormonen. We zeggen vooraf wat we in jouw geval realistisch vinden, en we meten of het werkt. Beheersing is soms het eerlijke doel, en dat is geen tweede keus. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    /* Hier stond een prijsvlag op een antwoord dat al compleet is: het aantal en de prijs
       volgen ná de meting, en dat ís het antwoord. Wat ontbrak was een eigen kostenvraag,
       en die staat nu onderaan met het bedrag uit de behandelingentabel. */
    vraag: "Hoeveel sessies heb ik nodig?",
    antwoord:
      "Dat hangt af van het type acne en hoe lang het speelt. Na de nulmeting krijg je een aantal en een prijs, geen open einde.",
  },
  {
    vraag: "Ik heb al alles geprobeerd. Waarom zou dit werken?",
    antwoord:
      "Eerlijk gezegd weten we dat nog niet. Daarom beginnen we met meten in plaats van behandelen. Als wij denken dat het bij ons niet gaat lukken, zeggen we dat liever nu dan na zes sessies.",
  },
  {
    vraag: "Mag ik make-up blijven gebruiken?",
    antwoord:
      "Ja. We kijken wel samen naar wat je gebruikt, want een paar veelgebruikte producten houden het beeld in stand zonder dat je het merkt.",
  },
  {
    vraag: "Kan ik komen als ik onder behandeling ben bij een dermatoloog?",
    antwoord:
      "Dat kan, en het is vaak juist verstandig. Vertel het ons wel, dan stemmen we af wat veilig combineert met je medicatie. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Helpt het als ik anders ga eten?",
    antwoord:
      "Soms wel. We werken samen met een laboratorium en kunnen een voedingsintolerantietest doen; komt daar iets uit, dan heeft je voeding aanpassen ook echt effect. Zonder die test blijft het gokken, en dan gaan we je hier geen dieet aanpraten. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Ik heb vooral last van de vlekken die overblijven.",
    antwoord:
      "Dat zijn meestal geen littekens maar pigmentvlekken. Zonbescherming voorkomt dat ze donkerder worden en dat er nieuwe bij komen, maar het laat een vlek die er al zit niet verdwijnen; daar zijn behandelingen voor nodig. Zit er een kuiltje in de huid, dan is het wél een litteken en kijken we ernaar zodra de huid rustig is. [MEDISCHE-CHECK-ROJDA]",
  },
  kostenVraag(),
] as const;
