export interface MarketingFunFact {
  id: string;
  stat: string;
  teaser: string;
  title: string;
  body: string;
  href: string;
  linkLabel: string;
  accent: string;
  category: string;
  /** Uniek pill-label op de voorkant van de kaart */
  badge: string;
}

/** Merkpalet voor feitjes: oranje, slate, sky. */
const MM = {
  orange: "#FF5722",
  slate: "#0F172A",
  sky: "#0284c7",
} as const;

/** Accentkleur op donkere achterkant (slate leesbaar maken). */
export function factAccentReadable(accent: string): string {
  return accent === MM.slate ? MM.orange : accent;
}

const ALL_FACTS: MarketingFunFact[] = [
  {
    id: "google-revenue-min",
    stat: "€250k+",
    teaser: "verdient Google gemiddeld per minuut",
    title: "Google is een atm",
    body: "Afhankelijk van het jaar pikt Google ruim een quarter miljoen euro per minuut aan omzet. Search is geen gratis billboard. Elke klik heeft een prijs, elke positie een concurrent.",
    href: "/diensten/google-ads",
    linkLabel: "Google Ads",
    accent: MM.orange,
    category: "Ads & platformen",
    badge: "Omzet per minuut",
  },
  {
    id: "bp-logo-cost",
    stat: "$211 mln",
    teaser: "kostte de BP-rebranding",
    title: "Het duurste logo ooit",
    body: "BP betaalde naar schatting 211 miljoen dollar voor hun huisstijl in 2008. Geen tekeningetje op zolder. Consultancy, implementatie en lakens op alle stations wereldwijd. Merk is geen bijzaak.",
    href: "/diensten/branding",
    linkLabel: "Branding & huisstijl",
    accent: MM.slate,
    category: "Design & merk",
    badge: "Geen Canva-prijs",
  },
  {
    id: "instagram-acquisition",
    stat: "$1 mld",
    teaser: "betaalde Facebook voor Instagram",
    title: "13 mensen, miljard exit",
    body: "2012. Instagram had 13 medewerkers en nul winst. Facebook betaalde 1 miljard dollar. Sindsdien is het een van de belangrijkste advertentiekanalen ter wereld. Timing en bereik tellen.",
    href: "/diensten/social-media",
    linkLabel: "Social media",
    accent: MM.orange,
    category: "Social & content",
    badge: "13 man, 1 miljard",
  },
  {
    id: "google-page-two",
    stat: "<1%",
    teaser: "klikt ooit door naar pagina 2 in Google",
    title: "Pagina 1 of onzichtbaar",
    body: "Recent onderzoek laat zien dat minder dan 1 procent van zoekers ooit naar pagina 2 gaat. Positie 11 is bijna hetzelfde als pagina 10. SEO is geen nice-to-have.",
    href: "/diensten/seo",
    linkLabel: "SEO & vindbaarheid",
    accent: MM.sky,
    category: "SEO & vindbaarheid",
    badge: "Pagina 1 of weg",
  },
  {
    id: "first-impression-50ms",
    stat: "0,05 sec",
    teaser: "voor je eerste website-oordel",
    title: "Sneller dan bewustzijn",
    body: "Bezoekers vormen binnen ongeveer 50 milliseconden een eerste indruk. Design, snelheid en vertrouwen zitten in die flits. Daarna rationaliseer je het pas.",
    href: "/diensten/cro",
    linkLabel: "Conversie-optimalisatie",
    accent: MM.slate,
    category: "Design & merk",
    badge: "Sneller dan denken",
  },
  {
    id: "youtube-hours",
    stat: "1 mld uur",
    teaser: "video per dag op YouTube",
    title: "Het op één na grootste zoekplatform",
    body: "Mensen kijken dagelijks meer dan een miljard uur YouTube. Niet alleen katten. Reviews, tutorials en vergelijkingen. Video is onderdeel van je vindbaarheid.",
    href: "/diensten/media",
    linkLabel: "Media & video-ads",
    accent: MM.orange,
    category: "Social & content",
    badge: "Video als zoekmachine",
  },
  {
    id: "social-daily-time",
    stat: "2+ uur",
    teaser: "zit de gemiddelde gebruiker op social",
    title: "Waar je klant hangt",
    body: "De gemiddelde internetgebruiker zit ruim twee uur per dag op social media. Niet lineair verspreid: pieken als jij offline bent. Daarom telt bereik én timing.",
    href: "/diensten/meta-ads",
    linkLabel: "Meta Ads",
    accent: MM.sky,
    category: "Social & content",
    badge: "Scroll-time",
  },
  {
    id: "reviews-influence",
    stat: "93%",
    teaser: "leest reviews vóór een aankoop",
    title: "Sterren slaan advertenties",
    body: "Ongeveer 93 procent van consumenten leest online reviews voordat ze kopen. Ads kunnen klikken opleveren. Reviews bepalen of iemand afrekent.",
    href: "/diensten/reviews",
    linkLabel: "Reviews & reputatie",
    accent: MM.orange,
    category: "E-commerce & conversie",
    badge: "Sterren > ads",
  },
  {
    id: "blog-traffic",
    stat: "±55%",
    teaser: "meer verkeer met een actieve blog",
    title: "Content componeert",
    body: "Bedrijven met een blog krijgen gemiddeld aanzienlijk meer websiteverkeer dan bedrijven zonder. Niet morgen. Wel elke maand een stukje extra organische grond.",
    href: "/diensten/content-marketing",
    linkLabel: "Content marketing",
    accent: MM.sky,
    category: "SEO & vindbaarheid",
    badge: "Blog compenseert",
  },
  {
    id: "video-sales",
    stat: "Hoger",
    teaser: "koopkans met video op je site",
    title: "Show, don't tell",
    body: "Veel marketeers en webshops zien hogere conversie met video op productpagina's. Geen garantie op elke shop. Wel een patroon dat blijft terugkomen in A/B-tests.",
    href: "/diensten/ugc",
    linkLabel: "UGC & creator content",
    accent: MM.slate,
    category: "Social & content",
    badge: "Beeld verkoopt",
  },
  {
    id: "mobile-majority",
    stat: ">50%",
    teaser: "van websitebezoek komt vanaf mobiel",
    title: "Mobiel first is niet nieuw",
    body: "Meer dan de helft van websitebezoek is mobiel. Als je checkout op desktop is gebouwd en mobiel is een afterthought, verlies je omzet zonder het te weten.",
    href: "/diensten/webdevelopment",
    linkLabel: "Websites from scratch",
    accent: MM.slate,
    category: "Design & merk",
    badge: "Mobiel first",
  },
  {
    id: "email-roi",
    stat: "Top-ROI",
    teaser: "e-mailmarketing scoort nog steeds hoog",
    title: "De oude koning",
    body: "E-mail hoort nog steeds bij de kanalen met de hoogste ROI. Niet sexy. Wel jouw lijst, jouw data, geen algoritme dat morgen je bereik halveert.",
    href: "/diensten/email",
    linkLabel: "E-mailmarketing",
    accent: MM.sky,
    category: "E-commerce & conversie",
    badge: "Inbox ROI",
  },
  {
    id: "banner-ctr-decline",
    stat: "44% → 0,5%",
    teaser: "van CTR op banner 1 naar vandaag",
    title: "Aandacht slijt",
    body: "De eerste banner op internet (1994) haalde 44 procent klikratio. Vandaag is een half procent al netjes. Creativiteit en targeting zijn geen luxe meer.",
    href: "/diensten/google-ads",
    linkLabel: "Campagnes die opvallen",
    accent: MM.orange,
    category: "Ads & platformen",
    badge: "Banner 1.0",
  },
  {
    id: "ferrari-scarcity",
    stat: "Minder",
    teaser: "auto's dan Ferrari zóú kunnen maken",
    title: "Schaarste als strategie",
    body: "Ferrari levert expres minder auto's dan ze kunnen bouwen. Exclusiviteit houdt prijs en verlangen hoog. Niet elke merk is Ferrari. Wel elke merk een keuze.",
    href: "/diensten/strategie",
    linkLabel: "Marketingstrategie",
    accent: MM.slate,
    category: "Strategie",
    badge: "Minder = meer",
  },
  {
    id: "phones-toothbrushes",
    stat: "Meer",
    teaser: "telefoons dan tandenborstels op aarde",
    title: "Eén scherm om te winnen",
    body: "Er zijn meer mobiele telefoons dan tandenborstels wereldwijd. Rare vergelijking, hard cijfer. Je klant heeft minstens één scherm. Jij concurreert om aandacht daarop.",
    href: "/contact",
    linkLabel: "Plan een gesprek",
    accent: MM.orange,
    category: "Random maar waar",
    badge: "Schermen overal",
  },
];

const factById = new Map(ALL_FACTS.map((f) => [f.id, f]));

/** Vier feitjes op de homepage (volgorde bewust). */
export const HOMEPAGE_FUN_FACT_IDS = [
  "google-revenue-min",
  "bp-logo-cost",
  "instagram-acquisition",
  "google-page-two",
] as const;

export const MARKETING_FUN_FACTS: MarketingFunFact[] = HOMEPAGE_FUN_FACT_IDS.map(
  (id) => factById.get(id)!,
);

export const ALL_MARKETING_FUN_FACTS: MarketingFunFact[] = ALL_FACTS;

/** Eén feitje in de sidebar van een dienstpagina. */
export const DIENST_FUN_FACT_IDS: Record<string, string> = {
  "google-ads": "banner-ctr-decline",
  branding: "bp-logo-cost",
  "social-media": "instagram-acquisition",
  seo: "google-page-two",
  "ai-zoek": "google-page-two",
  cro: "first-impression-50ms",
  media: "youtube-hours",
  "meta-ads": "social-daily-time",
  reviews: "reviews-influence",
  "content-marketing": "blog-traffic",
  ugc: "video-sales",
  webdevelopment: "mobile-majority",
  email: "email-roi",
  strategie: "ferrari-scarcity",
  adverteren: "google-revenue-min",
  "shopify-enterprise": "mobile-majority",
  webdesign: "first-impression-50ms",
  optimalisatie: "first-impression-50ms",
  retentie: "email-roi",
  automatisering: "email-roi",
};

/** Feitje op pillar-landingspagina's (inline strip). */
export const PILLAR_FUN_FACT_IDS: Record<string, string> = {
  campagnes: "google-revenue-min",
  vindbaarheid: "blog-traffic",
  bouwen: "mobile-majority",
  behoud: "email-roi",
  strategie: "ferrari-scarcity",
};

/** Feitjes op overige pagina's (inline rij). */
export const PAGE_FUN_FACT_IDS: Record<string, string[]> = {
  "/werkwijze": ["youtube-hours", "banner-ctr-decline"],
  "/over": ["phones-toothbrushes", "google-revenue-min"],
  "/faq": ["reviews-influence"],
  "/kennisbank": ["blog-traffic"],
  "/cases": ["reviews-influence"],
};

export function getFunFactById(id: string): MarketingFunFact | undefined {
  return factById.get(id);
}

export function getFunFactsByIds(ids: string[]): MarketingFunFact[] {
  return ids
    .map((id) => factById.get(id))
    .filter((f): f is MarketingFunFact => f !== undefined);
}

export function getFunFactForDienst(slug: string): MarketingFunFact | undefined {
  const id = DIENST_FUN_FACT_IDS[slug];
  return id ? factById.get(id) : undefined;
}

export function getFunFactForPillar(slug: string): MarketingFunFact | undefined {
  const id = PILLAR_FUN_FACT_IDS[slug];
  return id ? factById.get(id) : undefined;
}

export function getFunFactsForPage(path: string): MarketingFunFact[] {
  return getFunFactsByIds(PAGE_FUN_FACT_IDS[path] ?? []);
}

export const FUN_FACT_CATEGORIES = [
  "Ads & platformen",
  "Design & merk",
  "SEO & vindbaarheid",
  "Social & content",
  "E-commerce & conversie",
  "Strategie",
  "Random maar waar",
] as const;

/** Gedeelde typografie voor grote stat op flip-kaarten. */
export const FUN_FACT_STAT_CLASS =
  "whitespace-nowrap text-[clamp(1.65rem,4.2vw,3.25rem)] font-black leading-none tracking-tighter";
