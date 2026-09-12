import {
  afspraakBlokken,
  behandeling,
  bereik,
  euro,
  INTAKE_PRIJS,
  tariefrijen,
  vergelijkingsrij,
  VRAAG_WAAR,
  type Landing,
} from "@/data/landings/types";

/**
 * IPL in Rotterdam.
 *
 * WAAROM DEZE PAGINA NIET BOTST MET DE BESTAANDE.
 *
 * IPL staat op de site op vijf plekken: de apparaatpagina, twee behandelpagina's (bij pigment
 * en bij roodheid) en drie toepassingen. Geen daarvan beantwoordt "ipl rotterdam": wat is
 * het, waarvoor, wat kost het hier. En de klachtpagina's (/pigmentvlekken, /couperose,
 * /rosacea) heten "behandelen in Rotterdam" en beginnen bij de klacht. Deze pagina begint bij
 * de methode en wijst naar allemaal.
 *
 * GEEN REVIEWS.
 *
 * Het onderwerp "laser" in de reviews gaat vrijwel altijd over ontharen. Die hier tonen zou
 * suggereren dat het over IPL bij pigment gaat, en dat is niet zo. Een sectie minder is
 * eerlijker dan een sectie die misleidt.
 */

const IPL = behandeling("nordlys-pigment");
const IPL_TARIEF = bereik("nordlys-pigment");
const IPL_RIJEN = tariefrijen("nordlys-pigment");

/** Het tarief van een zone, op de naam uit de tarievenlijst. */
function prijsVan(zone: string): number {
  return IPL_RIJEN.find((r) => r.naam === zone)?.prijs ?? IPL.prijs;
}

export const IPL_ROTTERDAM: Landing = {
  slug: "ipl-rotterdam",
  gewijzigd: "2026-09-11",
  titel: "IPL Rotterdam: pigment en roodheid",
  omschrijving: `IPL in Rotterdam met de Nordlys van Candela, voor pigmentvlekken, zonschade, couperose en rosacea. Vanaf ${euro(IPL_TARIEF.laag)}, meestal een paar uur rood.`,
  kruimel: "IPL",
  h1: { kop: "IPL-behandeling in", accent: "Rotterdam" },
  antwoord: `IPL is een behandeling met intens gepulst licht dat pigment en kleine vaatjes in de huid opzoekt, zodat vlekken vervagen en roodheid wegtrekt. Bij Diba Clinics in Rotterdam werken we met de Nordlys van Candela. Een behandeling duurt ${IPL.duurMinuten} minuten en kost ${euro(IPL_TARIEF.laag)} voor de neus tot ${euro(IPL_TARIEF.hoog)} voor het hele gelaat, en je bent meestal een paar uur rood. [MEDISCHE-CHECK-ROJDA]`,
  feiten: [
    { kop: "Duur", waarde: `${IPL.duurMinuten} minuten` },
    {
      kop: "Tarief",
      waarde: `${euro(IPL_TARIEF.laag)} tot ${euro(IPL_TARIEF.hoog)}`,
    },
    { kop: "Hersteltijd", waarde: "Een paar uur rood" },
    { kop: "Apparaat", waarde: "Nordlys, Candela" },
  ],
  beeld: {
    src: "/images/shoot/beh-nordlys.jpg",
    alt: "Behandelaar werkt met de Nordlys aan de huid van een cliënt",
  },
  kaart: {
    vraag: "Wat kost een IPL-behandeling",
    zin: "Wat IPL doet bij pigment en bij roodheid, waarom het geen laser is, wanneer je beter wacht en wat een behandeling per zone kost.",
  },

  werking: {
    label: "De werking",
    anker: "Wat het doet",
    kop: "Wat IPL",
    accent: "met je huid doet",
    intro:
      "Het licht zoekt kleur op. In een pigmentvlek is dat melanine, in een vaatje is het bloed, en daar gaat de energie naartoe.",
    alineas: [
      "IPL stuurt geen enkele golflengte de huid in maar een band, met een filter dat het grofste eruit haalt. Die band raakt daardoor meerdere dingen tegelijk: oppervlakkig pigment, zichtbare vaatjes en een huid die structureel rood staat. Het licht komt gemiddeld minder diep dan een laser, en dat is precies wat oppervlakkige klachten nodig hebben. [MEDISCHE-CHECK-ROJDA]",
      "Bij pigment neemt de vlek de energie op, wordt hij korrelig en werkt hij naar de oppervlakte. In de dagen erna wordt de vlek eerst donkerder en vervaagt hij daarna. Dat donkerder worden hoort erbij en betekent niet dat het erger wordt. [MEDISCHE-CHECK-ROJDA]",
      "Bij roodheid mikt het licht op het bloed in de vaatjes. Dat warmt op, het vaatje klapt dicht en wordt door je lichaam opgeruimd. Bij rosacea gaat het minder om een los vaatje en meer om een gebied dat structureel rood staat; dan werkt het licht over het hele vlak. [MEDISCHE-CHECK-ROJDA]",
    ],
    verder:
      "Per klacht staat het apart uitgewerkt: IPL bij [zonnevlekken](/behandelingen/nordlys-pigment/zonnevlekken), bij [couperose](/behandelingen/nordlys-roodheid/couperose) en bij [rosacea](/behandelingen/nordlys-roodheid/rosacea). Begin je liever bij de klacht, kijk dan bij [pigmentvlekken](/huidproblemen/pigmentvlekken). Welke rol je huidtype hierbij speelt staat bij [het Fitzpatrick-huidtype](/kennisbank/fitzpatrick-huidtype).",
  },

  onderscheid: {
    label: "Het apparaat",
    anker: "Geen laser",
    kop: "IPL is",
    accent: "geen laser",
    intro:
      "De twee worden vaak door elkaar gehaald. Het verschil bepaalt waarvoor je welk apparaat kiest.",
    alineas: [
      "Een laser zendt één golflengte uit en is daarmee heel precies. IPL zendt een band uit, raakt daardoor meerdere doelen tegelijk en werkt over een groter vlak. Voor één specifiek plekje is een laser preciezer; voor zonschade verspreid over je wangen is IPL sneller en gelijkmatiger.",
      "Wij werken met de [Nordlys van Candela](/apparatuur/nordlys-ipl). Candela noemt zijn variant Selective Waveband Technology: twee filters knippen de boven- en onderkant van het spectrum weg, zodat er een smallere band overblijft dan bij gewone IPL, met pulsen korter dan een milliseconde.",
      "Welke band er uitkomt, hangt af van het handstuk dat de behandelaar kiest. Voor pigment is dat een ander dan voor vaatjes, want elke band is gekozen rond wat hij moet raken. [GEGEVEN-NODIG: welke applicators hier in de kast liggen, Okan]",
    ],
    beeld: {
      src: "/images/shoot/apparaat-nordlys.jpg",
      alt: "De Nordlys van Candela met de handstukken in de houder",
    },
    knop: { href: "/apparatuur/nordlys-ipl", tekst: "Over de Nordlys" },
  },

  tarief: {
    label: "Tarieven",
    anker: "Wat het kost",
    kop: "Wat IPL",
    accent: "bij ons kost",
    intro:
      "Het tarief hangt af van de zone en is voor pigment en roodheid hetzelfde. De intakeregeling staat er compleet bij.",
    rijen: IPL_RIJEN,
    zin: "IPL werkt in een reeks van drie tot zes behandelingen, met vier weken ertussen. Bij rosacea hoort daarna onderhoud, omdat de roodheid kan terugkomen. [MEDISCHE-CHECK-ROJDA]",
    afspraak: afspraakBlokken({
      naam: "de eerste IPL-behandeling",
      duurMinuten: IPL.duurMinuten,
    }),
  },

  welNiet: {
    intro:
      "IPL werkt op wat oppervlakkig zit en kleur heeft. Voor melasma, voor wat diep zit en in de zomer kiezen we iets anders of wachten we.",
    wel: [
      "Zonschade en scherp afgebakende pigmentvlekken, ook over een groot vlak",
      "Losse zichtbare vaatjes, bijvoorbeeld rond de neusvleugels",
      "Een gebied dat structureel rood staat, zoals bij rosacea",
      "Weinig hersteltijd: meestal ben je dezelfde dag weer presentabel",
    ],
    niet: [
      "Melasma. Dat pigment reageert vaak juist op warmte, en daar is IPL niet de eerste keuze [MEDISCHE-CHECK-ROJDA]",
      "Pigment in de zomermaanden. Tussen mei en augustus behandelen we pigment niet [MEDISCHE-CHECK-ROJDA]",
      "Rosacea genezen. IPL haalt de zichtbare roodheid weg, en die kan terugkomen [MEDISCHE-CHECK-ROJDA]",
      "Elk huidtype. Bij een donkere huid is de kans op nieuwe pigmentvlekken groter, en dan kiezen we een andere behandeling [MEDISCHE-CHECK-ROJDA]",
    ],
  },

  vergelijking: {
    label: "Naast elkaar",
    anker: "Vergelijking",
    kop: "IPL naast",
    accent: "de alternatieven",
    intro:
      "Voor pigment en roodheid zijn er meer wegen. Dit is wat ze doen, wat je erna merkt en wat ze kosten.",
    kolommen: ["Behandeling", "Waarin het verschilt", "Hersteltijd", "Vanaf"],
    rijen: [
      vergelijkingsrij(
        "nordlys-pigment",
        "Licht op scherp afgebakende vlekken en zonschade. De vlek wordt eerst donkerder en vervaagt daarna.",
      ),
      vergelijkingsrij(
        "nordlys-roodheid",
        "Licht op het bloed in de vaatjes. Voor couperose, losse vaatjes en rosacea.",
      ),
      vergelijkingsrij(
        "cosmelan",
        "Een traject van zes maanden dat de aanmaak van pigment remt, voor hardnekkig pigment waar losse behandelingen op stuklopen. [MEDISCHE-CHECK-ROJDA]",
      ),
      vergelijkingsrij(
        "peelings",
        "Een zuur op de bovenlaag. Werkt op oppervlakkige verkleuring, zonder warmte. [MEDISCHE-CHECK-ROJDA]",
      ),
      vergelijkingsrij(
        "led-therapie",
        "Licht dat de huid rustiger maakt, zonder warmte en zonder hersteltijd. Vaak naast een andere behandeling bij roodheid. [MEDISCHE-CHECK-ROJDA]",
      ),
    ],
    bijschrift:
      "IPL vergeleken met andere behandelingen voor pigment en roodheid op werking, hersteltijd en tarief",
  },

  wie: {
    label: "Wie de behandeling doet",
    zin: "IPL wordt bij ons gedaan door een huidtherapeut of een laserspecialist. Die kiest per zone het handstuk en de instelling, en past die aan op je huidtype.",
  },

  faq: [
    {
      vraag: "Wat kost een IPL-behandeling in Rotterdam?",
      antwoord: `Bij Diba Clinics kost IPL ${euro(prijsVan("Neus"))} voor de neus, ${euro(prijsVan("Wangen"))} voor de wangen en ${euro(prijsVan("Hele gelaat"))} voor het hele gelaat; wangen, neus en kin samen kosten ${euro(prijsVan("Wangen, neus en kin"))}. Dat geldt voor pigment en voor roodheid. Kom je voor het eerst, dan begint je afspraak met een intake van ${euro(INTAKE_PRIJS)}, die vervalt als we in dezelfde afspraak behandelen.`,
    },
    {
      vraag: "Is IPL hetzelfde als laser?",
      antwoord:
        "Nee. Een laser zendt één golflengte uit, IPL een band. Die band raakt daardoor meerdere dingen tegelijk, zoals roodheid, vaatjes en oppervlakkig pigment, en komt gemiddeld minder diep.",
    },
    {
      vraag: "Waarom wordt mijn pigmentvlek eerst donkerder?",
      antwoord:
        "Dat hoort erbij. Het pigment komt naar de oppervlakte voordat het vervaagt, en dat duurt een aantal dagen. Het betekent niet dat het erger wordt. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Doet IPL pijn?",
      antwoord:
        "Je voelt bij elke lichtflits een korte, warme tik, vaak vergeleken met een elastiekje tegen je huid. Het is kort en goed te doen. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Hoeveel IPL-behandelingen heb ik nodig?",
      antwoord:
        "Meestal drie tot zes, met vier weken ertussen. Bij rosacea hoort daarna onderhoud, omdat de roodheid kan terugkomen. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Kan ik IPL in de zomer doen?",
      antwoord:
        "Voor pigment niet. Tussen mei en augustus behandelen we pigment niet, omdat een huid die net behandeld is extra fel op zon reageert. Voor roodheid en vaatjes ligt dat anders; dat bespreken we per geval. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Helpt IPL tegen couperose en rosacea?",
      antwoord:
        "Het haalt losse vaatjes weg en maakt een gebied dat structureel rood staat rustiger. Rosacea geneest het niet: de zichtbare roodheid gaat weg, en die kan terugkomen. Daarom hoort er bij rosacea onderhoud bij. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Kan IPL bij een donkere huid?",
      antwoord:
        "Niet bij elk huidtype. Bij een donkere huid neemt de huid zelf meer licht op, en is de kans op nieuwe pigmentvlekken groter. We bepalen je huidtype vooraf en kiezen de behandeling die bij je huid past. [MEDISCHE-CHECK-ROJDA]",
    },
    VRAAG_WAAR,
  ],

  twijfel: {
    voor: "Weet je niet of het",
    accent: "pigment of roodheid",
    na: "is",
    zin: "Dat hoef je ook niet te weten voordat je komt. De meting laat zien wat het is en hoe diep het zit, en daarna hoor je of IPL het goede antwoord is. Is het melasma, dan kiezen we iets anders.",
  },

  cta: {
    kop: "IPL in Rotterdam",
    accent: "plannen",
    tekst:
      "We meten je huid en bepalen of het pigment of roodheid is, en hoe diep het zit. Past IPL, dan kan de eerste behandeling vaak in dezelfde afspraak.",
    topic: "ipl",
  },

  schema: {
    procedure: { naam: "IPL-behandeling", omschrijving: IPL.werking },
    dienst: { naam: "IPL-behandeling", soort: "Huidbehandeling" },
  },
};
