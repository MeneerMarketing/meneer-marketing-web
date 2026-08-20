/**
 * Inhoud van de pagina over een droge huid.
 *
 * De klinische waarheid die deze pagina eigen maakt: droog en uitgedroogd zijn niet
 * hetzelfde en het zijn ook geen twee standen van één schaal. Het zijn twee onafhankelijke
 * assen. Droog gaat over vet, uitgedroogd over water. Je kunt allebei tegelijk zijn, en je
 * kunt een vette huid hebben die uitgedroogd is, en "vochtarm" is precies dat tweede — dat laatste is precies waarom mensen
 * jarenlang het verkeerde product kopen.
 *
 * Vandaar de matrix in plaats van een schaal. Je zet jezelf ergens in een vlak neer en
 * ziet dat de twee richtingen los van elkaar bewegen. Een schuifbalk zou de fout die deze
 * pagina wil rechtzetten juist bevestigen.
 *
 * COPY-STATUS: concept in de Diba-stem. Medische beweringen gemarkeerd voor Rojda. Geen
 * percentages: geen belofte zonder meting (A7).
 */

export type Kwadrant = {
  readonly id: "normaal" | "droog" | "uitgedroogd" | "beide";
  readonly naam: string;
  readonly vakterm: string;
  readonly herken: string;
  readonly oorzaak: string;
  readonly aanpak: string;
  /** Bepaalt de toon van het antwoord. */
  readonly urgentie: "rustig" | "let-op";
};

export const KWADRANTEN: Record<Kwadrant["id"], Kwadrant> = {
  normaal: {
    id: "normaal",
    naam: "In balans",
    vakterm: "eubalans",
    herken:
      "Geen trekkerig gevoel na het wassen, geen schilfers, en make-up blijft zitten zoals je verwacht.",
    oorzaak:
      "Je barrière doet wat hij hoort te doen: vet vasthouden en water binnenhouden. Er valt hier weinig te repareren.",
    aanpak:
      "Niets. Dit is de stand waarin een behandeling je geld kost zonder dat er iets te winnen valt, en dat zeggen we liever nu.",
    urgentie: "rustig",
  },
  droog: {
    id: "droog",
    naam: "Droog",
    vakterm: "lipidearm, alipide huid",
    herken:
      "Ruw en dof, soms schilferig. Je hebt het gevoel dat er iets bovenop moet en dat een lichte crème niet genoeg is.",
    oorzaak:
      "Er wordt te weinig huidvet aangemaakt of het gaat te snel verloren. Dit hoort vaak bij aanleg, bij kou en bij ouder worden. [MEDISCHE-CHECK-ROJDA]",
    aanpak:
      "Vet aanvullen, niet water. Een waterige gel voelt even lekker en is binnen een uur weg, want er is niets dat hem vasthoudt.",
    urgentie: "let-op",
  },
  uitgedroogd: {
    id: "uitgedroogd",
    naam: "Uitgedroogd",
    vakterm: "dehydratatie",
    herken:
      "Trekkerig na het wassen, fijne lijntjes die er 's ochtends erger uitzien dan 's avonds, en toch kan je huid glimmen.",
    oorzaak:
      "Er zit te weinig water in de bovenste laag. Dit is een toestand en geen huidtype: hij kan volgende maand weg zijn. [MEDISCHE-CHECK-ROJDA]",
    aanpak:
      "Water vasthouden en de barrière met rust laten. Dit is het kwadrant waarin mensen het vaakst zelf de oorzaak zijn, met te vaak reinigen en te veel actieve stoffen.",
    urgentie: "let-op",
  },
  beide: {
    id: "beide",
    naam: "Droog én uitgedroogd",
    vakterm: "gestoorde barrièrefunctie",
    herken:
      "Ruw én trekkerig, snel rood, en je verdraagt steeds minder producten dan vroeger.",
    oorzaak:
      "De barrière lekt water én mist het vet om dat tegen te houden. Vaak is er een aanjager: koud weer, te warm douchen, of een routine die te stevig is geworden. [MEDISCHE-CHECK-ROJDA]",
    aanpak:
      "Eerst afbouwen, dan opbouwen. Weglaten levert hier meer op dan toevoegen, en dat kost je niets.",
    urgentie: "let-op",
  },
};

/** Waar de vier kwadranten liggen. x = vet naar droog, y = gehydrateerd naar uitgedroogd. */
export function bepaalKwadrant(x: number, y: number): Kwadrant["id"] {
  const droog = x >= 50;
  const uitgedroogd = y >= 50;
  if (droog && uitgedroogd) return "beide";
  if (droog) return "droog";
  if (uitgedroogd) return "uitgedroogd";
  return "normaal";
}

export const AS_UITLEG = {
  x: {
    label: "Vet",
    links: "Genoeg vet",
    rechts: "Weinig vet",
    tekst:
      "Deze as gaat over wat je huid zelf aanmaakt. Dat is grotendeels aanleg en verandert traag.",
  },
  y: {
    label: "Water",
    boven: "Genoeg water",
    onder: "Weinig water",
    tekst:
      "Deze as gaat over hoeveel vocht er in de bovenste laag zit. Dat wisselt met het seizoen, met je routine en met hoe vaak je wast.",
  },
} as const;

/* ── Wat mensen verwarren ──────────────────────────────────────────────── */

export const VERWARRINGEN = [
  {
    vraag: "Mijn huid glimt én trekt. Kan dat?",
    antwoord:
      "Ja, en dat is precies waarom deze twee assen los van elkaar staan. Een vette huid kan uitgedroogd zijn. Wie dan een matterende reiniger pakt, maakt het erger.",
  },
  {
    vraag: "Het is 's winters veel erger. Is mijn huidtype veranderd?",
    antwoord:
      "Nee. Je zakt op de wateras. Koude lucht houdt minder vocht vast en binnen staat de verwarming aan, en dat samen droogt uit. In het voorjaar schuif je vanzelf terug.",
  },
  {
    vraag: "Ik gebruik al jaren een rijke crème en het helpt niet.",
    antwoord:
      "Dan zit je waarschijnlijk in het uitgedroogde kwadrant en niet in het droge. Vet erop smeren houdt water vast dat er niet is.",
  },
] as const;

export const DROGE_HUID_WEL_NIET = {
  wel: [
    "Weten in welk kwadrant je zit voordat je iets koopt. Dat scheelt jaren aan producten die het verkeerde probleem oplossen.",
    "Lauw douchen in plaats van heet, en korter. Dit is de goedkoopste stap op deze pagina en de meest overgeslagen.",
    "Reinigen dat je huid niet piepschoon achterlaat. Piepschoon betekent dat er ook vet weg is dat je nodig had.",
    "Bij twijfel afbouwen: alles weg behalve reinigen en één verzorgend product, twee weken lang. Dan zie je wat het echt is.",
    "Accepteren dat de vetas grotendeels aanleg is en dat de wateras wél te sturen valt.",
  ],
  niet: [
    "Meer actieve stoffen stapelen omdat het niet beter wordt. Dat is bij een lekkende barrière de snelste weg naar erger.",
    "Scrubben tegen schilfers. Je haalt het laagje weg dat het water nog binnenhield.",
    "Elke week iets nieuws proberen. Een huid heeft weken nodig, dus je meet steeds het vorige product.",
    "Water drinken als oplossing zien voor een uitgedroogde huid. Het helpt je lichaam, het vult de bovenste huidlaag niet aan. [MEDISCHE-CHECK-ROJDA]",
    "Een behandeling boeken terwijl je barrière kapot is. Dan reageert je huid feller en levert dezelfde behandeling minder op.",
  ],
} as const;

export const DROGE_HUID_WIJ_DOEN_NIET = [
  {
    titel: "Geen behandeling op een kapotte barrière",
    tekst:
      "Is je huid geïrriteerd, dan sturen we je eerst twee weken naar huis met minder in plaats van meer. Dat kost ons een afspraak en het scheelt jou een teleurstelling.",
  },
  {
    titel: "Geen productlijst van een meter",
    tekst:
      "Wij verkopen geen routine met acht stappen. Bij een droge huid is weglaten meestal de behandeling, en daar valt weinig aan te verdienen.",
  },
  {
    titel: "Geen behandeling als je in balans zit",
    tekst:
      "Zit je in het rustige kwadrant, dan is ons advies om niets te doen. Dat komt vaker voor dan je denkt.",
  },
] as const;

export const DROGE_HUID_FAQ = [
  {
    vraag: "Wat is nou het verschil tussen droog en uitgedroogd?",
    antwoord:
      "Droog gaat over vet en is grotendeels aanleg. Uitgedroogd gaat over water en is een toestand die komt en gaat. Ze voelen allebei ongemakkelijk en vragen het tegenovergestelde, en dat is de reden dat mensen jarenlang het verkeerde kopen.",
  },
  {
    vraag: "Helpt veel water drinken?",
    antwoord:
      "Voor je lichaam wel, voor de bovenste huidlaag nauwelijks. Die haalt zijn vocht vooral uit wat je erop doet en uit hoe goed je barrière lekkage tegenhoudt. [MEDISCHE-CHECK-ROJDA]",
  },
  {
    vraag: "Ik heb ook rode plekjes en jeuk. Hoort dat hierbij?",
    antwoord:
      "Kan, maar bij aanhoudende jeuk, kloofjes of plekken die niet weggaan hoort een huisarts mee te kijken. Dan kan het eczeem zijn, en dat vraagt iets anders dan een droge huid.",
  },
  {
    vraag: "Hoe snel merk ik verschil?",
    antwoord:
      "Op de wateras vaak binnen twee weken, op de vetas veel langzamer omdat je daar tegen je aanleg in werkt. Reken op zes tot acht weken voordat je op die tweede as iets vaststelt. Dat verschil in tempo is meteen de beste test van waar je zat. [GEGEVEN-NODIG]",
  },
  {
    vraag: "Wat kost dit?",
    antwoord:
      "De meting kost vijftig euro en dat is meteen het hele consult. Wat er daarna volgt hangt af van wat eruit komt en staat per behandeling op de prijzenpagina. Blijkt uit de meting dat je in balans zit, dan is ons advies om niets te doen en houdt het daar op. [PRIJS-NODIG]",
  },
] as const;
