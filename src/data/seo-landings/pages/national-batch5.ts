import type {
  SeoLandingCategory,
  SeoLandingPage,
  SeoLandingProseOverride,
  SeoLandingSceneBreak,
  SeoLandingStep,
  SeoLandingVisual,
} from "@/data/seo-landings/types";
import type { PillarSlug } from "@/lib/navigation";

const processDefault = [
  {
    title: "Intake zonder salescircus",
    body: "Jij vertelt waar je zit. Ik zeg eerlijk wat zin heeft en wat niet.",
  },
  {
    title: "Plan met volgorde",
    body: "Niet alles tegelijk. Eerst wat het snelst oplevert of het fundament fixt.",
  },
  {
    title: "Uitvoeren",
    body: "Ik bouw, schrijf en zet live. Alles onder één dak.",
  },
  {
    title: "Meten en bijsturen",
    body: "Cijfers beslissen. Sentiment niet.",
  },
] as const;

const BATCH5_PROCESS: Record<string, readonly SeoLandingStep[]> = {
  "marketing-bureau": [
    { title: "Inventarisatie", body: "Site, marges, kanalen, wat je al hebt geprobeerd." },
    { title: "Volgorde bepalen", body: "Bouwen, ranken, adverteren of mail. Niet alles tegelijk." },
    { title: "Uitvoeren onder één dak", body: "Ik bouw, schrijf en zet campagnes live." },
    { title: "Maandelijks bijsturen", body: "ROAS, rankings en omzet per flow. Cijfers die actie geven." },
  ],
  "website-specialist": [
    { title: "Audit op mobiel", body: "Snelheid, structuur, CTA's. Wat lekt vóór ik bouw." },
    { title: "Architectuur", body: "Next.js of Shopify. Custom build die meegroeit." },
    { title: "Bouwen & SEO-fundament", body: "Code, schema, interne links. Lighthouse groen." },
    { title: "Klaar voor campagnes", body: "GTM, landings, tracking. Ads kunnen aan." },
  ],
  "seo-bureau": [
    { title: "Keyword-onderzoek", body: "Waar zit koopintentie, niet alleen volume." },
    { title: "Techniek fixen", body: "Snelheid, indexatie, interne structuur." },
    { title: "Pagina's schrijven én bouwen", body: "Landings die ranken én converteren." },
    { title: "Posities vasthouden", body: "Bijsturen op rankings én omzet per pagina." },
  ],
  "email-marketing": [
    { title: "Lijst & segmenten", body: "Wie krijgt wat. Segmenten op gedrag." },
    { title: "Flows prioriteren", body: "Welkom, abandon, post-purchase. Wat eerst geld oplevert." },
    { title: "Copy & design", body: "Jouw tone. Copy die bij je merk past." },
    { title: "Omzet per flow meten", body: "Niet alleen open rate. Euro's per mailreeks." },
  ],
  "e-mailmarketing-bureau": [
    { title: "Shop & stack koppelen", body: "Klaviyo of Shopify Mail. Productdata klopt." },
    { title: "Strategie & ritme", body: "Flows plus nieuwsbrief als het past." },
    { title: "Bouwen & testen", body: "Technisch en inhoudelijk. Jij keurt goed." },
    { title: "Rapportage op omzet", body: "Per flow, per segment. Euro's per mailreeks." },
  ],
  "website-laten-ontwerpen": [
    { title: "UX & wireframe", body: "Structuur en flow vóór pixels." },
    { title: "Visueel ontwerp", body: "Merk, vertrouwen, duidelijke CTA." },
    { title: "Bouwen in code", body: "Design wordt echte site. Live, meetbaar, snel." },
    { title: "SEO & snelheid", body: "Mooi én Lighthouse-groen." },
  ],
  "internetmarketing-bureau": [
    { title: "Kanalen in kaart", body: "Site, SEO, ads, mail. Wat wanneer." },
    { title: "Fundament eerst", body: "Eerst site en conversie, dan ads opschalen." },
    { title: "Uitrollen per laag", body: "Bouwen, ranken, campagnes, retentie." },
    { title: "Eén dashboard", body: "Omzet en leads. Heldere cijfers." },
  ],
  "online-marketing-specialist": [
    { title: "Situatie schetsen", body: "Waar zit je, wat heb je geprobeerd." },
    { title: "Channel-mix", body: "SEO, ads, mail. Eerlijk over prioriteit." },
    { title: "Hands-on uitvoeren", body: "Ik doe het zelf. Jij praat met mij." },
    { title: "Bijsturen op cijfers", body: "Wat werkt opschalen. Wat niet stoppen." },
  ],
  "website-ontwikkelaar": [
    { title: "Scope & stack", body: "Next.js, Shopify, API's. Wat past bij groei." },
    { title: "Development", body: "Performance-first. Core Web Vitals ingebouwd." },
    { title: "Integraties", body: "CRM, shop, mail, tracking." },
    { title: "Overdracht of onderhoud", body: "Documentatie. Jij bent niet gevangen." },
  ],
  "social-media-marketing-bureau": [
    { title: "Content & kanalen", body: "Instagram, LinkedIn, TikTok. Wat past bij jouw klant." },
    { title: "Organic ritme", body: "Consistent posten. Meetbaar resultaat." },
    { title: "Paid waar het rendeert", body: "Meta, TikTok. Landings die matchen." },
    { title: "UGC & creators", body: "Echte gezichten. Authentieke content." },
  ],
  "webdesign-specialist": [
    { title: "UX & conversie", body: "Hiërarchie, trust, volgende stap." },
    { title: "Visueel systeem", body: "Design dat schaalt over pagina's." },
    { title: "Bouwen & deployen", body: "Design wordt live site. Pixel-perfect in productie." },
    { title: "Motion subtiel", body: "Premium zonder circus." },
  ],
};

const BATCH5_SCENES: Record<string, readonly SeoLandingSceneBreak[]> = {
  "marketing-bureau": [
    {
      placement: "after-story",
      visual: "ai-search",
      eyebrow: "Onder de motorkap",
      title: "Eén bureau, vier lagen die op elkaar bouwen",
      caption:
        "Strategie zonder site is een PowerPoint. Ads zonder SEO is duur. Mail zonder shop is een nieuwsbrief naar niemand. Ik koppel het.",
    },
    {
      placement: "after-deep-dive",
      visual: "ai-search",
      eyebrow: "Vindbaarheid 2026",
      title: "Ook in AI-antwoorden zichtbaar worden",
      caption:
        "Google is niet meer de enige ingang. ChatGPT en Gemini citeren merken met sterke content en techniek. Dat bouw ik mee in.",
    },
  ],
  "website-specialist": [
    {
      placement: "after-story",
      visual: "tracking-lab",
      eyebrow: "From scratch",
      title: "Code die Google en bezoekers allebei snappen",
      caption: "Custom build met SEO, snelheid en conversie ingebouwd. From scratch voor jouw merk.",
    },
  ],
  "seo-bureau": [
    {
      placement: "after-story",
      visual: "content-hub",
      eyebrow: "Positie check",
      title: "Ranken is leuk. Converteren is beter.",
      caption:
        "Ik bouw de pagina's die op pagina één moeten staan. Niet alleen een spreadsheet met tips die niemand uitvoert.",
    },
    {
      placement: "after-aanpak",
      visual: "ai-search",
      eyebrow: "AI-zoek",
      title: "SEO in 2026 is Google én ChatGPT",
      caption: "Pagina's die antwoord geven op echte vragen. Dan citeert AI je ook.",
    },
  ],
  "email-marketing": [
    {
      placement: "after-story",
      visual: "metrics-dashboard",
      eyebrow: "Flows",
      title: "Je lijst is goud als je weet welke mail wanneer",
      caption: "Welkom, cart recovery, win-back. Omzet per mailreeks, niet batch op dinsdag.",
    },
  ],
  "e-mailmarketing-bureau": [
    {
      placement: "after-aanpak",
      visual: "email-flow",
      eyebrow: "Shop + mail",
      title: "E-mailmarketing die aan je winkelwagen hangt",
      caption: "Productdata, segmenten en flows die omzet per mailreeks meten.",
    },
  ],
  "website-laten-ontwerpen": [
    {
      placement: "after-story",
      visual: "tracking-lab",
      eyebrow: "Ontwerp → live",
      title: "Figma die ook echt online komt",
      caption: "Ik ontwerp én bouw. Eén lijn van schets tot live site.",
    },
  ],
  "internetmarketing-bureau": [
    {
      placement: "after-deep-dive",
      visual: "strategy-stack",
      eyebrow: "Volgorde",
      title: "Internetmarketing zonder spaghetti",
      caption: "Site, vindbaarheid, campagnes, mail. In die volgorde als het moet.",
    },
  ],
  "online-marketing-specialist": [
    {
      placement: "after-story",
      visual: "google-ads",
      eyebrow: "Hands-on",
      title: "Specialist die zelf in accounts zit",
      caption: "Direct contact. Ik bouw, rank en adverteer. Jij praat met mij.",
    },
  ],
  "website-ontwikkelaar": [
    {
      placement: "after-aanpak",
      visual: "tracking-lab",
      eyebrow: "Stack",
      title: "Developer die marketing niet negeert",
      caption: "Next.js, Shopify, API-koppelingen. Met SEO en tracking ingebouwd.",
    },
  ],
  "social-media-marketing-bureau": [
    {
      placement: "after-story",
      visual: "content-hub",
      eyebrow: "Social + paid",
      title: "Likes zijn leuk. Checkout is beter.",
      caption: "Organic, paid social en UGC. Met landings die ik zelf bouw.",
    },
  ],
  "webdesign-specialist": [
    {
      placement: "after-story",
      visual: "tracking-lab",
      eyebrow: "Design + code",
      title: "Webdesign dat je kunt deployen",
      caption: "UI/UX, conversie en development in één handenpaar.",
    },
  ],
};

const BATCH5_STORY: Record<string, SeoLandingProseOverride> = {
  "marketing-bureau": {
    title: "Waarom de meeste marketing bureaus je teleurstellen",
    paragraphs: [
      "Je belt een bureau. Mooi gesprek. Drie weken later een deck met vijf kanalen, twaalf KPI's en een retainer die begint voordat er iets live staat. Jij bent projectmanager geworden tussen SEO-partij, ads-guy en een bouwer die elkaar niet kennen.",
      "Ik werk anders. Eén aanspreekpunt, één plan, één iemand die je site opent, je account leest en je mailflows meet. Eerst organisch groeien, daarna pas ads. Per productlijn een eigen aanpak. Elk plan op maat.",
      "Marketing bureau bij mij betekent: ik zeg eerlijk wat eerst moet. Soms is dat geen ads. Soms is het een landingspagina die je in drie seconden laadt. Altijd is het meetbaar.",
    ],
  },
  "seo-bureau": {
    title: "SEO bureau dat niet stopt bij het rapport",
    paragraphs: [
      "Je krijgt een PDF met veertig tips. Niemand voert ze uit. Zes maanden later hetzelfde rapport met andere kleur. Je betaalt voor hoop, niet voor pagina's die ranken.",
      "Ik schrijf en bouw de landings zelf. Technische SEO, content, interne links, schema. En ik meet omzet per pagina, niet alleen posities. Positie drie zonder conversie is een trofee in een lege winkel.",
      "SEO bureau inhuren bij Meneer Marketing is iemand die je site aanraakt, je concurrenten leest en je zegt wanneer ads slimmer zijn dan nog een blog.",
    ],
  },
  "email-marketing": {
    title: "Email marketing die omzet oplevert, niet alleen opens",
    paragraphs: [
      "Je hebt een lijst. Soms stuur je een nieuwsbrief. Open rate daalt. Niemand koopt. Je lijst is geen asset, het is een verplichting geworden.",
      "Flows veranderen dat. Welkom na aanmelding. Cart recovery na twee uur. Win-back na zestig dagen zonder koop. Mail staat vóór het adsbudget omhoog gaat. Elke euro op ads werkte harder.",
      "Email marketing is geen 'leuke nieuwsbrief'. Het is retentie op autopilot. Ik bouw de flows, schrijf de copy en koppel aan je shop.",
    ],
  },
  "website-specialist": {
    title: "Website specialist die bouwt én meet",
    paragraphs: [
      "Je huurt een specialist. Je krijgt tips in PDF. Niemand die code schrijft. Je site blijft traag, tracking ontbreekt, ads starten blind.",
      "Website specialist bij mij is hands-on: Next.js of Shopify custom, Core Web Vitals groen, GTM klaar, landings voor campagnes.",
      "Ik ben de specialist die je site opent na launch. Niet alleen het deck bij de intake.",
    ],
  },
  "e-mailmarketing-bureau": {
    title: "E-mailmarketing bureau gekoppeld aan je shop",
    paragraphs: [
      "Mailchimp in een hoek. Shop in Shopify. Prijzen kloppen niet in de mail. Segmenten ontbreken. Batch op dinsdag naar iedereen.",
      "E-mailmarketing bureau bij mij koppelt shop, segmenten en flows. Welkom, cart, post-purchase. Omzet per mailreeks.",
      "Mail gekoppeld aan shop en B2B-portaal. Dat is hoe mail waarde levert in plaats van ruis.",
    ],
  },
  "website-laten-ontwerpen": {
    title: "Website laten ontwerpen zonder Figma-dode zone",
    paragraphs: [
      "Mooi ontwerp. Maanden in Figma. Developer vertaalt het verkeerd. Of er komt nooit een developer. Je merk staat nog steeds offline.",
      "Ik ontwerp én bouw. UX, conversie, merk en code in één traject. Design wordt een live site die rankt en converteert.",
      "Website laten ontwerpen bij Meneer Marketing eindigt op een URL die je kunt delen en meten.",
    ],
  },
  "internetmarketing-bureau": {
    title: "Internetmarketing zonder spaghetti",
    paragraphs: [
      "Site bij de ene, SEO bij de tweede, ads bij de derde. Jij bent projectmanager. Budget lekt tussen de partijen door.",
      "Internetmarketing bureau bij mij is volgorde: fundament, vindbaarheid, campagnes, retentie. Eén dashboard, één aanspreekpunt.",
      "Elk traject krijgt een eigen route. Internetmarketing met die discipline wint van alles-tegelijk.",
    ],
  },
  "online-marketing-specialist": {
    title: "Online marketing specialist die zelf uitvoert",
    paragraphs: [
      "Specialist die decks maakt. Stagiair die accounts beheert. Jij betaalt senior, krijgt junior. Herkenbaar?",
      "Online marketing specialist bij mij bouwt, rankt, adverteert en mailt. Zelfde persoon van intake tot bijsturing.",
      "12 jaar praktijk. Ik lees je analytics voordat ik budget adviseer. Eerlijk als stoppen slimmer is dan opschalen.",
    ],
  },
  "website-ontwikkelaar": {
    title: "Website ontwikkelaar met marketing in het DNA",
    paragraphs: [
      "Developer bouwt mooi. SEO, schema en tracking zijn afterthought. Launch dag drie seconden LCP. Ads worden duur.",
      "Website ontwikkelaar bij mij is performance-first: Next.js, Shopify, API's, Core Web Vitals, conversie en overdracht die klopt.",
      "Portalen, shops en marketing sites in productie. Code die Google en bezoekers allebei snappen.",
    ],
  },
  "social-media-marketing-bureau": {
    title: "Social media marketing met checkout als doel",
    paragraphs: [
      "Likes stijgen. Omzet niet. Social media marketing zonder paid plan en landings is een hobby met een factuur.",
      "Ik combineer organic ritme, paid social waar het rendeert en UGC die niet als stock schreeuwt. Landings bouw ik zelf.",
      "Social media marketing bureau bij mij eindigt bij checkout, niet bij engagement rate.",
    ],
  },
  "webdesign-specialist": {
    title: "Webdesign specialist die deployt",
    paragraphs: [
      "Prachtig Dribbble-shot. Trage site. Onduidelijke CTA. Webdesign zonder development en conversie is decoratie.",
      "Webdesign specialist bij mij levert UI/UX, merk en code. Subtiele motion, premium gevoel, Lighthouse groen.",
      "Design dat je kunt deployen. Webdesign eindigt bij mij op productie, niet in een map met exports.",
    ],
  },
};

interface NationalPageConfig {
  slug: string;
  primaryKeyword: string;
  category: SeoLandingCategory;
  metaTitle: string;
  metaDescription: string;
  keywords: readonly string[];
  eyebrow: string;
  headline: string;
  headlineAccent: string;
  subheadline: string;
  pains: readonly { title: string; body: string }[];
  deliverables: readonly { title: string; body: string }[];
  visual: SeoLandingVisual;
  visualCaption: string;
  processTitle: string;
  processSteps?: readonly SeoLandingStep[];
  sceneBreaks?: readonly SeoLandingSceneBreak[];
  proofTitle: string;
  proofBody: string;
  proofCase?: string;
  hotTake: string;
  faq: readonly { question: string; answer: string }[];
  ctaTitle: string;
  ctaBody: string;
  relatedSlugs: readonly string[];
  pillarSlug: PillarSlug;
  pillarLabel: string;
  enrichedOverrides?: SeoLandingPage["enrichedOverrides"];
}

function buildNationalPage(config: NationalPageConfig): SeoLandingPage {
  const storyOverride = BATCH5_STORY[config.slug];
  return {
    ...config,
    layoutProfile: "editorial",
    processSteps: config.processSteps ?? BATCH5_PROCESS[config.slug] ?? processDefault,
    sceneBreaks: config.sceneBreaks ?? BATCH5_SCENES[config.slug],
    enrichedOverrides: config.enrichedOverrides ?? (storyOverride ? { story: storyOverride } : undefined),
    hotTake: { label: "Heet take", body: config.hotTake },
  };
}

export const MARKETING_BUREAU = buildNationalPage({
  slug: "marketing-bureau",
  primaryKeyword: "marketing bureau",
  category: "seo",
  metaTitle: "Marketing bureau · strategie én uitvoering | Meneer Marketing",
  metaDescription:
    "Marketing bureau voor MKB: site, SEO, Google Ads, Meta Ads en e-mail. Eén plan, één aanspreekpunt.",
  keywords: [
    "marketing bureau",
    "marketing bureau nederland",
    "marketingbureau",
    "marketing bureau mkb",
    "full service marketing bureau",
  ],
  eyebrow: "Marketing bureau",
  headline: "Marketing bureau dat ook",
  headlineAccent: "je site kan openen.",
  subheadline:
    "Veel bureaus schrijven slides. Ik bouw, rank, adverteer en mail. Jij praat met mij. Ik ken je shop en je accounts.",
  pains: [
    {
      title: "Strategie zonder handen",
      body: "Mooi plan. Niemand die de landingspagina bouwt of de ads bijstuurt.",
    },
    {
      title: "Te veel losse facturen",
      body: "SEO hier, ads daar, bouwer ergens anders. Jij bent projectmanager geworden.",
    },
    {
      title: "Verkeerde volgorde",
      body: "Budget naar ads terwijl je site nog niet converteert. Duur leerproces.",
    },
  ],
  deliverables: [
    { title: "Groeiplan", body: "Welk kanaal wanneer. Eerlijk over wat níet." },
    { title: "Bouwen & vindbaarheid", body: "From scratch site of shop plus SEO." },
    { title: "Campagnes", body: "Google Ads en Meta als de basis staat." },
    { title: "Behoud", body: "E-mail en flows zodat budget niet lekt." },
  ],
  visual: "strategy-stack",
  visualCaption: "Eén bureau. Eén lijn van strategie tot live.",
  processTitle: "Zo werk ik als marketing bureau",
  proofTitle: "Van site tot mail",
  proofBody:
    "Van shop en SEO tot ads en mail: ik ken het traject omdat ik het zo heb gebouwd. Praktijk, geen theorie uit een template.",
  proofCase: "Strategie tot uitvoering",
  hotTake:
    "Een marketing bureau dat niet kan bouwen is een PowerPoint-fabriek met een duur uurtarief.",
  faq: [
    {
      question: "Wat is het verschil met een online marketing bureau?",
      answer:
        "In de praktijk hetzelfde vak. Jij zoekt 'marketing bureau', ik lever site, SEO, ads en mail onder één dak.",
    },
    {
      question: "Werk je voor MKB?",
      answer: "Ja. Dat is waar ik het meest waarde toevoeg: snel schakelen, geen corporate traagheid.",
    },
  ],
  ctaTitle: "Marketing zonder tien partijen?",
  ctaBody: "Vertel waar je nu zit. Ik schets de slimste volgorde.",
  relatedSlugs: ["online-marketing-bureau", "website-laten-maken", "seo-specialist", "google-ads-bureau"],
  pillarSlug: "strategie",
  pillarLabel: "Strategie",
});

export const WEBSITE_SPECIALIST = buildNationalPage({
  slug: "website-specialist",
  primaryKeyword: "website specialist",
  category: "website",
  metaTitle: "Website specialist · bouwen, SEO en conversie | Meneer Marketing",
  metaDescription:
    "Website specialist die bouwt, optimaliseert en meet. Custom Next.js en Shopify. Blijft betrokken na livegang.",
  keywords: [
    "website specialist",
    "website specialist inhuren",
    "specialist website laten maken",
    "website expert",
    "website specialist nederland",
  ],
  eyebrow: "Website specialist",
  headline: "Website specialist die ook",
  headlineAccent: "je ads begrijpt.",
  subheadline:
    "Ik ben geen 'alleen design' persoon. Ik bouw sites die ranken, converteren en klaar zijn voor campagnes. 12 jaar hands-on.",
  pains: [
    {
      title: "Specialist die alleen adviseert",
      body: "PDF met tips. Jij zoekt nog steeds iemand die code schrijft.",
    },
    {
      title: "Mooi maar traag",
      body: "Lighthouse rood. Google en bezoekers haken af.",
    },
    {
      title: "Meetplan ontbreekt",
      body: "Site live, geen tracking. Je vliegt blind op ads.",
    },
  ],
  deliverables: [
    { title: "Custom build", body: "Next.js of Shopify from scratch." },
    { title: "SEO-fundament", body: "Techniek, snelheid, structuur." },
    { title: "Conversie", body: "Pagina's die verkopen, niet alleen tonen." },
    { title: "Koppeling marketing", body: "GTM, analytics, landings voor ads." },
  ],
  visual: "website-build",
  visualCaption: "Specialist = bouwen én laten groeien.",
  processTitle: "Werkwijze website specialist",
  proofTitle: "From scratch in de praktijk",
  proofBody:
    "MeneerMarketing.nl, klantportalen en shops: alles custom. Ik ben de specialist die het ook echt bouwt.",
  hotTake:
    "Een website specialist die geen Core Web Vitals kan uitleggen, is een grafisch ontwerper met een duurder label.",
  faq: [
    {
      question: "Bouw je ook webshops?",
      answer: "Ja, vooral Shopify custom. B2B-portaal kan ook.",
    },
    {
      question: "Kun je een bestaande site verbeteren?",
      answer: "Ja. Audit eerst: snelheid, SEO, conversie. Dan pas bouwen of fixen.",
    },
  ],
  ctaTitle: "Site die een specialist waardig is?",
  ctaBody: "Vertel je doel. Ik zeg eerlijk wat het kost en wat eerst moet.",
  relatedSlugs: ["website-laten-maken", "hoger-in-google"],
  pillarSlug: "bouwen",
  pillarLabel: "Bouwen",
});

export const SEO_BUREAU = buildNationalPage({
  slug: "seo-bureau",
  primaryKeyword: "seo bureau",
  category: "seo",
  metaTitle: "SEO bureau · rankings én pagina's die verkopen | Meneer Marketing",
  metaDescription:
    "SEO bureau dat landingspagina's bouwt, techniek fixt en content schrijft. Uitvoering in plaats van alleen rapporten. 12+ jaar Google.",
  keywords: [
    "seo bureau",
    "seo bureau nederland",
    "zoekmachine optimalisatie bureau",
    "seo bureau inhuren",
    "beste seo bureau",
  ],
  eyebrow: "SEO bureau",
  headline: "SEO bureau dat de pagina's",
  headlineAccent: "zelf neerzet.",
  subheadline:
    "Veel SEO-bureaus sturen een spreadsheet. Ik schrijf, bouw en fix. Hoger in Google met pagina's die ook converteren.",
  pains: [
    {
      title: "Rapport zonder actie",
      body: "40 tips in PDF. Niemand die ze uitvoert.",
    },
    {
      title: "Content zonder koopintentie",
      body: "Blogverkeer dat leuk leest maar niets oplevert.",
    },
    {
      title: "Techniek blijft liggen",
      body: "Traag, geen schema, rommelige structuur. Google wil helpen, je site niet.",
    },
  ],
  deliverables: [
    { title: "Keyword-plan", body: "Waar zit de vraag die geld oplevert?" },
    { title: "Technische SEO", body: "Snelheid, indexatie, interne links." },
    { title: "Landingspagina's", body: "Geschreven én gebouwd door mij." },
    { title: "AI-vindbaarheid", body: "Antwoorden die ChatGPT kan citeren." },
  ],
  visual: "seo-serp",
  visualCaption: "SEO bureau = zichtbaar worden én verkopen.",
  processTitle: "Zo werkt dit SEO bureau",
  proofTitle: "Organisch eerst",
  proofBody:
    "Eerst ranken op koopintentie, daarna pas ads. Dat is hoe een SEO bureau waarde moet leveren.",
  proofCase: "Organisch eerst",
  hotTake:
    "Een SEO bureau dat geen landingspagina wil schrijven, verkoopt je een abonnement op hoop.",
  faq: [
    {
      question: "Hoe verschilt dit van een SEO specialist?",
      answer: "Zelfde vak, andere zoekterm. Bij mij krijg je specialist én uitvoerder in één.",
    },
    {
      question: "Hoe snel resultaat?",
      answer: "Long-tail vaak weken. Koptermen maanden. Ik zeg vooraf wat realistisch is.",
    },
  ],
  ctaTitle: "SEO zonder rapportenla?",
  ctaBody: "Vertel je markt. Ik schets welke pagina's het verschil maken.",
  relatedSlugs: ["seo-specialist", "hoger-in-google", "technische-seo"],
  pillarSlug: "vindbaarheid",
  pillarLabel: "Vindbaarheid",
});

export const EMAIL_MARKETING = buildNationalPage({
  slug: "email-marketing",
  primaryKeyword: "email marketing",
  category: "content",
  metaTitle: "Email marketing · flows die verkopen | Meneer Marketing",
  metaDescription:
    "Email marketing met Klaviyo en Shopify: welkom, abandoned cart, opvolging. Flows met plan en meetpunten.",
  keywords: [
    "email marketing",
    "email marketing bureau",
    "email marketing nederland",
    "email marketing specialist",
    "e-mail marketing",
  ],
  eyebrow: "Email marketing",
  headline: "Email marketing die niet",
  headlineAccent: "in de spam belandt.",
  subheadline:
    "Je lijst is goud als je hem goed gebruikt. Ik zet flows, segmenten en copy die verkopen. Vooral na de eerste aankoop.",
  pains: [
    {
      title: "Nieuwsbrief zonder doel",
      body: "Iedereen krijgt hetzelfde. Open rates dalen, niemand koopt.",
    },
    {
      title: "Flows ontbreken",
      body: "Cart abandoners horen nooit van je. Geld ligt te rotten.",
    },
    {
      title: "Los van ads",
      body: "Je betaalt voor traffic die je daarna niet opvolgt.",
    },
  ],
  deliverables: [
    { title: "Flow-architectuur", body: "Welkom, abandon, post-purchase." },
    { title: "Copy & design", body: "Jouw tone, geen template-praat." },
    { title: "Klaviyo / Shopify Mail", body: "Technisch goed ingericht." },
    { title: "Koppeling met ads", body: "Remarketing en lijsten die kloppen." },
  ],
  visual: "email-flow",
  visualCaption: "Email marketing = klanten die terugkomen.",
  processTitle: "Email marketing opzetten",
  proofTitle: "Mail vóór ads",
  proofBody:
    "Vóór het adsbudget omhoog ging, stonden mail en flows. Elke euro op ads werkte harder.",
  proofCase: "Flow-opbouw traject",
  hotTake:
    "Email marketing zonder abandoned cart flow is een winkel zonder iemand die terugbelt naar vergeten shoppers.",
  faq: [
    {
      question: "Klaviyo of Mailchimp?",
      answer: "Voor shops vaak Klaviyo. Ik kies op basis van je stack en volume.",
    },
    {
      question: "Hoeveel mails is te veel?",
      answer: "Hangt af van je product. Segmentatie beats frequentie.",
    },
  ],
  ctaTitle: "Mail die omzet oplevert?",
  ctaBody: "Vertel je shop of leads. Ik schets welke flows eerst.",
  relatedSlugs: ["e-mailmarketing", "klaviyo-specialist"],
  pillarSlug: "behoud",
  pillarLabel: "Behoud",
});

export const EMAILMARKETING_BUREAU = buildNationalPage({
  slug: "e-mailmarketing-bureau",
  primaryKeyword: "e-mailmarketing bureau",
  category: "content",
  metaTitle: "E-mailmarketing bureau · Klaviyo & flows | Meneer Marketing",
  metaDescription:
    "E-mailmarketing bureau voor webshops en MKB. Automatisering, segmenten en copy. Strategie vóór de verzendknop.",
  keywords: [
    "e-mailmarketing bureau",
    "emailmarketing bureau",
    "e-mail marketing bureau",
    "nieuwsbrief bureau",
    "mailmarketing bureau",
  ],
  eyebrow: "E-mailmarketing bureau",
  headline: "E-mailmarketing bureau voor",
  headlineAccent: "shops die willen groeien.",
  subheadline:
    "Nieuwsbrieven zijn leuk. Flows zijn geld. Ik bouw e-mailmarketing die aansluit op je site, ads en klantreis.",
  pains: [
    {
      title: "Alles in één lijst",
      body: "Kopers en lurkers krijgen dezelfde mail. Irritatie of irrelevantie.",
    },
    {
      title: "Design zonder strategie",
      body: "Mooie template. CTA onduidelijk.",
    },
    {
      title: "Shop losgekoppeld",
      body: "Productdata klopt niet. Aanbevelingen tonen rommel.",
    },
  ],
  deliverables: [
    { title: "Strategie & segmenten", body: "Wie krijgt wat, wanneer." },
    { title: "Flow-bouw", body: "Technisch en inhoudelijk." },
    { title: "Nieuwsbrief-ritme", body: "Als het past bij je merk." },
    { title: "Rapportage", body: "Omzet per flow, niet alleen opens." },
  ],
  visual: "email-flow",
  visualCaption: "E-mailmarketing bureau = retentie op autopilot.",
  processTitle: "E-mailmarketing bureau aanpak",
  proofTitle: "Shop + mail samen",
  proofBody:
    "Mail gekoppeld aan shop en B2B-portaal. Eén stack, één verhaal.",
  proofCase: "Shop + mail traject",
  hotTake:
    "Een e-mailmarketing bureau dat geen Shopify kan koppelen, stuurt je mooie nieuwsbrieven naar een lege winkelwagen.",
  faq: [
    {
      question: "Alleen voor webshops?",
      answer: "Nee. Ook B2B met lead-nurturing. Shop is wel mijn sweet spot.",
    },
    {
      question: "Schrijf je de mails?",
      answer: "Ja. Jij levert input, ik maak het scherp en on-brand.",
    },
  ],
  ctaTitle: "E-mailmarketing die rendeert?",
  ctaBody: "Vertel je situatie. Ik zeg wat eerst moet.",
  relatedSlugs: ["e-mailmarketing", "klaviyo-specialist"],
  pillarSlug: "behoud",
  pillarLabel: "Behoud",
});

export const WEBSITE_LATEN_ONTWERPEN = buildNationalPage({
  slug: "website-laten-ontwerpen",
  primaryKeyword: "website laten ontwerpen",
  category: "website",
  metaTitle: "Website laten ontwerpen · design dat converteert | Meneer Marketing",
  metaDescription:
    "Website laten ontwerpen en bouwen from scratch. UI/UX, conversie en merk. Design dat live gaat in code.",
  keywords: [
    "website laten ontwerpen",
    "website ontwerp laten maken",
    "website design laten maken",
    "professioneel website ontwerp",
    "website laten designen",
  ],
  eyebrow: "Website ontwerp",
  headline: "Website laten ontwerpen zonder",
  headlineAccent: "Figma die nooit live komt.",
  subheadline:
    "Ontwerp is geen plaatje. Het is structuur, vertrouwen en een pad naar actie. Ik ontwerp én bouw, zodat het ook echt online staat.",
  pains: [
    {
      title: "Mockup dat nooit live komt",
      body: "Het ontwerp verdwijnt in een map. De live site ziet er anders uit.",
    },
    {
      title: "Design zonder conversie",
      body: "Award in je hoofd. CTA ontbreekt.",
    },
    {
      title: "Template met logo erop",
      body: "Iedereen herkent het thema. Niemand onthoudt jou.",
    },
  ],
  deliverables: [
    { title: "UX & structuur", body: "Wireframe en flow vóór pixels." },
    { title: "Visueel ontwerp", body: "Passend bij merk en doelgroep." },
    { title: "Bouwen in code", body: "Custom build die meegroeit met je merk." },
    { title: "SEO & snelheid", body: "Mooi én Lighthouse-groen." },
  ],
  visual: "website-build",
  visualCaption: "Ontwerp dat live staat en verkoopt.",
  processTitle: "Van ontwerp naar live",
  proofTitle: "Design + code",
  proofBody:
    "Ik teken niet alleen. Ik bouw. Daardoor geen miscommunicatie tussen 'designer' en 'bouwer'.",
  hotTake:
    "Website laten ontwerpen door iemand die niet kan bouwen is een tekening van een huis zonder fundering.",
  faq: [
    {
      question: "Kun je alleen ontwerp?",
      answer: "Liever niet. Ontwerp zonder bouw mist de realiteit van snelheid en SEO.",
    },
    {
      question: "Heb ik een huisstijl nodig?",
      answer: "Helpt. Nog geen stijl? Dan bouw ik die mee op.",
    },
  ],
  ctaTitle: "Ontwerp dat ook live komt?",
  ctaBody: "Vertel je merk en doel. Ik schets de aanpak.",
  relatedSlugs: ["website-laten-maken"],
  pillarSlug: "bouwen",
  pillarLabel: "Bouwen",
});

export const INTERNETMARKETING_BUREAU = buildNationalPage({
  slug: "internetmarketing-bureau",
  primaryKeyword: "internetmarketing bureau",
  category: "seo",
  metaTitle: "Internetmarketing bureau · online groei from scratch | Meneer Marketing",
  metaDescription:
    "Internetmarketing bureau voor ondernemers die één aanspreekpunt willen. Site, SEO, ads en e-mail onder één dak.",
  keywords: [
    "internetmarketing bureau",
    "internet marketing bureau",
    "internetmarketing nederland",
    "internet marketing specialist",
  ],
  eyebrow: "Internetmarketing",
  headline: "Internetmarketing bureau zonder",
  headlineAccent: "jargon-bingo.",
  subheadline:
    "Internetmarketing is geen mysterie. Site die werkt, vindbaarheid, campagnes als het past, mail die volgt. Ik regel de lijn.",
  pains: [
    {
      title: "Buzzwords zonder resultaat",
      body: "Growth hacking, funnel, synergy. Lege inbox.",
    },
    {
      title: "Project zonder eigenaar",
      body: "Iedere maand een ander gezicht op de call.",
    },
    {
      title: "Budget zonder plan",
      body: "Geld naar ads terwijl de basis kraakt.",
    },
  ],
  deliverables: [
    { title: "Internetstrategie", body: "Kanalen en volgorde." },
    { title: "Website of shop", body: "Custom gebouwd." },
    { title: "Vindbaarheid", body: "Google en AI-antwoorden." },
    { title: "Campagnes & mail", body: "Acquisitie en retentie." },
  ],
  visual: "strategy-stack",
  visualCaption: "Internetmarketing die je kunt uitleggen aan je moeder.",
  processTitle: "Internetmarketing aanpak",
  proofTitle: "Eén lijn online",
  proofBody:
    "Verschillende markten, zelfde aanpak. Eerst fundament, dan schalen.",
  hotTake:
    "Een internetmarketing bureau dat vijf tools verkoopt maar geen pagina kan fixen, is een abonnementenverkoper.",
  faq: [
    {
      question: "Is dit hetzelfde als online marketing?",
      answer: "Voor jouw zoekopdracht wel. Ik pak site, SEO, ads en mail integraal aan.",
    },
  ],
  ctaTitle: "Internetmarketing die klopt?",
  ctaBody: "Vertel je doel. Ik zeg wat eerst slim is.",
  relatedSlugs: ["online-marketing-bureau"],
  pillarSlug: "strategie",
  pillarLabel: "Strategie",
});

export const ONLINE_MARKETING_SPECIALIST = buildNationalPage({
  slug: "online-marketing-specialist",
  primaryKeyword: "online marketing specialist",
  category: "seo",
  metaTitle: "Online marketing specialist · hands-on groei | Meneer Marketing",
  metaDescription:
    "Online marketing specialist met 12+ jaar ervaring. Strategie, SEO, Google Ads, Meta Ads en bouw. Direct contact.",
  keywords: [
    "online marketing specialist",
    "online marketing specialist inhuren",
    "specialist online marketing",
    "online marketeer inhuren",
  ],
  eyebrow: "Online marketing specialist",
  headline: "Online marketing specialist die",
  headlineAccent: "zelf uitvoert.",
  subheadline:
    "Specialist én uitvoerder. Ik bouw je site, fix je SEO, zet ads aan en mail flows live. Jij praat met mij.",
  pains: [
    {
      title: "Specialist zonder tools",
      body: "Advies over kanalen die hij zelf niet bedient.",
    },
    {
      title: "Uurtarief zonder output",
      body: "Veel meetings. Weinig live pagina's.",
    },
    {
      title: "Techniek blijft liggen",
      body: "Marketingplan op een trage site. Dubbel betalen.",
    },
  ],
  deliverables: [
    { title: "Channel-mix", body: "SEO, ads, mail: wat wanneer." },
    { title: "Uitvoering", body: "Ik doe het zelf of stuur strak aan." },
    { title: "Rapportage", body: "Omzet en leads, geen vanity metrics." },
    { title: "Bouw waar nodig", body: "Landings en fixes in code." },
  ],
  visual: "google-ads",
  visualCaption: "Specialist = strategie plus handen.",
  processTitle: "Werkwijze specialist",
  proofTitle: "12 jaar hands-on",
  proofBody:
    "Ik ben de specialist én de uitvoerder. Zelfde handen van intake tot live.",
  hotTake:
    "Een online marketing specialist die 'alleen strategie' doet, is een GPS zonder auto.",
  faq: [
    {
      question: "Freelancer of bureau?",
      answer: "Eén persoon, bureau-breed vak. Strategie én uitvoering in de praktijk.",
    },
    {
      question: "Op locatie mogelijk?",
      answer: "Apeldoorn thuisbasis. Verder Nederland, veel online.",
    },
  ],
  ctaTitle: "Specialist zonder tussenlaag?",
  ctaBody: "Vertel je situatie. Eerlijk antwoord of ik pas.",
  relatedSlugs: ["online-marketing-manager", "online-marketing-bureau", "seo-specialist"],
  pillarSlug: "strategie",
  pillarLabel: "Strategie",
});

export const WEBSITE_ONTWIKKELAAR = buildNationalPage({
  slug: "website-ontwikkelaar",
  primaryKeyword: "website ontwikkelaar",
  category: "website",
  metaTitle: "Website ontwikkelaar · Next.js & Shopify custom | Meneer Marketing",
  metaDescription:
    "Website ontwikkelaar for hire: snelle sites, shops en portalen. Custom build. SEO en conversie ingebouwd.",
  keywords: [
    "website ontwikkelaar",
    "website ontwikkelaar inhuren",
    "webdeveloper inhuren",
    "website developer nederland",
    "freelance website ontwikkelaar",
  ],
  eyebrow: "Website ontwikkelaar",
  headline: "Website ontwikkelaar die ook",
  headlineAccent: "je marketing snapt.",
  subheadline:
    "Ik schrijf code die Google leuk vindt en bezoekers overtuigt. Next.js, Shopify, API-koppelingen. Betrokken na launch.",
  pains: [
    {
      title: "Developer zonder SEO-bril",
      body: "Site werkt. Google vindt niks.",
    },
    {
      title: "Stack die niet schaalt",
      body: "Page builder of plugin-zoo. Omvallen bij groei.",
    },
    {
      title: "Overdracht onduidelijk",
      body: "Alles zit in het hoofd van één freelancer die gestopt is.",
    },
  ],
  deliverables: [
    { title: "Frontend & backend", body: "Modern stack, onderhoudbaar." },
    { title: "Performance", body: "Core Web Vitals als uitgangspunt." },
    { title: "Integraties", body: "CRM, shop, mail, tracking." },
    { title: "Documentatie", body: "Jij bent niet gevangen." },
  ],
  visual: "website-build",
  visualCaption: "Ontwikkelaar die ook aan marketing denkt.",
  processTitle: "Development traject",
  proofTitle: "Custom in productie",
  proofBody:
    "Portalen, marketing sites en shops in productie. Live projecten met echte omzet.",
  hotTake:
    "Een website ontwikkelaar die SEO 'niet zijn vak' vindt, levert je een raceauto zonder wielen.",
  faq: [
    {
      question: "WordPress?",
      answer: "Nee voor nieuwe projecten. Migratie vanaf WordPress kan wel.",
    },
    {
      question: "Onderhoud na launch?",
      answer: "Kan. Of overdracht als je eigen team het pakt.",
    },
  ],
  ctaTitle: "Developer die blijft leveren?",
  ctaBody: "Vertel je project. Scope en planning daarna.",
  relatedSlugs: ["nextjs-website-laten-maken", "website-laten-maken", "shopify-expert"],
  pillarSlug: "bouwen",
  pillarLabel: "Bouwen",
});

export const SOCIAL_MEDIA_MARKETING_BUREAU = buildNationalPage({
  slug: "social-media-marketing-bureau",
  primaryKeyword: "social media marketing bureau",
  category: "google-ads",
  metaTitle: "Social media marketing bureau · organisch + betaald | Meneer Marketing",
  metaDescription:
    "Social media marketing bureau voor Instagram, LinkedIn en TikTok. Content, ads en creators met meetplan.",
  keywords: [
    "social media marketing bureau",
    "social media bureau",
    "social media marketing nederland",
    "bureau social media",
  ],
  eyebrow: "Social media marketing",
  headline: "Social media marketing bureau dat",
  headlineAccent: "omzet telt, niet likes.",
  subheadline:
    "Volgers zijn leuk. Omzet is beter. Ik combineer organische content, paid social en UGC waar het rendeert.",
  pains: [
    {
      title: "Posts zonder strategie",
      body: "Iedere week iets. Niemand koopt.",
    },
    {
      title: "Alleen organic",
      body: "Algoritme wisselt. Bereik daalt. Paniek.",
    },
    {
      title: "Ads zonder creative",
      body: "Stock video. Duurste manier om niemand te overtuigen.",
    },
  ],
  deliverables: [
    { title: "Content-plan", body: "Wat, waar, waarom." },
    { title: "Meta & TikTok ads", body: "Betaald waar het past." },
    { title: "UGC & creators", body: "Echte gezichten." },
    { title: "Koppeling site", body: "Landings die matchen." },
  ],
  visual: "meta-ads",
  visualCaption: "Social die verkoopt, niet alleen vermaakt.",
  processTitle: "Social media aanpak",
  proofTitle: "Creators + conversie",
  proofBody:
    "UGC en social ads werken als landings kloppen. Ik bouw die landings zelf.",
  hotTake:
    "Een social media marketing bureau dat geen landingspagina wil aanraken, optimaliseert voor applause, niet voor checkout.",
  faq: [
    {
      question: "Doe je ook LinkedIn?",
      answer: "Ja, vooral B2B. Content en LinkedIn Ads.",
    },
    {
      question: "Moet ik zelf posten?",
      answer: "Kan ik overnemen, of doen we het samen. Ritme is belangrijker dan perfectie.",
    },
  ],
  ctaTitle: "Social met rendement?",
  ctaBody: "Vertel je merk en doelgroep. Ik schets kanalen.",
  relatedSlugs: ["social-media-advertising", "meta-ads-bureau", "ugc-marketing"],
  pillarSlug: "campagnes",
  pillarLabel: "Campagnes",
});

export const WEBDESIGN_SPECIALIST = buildNationalPage({
  slug: "webdesign-specialist",
  primaryKeyword: "webdesign specialist",
  category: "website",
  metaTitle: "Webdesign specialist · UI die converteert | Meneer Marketing",
  metaDescription:
    "Webdesign specialist voor conversiegerichte sites. Custom design én development. From scratch voor jouw merk.",
  keywords: [
    "webdesign specialist",
    "webdesign specialist inhuren",
    "specialist webdesign",
    "website design specialist",
  ],
  eyebrow: "Webdesign specialist",
  headline: "Webdesign specialist met",
  headlineAccent: "code in de achterzak.",
  subheadline:
    "Webdesign is meer dan mooi. Het is hiërarchie, vertrouwen en een duidelijke volgende stap. Ik ontwerp en bouw het zelf.",
  pains: [
    {
      title: "Design dat niet gebouwd wordt",
      body: "Pixel-perfect Figma. Live site is compromis.",
    },
    {
      title: "Trendjagen",
      body: "Gradients en animaties. Boodschap ontbreekt.",
    },
    {
      title: "Mobiel als afterthought",
      body: "70% van je verkeer krijgt de slechte versie.",
    },
  ],
  deliverables: [
    { title: "UI/UX design", body: "Wireframes tot visueel systeem." },
    { title: "Conversie-focus", body: "CTA's, trust, scanbaarheid." },
    { title: "Development", body: "Design wordt echte site." },
    { title: "Motion subtiel", body: "Premium zonder circus." },
  ],
  visual: "website-build",
  visualCaption: "Webdesign dat live staat en verkoopt.",
  processTitle: "Webdesign traject",
  proofTitle: "Design + build",
  proofBody:
    "Meneer Marketing sites en klantprojecten: strak design, geen template-look.",
  hotTake:
    "Een webdesign specialist die niet kan deployen, levert een poster terwijl je een verkoper nodig hebt.",
  faq: [
    {
      question: "Verschil met webdesign bureau?",
      answer: "Zelfde zoekintentie. Ik ben specialist én bouwer in één.",
    },
  ],
  ctaTitle: "Webdesign dat live komt?",
  ctaBody: "Vertel je merk. Ik schets design en aanpak.",
  relatedSlugs: ["website-laten-maken"],
  pillarSlug: "bouwen",
  pillarLabel: "Bouwen",
});

export const NATIONAL_BATCH5_PAGES = [
  MARKETING_BUREAU,
  WEBSITE_SPECIALIST,
  SEO_BUREAU,
  EMAIL_MARKETING,
  EMAILMARKETING_BUREAU,
  WEBSITE_LATEN_ONTWERPEN,
  INTERNETMARKETING_BUREAU,
  ONLINE_MARKETING_SPECIALIST,
  WEBSITE_ONTWIKKELAAR,
  SOCIAL_MEDIA_MARKETING_BUREAU,
  WEBDESIGN_SPECIALIST,
] as const;
