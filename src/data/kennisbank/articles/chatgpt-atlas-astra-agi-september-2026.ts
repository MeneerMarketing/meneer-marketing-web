import type { KennisbankArticle } from "@/data/kennisbank/types";

export const CHATGPT_ATLAS_ASTRA_AGI_SEPTEMBER_2026: KennisbankArticle = {
  slug: "chatgpt-atlas-astra-agi-september-2026",
  title: "Wat is AGI, wat is Astra, en waarom roept iedereen dat het groot is?",
  description:
    "AGI uitgelegd in gewone taal. Wat GPT-6 Astra doet, waarom het hyped is, en hoe het zich verhoudt tot Claude. Plus wat jij als ondernemer ermee moet.",
  publishedAt: "2026-09-10",
  modifiedAt: "2026-09-10",
  readMinutes: 12,
  category: "vindbaarheid",
  keywords: [
    "wat is agi",
    "gpt-6 astra",
    "openai astra uitleg",
    "astra vs claude",
    "chatgpt agi 2026",
    "ai marketing uitleg",
  ],
  dienstSlugs: ["ai-zoek", "content-marketing", "seo", "automatisering"],
  faqs: [
    {
      question: "Wat is AGI in simpele taal?",
      answer:
        "Artificial General Intelligence betekent: AI die net zo flexibel is als een slim mens. Niet alleen goed in één taak, maar overal redelijk mee kan. Vandaag zijn modellen al sterk in tekst, code en beeld, maar ze missen nog context, geheugen en betrouwbaarheid over lange tijd. AGI is daarom een richting, geen knop die vandaag omgaat.",
    },
    {
      question: "Wat is GPT-6 Astra?",
      answer:
        "Astra is het nieuwe topmodel van OpenAI (september 2026). Het is slimmer in redeneren, langere taken afmaken, code schrijven en zelfstandig stappen zetten op een computer. Denk aan een assistent die niet alleen antwoord geeft, maar ook echt werk uitvoert: onderzoek, documenten, sites bouwen.",
    },
    {
      question: "Is Astra echt AGI?",
      answer:
        "OpenAI zegt dat we in de buurt komen. Sam Altman noemde AGI eerder zelfs een marketingwoord. Feitelijk: Astra is een grote sprong, maar nog geen sci-fi superintelligentie. Handig om te weten wat het wél kan, niet om paniek te kopen op een headline.",
    },
    {
      question: "Hoe verhoudt Astra zich tot Claude?",
      answer:
        "ChatGPT (met Astra) wint bij massa en alledaagse vragen. Claude wint vaak bij zwaardere code, lange documenten en voorzichtiger redeneren. Astra pusht harder op zelfstandig werken en snelheid. Claude pusht harder op betrouwbaarheid in grote projecten. Beide worden beter. Geen absolute winnaar voor alles.",
    },
    {
      question: "Moet ik als marketeer nu iets doen?",
      answer:
        "Ja, maar nuchter. Test wat ChatGPT en Claude zeggen over jouw markt. Zorg dat je site duidelijke antwoorden heeft met bewijs. AI wordt het eerste adviespunt vóór Google. Wie daar niet staat, mist klanten. Je hoeft geen AGI-expert te worden.",
    },
  ],
  sections: [
    {
      type: "p",
      text: "Je ziet het overal: AGI, Astra, nieuwe era, game changer. LinkedIn vol met screenshots. Ondernemers vragen me: moet ik nu alles omgooien? Meestal na een kop waar iemand roept dat kunstmatige algemene intelligentie er is. Ik leg het uit zonder rocket science. Wat het woord betekent, wat Astra echt is, waarom het zo hyped is, en hoe het zich verhoudt tot Claude. Atlas laat ik links liggen. Dat was OpenAI's browser-experiment. Leuk nieuws een tijdje geleden, maar niet waar het nu om draait.",
    },
    {
      type: "callout",
      text: "In één zin: AGI is het einddoel (AI die breed slim is). Astra is het nieuwste grote model van OpenAI dat daar een stuk dichterbij komt. Hype komt omdat het sneller en zelfstandiger werkt dan vorige modellen. Jij hoeft geen filosoof te zijn. Wel te snappen wat je klant merkt.",
    },
    {
      type: "interactive",
      id: "hot-take",
      eyebrow: "Eerlijk antwoord",
      title: "Wat denk jij bij AGI-nieuws?",
      prompt: "Kies je reflex. Ik zeg wat ik ervan vind.",
      options: [
        {
          id: "paniek",
          label: "AGI is er, mijn bedrijf is te laat",
          verdict:
            "Te snel. Modellen worden beter, ja. Jouw site, reviews en content blijven gewoon belangrijk. Paniek kost tijd.",
          tone: "ouch",
        },
        {
          id: "negeren",
          label: "Marketingpraat, ik negeer het",
          verdict:
            "Half waar dat het hyped is. Maar je klant vraagt wél vaker ChatGPT i.p.v. Google. Dat negeren kost omzet.",
          tone: "ouch",
        },
        {
          id: "snap",
          label: "Ik wil weten wat het woord betekent en wat er verandert",
          verdict:
            "Precies. Begrijpen wat AGI bedoelt, wat Astra kan, en wat jij ermee doet. Rest is ruis.",
          tone: "win",
        },
        {
          id: "tool",
          label: "Ik koop meteen het duurste AI-abonnement",
          verdict:
            "Abonnement helpt als je het gebruikt. Zonder plan voor content en vindbaarheid koop je vooral FOMO.",
          tone: "meh",
        },
      ],
    },
    {
      type: "h2",
      text: "Wat is AGI? (gewone taal)",
    },
    {
      type: "p",
      text: "AGI staat voor Artificial General Intelligence. Nederlands: kunstmatige algemene intelligentie. Klinkt groot. In de praktijk betekent het: AI die niet alleen één ding kan, zoals schaken of vertalen, maar veel verschillende taken op menselijk niveau aankan. Strategie bedenken, tekst schrijven, code fixen, een planning maken, uitleggen waarom iets misgaat. Zonder dat je voor elke taak een apart model moet trainen.",
    },
    {
      type: "p",
      text: "Wat we nu hebben zijn sterke modellen die indrukwekkend lijken op AGI, maar nog niet alles even goed doen. Ze hallucineren soms. Ze vergeten context. Ze zijn briljant in één chat en dom in de volgende. Daarom is AGI geen ja/nee-knop op een bepaalde datum. Het is een spectrum. OpenAI zegt: we komen dichterbij. Critici zeggen: jullie verkopen een label. Beide kunnen tegelijk waar zijn.",
    },
    {
      type: "ul",
      items: [
        "Smalle AI: één taak, één doel. Denk aan spamfilter of oude schaakcomputer.",
        "Sterke AI (wat we nu gebruiken): tekst, beeld, code, redeneren. Alleen nog niet betrouwbaar genoeg om alles over te laten.",
        "AGI (het doel): breed capabel, zelfstandig, nuttig in het echte werk. Dat is waar Astra het over heeft.",
      ],
    },
    {
      type: "h2",
      text: "Wat is GPT-6 Astra?",
    },
    {
      type: "p",
      text: "Astra is het nieuwe flagship-model van OpenAI, uitgebracht begin september 2026. Opvolger van GPT-5 en GPT-5.6. OpenAI noemt het hun slimste model tot nu toe. In normale mensentaal: het redeneert langer door, pakt grotere klussen aan, schrijft betere code, en kan langer zelfstandig werken aan een opdracht. Niet alleen antwoord geven, maar stappen zetten. Onderzoek doen. Een site bouwen. Een spreadsheet vullen. Een plan uitwerken.",
    },
    {
      type: "p",
      text: "Greg Brockman (president van OpenAI) zei op een persmoment dat hij gelooft dat we nu in de AGI-tijdperk zitten. Sam Altman had dagen eerder AGI nog een irrelevant marketingwoord genoemd. Dat zegt genoeg: zelfs binnen OpenAI is het geen helder feit. Wat wél helder is: Astra is een flinke stap vooruit ten opzichte van vorige modellen. Vooral voor mensen die veel met code, analyse en lange projecten werken.",
    },
    {
      type: "ul",
      items: [
        "Uitrol: eerst zware zakelijke klanten, daarna Plus, Pro, Business en Enterprise.",
        "Sterk in: redeneren, programmeren, langere taken, werken met je computer.",
        "OpenAI positioneert het direct tegen Anthropic (Claude) op de zakelijke markt.",
        "Extra veiligheidschecks omdat het model zo krachtig is. Training liep vertraging op na een veiligheidsincident in de zomer.",
      ],
    },
    {
      type: "h2",
      text: "Waarom is iedereen zo hyped?",
    },
    {
      type: "p",
      text: "Drie redenen. Eén: het voelt alsof de sprong groter is dan bij vorige updates. Vorig jaar dacht je nog: leuk hulpmiddel. Nu zie je demo's waar het model een uur lang doorwerkt zonder dat jij elke klik hoeft te geven. Twee: OpenAI roept zelf AGI, en dat triggert media, beleggers en concurrenten. Drie: bedrijven bang zijn achter te lopen. Niemand wil de baas zijn die zegt: wij wachten nog even.",
    },
    {
      type: "p",
      text: "Hype is niet hetzelfde als nut. Veel demo's zijn cherry-picked. Veel LinkedIn-posts zijn marketing. Astra is echt sterker. Maar je marketingplan staat of valt nog steeds met je site, je aanbod, je bewijs en je vindbaarheid. Niet met het woord AGI in een persbericht.",
    },
    {
      type: "callout",
      text: "Heet take: als iemand je AGI-verhaal vertelt zonder concreet te zeggen wat jij morgen anders doet, koop je theater.",
    },
    {
      type: "h2",
      text: "Astra vs Claude: wat is het verschil?",
    },
    {
      type: "p",
      text: "Ik werk met beide werelden. ChatGPT (nu met Astra) en Claude (van Anthropic). Geen fanboy. Wel praktijk. ChatGPT zit in de broekzak van iedereen. Recepten, mails, welk product kopen, welk bureau kiezen. Claude zit vaker in de werkomgeving van developers: grote codebases, voorzichtig refactoren, lange documenten lezen zonder domme shortcuts.",
    },
    {
      type: "h3",
      text: "Waar Astra (ChatGPT) nu wint",
    },
    {
      type: "ul",
      items: [
        "Bereik: meer gebruikers, meer gewoonte. Jouw klant kent ChatGPT al.",
        "Snelheid en zelfstandig werken: langere agent-taken, sneller itereren.",
        "Alledaagse vragen en marketingcopy: vlot, toegankelijk, veel talen.",
        "Integratie: desktop-app, API, Microsoft/AWS-partners. Overal aanwezig.",
      ],
    },
    {
      type: "h3",
      text: "Waar Claude nu wint",
    },
    {
      type: "ul",
      items: [
        "Zware code in bestaande projecten: minder verzonnen functies, betere context.",
        "Lange documenten en voorzichtig redeneren: soms net iets betrouwbaarder.",
        "Enterprise-focus: grote bedrijven die compliance en controle willen.",
        "Developers in Cursor en agents: Claude voelt als de stille collega die eerst leest.",
      ],
    },
    {
      type: "p",
      text: "Mijn praktijksplit: ChatGPT voor klantgerichte vragen, copy, brainstorms en wat je klant thuis gebruikt. Claude (of vergelijkbare code-agents) als je echt bouwt: Shopify, Next.js, automatisering. Astra duwt ChatGPT richting Claude-terrein op code. Claude blijft pushen op betrouwbaarheid. De kloof wordt kleiner. De keuze blijft: welke taak, welk risico, welk model.",
    },
    {
      type: "h2",
      text: "Wat betekent dit voor jouw marketing?",
    },
    {
      type: "p",
      text: "Modellen worden slimmer. Dat verandert hoe mensen zoeken en kiezen. Steeds vaker gaat iemand niet eerst naar Google, maar naar ChatGPT: welk matras, welke kliniek, welk bureau in Apeldoorn? Het antwoord noemt drie namen. Sta jij daar niet tussen, besta je voor die persoon niet. Dat is geen AGI-paniek. Dat is gewoon een nieuw kanaal.",
    },
    {
      type: "p",
      text: "Bij Skin Complete en BestRest zie ik hetzelfde: pagina's die één vraag helder beantwoorden, met echte info, worden vaker geciteerd dan mooie homepages zonder inhoud. Astra maakt AI slimmer. Jouw site moet slimmer overkomen voor die AI. Duidelijke koppen, feiten bovenaan, FAQ's, schema markup, snelle laadtijd.",
    },
    {
      type: "ul",
      items: [
        "Schrijf tien vragen die klanten aan ChatGPT stellen. Test ze maandelijks.",
        "Eén pagina per belangrijke vraag. Antwoord in alinea één. Bewijs eronder.",
        "Gebruik AI om te structureren en te analyseren. Jij blijft eindredacteur.",
        "Jij blijft eindredacteur: check altijd voordat AI iets live zet in ads of op je site.",
      ],
    },
    {
      type: "h2",
      text: "Waar ik sceptisch over blijf",
    },
    {
      type: "p",
      text: "OpenAI bereidt een beursgang voor. AGI in een headline helpt daarbij. Tegelijk waarschuwt Altman dat volgende modellen sobering kunnen zijn. Dat klopt. Krachtiger modellen betekenen ook meer risico als je ze blind vertrouwt. Voor jouw bedrijf blijft de vraag simpel: als iemand morgen vraagt welke oplossing past, noemt AI jouw naam? Zo niet, werk aan zichtbaarheid. Niet aan definities.",
    },
    {
      type: "p",
      text: "AGI is het grote woord. Astra is het nieuwe model. Claude is de serieuze concurrent op code en enterprise. Hype komt en gaat. Jouw content, cases en reviews blijven staan. Blijf uitleggen wat je doet, voor wie, en met welk resultaat. Dan maakt het minder uit welk model de headline van de week is.",
    },
  ],
};
