import type { KennisbankArticle } from "@/data/kennisbank/types";

export const AI_CONTENT_BULK_SEO: KennisbankArticle = {
  slug: "ai-content-bulk-onzichtbaar",
  title: "AI-content voor SEO: slim gebruiken zonder bulk-ruis",
  description:
    "Vijftig ChatGPT-blogs in een uur klinkt productief. Google en AI-antwoorden negeren gemiddelde tekst. Zo gebruik je AI wél voor vindbaarheid.",
  publishedAt: "2026-07-01",
  modifiedAt: "2026-08-08",
  readMinutes: 14,
  category: "vindbaarheid",
  keywords: [
    "ai content seo",
    "chatgpt content google",
    "ai teksten website",
    "content marketing ai",
  ],
  dienstSlugs: ["content-marketing", "seo", "ai-zoek"],
  faqs: [
    {
      question: "Is AI-content slecht voor SEO?",
      answer:
        "Niet per se. Bulk zonder expertise wel. AI die jouw feiten structureert kan helpen. AI die het internet middeelt, niet.",
    },
    {
      question: "Hoe herken ik dat mijn site AI-ruis is?",
      answer:
        "Uiteindelijke gidsen zonder einde, openers over 'de digitale wereld', geen cijfers, geen mening, intern linken om het linken. Als elke alinea op elke concurrent past, zit je fout.",
    },
    {
      question: "Hoeveel pagina's moet ik publiceren?",
      answer:
        "Liever tien pagina's die een echte vraag volledig beantwoorden dan vijftig dunne. Google en AI-antwoorden belonen scherpte, niet publicatiekalenders.",
    },
    {
      question: "Mag AI productteksten schrijven?",
      answer:
        "Structuur ja. Feiten en unique selling points lever jij. Zelfde leverancierstekst door een model is nog steeds duplicate in de praktijk.",
    },
    {
      question: "Helpt dit ook voor ChatGPT-citaten?",
      answer:
        "Ja. Extracteerbare antwoorden, bewijs en schema helpen in Google én in AI-antwoorden. Bulk-fluff helpt nergens.",
    },
  ],
  sections: [
    {
      type: "p",
      text: "Er is een verschil tussen AI gebruiken en AI misbruiken om niet na te denken. Het eerste maakt je sneller. Het tweede levert een site vol blogs die hetzelfde klinken, niks nieuws zeggen en door Google als achtergrondgeluid worden behandeld. Ik schrijf zelf met tools. Bulk uploaden alsof volume een strategie is, is het snelste pad naar onzichtbaarheid. En het voelt eerst productief. Dat is het verraderlijke.",
    },
    {
      type: "callout",
      text: "Mijn regel: AI mag structureren. Jij levert feiten, mening en bewijs. Zonder dat middeel je het internet. Middelen rankt zelden.",
    },
    {
      type: "interactive",
      id: "checklist-meter",
      eyebrow: "Rode-vlaggen-test",
      title: "AI-ruis-meter",
      intro:
        "Vink aan wat je herkent op jouw blog of kennisbank. Hoe hoger, hoe meer gemiddelde tekst en hoe kleiner de kans dat iemand je citeert.",
      storageKey: "mm-ai-ruis-meter",
      eventName: "ai_content_ruis_complete",
      sharePath: "/kennisbank/ai-content-bulk-onzichtbaar",
      scoreNoun: "ruisscore",
      ctaHref: "/diensten/content-marketing",
      ctaLabel: "Content & vindbaarheid",
      checks: [
        {
          id: "digitale-wereld",
          label: "Openers als 'In de huidige digitale wereld...'",
          fix: "Open met de vraag of het probleem van de lezer. Geen weerbericht.",
        },
        {
          id: "ultieme-gids",
          label: "Titels met 'ultieme gids' zonder iets ultiems",
          fix: "Beloof één concreet resultaat in de titel. Lever dat in de eerste alinea.",
        },
        {
          id: "geen-cijfers",
          label: "Geen ranges, geen voorbeelden, geen 'dit werkt niet als'",
          fix: "Voeg één rekensom, één voorwaarde of één harde mening toe per pagina.",
        },
        {
          id: "cannibal",
          label: "Meerdere blogs die dezelfde vraag half beantwoorden",
          fix: "Voeg samen tot één sterke URL. Cannibaliseren is hoe je jezelf ondermijnt.",
        },
        {
          id: "links-random",
          label: "Interne links naar willekeurige diensten 'omdat linking belangrijk is'",
          fix: "Link alleen waar de lezer logisch verder wil. Relevantie > keyword-theater.",
        },
        {
          id: "volume",
          label: "Publicatieschema van drie blogs per week die niemand leest",
          fix: "Halveer volume. Verdubbel diepte. Meet traffic per URL, niet per kalender.",
        },
        {
          id: "geen-stem",
          label: "Elke alinea kan op elke concurrent-site staan",
          fix: "Noem proces, prijsrange, regio of een scherpe mening. Specifiek maakt het van jou.",
        },
        {
          id: "geen-redactie",
          label: "Tekst gaat live zonder dat iemand op onzin checkt",
          fix: "Eén mens die het vak snapt leest mee. AI liegt met TED-talk-vertrouwen.",
        },
      ],
      tiers: [
        {
          id: "scherp",
          min: 0,
          max: 24,
          label: "Mens met een mening",
          quip: "Je klinkt alsof je ergens bij zat. Houd dat vast.",
        },
        {
          id: "half",
          min: 25,
          max: 49,
          label: "Bijna uniek",
          quip: "Er zit nog internet-middeling in. Snijd de wolligheid eruit.",
        },
        {
          id: "ruis",
          min: 50,
          max: 74,
          label: "ChatGPT-koor",
          quip: "Je site zingt mee met iedereen. Google hoort geen solo.",
        },
        {
          id: "bodem",
          min: 75,
          max: 100,
          label: "Sitemap-sneeuw",
          quip: "Veel URL's. Weinig reden om te citeren. Race naar pagina 4, gestart.",
        },
      ],
    },
    {
      type: "h2",
      text: "Waarom Google AI-prutswerk negeert",
    },
    {
      type: "p",
      text: "Google rankt geen tekst omdat die bestaat. Het rankt antwoorden die een vraag beter beantwoorden dan wat er al staat. AI zonder menselijke input produceert vaak het gemiddelde van het internet. Dat is per definitie niet beter. Het is hetzelfde, goedkoper geproduceerd.",
    },
    {
      type: "ul",
      items: [
        "Weinige echte ervaring: je was er niet bij, je hebt het niet gebouwd.",
        "Algemeenheden in plaats van details: 'SEO is belangrijk' is geen informatie.",
        "Dubbele content in je eigen site: vijftig blogs over 'wat is SEO' bijten elkaar.",
        "Zelfde prompt als concurrenten: één stem, tien domeinen.",
      ],
    },
    {
      type: "callout",
      text: "Leuk detail: zo'n 15 procent van Google-queries is nog nooit eerder gezocht. AI die alleen herkauwt, mist precies die kansen.",
    },
    {
      type: "h2",
      text: "AI-antwoorden maken bulk nóg duurder",
    },
    {
      type: "p",
      text: "ChatGPT en Gemini citeren bronnen die concreet, betrouwbaar en gestructureerd zijn. Vage marketingblogs worden niet genoemd. Ik test regelmatig vragen in mijn vakgebied. Wat terugkomt: duidelijke koppen, echte voorbeelden, schema, consistente merkinfo.",
    },
    {
      type: "p",
      text: "Vindbaarheid in AI-antwoorden en klassieke SEO zijn dezelfde discipline met strengere eisen. Bulk zonder strategie schaadt je in beide kanalen.",
    },
    {
      type: "h2",
      text: "Hoe ik AI wél inzet",
    },
    {
      type: "h3",
      text: "Jij levert de inhoud, AI helpt structureren",
    },
    {
      type: "p",
      text: "Intake-gesprek, technische uitleg, scherpe mening die jij al hebt. AI helpt met structuur, herschrijven, varianten. Feiten van jou. Stem van jou. Resultaat klinkt als iemand die ergens bij zat, omdat dat zo is.",
    },
    {
      type: "h3",
      text: "Eén vraag, één pagina",
    },
    {
      type: "p",
      text: "In plaats van vijftig dunne blogs: tien pagina's die een echte vraag volledig beantwoorden. Wat kost X, met eerlijke ranges. Wanneer eerst SEO dan ads, met een heldere beslisboom. Dat rankt. Dat wordt geciteerd. Dat converteert.",
    },
    {
      type: "h3",
      text: "Redactie is geen luxe",
    },
    {
      type: "p",
      text: "Alles wat live gaat, leest een mens die het vak snapt. Niet alleen op spelfouten. Op onzin. Op zinnen die te mooi klinken om waar te zijn.",
    },
    {
      type: "callout",
      text: "Heet take: dertig AI-blogs per maand voor een prikkie is volume in een vergadering. Vindbaarheid is wat er overblijft als niemand meer applaudisseert.",
    },
    {
      type: "h2",
      text: "Productpagina's: extra gevaarlijk",
    },
    {
      type: "p",
      text: "Bulk AI op productpagina's is nog erger dan op blogs. Zelfde leverancierstekst, herschreven door een model, blijft duplicate in de praktijk. Voor bestsellers: unieke specs, FAQ, bewijs. AI mag structureren. Jij vult de feiten.",
    },
    {
      type: "h2",
      text: "De eerlijke conclusie",
    },
    {
      type: "p",
      text: "AI maakt content goedkoop. Daardoor wordt goede content schaarser en waardevoller. Bulk is de race naar de bodem. Die bodem heet pagina 4. Schrijf alsof je tegen een slimme klant aan tafel zit. Gebruik AI om sneller te zijn, niet om na te denken over te slaan. Je concurrent kan dezelfde tool kopen. Jouw manier van kijken niet.",
    },
  ],
};
