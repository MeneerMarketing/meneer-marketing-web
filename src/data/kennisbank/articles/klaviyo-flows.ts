import type { KennisbankArticle } from "@/data/kennisbank/types";

export const KLAVIYO_FLOWS: KennisbankArticle = {
  slug: "klaviyo-flows-elke-shop-nodig",
  title: "Klaviyo flows die elke Shopify-shop minimaal zou moeten hebben",
  description:
    "Welkom, abandoned cart, post-purchase, win-back. Niet twintig flows, vier goede. Zo bouw je e-mail die retentie oplevert in plaats van inbox-ruis.",
  publishedAt: "2026-07-08",
  modifiedAt: "2026-08-08",
  readMinutes: 10,
  category: "behoud",
  keywords: [
    "klaviyo flows",
    "email marketing shopify",
    "klaviyo shopify setup",
    "e-mailautomatisering webshop",
  ],
  dienstSlugs: ["email", "retentie", "automatisering"],
  faqs: [
    {
      question: "Welke Klaviyo flows moet ik eerst hebben?",
      answer:
        "Welcome, abandoned cart, post-purchase en win-back. Vier die draaien en omzet tonen winnen van twintig half-af templates.",
    },
    {
      question: "Hoe meet ik of een flow werkt?",
      answer:
        "Omzet per flow en plaatsingsrate. Open rate is signal. Revenue is de score. Unsubscribe-spikes betekenen dat je te hard of te irrelevant mailt.",
    },
    {
      question: "Moet ik meteen browse abandonment bouwen?",
      answer:
        "Nee. Eerst de basis stabiel, data schoon, consent op orde. Fancy flows op een lekkende checkout zijn verspilling.",
    },
  ],
  sections: [
    {
      type: "p",
      text: "Klaviyo kan alles. Dat is het probleem. Je opent het platform, ziet honderd templates en denkt: ik moet een automation-imperium bouwen. Vier weken later heb je één welkomstmail en een abandoned cart die te agressief is. Beter: start met vier flows die bijna elke serieuze Shopify-shop nodig heeft. Werkend, meetbaar, uitbreidbaar. De rest is bonus als deze staan.",
    },
    {
      type: "callout",
      text: "Kort antwoord: welcome, cart, post-purchase, win-back. Meet omzet per flow. Segmenteer B2B en B2C. Koppel suppressions aan ads.",
    },
    {
      type: "h2",
      text: "Welkomstserie",
    },
    {
      type: "p",
      text: "Trigger: iemand meldt zich aan voor je nieuwsbrief of maakt een account. Doel: vertrouwen en eerste aankoop of verdieping. Drie mails verspreid over een week werkt vaak beter dan één dikke brochure.",
    },
    {
      type: "ul",
      items: [
        "Eerste mail: wie ben je, wat mag de lezer verwachten, geen verkoopstorm.",
        "Tweede mail: sterke producten of diensten met bewijs.",
        "Derde mail: zachte CTA met duidelijke waarde, korting alleen als het bij je merk past.",
      ],
    },
    {
      type: "h2",
      text: "Abandoned cart",
    },
    {
      type: "p",
      text: "De geldmachine die niemand mag verwaarlozen. Segment op checkout started, exclude recent buyers, herstel mand via dynamische link. Timing: uur, dag, dag drie. Meet omzet per flow, niet alleen open rate. Ik schreef er een apart artikel over als je dieper wilt.",
    },
    {
      type: "h2",
      text: "Post-purchase",
    },
    {
      type: "p",
      text: "Na een order is iemand warm. Gebruik dat voor review-verzoek, gebruikstips, cross-sell die logisch is. Niet: koop nog tien dingen de dag na levering. Bij SkinComplete-style producten: uitleg over gebruik werkt beter dan hard sell.",
    },
    {
      type: "callout",
      text: "Herhalende klanten zijn vaak vijf tot zeven keer goedkoper om te winnen dan nieuwe. Post-purchase is waar je dat verschil pakt.",
    },
    {
      type: "h2",
      text: "Win-back",
    },
    {
      type: "p",
      text: "Trigger: geen aankoop in X dagen, afhankelijk van je productcyclus. Doel: terugwinnen zonder wanhoop. Herinner aan waarde, nieuw assortiment, eventueel incentive als marge het toelaat. X bij matrassen is anders dan bij consumables.",
    },
    {
      type: "h2",
      text: "Wat je niet meteen bouwt",
    },
    {
      type: "p",
      text: "Browse abandonment, sunset flows, VIP-tiers, birthday mails met confetti. Allemaal leuk later. Eerst de basis stabiel, data schoon, consent op orde. E-mailmarketing op een lekkende checkout is verspilling.",
    },
    {
      type: "h2",
      text: "Segmentatie die wél telt",
    },
    {
      type: "p",
      text: "Scheid kopers van niet-kopers. Scheid B2B van B2C als je beide hebt. Stuur geen consumentenmail naar een salon die via het portal bestelt. SkinComplete heeft die scheiding in de shop; je e-mail moet dat spiegelen.",
    },
    {
      type: "callout",
      text: "Heet take: twintig half-afgemaakte Klaviyo-flows zijn erger dan vier die echt draaien en omzet tonen in het dashboard.",
    },
    {
      type: "h2",
      text: "Koppeling met ads en SEO",
    },
    {
      type: "p",
      text: "E-mail is geen eiland. Lijstgroei komt van site en content. Retentie verlaagt je afhankelijkheid van ads. Flows die werken, geven je budget voor acquisitie omdat bestaande klanten al meedoen. Op mijn pagina's over Klaviyo specialist en e-mailmarketing leg ik die keten uit.",
    },
  ],
};
