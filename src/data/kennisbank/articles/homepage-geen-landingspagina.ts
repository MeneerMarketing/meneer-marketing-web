import type { KennisbankArticle } from "@/data/kennisbank/types";

export const HOMEPAGE_GEEN_LANDINGSPAGINA: KennisbankArticle = {
  slug: "homepage-geen-landingspagina",
  title: "Je homepage is geen landingspagina (en je ads weten dat wel)",
  description:
    "Je advertentie belooft iets concreets. Je homepage zegt welkom. Message match uitgelegd, met fixes die je conversie direct raken.",
  publishedAt: "2026-07-06",
  modifiedAt: "2026-08-08",
  readMinutes: 14,
  category: "campagnes",
  keywords: [
    "landingspagina vs homepage",
    "google ads landingspagina",
    "message match",
    "conversie landingspagina",
  ],
  dienstSlugs: ["cro", "webdevelopment", "google-ads"],
  faqs: [
    {
      question: "Mag ik ads ooit naar de homepage sturen?",
      answer:
        "Alleen bij pure merkcampagnes of als je home één scherpe belofte en CTA heeft. Voor product- of dienstads wil je een landings die de ad herhaalt.",
    },
    {
      question: "Is een productpagina goed genoeg als landings?",
      answer:
        "Vaak wel als die snel is, de belofte bovenaan staat en de CTA duidelijk is. Zo niet: aparte landings from scratch voor de campagne die het budget trekt.",
    },
    {
      question: "Hoeveel landings heb ik nodig?",
      answer:
        "Eén sterke per belangrijkste adgroep of intentie. Liever drie scherpe URL's dan vijftien halfbakken. Schaal landings mee met budget, niet met ego.",
    },
    {
      question: "Helpt message match Quality Score?",
      answer:
        "Indirect ja: relevantere landings, betere CTR en conversie. Direct voel je het in CPA. Quality Score is het bijeffect, je bankrekening is het doel.",
    },
    {
      question: "Wat als mijn theme geen custom landings aankan?",
      answer:
        "Dan knijpt het theme je ads. Overweeg custom build of een stack die landings per campagne aankan. Ads op een starre template is water in een lekke emmer.",
    },
  ],
  sections: [
    {
      type: "p",
      text: "Je ad zegt: product X, gratis bezorgd, klaar in twee weken. Je homepage zegt welkom bij dé specialist sinds 1987, met een slider van vijf stockfoto's. De klik was duur. De bounce was gratis voor Google. De verloren order was voor jou.",
    },
    {
      type: "callout",
      text: "Kort antwoord: stuur paid traffic naar een pagina die exact herhaalt wat je ad belooft. Niet naar je homepage tenzij die homepage één ding doet: verkopen wat de ad zei.",
    },
    {
      type: "interactive",
      id: "checklist-meter",
      eyebrow: "Mobiele eerlijkheidstest",
      title: "Message-match-meter",
      intro:
        "Open je sterkste ad en de landings-URL op je telefoon. Vink aan wat je ziet. Hoe hoger, hoe meer je betaalt voor verwarring.",
      storageKey: "mm-message-match",
      eventName: "message_match_complete",
      sharePath: "/kennisbank/homepage-geen-landingspagina",
      scoreNoun: "mismatch",
      ctaHref: "/diensten/cro",
      ctaLabel: "Conversie-optimalisatie",
      checks: [
        {
          id: "home",
          label: "De ad landt op de homepage",
          fix: "Maak of kies één URL die het aanbod uit de ad herhaalt.",
        },
        {
          id: "h1",
          label: "H1 praat over welkom of 'dé specialist', niet over het ad-aanbod",
          fix: "Zet de belofte uit de ad in de landingskop. Message match eerst.",
        },
        {
          id: "menu",
          label: "Bovenaan staan vijf menu's en geen primaire CTA",
          fix: "Eén CTA boven de vouw op mobiel. Keuzevrijheid is conversie-dood.",
        },
        {
          id: "prijs",
          label: "Ad noemt prijs of voorwaarde, landings niet",
          fix: "Zelfde prijs of voorwaarde zichtbaar. Verrassing na de klik voelt als bedrog.",
        },
        {
          id: "slow",
          label: "Landings laadt traag op 4G",
          fix: "CWV op die URL, niet alleen op home. Trage ads zijn dure afhakers.",
        },
        {
          id: "cta-fold",
          label: "Primaire knop zit onder de vouw op mobiel",
          fix: "Knop zichtbaar vóór twijfel-scroll. Anders betaal je voor nadenken.",
        },
        {
          id: "bewijs",
          label: "Ad belooft expertise, landings toont nul bewijs",
          fix: "Review, garantie of kort resultaat dicht bij de CTA.",
        },
        {
          id: "alles",
          label: "Landings wil ook blog, vacatures en over-ons verkopen",
          fix: "Eén intentie, één pagina. Homepage mag rijk zijn. Campagne-URL niet.",
        },
      ],
      tiers: [
        {
          id: "klik",
          min: 0,
          max: 24,
          label: "Klik voelt als thuiskomen",
          quip: "Belofte en pagina praten dezelfde taal. Houd dat heilig bij elke nieuwe adgroep.",
        },
        {
          id: "huh",
          min: 25,
          max: 49,
          label: "Even zoeken…",
          quip: "Bezoeker moet nog detective spelen. Strakker trekken vóór je budget omhoog gooit.",
        },
        {
          id: "verkeerd",
          min: 50,
          max: 74,
          label: "Verkeerde link-gevoel",
          quip: "Je betaalt voor twijfel. Eén scherpe landings wint van tien halfbakken.",
        },
        {
          id: "lek",
          min: 75,
          max: 100,
          label: "Geldlek met welkomstslider",
          quip: "Homepage als alles-doos + betaalde klik = water in een zeef. Stop. Match. Dan pas schalen.",
        },
      ],
    },
    {
      type: "h2",
      text: "Wat message match is (zonder jargon)",
    },
    {
      type: "p",
      text: "Message match betekent: wat iemand las in je advertentie, ziet hij terug op de pagina waar hij landt. Kop, aanbod, CTA, prijsindicatie, vertrouwen. Alles in één lijn. Detectivewerk voor je bezoeker is conversie-dood.",
    },
    {
      type: "p",
      text: "Google meet dit indirect via Quality Score en conversie. Jij meet het direct via je bankrekening. Slechte match voelt als clickbait. Goede match voelt als: oh ja, dit is wat ik zocht.",
    },
    {
      type: "h2",
      text: "Waarom je homepage bijna nooit wint",
    },
    {
      type: "ul",
      items: [
        "Te veel keuzes: diensten, over ons, blog, contact, vacatures. De bezoeker moet zelf uitzoeken wat relevant is.",
        "Te weinig specifiek: geen herhaling van het exacte zoekwoord of aanbod uit je ad.",
        "Hero die alles wil zijn: mooi voor branding, slecht voor één campagne met één doel.",
        "CTA onder de fold op mobiel terwijl het gros van je ads-verkeer mobiel is.",
      ],
    },
    {
      type: "h2",
      text: "Hoe ik landings per intentie aanpak",
    },
    {
      type: "p",
      text: "Niet elk product krijgt dezelfde landings. Andere marges, andere zoekintentie, andere vergelijking. Sommige campagnes gaan naar een productpagina die scherp is. Sommige naar een landings die één aanbod maakt. De homepage is het visitekaartje. Niet het verkoopgesprek om 23:00.",
    },
    {
      type: "h2",
      text: "Landings vóór ads-schaal",
    },
    {
      type: "p",
      text: "Eerst organische landings op echte klantvragen, shop scherp, daarna pas budget omhoog. Diezelfde discipline geldt voor paid: belofte in de ad, bewijs op de URL, CTA zonder omweg. Homepage mag branden. Campagne-URL's moeten verkopen.",
    },
    {
      type: "h2",
      text: "Wat een landings wél moet doen",
    },
    {
      type: "p",
      text: "Eén belofte bovenaan die de ad herhaalt. Bewijs dichtbij: review, garantie, levering. Eén primaire CTA. FAQ die de drie grootste twijfels wegneemt. Op mobiel moet de knop er zijn vóór iemand gaat scrollen uit twijfel.",
    },
    {
      type: "ul",
      items: [
        "Headline = ad-headline of zoekintentie, niet een creatieve slogan die niks zegt.",
        "Zelfde prijs of voorwaarde als in de ad. Verrassingen na de klik voelen als bedrog.",
        "Form of checkout kort. Elke extra vraag is een afhaakpunt.",
        "Snelheid: Core Web Vitals op die landings, niet alleen op home. Ads op trage pages is water in een lekke emmer.",
      ],
    },
    {
      type: "h2",
      text: "Wanneer wél naar home?",
    },
    {
      type: "p",
      text: "Als je homepage één duidelijke CTA heeft, snel laadt, en je ad generiek merkbewustzijn is, kan home soms werken. Generieke merkcampagnes zijn duur en moeilijk meetbaar. Voor MKB met beperkt budget is specifiek bijna altijd slimmer.",
    },
    {
      type: "h2",
      text: "SEO-landings zijn hetzelfde verhaal",
    },
    {
      type: "p",
      text: "Dit is niet alleen een ads-truc. Organisch verkeer op een dienstenpagina die alles wil zeggen, converteert ook slecht. Eén intentie, één pagina, één volgende stap. Je homepage mag rijk zijn. Je geld-URL's moeten scherp zijn.",
    },
    {
      type: "h2",
      text: "Wat je vandaag kunt checken",
    },
    {
      type: "ul",
      items: [
        "Open je sterkste ad. Lees headline en description.",
        "Klik door op mobiel naar waar die ad naartoe stuurt.",
        "Zie je binnen drie seconden hetzelfde aanbod? Zo nee, je lekt.",
        "Maak of verbeter één landings per belangrijkste adgroep. Eén goede wint van tien middelmatige.",
      ],
    },
    {
      type: "callout",
      text: "Ads zonder landings is water in een emmer met gaten. Dicht eerst het gat. Dan pas meer water erin.",
    },
    {
      type: "p",
      text: "Je homepage is vaak je duurste pagina omdat al je verkeer daar naartoe kan. Maak hem sterk. Maar stuur je betaalde klikken naar een pagina die één belofte nakomt. Dat is waar je marge woont.",
    },
  ],
};
