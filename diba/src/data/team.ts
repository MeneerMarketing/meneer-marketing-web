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
 * Bio's. Die staan niet op hun site en een biografie van een echt mens verzin je niet,
 * ook niet in de derde persoon en ook niet "voorlopig". Wat er wél kan: de functie, want
 * die publiceren ze zelf. [COPY-NODIG: bio per persoon, van de betrokkene zelf]
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
  },
  { slug: "okan", naam: "Okan", functie: "Praktijkmanager", vak: "praktijk" },
  {
    slug: "demi",
    naam: "Demi",
    functie: "Orthomoleculair huidspecialist",
    vak: "orthomoleculair",
  },
  {
    slug: "andres",
    naam: "Andres",
    functie: "Huidtherapeut",
    vak: "huidtherapie",
  },
  {
    slug: "melanie",
    naam: "Melanie",
    functie: "Huidtherapeut",
    vak: "huidtherapie",
  },
  { slug: "iris", naam: "Iris", functie: "Huidtherapeut", vak: "huidtherapie" },
  {
    slug: "bahar",
    naam: "Bahar",
    functie: "Huidtherapeut",
    vak: "huidtherapie",
  },
  {
    slug: "rialda",
    naam: "Rialda",
    functie: "Huidtherapeut",
    vak: "huidtherapie",
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
