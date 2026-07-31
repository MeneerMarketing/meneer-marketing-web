/**
 * Inhoud van de pagina over moedervlekken.
 *
 * Dit is de enige pagina op de site waar élke uitkomst buiten de kliniek eindigt. Wij
 * beoordelen geen moedervlekken en verwijderen ze niet, want dat hoort bij de huisarts of
 * de dermatoloog. Een huidkliniek die dat wel doet neemt een beslissing waar ze niet voor
 * opgeleid is, en de fout die daarbij gemaakt kan worden is niet terug te draaien.
 *
 * De ABCDE-check hieronder is voorlichting en geen diagnose. Daarom is hij zo gebouwd dat
 * hij nooit geruststelt: bij nul opvallende punten is de uitkomst nog steeds dat een
 * zelfcheck geen arts vervangt. Er is geen antwoordcombinatie die "het is niets" zegt, en
 * er staat op geen enkel punt een knop naar onze intake.
 *
 * COPY-STATUS: concept. Elk medisch punt moet langs Rojda voordat dit online mag, ook de
 * criteria zelf. Geen cijfers over hoe vaak iets voorkomt of hoe groot een kans is.
 */

export type Criterium = {
  readonly letter: string;
  readonly naam: string;
  readonly vraag: string;
  readonly rustig: string;
  readonly opvallend: string;
  readonly uitleg: string;
};

export const ABCDE: readonly Criterium[] = [
  {
    letter: "A",
    naam: "Asymmetrie",
    vraag: "Vouw het plekje in gedachten dubbel. Passen de twee helften op elkaar?",
    rustig: "De helften lijken op elkaar",
    opvallend: "De ene helft is duidelijk anders dan de andere",
    uitleg:
      "Een rustige moedervlek groeit gelijkmatig uit één punt en is daardoor meestal ongeveer symmetrisch. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    letter: "B",
    naam: "Begrenzing",
    vraag: "Kijk naar de rand. Is die glad en duidelijk, of rafelig en vaag?",
    rustig: "Een gladde, duidelijke rand",
    opvallend: "Rafelig, hoekig of uitlopend in de huid",
    uitleg:
      "De overgang naar de gewone huid zegt iets over hoe de vlek zich gedraagt aan de randen. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    letter: "C",
    naam: "Kleur",
    vraag: "Heeft het plekje één kleur, of meerdere tinten door elkaar?",
    rustig: "Overal ongeveer dezelfde kleur",
    opvallend: "Meerdere tinten, of zwart, rood of wit erin",
    uitleg:
      "Verschillende kleuren binnen één plekje zijn een van de bekendste redenen om het te laten nakijken. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    letter: "D",
    naam: "Doorsnede",
    vraag: "Is het plekje groter dan een gum op een potlood, ongeveer zes millimeter?",
    rustig: "Kleiner dan ongeveer zes millimeter",
    opvallend: "Groter dan ongeveer zes millimeter",
    uitleg:
      "Grootte op zichzelf zegt weinig. Het telt vooral mee naast de andere punten, en een klein plekje dat verandert is belangrijker dan een groot plekje dat al jaren hetzelfde is. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    letter: "E",
    naam: "Evolutie",
    vraag:
      "Is er de afgelopen maanden iets veranderd aan vorm, kleur, grootte of gevoel? Denk ook aan jeuk, bloeden of een korstje dat niet weggaat.",
    rustig: "Zover ik weet niets veranderd",
    opvallend: "Ja, er is iets veranderd",
    uitleg:
      "Dit is het belangrijkste punt van de vijf. Verandering weegt zwaarder dan hoe het plekje eruitziet, ook als de andere vier je niets opvallends laten zien. [MEDISCHE-CHECK-ROJDA]",
  },
] as const;

/** De zesde vraag die op de meeste sites ontbreekt. */
export const LELIJK_EENDJE = {
  naam: "Het lelijke eendje",
  vraag:
    "Leg dit plekje naast je andere moedervlekken. Lijkt het op de rest, of valt het eruit?",
  rustig: "Het lijkt op mijn andere plekjes",
  opvallend: "Het wijkt duidelijk af van de rest",
  uitleg:
    "De moedervlekken van één persoon lijken meestal op elkaar. Eentje die er duidelijk uitspringt is daarom de moeite van het nakijken waard, ook als hij op zichzelf niets bijzonders lijkt. [MEDISCHE-CHECK-ROJDA]",
} as const;

export const UITKOMST_GEEN = {
  kop: "Ook nu geldt: dit is geen uitslag",
  tekst:
    "Je gaf op geen enkel punt iets opvallends aan. Dat is geen geruststelling die wij mogen geven, want een zelfcheck kan niet zien wat een arts met een dermatoscoop wel ziet. Blijf kijken, en ga langs zodra er iets verandert.",
  advies:
    "Twijfel je alsnog, of blijft het knagen? Ga dan gewoon. Dat kost een consult en het scheelt maanden piekeren.",
} as const;

export const UITKOMST_WEL = {
  kop: "Laat dit nakijken door je huisarts",
  tekst:
    "Je gaf hierboven iets opvallends aan. Dat betekent niet dat er iets mis is, en het is ook niet aan ons om dat te beoordelen. Het betekent dat iemand met de juiste opleiding en de juiste apparatuur ernaar hoort te kijken.",
  advies:
    "Maak een afspraak bij je huisarts en noem welke punten je opvielen. Die kan doorverwijzen naar een dermatoloog als dat nodig is.",
} as const;

/* ── De rest van de pagina ─────────────────────────────────────────────── */

export const MOEDERVLEK_WEL_NIET = {
  wel: [
    "Eén keer per maand zelf kijken, het liefst op hetzelfde moment. Het gaat om verandering, en die zie je alleen als je een beeld in je hoofd hebt.",
    "Foto's maken van plekjes die je in de gaten houdt, van dichtbij en met iets ernaast voor de schaal.",
    "Ook kijken waar je niet vanzelf kijkt: je rug, je hoofdhuid, tussen je tenen en onder je nagels.",
    "Bij twijfel naar de huisarts. Dat is geen overdreven reactie maar precies waar die voor is.",
    "Zonbescherming serieus nemen, want dit is het onderwerp waarbij het niet om je uiterlijk gaat.",
  ],
  niet: [
    "Een moedervlek laten weghalen bij een schoonheidssalon of huidkliniek. Wat weg is kan niet meer onderzocht worden.",
    "Zelf wegbranden of wegvriezen met iets uit de winkel. Hetzelfde bezwaar, met meer schade.",
    "Wachten tot het pijn doet. De meeste verdachte plekjes doen nergens pijn.",
    "Afgaan op een foto-app of een oordeel van internet. Ook wij kunnen dat niet en dat zeggen we liever.",
    "Denken dat het alleen om je gezicht gaat. Plekjes op rug, benen en voetzolen worden het vaakst over het hoofd gezien. [MEDISCHE-CHECK-ROJDA]",
  ],
} as const;

export const MOEDERVLEK_WIJ_DOEN_NIET = [
  {
    titel: "Wij beoordelen geen moedervlekken",
    tekst:
      "We kijken niet mee, we geven geen mening en we stellen niemand gerust. Daar is een dermatoscoop voor nodig en een opleiding die wij niet hebben.",
  },
  {
    titel: "Wij verwijderen geen moedervlekken",
    tekst:
      "Ook niet als je er alleen maar vanaf wilt omdat hij in de weg zit. Wat weg is kan niet meer onderzocht worden, en dat risico is niet aan ons om te nemen.",
  },
  {
    titel: "Wij laseren niet over een moedervlek heen",
    tekst:
      "Bij elke behandeling dekken we moedervlekken af. Licht op pigment kan het beeld veranderen, en dan is het latere oordeel van een arts minder betrouwbaar. [MEDISCHE-CHECK-ROJDA]",
  },
] as const;

export const MOEDERVLEK_FAQ = [
  {
    vraag: "Waarom staat deze pagina er dan überhaupt?",
    antwoord:
      "Omdat mensen ons dit vragen tijdens een behandeling, en omdat je bij ons op de behandelstoel ligt met je huid in beeld. Wij willen dat je weet waar je op let en waar je heen moet, ook al zijn wij het niet.",
  },
  {
    vraag: "Kan ik bij jullie een moedervlek laten weghalen?",
    antwoord:
      "Nee. Niet bij een verdacht plekje en ook niet bij eentje waar je alleen maar vanaf wilt. Dat gaat naar de huisarts, die kan het zelf doen of doorverwijzen.",
  },
  {
    vraag: "Ik heb een behandeling gepland en er zit een moedervlek in het gebied.",
    antwoord:
      "Dan dekken we die af. Dat kost een halve minuut en het scheelt dat een arts later nog kan beoordelen wat er zit. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Krijg ik nieuwe moedervlekken van zonnen?",
    antwoord:
      "Zonlicht speelt een rol bij het ontstaan van nieuwe plekjes en bij het risico op huidkanker. Hoe groot die rol precies is verschilt per persoon en dat is niet iets waar wij een getal aan hangen. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Hoe vaak moet ik zelf kijken?",
    antwoord:
      "Eén keer per maand is een veelgebruikt advies en vooral praktisch: vaak genoeg om verandering op te merken, zeldzaam genoeg om vol te houden. Vraag je huisarts wat in jouw geval verstandig is. [MEDISCHE-CHECK-ROJDA]",
  },
] as const;
