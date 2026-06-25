import type { PillarSlug } from "@/lib/navigation";

export interface PillarStat {
  label: string;
  value: string;
}

export interface PillarProcessStep {
  title: string;
  body: string;
}

export interface PillarPageData {
  slug: PillarSlug;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  headline: string;
  subheadline: string;
  stats: PillarStat[];
  introParagraphs: string[];
  angleTitle: string;
  angleBody: string;
  serviceIntro: string;
  processTitle: string;
  processSteps: PillarProcessStep[];
  proofTitle: string;
  proofBody: string;
  ctaTitle: string;
  ctaBody: string;
}

export const pillarPages: Record<PillarSlug, PillarPageData> = {
  bouwen: {
    slug: "bouwen",
    metaTitle: "Bouwen. Webshops, sites en web-apps die schaalbaar zijn",
    metaDescription:
      "Maatwerk websites, Shopify-thema's en web-apps: snel, veilig en gebouwd om mee te groeien. MeneerMarketing bouwt het fundament achter je groei.",
    keywords: [
      "Shopify development",
      "maatwerk website",
      "webdevelopment Nederland",
      "Shopify thema op maat",
      "web app ontwikkeling",
      "website snelheid optimalisatie",
    ],
    headline: "Bouwen zonder plafond.",
    subheadline:
      "Van Shopify-thema's tot websites from scratch en web-apps: alles op maat, snel en klaar voor marketing, automatisering en groei.",
    stats: [
      { label: "Focus", value: "Snelheid · SEO · veiligheid" },
      { label: "Platforms", value: "Shopify · Next.js · maatwerk" },
      { label: "Werkwijze", value: "Stap voor stap · transparant" },
    ],
    introParagraphs: [
      "De meeste traagheid op het web komt niet van één plugin, maar van keuzes die niet passen: een template dat niet klopt, apps die botsen, content zonder structuur. Wij keren dat om: eerst een goed plan, dan pas bouwen.",
      "Of je nu een internationale webshop, een site met honderden pagina's of een klantportaal nodig hebt: het fundament moet hetzelfde doen. Snel laden, makkelijk beheren, en ruimte om te groeien zonder alles opnieuw te moeten doen.",
    ],
    angleTitle: "Waarom MeneerMarketing anders bouwt",
    angleBody:
      "We denken vanuit groei: wat gebeurt er als verkeer verdubbelt, als je nieuwe markten opent, als je marketing strakkere landingspagina’s nodig heeft? Daarom combineren we strakke frontends met robuuste koppelingen, logging en documentatie. Geen black box.",
    serviceIntro:
      "Kies een concreet traject of start met een korte technische scan. Dan weten we exact waar de winst zit.",
    processTitle: "Zo loopt een bouwtraject",
    processSteps: [
      {
        title: "Discovery & stack-match",
        body: "We brengen doelen, verkeer, integraties en team-skill in kaart. Geen scope-creep zonder rationale.",
      },
      {
        title: "Architectuur & ontwerp",
        body: "Informatiestructuur, componenten en performance-budget vóór we massaal pixels of secties bouwen.",
      },
      {
        title: "Build, test, launch",
        body: "Iteratieve oplevering, harde checks op CWV en regressies, en een launch die marketing niet lamlegt.",
      },
      {
        title: "Overdracht & doorontwikkeling",
        body: "Je krijgt duidelijke repos, documentatie en een roadmap voor doorontwikkeling. Met of zonder ons.",
      },
    ],
    proofTitle: "Waar je direct winst pakt",
    proofBody:
      "Snelheid en stabiliteit converteren. En maken SEO en ads goedkoper. Wij meten voor/na, koppelen dat aan je analytics en vertalen het naar concrete volgende stappen.",
    ctaTitle: "Klaar om het fundament te versterken?",
    ctaBody:
      "Plan een Groeiscan of start-intake. We koppelen bouw aan je groeidoelen en maken prioriteit helder.",
  },
  groeien: {
    slug: "groeien",
    metaTitle: "Groeien. SEO, ads, e-mail, CRO en leadgeneratie",
    metaDescription:
      "SEO, Google Ads & Meta, e-mailmarketing, conversie-optimalisatie en leadgeneratie. Alles op één lijn met je site en webshop.",
    keywords: [
      "SEO bureau Nederland",
      "Google Ads specialist",
      "Meta ads e-commerce",
      "e-mailmarketing",
      "conversie optimalisatie",
      "B2B leadgeneratie",
    ],
    headline: "Groeien zonder ruis.",
    subheadline:
      "Meer bezoekers is geen doel — meer klanten en omzet wel. Wij zetten SEO, advertenties, e-mail en je website op één lijn.",
    stats: [
      { label: "SEO", value: "Content · structuur · techniek" },
      { label: "Ads", value: "Google · Meta · testen" },
      { label: "E-mail", value: "Nieuwsbrief · flows · Klaviyo" },
    ],
    introParagraphs: [
      "In 2026 wint wie duidelijk is: een site met goede antwoorden, campagnes die hetzelfde beloven als je landingspagina, en e-mails die op het juiste moment aankomen. Wij bouwen die lijn — van structuur tot advertentie.",
      "Of je nu meer wilt verkopen in je webshop, B2B-leads wilt genereren of een nieuwe markt wilt testen: we starten met meten. Zonder goede data is optimaliseren gokken.",
    ],
    angleTitle: "Marketing die techniek respecteert",
    angleBody:
      "Geen losse ads-copy los van je site. We werken samen met je bouw- en trackinglaag zodat budget naar zoektermen en audiences gaat die écht converteren. En SEO niet wordt gesaboteerd door trage templates.",
    serviceIntro:
      "Per discipline hebben we scherpe trajecten; samen vormen ze een groeisysteem.",
    processTitle: "Ons groeiframe",
    processSteps: [
      {
        title: "Baseline & KPI’s",
        body: "Wat telt: omzet, leads, CPA, MER of iets anders? We zetten dashboards en events goed.",
      },
      {
        title: "Strategie per kanaal",
        body: "SEO-roadmap, accountstructuur voor ads, CRO-backlog. Afgestemd op marge en salescyclus.",
      },
      {
        title: "Uitvoering & experimenten",
        body: "Content, campagnes, landingspagina’s en tests in vaste cadans. Met heldere hypotheses.",
      },
      {
        title: "Schaal of scherpstellen",
        body: "We schalen wat werkt, snijden wat niet werkt af, en herinvesteren in SEO/CRO voor compound growth.",
      },
    ],
    proofTitle: "Compound effect",
    proofBody:
      "SEO + CRO + ads versterken elkaar als dezelfde propositie overal terugkomt. Dat is geen theorie. Dat is minder CPA en meer organisch volume op dezelfde site.",
    ctaTitle: "Zet groei op de rit",
    ctaBody:
      "Start met de Groeiscan. We prioriteren kanalen op basis van impact en haalbaarheid.",
  },
  automatiseren: {
    slug: "automatiseren",
    metaTitle: "Automatiseren. Workflows met n8n, Make en slimme datastromen",
    metaDescription:
      "Orders, klanten, voorraad en marketing gekoppeld: minder handwerk, minder fouten. MeneerMarketing ontwerpt robuuste automatisering met logging en security in gedachten.",
    keywords: [
      "n8n automatisering",
      "Make.com workflows",
      "e-commerce integratie",
      "order fulfilment koppeling",
      "marketing automation",
    ],
    headline: "Automatiseren zonder spaghetti.",
    subheadline:
      "Van eerste workflow tot mission-critical ketens: we ontwerpen flows die je team snapt, die fouten loggen en die niet breken bij de eerste API-hick-up.",
    stats: [
      { label: "Tools", value: "n8n · Make · custom APIs" },
      { label: "Focus", value: "E-com · CRM · finance" },
      { label: "Security", value: "Secrets · scopes · fallbacks" },
    ],
    introParagraphs: [
      "Ondernemers verdrinken in copy-paste tussen shop, boekhouding, spreadsheets en mail. Automatisering is geen luxe. Het is schaalbaarheid. Maar alleen als flows onderhoudbaar blijven.",
      "Wij tekenen eerst je systeemlandschap: triggers, edge cases, owners. Daarna bouwen we met herstartbare flows, alerts en documentatie. Zo blijf je controle houden als je stack groeit.",
    ],
    angleTitle: "Robuust eerst, fancy later",
    angleBody:
      "Geen black-box Zapier-ketens zonder uitleg. We kiezen patronen die je team kan aanpassen, met versiebeheer en testdata waar het kan.",
    serviceIntro:
      "Van standaard shop-koppelingen tot maatwerk-webhooks. Per traject maken we scope en ROI expliciet.",
    processTitle: "Van chaos naar playbook",
    processSteps: [
      {
        title: "Procesinterviews",
        body: "Wie doet wat vandaag, waar gaat het mis, wat kost tijd? We meten pijn en volume.",
      },
      {
        title: "Ontwerp & POC",
        body: "Een kleine workflow live om risico’s te valideren voordat we de hele keten migreren.",
      },
      {
        title: "Productie & monitoring",
        body: "Logging, retries, alerts. Plus runbooks voor je team bij incidenten.",
      },
      {
        title: "Optimalisatie",
        body: "We trimmen stappen, voegen AI waar het zinvol is, en koppelen nieuwe kanalen als je groeit.",
      },
    ],
    proofTitle: "Tijd terug, fouten omlaag",
    proofBody:
      "De beste automatisering zie je niet. Die voelt als ‘het gewoon werkt’. Wij meten voor/na in uren en incidenten, niet alleen in ‘aantal zaps’.",
    ctaTitle: "Wat wil je als eerste laten lopen?",
    ctaBody:
      "Neem contact op met je grootste tijdvreter. We schetsen binnen één gesprek een eerste flow.",
  },
  vormgeven: {
    slug: "vormgeven",
    metaTitle: "Vormgeven. Merk, UI/UX, motion en creatives die converteren",
    metaDescription:
      "Branding, conversiegedreven webdesign, micro-interacties en ad-creatives. Visueel strak, psychologisch scherp, technisch uitvoerbaar.",
    keywords: [
      "branding bureau",
      "UI UX design webshop",
      "webdesign conversie",
      "motion design website",
      "advertentie creaties",
    ],
    headline: "Vormgeven met pit.",
    subheadline:
      "Je merk moet werken in Shopify-thema’s, in ads, in mail. Overal dezelfde taal. Wij ontwerpen systemen, niet losse plaatjes.",
    stats: [
      { label: "Merk", value: "Positionering · huisstijl" },
      { label: "Product", value: "UI · design tokens" },
      { label: "Campagnes", value: "Ads · motion · e-mail" },
    ],
    introParagraphs: [
      "Mooi is niet genoeg. Je ontwerp moet vertrouwen, hiërarchie en actie dragen. Daarom starten we met flows en psychologie, en pas daarna met esthetiek.",
      "Motion en micro-interacties zijn de kers. Als ze prestaties niet schaden en reduced-motion respecteren. Wij bouwen motion die conversie ondersteunt, niet afleidt.",
    ],
    angleTitle: "Design dat development voedt",
    angleBody:
      "Figma die niet te bouwen is, is dure frustratie. We werken met herhaalbare componenten, states en documentatie zodat development snel kan schipperen.",
    serviceIntro:
      "Kies branding, product-UI, motion of campagne-creatives. Of een traject waarin alles op elkaar wordt afgestemd.",
    processTitle: "Van merk tot scherm",
    processSteps: [
      {
        title: "Merk & propositie",
        body: "Waarom jij, waarom nu? We vertalen dat naar visuele taal en richtlijnen.",
      },
      {
        title: "Structuur & wireframes",
        body: "Eerst de flow klopt. Daarna maken we het onweerstaanbaar.",
      },
      {
        title: "Visual design & system",
        body: "Kleuren, type, componenten. Klaar voor site, mail en ads.",
      },
      {
        title: "Implementatie-support",
        body: "We schouders mee in development en campagnes tot pixels en metrics kloppen.",
      },
    ],
    proofTitle: "Consistentie = vertrouwen",
    proofBody:
      "Klanten herkennen je direct als je huisstijl overal hetzelfde voelt. Dat verlaagt twijfel in checkout, in B2B-aanvragen en in retentie-mail.",
    ctaTitle: "Tijd voor een merk dat schaalbaar is?",
    ctaBody:
      "Laten we je huidige touchpoints naast elkaar leggen. En één richting kiezen.",
  },
};

export function getPillarPage(slug: string): PillarPageData | null {
  if (slug in pillarPages) {
    return pillarPages[slug as PillarSlug];
  }
  return null;
}

export function getAllPillarSlugs(): PillarSlug[] {
  return Object.keys(pillarPages) as PillarSlug[];
}
