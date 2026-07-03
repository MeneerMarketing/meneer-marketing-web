/**
 * Strategische boodschap per dienst: benadrukt maatwerk, niche-denken en allround-expertise.
 * Geen copy-paste trajecten. Elke opdracht start met context.
 */

export interface StrategicScenario {
  title: string;
  body: string;
}

export interface DienstStrategicContent {
  /** Unieke invalshoek voor deze dienst */
  deepTitle: string;
  deepLead: string;
  deepExtended: string;
  /** Waar we bij intake op letten (transparant voor de klant) */
  signals: string[];
  scenarios: StrategicScenario[];
}

const PILLAR_LENS: Record<string, string> = {
  Strategie:
    "Binnen Strategie start ik bij jouw cijfers, niet bij een standaardaanpak. Waar komt je omzet vandaan, waar lekt hij weg, en welke kanalen passen bij jouw marge en klant? Pas als dat helder is, gaan we bouwen en budget uitgeven. Zo weet je zeker dat elke volgende stap de slimste is.",
  Bouwen:
    "Binnen Bouwen kijk ik niet alleen naar ‘een site’ of ‘een shop’, maar naar hoe jouw bedrijf over vijf jaar nog steeds snel kan groeien. Dat bepaalt welk platform we kiezen, hoe we koppelingen ontwerpen en waar we problemen voorkomen. Zo sluit alles aan op hoe jij echt werkt, niet op een standaard template.",
  Vindbaarheid:
    "Binnen Vindbaarheid denk ik verder dan Google alleen: je klant zoekt ook via ChatGPT, Maps en reviews. Ik bouw de keten als geheel: content die antwoord geeft, techniek die klopt en autoriteit die groeit. Organisch eerst, want elke positie die je organisch wint, maakt je advertenties daarna goedkoper.",
  Campagnes:
    "Binnen Campagnes gaat geen euro budget aan voordat de meting klopt en de landingspagina zijn werk doet. Daarna kiezen we de kanalen die bij jouw marge passen: Google, Meta, creators of marketplaces. We testen klein, schalen wat werkt en snijden wat ruis geeft. Zonder sentiment.",
  Behoud:
    "Binnen Behoud zoek ik de omzet die je al betaald hebt: klanten die eerder kochten en alleen een goede reden nodig hebben om terug te komen. E-mail, retentie en de systemen erachter werken samen, zodat de tweede aankoop makkelijker wordt dan de eerste. En jouw team minder handwerk heeft.",
};

const SCENARIOS_BY_PILLAR: Record<string, StrategicScenario[]> = {
  Strategie: [
    {
      title: "Alles tegelijk, niks af",
      body: "Je doet van alles een beetje: wat ads, wat social, soms een mail. Dan bepalen we eerst welke twee kanalen echt renderen en maken die af.",
    },
    {
      title: "Groei stagneert",
      body: "Wat eerst werkte, werkt niet meer. Dan kijken we naar de cijfers: zit het probleem in verkeer, conversie of herhaalaankopen?",
    },
    {
      title: "Nieuwe markt of product",
      body: "Je wilt iets nieuws lanceren. Dan ontwerp ik een compacte test met duidelijke criteria: wanneer stoppen, wanneer opschalen.",
    },
  ],
  Bouwen: [
    {
      title: "Schaal-up e-commerce",
      body: "Je groeit hard: meer SKU’s, internationale storefronts of B2B naast B2C. Dan moet je theme en data-laag niet breken bij elke feature.",
    },
    {
      title: "Content & SEO-machine",
      body: "Je redactie publiceert dagelijks. Dan is editor-ervaring, interne linking en performance geen luxe. Het is je businessmodel.",
    },
    {
      title: "Portal of tool",
      body: "Je klanten of medewerkers loggen in voor data, orders of documenten. Dan is UX, security en onderhoudbaarheid leidend.",
    },
  ],
  Vindbaarheid: [
    {
      title: "Onzichtbaar in je markt",
      body: "Concurrenten staan overal bovenaan, jij niet. Dan bouwen we structuur en content op waar jouw klant echt op zoekt.",
    },
    {
      title: "AI-zoek voor zijn",
      body: "Klanten vragen ChatGPT om advies in jouw branche. Dan zorgen we dat jouw bedrijf het antwoord is, vóór je concurrent het doorheeft.",
    },
    {
      title: "Lokaal winnen",
      body: "Je klanten komen uit de regio maar vinden je niet. Dan pakken we Google Business, Maps en lokale pagina's als eerste.",
    },
  ],
  Campagnes: [
    {
      title: "Ads renderen niet",
      body: "Je advertenties wisselen in resultaat. Dan ligt de oplossing vaak half in de advertentie, half in de landingspagina. Ik behandel beide als één geheel.",
    },
    {
      title: "Creatives verslijten",
      body: "Je campagnes draaien, maar de content raakt op. Dan zetten we UGC en creators in voor een stroom verse varianten.",
    },
    {
      title: "Nieuw kanaal erbij",
      body: "Je wilt van één kanaal naar meer: Meta erbij, of Bol en Amazon. Dan testen we klein en schalen op basis van cijfers.",
    },
  ],
  Behoud: [
    {
      title: "Eenmalige kopers",
      body: "Klanten kopen één keer en verdwijnen. Dan bouwen we flows en acties die de tweede aankoop vanzelfsprekend maken.",
    },
    {
      title: "Orderstress",
      body: "Orders hopen op en spreadsheets raken vol. Dan automatiseren we eerst de pijnlijkste stap. Met zichtbare tijdwinst binnen weken.",
    },
    {
      title: "Support & FAQ",
      body: "Team herhaalt dezelfde antwoorden. Dan combineren we kennisbank, bot en escalatie zodat mensen alleen waardevolle cases zien.",
    },
  ],
};

const SCENARIOS_BY_SLUG: Record<string, StrategicScenario[]> = {
  "shopify-enterprise": [
    {
      title: "Van template naar maatwerk",
      body: "Je zit vast in een theme uit de store dat nergens op lijkt wat je wilt. Dan bouwen we from scratch: eigen secties, eigen flow, jouw merk.",
    },
    {
      title: "Schaal-up e-commerce",
      body: "Je groeit hard: meer SKU's, landen, kanalen. Dan moet je custom theme en data-laag niet breken bij elke feature.",
    },
    {
      title: "Shopify als platform",
      body: "Je wilt portals, koppelingen of checkout op maat. In Shopify kan het, als je iemand hebt die het platform écht kent.",
    },
  ],
};

const BY_SLUG: Record<string, Omit<DienstStrategicContent, "scenarios">> = {
  "shopify-enterprise": {
    deepTitle: "Shopify from scratch: maatwerk zonder chaos",
    deepLead:
      "Ik koop geen theme in de Shopify Store en plak je logo erop. Elke shop start op een leeg canvas: eigen secties, eigen Liquid, jouw merk. Of je nu D2C verkoopt, internationaal schaalt of een portal nodig hebt. In Shopify kan het, als je iemand hebt die het platform écht kent.",
    deepExtended:
      "Soms is een strak OS 2.0-theme from scratch de slimste route. Soms headless of een hybride met maatwerk front. Ik laat je zien waarom, wat het betekent voor onderhoud, SEO en snelheid. Zo koop je geen template, maar een shop die past bij jouw volgende fase.",
    signals: [
      "Hoe complex is je catalogus (varianten, prijzen, regio's)?",
      "Welke apps zijn echt kritisch. En welke vervangen we door maatwerk in het theme?",
      "Waar zit je omzet: SEO, ads, e-mail. En wat verwacht je storefront daarvoor?",
      "Hoe ziet je release-proces eruit (staging, QA, rollback)?",
    ],
  },
  webdevelopment: {
    deepTitle: "Websites from scratch: gebouwd voor jouw bedrijf",
    deepLead:
      "Ik bouw geen kant-en-klare templates. Elke site start op een leeg canvas: design, structuur en code passend bij jouw merk, doelen en team. Of het nu een bedrijfswebsite, landingspagina of portal is.",
    deepExtended:
      "Snelheid en veiligheid zijn standaard. De prioriteit verschilt wel: een webshop heeft andere eisen dan een site met veel content of zware formulieren. Ik leg uit welke keuzes we maken, hoe je zelf content kunt beheren en hoe we voorkomen dat je over drie jaar vastzit aan obscure oplossingen.",
    signals: [
      "Wie past content aan, en hoe vaak?",
      "Welke koppelingen (CRM, webshop, boekhouding) zijn must-haves?",
      "Wil je vooral gevonden worden, verkopen, of beide?",
      "Zijn er speciale eisen (toegankelijkheid, branche-regels)?",
    ],
  },
  "web-apps": {
    deepTitle: "Web-apps: productdenken in plaats van eenmalig project",
    deepLead:
      "Portals, tools en interne apps falen als ze alleen ‘mooi gebouwd’ zijn maar niet aansluiten op rollen, rechten en datastromen. Ik map jouw gebruikers, edge cases en integraties voordat we UI polish doen.",
    deepExtended:
      "Technisch kies ik wat past bij jouw team: Next.js, auth-providers, API-stijl. Business-wise vertaal ik het naar schermen die vertrouwen geven en stappen die logisch zijn. Zodat adoptie niet stokt na launch.",
    signals: [
      "Welke rollen doen wat. En welke data mogen ze zien?",
      "Moet de app offline-kunnen, realtime, of batch synchroniseren?",
      "Welke legacy-systemen blijven even staan. En hoe koppelen we veilig?",
      "Wat is je definitie van ‘succes’ na 90 dagen?",
    ],
  },
  optimalisatie: {
    deepTitle: "Snelheid: geen score-jacht, maar conversie en crawlruimte",
    deepLead:
      "Een goede optimalisatie start met meten op de pagina’s die geld of autoriteit dragen. Niet met een willekeurige homepage-score. Ik koppel LCP/INP aan templates, landingsverkeer en SEO-prioriteiten.",
    deepExtended:
      "Soms win je meer met het trimmen van één zware app op productpagina’s dan met micro-optimalisatie overal. Ik maak die afweging expliciet, inclusief wat het betekent voor je roadmap en je marketing.",
    signals: [
      "Welke URL-templates dragen de meeste omzet of leads?",
      "Welke third-parties zijn strikt nodig voor ads, consent of chat?",
      "Hoe snel schip je nu features. En waar botst dat met performance?",
      "Wat zijn je huidige CWV-knelpunten per device?",
    ],
  },
  seo: {
    deepTitle: "SEO: semantiek en echte antwoorden. Per niche anders",
    deepLead:
      "Lokale dienstverlening vraagt een andere informatiearchitectuur dan een SaaS met lange salescyclus of een webshop met duizenden SKU’s. Ik bouw clusters en techniek die passen bij hoe jouw doelgroep zoekt én koopt.",
    deepExtended:
      "Ik vermijd generieke ‘blogkalenders’ zonder zoekintentie. In plaats daarvan koppel ik content aan entities, interne links en conversiepaden. Zodat SEO en business hetzelfde doel hebben.",
    signals: [
      "Welke vragen stelt je ideale klant vóór de aankoop?",
      "Waar concurreer je: prijs, expertise, snelheid, vertrouwen?",
      "Hoe sterk is je technische basis (crawl, indexatie, duplicates)?",
      "Welke landen of talen zijn relevant. Nu of straks?",
    ],
  },
  adverteren: {
    deepTitle: "Ads: budget naar het juiste verhaal op het juiste moment",
    deepLead:
      "B2B met lange deals vraagt andere campagnes dan D2C met impulsaankopen. Ik koppel accountstructuur aan marge, inventaris en wat je site echt kan uitdragen. Geen losse creaties zonder landingspagina.",
    deepExtended:
      "We sturen op learning speed: welke audiences en hooks leveren snel inzicht? Daarna schalen we wat werkt en snijden we wat ruis geeft. Inclusief samenwerking met SEO/CRO als die de bottleneck is.",
    signals: [
      "Wat is je break-even CPA of ROAS. En hoe zeker is je marge?",
      "Welke landingspagina’s zijn ‘campaign-ready’?",
      "Hoe volwassen is je feed/catalogus voor shopping?",
      "Welke creatie-capaciteit heb je in-house?",
    ],
  },
  cro: {
    deepTitle: "CRO: psychologie + data. Per branche andere frictie",
    deepLead:
      "Checkout-frictie bij consumenten is iets anders dan formulier-angst bij B2B of vertrouwen bij hoge AOV. Ik formuleer hypotheses vanuit gedrag op jouw site. Niet vanuit ‘best practices’ die elders werkten.",
    deepExtended:
      "Experimenten zet ik alleen op als meetbaarheid klopt. Soms levert een UX-sprint met sessie-opnames meer op dan een A/B-test met te weinig volume. Dat maak ik inzichtelijk.",
    signals: [
      "Waar haken gebruikers af (scroll, rage clicks, formulier)?",
      "Wat is je traffic-volume per belangrijke funnel?",
      "Welke trust-signalen passen bij jouw doelgroep (reviews, keurmerken, menselijk contact)?",
      "Hoe ‘mobiel-first’ is je omzet werkelijk?",
    ],
  },
  leadgeneratie: {
    deepTitle: "Leads: kwaliteit boven volume. Per niche een ander aanbod",
    deepLead:
      "Een leadmagnet voor accountants ziet er anders uit dan voor e-commerce merchants of SaaS-trialers. Ik ontwerp aanbod, landingspagina en opvolging als één keten. Met scoring waar het zinvol is.",
    deepExtended:
      "Ik koppel leads aan CRM-automatisering zodat sales geen inbox-chaos krijgt. En we meten wat telt: niet alleen CPL, maar ook kwaliteit en doorlooptijd naar deal.",
    signals: [
      "Wie qualificeert leads. Sales, founder, SDR?",
      "Welke data vraag je wanneer (progressive profiling)?",
      "Welke concurrentie heeft vergelijkbare proposities. Hoe differentieer je?",
      "Welk CRM of stack gebruik je vandaag?",
    ],
  },
  automatisering: {
    deepTitle: "Automatisering: robuust waar het pijn doet",
    deepLead:
      "Ik automatiseer niet alles tegelijk. We beginnen waar handwerk het meest zeer doet of fouten maakt. En bouwen flows met logging en fallbacks zodat operations niet op zwart zaad zit.",
    deepExtended:
      "Tooling kies ik op basis van jouw hosting, budget en team-skill: soms is n8n self-hosted logisch, andere keren Make sneller. Transparantie over trade-offs hoort daarbij.",
    signals: [
      "Welke systemen zijn bron van waarheid voor klant, order, voorraad?",
      "Hoe vaak falen API’s vandaag. En wie lost dat op?",
      "Welke compliance (AVG, financieel) speelt mee?",
      "Wie beheert flows na live-gang?",
    ],
  },
  workflows: {
    deepTitle: "E-commerce workflows: keten denken, niet stapjes plakken",
    deepLead:
      "Van betaalde order tot retour: elke stap heeft edge cases (deels verzonden, gedeeltelijke refund, voorraad op meerdere locaties). Ik teken je keten uit voordat we automatiseren.",
    deepExtended:
      "Zo voorkom je ‘bijna goed’ mails naar klanten of voorraad die niet klopt. En je team weet wat er gebeurt als een koppeling uitvalt. Geen paniek, wel een duidelijk playbook.",
    signals: [
      "Hoe ziet je fulfilment eruit (eigen magazijn, 3PL, dropship)?",
      "Welke uitzonderingen komen wekelijks voor?",
      "Hoe communiceer je nu met klanten over status?",
      "Welke financiële exports moeten altijd kloppen?",
    ],
  },
  chatbots: {
    deepTitle: "AI & chatbots: nuttig voor team én klant",
    deepLead:
      "Een bot die foute antwoorden geeft is erger dan geen bot. Ik train op jouw echte kennisbronnen en ontwerp escalatie zodat mensen complexe cases zien. Met context.",
    deepExtended:
      "We meten welke vragen binnenkomen, waar gebruikers afhaken en wat tijd bespaart. Privacy en datastromen regelen we vanaf het begin, niet als patch.",
    signals: [
      "Welke vragen komen het vaakst bij support of sales?",
      "Welke documenten en feeds zijn leidend en up-to-date?",
      "Wanneer moet een mens overnemen. En hoe ziet die handoff eruit?",
      "Welke tone-of-voice past bij je merk?",
    ],
  },
  tracking: {
    deepTitle: "Tracking: één waarheid voor marketing en management",
    deepLead:
      "Als events niet kloppen, vechten kanalen om schuld. En optimaliseren is gokken. Ik ontwerp een event-spec die aansluit op je funnel, consent en tooling.",
    deepExtended:
      "Server-side of client-side tagging bepaal ik op risico, precisie en onderhoud. Het doel is dat jij campagnes én boardroom met dezelfde cijfers kunt bespreken.",
    signals: [
      "Welke conversies zijn ‘leading’ voor jullie beslissingen?",
      "Hoe ziet je cookie/consent setup eruit?",
      "Gebruik je enhanced conversions, offline imports, refunds?",
      "Welke dashboards gebruik je vandaag. En wat mist daar?",
    ],
  },
  branding: {
    deepTitle: "Branding: onderscheid dat ook in Figma en ads werkt",
    deepLead:
      "Positionering is geen woordenlijst. Het is keuzes in toon, kleur en vorm die overal terugkomen. Ik vertaal strategie naar richtlijnen die je team en partners kunnen volgen.",
    deepExtended:
      "Zo voorkom je dat je site strak is maar je ads nog ‘oud’ aanvoelen. Of omgekeerd. Eenheid bouwt vertrouwen, vooral bij hogere tickets of B2B.",
    signals: [
      "Wie zijn je echte alternatieven in het hoofd van de klant?",
      "Welke emotie of belofte moet je merk dragen (rust, energie, autoriteit)?",
      "Welke kanalen zijn het zichtbaarst. En waar breekt consistentie nu?",
      "Heb je al merkassets die we moeten respecteren of juist doorbreken?",
    ],
  },
  webdesign: {
    deepTitle: "UI/UX: conversie is context. Geen one-size template",
    deepLead:
      "Een checkout voor luxe goederen vraagt andere hiërarchie dan een snelle SaaS-trial of een formulier voor zorg. Ik ontwerp flows en schermen vanuit jouw klantreis.",
    deepExtended:
      "Design lever ik development-klaar: componenten, states en toegankelijkheid. Zo wordt bouwen voorspelbaar en blijft je merk consistent bij iteraties.",
    signals: [
      "Wat is de primaire actie per scherm. En wat is bewust secundair?",
      "Hoe kritisch is mobiel voor jouw omzet?",
      "Welke bestaande design systemen of merkregels gelden?",
      "Welke objections zien sales/support vaak terug in de funnel?",
    ],
  },
  animaties: {
    deepTitle: "Motion: energie die conversie dient",
    deepLead:
      "Te veel beweging afleidt; te weinig voelt saai. Ik kies per sectie welke animatie vertrouwen, hiërarchie of speelsheid ondersteunt. Binnen een performance-budget.",
    deepExtended:
      "Reduced motion respecteren hoort standaard. Zo blijft je site premium zonder gebruikers te verliezen die geen trillingen willen.",
    signals: [
      "Welke secties moeten ‘rust’ uitstralen. Welke ‘tempo’?",
      "Hoe zwaar is je pagina al vóór motion?",
      "Welk merkkarakter past bij beweging (strak, speels, luxe)?",
      "Waar mag animatie een story vertellen (product, proces)?",
    ],
  },
  media: {
    deepTitle: "Creatives: hooks die passen bij platform én merk",
    deepLead:
      "Wat werkt op Meta werkt niet 1:1 op YouTube of Display. Ik ontwerp varianten en hooks om te testen. Met dezelfde belofte als je landingspagina.",
    deepExtended:
      "Snel itereren op data hoort bij growth-teams; ik lever structuur in bestanden en benaming zodat je campagnes overzichtelijk blijven.",
    signals: [
      "Welke formats en lengtes gebruik je nu. En wat mist?",
      "Hoeveel creatie-capaciteit heb je intern?",
      "Welke UGC of studio-stijl past bij je doelgroep?",
      "Welke landings-URL’s zijn gekoppeld aan welke campagnes?",
    ],
  },
  email: {
    deepTitle: "E-mailmarketing: op het juiste moment, met de juiste boodschap",
    deepLead:
      "E-mail werkt als je de juiste mail op het juiste moment stuurt. Ik help met strategie, opzet en design: van je eerste nieuwsbrief tot automatische welkomstmails, herinnermails en opvolging na aankoop.",
    deepExtended:
      "Of je nu Klaviyo, Shopify Mail of een andere tool gebruikt: ik zorg dat je mails er professioneel uitzien, logisch doorlopen en aansluiten op je merk. Geen spam, wel mails die klanten waarderen en die verkopen ondersteunen.",
    signals: [
      "Welke mails stuur je nu al (welkom, nieuwsbrief, herinnering)?",
      "Welke e-mailtool gebruik je (Klaviyo, Shopify, Mailchimp)?",
      "Hoe segmenteer je klanten, en welke data heb je betrouwbaar?",
      "Welke toon past bij je merk: zakelijk, persoonlijk, luxe?",
    ],
  },
  strategie: {
    deepTitle: "Strategie: het plan dat bepaalt of de rest werkt",
    deepLead:
      "Voor BestRest bedachten we een eigen aanpak per product in plaats van één generieke funnel. Dat is de kern: jouw markt, marge en klant bepalen de route. Niet het trucje dat bij een ander werkte.",
    deepExtended:
      "Het plan is pas af als het uitvoerbaar is: wie doet wat, wat kost het en wanneer zie je resultaat. Omdat ik zelf bouw en uitvoer, weet ik wat realistisch is. Geen plan van twintig kanalen waarvan er achttien blijven liggen.",
    signals: [
      "Waar komt je omzet nu vandaan. En weet je dat zeker uit data?",
      "Wat mag een nieuwe klant je kosten, gezien je marge?",
      "Welke kanalen heb je al geprobeerd. En waarom stopten ze?",
      "Hoeveel tijd en budget kun je maandelijks vrijmaken?",
    ],
  },
  "ai-zoek": {
    deepTitle: "AI-zoek: het kanaal waar je concurrent nog niet is",
    deepLead:
      "ChatGPT, Perplexity en Google AI Overviews beantwoorden steeds vaker de vraag ‘welk bedrijf moet ik kiezen’. Wie daar als antwoord uitkomt, wint de klant voordat er ooit gezocht is in de klassieke resultaten.",
    deepExtended:
      "AI-modellen citeren bronnen die duidelijk, feitelijk en gestructureerd zijn. Ik richt je content, schema-markup en bedrijfsinformatie daarop in en meet waar je genoemd wordt. De basis overlapt met SEO, dus elke stap versterkt ook je gewone Google-posities.",
    signals: [
      "Wat antwoordt ChatGPT nu als iemand naar jouw soort bedrijf vraagt?",
      "Heeft je site duidelijke, citeerbare antwoorden op klantvragen?",
      "Klopt je bedrijfsinformatie overal (site, Google, registers)?",
      "Hoe sterk is je klassieke SEO-basis als fundament?",
    ],
  },
  "local-seo": {
    deepTitle: "Lokale SEO: de klant om de hoek wint van de hele wereld",
    deepLead:
      "Wie lokaal zoekt, wil snel kiezen: de kaart, drie bedrijven, sterren erbij. Klaar. Jouw plek in dat lijstje bepaalt of de telefoon gaat. Ik richt profiel, pagina's en reviews in op precies dat moment.",
    deepExtended:
      "Lokale vindbaarheid is een samenspel: een compleet Google Business-profiel, pagina's per dienst en regio, verse reviews en consistente gegevens overal. Elk onderdeel apart is klein werk; samen bepalen ze wie er wint.",
    signals: [
      "In welke regio's zitten je klanten echt?",
      "Hoe compleet en actueel is je Google Business-profiel?",
      "Hoeveel reviews krijg je per maand. En vraag je er actief om?",
      "Kloppen je naam, adres en telefoonnummer overal exact?",
    ],
  },
  "content-marketing": {
    deepTitle: "Content: autoriteit die verkeer én vertrouwen oplevert",
    deepLead:
      "Content zonder zoekintentie is bezigheidstherapie. Ik start bij wat jouw klant echt vraagt, in Google én aan AI, en bouw daar clusters omheen die autoriteit opbouwen per onderwerp.",
    deepExtended:
      "Elke pagina heeft een taak: verkeer binnenhalen, twijfel wegnemen of doorverwijzen naar je aanbod. Zo wordt content geen kostenpost maar een verkoopkanaal dat elke maand een beetje sterker wordt.",
    signals: [
      "Welke vragen stellen klanten vóór ze bij je kopen?",
      "Welke content heb je al. En wat doet die nu echt?",
      "Wie levert de vakkennis: jij, je team of wij samen?",
      "Waar moet content naartoe leiden: aanvraag, verkoop, vertrouwen?",
    ],
  },
  reviews: {
    deepTitle: "Reviews: het verkoopteam dat je niet hoeft te betalen",
    deepLead:
      "Vrijwel iedereen leest reviews vóór een aankoop, maar bijna geen bedrijf vraagt er structureel om. Dat gat is jouw kans: een vast systeem dat tevreden klanten op het juiste moment om een beoordeling vraagt.",
    deepExtended:
      "Meer reviews betekent hogere posities in Maps, sterren in Google en minder twijfel op je site. Kritische reviews horen erbij: netjes afgehandeld wekken ze vaak meer vertrouwen dan tien juichende.",
    signals: [
      "Op welke platforms kijkt jouw klant vóór de aankoop?",
      "Hoeveel reviews krijg je nu per maand, en hoe?",
      "Wat is je gemiddelde score. En die van je grootste concurrent?",
      "Wie reageert er nu op reviews, en hoe snel?",
    ],
  },
  "google-ads": {
    deepTitle: "Google Ads: betalen voor klanten, niet voor klikken",
    deepLead:
      "Het moment dat iemand zoekt naar wat jij verkoopt is het beste marketingmoment dat bestaat. Maar Google verdient aan je klikken, niet aan je omzet. Ik bouw campagnes die dat verschil bewaken.",
    deepExtended:
      "Dat betekent: een structuur die je snapt, zoektermen uitsluiten die nooit converteren en meting die klopt tot aan de verkoop. Pas als de cijfers kloppen, gaan we schalen. Niet andersom.",
    signals: [
      "Wat mag een klant je kosten, gezien je marge?",
      "Welke zoektermen leveren nu omzet. En welke alleen kosten?",
      "Hoe campaign-ready zijn je landingspagina's?",
      "Klopt je conversiemeting tot en met de verkoop?",
    ],
  },
  "meta-ads": {
    deepTitle: "Meta Ads: verkopen aan mensen die nog niet zochten",
    deepLead:
      "Op Facebook en Instagram onderbreek je iemand die iets anders aan het doen was. Dat lukt alleen met content die niet als advertentie voelt en een aanbod dat direct duidelijk is.",
    deepExtended:
      "Daarom draait Meta bij mij om creatives: varianten testen, winnaars schalen, verliezers eruit. De doelgroep-machine van Meta doet de rest, mits je meting klopt en je funnel logisch doorloopt van eerste kennismaking tot aankoop.",
    signals: [
      "Welke content heb je al die bewezen aandacht pakt?",
      "Hoe snel kun je nieuwe creatives leveren of laten maken?",
      "Wat is je marge per verkoop. En je herhaalaankoop-potentieel?",
      "Hoe warm is je publiek al (volgers, mail-lijst, eerdere kopers)?",
    ],
  },
  "social-media": {
    deepTitle: "Social: het uithangbord waar klanten je checken",
    deepLead:
      "Voordat iemand koopt, kijkt hij vaak even op je Instagram of LinkedIn: leeft dit bedrijf, is het echt? Een verzorgd kanaal met ritme doet daar meer dan virale uitschieters.",
    deepExtended:
      "Ik kies formats die jouw team kan volhouden en die aansluiten op je site en campagnes. Eén verhaal overal, dat is het doel. Twee kanalen goed verslaan vijf kanalen halfslachtig.",
    signals: [
      "Waar zit jouw klant echt: Instagram, TikTok, LinkedIn?",
      "Wie maakt content, en hoeveel tijd is er per week?",
      "Wat moet social opleveren: vertrouwen, bereik of direct verkeer?",
      "Welke content werkte eerder al goed?",
    ],
  },
  ugc: {
    deepTitle: "UGC: echte mensen verkopen beter dan studio's",
    deepLead:
      "Advertenties die eruitzien als content van een echte gebruiker presteren in veel markten beter dan gelikte producties. Niet omdat ze mooier zijn, maar omdat ze geloofwaardiger zijn.",
    deepExtended:
      "Ik regel de hele keten: creators selecteren, brieven, scripts, rechten en de varianten die je nodig hebt om te testen. Jij krijgt een stroom verse content voor je campagnes, zonder zelf te hoeven regisseren.",
    signals: [
      "Welk product of aanbod leent zich het best voor video?",
      "Welke bezwaren van klanten moet de content wegnemen?",
      "Hoeveel varianten heb je nodig per maand voor je campagnes?",
      "Zijn er klanten die nu al enthousiast content over je maken?",
    ],
  },
  "influencer-marketing": {
    deepTitle: "Influencers: bereik kopen dat ook echt bestaat",
    deepLead:
      "Influencer marketing heeft een slechte naam door gekochte volgers en vage deals. Zonde, want een goede match levert bereik, vertrouwen en content in één keer op.",
    deepExtended:
      "Ik selecteer op echt engagement, maak afspraken zwart op wit en meet elke samenwerking met eigen codes of links. Zo weet je per creator wat het heeft opgeleverd. En bouw je verder met wie levert.",
    signals: [
      "Welke creators volgen jouw klanten echt?",
      "Past je marge bij vergoedingen in jouw branche?",
      "Wil je bereik, content, of allebei uit de samenwerking?",
      "Zijn er eerdere samenwerkingen geweest. En wat leverden die op?",
    ],
  },
  marketplaces: {
    deepTitle: "Bol & Amazon: het schap waar je klant al staat",
    deepLead:
      "Voor veel producten begint de zoektocht niet in Google maar direct op Bol of Amazon. Wie daar niet goed vindbaar is, laat omzet liggen bij klanten die al willen kopen.",
    deepExtended:
      "Ik optimaliseer listings op zoekgedrag binnen de marketplace, bouw reviews op en zet advertenties in waar de marge het toelaat. Altijd afgestemd op je eigen shop, zodat kanalen elkaar versterken in plaats van kannibaliseren.",
    signals: [
      "Welke producten passen qua marge bij marketplace-kosten?",
      "Hoe zien je huidige listings en reviews eruit?",
      "Wie doet fulfilment: zelf, via Bol of via Amazon?",
      "Hoe voorkom je prijsconflicten met je eigen webshop?",
    ],
  },
  retentie: {
    deepTitle: "Retentie: de goedkoopste omzet die er bestaat",
    deepLead:
      "Een bestaande klant heeft geen advertentie meer nodig: hij kent je al en vertrouwt je al. Toch krijgt hij bij de meeste bedrijven na de aankoop nooit meer een goede reden om terug te komen.",
    deepExtended:
      "Ik bouw dat wel: opvolging na aankoop, loyaliteitsacties, win-back campagnes en SMS waar het past. Gemeten op herhaalaankopen en klantwaarde. Elke procent retentie erbij geeft je meer ruimte om nieuwe klanten te werven.",
    signals: [
      "Hoeveel klanten kopen nu een tweede keer?",
      "Wat is de logische termijn voor een herhaalaankoop bij jouw product?",
      "Welke data heb je over klanten (aankopen, voorkeuren, e-mail)?",
      "Welke tools gebruik je nu voor mail en SMS?",
    ],
  },
};

function fallbackSlugContent(slug: string): Omit<DienstStrategicContent, "scenarios"> {
  return {
    deepTitle: "Op maat voor jouw situatie",
    deepLead:
      "Deze dienst wordt per klant anders ingevuld: ik start met jouw markt, stack en doelen. Niet met een standaard pakket.",
    deepExtended:
      "In een kort gesprek breng ik scope, risico’s en quick wins in kaart. Daarna krijg je een voorstel waarin duidelijk is wat we bouwen, meten en opleveren. Transparant en zonder jargon waar het niet nodig is.",
    signals: [
      "Wat wil je over 90 dagen bereikt zien?",
      "Welke systemen en teams raken we?",
      "Wat is nu de grootste bottleneck. Techniek, traffic of conversie?",
      "Hoe wil je samenwerken (embedded, project, retainer)?",
    ],
  };
}

export function getDienstStrategic(
  slug: string,
  pillar: string,
): DienstStrategicContent & { pillarLens: string } {
  const core = BY_SLUG[slug] ?? fallbackSlugContent(slug);
  const scenarios =
    SCENARIOS_BY_SLUG[slug] ??
    SCENARIOS_BY_PILLAR[pillar] ??
    SCENARIOS_BY_PILLAR.Bouwen;
  return {
    ...core,
    scenarios,
    pillarLens:
      PILLAR_LENS[pillar] ??
      PILLAR_LENS.Bouwen,
  };
}

export const STRATEGY_MANIFESTO = {
  title: "Geen standaardpakketten. Wél een plan op maat",
  paragraphs: [
    "Ik geloof niet dat hetzelfde plan voor elke onderneming werkt. Wat een webshop nodig heeft, verschilt van een B2B-dienstverlener of een lokale retailer. Zelfs als ze allemaal ‘een site’ willen.",
    "Daarom start elk traject met luisteren: wie is je klant, waar zit je winst, welke systemen gebruik je, en waar verlies je nu tijd of omzet? Pas daarna kies ik welke diensten, tools en volgorde het beste passen.",
    "Als allrounder verbind ik web, marketing en dagelijkse operatie. Jij krijgt geen eindeloze keten van losse specialisten, maar één duidelijke lijn, met taal die je begrijpt, niet jargon om indruk te maken.",
  ],
} as const;

/** Korte inzichten voor de homepage. Lange manifesto-paragrafen blijven op dienstpagina’s */
export const STRATEGY_SIGNATURE_INSIGHTS = [
  {
    title: "Elke markt vraagt om een eigen route",
    body: "Webshop, B2B, retail of SaaS: zelfs met dezelfde wens (‘een site’) hoort een andere aanpak. Geen kopie van de vorige klant.",
  },
  {
    title: "Eerst begrijpen, dan pas kiezen",
    body: "Klant, winst, systemen en knelpunten bepalen of je site, SEO, ads, e-mail of automatisering nu het meeste oplevert.",
  },
  {
    title: "Eén lijn, geen eindeloze keten",
    body: "Web, marketing en operatie hangen samen. Jij krijgt één duidelijke lijn, minder gedoe tussen losse partijen.",
  },
] as const;
