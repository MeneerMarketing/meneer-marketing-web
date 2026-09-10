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
  "huidtherapie" | "orthomoleculair" | "laser" | "praktijk" | "kantoor";

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
   * Tot 10 september 2026 stonden hier opnamen met alleen een cameranummer, en dus een
   * gok over wie erop stond. Yasin leverde die dag een map aan waarin de bestanden de
   * naam van de persoon dragen: die staan er nu, en alleen die. Wie er nog geen
   * aangeleverde foto heeft, krijgt geen foto; "Foto volgt" is eerlijker dan het gezicht
   * van een collega bij de verkeerde naam. Dat laatste is een van de weinige dingen op
   * deze site die een bezoeker die hier komt zelf kan zien kloppen of niet.
   */
  readonly portret?: string;
};

export const TEAM: readonly Teamlid[] = [
  /* De volledige bezetting zoals Yasin die op 10 september 2026 doorgaf. De volgorde is
     die van de kliniek: eerst wie je in de behandelkamer tegenkomt, daarna de mensen
     eromheen. Zes van de elf hebben een aangeleverd portret; de rest staat er zonder. */
  {
    slug: "rojda-sahin",
    portret: "/images/shoot/team-rojda.jpg",
    naam: "Rojda",
    functie: "Founder Diba Clinics B.V. en orthomoleculair huidspecialist",
    vak: "orthomoleculair",
    bio: "Als founder bepaalt Rojda wat er in deze kliniek wel en niet gebeurt, en dat tweede is hier het langste lijstje. Zij is degene die de meting uitlegt en die zegt wanneer behandelen geen zin heeft. Kom je met een vraag waar geen behandeling bij hoort, dan hoor je dat van haar.",
  },
  {
    slug: "andres",
    portret: "/images/shoot/team-andres.jpg",
    naam: "Andres",
    functie: "Huidtherapeut",
    vak: "huidtherapie",
    bio: "Andres is huidtherapeut en werkt met de apparatuur waarbij de instelling het verschil maakt. Hij legt uit wat een apparaat doet en waar het ophoudt, en zegt het ook als een behandeling bij jouw huid minder oplevert.",
  },
  {
    slug: "iris",
    portret: "/images/shoot/team-iris.jpg",
    naam: "Iris",
    functie: "Huidtherapeut",
    vak: "huidtherapie",
    bio: "Iris is huidtherapeut en werkt veel met mensen die eerst ergens anders geweest zijn. Zij begint dan bij wat er al geprobeerd is, want dat scheelt maanden opnieuw uitproberen. Ook als dat betekent dat een eerder advies overeind blijft.",
  },
  {
    slug: "griselle",
    portret: "/images/shoot/team-griselle.jpg",
    naam: "Griselle",
    functie: "Huidtherapeut",
    vak: "huidtherapie",
    bio: "Griselle is huidtherapeut en loopt de teksten op deze site na op wat er in de behandelkamer echt gebeurt. Meer dan een van de stukken hier is aangepast omdat zij zei dat het anders ging dan er stond.",
  },
  {
    slug: "cheyenne",
    naam: "Cheyenne",
    functie: "Huidtherapeut",
    vak: "huidtherapie",
    bio: "Cheyenne is huidtherapeut. Zij neemt de tijd voor de uitleg vooraf, ook als die uitleg langer duurt dan de behandeling zelf. Weet je na afloop niet waarom er iets gedaan is, dan is er iets misgegaan; dat is haar maatstaf.",
  },
  {
    slug: "anouk",
    naam: "Anouk",
    functie: "Huidtherapeut",
    vak: "huidtherapie",
    bio: "Anouk is huidtherapeut. Zij doet veel van de trajecten die over maanden lopen, en dat betekent dat je haar vaker ziet dan een keer. Bij elke controle wordt er gemeten in plaats van geschat, zodat je zelf kunt zien of het schema klopt.",
  },
  {
    slug: "india",
    portret: "/images/shoot/team-india.jpg",
    naam: "India",
    functie: "Huidtherapeut in opleiding en laserspecialist",
    /* Twee vakken in een functie. Ze staat onder laser, want dat is wat ze nu zelfstandig
       doet; de huidtherapie staat erbij als opleiding en niet als titel. */
    vak: "laser",
    bio: "India doet de laserbehandelingen en volgt daarnaast de opleiding tot huidtherapeut. Bij laserontharing is zij vaak degene die de zones doorloopt en per keer bijstelt wat er nodig is.",
  },
  {
    slug: "demi",
    portret: "/images/shoot/team-demi.jpg",
    naam: "Demi",
    functie: "Orthomoleculair huidspecialist",
    vak: "orthomoleculair",
    bio: "Demi werkt als orthomoleculair huidspecialist en kijkt daarbij naar wat er van binnenuit meespeelt. Bij haar begint een afspraak vaker met vragen dan met een apparaat, en dat is geen omweg: bij een deel van de huidklachten zit de aanjager niet in de huid.",
  },
  {
    slug: "elaf",
    naam: "Elaf",
    functie: "Laserspecialist",
    vak: "laser",
    bio: "Elaf doet de laserbehandelingen: ontharen, en het licht dat op kleur of vaatjes mikt. Ziet zij tijdens een afspraak iets wat bij een huidtherapeut hoort, dan hoor je dat voordat ze verdergaat.",
  },
  {
    slug: "okan",
    naam: "Okan",
    functie: "Praktijkmanager",
    vak: "praktijk",
    bio: "Okan houdt de praktijk draaiend: de agenda, de afspraken en alles wat er misgaat voordat je het merkt. Bel je over een afspraak verzetten, een factuur of iets wat niet klopt, dan kom je bij hem uit.",
  },
  {
    slug: "yasin",
    naam: "Yasin",
    functie: "IT en marketing",
    vak: "kantoor",
    bio: "Yasin bouwt en onderhoudt deze site en doet de marketing. Klopt er iets niet aan wat je hier leest, dan is dat bij hem het snelst gemeld.",
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
    /* Heette tot 10 september 2026 "allround schoonheidsspecialist", omdat Rojda dat vak
       noemde en er nog geen laserspecialisten in de lijst stonden. Yasin gaf die dag de
       functies door zoals ze nu zijn: Elaf en India doen de laserbehandelingen, en dat is
       iets anders dan de verzorgende behandelingen. */
    id: "laser",
    label: "Laserspecialist",
    beschermd: false,
    behandelend: true,
    wat: "Werkt met de laser- en lichtapparatuur: ontharen, en licht dat op kleur of vaatjes mikt. Kiest per huidtype en per zone de instelling.",
    opleiding:
      "Een vakopleiding op de apparatuur zelf, met een certificering per apparaat. Geen beschermde titel, dus vraag naar de opleiding erachter; onze laserspecialisten werken onder dezelfde protocollen als de huidtherapeuten. [GEGEVEN-NODIG: welke certificering precies, Okan]",
  },
  {
    id: "kantoor",
    label: "IT en marketing",
    beschermd: false,
    behandelend: false,
    wat: "Bouwt en onderhoudt deze site en doet de marketing. Komt niet in de behandelkamer.",
    opleiding:
      "Geen zorgopleiding, en dat hoort ook zo: hier wordt niets over jouw huid besloten.",
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
/**
 * De logo's voor de voettekst en de registratiepagina. Yasin, 9 september 2026: "zodat
 * we echt professioneel ogen". Bestanden in /public/images/logos, opgehaald van de sites
 * van de organisaties zelf; elk logo linkt daar ook naartoe.
 *
 * [GEGEVEN-NODIG: is Diba een erkend leerbedrijf (SBB)? Yasin noemde het als iets dat
 * de site mist; het staat er nu met het SBB-beeldmerk en gaat eruit als het niet klopt.
 * Het officiële "erkend leerbedrijf"-logo krijgt de kliniek via mijnsbb.nl.]
 */
type Logo = {
  readonly naam: string;
  readonly logo: string;
  readonly url: string;
  /**
   * De hoogte in beeldpunten waarop dit logo naast de andere staat.
   *
   * Niet allemaal dezelfde hoogte, want dan bepaalt de vorm hoe groot iets oogt: een breed
   * woordmerk als ANBOS wordt dan een banier en een rond zegel als het SKIN Register een
   * knikker. Deze getallen houden het bedekte oppervlak ongeveer gelijk (hoogte omgekeerd
   * evenredig met de wortel van de breedte-hoogteverhouding), met een ondergrens voor de
   * merken waar leesbare letters in zitten. Zo lijken ze even zwaar terwijl ze het niet zijn.
   */
  readonly hoogte: number;
};

export const LOGOSTROOK: readonly Logo[] = [
  /* De volgorde is die van de rijen op een telefoon: drie brede woordmerken boven, drie
     ronde tekens eronder (Yasin, 10 september 2026). Zo staat er geen postzegel naast een
     banier en beginnen beide rijen even zwaar. */
  {
    naam: "Nederlandse Vereniging van Huidtherapeuten",
    logo: "/images/logos/nvh-tekst.png",
    url: "https://www.huidtherapie.nl/",
    hoogte: 34,
  },
  {
    naam: "ZorgkaartNederland",
    logo: "/images/logos/zorgkaart-nederland.svg",
    url: "https://www.zorgkaartnederland.nl/zorginstelling/huidtherapiepraktijk-diba-clinics-rotterdam-10082984",
    hoogte: 29,
  },
  {
    naam: "ANBOS",
    logo: "/images/logos/anbos.png",
    url: "https://www.anbos.nl/",
    hoogte: 26,
  },
  {
    naam: "Kwaliteitsregister Paramedici",
    logo: "/images/logos/kwaliteitsregister-paramedici.svg",
    url: "https://www.kwaliteitsregisterparamedici.nl/",
    hoogte: 50,
  },
  {
    naam: "SKIN Register",
    /* Yasin, 10 september 2026: het zegel van skinregister.nl zelf, in plaats van het
       woordmerk dat we eerst hadden. Het bestand van de vereniging is een SVG met een
       bitmap erin van 324 kB; dat staat onder elke pagina, dus de bitmap is eruit gehaald
       en als PNG van 200 punten opgeslagen. */
    logo: "/images/logos/skin-register.png",
    url: "https://www.skinregister.nl/",
    hoogte: 50,
  },
  {
    naam: "SBB, erkend leerbedrijf",
    logo: "/images/logos/sbb.svg",
    url: "https://www.s-bb.nl/",
    hoogte: 46,
  },
];

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
}[] = (
  ["huidtherapie", "orthomoleculair", "laser", "praktijk", "kantoor"] as const
)
  .map((vak) => ({ vak, aantal: TEAM.filter((l) => l.vak === vak).length }))
  .filter((v) => v.aantal > 0);

export const TEAM_AANTAL = TEAM.length;

export const KWALITEITSREGISTER = {
  naam: "Kwaliteitsregister Paramedici",
  url: "https://www.kwaliteitsregisterparamedici.nl/beroep/huidtherapeut",
  eisen:
    "Vrijwillig register met een cyclus van vijf jaar. Wie erin blijft staan toont per periode minstens 1600 werkuren aan, verspreid over minimaal 36 maanden, en 160 punten bijscholing.",
} as const;
