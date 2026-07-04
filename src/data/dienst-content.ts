/**
 * Uitgebreide dienstteksten. Uniek per slug, afgestemd op MeneerMarketing-positionering.
 */
export interface DienstBody {
  intro: string;
  bullets: string[];
  closing: string;
}

const FALLBACK_CLOSING =
  "We koppelen dit altijd aan jouw groeidoelen: wat er eerst moet, wat later kan, en wat je zelf wilt leren beheren.";

function body(
  intro: string,
  bullets: [string, string, string, string],
  closing?: string,
): DienstBody {
  return { intro, bullets: [...bullets], closing: closing ?? FALLBACK_CLOSING };
}

const CONTENT = {
  "shopify-enterprise": body(
    "Ik ben Shopify-expert en bouw webshops from scratch. Geen theme uit de store, geen template dat op honderd andere shops lijkt. Custom theme, custom secties, precies passend bij jouw merk. In Shopify is vrijwel alles mogelijk. Ik weet hoe.",
    [
      "Custom Shopify-themes from scratch, geen kant-en-klare templates",
      "Checkout, bundles, portals en koppelingen waar jij ze nodig hebt",
      "Storefront API, webhooks en automatisering netjes ingebouwd",
      "Performance en Core Web Vitals als harde eis, niet als bijlage",
    ],
  ),
  webdevelopment: body(
    "Ik bouw websites from scratch, geen kant-en-klare templates. Alles custom: snel, veilig en precies passend bij jouw bedrijf. Of het nu een bedrijfswebsite, landingspagina of portal is.",
    [
      "Volledig op maat: design, structuur en code passend bij jouw merk",
      "Snelle laadtijden en goede vindbaarheid in Google (SEO)",
      "Eenvoudig beheer: je team kan zelf content aanpassen zonder technische kennis",
      "Duidelijke overdracht: je bent niet afhankelijk van ‘iemand die het ooit bouwde’",
    ],
  ),
  "web-apps": body(
    "Soms is een website te kort door de bocht. Je wilt een B2B-portaal waar klanten zelf bestellen, een boekingsapp met agenda, of een interne tool die je team echt gebruikt. Ik bouw webapps en portalen from scratch in Next.js: typed, snel en klaar om te koppelen aan Shopify, je CRM of e-mail.",
    [
      "Rollen en rechten die kloppen: salon, admin, klant. Ieder ziet wat hij mag zien",
      "Koppelingen met Shopify, CRM en automatisering zonder copy-paste tussen tabbladen",
      "UI die vertrouwen geeft. Geen engineer-only schermen waar niemand mee wil werken",
      "Documentatie en overdracht: je zit niet vast aan obscure code of een developer die weg is",
    ],
  ),
  optimalisatie: body(
    "Trage sites kosten omzet. En SEO-ruimte. Ik doe geen cosmetische ‘speed plugin’ maar code-, asset- en serverlaag: meten, prioriteren, oplossen, opnieuw meten.",
    [
      "LCP, CLS en INP: concrete fixes, geen vage scores",
      "Afbeeldingen, fonts, third-party scripts en theme-bloat aangepakt",
      "Technische SEO en crawlbaarheid die meelift op snelheid",
      "Documentatie zodat het snel blijft na nieuwe features",
    ],
  ),
  seo: body(
    "SEO betekent: gevonden worden in Google door de juiste content, een logische site-structuur en techniek die goed werkt. Geen trucjes, wel een site die antwoord geeft op wat je klanten zoeken.",
    [
      "Site-structuur die logisch is voor bezoekers én Google",
      "Content die écht helpt, niet gekopieerd van concurrenten",
      "Interne links, schema-markup en snippets die je zichtbaarheid vergroten",
      "Meten wat werkt: Search Console, rankings en conversie per pagina",
    ],
  ),
  adverteren: body(
    "Google Ads en Meta werken als creatie, landingspagina’s en data hetzelfde verhaal vertellen. Ik zet campagnes op die je kunt sturen: met heldere KPI’s, experimenten en geen budgetverbranding op zoektermen die nooit converteren.",
    [
      "Account-structuur en audiences die passen bij jouw marge en salescyclus",
      "Creatives en copy afgestemd op funnel en propositie",
      "Conversiemeting die klopt. Anders optimaliser je op ruis",
      "Schaalpad: wanneer meer budget zinvol is, en wanneer eerst de site moet",
    ],
  ),
  cro: body(
    "CRO (conversie-optimalisatie) betekent: meer klanten uit hetzelfde aantal bezoekers. Ik kijk waar mensen afhaken, wat twijfel wegneemt en welke knoppen of teksten beter kunnen.",
    [
      "Verbeteringen op basis van gedrag en data, niet op gevoel",
      "A/B-tests (twee versies vergelijken) met eerlijke conclusies",
      "Checkout, formulieren en mobiel als eerste prioriteit",
      "Samenwerking met ads en SEO zodat bezoekers ook de juiste bezoekers zijn",
    ],
  ),
  leadgeneratie: body(
    "B2B en e-commerce hebben allebei een pijplijn nodig. Ik ontwerp aanbod, landingspagina’s en follow-up (e-mail, automatisering) zodat leads niet verdwijnen in de inbox.",
    [
      "Leadmagneten en proposities die aansluiten op echte pijnpunten",
      "Forms, CRM-koppelingen en scoring waar het zinvol is",
      "Sequences die menselijk blijven. Geen spammachine",
      "Rapportage: kosten per lead, kwaliteit en doorloop naar deal",
    ],
  ),
  automatisering: body(
    "Handwerk schaalt niet. En kost fouten. Met n8n en Make koppel ik orders, klanten, voorraad en marketing tot rustige workflows die je team tijd teruggeven.",
    [
      "Inventarisatie: welke systemen, welke triggers, welke edge cases",
      "Robuuste flows met logging, alerts en fallbacks",
      "Geen vendor-lock-in: documentatie en eigenaarschap bij jou",
      "Security: secrets, scopes en minimale rechten per integratie",
    ],
  ),
  workflows: body(
    "E-commerce workflows zijn het zenuwstelsel van je shop: van bestelling tot levering en herhaalaankoop. Ik automatiseer de keten zodat jij schaalt zonder Excel-stress.",
    [
      "Order → ERP/boekhouding → fulfilment → track & trace",
      "Voorraad, dropship en multi-warehouse scenario’s",
      "Retours, refunds en klantmails die kloppen met je merk",
      "Foutafhandeling: wat gebeurt er als een API even faalt?",
    ],
  ),
  chatbots: body(
    "Een goede bot is geen gimmick maar een verlengstuk van je team. Getraind op jouw producten, policies en tone of voice. Ik zet RAG-chatflows op die pre-sales en support ontlasten zonder menselijkheid te verliezen.",
    [
      "Kennisbron: site, FAQ, PDF’s, productfeed. Gestructureerd ingelezen",
      "Escalatie naar mens waar het moet, met context mee",
      "Meting: welke vragen, waar haken mensen af, wat levert het op?",
      "Privacy en AVG: datastromen vanaf dag één goed neergezet",
    ],
  ),
  tracking: body(
    "Als meting niet klopt, beslis je verkeerd. Ik bouw GTM/server-side setups, dataLayer’s en Clarity/Analytics zo dat je campagnes, site en shop één waarheid hebben.",
    [
      "Event-spec op maat: e-commerce, leads, scroll, video, formulieren",
      "Consent en tags die netjes samenwerken",
      "Debug-proces zodat je team issues snel vindt",
      "Dashboards die je écht gebruikt. Geen 40 tabbladen",
    ],
  ),
  branding: body(
    "Je merk is meer dan een logo: het is toon, typografie, kleur en hoe klanten je herkennen in ads, site en mail. Ik zet merkstrategie en huisstijl neer die verkopen én schaal geven.",
    [
      "Positionering en onderscheid ten opzichte van concurrenten",
      "Kleuren, type, beeldstijl en componenten voor alle kanalen",
      "Brand guidelines die je team en partners kunnen volgen",
      "Afstemming met web en campagnes. Geen los PDF-boekje",
    ],
  ),
  webdesign: body(
    "UI/UX gaat over vertrouwen, hiërarchie en conversie. Ik ontwerp schermen die rust uitstralen en duidelijk maken wat de volgende stap is. Op desktop en mobiel.",
    [
      "Wireframes en flows vóór pixels, zodat structuur klopt",
      "Design system-light: herhaalbare patronen voor snelheid",
      "Afstemming met development: Figma die daadwerkelijk te bouwen is",
      "Toegankelijkheid: contrast, focus states en semantiek meegenomen",
    ],
  ),
  animaties: body(
    "Motion is de laag die je site onvergetelijk maakt. Als het gericht is. Ik ontwerp micro-interacties en scroll-storytelling die conversie ondersteunen, niet afleiden.",
    [
      "Performance-budget: animaties die GPU-vriendelijk blijven",
      "Framer Motion / CSS: wat past bij stack en onderhoud",
      "Reduced motion respecteren voor toegankelijkheid",
      "Storyboard: welke sectie krijgt welke energie?",
    ],
  ),
  media: body(
    "Ads en social hebben beelden die stoppen met scrollen. Zonder je merk te verloochenen. Ik denk mee van concept tot export: formats voor Meta, Google en site.",
    [
      "Hooks en varianten voor testen in campagnes",
      "Consistentie met je huisstijl en landingspagina’s",
      "Snelle iteraties op basis van performance-data",
      "Werkfiles en structuur zodat je team door kan bouwen",
    ],
  ),
  email: body(
    "E-mailmarketing is nog steeds een van de sterkste manieren om klanten te binden en te verkopen. Ik help met strategie, opzet en design: van je eerste nieuwsbrief tot automatische welkomstmails en herinnermails bij verlaten winkelwagen.",
    [
      "Nieuwsbrieven en campagnes die passen bij je merk en doelgroep",
      "Automatische flows: welkom, verlaten winkelwagen, na aankoop, op maat",
      "Koppeling met Klaviyo, Shopify Mail of jouw e-mailtool",
      "Templates die er professioneel uitzien op telefoon én desktop",
    ],
  ),
  strategie: body(
    "De meeste marketing mislukt niet door slechte uitvoering maar door een ontbrekend plan. Ik maak één groeiplan voor jouw bedrijf: welke kanalen, welk budget, in welke volgorde. En omdat ik het zelf uitvoer, blijft het geen papier.",
    [
      "Analyse van je cijfers: waar komt omzet vandaan, waar lekt het weg",
      "Keuze voor de kanalen waar jouw groei het snelst zit, met onderbouwing",
      "Concreet plan met volgorde, budget en verwachting per stap",
      "Maandelijkse bijsturing: wat werkt krijgt meer, wat niet werkt gaat eruit",
    ],
  ),
  "ai-zoek": body(
    "Steeds meer klanten vragen niet aan Google maar aan ChatGPT, Gemini of Claude welk bedrijf ze moeten kiezen. Als jouw site daar niet als antwoord uitkomt, ben je voor die klant geen optie. Ik zorg dat AI-zoekmachines jouw bedrijf kennen, begrijpen en aanraden.",
    [
      "Content en structuur die AI-modellen kunnen lezen en citeren",
      "Schema-markup en technische signalen die je autoriteit onderbouwen",
      "Meting: waar word je nu genoemd in ChatGPT, Gemini, Claude en AI Overviews",
      "Combinatie met klassieke SEO, want beide voeden elkaar",
    ],
  ),
  "local-seo": body(
    "Als iemand in jouw regio zoekt naar wat jij doet, wil je bovenaan staan. In Google, in Maps en in de lokale resultaten. Ik richt je Google Business-profiel, lokale pagina's en reviews zo in dat je die klant wint.",
    [
      "Google Business-profiel volledig en scherp ingericht",
      "Lokale landingspagina's die scoren op 'dienst + plaats'",
      "Reviewstrategie: meer en betere beoordelingen op de juiste plekken",
      "Consistente bedrijfsgegevens overal waar je vindbaar bent",
    ],
  ),
  "content-marketing": body(
    "Goede content is de motor achter vindbaarheid, autoriteit en vertrouwen. Ik schrijf en structureer content die de vragen van jouw klant echt beantwoordt. Geen opgeblazen blogkalender, wel pagina's die verkeer én klanten opleveren.",
    [
      "Contentplan op basis van wat jouw klant echt zoekt en vraagt",
      "Artikelen en pagina's die scoren in Google én in AI-zoek",
      "Interne linkstructuur die autoriteit opbouwt per onderwerp",
      "Meting per pagina: verkeer, posities en wat het oplevert",
    ],
  ),
  reviews: body(
    "Negen van de tien klanten lezen reviews voordat ze kopen. Toch laten de meeste bedrijven dit kanaal op zijn beloop. Ik bouw een systeem dat tevreden klanten op het juiste moment om een beoordeling vraagt. Op de plekken waar je doelgroep kijkt.",
    [
      "Automatische reviewverzoeken na aankoop of afronding",
      "Focus op de platforms die tellen: Google, Trustpilot of branche-specifiek",
      "Reviews zichtbaar op je site, mét schema-markup voor sterren in Google",
      "Nette afhandeling van kritische reviews, want die horen erbij",
    ],
  ),
  "google-ads": body(
    "Google Ads werkt op het beste moment dat er is: wanneer iemand actief zoekt naar wat jij verkoopt. Ik zet campagnes op met een structuur die je snapt, meting die klopt en budget dat naar klanten gaat in plaats van naar loze klikken.",
    [
      "Zoekwoorden en campagnestructuur passend bij jouw marge en aanbod",
      "Shopping en Performance Max waar dat zinvol is, niet standaard",
      "Uitsluiten wat niet converteert, zodat budget niet weglekt",
      "Maandelijkse rapportage in gewone taal: wat kostte het, wat leverde het op",
    ],
  ),
  "meta-ads": body(
    "Meta Ads (Facebook en Instagram) zijn de plek waar je klanten bereikt die nog niet naar je zoeken. Dat vraagt om sterke creatives en scherpe doelgroepen. Ik zet campagnes op die verkopen, met content die niet als advertentie voelt.",
    [
      "Campagnestructuur van koud publiek tot terugkerende kopers",
      "Creatives en hooks die stoppen met scrollen, getest in varianten",
      "Doelgroepen en retargeting afgestemd op jouw funnel",
      "Meting die klopt, ook na alle privacy-veranderingen",
    ],
  ),
  "social-media": body(
    "Organische social media is het uithangbord van je merk: de plek waar klanten checken of je echt bent. Ik help met een ritme en format dat vol te houden is en dat past bij jouw bedrijf. Geen dagelijkse dansjes, wel consistente zichtbaarheid.",
    [
      "Kanaalkeuze: waar zit jouw klant echt (Instagram, TikTok, LinkedIn)",
      "Formats en ritme die je team kan volhouden",
      "Content die aansluit op je campagnes en site, één verhaal overal",
      "Meting op wat telt: bereik dat leidt tot bezoek en aanvragen",
    ],
  ),
  ugc: body(
    "Content van echte mensen verkoopt beter dan gelikte studioproducties. Zeker in advertenties. Ik regel UGC (user generated content): video's door creators die jouw product laten zien zoals klanten het gebruiken.",
    [
      "Briefings en scripts zodat creators jouw verhaal goed vertellen",
      "Selectie van creators die passen bij je product en doelgroep",
      "Varianten en hooks om te testen in Meta- en Google-campagnes",
      "Rechten en hergebruik netjes geregeld, zodat je content overal mag inzetten",
    ],
  ),
  "influencer-marketing": body(
    "Influencer marketing werkt als de match klopt: het juiste account, de juiste afspraken en een meetbare uitkomst. Ik vind creators die passen bij je merk en marge, en regel de samenwerking van eerste bericht tot rapportage.",
    [
      "Selectie op echt bereik en engagement, niet op gekochte volgers",
      "Heldere afspraken: content, timing, rechten en vergoeding",
      "Kortingscodes en tracking zodat je ziet wat elke samenwerking oplevert",
      "Langdurige samenwerkingen waar dat loont, losse posts waar dat past",
    ],
  ),
  marketplaces: body(
    "Bol en Amazon zijn voor veel producten het eerste zoekkanaal, nog vóór Google. Ik zorg dat je producten daar gevonden en gekozen worden: listings die scoren, reviews die overtuigen en advertenties die renderen.",
    [
      "Listings geoptimaliseerd op zoekgedrag binnen Bol en Amazon",
      "Reviewopbouw en Buy Box-strategie",
      "Advertenties binnen de marketplace, gestuurd op marge",
      "Afstemming met je eigen webshop, zodat kanalen elkaar niet kannibaliseren",
    ],
  ),
  retentie: body(
    "Een nieuwe klant werven kost al snel vijf keer meer dan een bestaande behouden. Ik bouw retentie op: loyaliteitsacties, SMS en opvolging die van eenmalige kopers vaste klanten maken.",
    [
      "Klantreis na de eerste aankoop in kaart: waar verdwijnen klanten stilletjes",
      "Loyaliteitsprogramma's en win-back campagnes die passen bij je marge",
      "SMS en e-mail gecombineerd op de momenten dat het logisch is",
      "Meting op herhaalaankopen en klantwaarde, niet op losse opens",
    ],
  ),
} as const satisfies Record<string, DienstBody>;

export function getDienstContent(slug: string): DienstBody {
  const hit = CONTENT[slug as keyof typeof CONTENT];
  if (hit) return hit;
  return {
    intro:
      "Deze dienstpagina wordt nog aangevuld met jouw specifieke voorkeuren. Neem contact op voor een korte afstemming. Dan maken we de copy en cases 100% op maat.",
    bullets: [
      "Scope en succescriteria in een eerste gesprek scherp",
      "Voorbeeldtraject en planning op basis van jouw situatie",
      "Transparant over tools, uren en verwachte impact",
    ],
    closing: FALLBACK_CLOSING,
  };
}
