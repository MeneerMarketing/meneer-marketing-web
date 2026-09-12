import {
  afspraakBlokken,
  behandeling,
  euro,
  INTAKE_PRIJS,
  tariefrijen,
  vergelijkingsrij,
  VRAAG_WAAR,
  type Landing,
} from "@/data/landings/types";

/**
 * Dermaplaning in Rotterdam.
 *
 * WAAROM DEZE PAGINA NIET BOTST MET /behandelingen/dermaplaning.
 *
 * De behandelpagina heet "Dermaplaning" en gaat over wat het is. Deze gaat over dermaplaning
 * bij ons: wat het kost, voor wie het past, en de vraag die bijna iedereen stelt en die op de
 * behandelpagina maar half beantwoord wordt: of het haar dikker terugkomt.
 *
 * Wat hier over het mesje en het haar staat, komt van de apparaatpagina (Dermaplane Pro) en
 * de behandelpagina, en is daar al gemarkeerd voor controle waar dat nodig is.
 */

const DP = behandeling("dermaplaning");

export const DERMAPLANING_ROTTERDAM: Landing = {
  slug: "dermaplaning-rotterdam",
  gewijzigd: "2026-09-11",
  titel: "Dermaplaning Rotterdam",
  omschrijving: `Dermaplaning in Rotterdam bij Diba Clinics. ${euro(DP.prijs)}, zestig minuten en geen hersteltijd. Zonder zuren, dus ook bij een gevoelige huid.`,
  kruimel: "Dermaplaning",
  h1: { kop: "Dermaplaning in", accent: "Rotterdam" },
  antwoord: `Dermaplaning is een behandeling waarbij een chirurgisch mesje onder een vaste hoek dode huidcellen en donshaartjes van je gezicht haalt. Er komen geen zuren aan te pas. Bij Diba Clinics in Rotterdam duurt een behandeling ${DP.duurMinuten} minuten en kost hij ${euro(DP.prijs)}; je huid is meteen glad en je hebt geen hersteltijd. [MEDISCHE-CHECK-ROJDA]`,
  feiten: [
    { kop: "Duur", waarde: `${DP.duurMinuten} minuten` },
    { kop: "Tarief", waarde: euro(DP.prijs) },
    { kop: "Hersteltijd", waarde: "Geen" },
    { kop: "Werkwijze", waarde: "Mesje, geen zuur" },
  ],
  beeld: {
    src: "/images/shoot/beh-dermaplaning.jpg",
    alt: "Dermaplaning met een chirurgisch mesje over de wang",
  },
  kaart: {
    vraag: "Wat kost dermaplaning",
    zin: "Wat het mesje weghaalt, waarom het haar niet dikker terugkomt, voor wie het past en hoe het zich verhoudt tot een peeling of een HydraFacial.",
  },

  werking: {
    label: "De werking",
    anker: "Wat het doet",
    kop: "Wat dermaplaning",
    accent: "met je huid doet",
    intro:
      "Het is de eenvoudigste behandeling in de kliniek: een steriel mesje, een strak getrokken huid en een vaste hoek. Er komt geen stroom, licht of warmte aan te pas.",
    alineas: [
      "De buitenste laag van je huid bestaat uit dode cellen die vanzelf loslaten, maar niet altijd even vlot. Daartussen zitten de fijne, lichte donshaartjes die bijna iedereen op het gezicht heeft. Samen maken ze het oppervlak ruwer dan het hoeft te zijn, en make-up blijft er eerder in hangen dan dat hij glad over je huid gaat. [MEDISCHE-CHECK-ROJDA]",
      "Bij dermaplaning trekt de behandelaar je huid strak en gaat het mesje er in korte halen overheen, onder een hoek van 45 graden. Het snijdt niet in de huid maar schraapt over het oppervlak. Wat eraf gaat zijn dode cellen uit de hoornlaag en de donshaartjes die daarin vastzitten; wat blijft is levende huid.",
      "Omdat er geen zuur aan te pas komt, kan het ook bij een gevoelige, droge of allergische huid, en tijdens de zwangerschap. Pijn doet het niet. Het gekste eraan is het geluid: een zacht schrapen dat je eerder in je kaak voelt dan op je huid. [MEDISCHE-CHECK-ROJDA]",
    ],
    verder:
      "Hoe het mesje en de hoek precies werken staat bij de [Dermaplane Pro](/apparatuur/dermaplane-pro). De behandeling zelf, los van de plaats, staat op [de behandelpagina](/behandelingen/dermaplaning).",
  },

  onderscheid: {
    label: "Het haar",
    anker: "Het haar",
    kop: "Groeit het haar",
    accent: "dikker terug",
    intro:
      "Het is de vraag die bijna iedereen stelt, en het antwoord is nee. Hieronder waarom.",
    alineas: [
      "Scheren en dermaplaning veranderen de haarschacht niet, alleen het uiteinde. Een haar dat nog nooit is afgesneden heeft een dunne, zachte punt. Na het afsnijden is die punt recht, en een recht uiteinde voelt de eerste dagen stugger aan. Dat is wat mensen voor dikker haar aanzien.",
      "Het haar groeit terug zoals het was: even fijn en even licht. Het wordt er niet donkerder van en het komt niet sneller terug. Wie het bevalt, komt ongeveer maandelijks terug, want in die tijd is de laag dode cellen weer opgebouwd en staan de haartjes er weer.",
      "Wil je van de haartjes af in plaats van ze bij te houden, dan is dit de verkeerde behandeling. Voor donker haar is dat [laserontharing](/laserontharing); voor licht, grijs of wit haar dat de laser niet ziet, is dat [elektrische epilatie](/kennisbank/elektrische-epilatie-rotterdam). [MEDISCHE-CHECK-ROJDA]",
    ],
    beeld: {
      src: "/images/shoot/behandelkamer-overzicht.jpg",
      alt: "Behandelaar en cliënt in een behandelkamer van Diba Clinics",
    },
    knop: { href: "/behandelingen/dermaplaning", tekst: "Over de behandeling" },
  },

  tarief: {
    label: "Tarieven",
    anker: "Wat het kost",
    kop: "Wat dermaplaning",
    accent: "bij ons kost",
    intro:
      "Eén tarief voor de hele behandeling, zonder varianten. De intakeregeling voor een eerste afspraak staat er compleet bij, want dat is het bedrag dat mensen niet zien aankomen.",
    rijen: tariefrijen("dermaplaning"),
    zin: "Dermaplaning gaat goed samen met een behandeling die daarna op een gladde huid werkt, zoals een peeling of een HydraFacial. Wat er in jouw geval bij past, bespreken we bij de intake. [MEDISCHE-CHECK-ROJDA]",
    afspraak: afspraakBlokken({
      naam: "de dermaplaning",
      duurMinuten: DP.duurMinuten,
    }),
  },

  welNiet: {
    intro:
      "Dermaplaning werkt op de buitenste laag. Voor wat dieper zit, en voor haar dat weg moet blijven, is er een andere behandeling.",
    wel: [
      "Een ruwe of doffe huid die direct glad en egaal moet zijn",
      "Een huid die geen zuren verdraagt, zoals een gevoelige, droge of allergische huid",
      "Een gladde basis voor make-up, of een behandeling vlak voor een gelegenheid",
      "Een combinatie met bijna elke andere behandeling",
    ],
    niet: [
      "Pigment of littekens die dieper zitten. Daarvoor kies je laser of microneedling",
      "Blijvend minder haar. De donshaartjes groeien terug zoals ze waren",
      "Een huid met actieve ontstekingen of een beschadigde barrière. Dan doen we het niet [MEDISCHE-CHECK-ROJDA]",
      "Verschil dat blijft. Het effect duurt tot de laag dode cellen weer is opgebouwd, meestal een paar weken [MEDISCHE-CHECK-ROJDA]",
    ],
  },

  vergelijking: {
    label: "Naast elkaar",
    anker: "Vergelijking",
    kop: "Dermaplaning naast",
    accent: "de alternatieven",
    intro:
      "Voor een gladdere huid zijn er meer wegen. Dit is wat ze doen, wat je erna merkt en wat ze kosten.",
    kolommen: ["Behandeling", "Waarin het verschilt", "Hersteltijd", "Vanaf"],
    rijen: [
      vergelijkingsrij(
        "dermaplaning",
        "Een mesje haalt dode cellen en donshaar weg. Geen zuur, en het resultaat is er meteen.",
      ),
      vergelijkingsrij(
        "hydrafacial",
        "Reinigt en zuigt poriën leeg met onderdruk en brengt stoffen terug. Werkt ook op wat er in de porie zit.",
      ),
      vergelijkingsrij(
        "oxygeneo",
        "Maakt de bovenlaag los met een gel en een capsule, waarbij je huid een prikkel krijgt voor de doorbloeding. [MEDISCHE-CHECK-ROJDA]",
      ),
      vergelijkingsrij(
        "peelings",
        "Een zuur maakt de bovenlaag los en gaat dieper. Meer effect op verkleuring, en meer reactie van je huid. [MEDISCHE-CHECK-ROJDA]",
      ),
    ],
    bijschrift:
      "Dermaplaning vergeleken met andere behandelingen voor een gladdere huid op werking, hersteltijd en tarief",
  },

  wie: {
    label: "Wie de behandeling doet",
    zin: "De behandelaar beoordeelt eerst of je huid rustig genoeg is, want bij een actieve ontsteking gaat het mesje er niet overheen. [GEGEVEN-NODIG: welke functies dermaplaning doen, Okan]",
  },

  reviews: {
    onderwerp: "gezichtsbehandeling",
    reeks: 1,
    intro:
      "Reviews van klanten die hier voor een gezichtsbehandeling waren. Ze komen rechtstreeks uit onze agenda en staan er zoals ze geschreven zijn.",
  },

  faq: [
    {
      vraag: "Wat kost dermaplaning in Rotterdam?",
      antwoord: `Bij Diba Clinics kost dermaplaning ${euro(DP.prijs)} en duurt een behandeling ${DP.duurMinuten} minuten. Kom je voor het eerst, dan begint je afspraak met een intake van ${euro(INTAKE_PRIJS)}, die vervalt als we in dezelfde afspraak behandelen.`,
    },
    {
      vraag: "Groeit mijn haar dikker terug na dermaplaning?",
      antwoord:
        "Nee. Dermaplaning verandert de haarschacht niet, alleen het uiteinde. Een recht afgesneden punt voelt de eerste dagen stugger dan een punt die nog nooit geknipt is, en dat voelt als dikker haar. Het haar groeit terug zoals het was: even fijn en even licht.",
    },
    {
      vraag: "Doet dermaplaning pijn?",
      antwoord:
        "Nee. Je voelt het mesje in korte halen over je huid gaan, en je hoort vooral een zacht schrapen. Het is een van de rustigste behandelingen die we doen. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Snijdt het mesje in mijn huid?",
      antwoord:
        "Nee, het schraapt over het oppervlak onder een vaste hoek. Wat eraf gaat zijn dode cellen uit de hoornlaag en de donshaartjes die daarin vastzitten.",
    },
    {
      vraag: "Hoe vaak kun je dermaplaning doen?",
      antwoord:
        "Los, of elke vier tot zes weken als onderhoud. In die tijd is de laag dode cellen weer opgebouwd en staan de donshaartjes er weer. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Kan dermaplaning tijdens de zwangerschap?",
      antwoord:
        "Meestal wel, want er komen geen zuren of andere middelen aan te pas. Vertel het ons wel bij de intake, dan houden we er rekening mee bij wat er verder op je huid komt. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Kan dermaplaning bij een gevoelige huid?",
      antwoord:
        "Vaak wel, want er komen geen zuren aan te pas. Bij actieve ontstekingen of een beschadigde barrière doen we het niet. Of het bij jou kan, bepaalt de behandelaar bij de intake. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Waarom neemt mijn crème daarna beter op?",
      antwoord:
        "Omdat de laag dode cellen eraf is die er anders tussen zit. Dat effect is tijdelijk en duurt zolang die laag zich niet heeft hersteld.",
    },
    VRAAG_WAAR,
  ],

  twijfel: {
    voor: "Weet je niet of",
    accent: "dermaplaning",
    na: "bij je past",
    zin: "Dat hoef je ook niet te weten voordat je komt. Boek een behandeling op advies: we bekijken je huid en zeggen welke behandeling erbij past. Is dat een peeling of een HydraFacial, dan hoor je dat.",
  },

  cta: {
    kop: "Dermaplaning in Rotterdam",
    accent: "plannen",
    tekst:
      "We bekijken eerst je huid en zeggen daarna of dermaplaning erbij past. Is dat zo, dan kan de behandeling vaak in dezelfde afspraak.",
    topic: "dermaplaning",
  },

  schema: {
    procedure: { naam: "Dermaplaning", omschrijving: DP.werking },
    dienst: { naam: "Dermaplaning", soort: "Gezichtsbehandeling" },
  },
};
