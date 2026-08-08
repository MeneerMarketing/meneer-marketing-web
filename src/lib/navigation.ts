import { AI_ANSWERS } from "@/lib/ai-visibility-copy";
import { siteCtas } from "@/lib/cta";

export interface MegaMenuItem {
  /** Canonieke titel (dienstpagina, SEO, dienstenoverzicht) */
  name: string;
  /** Canonieke korte omschrijving */
  description: string;
  href: string;
  /** Optioneel: compacte regels voor mega-menu (gelijke hoogte) */
  menuLabel?: string;
  menuDescription?: string;
}

export interface MegaMenuFeatured {
  title: string;
  description: string;
  href: string;
}

export type PillarSlug =
  | "strategie"
  | "bouwen"
  | "vindbaarheid"
  | "campagnes"
  | "behoud";

export interface MegaMenuColumn {
  /** Landingspagina voor het hele blok */
  pillarSlug: PillarSlug;
  category: string;
  subtitle: string;
  /**
   * CTA-tekst naar de blok-LP, zonder de categorienaam te herhalen
   * (die staat al in de topnav).
   */
  pillarOverviewCta: string;
  items: MegaMenuItem[];
  featured: MegaMenuFeatured;
}

export const megaMenuColumns: MegaMenuColumn[] = [
  {
    pillarSlug: "strategie",
    category: "Strategie",
    subtitle: "Groeiplan & regie",
    pillarOverviewCta: "Alle trajecten strategie & groei",
    items: [
      {
        name: "Marketingstrategie & groeiplan",
        description: "Eén plan: welke kanalen, welk budget en wat eerst",
        menuLabel: "Groeiplan op maat",
        menuDescription:
          "Eén helder plan voor jouw bedrijf: kanalen, budget en volgorde. Meetbaar en concreet.",
        href: "/diensten/strategie",
      },
      {
        name: "Advertentiestrategie",
        description: "Google en Meta samen: budget, funnel en schaalpad",
        menuLabel: "Ads-strategie & schaal",
        menuDescription:
          "Alle advertentiekanalen op één lijn: waar je budget heen moet en wanneer je schaalt.",
        href: "/diensten/adverteren",
      },
      {
        name: "Meer omzet uit je website (CRO)",
        description: "Meer aanvragen en verkopen zonder extra bezoekers",
        menuLabel: "CRO & conversie",
        menuDescription:
          "CRO: meer klanten uit hetzelfde aantal bezoekers door je site slimmer in te richten.",
        href: "/diensten/cro",
      },
      {
        name: "B2B & e-commerce leadgeneratie",
        description: "Funnels en campagnes die de pipeline vullen",
        menuLabel: "B2B & shop leads",
        menuDescription:
          "B2B- en e-commerce leads: funnels die pipeline en checkout voor je vullen.",
        href: "/diensten/leadgeneratie",
      },
      {
        name: "Data tracking & analytics",
        description: "GTM, Clarity, heldere dashboards",
        menuLabel: "Meten & dashboards",
        menuDescription:
          "Tracking & analytics: events, dashboards en inzicht in wat campagnes echt opleveren.",
        href: "/diensten/tracking",
      },
    ],
    featured: {
      title: "Eerst het plan, dan de euro's",
      description:
        "Eerst een eigen strategie per product of dienst. Resultaat via maatwerk, niet via een standaard funnel.",
      href: "/cases",
    },
  },
  {
    pillarSlug: "bouwen",
    category: "Bouwen",
    subtitle: "Websites, shops & apps",
    pillarOverviewCta: "Alle trajecten web & shops",
    items: [
      {
        name: "Websites from scratch",
        description: "Custom build from scratch, zonder templates",
        menuLabel: "Websites from scratch",
        menuDescription:
          "Websites die ik zelf bouw: snel, veilig en precies passend bij jouw bedrijf.",
        href: "/diensten/webdevelopment",
      },
      {
        name: "Shopify Enterprise Development",
        description: "Shopify-webshops from scratch, custom themes",
        menuLabel: "Shopify from scratch",
        menuDescription:
          "Shopify-expert: themes from scratch. Alles wat het platform kan, zonder store-template.",
        href: "/diensten/shopify-enterprise",
      },
      {
        name: "Webapps & portalen from scratch",
        description: "B2B-portalen, boekingsapps en interne tools",
        menuLabel: "Webapps & portalen",
        menuDescription:
          "Portals en apps from scratch: rollen, koppelingen en UX die je team echt gebruikt.",
        href: "/diensten/web-apps",
      },
      {
        name: "Snelheid & vindbaarheid",
        description: "Snellere site, betere scores in Google",
        menuLabel: "Snelheid & SEO",
        menuDescription:
          "Je site sneller maken en technisch klaarzetten voor Google, meetbaar en duurzaam.",
        href: "/diensten/optimalisatie",
      },
      {
        name: "Conversiegedreven UI/UX",
        description: "Ontwerp dat verkopen en vertrouwen combineert",
        menuLabel: "UI/UX design",
        menuDescription:
          "UI/UX: schermen die verkopen én merk strak en consistent houden.",
        href: "/diensten/webdesign",
      },
      {
        name: "Merkidentiteit & visuele positionering",
        description: "Huisstijl die vertrouwen en onderscheid geeft",
        menuLabel: "Merk & huisstijl",
        menuDescription:
          "Merk & huisstijl: kleur, typo en beeld dat herkenning en vertrouwen draagt.",
        href: "/diensten/branding",
      },
      {
        name: "Motion & micro-interacties",
        description: "Die ene laag die je site onvergetelijk maakt",
        menuLabel: "Motion & interactie",
        menuDescription:
          "Motion: micro-interacties premium. Levend zonder ruis en zonder gimmicks.",
        href: "/diensten/animaties",
      },
    ],
    featured: {
      title: "Het fundament voor groei",
      description:
        "Custom platformen die snel, veilig en klaar zijn om te schalen.",
      href: "/cases",
    },
  },
  {
    pillarSlug: "vindbaarheid",
    category: "Vindbaarheid",
    subtitle: "SEO, AI-antwoorden & content",
    pillarOverviewCta: "Alle trajecten vindbaarheid & content",
    items: [
      {
        name: "Gevonden worden in Google (SEO)",
        description:
          "Betere vindbaarheid via goede content, structuur en techniek",
        menuLabel: "SEO & vindbaarheid",
        menuDescription:
          "SEO (zoekmachine-optimalisatie): hoger in Google door inhoud en techniek die kloppen.",
        href: "/diensten/seo",
      },
      {
        name: AI_ANSWERS.serviceName,
        description: `Genoemd worden in ${AI_ANSWERS.tools} en Google AI`,
        menuLabel: AI_ANSWERS.short,
        menuDescription: AI_ANSWERS.menuDescription,
        href: "/diensten/ai-zoek",
      },
      {
        name: "Lokale vindbaarheid",
        description: "Google Business, Maps en klanten uit je regio",
        menuLabel: "Lokale SEO & Maps",
        menuDescription:
          "Bovenaan als iemand in jouw regio zoekt: Google Business, Maps en lokale pagina's.",
        href: "/diensten/local-seo",
      },
      {
        name: "Contentmarketing",
        description: "Content die autoriteit opbouwt en verkoopt",
        menuLabel: "Content & autoriteit",
        menuDescription:
          "Artikelen en pagina's die vragen van klanten beantwoorden en je expert-status laden.",
        href: "/diensten/content-marketing",
      },
      {
        name: "Reviews & reputatie",
        description: "Social proof die twijfel wegneemt",
        menuLabel: "Reviews & reputatie",
        menuDescription:
          "Meer en betere reviews op de plekken waar klanten kijken vóór ze kopen.",
        href: "/diensten/reviews",
      },
    ],
    featured: {
      title: "Gevonden vóór de advertentie",
      description:
        "Eerst organisch bovenaan, daarna pas ads. Die volgorde loont.",
      href: "/cases",
    },
  },
  {
    pillarSlug: "campagnes",
    category: "Campagnes",
    subtitle: "Ads, social & creators",
    pillarOverviewCta: "Alle trajecten ads & creators",
    items: [
      {
        name: "Google Ads",
        description: "Bovenaan staan op het moment dat iemand zoekt",
        menuLabel: "Google Ads",
        menuDescription:
          "Zoekwoorden, shopping en budget dat naar klanten gaat. Niet naar klikken zonder waarde.",
        href: "/diensten/google-ads",
      },
      {
        name: "Meta Ads",
        description: "Facebook en Instagram campagnes die verkopen",
        menuLabel: "Meta Ads",
        menuDescription:
          "Campagnes op Facebook en Instagram: creatives, doelgroepen en meetbaar resultaat.",
        href: "/diensten/meta-ads",
      },
      {
        name: "Social media marketing",
        description: "Organisch groeien op de kanalen waar je klant zit",
        menuLabel: "Social (organisch)",
        menuDescription:
          "Content en ritme voor Instagram, TikTok en LinkedIn. Zichtbaar zonder advertentiebudget.",
        href: "/diensten/social-media",
      },
      {
        name: "UGC & creatorcontent",
        description: "Echte mensen, echte content, betere ads",
        menuLabel: "UGC & creatorcontent",
        menuDescription:
          "Video's door creators die jouw product laten zien zoals klanten het gebruiken.",
        href: "/diensten/ugc",
      },
      {
        name: "Influencer marketing",
        description: "Samenwerkingen die passen bij je merk en marge",
        menuLabel: "Influencer marketing",
        menuDescription:
          "De juiste creators vinden, afspraken maken en meten wat elke samenwerking oplevert.",
        href: "/diensten/influencer-marketing",
      },
      {
        name: "Verkopen via Bol & Amazon",
        description: "Marketplaces als extra verkoopkanaal",
        menuLabel: "Bol & Amazon",
        menuDescription:
          "Producten goed vindbaar op Bol en Amazon: listings, reviews en advertenties.",
        href: "/diensten/marketplaces",
      },
      {
        name: "Foto & video-ads",
        description: "Creatives die passen bij je campagnes",
        menuLabel: "Beeld & video-ads",
        menuDescription:
          "Beeld & ads: foto, video en social formats passend bij jouw hooks en groep.",
        href: "/diensten/media",
      },
    ],
    featured: {
      title: "Budget dat terugkomt",
      description:
        "Adverteren zonder metingen is gokken. Wij koppelen elke euro aan wat hij oplevert.",
      href: "/cases",
    },
  },
  {
    pillarSlug: "behoud",
    category: "Behoud",
    subtitle: "E-mail, retentie & koppelingen",
    pillarOverviewCta: "Alle trajecten behoud & retentie",
    items: [
      {
        name: "E-mailmarketing",
        description: "Nieuwsbrieven, welkomstmails en automatische opvolging",
        menuLabel: "E-mailmarketing & flows",
        menuDescription:
          "E-mail op het juiste moment: nieuwsbrieven, herinnermails en automatische klantmails via Klaviyo of Shopify.",
        href: "/diensten/email",
      },
      {
        name: "Retentie & loyaliteit",
        description: "Herhaalaankopen via SMS, loyalty en slimme timing",
        menuLabel: "Retentie & loyaliteit",
        menuDescription:
          "Klanten die terugkomen: loyaliteitsacties, SMS en opvolging na de eerste aankoop.",
        href: "/diensten/retentie",
      },
      {
        name: "Processen automatiseren",
        description: "Minder handwerk, minder fouten, meer rust",
        menuLabel: "Processen automatiseren",
        menuDescription:
          "Terugkerend handwerk uit handen: systemen die met elkaar praten zodat jij dat niet hoeft.",
        href: "/diensten/automatisering",
      },
      {
        name: "E-commerce workflows",
        description: "Orders, voorraad, facturatie en mails in sync",
        menuLabel: "Shop workflows",
        menuDescription:
          "Orderautomatisering: orders, voorraad, factuur en mail strak in één keten nu.",
        href: "/diensten/workflows",
      },
      {
        name: "AI-chatbots & klantenservice",
        description: "24/7 op basis van jouw data en tone of voice",
        menuLabel: "AI-chatbots",
        menuDescription:
          "AI-chat: antwoorden op jouw data, FAQ en tone. Slim en 24/7 waar het past.",
        href: "/diensten/chatbots",
      },
    ],
    featured: {
      title: "Klanten die terugkomen",
      description:
        "Een nieuwe klant werven kost al snel vijf keer meer dan een bestaande behouden. Hier zit je marge.",
      href: "/diensten/email",
    },
  },
];

/** Topnav naast blokken. /diensten bereikbaar via footer en mega-menu. Kennisbank en Zoeken alleen in footer. */
export const mainNavLinks: { name: string; href: string }[] = [
  { name: "Cases", href: "/cases" },
  { name: "Over", href: "/over" },
  { name: "Contact", href: "/contact" },
];

/** Standaard primaire CTA (o.a. dienstpagina's) */
export const ctaNav = siteCtas.startIntake;
