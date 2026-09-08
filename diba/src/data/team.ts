/**
 * Het team van Diba Clinics.
 *
 * ⚠ HERKOMST: namen en functies komen van dibaclinics.nl/onze-professionals (augustus
 * 2026). Ze zijn letterlijk overgenomen en niet aangevuld. ⚠
 *
 * Hier stonden vier placeholders met "[COPY-NODIG]" als naam. Die gingen zo de
 * schema.org-blokken in, dus er werden vier verzonnen zorgverleners naar zoekmachines
 * gestuurd. De echte lijst telt er acht.
 *
 * WAT ER BEWUST NIET IN STAAT.
 *
 * BIO'S: GESCHREVEN, EN MET EEN GRENS.
 *
 * Ze stonden er niet, omdat je een biografie van een echt mens niet verzint. Op verzoek
 * van Yasin staan ze er nu wel, en dan is de vraag welke grens er blijft gelden.
 *
 * Die grens: deze teksten gaan over de rol en over hoe iemand in een afspraak werkt. Ze
 * noemen geen opleiding, geen registratienummer, geen jaren ervaring en geen persoonlijke
 * geschiedenis. Dat is geen preutsheid. Dat zijn controleerbare feiten over echte mensen
 * waar een bezoeker een behandelkeuze op baseert, en een verzonnen diploma is geen
 * placeholder meer maar een bewering die iemand kan schaden.
 *
 * Wat er wel staat is wat de kliniek zelf over de rol kan zeggen. Elke tekst moet alsnog
 * langs de betrokkene voordat de site live gaat: het staat er in de derde persoon, maar
 * het gaat over hen.
 * [COPY-NODIG: akkoord per persoon op zijn of haar eigen tekst]
 *
 * Portretten staan er sinds de eigen shoot: acht staande opnamen, geen stockfoto's. Rojda
 * heeft de koppeling op 8 september 2026 nagelopen: de man is Andres, Iris krijgt voorlopig
 * geen foto, en drie namen zijn vervangen omdat die mensen er niet meer werken (Melanie,
 * Bahar, Rialda). Portret 4, de vrouw met de tablet, hoort daardoor bij niemand meer en
 * staat nergens op de site. [GEGEVEN-NODIG: wie is dat, en wie is de vijfde huidtherapeut?]
 */

export type Vakgebied =
  "huidtherapie" | "orthomoleculair" | "schoonheid" | "praktijk";

export type Teamlid = {
  readonly slug: string;
  readonly naam: string;
  readonly functie: string;
  readonly vak: Vakgebied;
  /** Alleen invullen als de persoon het zelf heeft aangeleverd. */
  readonly bio?: string;
  /**
   * Portret uit de eigen shoot, staand.
   *
   * De opnamen dragen alleen een cameranummer; wie erop staat is uit het bestand niet af
   * te leiden. Rojda heeft de reeks op 8 september 2026 nagelopen en de man aangewezen als
   * Andres. Voor de vrouwen geldt nog steeds: het portret staat bij de naam die op die
   * plek in de lijst hoort, en of dat gezicht die naam is, moet iemand bevestigen die het
   * team kent. [GEGEVEN-NODIG: portret per naam bevestigen, Okan]
   *
   * Iemands gezicht bij de verkeerde naam is niet zomaar een schoonheidsfoutje: het is een
   * van de weinige dingen op deze site die een bezoeker die hier komt zelf kan zien
   * kloppen of niet.
   */
  readonly portret?: string;
};

export const TEAM: readonly Teamlid[] = [
  {
    slug: "rojda-sahin",
    portret: "/images/shoot/team-portret-1.jpg",
    naam: "Rojda Sahin",
    functie: "Founder Diba Clinics B.V. en orthomoleculair huidspecialist",
    vak: "orthomoleculair",
    bio: "Als founder bepaalt Rojda wat er in deze kliniek wel en niet gebeurt, en dat tweede is hier het langste lijstje. Zij is degene die de meting uitlegt en die zegt wanneer behandelen geen zin heeft. Kom je met een vraag waar geen behandeling bij hoort, dan hoor je dat van haar.",
  },
  {
    slug: "okan",
    portret: "/images/shoot/team-portret-2.jpg",
    naam: "Okan",
    functie: "Praktijkmanager",
    vak: "praktijk",
    bio: "Okan houdt de praktijk draaiend: de agenda, de afspraken en alles wat er misgaat voordat je het merkt. Bel je over een afspraak verzetten, een factuur of iets wat niet klopt, dan kom je bij hem uit.",
  },
  {
    slug: "demi",
    portret: "/images/shoot/team-portret-3.jpg",
    naam: "Demi",
    functie: "Orthomoleculair huidspecialist",
    vak: "orthomoleculair",
    bio: "Demi werkt als orthomoleculair huidspecialist en kijkt daarbij naar wat er van binnenuit meespeelt. Bij haar begint een afspraak vaker met vragen dan met een apparaat, en dat is geen omweg: bij een deel van de huidklachten zit de aanjager niet in de huid.",
  },
  {
    /* Rojda, 8 september 2026: "Andres is die man, die moet links." Het staande portret
       van de enige man in de reeks is dus van hem, en hij staat als eerste in zijn groep. */
    slug: "andres",
    portret: "/images/shoot/team-portret-6.jpg",
    naam: "Andres",
    functie: "Huidtherapeut",
    vak: "huidtherapie",
    bio: "Andres is huidtherapeut en werkt met de apparatuur waarbij de instelling het verschil maakt. Hij legt uit wat een apparaat doet en waar het ophoudt, en zegt het ook als een behandeling bij jouw huid minder oplevert.",
  },
  {
    /* Rojda, 8 september 2026: Melanie werkt er niet meer; op deze plek hoort Anouk. Het
       portret dat bij deze kaart stond blijft staan, want de shoot is van na Melanies
       vertrek. [GEGEVEN-NODIG: is dit inderdaad Anouk op de foto? Okan] */
    slug: "anouk",
    portret: "/images/shoot/team-portret-5.jpg",
    naam: "Anouk",
    functie: "Huidtherapeut",
    vak: "huidtherapie",
    bio: "Anouk is huidtherapeut. Zij doet veel van de trajecten die over maanden lopen, en dat betekent dat je haar vaker ziet dan één keer. Bij elke controle wordt er gemeten in plaats van geschat, zodat je zelf kunt zien of het schema klopt.",
  },
  {
    /* Rojda, 8 september 2026: bij Iris voorlopig geen foto. De kaart blijft; het portret
       dat hier stond was van Andres. */
    slug: "iris",
    naam: "Iris",
    functie: "Huidtherapeut",
    vak: "huidtherapie",
    bio: "Iris is huidtherapeut en werkt veel met mensen die eerst ergens anders geweest zijn. Zij begint dan bij wat er al geprobeerd is, want dat scheelt maanden opnieuw uitproberen. Ook als dat betekent dat een eerder advies overeind blijft.",
  },
  {
    /* Rojda, 8 september 2026: Bahar werkt er niet meer; hier hoort Cheyenne.
       [GEGEVEN-NODIG: is dit Cheyenne op de foto? Okan] */
    slug: "cheyenne",
    portret: "/images/shoot/team-portret-7.jpg",
    naam: "Cheyenne",
    functie: "Huidtherapeut",
    vak: "huidtherapie",
    bio: "Cheyenne is huidtherapeut. Zij neemt de tijd voor de uitleg vooraf, ook als die uitleg langer duurt dan de behandeling zelf. Weet je na afloop niet waarom er iets gedaan is, dan is er iets misgegaan; dat is haar maatstaf.",
  },
  {
    /* Rojda, 8 september 2026: Rialda werkt er niet meer; hier hoort Elaf, "huidspecialist".
       Dat is bewust niet "huidtherapeut": die titel is beschermd en Rojda gebruikte hem
       niet. Elaf staat daarom bij het vak schoonheidsspecialist, het enige behandelende
       vak in de samenstelling dat nog geen kaart had. [GEGEVEN-NODIG: klopt dat, en is dit
       Elaf op de foto? Okan] */
    slug: "elaf",
    portret: "/images/shoot/team-portret-8.jpg",
    naam: "Elaf",
    functie: "Huidspecialist",
    vak: "schoonheid",
    bio: "Elaf is huidspecialist en doet de verzorgende behandelingen: de reiniging, HydraFacial, OxyGeneo en de peelings die aan de oppervlakte blijven. Zij is vaak de eerste die je huid onder handen heeft, en als zij iets ziet wat bij een huidtherapeut hoort, hoor je dat voordat ze verdergaat.",
  },
];

/**
 * De twee vakken die je in deze kliniek tegenkomt, en het verschil ertussen.
 *
 * WAAROM DIT OP DE TEAMPAGINA STAAT EN NIET IN DE KLEINE LETTERTJES.
 *
 * "Huidtherapeut" is een wettelijk beschermde opleidingstitel: artikel 34 van de Wet BIG
 * bepaalt dat je je alleen zo mag noemen met de hbo-bachelor huidtherapie. Die opleiding
 * bestaat op twee plekken in Nederland, de Haagse Hogeschool en Hogeschool Utrecht.
 *
 * "Orthomoleculair huidspecialist" is dat niet. Die titel staat niet in de Wet BIG en is
 * dus niet beschermd.
 *
 * Dat verschil zeggen we hier, omdat een klant het hoort te weten en het nergens anders
 * te vinden is. Het is geen oordeel over wat iemand kan; het is een feit over titels.
 *
 * [BESLUIT-OKAN] Of dit onderscheid zo op de site blijft staan is jullie keuze en niet de
 * mijne. Ik vind het de sterkste zin op de pagina, want een kliniek die zelf vertelt welke
 * van haar titels beschermd is en welke niet, is een kliniek die je op haar woord kunt
 * geloven. Maar het gaat over jullie eigen mensen, dus jullie beslissen.
 *
 * Bronnen: bigregister.nl (artikel 34-beroepen), huidtherapie.nl (de beroepsvereniging),
 * kwaliteitsregisterparamedici.nl (het register en de eisen).
 */
export const VAKGEBIEDEN: readonly {
  readonly id: Vakgebied;
  readonly label: string;
  readonly beschermd: boolean;
  /**
   * Of dit een behandelend vak is.
   *
   * De praktijkmanager stond hier naast de huidtherapeut en de orthomoleculair
   * huidspecialist, en deze lijst wordt op drie plekken als beroepenlijst gebruikt: het
   * titelblok op /team, de rollen op /werken-bij en de registraties op /verwijzers. Een
   * organiserende functie hoort daar niet tussen; op /werken-bij staat het zelfs als iets
   * waar je op kunt solliciteren.
   *
   * Okan blijft wel gewoon in het team: `perVak` op /team loopt over alle vakgebieden.
   */
  readonly behandelend: boolean;
  readonly wat: string;
  readonly opleiding: string;
}[] = [
  {
    id: "huidtherapie",
    label: "Huidtherapeut",
    beschermd: true,
    behandelend: true,
    wat: "Werkt met de apparatuur en de behandelingen: laser, licht, needling, peelings. Beoordeelt wat je huid aankan en stelt de instellingen daarop af.",
    opleiding:
      "Hbo-bachelor huidtherapie, aan de Haagse Hogeschool of Hogeschool Utrecht. De titel is beschermd in artikel 34 van de Wet BIG, en onze huidtherapeuten staan ingeschreven in het Kwaliteitsregister Paramedici.",
  },
  {
    id: "orthomoleculair",
    label: "Orthomoleculair huidspecialist",
    beschermd: false,
    behandelend: true,
    wat: "Kijkt naar wat er van binnenuit meespeelt: voeding, hormonen, vertering. Bij acne en pigment is dat vaak de helft van het verhaal.",
    /* Rojda, 7 september 2026, letterlijk. */
    opleiding:
      "Een aanvullende opleiding naast de huidtherapie of schoonheidsspecialiste, gericht op voeding, hormonen en vertering. De titel staat niet in de Wet BIG, dus vraag altijd naar de opleiding erachter.",
  },
  {
    /* Rojda, 7 september 2026: het team heeft ook een allround schoonheidsspecialist.
       Die stond nergens, ook niet als vakgebied. Sinds 8 september staat Elaf hier, met de
       functie die Rojda noemde: huidspecialist. */
    id: "schoonheid",
    label: "Allround schoonheidsspecialist",
    beschermd: false,
    behandelend: true,
    wat: "Doet de verzorgende behandelingen: reinigen, peelings op oppervlakkig niveau, HydraFacial en OxyGeneo, en de verzorging eromheen.",
    opleiding:
      "Mbo-opleiding schoonheidsspecialist, allround. Geen beschermde titel; onze schoonheidsspecialisten zijn aangesloten bij ANBOS en staan in het SKIN Register.",
  },
  {
    id: "praktijk",
    label: "Praktijkmanager",
    beschermd: false,
    behandelend: false,
    wat: "Regelt de agenda, de afspraken en de gang van zaken in de kliniek.",
    opleiding:
      "Een organiserende functie. Het behandelen doen de therapeuten; hier kom je terecht voor je afspraak of je factuur.",
  },
];

/**
 * Het Kwaliteitsregister Paramedici, en waarom er niet staat wie erin staat.
 *
 * Het register is vrijwillig. Wie erin staat moet elke vijf jaar opnieuw registreren en
 * daarvoor minstens 1600 werkuren over minimaal 36 maanden aantonen, plus 160 punten
 * bijscholing. Dat is een echte drempel en dus het vermelden waard.
 *
 * Wat we níet doen is namen koppelen aan een registratie die we niet hebben gecontroleerd.
 * [GEGEVEN-NODIG: wie van het team staat er in het KP, met registratienummer]
 */
/**
 * Waar Diba bij aangesloten is.
 *
 * WAAROM DIT ER PAS NU STAAT.
 *
 * Rojda las de site op 3 september 2026 en schreef: "Ik zie juist al onze sterke punten
 * niet terug." Ze noemde er drie, en geen van drieën stond ergens op de site: Diba is
 * gecontracteerd bij alle zorgverzekeraars, de therapeuten staan in het Kwaliteitsregister
 * Paramedici, en de kliniek is aangesloten bij ANBOS.
 *
 * Dat zijn geen keurmerkplaatjes maar het antwoord op de vraag die iemand op de
 * vergoedingenpagina stelt: mag ik hierheen met mijn polis. Die pagina begon met uitleggen
 * wat er niet vergoed wordt terwijl dit het echte nieuws is.
 *
 * Rojda, 6 september 2026, over "skin": de huidtherapeuten zijn lid van de NVH en staan in
 * het Kwaliteitsregister Paramedici (voor NVH-leden is die registratie verplicht); de
 * schoonheidsspecialisten zijn aangesloten bij ANBOS en staan in het SKIN Register, het
 * kwaliteitsregister dat individuele schoonheidsspecialisten registreert.
 */
export const ERKENNINGEN = [
  {
    naam: "Gecontracteerd bij alle zorgverzekeraars",
    zin: "Je hoeft niet uit te zoeken of wij bij jouw verzekeraar aangesloten zijn. Dat zijn we, bij allemaal.",
  },
  {
    naam: "Kwaliteitsregister Paramedici",
    zin: "Onze huidtherapeuten staan ingeschreven. Veel aanvullende pakketten stellen dat als eis voor vergoeding.",
  },
  {
    naam: "Nederlandse Vereniging van Huidtherapeuten",
    zin: "Onze huidtherapeuten zijn lid van de beroepsvereniging. Voor leden is de registratie in het Kwaliteitsregister Paramedici verplicht.",
  },
  {
    naam: "Aangesloten bij ANBOS",
    zin: "De branchevereniging voor schoonheidsspecialisten, met eisen aan opleiding, hygiëne en klachtafhandeling.",
  },
  {
    naam: "SKIN Register",
    zin: "Het kwaliteitsregister voor schoonheidsspecialisten. Onze schoonheidsspecialisten staan er op eigen naam in.",
  },
] as const;

/**
 * Waar het team uit bestaat, in aantallen. Rojda, 7 september 2026:
 * 5 huidtherapeuten, 2 orthomoleculair huidspecialisten, 1 allround
 * schoonheidsspecialist, 1 praktijkmanager. Negen mensen.
 *
 * Los van TEAM, want daar staan acht namen: vier huidtherapeuten in plaats van vijf.
 * Rojda gaf op 8 september de namen Anouk, Cheyenne en Elaf door als vervangers, en met
 * Andres en Iris zijn dat vier huidtherapeuten en één huidspecialist. De vijfde
 * huidtherapeut heeft nog geen naam. Tot die er is, tellen de cijfers hier wat Rojda
 * zegt en toont de lijst wie we kennen. [GEGEVEN-NODIG: naam vijfde huidtherapeut]
 */
export const TEAM_SAMENSTELLING: readonly {
  readonly vak: Vakgebied;
  readonly aantal: number;
}[] = [
  { vak: "huidtherapie", aantal: 5 },
  { vak: "orthomoleculair", aantal: 2 },
  { vak: "schoonheid", aantal: 1 },
  { vak: "praktijk", aantal: 1 },
];

export const TEAM_AANTAL = TEAM_SAMENSTELLING.reduce((n, s) => n + s.aantal, 0);

export const KWALITEITSREGISTER = {
  naam: "Kwaliteitsregister Paramedici",
  url: "https://www.kwaliteitsregisterparamedici.nl/beroep/huidtherapeut",
  eisen:
    "Vrijwillig register met een cyclus van vijf jaar. Wie erin blijft staan toont per periode minstens 1600 werkuren aan, verspreid over minimaal 36 maanden, en 160 punten bijscholing.",
} as const;
