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
 * Portretten ontbreken om dezelfde reden. [BEELD-NODIG: portretten, geen stockfoto's]
 */

export type Vakgebied = "huidtherapie" | "orthomoleculair" | "praktijk";

export type Teamlid = {
  readonly slug: string;
  readonly naam: string;
  readonly functie: string;
  readonly vak: Vakgebied;
  /** Alleen invullen als de persoon het zelf heeft aangeleverd. */
  readonly bio?: string;
};

export const TEAM: readonly Teamlid[] = [
  {
    slug: "rojda-sahin",
    naam: "Rojda Sahin",
    functie: "Founder Diba Clinics B.V. en orthomoleculair huidspecialist",
    vak: "orthomoleculair",
    bio: "Als founder bepaalt Rojda wat er in deze kliniek wel en niet gebeurt, en dat tweede is hier het langste lijstje. Zij is degene die de meting uitlegt en die zegt wanneer behandelen geen zin heeft. Kom je met een vraag waar geen behandeling bij hoort, dan hoor je dat van haar.",
  },
  {
    slug: "okan",
    naam: "Okan",
    functie: "Praktijkmanager",
    vak: "praktijk",
    bio: "Okan houdt de praktijk draaiend: de agenda, de afspraken en alles wat er misgaat voordat je het merkt. Bel je over een afspraak verzetten, een factuur of iets wat niet klopt, dan kom je bij hem uit. Hij behandelt niet en dat is precies zijn functie.",
  },
  {
    slug: "demi",
    naam: "Demi",
    functie: "Orthomoleculair huidspecialist",
    vak: "orthomoleculair",
    bio: "Demi werkt als orthomoleculair huidspecialist en kijkt daarbij naar wat er van binnenuit meespeelt. Bij haar begint een afspraak vaker met vragen dan met een apparaat, en dat is geen omweg: bij een deel van de huidklachten zit de aanjager niet in de huid.",
  },
  {
    slug: "andres",
    naam: "Andres",
    functie: "Huidtherapeut",
    vak: "huidtherapie",
    bio: "Andres is huidtherapeut en werkt vooral met de apparatuur waarbij de instelling het verschil maakt. Hij legt uit wat een apparaat doet en waar het ophoudt, en hij zegt het ook als een behandeling bij jouw huid minder oplevert dan je hoopt.",
  },
  {
    slug: "melanie",
    naam: "Melanie",
    functie: "Huidtherapeut",
    vak: "huidtherapie",
    bio: "Melanie is huidtherapeut. Zij doet veel van de trajecten die over maanden lopen, en dat betekent dat je haar vaker ziet dan één keer. Bij elke controle wordt er gemeten in plaats van geschat, zodat je zelf kunt zien of het schema klopt.",
  },
  {
    slug: "iris",
    naam: "Iris",
    functie: "Huidtherapeut",
    vak: "huidtherapie",
    bio: "Iris is huidtherapeut en werkt veel met mensen die eerst ergens anders geweest zijn. Zij begint dan bij wat er al geprobeerd is, want dat scheelt maanden opnieuw uitproberen. Ook als dat betekent dat een eerder advies overeind blijft.",
  },
  {
    slug: "bahar",
    naam: "Bahar",
    functie: "Huidtherapeut",
    vak: "huidtherapie",
    bio: "Bahar is huidtherapeut. Zij neemt de tijd voor de uitleg vooraf, ook als die uitleg langer duurt dan de behandeling zelf. Weet je na afloop niet waarom er iets gedaan is, dan is er iets misgegaan; dat is haar maatstaf.",
  },
  {
    slug: "rialda",
    naam: "Rialda",
    functie: "Huidtherapeut",
    vak: "huidtherapie",
    bio: "Rialda is huidtherapeut en werkt vaak met huid die snel reageert. Daar is de eerste stap meestal rust en niet een sterkere instelling, en dat is een gesprek dat ze liever vooraf voert dan achteraf.",
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
  readonly wat: string;
  readonly opleiding: string;
}[] = [
  {
    id: "huidtherapie",
    label: "Huidtherapeut",
    beschermd: true,
    wat: "Werkt met de apparatuur en de behandelingen: laser, licht, needling, peelings. Beoordeelt wat je huid aankan en stelt de instellingen daarop af.",
    opleiding:
      "Hbo-bachelor huidtherapie, te volgen aan de Haagse Hogeschool of Hogeschool Utrecht. De titel is beschermd in artikel 34 van de Wet BIG: zonder dat diploma mag je jezelf geen huidtherapeut noemen.",
  },
  {
    id: "orthomoleculair",
    label: "Orthomoleculair huidspecialist",
    beschermd: false,
    wat: "Kijkt naar wat er van binnenuit meespeelt: voeding, hormonen, vertering. Bij acne en pigment is dat vaak de helft van het verhaal.",
    opleiding:
      "Deze titel staat niet in de Wet BIG en is dus niet wettelijk beschermd. Dat zeggen we erbij omdat je dat hoort te weten, niet omdat het iets zegt over wat iemand kan.",
  },
  {
    id: "praktijk",
    label: "Praktijkmanager",
    beschermd: false,
    wat: "Regelt de agenda, de gang van zaken en alles eromheen. Behandelt niet.",
    opleiding: "Geen behandelend beroep, dus geen behandeltitel.",
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
export const KWALITEITSREGISTER = {
  naam: "Kwaliteitsregister Paramedici",
  url: "https://www.kwaliteitsregisterparamedici.nl/beroep/huidtherapeut",
  eisen:
    "Vrijwillig register met een cyclus van vijf jaar. Wie erin blijft staan toont per periode minstens 1600 werkuren aan, verspreid over minimaal 36 maanden, en 160 punten bijscholing.",
} as const;
