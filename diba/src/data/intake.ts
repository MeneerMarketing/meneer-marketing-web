/**
 * Behandeling Nul: de intake.
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
      "We vragen waar je last van hebt, sinds wanneer, wat je zelf al hebt geprobeerd en wat je verwacht. Dat laatste is de belangrijkste vraag van het hele uur, want daar blijkt uit of we hetzelfde voor ogen hebben.",
    nietNodig:
      "Je hoeft je niet voor te bereiden op vaktermen. Zeg het in je eigen woorden; wij vertalen.",
  },
  {
    id: "meting",
    tijd: "Het grootste deel",
    naam: "De meting met Eve-M",
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

export const INTAKE_FEITEN = [
  { label: "Duur", waarde: "[GEGEVEN-NODIG] minuten" },
  { label: "Kosten", waarde: "[PRIJS-NODIG]" },
  { label: "Verplichting", waarde: "Geen" },
  { label: "Behandeling deze afspraak", waarde: "Nee" },
] as const;

/* ── Voorbereiden ──────────────────────────────────────────────────────── */

export const VOORBEREIDING = {
  altijd: [
    "Kom zonder make-up, of neem er rekening mee dat we het eraf halen. Een meting over foundation heen is geen meting.",
    "Neem foto's mee van hoe het was op een slechte dag. Huid is zelden op zijn ergst op het moment van de afspraak.",
    "Neem je verzorgingsproducten mee, of maak er thuis een foto van. De ingrediëntenlijst zegt meer dan de naam.",
    "Weet welke medicatie je gebruikt, ook de pil en middelen die niets met je huid te maken lijken te hebben.",
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
      wat: "Bel of app even. Dan is uitstellen vaak zinvoller dan komen, en dat scheelt je een afspraak die weinig oplevert.",
    },
  ],
} as const;

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
