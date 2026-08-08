import type { KennisbankArticle } from "@/data/kennisbank/types";

export const CONCURRENT_HOGER_IN_GOOGLE: KennisbankArticle = {
  slug: "concurrent-hoger-in-google",
  title: "Concurrent hoger in Google met een lelijkere site: waarom",
  description:
    "Design rankt niet. Snelheid, zoekintentie en autoriteit wel. Zo haal je een concurrent in die er minder strak uitziet.",
  publishedAt: "2026-07-06",
  modifiedAt: "2026-08-08",
  readMinutes: 14,
  category: "vindbaarheid",
  keywords: [
    "concurrent hoger in google",
    "waarom rankt concurrent hoger",
    "hoger in google tips",
    "seo snelheid ranking",
  ],
  dienstSlugs: ["seo", "optimalisatie", "webdevelopment"],
  faqs: [
    {
      question: "Waarom rankt mijn concurrent hoger met een lelijkere site?",
      answer:
        "Google is geen designjury. Meestal wint intentie, snelheid, interne links of autoriteit. Mooi helpt. Mooi zonder antwoord en Core Web Vitals niet.",
    },
    {
      question: "Kan ik hen inhalen zonder meer backlinks?",
      answer:
        "Vaak wel op long-tail en pagina's die bijna ranken. Verbeter intentie, diepte en interne links eerst. Links helpen, maar zijn niet altijd de bottleneck.",
    },
    {
      question: "Wat moet ik deze week doen?",
      answer:
        "Kies één term waar je op pagina 2 staat. Vergelijk top 3. Verbeter die ene URL. Link ernaartoe vanaf sterke pagina's. Meet over twee tot vier weken.",
    },
    {
      question: "Helpt een redesign tegen een lelijke concurrent?",
      answer:
        "Alleen als je ook sneller, scherper en relevanter wordt. Redesign zonder intentie is een dure spiegel.",
    },
    {
      question: "Wanneer is ads de snellere route?",
      answer:
        "Als je morgen omzet nodig hebt en één landings al converteert. SEO blijft de lange motor. Ads is de brug, niet de excuus om de site te laten lekken.",
    },
  ],
  sections: [
    {
      type: "p",
      text: "Je site is mooier. Zeker weten. Betere foto's, strakkere typografie, een hero waar je trots op bent. Je concurrent heeft een site uit 2019 die op mobiel net niet crasht. Toch staat hij boven je. Dat voelt oneerlijk. Google is geen designjury. Google is een bibliothecaris die antwoorden wil.",
    },
    {
      type: "callout",
      text: "Mijn eerste check is nooit 'wie heeft mooiere kleuren'. Het is: wie beantwoordt de zoekvraag sneller, duidelijker en met meer bewijs.",
    },
    {
      type: "interactive",
      id: "hot-take",
      eyebrow: "Eerlijkheidstest",
      title: "Wat doe jij als eerste?",
      prompt:
        "Je concurrent staat hoger. Je hebt één sprint. Kies je zet. Ik zeg wat ik ervan vind.",
      options: [
        {
          id: "redesign",
          label: "Nieuwe homepage, want die van hen is lelijk",
          verdict:
            "Ego-zet. Als hun lelijke pagina de vraag beter beantwoordt, blijf je onder ze staan. Fix intentie en snelheid eerst. Mooi mag daarna.",
          tone: "ouch",
        },
        {
          id: "one-url",
          label: "Eén pagina op pagina 2 keihard verbeteren",
          verdict:
            "Dit is hoe ik werk. Eén URL, top 3 naast elkaar, antwoord bovenaan, interne links, CWV. Saai. Effectief.",
          tone: "win",
        },
        {
          id: "fifty-blogs",
          label: "Vijftig AI-blogs over hetzelfde thema",
          verdict:
            "Volume zonder scherpte. Je dilueert je eigen autoriteit. Liever drie pagina's die écht winnen.",
          tone: "ouch",
        },
        {
          id: "ads-only",
          label: "Budget verdubbelen in Google Ads, SEO later",
          verdict:
            "Mag als landings en tracking kloppen en je morgen cashflow nodig hebt. Als permanente vervanging van SEO: dure gewoonte.",
          tone: "meh",
        },
      ],
    },
    {
      type: "h2",
      text: "Snelheid wint van pretty",
    },
    {
      type: "p",
      text: "Core Web Vitals zijn geen nerddetail. Trage sites haken af op mobiel. Google meet dat. Gebruikers meten dat harder. Hij laadt misschien in 1,8 seconden. Jij in 4,2 met een slider, vier scripts en een cookiebanner die half scherm pakt.",
    },
    {
      type: "ul",
      items: [
        "LCP: laadt je hoofdbeeld snel genoeg?",
        "INP: reageert je site direct op tikken?",
        "CLS: springt layout niet tijdens laden?",
      ],
    },
    {
      type: "h2",
      text: "Intentie wint van alles-willen-zijn",
    },
    {
      type: "p",
      text: "Zijn pagina over 'google ads bureau arnhem' gaat over Google Ads in Arnhem. Jouw pagina gaat over het bureau, de visie, vijf diensten, vacatures en een blog over kerst. Google kiest de pagina die één vraag beantwoordt. Specifiek wint van breed en trots.",
    },
    {
      type: "p",
      text: "Daarom bouw ik landings per intentie als je hoger in Google wilt. Niet omdat blogs fout zijn. Omdat een blog zelden de koopvraag wint van een pagina die die koopvraag frontaal beantwoordt.",
    },
    {
      type: "h2",
      text: "Autoriteit wint van nieuw",
    },
    {
      type: "p",
      text: "Hij rankt al langer. Heeft meer links, meer vermeldingen, meer reviews, consistenter Google Business Profile. SEO is geen sprint. Wel kun je snelle wins pakken op pagina's die nu op pagina 2 staan terwijl ze bijna goed genoeg zijn.",
    },
    {
      type: "h2",
      text: "Hoe ik een concurrent naast jouw URL leg",
    },
    {
      type: "ul",
      items: [
        "Open hun ranking-URL en de jouwe naast elkaar. Waar staat het antwoord?",
        "Tel unieke secties die de vraag écht helpen. Negeer fluff.",
        "Check interne links: hoeveel sterke pagina's stemmen op hun URL?",
        "Check mobiele snelheid, niet alleen desktop Lighthouse voor de show.",
        "Check of zij schema, FAQ en auteur hebben en jij alleen sfeer.",
      ],
    },
    {
      type: "h2",
      text: "Mijn werkvolgorde (niet sexy, wel scherp)",
    },
    {
      type: "p",
      text: "Eerst meten wat er al binnenkomt. Dan de zwakste schakel: te traag, te vaag, te weinig bewijs. Dan één money-URL of bijna-winnaar aanscherpen. Interne links. Pas daarna praten over meer content of meer ads. Ik haat parallelle half-projecten. Eén hefboom per sprint.",
    },
    {
      type: "callout",
      text: "Mooi zonder snelheid is een museum. Zorg dat je site een kassa heeft.",
    },
    {
      type: "h2",
      text: "Wat je deze week kunt doen",
    },
    {
      type: "ul",
      items: [
        "PageSpeed op mobiel voor je belangrijkste landings.",
        "Google de term die je wilt winnen. Open top 3. Wat doen zij dat jij niet doet?",
        "Eén pagina kiezen die bijna rankt. Die verbeteren in plaats van een nieuwe blog stapelen.",
        "Interne links vanaf je sterke URL's naar die pagina.",
      ],
    },
    {
      type: "p",
      text: "Wil je dit structureel aanpakken? Op mijn pagina over hoger in Google leg ik de route uit: intentie, fundament, pagina's, bijsturen. Concurrent inhalen begint bij één URL die beter antwoordt. Niet bij een redesign dat alleen je ego streelt.",
    },
    {
      type: "h2",
      text: "Wat ik níet doe als iemand 'de concurrent' noemt",
    },
    {
      type: "p",
      text: "Ik bouw geen kopie van hun site. Ik bouw een scherpere antwoordmachine op de query die jij wilt winnen. Soms betekent dat minder pagina's, meer diepte. Soms betekent dat hun blog winnen met een dienstenpagina die wél de koopvraag pakt. De concurrent is een spiegel, geen blauwdruk.",
    },
    {
      type: "p",
      text: "En als hun voorsprong puur autoriteit is? Dan zeg ik dat hardop. Links en tijd koop je niet met een nieuwe homepage. Je wint dan op snelle pagina's, betere antwoorden en lokale signalen terwijl je autoriteit bijbouwt. Eerlijk plan. Minder theater.",
    },
  ],
};
