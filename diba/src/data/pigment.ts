/**
 * Inhoud van de pigmentpagina.
 *
 * Wat deze pagina eigen maakt is de omkering: bij pigment is het belangrijkste advies
 * vaak "nu niet". UV bepaalt bijna alles, en in Nederland is juni starten weggegooid
 * geld omdat je vier maanden lang tegen de zon aan behandelt. Bijna elke kliniek
 * verkoopt in de zomer het hardst; wij zeggen op de pagina zelf dat je beter wacht.
 * Dat is A7 in de praktijk (bij omzetdruk is het antwoord bewijs en wachtlijst, nooit
 * korting) en het is de reden dat "Het zonjaar" hier de uitblinker is.
 *
 * Tweede eigen keuze: het onderscheid zonschade versus melasma staat vooraan in plaats
 * van in de FAQ. Ze lijken op elkaar en vragen het tegenovergestelde. En bij melasma
 * staat het woord dat de merkregels expliciet voorschrijven: beheersing is realistischer
 * dan verdwijning (§10).
 *
 * COPY-STATUS: concept in de Diba-stem. Medische beweringen gemarkeerd voor Rojda.
 */

/* ── Het zonjaar ────────────────────────────────────────────────────────────
   UV-index per maand voor Nederland. Dit zijn publieke, gemiddelde waarden en
   geen Diba-cijfers.

   NAGEZOCHT EN NIET ROND GEKREGEN. Het RIVM en het KNMI publiceren wel uitleg
   over zonkracht maar geen maandtabel; die twaalf getallen zijn dus nergens
   één-op-een te controleren. Wat de bronnen wél zeggen: zonkracht is het laagst
   van november tot en met februari, piekt in mei, juni en juli, en op heldere
   zomerdagen wordt in Nederland regelmatig 7 tot 8 gehaald.

   Dat laatste is belangrijker dan het lijkt. De reeks hieronder loopt tot 5,4 in
   juni, en dat is een maandgemiddelde en geen dagpiek. Wie 5,4 leest als "zo hoog
   wordt het hier" onderschat een heldere junidag met de helft, en op een pagina
   over pigment is dat precies de verkeerde kant om je te vergissen. Daarom staat
   ZONJAAR_KANTTEKENING hieronder op het scherm, en niet alleen in dit commentaar.

   [GEGEVEN-NODIG: maandwaarden UV-index Nederland uit een noembare bron. Tot die
   er is, blijft de kanttekening op de pagina staan.] */

/**
 * Wat er bij de grafiek hoort te staan zolang de maandwaarden onbevestigd zijn.
 *
 * Niet in de kleine letters: een bezoeker die hierop zijn zonbescherming afstemt,
 * moet weten dat een gemiddelde iets anders is dan een dag.
 */
export const ZONJAAR_KANTTEKENING =
  "Dit zijn maandgemiddelden en geen dagwaarden. Op een heldere zomerdag ligt de zonkracht in Nederland flink hoger dan wat je hier ziet, en dat is het moment waarop pigment ontstaat.";

export type Maand = {
  readonly naam: string;
  readonly kort: string;
  /** Gemiddelde maximale UV-index in Nederland. */
  readonly uv: number;
  /** Wat er in deze maand met pigment gebeurt. */
  readonly watGebeurt: string;
  /** Ons advies over starten in deze maand. */
  readonly startAdvies: string;
  /** Groen = goed startmoment, oker = kan, rood = liever niet. */
  readonly start: "goed" | "kan" | "liever-niet";
};

export const ZONJAAR: readonly Maand[] = [
  {
    naam: "Januari",
    kort: "jan",
    uv: 0.6,
    watGebeurt:
      "Nauwelijks UV. Pigment dat in de zomer opkwam is nu op zijn lichtst.",
    startAdvies:
      "Uitstekend moment. Je hebt vier maanden voordat de zon weer meedoet, en dat is precies wat een pigmenttraject nodig heeft.",
    start: "goed",
  },
  {
    naam: "Februari",
    kort: "feb",
    uv: 1.1,
    watGebeurt: "Nog steeds laag. De huid is rustig en reageert voorspelbaar.",
    startAdvies: "Goed moment. Vanaf nu wordt de resterende tijd wel korter.",
    start: "goed",
  },
  {
    naam: "Maart",
    kort: "mrt",
    uv: 2.1,
    watGebeurt:
      "De UV klimt sneller dan mensen denken. Op een heldere dag telt maart al mee.",
    startAdvies:
      "Kan nog, maar dan wel met zonbescherming vanaf dag één. Anders werken we tegen de zon in.",
    start: "kan",
  },
  {
    naam: "April",
    kort: "apr",
    uv: 3.4,
    watGebeurt:
      "Eerste terugkeer van vlekken die in de winter waren weggetrokken. [MEDISCHE-CHECK-ROJDA]",
    startAdvies:
      "Twijfelachtig. We starten liever met alleen bescherming en meten, en behandelen in het najaar.",
    start: "kan",
  },
  {
    naam: "Mei",
    kort: "mei",
    uv: 4.6,
    watGebeurt:
      "Hoge UV. Pigmentcellen zijn actief en reageren op elke prikkel.",
    startAdvies:
      "Liever niet. Behandelen nu geeft een grote kans dat het pigment terugkomt of donkerder wordt.",
    start: "liever-niet",
  },
  {
    naam: "Juni",
    kort: "jun",
    uv: 5.4,
    watGebeurt:
      "De piek van het jaar. Dit is het moment waarop pigment het snelst verergert.",
    startAdvies:
      "Nee. Dit is het slechtste moment van het jaar. Wij zeggen dit ook als je nú wilt beginnen.",
    start: "liever-niet",
  },
  {
    naam: "Juli",
    kort: "jul",
    uv: 5.3,
    watGebeurt:
      "Nog steeds piek. Vakantie en zon maken het beeld onvoorspelbaar.",
    startAdvies:
      "Nee. Kom terug in september, dan hebben we een eerlijke start.",
    start: "liever-niet",
  },
  {
    naam: "Augustus",
    kort: "aug",
    uv: 4.6,
    watGebeurt: "Iets omlaag, maar de zomerschade is nu opgebouwd.",
    startAdvies:
      "Nog niet. Wel een goed moment voor de nulmeting, zodat we in september kunnen starten.",
    start: "liever-niet",
  },
  {
    naam: "September",
    kort: "sep",
    uv: 3.2,
    watGebeurt:
      "De UV zakt. Dit is de maand waarin het pigment zijn donkerste stand laat zien.",
    startAdvies:
      "Vanaf nu wordt het interessant. Meten in september geeft het eerlijkste vertrekpunt van het jaar.",
    start: "kan",
  },
  {
    naam: "Oktober",
    kort: "okt",
    uv: 1.8,
    watGebeurt:
      "Laag genoeg om te behandelen zonder dat de zon het werk ongedaan maakt.",
    startAdvies:
      "Het beste startmoment. Je hebt vijf maanden met lage UV vóór je, en dat is precies genoeg.",
    start: "goed",
  },
  {
    naam: "November",
    kort: "nov",
    uv: 0.8,
    watGebeurt:
      "Minimale UV. De huid herstelt en het pigment trekt langzaam weg.",
    startAdvies: "Uitstekend moment. Rustig opbouwen kan nu zonder haast.",
    start: "goed",
  },
  {
    naam: "December",
    kort: "dec",
    uv: 0.5,
    watGebeurt: "Laagste UV van het jaar.",
    startAdvies:
      "Goed moment, met één opmerking: ga je op wintersport of naar de zon, zeg dat dan. Op de piste is de UV hoger dan in juni.",
    start: "goed",
  },
] as const;

/* ── Zonschade of melasma ──────────────────────────────────────────────── */

export type PigmentSoort = {
  readonly id: string;
  readonly naam: string;
  readonly klanttaal: string;
  readonly vakterm: string;
  readonly patroon: string;
  readonly oorzaak: string;
  readonly realistisch: string;
  readonly aanpak: string;
};

export const PIGMENT_SOORTEN: readonly PigmentSoort[] = [
  {
    id: "zonschade",
    naam: "Losse, scherp begrensde vlekken",
    klanttaal:
      "Bruine vlekjes met een duidelijke rand, vooral waar de zon komt",
    vakterm: "lentigines, zonschade",
    patroon:
      "Op de uitstekende delen: jukbeen, neusbrug, voorhoofd, handrug en decolleté. Niet symmetrisch, elke vlek heeft zijn eigen vorm.",
    oorzaak:
      "Opgetelde UV-belasting over jaren. Elke vlek is een plek waar pigmentcellen zijn ontregeld. [MEDISCHE-CHECK-ROJDA]",
    realistisch:
      "Hier valt vaak het meeste te winnen. Dit type reageert doorgaans goed en komt minder snel terug dan melasma, zolang je de zon buiten houdt.",
    aanpak:
      "Meten, gericht behandelen, en daarna bescherming als onderhoud. Zonder dat laatste zijn we volgend jaar weer terug bij af.",
  },
  {
    id: "melasma",
    naam: "Symmetrische, vage velden",
    klanttaal: "Grotere wolkachtige vlakken, vaak aan beide kanten hetzelfde",
    vakterm: "melasma",
    patroon:
      "Symmetrisch over wangen, boven de lip en op het voorhoofd. Geen scherpe rand maar een overgang, alsof het uitloopt.",
    oorzaak:
      "Hormonen plus UV plus warmte. Zwangerschap en de pil zijn bekende factoren, en zelfs warmte alleen kan het aanwakkeren. [MEDISCHE-CHECK-ROJDA]",
    realistisch:
      "Bij melasma is beheersing realistischer dan verdwijning. Dat is geen tweede keus, dat is de eerlijke uitkomst. Iets anders beloven zou makkelijker verkopen en niet uitkomen.",
    aanpak:
      "Rustig, met veel bescherming, en met de verwachting dat het in de zomer terugkomt. We meten per seizoen in plaats van per sessie.",
  },
  {
    id: "postinflammatoir",
    naam: "Donkere plek ná een puistje of wondje",
    klanttaal: "De vlek die achterblijft nadat iets genezen is",
    vakterm: "postinflammatoire hyperpigmentatie",
    patroon:
      "Precies op de plek waar iets zat. Vaak roodbruin in het begin, daarna bruiner. Geen kuiltje in de huid.",
    oorzaak:
      "Je huid heeft pigment gemaakt tijdens het genezen. Dit is geen litteken, ook al voelt het zo. [MEDISCHE-CHECK-ROJDA]",
    realistisch:
      "Deze trekken vaak van zichzelf weg, in maanden. Zonbescherming versnelt dat meer dan welke behandeling ook.",
    aanpak:
      "Meestal: niets doen en beschermen. We zeggen liever dat je moet wachten dan dat we je een traject verkopen dat de natuur gratis doet.",
  },
] as const;

export const PIGMENT_WEL_NIET = {
  wel: [
    "Elke dag zonbescherming, ook op een grijze dag. Dit is bij pigment de behandeling, niet de bijzaak",
    "Starten in het najaar, zodat je maanden met lage UV vóór je hebt",
    "Meten per seizoen, want pigment beweegt met het jaar mee",
    "Onderscheid maken tussen zonschade en melasma vóór de eerste behandeling",
    "Een pet of hoed. Onelegant, maar hij doet meer dan de meeste crèmes",
  ],
  niet: [
    "Beginnen in mei of juni. Je behandelt dan vier maanden tegen de zon in en dat kost je het resultaat",
    "Agressief aanpakken bij melasma. Dat wakkert het juist aan in plaats van het weg te halen",
    "Bleekcrèmes van internet. Er zit regelmatig hydrochinon of kwik in, buiten elke controle om",
    "De zonnebank, ook niet om het te camoufleren. Je maakt het pigment donkerder, niet lichter",
    "Elke dag in de spiegel vergelijken. Pigment verandert in maanden, niet in dagen",
  ],
} as const;

export const PIGMENT_WIJ_DOEN_NIET = [
  {
    titel: "Geen pigmentbehandeling in de zomer",
    tekst:
      "Tussen mei en augustus behandelen we pigment niet, hoe graag je ook wilt. Het resultaat is dan niet te houden. We meten wel, zodat we in september klaarstaan. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    titel: "Geen belofte dat melasma weggaat",
    tekst:
      "Bij melasma is beheersing het doel. Wij noemen dat geen mislukking maar de eerlijke uitkomst, en je hoort het vóór je iets betaalt.",
  },
  {
    titel: "Geen behandeling zonder onderscheid",
    tekst:
      "Zonschade en melasma lijken op elkaar en vragen het tegenovergestelde. Weten we het niet zeker, dan behandelen we nog niet.",
  },
] as const;

export const PIGMENT_FAQ = [
  {
    vraag: "Gaan mijn pigmentvlekken helemaal weg?",
    antwoord:
      "Bij zonschade vaak grotendeels. Bij melasma is beheersing realistischer dan verdwijning, en dat zeggen we liever nu dan na vijf sessies. Welke van de twee je hebt, bepaalt dus het antwoord. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Waarom mag ik in de zomer niet starten?",
    antwoord:
      "Omdat je dan vier maanden tegen de zon in werkt. Pigmentcellen die net zijn aangepakt reageren extra fel op UV. Je betaalt dan voor een resultaat dat je in september kwijt bent.",
  },
  {
    vraag: "Helpt zonnebrand echt zo veel?",
    antwoord:
      "Bij pigment is het het belangrijkste dat je doet, meer dan welke behandeling ook. Dat is geen verkooppraatje, want we verdienen er niets aan. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Ik heb een donkere huid. Kan ik behandeld worden?",
    antwoord:
      "Ja, en het vraagt een andere aanpak. Bij huidtype IV tot VI is de kans op nieuwe pigmentvlekken door de behandeling zelf groter, dus gaan we voorzichtiger en trager. Dat bespreken we vooraf. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Mijn vlek ziet er anders uit dan de rest. Moet ik me zorgen maken?",
    antwoord:
      "Een vlek die verandert van vorm of kleur, of die bloedt, hoort bij de huisarts en niet bij ons. Dat is geen paniekverhaal maar de juiste route. We kijken er wel naar en verwijzen door als dat nodig is. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Kan ik iets doen aan de vlekken op mijn handen?",
    antwoord:
      "Ja, en handen zijn eerlijk gezegd het vervelendste gebied: ze krijgen de meeste zon en je vergeet ze het vaakst. Behandelen kan, volhouden met bescherming is het echte werk.",
  },
] as const;
