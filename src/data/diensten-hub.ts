import type { PillarSlug } from "@/lib/navigation";

export type DienstenHubTheme = "light" | "dark" | "warm";

export interface DienstenHubPillar {
  slug: PillarSlug;
  anchor: string;
  eyebrow: string;
  title: string;
  titleAccent: string;
  body: string;
  hotTake: string;
  proof: string;
  pillarHref: string;
  pillarCta: string;
  accent: string;
  theme: DienstenHubTheme;
}

export const DIENSTEN_HUB_HERO = {
  eyebrow: "Wat ik voor je doe",
  title: "Vier bureaus in één groepschat? Doe ik niet.",
  subtitle:
    "Twaalf jaar site, shop, SEO en ads. Jij praat met mij. Geen stagiair die je dossier net heeft gezien, geen doorverbinding naar iemand die je shop nooit opende.",
  stats: [
    { label: "Ervaring", value: "12+ jaar" },
    { label: "Aanpak", value: "Zelf gedaan" },
    { label: "Thuisbasis", value: "Apeldoorn" },
  ],
} as const;

export const DIENSTEN_FIVE_SNAP = {
  eyebrow: "Snel overzicht",
  title: "Vijf blokken. Klap er één open.",
  quip: "Alle subdiensten eronder. Of scroll naar het hoofdstuk.",
  cards: [
    {
      slug: "strategie" as const,
      anchor: "hub-strategie",
      shortLabel: "Strategie",
      title: "Eerst weten waar je naartoe rijdt. Daarna pas gas.",
      quip: "Groeiplan, ads-strategie, CRO en tracking. Geen dik rapport in een la.",
      accent: "#FF5722",
    },
    {
      slug: "bouwen" as const,
      anchor: "hub-bouwen",
      shortLabel: "Bouwen",
      title: "Sites en shops from scratch. Geen template met Hema-geur.",
      quip: "Next.js, Shopify, portalen. Code die meegroeit als jij opschaalt.",
      accent: "#0284C7",
    },
    {
      slug: "vindbaarheid" as const,
      anchor: "hub-vindbaarheid",
      shortLabel: "Vindbaarheid",
      title: "Gevonden in Google én in AI-antwoorden.",
      quip: "SEO, content, Maps en ChatGPT. Organisch eerst, ads als versterker.",
      accent: "#00BCD4",
    },
    {
      slug: "campagnes" as const,
      anchor: "hub-campagnes",
      shortLabel: "Campagnes",
      title: "Google Ads en Meta Ads die je budget niet verbranden.",
      quip: "Search, Shopping, feeds en UGC. Campagnes op pagina's die converteren.",
      accent: "#FF5722",
    },
    {
      slug: "behoud" as const,
      anchor: "hub-behoud",
      shortLabel: "Behoud",
      title: "Klanten vasthouden is goedkoper dan steeds nieuwe jagen.",
      quip: "E-mail, flows, koppelingen. Anders lekt je adsbudget weg.",
      accent: "#8D6E63",
    },
  ],
} as const;

export const DIENSTEN_HUB_PILLARS: readonly DienstenHubPillar[] = [
  {
    slug: "strategie",
    anchor: "hub-strategie",
    eyebrow: "Strategie & groei",
    title: "Eerst weten waar je naartoe rijdt.",
    titleAccent: "Daarna pas gas geven.",
    body: "Groeiplan, advertentiestrategie, CRO en tracking die klopt. Geen dik rapport dat in een la verdwijnt. Wel: welk kanaal wanneer, waar het lekt, en wat je níet moet doen.",
    hotTake:
      "Ads aanzetten zonder plan is als tanken zonder te weten waar je heen rijdt. Je komt ergens. Waarschijnlijk duurder dan nodig.",
    proof: "BestRest kreeg per productlijn een eigen route. Geen standaard funnel uit een Canva-template.",
    pillarHref: "/strategie",
    pillarCta: "Alles over strategie",
    accent: "#FF5722",
    theme: "light",
  },
  {
    slug: "bouwen",
    anchor: "hub-bouwen",
    eyebrow: "Bouwen from scratch",
    title: "Je site is je verkoper.",
    titleAccent: "Geen digitaal visitekaartje met een contactformulier.",
    body: "Next.js, custom Shopify, B2B-portalen, boekingsapps. Geen page builder die vastloopt zodra je gaat adverteren. Code die meegroeit als jij opschaalt.",
    hotTake:
      "Gekochte templates zijn als een pak van de Hema. Past, maar niemand onthoudt je naam.",
    proof: "SkinComplete: salons bestelden om 2 uur 's nachts via mail. Nu 24/7 via B2B-portaal. Geen Excel meer.",
    pillarHref: "/bouwen",
    pillarCta: "Alles over bouwen",
    accent: "#0284C7",
    theme: "dark",
  },
  {
    slug: "vindbaarheid",
    anchor: "hub-vindbaarheid",
    eyebrow: "Vindbaarheid & autoriteit",
    title: "12 jaar Google.",
    titleAccent: "En ja, ChatGPT telt ook mee.",
    body: "Technische SEO, semantische content, lokale vindbaarheid en zichtbaarheid in AI-antwoorden. Organisch verkeer bewijst dat je pagina's overtuigen zonder geld op de klik.",
    hotTake:
      "SEO is geen trucje uit 2014. Wel vakmanschap. Wie het drie jaar niet heeft bijgewerkt, verliest van iemand die wél meet.",
    proof: "SkinComplete rankte op de vragen die salons echt stellen. Ads kwamen pas toen organisch al verkocht.",
    pillarHref: "/vindbaarheid",
    pillarCta: "Alles over vindbaarheid",
    accent: "#00BCD4",
    theme: "light",
  },
  {
    slug: "campagnes",
    anchor: "hub-campagnes",
    eyebrow: "Google Ads & Meta Ads",
    title: "Adverteren is geen gokken",
    titleAccent: "met jouw budget.",
    body: "Search, Shopping, Performance Max waar het past, Meta feeds en UGC. Expliciet benoemd. Campagnes landen op pagina's die converteren, niet op je homepage met vijf boodschappen tegelijk.",
    hotTake:
      "Een campagne zonder tracking is autorijden met dichte ogen. Leuk tot de eerste bocht.",
    proof: "BestRest: eigen strategie per matraslijn. Geen generieke funnel waar budget in verdampt.",
    pillarHref: "/campagnes",
    pillarCta: "Alles over campagnes",
    accent: "#FF5722",
    theme: "dark",
  },
  {
    slug: "behoud",
    anchor: "hub-behoud",
    eyebrow: "Behoud & koppelingen",
    title: "Nieuwe klanten jagen is duur.",
    titleAccent: "Vasthouden is slimmer.",
    body: "Klaviyo, abandoned cart, B2B-portaal-koppelingen, n8n-flows. Bezoekers die niet kopen vandaag, vang je morgen op. Anders lekt je adsbudget weg.",
    hotTake:
      "Ads opschalen zonder e-mail is een emmer vullen met gaten. Je gooit er water in. Het loopt eruit.",
    proof: "SkinComplete: mail en flows vóór het adsbudget omhoog ging. Elke euro werkte harder.",
    pillarHref: "/behoud",
    pillarCta: "Alles over behoud",
    accent: "#8D6E63",
    theme: "warm",
  },
] as const;

export const DIENSTEN_GROUP_CHAT = {
  eyebrow: "Herkenbaar?",
  title: "Vier bureaus.",
  titleAccent: "Eén groepschat. Nul regie.",
  lead: "De gemiddelde ondernemer is projectmanager geworden van partijen die elkaar nooit bellen. Iedereen heeft gelijk. Niemand heeft het totaalplaatje.",
  groupName: "Marketing update 🔔",
  messages: [
    {
      id: "dev",
      sender: "DevStudio",
      role: "agency" as const,
      text: "Site staat live! SEO is niet ons vak hoor 👋",
      delay: 0,
    },
    {
      id: "seo",
      sender: "SEO-only BV",
      role: "agency" as const,
      text: "Wij doen content. Die landingspagina moet jij even fixen met je bouwer.",
      delay: 0.8,
    },
    {
      id: "ads",
      sender: "AdsGuy™",
      role: "agency" as const,
      text: "ROAS is laag maar dat ligt aan jullie product denk ik 🤷",
      delay: 1.6,
    },
    {
      id: "jij",
      sender: "Jij",
      role: "user" as const,
      text: "… kan iemand het totaalplaatje uitleggen?",
      delay: 2.4,
    },
    {
      id: "meneer",
      sender: "Meneer Marketing",
      role: "meneer" as const,
      text: "Ik wel. Eén lijn van code tot campagne. Jij praat met mij. Scroll verder, elk hoofdstuk heeft z'n eigen stuk.",
      delay: 3.2,
    },
  ],
} as const;

export const DIENSTEN_SKINCOMPLETE_BEAT = {
  eyebrow: "Echte volgorde",
  title: "SkinComplete verkocht eerst organisch.",
  titleAccent: "Ads kwamen daarna.",
  body: "Geen gok met budget. Eerst shop, SEO en mail tot salons zelf bestelden. Pas toen Google Ads en Meta als versterker. Zwakke shop + veel ads = arm worden met stijl.",
  steps: [
    { label: "Custom Shopify + B2B-portaal", note: "fundament" },
    { label: "SEO + kennisbank + mail", note: "bewijs zonder klikbudget" },
    { label: "Google Ads & Meta", note: "pas op bewezen landings" },
  ],
  cta: { label: "Lees de SkinComplete case", href: "/cases/skincomplete" },
} as const;

export const DIENSTEN_EXPERT_SUMMARY =
  "Marketing diensten van Meneer Marketing: strategie, websites from scratch, Shopify, SEO, Google Ads, Meta Ads, e-mailmarketing en automatisering. Vijf pijlers, één aanspreekpunt in heel Nederland.";

export const DIENSTEN_HUB_FAQ = [
  {
    question: "Kan ik ook één ding afnemen?",
    answer:
      "Ja, als het past bij je fase. Soms zeg ik eerlijk: begin ergens anders. Een site zonder meetplan maakt ads duurder. Daarom starten we met context.",
  },
  {
    question: "Bouwen jullie met templates?",
    answer:
      "Nee. From scratch in Next.js of Shopify. Geen page builder die je over een jaar tegen de plinten loopt.",
  },
  {
    question: "Alleen Google Ads of alleen SEO?",
    answer:
      "Kan, mits de basis klopt. SkinComplete begon met SEO en mail. Ads kwamen pas toen organisch verkocht.",
  },
  {
    question: "Hoe start ik?",
    answer:
      "Intake invullen, twee minuten. Daarna een gesprek met scherpte op prioriteit. Geen standaardpakket dat voor iedereen hetzelfde is.",
  },
  {
    question: "Werken jullie buiten Apeldoorn?",
    answer:
      "Ja, landelijk. SkinComplete en BestRest zitten niet om de hoek. Wel online groeien met dezelfde aanpak.",
  },
] as const;

export const DIENSTEN_HUB_CTA = {
  eyebrow: "Twijfel je nog?",
  title: "Weet niet waar je moet beginnen?",
  titleAccent: "Dat is normaal.",
  body: "Vul de intake in. Twee minuten. Ik kijk mee welk hoofdstuk nu het meest logisch is. Geen verplichting. Wel eerlijkheid. Soms is het antwoord: nog niet adverteren.",
} as const;
