import type { ContentFormatId } from "@/services/types";

export interface LaunchPost {
  title: string;
  formatId: ContentFormatId;
  /** Eerste regel van de post. Hier valt of staat het. */
  hook: string;
  /** Wat de post inhoudelijk doet. */
  angle: string;
  /** Volledige caption, klaar om te plakken. */
  caption: string;
  hashtags: string[];
  plannedFor: string;
  pinned?: boolean;
  note?: string;
}

const TAGS = {
  web: ["webdesign", "website", "ondernemen", "mkb"],
  shop: ["shopify", "webshop", "ecommerce", "ondernemen"],
  marketing: ["onlinemarketing", "seo", "googleads", "ondernemen"],
  mening: ["marketing", "ondernemen", "mkb"],
} as const;

/**
 * Eerste dertig dagen. Drie vaste posts per week plus wisselaars.
 * Volgorde is bewust: verhaal, bewijs, drempel, en pas daarna humor.
 */
export const LAUNCH_CONTENT_PLAN: LaunchPost[] = [
  {
    title: "De overgang",
    formatId: "COMMERCIAL",
    hook: "FlexDesigns is nu Meneer Marketing.",
    angle: "Het merkverhaal. Verklaart de oude posts en houdt de bestaande volgers vast.",
    caption: `FlexDesigns is nu Meneer Marketing.

Het begon met design. Toen wilde iemand er een website bij. Daarna moest die website ook gevonden worden. Vervolgens moest er verkeer op. En toen bleek dat verkeer zonder een goede pagina vooral duur is.

Ergens onderweg werd FlexDesigns te klein voor wat ik eigenlijk doe.

Dus vanaf nu: Meneer Marketing. Websites en webshops die ik zelf bouw, plus de vindbaarheid en de advertenties eromheen. Eén aanspreekpunt, en dat ben ik.

Dezelfde persoon. Alleen nu met een hoed.`,
    hashtags: [...TAGS.web],
    plannedFor: "2026-08-18",
    pinned: true,
    note: "Pin 1. Zet twee weken 'Voorheen FlexDesigns' in je bio.",
  },
  {
    title: "Eerste before/after",
    formatId: "MENEER_FIXT",
    hook: "Deze hero krijgt vijftien minuten van me.",
    angle: "Sterkste before/after die er ligt. Bewijs dat hij het echt bouwt.",
    caption: `Deze hero krijgt vijftien minuten van me.

Wat er misging: drie knoppen naast elkaar, geen enkele belofte, en een afbeelding van vier megabyte die de boel vasthield.

Wat ik veranderde: één zin die vertelt wat je hier koopt, één knop, en die afbeelding teruggebracht tot iets waar een telefoon niet van gaat zweten.

Meer niet. Vijftien minuten.

De meeste websites verliezen mensen op het eerste scherm. Daar valt dus ook het meeste te winnen.`,
    hashtags: [...TAGS.web],
    plannedFor: "2026-08-20",
    pinned: true,
    note: "Pin 2. Reel, schermopname, geen gezicht.",
  },
  {
    title: "Wat kost dit",
    formatId: "COMMERCIAL",
    hook: "Wat kost een website bij Meneer?",
    angle: "De drempel weghalen. Iedereen wil het weten, niemand vraagt het.",
    caption: `Wat kost een website bij Meneer?

Eerlijk antwoord: dat hangt ervan af. Maar ik vind het vervelend als iemand dat zegt en er verder niets bij vertelt, dus hier is de bandbreedte.

Een strakke site van een paar pagina's, from scratch gebouwd, zit anders in elkaar dan een webshop met een besteldportaal voor zakelijke klanten. Het verschil zit in wat er achter de schermen moet gebeuren, niet in hoeveel plaatjes er op staan.

Wat je bij mij altijd krijgt: eigen code, geen page builder, en iemand die de telefoon opneemt.

Vraag het gerust in een DM. Ik geef een richtbedrag voordat we ergens aan beginnen.`,
    hashtags: [...TAGS.web],
    plannedFor: "2026-08-22",
    pinned: true,
    note: "Pin 3. Dit levert direct DM's op.",
  },
  {
    title: "Rekening: de knop",
    formatId: "DE_REKENING",
    hook: "Deze knop kost je €840 per maand.",
    angle: "Eerste Rekening. Zet meteen de toon: geld, niet smaak.",
    caption: `Deze knop kost je €840 per maand.

Niet omdat hij lelijk is. Omdat hij onder de vouw staat, in dezelfde kleur als al het andere op die pagina.

2.400 bezoekers per maand. Op dit moment klikt 1,4 procent door. Met een knop die je wel ziet is drie procent heel normaal. Bij een gemiddelde order van 78 euro praat je over ruim achthonderd euro per maand die nu bij de deur blijft staan.

Je hebt dat bezoek al betaald. Dat is het pijnlijke deel.

Fix: knop boven de vouw, in je accentkleur, met een werkwoord erop. Eén knop. Kost je een half uur.`,
    hashtags: [...TAGS.marketing],
    plannedFor: "2026-08-25",
  },
  {
    title: "Geen nieuwe site nodig",
    formatId: "MENEER_ZEGT",
    hook: "Je hebt waarschijnlijk geen nieuwe website nodig.",
    angle: "Contrair, en het maakt hem geloofwaardig omdat hij zichzelf werk ontzegt.",
    caption: `Je hebt waarschijnlijk geen nieuwe website nodig.

Rare zin voor iemand die websites bouwt, ik weet het.

Maar in de meeste gevallen zit het probleem op één scherm. Het eerste. Daar staat te veel, is onduidelijk wat je verkoopt, en ontbreekt de reden om verder te scrollen.

Dat los je op in een dag. Niet in een traject van drie maanden.

Een nieuwe site is nodig als de techniek eronder rammelt, als je vast zit in een systeem waar niemand meer in kan, of als je iets wil dat het huidige ding gewoon niet kan. Dat gebeurt genoeg.

Maar begin met dat eerste scherm. Dan weet je tenminste of het daaraan lag.`,
    hashtags: [...TAGS.mening],
    plannedFor: "2026-08-29",
  },
  {
    title: "Rekening: laadtijd",
    formatId: "DE_REKENING",
    hook: "Je laadtijd is 4,2 seconden. Dat is een auto per jaar.",
    angle: "Snelheid vertalen naar geld. Technisch onderwerp, menselijke uitkomst.",
    caption: `Je laadtijd is 4,2 seconden. Dat is een auto per jaar.

Geen nieuwe auto. Maar wel eentje waar je prima mee thuiskomt.

Bij vier seconden haakt ruim een kwart van je mobiele bezoekers af voordat je pagina er staat. Die mensen zien je aanbod niet, je knop niet en je verhaal niet. Ze zien een wit scherm en gaan terug.

Grootste boosdoener in negen van de tien gevallen: afbeeldingen die rechtstreeks uit de camera op de site zijn gezet. Vier megabyte per foto, twaalf foto's op de homepage.

Fix: alles naar webp, maximaal tweehonderd kilobyte per beeld, en lazy loading onder de vouw. Dat is een middag werk en het scheelt seconden.`,
    hashtags: [...TAGS.marketing],
    plannedFor: "2026-09-01",
  },
  {
    title: "Figma naar live",
    formatId: "MENEER_FIXT",
    hook: "Van schets naar live in één zitting.",
    angle: "Schermopname van het bouwproces. Bewijst de bouwkant.",
    caption: `Van schets naar live in één zitting.

Links het ontwerp, rechts wat er uiteindelijk in de browser staat. Geen thema, geen page builder, gewoon code.

Dat is ook meteen het verschil dat je later voelt. Een template moet je ombuigen tot iets dat lijkt op wat je wilde. Eigen code doet gewoon wat er bedacht is.

Duurt het langer? Aan het begin wel. Daarna niet meer.`,
    hashtags: [...TAGS.web],
    plannedFor: "2026-09-03",
  },
  {
    title: "Meneer Meter aftrap",
    formatId: "MENEER_METER",
    hook: "Raad de score voordat ik hem laat zien.",
    angle: "Start van de serie. Score pas op de laatste slide, dat is de kijktijdtruc.",
    caption: `Raad de score voordat ik hem laat zien.

Deze webshop kreeg ik deze week toegestuurd. Ziet er op het eerste gezicht prima uit, en dat is precies waarom de score interessant is.

Design haalt een 82. Daar is niks mis mee.
Snelheid een 76. Prima.
Vindbaarheid een 54. Daar begint het.
Conversie een 41. En daar zit het geld.

Eindstand staat op de laatste slide.

Wil je die van jou? Stuur je site in een DM. Ik pak er elke week één.`,
    hashtags: [...TAGS.marketing],
    plannedFor: "2026-09-05",
  },
  {
    title: "Ads repareren niks",
    formatId: "MENEER_ZEGT",
    hook: "Advertenties repareren een kapotte funnel niet.",
    angle: "Sterke stelling die zijn eigen dienst nuanceert. Bouwt vertrouwen.",
    caption: `Advertenties repareren een kapotte funnel niet. Ze versnellen hem.

Als honderd bezoekers nu niks kopen, kopen duizend bezoekers straks ook niks. Alleen heb je er dan wel voor betaald.

Dit is de reden dat ik bij SkinComplete eerst de vindbaarheid en het portaal op orde heb gebracht en pas daarna de advertenties heb aangezet. Toen het budget ging lopen, landde het op pagina's die al bewezen hadden dat ze konden verkopen.

Advertenties zijn een versterker. Zet ze op iets dat al werkt.`,
    hashtags: [...TAGS.marketing],
    plannedFor: "2026-09-08",
  },
  {
    title: "Coolblue ontleed",
    formatId: "MENEER_ONTLEEDT",
    hook: "Coolblue doet dit slim. Jij mag het jatten.",
    angle: "Groot merk, positieve toon. Positioneert hem op hun niveau.",
    caption: `Coolblue doet dit slim. En jij mag het gewoon jatten.

Bij elk product staat precies wanneer het bezorgd wordt. Geen 'meestal binnen twee tot vijf werkdagen', maar een dag en een tijdvak.

Waarom dat werkt: twijfel is de duurste emotie in een webshop. Elke vraag die je niet beantwoordt, beantwoordt je bezoeker zelf. Meestal in je nadeel.

Wat jij vanmiddag kunt doen: zoek op je site alles wat 'meestal', 'doorgaans' of 'circa' zegt en vervang het door een getal. Levertijd, reactietijd, retourtermijn.

Kost je een uur. En je hoeft er geen miljardenbudget voor te hebben.`,
    hashtags: [...TAGS.shop],
    plannedFor: "2026-09-10",
  },
  {
    title: "Rekening: het formulier",
    formatId: "DE_REKENING",
    hook: "Je formulier heeft elf velden. Negen te veel.",
    angle: "Herkenbaar probleem bij dienstverleners.",
    caption: `Je formulier heeft elf velden. Negen te veel.

Voornaam, achternaam, bedrijfsnaam, telefoon, mobiel, adres, postcode, plaats, hoe-heb-je-ons-gevonden, budget, en dan pas het vakje waar iemand kan typen wat hij eigenlijk wilde vragen.

Elk veld dat je toevoegt kost je aanvragen. Dat is geen mening, dat meet iedereen die er ooit naar gekeken heeft.

Wat je nodig hebt om terug te bellen: een naam, een manier om iemand te bereiken, en de vraag. Klaar. De rest vraag je in dat gesprek, waar het toch veel prettiger gaat.

Elf velden naar drie is bij de meeste sites een half uur werk. En het levert meer op dan de meeste advertentiecampagnes van diezelfde maand.`,
    hashtags: [...TAGS.marketing],
    plannedFor: "2026-09-12",
  },
  {
    title: "Bureau bingo",
    formatId: "BUREAU_BINGO",
    hook: "Bingo? Gefeliciteerd, je hebt een marketingbureau gevonden.",
    angle: "De humorklep. Eén keer per maand, altijd met zelfspot.",
    caption: `Marketingbureau Bingo.

Streep weg wat je herkent van de laatste website die je bezocht van een bureau dat jou wilde helpen groeien.

Vol? Gefeliciteerd.

En ja, technisch gezien ben ik er ook één. Het verschil is dat je bij mij niet eerst een strategiecall krijgt met iemand die het werk daarna doorgeeft aan een junior.

Je krijgt mij. Dat is meteen het hele organogram.`,
    hashtags: [...TAGS.mening],
    plannedFor: "2026-09-15",
  },
];

export const WEEKLY_RHYTHM_LABELS = [
  { day: "Dinsdag", formatId: "DE_REKENING" as ContentFormatId, note: "Carousel met bedrag" },
  { day: "Donderdag", formatId: "MENEER_FIXT" as ContentFormatId, note: "Reel, één element" },
  { day: "Zaterdag", formatId: "MENEER_ZEGT" as ContentFormatId, note: "Contraire mening" },
];
