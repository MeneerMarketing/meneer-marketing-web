/**
 * De doelgroeppagina's.
 *
 * WAAROM DEZE VIER PAGINA'S EEN GEDEELDE VORM HEBBEN EN GEEN GEDEELDE INHOUD.
 *
 * "Huidzorg voor mannen" is meestal dezelfde pagina als de gewone, met een grijzere foto
 * erboven. Dat is precies wat hier niet moet gebeuren. De eerlijke opzet is de omgekeerde:
 * per groep staat er wat er écht anders is, en daarnaast even nadrukkelijk wat er níet
 * anders is. Die tweede kolom is meestal de langste, en dat is het punt.
 *
 * Vandaar de vorm die deze vier delen en die nergens anders op de site voorkomt: twee
 * kolommen naast elkaar, anders en niet anders, met bij elk punt de reden erbij.
 *
 * [MEDISCHE-CHECK-ROJDA] elk punt onder `anders` en elk punt onder `melden`.
 */

export type DoelgroepPunt = {
  readonly kop: string;
  readonly zin: string;
};

export type Doelgroep = {
  readonly slug: string;
  readonly titel: string;
  readonly meta: string;
  readonly korteOmschrijving: string;
  /** De belofte van de pagina in één zin, boven de vouw. */
  readonly kernzin: string;
  readonly anders: readonly DoelgroepPunt[];
  readonly nietAnders: readonly DoelgroepPunt[];
  /** Wat je bij het maken van de afspraak moet zeggen. */
  readonly melden: readonly string[];
  /** Waar deze groep het beste kan beginnen. */
  readonly begin: { readonly label: string; readonly href: string };
};

export const DOELGROEPEN: readonly Doelgroep[] = [
  {
    slug: "jongeren",
    titel: "Huidzorg voor *jongeren*",
    meta: "Jongeren",
    korteOmschrijving:
      "Acne in de puberteit is een fase, geen fout. Wat er nu telt is voorkomen dat er littekens van overblijven.",
    kernzin:
      "Op jouw leeftijd werkt de tijd in je voordeel: wat je nu voorkomt, hoef je later niet te herstellen.",
    anders: [
      {
        kop: "Er is meer te winnen met vroeg beginnen",
        zin: "Actieve ontstekingen kunnen putjes achterlaten. Die zijn later moeilijker en duurder te behandelen dan de acne zelf, en daarom pak je het nu aan.",
      },
      {
        kop: "De aanjager is hormonaal",
        zin: "In de puberteit maakt je huid meer talg aan. Dat komt door hormonen, en daar stemmen we de behandeling op af.",
      },
      {
        kop: "Onder de zestien beslist een ouder mee",
        zin: "Tot je twaalfde beslissen je ouders, tussen twaalf en zestien beslissen jullie samen, en vanaf zestien beslis je zelf. Dat staat zo in de wet en niet in ons beleid.",
      },
    ],
    nietAnders: [
      {
        kop: "Je huid werkt hetzelfde",
        zin: "Dezelfde lagen, dezelfde reactie op een peeling of op needling. Er bestaat geen jongerenversie van een behandeling.",
      },
      {
        kop: "Je krijgt hetzelfde eerlijke antwoord",
        zin: "Ook als dat is dat je beter even kunt wachten, of dat je bij de huisarts meer opschiet.",
      },
      {
        kop: "Dezelfde prijzen",
        zin: "Wat een sessie kost staat op de tarievenpagina en verandert niet met je leeftijd.",
      },
    ],
    melden: [
      "Of je medicatie gebruikt voor je acne, en welke",
      "Of er in je familie littekens zijn die dik worden en doorgroeien",
      "Je leeftijd, zodat we weten wie er mee moet beslissen",
    ],
    begin: { label: "Wat er bij acne gebeurt", href: "/huidproblemen/acne" },
  },
  {
    slug: "mannen",
    titel: "Huidzorg voor *mannen*",
    meta: "Mannen",
    korteOmschrijving:
      "Dikkere huid, meer talg, en één dagelijkse prikkel die de rest niet heeft: scheren.",
    kernzin:
      "Wat er anders is aan een mannenhuid is met de vinger aan te wijzen, en het is korter dan een aparte behandellijn rechtvaardigt.",
    anders: [
      {
        kop: "De huid is gemiddeld dikker en vetter",
        zin: "Meer talgklieren en een stevigere structuur. Dat verandert de instelling van een behandeling, niet de behandeling zelf.",
      },
      {
        kop: "Scheren is een dagelijkse prikkel",
        zin: "Elke dag de bovenste laag eraf halen is iets wat de meeste huiden niet meemaken. Dat telt mee bij het plannen van een peeling of laser in het baardgebied.",
      },
      {
        kop: "Ingegroeide haren in de baardlijn",
        zin: "Bij krullend haar buigt de punt terug de huid in en ontstaat er een bultje dat op een puistje lijkt. De aanpak daarvan is een andere dan die van acne, en dat verschil is met het blote oog lastig te zien.",
      },
    ],
    nietAnders: [
      {
        kop: "Pigment, roodheid en veroudering",
        zin: "Die werken precies hetzelfde. Er is geen mannenversie van een pigmentvlek.",
      },
      {
        kop: "Dezelfde apparatuur en dezelfde instellingen",
        zin: "De instelling volgt je huidtype en je haargroei, niet je geslacht.",
      },
      {
        kop: "Dezelfde volgorde",
        zin: "Ook hier begint het met een beoordeling van je huid, ook als je haast hebt.",
      },
    ],
    melden: [
      "Hoe vaak je scheert en waarmee",
      "Of je last hebt van ingegroeide haren, en waar",
      "Of je buiten werkt of veel in de zon bent",
    ],
    begin: { label: "Hoe laserontharing werkt", href: "/laserontharing" },
  },
  {
    slug: "huid-van-kleur",
    titel: "Huid van *kleur*",
    meta: "Huid van kleur",
    korteOmschrijving:
      "Fitzpatrick I tot en met VI kan hier terecht. Je type bepaalt niet óf iets kan, maar met welke instelling.",
    kernzin:
      "Meer melanine geeft evenveel mogelijkheden, maar de instelling luistert nauwer, en dat is precies waarom er eerst gemeten wordt.",
    anders: [
      {
        kop: "Een prikkel kan een vlek achterlaten",
        zin: "Bij meer pigment kan een ontsteking of een te heftige behandeling een donkere plek achterlaten die lang blijft zitten. Daarom werken we voorzichtig te beginnen en op te bouwen.",
      },
      {
        kop: "Bij laser doet de golflengte ertoe",
        zin: "Licht van 1064 nanometer dringt dieper door en wordt minder door de bovenste huidlaag opgenomen. Daarom heeft die golflengte de voorkeur bij donkerdere huidtypes, terwijl 755 nanometer sterker werkt bij de lichtere.",
      },
      {
        kop: "Littekens kunnen dikker worden",
        zin: "De neiging tot keloïd komt vaker voor. Behandelen kan meestal wel, en we bespreken het vooraf met je.",
      },
    ],
    nietAnders: [
      {
        kop: "De hele lijst staat open",
        zin: "Er is geen aparte, kortere lijst voor donkere huid. Er is een andere volgorde en een voorzichtiger opbouw.",
      },
      {
        kop: "Dezelfde meting vooraf",
        zin: "Je huidtype hoort vastgesteld te worden en niet ingeschat aan de balie. Dat is een van de dingen waar de huidanalyse voor is.",
      },
      {
        kop: "Dezelfde eerlijkheid",
        zin: "Kan iets bij jouw huid niet veilig, dan hoor je dat, en dan hoor je ook wat er wel kan.",
      },
    ],
    melden: [
      "Of je eerder een donkere vlek hebt gekregen na een wondje, een puistje of een behandeling",
      "Of er in je familie littekens zijn die dik worden en doorgroeien",
      "Of je huid nu gebruind is, en hoe lang geleden",
    ],
    begin: { label: "Maak je huidprofiel", href: "/huidprofiel" },
  },
  {
    slug: "bruiden",
    titel: "Huid voor je *bruiloft*",
    meta: "Bruiden",
    korteOmschrijving:
      "Er bestaat geen bruidsbehandeling. Het is dezelfde lijst, met een strakkere planning.",
    kernzin:
      "Hier staat een datum vast, en daar reken je vanaf terug. Veel mensen beginnen daar te laat mee.",
    anders: [
      {
        kop: "Je rekent terug vanaf één dag",
        zin: "Een reeks duurt maanden en resultaat komt weken na de laatste sessie. Wie drie weken van tevoren begint, boekt de hersteltijd en niet het resultaat.",
      },
      {
        kop: "Niets nieuws in de laatste weken",
        zin: "Een eerste reactie op een nieuw middel of een nieuwe behandeling wil je niet op de dag zelf ontdekken. De laatste weken zijn voor onderhoud van wat je al kent.",
      },
      {
        kop: "De zon telt mee",
        zin: "Een gebruinde huid vlak voor de bruiloft beperkt wat er nog kan, en een net behandelde huid verdraagt de zon slechter. Vakantie en behandeling wringen vaker dan mensen verwachten.",
      },
    ],
    nietAnders: [
      {
        kop: "Het zijn gewone behandelingen",
        zin: "Dezelfde peelings, dezelfde needling, dezelfde prijzen. Er komt geen toeslag op omdat er een jurk in het spel is.",
      },
      {
        kop: "Het begint met meten",
        zin: "Juist met een datum in zicht wil je weten waar je aan begint, en niet gokken met de weken die je nog hebt.",
      },
      {
        kop: "Nee blijft nee",
        zin: "Is er te weinig tijd voor wat je wil, dan zeggen we dat. Een halve reeks proppen in te weinig weken geeft de hersteltijd zonder het resultaat.",
      },
    ],
    melden: [
      "De datum, meteen bij het eerste contact",
      "Of er een vakantie of zonvakantie tussen zit, en wanneer",
      "Of je al iets gebruikt of laat doen bij iemand anders",
    ],
    begin: { label: "Plan je huidconsult", href: "/intake" },
  },
];

export function doelgroepBySlug(slug: string): Doelgroep | undefined {
  return DOELGROEPEN.find((d) => d.slug === slug);
}

export type PillarGroup = {
  readonly label: string;
  readonly slugs: readonly string[];
};

/** Hub-groepering huidproblemen — navigatie, geen duplicate content. */
export const PILLAR_GROUPS: readonly PillarGroup[] = [
  {
    label: "Onzuiverheden en poriën",
    slugs: ["acne", "porien", "huiduitslag"],
  },
  {
    label: "Pigment en kleur",
    slugs: ["pigmentvlekken", "melasma", "huidverkleuring", "donkere-kringen"],
  },
  {
    label: "Roodheid en gevoeligheid",
    slugs: ["rosacea", "gevoelige-huid", "eczeem"],
  },
  {
    label: "Veroudering en littekens",
    slugs: ["huidveroudering", "littekens", "striae", "keloiden"],
  },
  {
    label: "Overig",
    slugs: ["droge-huid", "psoriasis", "huidkanker-naevi", "symptoomzoeker"],
  },
] as const;
