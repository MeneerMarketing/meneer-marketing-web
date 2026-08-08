import type { KennisbankArticle } from "@/data/kennisbank/types";

export const MERCHANT_CENTER_FEED: KennisbankArticle = {
  slug: "merchant-center-feed-afgekeurd",
  title: "Google Shopping feed afgekeurd? Hier gaat het mis",
  description:
    "Merchant Center weigert je producten, Shopping staat stil en niemand weet waarom. De meest voorkomende feed-fouten en hoe je ze fixt.",
  publishedAt: "2026-07-11",
  modifiedAt: "2026-08-08",
  readMinutes: 13,
  category: "campagnes",
  keywords: [
    "merchant center fouten",
    "google shopping feed",
    "product feed afgekeurd",
    "google shopping problemen",
  ],
  dienstSlugs: ["google-ads", "shopify-enterprise", "marketplaces"],
  faqs: [
    {
      question: "Waarom keurt Merchant Center mijn producten af?",
      answer:
        "Meestal prijs- of voorraadmismatch, ontbrekende identifiers, slechte images of verkeerde categorie. Open Diagnostics, sorteer op impact, fix bestsellers eerst.",
    },
    {
      question: "Hoe vaak moet ik mijn Shopping-feed syncen?",
      answer:
        "Dagelijks als prijzen of voorraad vaak wijzigen. Mismatch tussen feed en site is een snelle weg naar afkeuringen en verspilde kliks.",
    },
    {
      question: "Kan ik Performance Max draaien met een rommelige feed?",
      answer:
        "Technisch soms. Slim: nee. PMax trekt Shopping-data mee. Rommel in input wordt duurdere ruis. Eerst Merchant Center groen.",
    },
    {
      question: "Wat fix ik eerst bij honderden fouten?",
      answer:
        "Bestsellers en producten met het meeste zoekvolume. Daarna systematisch per fouttype. Alles tegelijk half doen kost meer tijd dan de top 20 hard.",
    },
    {
      question: "Helpt een schone feed als mijn PDP zwak is?",
      answer:
        "Half. Feed krijgt je in Shopping. Productpagina moet overtuigen. Dunne PDP = dure kliks. BestRest en SkinComplete: feed én pagina samen.",
    },
  ],
  sections: [
    {
      type: "p",
      text: "Je zet Google Shopping aan. Je voelt je ondernemer. Dan krijg je een mail van Merchant Center alsof je een boete hebt gekregen voor iets dat je niet wist dat illegaal was. Producten afgekeurd. Hele feed gepauzeerd. Dashboard rood. Paniek. Het goede nieuws: negen van de tien keer is het geen mysterie. Het is een handvol fouten die iedereen maakt.",
    },
    {
      type: "callout",
      text: "Kort antwoord: sync prijs en voorraad, fix identifiers en images, kies de juiste categorie, check landings-URL's. Bestsellers eerst. Daarna pas budget omhoog.",
    },
    {
      type: "h2",
      text: "Waarom Google zo streng is",
    },
    {
      type: "p",
      text: "Shopping toont je product direct in de zoekresultaten met prijs en foto. Google wil niet dat mensen klikken op een product van 49 euro dat 89 blijkt te zijn, of op een afbeelding die niet overeenkomt met wat je verkoopt. Strenge regels zijn verveling met een reden: vertrouwen in het platform.",
    },
    {
      type: "h2",
      text: "De fouten die ik het vaakst zie",
    },
    {
      type: "h3",
      text: "Prijs en beschikbaarheid kloppen niet",
    },
    {
      type: "p",
      text: "Je feed zegt op voorraad, je site zegt uitverkocht. Of je feed heeft oude prijzen na een sale. Google crawlt je site en vergelijkt. Mismatch betekent afkeuring. Sync je feed minstens dagelijks als je veel verandert.",
    },
    {
      type: "h3",
      text: "GTIN, MPN of merk ontbreken",
    },
    {
      type: "p",
      text: "Voor veel productcategorieën wil Google identificatoren. Geen barcode? Soms mag het met brand plus MPN, soms niet. Generic invullen om het te omzeilen werkt niet. Dan krijg je limited performance in plaats van vrij spelen.",
    },
    {
      type: "h3",
      text: "Afbeeldingen die niet voldoen",
    },
    {
      type: "p",
      text: "Te klein, watermark, promo-tekst op de foto, witte achtergrond waar dat verplicht is. Je productfoto is geen Instagram-story met SALE eroverheen. Dat vindt Google leuk op Meta, niet in Shopping.",
    },
    {
      type: "h3",
      text: "Verkeerde Google product category",
    },
    {
      type: "p",
      text: "Een matras in Home and Garden Decor omdat je haast had. Dan concurreer je met kaarsen en rank je slecht. Categorie bepaalt waar je verschijnt en welke regels gelden.",
    },
    {
      type: "ul",
      items: [
        "Landing URL gaat naar 404 of redirect-keten.",
        "Titel is keyword-spam in plaats van wat de koper zoekt.",
        "Beleidsschendingen: misleidende shipping of verboden claims.",
        "Verzendkosten in feed komen niet overeen met checkout.",
      ],
    },
    {
      type: "callout",
      text: "Leuk detail: een feed met 2 procent afgekeurde producten lijkt harmless. Vaak zijn dat je bestsellers met het meeste zoekvolume. Fix die eerst.",
    },
    {
      type: "h2",
      text: "Shopping werkt pas als de shop ook klopt",
    },
    {
      type: "p",
      text: "Bij BestRest en SkinComplete is de les hetzelfde: feed is helft, productpagina is andere helft. Klik op Shopping, land op dunne pagina, afhaker. Google ziet dat. Je betaalt meer voor minder. Investeer in productpagina's met duidelijke info, reviews en snelheid.",
    },
    {
      type: "h2",
      text: "Titels en attributen die wél verkopen",
    },
    {
      type: "p",
      text: "Schrijf titels zoals kopers zoeken: merk, type, maat, materiaal. Niet keyword-soep. Custom labels voor marge of seizoen helpen je campagnes sturen zonder de feed te vervuilen. Attributen die kloppen winnen van creatieve titels die liegen.",
    },
    {
      type: "h2",
      text: "Performance Max zonder schone feed",
    },
    {
      type: "p",
      text: "PMax trekt je Shopping-data mee. Rommel in de feed betekent rommel in PMax. De zwarte doos wordt nog zwarter als de input al kapot is. Eerst Merchant Center groen, dan pas budget omhoog. Op mijn Google Shopping ads-hub leg ik uit hoe feed, PDP en biedingen samenhangen.",
    },
    {
      type: "callout",
      text: "Heet take: een bureau dat Shopping aanzet zonder je feed te auditen, gokt met je catalogus alsof het een scratchcard is.",
    },
    {
      type: "h2",
      text: "Wat je vandaag checkt",
    },
    {
      type: "p",
      text: "Open Merchant Center. Diagnostics. Sorteer op impact. Fix de topfouten. Controleer vijf willekeurige producten: prijs op site versus feed, voorraad, afbeelding, landings-URL. Doe dat wekelijks als je ads draaien. Saai? Ja. Goedkoper dan een maand budget naar afgekeurde producten.",
    },
  ],
};
