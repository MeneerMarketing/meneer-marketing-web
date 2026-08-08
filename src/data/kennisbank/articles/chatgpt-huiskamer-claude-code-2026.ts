import type { KennisbankArticle } from "@/data/kennisbank/types";

export const CHATGPT_HUISKAMER_CLAUDE_CODE_2026: KennisbankArticle = {
  slug: "chatgpt-huiskamer-claude-code-2026",
  title: "ChatGPT runt de huiskamer. Claude runt de code.",
  description:
    "Iedereen vraagt ChatGPT alles: recepten, ruzies, welk product. Ondertussen heeft Claude stilletjes de programmeerwereld overgenomen. Een vrolijke veldslagverslag uit 2026.",
  publishedAt: "2026-07-18",
  modifiedAt: "2026-08-08",
  readMinutes: 12,
  category: "bouwen",
  keywords: [
    "chatgpt 2026",
    "claude ai code",
    "claude vs chatgpt",
    "ai programmeren",
    "chatgpt iedereen",
    "anthropic claude",
  ],
  dienstSlugs: ["webdevelopment", "ai-zoek", "automatisering"],
  faqs: [
    {
      question: "Is ChatGPT dan slecht geworden?",
      answer:
        "Nee. ChatGPT is overal omdat het makkelijk is, vriendelijk klinkt en in ieders zak zit. Voor marketingteksten, brainstorms en ‘leg dit uit alsof ik vijf ben’ blijft het sterk. Overal aanwezig zijn is iets anders dan overal het beste zijn.",
    },
    {
      question: "Waarom winnen developers van Claude?",
      answer:
        "In 2026 merk je het in de praktijk: grotere codebases, betere context, minder ‘sorry ik verzin een API die niet bestaat’. Cursor, agents, refactors. Claude is de stilzwijgende collega die wél de bestaande bestanden leest voordat hij gaat typen.",
    },
    {
      question: "Wat betekent dit voor mijn bedrijf?",
      answer:
        "Je klanten praten met ChatGPT. Jouw merk moet daar vindbaar zijn. Je site wordt gebouwd met tools waarin Claude-achtige agents meeschrijven. Slim: ChatGPT voor mensentaal, code-agents voor bouw. Jij blijft de baas over de richting.",
    },
    {
      question: "Moet ik beide tools leren?",
      answer:
        "Als marketeer: ChatGPT (of equivalent) dagelijks. Als je ook bouwt of met developers werkt: begrijp wat code-agents wél en niet mogen beslissen. Toolkeuze volgt taak, niet hype.",
    },
    {
      question: "Vervangt dit mijn developer of marketeer?",
      answer:
        "Nee. Het versnelt handen. Richting, smaak, marge en verantwoordelijkheid blijven menselijk. AI zonder baas is een typer zonder opdracht.",
    },
  ],
  sections: [
    {
      type: "p",
      text: "Er was een tijd dat je bij twijfel je moeder belde. Of Google. Of die ene vriend die ‘iets met computers’ deed. Die hiërarchie is officieel overleden. In 2026 belt half Nederland ChatGPT. Over pasta met broccoli. Over een rare uitslag. Over welk product je moet kopen terwijl je webshop stil staat te wachten met een scherpe landings. Over ‘schrijf een sorry-mail zonder dat ik een sukkel klink’.",
    },
    {
      type: "p",
      text: "ChatGPT is niet meer een tool. Het is huisgenoot, orakel en therapeut met een groen logo. En ergens in een andere kamer van het internet zit Claude. Minder op verjaardagen. Meer in de terminal. En eerlijk? Dit jaar heeft Claude volgens mij gewoon gewonnen. Niet de huiskamer. Wel de code.",
    },
    {
      type: "callout",
      text: "Veldslagregel 2026: ChatGPT wint het familiemoment. Claude wint de pull request.",
    },
    {
      type: "interactive",
      id: "hot-take",
      eyebrow: "Kantoor-vs-keukentafel",
      title: "Wie bel jij?",
      prompt:
        "Kies het scenario. Ik zeg welk model ik pak en waarom. Spoiler: ‘gewoon ChatGPT voor alles’ is vaak luiheid met een vriendelijk logo.",
      options: [
        {
          id: "mail",
          label: "Een lastige klantmail herschrijven",
          verdict:
            "ChatGPT. Snel, toon, varianten. Jij houdt de feiten en de grens. Model schrijft. Jij beslist of het te slap of te scherp is.",
          tone: "win",
        },
        {
          id: "liquid",
          label: "Een kapotte Shopify-snippet debuggen",
          verdict:
            "Claude (of soortgelijke code-agent) in de editor. Laat hem de bestaande file lezen. ChatGPT-chat zonder repo is giswerk met zelfvertrouwen.",
          tone: "win",
        },
        {
          id: "strategie",
          label: "Campagne-architectuur en budgetlogica",
          verdict:
            "Reasoning-model + jouw cijfers. Niet het snelle chatmodel dat ‘gewoon PMax’ roept omdat het internet dat ook zegt.",
          tone: "meh",
        },
        {
          id: "alles",
          label: "Eén model voor mails, code én strategie",
          verdict:
            "Dat is hoe je middelmatige mail, half-kapotte code en generieke strategie krijgt. Match het denkwerk aan het model. Luiheid is duur.",
          tone: "ouch",
        },
      ],
    },
    {
      type: "h2",
      text: "ChatGPT: de nieuwe ‘even vragen’",
    },
    {
      type: "p",
      text: "Open je groepschat. Iemand heeft een screenshot van ChatGPT gedeeld alsof het een ansichtkaart uit Parijs is. ‘Kijk wat hij zei over mijn LinkedIn.’ ‘Hij heeft mijn vakantieplanning gemaakt.’ We zijn collectief een relatie begonnen met een chatbot en niemand vindt het vreemd meer.",
    },
    {
      type: "ul",
      items: [
        "Recepten: ChatGPT is de schoonmoeder die nooit beledigd raakt als je toch pizza bestelt.",
        "Werkmails: ‘maak dit professioneel’ is de nieuwe spellcheck, alleen dan met ego.",
        "Koopadvies: mensen vragen een bot om een webshop te kiezen, terwijl jij net ads hebt gezet.",
        "Existentiële vragen om half twee ’s nachts: Google was nooit zo geduldig.",
      ],
    },
    {
      type: "p",
      text: "Voor marketeers is dat geen grappig detail. Dat is een kanaal. Als jouw bedrijf niet in die antwoorden voorkomt, besta je voor een deel van je doelgroep niet. Mijn volgorde blijft: eerst ergens staan waar mensen écht kijken, met scherpe antwoorden en bewijs. Daarna pas budget omhoog. Alleen kijken ze nu óók in een chatvenster.",
    },
    {
      type: "h2",
      text: "Claude: de stille coup in de code-editor",
    },
    {
      type: "p",
      text: "Ondertussen, in de programmeerwereld, gebeurt iets grappigs. Developers die vorig jaar nog ‘ik probeer alles in ChatGPT’ zeiden, openen nu Cursor, Claude, agents. Niet omdat het hip is. Omdat Claude dit jaar aanvoelt alsof hij de repo heeft gelezen, niet alleen de Stack Overflow-samenvatting.",
    },
    {
      type: "p",
      text: "Ik overdrijf een beetje. Maar ook weer niet. Refactors die vroeger een middag kostten, gaan nu in een sessie. Shopify-snippets, Next.js-routes, rare Liquid-bestanden: Claude bijt zich erin vast alsof hij persoonlijk beledigd is door legacy code. ChatGPT is de charmante presentator. Claude is de typist die om middernacht nog ‘wait, die import klopt niet’ fluistert.",
    },
    {
      type: "ul",
      items: [
        "Grote context: minder ‘welk bestand bedoelde je ook alweer?’",
        "Agent-workflows: niet één antwoord, maar een reeks stappen in je project.",
        "Minder hallucinerende API’s (niet nul, wel merkbaar minder fantasie-fetch).",
        "De cultuurshift: ‘even Claude’ is in tech-kringen wat ‘even Googlen’ was in 2012.",
      ],
    },
    {
      type: "callout",
      text: "Als het internet een kantoor was: ChatGPT staat bij de koffieautomaat. Claude zit in de serverruimte en heeft de wifi al gefixt voordat jij binnenkwam.",
    },
    {
      type: "h2",
      text: "Hoe ik beide inzet zonder tool-religie",
    },
    {
      type: "p",
      text: "Mensentaal, snelle varianten, uitleg: chatmodel. Code, refactors, tracking-debug: code-agent in de editor. Strategie: reasoning + jouw marge. De namen in de dropdown veranderen sneller dan je contentkalender. De skill blijft: match het denkwerk aan het model.",
    },
    {
      type: "h2",
      text: "Waarom dit wél grappig is (en een beetje eng)",
    },
    {
      type: "p",
      text: "We hebben de kennis van de wereld in twee persoonlijkheden gesplitst. Eentje die aardig praat tegen je tante. Eentje die TypeScript corrigeert alsof je cijfer 6 hebt gehaald voor netjes werken. Bedrijven moeten beide werelden snappen.",
    },
    {
      type: "p",
      text: "Je site moet leesbaar zijn voor mensen én citeerbaar voor AI-antwoorden. Je shop moet snel genoeg zijn zodat ads niet hun geld verbranden. Processen mogen met agents. Alleen: iemand moet nog steeds beslissen wát er gebouwd wordt. AI typt. Jij (of ik) kiest de richting. Anders krijg je weer diezelfde generieke AI-website.",
    },
    {
      type: "h2",
      text: "Mijn scorebord van 2026",
    },
    {
      type: "ul",
      items: [
        "ChatGPT: kampioen huiskamer, recepten, mails, ‘leg uit’, snelle marketingvarianten.",
        "Claude: kampioen code, refactors, agents, ‘bouw dit af zonder de boel te breken’.",
        "Google: nog steeds relevant, alleen niet meer de enige deur naar antwoorden.",
        "Jij als ondernemer: wint als je stopt met ‘welke AI is cooler’ en start met ‘waar staat mijn merk in beide werelden?’",
      ],
    },
    {
      type: "p",
      text: "Dus ja. ChatGPT neemt een stukje van de wereld over. De keukentafel, de WhatsApp-groep, de middernachtelijke twijfel. Claude neemt stilletjes de internet-codering over. Ik vind dat een heerlijke plotwending. Alsof Marvel eindelijk twee helden naast elkaar laat bestaan zonder dat er meteen een collab-film moet komen.",
    },
    {
      type: "p",
      text: "Wil je dat jouw merk wint in de chat én dat je site niet klinkt alsof een gemiddelde prompt hem heeft ontworpen? Start een intake. Ik praat gewoon Nederlands. Zelfs als mijn editor vol Claude-sporen zit.",
    },
  ],
};
