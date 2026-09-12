import {
  alsWoord,
  euro,
  INTAKE_PRIJS,
  VRAAG_WAAR,
  type Landing,
} from "@/data/landings/types";
import { TEAM } from "@/data/team";

/**
 * Hoe kies je een huidkliniek.
 *
 * WAAROM DEZE PAGINA IN DE GROEP "ZELF BEOORDELEN" HOORT.
 *
 * De kennisbank heeft een groep die belooft dat je hier leert beoordelen wat je
 * voorgeschoteld krijgt, ook bij een andere kliniek. Daar stond één pagina in, over onze
 * eigen registraties. Dat is het omgekeerde van de belofte: het gaat over ons.
 *
 * WAAROM HIJ NIET BOTST MET /kwaliteit-en-registraties.
 *
 * Die pagina gaat over onze registers en hoe je die nakijkt. Deze gaat over de vraag
 * ervoor: waar let je op als je nog moet kiezen, bij welke kliniek dan ook. Onze eigen
 * situatie staat er als laatste kolom in de tabel, zodat je ziet waar wij staan, en voor
 * de details wijst hij door.
 *
 * DE TOON, EN WAAROM DAT HIER MOEILIJKER IS.
 *
 * De stijlgids verbiedt het kleiner maken van anderen, en dat is precies de valkuil van
 * een pagina die gaat over kiezen. De uitweg is dat er alleen dingen op staan die je zelf
 * kunt nakijken: een openbaar register, een prijslijst, een foto met licht en hoek. Wat
 * iemand anders doet of laat, staat er niet in. Wat jij kunt controleren wel.
 */

const HUIDTHERAPEUTEN = TEAM.filter((t) => t.functie === "Huidtherapeut");
const AANTAL = alsWoord(HUIDTHERAPEUTEN.length);

export const HUIDKLINIEK_KIEZEN: Landing = {
  slug: "huidkliniek-kiezen",
  soort: "vraag",
  gewijzigd: "2026-09-12",
  titel: "Hoe kies je een huidkliniek",
  omschrijving:
    "Waar je op let bij een huidkliniek: welke registers je zelf kunt nakijken, wat een intake hoort op te leveren en hoe je een voor-en-nafoto leest.",
  kruimel: "Een kliniek kiezen",
  h1: { kop: "Hoe kies je een", accent: "huidkliniek" },
  antwoord:
    "Bij het kiezen van een huidkliniek zijn vier dingen na te kijken zonder dat je er geweest bent: of je behandelaar in een openbaar register staat, of er eerst gemeten wordt voordat er behandeld wordt, of de tarieven vooraf op de site staan, en of er wordt uitgelegd wanneer iets juist niet verstandig is. De rest merk je pas in de behandelkamer.",
  feiten: [
    { kop: "Na te kijken", waarde: "Openbare registers" },
    { kop: "Beschermde titel", waarde: "Huidtherapeut" },
    { kop: "Vooraf", waarde: "Een meting" },
    { kop: "Onafhankelijk", waarde: "ZorgkaartNederland" },
  ],
  beeld: {
    src: "/images/shoot/kliniek-team.jpg",
    alt: "Twee behandelaars van Diba Clinics met koffie in de gang van de kliniek",
  },
  kaart: {
    vraag: "Hoe kies je een kliniek",
    zin: "Welke registers je zelf kunt nakijken, wat een intake hoort op te leveren, hoe je een voor-en-nafoto leest en wanneer nee het goede antwoord is.",
  },

  werking: {
    label: "Wat je nakijkt",
    anker: "Wat je nakijkt",
    kop: "Wat je vooraf",
    accent: "kunt nakijken",
    intro:
      "Vier dingen staan online en zijn in tien minuten te controleren. Ze zeggen niet alles, maar ze zeggen meer dan een indruk van een website.",
    alineas: [
      "Huidtherapeut is een wettelijk beschermde opleidingstitel, vastgelegd in artikel 34 van de Wet BIG. Daar hoort een hbo-bachelor huidtherapie van vier jaar bij, en die opleiding bestaat in Nederland op twee plekken. Schoonheidsspecialist is geen beschermde titel; dat zegt niets over iemands vakmanschap, maar het betekent wel dat de titel zelf geen garantie draagt.",
      "De titel zegt dat iemand de opleiding heeft gedaan. Het Kwaliteitsregister Paramedici zegt iets anders: dat iemand het vak ook uitoefent en bijhoudt. Voor herregistratie tellen minstens 1600 werkuren over drie jaar plus 160 punten bijscholing. Dat register is openbaar en je zoekt er op naam, ook op de naam van je behandelaar bij een andere kliniek.",
      "Voor het niet-paramedische deel van het werk bestaan ANBOS en het SKIN Register. Het eerste is de branchevereniging met een gedragscode, hygiënerichtlijnen en een klachtenregeling; het tweede registreert schoonheidsspecialisten op eigen naam. Ook die zijn na te zoeken.",
      "En dan zijn er de beoordelingen. Een cijfer dat op de site zelf staat, staat er omdat iemand het daar heeft gezet. Een oordeel dat buiten de kliniek om wordt bijgehouden, zoals op ZorgkaartNederland van de Patiëntenfederatie, kan door de kliniek niet geplaatst of weggehaald worden, en zegt daarmee meer.",
    ],
    verder:
      "Bij welke registers wij horen en hoe je dat nakijkt staat op [kwaliteit en registraties](/kwaliteit-en-registraties). Wie hier werkt en met welke titel staat bij [het team](/team).",
  },

  onderscheid: {
    label: "In de kliniek",
    anker: "In de kliniek",
    kop: "Wat een eerste",
    accent: "afspraak oplevert",
    intro:
      "Het tweede deel zie je pas als je binnen bent, en het is het deel dat het verschil maakt tussen een behandeling en een plan.",
    alineas: [
      "Een eerste afspraak hoort te beginnen met kijken en meten, en niet met behandelen. Zonder vertrekpunt is achteraf niet vast te stellen of er iets is veranderd, en dan blijft alleen het gevoel over dat het wel goed zat. Vraag dus of er gemeten wordt, waarmee, en of je die opname terugkrijgt.",
      "Daarna hoort er een plan te komen waarin staat wat er nodig is, hoeveel keer dat is en wat het kost. Een bedrag dat pas in de behandelkamer valt is geen prijsafspraak maar een verrassing. Alle tarieven horen vooraf vindbaar te zijn, en die van ons staan op de tarievenpagina.",
      "Het derde is het lastigste om te vragen en het meest zeggend: wat gebeurt er als behandelen op dat moment niet verstandig is. Een huid die ontstoken is, een gebruinde huid vlak voor een laserbehandeling, een plek die eerst door een arts beoordeeld moet worden. Daar hoort een nee bij, met een reden en een alternatief.",
      "Ten slotte de foto's. Een voor-en-nafoto is alleen te vergelijken als het licht, de hoek, de afstand en de make-up gelijk zijn. Verschilt daar iets aan, dan vergelijk je twee opnames en geen resultaat. Vraag hoe de opnames gemaakt worden, en of je die van jezelf naast elkaar te zien krijgt.",
    ],
    beeld: {
      src: "/images/shoot/ontvangst-vertrek.jpg",
      alt: "Cliënt zwaait bij het verlaten van de kliniek, met een tas van Diba Clinics",
    },
    knop: { href: "/intake", tekst: "Wat een huidconsult inhoudt" },
  },

  welNiet: {
    intro:
      "Deze punten zeggen iets over de manier van werken. Over de uitkomst van jouw behandeling zeggen ze minder dan mensen hopen.",
    wel: [
      "Of de titel van je behandelaar beschermd is, en of de registratie klopt",
      "Of er gemeten wordt voordat er behandeld wordt",
      "Of het tarief vooraf vindbaar is, met varianten en al",
      "Of er uitgelegd wordt wanneer iets beter niet gebeurt",
    ],
    niet: [
      "Of een behandeling bij jouw huid past. Dat volgt pas uit de meting",
      "Hoeveel sessies je nodig hebt. Een getal vooraf gaat over iemand anders zijn huid",
      "Of een duurder apparaat een beter resultaat geeft. Wat telt is de keuze erachter",
      "Hoe het voelt om er te zitten. Daarvoor moet je een keer geweest zijn",
    ],
  },

  vergelijking: {
    label: "De checklist",
    anker: "Checklist",
    kop: "Zeven dingen",
    accent: "om na te vragen",
    intro:
      "Wat je kunt controleren, hoe je dat doet, en hoe het bij ons geregeld is. De middelste kolom werkt bij elke kliniek, ook als je hier niet komt.",
    kolommen: ["Waar je op let", "Hoe je het nakijkt", "Bij ons"],
    rijen: [
      {
        naam: "De titel van je behandelaar",
        href: "/team",
        cellen: [
          "Huidtherapeut is beschermd in artikel 34 van de Wet BIG, met een hbo-opleiding van vier jaar erachter.",
          `${AANTAL.charAt(0).toUpperCase()}${AANTAL.slice(1)} huidtherapeuten, met naam en functie op de teampagina`,
        ],
      },
      {
        naam: "De registratie",
        href: "/kwaliteit-en-registraties",
        cellen: [
          "Het Kwaliteitsregister Paramedici is openbaar; je zoekt er op naam.",
          "Onze huidtherapeuten staan erin, en de schoonheidsspecialisten in het SKIN Register",
        ],
      },
      {
        naam: "De meting vooraf",
        href: "/kennisbank/huidanalyse-rotterdam",
        cellen: [
          "Vraag of er gemeten wordt voordat er behandeld wordt, en waarmee.",
          `Elke eerste afspraak begint met een meting op de EVE-M; ${euro(INTAKE_PRIJS)}, en dat vervalt bij behandelen`,
        ],
      },
      {
        naam: "Het tarief",
        href: "/tarieven",
        cellen: [
          "Zoek de prijslijst op de site en kijk of jouw behandeling er met varianten in staat.",
          "Alle tarieven staan online, ook de losse zones bij ontharen",
        ],
      },
      {
        naam: "Wanneer iets niet doorgaat",
        href: "/intake",
        cellen: [
          "Vraag wat er gebeurt als behandelen op dat moment niet verstandig is.",
          "Dan hoor je dat bij de meting, met de reden erbij en met waar je wel terechtkunt",
        ],
      },
      {
        /* Geen link naar /resultaten: die pagina staat sinds 5 september 2026 dicht en
           verwijst door. Zodra hij weer opengaat hoort hij hier. */
        naam: "De voor-en-nafoto's",
        cellen: [
          "Let op licht, hoek, afstand en make-up. Verschilt dat, dan vergelijk je twee opnames.",
          "Opnames uit het eigen apparaat, onder hetzelfde licht, die je bij de controle naast elkaar ziet",
        ],
      },
      {
        naam: "De beoordelingen",
        cellen: [
          "Kijk of er ook een oordeel bestaat dat niet door de kliniek zelf wordt bijgehouden.",
          "Onze reviews komen uit de agenda, en op ZorgkaartNederland staan we met een 9,7",
        ],
      },
    ],
    bijschrift:
      "Zeven punten om na te vragen bij een huidkliniek, met hoe je ze zelf nakijkt en hoe het bij Diba Clinics geregeld is",
  },

  wie: {
    label: "Wie je hier ziet",
    zin: `Bij ons werken ${AANTAL} huidtherapeuten, schoonheidsspecialisten en orthomoleculair huidspecialisten. Welke titel bij welke behandeling hoort staat per persoon op de teampagina, en wie jouw afspraak doet hoor je bij het maken ervan.`,
  },

  faq: [
    {
      vraag: "Waar let ik op bij een voor-en-nafoto?",
      antwoord:
        "Op licht, hoek, afstand en make-up. Zijn die vier gelijk, dan vergelijk je een huid met dezelfde huid. Verschilt er iets aan, dan vergelijk je twee opnames en zegt het verschil niets over de behandeling. Vraag ook of de foto's uit een vast apparaat komen of uit een telefoon.",
    },
    {
      vraag: "Is een duurdere behandeling beter?",
      antwoord:
        "Niet automatisch. De prijs zegt iets over het apparaat, de tijd en de producten, en niets over of die behandeling bij jouw klacht past. Een goedkopere behandeling die het juiste doet levert meer op dan een dure die het verkeerde doet. Dat verschil komt uit de meting en niet uit de prijslijst.",
    },
    {
      vraag: "Moet ik een behandelplan op papier krijgen?",
      antwoord:
        "Je hoort in elk geval te horen wat er nodig is, hoeveel sessies dat zijn en wat het kost, voordat je iets afspreekt. Bij ons gaat dat gesprek na de meting, en je krijgt de uitkomst mee. Je zit daarna nergens aan vast.",
    },
    {
      vraag: "Mag ik vragen wie mij behandelt?",
      antwoord:
        "Ja, en dat is een normale vraag. Bij ons staat op de teampagina wie er werkt en met welke titel, en bij het maken van de afspraak hoor je wie hem doet. Wissel je van behandelaar, dan blijft je dossier met de metingen gewoon staan.",
    },
    {
      vraag: "Wat als een kliniek meteen wil behandelen?",
      antwoord:
        "Vraag dan waarop die keuze gebaseerd is. Behandelen zonder meting kan prima uitpakken, maar achteraf is niet vast te stellen wat er is veranderd, en bij een klacht die niet reageert weet je niet waar het misging. Bij ons begint een eerste afspraak daarom met kijken en meten.",
    },
    {
      vraag: "Hoe weet ik of een kliniek bij mijn verzekeraar hoort?",
      antwoord:
        "Dat staat in de zorgzoeker van je verzekeraar en meestal ook op de site van de kliniek. Een contract betekent niet dat alles vergoed wordt: dat hangt af van je aanvullende polis en van de indicatie. Wij zijn gecontracteerd bij alle Nederlandse zorgverzekeraars.",
    },
    {
      vraag: "Zegt een certificaat van een apparaat iets?",
      antwoord:
        "Het zegt dat het apparaat is wat het heet, en dat is nuttig. Het zegt niets over de instelling waarmee ermee gewerkt wordt, en juist daar zit het verschil tussen een goede en een matige behandeling. Vraag dus liever wie het apparaat bedient en hoe de instelling gekozen wordt.",
    },
    {
      vraag: "Wat is een redelijke uitkomst van een eerste afspraak?",
      antwoord:
        "Dat je weet wat je hebt, wat eraan te doen is, hoeveel keer dat vraagt en wat het kost. En dat je hoort wat er níet aan te doen is. Komt er uit de meting niets wat behandeling vraagt, dan is dat ook een uitkomst en heb je een consult betaald in plaats van een traject.",
    },
    {
      vraag: "Kan ik ergens terecht met een klacht over een behandeling?",
      antwoord:
        "Ja. Voor het paramedische deel loopt dat via de beroepsvereniging en het Kwaliteitsregister Paramedici; voor het schoonheidsdeel via de ANBOS-klachtenregeling. Die routes staan los van de kliniek zelf, en dat is precies de bedoeling ervan.",
    },
    VRAAG_WAAR,
  ],

  twijfel: {
    voor: "Twijfel je over",
    accent: "een aanbod",
    zin: "Leg het gerust hier voor. We zeggen wat we ervan vinden, ook als het antwoord is dat wat je gevonden hebt prima klinkt of dat je met die klacht bij een arts hoort. Daar hoef je geen afspraak voor te maken.",
  },

  cta: {
    kop: "Kom langs",
    accent: "en kijk zelf",
    tekst:
      "In het huidconsult meten we je huid en bespreken we wat er mogelijk is, met het aantal sessies en het tarief erbij. Daarna beslis je, en je zit nergens aan vast.",
    topic: "kliniek-kiezen",
  },

  schema: {},
};
