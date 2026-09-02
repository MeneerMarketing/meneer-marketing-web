import { kostenVraag } from "@/data/pillar-kosten";

/**
 * Inhoud van de pagina over gerstekorrels en milia.
 *
 * WAAROM DEZE PAGINA MEER IS DAN EEN ZOEKTERM.
 *
 * Omdat "gerstekorrel" in de volksmond en in de spreekkamer twee verschillende dingen
 * betekent, en dat verschil ertoe doet.
 *
 * Wat mensen bedoelen zijn meestal milia: harde witte bolletjes onder het ooglid of op de
 * wang, die niet rood zijn, geen pijn doen en die je niet kunt uitdrukken. Onschuldig, en
 * met een steriele naaldprik in een paar tellen weg.
 *
 * Een gerstekorrel in medische zin is iets anders: een ontstoken kliertje aan de ooglidrand
 * dat rood is, pijn doet en vaak vanzelf overgaat. Dat is geen huidbehandeling maar een
 * kwestie voor de huisarts.
 *
 * Iemand die met een pijnlijk rood bultje bij een huidkliniek aanklopt omdat hij het
 * "gerstekorrel" noemt, hoort dat te lezen voordat hij een afspraak maakt. Vandaar dat het
 * eerste onderscheid op deze pagina niet cosmetisch is maar medisch.
 *
 * MEDISCH.
 *
 * Alles wat een bewering doet is gemarkeerd voor Rojda. Behandeling rond het oog is
 * gevoelig terrein en de grenzen hieronder zijn met opzet strak.
 */

export type BolletjeBeeld = {
  readonly id: string;
  readonly naam: string;
  readonly klanttaal: string;
  readonly vakterm: string;
  readonly zelfcheck: string;
  readonly watHetIs: string;
  readonly watWijDoen: string;
  readonly binnenBereik: boolean;
};

export const BOLLETJE_BEELDEN: readonly BolletjeBeeld[] = [
  {
    id: "milia",
    naam: "Hard wit bolletje",
    klanttaal:
      "Een wit korreltje onder je oog of op je wang dat er al maanden zit",
    vakterm: "milium, meervoud milia",
    zelfcheck:
      "Is het wit of geelwit, niet rood, doet het geen pijn, en lukt het niet om er iets uit te knijpen?",
    watHetIs:
      "Een piepklein cystje met keratine, ingesloten onder de opperhuid. Er zit geen opening naartoe, en daarom knijpen niet werkt. [MEDISCHE-CHECK-ROJDA]",
    watWijDoen:
      "Openen met een steriele naald en de inhoud eruit lichten. Dat duurt per bolletje enkele seconden en er blijft niets van te zien. [MEDISCHE-CHECK-ROJDA]",
    binnenBereik: true,
  },
  {
    id: "strontje",
    naam: "Rood, pijnlijk bultje op de ooglidrand",
    klanttaal: "Een pijnlijke rode zwelling aan de rand van je ooglid",
    vakterm: "hordeolum, in de volksmond strontje of gerstekorrel",
    zelfcheck:
      "Is het rood, warm en gevoelig, en is het in dagen ontstaan in plaats van in maanden?",
    watHetIs:
      "Een ontstoken kliertje aan de ooglidrand. Dit is wat een gerstekorrel medisch gezien is, en het is iets heel anders dan een wit korreltje. [MEDISCHE-CHECK-ROJDA]",
    watWijDoen:
      "Niets. Dit hoort bij je huisarts en gaat vaak vanzelf over met warme kompressen. Wij prikken hier niet in. [MEDISCHE-CHECK-ROJDA]",
    binnenBereik: false,
  },
  {
    id: "chalazion",
    naam: "Vast knobbeltje in het ooglid",
    klanttaal: "Een stevig bultje in je ooglid dat weken blijft zitten",
    vakterm: "chalazion",
    zelfcheck:
      "Zit het in het ooglid zelf in plaats van eronder, voelt het stevig aan, en is het niet of nauwelijks pijnlijk?",
    watHetIs:
      "Een verstopt talgkliertje in het ooglid dat is ingekapseld. Anders dan een strontje doet het meestal geen pijn, en het blijft langer zitten. [MEDISCHE-CHECK-ROJDA]",
    watWijDoen:
      "Ook hier niets. Dit hoort bij de huisarts of oogarts, die zo nodig doorverwijst. [MEDISCHE-CHECK-ROJDA]",
    binnenBereik: false,
  },
  {
    id: "mee-eter",
    naam: "Zwart of donker puntje",
    klanttaal: "Een klein donker puntje in een porie",
    vakterm: "open comedo, mee-eter",
    zelfcheck:
      "Is de bovenkant donker in plaats van wit, en zie je een opening in de huid?",
    watHetIs:
      "Geen milium maar een verstopte porie die wél openstaat. Het donker is geoxideerd talg en geen vuil. [MEDISCHE-CHECK-ROJDA]",
    watWijDoen:
      "Dit hoort bij de aanpak van onzuiverheden en niet bij een naaldprik. Zit er meer, dan is de acnepagina de betere ingang.",
    binnenBereik: false,
  },
];

export const GERSTEKORRELS_WEL_NIET = {
  wel: [
    "Eerst vaststellen of het een wit korreltje is of een ontsteking, want dat scheelt de huisarts of ons",
    "Milia openen met een steriele naald, per stuk, in een behandeling van minuten [MEDISCHE-CHECK-ROJDA]",
    "Kijken of er een aanleiding is: te rijke oogcrème, zonschade, of iets dat de huid heeft beschadigd [MEDISCHE-CHECK-ROJDA]",
    "Doorsturen naar de huisarts bij alles wat rood, pijnlijk of warm is",
  ],
  niet: [
    "Prikken in iets dat ontstoken is. Rond het oog is dat een risico dat nergens voor nodig is [MEDISCHE-CHECK-ROJDA]",
    "Zelf uitknijpen. Er zit geen opening in, dus je duwt alleen de huid eromheen kapot",
    "Een crème adviseren als verwijdering Een crème opent een ingesloten gerstekorrel niet.",
    "Onnodig meerdere afspraken plannen Een gerstekorrel verwijderen is meestal een eenmalige behandeling.",
  ],
} as const;

export const GERSTEKORRELS_WIJ_DOEN_NIET = [
  {
    titel: "Niets rond het oog dat rood of pijnlijk is",
    tekst:
      "Een ontstoken kliertje aan de ooglidrand hoort bij de huisarts, en gaat vaak vanzelf over. Wij prikken daar niet in; de kans op verergering is klein maar de plek is te belangrijk om die kans te nemen. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    titel: "Geen behandeling van iets dat we niet herkennen",
    tekst:
      "Is het geen milium en geen mee-eter, dan gaan we niet raden. Dan kijkt eerst iemand anders ernaar, ook als je er speciaal voor gekomen bent.",
  },
];

export const GERSTEKORRELS_FAQ = [
  {
    vraag: "Waarom kan ik een milium niet uitdrukken?",
    antwoord:
      "Omdat er geen opening naartoe is. Een mee-eter heeft een poriegang naar buiten; een milium zit volledig ingesloten onder een laagje huid. Knijpen beschadigt daarom alleen het weefsel eromheen. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Doet het pijn om ze te laten verwijderen?",
    antwoord:
      "Je voelt een prikje per bolletje, vergelijkbaar met een splinter eruit halen. Er is geen verdoving nodig en je kunt daarna gewoon weg. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Komen ze terug?",
    antwoord:
      "De behandelde bolletjes niet. Wel kunnen er nieuwe ontstaan, en dan kijken we of er een aanleiding is: bij sommige mensen is dat een te rijke oogcrème, bij anderen jarenlange zonschade. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Hoeveel kunnen er in een keer?",
    antwoord:
      "Meestal alles wat er zit, in een afspraak. Zijn het er veel, dan spreiden we het soms om de huid rust te geven. Dat hoor je vooraf en niet halverwege. [MEDISCHE-CHECK-ROJDA]",
  },
  kostenVraag(),
];

/**
 * Wat er in de afspraak gebeurt.
 *
 * Bij milia is de grootste drempel niet de prijs of de tijd maar het beeld van een naald
 * naast een oog. Dat beeld wordt niet kleiner door er omheen te praten, dus staat er
 * precies wat er gebeurt en hoe lang het duurt. Wie het dan nog eng vindt, weet tenminste
 * waarvan.
 */
export const AFSPRAAK_STAPPEN: readonly {
  readonly kop: string;
  readonly tekst: string;
}[] = [
  {
    kop: "Eerst kijken, met vergroting",
    tekst:
      "We bekijken elk bolletje van dichtbij. Zit er iets tussen dat geen milium is, dan hoor je dat nu en niet halverwege.",
  },
  {
    kop: "Een prikje per bolletje",
    tekst:
      "De huid erboven wordt met een steriele naald geopend en de inhoud eruit gelicht. Per bolletje enkele seconden, en je voelt een prikje zoals bij een splinter.",
  },
  {
    kop: "Klaar, en je kunt weg",
    tekst:
      "Er is geen verdoving, geen pleister en geen hersteltijd. Soms is er een paar uur een rood puntje te zien, en daarna niets meer.",
  },
];
