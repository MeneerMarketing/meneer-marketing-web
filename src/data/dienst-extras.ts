export interface DienstExtra {
  outcomes: string[];
  faq: { question: string; answer: string }[];
}

const Q = {
  start: {
    question: "Hoe starten we. En hoe snel zie ik iets live?",
    answer:
      "We beginnen met een korte intake of Groeiscan: doelen, stack, prioriteit. Daarna een sprintplan met duidelijke oplevermomenten. Geen zwarte doos van maanden zonder zichtbare voortgang.",
  },
  remote: {
    question: "Werken jullie remote met ons team?",
    answer:
      "Ja. We werken gestructureerd async (documentatie, Loom, tickets) en plannen vaste syncs waar nodig. Vooral rond launches en experimenten.",
  },
  meet: {
    question: "Hoe meten we succes?",
    answer:
      "Vooraf KPI’s afstemmen (omzet, leads, CPA, snelheid, tijdwinst). We koppelen dat aan analytics en. Waar zinvol. Dashboards zodat je team zelf kan meelezen.",
  },
} as const;

export const dienstExtras: Record<string, DienstExtra> = {
  "shopify-enterprise": {
    outcomes: [
      "Thema en secties die meegroeien met assortiment en merk",
      "Checkout- en B2B-scenario’s zonder fragiele workarounds",
      "Performance en CWV als harde eis in elke release",
    ],
    faq: [
      Q.start,
      {
        question: "Migreren jullie ook van legacy-themes naar Online Store 2.0?",
        answer:
          "Ja. We plannen migraties met redirects, data en campagne-impact. Zodat SEO en ads niet onnodig schokken.",
      },
      Q.meet,
    ],
  },
  webdevelopment: {
    outcomes: [
      "Maatwerk websites die snel laden en makkelijk te beheren zijn",
      "Heldere structuur en design passend bij je merk",
      "Overdracht en documentatie — je zit niet vast aan één persoon",
    ],
    faq: [
      Q.start,
      {
        question: "Werken jullie met bestaande agencies of in-house devs?",
        answer:
          "Zeker. We kunnen lead nemen, meebouwen of alleen architectuur/review leveren. Afhankelijk van wat je team nodig heeft.",
      },
      Q.remote,
    ],
  },
  "web-apps": {
    outcomes: [
      "React/Next-apps met duidelijke auth, rollen en datastromen",
      "API’s en integraties zonder onnodige complexiteit",
      "UI die vertrouwen en conversie combineert",
    ],
    faq: [
      Q.start,
      {
        question: "Kunnen jullie koppelen met onze bestaande CRM of ERP?",
        answer:
          "Ja, via REST/GraphQL, webhooks of integratieplatformen. Altijd met aandacht voor idempotentie en foutafhandeling.",
      },
      Q.meet,
    ],
  },
  optimalisatie: {
    outcomes: [
      "Concrete winst op LCP, CLS en INP. Gemeten voor/na",
      "Minder third-party en theme-bloat zonder functionaliteit te breken",
      "Documentatie zodat nieuwe features snelheid niet terugverliezen",
    ],
    faq: [
      {
        question: "Hoe diep gaan jullie. Ook server en DNS?",
        answer:
          "We beginnen bij de grootste bottlenecks (meestal frontend en assets). Wa nodig kijken we mee naar hosting, caching en CDN. In samenwerking met je provider.",
      },
      Q.start,
      Q.meet,
    ],
  },
  seo: {
    outcomes: [
      "Informatiearchitectuur en clusters die autoriteit opbouwen",
      "Technische SEO die meelift op snelle templates",
      "Meetplan: Search Console, rank signals en conversie per pagina",
    ],
    faq: [
      {
        question: "Beloven jullie posities?",
        answer:
          "Nee. Dat is onbetrouwbaar. We beloven proces: heldere structuur, sterke content, techniek en rapportage die beslissingen ondersteunen.",
      },
      Q.start,
      Q.remote,
    ],
  },
  adverteren: {
    outcomes: [
      "Accountstructuur en audiences passend bij marge en salescyclus",
      "Creatives en landingspagina’s die hetzelfde verhaal vertellen",
      "Conversiemeting die klopt. Anders stuur je op ruis",
    ],
    faq: [
      {
        question: "Google, Meta of beide?",
        answer:
          "Dat hangt af van je aanbod en doelgroep. We starten waar de grootste leercurve per euro zit en schalen beheerst.",
      },
      Q.start,
      Q.meet,
    ],
  },
  cro: {
    outcomes: [
      "Hypotheses op basis van gedrag. Niet op meningen",
      "Experimenten met nette statistiek en duidelijke leesregels",
      "Samenhang met SEO en ads zodat traffic-kwaliteit meeweegt",
    ],
    faq: [
      {
        question: "Hebben we veel traffic nodig voor A/B-tests?",
        answer:
          "Voor sommige tests wel. Bij lagere volumes werken we met directional evidence, UX-sprints en kwalitatieve data.",
      },
      Q.start,
      Q.meet,
    ],
  },
  leadgeneratie: {
    outcomes: [
      "Proposities en landingspagina’s die aansluiten op echte pijnpunten",
      "CRM-koppelingen en opvolging zonder spamgevoel",
      "Rapportage: kosten per lead en kwaliteit",
    ],
    faq: [
      Q.start,
      {
        question: "Doen jullie ook outbound of alleen inbound?",
        answer:
          "Primair inbound en paid/organic flows. Outbound koppelen we aan partners waar nodig. Met dezelfde meetlat.",
      },
      Q.meet,
    ],
  },
  automatisering: {
    outcomes: [
      "Flows met logging, retries en duidelijke owners",
      "Minder handwerk en minder menselijke fouten in de keten",
      "Documentatie zodat je niet locked-in zit op één persoon",
    ],
    faq: [
      {
        question: "n8n of Make. Wat kiezen we?",
        answer:
          "Hangt van je stack, hosting en team af. We adviseren op onderhoudbaarheid en kosten. Niet op hype.",
      },
      Q.start,
      Q.remote,
    ],
  },
  workflows: {
    outcomes: [
      "Order → finance → fulfilment in sync",
      "Duidelijke foutafhandeling als een API even faalt",
      "Minder Excel-stress voor operations",
    ],
    faq: [
      Q.start,
      {
        question: "Ondersteunen jullie multi-warehouse of dropship?",
        answer:
          "Ja, mits je bron-systemen API’s of exports hebben die betrouwbaar zijn. We mappen edge cases expliciet.",
      },
      Q.meet,
    ],
  },
  chatbots: {
    outcomes: [
      "Bot getraind op jouw kennis en tone of voice",
      "Escalatie naar mensen met context",
      "Meting: waar haken mensen af, wat levert het op?",
    ],
    faq: [
      {
        question: "Hoe zit het met privacy en AVG?",
        answer:
          "We ontwerpen datastromen vanaf dag één: welke data mag waar, hoe lang bewaren we logs, en hoe informeer je gebruikers?",
      },
      Q.start,
      Q.remote,
    ],
  },
  tracking: {
    outcomes: [
      "Event-specificatie die campagnes en CRO voedt",
      "Consent en tags die netjes samenwerken",
      "Debug-proces zodat je team issues snel vindt",
    ],
    faq: [
      {
        question: "Server-side tagging. Wanneer is dat nodig?",
        answer:
          "Bij strengere browsers, complexe stacks of wanneer je first-party data wilt stabiliseren. We adviseren op basis van risico en ROI.",
      },
      Q.start,
      Q.meet,
    ],
  },
  branding: {
    outcomes: [
      "Positionering die onderscheidt én verkoopt",
      "Huisstijl die op site, mail en ads werkt",
      "Guidelines die partners en team kunnen volgen",
    ],
    faq: [
      Q.start,
      {
        question: "Leveren jullie alleen strategy of ook uitvoering?",
        answer:
          "Beide: van merkstory tot visuele templates. Afgestemd op je development- en campagneproces.",
      },
      Q.remote,
    ],
  },
  webdesign: {
    outcomes: [
      "Flows en wireframes vóór pixels",
      "Design system-light: herhaalbare patronen",
      "Toegankelijkheid: contrast, focus en semantiek meegenomen",
    ],
    faq: [
      Q.start,
      {
        question: "Leveren jullie Figma voor onze developers?",
        answer:
          "Ja. Met componenten, states en specificaties zodat build voorspelbaar blijft.",
      },
      Q.meet,
    ],
  },
  animaties: {
    outcomes: [
      "Motion die conversie ondersteunt. Niet afleidt",
      "Performance-budget en reduced-motion support",
      "Storyboard per sectie voor consistente energie",
    ],
    faq: [
      {
        question: "Framer Motion of CSS-only?",
        answer:
          "Hangt van stack en onderhoud af. We kiezen wat je team langdurig kan dragen.",
      },
      Q.start,
      Q.remote,
    ],
  },
  media: {
    outcomes: [
      "Creatives met hooks voor testen in campagnes",
      "Consistentie met landingspagina’s en merk",
      "Snelle iteraties op basis van data",
    ],
    faq: [
      Q.start,
      {
        question: "Leveren jullie ook UGC-stijl content?",
        answer:
          "We richten op wat past bij je merk. Soms strak studio, soms authentieker. We stemmen af op platform en doelgroep.",
      },
      Q.meet,
    ],
  },
  email: {
    outcomes: [
      "Nieuwsbrieven en campagnes die passen bij je merk",
      "Automatische flows: welkom, herinnering, na aankoop",
      "Koppeling met Klaviyo, Shopify Mail of jouw e-mailtool",
    ],
    faq: [
      Q.start,
      {
        question: "Doen jullie alleen design of ook de strategie en opzet?",
        answer:
          "Beide. Van welke mails je wanneer stuurt tot hoe ze eruitzien en technisch worden opgezet in je e-mailtool.",
      },
      {
        question: "Kunnen jullie koppelen met Klaviyo of Shopify Mail?",
        answer:
          "Ja. We werken met de tools die jij al gebruikt, of adviseren wat het beste past bij je webshop of site.",
      },
      Q.remote,
    ],
  },
};

export function getDienstExtra(slug: string): DienstExtra | null {
  return dienstExtras[slug] ?? null;
}
