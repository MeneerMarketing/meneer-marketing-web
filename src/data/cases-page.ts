import type { CaseSceneId } from "@/data/home-cases";

export interface CasePageBeat {
  label: string;
  text: string;
}

export interface CasePageStory {
  hook: string;
  meneerLine: string;
  beats: readonly CasePageBeat[];
  punch: string;
}

export const CASES_PAGE_HERO = {
  eyebrow: "Cases",
  title: "Twaalf jaar marketing.",
  titleAccent: "Dit is wat ik ervan maak.",
  lead: "Ik bouw, meet en stuur al sinds 2012. Hieronder staan trajecten waar dat in de praktijk is gebeurd. Live links, echte cijfers, verhalen die ik je aan tafel kan uitleggen zonder slides. Scroll. Klik. Oordeel zelf.",
  console: {
    host: "meneer@marketing",
    since: "2012",
    lines: [
      { key: "ervaring", label: "status", value: "12+ jaar actief" },
      { key: "stack", label: "stack", value: "Shopify · Next.js · SEO · Ads" },
      { key: "modus", label: "modus", value: "bouwen → meten → bijsturen" },
      { key: "nu", label: "nu", value: "scroll voor de projecten ↓" },
    ],
    quip: "Als ik het niet kan meten, zeg ik het je eerlijk.",
  },
} as const;

export const CASES_PAGE_STORIES: Record<CaseSceneId, CasePageStory> = {
  skincomplete: {
    hook: "Salons bestelden via mail en Excel. Om 2 uur 's nachts. Serieus.",
    meneerLine:
      "Ik bouwde theme, B2B-portaal en mailflows in één lijn. Eerst SEO. Ads pas toen het al verkocht.",
    beats: [
      {
        label: "Zo begon het",
        text: "Bestellingen via mail, prijzen in Excel, niemand die 24/7 kon bestellen. Vindbaarheid moest ook groeien zonder budget te verbranden.",
      },
      {
        label: "Zo bouwde ik",
        text: "Custom Shopify theme, B2B-portaal met eigen accounts en prijzen, e-mail gekoppeld aan het portaal. SEO en content eerst. Google Ads en Meta pas op een site die al converteerde.",
      },
      {
        label: "Zo staat het nu",
        text: "Salons loggen in en bestellen zelf. Organisch verkeer en mail dragen omzet. Ads schalen op een fundament dat al werkt. Influencers leveren content voor campagnes.",
      },
    ],
    punch: "24/7 bestellen. Organisch vóór paid. Ads op een fundament dat al werkt.",
  },
  bestrest: {
    hook: "Miljoenenbudgetten in matrassenland. BestRest moest opvallen, niet schreeuwen.",
    meneerLine:
      "Custom Shopify from scratch. Per productlijn eigen SEO, mail en ads. Elke lijn kreeg een eigen route.",
    beats: [
      {
        label: "Zo begon het",
        text: "Grote spelers domineren met budget. Een standaard theme en losse marketing hielden BestRest niet scherp genoeg in de ruis.",
      },
      {
        label: "Zo bouwde ik",
        text: "Webshop from scratch in Shopify. SEO-structuur per assortiment, e-mail per productlijn, Google Ads en Meta op landingspagina's die echt matchen met wat mensen zoeken.",
      },
      {
        label: "Zo staat het nu",
        text: "Een shop en marketinglijn die past bij toppers en matrassen. Meetbaar, eigen, klaar om op te schalen wat werkt.",
      },
    ],
    punch: "Eigen koers in een markt met miljoenenbudgetten.",
  },
  "hills-pilates": {
    hook: "Lessen, mails en boekingen zaten allemaal in losse tools. Niets praatte met elkaar.",
    meneerLine:
      "Website, boekingsapp en mails in één lijn. From scratch. Eén stack, geen losse puzzel.",
    beats: [
      {
        label: "Zo begon het",
        text: "Aanmeldingen via WhatsApp, planning in het hoofd, mails handmatig. Geen plek waar klant boekt en Hills haar agenda ziet.",
      },
      {
        label: "Zo bouwde ik",
        text: "Custom website in Next.js, boekingsapp met agenda voor klant én team, automatische mails voor welkom, herinnering en retentie.",
      },
      {
        label: "Zo staat het nu",
        text: "Klanten boeken via de app. Hills ziet alles op één plek. Site, mail en app trekken dezelfde kant op.",
      },
    ],
    punch: "Site, app en mail. Eén lijn. Alles op dezelfde stack.",
  },
};

export const CASES_PAGE_CTA = {
  title: "Jouw verhaal hier?",
  lead: "Ik documenteer geen nep-successen. Wel trajecten waar je trots op bent. Eerlijk, meetbaar en commercieel sterk.",
  button: "Start intake",
} as const;

export const CASES_PAGE_PROOF = {
  eyebrow: "Live check",
  title: "Drie links die je zelf opent.",
  titleAccent: "Alles live op productie.",
  lead: "Alles wat je hierboven zag draait ergens op productie. Ik hoef je geen deck te sturen. Klik, kijk, oordeel.",
  meneerQuip: "Staat de URL niet live? Dan staat het niet op deze pagina.",
  receiptLabel: "Trajectbon",
  liveLabel: "Bekijk live",
  caseLabel: "Hele case",
} as const;

export const CASES_PAGE_WERKWIJZE = {
  eyebrow: "Zo werk ik",
  title: "Cases zijn geen eindstation. Het is het proces.",
  lead: "Snappen, routekaart, bouwen, sturen. Elke case doorloopt hetzelfde raamwerk. De volgorde per klant is anders.",
  ctaLabel: "Bekijk de volledige werkwijze",
  ctaHref: "/werkwijze",
  quips: {
    snappen:
      "SkinComplete begon met: wat verkopen salons echt online? Niet: welk template is het mooist.",
    route:
      "BestRest kreeg per matras een andere route. Toppers zijn geen matrassen. Logisch.",
    bouwen:
      "Hills kreeg site, app en mail in één lijn. Vijf losse abonnementen die niet praten? Dat was het oude model.",
    sturen:
      "Ads opschalen als het al verkocht. Anders gok je met iemand anders zijn budget.",
  },
} as const;

export const CASES_PAGE_HONEST = {
  eyebrow: "Eerlijk verschil",
  title: "Zo ziet agency-werk eruit. Zo ziet mijn werk eruit.",
  notTitle: "Zo niet",
  notItems: [
    "Stockfoto's en nep-statistieken op de cases-pagina",
    "Page builder die vastloopt als je groeit",
    "Ads aan voordat je site converteert",
    "Kwartaalrapport van 40 slides dat niemand opent",
    "Zelfde playbook voor elke klant",
  ],
  welTitle: "Zo wel",
  welItems: [
    "Video, foto's en live links van echte projecten",
    "Websites from scratch, Shopify custom, Next.js apps",
    "SEO en fundament eerst. Ads als het rendement klopt",
    "Update in normale taal: wat live staat en wat het doet",
    "Route op maat. SkinComplete ≠ BestRest ≠ Hills",
  ],
  meneerLine: "Ik groei als jij groeit. Direct advies, geen agency-praat. Iemand die meedenkt en doorpakt.",
} as const;

export const CASES_PAGE_FUN_FACTS_TITLE = "Feitjes die je case raken";
