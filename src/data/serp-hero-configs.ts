export interface SerpHeroResult {
  url: string;
  title: string;
  snippet: string;
  isYou?: boolean;
  isAd?: boolean;
}

export interface SerpHeroConfig {
  variant: "organic" | "ads";
  queries: readonly string[];
  serpSets: readonly (readonly SerpHeroResult[])[];
  clickHint: string;
  waitingText: string;
  footerMetric?: {
    label: string;
    before: string;
    after: string;
  };
}

export const VINDABAARHEID_SERP: SerpHeroConfig = {
  variant: "organic",
  clickHint: "Klik de zoekbalk voor de volgende query",
  waitingText: "Even typen...",
  queries: [
    "beste marketing bureau nederland",
    "shopify expert die ook seo doet",
    "vindbaar worden in chatgpt",
    "wie bouwt websites from scratch",
  ],
  serpSets: [
    [
      { url: "concurrent-a.nl", title: "Marketing bureau Amsterdam", snippet: "Full-service agency sinds 2012..." },
      { url: "concurrent-b.nl", title: "Online marketing totaalpakket", snippet: "Ads, social en een beetje SEO..." },
      { url: "meneermarketing.nl", title: "MeneerMarketing · SEO, bouw & groei", snippet: "Websites from scratch, vindbaar in Google én AI. Eén lijn.", isYou: true },
    ],
    [
      { url: "template-shop.nl", title: "Shopify themes kopen", snippet: "Kies uit 200+ templates..." },
      { url: "meneermarketing.nl", title: "Shopify from scratch · MeneerMarketing", snippet: "Custom themes, geen templates. Shopify-expert.", isYou: true },
      { url: "concurrent-c.nl", title: "Webshop laten bouwen", snippet: "Snel online met ons pakket..." },
    ],
    [
      { url: "meneermarketing.nl", title: "Vindbaar in AI-antwoorden · MeneerMarketing", snippet: "Genoemd worden in ChatGPT en Gemini. Wij regelen het.", isYou: true },
      { url: "seo-blog.nl", title: "AI SEO tips 2026", snippet: "10 tricks die je concurrent al kent..." },
      { url: "concurrent-d.nl", title: "ChatGPT optimalisatie", snippet: "Wij schrijven AI-content..." },
    ],
    [
      { url: "meneermarketing.nl", title: "Websites from scratch · MeneerMarketing", snippet: "Geen page builders. Custom build, CWV groen.", isYou: true },
      { url: "wordpress-host.nl", title: "Website in 1 dag", snippet: "Template + plugins = klaar!" },
      { url: "concurrent-e.nl", title: "Goedkope website", snippet: "Vanaf € 299 all-in..." },
    ],
  ],
};

export const SEO_SERP: SerpHeroConfig = {
  variant: "organic",
  clickHint: "Klik de zoekbalk voor de volgende SEO-query",
  waitingText: "Zoekt naar kansen...",
  footerMetric: {
    label: "Organisch verkeer",
    before: "+0%",
    after: "+340%",
  },
  queries: [
    "seo bureau nederland",
    "organisch verkeer webshop",
    "shopify seo specialist",
    "technische seo website",
  ],
  serpSets: [
    [
      { url: "concurrent-seo.nl", title: "SEO pakket vanaf € 299", snippet: "500 backlinks en wat blogposts. Resultaat? Geen idee." },
      { url: "marketing-totaal.nl", title: "Online marketing alles-in-één", snippet: "SEO, social, ads. Een beetje van alles." },
      { url: "meneermarketing.nl", title: "SEO from scratch · MeneerMarketing", snippet: "Techniek, content en autoriteit. Organisch vóór paid.", isYou: true },
    ],
    [
      { url: "dropship-tips.nl", title: "Meer traffic zonder ads", snippet: "10 hacks uit 2019..." },
      { url: "meneermarketing.nl", title: "Organisch groeien · MeneerMarketing", snippet: "Eerst SEO domineren. Ads komen pas later.", isYou: true },
      { url: "concurrent-f.nl", title: "Webshop marketing tips", snippet: "Meer volgers = meer omzet? Niet echt." },
    ],
    [
      { url: "shopify-apps.nl", title: "SEO app installeren", snippet: "Plugin lost alles op. Spoiler: nee." },
      { url: "meneermarketing.nl", title: "Shopify SEO · MeneerMarketing", snippet: "Structuur, snelheid, content. Custom, geen template-truc.", isYou: true },
      { url: "concurrent-g.nl", title: "Shopify marketing", snippet: "Ads first, SEO later..." },
    ],
    [
      { url: "page-speed-blog.nl", title: "Core Web Vitals uitleg", snippet: "Lang artikel, weinig actie..." },
      { url: "meneermarketing.nl", title: "Technische SEO · MeneerMarketing", snippet: "CWV groen, schema markup, indexatie die klopt.", isYou: true },
      { url: "concurrent-h.nl", title: "Website sneller maken", snippet: "Cache plugin en klaar?" },
    ],
  ],
};

export const GOOGLE_ADS_SERP: SerpHeroConfig = {
  variant: "ads",
  clickHint: "Klik de zoekbalk voor de volgende ads-query",
  waitingText: "Campagnes laden...",
  footerMetric: {
    label: "Impression share",
    before: "12%",
    after: "78%",
  },
  queries: [
    "google ads bureau shopify",
    "sea specialist nederland",
    "google ads beheer webshop",
    "roas verbeteren google ads",
  ],
  serpSets: [
    [
      { url: "concurrent-ads.nl", title: "Google Ads vanaf € 500/mnd", snippet: "Wij zetten campagnes aan. Landings? Niet ons probleem.", isAd: true },
      { url: "concurrent-b.nl", title: "Ads bureau Amsterdam", snippet: "Meer kliks. Of meer budget verbrand. Beide kan.", isAd: true },
      { url: "meneermarketing.nl", title: "Google Ads · MeneerMarketing", snippet: "Landings die converteren. Meten, sturen, opschalen.", isYou: true, isAd: true },
    ],
    [
      { url: "sea-generiek.nl", title: "SEA totaalpakket", snippet: "Google en Bing. Zelfde aanpak voor iedereen.", isAd: true },
      { url: "meneermarketing.nl", title: "SEA met meetplan · MeneerMarketing", snippet: "ROAS en CAC scherp. Budget met plan, geen gokwerk.", isYou: true, isAd: true },
      { url: "concurrent-c.nl", title: "Online adverteren", snippet: "Account aan, budget erin, hopen..." },
    ],
    [
      { url: "shopify-ads.nl", title: "Shopify + Google Ads", snippet: "Plug-and-play campagnes. Conversie? Later.", isAd: true },
      { url: "meneermarketing.nl", title: "Shopify Google Ads · MeneerMarketing", snippet: "Product feeds, landings, tracking. Eén lijn.", isYou: true, isAd: true },
      { url: "concurrent-d.nl", title: "Webshop adverteren", snippet: "Shopping ads zonder strategie..." },
    ],
    [
      { url: "roas-hacks.nl", title: "ROAS verdubbelen in 7 dagen", snippet: "Te mooi om waar te zijn. Is het ook.", isAd: true },
      { url: "meneermarketing.nl", title: "ROAS scherpstellen · MeneerMarketing", snippet: "Wat werkt krijgt gas. Wat niet werkt gaat eruit.", isYou: true, isAd: true },
      { url: "concurrent-e.nl", title: "Ads optimaliseren", snippet: "Meer bieden = winnen? Niet altijd." },
    ],
  ],
};
