import {
  afspraakBlokken,
  alsWoord,
  behandeling,
  euro,
  INTAKE_PRIJS,
  opsomming,
  VRAAG_WAAR,
  type Landing,
} from "@/data/landings/types";
import { TEAM } from "@/data/team";

/**
 * Huidtherapeut in Rotterdam.
 *
 * WAAROM DEZE PAGINA NIET BOTST MET /team EN /kwaliteit-en-registraties.
 *
 * Die twee heten "Ons team" en "Kwaliteit en registraties": ze gaan over wie er werkt en
 * bij welke registers we horen. De zoekvraag "huidtherapeut rotterdam" heeft er geen pagina
 * voor, en die vraag is een andere: wat doet zo iemand, wanneer ga je erheen, wat kost het
 * en wordt het vergoed. Deze pagina beantwoordt dat en wijst voor de mensen naar /team.
 *
 * WAT HIER UIT ÉÉN BRON KOMT.
 *
 * Het aantal huidtherapeuten en hun namen komen uit team.ts. Komt er iemand bij of gaat er
 * iemand weg, dan klopt deze pagina vanzelf; een getal in de tekst zou dat niet doen.
 *
 * DE VERGELIJKING MET ANDERE BEROEPEN.
 *
 * De stijlgids: zonder andere klinieken kleiner te maken. De tabel zegt dus alleen wat
 * controleerbaar is: welke opleiding, of de titel beschermd is, en waarvoor je er komt. Geen
 * oordeel over wat iemand kan. Dat is dezelfde keuze als op /team, waar dit onderscheid voor
 * de eigen mensen al staat.
 */

const HUIDTHERAPEUTEN = TEAM.filter((t) => t.functie === "Huidtherapeut").map(
  (t) => t.naam,
);
const IN_OPLEIDING = TEAM.find((t) =>
  t.functie.startsWith("Huidtherapeut in opleiding"),
);
const AANTAL = alsWoord(HUIDTHERAPEUTEN.length);

export const HUIDTHERAPEUT_ROTTERDAM: Landing = {
  slug: "huidtherapeut-rotterdam",
  gewijzigd: "2026-09-11",
  titel: "Huidtherapeut Rotterdam",
  omschrijving: `Huidtherapeut in Rotterdam bij Diba Clinics. Wat een huidtherapeut doet, wanneer huidtherapie vergoed wordt en hoe je eerste afspraak gaat. Intake ${euro(INTAKE_PRIJS)}.`,
  kruimel: "Huidtherapeut",
  h1: { kop: "Huidtherapeut in", accent: "Rotterdam" },
  antwoord: `Een huidtherapeut is een paramedicus met een hbo-opleiding die huidklachten behandelt, zoals acne, littekens, pigment, couperose en ongewenste haargroei. Bij Diba Clinics aan de Weissenbruchlaan in Rotterdam werken ${AANTAL} huidtherapeuten, allemaal ingeschreven in het Kwaliteitsregister Paramedici. Een intake kost ${euro(INTAKE_PRIJS)} en vervalt als je in dezelfde afspraak behandeld wordt.`,
  feiten: [
    { kop: "Opleiding", waarde: "Hbo, vier jaar" },
    { kop: "Titel", waarde: "Wettelijk beschermd" },
    { kop: "Register", waarde: "Paramedici" },
    { kop: "Intake", waarde: euro(INTAKE_PRIJS) },
  ],
  beeld: {
    src: "/images/shoot/team-tweetal.jpg",
    alt: "Twee behandelaars van Diba Clinics naast elkaar in de kliniek",
  },
  kaart: {
    vraag: "Wat doet een huidtherapeut",
    zin: "Wat de titel inhoudt, welke klachten een huidtherapeut behandelt, wanneer huidtherapie vergoed wordt en wie er bij ons in de behandelkamer staan.",
  },

  werking: {
    label: "Het vak",
    anker: "Wat het is",
    kop: "Wat een huidtherapeut",
    accent: "voor je doet",
    intro:
      "Huidtherapie zit tussen de verzorgende behandeling en de dermatoloog in. Het helpt om te weten waar precies, want dat bepaalt waarvoor je waar terechtkunt.",
    alineas: [
      "Een huidtherapeut behandelt de huid op een medisch-cosmetische manier: klachten die je dagelijks ziet en voelt, maar waarvoor je niet naar het ziekenhuis hoeft. Denk aan acne en de littekens die het achterlaat, pigmentvlekken, couperose en rosacea, ongewenste haargroei, littekens na een operatie en een huid die sneller veroudert dan je wilt.",
      "Het werk gebeurt met apparatuur en middelen waarbij de instelling per huid wordt gekozen: lasers en licht, microneedling, medische peelings. Daar maakt de opleiding het verschil. Hoe diep je gaat, hoeveel energie een huid aankan en wanneer je beter niet behandelt, zijn beslissingen die je in vier jaar opleiding leert en daarna bijhoudt in het register.",
      "Een huidtherapeut stelt geen diagnose; dat is het werk van een arts. Ziet de huidtherapeut iets wat een arts moet beoordelen, zoals een moedervlek die verandert, dan hoor je dat. Er is bij ons geen vast overleg met artsen, dus in dat geval adviseren we je zelf naar je huisarts te gaan. [MEDISCHE-CHECK-ROJDA]",
    ],
    verder:
      "Welke klachten we behandelen staat per klacht in het [overzicht van huidproblemen](/huidproblemen). Welke behandelingen we daarvoor inzetten, met tarief en hersteltijd, staat bij [de behandelingen](/behandelingen). Moet je nog kiezen waar je heen gaat, dan staat bij [hoe je een huidkliniek kiest](/kennisbank/huidkliniek-kiezen) waar je zelf op kunt letten.",
  },

  onderscheid: {
    label: "De titel",
    anker: "De titel",
    kop: "Een titel die",
    accent: "je kunt nakijken",
    intro:
      "Niet elke titel in deze branche zegt iets over de opleiding erachter. Deze wel, en je kunt het zelf controleren.",
    alineas: [
      "Huidtherapeut is een wettelijk beschermde opleidingstitel, vastgelegd in artikel 34 van de Wet BIG. Je mag je alleen zo noemen met de hbo-bachelor huidtherapie, en die opleiding bestaat in Nederland op twee plekken: de Haagse Hogeschool en Hogeschool Utrecht.",
      "De titel zegt dat iemand de opleiding heeft afgerond. Het Kwaliteitsregister Paramedici zegt iets anders: dat iemand het vak ook echt uitoefent en zijn kennis bijhoudt. Leden van de Nederlandse Vereniging van Huidtherapeuten moeten in dat register staan, en onze huidtherapeuten staan erin.",
      "Kijk je dat liever zelf na, dan kan dat: het register is openbaar en je zoekt er op naam. Dat geldt voor elke huidtherapeut, ook buiten deze kliniek, en het is de snelste manier om te weten met wie je te maken hebt.",
    ],
    beeld: {
      src: "/images/shoot/gesprek-in-de-kamer.jpg",
      alt: "Cliënt en behandelaar aan tafel in de intakeruimte, met een kop koffie",
    },
    knop: { href: "/kwaliteit-en-registraties", tekst: "Onze registraties" },
  },

  tarief: {
    label: "Kosten en vergoeding",
    anker: "Wat het kost",
    kop: "Wat een afspraak",
    accent: "bij ons kost",
    intro:
      "Een intake, en daarna de behandeling die bij je huid past. Of je verzekering meebetaalt, hangt af van je klacht en je polis.",
    rijen: [
      { naam: "Intake met huidanalyse", prijs: INTAKE_PRIJS },
      {
        naam: "Medische peeling",
        prijs: behandeling("peelings").prijs,
        vanaf: true,
      },
      {
        naam: "Microneedling",
        prijs: behandeling("skinpen").prijs,
        vanaf: true,
      },
      {
        naam: "IPL bij pigment of roodheid",
        prijs: behandeling("nordlys-pigment").prijs,
        vanaf: true,
      },
      {
        naam: "HydraFacial",
        prijs: behandeling("hydrafacial").prijs,
        vanaf: true,
      },
    ],
    zin: "Huidtherapie zit niet in de basisverzekering, maar bij de meeste verzekeraars wel in het aanvullende pakket. Dan moet er een medische reden zijn, en vaak een verwijzing van je huisarts vóór de eerste behandeling. Hoe dat per stap zit, staat op [de pagina over vergoedingen](/vergoedingen). [MEDISCHE-CHECK-ROJDA]",
    afspraak: [
      ...afspraakBlokken({ naam: "de behandeling" }).slice(0, 2),
      {
        kop: "Wil je het vergoed krijgen",
        zin: "Regel dan vóór je eerste afspraak de verwijzing van je huisarts, als je polis die vraagt, en zeg bij het boeken dat je een vergoeding verwacht. Dan kijken we meteen of alles klopt. Achteraf een verwijzing opsturen accepteren verzekeraars zelden.",
      },
    ],
  },

  welNiet: {
    intro:
      "Een huidtherapeut behandelt wat in en op de huid speelt. Voor een diagnose, voor medicijnen en voor wat met spoed moet, ben je bij een arts.",
    wel: [
      "Acne, en de littekens en vlekken die het achterlaat",
      "Pigmentvlekken, couperose en rosacea",
      "Ongewenste haargroei, ook bij PCOS",
      "Littekens na een operatie of keizersnede, en striae",
      "Een huid die sneller veroudert of verslapt dan je wilt",
    ],
    niet: [
      "Een diagnose stellen. Twijfel je over een plek die verandert, dan ga je naar je huisarts [MEDISCHE-CHECK-ROJDA]",
      "Medicijnen voorschrijven. Antibiotica, de pil of isotretinoïne lopen via je huisarts of dermatoloog",
      "Een ontsteking die koorts geeft of snel erger wordt. Dan bel je dezelfde dag je huisarts [MEDISCHE-CHECK-ROJDA]",
      "Beloven hoeveel sessies je nodig hebt. Dat hangt af van hoe je huid reageert, en dat meten we tussendoor",
      "Behandelen als het op dat moment niet verstandig is. Dan hoor je dat, en adviseren we te wachten of een arts te zien",
    ],
  },

  vergelijking: {
    label: "Naast elkaar",
    anker: "Vergelijking",
    kop: "Wie doet wat",
    accent: "in de huidzorg",
    intro:
      "Vier titels die je tegenkomt als je iets aan je huid wilt laten doen. Wat de opleiding is, of de titel beschermd is en waarvoor je er komt.",
    kolommen: ["Titel", "Opleiding", "Beschermd", "Waarvoor je er komt"],
    rijen: [
      {
        naam: "Huidtherapeut",
        href: "/kwaliteit-en-registraties",
        cellen: [
          "Hbo-bachelor huidtherapie",
          "Ja, artikel 34 van de Wet BIG",
          "Acne, littekens, pigment, vaatjes en haargroei, behandeld met apparatuur en peelings",
        ],
      },
      {
        naam: "Dermatoloog",
        cellen: [
          "Arts, daarna de specialisatie tot dermatoloog",
          "Ja, in het BIG-register",
          "Een diagnose, huidziekten, verdachte plekken en medicijnen. Meestal via je huisarts [MEDISCHE-CHECK-ROJDA]",
        ],
      },
      {
        naam: "Schoonheidsspecialist",
        cellen: [
          "Een vakopleiding, meestal op mbo-niveau",
          "Nee",
          "Verzorgende behandelingen: reinigen, verzorgen en ontspannen [MEDISCHE-CHECK-ROJDA]",
        ],
      },
      {
        naam: "Orthomoleculair huidspecialist",
        href: "/team",
        cellen: [
          "Een aanvullende opleiding naast de huidtherapie of schoonheidsspecialiste",
          "Nee",
          "Wat er van binnenuit meespeelt: voeding, hormonen en vertering",
        ],
      },
    ],
    bijschrift:
      "Vier beroepen in de huidzorg vergeleken op opleiding, bescherming van de titel en waarvoor je er komt",
  },

  wie: {
    label: "Onze huidtherapeuten",
    zin: `Bij ons werken ${opsomming(HUIDTHERAPEUTEN)}: ${AANTAL} huidtherapeuten, allemaal ingeschreven in het Kwaliteitsregister Paramedici.${
      IN_OPLEIDING
        ? ` ${IN_OPLEIDING.naam} doet de laserbehandelingen en volgt de opleiding tot huidtherapeut.`
        : ""
    }`,
  },

  reviews: {
    onderwerp: "vakkundig",
    intro:
      "Reviews waarin klanten iets zeggen over de kennis en de zorgvuldigheid van hun behandelaar. Ze komen rechtstreeks uit onze agenda en staan er zoals ze geschreven zijn.",
  },

  faq: [
    {
      vraag: "Wat kost een huidtherapeut in Rotterdam?",
      antwoord: `Bij Diba Clinics kost een intake met huidanalyse ${euro(INTAKE_PRIJS)}. Wordt er in dezelfde afspraak behandeld, dan vervalt dat bedrag en betaal je alleen de behandeling. Behandelingen hebben elk hun eigen tarief; een medische peeling begint bij ${euro(behandeling("peelings").prijs)} en microneedling bij ${euro(behandeling("skinpen").prijs)}. Alle bedragen staan op onze tarievenpagina.`,
    },
    {
      vraag: "Wordt huidtherapie vergoed?",
      antwoord:
        "Soms. Huidtherapie zit niet in de basisverzekering, maar bij de meeste verzekeraars wel in het aanvullende pakket. Dan moet er een medische reden zijn, en vaak een verwijzing van je huisarts die er is vóór de eerste behandeling. Een cosmetische behandeling wordt niet vergoed. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Heb ik een verwijzing van de huisarts nodig?",
      antwoord:
        "Om bij ons te komen niet: je kunt rechtstreeks een afspraak maken. Voor een vergoeding soms wel, want veel aanvullende pakketten vergoeden alleen met een verwijzing. Regel die dan vóór je eerste afspraak; achteraf accepteren verzekeraars hem zelden.",
    },
    {
      vraag: "Wat is het verschil tussen een huidtherapeut en een dermatoloog?",
      antwoord:
        "Een dermatoloog is een arts. Die stelt diagnoses, behandelt huidziekten en schrijft medicijnen voor, en je komt er meestal via je huisarts. Een huidtherapeut is een paramedicus die huidklachten behandelt met apparatuur, peelings en begeleiding, en je kunt er rechtstreeks terecht. Ben je onder behandeling bij een dermatoloog, dan kun je vaak ook bij ons terecht; vertel het ons wel. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Wat is het verschil met een schoonheidsspecialist?",
      antwoord:
        "De opleiding en de titel. Huidtherapeut is een beschermde titel met een hbo-opleiding van vier jaar; schoonheidsspecialist is geen beschermde titel. In de praktijk zie je het verschil vooral bij behandelingen waarbij de instelling per huid telt, zoals laser, microneedling en sterkere peelings. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Hoe weet ik of een huidtherapeut geregistreerd is?",
      antwoord:
        "Door het na te kijken in het Kwaliteitsregister Paramedici. Dat register is openbaar en je zoekt er op naam. Onze huidtherapeuten staan erin, en hun namen staan op de teampagina.",
    },
    {
      vraag: "Welke klachten behandelt een huidtherapeut?",
      antwoord:
        "Acne en acnelittekens, pigmentvlekken, couperose en rosacea, ongewenste haargroei, littekens na een operatie, striae en huidveroudering. Twijfel je over wat je hebt, dan beginnen we met een meting, en als het iets is voor een arts, hoor je dat.",
    },
    {
      vraag: "Hoe gaat een eerste afspraak?",
      antwoord:
        "Je boekt een behandeling op advies. We reserveren maximaal twee uur: de intake met een meting van je huid, en daarna minstens een uur om te behandelen als dat verantwoord is en je dat wilt. Je zit daarna nergens aan vast.",
    },
    VRAAG_WAAR,
  ],

  twijfel: {
    voor: "Weet je niet of je",
    accent: "hier goed",
    na: "zit",
    zin: "Dat hoef je ook niet te weten voordat je komt. We meten je huid, bespreken wat er speelt en zeggen of het iets is voor ons, voor je huisarts of voor allebei. Blijkt behandelen niet verstandig, dan hoor je dat en doen we het niet.",
  },

  cta: {
    kop: "Naar een huidtherapeut",
    accent: "in Rotterdam",
    tekst:
      "We beginnen met een meting van je huid en bespreken daarna wat erbij past. Is behandelen verstandig, dan kan dat vaak in dezelfde afspraak.",
    topic: "huidtherapeut",
  },

  schema: {
    dienst: { naam: "Huidtherapie", soort: "Huidtherapie" },
  },
};
