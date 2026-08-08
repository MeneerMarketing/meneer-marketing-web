import type { SeoLandingCategory, SeoLandingPage } from "@/data/seo-landings/types";

export function hashSlug(slug: string, salt = ""): number {
  const s = slug + salt;
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function pick<T>(slug: string, items: readonly T[], salt = ""): T {
  return items[hashSlug(slug, salt) % items.length]!;
}

export function pickMany<T>(
  slug: string,
  items: readonly T[],
  count: number,
  salt = "",
): T[] {
  if (items.length === 0) return [];
  const h = hashSlug(slug, salt);
  const result: T[] = [];
  const used = new Set<number>();
  for (let i = 0; i < count && used.size < items.length; i++) {
    const idx = (h + i * 7 + i * i) % items.length;
    if (!used.has(idx)) {
      used.add(idx);
      result.push(items[idx]!);
    }
  }
  while (result.length < count && result.length < items.length) {
    const idx = (h + result.length * 11) % items.length;
    if (!used.has(idx)) {
      used.add(idx);
      result.push(items[idx]!);
    } else break;
  }
  return result;
}

type FillVars = {
  kw: string;
  city: string;
  region: string;
  loc: string;
  slug: string;
};

export function fill(template: string, vars: Record<string, string>): string {
  let result = template;
  for (const [key, val] of Object.entries(vars)) {
    result = result.replaceAll(`{${key}}`, val);
  }
  return result;
}

export function pageVars(page: SeoLandingPage): FillVars {
  const city = page.location?.city ?? "Nederland";
  const region = page.location?.region ?? "het land";
  const loc = page.location
    ? page.location.region
      ? ` in ${city} en ${page.location.region}`
      : ` rond ${city}`
    : "";
  return {
    kw: page.primaryKeyword,
    city,
    region,
    loc,
    slug: page.slug,
  };
}

export interface CityVoiceProfile {
  vibe: string;
  zoekgedrag: string;
  detail: string;
  ondernemerstype: string;
}

export const CITY_VOICE: Record<string, CityVoiceProfile> = {
  Arnhem: {
    vibe: "mode, design en overheid door elkaar op de Velperweg",
    zoekgedrag: "mensen die 'Arnhem' typen willen vaak iets lokaals, niet een bureau uit Utrecht dat de stad alleen van de A12 kent",
    detail: "Rijnkade, Sonsbeek, de Open Air. Je markt is niet alleen centrum. Het is ook Velp, Schuytgraaf en de bedrijventerreinen langs de N325.",
    ondernemerstype: "ondernemers die gewend zijn aan kwaliteit en weinig geduld hebben voor generieke praat",
  },
  Nijmegen: {
    vibe: "studenten, zorg, tech en de oudste stad van het land die zich gedraagt als de jongste",
    zoekgedrag: "Nijmegen zoekt breed: van lokale diensten tot niche B2B. Concurrentie is scherp omdat iedereen dezelfde zoekwoorden wil",
    detail: "Van de Waalkade tot Hatert. Van Radboud tot de wijken. Je klant vergelijkt op z'n telefoon tussen college en koffie.",
    ondernemerstype: "directe types die snappen dat marketing geen bijlage is aan je zaak",
  },
  Apeldoorn: {
    vibe: "thuisbasis van Meneer Marketing: koninklijk groen, Veluwe, MKB dat werkt en weinig poespas wil",
    zoekgedrag: "Apeldoorn en de Veluwe zoeken lokaal met vertrouwen: 'bij mij in de buurt', duidelijke dienst, geen Randstad-bureau dat de A1 alleen kent als file",
    detail: "Van centrum en Osseveld tot Beekbergen, Ugchelen en de bedrijventerreinen richting Deventer en Arnhem. Je markt is Veluwe, Gelderland en steeds vaker landelijk als je site en campagnes meeschalen.",
    ondernemerstype: "nuchtere ondernemers die resultaat willen zien. Omzet, leads en een plan dat je begrijpt, niet alleen groene pijltjes in een maandrapport",
  },
  Ede: {
    vibe: "Wageningen naast de deur, defensie, ondernemers die werken",
    zoekgedrag: "Ede en omgeving zoekt functioneel. Minder flair, meer 'lost dit mijn probleem op?'",
    detail: "Veenendaal, Bennekom, het Gld. Je bereik is breder dan alleen je postcode.",
    ondernemerstype: "praktische ondernemers die geen tijd hebben voor marketingtaal",
  },
  Eindhoven: {
    vibe: "Brainport, tech, design en Brabantse directheid",
    zoekgedrag: "Eindhoven zoekt scherp en vergelijkt snel. Je concurreert met startups én gevestigde namen",
    detail: "Strijp-S, High Tech Campus, Woensel. Je klant is vaak technisch onderlegd en rookt door vage beloftes heen.",
    ondernemerstype: "ingenieursmentaliteit: laat cijfers zien of zwijg",
  },
  Tilburg: {
    vibe: "studentenstad, logistiek, textielverleden met modern ondernemerschap",
    zoekgedrag: "Tilburg zoekt lokaal en prijsbewust. Vertrouwen en reviews wegen zwaar",
    detail: "Spoorzone, universiteit, maar ook sterke MKB in de regio. Niet alles speelt zich af in 5038.",
    ondernemerstype: "ondernemers die hard werken en verwachten dat jij dat ook doet",
  },
  Breda: {
    vibe: "horeca, retail en een stad die graag gezien wil worden",
    zoekgedrag: "Breda zoekt veel op mobiel, vaak in het weekend. Je hebt één kans om te overtuigen",
    detail: "Grote Markt, Haven, maar ook de wijken en omliggende dorpen die Breda als anker gebruiken.",
    ondernemerstype: "ondernemers met oog voor presentatie die online soms achterlopen op hun fysieke zaak",
  },
  Someren: {
    vibe: "Peelland, ondernemers die ver weg kijken van de grote steden",
    zoekgedrag: "lokaal vertrouwen en mond-tot-mond, maar steeds vaker ook Google voordat iemand belt",
    detail: "Je concurrent is niet alleen de concurrent op de hoek. Het is ook degene in Eindhoven die ads op jouw regio zet.",
    ondernemerstype: "nuchtere Peellanders die geen poespas willen",
  },
  Amsterdam: {
    vibe: "hoog tempo, veel concurrentie, iedereen is 'expert' tot je de cijfers vraagt",
    zoekgedrag: "Amsterdam zoekt scherp en vergelijkt drie offertes voordat de koffie koud is",
    detail: "Van centrum tot Noord en de metropoolregio. Je klant heeft weinig geduld en veel keuze.",
    ondernemerstype: "ondernemers die snel willen schalen maar genoeg bullshit hebben gehoord",
  },
  Rotterdam: {
    vibe: "haven, logistiek, directe taal en geen tijd voor zweven",
    zoekgedrag: "Rotterdam zoekt concreet. Minder flair in de zoekterm, meer 'wie lost dit op?'",
    detail: "Kop van Zuid, havengebied, maar ook sterke regio Zuid-Holland die op Rotterdam leunt.",
    ondernemerstype: "no-nonsense ondernemers die resultaat meten in cijfers",
  },
  Utrecht: {
    vibe: "centraal, veel kantoren, startups en gevestigde MKB door elkaar",
    zoekgedrag: "Utrecht zoekt breed en vergelijkt online voordat iemand belt",
    detail: "Centrum, Leidsche Rijn, Science Park. Je bereik gaat verder dan je postcode.",
    ondernemerstype: "ondernemers die snappen dat online groei geen bijzaak is",
  },
  "Den Haag": {
    vibe: "overheid, internationaal, zakelijke dienstverlening en sterke regio",
    zoekgedrag: "Den Haag zoekt vaak op expertise en vertrouwen. B2B en diensten domineren",
    detail: "Statengebied, Scheveningen, maar ook het zakelijke netwerk in de regio.",
    ondernemerstype: "professionele ondernemers die reputatie online even serieus nemen als offline",
  },
  Groningen: {
    vibe: "noordelijk ondernemerschap, studentenstad en stevig MKB",
    zoekgedrag: "Groningen zoekt lokaal en regionaal. Vertrouwen en reviews tellen zwaar",
    detail: "Centrum, bedrijventerreinen, maar ook bereik naar Drenthe en Friesland.",
    ondernemerstype: "ondernemers die direct zijn en weinig geduld hebben voor jargon",
  },
  Maastricht: {
    vibe: "Limburg aan de grens, horeca, retail en zakelijke diensten",
    zoekgedrag: "Maastricht zoekt lokaal en vergelijkt met zowel NL als BE concurrentie",
    detail: "Binnenstad, universiteit, maar ook sterke regio Zuid-Limburg.",
    ondernemerstype: "ondernemers die persoonlijk contact waarderen en online hetzelfde verwachten",
  },
  Enschede: {
    vibe: "tech, kennis en oost-Nederlands ondernemerschap",
    zoekgedrag: "Enschede zoekt op expertise. Veel B2B en dienstverlening in de zoekintentie",
    detail: "Kennispark, centrum, maar ook Twente breed als je marktgebied.",
    ondernemerstype: "praktische ondernemers die techniek en marketing willen laten kloppen",
  },
  Zwolle: {
    vibe: "logistiek, overheid en centraal gelegen MKB",
    zoekgedrag: "Zwolle zoekt functioneel en regionaal. 'Bij mij in de buurt' komt veel voor",
    detail: "IJsselstad, bedrijventerreinen, bereik naar Kop van Overijssel.",
    ondernemerstype: "nuchtere ondernemers die willen groeien zonder onnodige complexiteit",
  },
  Deventer: {
    vibe: "historisch, creatief en ondernemend tussen Apeldoorn en Zwolle",
    zoekgedrag: "Deventer zoekt lokaal met karakter. Minder massa, meer vertrouwen",
    detail: "Bergkwartier, haven, maar ook ondernemers die op Apeldoorn en Zwolle meeconcurren.",
    ondernemerstype: "ondernemers die kwaliteit willen en online niet achter willen lopen",
  },
  Helmond: {
    vibe: "industrie, automotive en een stad die groeit terwijl je kijkt",
    zoekgedrag: "Helmond zoekt concreet. Dienstverleners en B2B domineren veel zoekopdrachten",
    detail: "Automotive Campus, centrum, maar ook Asten en de regio die op Helmond leunt.",
    ondernemerstype: "makers en dienstverleners die resultaat meten in orders, niet in likes",
  },
  Weert: {
    vibe: "Limburg aan de rand van Brabant, gezellig maar zakelijk genoeg",
    zoekgedrag: "Weert en omgeving zoekt lokaal. Grens met België betekent soms dubbele concurrentie",
    detail: "Binnenstad, bedrijventerreinen, en klanten die ook in Nederweert en Leudal zoeken.",
    ondernemerstype: "ondernemers die persoonlijk contact waarderen en online hetzelfde verwachten",
  },
};

const DEFAULT_CITY: CityVoiceProfile = {
  vibe: "een regio met eigen karakter en eigen zoekgewoonten",
  zoekgedrag: "mensen die lokaal zoeken willen bewijs dat je er echt zit, niet alleen een adres in de footer",
  detail: "je markt is groter dan je straat. Je concurrentie ook.",
  ondernemerstype: "ondernemers die genoeg generieke sites hebben gezien",
};

export function cityProfile(city: string): CityVoiceProfile {
  return CITY_VOICE[city] ?? DEFAULT_CITY;
}

/** Thuisbasis: unieke story-openers alleen voor Apeldoorn-pagina's */
export const APELDOORN_STORY_TITLES: readonly string[] = [
  "Ik zit in Apeldoorn. Jouw {kw} ook?",
  "Veluwe-ondernemers verdienen beter dan Randstad-copy",
  "Vanaf Apeldoorn: {kw} zonder bureau op afstand",
  "Paleisstad, maar je Google Ads zijn geen sprookje",
  "Hier bouw ik. Hier meet ik. Hier zeg ik nee als het niet klopt.",
  "Apeldoorn googelt. Sta jij in het antwoord of in de ruis?",
  "MKB op de Veluwe heeft geen tijd voor marketingtheater",
  "Meneer Marketing thuisbasis: {kw} met lokale context",
];

export const APELDOORN_STORY_BODY: readonly string[] = [
  "Ik ben gevestigd in Apeldoorn. Echt hier, met een echt adres op de Veluwe. Als jij en ik afspreken, is dat hier of online met schermen open: je account, je site, je cijfers.",
  "{kw} in Apeldoorn betekent voor mij: je concurreert met lokale ondernemers én met bureaus uit de Randstad die jouw regio targeten met ads. Dan wil je landings die snel zijn en een plan dat je marge kent.",
  "Van Osseveld tot Ugchelen, van Beekbergen tot centrum: je klant zoekt 'bij mij in de buurt'. Je Google Business Profile, je site en je campagnes moeten hetzelfde verhaal vertellen.",
  "Elk traject deed ik niet vanuit een template. Apeldoornse en Brabantse ondernemers krijgen hetzelfde: custom build, eerst fundament, dan schalen.",
  "Ik werk veel op de Veluwe en in Gelderland, en landelijk als het project past. {kw} is geen postcodewedstrijd. Het is wel makkelijker als je partner weet hoe de regio zoekt.",
  "Apeldoorn heeft meer ondernemerschap dan mensen denken. Logistiek, dienstverlening, retail, B2B. Allemaal typen '{kw}' anders. Jij wilt iemand die dat snapt zonder uitleg over de A1.",
  "Als je ads draaien op een site die op mobiel traag is, zie ik dat hier eerder dan een bureau in Utrecht. Ik test lokaal, op 4G, op de telefoon die je klant ook heeft.",
  "Eerlijk: ik neem niet elke opdracht aan. Past {kw} niet bij je marge of timing, zeg ik het. Liever een nee in Apeldoorn dan drie maanden retainer voor sentiment.",
  "De Veluwe is geen niche. Het is een markt met eigen tempo. Ondernemers die werken, niet veel woorden nodig hebben, en online willen groeien zonder page builder-gedoe.",
  "ChatGPT en Google komen langs. Wie {kw} serieus neemt, bouwt antwoord-pagina's, schema en een stem die klinkt als een mens. Bij voorkeur eentje die aan tafel zit in Apeldoorn.",
];

export const APELDOORN_COFFEE_CHATS: readonly {
  context: string;
  lines: readonly { who: "ondernemer" | "meneer" | "stem"; text: string }[];
}[] = [
  {
    context: "Kantoor Apeldoorn, ochtendkoffie",
    lines: [
      { who: "ondernemer", text: "Je zit hier echt? Niet alleen een adres voor Google?" },
      { who: "meneer", text: "Echt. Apeldoorn is thuisbasis. Ik bouw en optimaliseer hier. Jouw {kw} bespreek ik met je site en je cijfers open, niet met een deck vol vage slides." },
      { who: "ondernemer", text: "We hebben al een bureau in Utrecht." },
      { who: "meneer", text: "Prima. Vraag ze wanneer ze voor het laatst je zoektermenrapport én je mobiele landings naast elkaar legden. Als het antwoord 'ehm' is, weet je genoeg." },
    ],
  },
  {
    context: "Intake bij ondernemer op bedrijventerrein Apeldoorn",
    lines: [
      { who: "ondernemer", text: "We willen {kw}. Lokaal en misschien landelijk." },
      { who: "meneer", text: "Dan begin ik met: wat verdient een lead of order? Wat lekt er nu? Ik zit om de hoek. Ik kan morgen je shop op mijn telefoon testen. Utrecht-bureau doet dat niet." },
      { who: "stem", text: "(Je concurrent uit Arnhem adverteert al op 'Apeldoorn + jouw dienst'.)" },
      { who: "meneer", text: "Zie je? Lokaal is geen footer-adres. Het is relevantie en snelheid." },
    ],
  },
  {
    context: "Telefoon, ondernemer in de file richting A1",
    lines: [
      { who: "ondernemer", text: "Kunnen we niet gewoon snel ads aanzetten voor {kw}?" },
      { who: "meneer", text: "Kunnen. Of je kunt geld verbranden met stijl. Eerst: converteert je site? Klopt tracking? Zo nee, fix ik dat. Ik zeg het hardop omdat ik je naast de A1 niet wil opzadelen met een lek account." },
    ],
  },
  {
    context: "Volgafspraak, cijfers op scherm",
    lines: [
      { who: "ondernemer", text: "Waarom schaal je niet direct op? De campagne draait toch?" },
      { who: "meneer", text: "Omdat CPA nog niet klopt met je marge. Ik schaal niet omdat de kalender het zegt. Ik schaal als je bankrekening het snapt. Apeldoorn of landelijk: die regel blijft." },
      { who: "ondernemer", text: "Eerlijk. Ik snap het." },
      { who: "meneer", text: "Dat is het hele punt van {kw} bij mij." },
    ],
  },
];

export const STORY_TITLES: Record<SeoLandingCategory, readonly string[]> = {
  "google-ads": [
    "Je dashboard liegt. Je bankrekening niet.",
    "Waarom je moeder je beste zoekwoordtest is",
    "De €47 klik die niemand wil uitleggen",
    "Performance Max is geen excuus om niks te snappen",
    "Je concurrent lacht. Zachtjes. Met jouw budget.",
    "Het account dat ik overnam had 847 zoektermen. 12 waren nuttig.",
    "Ads zijn een versterker. Jij stuurde ruis de versterker in.",
    "De landingspagina die je ad beloofde bestaat niet. Wel de rekening.",
    "ROAS groen, marge rood. Het klassieke verrassingsfeest.",
    "Je betaalt voor mensen die '{kw}' googelen en wegklikken",
  ],
  seo: [
    "Pagina 1 is geen finish. Het is toestemming om mee te doen.",
    "De stille concurrent heet ChatGPT",
    "Je footer-adres is geen lokale SEO-strategie",
    "Vijftig blogs en nul antwoorden",
    "Google leest je site als een strenge leraar",
    "Je rankt. Niemand klikt. Welkom op pagina 1, positie 8.",
    "De plugin die je SEO 'fixt' sloopt je snelheid",
    "Organisch is geen gratis lunch. Het is rente op goed werk.",
    "Je concurrent heeft minder content en meer autoriteit. Pijnlijk.",
    "Schema markup is geen trucje. Het is je CV voor robots.",
  ],
  website: [
    "Je neef heeft je site gebouwd. Nu wat?",
    "De homepage die niemand koopt",
    "Mooi design, trage site, lege inbox",
    "Je site is je verkoopgesprek om 23:07 op zondag",
    "WordPress met veertien plugins is geen plan",
    "De hero met vijf slides die niemand ziet",
    "From scratch is geen buzzword. Het is geen theme-gedoe.",
    "Je formulier werkt op desktop. Op mobiel? Succes.",
    "De CTA onder de fold verdween in een stockfoto van mensen die lachen",
    "Je site laadt langzamer dan je klant geduld heeft",
  ],
  shopify: [
    "Je shop draait. Maar groeit hij?",
    "De app-store die je CWV vermoordde",
    "Theme-store met je logo is geen merk",
    "Sterke shops bouw ik anders. Jij kunt dat patroon volgen.",
    "Je feed is afgekeurd en niemand las de foutmelding",
    "WooCommerce migratie zonder redirects is SEO-zelfmoord",
    "B2B op Shopify is geen mythe. Het is configuratie.",
    "Je winkelwagen haakt af. Je ads merken het niet. Jij wel.",
    "Elke app is JavaScript. Te veel apps is trage shop is dure klik.",
    "Shopping ads op een shop die niet converteert is dure hobby",
  ],
  content: [
    "Content is geen volume-spel",
    "Drie blogs per week en nul leads",
    "AI-bulk zonder stem is ruis in een mooi jasje",
    "Je kalender is vol. Je inbox is leeg.",
    "Keywords proppen werkte in 2009. Het is nu 2026.",
    "Eiland-pagina's zonder interne links ranken als verlaten eilanden",
    "Je concurrent antwoordt de vraag. Jij linkt naar je homepage.",
    "Owned content op je domein blijft van jou. Huurgrond niet.",
    "ChatGPT citeert je concurrent. Niet omdat hij beter is. Omdat hij duidelijker is.",
    "Eén pagina die één vraag beantwoordt verslaat tien die eromheen draaien",
  ],
  "b2b-portal": [
    "Excel is geen CRM. Het is een noodoplossing met tabs.",
    "Je zakelijke klant wil om 22:00 bestellen. Jij wilt maandag mailen.",
    "Automatisering is saai tot je je uren terugziet",
    "Leads in Gmail verdwijnen sneller dan je denkt",
    "Je B2B-klant bestelt bij de concurrent omdat die een portaal heeft",
    "Handmatig orderverwerken schaalt niet. Jij wel, met pijn.",
    "n8n is geen speelgoed. Het is je team zonder burn-out.",
    "B2B-klanten bestelden anders via portaal. Jouw proces kan ook.",
    "Koppelingen zijn saai. Foutieve orders zijn duur.",
    "Je verkoopt aan bedrijven alsof het 2004 is",
  ],
};

export const COFFEE_CHATS: Record<
  SeoLandingCategory,
  readonly { context: string; lines: readonly { who: "ondernemer" | "meneer" | "stem"; text: string }[] }[]
> = {
  "google-ads": [
    {
      context: "Koffiecorner, dinsdag 09:14",
      lines: [
        { who: "ondernemer", text: "We zetten €3.000 per maand in Google Ads. Waarom komen er geen aanvragen?" },
        { who: "meneer", text: "Laat me je zoektermenrapport zien. ... Oké. Je betaalt voor 'gratis {kw}'. Dat zijn mensen die nooit betalen." },
        { who: "ondernemer", text: "Maar Google zei dat broad match slim leren is." },
        { who: "meneer", text: "Google leert van jouw data. Als jouw data rommel is, leert het rommel. Ik begin met strakke intentie en een landingspagina die niet op mobiel crasht." },
        { who: "stem", text: "(Je telefoon: 47 notificaties van je ads-account. Nul leads.)" },
      ],
    },
    {
      context: "Telefoon, vrijdagmiddag",
      lines: [
        { who: "ondernemer", text: "Mijn vorige bureau stuurde elke maand een PDF met groene pijltjes." },
        { who: "meneer", text: "En je omzet?" },
        { who: "ondernemer", text: "Die bewoog niet." },
        { who: "meneer", text: "Dan waren de pijltjes decoratie. Bij {kw} kijk ik eerst naar marge, tracking en wat er gebeurt ná de klik. Niet naar impressies." },
        { who: "meneer", text: "Soms is het antwoord: ads even uit tot je site klopt. Dat zeg ik ook. Liever eerlijk dan retainer." },
      ],
    },
  ],
  seo: [
    {
      context: "Intake, eerste gesprek",
      lines: [
        { who: "ondernemer", text: "We willen hoger in Google voor {kw}. Hoe snel?" },
        { who: "meneer", text: "Eerlijke antwoord: snelle wins bestaan. Dominantie kost tijd. Wat ik niet beloof: pagina 1 in vier weken." },
        { who: "ondernemer", text: "Ons vorige bureau beloofde dat wel." },
        { who: "meneer", text: "En waar sta je nu?" },
        { who: "ondernemer", text: "...pagina 2." },
        { who: "meneer", text: "Pagina 2 is de plek waar je bijna wint en niemand klikt. Ik fix techniek, intentie en content die één vraag echt beantwoordt." },
      ],
    },
    {
      context: "Zoom, GBP open op scherm",
      lines: [
        { who: "ondernemer", text: "We hebben toch een Google Business Profile? Dat is toch {kw}?" },
        { who: "meneer", text: "Het is een deel. Een profiel met drie reviews uit 2019 is een spookhuis met deur op slot." },
        { who: "meneer", text: "Je site moet hetzelfde verhaal vertellen. Je landings moeten de vraag beantwoorden. Dan pas kijk ik naar domineren in {city}." },
        { who: "stem", text: "(Je concurrent heeft gisteren nog een post geplaatst. Jij niet.)" },
      ],
    },
    {
      context: "Telefoon, ondernemer in de auto",
      lines: [
        { who: "ondernemer", text: "ChatGPT noemt ons niet als ik vraag wie goed is in {kw}." },
        { who: "meneer", text: "Logisch. AI citeert wie duidelijk en consistent is. Bulk blogs van 300 woorden helpen daar niet." },
        { who: "meneer", text: "Ik bouw antwoord-pagina's, schema, interne links. Saai werk. Tot je in het antwoord staat." },
      ],
    },
  ],
  website: [
    {
      context: "Bij je aan tafel, laptop open",
      lines: [
        { who: "ondernemer", text: "Onze site is toch mooi? We hebben net een nieuw theme." },
        { who: "meneer", text: "Mooi is goed. Laadt hij op 4G binnen drie seconden?" },
        { who: "ondernemer", text: "Geen idee." },
        { who: "meneer", text: "Dan is {kw} vooral een theme met je logo. Ik meet, bouw from scratch waar nodig, en zorg dat je CTA zichtbaar is voordat je bezoeker wegscrollt." },
        { who: "stem", text: "(Je bounce rate fluistert: ja hoor.)" },
      ],
    },
  ],
  shopify: [
    {
      context: "Shop review, scherm gedeeld",
      lines: [
        { who: "ondernemer", text: "We hebben twaalf apps geïnstalleerd. Dat is toch normaal?" },
        { who: "meneer", text: "Normaal is niet hetzelfde als slim. Elke app is JS. Je shop wordt trager. Trager = duurdere ads en minder conversie." },
        { who: "ondernemer", text: "Maar de apps beloven meer omzet." },
        { who: "meneer", text: "Ze beloven. Ik meet. Bij {kw} begin ik met feed, snelheid en checkout. Niet met de app van de week." },
      ],
    },
  ],
  content: [
    {
      context: "Contentstrategie gesprek",
      lines: [
        { who: "ondernemer", text: "We publiceren drie blogs per week. Waarom geen leads?" },
        { who: "meneer", text: "Omdat niemand vroeg om drie blogs. Mensen vragen: hoe los ik X op? Beantwoord X. Eén pagina. Scherp. Intern gelinkt." },
        { who: "ondernemer", text: "Maar concurrent X post elke dag." },
        { who: "meneer", text: "Concurrent X heeft ook vijftig pagina's die niemand leest. Volume is geen strategie. {kw} draait om antwoorden die geld opleveren." },
      ],
    },
  ],
  "b2b-portal": [
    {
      context: "Proces-scan bij een groothandel",
      lines: [
        { who: "ondernemer", text: "Onze B2B-klanten bellen liever. Dat werkt al twintig jaar." },
        { who: "meneer", text: "Twintig jaar geleden bestelde niemand op z'n telefoon om 22:00. Nu wel. Bij je concurrent soms ook." },
        { who: "ondernemer", text: "Een portaal klinkt duur." },
        { who: "meneer", text: "Handmatig orders overtypen klinkt goedkoop tot je de uren en fouten optelt. {kw} gaat over tijd terug en minder chaos." },
      ],
    },
  ],
};

export const RANTS: Record<SeoLandingCategory, readonly string[]> = {
  "google-ads": [
    "Ik word moe van accounts waar broad match de standaard is en niemand het zoektermenrapport opent. Je betaalt niet voor 'leren'. Je betaalt voor klikken. Als je niet weet welke zoektermen geld kosten, ben je geen adverteerder. Je bent een sponsor van Google.",
    "Performance Max is handig. Het is geen excuus om je feed, je landings en je conversiedata niet op orde te hebben. De zwarte doos werkt beter met schone input. Rommel erin is budget eruit.",
    "ROAS op je dashboard zonder marge in je hoofd is cosplay ondernemer zijn. Groen kan nog steeds verlies betekenen. Reken terug naar je bankrekening, niet naar je bureau-PDF.",
  ],
  seo: [
    "Als ik nog één site zie met 'kwaliteit en service' op de homepage en nergens een concreet antwoord, ga ik zachtjes huilen in PageSpeed Insights. Google rankt geen slogans. Mensen ook niet.",
    "Bulk AI-blogs van 400 woorden zonder expertise zijn geen SEO. Het is ruis met een publicatiedatum. Je concurrent met tien sterke pagina's wint van jouw vijftig middelmatige.",
    "Lokale SEO is niet je adres in de footer kopiëren op vijftien pagina's. Het is consistentie, reviews, GBP die leeft, en content die laat zien dat je {city} serieus neemt.",
  ],
  website: [
    "Een hero met vijf slides en geen duidelijke CTA is geen homepage. Het is een digitale rotonde waar niemand uit weet. {kw} begint met: waar moet deze klik naartoe om geld te verdienen?",
    "Page builders en themes zijn prima om te starten. Ze zijn een rem als je wilt schalen met ads en SEO. Dan wil je code die iemand durft aan te raken. From scratch is geen flex. Het is vrijheid.",
    "Je formulier dat op mobiel niet werkt kost je elke dag leads. Test het zelf. Op je telefoon. Nu. Ik wacht.",
  ],
  shopify: [
    "Shopify apps die elkaar tegenwerken zijn de stille moordenaar van je marge. Je shop wordt trager, je ads duurder, je checkout haakt af. En dan koop je nog een app om conversie te 'fixen'.",
    "Merchant Center diagnostics negeren en toch Shopping draaien is als rijden met een waarschuwingslampje en hopen dat het meevalt. Het valt niet mee. Je feed liegt tegen je.",
    "B2B op Shopify kan. 'Kan niet' is vaak code voor 'niemand heeft het goed geprobeerd'. Configuratie en vakmanschap bepalen het.",
  ],
  content: [
    "Contentkalenders vol onderwerpen waar niemand om vroeg zijn mijn allergie. Schrijf wat je klanten echt vragen. Niet wat je stagiair interessant vond op Pinterest.",
    "Keywords overal proppen werkte toen je nog een Nokia had. Nu wil Google intentie, structuur en een stem die klinkt als iemand die weet waar hij het over heeft.",
    "Social posts verdwijnen in de tijdlijn. Content op je domein blijft werken. Owned media is saai tot je ziet wat het oplevert zonder elke dag te betalen voor bereik.",
  ],
  "b2b-portal": [
    "Excel met acht tabs en 'even handmatig overzetten' is geen schaalbaar proces. Het is een parttimebaan die niemand op zijn cv wil zetten.",
    "Leads die in Gmail blijven hangen zijn leads die sterven. Automatisering is geen luxe voor later. Later is wanneer je concurrent al een portaal heeft.",
    "Ik verkoop geen software. Ik verkoop dat je team stopt met copy-paste werk en weer gaat doen waar je goed in bent. {kw} is saai op papier. Op je bankrekening niet.",
  ],
};

export const ANALOGIES: Record<SeoLandingCategory, readonly { title: string; setup: string; punchline: string }[]> = {
  "google-ads": [
    {
      title: "Als {kw} een restaurant was",
      setup: "Je zet een neonreclame op het hoogste gebouw van de stad. Iedereen ziet hem. Maar de deur zit op slot, het menu is onleesbaar en de keuken is dicht op zondag.",
      punchline: "Dat is ads zonder landingspagina, tracking en marge. Veel kijkers. Weinig eters. Jij betaalt het neon.",
    },
    {
      title: "Als je budget een hond was",
      setup: "Je laat hem los in een park vol eekhoorns. Hij rent. Enorm veel energie. Je bent moe. Er is niks mee opgeleverd.",
      punchline: "Broad match zonder negatieven is die hond. Leuk bewegen. Nul resultaat.",
    },
  ],
  seo: [
    {
      title: "Als Google een bibliothecaris was",
      setup: "Je brengt vijftig boeken binnen met dezelfde titel in een andere kleur. De bibliothecaris zucht. Legt ze in de kelder.",
      punchline: "Dunne duplicate content rankt niet. Eén goed boek wint.",
    },
  ],
  website: [
    {
      title: "Als je site een winkel was",
      setup: "Mooie etalage. Glazen deur. Binnen: geen prijskaartjes, geen kassa, geen medewerker. Alleen een bord met 'Welkom bij ons'.",
      punchline: "Dat is een homepage zonder CTA. Mensen kijken en lopen door.",
    },
  ],
  shopify: [
    {
      title: "Als je shop een supermarkt was",
      setup: "Klanten staan in de rij. Bij de kassa blijkt de pin het niet te doen, de tas scheurt en de bonuskaart werkt alleen op dinsdag.",
      punchline: "Checkout-frictie doodt omzet harder dan je denkt. Ads sturen mensen naar de rij. Jij laat ze afhaken.",
    },
  ],
  content: [
    {
      title: "Als content een antwoord op Quora was",
      setup: "Iemand vraagt: hoe fix ik X? Jij schrijft drie pagina's over je bedrijfsgeschiedenis en noemt X één keer in de footer.",
      punchline: "Je wordt niet upvoted. Je wordt niet geciteerd. Je wordt niet gevonden.",
    },
  ],
  "b2b-portal": [
    {
      title: "Als je orderproces een taxi was",
      setup: "Je belt. Niemand neemt op. Je mailt. Antwoord maandag. Je bestelt bij de concurrent die een app heeft.",
      punchline: "B2B-frictie kost je niet één order. Het kost je de klant.",
    },
  ],
};

export const NIGHTMARES: Record<SeoLandingCategory, readonly string[]> = {
  "google-ads": [
    "Je beste campagne draait op broad match. Half je budget gaat naar 'gratis' en 'vacature'.",
    "Je landingspagina laadt 6 seconden op mobiel. Je betaalt premium voor afhakers.",
    "Conversietracking telt elke paginaweergave mee. Je optimaliseert op fantasie.",
    "Je bureau schaalt budget omdat de maand bijna om is, niet omdat het rendeert.",
    "Je Merchant Center feed heeft stille fouten. Shopping toont verkeerde prijzen.",
    "Remarketing op mensen die al kochten. Je betaalt om je eigen klanten terug te kopen.",
  ],
  seo: [
    "Je hebt 200 pagina's. Niet één beantwoordt één vraag goed.",
    "Je LCP is rood. Google ziet het. Gebruikers ook.",
    "Je GBP heeft drie reviews uit 2019. Je concurrent heeft er veertig.",
    "Interne links ontbreken. Elke pagina is een eiland.",
    "Je canonicals wijzen naar de verkeerde URL. Google is in de war. Jij ook.",
    "ChatGPT noemt je concurrent. Niet jou. Omdat hij duidelijker schrijft.",
  ],
  website: [
    "Je formulier werkt niet op Safari. 40% van je verkeer ziet een dode knop.",
    "Je hero is 90vh. Je CTA zit onder de fold op een iPhone SE.",
    "Je sitemap bevat 404's. Google crawlt zich suf aan kapotte links.",
    "Je gebruikt H1 voor je logo en H4 voor je belangrijkste kop.",
    "Je laadt tien scripts voor een cookiebanner en vraagt je af waarom je site traag is.",
    "Je contactpagina is een mailto-link. Leads verdwijnen in de void.",
  ],
  shopify: [
    "Je checkout haakt af bij verzendkosten die pas op het eind verschijnen.",
    "Je producttitels zijn interne codes. Google Shopping begrijpt het niet.",
    "Je hebt 15 apps. Je PageSpeed score huilt.",
    "Abandoned cart mails staan uit. Geld ligt op de grond.",
    "Je B2B-klanten moeten mailen terwijl je B2C-shop in drie klikken werkt.",
    "Redirects na migratie ontbreken. Organisch verkeer valt weg.",
  ],
  content: [
    "Je blog heeft posts zonder auteur, datum of interne links.",
    "Je schrijft voor Google. Niemand menselijks wil het lezen.",
    "Je FAQ is copy-paste van je homepage. Niemand rankt ermee.",
    "Je content noemt je diensten niet. Lezers weten niet wat ze moeten doen.",
    "Je publiceert in batches en verdwijnt drie maanden. Google merkt het.",
    "AI-content zonder review gaat live met foute prijzen in.",
  ],
  "b2b-portal": [
    "Orders komen binnen via WhatsApp, mail en telefoon. Niets klopt in je admin.",
    "Je prijslijst zit in PDF. Klanten bestellen de oude prijs.",
    "Leads uit je formulier belandt in spam bij iemand die al drie maanden weg is.",
    "Je voorraad klopt niet met je shop. Klanten bestellen wat niet bestaat.",
    "Je team typt dezelfde data in drie systemen. Fouten verdrievoudigen.",
    "Automatisering staat op de roadmap. De roadmap is twee jaar oud.",
  ],
};

export const CONFESSIONS: readonly { title: string; body: string }[] = [
  {
    title: "Ik heb ook weleens te laat 'nee' gezegd",
    body: "Een keer draaide ik ads op een shop die op mobiel niet werkte. Ik dacht: ik fix het onderweg. Dom. Nu check ik eerst de site. Altijd. Liever een week later live met kans op winst dan direct live met zekerheid op verlies.",
  },
  {
    title: "Ik vind Merchant Center diagnostics spannend",
    body: "Niet romantisch spannend. Angst-spannend. Eén afgekeurde feed kan je hele Shopping-week slopen. Ik lees die foutmeldingen als briefjes van je bankrekening.",
  },
  {
    title: "Ik heb een hekel aan rapporten die alleen indruk maken",
    body: "Als je maandrapport vijf pagina's is en geen enkele zin zegt wat ik volgende maand anders doe, is het decoratie. Ik stuur liever drie regels die ertoe doen.",
  },
  {
    title: "Soms is het antwoord: nog even niks",
    body: "Niet elke opdracht moet nu starten. Als je marge, product of site niet klaar is, zeg ik dat. {kw} helpt niet als de rest tegenwerkt. Dat is geen minder werk voor mij op lange termijn. Het is vertrouwen.",
  },
  {
    title: "Ik bouw liever dan dat ik vergader",
    body: "Intake, plan, uitvoeren. Workshops over je 'merkessentie' sla ik over. Die essentie zie ik in je cijfers, je klanten en je site. De rest komt tijdens het werk.",
  },
];

export const INNER_MONOLOGUE: Record<SeoLandingCategory, readonly { inHead: string; reality: string }[]> = {
  "google-ads": [
    {
      inHead: "We zetten het budget omhoog. Dan komt de omzet vanzelf.",
      reality: "Zonder marge, tracking en landings die converteren, zet je het lek groter. Eerst meten wat een klik waard is. Dan pas gas.",
    },
    {
      inHead: "Google weet wel wat goed is voor ons.",
      reality: "Google weet wat goed is voor Google. Jij moet weten wat goed is voor jouw bankrekening. Dat zijn niet altijd dezelfde dingen.",
    },
  ],
  seo: [
    {
      inHead: "We hebben net een blog geschreven. SEO is geregeld.",
      reality: "Eén blog is geen strategie. {kw} is techniek, structuur, interne links en pagina's die één intentie bedienen. Structureel.",
    },
    {
      inHead: "Onze concurrent rankt hoger. Die moet wel spam gebruiken.",
      reality: "Soms rankt hij hoger omdat zijn pagina sneller is, duidelijker antwoordt en meer vertrouwen uitstraalt. Saai. Waar.",
    },
  ],
  website: [
    {
      inHead: "De site is toch af? We hebben hem live gezet.",
      reality: "Live is niet af. {kw} is een fundament dat meegroeit met campagnes, SEO en je aanbod. Anders herbouw je over een jaar.",
    },
  ],
  shopify: [
    {
      inHead: "Shopify is plug and play. We hebben een theme.",
      reality: "Theme is start. Schaal vraagt feed, snelheid, flows en soms custom. Serieus schalen vraagt vakmanschap.",
    },
  ],
  content: [
    {
      inHead: "Meer content = beter vindbaar.",
      reality: "Meer antwoorden op echte vragen = beter vindbaar. Het verschil is groot.",
    },
  ],
  "b2b-portal": [
    {
      inHead: "Onze klanten willen persoonlijk contact. Een portaal is te koud.",
      reality: "Sommigen willen bellen. Velen willen om 22:00 bestellen zonder te wachten. Geef beide. Verlies geen van beide.",
    },
  ],
};

/** Grote paragraafbanken: per slug unieke combinatie via pickMany */
export const STORY_BODY_BANK: Record<SeoLandingCategory, readonly string[]> = {
  "google-ads": [
    "Je opent Google Ads op een dinsdagochtend. Groene pijltjes. Meer klikken. Je voelt je even de slimste ondernemer van {city}. Tot je boekhouder vraagt waarom de omzet niet meebeweegt.",
    "Ik zette ads pas aan toen organisch verkeer al bewees dat de shop overtuigde. Marge per product bepaalde welke campagne überhaupt budget kreeg.",
    "{kw} is geen sport van klikken maximaliseren. Het is de juiste klik krijgen en die niet laten weglopen. Daarvoor moet iemand je account én je website lezen alsof het hun eigen geld is.",
    "Als je moeder jou niet vindt als ze '{kw}' googelt, vindt je ideale klant je soms ook niet. Of erger: hij vindt je wel en vertrekt binnen vier seconden.",
    "Performance Max zonder schone feed en landings is een verrassingsbox. Soms verrast die positief. Vaker niet. Ik wil liever weten waar mijn geld naartoe gaat.",
    "Negatieven zijn geen vijand van groei. Ze zijn je vriend tegen 'gratis', 'vacature' en 'wiki'.",
    "Je remarketing-list die iedereen bevat die ooit je homepage bezocht, is geen remarketing. Het is stalken met je eigen budget.",
    "Conversiewaarde meesturen klinkt saai. Het is het verschil tussen optimaliseren op leads die niets kopen en leads die je bankrekening kennen.",
    "In {region} zie ik vaak hetzelfde: ads draaien op een site die op mobiel niet meedoet. Dan is {kw} een dure taxi naar een gesloten deur.",
    "Ik werk met Google Ads én Meta onder één strategie. Je klant leeft niet in silo's. Hij ziet je ad, scrollt terug, googelt later, koopt of niet.",
    "Soms is het antwoord: ads even uit. Dat zeg ik ook. Liever eerlijk dan drie maanden retainer om je te vertellen wat je wilt horen.",
    "Je bureau dat elke maand budget opschaalt omdat de maand bijna om is, is geen partner. Het is een timer met je pinpas.",
  ],
  seo: [
    "Er is iets erger dan niet ranken: ranken op pagina 2. Je bent er bijna. Google knipoogt. Maar niemand klikt.",
    "Ik bouw sites in Next.js en Shopify. Daardoor kan ik SEO niet uitbesteden aan 'iemand anders die de techniek doet'. Techniek en content zijn één keten.",
    "Terwijl jij focust op klassieke rankings, vraagt een deel van je markt al aan ChatGPT: wie moet ik inhuren voor {kw}? Sta jij niet in dat antwoord, ben je geen optie.",
    "Bulk AI-blogs van 300 woorden helpen je in geen van beide werelden. Google en mensen belonen content die niet klinkt als een commissie die 'synergie' heeft getypt.",
    "Lokaal{loc} telt mee: Google wil weten waar je hangt, of je profiel leeft, of mensen je vermelden.",
    "Interne links zijn geen SEO-trucje. Het is een routekaart voor Google en voor je bezoeker. Eiland-pagina's verzuipen.",
    "Je canonical naar de verkeerde URL is een kleine regel die grote schade kan doen. Techniek is saai tot het niet werkt.",
    "Schema markup is je CV voor robots. Pagina 1 is geen garantie. Wel duidelijkheid over wie je bent en wat je doet.",
    "Vijftig dunne pagina's verliezen van tien die écht helpen. Volume was nooit de strategie. Antwoorden wel.",
    "Core Web Vitals zijn geen bijlage. Ze zitten in hoe ik bouw. Trage site, moeilijke rankings. Simpel.",
    "Reviews uit 2019 op je GBP zijn een signaal dat je offline misschien goed zit, maar online stilstaat.",
    "{kw} vraagt consistentie: wat op je site staat, wat in je profiel staat, wat AI over je zegt. Eén waarheid.",
  ],
  website: [
    "Je neef is aardig. WordPress staat. Er is een logo. Maar {kw} betekent niet 'iemand kent WordPress'. Het betekent: snel, mobiel, vindbaar, converteerbaar.",
    "Ik promoot geen templates of page builders. Ik bouw from scratch in Next.js omdat maatwerk dan geen marketingterm is, maar wat je krijgt.",
    "Een site is geen online visitekaartje meer. Het is je verkoopgesprek om 23:00 uur op zondag. Als dat gesprek vaag is, is {kw} geld naar een mooie façade zonder deuren.",
    "Soms is het antwoord: niet de homepage. Soms is het een landingspagina per dienst, per product, per regio{loc}. Saai? Effectief.",
    "Ik bouw sites alsof marketing er al op zit. Want straks zit marketing erop. Dan wil je geen redesign omdat je CTA verdween in een hero met stockfoto's.",
    "Semantische HTML is geen nerd-detail. Het is hoe Google en screenreaders begrijpen wat belangrijk is.",
    "Je formulier dat op Safari faalt, is elke dag leads die je nooit ziet in je dashboard.",
    "Migratie van WordPress naar custom is soms de opdracht. Dan zet ik redirects goed of ik accepteer dat Google even chagrijnig is.",
    "Design zonder snelheid is een museum. Mooi om naar te kijken. Niemand koopt er.",
    "Je sitemap met 404's is een uitnodiging aan Google om te stoppen met vertrouwen.",
    "From scratch wil zeggen: geen theme dat je groei remt, geen code die niemand durft aan te raken.",
    "Landings voor campagnes bouw ik mee. Niet als afterthought. Als onderdeel van {kw}.",
  ],
  shopify: [
    "Shopify maakt starten makkelijk. Schalen is waar het pijn doet. Feeds, apps, B2B, internationalisering: het vraagt keuzes.",
    "Mijn referentie: custom theme, B2B-laag, eerst organisch, daarna ads. Elk product verdient een eigen verhaal.",
    "{kw} zonder die context is een theme-store met je logo erop. Dat kan werken. Tot je wilt groeien.",
    "Merchant Center diagnostics negeren is als rijden met een waarschuwingslampje. Het valt niet mee.",
    "Elke app is JS. Te veel apps = trage shop = duurdere ads. Reken het door.",
    "Abandoned cart flows die uit staan zijn geld op de grond. Gratis geld, als je ze aanzet.",
    "B2B op Shopify kan. 'Kan niet' is vaak 'het is verkeerd geprobeerd'.",
    "Migreren van WooCommerce zonder redirects is SEO-zelfmoord. Liever eerlijk over dip dan import-knop en hopen.",
    "Product-SEO begint bij titels die mensen en Google begrijpen, niet interne codes.",
    "Checkout-frictie zie je niet in je ads-dashboard. Wel in je omzet.",
    "Shopify groeit mee tot je shop vol hangt met apps die elkaar tegenwerken. Dan wordt {kw} een race tegen je eigen stack.",
    "Of je nu migreert of opschaalt: {kw} moet meegroeien met je marge, niet met je frustratie.",
  ],
  content: [
    "Er is een verschil tussen 'we publiceren drie blogs per week' en 'we beantwoorden vragen die geld opleveren'. {kw} faalt wanneer content een checkbox is.",
    "Ik schrijf in mensentaal. Soms grappig. Altijd direct. AI kan helpen om sneller te zijn. Het kan je stem niet vervangen als je geen stem hebt.",
    "{kw} werkt als elke pagina één ding doet: een zoekvraag beantwoorden beter dan de top 10 die er nu staat. Niet bijna. Beter.",
    "Eiland-pagina's zonder interne links ranken slecht. Je blog zonder link naar je dienst is een doodlopende weg.",
    "ChatGPT citeert wie duidelijk is. Niet per se wie het langst schrijft.",
    "Keywords proppen werkte vroeger. Intentie en structuur winnen nu.",
    "Owned content op je domein blijft van jou. Social verdwijnt in de feed.",
    "Contentkalenders vol onderwerpen waar niemand om vroeg zijn mijn allergie. Schrijf wat klanten echt vragen.",
    "Cases met echte cijfers gebruik ik waar het past. Niet als decoratie. Als bewijs.",
    "Vijftig artikelen die niemand leest vertellen Google: hier woont ruis.",
    "Eén sterke FAQ-pagina kan meer opleveren dan tien vage blogs.",
    "Meneer Marketing klinkt als iemand die aan tafel zit. Niet als een persbericht met 'innovatieve oplossingen'.",
  ],
  "b2b-portal": [
    "Je zakelijke klant wil om 22:00 uur bestellen. Jouw proces wil dat ze mailen en wachten tot maandag. Ondertussen bestelt de consument op je shop in drie klikken.",
    "{kw} gaat over systemen die schalen zonder dat je team verdubbelt. Portaal en flows kunnen het patroon volgen dat jij nodig hebt.",
    "Ik verkoop geen software. Ik verkoop tijd terug en minder fouten. {kw} is saai tot je ziet hoeveel uur er in handmatig werk zit.",
    "Excel met acht tabs is een parttimebaan. Niemand wil die baan. Automatisering wel.",
    "Leads in Gmail verdwijnen sneller dan je denkt. Een flow die ze opvolgt is geen luxe.",
    "Koppelingen tussen shop, CRM en e-mail zijn saai. Foutieve orders zijn duur.",
    "Of het nu gaat om Klaviyo, n8n, Make of custom API's: ik kies wat past bij je stack. Niet wat het hipst is.",
    "B2B-frictie zit niet in je product. Het zit in je proces. Mailtjes, wachten, verkeerde prijzen.",
    "Je concurrent met een portaal oogt moderner. Zelfs als zijn product gelijk is. Hoe oneerlijk ook.",
    "Automatisering op de roadmap sinds 2023 is geen roadmap. Het is uitstel.",
    "Handmatig orderverwerken schaalt niet. Jij wel, met hoofdpijn.",
    "{kw} fixt rotwerk zodat je team weer doet waar het goed in is.",
  ],
};

export const DEEPDIVE_BANK: Record<SeoLandingCategory, readonly string[]> = {
  "google-ads": [
    "Zoekmachine adverteren is keuzes maken: welke zoekwoorden mogen geld kosten, welke landings krijgen verkeer, welke producten hebben marge om te adverteren.",
    "Bij Shopping telt je feed. Bij Search telt message match. Bij Performance Max telt of je input schoon is voordat je de zwarte doos vertrouwt.",
    "Ik lees zoektermenrapporten alsof het mijn pinpas is. Want indirect is het dat.",
    "Lokaal adverteren kan{loc}, maar alleen als je profiel, site en landings kloppen. Anders betaal je voor clicks naar een spookhuis.",
    "Tracking die niet klopt is optimaliseren op fantasie. Fantasie ziet er op een dashboard best goed uit.",
    "Remarketing is krachtig als je weet wie je target. Niet als je iedereen target die ooit je favicon zag.",
    "Budget omhoog zonder bewijs is hoop. Budget omhoog met CPA of ROAS die klopt is schalen.",
    "Ads op een shop die niet converteert is water in een lekke emmer. Eerst het lek. Dan de kraan open.",
    "Ik combineer Search, Shopping en waar het past Meta. Niet omdat meer kanalen altijd beter zijn. Omdat je klant niet in één kanaal leeft.",
    "Je concurrent die '{kw}' adverteert met een slakkere site wint soms toch. Prijs en merk helpen. Maar niet voor altijd.",
    "Call tracking, lead forms, enhanced conversions: saai tot je ziet hoeveel je miste.",
    "Elk account heeft een eigen volgorde. Copy-paste bestaat niet.",
  ],
  seo: [
    "SEO is fundament: techniek, intentie, autoriteit. Minder trucjes, meer consistentie.",
    "Pagina's met één doel ranken beter dan pagina's die alles willen zijn.",
    "Ik schrijf niet voor robots. Maar ik respecteer robots. Crawlbaarheid, CWV, schema: ingebakken.",
    "{kw}{loc} vraagt dat je online hetzelfde verhaal vertelt als offline. Echte locatie, echt verhaal.",
    "Linkbuilding zonder goede content is een huis op zand. Content zonder techniek is een huis zonder fundering.",
    "AI-zoek vraagt om duidelijke antwoorden, merkinfo en pagina's die je expertise tonen.",
    "Je sitemap, robots.txt en canonicals zijn saai tot ze fout gaan. Dan zijn ze urgent.",
    "Lokale rankings hangen aan GBP, reviews, NAP en pagina's die regio serieus nemen.",
    "Internationale SEO? Hreflang en structuur. Vertaling met plan, niet alleen een knop en hopen.",
    "Content decay is echt. Pagina's van drie jaar geleden kunnen achteruit glijden. Onderhoud hoort erbij.",
    "Ik meet niet alleen posities. Ik meet clicks, leads en of het geld oplevert.",
    "Organisch verkeer is geen gratis lunch. Het is rente op goed werk. Die rente kan lang doorlopen.",
  ],
  website: [
    "Veel partijen verkopen design. Ik verkoop een machine die vindbaar is en converteert.",
    "Next.js voor maatwerk. Shopify voor shops. Custom code die je vrij laat groeien.",
    "{kw} is geen project van vier weken dat 'af' is. Het is een fundament waar marketing op staat.",
    "Landings voor campagnes, formulieren die werken, snelle assets: ingebouwd, niet geplakt.",
    "WordPress promoten doe ik niet. Migreren van WordPress wel, als dat de opdracht is.",
    "Je stack moet schaalbaar zijn. Theme-limieten merk je pas als je ads opschaalt.",
    "Accessibility is geen checkbox. Het is bereik en soms wettelijk verplicht.",
    "JSON-LD schema op je diensten en FAQ helpt Google en AI je te begrijpen.",
    "Ik test op mobiel eerst. Niet omdat het hip is. Omdat je verkeer daar zit.",
    "Custom build betekent: code die je team of ik later kan aanpassen zonder angst.",
    "Je site en je ads moeten hetzelfde beloven. Anders betaal je dubbel.",
    "Performance is conversie. Elke seconde telt. Vooral op 4G in {city}.",
  ],
  shopify: [
    "Shopify schaalt, tot apps je CWV slopen. Dan wordt {kw} een race tegen je eigen stack.",
    "Custom theme waar nodig. Apps alleen met business case. Feeds en SEO vanaf dag één.",
    "B2B, international, subscriptions: het kan. Met configuratie en soms custom.",
    "Productfeeds voor Google en Meta moeten kloppen. Prijs, voorraad, titel. Data die je kunt vertrouwen.",
    "Checkout-extensies en verzendlogica bepalen of mensen afhaken. Ads sturen ze ernaartoe.",
    "Theme 2.0 en sections zijn flexibel. Maar geen excuus voor trage assets.",
    "Shopify SEO: collecties, blogs, interne links, geen duplicate thin pages.",
    "Migratie: redirects, data, flows. Import-knop alleen is te mager.",
    "Serieus schalen vraagt iemand die Shopify als platform kent, niet als hobby.",
    "Abandoned cart, post-purchase, win-back: flows die geld opleveren zonder extra ad spend.",
    "B2B-portaal op Shopify: prijslijsten, klantgroepen, bestelhistorie. Kan.",
    "Je apps inventariseren elk kwartaal. Wat gebruik je? Wat kost het? Wat sloopt snelheid?",
  ],
  content: [
    "Contentmarketing is antwoorden verzamelen op vragen die klanten stellen, en die vindbaar neerzetten.",
    "Ik link content aan diensten, cases, techniek. Eilanden ranken slecht.",
    "{kw} werkt als je stem herkenbaar is. Meneer Marketing klinkt als tafel, niet als persbericht.",
    "Pillar pages en clusters geven structuur. Losse blogs zonder plan versnipperen autoriteit.",
    "FAQ's die echt zijn ranken soms beter dan blogs die eromheen draaien.",
    "AI als assistent: ja. AI als vervanging zonder review: nee.",
    "Content decay: oude posts updaten kan sneller winnen dan nieuwe maken.",
    "Interne links vanaf je sterkste pagina's tillen nieuwe content mee.",
    "Video en tekst samen kan. Maar transcribpt en structuur horen erbij voor SEO.",
    "Je tone of voice in content moet matchen met je ads en je site. Eén merk.",
    "ChatGPT-test: vraag wie ze aanraden. Niet op jouw merknaam. Op je branche.",
    "Eén pagina per intentie. Niet één pagina voor twintig zoekwoorden.",
  ],
  "b2b-portal": [
    "B2B-frictie zit in proces, niet in product. Mail, Excel, wachten op prijs.",
    "{kw} met portalen, flows en koppelingen die je team niet dagelijks hoeft te babysitten.",
    "Automatisering is hoe je schaalt zonder tien mensen aan te nemen die copy-pasten.",
    "n8n en Make zijn tools. Het gaat om welke flow je bouwt en wat die oplevert.",
    "Leads uit formulier naar CRM naar opvolging: geen handmatig tussenstation.",
    "B2B-prijzen en catalogi online vragen logica. Niet alles is standaard Shopify.",
    "B2B-klanten bestelden via portaal. Jouw sector kan een eigen variant hebben.",
    "Koppelingen met boekhouding en voorraad voorkomen dubbel werk en fouten.",
    "Self-service voor B2B betekent niet geen contact. Het betekent keuze.",
    "Je team meet uren op handmatig werk. Dat getal is je business case.",
    "API's en webhooks zijn saai tot je ziet wat ze vrijmaken.",
    "Later automatiseren is vaak te laat als orders al mislopen.",
  ],
};

export const MYTH_POOL: Record<SeoLandingCategory, readonly { myth: string; reality: string }[]> = {
  "google-ads": [
    { myth: "Meer budget lost het altijd op", reality: "Bij {kw} vermenigvuldig je eerst wat er al is. Lekt je site, dan lekt je budget harder." },
    { myth: "Broad match laat Google slim leren", reality: "Google leert van je data. Slechte data leert slechte dingen. Strak eerst." },
    { myth: "ROAS groen = feest", reality: "ROAS zonder marge is een feest in een huis dat je niet kunt betalen." },
    { myth: "Performance Max vervangt alles", reality: "PMax werkt beter met schone feeds en landings. Anders is het gokken met data." },
    { myth: "Klikken zijn succes", reality: "Klikken zonder conversie zijn een hobby. Een dure hobby." },
    { myth: "Je bureau kent je branche wel", reality: "Kennen is niet hetzelfde als je account elke week openen en bijsturen." },
    { myth: "Ads fixen een slechte site", reality: "Ads versterken wat er is. Slechte site = versterkte teleurstelling." },
    { myth: "Hoger bod = hogere positie = winst", reality: "Positie zonder relevantie en landings is geld naar de klikkerij." },
  ],
  seo: [
    { myth: "SEO is in drie maanden klaar", reality: "{kw} bouwt. Snelle wins bestaan, dominantie kost tijd." },
    { myth: "Meer blogs = beter", reality: "Vijftig dunne pagina's verliezen van tien die echt helpen." },
    { myth: "AI schrijft je SEO wel", reality: "AI zonder expertise produceert gemiddelde ruis." },
    { myth: "Meta keywords doen nog iets", reality: "Nee. Stop ermee. Het is 2026." },
    { myth: "Backlinks kopen is een shortcut", reality: "Soms een shortcut naar een penalty. Bouw autoriteit echt." },
    { myth: "Lokale SEO is alleen je adres", reality: "GBP, reviews, content en consistentie. Adres is het begin." },
    { myth: "HTTPS is optioneel", reality: "Niet sinds 2014 ongeveer. En Google vindt het nog steeds belangrijk." },
    { myth: "SEO en ads zijn vijanden", reality: "Ze vullen elkaar aan. Data van ads kan SEO informeren en andersom." },
  ],
  website: [
    { myth: "Een theme is goed genoeg", reality: "Voor serieus {kw} groei je vaak uit je theme." },
    { myth: "Mooi design is genoeg", reality: "Mooi zonder snelheid en CTA is een museum." },
    { myth: "WordPress is altijd goedkoopst", reality: "Tel dev-tijd, plugins en hacks mee." },
    { myth: "Mobiel komt later wel", reality: "Meer dan de helft van je verkeer zegt nee." },
    { myth: "Een redesign lost alles op", reality: "Zonder strategie is het een nieuwe jas op dezelfde fouten." },
    { myth: "SSL en snelheid zijn technisch gedoe", reality: "Het is conversie en SEO. Fundament, geen bijzaak." },
    { myth: "Meer pagina's = betere site", reality: "Meer duidelijke pagina's wel. Meer rommel niet." },
    { myth: "Je neef die websites bouwt is gratis", reality: "Gratis bouwen, betaald herstellen is een klassieker." },
  ],
  shopify: [
    { myth: "Shopify is duur", reality: "Vaak goedkoper dan WooCommerce plus onderhoud plus traagheid." },
    { myth: "B2B kan niet op Shopify", reality: "B2B op Shopify kan met de juiste configuratie en vakmanschap." },
    { myth: "Apps fixen alles", reality: "Elke app is JS. Te veel apps = trage shop." },
    { myth: "Theme is genoeg voor schaal", reality: "Schaal vraagt custom, feeds en flows." },
    { myth: "Shopify SEO doet zichzelf", reality: "Titels, structuur, snelheid en content doe jij. Of ik." },
    { myth: "Migratie is één klik", reality: "Redirects en data zijn het echte werk." },
    { myth: "Discount codes fixen conversie", reality: "Vertrouwen en checkout fixen conversie. Codes zijn een pleister." },
    { myth: "Je hoeft geen abandoned cart mails", reality: "Je laat geld liggen. Letterlijk." },
  ],
  content: [
    { myth: "Volume wint", reality: "{kw} draait om autoriteit en antwoorden." },
    { myth: "Keywords overal proppen", reality: "Intentie wint sinds mensen stopten met Nokia's." },
    { myth: "Social is genoeg", reality: "Owned content op je domein blijft van jou." },
    { myth: "Lange tekst rankt altijd", reality: "Lange tekst die antwoordt rankt. Woorden vullen niet." },
    { myth: "Content eenmalig schrijven is klaar", reality: "Decay is echt. Update of verlies." },
    { myth: "FAQ is bijzaak", reality: "FAQ kan ranken en converteren. Als het echt is." },
    { myth: "AI maakt content gratis", reality: "AI maakt ruis goedkoop. Kwaliteit kost nog steeds aandacht." },
    { myth: "Je hoeft geen interne links", reality: "Eilanden verzuipen. Links zijn je bruggen." },
  ],
  "b2b-portal": [
    { myth: "Excel werkt nog wel", reality: "Tot je team groeit. Dan wordt Excel een baan." },
    { myth: "Automatisering is voor later", reality: "Later is vaak te laat." },
    { myth: "B2B wil bellen", reality: "Sommigen wel. Velen willen bestellen zonder wachten." },
    { myth: "Portaal is te duur", reality: "Handmatig werk is duurder. Je telt het alleen niet." },
    { myth: "Koppelingen zijn overkill", reality: "Dubbel werk en fouten zijn de echte overkill." },
    { myth: "Leads in mail is prima", reality: "Prima tot er tien per dag zijn en drie verdwalen." },
    { myth: "Software lost cultuur op", reality: "Software ondersteunt proces. Cultuur moet mee willen." },
    { myth: "Later op de roadmap is een plan", reality: "Roadmaps zonder deadline zijn wensen." },
  ],
};

export const WEIRD_FACTS: readonly string[] = [
  "Van alles wat mensen in Google typen is zo'n 15 procent nog nooit eerder gezocht. Nieuwe vragen beantwoorden is vaak goedkoper dan vechten op dezelfde tien keywords als iedereen.",
  "Ongeveer 46 procent van Google-zoekopdrachten heeft lokale intentie. 'Bij mij in de buurt' is geen grap meer.",
  "Gemiddeld haakt zo'n 70 procent van winkelwagens af vóór betaling. Ads zonder e-mail en retentie laat geld liggen.",
  "Elke seconde extra laadtijd op mobiel kan je conversie met procenten kosten. Je ads merken het via duurdere klikken.",
  "Herhalende klanten zijn vaak 5 tot 7 keer goedkoper om te winnen dan nieuwe. Retentie is geen bijzaak.",
  "Het eerste organische resultaat krijgt ruwweg 25 tot 30 procent van de clicks. Positie 8 op pagina 1 is bijna alsof je er niet bent.",
  "Mensen lezen online gemiddeld maar 20 procent van de tekst. Koppen, structuur en eerste zin doen het werk.",
  "Google Ads Quality Score beïnvloedt wat je betaalt. Slechte landings maken je klik duurder. Ook als niemand het zegt.",
  "Structured data is geen ranking-garantie. Het is wel een ticket om rich results te mogen proberen.",
  "B2B-kopers doen gemiddeld veel research voordat ze contact opnemen. Je site is je salesmedewerker die nooit slaapt.",
  "E-mail marketing ROI is vaak hoger dan social. Saai? Effectief.",
  "Ad blockers en cookie-banners hebben tracking moeilijker gemaakt. Server-side tracking wordt steeds normaler.",
  "In {city} concurreer je niet alleen lokaal. Iedereen met ads kan jouw regio targeten.",
  "ChatGPT en Gemini citeren steeds vaker bronnen. Wie niet citeerbaar is, bestaat niet in die wereld.",
  "Negatieve reviews op je GBP die je niet beantwoordt, kosten vertrouwen. Antwoorden kost nul euro.",
];
