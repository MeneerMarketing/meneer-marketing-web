import { INTAKE_MINUTEN } from "@/data/intake";
import {
  behandeling,
  euro,
  INTAKE_PRIJS,
  vergelijkingsrij,
  VRAAG_WAAR,
  type Landing,
} from "@/data/landings/types";

/**
 * Cosmelan en Dermamelan in Rotterdam: één pagina voor twee zoekvragen.
 *
 * WAAROM SAMEN EN NIET APART.
 *
 * Het zijn twee trajecten van hetzelfde merk, met dezelfde opzet: een masker in de kliniek en
 * zes maanden producten thuis. Wat verschilt is de sterkte en waarvoor je hem kiest. Twee
 * losse pagina's zouden voor het grootste deel hetzelfde zeggen en daarmee met elkaar
 * concurreren. Eén pagina met beide namen in de titel en een sectie over het verschil
 * beantwoordt allebei de zoekvragen, en dat verschil is precies wat iemand wil weten.
 *
 * WAAROM DE H1 GEEN PLAATSNAAM HEEFT.
 *
 * "Cosmelan en Dermamelan in Rotterdam" loopt in de kop over drie regels, en de huisregel is
 * twee. Rotterdam staat in de titel, het antwoordblok en de omschrijving; dat is waar een
 * zoekmachine hem leest.
 *
 * HET AFSPRAAKBLOK is hier anders dan op de andere pagina's. Een pigmenttraject begint met twee
 * weken voorbereiding thuis, dus het masker gaat nooit in de eerste afspraak op. Het gewone
 * blok ("dan behandelen we in dezelfde afspraak") zou hier niet kloppen.
 *
 * HET BEELD bovenaan is de uitslag van de huidscan en niet het masker. Okan vond een gezicht
 * onder een donkerbruin masker geen beeld om mee uit te nodigen (11 september 2026). Het masker
 * staat verderop, waar het uitgelegd wordt.
 *
 * GEEN REVIEWS: over pigment is in de reviews niets geschreven.
 */

const CO = behandeling("cosmelan");
const DM = behandeling("dermamelan");
const DI = behandeling("dermamelan-intimate");

export const COSMELAN_DERMAMELAN_ROTTERDAM: Landing = {
  slug: "cosmelan-dermamelan-rotterdam",
  gewijzigd: "2026-09-11",
  titel: "Cosmelan en Dermamelan Rotterdam",
  omschrijving: `Cosmelan en Dermamelan in Rotterdam: zes maanden, een masker in de kliniek en producten thuis. Voor het gezicht ${euro(CO.prijs)} tot ${euro(DM.prijs)}, inclusief producten.`,
  kruimel: "Cosmelan en Dermamelan",
  h1: { kop: "Cosmelan en", accent: "Dermamelan" },
  antwoord: `Cosmelan en Dermamelan zijn trajecten van ongeveer zes maanden tegen hardnekkig pigment: een masker in de kliniek, en daarna een vaste routine met producten thuis. Dermamelan is de sterkste van de twee en wordt vaker bij melasma ingezet. Bij Diba Clinics in Rotterdam kost Cosmelan ${euro(CO.prijs)} en Dermamelan ${euro(DM.prijs)}, inclusief de producten. [MEDISCHE-CHECK-ROJDA]`,
  feiten: [
    { kop: "Duur", waarde: "Zes maanden" },
    { kop: "Tarief", waarde: `${euro(CO.prijs)} tot ${euro(DM.prijs)}` },
    { kop: "Hersteltijd", waarde: "Dagen vervellen" },
    { kop: "Merk", waarde: "Mesoestetic" },
  ],
  beeld: {
    src: "/images/shoot/huidscan-op-tablet.jpg",
    alt: "Een behandelaar laat een cliënt de uitslag van de huidscan zien op een tablet",
  },
  kaart: {
    vraag: "Wat kost Cosmelan of Dermamelan",
    zin: "Het verschil tussen Cosmelan en Dermamelan, hoe de zes maanden verlopen, waarom je niet in de zomer begint en wat het traject kost.",
  },

  werking: {
    label: "De werking",
    anker: "Wat het doet",
    kop: "Wat het traject",
    accent: "met pigment doet",
    intro:
      "De meeste behandelingen halen weg wat er zit. Dit traject remt ook wat er nog aangemaakt wordt, en daarom duurt het maanden.",
    alineas: [
      "Pigment wordt aangemaakt door cellen in de onderste laag van de opperhuid. Bij hardnekkig pigment staan die cellen als het ware harder aan dan nodig, door zon, hormonen en aanleg. Haal je alleen weg wat er zit, dan maken ze het in de maanden erna gewoon opnieuw aan. [MEDISCHE-CHECK-ROJDA]",
      "Cosmelan en Dermamelan werken op twee fronten. Het masker in de kliniek remt de aanmaak en laat de bovenlaag met het pigment vervellen. De producten thuis houden die rem daarna vast, maandenlang. Dat tweede deel is geen bijzaak: het is het grootste deel van het traject, en het bepaalt de uitkomst meer dan wat er in de kliniek gebeurt. [MEDISCHE-CHECK-ROJDA]",
      "Het traject begint met twee weken voorbereiding thuis. Daarna gaat in de kliniek het masker op, dat je mee naar huis neemt en er na het afgesproken aantal uren zelf afhaalt. Na een paar dagen ga je vervellen, en vanaf dan volgt de routine, met controles onderweg. [MEDISCHE-CHECK-ROJDA]",
    ],
    verder:
      "Wat pigment is en welk type je hebt, staat bij [pigmentvlekken](/huidproblemen/pigmentvlekken) en bij [melasma](/huidproblemen/melasma). De twee behandelingen staan apart bij [Cosmelan](/behandelingen/cosmelan) en [Dermamelan](/behandelingen/dermamelan). Waarom een traject niet in de zomer begint staat bij [zon en je huid](/kennisbank/zon-en-je-huid).",
  },

  onderscheid: {
    label: "Welke van de twee",
    anker: "Het verschil",
    kop: "Cosmelan of",
    accent: "Dermamelan",
    intro:
      "Dezelfde opzet, een andere sterkte en een ander doel. Welke bij jou past, stelt de behandelaar vast met een meting.",
    alineas: [
      "Cosmelan is de lichtere van de twee. Hij wordt vaker gekozen bij zonschade en losse pigmentvlekken: scherp afgebakende vlekken op de plekken waar de zon komt. Voor dat soort pigment is hij sterk genoeg. [MEDISCHE-CHECK-ROJDA]",
      "Dermamelan is intensiever en wordt vaker ingezet bij melasma: symmetrische, wolkachtige vlakken die op hormonen en warmte reageren en na elke zomer terug kunnen komen. Het schema thuis is strakker, want melasma komt terug zodra de aanpak losser wordt. Het doel bij melasma is beheersen en niet laten verdwijnen, en dat hoor je vooraf. [MEDISCHE-CHECK-ROJDA]",
      "Er is ook een variant voor de intieme zone, Dermamelan Intimate, voor donkere verkleuring in de lies- en bikinizone. Die volgt dezelfde opzet, gebeurt in een afgesloten kamer en bij een behandelaar van je eigen voorkeur. [MEDISCHE-CHECK-ROJDA]",
    ],
    beeld: {
      src: "/images/shoot/beh-cosmelan-masker.jpg",
      alt: "Het Cosmelan-masker wordt op het gezicht aangebracht",
    },
    knop: { href: "/behandelingen/cosmelan", tekst: "Over Cosmelan" },
  },

  tarief: {
    label: "Tarieven",
    anker: "Wat het kost",
    kop: "Wat het traject",
    accent: "bij ons kost",
    intro:
      "Eén bedrag voor het hele traject, met de producten voor thuis erbij. De intakeregeling staat er compleet bij.",
    rijen: [
      { naam: "Cosmelan, traject inclusief producten", prijs: CO.prijs },
      { naam: "Dermamelan, traject inclusief producten", prijs: DM.prijs },
      {
        naam: "Dermamelan Intimate, traject inclusief producten",
        prijs: DI.prijs,
      },
    ],
    zin: "Het bedrag is voor het traject, met de producten voor thuis erbij. [GEGEVEN-NODIG: of de controles onderweg in dat bedrag zitten, Okan]",
    afspraak: [
      {
        kop: "Kom je voor het eerst",
        zin: `Dan begin je met een intake. We meten je huid, stellen vast welk type pigment het is en of Cosmelan of Dermamelan erbij past. Een losse intake duurt maximaal ${INTAKE_MINUTEN} minuten en kost ${euro(INTAKE_PRIJS)}. [GEGEVEN-NODIG: of de intake vervalt als je aan het traject begint, Okan]`,
      },
      {
        kop: "Wanneer je begint",
        zin: "Liever in het najaar, zodat je maanden met weinig zon voor je hebt. Tussen mei en augustus beginnen we geen pigmenttraject. Plan de start ook niet vlak voor een vakantie of een drukke week, want na een paar dagen ga je vervellen. [MEDISCHE-CHECK-ROJDA]",
      },
      {
        kop: "Tijdens het traject",
        zin: "Twee weken voorbereiding thuis, dan het masker in de kliniek, en daarna de routine met producten. Onderweg zijn er controles, waarbij we meten in plaats van schatten, zodat je ziet of het schema werkt.",
      },
    ],
  },

  welNiet: {
    intro:
      "Dit traject is voor hardnekkig pigment. Voor pigment dat oppervlakkig zit, en voor wie het werk thuis niet ziet zitten, is er een lichtere weg.",
    wel: [
      "Hardnekkig pigment waar losse behandelingen op stuklopen [MEDISCHE-CHECK-ROJDA]",
      "Melasma, met Dermamelan, waarbij beheersen het eerlijke doel is [MEDISCHE-CHECK-ROJDA]",
      "Zonschade en losse pigmentvlekken, met Cosmelan [MEDISCHE-CHECK-ROJDA]",
      "Donkere verkleuring in de lies- en bikinizone, met Dermamelan Intimate [MEDISCHE-CHECK-ROJDA]",
    ],
    niet: [
      "Zonder het schema thuis. Dat is het grootste deel van het traject, en zonder loopt het vast",
      "Starten in de zomer. Tussen mei en augustus beginnen we niet [MEDISCHE-CHECK-ROJDA]",
      "Zonder dagelijkse zonbescherming. Zon brengt het pigment terug",
      "Een belofte dat melasma voorgoed weggaat. Het blijft iets dat terug kan komen [MEDISCHE-CHECK-ROJDA]",
    ],
  },

  vergelijking: {
    label: "Naast elkaar",
    anker: "Vergelijking",
    kop: "Het traject naast",
    accent: "de alternatieven",
    intro:
      "Voor pigment zijn er meer wegen, en niet elke vlek vraagt zes maanden. Dit is wat ze doen, wat je erna merkt en wat ze kosten.",
    kolommen: ["Behandeling", "Waarin het verschilt", "Hersteltijd", "Vanaf"],
    rijen: [
      vergelijkingsrij(
        "cosmelan",
        "Het lichtere traject van zes maanden, vaker bij zonschade en losse vlekken.",
      ),
      vergelijkingsrij(
        "dermamelan",
        "Het intensievere traject, vaker bij melasma, met een strakker schema thuis. [MEDISCHE-CHECK-ROJDA]",
      ),
      vergelijkingsrij(
        "nordlys-pigment",
        "Licht op scherp afgebakende vlekken, in een reeks losse behandelingen. Niet de eerste keuze bij melasma. [MEDISCHE-CHECK-ROJDA]",
      ),
      vergelijkingsrij(
        "peelings",
        "Een zuur op de bovenlaag, voor oppervlakkige verkleuring, in een reeks. [MEDISCHE-CHECK-ROJDA]",
      ),
      vergelijkingsrij(
        "skinboosters",
        "De depigmentatiebooster brengt stoffen in de huid, meestal als kuur van drie. [MEDISCHE-CHECK-ROJDA]",
      ),
    ],
    bijschrift:
      "Cosmelan en Dermamelan vergeleken met andere pigmentbehandelingen op werking, hersteltijd en tarief",
  },

  wie: {
    label: "Hoe we het volgen",
    zin: "Het traject begint met een meting, en bij de controles onderweg wordt er opnieuw gemeten, zodat je op de opnames ziet wat er verandert. [GEGEVEN-NODIG: wie de pigmenttrajecten begeleidt, Okan]",
  },

  faq: [
    {
      vraag: "Wat kost Cosmelan in Rotterdam?",
      antwoord: `Bij Diba Clinics kost het Cosmelan-traject ${euro(CO.prijs)} en Dermamelan ${euro(DM.prijs)}, allebei inclusief de producten voor thuis. Dermamelan Intimate kost ${euro(DI.prijs)}. Het traject begint met een intake van ${euro(INTAKE_PRIJS)}.`,
    },
    {
      vraag: "Wat is het verschil tussen Cosmelan en Dermamelan?",
      antwoord:
        "Dezelfde opzet, een andere sterkte en een ander doel. Cosmelan is de lichtere en wordt vaker gekozen bij zonschade en losse pigmentvlekken; Dermamelan is intensiever en wordt vaker ingezet bij melasma. Welke bij jou past, stelt de behandelaar vast bij de intake. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Hoe lang duurt een Cosmelan-traject?",
      antwoord:
        "Ongeveer zes maanden. Het begint met twee weken voorbereiding thuis, dan gaat het masker op in de kliniek, en daarna volgt een routine met producten en controles onderweg.",
    },
    {
      vraag: "Ga ik vervellen van Cosmelan?",
      antwoord:
        "Ja. Na een paar dagen gaat je huid vervellen en is hij rood. Plan het begin daarom niet vlak voor een vakantie of een belangrijke datum. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Waarom mag ik in de zomer niet beginnen?",
      antwoord:
        "Omdat je dan maanden tegen de zon in werkt. Pigmentcellen die net zijn aangepakt reageren extra fel op UV, en dan betaal je voor een resultaat dat je in september kwijt bent. Tussen mei en augustus beginnen we daarom geen pigmenttraject. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Gaat melasma weg met Dermamelan?",
      antwoord:
        "Niet voorgoed. Melasma blijft iets dat terug kan komen, vooral na de zomer. Dermamelan kan het rustig krijgen, en met zonbescherming en het schema thuis houd je het zo. Beheersen is bij melasma het eerlijke doel. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Kan Cosmelan bij een donkere huid?",
      antwoord:
        "Vaak wel, en het vraagt een andere aanpak. Bij huidtype IV tot VI is de kans op nieuwe pigmentvlekken groter, dus kijken we vooraf extra goed en bouwen we voorzichtig op. Dat bespreken we bij de intake. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Kan ik Cosmelan doen als ik zwanger ben?",
      antwoord:
        "Nee, tijdens een zwangerschap en in de periode dat je borstvoeding geeft beginnen we er niet aan. Pigment verandert in die tijd bovendien vaak vanzelf, en dan is wachten de beste keuze. [MEDISCHE-CHECK-ROJDA]",
    },
    VRAAG_WAAR,
  ],

  twijfel: {
    voor: "Weet je niet welk",
    accent: "pigment",
    na: "je hebt",
    zin: "Dat hoef je ook niet te weten voordat je komt. Een meting laat zien welk type het is en hoe diep het zit, en daarna hoor je of een traject van zes maanden nodig is of dat iets lichters volstaat.",
  },

  cta: {
    kop: "Een pigmenttraject",
    accent: "in Rotterdam",
    tekst:
      "We meten eerst je huid en stellen vast welk type pigment het is. Daarna bespreken we of Cosmelan of Dermamelan past, en wanneer je het beste begint.",
    topic: "pigment",
  },

  schema: {
    procedure: { naam: "Cosmelan en Dermamelan", omschrijving: CO.werking },
    dienst: { naam: "Cosmelan en Dermamelan", soort: "Pigmentbehandeling" },
  },
};
