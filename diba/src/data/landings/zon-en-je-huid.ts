import { VRAAG_WAAR, type Landing } from "@/data/landings/types";

/**
 * Zon, vakantie en je huid.
 *
 * WAAROM DEZE PAGINA BESTAAT.
 *
 * Twee van de drie redenen waarom een afspraak hier niet doorgaat, gaan over zon: een
 * gebruinde huid en een vakantie die eraan komt (`weigeren.ts`). Dat staat nu verspreid
 * over de laserpagina's, de peelingpagina's en de pigmentpagina's, telkens als bijzin.
 * Wie de vraag stelt voordat hij een behandeling kiest, komt op geen van die pagina's.
 *
 * WAAROM HIJ NIET BOTST MET /huidproblemen/melasma EN /huidproblemen/pigmentvlekken.
 *
 * Die gaan over een klacht die je hebt. Deze gaat over de timing van een behandeling rond
 * zonblootstelling: wanneer het niet kan, hoe lang je wacht en wat er na afloop hoort. Het
 * enige wat ze delen is zonbescherming, en daarover verwijst deze pagina naar de
 * klachtpagina in plaats van hem over te schrijven.
 *
 * [MEDISCHE-CHECK-ROJDA] geldt voor vrijwel elke alinea hieronder: het gaat over UV,
 * pigment en hersteltijd. De wachttijd na zon staat er met opzet niet in weken in; die
 * hoort bij de intake, want hij verschilt per huid.
 */

export const ZON_EN_JE_HUID: Landing = {
  slug: "zon-en-je-huid",
  soort: "vraag",
  gewijzigd: "2026-09-12",
  titel: "Zon, vakantie en je huid",
  omschrijving:
    "Waarom een gebruinde huid niet gelaserd wordt, hoe lang je wacht na de zon, wat er na een behandeling hoort en hoe je een behandeling rond een vakantie plant.",
  kruimel: "Zon en vakantie",
  h1: { kop: "Zon, vakantie", accent: "en je huid" },
  antwoord:
    "Licht en kleur zitten elkaar in de weg. Zit er verse kleur van zon of zonnebank in je huid, dan neemt die het licht van een laser of IPL op en gaat de energie naar de verkeerde plek; daarom wordt er op een gebruinde huid niet gelaserd. Na een behandeling is je huid juist gevoeliger voor zon, en dan hoort dagelijks SPF 50 erbij. [MEDISCHE-CHECK-ROJDA]",
  feiten: [
    { kop: "Voor laser", waarde: "Eigen kleur terug" },
    { kop: "Na een peeling", waarde: "Dagelijks SPF 50" },
    { kop: "Zonvakantie", waarde: "Plan het erna" },
    { kop: "Pigmenttraject", waarde: "Niet in de zomer" },
  ],
  beeld: {
    src: "/images/shoot/beh-lichaam.jpg",
    alt: "Handstuk van de laser op de huid van een arm tijdens een behandeling",
  },
  kaart: {
    vraag: "Mag ik in de zon",
    zin: "Waarom een gebruinde huid niet gelaserd wordt, hoe lang je wacht na de zon en wat er na een behandeling hoort.",
  },

  werking: {
    label: "Wat zon doet",
    anker: "Wat zon doet",
    kop: "Wat de zon met",
    accent: "je huid doet",
    intro:
      "Bruin worden is geen kleur die je krijgt maar een reactie die je huid maakt. Dat is precies waarom het in de weg zit bij een behandeling met licht.",
    alineas: [
      "Onder invloed van UV maken de pigmentcellen in je opperhuid extra melanine. Dat pigment gaat als een laagje boven de celkernen liggen en vangt een deel van het licht op dat erna binnenkomt. Je huid doet dat om zichzelf te beschermen, en het is dus een teken dat er schade is opgetreden en niet dat er niets aan de hand was. [MEDISCHE-CHECK-ROJDA]",
      "Dat extra pigment blijft weken tot maanden zitten, ook als je zelf vindt dat je kleur er alweer af is. Voor een laser telt alleen wat er op dat moment in je huid zit, en niet wat je in de spiegel ziet. [MEDISCHE-CHECK-ROJDA]",
      "Zon versnelt daarnaast het verouderen van je huid en jaagt pigmentvlekken aan. Bij melasma is zonbescherming geen advies naast de behandeling maar een deel van de behandeling zelf: zonder die bescherming loopt de rest terug binnen één seizoen. [MEDISCHE-CHECK-ROJDA]",
      "Een huid die net behandeld is, mist tijdelijk een deel van zijn afweer. Na een peeling, na microneedling en na laser is de barrière opener en reageert het pigment heftiger op UV. Dat is de periode waarin een dag zonder bescherming een vlek kan achterlaten die er eerst niet was. [MEDISCHE-CHECK-ROJDA]",
    ],
    verder:
      "Wat zonbescherming bij pigment precies doet staat bij [melasma](/huidproblemen/melasma) en bij [pigmentvlekken](/huidproblemen/pigmentvlekken). Welke rol je huidtype speelt staat bij [het Fitzpatrick-huidtype](/kennisbank/fitzpatrick-huidtype).",
  },

  onderscheid: {
    label: "Voor en na",
    anker: "Voor en na",
    kop: "Wanneer we",
    accent: "even wachten",
    intro:
      "Er zijn twee momenten waarop zon een afspraak verplaatst: de kleur die er al in zit, en de zon die eraan komt. Ze hebben allebei een andere oplossing.",
    alineas: [
      "Kom je met verse kleur van zon of zonnebank, dan gaat een behandeling met licht niet door. Het licht mikt op pigment, en het pigment dat je net hebt opgebouwd ligt ervoor. De energie komt dan terecht in de bovenlaag in plaats van bij de haarwortel of de vlek, en dat geeft een kans op een brandplek of op een nieuwe verkleuring. [MEDISCHE-CHECK-ROJDA]",
      "Hoeveel weken je dan wacht, hoor je bij de intake. Dat staat hier met opzet niet als getal: het hangt af van je huidtype, van hoeveel kleur er is en van waar op je lichaam de behandeling zou gebeuren. De meting kan op dat moment gewoon doorgaan, en behandelingen die niet met licht werken meestal ook.",
      "Staat er een zonvakantie op de agenda, dan is het omgekeerde aan de hand. Een huid die net behandeld is, hoort een tijd uit de zon te blijven, en dat is precies wat op een vakantie niet lukt. Plan de behandeling dan erna, of ruim ervoor, zodat je huid tot rust is voordat je vertrekt. [MEDISCHE-CHECK-ROJDA]",
      "Ook voor een vertrek is de meting nuttig. Je weet dan waar je op moet letten in de zon, en bij terugkomst ligt er een vertrekpunt waarmee je meteen kunt beginnen, in plaats van dat je dan pas aan de wachttijd denkt.",
      "Wie in het najaar begint heeft het op al deze punten makkelijker. De zon staat lager, de vakanties zijn achter de rug, en een traject dat maanden duurt loopt dan niet halverwege tegen de zomer aan. Dat is ook de reden dat de agenda voor pigmenttrajecten vanaf september voller staat dan in mei.",
    ],
    beeld: {
      src: "/images/shoot/behandelkamer.jpg",
      alt: "Behandelaar brengt gel aan bij een cliënt met beschermbril, naast het Nordlys-apparaat",
    },
    knop: { href: "/intake", tekst: "Wat een huidconsult inhoudt" },
  },

  welNiet: {
    intro:
      "Een zonvakantie hoeft je traject niet stil te leggen. Het bepaalt vooral de volgorde waarin je de dingen plant.",
    wel: [
      "De meting en het advies, ook vlak voor vertrek",
      "Behandelingen die niet met licht werken, in overleg met je behandelaar [MEDISCHE-CHECK-ROJDA]",
      "Een traject starten in het najaar, als de zon eruit is",
      "Onderhoud dat je zonder hersteltijd doet, zoals een rustige gezichtsbehandeling",
    ],
    niet: [
      "Laser of IPL op een huid met verse kleur van zon of zonnebank [MEDISCHE-CHECK-ROJDA]",
      "Een peeling vlak voor een week in de volle zon [MEDISCHE-CHECK-ROJDA]",
      "Een pigmenttraject beginnen in de maanden mei tot en met augustus",
      "Zonbescherming overslaan zodra een vlek lichter wordt. Dan is hij er binnen een seizoen terug",
    ],
  },

  vergelijking: {
    label: "Per behandeling",
    anker: "Per behandeling",
    kop: "Wat de zon",
    accent: "per behandeling doet",
    intro:
      "Of een behandeling doorgaat op een gebruinde huid, en waar je in de weken erna rekening mee houdt. De regels gelden ook bij een zonnebank; die geeft dezelfde kleur.",
    kolommen: ["Behandeling", "Met kleur van de zon", "In de weken erna"],
    rijen: [
      {
        naam: "Laserontharing",
        href: "/laserontharing",
        cellen: [
          "Nee. Het licht mikt op pigment, en verse kleur ligt ervoor. [MEDISCHE-CHECK-ROJDA]",
          "De behandelde zone uit de volle zon houden en beschermen. [MEDISCHE-CHECK-ROJDA]",
        ],
      },
      {
        naam: "IPL bij pigment of roodheid",
        href: "/kennisbank/ipl-rotterdam",
        cellen: [
          "Nee. IPL stuurt meer golflengtes tegelijk en is hier nog gevoeliger voor. [MEDISCHE-CHECK-ROJDA]",
          "Dagelijks beschermen, anders komt de verkleuring terug. [MEDISCHE-CHECK-ROJDA]",
        ],
      },
      {
        naam: "Chemische peeling",
        href: "/kennisbank/chemische-peeling-rotterdam",
        cellen: [
          "Meestal niet, en anders in een lagere sterkte. [MEDISCHE-CHECK-ROJDA]",
          "Vervellen laten gebeuren, niet plukken, dagelijks SPF 50. [MEDISCHE-CHECK-ROJDA]",
        ],
      },
      {
        naam: "Microneedling",
        href: "/kennisbank/microneedling-rotterdam",
        cellen: [
          "Vaak wel, mits je huid niet verbrand is. [MEDISCHE-CHECK-ROJDA]",
          "Een paar dagen rood, daarna beschermen tegen UV. [MEDISCHE-CHECK-ROJDA]",
        ],
      },
      {
        naam: "Cosmelan en Dermamelan",
        href: "/kennisbank/cosmelan-dermamelan-rotterdam",
        cellen: [
          "Nee, en we starten sowieso niet tussen mei en augustus.",
          "Vervellen, en daarna het hele jaar door beschermen. [MEDISCHE-CHECK-ROJDA]",
        ],
      },
      {
        naam: "Fotona 4D",
        href: "/kennisbank/fotona-4d-rotterdam",
        cellen: [
          "Niet op een gebruinde huid; het blijft een laser. [MEDISCHE-CHECK-ROJDA]",
          "Een dag rood en warm, daarna beschermen. [MEDISCHE-CHECK-ROJDA]",
        ],
      },
      {
        naam: "HydraFacial",
        href: "/kennisbank/hydrafacial-rotterdam",
        cellen: [
          "Ja. Er komt geen licht aan te pas.",
          "Geen hersteltijd. De gewone zonbescherming blijft gelden.",
        ],
      },
      {
        naam: "Dermaplaning",
        href: "/kennisbank/dermaplaning-rotterdam",
        cellen: [
          "Ja, tenzij je huid verbrand is. [MEDISCHE-CHECK-ROJDA]",
          "Geen hersteltijd. De gewone zonbescherming blijft gelden.",
        ],
      },
    ],
    bijschrift:
      "Per behandeling of hij doorgaat op een gebruinde huid en waar je in de weken erna rekening mee houdt",
  },

  wie: {
    label: "Wie dit beoordeelt",
    zin: "De behandelaar kijkt bij binnenkomst naar je huid en naar de zone die aan de beurt is. Ziet die verse kleur, dan gaat de lichtbehandeling niet door en bespreken we wat er op dat moment wel kan. Dat oordeel gaat voor op de agenda.",
  },

  faq: [
    {
      vraag: "Hoe lang moet ik wachten met laseren na de zon?",
      antwoord:
        "Tot je huid haar eigen kleur terug heeft. Hoeveel weken dat duurt hoor je bij de intake, want het hangt af van je huidtype, van hoeveel kleur er is en van de zone. Wat je zelf ziet in de spiegel loopt meestal voor op wat er in je huid nog aan pigment zit. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Mag ik na laserontharing in de zon?",
      antwoord:
        "De behandelde zone hoort in de eerste dagen uit de volle zon, en daarna beschermd. Een huid die net behandeld is reageert heftiger op UV, en dan kan er een verkleuring achterblijven die er eerst niet was. Bedekken werkt beter dan insmeren alleen. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Telt de zonnebank ook mee?",
      antwoord:
        "Ja, precies zo. Een zonnebank maakt hetzelfde pigment aan als de zon, en dat pigment ligt op dezelfde manier in de weg bij een behandeling met licht. Zeg het dus ook als je kleur van een zonnebank komt. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Welke factor zonnebrand heb ik nodig na een behandeling?",
      antwoord:
        "SPF 50, elke dag, ook als het bewolkt is. Bij een peeling en bij een pigmenttraject is dat geen bijzaak maar een deel van de behandeling: zonder bescherming loopt het resultaat binnen een seizoen terug. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Kan ik een behandeling doen vlak voor mijn vakantie?",
      antwoord:
        "Liever niet. Een net behandelde huid hoort een tijd uit de zon, en dat lukt op vakantie zelden. Plan de behandeling erna, of ruim ervoor zodat je huid tot rust is. De meting en het advies kunnen wel, en die zijn juist voor vertrek nuttig.",
    },
    {
      vraag: "Waarom starten jullie geen pigmenttraject in de zomer?",
      antwoord:
        "Omdat een traject als Cosmelan of Dermamelan maanden duurt en je huid in die tijd extra gevoelig is voor UV. In de zomerse maanden werkt de zon de behandeling tegen, en dan betaal je voor een resultaat dat meteen weer terugloopt. We starten daarom buiten de maanden mei tot en met augustus. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Ik ben van nature donker. Geldt dit ook voor mij?",
      antwoord:
        "Je eigen kleur is iets anders dan verse kleur van de zon. Op elk huidtype wordt hier behandeld, met een instelling die daarbij past. Waar het om gaat is de kleur die er sinds kort bij is gekomen, want daar is de instelling niet op afgestemd. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Wat kan er wel als ik net terug ben van vakantie?",
      antwoord:
        "De meting en het advies kunnen altijd, en behandelingen zonder licht meestal ook. Dan staat je vertrekpunt vast en kun je beginnen zodra je kleur eruit is, in plaats van op dat moment pas aan de wachttijd te denken.",
    },
    {
      vraag: "Moet ik in de winter ook zonbescherming gebruiken?",
      antwoord:
        "Bij een pigmenttraject en in de weken na een peeling wel, elke dag. UV komt ook door bewolking en door glas heen, en pigmentcellen reageren daar het hele jaar op. Buiten die trajecten is het vooral een kwestie van gewoonte: wat je in de winter overslaat, sla je in maart ook over. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Helpt zonbescherming echt zo veel bij pigmentvlekken?",
      antwoord:
        "Bij pigment is het het grootste deel van het werk. Een vlek die lichter is gemaakt, komt terug zodra er weer UV op valt, en dat gaat sneller dan de behandeling hem lichter maakte. Dagelijks beschermen is daarmee goedkoper dan opnieuw behandelen. [MEDISCHE-CHECK-ROJDA]",
    },
    VRAAG_WAAR,
  ],

  twijfel: {
    voor: "Twijfel je over",
    accent: "het moment",
    zin: "Laat het ons weten bij het maken van de afspraak. Staat er een vakantie op de agenda of ben je net terug, dan kiezen we daar de behandeling en de volgorde op, in plaats van je voor niets te laten komen.",
  },

  cta: {
    kop: "Plan het op",
    accent: "het goede moment",
    tekst:
      "In het huidconsult meten we je huid en bespreken we wat er nu kan en wat beter wacht. Ook als je net terug bent van vakantie is dat het juiste vertrekpunt.",
    topic: "zon",
  },

  schema: {},
};
