import type {
  SeoLandingCategory,
  SeoLandingFaq,
  SeoLandingPage,
} from "@/data/seo-landings/types";
import type {
  EnrichedSeoLandingPage,
  SeoLandingMyth,
  SeoLandingProseBlock,
} from "@/data/seo-landings/enriched-types";

function hashSlug(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) {
    h = (h << 5) - h + slug.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function pick<T>(slug: string, items: readonly T[]): T {
  return items[hashSlug(slug) % items.length]!;
}

function cityLabel(page: SeoLandingPage): string {
  return page.location?.city ?? "Nederland";
}

function regionNote(page: SeoLandingPage): string {
  if (!page.location) return "";
  const { city, region } = page.location;
  return region ? ` in ${city} en ${region}` : ` rond ${city}`;
}

const KENNISBANK_BY_CATEGORY: Record<SeoLandingCategory, readonly string[]> = {
  "google-ads": [
    "broad-match-google-ads-verrassingsbox",
    "google-ads-vijf-fouten-elke-account",
    "remarketing-zonder-stalken",
    "roas-vs-cpa-bankrekening",
  ],
  seo: [
    "google-business-profile-spookhuis",
    "ai-content-bulk-onzichtbaar",
    "semantische-seo-2026",
    "ai-zoek-vindbaarheid-chatgpt",
  ],
  website: [
    "bestrest-matrassen-eigen-marketingplan",
    "marketingbudget-volgorde-mkb",
    "cro-checkout-vertrouwen",
  ],
  shopify: [
    "b2b-verkopen-via-shopify",
    "shopify-performance-roas",
    "abandoned-cart-emails-die-converteren",
  ],
  content: [
    "ai-content-bulk-onzichtbaar",
    "ai-zoek-vindbaarheid-chatgpt",
    "semantische-seo-2026",
  ],
  "b2b-portal": [
    "b2b-verkopen-via-shopify",
    "n8n-eerste-workflow",
    "marketingbudget-volgorde-mkb",
  ],
};

function buildStory(page: SeoLandingPage): SeoLandingProseBlock {
  const kw = page.primaryKeyword;
  const loc = regionNote(page);
  const stories: Record<SeoLandingCategory, readonly SeoLandingProseBlock[]> = {
    "google-ads": [
      {
        title: "Het moment dat je dashboard liegt",
        paragraphs: [
          `Je opent Google Ads op een dinsdagochtend. Groene pijltjes. Meer klikken. Je voelt je even de slimste ondernemer van ${cityLabel(page)}. Tot je boekhouder vraagt waarom de omzet niet meebeweegt. Dan blijkt het: je betaalde voor mensen die "gratis ${kw}" zochten, op een landingspagina die op mobiel trager laadt dan een filesituatie op de A2.`,
          `Ik zie dit niet één keer. Ik zie het in bijna elk account dat ik overneem. Niet omdat ondernemers dom zijn. Omdat niemand hardop zegt dat ${kw} pas werkt als je site, je tracking en je zoektermen hetzelfde verhaal vertellen. Ads zijn geen toverknop. Het is een versterker. En een versterker op ruis levert harder ruis.`,
          `Bij SkinComplete zette ik ads pas aan toen organisch verkeer al bewees dat de shop overtuigde. Bij BestRest bepaalde de marge per matras welke campagne überhaupt budget kreeg. Dat is ${kw} zoals het bedoeld is: met context, niet met hoop.`,
        ],
      },
      {
        title: "Waarom je moeder je beste zoekwoord is",
        paragraphs: [
          `Stel je voor: je moeder wil weten wat je bedrijf doet. Ze typt het in Google. Krijgt ze jou? Of krijgt ze een concurrent, een Wikipedia-snippet en drie advertenties van bedrijven die toevallig broad match aan hebben staan? Als je moeder jou niet vindt, vindt je ideale klant je soms ook niet. Of erger: hij vindt je wel, klikt, en vertrekt binnen vier seconden omdat je pagina niet matcht met wat de advertentie beloofde.`,
          `${kw} is geen sport van klikken maximaliseren. Het is een sport van de juiste klik krijgen en die niet laten weglopen. Daarvoor moet iemand je account én je website lezen alsof het hun eigen geld is. Dat is precies hoe ik werk.`,
          `Geen maandrapport dat alleen indruk maakt op je marketingstagiair. Wel: zoektermen die je zou weigeren als ze naast je stonden, landings die de belofte van je ad herhalen, en een eerlijk "nu nog even niet opschalen" als de cijfers liegen.`,
        ],
      },
    ],
    seo: [
      {
        title: "Pagina 1 is geen finish, het is toestemming om mee te doen",
        paragraphs: [
          `Er is iets erger dan niet ranken: ranken op pagina 2. Je bent er bijna. Google knipoogt. Maar niemand klikt. ${kw} draait niet om trucjes uit 2012. Het draait om een site die snel is, content die een vraag echt beantwoordt, en autoriteit die niet uit een link-farm komt.`,
          `Ik bouw sites in Next.js en Shopify. Daardoor kan ik SEO niet uitbesteden aan "iemand anders die de techniek doet". Techniek en content zijn één keten. Als je LCP in het rood staat, helpt de mooiste blog niets. Als je blog wollig is, helpt perfecte techniek ook maar beperkt.`,
          `${page.location ? `Lokaal${loc} telt mee: Google wil weten waar je hangt, of je profiel leeft, of mensen je vermelden. Maar ook landelijk: wie ${kw} serieus neemt, bouwt pagina's die blijven staan als je ads-budget even pauzeert.` : `Wie ${kw} serieus neemt, bouwt iets dat blijft staan als je ads-budget even pauzeert. Organisch is geen gratis lunch. Het is een investering die rente pakt.`}`,
        ],
      },
      {
        title: "De stille concurrent: ChatGPT",
        paragraphs: [
          `Terwijl jij focust op klassieke rankings, vraagt een deel van je markt al aan ChatGPT of Gemini: wie moet ik inhuren voor ${kw}? Sta jij niet in dat antwoord, ben je voor die klant geen optie. Geen tweede pagina, geen remarketing-list, geen tweede kans.`,
          `Goed nieuws: wat helpt in Google overlapt flink met wat AI citeert. Duidelijke structuur, echte expertise, schema markup, consistente merkinfo. Slecht nieuws: bulk AI-blogs van 300 woorden helpen je in geen van beide werelden.`,
          `Ik pak ${kw} daarom breed aan: techniek, antwoord-pagina's, interne links, en af en toe een hardop gezegde mening. Google en mensen belonen content die niet klinkt als een commissie die "synergie" heeft getypt.`,
        ],
      },
    ],
    website: [
      {
        title: "Je neef heeft je site gebouwd. Nu wat?",
        paragraphs: [
          `Je neef is aardig. WordPress staat. Er is een logo. Maar ${kw} betekent niet "iemand kent WordPress". Het betekent: een site die laadt voordat je bezoeker ongeduldig tikt, die op mobiel niet breekt, en die Google begrijpt zonder plugin-zoo die elk jaar opnieuw instort.`,
          `Ik promoot geen templates of page builders. Ik bouw from scratch in Next.js (en shops in Shopify) omdat maatwerk dan geen marketingterm is, maar letterlijk wat je krijgt. Custom build wil zeggen: geen theme dat je groei remt, geen code die niemand durft aan te raken.`,
          `Een site is geen online visitekaartje meer. Het is je verkoopgesprek om 23:00 uur op zondag. Als dat gesprek vaag is, is ${kw} geld naar een mooie façade zonder deuren.`,
        ],
      },
      {
        title: "De homepage die niemand koopt",
        paragraphs: [
          `Je homepage is vaak je duurste pagina. Niet omdat hij veel kost om te bouwen. Omdat al je ads, al je social posts en half je SEO-verkeer daar landen op een scherm dat "welkom" zegt en verder niets. ${kw} begint met de vraag: waar moet deze klik naartoe om geld te verdienen?`,
          `Soms is het antwoord: niet de homepage. Soms is het een landingspagina per dienst, per product, per regio${page.location ? `, zoals we doen voor ${page.location.city}` : ""}. Saai? Effectief.`,
          `Ik bouw sites alsof marketing er al op zit. Want straks zit marketing erop. Dan wil je geen redesign omdat je CTA onder de fold verdween in een hero met vijf slides.`,
        ],
      },
    ],
    shopify: [
      {
        title: "Je shop draait. Maar groeit hij?",
        paragraphs: [
          `Shopify maakt het makkelijk om te starten. Dat is zowel de gift als de valkuil. Iedereen kan een theme installeren. Niet iedereen kan een shop bouwen die ${kw} ondersteunt: snelheid, product-SEO, Shopping feeds, B2B-portaal, e-mailflows die niet spammen.`,
          `SkinComplete is mijn referentie: custom theme, B2B voor salons, eerst organisch, daarna ads. BestRest leerde me dat elk product een eigen verhaal verdient. ${kw} zonder die context is een theme-store met je logo erop.`,
          `Of je nu migreert van WooCommerce of opschaalt vanaf een bestaande shop: ${kw} moet meegroeien met je marge, niet met je frustratie over apps die elkaar tegenwerken.`,
        ],
      },
    ],
    content: [
      {
        title: "Content is geen volume-spel",
        paragraphs: [
          `Er is een verschil tussen "we publiceren drie blogs per week" en "we beantwoorden vragen die geld opleveren". ${kw} faalt wanneer content een checkbox is. Vijftig artikelen die niemand leest, vertellen Google vooral: hier woont ruis.`,
          `Ik schrijf in mensentaal. Soms grappig. Altijd direct. Met cases zoals SkinComplete en BestRest waar het past, en met harde eerlijkheid waar dat nodig is. AI kan helpen om sneller te zijn. Het kan je stem niet vervangen als je geen stem hebt.`,
          `${kw} werkt als elke pagina één ding doet: een zoekvraag beantwoorden beter dan de top 10 die er nu staat. Niet bijna. Beter.`,
        ],
      },
    ],
    "b2b-portal": [
      {
        title: "Excel is geen CRM, het is een noodoplossing met tabs",
        paragraphs: [
          `Je zakelijke klant wil om 22:00 uur bestellen. Jouw proces wil dat ze mailen en wachten tot iemand maandag terugmailt. Ondertussen bestelt de consument op je shop in drie klikken. Raad eens wie moderner overkomt.`,
          `${kw} gaat over systemen die schalen zonder dat je team verdubbelt. B2B-portaal op Shopify, leads die niet in Gmail verdwijnen, automatisering die rotwerk weghaalt. SkinComplete deed dit voor salons. Jij kunt het patroon volgen.`,
          `Ik verkoop geen software. Ik verkoop tijd terug en minder fouten. ${kw} is saai tot je ziet hoeveel uren er nu in handmatig werk zitten.`,
        ],
      },
    ],
  };

  const pool = stories[page.category];
  return pick(page.slug, pool.length > 0 ? pool : stories.seo);
}

function buildScenario(page: SeoLandingPage): { title: string; paragraphs: readonly string[] } {
  const kw = page.primaryKeyword;
  const city = page.location?.city;

  const scenarios = [
    {
      title: "Stel: volgende maand moet het kantelen",
      paragraphs: [
        `Je hebt een maand. Geen jaar. Je wilt dat ${kw} iets oplevert dat je team voelt in de inbox of in de omzet. Wat ik dan niet doe: alles tegelijk aan, zes kanalen openen en hopen dat er eentje raak is.`,
        `Wat ik wel doe: eerst meten wat er al gebeurt, dan het grootste lek dichten. Soms is dat je site. Soms je feed. Soms je zoektermenrapport dat niemand ooit opent. Pas daarna budget omhoog.${city ? ` ${city} of landelijk: de volgorde blijft hetzelfde.` : ""}`,
        `Het voelt minder sexy dan "we schalen direct". Het voelt wel als een plan dat je bankrekening snapt.`,
      ],
    },
    {
      title: "Stel: je bent al een tijdje bezig en het schuurt",
      paragraphs: [
        `Je hebt al iets laten doen. Er is een site, misschien ads, misschien een bureau dat je maandelijks een PDF stuurt. Maar ${kw} voelt als geld in een automaat die soms wat uitspuugt en soms slikt.`,
        `Dan begin ik niet met verwijten. Ik begin met lezen. Account, analytics, landings op mobiel, zoektermen, marges. Vaak vind ik winst in een week die maandenlang openlag.`,
        `Soms is het antwoord: stoppen met een kanaal. Dat zeg ik ook. Liever eerlijk dan een retainer voor sentiment.`,
      ],
    },
  ];

  return pick(page.slug, scenarios);
}

function buildDeepDive(page: SeoLandingPage): SeoLandingProseBlock {
  const kw = page.primaryKeyword;
  const loc = regionNote(page);

  const dives: Record<SeoLandingCategory, SeoLandingProseBlock> = {
    "google-ads": {
      title: `Wat ${kw} in de praktijk betekent`,
      paragraphs: [
        `Zoekmachine adverteren is niet "budget erin en kijken wat eruit komt". Het is keuzes maken: welke zoekwoorden mogen geld kosten, welke landings krijgen verkeer, welke producten hebben marge om überhaupt te adverteren. Bij Shopping telt je feed. Bij Search telt message match. Bij Performance Max telt vooral of je input schoon is voordat je de zwarte doos vertrouwt.`,
        `Ik werk met Google Ads én Meta onder één strategie. Niet omdat het hip is, maar omdat je klant niet leeft in silo's. Hij ziet je ad, scrollt terug, googelt later, vergelijkt, koopt of niet. Jij wilt dat die reis één verhaal is.`,
        `${page.location ? `Voor ondernemers${loc}: lokaal adverteren kan, maar alleen als je profiel, je site en je landings kloppen. Anders betaal je voor clicks naar een spookhuis.` : `Of je nu nationaal of regionaal zit: ${kw} zonder tracking die klopt is optimaliseren op fantasie. En fantasie ziet er op een dashboard best goed uit.`}`,
      ],
    },
    seo: {
      title: `Hoe ik naar ${kw} kijk`,
      paragraphs: [
        `SEO is saai geworden in de goede zin: minder trucjes, meer fundament. Technische basis, pagina's met intentie, interne links die een routekaart vormen, schema waar het de waarheid versterkt. En ja, content die klinkt als een mens die weet waar hij het over heeft.`,
        `Ik schrijf niet voor robots. Maar ik respecteer robots wel. Daarom zijn Core Web Vitals, crawlbaarheid en structured data geen bijlage. Ze zitten in hoe ik bouw.`,
        `${kw}${loc} vraagt om consistentie: wat op je site staat, wat in je Google Business Profile staat, wat AI over je zegt als iemand je branche vraagt. Eén waarheid, overal dezelfde stem.`,
      ],
    },
    website: {
      title: `Waarom ${kw} bij mij anders voelt`,
      paragraphs: [
        `Veel partijen verkopen design. Ik verkoop een machine die vindbaar is en converteert. Dat betekent semantische HTML, snelle assets, landings voor campagnes, formulieren die leads niet laten verdwijnen, en geen WordPress als eindstation tenzij migratie de opdracht is.`,
        `Next.js voor maatwerk sites. Shopify voor shops die moeten schalen. In beide gevallen: geen page builder die je opsluit, geen theme dat je groei dempt.`,
        `${kw} is geen project van vier weken dat daarna "af" is. Het is een fundament waar marketing op kan staan. Ads, SEO, e-mail: ze worden beter als de bestemming klopt.`,
      ],
    },
    shopify: {
      title: `${kw} zonder app-hel`,
      paragraphs: [
        `Shopify groeit mee, tot je shop vol hangt met apps die elk JS toevoegen en je CWV slopen. Dan wordt ${kw} een race tegen je eigen stack. Ik kies bewust: custom theme waar nodig, apps alleen met een business case, feeds en SEO vanaf het begin meedenken.`,
        `B2B, internationaal, subscriptions, e-mail, automatisering: het kan op Shopify. Maar niet met een demo-store mentaliteit. SkinComplete-niveau vraagt vakmanschap.`,
        `Migreren van WooCommerce? Dan doen we redirects goed of we accepteren dat Google even chagrijnig is. Liever eerlijk dan een import-knop en hopen.`,
      ],
    },
    content: {
      title: `Content die ${kw} ondersteunt`,
      paragraphs: [
        `Contentmarketing is geen kalender vol onderwerpen waar niemand om vroeg. Het is antwoorden verzamelen op vragen die je klanten echt stellen, en die antwoorden zo neerzetten dat Google, AI en mensen ze kunnen vinden en geloven.`,
        `Ik link content aan je diensten, je cases, je techniek. Een blog zonder interne links is een eiland. Eilanden ranken slecht.`,
        `${kw} werkt het best als je stem herkenbaar is. Meneer Marketing klinkt als iemand die aan tafel zit, niet als een persbericht.`,
      ],
    },
    "b2b-portal": {
      title: `${kw} en waar het misgaat`,
      paragraphs: [
        `De meeste B2B-frictie zit niet in je product. Het zit in je proces. Mailtjes, Excel, "ik stuur je morgen de prijs", vergeten orders. ${kw} fixt dat met portalen, flows en koppelingen die je team niet elke dag hoeft te babysitten.`,
        `Automatisering is geen luxe voor later. Het is hoe je schaalt zonder tien mensen aan te nemen die vooral kopiëren en plakken.`,
        `Of het nu gaat om Klaviyo, n8n, Make of custom API's: ik kies wat past bij je stack. Niet wat het hipst is op Twitter.`,
      ],
    },
  };

  return dives[page.category];
}

function buildMyths(page: SeoLandingPage): readonly SeoLandingMyth[] {
  const kw = page.primaryKeyword;
  const byCategory: Record<SeoLandingCategory, readonly SeoLandingMyth[]> = {
    "google-ads": [
      { myth: "Meer budget lost het altijd op", reality: `Bij ${kw} vermenigvuldig je eerst wat er al is. Lekt je site, dan lekt je budget harder.` },
      { myth: "Broad match laat Google slim leren", reality: "Google leert van je data. Slechte data leert slechte dingen. Strakke zoektermen eerst." },
      { myth: "ROAS groen = feest", reality: "ROAS zonder marge is een feest in een huis dat je niet kunt betalen." },
    ],
    seo: [
      { myth: "SEO is in drie maanden klaar", reality: `${kw} bouwt. Snelle wins bestaan, dominantie kost tijd en consistentie.` },
      { myth: "Meer blogs = beter", reality: "Vijftig dunne pagina's verliezen van tien die echt helpen." },
      { myth: "AI schrijft je SEO wel", reality: "AI zonder expertise produceert gemiddelde ruis. Google ruikt dat." },
    ],
    website: [
      { myth: "Een theme is goed genoeg", reality: `Voor ${kw} op serieus niveau groei je vaak uit je theme. Dan wordt goedkoop duur.` },
      { myth: "Mooi design is genoeg", reality: "Mooi zonder snelheid en CTA is een museum." },
      { myth: "WordPress is altijd de goedkoopste optie", reality: "Tel dev-tijd, plugins en hacks mee. Dan verandert de rekensom." },
    ],
    shopify: [
      { myth: "Shopify is duur", reality: "Vaak goedkoper dan WooCommerce + onderhoud + traagheid." },
      { myth: "B2B kan niet op Shopify", reality: "SkinComplete bewijst het tegendeel met een echt portaal." },
      { myth: "Apps fixen alles", reality: "Elke app is JS. Te veel apps = trage shop = dure ads." },
    ],
    content: [
      { myth: "Volume wint", reality: `${kw} draait om autoriteit en antwoorden, niet om woordentelling.` },
      { myth: "Keywords overal proppen", reality: "Betekenis en intentie winnen van stuffing sinds 2012." },
      { myth: "Social is genoeg", reality: "Owned content op je domein blijft van jou. Huurgrond niet." },
    ],
    "b2b-portal": [
      { myth: "Excel werkt nog wel", reality: "Tot je team groeit. Dan wordt Excel een parttime baan." },
      { myth: "Automatisering is voor later", reality: "Later is vaak te laat als orders al mislopen." },
      { myth: "B2B wil bellen", reality: "Sommige klanten willen bellen. Velen willen gewoon bestellen." },
    ],
  };
  return byCategory[page.category];
}

function buildWeirdFact(page: SeoLandingPage): string {
  const facts = [
    "Van alles wat mensen in Google typen is zo'n 15 procent nog nooit eerder gezocht. Nieuwe vragen beantwoorden is vaak goedkoper dan vechten op dezelfde tien keywords als iedereen.",
    "Ongeveer 46 procent van Google-zoekopdrachten heeft lokale intentie. 'Bij mij in de buurt' is geen grap meer.",
    "Gemiddeld haakt zo'n 70 procent van winkelwagens af vóór betaling. Ads zonder e-mail en retentie laat geld liggen.",
    "Elke seconde extra laadtijd op mobiel kan je conversie met procenten kosten. Je ads merken het via duurdere klikken.",
    "Herhalende klanten zijn vaak 5 tot 7 keer goedkoper om te winnen dan nieuwe. Retentie is geen bijzaak.",
  ];
  return pick(page.slug, facts);
}

function buildHonestNo(page: SeoLandingPage): { title: string; body: string } {
  const kw = page.primaryKeyword;
  const options = [
    {
      title: "Wanneer ik nee zeg tegen je opdracht",
      body: `Als ${kw} niet past bij je marge, je timing of je fundament, zeg ik het. Liever een eerlijke nee dan drie maanden retainer om je te vertellen wat je wilt horen. Ads op een shop die niet converteert? Eerst fixen. SEO beloven met garantie op pagina 1? Nee. Nep verwachtingen helpen niemand, behalve je concurrent.`,
    },
    {
      title: "Dit is geen match als je...",
      body: `...vooral de goedkoopste offerte zoekt, ...wilt schalen zonder cijfers te delen, of ...alleen een rapport nodig hebt om in een vergadering te zwaaien. ${kw} bij Meneer Marketing is samenwerken met iemand die je site aanraakt, je account leest en je bankrekening serieus neemt.`,
    },
  ];
  return pick(page.slug, options);
}

function buildThisWeek(page: SeoLandingPage): { title: string; items: readonly string[] } {
  const kw = page.primaryKeyword;
  const byCategory: Record<SeoLandingCategory, readonly string[]> = {
    "google-ads": [
      `Zoektermenrapport openen en de top 20 op kosten beoordelen voor ${kw}`,
      "Controleren of mobiele landings even snel zijn als desktop",
      "Conversiewaarde meesturen als je ecommerce draait",
      "Eén campagne die lekt pauzeren in plaats van alles opschalen",
    ],
    seo: [
      `Google je belangrijkste ${kw}-zoekvraag laten zien en de top 3 resultaten lezen als een detective`,
      "PageSpeed op je belangrijkste landings checken op mobiel",
      "Interne links vanaf je homepage naar je sterkste dienstpagina's",
      "ChatGPT vragen wie ze aanraden in jouw branche. Sta jij erbij?",
    ],
    website: [
      "Je formulier of checkout zelf invullen op je telefoon",
      "Meten hoeveel seconden tot je eerste CTA zichtbaar is",
      "Eén pagina kiezen die alleen verkeer krijgt en die verbeteren",
      "Schema markup laten controleren op je belangrijkste pagina",
    ],
    shopify: [
      "Merchant Center diagnostics openen als je Shopping draait",
      "Drie bestsellers lezen alsof je klant bent, niet als eigenaar",
      "Abandoned cart flow testen met je eigen e-mail",
      "Apps inventariseren die je in drie maanden niet hebt aangeraakt",
    ],
    content: [
      "Vijf vragen noteren die klanten je deze maand stelden",
      "Eén antwoord-pagina plannen per vraag, niet één blog voor alles",
      "Interne links toevoegen vanuit je best bezochte pagina",
      "AI laten antwoorden op je markt en kijken wie geciteerd wordt",
    ],
    "b2b-portal": [
      "Tellen hoeveel uur per week handmatige orders kosten",
      "Leadflow tekenen van formulier tot eerste contact",
      "Eén automatisering kiezen die direct tijd teruggeeft",
      "B2B-klant bellen en vragen wat frictie geeft bij bestellen",
    ],
  };
  return {
    title: `Als je deze week maar één ding doet voor ${kw}`,
    items: byCategory[page.category],
  };
}

function buildExtraFaq(page: SeoLandingPage): readonly SeoLandingFaq[] {
  const kw = page.primaryKeyword;
  const city = page.location?.city;
  const base: SeoLandingFaq[] = [
    {
      question: `Wat maakt jullie ${kw} anders dan een standaard bureau?`,
      answer:
        "Ik bouw en optimaliseer zelf: site, landings, tracking, campagnes. Geen keten van specialisten die elkaar de schuld geven. Eén aanspreekpunt, één plan.",
    },
    {
      question: "Werken jullie ook voor kleinere budgetten?",
      answer:
        "Ja, als de rekensom klopt. Liever een klein budget met strakke focus dan een groot budget zonder plan. In intake rekenen we door wat realistisch is.",
    },
    {
      question: `Hoe snel kunnen we starten met ${kw}?`,
      answer:
        "Intake en plan vaak binnen een week. Uitvoering hangt af van scope: een audit is sneller dan een volledige shop rebuild.",
    },
  ];

  if (city) {
    base.push({
      question: `Zijn jullie alleen actief in ${city}?`,
      answer: `Ik ken ${city} en de regio goed, maar pak ook landelijke opdrachten. ${kw} werkt overal met dezelfde principes: fundament eerst, dan schalen.`,
    });
  }

  return base;
}

export function enrichSeoLandingPage(page: SeoLandingPage): EnrichedSeoLandingPage {
  const kennisbankPool = KENNISBANK_BY_CATEGORY[page.category];
  const kennisbankSlug = pick(page.slug, kennisbankPool);

  return {
    ...page,
    faq: [...page.faq, ...buildExtraFaq(page)],
    story: buildStory(page),
    scenario: buildScenario(page),
    deepDive: buildDeepDive(page),
    myths: buildMyths(page),
    weirdFact: buildWeirdFact(page),
    honestNo: buildHonestNo(page),
    thisWeek: buildThisWeek(page),
    kennisbankSlug,
  };
}
