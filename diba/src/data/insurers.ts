/**
 * De zes verzekeraars.
 *
 * WAT HIER STOND EN WAAROM DAT NIET KON BLIJVEN.
 *
 * Alleen een naam en een slug, met "[COPY-NODIG] tot Okan/Rojda feiten levert". Daarmee
 * bestonden er zes live pagina's met drie lege kopjes eronder. Ze waren bereikbaar vanaf
 * /vergoedingen en beloofden een antwoord dat er niet was.
 *
 * WAT IK WEL EN NIET MOCHT INVULLEN.
 *
 * Niet: bedragen, maxima en pakketnamen. Die veranderen per jaar en per polis, en bij geld
 * is onjuist erger dan afwezig. Dat staat ook zo op /vergoedingen.
 *
 * Wel: waar je het bij deze verzekeraar zélf opzoekt, en waar het bij deze verzekeraar in
 * de praktijk op vastloopt. Dat tweede is per verzekeraar echt verschillend, en het is
 * precies wat zes losse pagina's rechtvaardigt. Zes keer dezelfde tekst met een andere naam
 * erboven is een doorslagpagina, en die verbieden de huisregels terecht.
 *
 * DE BRON EN DE HOUDBAARHEID.
 *
 * `gezienOp` staat erbij omdat dit een momentopname is van hun eigen site. Elke pagina zegt
 * dat ook tegen de bezoeker en linkt door naar de bron, zodat niemand op ons woord af hoeft
 * te gaan voor iets wat over zijn geld gaat.
 *
 * [BESLUIT-OKAN] elke regel in `eigenaardigheid`. Ik heb ze van de openbare pagina's van de
 * verzekeraars, niet uit jullie declaratiepraktijk. Wat jullie in de praktijk terugzien
 * weegt zwaarder dan wat er op hun site staat.
 */

export type Insurer = {
  readonly slug: string;
  readonly name: string;
  /** Hun eigen pagina over vergoeding van huidbehandelingen. Geverifieerd, geen gok. */
  readonly vergoedingenUrl: string;

  /**
   * Hun logo, onder public/images/verzekeraars/.
   *
   * Opgehaald van hun eigen site in september 2026. Het staat er om te verwijzen naar de
   * verzekeraar waar de pagina over gaat en niet om een samenwerking te suggereren; die is
   * er niet, en dat staat ook op elke pagina.
   *
   * Zet deze logo's dus nergens onder een kop als "onze partners". Dan zegt het beeld iets
   * anders dan de tekst, en het beeld wint.
   */
  readonly logo: string;

  /**
   * Hoeveel hoogte dit logo krijgt ten opzichte van de andere vijf.
   *
   * Zes logo's op één hoogte zetten klopt wiskundig en niet met het oog: een bijna vierkant
   * merkteken oogt kleiner dan een woordmerk dat drie keer zo breed is, want het heeft veel
   * minder oppervlak. Deze factoren zijn op het oog bepaald en niet uit de verhouding
   * gerekend, want het gaat om wat even groot lijkt.
   */
  readonly logoSchaal: number;
  /** Hoe je daar bij je eigen bedrag komt. */
  readonly waarTeVinden: string;
  /**
   * Waar het bij déze verzekeraar op vastloopt.
   *
   * Niet het bedrag maar de voorwaarde, want die verandert veel minder vaak en hij is
   * meestal de reden dat een declaratie wordt afgewezen.
   */
  readonly eigenaardigheid: string | null;

  /**
   * Wat deze verzekeraar van de behandelaar eist.
   *
   * Dit is de voorwaarde waar een declaratie het vaakst op sneuvelt, en hij verschilt per
   * verzekeraar scherp. Het is bovendien het enige op deze pagina's waar wij het antwoord
   * op hebben en de bezoeker niet: hij kan niet zien of onze therapeut in het
   * Kwaliteitsregister staat, en wij weten dat.
   */
  readonly eisAanBehandelaar: string;

  /**
   * De stappen naar je eigen bedrag, bij deze verzekeraar.
   *
   * Bij de een log je in met DigiD, bij de ander download je een pdf per jaar. Elke stap
   * die je hier leest, hoef je daar niet te zoeken.
   */
  readonly zoVindJeHet: readonly string[];

  /**
   * De vragen die je stelt als je belt, met het antwoord dat wij bij deze verzekeraar
   * hebben kunnen vinden.
   *
   * Hier stond eerst één gedeeld blok met "bij sommige verzekeraars wel, bij andere niet".
   * Dat klopt en het helpt niemand: wie op deze pagina zit weet welke verzekeraar hij heeft.
   * Waar het antwoord op hun site staat, staat het hier; waar het niet te vinden was, zegt
   * de tekst dat en wijst naar de polisvoorwaarden.
   */
  readonly antwoorden: readonly {
    readonly vraag: string;
    readonly antwoord: string;
  }[];
};

/** Wanneer ik hun pagina's heb bekeken. Staat op elke pagina, want dit veroudert. */
export const INSURERS_GEZIEN_OP = "september 2026";

export const INSURERS: readonly Insurer[] = [
  {
    slug: "cz",
    logoSchaal: 1.3,
    logo: "/images/verzekeraars/cz.svg",
    antwoorden: [
      {
        vraag: "Heb ik een verwijzing nodig?",
        antwoord:
          "Voor een behandeling bij de dermatoloog wel, en die loopt dan via de basisverzekering met eigen risico. Voor de huidtherapeut noemt CZ geen verwijzing op de algemene pagina; kijk op de pagina van jouw behandeling, want daar staan de voorwaarden.",
      },
      {
        vraag: "Deel ik dit budget met iets anders?",
        antwoord:
          "CZ zet acne, camouflagetherapie en gezichtsontharing elk op een eigen pagina met een eigen voorwaarde. Vraag daarom per behandeling na wat er nog over is; het antwoord voor acne hoeft niet te gelden voor ontharing.",
      },
      {
        vraag: "Gaat dit van mijn eigen risico af?",
        antwoord:
          "Bij een vergoeding uit de aanvullende verzekering niet. Het eigen risico hoort bij de basisverzekering. Veel mensen stellen zorg uit omdat ze dat door elkaar halen.",
      },
    ],
    eisAanBehandelaar:
      "CZ noemt op de algemene pagina geen registratie-eis, maar de voorwaarde staat per behandeling in de polisvoorwaarden. Vraag er dus naar bij de behandeling die jij wil, en niet in het algemeen.",
    zoVindJeHet: [
      "Ga naar de pagina van jouw behandeling, dus acnebehandeling of gezichtsontharing, en niet naar de algemene pagina huidbehandelingen.",
      "Log in op Mijn CZ of gebruik de app; je eigen bedrag staat er pas als CZ weet welk pakket je hebt.",
      "Staat er een voorwaarde bij over de behandelaar, bel ons dan even. Wij weten of we eraan voldoen en jij kunt dat niet zien.",
    ],
    name: "CZ",
    vergoedingenUrl: "https://www.cz.nl/vergoedingen/huidbehandelingen",
    waarTeVinden:
      "CZ heeft per behandeling een eigen pagina: huidbehandelingen, acnebehandeling en gezichtsontharing staan los van elkaar. Je eigen bedrag zie je pas als je inlogt of de app gebruikt.",
    eigenaardigheid:
      "Omdat elke behandeling een eigen pagina en een eigen voorwaarde heeft, kan het antwoord voor acne anders zijn dan voor ontharing. Kijk dus op de pagina van jouw behandeling en niet op de algemene.",
  },
  {
    slug: "vgz",
    logoSchaal: 1.25,
    logo: "/images/verzekeraars/vgz.svg",
    antwoorden: [
      {
        vraag: "Heb ik een verwijzing nodig?",
        antwoord:
          "Loopt het via de dermatoloog, dan verwijst je huisarts je door. Voor de huidtherapeut uit de aanvullende verzekering noemt VGZ die eis niet apart; controleer het in je eigen polisvoorwaarden.",
      },
      {
        vraag: "Deel ik dit budget met iets anders?",
        antwoord:
          "Ja. VGZ zet acne, camouflagetherapie en ontharen onder één noemer huidbehandelingen met één budget per kalenderjaar. Wat je aan het een besteedt gaat van het ander af, dus vraag ook wat je er dit jaar al van gebruikt hebt.",
      },
      {
        vraag: "Gaat dit van mijn eigen risico af?",
        antwoord:
          "Bij een vergoeding uit de aanvullende verzekering niet. Het eigen risico hoort bij de basisverzekering. Veel mensen stellen zorg uit omdat ze dat door elkaar halen.",
      },
    ],
    eisAanBehandelaar:
      "VGZ noemt op de pagina over huidbehandelingen geen aparte registratie-eis voor de huidtherapeut. Wat er wel staat is dat een verwijzing van je huisarts nodig is als het via de dermatoloog loopt.",
    zoVindJeHet: [
      "Open de pagina huidbehandelingen; VGZ zet acne, camouflagetherapie en ontharen daar bij elkaar.",
      "Log in op Mijn VGZ met je DigiD. Daar staat wat er in jouw pakket zit en wat je er dit jaar al van gebruikt hebt.",
      "Let op dat tweede getal: het budget is gedeeld, dus wat je aan het een besteedt gaat van het ander af.",
    ],
    name: "VGZ",
    vergoedingenUrl: "https://www.vgz.nl/vergoedingen/huidbehandelingen",
    waarTeVinden:
      "VGZ zet acne, ontharen en camouflagetherapie onder één noemer huidbehandelingen. Inloggen met DigiD laat zien wat er in jouw pakket zit.",
    eigenaardigheid:
      "Bij VGZ krijg je een budget per kalenderjaar dat je over acne, camouflage en ontharen samen verdeelt. Wat je aan het een besteedt, gaat van het ander af.",
  },
  {
    slug: "menzis",
    logoSchaal: 1,
    logo: "/images/verzekeraars/menzis.svg",
    antwoorden: [
      {
        vraag: "Heb ik een verwijzing nodig?",
        antwoord:
          "Dat hangt af van waar het uit komt. Uit de basisverzekering wil Menzis een schriftelijke verwijzing van je huisarts of een medisch specialist. Komt het uit je aanvullende verzekering, dan is die verwijzing niet nodig.",
      },
      {
        vraag: "Deel ik dit budget met iets anders?",
        antwoord:
          "Ja. Het maximum uit de aanvullende verzekering geldt voor acnebehandeling en camouflagetherapie samen, producten inbegrepen. Reken er ook op dat er per behandeling een eigen bijdrage geldt naast dat maximum.",
      },
      {
        vraag: "Gaat dit van mijn eigen risico af?",
        antwoord:
          "Bij een vergoeding uit de aanvullende verzekering niet. Het eigen risico hoort bij de basisverzekering. Veel mensen stellen zorg uit omdat ze dat door elkaar halen.",
      },
    ],
    eisAanBehandelaar:
      "Menzis werkt met contracten. Je gaat naar een huidtherapeut die zij erkennen, en welke dat zijn staat in hun Zorgvinder. Bij een gecontracteerde behandelaar gaat de rekening rechtstreeks naar Menzis in plaats van naar jou.",
    zoVindJeHet: [
      "Zoek de behandeling op in de vergoedingenwijzer van het lopende jaar; Menzis werkt met pdf-overzichten per jaar en per pakket.",
      "Kijk in de Zorgvinder of je behandelaar gecontracteerd is. Dat bepaalt of je zelf moet voorschieten.",
      "Ga je via de aanvullende verzekering, houd dan rekening met een eigen bijdrage per behandeling naast het maximum.",
    ],
    name: "Menzis",
    vergoedingenUrl:
      "https://www.menzis.nl/zorg-en-vergoedingen/d/dermatologie",
    waarTeVinden:
      "Menzis werkt met vergoedingenwijzers: pdf-overzichten per jaar waarin per zorgsoort staat wat je pakket doet.",
    eigenaardigheid:
      "Bij Menzis draait het om het contract. Ga je naar een huidtherapeut die zij niet erkennen, dan schiet je zelf voor en krijg je hooguit een deel terug. Kijk dus eerst in hun Zorgvinder en pas daarna naar het bedrag.",
  },
  {
    slug: "zilveren-kruis",
    logoSchaal: 1,
    logo: "/images/verzekeraars/zilveren-kruis.svg",
    antwoorden: [
      {
        vraag: "Heb ik een verwijzing nodig?",
        antwoord:
          "Op de recente pagina's van Zilveren Kruis staat dat je rechtstreeks naar een zorgverlener kunt. Oudere jaargangen noemden nog een verwijzing van de huisarts of specialist, dus controleer het jaartal bovenaan de pagina die je leest.",
      },
      {
        vraag: "Deel ik dit budget met iets anders?",
        antwoord:
          "Ja. Zilveren Kruis hanteert één maximum voor acnebehandeling en epilatie samen. Doe je allebei, kijk dan hoeveel je dit jaar al van dat maximum hebt gebruikt.",
      },
      {
        vraag: "Gaat dit van mijn eigen risico af?",
        antwoord:
          "Bij een vergoeding uit de aanvullende verzekering niet. Het eigen risico hoort bij de basisverzekering. Veel mensen stellen zorg uit omdat ze dat door elkaar halen.",
      },
    ],
    eisAanBehandelaar:
      "Zilveren Kruis stelt de scherpste eis van deze zes. De huidtherapeut moet kwaliteitsgeregistreerd staan in het Kwaliteitsregister Paramedici én een geldige persoonlijke AGB-code hebben, en die code en de beroepsvereniging moeten op de factuur staan. Ontbreekt dat, dan wijzen ze af op de factuur en niet op de behandeling.",
    zoVindJeHet: [
      "Zoek de pagina van jouw behandeling en controleer bovenaan het jaartal; oude jaargangen blijven online staan en zien er hetzelfde uit.",
      "Kijk of jouw pakket erbij staat, want de hoogte hangt af van welke aanvullende verzekering je hebt.",
      "Vraag ons om de AGB-code en de beroepsvereniging van je behandelaar voordat je declareert. Dan hoeft de factuur niet terug.",
    ],
    name: "Zilveren Kruis",
    vergoedingenUrl:
      "https://www.zilverenkruis.nl/consumenten/vergoedingen/krijg-ik-huidtherapie-vergoed",
    waarTeVinden:
      "Zilveren Kruis heeft een aparte pagina per onderwerp en per jaartal. Let op dat je naar het huidige jaar kijkt; oude jaargangen blijven online staan.",
    eigenaardigheid:
      "Bij Zilveren Kruis geldt één maximum voor acnebehandeling en ontharing samen, en ze stellen eisen aan de registratie van de behandelaar. Vraag dus ook even of wij aan die eis voldoen.",
  },
  {
    slug: "onvz",
    logoSchaal: 1.05,
    logo: "/images/verzekeraars/onvz.svg",
    antwoorden: [
      {
        vraag: "Heb ik een verwijzing nodig?",
        antwoord:
          "ONVZ koppelt de behandeling bij de huidtherapeut aan de arts: de huidarts schrijft haar voor, en je blijft zo nodig ook daar onder behandeling. De basisverzekering vergoedt de huidtherapeut zelf niet.",
      },
      {
        vraag: "Geldt er een leeftijdsgrens?",
        antwoord:
          "Ja, en dat is bij ONVZ de voorwaarde die het vaakst in de weg zit. Bij acnebehandeling loopt de vergoeding tot 21 jaar; alleen het hoogste pakket vergoedt ook daarna. Controleer dit voordat je een traject inplant.",
      },
      {
        vraag: "Gaat dit van mijn eigen risico af?",
        antwoord:
          "Bij een vergoeding uit de aanvullende verzekering niet. Het eigen risico hoort bij de basisverzekering. Veel mensen stellen zorg uit omdat ze dat door elkaar halen.",
      },
    ],
    eisAanBehandelaar:
      "Vanaf 1 januari 2026 wil ONVZ dat de huidtherapeut in het Kwaliteitsregister Paramedici staat. Voor dit jaar accepteren ze daarnaast nog een inschrijving bij de NVH, om behandelaars de tijd te geven die registratie rond te krijgen.",
    zoVindJeHet: [
      "Zoek de behandeling in de A-tot-Z-lijst van het jaar en het pakket dat jij hebt; ONVZ zet elke combinatie op een eigen pagina.",
      "Let op de leeftijdsgrens. Bij acnebehandeling loopt de vergoeding tot 21 jaar, met uitzondering van het hoogste pakket.",
      "Kijk of er een voorschrift van een huidarts nodig is. ONVZ koppelt de behandeling bij de huidtherapeut aan de behandeling bij de arts.",
    ],
    name: "ONVZ",
    vergoedingenUrl:
      "https://www.onvz.nl/vergoedingen/vrije-keuze/2026/acnebehandeling",
    waarTeVinden:
      "ONVZ zet zijn vergoedingen per jaar en per pakket op een eigen pagina, met een lijst van A tot Z.",
    eigenaardigheid:
      "ONVZ hanteert bij acnebehandeling een leeftijdsgrens, en de basisverzekering vergoedt de huidtherapeut niet. Ben je ouder dan die grens, controleer dan eerst of jouw pakket een uitzondering kent voordat je een traject inplant.",
  },
  {
    slug: "asr",
    logoSchaal: 1.15,
    logo: "/images/verzekeraars/asr.svg",
    antwoorden: [
      {
        vraag: "Heb ik een verwijzing nodig?",
        antwoord:
          "Dat staat in de polisvoorwaarden en niet in de vergoedingenvinder, net als de eis over de beroepsvereniging. Vraag er bij het bellen expliciet naar; de vinder geeft je het bedrag en niet de voorwaarde.",
      },
      {
        vraag: "Deel ik dit budget met iets anders?",
        antwoord:
          "Dat verschilt per verzekering. a.s.r. zet de maxima in een apart overzicht naast de vergoedingenvinder, dus kijk daar en niet alleen bij de behandeling zelf.",
      },
      {
        vraag: "Gaat dit van mijn eigen risico af?",
        antwoord:
          "Bij een vergoeding uit de aanvullende verzekering niet. Het eigen risico hoort bij de basisverzekering. Veel mensen stellen zorg uit omdat ze dat door elkaar halen.",
      },
    ],
    eisAanBehandelaar:
      "a.s.r. koppelt het recht op vergoeding aan de beroepsvereniging: de behandelaar moet aangesloten zijn bij een vereniging die zij erkennen. Welke dat zijn staat in de polisvoorwaarden en niet in de vergoedingenvinder.",
    zoVindJeHet: [
      "Zoek de behandeling op in de vergoedingenvinder. Dat geeft je het overzicht per verzekering.",
      "Ga daarna naar de polisvoorwaarden als pdf, want de voorwaarde over de beroepsvereniging staat daar en niet in de vinder.",
      "Weet je niet zeker of je behandelaar aan die eis voldoet, bel ons dan; wij weten bij welke vereniging we zijn aangesloten.",
    ],
    name: "a.s.r.",
    vergoedingenUrl:
      "https://www.asr.nl/verzekeringen/zorgverzekering/vergoedingen",
    waarTeVinden:
      "a.s.r. heeft een vergoedingenvinder waarin je op behandeling zoekt, plus de polisvoorwaarden als pdf.",
    eigenaardigheid:
      "Bij a.s.r. staat de voorwaarde in de polisvoorwaarden en niet in de vergoedingenvinder. De vinder geeft je het bedrag; of je er recht op hebt hangt af van een eis die een pdf verderop staat.",
  },
];

export function insurerBySlug(slug: string): Insurer | undefined {
  return INSURERS.find((i) => i.slug === slug);
}

/**
 * Wat er bij elke verzekeraar hetzelfde is.
 *
 * DE EERSTE IS DE BELANGRIJKSTE EN STAAT NERGENS OP EEN KLINIEKSITE.
 *
 * Vrijwel elke verzekeraar stelt als voorwaarde dat de behandeling gedaan wordt door een
 * huidtherapeut die in het Kwaliteitsregister Paramedici staat. Dat is geen formaliteit
 * maar de reden dat declaraties worden afgewezen, en het is precies waarom het uitmaakt
 * wie je behandelt. Op /team staat per persoon welke titel wettelijk beschermd is.
 *
 * [BESLUIT-OKAN] of we hier expliciet mogen zeggen dat onze huidtherapeuten KP-geregistreerd
 * zijn. Dat is een harde toezegging over jullie mensen en die hoort van jullie te komen,
 * niet van mij. Zolang dat er niet staat, zegt de pagina alleen dát het een voorwaarde is
 * en dat je het aan ons mag vragen.
 */
export const ALTIJD_VRAGEN: readonly { kop: string; zin: string }[] = [
  {
    kop: "Moet de behandelaar geregistreerd zijn?",
    zin: "Bijna altijd wel. De meeste verzekeraars vergoeden alleen als de huidtherapeut in het Kwaliteitsregister Paramedici staat. Vraag ons gerust of dat bij jouw behandelaar zo is; wij weten dat en jij kunt het niet zien.",
  },
  {
    kop: "Heb ik een verwijzing nodig, en van wie?",
    zin: "Bij sommige verzekeraars van de huisarts, bij andere van een dermatoloog. Regel dat vóór de eerste afspraak. Een verwijzing achteraf laten opsturen werkt in de praktijk vrijwel nooit.",
  },
  {
    kop: "Waar komt dit uit, en hoeveel is er nog over?",
    zin: "Vaak deelt een aantal behandelingen hetzelfde jaarbudget. Vraag niet alleen wat het maximum is maar ook wat je er dit jaar al van gebruikt hebt.",
  },
  {
    kop: "Gaat dit van mijn eigen risico af?",
    zin: "Bij een vergoeding uit de aanvullende verzekering niet. Het eigen risico hoort bij de basisverzekering. Dit is het misverstand waar mensen zorg om uitstellen.",
  },
];
