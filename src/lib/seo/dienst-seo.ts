import type { PillarSlug } from "@/lib/navigation";

export interface DienstSeoEntry {
  title: string;
  description: string;
  pillar: PillarSlug;
  keywords?: string[];
}

const PILLAR_OG_ACCENT: Record<PillarSlug, string> = {
  strategie: "FF5722",
  bouwen: "0284C7",
  vindbaarheid: "00BCD4",
  campagnes: "FF5722",
  behoud: "8D6E63",
};

/** SEO title + description per dienstpagina. Patroon: [Dienst] | [hook] | Meneer Marketing */
export const DIENST_SEO: Record<string, DienstSeoEntry> = {
  strategie: {
    pillar: "strategie",
    title: "Marketingstrategie | groeiplan zonder vergader-circus | Meneer Marketing",
    description:
      "Welk kanaal, welk budget, welke volgorde? Ik reken het door vóór je euro's verbrandt. Eén plan dat ik ook uitvoer, geen PDF in een la.",
    keywords: ["marketingstrategie", "groeiplan", "online marketing plan"],
  },
  adverteren: {
    pillar: "strategie",
    title: "Advertentiestrategie | Google & Meta op één schaalpad | Meneer Marketing",
    description:
      "Google Ads, Meta Ads en budget op één lijn. Ik bepaal waar je start, wanneer je schaalt en wat je eerst moet fixen voordat er geld op gaat.",
    keywords: ["advertentiestrategie", "google ads meta ads", "paid media plan"],
  },
  cro: {
    pillar: "strategie",
    title: "CRO | meer klanten uit hetzelfde verkeer | Meneer Marketing",
    description:
      "Je site krijgt bezoekers maar geen aanvragen? Ik vind waar het lekt en fix checkout, landings en CTA's. Meer omzet zonder extra ad-budget.",
    keywords: ["conversie optimalisatie", "CRO bureau", "website conversie"],
  },
  leadgeneratie: {
    pillar: "strategie",
    title: "Leadgeneratie | B2B-pipeline die vult | Meneer Marketing",
    description:
      "Funnels, landings en campagnes die leads opleveren, niet alleen clicks. Voor B2B en e-commerce. Meetbaar van formulier tot opvolging.",
    keywords: ["leadgeneratie", "B2B leads", "e-commerce leads"],
  },
  tracking: {
    pillar: "strategie",
    title: "Tracking & analytics | meten wat echt oplevert | Meneer Marketing",
    description:
      "GTM, GA4 en dashboards die kloppen vóór je ads aanzet. Geen ruis in je rapportages. Wel inzicht in welke euro's omzet geven.",
    keywords: ["google tag manager", "GA4 setup", "marketing analytics"],
  },
  webdevelopment: {
    pillar: "bouwen",
    title: "Websites from scratch | geen templates | Meneer Marketing",
    description:
      "Custom build in Next.js: snel, veilig, klaar voor SEO en ads. Geen page builder die je groei remt. Ik bouw het fundament achter je marketing.",
    keywords: ["website laten bouwen", "custom website", "next.js development"],
  },
  "shopify-enterprise": {
    pillar: "bouwen",
    title: "Shopify | custom theme & B2B from scratch | Meneer Marketing",
    description:
      "Shopify-shops from scratch: custom themes, B2B-portalen, feeds en snelheid. Geen template-chaos. Wel schaalbaar voor SEO, mail en ads.",
    keywords: ["shopify development", "shopify expert", "shopify webshop laten maken"],
  },
  "web-apps": {
    pillar: "bouwen",
    title: "Webapps & portalen | minder mail, meer self-service | Meneer Marketing",
    description:
      "Boekingsapps, B2B-portalen en interne tools from scratch. Rollen, koppelingen en UX die je team écht gebruikt. SkinComplete als referentie.",
    keywords: ["webapp laten bouwen", "B2B portaal", "boekingsapp"],
  },
  optimalisatie: {
    pillar: "bouwen",
    title: "Snelheid & SEO | Core Web Vitals die ranken | Meneer Marketing",
    description:
      "Trage site = lagere rankings én duurdere ads. Ik fix performance, technische SEO en structuur. Meetbaar voor en na, geen vage audits.",
    keywords: ["website snelheid", "core web vitals", "technische seo"],
  },
  webdesign: {
    pillar: "bouwen",
    title: "UI/UX design | ontwerp dat converteert | Meneer Marketing",
    description:
      "Schermen die verkopen én vertrouwen geven. Conversiegedreven UI voor landings, checkout en productpagina's. Geen Dribbble-showcase zonder resultaat.",
    keywords: ["UI UX design", "conversie design", "landingspagina design"],
  },
  branding: {
    pillar: "bouwen",
    title: "Branding | huisstijl die verkoopt | Meneer Marketing",
    description:
      "Merkidentiteit die herkenning én vertrouwen draagt. Kleur, typo en beeld die passen bij je markt. Ook B2B waar 'saai' juist serieus moet voelen.",
    keywords: ["huisstijl laten maken", "merkidentiteit", "branding bureau"],
  },
  animaties: {
    pillar: "bouwen",
    title: "Motion design | micro-interacties die blijven hangen | Meneer Marketing",
    description:
      "Die ene laag die je site premium maakt zonder gimmicks. GSAP, Framer Motion en scroll-reveal die hardware-versneld draaien. Subtiel, merkbaar.",
    keywords: ["motion design website", "micro-interacties", "animatie web"],
  },
  seo: {
    pillar: "vindbaarheid",
    title: "SEO | organisch vóór ads | Meneer Marketing",
    description:
      "Landingspagina's die bovenaan scoren, techniek die Google vertrouwt, content op echte zoekintentie. Gratis verkeer maand na maand. SkinComplete deed het zo.",
    keywords: ["SEO bureau", "hoger in google", "zoekmachine optimalisatie"],
  },
  "ai-zoek": {
    pillar: "vindbaarheid",
    title: "AI-antwoorden | vindbaar in ChatGPT & Gemini | Meneer Marketing",
    description:
      "Klanten vragen ChatGPT wie ze moeten kiezen. Sta jij niet in dat antwoord, dan besta je niet. Ik maak je vindbaar in AI-antwoorden én Google.",
    keywords: ["vindbaar in chatgpt", "AI SEO", "generative engine optimization"],
  },
  "local-seo": {
    pillar: "vindbaarheid",
    title: "Lokale SEO | Maps, reviews & regio | Meneer Marketing",
    description:
      "Google Business, Maps en lokale pagina's die klanten uit je regio opleveren. Reviews, NAP-consistency en content voor 'bij mij in de buurt'-zoekers.",
    keywords: ["lokale SEO", "google business profile", "local SEO bureau"],
  },
  "content-marketing": {
    pillar: "vindbaarheid",
    title: "Contentmarketing | autoriteit die rankt | Meneer Marketing",
    description:
      "Geen opgeblazen blogkalender. Wel pagina's die één vraag echt beantwoorden en verkopen. Content voor Google, AI-antwoorden en mensen.",
    keywords: ["contentmarketing", "SEO content", "content strategie"],
  },
  reviews: {
    pillar: "vindbaarheid",
    title: "Reviews & reputatie | social proof die twijfel wegt | Meneer Marketing",
    description:
      "Meer en betere reviews op de plekken waar klanten kijken vóór ze kopen. Strategie, opvolging en reputatie die conversie en lokale SEO versterkt.",
    keywords: ["google reviews", "online reputatie", "review management"],
  },
  "google-ads": {
    pillar: "campagnes",
    title: "Google Ads | sturen op ROAS, niet ego | Meneer Marketing",
    description:
      "Search, Shopping en Performance Max met meting die klopt. Ik stuur op marge en conversie, niet op impressies. Eerst site en tracking, dan budget.",
    keywords: ["google ads specialist", "google ads bureau", "SEA specialist"],
  },
  "meta-ads": {
    pillar: "campagnes",
    title: "Meta Ads | creatives die converteren | Meneer Marketing",
    description:
      "Facebook en Instagram campagnes met targeting, creatives en landings die matchen. Geen boost-knop roulette. Wel meetbaar resultaat per euro.",
    keywords: ["meta ads bureau", "facebook ads", "instagram ads"],
  },
  "social-media": {
    pillar: "campagnes",
    title: "Social media | organisch zonder ad-budget | Meneer Marketing",
    description:
      "Content en ritme voor Instagram, TikTok en LinkedIn. Zichtbaar worden waar je klant hangt, zonder elke post te promoten. Strategie die past bij je fase.",
    keywords: ["social media marketing", "organisch social", "social media bureau"],
  },
  ugc: {
    pillar: "campagnes",
    title: "UGC | echte video's, betere ads | Meneer Marketing",
    description:
      "Creators die jouw product laten zien zoals klanten het gebruiken. Content voor ads én social. Eerlijk, herkenbaar, meetbaar hergebruik in campagnes.",
    keywords: ["UGC content", "user generated content", "UGC ads"],
  },
  "influencer-marketing": {
    pillar: "campagnes",
    title: "Influencer marketing | deals die renderen | Meneer Marketing",
    description:
      "De juiste creators vinden, deals regelen en meten wat elke samenwerking oplevert. Geen vanity metrics. Wel content die in je ads en funnel landt.",
    keywords: ["influencer marketing", "creator deals", "influencer bureau"],
  },
  marketplaces: {
    pillar: "campagnes",
    title: "Bol & Amazon | extra kanaal, eigen marge | Meneer Marketing",
    description:
      "Listings, feeds, reviews en ads op Bol en Amazon. Marketplace als verkoopkanaal zonder je eigen shop te negeren. Strategie per marge en assortiment.",
    keywords: ["bol.com verkopen", "amazon nederland", "marketplace marketing"],
  },
  media: {
    pillar: "campagnes",
    title: "Foto & video-ads | creatives voor campagnes | Meneer Marketing",
    description:
      "Beeld en video die passen bij je hooks, doelgroepen en kanalen. Formats voor Google, Meta en social. Geen stock die iedereen al gebruikt.",
    keywords: ["video ads", "commercial fotografie", "ad creatives"],
  },
  email: {
    pillar: "behoud",
    title: "E-mailmarketing | flows die verkopen terwijl je slaapt | Meneer Marketing",
    description:
      "Welkom, abandoned cart, post-purchase en win-back via Klaviyo of Shopify. Geen spam. Wel mails op het moment dat ze logisch zijn, meetbaar in omzet.",
    keywords: ["e-mailmarketing", "klaviyo specialist", "email flows shopify"],
  },
  retentie: {
    pillar: "behoud",
    title: "Retentie | herhaalaankopen zonder kortingencircus | Meneer Marketing",
    description:
      "Klanten die al kochten zijn goedkoper dan nieuwe. Loyalty, SMS en timing die terugkeer stimuleren. Marge beschermen, lifetime value verhogen.",
    keywords: ["klantretentie", "loyalty marketing", "herhaalaankopen"],
  },
  automatisering: {
    pillar: "behoud",
    title: "Automatisering | minder handwerk, minder fouten | Meneer Marketing",
    description:
      "Systemen die met elkaar praten: orders, CRM, mail en voorraad. n8n, Make of custom koppelingen. E-commerce op autopilot waar het kan.",
    keywords: ["marketing automatisering", "processen automatiseren", "n8n workflows"],
  },
  workflows: {
    pillar: "behoud",
    title: "Shop workflows | orders & mail in sync | Meneer Marketing",
    description:
      "Orders, voorraad, facturatie en klantmail in één keten. Geen gekopieer tussen Shopify, boekhouding en inbox. Minder fouten, snellere fulfilment.",
    keywords: ["e-commerce workflows", "shopify automatisering", "order automatisering"],
  },
  chatbots: {
    pillar: "behoud",
    title: "AI-chatbots | 24/7 op jouw tone of voice | Meneer Marketing",
    description:
      "Chat die antwoordt op basis van jouw FAQ, productdata en tone of voice. Slim waar het past, menselijk waar het moet. Geen generieke bot-antwoorden.",
    keywords: ["AI chatbot website", "klantenservice automatisering", "chatbot e-commerce"],
  },
};

export function getDienstSeo(slug: string): DienstSeoEntry | null {
  return DIENST_SEO[slug] ?? null;
}

export function getDienstOgAccent(slug: string): string | undefined {
  const entry = getDienstSeo(slug);
  if (!entry) return undefined;
  return PILLAR_OG_ACCENT[entry.pillar];
}
