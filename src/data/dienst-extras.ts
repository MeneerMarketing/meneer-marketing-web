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
      "Custom theme from scratch dat meegroeit met assortiment en merk",
      "Checkout en complexe shop-logica zonder fragiele app-workarounds",
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
      "Websites from scratch die snel laden en makkelijk te beheren zijn",
      "Heldere structuur en design passend bij je merk",
      "Overdracht en documentatie, zodat je niet vastzit aan één persoon",
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
      "B2B-portaal of boekingsapp from scratch, gebouwd voor jouw rollen en rechten",
      "Koppelingen met Shopify, CRM en e-mail zonder spaghetti tussen systemen",
      "Adoptie-proof: je team en klanten snappen het zonder handleiding van tien pagina's",
    ],
    faq: [
      Q.start,
      {
        question: "Wat is het verschil met een gewone website?",
        answer:
          "Een website informeert. Een portaal of app laat mensen inloggen, data zien en acties uitvoeren: bestellen, boeken, status volgen. Dat vraagt auth, rollen en vaak koppelingen met je andere systemen.",
      },
      {
        question: "Kunnen jullie koppelen met onze bestaande CRM of ERP?",
        answer:
          "Ja. Via API's, webhooks of integratieplatformen. Altijd met aandacht voor foutafhandeling en één bron van waarheid voor je data.",
      },
      {
        question: "Hebben jullie voorbeelden van portalen die jullie bouwden?",
        answer:
          "SkinComplete: B2B-portaal in Shopify waar salons zelf bestellen. Hills Pilates: website plus app met agenda en boekingen. Beide from scratch, beide gebouwd om mee te groeien.",
      },
      Q.meet,
    ],
  },
  optimalisatie: {
    outcomes: [
      "Concrete winst op LCP, CLS en INP. Gemeten voor/na op omzet-pagina's",
      "Minder third-party en theme-bloat zonder functionaliteit te breken",
      "Documentatie zodat nieuwe features snelheid niet terugverliezen",
    ],
    faq: [
      {
        question: "Hoe diep gaan jullie. Ook server en DNS?",
        answer:
          "We beginnen bij de grootste bottlenecks, meestal frontend, assets en third-parties. Wa nodig kijken we mee naar hosting, caching en CDN, in samenwerking met je provider.",
      },
      {
        question: "Optimaliseren jullie alleen Shopify, of ook custom sites?",
        answer:
          "Beide. Shopify-themes, Next.js, WordPress-migraties: de aanpak is hetzelfde. Meten op templates die ertoe doen, fixen in code, niet maskeren met plugins.",
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
          "Primair inbound en paid/organic kanalen. Outbound koppelen we aan partners waar nodig. Met dezelfde meetlat.",
      },
      Q.meet,
    ],
  },
  automatisering: {
    outcomes: [
      "Automatisering met logging, retries en duidelijke owners",
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
      "Positionering die onderscheidt én verkoopt, niet alleen mooi klinkt",
      "Huisstijl die op site, Google Ads, Meta Ads en mail consistent is",
      "Guidelines en templates die je team zelf kan toepassen",
    ],
    faq: [
      Q.start,
      {
        question: "Leveren jullie alleen strategy of ook uitvoering?",
        answer:
          "Beide: van merkstory tot visuele templates. Afgestemd op je web-build en campagneproces, zodat alles één geheel wordt.",
      },
      {
        question: "Moet ik al een logo hebben?",
        answer:
          "Nee. Soms hergebruiken we wat werkt, soms breken we bewust met het oude. We beginnen bij positionering, niet bij 'even een icoon'.",
      },
      Q.remote,
    ],
  },
  webdesign: {
    outcomes: [
      "Wireframes vóór pixels, goedgekeurd voordat er polish komt",
      "Ontwerp met componenten, states en specs voor voorspelbare build",
      "Toegankelijkheid en mobiel-first waar jouw omzet dat vraagt",
    ],
    faq: [
      Q.start,
      {
        question: "Leveren jullie ontwerp-specs voor developers?",
        answer:
          "Ja. Met componenten, states, spacing en specificaties zodat build voorspelbaar blijft. Of ik bouw het zelf from scratch, dan zit design en code al op één lijn.",
      },
      {
        question: "Ontwerpen jullie alleen, of bouwen jullie ook?",
        answer:
          "Beide. Vaak ontwerp én bouw ik in één lijn: wireframes, specs, Next.js of Shopify. Geen estafette tussen designer en developer die elkaar niet snappen.",
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
      "Automatische mails: welkom, herinnering, na aankoop",
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
  strategie: {
    outcomes: [
      "Eén plan met kanalen, budget en volgorde. Geen losse acties meer",
      "Onderbouwing met jouw cijfers, niet met onderbuikgevoel",
      "Maandelijkse bijsturing: meer naar wat werkt, weg met wat niet werkt",
    ],
    faq: [
      {
        question: "Krijg ik alleen een plan of ook de uitvoering?",
        answer:
          "Beide kan. Het plan staat op zichzelf, maar de meeste klanten laten ons ook uitvoeren. Dan blijft de strategie geen papier en zie je elke maand wat het oplevert.",
      },
      Q.start,
      Q.meet,
    ],
  },
  "ai-zoek": {
    outcomes: [
      "Jouw bedrijf als antwoord in ChatGPT, Gemini en Google AI",
      "Content en techniek die AI-modellen kunnen lezen en citeren",
      "Voorsprong op concurrenten die dit kanaal nog niet kennen",
    ],
    faq: [
      {
        question: "Is vindbaarheid in AI-zoek nu al belangrijk?",
        answer:
          "Ja. Een groeiend deel van de zoektochten begint bij ChatGPT of Gemini, en Google toont AI-antwoorden boven de gewone resultaten. Wie er nu in investeert, bouwt een voorsprong op die later duur is om in te halen.",
      },
      {
        question: "Hoe verschilt dit van gewone SEO?",
        answer:
          "De basis overlapt: goede content en een technisch kloppende site. AI-zoek vraagt daarnaast om content die als antwoord te citeren is, duidelijke bedrijfsinformatie en autoriteitssignalen die modellen herkennen.",
      },
      Q.meet,
    ],
  },
  "local-seo": {
    outcomes: [
      "Bovenaan in Google en Maps als iemand in jouw regio zoekt",
      "Een Google Business-profiel dat klanten overtuigt",
      "Meer telefoontjes, routes en aanvragen uit je eigen omgeving",
    ],
    faq: [
      {
        question: "Werkt lokale SEO ook zonder fysieke winkel?",
        answer:
          "Ja, ook als je aan huis werkt of een servicegebied hebt. We richten je profiel en pagina's dan in op de regio's waar je klanten zitten.",
      },
      Q.start,
      Q.meet,
    ],
  },
  "content-marketing": {
    outcomes: [
      "Content die verkeer oplevert én de juiste klanten aantrekt",
      "Autoriteit per onderwerp, opgebouwd met structuur",
      "Eén verhaal over site, social en e-mail heen",
    ],
    faq: [
      {
        question: "Schrijven jullie de content zelf?",
        answer:
          "Ja, in jouw tone of voice en afgestemd op wat je klant zoekt. Jij controleert op vakinhoud, wij zorgen dat het scoort en prettig leest.",
      },
      Q.start,
      Q.remote,
    ],
  },
  reviews: {
    outcomes: [
      "Structurele stroom nieuwe reviews op de platforms die tellen",
      "Sterren zichtbaar in Google bij je bedrijfsnaam en pagina's",
      "Minder twijfel in de funnel, dus meer conversie",
    ],
    faq: [
      {
        question: "Wat doen jullie met negatieve reviews?",
        answer:
          "Netjes en snel reageren, en ervan leren. Een goed afgehandelde kritische review wekt vaak meer vertrouwen dan tien juichende. Verwijderen kan alleen als een review echt tegen de regels ingaat.",
      },
      Q.start,
      Q.meet,
    ],
  },
  "google-ads": {
    outcomes: [
      "Campagnes die budget naar klanten sturen, niet naar loze klikken",
      "Structuur en meting die je zelf kunt volgen",
      "Duidelijk schaalpad: wanneer meer budget zinvol is en wanneer niet",
    ],
    faq: [
      {
        question: "Wat is een realistisch startbudget?",
        answer:
          "Dat hangt af van je markt en marge. We rekenen vooraf uit wat een klant mag kosten en starten met een budget waarmee we snel kunnen leren. Meestal kun je binnen enkele weken zien of het kanaal voor jou werkt.",
      },
      Q.start,
      Q.meet,
    ],
  },
  "meta-ads": {
    outcomes: [
      "Campagnes op Facebook en Instagram die meetbaar verkopen",
      "Creatives en hooks die getest zijn, niet gegokt",
      "Retargeting die klanten terughaalt zonder irritant te worden",
    ],
    faq: [
      {
        question: "Hebben jullie ook de content voor de advertenties?",
        answer:
          "Ja. We maken creatives zelf of zetten UGC en creators in. Vaak is de content het verschil tussen een campagne die rendeert en één die geld kost.",
      },
      Q.start,
      Q.meet,
    ],
  },
  "social-media": {
    outcomes: [
      "Consistente zichtbaarheid op de kanalen waar jouw klant zit",
      "Formats en ritme die vol te houden zijn",
      "Social die aansluit op je site en campagnes, één verhaal",
    ],
    faq: [
      {
        question: "Moeten we op elk platform zitten?",
        answer:
          "Nee. Beter twee kanalen goed dan vijf halfslachtig. We kiezen de plekken waar jouw klant echt zit en waar je het ritme kunt volhouden.",
      },
      Q.start,
      Q.remote,
    ],
  },
  ugc: {
    outcomes: [
      "Video's van echte mensen die je product laten zien zoals klanten het gebruiken",
      "Varianten en hooks klaar om te testen in je campagnes",
      "Rechten geregeld, zodat je content overal mag inzetten",
    ],
    faq: [
      {
        question: "Wat is het verschil tussen UGC en influencer marketing?",
        answer:
          "Bij UGC koop je de content: een creator maakt video's die jij inzet in je eigen advertenties. Bij influencer marketing koop je ook het bereik van de creator zelf. Vaak combineren we beide.",
      },
      Q.start,
      Q.meet,
    ],
  },
  "influencer-marketing": {
    outcomes: [
      "Creators die passen bij je merk, product en marge",
      "Afspraken over content, rechten en vergoeding zwart op wit",
      "Per samenwerking meetbaar wat het heeft opgeleverd",
    ],
    faq: [
      {
        question: "Hoe voorkomen jullie nep-volgers en tegenvallend bereik?",
        answer:
          "We beoordelen accounts op echt engagement en eerdere samenwerkingen, niet op volgersaantallen. En we meten elke samenwerking met eigen codes of links, zodat het resultaat zichtbaar is.",
      },
      Q.start,
      Q.meet,
    ],
  },
  marketplaces: {
    outcomes: [
      "Producten die gevonden en gekozen worden op Bol en Amazon",
      "Listings, reviews en ads die samen je positie opbouwen",
      "Marketplace als extra kanaal naast je eigen shop, niet ten koste van",
    ],
    faq: [
      {
        question: "Kannibaliseert Bol of Amazon mijn eigen webshop niet?",
        answer:
          "Dat risico bestaat en daarom stemmen we assortiment en prijsstrategie af. Vaak bereik je op marketplaces klanten die je eigen shop nooit gevonden hadden.",
      },
      Q.start,
      Q.meet,
    ],
  },
  retentie: {
    outcomes: [
      "Meer herhaalaankopen uit klanten die je al hebt",
      "Loyaliteit en win-back mailreeksen die bij je marge passen",
      "Hogere klantwaarde, dus meer ruimte om nieuwe klanten te werven",
    ],
    faq: [
      {
        question: "Is retentie ook interessant voor dienstverleners?",
        answer:
          "Zeker. Voor diensten gaat het om verlengingen, vervolgopdrachten en doorverwijzingen. Dezelfde principes, andere mailreeksen.",
      },
      Q.start,
      Q.meet,
    ],
  },
};

export function getDienstExtra(slug: string): DienstExtra | null {
  return dienstExtras[slug] ?? null;
}
