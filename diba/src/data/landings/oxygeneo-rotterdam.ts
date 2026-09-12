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
 * OxyGeneo in Rotterdam.
 *
 * WAAROM DEZE PAGINA NIET BOTST MET /behandelingen/oxygeneo.
 *
 * De behandelpagina heet "Oxygeneo glow" en gaat over de behandeling. Deze gaat over OxyGeneo
 * bij ons: wat het kost, wat die belletjes doen, en het verschil met een HydraFacial. Dat
 * laatste is de vraag die iemand heeft die beide namen voorbij heeft zien komen.
 *
 * DE SCHRIJFWIJZE: het apparaat heet OxyGeneo (van Pollogen); de behandeling op de site heet
 * "Oxygeneo glow". In de tekst gebruiken we de naam van het merk, want daarop wordt gezocht.
 */

const OX = behandeling("oxygeneo");

export const OXYGENEO_ROTTERDAM: Landing = {
  slug: "oxygeneo-rotterdam",
  gewijzigd: "2026-09-11",
  titel: "OxyGeneo Rotterdam",
  omschrijving: `OxyGeneo in Rotterdam bij Diba Clinics. ${euro(OX.prijs)}, zestig minuten en geen hersteltijd. Exfoliëren en voeden in één behandeling.`,
  kruimel: "OxyGeneo",
  h1: { kop: "OxyGeneo in", accent: "Rotterdam" },
  antwoord: `OxyGeneo is een gezichtsbehandeling waarbij een capsule op de huid met een gel reageert: de bovenste laag wordt losgemaakt, werkzame stoffen gaan erin, en de huid krijgt een prikkel om meer zuurstofrijk bloed naar het oppervlak te sturen. Bij Diba Clinics in Rotterdam duurt de behandeling ${OX.duurMinuten} minuten, kost hij ${euro(OX.prijs)} en is er geen hersteltijd. [MEDISCHE-CHECK-ROJDA]`,
  feiten: [
    { kop: "Duur", waarde: `${OX.duurMinuten} minuten` },
    { kop: "Tarief", waarde: euro(OX.prijs) },
    { kop: "Hersteltijd", waarde: "Geen" },
    { kop: "Apparaat", waarde: "OxyGeneo, Pollogen" },
  ],
  beeld: {
    src: "/images/shoot/beh-oxygeneo.jpg",
    alt: "Behandelgel op de huid met het handstuk erop",
  },
  kaart: {
    vraag: "Wat kost een OxyGeneo",
    zin: "Wat de belletjes op je huid doen, voor wie het past, hoe lang je er iets van ziet en hoe het zich verhoudt tot een HydraFacial.",
  },

  werking: {
    label: "De werking",
    anker: "Wat het doet",
    kop: "Wat OxyGeneo",
    accent: "met je huid doet",
    intro:
      "Drie dingen in één beweging: losmaken, inbrengen en de doorbloeding een zet geven. Het blijft aan de oppervlakte, en daarom zie je het meteen.",
    alineas: [
      "Een huid die dof staat, heeft vaak een laag dode cellen die te lang blijft zitten, en een oppervlak dat weinig licht terugkaatst. Crèmes komen door die laag slecht heen. Wat helpt is de laag losmaken en tegelijk iets teruggeven, en dat is precies wat deze behandeling in één doorgang doet. [MEDISCHE-CHECK-ROJDA]",
      "Het handstuk beweegt een capsule over je huid terwijl er een gel op ligt. Die twee reageren met elkaar en er ontstaan kleine CO2-belletjes. Je huid reageert daarop door meer zuurstofrijk bloed naar de plek te sturen. Intussen maakt de capsule de buitenste laag los en gaan de stoffen uit de gel erin. [MEDISCHE-CHECK-ROJDA]",
      "Het blijft aan de oppervlakte, en dat is de reden dat je er meteen iets van ziet en er verder niets van merkt. Het is ook de reden dat het effect dagen aanhoudt en geen weken. Veel mensen plannen deze behandeling daarom vlak voor een gelegenheid, of elke vier tot zes weken als onderhoud. [MEDISCHE-CHECK-ROJDA]",
    ],
    verder:
      "Hoe het apparaat werkt staat bij de [OxyGeneo van Pollogen](/apparatuur/oxygeneo). De behandeling zelf staat op [de behandelpagina](/behandelingen/oxygeneo).",
  },

  onderscheid: {
    label: "In de stoel",
    anker: "In de stoel",
    kop: "Een van de rustigste",
    accent: "behandelingen",
    intro:
      "Er komen geen naalden, geen zuren en geen warmte aan te pas. Wat je voelt is vooral een licht bruisen.",
    alineas: [
      "Eerst gaan make-up en talg eraf, anders werkt de rest op een laagje in plaats van op je huid. Daarna gaat de gel op en beweegt de behandelaar het handstuk in banen over je gezicht. De gel en de capsule reageren met elkaar en dat bruist licht; je hoort het meer dan dat je het voelt.",
      "Erna is je huid roze en voelt hij zacht aan. Dat trekt meestal binnen een uur weg, en make-up mag dezelfde dag nog. Er is niets waar je rekening mee hoeft te houden behalve zonbescherming, en die geldt sowieso.",
      "Bij een huid die op dat moment ontstoken of geïrriteerd is, doen we het niet; dan brengen we je huid eerst tot rust. Bij een gevoelige huid kan het meestal wel, en dat beoordeelt de behandelaar bij de intake. [MEDISCHE-CHECK-ROJDA]",
    ],
    beeld: {
      src: "/images/shoot/apparaat-pollogen.jpg",
      alt: "Het OxyGeneo-apparaat van Pollogen in de behandelkamer",
    },
    knop: { href: "/apparatuur/oxygeneo", tekst: "Over de OxyGeneo" },
  },

  tarief: {
    label: "Tarieven",
    anker: "Wat het kost",
    kop: "Wat OxyGeneo",
    accent: "bij ons kost",
    intro:
      "Eén tarief, en geen varianten om uit te kiezen. De intakeregeling voor een eerste afspraak staat er compleet bij, want daar zit het bedrag dat mensen niet zien aankomen.",
    rijen: tariefrijen("oxygeneo"),
    zin: "Wil je het effect vasthouden, dan plan je het elke vier tot zes weken als onderhoud. Hoe vaak dat bij jou zin heeft, bespreken we bij de intake. [MEDISCHE-CHECK-ROJDA]",
    afspraak: afspraakBlokken({
      naam: "de OxyGeneo",
      duurMinuten: OX.duurMinuten,
    }),
  },

  welNiet: {
    intro:
      "OxyGeneo werkt op de bovenste lagen. Voor wat dieper zit, en voor verschil dat blijft, is er een andere behandeling.",
    wel: [
      "Een doffe huid die er meteen frisser uit mag zien",
      "Een droge of vochtarme huid",
      "Een behandeling vlak voor een gelegenheid, zonder dag waarop je binnen moet blijven",
      "Onderhoud naast een traject, zonder hersteltijd",
    ],
    niet: [
      "Littekens of pigment dat dieper zit. Daar is microneedling of laser voor [MEDISCHE-CHECK-ROJDA]",
      "Een huid die op dat moment ontstoken of geïrriteerd is. Die brengen we eerst tot rust [MEDISCHE-CHECK-ROJDA]",
      "Blijvend verschil. Het effect houdt dagen aan, dus het is onderhoud [MEDISCHE-CHECK-ROJDA]",
      "Verstopte poriën legen. Daarvoor is een HydraFacial gerichter",
    ],
  },

  vergelijking: {
    label: "Naast elkaar",
    anker: "Vergelijking",
    kop: "OxyGeneo naast",
    accent: "de alternatieven",
    intro:
      "Voor een frissere huid zijn er meer wegen. Dit is wat ze doen, wat je erna merkt en wat ze kosten.",
    kolommen: ["Behandeling", "Waarin het verschilt", "Hersteltijd", "Vanaf"],
    rijen: [
      vergelijkingsrij(
        "oxygeneo",
        "Een capsule en een gel maken de bovenlaag los en brengen stoffen in, met een prikkel voor de doorbloeding. Rustig en zonder hersteltijd.",
      ),
      vergelijkingsrij(
        "hydrafacial",
        "Zuigt poriën leeg met onderdruk en brengt in dezelfde beweging serum terug. Gerichter op wat er in de porie zit.",
      ),
      vergelijkingsrij(
        "dermaplaning",
        "Een mesje haalt dode cellen en donshaar weg. Voor een gladde huid onder make-up.",
      ),
      vergelijkingsrij(
        "led-therapie",
        "Licht dat de huid rustiger maakt, zonder warmte. Vaak als toevoeging aan een andere behandeling. [MEDISCHE-CHECK-ROJDA]",
      ),
      vergelijkingsrij(
        "peelings",
        "Een zuur maakt de bovenlaag los en gaat dieper. Meer effect op verkleuring, en meer reactie van je huid. [MEDISCHE-CHECK-ROJDA]",
      ),
    ],
    bijschrift:
      "OxyGeneo vergeleken met andere gezichtsbehandelingen op werking, hersteltijd en tarief",
  },

  wie: {
    label: "Wie de behandeling doet",
    zin: "De behandelaar beoordeelt vooraf of je huid er rustig genoeg voor is, en kiest de gel op wat je huid op dat moment nodig heeft. [GEGEVEN-NODIG: welke functies OxyGeneo doen, en welke gels er zijn, Okan]",
  },

  reviews: {
    onderwerp: "gezichtsbehandeling",
    reeks: 3,
    intro:
      "Reviews van klanten die hier voor een gezichtsbehandeling waren. Ze komen rechtstreeks uit onze agenda en staan er zoals ze geschreven zijn.",
  },

  faq: [
    {
      vraag: "Wat kost OxyGeneo in Rotterdam?",
      antwoord: `Bij Diba Clinics kost een OxyGeneo-behandeling ${euro(OX.prijs)} en duurt hij ${OX.duurMinuten} minuten. Kom je voor het eerst, dan begint je afspraak met een intake van ${euro(INTAKE_PRIJS)}, die vervalt als we in dezelfde afspraak behandelen.`,
    },
    {
      vraag: "Wat zijn die belletjes op mijn huid?",
      antwoord:
        "CO2 dat vrijkomt als de capsule met de gel reageert. Je huid reageert daarop met een betere doorbloeding, en dat is precies de bedoeling. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Voel ik iets van OxyGeneo?",
      antwoord:
        "Een licht bruisen en wat warmte. Geen prikken en geen hersteltijd; je kunt er direct mee de deur uit.",
    },
    {
      vraag: "Hoe lang zie ik er iets van?",
      antwoord:
        "Het effect houdt dagen aan, geen weken. Veel mensen plannen deze behandeling daarom vlak voor een gelegenheid, of elke vier tot zes weken als onderhoud. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Wat is het verschil tussen OxyGeneo en een HydraFacial?",
      antwoord:
        "Allebei werken ze op de bovenste laag en zonder hersteltijd. Een HydraFacial zuigt met onderdruk poriën leeg en brengt serum terug; OxyGeneo maakt de laag los met een capsule en een gel, waarbij je huid een prikkel krijgt om meer zuurstofrijk bloed naar het oppervlak te sturen. Voor verstopte poriën is de HydraFacial gerichter. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Kan OxyGeneo bij een gevoelige huid?",
      antwoord:
        "Meestal wel. De behandelaar beoordeelt dat tijdens de intake; bij actieve rosacea of ontstoken acne brengen we eerst je huid tot rust. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Kan ik OxyGeneo doen vlak voor een feest?",
      antwoord:
        "Ja, daar is hij juist geschikt voor: het effect is er meteen en er is geen dag waarop je binnen moet blijven. Je huid is na afloop kort roze, en dat trekt meestal binnen een uur weg. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      vraag: "Hoe vaak kun je OxyGeneo doen?",
      antwoord:
        "Los, of als onderhoud elke vier tot zes weken. Wat bij jou zin heeft, bespreken we bij de intake. [MEDISCHE-CHECK-ROJDA]",
    },
    VRAAG_WAAR,
  ],

  twijfel: {
    voor: "Weet je niet of",
    accent: "OxyGeneo",
    na: "bij je past",
    zin: "Dat hoef je ook niet te weten voordat je komt. We bekijken je huid en zeggen welke behandeling erbij past. Zitten je poriën vol, dan is een HydraFacial misschien het betere antwoord, en dat hoor je dan.",
  },

  cta: {
    kop: "OxyGeneo in Rotterdam",
    accent: "plannen",
    tekst:
      "We bekijken eerst je huid en zeggen daarna of OxyGeneo erbij past. Is dat zo, dan kan de behandeling vaak in dezelfde afspraak.",
    topic: "oxygeneo",
  },

  schema: {
    procedure: { naam: "OxyGeneo", omschrijving: OX.werking },
    dienst: { naam: "OxyGeneo", soort: "Gezichtsbehandeling" },
  },
};
