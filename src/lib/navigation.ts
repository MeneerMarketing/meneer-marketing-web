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

export type PillarSlug = "bouwen" | "groeien" | "automatiseren" | "vormgeven";

export interface MegaMenuColumn {
  /** Landingspagina voor de hele pijler */
  pillarSlug: PillarSlug;
  category: string;
  subtitle: string;
  /**
   * CTA-tekst naar de pijler-LP, zonder de categorienaam te herhalen
   * (die staat al in de topnav).
   */
  pillarOverviewCta: string;
  items: MegaMenuItem[];
  featured: MegaMenuFeatured;
}

export const megaMenuColumns: MegaMenuColumn[] = [
  {
    pillarSlug: "bouwen",
    category: "Bouwen",
    subtitle: "Web- & e-commerce",
    pillarOverviewCta: "Alle trajecten web & shops",
    items: [
      {
        name: "Shopify Enterprise Development",
        description: "Schaalbare ecosystemen voor hoge volumes",
        menuLabel: "Shopify enterprise & schaal",
        menuDescription:
          "Robuust Shopify platform: veilig, schaalbaar en klaar voor volume vandaag.",
        href: "/diensten/shopify-enterprise",
      },
      {
        name: "Maatwerk websites",
        description: "From scratch — geen templates, volledig op maat",
        menuLabel: "Websites from scratch",
        menuDescription:
          "Websites die we zelf bouwen: snel, veilig en precies passend bij jouw bedrijf.",
        href: "/diensten/webdevelopment",
      },
      {
        name: "Custom Web-Applicaties",
        description: "Portalen en SaaS-interfaces",
        menuLabel: "Webapps & maatwerk-portalen",
        menuDescription:
          "Webapps en portalen: UX strak, koppelingen strak en onderhoudbaar gebouwd.",
        href: "/diensten/web-apps",
      },
      {
        name: "Snelheid & vindbaarheid",
        description: "Snellere site, betere scores in Google",
        menuLabel: "Snelheid & technische SEO",
        menuDescription:
          "Je site sneller maken en technisch klaarzetten voor Google — meetbaar en duurzaam.",
        href: "/diensten/optimalisatie",
      },
    ],
    featured: {
      title: "Het fundament voor groei",
      description:
        "Geen standaardtemplates: platformen die snel, veilig en klaar zijn om te schalen.",
      href: "/cases",
    },
  },
  {
    pillarSlug: "groeien",
    category: "Groeien",
    subtitle: "Marketing & acquisitie",
    pillarOverviewCta: "Alle trajecten groei & acquisitie",
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
        name: "Datagedreven adverteren",
        description: "Google Ads &amp; Meta. Meten, bijsturen, schalen.",
        menuLabel: "Google Ads & Meta advertising",
        menuDescription:
          "Google & Meta ads: meten, bijsturen en schalen op heldere KPI's en ROAS nu.",
        href: "/diensten/adverteren",
      },
      {
        name: "Meer omzet uit je website (CRO)",
        description: "Meer aanvragen en verkopen zonder extra bezoekers",
        menuLabel: "Conversie-optimalisatie (CRO)",
        menuDescription:
          "CRO: meer klanten uit hetzelfde aantal bezoekers — door je site slimmer in te richten.",
        href: "/diensten/cro",
      },
      {
        name: "B2B & e-commerce leadgeneratie",
        description: "Funnels en campagnes die de pipeline vullen",
        menuLabel: "B2B- en e-commerce leadflows",
        menuDescription:
          "B2B- en e-commerce leads: funnels die pipeline en checkout voor je vullen.",
        href: "/diensten/leadgeneratie",
      },
      {
        name: "E-mailmarketing",
        description: "Nieuwsbrieven, welkomstmails en automatische opvolging",
        menuLabel: "E-mailmarketing & flows",
        menuDescription:
          "E-mail op het juiste moment: nieuwsbrieven, herinnermails en klantflows via Klaviyo of Shopify.",
        href: "/diensten/email",
      },
    ],
    featured: {
      title: "De groeiformule",
      description:
        "De juiste boodschap op het juiste kanaal. Gekoppeld aan wat je site en shop aankunnen.",
      href: "/cases",
    },
  },
  {
    pillarSlug: "automatiseren",
    category: "Automatiseren",
    subtitle: "Systemen & data",
    pillarOverviewCta: "Alle trajecten automatisering",
    items: [
      {
        name: "Bedrijfsprocessen automatiseren",
        description: "n8n/Make: minder handwerk, minder fouten",
        menuLabel: "Bedrijfsprocessen automatiseren",
        menuDescription:
          "n8n/Make: minder handwerk en fouten. Meer rust in je dagelijkse operatie.",
        href: "/diensten/automatisering",
      },
      {
        name: "E-commerce workflows",
        description: "Orders, voorraad, facturatie en mails in sync",
        menuLabel: "E-commerce order- & shopflows",
        menuDescription:
          "E-commerce flows: orders, voorraad, factuur en mail strak in één keten nu.",
        href: "/diensten/workflows",
      },
      {
        name: "AI-chatbots & klantenservice",
        description: "24/7 op basis van jouw data en tone of voice",
        menuLabel: "AI-chatbots & klantenservice",
        menuDescription:
          "AI-chat: antwoorden op jouw data, FAQ en tone. Slim en 24/7 waar het past.",
        href: "/diensten/chatbots",
      },
      {
        name: "Data tracking & analytics",
        description: "GTM, Clarity, heldere dashboards",
        menuLabel: "GTM, events & analytics stack",
        menuDescription:
          "Tracking & analytics: events, dashboards en inzicht in campagneresultaten.",
        href: "/diensten/tracking",
      },
    ],
    featured: {
      title: "Stop met handmatig werk",
      description:
        "Koppel je stack: één waarheid voor order, klant en marketingdata.",
      href: "/diensten/automatisering",
    },
  },
  {
    pillarSlug: "vormgeven",
    category: "Vormgeven",
    subtitle: "Branding & design",
    pillarOverviewCta: "Alle trajecten merk & design",
    items: [
      {
        name: "Merkidentiteit & visuele positionering",
        description: "Huisstijl die vertrouwen en onderscheid geeft",
        menuLabel: "Merkidentiteit & huisstijl",
        menuDescription:
          "Merk & huisstijl: kleur, typo en beeld dat herkenning en vertrouwen draagt.",
        href: "/diensten/branding",
      },
      {
        name: "Conversiegedreven UI/UX",
        description: "Ontwerp dat verkopen en vertrouwen combineert",
        menuLabel: "UI/UX: conversie én merk strak",
        menuDescription:
          "UI/UX: schermen en flows die verkopen én merk strak en consistent houden.",
        href: "/diensten/webdesign",
      },
      {
        name: "Motion & micro-interacties",
        description: "Die ene laag die je site onvergetelijk maakt",
        menuLabel: "Motion & micro-interacties",
        menuDescription:
          "Motion: micro-interacties premium. Levend zonder ruis en zonder gimmicks.",
        href: "/diensten/animaties",
      },
      {
        name: "Foto & video-ads",
        description: "Creatives die passen bij je campagnes",
        menuLabel: "Beeld voor campagnes & social",
        menuDescription:
          "Beeld & ads: foto, video en social formats passend bij jouw hooks en groep.",
        href: "/diensten/media",
      },
    ],
    featured: {
      title: "Design dat werkt",
      description:
        "Minimalistisch, modern, met psychologische scherpte waar het telt.",
      href: "/cases",
    },
  },
];

/** Topnav naast pijlers. /diensten bereikbaar via footer en mega-menu. */
export const mainNavLinks: { name: string; href: string }[] = [
  { name: "Cases", href: "/cases" },
  { name: "Over ons", href: "/over" },
  { name: "Contact", href: "/contact" },
];

/** Standaard primaire CTA (o.a. dienstpagina's) */
export const ctaNav = siteCtas.startIntake;
