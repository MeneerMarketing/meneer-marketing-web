import type { PillarSlug } from "@/lib/navigation";

export interface PillarFaqItem {
  question: string;
  answer: string;
}

export const PILLAR_FAQS: Record<PillarSlug, readonly PillarFaqItem[]> = {
  strategie: [
    {
      question: "Wanneer begin ik met strategie in plaats van direct met ads?",
      answer:
        "Als je niet helder hebt welk kanaal nu de meeste marge oplevert, of als je site nog niet converteert. Dan is adverteren water in een emmer met gaten. Ik breng eerst doelen, data en volgorde in kaart.",
    },
    {
      question: "Krijg ik een dik rapport dat in een la verdwijnt?",
      answer:
        "Je krijgt een plan met prioriteiten, budget en volgorde. En omdat ik ook bouw en campagnes draai, wordt het plan uitgevoerd. Een PDF dat niemand opent? Dat is niet mijn aanpak.",
    },
    {
      question: "Werk je met vaste marketingpakketten?",
      answer:
        "Elk traject krijgt een eigen route. Soms eerst SEO en mail, soms per productlijn een andere volgorde. Jouw fase bepaalt de volgorde, niet een standaard funnel.",
    },
    {
      question: "Wat meet je om te weten of de strategie werkt?",
      answer:
        "Omzet per kanaal, kosten per lead of sale, en of de volgende stap logisch is. Vanity metrics laat ik links. Als iets niet rendeert, schuif ik budget of stop ik.",
    },
  ],
  bouwen: [
    {
      question: "Bouw je met WordPress of page builders?",
      answer:
        "Ik bouw websites in Next.js en Shopify custom build from scratch. Code die meegroeit met campagnes en SEO, zonder template dat je over een jaar tegen de plinten loopt.",
    },
    {
      question: "Kan ik later nog landingspagina's toevoegen voor ads?",
      answer:
        "Ja, dat is precies waarom ik from scratch bouw. Landings, snelheid en structuur zitten in het fundament. Je hoeft niet alles opnieuw te laten doen als je opschaalt.",
    },
    {
      question: "Bouw je ook B2B-portalen in Shopify?",
      answer:
        "Ja. Volledige B2B-portals: klanten loggen in, zien eigen prijzen en bestellen 24/7. Eén shop, twee gezichten. Alles in Shopify, geen los systeem ernaast.",
    },
    {
      question: "Hoe lang duurt een traject gemiddeld?",
      answer:
        "Hangt af van scope. Een strakke landingspagina is weken. Een volledige shop met portaal is maanden. Na intake krijg je een realistische planning, geen vage belofte.",
    },
  ],
  vindbaarheid: [
    {
      question: "Doe je ook vindbaarheid in ChatGPT en AI-antwoorden?",
      answer:
        "Ja, dat is een volwaardige dienst. Techniek, content en structuur zodat je pagina's citeerbaar zijn. Niet iets voor later op de roadmap.",
    },
    {
      question: "Hoe snel zie ik resultaat van SEO?",
      answer:
        "Eerste signalen vaak binnen weken op techniek en long-tail. Echte groei op competitieve termen duurt maanden. Eerlijk gezegd: wie instant belooft, liegt.",
    },
    {
      question: "SEO eerst of Google Ads eerst?",
      answer:
        "Vaak SEO en site eerst, ads als versterker. Organisch verkeer vóór paid is vaak de slimme volgorde. Ads op een zwakke site zijn duur pleisterwerk.",
    },
    {
      question: "Schrijf je bulk AI-content?",
      answer:
        "Ik schrijf antwoord-pagina's die één vraag echt beantwoorden. Bulk-ruis rankt kort en verdwijnt. Mijn copy is voor mensen én voor AI die bronnen zoekt.",
    },
  ],
  campagnes: [
    {
      question: "Welke advertentiekanalen beheer je?",
      answer:
        "Google Ads (Search, Shopping, Performance Max waar het past) en Meta Ads (Facebook en Instagram). Expliciet benoemd, niet verstopt achter vage termen.",
    },
    {
      question: "Wat heb ik nodig voordat campagnes live gaan?",
      answer:
        "Tracking die klopt, landings die matchen met je advertentie, en een site die converteert. Anders betaal je voor klikken die nergens landen.",
    },
    {
      question: "Werk je met influencers en UGC?",
      answer:
        "Ja. Creators leveren content die ook in Meta-campagnes terugkomt. Echte beelden die mensen geloven, geen stock.",
    },
    {
      question: "Hoe vaak stuur je campagnes bij?",
      answer:
        "Wekelijks op data, niet op gevoel. Zoektermen, landings, budget naar winnaars. Wat lekt gaat eruit. Set-and-forget is niet mijn werkwijze.",
    },
  ],
  behoud: [
    {
      question: "Waarom e-mail en automatisering vóór je ads opschaalt?",
      answer:
        "Een nieuwe klant werven kost al snel vijf keer meer dan een bestaande behouden. Flows vangen bezoekers op die nog niet kochten. Anders lekt je advertentiebudget.",
    },
    {
      question: "Welke tools gebruik je voor automatisering?",
      answer:
        "Klaviyo voor e-commerce mail, n8n voor koppelingen tussen shop, boekhouding en Slack. De tool volgt het proces, niet andersom.",
    },
    {
      question: "Kun je bestaande flows verbeteren?",
      answer:
        "Ja. Vaak staat er al iets. Ik meet opens, clicks en omzet per flow en schroef aan wat rendeert. Alles opnieuw alleen als het echt nodig is.",
    },
    {
      question: "Wat is het verschil tussen behoud en alleen e-mail sturen?",
      answer:
        "Behoud is het hele systeem: mail, portaal, koppelingen, retentie. E-mail is één kanaal. Ik kijk waar klanten afhaken en dicht dat gat.",
    },
  ],
};

export function getPillarFaqs(slug: PillarSlug): readonly PillarFaqItem[] {
  return PILLAR_FAQS[slug];
}
