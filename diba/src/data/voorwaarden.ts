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
 * De getallen. Voorstel, geen vaststelling.
 *
 * 24 uur is de gangbare annuleringstermijn in de branche en sluit aan bij hoe ver vooruit
 * de agenda gepland wordt. Het no-showbedrag is bewust niet het volledige tarief: het doel
 * is dat een plek niet leeg blijft, niet dat er verdiend wordt aan iemand die niet kwam.
 */
export const AFSPRAKEN = {
  /** Kosteloos afzeggen kan tot zoveel uur voor de afspraak. */
  annulerenUren: 24,
  /** Deel van het tarief dat bij niet verschijnen in rekening wordt gebracht. */
  noShowDeel: 0.5,
  /** Na zoveel minuten te laat past de behandeling niet meer in het tijdvak. */
  telaatMinuten: 15,
  /** Betaaltermijn van een factuur, in dagen. */
  betaaltermijnDagen: 14,
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
const euroDeel = (deel: number) => `${Math.round(deel * 100)} procent`;

export const SITUATIES: readonly Situatie[] = [
  {
    id: "afzeggen-op-tijd",
    kop: "Je zegt op tijd af",
    gebeurt: `Tot ${uur(AFSPRAKEN.annulerenUren)} voor je afspraak kun je verzetten of afzeggen, telefonisch of per bericht. Je hoeft geen reden te geven.`,
    kost: "Niets.",
    waarom: `Binnen ${uur(AFSPRAKEN.annulerenUren)} lukt het meestal nog om de plek aan iemand anders te geven. Daarbuiten niet, en dat is het enige verschil tussen deze regel en de volgende.`,
  },
  {
    id: "afzeggen-te-laat",
    kop: "Je zegt te laat af of komt niet",
    gebeurt: `Zeg je binnen ${uur(AFSPRAKEN.annulerenUren)} af, of kom je zonder bericht niet opdagen, dan brengen we een deel van het tarief in rekening.`,
    kost: `${euroDeel(AFSPRAKEN.noShowDeel)} van het tarief van de gereserveerde behandeling.`,
    waarom:
      "De tijd is dan al gereserveerd en de therapeut stond klaar. Het is met opzet geen volledig tarief: het doel is dat een plek niet leeg blijft, niet dat er verdiend wordt aan iemand die er niet was. Overkomt het je een keer door iets ernstigs, bel dan; daar wordt naar gekeken.",
  },
  {
    id: "te-laat",
    kop: "Je bent te laat",
    gebeurt: `Kom je later dan ${AFSPRAKEN.telaatMinuten} minuten, dan past de behandeling meestal niet meer in het tijdvak. Dan wordt hij ingekort of verzet.`,
    kost: "Bij inkorten betaal je het volle tarief, want de plek was gereserveerd.",
    waarom:
      "De afspraak erna schuift anders mee, en dan is iemand anders de dupe van iets waar diegene niets aan kan doen.",
  },
  {
    id: "wij-zeggen-af",
    kop: "Wij moeten afzeggen",
    gebeurt:
      "Kan een behandeling van onze kant niet doorgaan, dan hoor je dat zo snel als we het zelf weten en krijg je een nieuwe plek aangeboden.",
    kost: "Niets, en al betaalde bedragen krijg je terug of blijven staan.",
    waarom:
      "Dezelfde regel als hierboven, maar dan onze kant op. Een voorwaarde die maar één richting op werkt is geen afspraak.",
  },
  {
    id: "behandeling-kan-niet",
    kop: "De behandeling blijkt niet te kunnen",
    gebeurt:
      "Blijkt bij de intake of vlak voor de behandeling dat het op dat moment niet verantwoord is, dan gaat het niet door. Denk aan een pas gebruinde huid, medicatie die niet samengaat met licht, of zwangerschap.",
    kost: "Je betaalt de behandeling niet. Een intake of meting die wel is uitgevoerd, betaal je wel.",
    waarom:
      "Veiligheid gaat voor de agenda. Dit hoort niet bij de kleine lettertjes, want het overkomt meer mensen dan je zou denken en het is nooit persoonlijk bedoeld.",
  },
  {
    id: "traject",
    kop: "Je koopt een traject vooruit",
    gebeurt: `Sessies uit een vooruit betaald traject blijven ${AFSPRAKEN.trajectGeldigMaanden} maanden geldig vanaf de aankoop.`,
    kost: "Niet gebruikte sessies binnen die termijn kun je opnemen of laten terugbetalen.",
    waarom:
      "Een traject is bedoeld om aaneengesloten te doorlopen, want daar hangt het resultaat vanaf. De termijn is er om dat te ondersteunen en niet om sessies te laten verlopen.",
  },
  {
    id: "betalen",
    kop: "Je krijgt een factuur",
    gebeurt: `Meestal betaal je direct in de kliniek. Krijg je een factuur, dan geldt een betaaltermijn van ${AFSPRAKEN.betaaltermijnDagen} dagen.`,
    kost: "Het bedrag dat vooraf genoemd is. Nooit meer dan dat.",
    waarom:
      "Op deze site staan alle prijzen, per sessie en per zone. Wat je betaalt is wat er stond. Er komt aan de balie niets bij.",
  },
  {
    id: "niet-tevreden",
    kop: "Je bent niet tevreden",
    gebeurt:
      "Zeg het, het liefst meteen. We kijken samen wat er gebeurd is en wat er nog kan.",
    kost: "Niets om het te bespreken.",
    waarom:
      "Wat we niet doen is resultaat garanderen, want dat kan niemand eerlijk. Wat we wel doen is uitleggen wat er is gebeurd en wat de vervolgstap is. Klopt er iets niet aan wat je van tevoren is verteld, dan is dat onze fout en handelen we het ook zo af.",
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
