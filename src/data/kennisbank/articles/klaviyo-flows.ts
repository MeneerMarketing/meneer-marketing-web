import type { KennisbankArticle } from "@/data/kennisbank/types";

export const KLAVIYO_FLOWS: KennisbankArticle = {
  slug: "klaviyo-flows-elke-shop-nodig",
  title: "Klaviyo flows die elke Shopify-shop minimaal zou moeten hebben",
  description:
    "Welkom, abandoned cart, post-purchase, win-back. Niet twintig flows, vier goede. Zo bouw je e-mail die retentie oplevert in plaats van inbox-ruis.",
  publishedAt: "2026-07-08",
  modifiedAt: "2026-08-08",
  readMinutes: 14,
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
    {
      question: "Hoe klinkt een goede cart-mail?",
      answer:
        "Alsof je iemand helpt die even afgeleid was. Product in beeld, bezwaar wegnemen, één CTA. Schreeuwen met drie uitroeptekens is hoe je unsubscribes koopt.",
    },
    {
      question: "Koppel ik flows aan ads?",
      answer:
        "Ja. Suppress converters en actieve flow-ontvangers uit remarketing waar het kan. Mail en ads in één retentieplan, niet als twee eilandjes.",
    },
  ],
  sections: [
    {
      type: "p",
      text: "Klaviyo kan alles. Dat is het probleem. Je opent het platform, ziet honderd templates en denkt: ik moet een automation-imperium bouwen. Vier weken later heb je één welkomstmail en een abandoned cart die te agressief is. Mijn manier: eerst vier flows die bijna elke serieuze Shopify-shop nodig heeft. Werkend. Meetbaar. Daarna pas de fancy lagen.",
    },
    {
      type: "callout",
      text: "Denk in omzet per flow, niet in aantal automations. Een dashboard vol grijze flows is geen strategie. Het is digitaal opruimschuld.",
    },
    {
      type: "h2",
      text: "Hoe ik een e-mailstack aanpak",
    },
    {
      type: "p",
      text: "Ik begin niet in de template-bibliotheek. Ik begin bij de kassa en de inbox. Waar lek je geld? Cart die stilvalt? Leads die dagen liggen? Herhaalorders die nooit een tip krijgen? Dat bepaalt de volgorde. Tool volgt proces. Niet andersom.",
    },
    {
      type: "ul",
      items: [
        "Consent en suppressions eerst, anders bouw je op drijfzand.",
        "Eén primaire metric per flow: herstel-omzet, herhaalorder, of win-back.",
        "Tone of voice als merk, niet als 'Beste klant!!!'.",
        "Pas opschalen als de basis vier weken schoon draait.",
      ],
    },
    {
      type: "interactive",
      id: "checklist-meter",
      eyebrow: "Speel even mee",
      title: "Flow-chaos-meter",
      intro:
        "Vink aan wat je herkent in je Klaviyo. Hoe hoger de score, hoe meer automation-theater en hoe minder retentie.",
      storageKey: "mm-flow-chaos-meter",
      eventName: "klaviyo_flow_chaos_complete",
      sharePath: "/kennisbank/klaviyo-flows-elke-shop-nodig",
      scoreNoun: "chaosscore",
      ctaHref: "/diensten/email",
      ctaLabel: "E-mail & retentie",
      checks: [
        {
          id: "twenty-flows",
          label: "Meer dan acht flows aan, waarvan de helft nooit omzet toont",
          fix: "Pauzeer alles behalve welcome, cart, post-purchase en win-back. Meet opnieuw.",
        },
        {
          id: "open-rate",
          label: "Je stuurt bij op open rate, niet op revenue per flow",
          fix: "Zet revenue en placed order centraal. Open rate is weerbericht, geen KPI.",
        },
        {
          id: "scream",
          label: "Cart-mail 1 schreeuwt al om korting met uitroeptekens",
          fix: "Mail 1 = herinnering + product. Incentive pas later, als marge het toelaat.",
        },
        {
          id: "b2b-mix",
          label: "Zakelijke en consumentenklanten krijgen dezelfde toon",
          fix: "Split segmenten. Een groothandel wil geen 'Hey bestie'-subject.",
        },
        {
          id: "checkout-leak",
          label: "Checkout is traag of onduidelijk, maar je bouwt wél browse abandonment",
          fix: "Fix checkout eerst. Mail vangt twijfel op, geen kapotte shop.",
        },
        {
          id: "no-exclude",
          label: "Recent buyers zitten nog in cart- of win-back flows",
          fix: "Exclude converters hard. Niemand wil een 'je vergat iets' na aankoop.",
        },
        {
          id: "ads-blind",
          label: "Remarketing en mail tikken dezelfde persoon tegelijk hard",
          fix: "Stem caps en suppressions af. Eén plan, twee kanalen.",
        },
        {
          id: "templates",
          label: "Flows zijn standaardtemplates zonder jouw producttaal",
          fix: "Herschrijf met echte bezwaren, specs en merkstem. Template is start, geen eind.",
        },
      ],
      tiers: [
        {
          id: "rust",
          min: 0,
          max: 24,
          label: "Retentie met hersenen",
          quip: "Je bouwt flows alsof marge telt. Blijf zo saai. Saai verdient.",
        },
        {
          id: "rommel",
          min: 25,
          max: 49,
          label: "Bijna netjes",
          quip: "Er zit potentie in. Ruim de theater-flows op voordat je iets nieuws aanzet.",
        },
        {
          id: "circus",
          min: 50,
          max: 74,
          label: "Automation-circus",
          quip: "Druk dashboard. Stille bankrekening. Klassiek.",
        },
        {
          id: "inferno",
          min: 75,
          max: 100,
          label: "Inbox-inferno",
          quip: "Je mailt alsof volume een strategie is. Spoiler: unsubscribe is gratis feedback.",
        },
      ],
    },
    {
      type: "h2",
      text: "Welkomstserie",
    },
    {
      type: "p",
      text: "Trigger: aanmelding of account. Doel: vertrouwen en eerste aankoop of verdieping. Drie mails over een week slaan harder aan dan één dikke brochure-mail die niemand uitklikt.",
    },
    {
      type: "ul",
      items: [
        "Mail 1: wie je bent, wat ze mogen verwachten, nog geen stormverkoop.",
        "Mail 2: sterke producten of diensten met bewijs.",
        "Mail 3: zachte CTA met duidelijke waarde. Korting alleen als het bij je merk past.",
      ],
    },
    {
      type: "h2",
      text: "Abandoned cart",
    },
    {
      type: "p",
      text: "Dit is de geldmachine die niemand mag verwaarlozen. Segment op checkout started, exclude recent buyers, herstel mand via dynamische link. Timing die ik vaak start: ongeveer een uur, een dag, twee tot drie dagen. Meet herstel-omzet. Zie ook het artikel over abandoned cart mails als je dieper wilt.",
    },
    {
      type: "h2",
      text: "Post-purchase",
    },
    {
      type: "p",
      text: "Na een order is iemand warm. Gebruik dat voor review-verzoek, gebruikstips, cross-sell die logisch is. Hard sell de dag na levering voelt als een marktkoopman in je slaapkamer. Uitleg en zorgzaamheid converteren vaker dan 'nog 10%'.",
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
      text: "Trigger: geen aankoop in X dagen, afhankelijk van je productcyclus. Consumables: korter. Duurzame aankoop: langer. Toon: terugwinnen zonder wanhoop. Herinner aan waarde of nieuw assortiment. Incentive alleen als marge het toelaat.",
    },
    {
      type: "h2",
      text: "Wat je bewust later laat",
    },
    {
      type: "p",
      text: "Browse abandonment, sunset flows, VIP-tiers, birthday mails met confetti. Leuk als de basis staat. Eerst data schoon, consent op orde, checkout die niet lekt. E-mail op een kapotte shop is een nette brief naar een leeg huis.",
    },
    {
      type: "h2",
      text: "Segmentatie die wél telt",
    },
    {
      type: "p",
      text: "Scheid kopers van niet-kopers. Scheid zakelijk van consument als je beide hebt. Eén toon voor iedereen is hoe je vertrouwen verbrandt bij de groep die het meeste bestelt.",
    },
    {
      type: "callout",
      text: "Heet take: twintig half-afgemaakte Klaviyo-flows zijn erger dan vier die echt draaien en omzet tonen.",
    },
    {
      type: "h2",
      text: "Koppeling met ads en SEO",
    },
    {
      type: "p",
      text: "E-mail is geen eiland. Lijstgroei komt van site en content. Retentie verlaagt je afhankelijkheid van ads. Flows die werken, geven je ruimte om acquisitie te financieren. Op mijn pagina's over Klaviyo specialist en e-mailmarketing leg ik die keten uit.",
    },
  ],
};
