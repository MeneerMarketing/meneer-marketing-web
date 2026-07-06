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
        "Als je niet helder hebt welk kanaal nu de meeste marge oplevert, of als je site nog niet converteert. Dan is adverteren water in een emmer met gaten. We brengen eerst doelen, data en volgorde in kaart.",
    },
    {
      question: "Krijg ik een dik rapport dat in een la verdwijnt?",
      answer:
        "Nee. Je krijgt een plan met prioriteiten, budget en volgorde. En omdat ik ook bouw en campagnes draai, wordt het plan uitgevoerd. Geen PDF dat niemand opent.",
    },
    {
      question: "Werken jullie met vaste marketingpakketten?",
      answer:
        "Nee. BestRest kreeg per productlijn een eigen route. SkinComplete eerst SEO en mail. Jouw fase bepaalt de volgorde, niet een standaard funnel.",
    },
    {
      question: "Wat meet je om te weten of de strategie werkt?",
      answer:
        "Omzet per kanaal, kosten per lead of sale, en of de volgende stap logisch is. Geen vanity metrics. Als iets niet rendeert, schuiven we budget of stoppen we.",
    },
  ],
  bouwen: [
    {
      question: "Bouwen jullie met WordPress of page builders?",
      answer:
        "Nee. Websites in Next.js en Shopify custom build from scratch. Geen template dat je over een jaar tegen de plinten loopt. Wel code die meegroeit met campagnes en SEO.",
    },
    {
      question: "Kan ik later nog landingspagina's toevoegen voor ads?",
      answer:
        "Ja, dat is precies waarom we from scratch bouwen. Landings, snelheid en structuur zitten in het fundament. Je hoeft niet alles opnieuw te laten doen als je opschaalt.",
    },
    {
      question: "Bouwen jullie ook B2B-portalen in Shopify?",
      answer:
        "Ja. SkinComplete heeft een volledig B2B-portaal: salons loggen in, zien eigen prijzen en bestellen 24/7. Eén shop, twee gezichten. Geen los systeem ernaast.",
    },
    {
      question: "Hoe lang duurt een traject gemiddeld?",
      answer:
        "Hangt af van scope. Een strakke landingspagina is weken. Een volledige shop met portaal is maanden. Na intake krijg je een realistische planning, geen vage belofte.",
    },
  ],
  vindbaarheid: [
    {
      question: "Doen jullie ook vindbaarheid in ChatGPT en AI-antwoorden?",
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
        "Vaak SEO en site eerst, ads als versterker. SkinComplete domineerde organisch vóór paid. Ads op een zwakke site zijn duur pleisterwerk.",
    },
    {
      question: "Schrijven jullie bulk AI-content?",
      answer:
        "Nee. Antwoord-pagina's die één vraag echt beantwoorden. Bulk-ruis rankt kort en verdwijnt. Wij schrijven voor mensen én voor AI die bronnen zoekt.",
    },
  ],
  campagnes: [
    {
      question: "Welke advertentiekanalen beheren jullie?",
      answer:
        "Google Ads (Search, Shopping, Performance Max waar het past) en Meta Ads (Facebook en Instagram). Expliciet benoemd, niet verstopt achter vage termen.",
    },
    {
      question: "Wat heb ik nodig voordat campagnes live gaan?",
      answer:
        "Tracking die klopt, landings die matchen met je advertentie, en een site die converteert. Anders betaal je voor klikken die nergens landen.",
    },
    {
      question: "Werken jullie met influencers en UGC?",
      answer:
        "Ja. Bij SkinComplete leveren creators content die ook in Meta-campagnes terugkomt. Geen stock die niemand gelooft.",
    },
    {
      question: "Hoe vaak sturen jullie campagnes bij?",
      answer:
        "Wekelijks op data, niet op gevoel. Zoektermen, landings, budget naar winnaars. Wat lekt gaat eruit. Geen set-and-forget.",
    },
  ],
  behoud: [
    {
      question: "Waarom e-mail en automatisering vóór je ads opschaalt?",
      answer:
        "Een nieuwe klant werven kost al snel vijf keer meer dan een bestaande behouden. Flows vangen bezoekers op die nog niet kochten. Anders lekt je advertentiebudget.",
    },
    {
      question: "Welke tools gebruiken jullie voor automatisering?",
      answer:
        "Klaviyo voor e-commerce mail, n8n voor koppelingen tussen shop, boekhouding en Slack. De tool volgt het proces, niet andersom.",
    },
    {
      question: "Kunnen jullie bestaande flows verbeteren?",
      answer:
        "Ja. Vaak staat er al iets. Wij meten opens, clicks en omzet per flow en schroeven aan wat rendeert. Geen alles-opnieuw tenzij het echt nodig is.",
    },
    {
      question: "Wat is het verschil tussen behoud en alleen e-mail sturen?",
      answer:
        "Behoud is het hele systeem: mail, portaal, koppelingen, retentie. E-mail is één kanaal. Wij kijken waar klanten afhaken en dichten dat gat.",
    },
  ],
};

export function getPillarFaqs(slug: PillarSlug): readonly PillarFaqItem[] {
  return PILLAR_FAQS[slug];
}
