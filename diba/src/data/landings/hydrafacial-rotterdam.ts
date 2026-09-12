import {
  afspraakBlokken,
  behandeling,
  bereik,
  euro,
  INTAKE_PRIJS,
  opsomming,
  tariefrijen,
  vergelijkingsrij,
  VRAAG_WAAR,
  type Landing,
} from "@/data/landings/types";

/**
 * HydraFacial in Rotterdam: de eerste landingspagina, goedgekeurd door Yasin op
 * 11 september 2026.
 *
 * WAAROM DEZE PAGINA BESTAAT NAAST /behandelingen/hydrafacial.
 *
 * Twee pagina's over hetzelfde onderwerp is geen dubbele kans maar een halve: Google kiest
 * er dan zelf één. Ze zijn hier daarom verschillend van soort. De behandelpagina beantwoordt
 * "wat is een HydraFacial"; deze pagina "waar in Rotterdam, bij wie, met welk apparaat, wat
 * kost het daar en hoe gaat een afspraak". De behandelpagina wijst hierheen via het veld
 * `landing` in behandelingen.ts, en deze pagina wijst terug.
 *
 * Geen alinea hier is overgeschreven van de behandelpagina. Wat op allebei hoort, het tarief
 * en de duur, komt uit dezelfde bron.
 *
 * Wat er nog open staat: wat er precies in Deluxe en Platinum zit ([GEGEVEN-NODIG] in de
 * variantenzin) en de medische passages ([MEDISCHE-CHECK-ROJDA]).
 */

const HF = behandeling("hydrafacial");
const HF_TARIEF = bereik("hydrafacial");
const HF_VARIANTEN = tariefrijen("hydrafacial");

export const HYDRAFACIAL_ROTTERDAM: Landing = {
  slug: "hydrafacial-rotterdam",
  gewijzigd: "2026-09-11",
  titel: "HydraFacial Rotterdam",
  omschrijving: `HydraFacial in Rotterdam bij Diba Clinics. Zestig minuten, ${euro(HF_TARIEF.laag)} tot ${euro(HF_TARIEF.hoog)}, geen hersteltijd. Wat het doet, voor wie het past en hoe een afspraak gaat.`,
  kruimel: "HydraFacial",
  h1: { kop: "HydraFacial in", accent: "Rotterdam" },
  antwoord: `Een HydraFacial is een gezichtsbehandeling waarbij één mondstuk tegelijk reinigt, de bovenste huidlaag losmaakt, poriën leegzuigt en er werkzame stoffen in brengt. Bij Diba Clinics aan de Weissenbruchlaan in Rotterdam duurt de behandeling ${HF.duurMinuten} minuten, kost hij ${HF_TARIEF.laag} tot ${HF_TARIEF.hoog} euro en is er geen hersteltijd.`,
  feiten: [
    { kop: "Duur", waarde: `${HF.duurMinuten} minuten` },
    {
      kop: "Tarief",
      waarde: `${euro(HF_TARIEF.laag)} tot ${euro(HF_TARIEF.hoog)}`,
    },
    { kop: "Hersteltijd", waarde: "Geen" },
    { kop: "Apparaat", waarde: "HydraFacial Syndeo" },
  ],
  beeld: {
    src: "/images/shoot/beh-hydrafacial.jpg",
    alt: "Het HydraFacial-mondstuk gaat over de wang tijdens een behandeling bij Diba Clinics in Rotterdam",
  },
  kaart: {
    vraag: "Wat kost een HydraFacial",
    zin: "De drie varianten met hun tarief, het verschil tussen HydraFacial en hydradermabrasie, en de vergelijking met de andere gezichtsbehandelingen hier.",
  },

  werking: {
    label: "De werking",
    anker: "Wat het doet",
    kop: "Wat een HydraFacial",
    accent: "met je huid doet",
    intro:
      "Het begint niet bij het apparaat maar bij wat er in je huid speelt, want dat bepaalt of deze behandeling er iets aan doet.",
    alineas: [
      "Je huid maakt voortdurend nieuwe cellen aan en laat de oude aan de buitenkant los. Dat loslaten gaat niet bij iedereen even vlot. Blijven die cellen te lang zitten, dan hopen ze zich samen met talg en resten van make-up op in je poriën. Dat is wat je ziet als je huid dof staat en je poriën groter lijken dan ze zijn: er zit iets in, en het licht weerkaatst niet meer op een gladde laag maar op een onregelmatige.",
      "Een HydraFacial haalt dat weg, en doet het in één beweging. In het mondstuk zit een spiraalvormig kanaal waar tegelijk onderdruk op staat en vloeistof doorheen loopt. Die twee samen maken een wervelende beweging over je huid. De vloeistof maakt de verbinding tussen de buitenste cellen los, de onderdruk trekt ze mee naar buiten samen met wat er in de porie zat, en via hetzelfde kanaal gaat er in dezelfde doorgang een serum naar binnen.",
      "De behandeling blijft aan de oppervlakte, in de hoornlaag en de bovenste opperhuid. Dat is precies de reden dat je het resultaat meteen ziet en er verder niets van merkt: er wordt niets beschadigd dat daarna moet herstellen. Het is ook de reden dat het effect tijdelijk is. Je hoornlaag vernieuwt zichzelf, dus wat je nu weghaalt bouwt zich in de weken erna weer op. [MEDISCHE-CHECK-ROJDA]",
    ],
    verder:
      "Hoe het mondstuk precies is opgebouwd en waarom de tips verschillen, staat op de pagina over de [HydraFacial Syndeo](/apparatuur/hydrafacial-syndeo). De behandeling zelf, los van de plaats, staat op [de behandelpagina](/behandelingen/hydrafacial). Of een gezichtsbehandeling tijdens een zwangerschap kan, staat bij [zwanger of borstvoeding](/kennisbank/zwanger-of-borstvoeding).",
  },

  onderscheid: {
    label: "Merk en apparaat",
    anker: "Het apparaat",
    kop: "HydraFacial en",
    accent: "hydradermabrasie",
    intro:
      "De namen worden door elkaar gebruikt, maar het is niet hetzelfde apparaat. Dat is de moeite waard zodra je tarieven naast elkaar legt, en niet alleen bij ons.",
    alineas: [
      "HydraFacial is een merknaam en geen soort behandeling. Er bestaan meer apparaten die met onderdruk en vloeistof werken; die heten hydradermabrasie. Ze werken volgens hetzelfde principe en het resultaat gaat dezelfde kant op, maar het mondstuk, de vloeistoffen en de tips verschillen per fabrikant.",
      "Wij werken met de HydraFacial Syndeo, het huidige model van het merk zelf. De tips zijn wegwerpartikelen en gaan per behandeling; welke er gebruikt wordt hangt af van je huid en van het doel. Dat is geen detail voor de folder: de grofte van de spiraal bepaalt hoeveel er losgemaakt wordt.",
      "Leg je tarieven van verschillende klinieken naast elkaar, vraag dan welk apparaat er staat en welke tips erbij horen. Dat is een gewone vraag en je hoort er gewoon antwoord op te krijgen. Het antwoord bepaalt of je twee keer hetzelfde vergelijkt.",
    ],
    beeld: {
      src: "/images/shoot/apparaat-hydrafacial.jpg",
      alt: "Het handstuk van de HydraFacial Syndeo, met het apparaat op de achtergrond",
    },
    knop: {
      href: "/apparatuur/hydrafacial-syndeo",
      tekst: "Over dit apparaat",
    },
  },

  tarief: {
    label: "Tarieven",
    anker: "Wat het kost",
    kop: "Wat een HydraFacial",
    accent: "bij ons kost",
    intro: `Drie varianten, allemaal ${HF.duurMinuten} minuten. De intakeregeling staat er compleet bij, want dat is het bedrag dat mensen bij een eerste afspraak niet zien aankomen.`,
    rijen: HF_VARIANTEN,
    zin: "Welke van de drie bij je past bespreekt de behandelaar tijdens de intake, op basis van wat je huid nodig heeft en wat je met de behandeling wilt. [GEGEVEN-NODIG: wat er precies in Deluxe en Platinum zit ten opzichte van Signature, Okan]",
    afspraak: afspraakBlokken({
      naam: "de HydraFacial",
      duurMinuten: HF.duurMinuten,
      extra: "Dat verandert soms de keuze van de tip of het serum.",
    }),
  },

  welNiet: {
    intro:
      "Een HydraFacial werkt op wat er in en op je huid ligt. Voor alles wat dieper zit is er een andere behandeling, en dan zeggen we dat.",
    wel: [
      "Een doffe huid en poriën waar zichtbaar iets in zit, vooral rond je neus en kin",
      "Een huid die er binnen een dag beter uit moet zien, bijvoorbeeld voor een gelegenheid",
      "Onderhoud naast een lopend traject voor acne, pigment of huidverbetering",
      "Een eerste kennismaking als je nog niet weet wat je huid nodig heeft",
    ],
    niet: [
      "Littekens en pigment dat dieper in de huid zit. Daar werkt microneedling of laser op, want die komen in de laag waar het probleem zit. [MEDISCHE-CHECK-ROJDA]",
      "Blijvend verschil in de structuur van je huid. Een HydraFacial is onderhoud; het effect houdt dagen tot weken aan en bouwt niet op. [MEDISCHE-CHECK-ROJDA]",
      "Actieve, ontstoken acne. Dan begint het bij het acnetraject en niet bij een losse behandeling. [MEDISCHE-CHECK-ROJDA]",
      "Een huid die net gepeeld, gelaserd of genaald is. Daar houden we tijd tussen; hoeveel hangt af van wat er gedaan is. [MEDISCHE-CHECK-ROJDA]",
    ],
  },

  vergelijking: {
    label: "Naast elkaar",
    anker: "Vergelijking",
    kop: "Naast de andere",
    accent: "gezichtsbehandelingen",
    intro:
      "Wie deze naam kent, kent de andere vaak niet. Dit is wat ze doen, wat je erna merkt en wat ze kosten.",
    kolommen: ["Behandeling", "Waarin het verschilt", "Hersteltijd", "Vanaf"],
    rijen: [
      vergelijkingsrij(
        "hydrafacial",
        "Haalt eruit wat erin zit en brengt in dezelfde beweging stoffen terug. Je ziet het meteen.",
      ),
      vergelijkingsrij(
        "oxygeneo",
        "Maakt de bovenste laag los met een gel in plaats van met onderdruk, waarbij er in de huid zuurstof vrijkomt. Rustiger aan je huid, minder gericht op het legen van poriën. [MEDISCHE-CHECK-ROJDA]",
      ),
      vergelijkingsrij(
        "dermaplaning",
        "Schraapt de dode laag en het donshaar er met een mesje af. Vooral voor een gladde huid onder make-up; het doet niets aan wat er in de porie zit.",
      ),
      vergelijkingsrij(
        "peelings",
        "Werkt met zuren en gaat dieper. Meer effect op pigment en op de structuur, en daardoor ook meer reactie van je huid na afloop. [MEDISCHE-CHECK-ROJDA]",
      ),
      vergelijkingsrij(
        "skinpen",
        "Maakt met naalden kleine kanaaltjes in de lederhuid, zodat je huid zelf collageen gaat aanmaken. Voor littekens en structuur, met een paar dagen roodheid. [MEDISCHE-CHECK-ROJDA]",
      ),
    ],
    bijschrift:
      "De gezichtsbehandelingen van Diba Clinics vergeleken op werking, hersteltijd en tarief",
  },

  wie: {
    label: "Wie de behandeling doet",
    zin: "Een HydraFacial wordt bij ons gedaan door een huidtherapeut of een orthomoleculair huidspecialist. De huidtherapeuten staan in het Kwaliteitsregister Paramedici en zijn aangesloten bij de Nederlandse Vereniging van Huidtherapeuten.",
  },

  reviews: {
    onderwerp: "gezichtsbehandeling",
    intro:
      "Reviews van klanten die hier voor een gezichtsbehandeling waren. Ze komen rechtstreeks uit onze agenda en staan er zoals ze geschreven zijn.",
  },

  faq: [
    {
      vraag: "Wat kost een HydraFacial in Rotterdam?",
      antwoord: `Bij Diba Clinics kost een HydraFacial ${opsomming(HF_VARIANTEN.map((v) => `${euro(v.prijs)} voor de ${v.naam}`))}. Een behandeling duurt ${HF.duurMinuten} minuten. Kom je voor het eerst, dan boek je een behandeling op advies: die begint met een intake, en de intakekosten van ${euro(INTAKE_PRIJS)} vervallen zodra we in dezelfde afspraak behandelen.`,
    },
    {
      vraag: "Hoe lang duurt een HydraFacial?",
      antwoord: `${HF.duurMinuten} minuten. Voor een eerste afspraak reserveren we maximaal twee uur, omdat daar de intake bij komt en er geen haast mag ontstaan. Die tijd is een maximum en geen verplichting; vaak ben je eerder klaar.`,
    },
    {
      vraag: "Heb je hersteltijd na een HydraFacial?",
      antwoord:
        "Nee. Je huid is na afloop roze en voelt strak aan, en dat trekt meestal binnen een uur weg. Make-up kan dezelfde dag nog. Je kunt er direct na de afspraak weer mee de deur uit. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Hoe vaak kun je een HydraFacial doen?",
      antwoord:
        "Los te doen, of maandelijks als onderhoud. Een startreeks is meestal drie tot zes behandelingen. Wat er in jouw geval zinvol is, hangt af van je huid en van wat je ermee wilt; dat bespreken we bij de intake. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Kan ik een HydraFacial doen vlak voor een bruiloft of feest?",
      antwoord:
        "Ja, dat is een van de redenen dat mensen deze behandeling kiezen: het effect is er meteen en er is geen dag waarop je binnen moet blijven. Heb je hem nog nooit gehad, plan hem dan minstens een week van tevoren, zodat je weet hoe je huid erop reageert voordat het erop aankomt. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Wat is het verschil met een gewone gezichtsbehandeling?",
      antwoord:
        "Bij een klassieke gezichtsbehandeling gebeuren reinigen, uitdrukken en verzorgen na elkaar en met de hand. Bij een HydraFacial gebeurt het in één doorgang met één mondstuk, waarbij onderdruk het werk doet in plaats van vingers. Dat is gelijkmatiger over je gezicht en je huid raakt er minder van geïrriteerd. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Helpt een HydraFacial tegen acne?",
      antwoord:
        "Bij verstopte poriën en meeëters kan het helpen, want dat is precies wat er weggehaald wordt. Bij actieve, ontstoken acne is het niet de eerste stap: dan begin je met het acnetraject, waar we de huid eerst tot rust brengen. Wat bij jou past bepaalt de behandelaar na de meting. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Kan een HydraFacial bij een gevoelige huid?",
      antwoord:
        "Vaak wel. Er komen geen zuren aan te pas en de behandeling blijft aan de oppervlakte, waardoor je huid er weinig van te verduren krijgt. Bij actieve rosacea of een ontstoken huid brengen we die eerst tot rust. Of het bij jou kan, bepaalt de meting tijdens de intake. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Wordt een HydraFacial vergoed door de zorgverzekering?",
      antwoord:
        "Nee. Een HydraFacial is een onderhoudsbehandeling zonder medische noodzaak en valt daarmee buiten het stelsel. Heeft je klacht wel een medische reden, bijvoorbeeld bij acne of een litteken, dan is er soms een route naar vergoeding; die staat uitgelegd op onze pagina over vergoedingen. [MEDISCHE-CHECK-ROJDA]",
    },
    VRAAG_WAAR,
  ],

  twijfel: {
    voor: "Weet je niet of dit de",
    accent: "juiste behandeling",
    na: "is",
    zin: "Dat hoef je ook niet te weten voordat je komt. Boek een behandeling op advies: we meten je huid, bespreken wat er speelt en zeggen welke behandeling daarbij past. Blijkt een HydraFacial niet het beste antwoord op jouw vraag, dan hoor je dat en doen we die dag iets anders of niets.",
  },

  cta: {
    kop: "Een HydraFacial in Rotterdam",
    accent: "plannen",
    tekst:
      "We beginnen met een meting van je huid en bespreken daarna welke behandeling erbij past. Is dat een HydraFacial, dan kan die vaak in dezelfde afspraak.",
    topic: "hydrafacial",
  },

  schema: {
    procedure: { naam: "HydraFacial", omschrijving: HF.werking },
    dienst: { naam: "HydraFacial", soort: "Gezichtsbehandeling" },
  },
};
