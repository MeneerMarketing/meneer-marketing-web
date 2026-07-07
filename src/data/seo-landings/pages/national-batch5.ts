import type {
  SeoLandingCategory,
  SeoLandingPage,
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
    body: "Ik bouw, schrijf en zet live. Geen doorverwijzen naar vijf partijen.",
  },
  {
    title: "Meten en bijsturen",
    body: "Cijfers beslissen. Sentiment niet.",
  },
] as const;

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
}

function buildNationalPage(config: NationalPageConfig): SeoLandingPage {
  return {
    ...config,
    processSteps: processDefault,
    hotTake: { label: "Heet take", body: config.hotTake },
  };
}

export const MARKETING_BUREAU = buildNationalPage({
  slug: "marketing-bureau",
  primaryKeyword: "marketing bureau",
  category: "seo",
  metaTitle: "Marketing bureau · strategie én uitvoering | Meneer Marketing",
  metaDescription:
    "Marketing bureau voor MKB: site, SEO, Google Ads, Meta Ads en e-mail. Eén plan, één aanspreekpunt. Geen ketting van freelancers.",
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
    "Veel bureaus schrijven slides. Ik bouw, rank, adverteer en mail. Jij praat met mij. Geen accountmanager die je shop nooit heeft gezien.",
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
      title: "Geen volgorde",
      body: "Budget naar ads terwijl je site nog niet converteert. Duur leerproces.",
    },
  ],
  deliverables: [
    { title: "Groeiplan", body: "Welk kanaal wanneer. Eerlijk over wat níet." },
    { title: "Bouwen & vindbaarheid", body: "From scratch site of shop plus SEO." },
    { title: "Campagnes", body: "Google Ads en Meta als de basis staat." },
    { title: "Behoud", body: "E-mail en flows zodat budget niet lekt." },
  ],
  visual: "content-hub",
  visualCaption: "Eén bureau. Geen spaghetti aan partijen.",
  processTitle: "Zo werk ik als marketing bureau",
  proofTitle: "SkinComplete & BestRest",
  proofBody:
    "Van shop en SEO tot ads en mail: ik ken het traject omdat ik het zo heb gebouwd. Geen theorie uit een template.",
  proofCase: "SkinComplete",
  hotTake:
    "Een marketing bureau dat niet kan bouwen is een PowerPoint-fabriek met een duur uurtarief.",
  faq: [
    {
      question: "Wat is het verschil met een online marketing bureau?",
      answer:
        "In de praktijk hetzelfde vak. Jij zoekt 'marketing bureau', ik lever site, SEO, ads en mail onder één dak.",
    },
    {
      question: "Werken jullie voor MKB?",
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
    "Website specialist die bouwt, optimaliseert en meet. Custom Next.js en Shopify. Geen template-bouwer die na oplevering verdwijnt.",
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
      title: "Geen meetplan",
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
      question: "Bouwen jullie ook webshops?",
      answer: "Ja, vooral Shopify custom. B2B-portaal kan ook.",
    },
    {
      question: "Kunnen jullie een bestaande site verbeteren?",
      answer: "Ja. Audit eerst: snelheid, SEO, conversie. Dan pas bouwen of fixen.",
    },
  ],
  ctaTitle: "Site die een specialist waardig is?",
  ctaBody: "Vertel je doel. Ik zeg eerlijk wat het kost en wat eerst moet.",
  relatedSlugs: ["website-laten-maken", "webdesign-bureau", "hoger-in-google"],
  pillarSlug: "bouwen",
  pillarLabel: "Bouwen",
});

export const SEO_BUREAU = buildNationalPage({
  slug: "seo-bureau",
  primaryKeyword: "seo bureau",
  category: "seo",
  metaTitle: "SEO bureau · rankings én pagina's die verkopen | Meneer Marketing",
  metaDescription:
    "SEO bureau dat landingspagina's bouwt, techniek fixt en content schrijft. Geen maandrapport zonder uitvoering. 12+ jaar Google.",
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
    "SkinComplete rankte op salonvragen voordat ads gingen draaien. Dat is hoe een SEO bureau waarde moet leveren.",
  proofCase: "SkinComplete",
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
    "Email marketing met Klaviyo en Shopify: welkom, abandoned cart, opvolging. Geen nieuwsbrief om de week zonder plan.",
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
      title: "Geen flows",
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
  visual: "content-hub",
  visualCaption: "Email marketing = klanten die terugkomen.",
  processTitle: "Email marketing opzetten",
  proofTitle: "SkinComplete mail",
  proofBody:
    "Vóór het adsbudget omhoog ging, stonden mail en flows. Elke euro op ads werkte harder.",
  proofCase: "SkinComplete",
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
  relatedSlugs: ["e-mailmarketing", "klaviyo-specialist", "email-marketing"],
  pillarSlug: "behoud",
  pillarLabel: "Behoud",
});

export const EMAILMARKETING_BUREAU = buildNationalPage({
  slug: "e-mailmarketing-bureau",
  primaryKeyword: "e-mailmarketing bureau",
  category: "content",
  metaTitle: "E-mailmarketing bureau · Klaviyo & flows | Meneer Marketing",
  metaDescription:
    "E-mailmarketing bureau voor webshops en MKB. Automatisering, segmenten en copy. Geen batch-mail zonder strategie.",
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
      body: "Mooie template. Geen idee wat de CTA moet doen.",
    },
    {
      title: "Geen koppeling shop",
      body: "Productdata klopt niet. Aanbevelingen tonen rommel.",
    },
  ],
  deliverables: [
    { title: "Strategie & segmenten", body: "Wie krijgt wat, wanneer." },
    { title: "Flow-bouw", body: "Technisch en inhoudelijk." },
    { title: "Nieuwsbrief-ritme", body: "Als het past bij je merk." },
    { title: "Rapportage", body: "Omzet per flow, niet alleen opens." },
  ],
  visual: "content-hub",
  visualCaption: "E-mailmarketing bureau = retentie op autopilot.",
  processTitle: "E-mailmarketing bureau aanpak",
  proofTitle: "Shop + mail samen",
  proofBody:
    "Bij SkinComplete hing mail aan de shop en het B2B-portaal. Geen losse Mailchimp in een hoek.",
  proofCase: "SkinComplete",
  hotTake:
    "Een e-mailmarketing bureau dat geen Shopify kan koppelen, stuurt je mooie nieuwsbrieven naar een lege winkelwagen.",
  faq: [
    {
      question: "Alleen voor webshops?",
      answer: "Nee. Ook B2B met lead-nurturing. Shop is wel mijn sweet spot.",
    },
    {
      question: "Schrijven jullie de mails?",
      answer: "Ja. Jij levert input, ik maak het scherp en on-brand.",
    },
  ],
  ctaTitle: "E-mailmarketing die rendeert?",
  ctaBody: "Vertel je situatie. Ik zeg wat eerst moet.",
  relatedSlugs: ["email-marketing", "e-mailmarketing", "klaviyo-specialist"],
  pillarSlug: "behoud",
  pillarLabel: "Behoud",
});

export const WEBSITE_LATEN_ONTWERPEN = buildNationalPage({
  slug: "website-laten-ontwerpen",
  primaryKeyword: "website laten ontwerpen",
  category: "website",
  metaTitle: "Website laten ontwerpen · design dat converteert | Meneer Marketing",
  metaDescription:
    "Website laten ontwerpen en bouwen from scratch. UI/UX, conversie en merk. Geen Canva-export die als site wordt verkocht.",
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
      title: "Mooi mockup, geen developer",
      body: "Het ontwerp verdwijnt in een map. De live site ziet er anders uit.",
    },
    {
      title: "Design zonder conversie",
      body: "Award in je hoofd. Geen duidelijke CTA.",
    },
    {
      title: "Template met logo erop",
      body: "Iedereen herkent het thema. Niemand onthoudt jou.",
    },
  ],
  deliverables: [
    { title: "UX & structuur", body: "Wireframe en flow vóór pixels." },
    { title: "Visueel ontwerp", body: "Passend bij merk en doelgroep." },
    { title: "Bouwen in code", body: "Geen page builder die vastloopt." },
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
      question: "Kunnen jullie alleen ontwerp?",
      answer: "Liever niet. Ontwerp zonder bouw mist de realiteit van snelheid en SEO.",
    },
    {
      question: "Hebben jullie een huisstijl nodig?",
      answer: "Helpt. Geen stijl? Dan bouwen we die mee op.",
    },
  ],
  ctaTitle: "Ontwerp dat ook live komt?",
  ctaBody: "Vertel je merk en doel. Ik schets de aanpak.",
  relatedSlugs: ["webdesign-bureau", "website-laten-maken", "website-specialist"],
  pillarSlug: "bouwen",
  pillarLabel: "Bouwen",
});

export const INTERNETMARKETING_BUREAU = buildNationalPage({
  slug: "internetmarketing-bureau",
  primaryKeyword: "internetmarketing bureau",
  category: "seo",
  metaTitle: "Internetmarketing bureau · online groei from scratch | Meneer Marketing",
  metaDescription:
    "Internetmarketing bureau voor ondernemers die één aanspreekpunt willen. Site, SEO, ads en e-mail. Geen losse eilandjes.",
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
      title: "Geen eigenaar",
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
  visual: "content-hub",
  visualCaption: "Internetmarketing die je kunt uitleggen aan je moeder.",
  processTitle: "Internetmarketing aanpak",
  proofTitle: "Eén lijn online",
  proofBody:
    "BestRest en SkinComplete: verschillende markten, zelfde aanpak. Eerst fundament, dan schalen.",
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
  relatedSlugs: ["online-marketing-bureau", "marketing-bureau", "digital-marketing-bureau"],
  pillarSlug: "strategie",
  pillarLabel: "Strategie",
});

export const ONLINE_MARKETING_SPECIALIST = buildNationalPage({
  slug: "online-marketing-specialist",
  primaryKeyword: "online marketing specialist",
  category: "seo",
  metaTitle: "Online marketing specialist · hands-on groei | Meneer Marketing",
  metaDescription:
    "Online marketing specialist met 12+ jaar ervaring. Strategie, SEO, Google Ads, Meta Ads en bouw. Geen tussenlaag.",
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
    "Geen specialist die alleen decks maakt. Ik bouw je site, fix je SEO, zet ads aan en mail flows live. Jij praat met mij.",
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
      title: "Geen technische basis",
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
    "Ik ben de specialist én de uitvoerder. Geen doorverwijzing naar een stagiair na de intake.",
  hotTake:
    "Een online marketing specialist die 'alleen strategie' doet, is een GPS zonder auto.",
  faq: [
    {
      question: "Freelancer of bureau?",
      answer: "Eén persoon, bureau-breed vak. SkinComplete en BestRest als bewijs.",
    },
    {
      question: "Op locatie mogelijk?",
      answer: "Apeldoorn thuisbasis. Verder Nederland, veel online.",
    },
  ],
  ctaTitle: "Specialist zonder tussenlaag?",
  ctaBody: "Vertel je situatie. Eerlijk antwoord of ik pas.",
  relatedSlugs: ["online-marketing-manager", "marketing-bureau", "seo-specialist"],
  pillarSlug: "strategie",
  pillarLabel: "Strategie",
});

export const WEBSITE_ONTWIKKELAAR = buildNationalPage({
  slug: "website-ontwikkelaar",
  primaryKeyword: "website ontwikkelaar",
  category: "website",
  metaTitle: "Website ontwikkelaar · Next.js & Shopify custom | Meneer Marketing",
  metaDescription:
    "Website ontwikkelaar for hire: snelle sites, shops en portalen. Geen WordPress-template. SEO en conversie ingebouwd.",
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
    "Ik schrijf code die Google leuk vindt en bezoekers overtuigt. Next.js, Shopify, API-koppelingen. Geen bouwer die na launch verdwijnt.",
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
      title: "Geen overdracht",
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
    "Portalen, marketing sites en shops in productie. Geen tutorial-projecten.",
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
    "Social media marketing bureau voor Instagram, LinkedIn en TikTok. Content, ads en creators. Geen vanity likes zonder plan.",
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
      question: "Doen jullie ook LinkedIn?",
      answer: "Ja, vooral B2B. Content en LinkedIn Ads.",
    },
    {
      question: "Moet ik zelf posten?",
      answer: "Kan ik overnemen of we doen het samen. Ritme is belangrijker dan perfectie.",
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
    "Webdesign specialist voor conversiegerichte sites. Custom design én development. Geen template met jouw logo erop.",
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
      body: "Gradients en animaties. Geen boodschap.",
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
  relatedSlugs: ["webdesign-bureau", "website-laten-ontwerpen", "website-laten-maken"],
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
