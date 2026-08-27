/**
 * Inhoud van de klachtenregeling.
 *
 * WAAROM DEZE PAGINA ER MOET ZIJN, EN NIET ALLEEN OMDAT HET MOET.
 *
 * De Wkkgz verplicht elke zorgaanbieder tot een klachtenregeling, een klachtenfunctionaris
 * en aansluiting bij een erkende geschilleninstantie. Sinds 2016 vallen cosmetische
 * handelingen daar uitdrukkelijk onder, en Diba Clinics omschrijft zichzelf in de eigen
 * algemene voorwaarden als hulpverlener die handelingen op het gebied van de geneeskunst
 * verricht. Er is dus geen twijfel dat het geldt.
 *
 * Maar de reden dat deze pagina goed moet zijn is een andere. Iemand die hier komt is
 * boos, teleurgesteld of bang, en meestal alle drie tegelijk. Dat is het slechtst denkbare
 * moment om iemand door een juridische tekst te laten ploegen.
 *
 * DE VOLGORDE IS OMGEDRAAID TEN OPZICHTE VAN DE MEESTE KLACHTENPAGINA'S.
 *
 * Die beginnen met wat een klacht is en eindigen met waar je terechtkunt. Hier staat eerst
 * wat je nú kunt doen, en pas daarna de formele route. Wie alleen de eerste kaart leest,
 * heeft genoeg.
 *
 * WAT DEZE REGELING NIET DOET.
 *
 * Ontmoedigen. Geen "wij verzoeken u eerst zelf contact op te nemen alvorens" met
 * termijnen die je afschrikken. Er staat wel dat een gesprek meestal sneller helpt, met de
 * reden erbij, en daarna staat de formele weg er gewoon naast als gelijkwaardige optie.
 *
 * WAT ER NOG ONTBREEKT.
 *
 * Bij welke geschilleninstantie Diba is aangesloten, en wie de klachtenfunctionaris is.
 * Dat zijn geen keuzes die uit de code volgen; die weet de kliniek. Zolang ze ontbreken
 * mist deze pagina het enige onderdeel dat wettelijk hard is, en daarom staat het
 * gemarkeerd in plaats van vaag ingevuld.
 */

export type KlachtStap = {
  readonly id: string;
  readonly kop: string;
  /** Eén zin die zegt wat deze stap oplevert. */
  readonly kern: string;
  readonly tekst: string;
  /** Hoe lang dit duurt, als daar iets over te zeggen valt. */
  readonly termijn?: string;
};

export const KLACHT_STAPPEN: readonly KlachtStap[] = [
  {
    id: "zeg-het",
    kop: "Zeg het gewoon",
    kern: "Tegen wie je behandelde, of tegen iemand anders als dat makkelijker is.",
    tekst:
      "Verreweg de meeste klachten gaan over iets dat in één gesprek recht te zetten is: een resultaat dat tegenviel, een afspraak die anders liep dan verwacht, een rekening die niet klopte. Bel, mail of loop binnen. Vind je het lastig om het tegen je eigen behandelaar te zeggen, vraag dan iemand anders van het team. Dat is geen omweg maar een normale vraag.",
    termijn: "Meestal dezelfde week",
  },
  {
    id: "klachtenfunctionaris",
    kop: "Vraag de klachtenfunctionaris",
    kern: "Een onafhankelijk iemand die gratis met je meedenkt, ook tegen ons in.",
    tekst:
      "Kom je er met ons niet uit, of wil je liever niet rechtstreeks met de kliniek praten, dan is er een klachtenfunctionaris. Die staat los van de behandelaars, kost je niets, en helpt je je klacht helder te krijgen en een oplossing te zoeken. Hij of zij kiest geen partij en is er niet om ons te verdedigen. [GEGEVEN-NODIG: naam en contactgegevens van de klachtenfunctionaris, Okan]",
    termijn: "Kosteloos",
  },
  {
    id: "formeel",
    kop: "Dien hem formeel in",
    kern: "Schriftelijk, en dan krijg je binnen zes weken een oordeel.",
    tekst:
      "Wil je een formeel oordeel, dien je klacht dan schriftelijk in. Je krijgt binnen zes weken een met redenen omkleed antwoord: wat wij van je klacht vinden, wat wij ermee doen en binnen welke termijn. Is er meer tijd nodig voor zorgvuldig onderzoek, dan mag die termijn met vier weken verlengd worden, en dan hoor je dat vóórdat de zes weken om zijn.",
    termijn: "Zes weken, eenmalig te verlengen met vier",
  },
  {
    id: "geschil",
    kop: "Leg het voor aan de geschilleninstantie",
    kern: "Onafhankelijk, bindend, en met de mogelijkheid tot een vergoeding.",
    tekst:
      "Ben je het niet eens met ons oordeel, dan kun je naar de onafhankelijke geschilleninstantie waar wij bij zijn aangesloten. Die doet een bindende uitspraak en kan een schadevergoeding toekennen tot 25.000 euro. Je hoeft daar geen advocaat voor. [GEGEVEN-NODIG: bij welke erkende geschilleninstantie is Diba Clinics aangesloten, met contactgegevens, Okan]",
    termijn: "Bindende uitspraak",
  },
];

/**
 * Waar je met iets anders dan een klacht terechtkunt.
 *
 * Deze staan er omdat mensen anders op de verkeerde plek aankloppen. De IGJ behandelt geen
 * individuele klachten en de geschilleninstantie gaat niet over toezicht; wie dat niet weet
 * verliest weken.
 */
export const ANDERE_WEGEN: readonly {
  readonly wie: string;
  readonly waarvoor: string;
  readonly nietVoor: string;
}[] = [
  {
    wie: "Inspectie Gezondheidszorg en Jeugd",
    waarvoor:
      "Meldingen over onveilige zorg of situaties die anderen ook kunnen overkomen. De inspectie houdt toezicht op de sector.",
    nietVoor:
      "Je eigen klacht oplossen of een vergoeding krijgen. Daar doet de inspectie niets aan.",
  },
  {
    wie: "Autoriteit Persoonsgegevens",
    waarvoor:
      "Klachten over hoe wij met je gegevens omgaan, als je er met ons niet uitkomt.",
    nietVoor: "Alles wat over de behandeling zelf gaat.",
  },
  {
    wie: "Je zorgverzekeraar",
    waarvoor:
      "Vragen over vergoeding van een behandeling en over wat je polis dekt.",
    nietVoor:
      "De behandeling zelf. Wij bepalen niet wat je verzekeraar vergoedt en zij bepalen niet wat wij doen.",
  },
];

/**
 * Wat wij beloven over hoe wij met een klacht omgaan.
 *
 * Dit is het enige deel van de pagina dat geen wettelijke verplichting is, en het staat er
 * juist daarom: de wet schrijft een procedure voor, geen houding.
 */
export const KLACHT_HOUDING: readonly string[] = [
  "Je klacht kost je niets. Niet het gesprek, niet de klachtenfunctionaris, en niet de geschilleninstantie.",
  "Een klacht heeft geen gevolgen voor je behandeling. Je blijft welkom en je wordt niet anders behandeld.",
  "Wij zetten op papier wat er is gebeurd, ook als het ongemakkelijk voor ons is.",
  "Hebben wij een fout gemaakt, dan zeggen we dat en dragen we de gevolgen. Dat is goedkoper dan een jaar procederen en het is ook gewoon hoe het hoort.",
  "Wat er uit een klacht komt, veranderen we in de kliniek. Anders is het een formulier en geen les.",
];
