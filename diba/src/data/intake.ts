/**
 * Het huidconsult.
 *
 * Dit is de pagina waar elke knop op de site naartoe wijst, en dus de pagina waar de meeste
 * twijfel zit. Die twijfel gaat zelden over de meting. Hij gaat over de vraag of je straks
 * met een verkoopgesprek en een pakket de deur uitloopt.
 *
 * Daarom heeft de tijdlijn hieronder een derde kolom die je nergens anders ziet: wat je op
 * dat moment níet hoeft. Bij elke stap. Dat is het enige antwoord op die twijfel dat niet
 * uit een geruststellende zin bestaat maar uit de opzet zelf.
 *
 * COPY-STATUS: concept in de Diba-stem. Prijs en duur zijn gemarkeerd; die moeten van Yasin
 * komen en niet uit een aanname.
 */

export type Stap = {
  readonly id: string;
  readonly tijd: string;
  readonly naam: string;
  readonly watErGebeurt: string;
  /** De kolom die het verschil maakt: wat je op dit moment niet hoeft. */
  readonly nietNodig: string;
};

export const STAPPEN: readonly Stap[] = [
  {
    id: "aankomst",
    tijd: "Eerste minuten",
    naam: "Aankomst en het gesprek",
    watErGebeurt:
      "We bespreken je huidvraag We vragen waar je last van hebt, hoelang dit al speelt en wat je zelf hebt geprobeerd. Ook bespreken we wat je verwacht en wat je juist niet wilt.",
    nietNodig:
      "Je hoeft je niet voor te bereiden op vaktermen. Zeg het in je eigen woorden; wij vertalen.",
  },
  {
    id: "meting",
    tijd: "Het grootste deel",
    naam: "De meting met EVE-M",
    watErGebeurt:
      "Foto's onder vaste belichting en op vaste afstand, plus metingen van kleur, structuur en vocht. Het apparaat doet niets met je huid; het kijkt alleen. [MEDISCHE-CHECK-ROJDA]",
    nietNodig:
      "Je hoeft niets te ondergaan. Er wordt in deze afspraak niet behandeld, ook niet een klein stukje.",
  },
  {
    id: "uitleg",
    tijd: "Daarna",
    naam: "Wat er te zien is",
    watErGebeurt:
      "We lopen de meting met je door en laten zien wat we zien. Ook de dingen waar je zelf niet voor kwam, en de dingen die meevallen.",
    nietNodig:
      "Je hoeft niet te doen alsof je het snapt. Vraag door tot het klopt; daar is de tijd voor.",
  },
  {
    id: "advies",
    tijd: "Aan het eind",
    naam: "Het eerlijke advies",
    watErGebeurt:
      "Wat er mogelijk is, wat het realistisch oplevert, hoeveel sessies dat vraagt en wat het kost. Soms is het advies om niets te doen, of om eerst twee weken af te bouwen en dan opnieuw te kijken.",
    nietNodig:
      "Je hoeft niets af te spreken. Niet vandaag, en niet aan de balie. Je krijgt het mee en denkt er thuis over na.",
  },
  {
    id: "daarna",
    tijd: "Later",
    naam: "Wat je meeneemt",
    watErGebeurt:
      "Je meting blijft bewaard als beginpunt. Kom je over een half jaar terug, dan leggen we de nieuwe ernaast en zie je het verschil in plaats van dat je het moet geloven.",
    nietNodig:
      "Je hoeft niet terug te komen. De meting is van jou, ook als je verder niets doet.",
  },
];

/**
 * Hoe lang de afspraak duurt.
 *
 * Een getal dat de hele pagina voedt: verandert deze regel, dan loopt de rest mee.
 *
 * Stond op zestig, ging op 3 september 2026 naar dertig op aanwijzing van Yasin, en staat
 * er nu weer op zestig omdat Okan diezelfde avond de twee producten uitschreef: "Alleen
 * intake en behandeladvies: maximaal zestig minuten en € 50." Dat komt overeen met wat
 * er in DIBA-COPY-STYLE-GUIDE.md staat.
 *
 * [BESLUIT-OKAN] Yasin en Okan noemden verschillende tijden. Zestig staat er nu; klopt
 * dertig toch, dan verandert alleen deze regel.
 */
export const INTAKE_MINUTEN = 60;

/**
 * De vier feiten naast de kop.
 *
 * Kosten stond hier op "[PRIJS-NODIG]" en werd dus leeg getoond, terwijl het bedrag gewoon
 * in `behandelingen.ts` staat en op de uitkomst van het huidprofiel al zichtbaar was. Twee
 * pagina's over dezelfde afspraak, waarvan de ene het bedrag noemde en de andere niet, en
 * dat was juist de pagina waar je boekt.
 *
 * Daarom komt de prijs nu uit de behandelingentabel en niet uit een tweede plek die kan
 * gaan afwijken. Zie `intakeFeiten()` in de pagina.
 */
export const INTAKE_FEITEN_VAST = [
  { label: "Verplichting", waarde: "Geen" },
  { label: "Behandeling deze afspraak", waarde: "Nee" },
] as const;

/**
 * Wat je overhoudt als je hierna niets meer doet.
 *
 * DE ENIGE EERLIJKE MANIER OM DEZE PAGINA BETER TE LATEN CONVERTEREN.
 *
 * Wat mensen tegenhoudt bij een intake is niet het bedrag maar het vermoeden dat het de
 * ingang van een traject is. Schaarste, kortingen en aflopende aanbiedingen mogen hier niet
 * en werken bij een medische keuze ook averechts. Wat wel werkt is het risico wegnemen:
 * laten zien dat de afspraak op zichzelf iets oplevert, ook als je daarna nooit meer
 * terugkomt.
 *
 * Alles hieronder is nacontroleerbaar op de rest van de site, en dat is met opzet.
 */
export const OOK_ALS_JE_STOPT: readonly { kop: string; zin: string }[] = [
  {
    kop: "Een nulpunt dat van jou is",
    zin: "Je meting blijft bewaard als beginpunt. Ga je later ergens anders heen, dan heb je iets om mee te vergelijken dat niet van een telefooncamera komt.",
  },
  {
    kop: "Weten wat je niet moet doen",
    zin: "Vaak is de winst dat er iets afvalt. Een behandeling die je overwoog en die op jouw huid niets gaat doen, is een besparing van honderden euro's en een paar maanden.",
  },
  {
    kop: "Je routine doorgelicht",
    zin: "We kijken naar wat je nu thuis gebruikt en naar de ingrediëntenlijst, niet naar de naam op de verpakking. Soms zit daar het hele antwoord.",
  },
  {
    kop: "Een advies dat nee mag zijn",
    zin: "Soms is het advies om niets te doen, of om eerst iets af te bouwen en over twee weken opnieuw te kijken. Dat hoor je dan ook, en het kost je niets extra.",
  },
];

/* ── Voorbereiden ──────────────────────────────────────────────────────── */

export const VOORBEREIDING = {
  altijd: [
    "Kom zonder make-up, of neem er rekening mee dat we het eraf halen. Een meting over foundation heen is geen meting.",
    "Neem foto's mee waarop te zien is hoe je huid eruitziet wanneer de klacht erger is.",
    "Neem de producten die je thuis gebruikt mee of maak foto's van de verpakkingen.",
    "Zorg dat je weet welke medicatie, supplementen en anticonceptie je gebruikt.",
  ],
  soms: [
    {
      wanneer: "Kom je voor pigment of melasma",
      wat: "Geen zonvakantie of zonnebank in de weken ervoor. Een verse kleur maakt de meting onbetrouwbaar en behandelen daarna onverstandig. [MEDISCHE-CHECK-ROJDA]",
    },
    {
      wanneer: "Kom je voor acne",
      wat: "Stop niet met wat je van je arts gebruikt. We willen juist zien hoe je huid eruitziet mét wat je nu doet.",
    },
    {
      wanneer: "Is je huid nu geïrriteerd",
      wat: "Laat het ons even weten voor je komt. Uitstellen is dan vaak zinvoller, en dat scheelt je een afspraak die weinig oplevert.",
    },
  ],
} as const;

/**
 * Reviews van mensen die voor een consult kwamen.
 *
 * WAAROM HIER EN NIET ALLEEN OP /REVIEWS.
 *
 * Op /reviews staan alle 56 quotes met de waarschuwing dat een 5,0 wantrouwen verdient. Dat
 * blijft daar staan. Maar op de pagina waar iemand besluit of hij die ene afspraak boekt,
 * helpt iets anders: wat zeiden mensen die precies dít deden.
 *
 * Deze acht zijn geselecteerd op de behandeling die erbij staat, niet op inhoud. Dat is een
 * controleerbaar criterium; "de mooiste eruit" zou dat niet zijn en is precies wat we op
 * /resultaten afkeuren.
 */
export const CONSULT_REVIEW_IDS: readonly string[] = [
  "salon-aydan",
  "salon-sarah-grissel",
  "salon-alice-advies",
  "salon-meike",
  "salon-martyna",
  "salon-fleur",
];

export const INTAKE_FAQ = [
  {
    vraag: "Word ik hierna gebeld om alsnog iets af te nemen?",
    antwoord:
      "Nee. Je hoort van ons als je zelf iets afspreekt of als je een vraag stelt. Er is geen belronde en er is geen aanbod dat verloopt.",
  },
  {
    vraag: "Wat als de uitkomst is dat ik niets moet doen?",
    antwoord:
      "Dan zeggen we dat en houdt het daar op. Dat komt vaker voor dan je denkt, en het is de reden dat de meting los staat van de behandeling.",
  },
  {
    vraag: "Kan ik meteen een behandeling krijgen?",
    antwoord:
      "Nee, en dat is met opzet. Behandelen zonder beginpunt betekent dat je later niet kunt nagaan of het werkte. Bovendien beslis je dan onder druk van het moment.",
  },
  {
    vraag: "Moet ik voor elke klacht apart komen?",
    antwoord:
      "Nee. In één afspraak kijken we naar je hele huid, ook naar dingen waar je niet voor kwam. Vaak blijkt dat wat je stoort en wat er speelt niet hetzelfde zijn.",
  },
  {
    vraag: "Wat gebeurt er met mijn foto's?",
    antwoord:
      "Die blijven in je eigen dossier als beginpunt. Ze worden niet gebruikt op onze site of in advertenties tenzij je daar apart en schriftelijk toestemming voor geeft, en die kun je altijd intrekken. [BESLUIT-OKAN]",
  },
  {
    vraag: "Ik weet niet eens waarvoor ik zou komen.",
    antwoord:
      "Dat is een prima reden om te komen. De symptoomzoeker helpt je een richting te vinden, en anders begint het gesprek gewoon met kijken.",
  },
] as const;

/**
 * De combinatie-afspraak: meten en meteen de eerste behandeling.
 *
 * WAAROM DIT HIER STAAT EN NIET STILLETJES IN DE TEKST HIERBOVEN IS VERWERKT.
 *
 * Okan zegt dat dit in de praktijk de meest gekozen afspraak is: Het huidconsult plus een
 * eerste behandeling, samen 120 minuten. Op de site stond daar niets over. Sterker nog:
 * hierboven staat "Behandeling deze afspraak: Nee" en de hele pagina is gebouwd op één uur
 * meten zonder behandelen.
 *
 * Die twee kunnen allebei waar zijn, maar dan moet het er wel staan. Als de meest gekozen
 * afspraak nergens genoemd wordt, kiest niemand hem bewust; en als de pagina zegt dat er
 * niet behandeld wordt terwijl dat meestal wel gebeurt, klopt de belofte niet meer.
 *
 * Daarom staat het er nu als een tweede, expliciete keuze naast het huidconsult, met de
 * volgorde intact: eerst meten, dan pas behandelen, en alleen als de meting dat toelaat.
 * Dat laatste is geen slag om de arm maar de kern van wat deze kliniek belooft.
 *
 * [BESLUIT-OKAN] klopt 120 minuten, en klopt het dat dit de meest gekozen afspraak is?
 * [PRIJS-NODIG: wat kost de combinatie? De meting is 50 euro; wat de behandeling kost
 * hangt af van welke het wordt, dus of dit een vast bedrag heeft of een optelsom.]
 * [MEDISCHE-CHECK-ROJDA] wanneer kan er in dezelfde afspraak wél behandeld worden en
 * wanneer niet. Dit is de enige zin op deze pagina waar een klant een verwachting aan
 * ontleent over zijn eigen afspraak.
 */
export const COMBINATIE_AFSPRAAK = {
  label: "Meest gekozen",
  kop: "Meten en meteen beginnen",
  minuten: 120,
  zin: "Boek je eerste afspraak",
  voorwaarde:
    "Als we behandelen, betaal je alleen de prijs van de behandeling. De intake wordt dan niet apart in rekening gebracht. Als er geen behandeling wordt uitgevoerd, betaal je 50 euro voor de intake.",

  /**
   * Waarom het niet altijd doorgaat.
   *
   * De gids: "Zeg niet dat een behandeling altijd direct kan doorgaan. Dat hangt af van de
   * beoordeling, contra-indicaties, beschikbare tijd en keuze van de klant."
   *
   * De kop van deze kaart is een toezegging ("Meten en meteen beginnen", met "Meest
   * gekozen" erboven) en de zin eronder ging over geld. De voorwaarde zat wel in dat "als"
   * en werd nergens genoemd. Nu staat hij er, met de vier redenen uit de gids.
   *
   * [MEDISCHE-CHECK-ROJDA] of deze vier de lading dekken.
   */
  voorbehoud:
    "Of dat kan hangt af van wat de meting laat zien, van eventuele contra-indicaties, van de tijd die er die dag is en van wat jij wil. Blijkt behandelen op dat moment niet verstandig, dan doen we het niet.",
} as const;
