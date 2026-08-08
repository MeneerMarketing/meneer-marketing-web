import type { KennisbankArticle } from "@/data/kennisbank/types";

export const AI_MAX_GOOGLE_ADS_SEARCH_2026: KennisbankArticle = {
  slug: "ai-max-google-ads-search-2026",
  title:
    "AI Max aanzetten is geen strategie. Google leest je site en jij betaalt de interpretatie",
  description:
    "AI Max for Search belooft meer bereik en slimmere ads. In de praktijk gebruikt Google je website als menu. Zo zet je het aan zonder je landings en budget te laten kapen.",
  publishedAt: "2026-07-26",
  modifiedAt: "2026-08-08",
  readMinutes: 14,
  category: "campagnes",
  keywords: [
    "ai max google ads",
    "ai max for search",
    "final url expansion google ads",
    "ai max aan of uit",
    "dsa ai max search",
    "text customization google ads",
  ],
  dienstSlugs: ["google-ads", "webdevelopment", "cro"],
  faqs: [
    {
      question: "Wat is AI Max for Search in Google Ads?",
      answer:
        "AI Max is een set automatisering bovenop Search-campagnes: slimmer zoektermen matchen, tekst aanpassen op basis van je ads en landingspagina, en optioneel verkeer sturen naar andere URL’s op je domein (Final URL Expansion). Het is geen aparte campagnetype zoals Performance Max. Het is een schakelaar op Search.",
    },
    {
      question: "Moet ik AI Max altijd aanzetten?",
      answer:
        "Nee. Zet het aan als je conversies goed meet, je landingspagina’s per intentie duidelijk zijn, en je Smart Bidding (niet alleen CPC) gebruikt. Zet Final URL Expansion uit of streng in als je homepage, blog of dunne collecties alsnog clicks stelen. AI Max schaalt wat je site aankan. Ook het verkeerde.",
    },
    {
      question: "Wat is het verschil tussen AI Max en Performance Max?",
      answer:
        "Performance Max speelt over kanalen heen (Search, Shopping, YouTube, Display, enz.). AI Max blijft binnen Search, maar geeft Google meer vrijheid in matching, ad copy en landings-URL. Denk: Search met turbo, niet een compleet ander voertuig.",
    },
    {
      question: "Waarom verdwijnen mijn gepinde RSA-koppen bij Final URL Expansion?",
      answer:
        "Omdat Google een andere landingspagina mag kiezen dan je ad-URL. Gepinde koppen die bij pagina A horen, passen niet bij pagina B. Daarom negeert het systeem pinning als Final URL Expansion actief is. Wil je pinning houden? Zet Final URL Expansion uit.",
    },
  ],
  sections: [
    {
      type: "p",
      text: "Google heeft een knop die klinkt alsof je een cheatcode krijgt: AI Max. Zet aan. Krijg bereik. Ga naar huis. Alsof marketing eindelijk een magnetron-stand heeft. In 2026 zie ik die knop overal opduiken in Search-campagnes. En ik zie net zo vaak ondernemers die een week later boos in het zoektermenrapport zitten. ‘Waarom landt dit op mijn blog uit 2019?’ ‘Waarom betaal ik voor traffic naar een over-ons-pagina?’",
    },
    {
      type: "p",
      text: "Kort antwoord: AI Max is niet dom. AI Max is gehoorzaam aan je site. Als je site een rommelige menukaart is, bestelt Google voor je wat er op die kaart staat. Jij betaalt de rekening.",
    },
    {
      type: "callout",
      text: "Vuistregel: AI Max straft een zwakke website harder dan een zwakke keywordlijst. Keywords kun je uitsluiten. Een homepage die overal ‘relevant genoeg’ voor lijkt, blijft clicks stelen.",
    },
    {
      type: "interactive",
      id: "checklist-meter",
      eyebrow: "AI Max-check",
      title: "Site-als-menu-meter",
      intro:
        "Vink aan wat klopt vóór je AI Max aanzet. Hoe hoger, hoe meer Google jouw rommelige site als bestellijst gebruikt en jij de interpretatie betaalt.",
      storageKey: "mm-aimax-menu",
      eventName: "aimax_menu_complete",
      sharePath: "/kennisbank/ai-max-google-ads-search-2026",
      scoreNoun: "kaping",
      ctaHref: "/diensten/google-ads",
      ctaLabel: "Google Ads",
      checks: [
        {
          id: "url-exp",
          label: "Final URL Expansion staat aan zonder URL-uitsluitingen",
          fix: "Streng: blog, over-ons, dunne collecties uitsluiten of expansion uit.",
        },
        {
          id: "home",
          label: "Homepage of blog uit 2019 steelt Search-clicks",
          fix: "Landings per intentie. Homepage is geen catch-all voor ads.",
        },
        {
          id: "pin",
          label: "Je wilt pinning houden maar expansion staat aan",
          fix: "Expansion uit als RSA-pins heilig zijn. Of pins loslaten.",
        },
        {
          id: "meet",
          label: "Conversies of Smart Bidding zijn nog rommelig",
          fix: "Eerst meten. AI Max schaalt wat je meet, ook het verkeerde.",
        },
        {
          id: "landings",
          label: "Landings zijn dun of message-mismatch met ads",
          fix: "Eén belofte, één URL. Zwakke site = duurdere AI Max.",
        },
        {
          id: "zoek",
          label: "Zoektermenrapport check je niet na aanzetten",
          fix: "Wekelijks. Negatieven. Anders betaal je Google's fantasiematch.",
        },
        {
          id: "pmax",
          label: "Je denkt dat AI Max hetzelfde is als Performance Max",
          fix: "AI Max = Search met turbo. PMax is ander voertuig.",
        },
        {
          id: "aan",
          label: "Knop aan 'voor bereik', site en tracking later",
          fix: "Volgorde omdraaien. Site + data eerst, dan schakelaar.",
        },
      ],
      tiers: [
        {
          id: "klaar",
          min: 0,
          max: 24,
          label: "Klaar voor turbo",
          quip: "Site en meting dragen AI Max. Houd zoektermen in de gaten.",
        },
        {
          id: "risico",
          min: 25,
          max: 49,
          label: "Risico-zone",
          quip: "Expansion strak zetten. Eén week monitoren vóór je budget jaagt.",
        },
        {
          id: "menu",
          min: 50,
          max: 74,
          label: "Google bestelt van je menu",
          quip: "Zwakke pagina's winnen clicks. Fix landings of knop uit.",
        },
        {
          id: "kaping",
          min: 75,
          max: 100,
          label: "Budget-kaping",
          quip: "Zet uit of hard beperken. Eerst site, dan AI Max.",
        },
      ],
    },
    {
      type: "h2",
      text: "Wat AI Max wél is (mensentaal)",
    },
    {
      type: "p",
      text: "AI Max for Search is een pakketje automatisering bovenop een gewone Search-campagne. Het is geen nieuw kanaal. Wel meer vrijheid voor Google om te beslissen:",
    },
    {
      type: "ul",
      items: [
        "Welke zoekopdrachten bij jouw ads mogen (breder matchen dan jij handmatig zou durven).",
        "Welke koppen en beschrijvingen er komen (text customization: ads + landingspagina + AI-tekst).",
        "Welke URL op jouw domein de klik krijgt (Final URL Expansion, standaard aan als je AI Max aanzet).",
      ],
    },
    {
      type: "p",
      text: "Google wil conversie-gebaseerde Smart Bidding. Zonder fatsoenlijke conversies is AI Max een snelle auto zonder stuur. Technisch rijdt-ie. Praktisch eindig je in de berm met een mooi dashboard.",
    },
    {
      type: "h2",
      text: "De plotwending: Final URL Expansion",
    },
    {
      type: "p",
      text: "Hier wordt het interessant. En gevaarlijk. Final URL Expansion mag verkeer sturen naar andere pagina’s op je domein als Google denkt dat die beter matchen met de zoekopdracht. Handig als je twintig scherpe landings hebt. Rampzalig als je één homepage hebt, drie blogs en een contactpagina die toevallig het zoekwoord noemt.",
    },
    {
      type: "p",
      text: "Belangrijk detail uit de Google-keuken: Final URL Expansion werkt alleen als text customization aan staat. Zet text customization uit, dan gaat Final URL Expansion mee uit. En als Final URL Expansion aan staat, worden gepinde RSA-assets genegeerd zodra Google een andere URL kiest. Logisch. Irritant als je dat niet wist.",
    },
    {
      type: "ul",
      items: [
        "URL exclusions: blokkeer paden die nooit ads mogen krijgen (blogarchief, vacatures, privacy, dunne tags).",
        "URL inclusions / page feeds: beperk waar Google mag landen als je wél controle wilt houden.",
        "Tracking templates: test of dynamische landings niet diep in een 404 verdwijnen. Dat gebeurt écht.",
      ],
    },
    {
      type: "callout",
      text: "Denk aan AI Max als een ober die mag improviseren. Als je keuken alleen ‘huiswijn en toast’ heeft, serveert hij dat met overtuiging. Jouw taak is het menu.",
    },
    {
      type: "h2",
      text: "Wanneer AI Max slim is",
    },
    {
      type: "p",
      text: "Ik zet AI Max graag aan als de fundamenten kloppen. Dan is het geen gok, maar schaal.",
    },
    {
      type: "ul",
      items: [
        "Je hebt aparte landings per zoekintentie: dienst, productlijn, regio, probleem. Niet alles naar home.",
        "Conversies zijn schoon: één primaire actie, Consent Mode netjes, bij voorkeur Enhanced Conversions.",
        "Je stuurt op tCPA of tROAS (of Max Conversies met genoeg volume), niet op ‘handmatig CPC omdat ik het spannend vind’.",
        "Je site is snel en duidelijk op mobiel. AI Max stuurt meer verkeer. Traagheid wordt duurder, niet charmant.",
        "Je hebt tijd om wekelijks zoektermen + landings-URL’s te lezen. Automatisering zonder toezicht is een abonnement op verrassingen.",
      ],
    },
    {
      type: "h2",
      text: "Wanneer je beter deels of helemaal uitzet",
    },
    {
      type: "p",
      text: "AI Max is optioneel. Google houdt van ‘aan’. Jouw bankrekening houdt van ‘gecontroleerd’.",
    },
    {
      type: "ul",
      items: [
        "Je verkoopt iets met hoge twijfel of lange overweging en je landings zijn nog brochure. Eerst boodschap en pagina’s, dan turbo.",
        "Je merkt dat verkeer naar blogs, nieuws of ‘over ons’ loopt terwijl je ad om een aanvraag of aankoop vraagt.",
        "Je hebt strakke merkclaims of compliance. Text customization kan creatief worden op momenten dat jij juridisch saai wilt blijven.",
        "Je volume is te laag om Smart Bidding + AI Max tegelijk te voeden. Dan optimaliseer je ruis.",
      ],
    },
    {
      type: "h2",
      text: "AI Max versus ‘gewoon’ Search (en DSA)",
    },
    {
      type: "p",
      text: "Klassiek Search: jij kiest keywords, jij kiest URL’s, jij schrijft ads. Saai. Fijn. DSA (Dynamic Search Ads) liet Google al pagina’s matchen op basis van je site. AI Max voelt als de volgende stap: matching, copy én URL-keuze dichter bij elkaar, met meer AI-tekst. DSA verdwijnt in veel accounts richting deze wereld. Mentale model: vroeger koos Google vooral welke pagina. Nu mixt hij pagina + boodschap + bredere query-dekking.",
    },
    {
      type: "p",
      text: "Performance Max blijft iets anders. PMax speelt overal. AI Max blijft Search, maar met minder handrem. Verwar die twee niet in een vergadering. Dan praat je langs elkaar heen terwijl het budget wel gewoon doorloopt.",
    },
    {
      type: "h2",
      text: "Hoe je AI Max leest zonder paniek",
    },
    {
      type: "p",
      text: "Na livegang kijk ik niet alleen naar ROAS. Ik kijk naar het verhaal achter de klik.",
    },
    {
      type: "ul",
      items: [
        "Zoektermenrapport: welke queries zijn nieuw, relevant, of ‘technisch gerelateerd maar commercieel niks’?",
        "Landingspagina-rapport: welke URL’s krijgen verkeer dat jij nooit als Final URL had gekozen?",
        "Search terms × landing: matcht de belofte in de ad met de H1 op de pagina?",
        "Asset-rapport: welke AI-koppen converteren, welke klinken als corporate LinkedIn?",
        "Nieuwe vs terugkerende: AI Max mag bereik kopen. Check of je geen dure toeristen koopt.",
      ],
    },
    {
      type: "p",
      text: "Zie je structureel verkeerde landings? Eerst URL exclusions. Dan betere pagina’s bouwen voor die intentie. Pas daarna opnieuw gas. Wie alleen budget omlaag zet, geneest symptomen.",
    },
    {
      type: "h2",
      text: "De site-eis die niemand in de AI Max-hype noemt",
    },
    {
      type: "p",
      text: "Hier word ik scherp. AI Max maakt je website onderdeel van je biedstrategie. Elke dunne pagina is een mogelijke bestemming. Elke sterke landingspagina is een hefboom. Daarom zeg ik bij intakes steeds vaker: custom build en duidelijke landings zijn geen ‘designproject’. Het is advertentietechniek.",
    },
    {
      type: "p",
      text: "Een homepage die ‘welkom, wij doen van alles’ zegt (bureau-taal), is voor Google een buffet. Een dienstenpagina of productlandings met één belofte, één CTA en snelle laadtijd is een bestelling. AI Max houdt van buffetten. Jij wilt bestellingen.",
    },
    {
      type: "callout",
      text: "Leuk detail: Final URL Expansion stuurt alleen naar URL’s die Google query-relevant én thematisch bij je ad group vindt. ‘Thematisch’ is geen juridische garantie. Het is een mening van een model. Jouw exclusions zijn de huisregels.",
    },
    {
      type: "h2",
      text: "Praktische setup die ik vaak gebruik",
    },
    {
      type: "p",
      text: "Dit is geen heilige checklist uit een PDF. Wel een werkwijze die voorkomt dat AI Max met je speelgoed gaat rennen.",
    },
    {
      type: "ul",
      items: [
        "Campagne per intentiecluster (bijv. ‘aanvraag dienst X’ apart van ‘informatieve long-tail’).",
        "AI Max aan, text customization aan, Final URL Expansion eerst uit óf met strakke exclusions.",
        "Na 10–14 dagen stabiele data: Final URL Expansion testen op campagnes met échte landingsdiepte.",
        "Wekelijks: zoektermen negatief bijsturen, landings die lekken uitsluiten, winnaars uitbouwen.",
        "Tracking eerst: Consent Mode, primaire conversie, Enhanced Conversions waar mogelijk. Anders optimaliseert AI Max op fantomen.",
      ],
    },
    {
      type: "h2",
      text: "Kort: de knop is niet de strategie",
    },
    {
      type: "p",
      text: "AI Max for Search is krachtig als je site en meting volwassen zijn. Het is duur entertainment als je nog ‘welkom op onze website’ als landingspagina gebruikt. Google leest je pagina’s. Interpreteert ze. En rekent de clicks bij jou.",
    },
    {
      type: "p",
      text: "Wil je weten of jouw Search-account klaar is voor AI Max, of dat je eerst landings en tracking moet rechtzetten? Start een intake. Ik kijk mee in het account én op je site. De knop laat ik pas knipperen als het menu klopt.",
    },
  ],
};
