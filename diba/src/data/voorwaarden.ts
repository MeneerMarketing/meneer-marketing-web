/**
 * Algemene voorwaarden.
 *
 * WAAROM DIT PER SITUATIE GAAT EN NIET PER ARTIKEL.
 *
 * Een voorwaardenpagina is normaal een muur met kopjes als "Artikel 4: Annulering". Niemand
 * leest dat, en dat is precies het probleem: de enige momenten waarop iemand hier komt zijn
 * momenten waarop er iets aan de hand is. Je moet afzeggen, je bent te laat, je hebt een
 * rekening gekregen die je niet verwachtte.
 *
 * Dus staan de situaties centraal en niet de juridische indeling. Per situatie: wat er
 * gebeurt, wat het kost, en waarom die regel er is. Die derde is wat een voorwaarde
 * onderscheidt van een boete.
 *
 * DE GETALLEN STAAN OP ÉÉN PLEK EN ZIJN EEN VOORSTEL.
 *
 * Termijnen en bedragen zijn afspraken tussen jullie en de klant, geen tekst die ik kan
 * bedenken. Wat hieronder staat zijn gangbare waarden in de branche, zodat de pagina nu al
 * volledig leest. Ze staan bewust in constanten: één plek wijzigen en de hele pagina volgt.
 *
 * [BESLUIT-OKAN] elke waarde in `AFSPRAKEN` hieronder, plus de vraag of jullie überhaupt
 * een no-showbedrag willen rekenen. Dit zijn bindende afspraken zodra de site live staat.
 * [MEDISCHE-CHECK-ROJDA] de blokken over contra-indicaties en over resultaat.
 *
 * WAT HIER MET OPZET NIET STAAT.
 *
 * Een aansprakelijkheidsclausule. Dat is de enige paragraaf op deze site waarvan de precieze
 * formulering juridisch werk is en waar een verkeerd woord jullie geld kost. Die hoort van
 * een jurist te komen en niet van mij. Zolang hij er niet is, staat er ook geen half
 * antwoord: liever een pagina die iets niet behandelt dan een pagina die er iets over
 * beweert dat niet klopt.
 */

/**
 * De getallen, bevestigd door Okan op 5 september 2026.
 *
 * Er stond 24 uur; het is 48. En er stond dat je bij te laat afzeggen de helft van het
 * tarief betaalt. Dat is niet zo: er wordt met een aanbetaling gewerkt en die vervalt.
 * Dat is een milder verhaal dan wat hier stond, en bovendien het juiste.
 */
export const AFSPRAKEN = {
  /** Kosteloos afzeggen of verzetten kan tot zoveel uur voor de afspraak. */
  annulerenUren: 48,
  /** Na zoveel minuten te laat past de behandeling niet meer in het tijdvak. */
  telaatMinuten: 15,
  /** Hoe lang een aangekocht traject geldig blijft, in maanden. */
  trajectGeldigMaanden: 12,
} as const;

export type Situatie = {
  readonly id: string;
  readonly kop: string;
  /** Wat er gebeurt. Concreet, in gewone taal. */
  readonly gebeurt: string;
  /** Wat het kost. "Niets" is ook een antwoord en staat er dan ook. */
  readonly kost: string;
  /** Waarom de regel er is. Zonder reden is een voorwaarde een boete. */
  readonly waarom: string;
};

const uur = (n: number) => `${n} uur`;

export const SITUATIES: readonly Situatie[] = [
  {
    id: "afzeggen-op-tijd",
    kop: "Je zegt op tijd af of verzet",
    gebeurt: `Tot ${uur(AFSPRAKEN.annulerenUren)} voor je afspraak kun je afzeggen of verzetten, telefonisch of per bericht. Je hoeft geen reden te geven.`,
    kost: "Niets. Je aanbetaling vervalt niet en gaat mee naar de nieuwe afspraak.",
    waarom: `Binnen ${uur(AFSPRAKEN.annulerenUren)} lukt het meestal nog om de plek aan iemand anders te geven. Daarbuiten niet, en dat is het enige verschil tussen deze regel en de volgende.`,
  },
  {
    id: "afzeggen-te-laat",
    kop: "Je zegt te laat af of komt niet",
    gebeurt: `Zeg je minder dan ${uur(AFSPRAKEN.annulerenUren)} voor je afspraak af, of kom je zonder bericht niet opdagen, dan vervalt je aanbetaling. Voor een nieuwe afspraak vragen we opnieuw een aanbetaling.`,
    kost: "Alleen de aanbetaling. Niet het volledige tarief en ook geen percentage van de gereserveerde behandeling.",
    waarom:
      "De tijd was gereserveerd en de behandelaar stond klaar. Het blijft bij de aanbetaling omdat het doel is dat een plek niet leeg blijft, en niet dat er verdiend wordt aan iemand die er niet was.",
  },
  {
    id: "te-laat",
    kop: "Je bent te laat",
    gebeurt: `Kom je meer dan ${AFSPRAKEN.telaatMinuten} minuten te laat, dan past de behandeling misschien niet meer veilig in de gereserveerde tijd. Kan het verantwoord, dan korten we hem in; kan het niet, dan verzetten we de afspraak.`,
    kost: "Bij inkorten geldt de volledige behandelprijs, want de tijd was voor jou gereserveerd. Moet de afspraak verzet worden, dan vervalt de aanbetaling.",
    waarom:
      "De afspraak erna schuift anders mee, en dan is iemand anders de dupe van iets waar diegene niets aan kan doen. Half behandelen omdat de klok het zegt is de andere optie, en die is slechter.",
  },
  {
    id: "wij-zeggen-af",
    kop: "Wij moeten afzeggen",
    gebeurt:
      "Kan een afspraak van onze kant niet doorgaan, dan hoor je dat zo snel als we het zelf weten en zoeken we samen een nieuwe datum.",
    kost: "Niets. Je aanbetaling blijft staan voor de nieuwe afspraak of je krijgt hem terug.",
    waarom:
      "Dezelfde regel als hierboven, maar dan onze kant op. Een voorwaarde die maar één richting op werkt is geen afspraak.",
  },
  {
    id: "behandeling-kan-niet",
    kop: "De behandeling blijkt niet verantwoord",
    gebeurt:
      "Blijkt tijdens de intake of vlak voor de behandeling dat behandelen op dat moment niet verantwoord is, dan gaat het niet door. Denk aan een pas gebruinde huid, medicatie die niet samengaat met licht, zwangerschap of een andere contra-indicatie.",
    kost: "Je betaalt de behandeling niet. Een intake, huidbeoordeling of meting die wel is uitgevoerd, betaal je volgens het intaketarief.",
    waarom:
      "Veiligheid gaat voor de agenda. Dit hoort niet bij de kleine lettertjes, want het overkomt meer mensen dan je zou denken en het is nooit persoonlijk bedoeld.",
  },
  {
    id: "traject",
    kop: "Je koopt een traject vooruit",
    gebeurt: `Vooruitbetaalde sessies blijven ${AFSPRAKEN.trajectGeldigMaanden} maanden geldig vanaf de aankoopdatum.`,
    kost: "Niet gebruikte sessies kun je binnen die termijn inplannen of laten terugbetalen.",
    waarom:
      "De tussenpozen hebben invloed op het resultaat, dus een traject is bedoeld om volgens de planning te doorlopen. De termijn ondersteunt dat en is er niet om sessies te laten verlopen.",
  },
  {
    id: "betalen",
    kop: "Wanneer je betaalt",
    gebeurt:
      "Je betaalt direct in de kliniek. De aanbetaling die je bij het maken van de afspraak deed, wordt met het totaalbedrag verrekend.",
    kost: "Het bedrag dat vooraf op de site stond. Nooit meer dan dat.",
    waarom:
      "Alle tarieven staan openbaar, per sessie en per zone. Wat je betaalt is wat er stond, en aan de balie komt er niets bij.",
  },
  {
    id: "niet-tevreden",
    kop: "Je bent niet tevreden",
    gebeurt:
      "Laat het weten, het liefst zo snel mogelijk. We kijken samen wat er is gebeurd en wat een passende vervolgstap is.",
    kost: "Niets om het te bespreken.",
    waarom:
      "Resultaat garanderen kan niemand eerlijk. Wat we wel doen is onze uitleg, onze afspraken en onze verantwoordelijkheid serieus nemen. Klopt er iets niet aan wat je vooraf is verteld, dan is dat onze fout en handelen we het ook zo af.",
  },
];

/**
 * De drie dingen die op deze site altijd gelden.
 *
 * Dit zijn geen voorwaarden in juridische zin maar toezeggingen die de rest van de site al
 * afdwingt. Ze staan hier zodat ze ook meetellen als iemand de voorwaarden erbij pakt.
 */
export const VAST: readonly { kop: string; zin: string }[] = [
  {
    kop: "De prijs op de site is de prijs",
    zin: "Alle tarieven staan openbaar, per sessie en per variant. Er bestaan geen kortingen, actiecodes of tijdelijke aanbiedingen, dus er is ook nooit een moment waarop je te vroeg of te laat was.",
  },
  {
    kop: "Geen resultaat wordt gegarandeerd",
    zin: "Hoe je huid reageert verschilt per persoon. Wat we wel doen is vooraf meten, zodat er achteraf iets te vergelijken valt in plaats van iets te vinden.",
  },
  {
    kop: "Nee zeggen mag, van beide kanten",
    zin: "Past een behandeling niet bij je huid of bij het moment, dan gaat hij niet door. Dat kan ook op de dag zelf blijken, en dan kost hij je niets.",
  },
];
