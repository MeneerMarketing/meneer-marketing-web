import type { KennisbankArticle } from "@/data/kennisbank/types";

export const AI_ZOEK_VINDBAARHEID_CHATGPT: KennisbankArticle = {
  slug: "ai-zoek-vindbaarheid-chatgpt",
  title: "Vindbaarheid in AI-antwoorden: gevonden worden in ChatGPT en Gemini",
  description:
    "Klanten vragen ChatGPT en Gemini om advies. Zo bouw je pagina's die AI citeert: heldere antwoorden, schema en consistente expertise.",
  publishedAt: "2026-06-18",
  modifiedAt: "2026-08-08",
  readMinutes: 15,
  category: "vindbaarheid",
  keywords: [
    "AI-antwoorden",
    "ChatGPT vindbaarheid",
    "Gemini vindbaarheid",
    "generative engine optimization",
    "vindbaarheid ai",
  ],
  dienstSlugs: ["ai-zoek", "seo", "content-marketing"],
  faqs: [
    {
      question: "Is vindbaarheid in AI hetzelfde als SEO?",
      answer:
        "Nee, maar het overlapt sterk. Sterke, feitelijke pagina's helpen in Google én in AI-antwoorden. Bulk-fluff helpt nergens. Eén contentplan, twee kanalen.",
    },
    {
      question: "Hoe meet ik of ChatGPT mij noemt?",
      answer:
        "Handmatig op queries die je klanten écht stellen. Noteer wie genoemd wordt en welke bronnen terugkomen. Scoreboards die alles beloven bestaan nauwelijks. Een spreadsheet met tien vragen per maand is eerlijker.",
    },
    {
      question: "Helpt schema markup voor AI-citaten?",
      answer:
        "Het helpt machines snappen wie je bent en wat je doet. Samen met duidelijke antwoorden. Schema zonder inhoud is versiering.",
    },
    {
      question: "Moet ik aparte pagina's maken voor AI en voor Google?",
      answer:
        "Meestal niet. Eén sterke antwoordpagina voedt beide. Wel strengere eisen: extracteerbaar antwoord bovenaan, bewijs, schema, consistente merkinfo. Twee parallelle sites is onderhoudsdrama.",
    },
    {
      question: "Helpt vindbaarheid in AI ook B2B?",
      answer:
        "Ja. Beslissers typen langere vragen in chat: 'welk Shopify B2B-portaal past bij groothandel X'. Wie die vraag feitelijk beantwoordt met cases en ranges, staat eerder in het antwoord dan een algemene homepage.",
    },
  ],
  sections: [
    {
      type: "p",
      text: "Even een ongemakkelijke waarheid: een deel van jouw potentiële klanten googelt niet meer. Ze typen hun vraag in ChatGPT of Gemini en krijgen één antwoord, met een paar bronnen. Sta jij daar niet tussen, dan ben je voor die klant geen optie meer. Er is geen tweede pagina om nog op gevonden te worden, en geen advertentiepositie om te kopen.",
    },
    {
      type: "callout",
      text: "Kort antwoord: bouw pagina's die één vraag volledig beantwoorden, met feiten, schema en consistente merkinfo. Test zelf wat AI nu zegt over jouw markt. Verbeter wat ontbreekt. Herhaal.",
    },
    {
      type: "interactive",
      id: "checklist-meter",
      eyebrow: "AI-citatie-check",
      title: "Onzichtbaar-in-chat-meter",
      intro:
        "Vink aan wat klopt. Hoe hoger, hoe groter de kans dat ChatGPT en Gemini je overslaan terwijl concurrenten wél genoemd worden.",
      storageKey: "mm-ai-onzichtbaar",
      eventName: "ai_onzichtbaar_complete",
      sharePath: "/kennisbank/ai-zoek-vindbaarheid-chatgpt",
      scoreNoun: "onzichtbaarheid",
      ctaHref: "/diensten/ai-zoek",
      ctaLabel: "AI-antwoorden",
      checks: [
        {
          id: "test",
          label: "Je test nooit zelf wat AI zegt over jouw markt",
          fix: "Tien klantvragen per maand. Noteer wie genoemd wordt.",
        },
        {
          id: "antwoord",
          label: "Pagina's openen met sfeer i.p.v. een extracteerbaar antwoord",
          fix: "Antwoord in alinea één. Koppen die één vraag pakken.",
        },
        {
          id: "schema",
          label: "Schema, auteur of NAP is inconsistent of ontbreekt",
          fix: "Machines moeten weten wie je bent. Schema en dezelfde feiten overal.",
        },
        {
          id: "bulk",
          label: "Reactie is meer blogs uploaden zonder diepte",
          fix: "Citeerbare antwoorden + bewijs. Volume zonder feiten is lucht.",
        },
        {
          id: "brand",
          label: "Merk en cases zijn zwak; alleen generieke dienstenpagina's",
          fix: "Cases, ranges, concrete mening. AI citeert bewijs, niet fluff.",
        },
        {
          id: "dubbel",
          label: "Je bouwt aparte AI-sites naast Google-content",
          fix: "Eén sterke pagina voedt beide. Twee stacks is onderhoudsdrama.",
        },
        {
          id: "b2b",
          label: "Lange B2B-vragen blijven onbeantwoord op de site",
          fix: "Schrijf de vraag die beslissers in chat typen. Feitelijk, met bereik.",
        },
        {
          id: "seo-split",
          label: "SEO en AI-antwoorden zijn twee losse hobby's",
          fix: "Eén contentplan. Sterke pagina's helpen Google én chat.",
        },
      ],
      tiers: [
        {
          id: "citeer",
          min: 0,
          max: 24,
          label: "Citeerbaar",
          quip: "Je hebt antwoorden die machines kunnen pakken. Blijf testen.",
        },
        {
          id: "half",
          min: 25,
          max: 49,
          label: "Half zichtbaar",
          quip: "Eén money-vraag deze week hard beantwoorden. Meet of AI volgt.",
        },
        {
          id: "mist",
          min: 50,
          max: 74,
          label: "Mist in de chat",
          quip: "Concurrenten vullen het antwoord. Jij hebt fluff. Fix extracteerbaarheid.",
        },
        {
          id: "weg",
          min: 75,
          max: 100,
          label: "Optie nul",
          quip: "Voor die klant bestaat jouw merk niet. Stop bulk. Bouw antwoorden.",
        },
      ],
    },
    {
      type: "h2",
      text: "Hoe ChatGPT en Gemini kiezen wie ze noemen",
    },
    {
      type: "p",
      text: "ChatGPT, Gemini en vergelijkbare tools verzinnen antwoorden niet uit het niets. Ze leunen op wat ze kunnen crawlen en begrijpen: heldere pagina's, duidelijke structuur en tekst die een vraag echt beantwoordt. Vaag geformuleerde marketingpraat wordt vrijwel nooit geciteerd. Concreet en feitelijk wint van wollig en wervend.",
    },
    {
      type: "ul",
      items: [
        "Structured data helpt systemen snappen wie je bent, wat je verkoopt en voor wie.",
        "Pagina's die één vraag volledig beantwoorden worden vaker als bron gebruikt dan lange verzamelpagina's.",
        "Consistentie telt: naam, dienst en regio overal hetzelfde beschreven, anders daalt vertrouwen.",
        "Bewijs wint: cases, werkwijze, concrete ranges. Algemene tips klinken als iedereen.",
      ],
    },
    {
      type: "callout",
      text: "Leuk detail: van alles wat mensen in Google typen is zo'n 15 procent nog nooit eerder gezocht. In AI-chats stellen mensen vollere, persoonlijkere vragen. Wie die vragen beantwoordt, pakt vraagstukken waar klassieke keyword-tools nog stil over zijn.",
    },
    {
      type: "h2",
      text: "Waarom Google-ranking niet genoeg is",
    },
    {
      type: "p",
      text: "Je kunt prima op pagina 1 staan en toch ontbreken in een AI-antwoord. Vaak omdat je pagina rankt op een term, maar bovenaan geen extracteerbaar antwoord heeft. Of omdat een concurrent een kortere, feitelijkere pagina heeft die makkelijker te citeren is. SERP-positie en citeerbaarheid zijn verwante sporten, geen twins.",
    },
    {
      type: "p",
      text: "Ik bouw eerst landings op vragen die klanten echt stellen. Diezelfde vragen belanden nu ook in ChatGPT. Wie die antwoorden scherp heeft, voedt Google én AI tegelijk. Dat is geen tweede project. Dat is hetzelfde contentplan met strengere eisen aan duidelijkheid.",
    },
    {
      type: "h2",
      text: "Wat je deze maand al kunt doen",
    },
    {
      type: "p",
      text: "Begin met de vragen die klanten je aan de telefoon stellen. Zet elk antwoord op een eigen, goed gestructureerde pagina met nette koppen en een antwoordblok bovenaan. Voeg schema toe waar het past. Check daarna zelf in ChatGPT en Gemini wat er gebeurt als je naar jouw dienst in jouw regio vraagt.",
    },
    {
      type: "ul",
      items: [
        "Maak een lijst van 10 queries uit sales en support, niet uit een keywordtool alleen.",
        "Schrijf per query één pagina met een antwoord in de eerste alinea.",
        "Link vanuit die pagina naar je money-page of contact, met een natuurlijke anker.",
        "Hertest na publicatie. Noteer wie wél genoemd wordt en wat die pagina anders doet.",
      ],
    },
    {
      type: "h2",
      text: "Bulk AI-content maakt het erger",
    },
    {
      type: "p",
      text: "Vijftig gemiddelde blogs uploaden voelt productief. Voor AI-citaten is het vaak giftig. Modellen zoeken bronnen met scherpte, niet met volume. Als jouw site klinkt als het gemiddelde van het internet, is er weinig reden om jou te noemen. Gebruik AI om te structureren. Lever zelf de feiten, cases en mening.",
    },
    {
      type: "h2",
      text: "AI Overviews en ChatGPT: dezelfde discipline",
    },
    {
      type: "p",
      text: "Google AI Overviews en chat-antwoorden belonen vergelijkbare dingen: extracteerbare antwoorden, bewijs, schema, consistente merkinfo. Wie alleen voor klassieke rankings blogt zonder antwoordblokken, mist beide. Eén contentplan, strengere eisen. Zie ook het artikel over AI Overviews en clicks.",
    },
    {
      type: "h2",
      text: "Wat ik in audits als eerste check",
    },
    {
      type: "ul",
      items: [
        "Heeft elke money-page een antwoord in de eerste alinea, of alleen sfeer?",
        "Kloppen naam, diensten en regio over site, GBP en LinkedIn heen?",
        "Zijn cases zo specifiek dat een model ze kan citeren zonder fluff?",
        "Staat er schema op Organization, FAQ en Product waar het past?",
        "Word jij genoemd als ik de top 5 klantvragen in ChatGPT typ?",
      ],
    },
    {
      type: "p",
      text: "Mijn volgorde: organische landings scherp, daarna pas ads. Dezelfde landings voeden nu ook AI-antwoorden. Unieke keuzes per productlijn zijn precies wat generieke AI-blogs niet kunnen nabootsen.",
    },
    {
      type: "h2",
      text: "Waarom dit nu instappen loont",
    },
    {
      type: "p",
      text: "SEO in 2010 was makkelijker scoren omdat bijna niemand het serieus nam. Vindbaarheid in AI-antwoorden zit nu in een vergelijkbare vroege fase. De technische basis overlapt met goede SEO, dus werk dat je nu doet betaalt dubbel uit: beter vindbaar in Google én in de antwoorden waar je klanten steeds vaker zitten.",
    },
    {
      type: "p",
      text: "Wil je dit structureel aanpakken? Op mijn hub over vindbaarheid in AI leg ik uit hoe ik audits en antwoordpagina's aanpak. Liever eerst zelf testen? Prima. Typ je belangrijkste vraag in ChatGPT. Als jij er niet staat, weet je genoeg om te beginnen.",
    },
  ],
};
