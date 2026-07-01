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
    "Shopify schaalt pas echt als thema, apps, data en campagnes niet tegen elkaar werken. Ik richt enterprise-trajecten in op snelheid, overzicht en een codebase die je team begrijpt. Geen black box.",
    [
      "Thema-architectuur en secties die meegroeien met je assortiment en merk",
      "Checkout, B2B, bundles en internationale storefronts waar nodig",
      "Koppelingen via Storefront API, webhooks en automatisering buiten de admin om",
      "Performance en Core Web Vitals als harde eis, niet als bijlage",
    ],
  ),
  webdevelopment: body(
    "Ik bouw websites from scratch, geen kant-en-klare templates. Alles is maatwerk: snel, veilig en precies passend bij jouw bedrijf. Of het nu een bedrijfswebsite, landingspagina of portal is.",
    [
      "Volledig op maat: design, structuur en code passend bij jouw merk",
      "Snelle laadtijden en goede vindbaarheid in Google (SEO)",
      "Eenvoudig beheer: je team kan zelf content aanpassen zonder technische kennis",
      "Duidelijke overdracht: je bent niet afhankelijk van ‘iemand die het ooit bouwde’",
    ],
  ),
  "web-apps": body(
    "Soms is een site te kort door de bocht: je wilt portals, calculators, ledenomgevingen of interne tools. Met React en Next.js lever ik web-apps die voelen als product: snel, typed en klaar om te koppelen aan je bestaande stack.",
    [
      "Auth, rollen en datastromen die passen bij jouw organisatie",
      "Koppelingen met je andere systemen (CRM, Shopify, automatisering) netjes opgezet",
      "UI die conversie en vertrouwen combineert. Geen engineer-only schermen",
      "Deploy en monitoring zoals je van een serieuze stack verwacht",
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
