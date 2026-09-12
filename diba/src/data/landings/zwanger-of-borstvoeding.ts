import {
  INTAKE_PRIJS,
  euro,
  VRAAG_WAAR,
  type Landing,
} from "@/data/landings/types";

/**
 * Zwanger of borstvoeding: wat kan wel.
 *
 * WAAROM DEZE PAGINA BESTAAT.
 *
 * Het staat op twaalf plekken op de site als bijzin: in de contra-indicaties van de U225
 * en de peelinglijnen, in de vragen bij striae en melasma, en als één regel in de lijst
 * met wat we nu even niet doen (`weigeren.ts`). Wie zwanger is en zich afvraagt wat er nog
 * kan, komt op geen van die pagina's terecht, want ze zijn geordend op behandeling.
 *
 * WAAR DE TABEL VANDAAN KOMT, EN WAT ERIN ONTBREEKT.
 *
 * De regels over peelings, skinboosters, microneedling en de pigmenttrajecten staan al als
 * contra-indicatie in de data en zijn daar gemarkeerd. Voor laser en IPL staat er niets op
 * de site, en dan is een stellige regel hier verzinnen. Die twee staan er daarom als
 * "in overleg" met een vlag erbij, tot Rojda de lijn heeft vastgelegd.
 *
 * [MEDISCHE-CHECK-ROJDA] elke regel in de tabel en elk antwoord hieronder.
 */

export const ZWANGER_OF_BORSTVOEDING: Landing = {
  slug: "zwanger-of-borstvoeding",
  soort: "vraag",
  gewijzigd: "2026-09-12",
  titel: "Zwanger of borstvoeding: wat kan wel",
  omschrijving:
    "Welke huidbehandelingen tijdens een zwangerschap en borstvoeding wel kunnen en welke wachten, en waarom pigment in die periode vaak vanzelf verandert.",
  kruimel: "Zwangerschap",
  h1: { kop: "Zwanger of", accent: "borstvoeding" },
  antwoord:
    "Tijdens een zwangerschap en in de periode dat je borstvoeding geeft doen we een deel van de behandelingen niet: voor peelings, microneedling, skinboosters en de pigmenttrajecten ontbreekt het onderzoek om te kunnen zeggen dat het veilig is. Wat wel kan is meten, adviseren en de rustige gezichtsbehandelingen, zoals dermaplaning. Zeg het bij het maken van de afspraak, dan kiezen we daaruit. [MEDISCHE-CHECK-ROJDA]",
  feiten: [
    { kop: "Altijd mogelijk", waarde: "Meten en advies" },
    { kop: "Meestal wel", waarde: "Dermaplaning" },
    { kop: "Wacht", waarde: "Peeling en needling" },
    { kop: "Pigment", waarde: "Verandert vaak zelf" },
  ],
  beeld: {
    src: "/images/shoot/nazorg-producten.jpg",
    alt: "Cliënt en behandelaar in gesprek aan tafel, met koffie erbij",
  },
  kaart: {
    vraag: "Wat kan er tijdens zwangerschap",
    zin: "Welke behandelingen wachten tot na de borstvoeding, wat er in die maanden wel kan, en waarom pigment vaak vanzelf verandert.",
  },

  werking: {
    label: "Het uitgangspunt",
    anker: "Waarom wachten",
    kop: "Waarom een deel",
    accent: "moet wachten",
    intro:
      "Het gaat bijna nooit om een aangetoond gevaar. Het gaat om het ontbreken van onderzoek, en dat is in deze periode een reden op zich.",
    alineas: [
      "Zwangere vrouwen worden om begrijpelijke redenen niet in onderzoek naar huidbehandelingen opgenomen. Daardoor is er voor een deel van wat wij doen geen enkel bewijs dat het veilig is, en ook niet dat het schadelijk is. Als die twee allebei ontbreken, is het niet doen de enige keuze die te verdedigen valt. [MEDISCHE-CHECK-ROJDA]",
      "Daar komt bij dat je huid in deze maanden anders reageert. Hormonen maken pigmentcellen actiever, de doorbloeding is hoger en de huid is vaak gevoeliger. Een peeling of een laser die eerder rustig verliep, kan nu een reactie geven die er anders niet geweest zou zijn. [MEDISCHE-CHECK-ROJDA]",
      "Bij borstvoeding speelt nog iets mee: een deel van de stoffen die bij een behandeling op of in de huid komen, is niet onderzocht op wat er in de moedermelk terechtkomt. Daarom loopt die periode in ons beleid mee met de zwangerschap. [MEDISCHE-CHECK-ROJDA]",
      "Voor pigment is er een tweede reden om te wachten, en die is praktisch. Vlekken die tijdens een zwangerschap zijn ontstaan, trekken erna vaak grotendeels weg. Behandelen terwijl de aanjager nog aan staat, kost geld voor een resultaat dat je deels gratis had gekregen. [MEDISCHE-CHECK-ROJDA]",
      "Op het wachten is één uitzondering, en dat is de meting. Die brengt niets in je huid en levert juist nu iets op, want hormonen veranderen pigment, talg en gevoeligheid tegelijk. Wat je in deze maanden vastlegt, is straks het vertrekpunt waarmee je ziet wat er echt is gebleven en wat vanzelf is weggetrokken.",
    ],
    verder:
      "Wat pigment in deze periode doet staat bij [melasma](/huidproblemen/melasma). Hoe het met striae na een zwangerschap zit staat bij [striae](/huidproblemen/striae).",
  },

  onderscheid: {
    label: "Wat wel kan",
    anker: "Wat wel kan",
    kop: "Wat er in die",
    accent: "maanden wel kan",
    intro:
      "Er blijft meer over dan mensen denken. Het meeste daarvan werkt aan de oppervlakte, en dat is precies waarom het kan.",
    alineas: [
      "De meting kan altijd. Je huid wordt in kaart gebracht, je hoort wat er speelt en wat er straks bij past, en die opname is het vertrekpunt waarmee je na de borstvoeding meteen kunt beginnen. Voor wie in deze periode juist verandering in haar huid ziet, is dat vaak het nuttigste wat er nu te doen is.",
      "Dermaplaning kan, want daarbij komt alleen een steriel mesje over de buitenste laag en er zijn geen zuren bij betrokken. Een rustige, reinigende gezichtsbehandeling kan meestal ook, met producten die de behandelaar erop uitzoekt. Wat er precies past, beoordeelt zij bij de afspraak. [MEDISCHE-CHECK-ROJDA]",
      "Verder is dit de periode waarin zonbescherming het meeste oplevert. Bij pigment dat in de zwangerschap is opgekomen, houdt dagelijks beschermen de vlekken lichter en voorkomt het dat ze zich uitbreiden. Dat is geen uitstel maar behandeling, en het is het enige deel dat nu al werkt. [MEDISCHE-CHECK-ROJDA]",
      "Ook je eigen routine verandert in deze maanden. Retinol en de sterkere zuren laat je staan, en je huid reageert bovendien gevoeliger dan je van jezelf gewend bent. Wat er dan wel in past is meestal een eenvoudiger schema: rustig reinigen, een vochtinbrenger en dagelijkse zonbescherming. [MEDISCHE-CHECK-ROJDA]",
      "Zet het ook in je huidprofiel voordat je komt. Dan staat het in je dossier voordat het gesprek begint, en hoeft de behandelaar niet halverwege het plan om te gooien.",
    ],
    beeld: {
      src: "/images/shoot/beh-dermaplaning.jpg",
      alt: "Dermaplaning met een chirurgisch mesje over de wang",
    },
    knop: {
      href: "/kennisbank/dermaplaning-rotterdam",
      tekst: "Over dermaplaning",
    },
  },

  welNiet: {
    intro:
      "De grens ligt bij wat er in of door de huid gaat. Wat aan de oppervlakte blijft, kan in overleg meestal gewoon.",
    wel: [
      "De huidanalyse en het advies, in elke maand",
      "Dermaplaning en een rustige gezichtsbehandeling, in overleg [MEDISCHE-CHECK-ROJDA]",
      "Zonbescherming en een thuisroutine die je huid rustig houdt",
      "Een plan maken voor de periode na de borstvoeding",
    ],
    niet: [
      "Peelings met zuren, ook de mildere sterktes [MEDISCHE-CHECK-ROJDA]",
      "Microneedling, op het gezicht en op het lichaam [MEDISCHE-CHECK-ROJDA]",
      "Skinboosters en alles wat met een naald de huid in gaat [MEDISCHE-CHECK-ROJDA]",
      "De pigmenttrajecten Cosmelan en Dermamelan [MEDISCHE-CHECK-ROJDA]",
    ],
  },

  vergelijking: {
    label: "Per behandeling",
    anker: "Per behandeling",
    kop: "Wat kan en wat",
    accent: "wacht tot erna",
    intro:
      "Per behandeling wat er tijdens de zwangerschap en tijdens de borstvoeding gebeurt. Waar er twijfel is, staat dat er als twijfel en niet als regel.",
    kolommen: [
      "Behandeling",
      "Tijdens de zwangerschap",
      "Tijdens de borstvoeding",
    ],
    rijen: [
      {
        naam: "Huidanalyse",
        href: "/kennisbank/huidanalyse-rotterdam",
        cellen: ["Kan, in elke maand", "Kan"],
      },
      {
        naam: "Dermaplaning",
        href: "/kennisbank/dermaplaning-rotterdam",
        cellen: [
          "Kan. Geen zuren, alleen de buitenste laag. [MEDISCHE-CHECK-ROJDA]",
          "Kan. [MEDISCHE-CHECK-ROJDA]",
        ],
      },
      {
        naam: "HydraFacial",
        href: "/kennisbank/hydrafacial-rotterdam",
        cellen: [
          "Meestal wel, met aangepaste producten. [MEDISCHE-CHECK-ROJDA]",
          "Meestal wel. [MEDISCHE-CHECK-ROJDA]",
        ],
      },
      {
        naam: "Chemische peeling",
        href: "/kennisbank/chemische-peeling-rotterdam",
        cellen: [
          "Nee. Staat als contra-indicatie bij de peelinglijnen. [MEDISCHE-CHECK-ROJDA]",
          "Nee. [MEDISCHE-CHECK-ROJDA]",
        ],
      },
      {
        naam: "Microneedling",
        href: "/kennisbank/microneedling-rotterdam",
        cellen: [
          "Nee, ook niet op het lichaam. [MEDISCHE-CHECK-ROJDA]",
          "Nee. [MEDISCHE-CHECK-ROJDA]",
        ],
      },
      {
        naam: "Skinboosters",
        href: "/kennisbank/skinboosters-rotterdam",
        cellen: [
          "Nee. Staat als contra-indicatie bij de U225. [MEDISCHE-CHECK-ROJDA]",
          "Nee. [MEDISCHE-CHECK-ROJDA]",
        ],
      },
      {
        naam: "Laserontharing",
        href: "/laserontharing",
        cellen: [
          "In overleg; meestal wachten we tot erna. [MEDISCHE-CHECK-ROJDA]",
          "In overleg. [MEDISCHE-CHECK-ROJDA]",
        ],
      },
      {
        naam: "IPL bij pigment of roodheid",
        href: "/kennisbank/ipl-rotterdam",
        cellen: [
          "In overleg; pigment verandert nu toch. [MEDISCHE-CHECK-ROJDA]",
          "In overleg. [MEDISCHE-CHECK-ROJDA]",
        ],
      },
      {
        naam: "Cosmelan en Dermamelan",
        href: "/kennisbank/cosmelan-dermamelan-rotterdam",
        cellen: [
          "Nee. We beginnen er in deze periode niet aan.",
          "Nee. [MEDISCHE-CHECK-ROJDA]",
        ],
      },
      {
        naam: "Striae behandelen",
        href: "/huidproblemen/striae",
        cellen: [
          "Meten kan, behandelen niet.",
          "Nee. We wachten tot na de borstvoeding en beoordelen dan opnieuw.",
        ],
      },
    ],
    bijschrift:
      "Per behandeling wat er tijdens een zwangerschap en tijdens de borstvoeding wel en niet gebeurt bij Diba Clinics",
  },

  wie: {
    label: "Wie dit beoordeelt",
    zin: "De huidtherapeut die je afspraak doet, aan de hand van wat je doorgeeft en van wat de meting laat zien. Staat het in je huidprofiel, dan is het bekend voordat je binnen bent en gaat de tijd naar het gesprek in plaats van naar de vragenlijst.",
  },

  faq: [
    {
      vraag: "Kan ik een gezichtsbehandeling doen als ik zwanger ben?",
      antwoord:
        "Een rustige, reinigende behandeling kan meestal wel, met producten die daarop uitgezocht zijn. Dermaplaning kan ook, want daarbij komen geen zuren aan te pas. Wat er in jouw geval past, beoordeelt de behandelaar bij de afspraak. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Mag microneedling tijdens de zwangerschap?",
      antwoord:
        "Nee. We behandelen dan niet met microneedling, ook niet op het lichaam en ook niet in een lagere diepte. Na de borstvoeding beoordelen we opnieuw; bij striae is dat vaak ook het moment waarop ze uit zichzelf al lichter zijn geworden. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Mag een chemische peeling als ik zwanger ben?",
      antwoord:
        "Nee. Zwangerschap en borstvoeding staan bij onze peelinglijnen als contra-indicatie, en dat geldt ook voor de mildere sterktes. Voor een huid die in deze periode ruw of dof staat, kijken we naar wat er zonder zuren mogelijk is. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Kan laserontharing tijdens de zwangerschap?",
      antwoord:
        "Dat bespreken we per geval, en meestal wachten we tot erna. Er is geen onderzoek dat schade aantoont, maar er is ook geen onderzoek dat veiligheid aantoont, en daar komt bij dat haargroei door de hormonen toch verandert. Zeg het bij het boeken, dan kiezen we samen het moment. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Ik heb pigmentvlekken gekregen tijdens mijn zwangerschap.",
      antwoord:
        "Beschermen wel, behandelen niet. Vlekken die door de hormonen zijn opgekomen trekken na de zwangerschap vaak grotendeels weg, en behandelen terwijl de aanjager nog aan staat levert weinig blijvends op. Dagelijkse zonbescherming houdt ze in die tijd zo licht mogelijk. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Hoe lang na de bevalling kan ik weer behandeld worden?",
      antwoord:
        "Geef je geen borstvoeding, dan kan er na de bevalling weer gemeten en behandeld worden zodra je je er goed bij voelt. Geef je wel borstvoeding, dan wachten we daarmee tot die periode voorbij is. De meting kan intussen gewoon. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Moet ik het zeggen als ik zwanger ben of borstvoeding geef?",
      antwoord:
        "Ja, en het liefst bij het maken van de afspraak. Dan reserveren we meteen de juiste behandeling en de juiste tijd, in plaats van dat het plan aan de balie omgegooid moet worden. Je kunt het ook vooraf in je huidprofiel zetten.",
    },
    {
      vraag: "Heeft het zin om nu al langs te komen?",
      antwoord: `Vaak wel. De meting legt vast hoe je huid er nu voor staat, en dat is het vertrekpunt waarmee je na de borstvoeding direct kunt beginnen. Een losse intake kost ${euro(INTAKE_PRIJS)} en duurt maximaal dertig minuten.`,
    },
    {
      vraag: "Mag ik retinol blijven gebruiken als ik zwanger ben?",
      antwoord:
        "Nee. Retinol en de verwante vitamine A-zuren laat je in deze periode staan, en dat geldt ook voor de sterkere zuren uit je eigen routine. Wat er dan wel past is meestal een eenvoudiger schema: rustig reinigen, een vochtinbrenger en dagelijkse zonbescherming. Neem je producten mee naar de afspraak, dan lopen we ze samen door. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Kan ik iets doen aan acne die tijdens de zwangerschap opkomt?",
      antwoord:
        "Binnen de grenzen hierboven wel. Wat in deze periode afvalt zijn de zuren, de medicatie en de behandelingen die de huid in gaan; wat overblijft is een rustige reiniging, een aangepaste thuisroutine en meekijken hoe het verloopt. Vaak zakt het na de bevalling weer, en dan pakken we op wat er dan nog staat. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Waarom loopt de borstvoeding mee met de zwangerschap?",
      antwoord:
        "Omdat voor een deel van de stoffen die bij een behandeling gebruikt worden niet onderzocht is wat er in de moedermelk terechtkomt. Dat is dezelfde reden als bij de zwangerschap: het ontbreken van onderzoek, en niet een aangetoond gevaar. [MEDISCHE-CHECK-ROJDA]",
    },
    VRAAG_WAAR,
  ],

  twijfel: {
    voor: "Weet je niet wat",
    accent: "nu kan",
    zin: "Bel of app het even voordat je boekt. We kijken dan samen wat er in deze periode past en wat beter wacht, en zo nodig plannen we alleen de meting. Dat scheelt je een afspraak die aan de balie alsnog verandert.",
  },

  cta: {
    kop: "Meten kan",
    accent: "altijd",
    tekst:
      "In het huidconsult leggen we vast hoe je huid er nu voor staat en bespreken we wat er in deze periode mogelijk is. Daarmee heb je een vertrekpunt voor straks.",
    topic: "zwangerschap",
  },

  schema: {},
};
