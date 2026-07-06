import type { SeoLandingPage } from "@/data/seo-landings/types";

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

export const CONVERSIE_OPTIMALISATIE: SeoLandingPage = {
  slug: "conversie-optimalisatie",
  primaryKeyword: "conversie optimalisatie",
  category: "website",
  metaTitle: "Conversie optimalisatie · meer omzet zonder meer ads | Meneer Marketing",
  metaDescription:
    "Conversie optimalisatie voor websites en webshops. Sneller, duidelijker, meer verkopen uit hetzelfde verkeer. Geen A/B-test circus zonder plan.",
  keywords: [
    "conversie optimalisatie",
    "cro specialist",
    "conversie optimalisatie website",
    "website conversie verbeteren",
  ],
  eyebrow: "Conversie",
  headline: "Conversie optimalisatie die",
  headlineAccent: "je ads niet nodig heeft om te winnen.",
  subheadline:
    "Meer budget in ads is de luie fix. Ik kijk waar bezoekers afhaken: snelheid, copy, vertrouwen, checkout. Zelfde verkeer, meer omzet.",
  pains: [
    {
      title: "Veel bezoekers, weinig actie",
      body: "Analytics zegt 10.000 sessies. Je inbox zegt iets anders.",
    },
    {
      title: "Checkout-drama",
      body: "Winkelwagen vol, betalen nooit. Meestal ligt het aan vertrouwen of irritatie, niet aan je product.",
    },
    {
      title: "Testen zonder hypothese",
      body: "Knop groen of rood? Leuk experiment. Geen strategie.",
    },
  ],
  deliverables: [
    {
      title: "Funnel-audit",
      body: "Waar lekt het? Van eerste klik tot betaling.",
    },
    {
      title: "Snelheid & UX",
      body: "Core Web Vitals, mobiel eerst. Traag = weg.",
    },
    {
      title: "Copy & structuur",
      body: "Duidelijke belofte, bewijs, één sterke CTA.",
    },
    {
      title: "Meten wat telt",
      body: "Events, heatmaps waar zinvol, beslissingen op data.",
    },
  ],
  visual: "website-build",
  visualCaption: "Conversie is geen magie. Het is een site die niet irriteert.",
  processTitle: "CRO zonder gokken",
  processSteps: [
    {
      title: "Baseline vastleggen",
      body: "Conversie, bounce, device-split. Weten waar je staat.",
    },
    {
      title: "Grootste lek eerst",
      body: "Niet tien micro-tests. Eén ding dat het meeste oplevert.",
    },
    {
      title: "Bouwen & live",
      body: "Ik pas aan in code. Geen maanden wachten op een plugin.",
    },
    {
      title: "Valideren",
      body: "Werkt het echt? Dan door. Zo niet: volgende hypothese.",
    },
  ],
  proofTitle: "BestRest & SkinComplete",
  proofBody:
    "Bij BestRest telt elke procent op een matras. Bij SkinComplete elke stap in het B2B-portaal. CRO is geen luxe, het is marge.",
  proofCase: "BestRest",
  hotTake: {
    label: "Heet take",
    body: "Conversie optimalisatie met alleen een heatmap-abonnement is een thermometer in een koude oven.",
  },
  faq: [
    {
      question: "Hoeveel meer conversie kan ik verwachten?",
      answer:
        "Hangt af van hoe lelijk het nu is. Soms 20%, soms verdubbeling. Eerst audit, dan eerlijk schatten.",
    },
    {
      question: "Doen jullie ook A/B-tests?",
      answer: "Ja, als er genoeg volume is. Anders fix ik de grote lekken eerst.",
    },
    {
      question: "Werkt dit samen met SEO?",
      answer: "Juist. Meer organisch verkeer zonder conversie is drukte, geen groei.",
    },
  ],
  ctaTitle: "Meer uit je verkeer halen?",
  ctaBody: "Stuur je URL. Ik noem de drie grootste lekken.",
  relatedSlugs: [
    "landing-page-laten-maken",
    "website-laten-maken",
    "google-ads-bureau",
    "webshop-laten-maken",
  ],
  pillarSlug: "bouwen",
  pillarLabel: "Bouwen",
};

export const LOKALE_SEO: SeoLandingPage = {
  slug: "lokale-seo",
  primaryKeyword: "lokale seo",
  category: "seo",
  metaTitle: "Lokale SEO · gevonden in je regio | Meneer Marketing",
  metaDescription:
    "Lokale SEO voor bedrijven in Brabant en heel NL. Google Maps, reviews, regio-pagina's. Gevonden worden als iemand zoekt met een plaatsnaam.",
  keywords: [
    "lokale seo",
    "lokale vindbaarheid",
    "google maps seo",
    "seo voor lokale bedrijven",
  ],
  eyebrow: "Lokale SEO",
  headline: "Lokale SEO zodat je buurman",
  headlineAccent: "jou vindt, niet alleen je concurrent.",
  subheadline:
    "Iemand zoekt 'loodgieter Eindhoven' of 'marketingbureau Someren'. Sta jij in de map pack? Lokale SEO is geen trucje, het is structuur + autoriteit in je regio.",
  pains: [
    {
      title: "Onzichtbaar op Maps",
      body: "Je profiel bestaat. Google negeert je alsof je gesloten bent.",
    },
    {
      title: "Concurrent met 200 reviews",
      body: "Jij hebt er vier. Guess who wint.",
    },
    {
      title: "Geen regio-pagina's",
      body: "Je site praat alleen nationaal. Google weet niet waar je zit.",
    },
  ],
  deliverables: [
    {
      title: "Google Business Profile",
      body: "Compleet, consistent, actief. Geen spookprofiel.",
    },
    {
      title: "Lokale landings",
      body: "Regio-pagina's die ranken zonder keyword-spam.",
    },
    {
      title: "Reviews & reputatie",
      body: "Strategie om echte reviews te verzamelen.",
    },
    {
      title: "NAP & schema",
      body: "Naam, adres, telefoon overal hetzelfde. Machines snappen het.",
    },
  ],
  visual: "seo-serp",
  visualCaption: "Zo ziet het eruit als je wél in de buurt staat.",
  processTitle: "Lokaal zichtbaar worden",
  processSteps: processDefault,
  proofTitle: "Brabant & verder",
  proofBody:
    "Ik werk vanuit de regio en bouw ook landelijke SEO. Lokale vindbaarheid is vaak de snelste winst voor een MKB-bedrijf.",
  hotTake: {
    label: "Heet take",
    body: "Lokale SEO met alleen je adres in de footer is alsof je een uithangbord in de kelder hangt.",
  },
  faq: [
    {
      question: "Werken jullie alleen in Brabant?",
      answer: "Nee. Strategie werkt overal. Ik ken de regio goed, maar pak ook landelijke klanten.",
    },
    {
      question: "Hoe snel in Maps?",
      answer: "Profiel en basis vaak binnen weken merkbaar. Rankings kosten langer, afhankelijk van concurrentie.",
    },
    {
      question: "Kopen jullie nep-reviews?",
      answer: "Nee. Dat is dom en gevaarlijk. Echte klanten, echte reviews.",
    },
  ],
  ctaTitle: "Lokaal bovenaan?",
  ctaBody: "Vertel je stad en dienst. Ik check je profiel en site.",
  relatedSlugs: ["hoger-in-google", "seo-specialist", "google-ads-bureau"],
  pillarSlug: "vindbaarheid",
  pillarLabel: "Vindbaarheid",
};

export const ZOEKMACHINE_OPTIMALISATIE: SeoLandingPage = {
  slug: "zoekmachine-optimalisatie",
  primaryKeyword: "zoekmachine optimalisatie",
  category: "seo",
  metaTitle: "Zoekmachine optimalisatie · SEO die rankt | Meneer Marketing",
  metaDescription:
    "Zoekmachine optimalisatie from scratch: techniek, content en autoriteit. Hoger in Google zonder trucjes die volgende maand crashen.",
  keywords: [
    "zoekmachine optimalisatie",
    "zoekmachine optimalisatie uitbesteden",
    "seo uitbesteden",
    "zoekmachine marketing",
  ],
  eyebrow: "Zoekmachine optimalisatie",
  headline: "Zoekmachine optimalisatie",
  headlineAccent: "zonder trucjes uit 2012.",
  subheadline:
    "Google is geen loterij. Goede zoekmachine optimalisatie is een snelle site, pagina's die antwoord geven en links die ertoe doen. Ik bouw dat, ik verkoop geen maandelijkse 'rapportage'.",
  pains: [
    {
      title: "Positie 11-syndroom",
      body: "Bijna op pagina één. Net niet. Frustrerend en duur als je wél ads draait.",
    },
    {
      title: "Content-zoo",
      body: "50 blogs niemand leest. Google ook niet.",
    },
    {
      title: "Technische rotzooi",
      body: "Duplicate content, trage pages, kapotte redirects.",
    },
  ],
  deliverables: [
    {
      title: "Technische basis",
      body: "Indexatie, snelheid, schema, interne links.",
    },
    {
      title: "Content met intentie",
      body: "Pagina's voor zoekwoorden die klanten opleveren.",
    },
    {
      title: "Autoriteit",
      body: "Echte vermeldingen, geen link-farmen.",
    },
    {
      title: "AI-vindbaarheid",
      body: "Ook ChatGPT en Gemini meenemen.",
    },
  ],
  visual: "seo-serp",
  processTitle: "SEO die blijft staan",
  processSteps: processDefault,
  proofTitle: "SkinComplete eerst organisch",
  proofBody:
    "SkinComplete domineerde eerst SEO, daarna pas ads. Die volgorde is zoekmachine optimalisatie die zichzelf terugbetaalt.",
  proofCase: "SkinComplete",
  hotTake: {
    label: "Heet take",
    body: "Zoekmachine optimalisatie uitbesteden aan iemand die je site niet kan lezen in de broncode is een dure gok.",
  },
  faq: [
    {
      question: "Verschil met een SEO-specialist?",
      answer: "Zelfde vak, andere zoekterm. Ik pak beide.",
    },
    {
      question: "Hoe lang duurt het?",
      answer: "Eerste beweging vaak 6-12 weken. Echt domineren kan maanden duren.",
    },
    {
      question: "Garantie op pagina 1?",
      answer: "Nee. Wie dat belooft, liegt. Wel een plan en eerlijke verwachtingen.",
    },
  ],
  ctaTitle: "SEO die rankt?",
  ctaBody: "Stuur je domein. Ik scan de grootste kansen.",
  relatedSlugs: ["seo-specialist", "hoger-in-google", "technische-seo", "vindbaarheid-ai"],
  pillarSlug: "vindbaarheid",
  pillarLabel: "Vindbaarheid",
};

export const TECHNISCHE_SEO: SeoLandingPage = {
  slug: "technische-seo",
  primaryKeyword: "technische seo",
  category: "seo",
  metaTitle: "Technische SEO · indexatie, snelheid, schema | Meneer Marketing",
  metaDescription:
    "Technische SEO voor developers en marketeers. Crawlbaarheid, Core Web Vitals, structured data. De fundering onder elke ranking.",
  keywords: [
    "technische seo",
    "technische seo audit",
    "core web vitals seo",
    "structured data seo",
  ],
  eyebrow: "Technische SEO",
  headline: "Technische SEO.",
  headlineAccent: "Want content op een kapotte site rankt niet.",
  subheadline:
    "Je copy is briljant. Je site laadt 6 seconden en heeft 400 redirect-ketens. Technische SEO fixt wat je niet ziet in Word, maar Google wél ziet.",
  pains: [
    {
      title: "Niet geïndexeerd",
      body: "Pagina's bestaan. Google kent ze niet.",
    },
    {
      title: "CWV in het rood",
      body: "LCP, CLS, INP. Drie letters die je omzet kosten.",
    },
    {
      title: "Schema-chaos",
      body: "Geen structured data, of foutieve rich results.",
    },
  ],
  deliverables: [
    {
      title: "Technische audit",
      body: "Crawl, logs, indexatie, duplicates.",
    },
    {
      title: "Performance",
      body: "Snelheid in code, niet alleen met een plugin.",
    },
    {
      title: "Schema markup",
      body: "JSON-LD die klopt en rich results oplevert.",
    },
    {
      title: "Migratie-begeleiding",
      body: "Redirects, canonicals, geen verkeersdip na launch.",
    },
  ],
  visual: "website-build",
  visualCaption: "Techniek eerst. Content daarna. Anders bouw je op zand.",
  processTitle: "Technische SEO traject",
  processSteps: processDefault,
  proofTitle: "Custom builds",
  proofBody:
    "Ik bouw in Next.js en Shopify. Technische SEO zit in mijn code, niet in een checklist die ik uitbesteed.",
  hotTake: {
    label: "Heet take",
    body: "Technische SEO door een bureau dat alleen WordPress-plugins kent, is een timmerman met alleen een plakband.",
  },
  faq: [
    {
      question: "Alleen audits?",
      answer: "Nee. Ik fix het ook. In je theme of Next.js project.",
    },
    {
      question: "Shopify of custom?",
      answer: "Beide. Andere stack, zelfde principes.",
    },
  ],
  ctaTitle: "Techniek checken?",
  ctaBody: "Stuur je URL. Ik noem de blockers.",
  relatedSlugs: ["hoger-in-google", "zoekmachine-optimalisatie", "website-laten-maken"],
  pillarSlug: "vindbaarheid",
  pillarLabel: "Vindbaarheid",
};

export const PPC_BUREAU: SeoLandingPage = {
  slug: "ppc-bureau",
  primaryKeyword: "ppc bureau",
  category: "google-ads",
  metaTitle: "PPC bureau · betaald verkeer met rendement | Meneer Marketing",
  metaDescription:
    "PPC bureau voor Google Ads en Meta. Pay-per-click met marge in het hoofd. Landingspagina's en tracking inbegrepen.",
  keywords: ["ppc bureau", "ppc specialist", "pay per click bureau", "ppc campagnes"],
  eyebrow: "PPC",
  headline: "PPC bureau dat weet",
  headlineAccent: "waar elke klik vandaan komt.",
  subheadline:
    "Pay-per-click klinkt simpel: betaal per klik, klaar. Tot je merkt dat de helft van je klikken gratiszoekers en je moeder zijn. Ik stuur PPC op intentie en marge.",
  pains: [
    {
      title: "CPC omhoog, omzet niet",
      body: "Duurdere kliks, zelfde conversie. Iemand moet dat uitleggen.",
    },
    {
      title: "Geen attributie",
      body: "Wat leverde welke campagne op? Gokken met het maandbudget.",
    },
    {
      title: "Landings die liegen",
      body: "Ad belooft korting. Pagina toont iets anders. PPC verbrandt.",
    },
  ],
  deliverables: [
    {
      title: "Google & Meta PPC",
      body: "Search, Shopping, social. Onder één strategie.",
    },
    {
      title: "Negatieve zoekwoorden",
      body: "Stop met betalen voor afval.",
    },
    {
      title: "Landings bouwen",
      body: "Message match. Geen doorverwijzen.",
    },
    {
      title: "ROAS/CPA dashboards",
      body: "Weten wat werkt. Budget verschuiven.",
    },
  ],
  visual: "google-ads",
  processTitle: "PPC met controle",
  processSteps: processDefault,
  proofTitle: "Ads na SEO",
  proofBody: "PPC werkt het best als je site al converteert. SkinComplete deed het in die volgorde. Scheelt je een fortuin aan leergeld.",
  hotTake: {
    label: "Heet take",
    body: "Een PPC bureau dat alleen in het ads-dashboard leeft, is een piloot die nooit het vliegtuig inspecteert.",
  },
  faq: [
    {
      question: "Verschil met SEA specialist?",
      answer: "Zelfde wereld. PPC is de engelse term, SEA de Nederlandse. Ik spreek beide.",
    },
    {
      question: "Minimum budget?",
      answer: "Afhankelijk van markt. We rekenen breakeven door vóór opschalen.",
    },
  ],
  ctaTitle: "PPC onder controle?",
  ctaBody: "Vertel je huidige spend. Ik kijk eerlijk mee.",
  relatedSlugs: ["google-ads-bureau", "sea-specialist", "meta-ads-bureau"],
  pillarSlug: "campagnes",
  pillarLabel: "Campagnes",
};

export const E_COMMERCE_MARKETING: SeoLandingPage = {
  slug: "e-commerce-marketing",
  primaryKeyword: "e-commerce marketing",
  category: "shopify",
  metaTitle: "E-commerce marketing · shop, SEO & ads | Meneer Marketing",
  metaDescription:
    "E-commerce marketing from scratch: Shopify, SEO, Google Shopping, e-mail en automatisering. Eén plan voor je hele shop.",
  keywords: [
    "e-commerce marketing",
    "ecommerce marketing bureau",
    "online winkel marketing",
    "webshop marketing",
  ],
  eyebrow: "E-commerce",
  headline: "E-commerce marketing",
  headlineAccent: "zonder losse eilandjes.",
  subheadline:
    "Je shop draait. Maar organisch, Shopping, e-mail en social praten niet met elkaar. Ik ben je e-commerce marketing manager: strategie, bouw en campagnes in één lijn.",
  pains: [
    {
      title: "Alles los",
      body: "SEO-bureau hier, ads daar, shop door een neef. Chaos.",
    },
    {
      title: "Marge onzichtbaar",
      body: "Je weet niet welk product ads kan betalen en welk niet.",
    },
    {
      title: "Seizoensstress",
      body: "Black Friday zonder plan is paniek met budget.",
    },
  ],
  deliverables: [
    {
      title: "Shop + marketing",
      body: "Shopify custom, snel en schaalbaar.",
    },
    {
      title: "Organisch + Shopping",
      body: "Product-SEO en feeds die kloppen.",
    },
    {
      title: "E-mail & retentie",
      body: "Herhaalaankopen, niet alleen nieuwe klanten jagen.",
    },
    {
      title: "Automatisering",
      body: "Flows die orders en leads koppelen.",
    },
  ],
  visual: "webshop",
  visualCaption: "E-commerce is een systeem. Geen losse knoppen.",
  processTitle: "Shop die groeit",
  processSteps: processDefault,
  proofTitle: "SkinComplete & BestRest",
  proofBody:
    "Twee totaal verschillende shops. Zelfde aanpak: eerst fundament, dan schalen. E-commerce marketing is maatwerk, geen pakket.",
  hotTake: {
    label: "Heet take",
    body: "E-commerce marketing met alleen meer ads is benzine in een lekke tank.",
  },
  faq: [
    {
      question: "Alleen Shopify?",
      answer: "Voor shops voorkeur Shopify. Custom sites in Next.js.",
    },
    {
      question: "B2B webshops?",
      answer: "Ja. Portaal, prijzen, herbestellen. SkinComplete-niveau.",
    },
  ],
  ctaTitle: "Shop laten groeien?",
  ctaBody: "Vertel je omzet en doel. Ik schets de volgorde.",
  relatedSlugs: ["webshop-laten-maken", "shopify-expert", "google-shopping-ads"],
  pillarSlug: "strategie",
  pillarLabel: "Strategie",
};

export const EMAILMARKETING: SeoLandingPage = {
  slug: "e-mailmarketing",
  primaryKeyword: "e-mailmarketing",
  category: "content",
  metaTitle: "E-mailmarketing · flows die verkopen | Meneer Marketing",
  metaDescription:
    "E-mailmarketing voor webshops en leads. Welkomstflows, abandoned cart, nieuwsbrieven die niet in spam belanden. Gekoppeld aan je shop en ads.",
  keywords: [
    "e-mailmarketing",
    "email marketing bureau",
    "e-mailmarketing webshop",
    "marketing automation e-mail",
  ],
  eyebrow: "E-mailmarketing",
  headline: "E-mailmarketing die",
  headlineAccent: "niet in de spamfolder eindigt.",
  subheadline:
    "Je lijst is goud. Maar je mails zijn saai, te laat of illegaal zonder consent. Ik zet e-mailmarketing op die verkoopt en past bij je merk. Geen 'dear valued customer'-energie.",
  pains: [
    {
      title: "Lijst zonder plan",
      body: "5000 subscribers. Geen flow. Geen omzet.",
    },
    {
      title: "Winkelwagen-spook",
      body: "Ze vulden hun mand. Jij stuurde niks. Zonde.",
    },
    {
      title: "Nieuwsbrief = reclamefolder",
      body: "Niemand opent. Spamfilter knipoogt.",
    },
  ],
  deliverables: [
    {
      title: "Welkomst & onboarding",
      body: "Eerste indruk die vertrouwen bouwt.",
    },
    {
      title: "Abandoned cart",
      body: "Herinneringen die converteren, niet irriteren.",
    },
    {
      title: "Segmentatie",
      body: "Juiste mail naar juiste klant.",
    },
    {
      title: "Koppeling shop + CRM",
      body: "Orders, tags, automatisering.",
    },
  ],
  visual: "content-hub",
  processTitle: "E-mail die oplevert",
  processSteps: processDefault,
  proofTitle: "SkinComplete flows",
  proofBody:
    "Bij SkinComplete zit e-mailmarketing in het groeiplan. Niet als los project na drie jaar stilstand.",
  hotTake: {
    label: "Heet take",
    body: "E-mailmarketing met alleen een maandelijkse 'nieuwsbrief' is een ansichtkaart die niemand leest.",
  },
  faq: [
    {
      question: "Welke tools?",
      answer: "Klaviyo, Mailchimp, wat past bij je shop en budget.",
    },
    {
      question: "GDPR?",
      answer: "Consent en uitschrijven netjes. Geen shortcuts.",
    },
  ],
  ctaTitle: "E-mail laten werken?",
  ctaBody: "Vertel je shop of leadflow. Ik schets de flows.",
  relatedSlugs: ["marketing-automatisering", "e-commerce-marketing", "webshop-laten-maken"],
  pillarSlug: "behoud",
  pillarLabel: "Behoud",
};

export const TIKTOK_ADS_BUREAU: SeoLandingPage = {
  slug: "tiktok-ads-bureau",
  primaryKeyword: "tiktok ads bureau",
  category: "google-ads",
  metaTitle: "TikTok Ads bureau · UGC & short video | Meneer Marketing",
  metaDescription:
    "TikTok Ads bureau met creators en UGC. Short video die scrollt stopt. Gekoppeld aan landings en Meta waar het zinvol is.",
  keywords: ["tiktok ads bureau", "tiktok advertising", "tiktok marketing bureau", "ugc tiktok ads"],
  eyebrow: "TikTok Ads",
  headline: "TikTok Ads bureau dat",
  headlineAccent: "niet zoals TV reclame klinkt.",
  subheadline:
    "TikTok is geen billboard. Het is UGC, hooks en creators die je product laten zien alsof het geen ad is. Ik combineer TikTok Ads met landings die converteren.",
  pains: [
    {
      title: "Corporate video op TikTok",
      body: "Logo aan het begin. Swipe. Budget weg.",
    },
    {
      title: "Geen creators",
      body: "Je team filmt in kantoorlicht. Het algoritme lacht.",
    },
    {
      title: "Views zonder sales",
      body: "Viraal is leuk. Omzet is beter.",
    },
  ],
  deliverables: [
    {
      title: "UGC & creators",
      body: "Echte mensen, echte hooks.",
    },
    {
      title: "TikTok + Meta",
      body: "Short video hergebruiken waar het past.",
    },
    {
      title: "Landings voor mobile",
      body: "95% mobiel. Pagina moet mee.",
    },
    {
      title: "Testen op hooks",
      body: "Eerste 2 seconden bepalen alles.",
    },
  ],
  visual: "meta-ads",
  visualCaption: "TikTok werkt als het niet voelt als een ad.",
  processTitle: "TikTok die verkoopt",
  processSteps: processDefault,
  proofTitle: "Creators & conversie",
  proofBody: "UGC en short video zitten in mijn campagne-aanpak. Niet als trucje, als standaard.",
  hotTake: {
    label: "Heet take",
    body: "TikTok Ads met je CEO die in een pak een product vasthoudt is €0,03 per view en €0,00 per verkoop.",
  },
  faq: [
    {
      question: "Voor welke producten?",
      answer: "Consumer, lifestyle, e-commerce. B2B kan, maar vraagt andere aanpak.",
    },
    {
      question: "Doen jullie ook organische TikTok?",
      answer: "Focus op betaald + creators. Organisch kan als onderdeel van plan.",
    },
  ],
  ctaTitle: "TikTok proberen?",
  ctaBody: "Vertel je product. Ik zeg eerlijk of TikTok nu zinvol is.",
  relatedSlugs: ["meta-ads-bureau", "landing-page-laten-maken", "e-commerce-marketing"],
  pillarSlug: "campagnes",
  pillarLabel: "Campagnes",
};

export const LEADGENERATIE_WEBSITE: SeoLandingPage = {
  slug: "leadgeneratie-website",
  primaryKeyword: "leadgeneratie website",
  category: "website",
  metaTitle: "Leadgeneratie website · leads die converteren | Meneer Marketing",
  metaDescription:
    "Leadgeneratie website from scratch. Formulieren, landings, SEO en ads-klaar. Meer gekwalificeerde leads, minder junk in je inbox.",
  keywords: [
    "leadgeneratie website",
    "leads genereren website",
    "leadgeneratie online marketing",
    "b2b leadgeneratie",
  ],
  eyebrow: "Leadgeneratie",
  headline: "Leadgeneratie website",
  headlineAccent: "zonder junk leads.",
  subheadline:
    "Je wilt leads. Niet 'interesse' van iemand die alleen je whitepaper wil en nooit koopt. Ik bouw sites en landings die de juiste mensen aantrekken en filteren.",
  pains: [
    {
      title: "Formulier, geen follow-up",
      body: "Lead binnen. Niemand belt. Lead koud.",
    },
    {
      title: "Verkeerde leads",
      body: "Studenten, concurrenten, mensen zonder budget.",
    },
    {
      title: "Site zonder SEO",
      body: "Alleen ads. Duur als de kraan dichtgaat.",
    },
  ],
  deliverables: [
    {
      title: "Landings per dienst",
      body: "Eén propositie, één CTA. Duidelijk.",
    },
    {
      title: "SEO + ads",
      body: "Organisch en betaald op dezelfde pagina's.",
    },
    {
      title: "Kwalificatie",
      body: "Vragen die junk filteren.",
    },
    {
      title: "CRM-koppeling",
      body: "Lead direct waar je team hem ziet.",
    },
  ],
  visual: "website-build",
  processTitle: "Leads die tellen",
  processSteps: processDefault,
  proofTitle: "B2B en dienstverlening",
  proofBody:
    "Leadgeneratie werkt als site, copy en opvolging op één lijn zitten. Ik bouw dat plaatje.",
  hotTake: {
    label: "Heet take",
    body: "Leadgeneratie met een formulier onderaan je homepage is een visitekaartje in een windtunnel.",
  },
  faq: [
    {
      question: "B2B of B2C?",
      answer: "Beide. B2B vaker met kwalificatie en langere cycles.",
    },
    {
      question: "Alleen de site?",
      answer: "Nee. SEO, ads en automatisering horen er vaak bij.",
    },
  ],
  ctaTitle: "Betere leads?",
  ctaBody: "Vertel je dienst en ideale klant. Ik schets de site.",
  relatedSlugs: ["landing-page-laten-maken", "google-ads-bureau", "marketing-automatisering"],
  pillarSlug: "bouwen",
  pillarLabel: "Bouwen",
};

export const WOOCOMMERCE_NAAR_SHOPIFY: SeoLandingPage = {
  slug: "woocommerce-naar-shopify",
  primaryKeyword: "woocommerce naar shopify",
  category: "shopify",
  metaTitle: "WooCommerce naar Shopify · migratie zonder SEO-dip | Meneer Marketing",
  metaDescription:
    "WooCommerce naar Shopify migreren met redirects, SEO en custom theme. Geen template-migratie die je rankings sloopt.",
  keywords: [
    "woocommerce naar shopify",
    "wordpress webshop migratie shopify",
    "shopify migratie",
    "webshop migreren naar shopify",
  ],
  eyebrow: "Migratie",
  headline: "WooCommerce naar Shopify",
  headlineAccent: "zonder rankings te vermoorden.",
  subheadline:
    "WordPress webshop traag, plugin-hel en updates die alles breken? Shopify is vaak slimmer. Maar slordig migreren kost je Google-verkeer. Ik migreer met SEO, redirects en een shop die sneller verkoopt.",
  pains: [
    {
      title: "Plugin-spaghetti",
      body: "Elke functie een plugin. Site instabiel.",
    },
    {
      title: "Migratie = 404-drama",
      body: "URLs veranderen. Rankings weg. Omzet weg.",
    },
    {
      title: "Theme dat niet schaalt",
      body: "WooCommerce theme was oké. Groei niet.",
    },
  ],
  deliverables: [
    {
      title: "SEO-veilige migratie",
      body: "Redirects, canonicals, sitemap. Geen dip als het kan.",
    },
    {
      title: "Custom Shopify theme",
      body: "Niet alleen importeren. Verbeteren.",
    },
    {
      title: "Data & orders",
      body: "Producten, klanten, historie netjes over.",
    },
    {
      title: "Marketing aansluiten",
      body: "Shopping, e-mail, tracking direct goed.",
    },
  ],
  visual: "webshop",
  visualCaption: "Migratie is geen knop. Het is een project met een checklist.",
  processTitle: "Veilig overstappen",
  processSteps: processDefault,
  proofTitle: "Migratie-ervaring",
  proofBody:
    "WordPress promoten doe ik niet. Migreren naar custom of Shopify wel. Je verliest geen tijd aan plugins, je wint snelheid.",
  hotTake: {
    label: "Heet take",
    body: "WooCommerce naar Shopify migreren met een gratis import-app en geen redirect-plan is SEO-zelfmoord.",
  },
  faq: [
    {
      question: "Hoe lang duurt het?",
      answer: "Kleine shop: weken. Grote catalogus: langer. Altijd met testomgeving.",
    },
    {
      question: "Blijft mijn SEO?",
      answer: "Dat is het doel. Redirects en structuur zijn het halve werk.",
    },
  ],
  ctaTitle: "Migratie plannen?",
  ctaBody: "Vertel je huidige shop. Ik schets stappen en risico's.",
  relatedSlugs: ["shopify-expert", "webshop-laten-maken", "technische-seo"],
  pillarSlug: "bouwen",
  pillarLabel: "Bouwen",
};
