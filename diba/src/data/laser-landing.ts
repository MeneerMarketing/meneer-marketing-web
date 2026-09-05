/**
 * De vragen en de USP-regels op de laserlandingspagina.
 *
 * DIT BESTAND IS DRIE SWEEPS ONTGLIPT, EN DAT IS LEERZAAM.
 *
 * Er stond de u-vorm in ("Hoeveel sessies heeft u nodig", "rekent u op") terwijl die
 * elders al overal was vervangen. Er stonden vlaggen in de antwoorden die gewoon werden
 * meegerenderd, want de pagina haalt deze teksten niet door `publicCopy`. En er stond een
 * zin die de tarieven "zodra Okan ze heeft ingevuld" beloofde: een interne naam en een
 * interne planning, op een pagina voor bezoekers.
 *
 * Waarom het hier misging en elders niet: dit is een los databestand zonder eigen pagina,
 * dus het viel buiten elke zoekopdracht die op componenten of routes was gericht. De
 * vlaggen zijn nu commentaar, waar ze horen.
 *
 * [MEDISCHE-CHECK-ROJDA]: de drie antwoorden hieronder over sessies, huidtypes en wanneer
 * je verschil ziet. Dat zijn de enige inhoudelijke uitspraken op deze pagina.
 */

export const LASER_LANDING_FAQ = [
  {
    id: "laser-faq-1",
    question: "Hoeveel sessies heb je nodig?",
    answer:
      "Dat hangt af van de zone, je haartype en je hormoonbalans. Reken op een reeks met weken ertussen, want één sessie raakt alleen de haren die op dat moment groeien. Tijdens de intake hoor je wat er bij jou realistisch is.",
  },
  {
    id: "laser-faq-2",
    question: "Is laser veilig voor een donkere huid?",
    answer:
      "De GentleMax Pro werkt op Fitzpatrick I tot en met VI. Je huidtype bepaalt niet óf het kan, maar met welke energie en koeling er gewerkt wordt. Dat wordt per type afgestemd.",
  },
  {
    id: "laser-faq-3",
    question: "Wanneer zie je verschil?",
    answer:
      "Na de eerste sessies merken de meeste mensen dat het grovere haar minder wordt. Volledige reductie vraagt de hele reeks; tussentijds stoppen levert het resultaat van een halve reeks op en niet de helft van het resultaat.",
  },
  {
    id: "laser-faq-4",
    question: "Wat kost laserontharing?",
    answer:
      "Dat hangt af van de zones die je kiest en van welke tarievenlijst er geldt: voor dezelfde zone verschilt het bedrag tussen dames en heren. In de configurator wijs je je zones aan en zie je de opbouw meteen staan, met alle bedragen erbij.",
  },
] as const;

export const LASER_USP_ROWS = [
  {
    title: "GentleMax Pro",
    body: "Een laser die mikt op het pigment in de haarwortel, met koeling zodat de bovenlaag niet meewarmt.",
  },
  {
    title: "Prijs vooraf",
    body: "De configurator toont je opbouw voordat je boekt. Wat je hoort aan de balie staat er nu al.",
  },
  {
    title: "Huidtype I tot VI",
    body: "De instellingen worden afgestemd op je Fitzpatrick-type en op de zone.",
  },
] as const;
