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
    body: "Ik bouw, schrijf en zet live. Alles onder één dak.",
  },
  {
    title: "Meten en bijsturen",
    body: "Cijfers beslissen. Sentiment niet.",
  },
] as const;

export { CONVERSIE_OPTIMALISATIE } from './conversie-optimalisatie';

export const LOKALE_SEO: SeoLandingPage = {
  slug: "lokale-seo",
  primaryKeyword: "lokale seo",
  category: "seo",
  metaTitle: "Lokale SEO · Maps, reviews en regio-pagina's | Meneer Marketing",
  metaDescription:
    "Lokale SEO voor MKB: Google Business Profile, reviews en regio-pagina's die ranken. Gevonden worden als iemand jouw dienst plus plaatsnaam zoekt.",
  keywords: [
    "lokale seo",
    "lokale vindbaarheid",
    "google maps seo",
    "seo voor lokale bedrijven",
  ],
  eyebrow: "Lokale SEO · map pack eerst",
  headline: "Lokale SEO zodat je buurman",
  headlineAccent: "jou vindt, niet alleen je concurrent.",
  subheadline:
    "Iemand zoekt je dienst plus stad. Sta jij in Maps met reviews en een pagina die klopt? Ik zet GBP, NAP en regio-landings strak, landelijk of lokaal.",
  pains: [
    {
      title: "Onzichtbaar in de map pack",
      body: "Je Google Business Profile bestaat, maar concurrenten pakken de top drie. Belletjes gaan naar hen. Jij blijft een naam op pagina twee.",
    },
    {
      title: "Concurrent met een reviewberg",
      body: "Zij hebben tientallen recente reviews. Jij hebt er vier uit 2021. Google en zoekers kiezen vertrouwen. Jij verliest voor het gesprek begint.",
    },
    {
      title: "Site zonder lokale ankers",
      body: "Je praat alleen landelijk. Regio-pagina ontbreekt, NAP rommelig, schema half. Google weet niet goed waar je zit en voor wie.",
    },
  ],
  deliverables: [
    {
      title: "Google Business Profile op orde",
      body: "Categorieën, diensten, foto's, uren, posts. Actief profiel, geen spookhuis dat alleen je adres toont.",
    },
    {
      title: "Lokale landings die ranken",
      body: "Regio- of stadsapagina's met echte inhoud. Dienst plus plaats, zonder keyword-spam of kopieer-plak per postcode.",
    },
    {
      title: "Reviews en reputatie",
      body: "Proces om echte reviews te vragen op het juiste moment. Echte reviews via systeempjes die blijven lopen.",
    },
    {
      title: "NAP en local schema",
      body: "Naam, adres, telefoon overal hetzelfde. Machines snappen je locatie. Mensen vinden je belknop zonder puzzelen.",
    },
  ],
  visual: "local-maps",
  visualCaption: "Zo ziet het eruit als je wél in de buurt staat.",
  processTitle: "Lokale SEO: van Maps tot regio-pagina",
  processSteps: [
    {
      title: "Profiel en NAP-scan",
      body: "GBP, vermeldingen, consistentie, categorieën. Ik zeg wat Google nu al snapt en wat je onzichtbaar houdt in de map pack.",
    },
    {
      title: "Map pack versterken",
      body: "Compleetheid, foto's, vragen, posts, reviewflow. Kleine signalen stapelen sneller dan alleen 'meer backlinks'.",
    },
    {
      title: "Lokale pagina's bouwen",
      body: "Landings per regio of kernstad die écht helpen. Interne links vanaf je sterke URL's. Unieke inhoud per stad, geen kopietjes.",
    },
    {
      title: "Meten en bijsturen",
      body: "Insights, queries, belletjes, richtingen. Maandelijks wat versterken en wat opschonen. Lokale SEO blijft bewegen.",
    },
  ],
  proofTitle: "Apeldoorn als thuisbasis, landelijk bereik",
  proofBody:
    "Ik werk vanuit Apeldoorn en help ook landelijke merken. Voor MKB is lokale vindbaarheid vaak de snelste winst: Maps, reviews en een pagina die je dienst plus stad serieus neemt. Zelfde zorg als bij landelijke SEO, andere intentie.",
  hotTake: {
    label: "Heet take",
    body: "Lokale SEO met alleen je adres in de footer is alsof je een uithangbord in de kelder hangt.",
  },
  faq: [
    {
      question: "Wat is lokale SEO precies?",
      answer:
        "Gevonden worden als iemand jouw dienst plus plaats zoekt, of 'bij mij in de buurt'. Dat speelt in Google Maps, de lokale pack en op je site. GBP, reviews, NAP en regio-pagina's horen bij elkaar.",
    },
    {
      question: "Werk je alleen in Brabant of Gelderland?",
      answer:
        "Nee. Strategie werkt overal in Nederland. Apeldoorn is thuisbasis. Ik pak lokale trajecten én landelijke merken. Belangrijk is jouw markt, niet alleen mijn postcode.",
    },
    {
      question: "Hoe snel sta ik hoger in Maps?",
      answer:
        "Profiel en basis zijn vaak binnen weken merkbaar. Stabiele rankings kosten langer, afhankelijk van concurrentie en reviews. Ik zeg vooraf wat realistisch is in jouw stad en branche.",
    },
    {
      question: "Koop je nep-reviews?",
      answer:
        "Nee. Dat is dom en riskant. Ik help met een flow om echte klanten op het juiste moment te vragen. Kwaliteit en recentheid tellen harder dan een gekochte berg.",
    },
    {
      question: "Heb ik regio-pagina's nodig?",
      answer:
        "Vaak wel als je meerdere steden bedient of als je site nu alleen nationaal praat. Elke pagina moet unieke hulp geven. Dunne kopieën per stad maken Google wantrouwig en mensen ook.",
    },
    {
      question: "Helpt lokale SEO ook als ik landelijk werk?",
      answer:
        "Ja, voor vestigingen, servicegebieden of merken met een fysieke anker. Soms combineer je lokale pack-wins met landelijke landings. Ik kies op waar je klanten zoeken.",
    },
    {
      question: "Wat heb je van mij nodig om te starten?",
      answer:
        "Toegang tot Google Business Profile, je adresgegevens, diensten en bij voorkeur Search Console. Daarna scan ik profiel en site en geef ik een concrete eerste release-lijst.",
    },
  ],
  ctaTitle: "Lokaal bovenaan?",
  ctaBody: "Vertel je stad en dienst. Ik check je profiel en site en zeg wat eerst moet.",
  relatedSlugs: ["hoger-in-google", "seo-specialist", "google-ads-bureau", "seo-specialist-apeldoorn"],
  pillarSlug: "vindbaarheid",
  pillarLabel: "Vindbaarheid",
  layoutProfile: "editorial",
  lockContent: true,
  enrichedOverrides: {
    story: {
      title: "Lokale SEO wint in de map pack, niet in een blog",
      paragraphs: [
        "Je zoekt lokale SEO omdat klanten 'dienst + stad' typen of op Maps kijken wie dichtbij is. Wie daar niet staat, bestaat praktisch niet. Een landelijke homepage alleen lost dat zelden op.",
        "Ik zet Google Business Profile, NAP, reviews en regio-pagina's in één plan. Zo snapt Google waar je zit, wat je doet, en waarom iemand jou zou kiezen boven de zaak drie straten verder.",
        "Reviews zijn vertrouwen én een ranking-signaal. Recent en echt wint van oud en gekocht. Ik help met het proces, niet met trucjes die je account kunnen kosten.",
        "Apeldoorn is thuisbasis. Ik ken lokale trajecten én landelijke builds op custom sites en shops. Dezelfde standaard: unieke pagina's, schone techniek, meetbare volgende stap.",
        "Wil je alleen je adres vetgedrukt in de footer? Dat is geen lokale SEO. Wil je belletjes en routeaanvragen uit je eigen regio? Dan bouw ik de signalen die Maps en zoekers serieus nemen.",
      ],
    },
    deepDive: {
      title: "GBP, reviews en regio-pagina's die samenwerken",
      paragraphs: [
        "Google Business Profile is je etalage. Categorieën, diensten, foto's, uren, berichten: incompleet voelt gesloten. Actief voelt open. Ik maak het compleet en houd het bewegend.",
        "NAP-consistentie klinkt saai en beslist mee. Verschillende adressen of telefoonnummers op site, directories en socials maken Google onzeker. Ik trek dat recht.",
        "Regio-pagina's verdienen unieke inhoud: wat je daar doet, voor wie, met bewijs en een duidelijke CTA. Keyword in de titel is niet genoeg. Hulp is genoeg.",
        "Interne links vanaf je sterke pagina's naar lokale URL's geven stem. Schema LocalBusiness of Organization helpt machines. Samen met GBP wordt het één verhaal.",
        "Maandelijks: Insights, queries, reviewtempo, pagina's die stijgen. Lokale SEO is geen eenmalige optimalisatie-knop. Het is onderhoud met richting, net als landelijke SEO.",
      ],
    },
    scenario: {
      title: "Stel: je concurrent pakt elke Maps-klik",
      paragraphs: [
        "Je zoekt je dienst in je stad en ziet hen in de top drie. Meer reviews, betere foto's, soms een sterkere lokale pagina. Jij hebt een profiel dat half leeg is en een site zonder stad.",
        "Ik zet hun signalen naast de jouwe: GBP, reviews, landings, NAP. Daarna drie acties die het hardst bewegen. Realistische inhaalrace, geen belofte van 'volgende week nummer 1'.",
        "Eerste weken: profiel en reviewflow. Daarna lokale pagina live. Zo bouw je inhalen op releases, niet op hoop.",
      ],
    },
  },
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
  proofTitle: "Organisch eerst",
  proofBody:
    "Eerst SEO en site, daarna pas ads. Die volgorde is zoekmachine optimalisatie die zichzelf terugbetaalt.",
  proofCase: "Organisch eerst",
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

export { TECHNISCHE_SEO } from './technische-seo';

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
      title: "Budget zonder inzicht",
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
      body: "Message match. Bezoekers landen op de juiste pagina.",
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
  proofBody: "PPC werkt het best als je site al converteert. Die volgorde bespaart je een fortuin aan leergeld.",
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
      answer: "Afhankelijk van markt. Ik reken breakeven door vóór opschalen.",
    },
  ],
  ctaTitle: "PPC onder controle?",
  ctaBody: "Vertel je huidige spend. Ik kijk eerlijk mee.",
  relatedSlugs: ["google-ads-bureau", "meta-ads-bureau"],
  pillarSlug: "campagnes",
  pillarLabel: "Campagnes",
};

export { E_COMMERCE_MARKETING } from './e-commerce-marketing';

export { EMAILMARKETING } from './e-mailmarketing';

export { TIKTOK_ADS_BUREAU } from './tiktok-ads-bureau';

export { LEADGENERATIE_WEBSITE } from './leadgeneratie-website';

export { WOOCOMMERCE_NAAR_SHOPIFY } from './woocommerce-naar-shopify';

