import {
  afspraakBlokken,
  behandeling,
  bereik,
  euro,
  INTAKE_PRIJS,
  tariefrijen,
  variantPrijs,
  vergelijkingsrij,
  VRAAG_WAAR,
  type Landing,
} from "@/data/landings/types";

/**
 * Skinboosters in Rotterdam.
 *
 * WAAROM DEZE PAGINA NIET BOTST MET /behandelingen/skinboosters.
 *
 * De behandelpagina heet "Skinboosters en mesotherapie" en gaat over de behandeling. Deze
 * gaat over skinboosters bij ons: wat ze kosten, wat de U225 anders doet dan een spuit, en
 * het verschil met een filler. Dat laatste is de vraag waarmee de meeste mensen binnenkomen,
 * en het eerlijke antwoord is dat we fillers niet zetten.
 *
 * DE TARIEVEN komen uit de varianten van de behandeling. De laagste daarvan is RRS Eyes, de
 * booster voor rond de ogen; daarom staat er "vanaf" dat bedrag en niet vanaf de losse booster.
 */

const SB = behandeling("skinboosters");
const SB_TARIEF = bereik("skinboosters");
const LOS = variantPrijs("skinboosters", "Skinbooster los");
const KUUR = variantPrijs("skinboosters", "Kuur van drie");
const HYALIFT = variantPrijs("skinboosters", "RRS hyalift");
const OGEN = variantPrijs("skinboosters", "RRS Eyes");
const OGEN_KUUR = variantPrijs("skinboosters", "RRS Eyes kuur");

export const SKINBOOSTERS_ROTTERDAM: Landing = {
  slug: "skinboosters-rotterdam",
  gewijzigd: "2026-09-11",
  titel: "Skinboosters Rotterdam",
  omschrijving: `Skinboosters in Rotterdam met de U225 injector. Vanaf ${euro(SB_TARIEF.laag)}, met kleine bultjes die binnen een dag zakken. Voor vocht, fijne lijnen en pigment.`,
  kruimel: "Skinboosters",
  h1: { kop: "Skinboosters in", accent: "Rotterdam" },
  antwoord: `Een skinbooster is een behandeling waarbij werkzame stoffen, zoals hyaluronzuur en vitamines, met heel fijne prikjes ín de huid worden gebracht in plaats van erop. Bij Diba Clinics in Rotterdam gebeurt dat met de U225, die elke prik op dezelfde diepte zet. Een losse behandeling kost ${euro(LOS)} en een kuur van drie ${euro(KUUR)}. [MEDISCHE-CHECK-ROJDA]`,
  feiten: [
    { kop: "Duur", waarde: `${SB.duurMinuten} minuten` },
    { kop: "Tarief", waarde: `Vanaf ${euro(SB_TARIEF.laag)}` },
    { kop: "Hersteltijd", waarde: "Bultjes, een dag" },
    { kop: "Kuur", waarde: "Drie sessies" },
  ],
  beeld: {
    src: "/images/shoot/beh-skinbooster.jpg",
    alt: "Een skinbooster wordt onder het oog ingebracht",
  },
  kaart: {
    vraag: "Wat kosten skinboosters",
    zin: "Wat een skinbooster in je huid brengt, waarom het geen filler is, wat de U225 anders doet dan een spuit en wat een kuur van drie kost.",
  },

  werking: {
    label: "De werking",
    anker: "Wat het doet",
    kop: "Wat een skinbooster",
    accent: "met je huid doet",
    intro:
      "Een crème blijft grotendeels aan de oppervlakte. Een skinbooster brengt de stoffen in de laag waar ze hun werk moeten doen.",
    alineas: [
      "Wat je op je huid smeert, komt voor het grootste deel niet verder dan de buitenste laag. Die laag is er juist om dingen tegen te houden. Voor vocht en stevigheid moeten stoffen als hyaluronzuur dieper zitten, in de huid zelf, en daar kom je met een crème niet. [MEDISCHE-CHECK-ROJDA]",
      "Bij een skinbooster gaat een mengsel van werkzame stoffen met heel fijne prikjes vlak onder de huid, verdeeld over het hele vlak in plaats van op één plek. Het doel is niet opvullen maar de kwaliteit van de huid: dat hij vochtiger en steviger aanvoelt. Welk mengsel en hoeveel, hangt af van wat je huid nodig heeft. [MEDISCHE-CHECK-ROJDA]",
      "Er zijn verschillende boosters: een voor fijne lijnen en vocht, zoals RRS Hyalift, een aparte voor de dunne huid rond de ogen, en een depigmentatiebooster voor gezicht, hals en decolleté bij pigment, zonneschade en melasma. Omdat de huid tussen de sessies het werk doet, is het meestal een kuur van drie. [MEDISCHE-CHECK-ROJDA]",
    ],
    verder:
      "Hoe de injector werkt staat bij de [U225](/apparatuur/u225). De behandeling zelf staat op [de behandelpagina](/behandelingen/skinboosters), en de booster voor de ogen bij [RRS Eyes](/behandelingen/rrs-eyes).",
  },

  onderscheid: {
    label: "Geen filler",
    anker: "Geen filler",
    kop: "Een skinbooster",
    accent: "is geen filler",
    intro:
      "Ze worden vaak door elkaar gehaald, en het verschil bepaalt wat je van de behandeling kunt verwachten.",
    alineas: [
      "Een filler brengt volume op één plek: een plooi opvullen, een lip voller maken, een contour veranderen. Een skinbooster doet dat niet. Hij wordt dun over het hele vlak verdeeld en werkt op de kwaliteit van je huid, niet op de vorm van je gezicht. Fillers zetten we hier niet. [MEDISCHE-CHECK-ROJDA]",
      "Wat hier het verschil maakt is de U225. Bij met de hand injecteren beweegt de hele spuit mee; bij de U225 staat de spuit stil en beweegt alleen de naald, tot acht keer per seconde. Daardoor trilt er minder en is elke prik even diep, ook als er een paar honderd achter elkaar gaan.",
      "Vooraf gaat er een verdovende crème op. Wat je daarna voelt is een reeks korte prikjes, rond de ogen gevoeliger dan op de wang. Vlak erna zie je kleine bultjes op de plek van elke prik; die zakken meestal binnen een dag. [MEDISCHE-CHECK-ROJDA]",
    ],
    beeld: {
      src: "/images/shoot/stoel-skinboosters.jpg",
      alt: "Ampullen en injector klaargelegd voor de behandeling",
    },
    knop: { href: "/apparatuur/u225", tekst: "Over de U225" },
  },

  tarief: {
    label: "Tarieven",
    anker: "Wat het kost",
    kop: "Wat skinboosters",
    accent: "bij ons kosten",
    intro:
      "Een losse behandeling of een kuur van drie, en voor de ogen een eigen booster. De intakeregeling staat er compleet bij.",
    rijen: tariefrijen("skinboosters"),
    zin: `Een kuur van drie kost ${euro(KUUR)}, tegen ${euro(3 * LOS)} voor drie losse behandelingen. Omdat de huid tussen de sessies het werk doet, is de kuur meestal ook de zinvolle keuze. [MEDISCHE-CHECK-ROJDA]`,
    afspraak: afspraakBlokken({
      naam: "de eerste skinbooster",
      duurMinuten: SB.duurMinuten,
      extra:
        "Plan een skinbooster niet vlak voor iets waar je op de foto moet: rond de ogen kan een blauw plekje langer blijven.",
    }),
  },

  welNiet: {
    intro:
      "Een skinbooster werkt op de kwaliteit van je huid. Voor volume, voor diepe lijnen en voor wie geen naalden verdraagt, is het niet de goede keuze.",
    wel: [
      "Een huid die vocht en stevigheid mist, over het hele vlak",
      "Fijne lijntjes, ook rond de ogen met een booster die daarvoor bedoeld is",
      "Pigment, zonneschade en melasma, met de depigmentatiebooster [MEDISCHE-CHECK-ROJDA]",
      "Een combinatie met behandelingen die op de bovenlaag werken",
    ],
    niet: [
      "Volume of een andere vorm. Dat is filler, en dat doen we niet",
      "Diepe lijnen of plooien. Die haalt een skinbooster niet weg [MEDISCHE-CHECK-ROJDA]",
      "Wie geen naalden verdraagt. Het zijn er veel, al zijn ze klein",
      "Pigment zonder zonbescherming. Zonder dat loopt het door, ook tijdens de kuur",
    ],
  },

  vergelijking: {
    label: "Naast elkaar",
    anker: "Vergelijking",
    kop: "Skinboosters naast",
    accent: "de alternatieven",
    intro:
      "Voor een stevigere, vochtigere huid zijn er meer wegen. Dit is wat ze doen, wat je erna merkt en wat ze kosten.",
    kolommen: ["Behandeling", "Waarin het verschilt", "Hersteltijd", "Vanaf"],
    rijen: [
      vergelijkingsrij(
        "skinboosters",
        "Werkzame stoffen in de huid, verdeeld over het vlak met de U225. Werkt op vocht en stevigheid.",
      ),
      vergelijkingsrij(
        "rrs-hyalift",
        "Een van de mengsels die we als skinbooster gebruiken: hyaluronzuur, vitamines en aminozuren. [MEDISCHE-CHECK-ROJDA]",
      ),
      vergelijkingsrij(
        "skinpen",
        "Naalden zonder middel, zodat je huid zelf collageen aanmaakt. Meer voor structuur en littekens. [MEDISCHE-CHECK-ROJDA]",
      ),
      vergelijkingsrij(
        "fotona-4d",
        "Laser in vier stappen, van binnenuit door de wang tot een afsluitende peeling. Werkt op verslapping, zonder naalden. [MEDISCHE-CHECK-ROJDA]",
      ),
      vergelijkingsrij(
        "hydrafacial",
        "Brengt serum in de bovenste laag, zonder naalden. Meteen zichtbaar, en korter van duur. [MEDISCHE-CHECK-ROJDA]",
      ),
    ],
    bijschrift:
      "Skinboosters vergeleken met andere behandelingen voor een stevigere huid op werking, hersteltijd en tarief",
  },

  wie: {
    label: "Wie de behandeling doet",
    zin: "De behandelaar kiest het mengsel en de diepte, en stelt de U225 per zone in: rond de ogen anders dan op de wang. [GEGEVEN-NODIG: welke functies de skinboosters zetten, Okan]",
  },

  reviews: {
    onderwerp: "gezichtsbehandeling",
    reeks: 2,
    intro:
      "Reviews van klanten die hier voor een gezichtsbehandeling waren. Ze komen rechtstreeks uit onze agenda en staan er zoals ze geschreven zijn.",
  },

  faq: [
    {
      vraag: "Wat kosten skinboosters in Rotterdam?",
      antwoord: `Bij Diba Clinics kost een losse skinbooster ${euro(LOS)} en een kuur van drie ${euro(KUUR)}. De RRS Hyalift-booster kost ${euro(HYALIFT)}, en de booster voor de ogen, RRS Eyes, ${euro(OGEN)} per keer of ${euro(OGEN_KUUR)} voor een kuur van drie. Kom je voor het eerst, dan begint je afspraak met een intake van ${euro(INTAKE_PRIJS)}, die vervalt als we in dezelfde afspraak behandelen.`,
    },
    {
      vraag: "Wat is het verschil tussen een skinbooster en een filler?",
      antwoord:
        "Een filler brengt volume op één plek en verandert een vorm. Een skinbooster wordt dun over het hele vlak verdeeld en werkt op het vocht en de stevigheid van de huid zelf. Fillers zetten we hier niet. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Doet een skinbooster pijn?",
      antwoord:
        "Het voelt als een reeks korte prikjes en het gaat snel. Vooraf gaat er een verdovende crème op. Rond de ogen is het gevoeliger dan op de wang.",
    },
    {
      vraag: "Zie ik er daarna uit alsof ik geprikt ben?",
      antwoord:
        "Vlak erna zie je kleine bultjes op de plek van elke prik; die zakken meestal binnen een dag. Blauwe plekjes kunnen, vooral rond de ogen, en die blijven langer. Plan het dus niet vlak voor een gelegenheid. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Waarom een kuur van drie?",
      antwoord:
        "Omdat de huid tussen de sessies door het werk doet. Er zijn meerdere prikkels nodig voordat er iets wordt opgebouwd, met twee tot vier weken ertussen. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Wanneer zie ik resultaat van een skinbooster?",
      antwoord:
        "Je huid voelt vaak al snel vochtiger aan, maar het echte verschil bouwt zich over de kuur op. Hoe snel dat gaat, verschilt per huid. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Helpt een skinbooster tegen pigment?",
      antwoord:
        "Daar is een aparte booster voor, de depigmentatiebooster, voor gezicht, hals en decolleté bij pigment, zonneschade en melasma. Zonder dagelijkse zonbescherming loopt het pigment door, ook tijdens de kuur. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Wat doet de U225 anders dan een spuit?",
      antwoord:
        "Bij de U225 staat de spuit stil en beweegt alleen de naald, tot acht keer per seconde. Daardoor trilt er minder en is de diepte van prik tot prik gelijk, ook als er een paar honderd achter elkaar gaan.",
    },
    VRAAG_WAAR,
  ],

  twijfel: {
    voor: "Weet je niet of",
    accent: "een skinbooster",
    na: "bij je past",
    zin: "Dat hoef je ook niet te weten voordat je komt. We bekijken je huid, bespreken wat je wilt bereiken en zeggen welke behandeling daarbij past. Zoek je volume, dan hoor je dat een skinbooster daar niet voor is.",
  },

  cta: {
    kop: "Skinboosters in Rotterdam",
    accent: "plannen",
    tekst:
      "We bekijken je huid en kiezen daarna het mengsel dat erbij past. Is behandelen verstandig, dan kan de eerste sessie vaak in dezelfde afspraak.",
    topic: "skinboosters",
  },

  schema: {
    procedure: { naam: "Skinbooster", omschrijving: SB.werking },
    dienst: { naam: "Skinboosters", soort: "Huidbehandeling" },
  },
};
