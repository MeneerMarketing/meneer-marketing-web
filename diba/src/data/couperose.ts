/**
 * Inhoud van de couperosepagina.
 *
 * HERSCHREVEN 28-08-2026 IN DE VASTGELEGDE SCHRIJFSTIJL.
 *
 * De eerste versie stond vol met wat `SCHRIJFSTIJL.md` nu verbiedt: koppen in twee
 * helften met een komma ertussen ("Twee seconden, en je weet het zelf"), het
 * geen-X-wel-Y-ritme, en zinnen die stelliger klinken dan ze zijn. Het las als een
 * campagne en niet als iemand die je iets uitlegt.
 *
 * Wat er nu staat begint bij de vraag waarmee mensen hier komen: die adertjes zitten er al
 * een tijd, ze gaan niet meer weg, en wat is dat eigenlijk. De drukproef blijft, want die
 * is de reden dat deze pagina bestaat, maar hij wordt gebracht als iets dat je even doet en
 * niet als een truc met een uitroepteken.
 *
 * WAAROM DEZE PAGINA NAAST /huidproblemen/rosacea STAAT.
 *
 * Couperose stond alleen in de titel van de rosaceapagina en als één van de vier beelden
 * daarbinnen. Klinisch klopte dat; als ingang niet. Wie "couperose" of "rode adertjes"
 * intikt, zoekt de lijntjes naast zijn neus en niet een pagina over opvlammingen en stadia.
 *
 * Waarom dit wél een eigen pagina verdient en striae destijds bij littekens is gevoegd:
 * striae en littekens lopen langs dezelfde as en vertellen één verhaal, terwijl een verwijd
 * vaatje en een ontstekingsbeeld anders werken, anders behandeld worden en met een andere
 * vraag beginnen.
 *
 * MEDISCH.
 *
 * Elke bewering draagt zijn vlag voor Rojda. De drukproef is een herkenningshulp; dat staat
 * ook op de pagina zelf.
 */

export type CouperoseBeeld = {
  readonly id: string;
  readonly naam: string;
  /** Hoe iemand het zelf zou omschrijven. */
  readonly klanttaal: string;
  /** De vakterm ernaast, niet in plaats daarvan. */
  readonly vakterm: string;
  /** Wat de drukproef bij dit beeld laat zien. */
  readonly drukproef: string;
  readonly watHetBetekent: string;
  readonly aanpak: string;
  /** Het misverstand dat bij dit beeld het vaakst meekomt. */
  readonly verwarring: string;
};

export const COUPEROSE_BEELDEN: readonly CouperoseBeeld[] = [
  {
    id: "lijntjes",
    naam: "Losse rode lijntjes",
    klanttaal: "Dunne rode of paarse draadjes op je wangen of naast je neus",
    vakterm: "teleangiëctasieën",
    drukproef:
      "Het lijntje blijft zichtbaar terwijl je drukt. Het bloed laat zich er niet uit duwen.",
    watHetBetekent:
      "Een bloedvaatje dat blijvend is opgerekt. Zo'n vaatje sluit zich uit zichzelf niet meer, en het zit onder de opperhuid, waar verzorgingsproducten niet komen. [MEDISCHE-CHECK-ROJDA]",
    aanpak:
      "Hier levert licht het meeste op. We leggen eerst vast hoeveel er zichtbaar is, zodat je na een paar sessies het verschil kunt terugzien in plaats van moeten inschatten.",
    verwarring:
      "Veel mensen noemen dit een gesprongen adertje. Er is niets gesprongen: het vaatje is opgerekt en staat open. Dat klinkt als een detail, maar het scheelt in wat eraan te doen is.",
  },
  {
    id: "gloed",
    naam: "Een rode gloed",
    klanttaal: "Een waas van rood over je wangen, zonder losse lijntjes",
    vakterm: "diffuus erytheem",
    drukproef:
      "Het rood trekt weg onder je vinger en komt daarna langzaam terug.",
    watHetBetekent:
      "Veel kleine vaatjes die tegelijk openstaan, meestal als reactie op warmte, inspanning of iets wat je huid aanzet. Dit hoort eerder bij rosacea dan bij couperose. [MEDISCHE-CHECK-ROJDA]",
    aanpak:
      "We zoeken eerst uit waardoor het opkomt en kijken daarna pas of licht iets toevoegt. Zolang de aanleiding blijft, komt de gloed terug en dan werkt een apparaat tegen de stroom in.",
    verwarring:
      "Een gloed is een ander mechanisme dan verwijde vaatjes, en het is ook geen voorstadium daarvan. Behandelen alsof het lijntjes zijn levert weinig op. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    id: "gemengd",
    naam: "Allebei door elkaar",
    klanttaal: "Een rode ondergrond met daarin een paar duidelijke lijntjes",
    vakterm: "erytheem met teleangiëctasieën",
    drukproef:
      "Het vlak trekt weg terwijl de lijntjes blijven staan. Daar zie je het onderscheid het duidelijkst.",
    watHetBetekent:
      "De combinatie die we het vaakst tegenkomen. De lijntjes en de gloed vragen elk om iets anders, en om een volgorde. [MEDISCHE-CHECK-ROJDA]",
    aanpak:
      "We werken langs twee sporen: uitzoeken waardoor de gloed opkomt, en de zichtbare vaatjes gericht aanpakken. Waar we beginnen hangt af van wat jou het meest dwarszit.",
    verwarring:
      "Dit in één sessie wegwerken lukt niet, ook niet met een sterk apparaat. Reken op een reeks, met tijd ertussen om te zien wat er is veranderd. [MEDISCHE-CHECK-ROJDA]",
  },
];

/**
 * De drukproef.
 *
 * De reden dat deze pagina bestaat en niet een alinea op de rosaceapagina is. Een test die
 * iemand thuis doet, die niets kost, en waarvan de uitslag bepaalt welke kant het gesprek
 * op gaat.
 */
export const DRUKPROEF_STAPPEN: readonly {
  readonly kop: string;
  readonly tekst: string;
}[] = [
  {
    kop: "Onder vergroting",
    tekst:
      "De huidtherapeut bekijkt de rode plek vergroot. Losse, vertakte lijntjes zien er heel anders uit dan een egale waas, en met het blote oog lopen die twee makkelijk door elkaar.",
  },
  {
    kop: "Met lichte druk",
    tekst:
      "Een korte druk op de plek laat zien of het rood wegtrekt of dat er een lijntje blijft staan. Dat verschil bepaalt of het om vaatjes gaat of om roodheid in de huid zelf.",
  },
  {
    kop: "Vastgelegd in beeld",
    tekst:
      "De opname gaat onder vaste belichting, zodat we bij een volgende afspraak kunnen vergelijken. Roodheid wisselt per dag, dus zonder vast licht meet je vooral het weer.",
  },
];

export const COUPEROSE_WEL_NIET = {
  wel: [
    "Vooraf vastleggen hoeveel vaatjes er zichtbaar zijn, onder vast licht, zodat je het later kunt vergelijken",
    "Gericht licht op de vaatjes die bij druk blijven staan, verdeeld over meerdere sessies",
    "Elke dag zonbescherming. UV rekt vaatwanden verder op en is de belangrijkste reden dat er nieuwe bij komen [MEDISCHE-CHECK-ROJDA]",
    "Uitzoeken waardoor de gloed opkomt, want zolang die blijft terugkomen ontstaan er nieuwe vaatjes",
    "Vooraf zeggen wanneer één sessie waarschijnlijk volstaat en wanneer je op een reeks moet rekenen",
  ],
  niet: [
    "Stevig scrubben of borstelen. Je huid wordt er roder van terwijl de vaatjes blijven zitten",
    "Een hete douche of de sauna vlak na een vaatbehandeling, omdat warmte de roodheid opnieuw kan opwekken [MEDISCHE-CHECK-ROJDA]",
    "Camouflage als behandeling presenteren. Groene concealer maakt roodheid minder zichtbaar en laat de vaatjes zoals ze zijn",
    "Een crème die belooft vaatjes te laten verdwijnen. Een opgerekt vaatje ligt onder de opperhuid, buiten bereik van wat je erop smeert",
    "Beginnen op een gebruinde huid [MEDISCHE-CHECK-ROJDA]",
  ],
} as const;

/** Waar wij nee zeggen. Dit is een merkregel, geen disclaimer (A7). */
export const COUPEROSE_WIJ_DOEN_NIET = [
  {
    titel: "We wachten tot je huid rustig is",
    tekst:
      "Voelt je huid warm en branderig en is hij op dit moment aan het opvlammen, dan stellen we de behandeling uit. Licht op een geprikkelde huid maakt de roodheid vaker erger dan beter, en dan ben je verder van huis dan toen je binnenkwam. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    titel: "Een aantal sessies noemen we pas na de meting",
    tekst:
      "Hoeveel er nodig is hangt af van hoeveel vaatjes er zichtbaar zijn en hoe diep ze liggen. Dat zien we bij de eerste afspraak, en daarna hoor je een reëel aantal in plaats van een schatting aan de telefoon.",
  },
];

export const COUPEROSE_FAQ = [
  {
    vraag: "Komen die vaatjes terug na de behandeling?",
    antwoord:
      "Een vaatje dat gesloten is, blijft dicht. Wat wel gebeurt, is dat er in de loop van de tijd nieuwe bij kunnen komen, want je aanleg en de dingen die je huid aanzetten veranderen niet door een behandeling. Daarom besteden we net zoveel aandacht aan wat de roodheid opwekt als aan wat er nu te zien is. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Is couperose hetzelfde als rosacea?",
    antwoord:
      "Ze lopen vaak samen op, maar het is niet hetzelfde. Couperose zijn de zichtbare, blijvend opgerekte vaatjes. Rosacea is een ontstekingsbeeld met opvlammingen, soms bultjes en een branderig gevoel. Je kunt de vaatjes hebben zonder rosacea, en rosacea zonder zichtbare vaatjes. Herken je meer dan de lijntjes alleen, lees dan verder op de rosaceapagina. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Krijg ik dit van alcohol?",
    antwoord:
      "Alcohol zet de vaten wijd open en kan een opvlamming uitlokken, maar het verklaart de aanleg niet. Dat hardnekkige verband zorgt er vooral voor dat mensen zich schamen voor iets waar ze zelf weinig aan konden doen. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Kan ik make-up blijven gebruiken?",
    antwoord:
      "Ja, ook tussen de sessies door. We vragen alleen om je huid schoon te laten op de dag van de behandeling zelf.",
  },
  {
    vraag: "Wat kost een behandeling?",
    antwoord:
      "Een behandeling van vaatjes met de Nordlys begint bij 75 euro voor een klein gebied. Wat het bij jou wordt, hangt af van hoe groot het gebied is en hoeveel sessies er nodig zijn; dat hoor je na de eerste afspraak. Alle tarieven staan op de prijzenpagina.",
  },
];
