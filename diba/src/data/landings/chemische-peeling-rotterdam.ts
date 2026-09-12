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
 * Chemische peeling in Rotterdam.
 *
 * DE NAAM.
 *
 * Op de site en in de agenda heet dit een medische peeling. De meeste mensen zoeken op
 * "chemische peeling". Het is dezelfde behandeling, en de pagina zegt dat ook met zoveel
 * woorden, zodat beide namen naar hetzelfde antwoord leiden en er geen tweede pagina voor
 * nodig is.
 *
 * WAAROM DEZE PAGINA NIET BOTST MET /behandelingen/peelings.
 *
 * Die heet "Medische peelings" en gaat over de behandeling. Deze gaat over de peeling bij
 * ons: welke merken, welke sterkte bij welke klacht, wat het kost en wanneer je beter wacht.
 * De kruidenpeel staat hier als het alternatief zonder zuur, want voor een ontstoken huid is
 * dat de vraag die iemand die "chemische peeling" zoekt eigenlijk heeft.
 *
 * EEN BEWERING DIE ER BEWUST NIET STAAT.
 *
 * Dat een kuur van drie voordeliger is dan drie losse behandelingen. Bij de rug klopt dat,
 * bij de TCA-kuur met K-ceutic niet: die kost precies drie keer een losse TCA-peeling. Dus
 * staat er alleen dat er kuren zijn en dat bij sommige de producten voor thuis inbegrepen zijn.
 */

const PE = behandeling("peelings");
const KP = behandeling("kruidenpeel");

export const CHEMISCHE_PEELING_ROTTERDAM: Landing = {
  slug: "chemische-peeling-rotterdam",
  gewijzigd: "2026-09-11",
  titel: "Chemische peeling Rotterdam",
  omschrijving: `Chemische peeling in Rotterdam bij Diba Clinics. Vier merken in drie sterktes, vanaf ${euro(PE.prijs)}. Voor acne, pigment en een doffe huid.`,
  kruimel: "Chemische peeling",
  h1: { kop: "Chemische peeling in", accent: "Rotterdam" },
  antwoord: `Een chemische peeling is een behandeling waarbij een zuur de verbinding tussen de buitenste huidcellen losmaakt, zodat die laag sneller wordt vervangen. Bij Diba Clinics in Rotterdam werken we met vier merken in drie sterktes. Een peeling kost vanaf ${euro(PE.prijs)} en duurt ${PE.duurMinuten} minuten; afhankelijk van de sterkte ben je daarna twee tot vijf dagen droog en schilferig. [MEDISCHE-CHECK-ROJDA]`,
  feiten: [
    { kop: "Duur", waarde: `${PE.duurMinuten} minuten` },
    { kop: "Tarief", waarde: `Vanaf ${euro(PE.prijs)}` },
    { kop: "Hersteltijd", waarde: "2 tot 5 dagen" },
    { kop: "Sterktes", waarde: "Drie niveaus" },
  ],
  beeld: {
    src: "/images/shoot/beh-peeling.jpg",
    alt: "Een peeling wordt met een wattenstaafje op het voorhoofd aangebracht",
  },
  kaart: {
    vraag: "Wat kost een chemische peeling",
    zin: "Welke sterkte bij welke klacht past, de kruidenpeel als peeling zonder zuur, wat je de dagen erna ziet en wanneer je beter even wacht.",
  },

  werking: {
    label: "De werking",
    anker: "Wat het doet",
    kop: "Wat een peeling",
    accent: "met je huid doet",
    intro:
      "Een peeling versnelt iets wat je huid uit zichzelf al doet: de bovenste laag vervangen. Hoe ver dat gaat, hangt af van het middel.",
    alineas: [
      "Je huid vervangt zijn bovenste laag voortdurend, maar niet altijd even snel. Blijven de oude cellen te lang zitten, dan voelt je huid ruw, ziet hij er dof uit, raken poriën verstopt en blijft oppervlakkige verkleuring langer staan dan nodig. [MEDISCHE-CHECK-ROJDA]",
      "Een peeling maakt de verbinding tussen die buitenste cellen los, zodat de laag sneller wordt vervangen. Wat het middel doet, hangt af van drie dingen samen: welk zuur erin zit, hoe geconcentreerd het is en hoe zuur het mengsel als geheel is. Fruitzuren blijven in de hoornlaag, salicylzuur lost op in talg en komt daardoor in de porie, en sterkere mengsels gaan tot in de opperhuid. [MEDISCHE-CHECK-ROJDA]",
      "Op de site en in de agenda heet dit een medische peeling. Chemische peeling is dezelfde behandeling, onder de naam waarmee de meeste mensen ernaar zoeken.",
    ],
    verder:
      "Per klacht staat het apart uitgewerkt: een peeling bij [acne](/behandelingen/peelings/acne), bij [pigmentvlekken](/behandelingen/peelings/pigment) en voor [huidverjonging](/behandelingen/peelings/huidverjonging). Wat de zon rond een peeling doet staat bij [zon en je huid](/kennisbank/zon-en-je-huid), en wat er tijdens een zwangerschap kan bij [zwanger of borstvoeding](/kennisbank/zwanger-of-borstvoeding).",
  },

  onderscheid: {
    label: "De middelen",
    anker: "De merken",
    kop: "Vier merken",
    accent: "in drie sterktes",
    intro:
      "Een peeling is geen apparaat maar een vloeistof. Welke er bij je past, hangt af van je huid op dat moment en van het seizoen.",
    alineas: [
      "We werken met peelings van [Skin Tech Pharma, Dermaceutic, ADO en Mesoestetic](/apparatuur/peelinglijnen), in drie niveaus. De lichtste werken op de bovenlaag en laten je meestal niet zichtbaar vervellen. De sterkste, zoals de TCA-peeling van Dermaceutic in 12 tot 20 procent, gaan dieper en vragen voorbereiding en hersteltijd. [MEDISCHE-CHECK-ROJDA]",
      "De inwerktijd wordt op je huid afgemeten. Langer laten zitten geeft geen beter resultaat maar meer schade, en daarom blijft de behandelaar erbij zolang de peeling op je huid zit. [MEDISCHE-CHECK-ROJDA]",
      "Voor een huid met ontstoken acne is een zuur soms te veel. Daarvoor is er de [kruidenpeel van ADO](/behandelingen/kruidenpeel): fijngemalen kruiden zonder zuur, die ontstekingsremmend en antibacterieel werken. De huid is daarna drie tot vijf dagen rood en vervelt. [MEDISCHE-CHECK-ROJDA]",
    ],
    beeld: {
      src: "/images/shoot/apparaat-peelinglijn.jpg",
      alt: "Een flacon Dermaceutic TCA naast een cliënt op de behandelbank",
    },
    knop: { href: "/behandelingen/peelings", tekst: "Over de behandeling" },
  },

  tarief: {
    label: "Tarieven",
    anker: "Wat het kost",
    kop: "Wat een peeling",
    accent: "bij ons kost",
    intro:
      "Het bedrag hangt af van de peeling, het gebied en of je een kuur boekt. Bij sommige kuren zitten de producten voor thuis inbegrepen.",
    rijen: [
      ...tariefrijen("peelings"),
      ...tariefrijen("kruidenpeel").map((r) => ({
        ...r,
        naam: `Kruidenpeel, ${r.naam.toLowerCase()}`,
      })),
    ],
    zin: "Peelings werken meestal in een reeks van vier tot zes, met twee tot vier weken ertussen. Hoeveel het er bij jou worden, hoor je na de meting. [MEDISCHE-CHECK-ROJDA]",
    afspraak: afspraakBlokken({
      naam: "de eerste peeling",
      duurMinuten: PE.duurMinuten,
    }),
  },

  welNiet: {
    intro:
      "Een peeling werkt op de bovenste lagen. Voor littekens die dieper zitten en voor hardnekkig pigment is er een zwaardere weg.",
    wel: [
      "Oppervlakkige verkleuring, en pigment dat na een puistje is achtergebleven",
      "Een ruwe huid en een doffe textuur",
      "Verstopte poriën, doordat de bovenlaag sneller vernieuwt",
      "Ontstoken acne, met de kruidenpeel of een peeling die daarop is afgestemd [MEDISCHE-CHECK-ROJDA]",
    ],
    niet: [
      "Littekens die dieper zitten dan de opperhuid. Daarvoor kies je microneedling",
      "Hardnekkig pigment of melasma. Daar zijn Cosmelan en Dermamelan de zwaardere trajecten [MEDISCHE-CHECK-ROJDA]",
      "Peelen vlak voor veel zon, of bij pigment in de zomermaanden [MEDISCHE-CHECK-ROJDA]",
      "Tijdens een zwangerschap of in de periode dat je borstvoeding geeft [MEDISCHE-CHECK-ROJDA]",
    ],
  },

  vergelijking: {
    label: "Naast elkaar",
    anker: "Vergelijking",
    kop: "Peeling naast",
    accent: "de alternatieven",
    intro:
      "Voor een betere huidtextuur zijn er meer wegen. Dit is wat ze doen, wat je erna merkt en wat ze kosten.",
    kolommen: ["Behandeling", "Waarin het verschilt", "Hersteltijd", "Vanaf"],
    rijen: [
      vergelijkingsrij(
        "peelings",
        "Een zuur maakt de bovenlaag los. Drie sterktes, van nauwelijks vervellen tot een paar dagen schilferen.",
      ),
      vergelijkingsrij(
        "kruidenpeel",
        "Kruiden in plaats van zuur. Remt de ontsteking en werkt antibacterieel, en daarom vooral bij ontstoken acne. [MEDISCHE-CHECK-ROJDA]",
      ),
      vergelijkingsrij(
        "hydrafacial",
        "Reinigt en zuigt poriën leeg, zonder zuur en zonder vervellen. Minder effect op verkleuring, en het resultaat zie je meteen.",
      ),
      vergelijkingsrij(
        "skinpen",
        "Werkt met naalden in de lederhuid, dieper dan een peeling. Voor littekens en structuur. [MEDISCHE-CHECK-ROJDA]",
      ),
      vergelijkingsrij(
        "cosmelan",
        "Een traject van zes maanden tegen hardnekkig pigment, met een masker in de kliniek en producten thuis.",
      ),
    ],
    bijschrift:
      "De chemische peeling vergeleken met andere behandelingen op werking, hersteltijd en tarief",
  },

  wie: {
    label: "Wie de behandeling doet",
    zin: "Een peeling wordt bij ons gedaan door een huidtherapeut. Die kiest de sterkte, meet de inwerktijd af op je huid en bouwt bij een reeks pas op als je huid dat aankan.",
  },

  reviews: {
    onderwerp: "acne",
    intro:
      "Reviews van klanten die hier voor acne kwamen, waarbij peelings vaak een deel van de behandeling zijn. Ze komen rechtstreeks uit onze agenda en staan er zoals ze geschreven zijn.",
  },

  faq: [
    {
      vraag: "Wat kost een chemische peeling in Rotterdam?",
      antwoord: `Bij Diba Clinics kost een Mesoestetic-peeling ${euro(PE.prijs)} en een TCA-peeling van Dermaceutic ${euro(tariefrijen("peelings").find((r) => r.naam.startsWith("TCA"))?.prijs ?? PE.prijs)}. Een kruidenpeel kost ${euro(KP.prijs)} voor het gezicht. Er zijn ook kuren van drie, waarvan sommige met producten voor thuis. Kom je voor het eerst, dan begint je afspraak met een intake van ${euro(INTAKE_PRIJS)}, die vervalt als we in dezelfde afspraak behandelen.`,
    },
    {
      vraag:
        "Wat is het verschil tussen een chemische en een medische peeling?",
      antwoord:
        "Er is geen verschil; het zijn twee namen voor dezelfde behandeling. Wij noemen het een medische peeling, omdat het gaat om middelen die per huid gekozen en op je huid afgemeten worden. Chemische peeling is de naam waarmee de meeste mensen zoeken.",
    },
    {
      vraag: "Ga ik vervellen na een peeling?",
      antwoord:
        "Bij een lichte peeling meestal niet, bij een sterkere wel. Reken bij de sterkere varianten op twee tot vijf dagen droog en schilferig. Dat hoor je vooraf, want het bepaalt wanneer je de behandeling het beste inplant. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Kan ik een peeling in de zomer doen?",
      antwoord:
        "Bij pigment liever niet, en bij de sterkere peelings ook niet. Zon op een huid die net gepeeld is, is precies de combinatie die het resultaat kost. Een lichte peeling voor de textuur kan soms wel, met strikte zonbescherming. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Hoeveel peelings heb ik nodig?",
      antwoord:
        "Meestal een reeks van vier tot zes, met twee tot vier weken ertussen. Hoeveel het er bij jou worden, hangt af van je huid en van hoe die reageert; dat meten we tussendoor. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Helpt een chemische peeling tegen acne?",
      antwoord:
        "Ja, peelings zijn bij acne een van de belangrijkste middelen. Bij ontstoken acne werken we met chemische peelings en met de kruidenpeel, die ook antibacterieel werkt. Littekens pakken we pas aan als de huid rustig is. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Helpt een peeling tegen pigmentvlekken?",
      antwoord:
        "Bij oppervlakkige verkleuring wel, zoals de vlekken die na een puistje achterblijven. Zit het pigment dieper of is het melasma, dan is een traject als Cosmelan of Dermamelan het passender antwoord. Welke van de twee het is, stellen we vast met een meting. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Kan een peeling bij een donkere huid?",
      antwoord:
        "Ja, en het vraagt een andere aanpak. Bij huidtype IV tot VI is de kans op nieuwe pigmentvlekken door de behandeling groter, dus kiezen we de sterkte voorzichtiger en bouwen we trager op. Dat bespreken we vooraf. [MEDISCHE-CHECK-ROJDA]",
    },
    VRAAG_WAAR,
  ],

  twijfel: {
    voor: "Weet je niet welke",
    accent: "peeling",
    na: "je nodig hebt",
    zin: "Dat hoef je ook niet te weten voordat je komt. We meten je huid, kijken wat er speelt en kiezen de sterkte die daarbij past. Is een peeling niet het goede antwoord, dan hoor je dat.",
  },

  cta: {
    kop: "Een peeling in Rotterdam",
    accent: "plannen",
    tekst:
      "We meten je huid en kiezen daarna de peeling en de sterkte die erbij passen. Is behandelen verstandig, dan kan dat vaak in dezelfde afspraak.",
    topic: "peeling",
  },

  schema: {
    procedure: { naam: "Chemische peeling", omschrijving: PE.werking },
    dienst: { naam: "Chemische peeling", soort: "Huidbehandeling" },
  },
};
