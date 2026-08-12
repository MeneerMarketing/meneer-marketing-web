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
  /** Hoe je daar bij je eigen bedrag komt. */
  readonly waarTeVinden: string;
  /**
   * Waar het bij déze verzekeraar op vastloopt.
   *
   * Niet het bedrag maar de voorwaarde, want die verandert veel minder vaak en hij is
   * meestal de reden dat een declaratie wordt afgewezen.
   */
  readonly eigenaardigheid: string | null;
};

/** Wanneer ik hun pagina's heb bekeken. Staat op elke pagina, want dit veroudert. */
export const INSURERS_GEZIEN_OP = "augustus 2026";

export const INSURERS: readonly Insurer[] = [
  {
    slug: "cz",
    name: "CZ",
    vergoedingenUrl: "https://www.cz.nl/vergoedingen/huidbehandelingen",
    waarTeVinden:
      "CZ heeft per behandeling een eigen pagina: huidbehandelingen, acnebehandeling en gezichtsontharing staan los van elkaar. Je eigen bedrag zie je pas als je inlogt of de app gebruikt.",
    eigenaardigheid:
      "Omdat elke behandeling een eigen pagina en een eigen voorwaarde heeft, kan het antwoord voor acne anders zijn dan voor ontharing. Kijk dus op de pagina van jouw behandeling en niet op de algemene.",
  },
  {
    slug: "vgz",
    name: "VGZ",
    vergoedingenUrl: "https://www.vgz.nl/vergoedingen/huidbehandelingen",
    waarTeVinden:
      "VGZ zet acne, ontharen en camouflagetherapie onder één noemer huidbehandelingen. Inloggen met DigiD laat zien wat er in jouw pakket zit.",
    eigenaardigheid:
      "Bij VGZ krijg je een budget per kalenderjaar dat je over acne, camouflage en ontharen samen verdeelt. Wat je aan het een besteedt, gaat van het ander af.",
  },
  {
    slug: "menzis",
    name: "Menzis",
    vergoedingenUrl: "https://www.menzis.nl/zorg-en-vergoedingen/d/dermatologie",
    waarTeVinden:
      "Menzis werkt met vergoedingenwijzers: pdf-overzichten per jaar waarin per zorgsoort staat wat je pakket doet.",
    eigenaardigheid:
      "Menzis vraagt een verwijzing van je huisarts voor behandeling door een huidtherapeut. Regel die vóór de eerste afspraak, want achteraf lukt het bijna nooit meer.",
  },
  {
    slug: "zilveren-kruis",
    name: "Zilveren Kruis",
    vergoedingenUrl:
      "https://www.zilverenkruis.nl/consumenten/vergoedingen/krijg-ik-huidtherapie-vergoed",
    waarTeVinden:
      "Zilveren Kruis heeft een aparte pagina per onderwerp en per jaartal. Let op dat je naar het huidige jaar kijkt; oude jaargangen blijven online staan.",
    eigenaardigheid:
      "Bij Zilveren Kruis geldt één maximum voor acnebehandeling en ontharing samen, en ze stellen eisen aan de registratie van de behandelaar. Vraag dus niet alleen naar het bedrag maar ook of wij aan die eis voldoen.",
  },
  {
    slug: "onvz",
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
    name: "a.s.r.",
    vergoedingenUrl: "https://www.asr.nl/verzekeringen/zorgverzekering/vergoedingen",
    waarTeVinden:
      "a.s.r. heeft een vergoedingenvinder waarin je op behandeling zoekt, plus de polisvoorwaarden als pdf.",
    eigenaardigheid: null,
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
