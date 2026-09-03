import { kostenVraag } from "@/data/pillar-kosten";

/**
 * Inhoud van de rosacea- en couperosepagina.
 *
 * Wat deze pagina eigen maakt: rosacea is de aandoening waar triggers écht het verschil
 * maken, en waar bijna elke website een lijstje triggers plakt zonder er iets mee te doen.
 * Een lijstje helpt niemand. Wat wél helpt is de splitsing: welke van jóuw triggers kun
 * je zelf beïnvloeden, en welke niet? Want die tweede groep is precies waar behandelen
 * zin heeft. Dat is de triggersorteerder.
 *
 * Tweede eigen keuze: rosacea wordt structureel verward met acne, en als acne behandeld
 * maakt het het erger. Dat staat hier vooraan in plaats van als voetnoot.
 *
 * Derde: het woord dat er moet staan. Rosacea gaat niet weg. Het is te beheersen. Wie
 * anders belooft, verkoopt iets (A7).
 *
 * COPY-STATUS: concept in de Diba-stem. Medische beweringen gemarkeerd voor Rojda.
 */

export type TriggerGroep = "beinvloedbaar" | "niet-beinvloedbaar";

export type Trigger = {
  readonly id: string;
  readonly naam: string;
  readonly groep: TriggerGroep;
  /** Waarom deze trigger doet wat hij doet. */
  readonly waarom: string;
};

/**
 * De sortering is het punt van deze sectie. "Beïnvloedbaar" betekent niet "jouw schuld";
 * het betekent dat er een knop is. Bij de rest is behandelen de knop.
 */
export const ROSACEA_TRIGGERS: readonly Trigger[] = [
  {
    id: "alcohol",
    naam: "Alcohol",
    groep: "beinvloedbaar",
    waarom:
      "Verwijdt de bloedvaten direct. Rode wijn doet dit bij de meeste mensen het snelst.",
  },
  {
    id: "pittig",
    naam: "Pittig eten",
    groep: "beinvloedbaar",
    waarom:
      "Capsaïcine zet dezelfde vaatreactie in gang als warmte. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    id: "hete-dranken",
    naam: "Hete koffie of thee",
    groep: "beinvloedbaar",
    waarom:
      "Niet de cafeïne maar de temperatuur. Laten afkoelen scheelt al veel.",
  },
  {
    id: "cosmetica",
    naam: "Producten met alcohol of parfum",
    groep: "beinvloedbaar",
    waarom:
      "Prikkelen een huid die al overactief reageert. Vaak de stille dader.",
  },
  {
    id: "sauna",
    naam: "Sauna of hete douche",
    groep: "beinvloedbaar",
    waarom:
      "Warmte is de sterkste trigger die er is. Lauw douchen voelt zuur maar werkt.",
  },
  {
    id: "zon",
    naam: "Zon",
    groep: "niet-beinvloedbaar",
    waarom:
      "Je kunt beschermen maar niet vermijden. Bij rosacea is UV zowel trigger als versneller. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    id: "weer",
    naam: "Kou en wind",
    groep: "niet-beinvloedbaar",
    waarom:
      "Nederlands weer. De overgang van buiten naar binnen is erger dan de kou zelf.",
  },
  {
    id: "stress",
    naam: "Stress",
    groep: "niet-beinvloedbaar",
    waarom:
      "Wel te beperken, niet uit te zetten. En de roodheid zelf geeft stress, dus het draait rond.",
  },
  {
    id: "hormonen",
    naam: "Hormonen",
    groep: "niet-beinvloedbaar",
    waarom:
      "Cyclus en overgang beïnvloeden de vaatreactie. Hier ligt de knop bij je arts, niet bij een crème. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    id: "sport",
    naam: "Inspanning",
    groep: "niet-beinvloedbaar",
    waarom:
      "Stoppen met sporten is geen advies dat wij geven. We kijken naar timing en koeling.",
  },
] as const;

export type Lezing = {
  readonly kop: string;
  readonly tekst: string;
  readonly waarDeKnopZit: string;
};

/**
 * De lezing hangt af van de verhouding tussen de twee groepen, niet van het aantal.
 * Dat is waar de klinische waarde zit: waar ligt bij jou de hefboom?
 */
export function leesTriggers(gekozen: readonly string[]): Lezing {
  if (gekozen.length === 0) {
    return {
      kop: "Tik aan wat jou rood maakt",
      tekst:
        "Kies alles wat je herkent. Het gaat om de verhouding: hoeveel van jouw triggers kun je zelf beïnvloeden?",
      waarDeKnopZit:
        "Weet je het niet precies? Houd het twee weken bij. Dat levert meer op dan welke test dan ook.",
    };
  }

  const gekozenTriggers = ROSACEA_TRIGGERS.filter((t) =>
    gekozen.includes(t.id),
  );
  const beinvloedbaar = gekozenTriggers.filter(
    (t) => t.groep === "beinvloedbaar",
  ).length;
  const rest = gekozenTriggers.length - beinvloedbaar;

  if (rest === 0) {
    return {
      kop: "Al jouw triggers hebben een knop",
      tekst:
        "Alles wat je aantikte kun je zelf beïnvloeden. Dat is gunstig: bij dit patroon zien we vaak dat gewoontes meer opleveren dan behandelen, en soms is behandelen dan niet eens nodig.",
      waarDeKnopZit:
        "We beginnen met uitzoeken welke van deze de grootste is. Vaak zijn het één of twee, niet alle vijf. Behandelen houden we achter de hand.",
    };
  }

  if (beinvloedbaar === 0) {
    return {
      kop: "Jouw triggers zijn niet te vermijden",
      tekst:
        "Zon, weer, stress, hormonen, inspanning. Dit is de groep waarbij goed advies niet genoeg is, want je kunt je leven niet eromheen bouwen. Precies hier heeft behandelen van de vaatjes zin.",
      waarDeKnopZit:
        "Bij dit patroon richten we ons op de bloedvaten zelf, niet op jouw gedrag. Dan wordt de reactie minder heftig terwijl de trigger hetzelfde blijft. [MEDISCHE-CHECK-ROJDA]",
    };
  }

  if (beinvloedbaar >= rest) {
    return {
      kop: "Bij jou zit de hefboom vooral in gewoontes",
      tekst: `Je tikte ${beinvloedbaar} trigger${beinvloedbaar === 1 ? "" : "s"} aan die je kunt beïnvloeden en ${rest} die je niet kunt vermijden. Bij die verhouding is het eerlijkste advies: begin met de eerste groep voordat je geld aan behandelingen uitgeeft.`,
      waarDeKnopZit:
        "We maken een korte lijst van wat je aanpast, en meten na zes weken. Werkt dat genoeg, dan hoef je hier niet terug te komen.",
    };
  }

  return {
    kop: "Een gemengd patroon, het meest voorkomend",
    tekst: `Je hebt ${beinvloedbaar} trigger${beinvloedbaar === 1 ? "" : "s"} met een knop en ${rest} zonder. Dan werkt één ding alleen niet: gewoontes halen de pieken eraf, behandelen verlaagt de basis.`,
    waarDeKnopZit:
      "Twee sporen naast elkaar. Eerst de beïnvloedbare triggers eruit halen, daarna meten hoeveel roodheid er overblijft. Dat overblijvende deel is wat we behandelen.",
  };
}

/* ── De soorten ────────────────────────────────────────────────────────── */

export type RosaceaSoort = {
  readonly id: string;
  readonly naam: string;
  readonly klanttaal: string;
  readonly vakterm: string;
  readonly watJeZiet: string;
  readonly watHetBetekent: string;
  readonly aanpak: string;
  readonly verwarring: string;
};

export const ROSACEA_SOORTEN: readonly RosaceaSoort[] = [
  {
    id: "flushing",
    naam: "Blozen dat blijft hangen",
    klanttaal: "Je wordt snel rood en het trekt langzamer weg dan bij anderen",
    vakterm: "flushing",
    watJeZiet:
      "Golven van roodheid over wangen, neus en voorhoofd. In het begin trekt het weg, later blijft er een basis achter.",
    watHetBetekent:
      "De vaatreactie is overactief maar er is nog geen blijvende schade. Dit is het beste moment om in te grijpen. [MEDISCHE-CHECK-ROJDA]",
    aanpak:
      "Triggers in kaart, en pas daarna kijken of de vaatjes behandeling nodig hebben. Vaak is dit het stadium met de minste sessies.",
    verwarring:
      "Dit is geen gevoelige huid door verkeerde producten. Het is een vaatreactie, en die verandert niet door een andere crème.",
  },
  {
    id: "couperose",
    naam: "Zichtbare adertjes",
    klanttaal: "Kleine rode lijntjes op je wangen of naast je neus",
    vakterm: "teleangiëctasieën, couperose",
    watJeZiet:
      "Dunne, permanent zichtbare bloedvaatjes. Ze verdwijnen niet als je erop drukt en gaan van zichzelf niet weg.",
    watHetBetekent:
      "Deze vaatjes zijn blijvend verwijd. Ze reageren goed op behandeling, maar nieuwe kunnen ontstaan zolang de triggers doorgaan. [MEDISCHE-CHECK-ROJDA]",
    aanpak:
      "Dit is het beeld waar behandeling het meest oplevert. We meten eerst hoeveel er zichtbaar is, zodat je het verschil later niet hoeft te geloven.",
    verwarring:
      "Couperose is niet hetzelfde als rosacea, ook al lopen ze vaak samen. Je kunt de adertjes hebben zonder de rest.",
  },
  {
    id: "papulopustuleus",
    naam: "Rode bultjes op een rode ondergrond",
    klanttaal:
      "Puistjes die eruitzien als acne, maar op een huid die al rood is",
    vakterm: "papulopustuleuze rosacea",
    watJeZiet:
      "Bultjes en puskopjes, maar zonder mee-eters. Dat laatste is het onderscheid met acne.",
    watHetBetekent:
      "Dit hoort bij de arts. Er is medicatie voor die goed werkt, en wij werken daarnaast. [MEDISCHE-CHECK-ROJDA]",
    aanpak:
      "We verwijzen door en stemmen af. Behandelen wij dit als acne, dan wordt het erger, dus dat doen we niet.",
    verwarring:
      "Zonder mee-eters gaat het bijna nooit om acne. Dat is het snelste onderscheid dat je zelf kunt maken.",
  },
  {
    id: "verdikking",
    naam: "Verdikte huid op de neus",
    klanttaal: "De huid van je neus wordt dikker en de poriën groter",
    vakterm: "rhinophyma",
    watJeZiet:
      "Een geleidelijk dikkere neus met grovere poriën, vooral bij mannen.",
    watHetBetekent:
      "Een gevorderd stadium waarbij bindweefsel is toegenomen. Dit hoort bij de dermatoloog. [MEDISCHE-CHECK-ROJDA]",
    aanpak:
      "Hier verwijzen we door, omdat de juiste behandeling buiten onze praktijk ligt.",
    verwarring:
      "Dit heeft niets met alcohol te maken, hoe hardnekkig dat verhaal ook is. Dat vooroordeel zit veel mensen jaren in de weg. [MEDISCHE-CHECK-ROJDA]",
  },
] as const;

export const ROSACEA_WEL_NIET = {
  wel: [
    "Twee weken je triggers bijhouden voordat je iets koopt. Dit is gratis en levert het meeste op",
    "Zonbescherming, elke dag. Bij rosacea is UV zowel trigger als versneller",
    "Lauw douchen en je gezicht lauw afspoelen. Onaantrekkelijk advies, groot effect",
    "Producten zonder alcohol en parfum, en niet meer dan drie stappen",
    "Doorverwijzen naar de arts als er bultjes bij komen",
  ],
  niet: [
    "Behandelen als acne. Scrubs en uitdrogende middelen maken rosacea aantoonbaar erger",
    "Sauna, hete douche en stomen. Warmte is de sterkste trigger die er is",
    "Steeds nieuwe producten proberen. Elke wisseling is weer een prikkel voor een huid die al overreageert",
    "Camoufleren met een dikke laag en dan niet reinigen. Dat levert een tweede probleem op",
    "Verwachten dat het weggaat. Rosacea is te beheersen, niet te genezen, en dat zeggen we liever nu",
  ],
} as const;

export const ROSACEA_WIJ_DOEN_NIET = [
  {
    titel: "Geen belofte dat het weggaat",
    tekst:
      "Rosacea is een chronische aandoening. Beheersing is het doel en dat noemen wij geen mislukking. Genezing beloven we daarom niet. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    titel: "Geen acnebehandeling op rosacea",
    tekst:
      "De twee lijken op elkaar en vragen een andere behandeling. Twijfelen we, dan overleggen we eerst met je huisarts en verwijzen we door voor de diagnose.",
  },
  {
    titel: "Geen behandeling tijdens een opvlamming",
    tekst:
      "Bij een actieve opvlamming wachten we. Behandelen in die fase geeft meer roodheid in plaats van minder, ook als je er speciaal voor kwam.",
  },
] as const;

export const ROSACEA_FAQ = [
  {
    vraag: "Gaat mijn rosacea weg?",
    antwoord:
      "Nee, rosacea is chronisch. Wat wél kan: minder opvlammingen, minder zichtbare adertjes en een rustiger basiskleur. Bij de meeste mensen is dat een groot verschil in hoe ze zich voelen. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Hoe weet ik of het rosacea is en niet acne?",
    antwoord:
      "Het snelste onderscheid: bij acne zitten er mee-eters, bij rosacea niet. Rosacea zit ook meer in het midden van je gezicht en gaat samen met blozen. Zeker weten doe je het pas na een beoordeling. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Moet ik stoppen met wijn en pittig eten?",
    antwoord:
      "Dat is jouw keuze, niet ons voorschrift. We vertellen je wel wat het doet, en dan bepaal jij wat je ervoor over hebt. Bij sommige mensen scheelt het veel, bij andere weinig.",
  },
  {
    vraag: "Helpt laser tegen de adertjes?",
    antwoord:
      "Bij zichtbare vaatjes levert behandeling doorgaans het meeste op van alles wat we doen. Nieuwe vaatjes kunnen wel ontstaan zolang de triggers doorgaan, dus onderhoud hoort erbij. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Mag ik nog sporten?",
    antwoord:
      "Ja. Stoppen met sporten is geen advies dat wij geven. We kijken naar timing, koeling en wat je erna doet.",
  },
  {
    vraag: "Ik schaam me ervoor dat ik zo snel rood word.",
    antwoord:
      "Dat horen we vaak, en het is de reden dat mensen jaren wachten. Je hoeft hier niets uit te leggen. We kijken naar je huid en niet naar je gedrag.",
  },
  kostenVraag(),
] as const;
