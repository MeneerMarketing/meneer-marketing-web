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
 * Microneedling in Rotterdam.
 *
 * WAAROM DEZE PAGINA NIET BOTST MET /behandelingen/skinpen EN /behandelingen/dermapen-4.
 *
 * Die twee gaan elk over één pen. Wie "microneedling rotterdam" zoekt, zoekt de methode en
 * weet niet dat er twee pennen zijn; deze pagina legt ze naast elkaar en zegt wanneer je
 * welke krijgt. Allebei de behandelpagina's wijzen hierheen via `landing`.
 *
 * En niet met /huidproblemen/acne-littekens en /littekens: die beginnen bij de klacht, deze
 * bij de behandeling. Ze verwijzen naar elkaar, met de klacht als ankertekst.
 *
 * Wat hier technisch staat (veertien naalden, 1920 prikken per seconde, 0,25 tot 3
 * millimeter, de verdovende crème) komt van de apparaatpagina's en is daar al gecontroleerd.
 */

const SP = behandeling("skinpen");
const SP_RIJEN = tariefrijen("skinpen");

/** Het tarief van een variant: eerst op de precieze naam, anders op het begin ervan. */
function prijsVan(naam: string): number {
  const rij =
    SP_RIJEN.find((r) => r.naam === naam) ??
    SP_RIJEN.find((r) => r.naam.startsWith(naam));
  return rij?.prijs ?? SP.prijs;
}

export const MICRONEEDLING_ROTTERDAM: Landing = {
  slug: "microneedling-rotterdam",
  gewijzigd: "2026-09-11",
  titel: "Microneedling Rotterdam: SkinPen en Dermapen",
  omschrijving: `Microneedling in Rotterdam met de SkinPen en de Dermapen 4. Vanaf ${euro(SP.prijs)} per sessie, een tot drie dagen rood. Voor littekens, poriën en huidstructuur.`,
  kruimel: "Microneedling",
  h1: { kop: "Microneedling in", accent: "Rotterdam" },
  antwoord: `Microneedling is een behandeling waarbij fijne naalden heel veel kleine kanaaltjes in de huid maken, zodat je huid zelf nieuw collageen gaat aanmaken. Bij Diba Clinics in Rotterdam werken we met de SkinPen en de Dermapen 4. Een behandeling van het gezicht kost ${euro(SP.prijs)} en duurt ${SP.duurMinuten} minuten, en daarna ben je een tot drie dagen rood. [MEDISCHE-CHECK-ROJDA]`,
  feiten: [
    { kop: "Duur", waarde: `${SP.duurMinuten} minuten` },
    { kop: "Tarief", waarde: `Vanaf ${euro(SP.prijs)}` },
    { kop: "Hersteltijd", waarde: "1 tot 3 dagen rood" },
    { kop: "Reeks", waarde: "3 tot 6 sessies" },
  ],
  beeld: {
    src: "/images/shoot/beh-skinpen.jpg",
    alt: "Microneedling met de SkinPen bij een cliënt van Diba Clinics in Rotterdam",
  },
  kaart: {
    vraag: "Wat kost microneedling",
    zin: "Het verschil tussen de SkinPen en de Dermapen, wat een reeks kost, wat je de dagen erna ziet en wanneer laser het betere antwoord is.",
  },

  werking: {
    label: "De werking",
    anker: "Wat het doet",
    kop: "Wat microneedling",
    accent: "met je huid doet",
    intro:
      "Het resultaat komt niet van de prikjes zelf maar van wat je huid daarna doet, en daarom zie je het pas na weken.",
    alineas: [
      "Onder de opperhuid ligt de lederhuid, en daar zit het bindweefsel dat je huid stevig en glad houdt. Bij een litteken, een grove porie of een huid die met de jaren minder veerkracht heeft, is dat bindweefsel ongelijk of dunner geworden. Een crème komt daar niet; die laag ligt te diep. [MEDISCHE-CHECK-ROJDA]",
      "Microneedling maakt met fijne naalden heel veel kleine kanaaltjes tot in de bovenste lederhuid. Je huid behandelt die als kleine wondjes en begint te herstellen, en bij dat herstel maakt hij nieuw collageen aan. Dat herstel is het doel; de prikjes zijn alleen de aanleiding. [MEDISCHE-CHECK-ROJDA]",
      "Daarom zie je het resultaat niet na één behandeling maar over een reeks. Wat je de eerste dagen ziet is roodheid en een beetje zwelling. Het echte verschil bouwt zich over weken op en wordt het best zichtbaar als de reeks van drie tot zes behandelingen klaar is, met vier tot zes weken ertussen. [MEDISCHE-CHECK-ROJDA]",
    ],
    verder:
      "Wat microneedling bij een bepaalde klacht doet, staat apart uitgewerkt: bij [acnelittekens](/behandelingen/skinpen/acnelittekens), bij [grove poriën](/behandelingen/skinpen/grove-porien), bij [fijne lijntjes](/behandelingen/skinpen/fijne-lijntjes), bij [littekens na een operatie](/behandelingen/skinpen/chirurgische-littekens) en bij [striae](/behandelingen/skinpen/striae). Waarom er weken tussen de sessies zitten staat bij [het aantal sessies](/kennisbank/hoeveel-sessies).",
  },

  onderscheid: {
    label: "Twee pennen",
    anker: "De pennen",
    kop: "SkinPen en",
    accent: "Dermapen 4",
    intro:
      "We werken met twee microneedlingpennen. Welke je krijgt hangt af van de zone en de diepte die daar past, en niet van welke beter is.",
    alineas: [
      "De [SkinPen](/apparatuur/skinpen-cit) heeft veertien naalden en werkt iets bedaarder. De [Dermapen 4](/apparatuur/dermapen-4) haalt tot 1920 prikken per seconde en werkt een vlak daardoor sneller af, met voorgeprogrammeerde standen, waaronder een instelling voor littekens op de maximale diepte. De diepte is bij allebei in te stellen van 0,25 tot 3 millimeter.",
      "Die diepte is de instelling die er echt toe doet. Ondiep raakt alleen de opperhuid en heelt binnen een dag; drie millimeter komt tot in het bindweefsel en vraagt langer. Rond je ogen en op je voorhoofd, waar de huid dun over bot ligt, gaat de pen minder diep dan op je wangen. [MEDISCHE-CHECK-ROJDA]",
      "De naaldcartridges zijn steriel en gaan per behandeling weg. Bij microneedling is dat geen detail, want de naalden gaan door de beschermlaag van je huid heen. Vooraf gaat er een verdovende crème op die een half uur intrekt; wat je daarna voelt is vooral trilling en druk. [GEGEVEN-NODIG: of dat half uur binnen de zestig minuten van de afspraak valt, Okan]",
    ],
    beeld: {
      src: "/images/shoot/beh-dermapen-andres.jpg",
      alt: "Andres behandelt de huid van een cliënt met de Dermapen 4",
    },
    knop: { href: "/behandelingen/skinpen", tekst: "Over de behandeling" },
  },

  tarief: {
    label: "Tarieven",
    anker: "Wat het kost",
    kop: "Wat microneedling",
    accent: "bij ons kost",
    intro:
      "Het tarief is voor de SkinPen en de Dermapen hetzelfde en hangt af van het gebied. De intakeregeling staat er compleet bij.",
    rijen: SP_RIJEN,
    zin: "Microneedling werkt in een reeks. Vergelijk je tarieven, reken dan met het bedrag per sessie maal het aantal sessies. Hoeveel het er bij jou worden hoor je na de meting; een vast aantal vooraf beloven we niet.",
    afspraak: afspraakBlokken({
      naam: "de eerste microneedling",
      duurMinuten: SP.duurMinuten,
    }),
  },

  welNiet: {
    intro:
      "Microneedling werkt op de structuur van je huid. Voor pigment door zon, voor vaatjes en voor een ontstoken huid is er een ander antwoord.",
    wel: [
      "Littekens die door verlies van structuur zijn ontstaan, zoals de ondiepe kuiltjes na acne",
      "Fijne lijntjes en een ongelijke textuur",
      "Grove poriën en een huid die dof is geworden",
      "Pigment dat na een puistje of wondje is achtergebleven [MEDISCHE-CHECK-ROJDA]",
    ],
    niet: [
      "Zonschade en losse pigmentvlekken. Daarvoor kies je laser of IPL [MEDISCHE-CHECK-ROJDA]",
      "Een huid met actieve, ontstoken acne. Die brengen we eerst tot rust [MEDISCHE-CHECK-ROJDA]",
      "Een enkele sessie. Wat je na één keer ziet is zwelling; het resultaat komt over de reeks",
      "Diepe of ingetrokken littekens met alleen microneedling. Die vragen vaak een combinatie met laser [MEDISCHE-CHECK-ROJDA]",
    ],
  },

  vergelijking: {
    label: "Naast elkaar",
    anker: "Vergelijking",
    kop: "Microneedling of",
    accent: "laser en peeling",
    intro:
      "Voor littekens en structuur zijn er meer wegen. Dit is wat ze doen, wat je erna merkt en wat ze kosten.",
    kolommen: ["Behandeling", "Waarin het verschilt", "Hersteltijd", "Vanaf"],
    rijen: [
      vergelijkingsrij(
        "skinpen",
        "Veertien naalden en een bedaarder ritme. Instelbaar van 0,25 tot 3 millimeter.",
      ),
      vergelijkingsrij(
        "dermapen-4",
        "Meer prikken per seconde en sneller over een groot vlak, met een vaste stand voor littekens.",
      ),
      vergelijkingsrij(
        "fotona-scar-repair",
        "Laser in plaats van naalden. Voor diepere of ingetrokken littekens, vaak samen met microneedling. [MEDISCHE-CHECK-ROJDA]",
      ),
      vergelijkingsrij(
        "peelings",
        "Werkt met zuren op de bovenlaag. Minder diep, en meer effect op oppervlakkige verkleuring en ruwheid. [MEDISCHE-CHECK-ROJDA]",
      ),
    ],
    bijschrift:
      "Microneedling vergeleken met laser en peeling op werking, hersteltijd en tarief",
  },

  wie: {
    label: "Wie de behandeling doet",
    zin: "Microneedling wordt bij ons gedaan door een huidtherapeut. Die kiest per zone de diepte en de pen, en stelt die bij als je huid anders reageert dan verwacht.",
  },

  reviews: {
    onderwerp: "littekens",
    intro:
      "Reviews van klanten die hier kwamen voor littekens. Ze komen rechtstreeks uit onze agenda en staan er zoals ze geschreven zijn.",
  },

  faq: [
    {
      vraag: "Wat kost microneedling in Rotterdam?",
      antwoord: `Bij Diba Clinics kost microneedling ${euro(prijsVan("Gezicht"))} voor het gezicht en ${euro(prijsVan("Rug"))} voor de rug. Met de hals erbij is het ${euro(prijsVan("Gezicht en hals"))}, en met hals en decolleté ${euro(prijsVan("Gezicht, hals"))}. Dat is per sessie, en microneedling werkt in een reeks van drie tot zes. Kom je voor het eerst, dan begint je afspraak met een intake; die kost ${euro(INTAKE_PRIJS)} en vervalt als we in dezelfde afspraak behandelen.`,
    },
    {
      vraag: "Doet microneedling pijn?",
      antwoord:
        "Het is goed te doen. Vooraf gaat er een verdovende crème op die een half uur intrekt. Wat je daarna voelt is vooral trilling en druk, het sterkst waar de huid dun over bot ligt, zoals op je voorhoofd.",
    },
    {
      vraag: "Hoe lang ben ik rood na microneedling?",
      antwoord:
        "Een tot drie dagen, ongeveer als een stevige zonnegloed. De eerste vierentwintig uur laat je je huid met rust: geen make-up en niet sporten tot je flink zweet. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Hoeveel behandelingen heb ik nodig?",
      antwoord:
        "Meestal drie tot zes, met vier tot zes weken ertussen. Hoeveel het er bij jou worden hangt af van je klacht en van hoe je huid reageert. Dat meten we tussendoor, en een vast aantal vooraf beloven we niet. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Wanneer zie ik resultaat van microneedling?",
      antwoord:
        "Niet na de eerste keer; wat je dan ziet is zwelling. Het collageen dat je huid aanmaakt bouwt zich over weken op, dus het verschil zie je in de loop van de reeks en het duidelijkst een paar maanden na de laatste behandeling. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Wat is het verschil tussen de SkinPen en de Dermapen?",
      antwoord:
        "Het motorontwerp en het aantal naalden. De SkinPen heeft er veertien en werkt iets bedaarder; de Dermapen haalt meer prikken per seconde en werkt een vlak sneller af. De diepte is bij allebei in te stellen tot 3 millimeter, en het tarief is hetzelfde.",
    },
    {
      vraag: "Helpt microneedling tegen acnelittekens?",
      antwoord:
        "Bij littekens die door verlies van structuur zijn ontstaan, zoals de ondiepe kuiltjes na acne, kan het goed helpen. Diepe of ingetrokken littekens vragen vaak een combinatie met laser. Zolang de acne nog actief is, beginnen we er niet aan: de huid moet eerst rustig zijn. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Kan microneedling bij een donkere huid?",
      antwoord:
        "Vaak wel, en het is dan een van de betere opties, omdat er geen warmte aan te pas komt. Bij huidtype IV tot VI letten we extra op pigmentvorming na de behandeling en passen we de diepte daarop aan. Dat bespreken we vooraf. [MEDISCHE-CHECK-ROJDA]",
    },
    VRAAG_WAAR,
  ],

  twijfel: {
    voor: "Weet je niet of",
    accent: "microneedling",
    na: "bij je past",
    zin: "Dat hoef je ook niet te weten voordat je komt. Boek een behandeling op advies: we meten je huid, kijken wat voor litteken of structuur het is en zeggen welke behandeling daarbij past. Is dat laser of een peeling, dan hoor je dat.",
  },

  cta: {
    kop: "Microneedling in Rotterdam",
    accent: "plannen",
    tekst:
      "We meten je huid en bespreken welke diepte en welke pen erbij passen. Is behandelen verstandig, dan kan de eerste sessie vaak in dezelfde afspraak.",
    topic: "microneedling",
  },

  schema: {
    procedure: { naam: "Microneedling", omschrijving: SP.werking },
    dienst: { naam: "Microneedling", soort: "Huidbehandeling" },
  },
};
