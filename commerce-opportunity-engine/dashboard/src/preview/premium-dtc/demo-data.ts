import type { PremiumPdpModel } from "./types";

/**
 * Internal demo model — NOT Skin Complete.
 * Pets product proves PREMIUM_DTC design language with different storytelling.
 * Uses public Unsplash placeholders for media (demo only).
 */
export const PREMIUM_DTC_DEMO_MODEL: PremiumPdpModel = {
  theme: {
    accent: "#2C2217",
    accentSoft: "#45382C",
    surface: "#F8F7F5",
    surfaceAlt: "#F4F5F6",
    cream: "#FEFCFC",
    logoUrl: null,
    logoAlt: "NordTrail",
  },
  chrome: {
    brandName: "NordTrail",
    logoUrl: null,
    navLinks: [
      { label: "Collectie", href: "#pdtc-benefits" },
      { label: "Materialen", href: "#pdtc-features-title" },
      { label: "Maattabel", href: "#pdtc-how" },
      { label: "Reviews", href: "#pdtc-reviews-title" },
    ],
    announcements: [
      {
        text: "Gratis verzending in Nederland · 30 dagen bedenktijd",
      },
      {
        text: "Beoordeeld met 4,7 op Trustpilot",
        href: "#pdtc-reviews-title",
        hrefLabel: "Lees reviews",
      },
      {
        text: "Betaal achteraf met Klarna · Morgen in huis",
      },
    ],
    cartCount: 0,
    ctaLabel: "Bestel nu",
    ctaHref: "#pdtc-buy-area",
    footerTagline: "Outdoor gear voor honden die meegaan. Gebouwd voor NL weer.",
    footerLinks: [
      { label: "Verzending", href: "#pdtc-buy-area" },
      { label: "Retourneren", href: "#pdtc-buy-area" },
      { label: "Contact", href: "#pdtc-buy-area" },
      { label: "FAQ", href: "#pdtc-faq" },
    ],
    legalNote: "Demo preview · PREMIUM_DTC · geen live webshop",
  },
  product: {
    brandName: "NordTrail",
    title: "TrailHarness Pro",
    subtitle: "Verstelbaar hondentuig voor actieve honden",
    lead: "Stabiel op de wandeling, zacht op de borst. Gebouwd voor dagelijks gebruik zonder gedoe met aansluiting.",
    priceLabel: "€ 49,95",
    compareAtLabel: "€ 64,95",
    currencyNote: "Inclusief BTW · Morgen in huis bij bestelling vandaag",
    klarnaLabel: "3× € 16,65 met Klarna, of achteraf betalen",
    ctaLabel: "In winkelwagen · € 49,95",
    inStock: true,
    uspPills: [
      {
        label: "Verstelbaar in 4 punten",
        help: "Nek en borst op vier punten af te stellen. Twee vingers tussen riem en hond is genoeg.",
      },
      { label: "Gewatteerde borst" },
      {
        label: "Bekijk maattabel",
        href: "#pdtc-how",
      },
    ],
    trustItems: [
      { label: "Gratis verzending", source: "SOURCE_CONTENT" },
      { label: "30 dagen bedenktijd", source: "SOURCE_CONTENT" },
      { label: "Veilig betalen", source: "SOURCE_CONTENT" },
      { label: "Morgen in huis", source: "SOURCE_CONTENT" },
    ],
    reassureItems: [
      "Gratis verzending, morgen in huis",
      "30 dagen bedenktijd",
      "Past niet? Eenvoudig omruilen",
    ],
    paymentMethods: ["ideal", "visa", "mastercard", "klarna", "apple_pay", "paypal"],
    offerCard: {
      kicker: "Gratis bij je bestelling",
      title: "Pasadvieskaart",
      body: "Korte checklist voor maat, fit en eerste wandeling. Direct na checkout in je mail.",
      href: "#pdtc-how",
    },
    miniFaqs: [
      {
        question: "Welke maat past?",
        answer:
          "Meet de borstomvang achter de voorpoten. Kies de maat in het midden van het bereik. Twijfel je, kies één maat groter.",
        source: "SOURCE_CONTENT",
      },
      {
        question: "Geschikt voor trekken?",
        answer:
          "Ja. De Y-vorm houdt druk op de borstkas, niet in de nek. Ideaal als je hond nog leert zonder te trekken.",
        source: "SOURCE_CONTENT",
      },
      {
        question: "Wasbaar?",
        answer: "Handwas of waszak op 30°. Lucht drogen. Geen droger.",
        source: "SOURCE_CONTENT",
      },
    ],
    rating: 4.7,
    reviewCount: 128,
    ratingNote: "geverifieerd",
    ratingHref: null,
    deliveryCutoffHour: 23,
    deliveryCutoffMinute: 0,
    media: [
      {
        id: "m1",
        src: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1200&q=80",
        alt: "Hond met tuig tijdens wandeling",
        kind: "image",
        claim: {
          eyebrow: "Comfort first",
          title: "Druk verdeeld over de borst",
          subtitle: "Minder trekken in de nek",
        },
      },
      {
        id: "m2",
        src: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80",
        alt: "Twee honden buiten",
        kind: "image",
        claim: {
          eyebrow: "Outdoor ready",
          title: "Reflecterende details",
        },
      },
      {
        id: "m3",
        src: "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?auto=format&fit=crop&w=1200&q=80",
        alt: "Hond in het park",
        kind: "image",
      },
    ],
  },
  content: {
    benefitsKicker: "Waarom dit tuig",
    benefitsTitle: "Gebouwd voor echte wandelingen, niet voor de etalage",
    benefitsLead:
      "Drie dingen die je merkt vanaf de eerste route: stabieler trekgedrag, sneller aandoen, zichtbaar in het donker.",
    benefitsChips: ["Y-vorm", "4-punts fit", "Reflectie"],
    benefitsAsideImage:
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=900&q=80",
    benefitsAsideAlt: "Hond in het park met outdoor gear",
    benefits: [
      {
        title: "Stabiel bij trekken",
        meta: "Y-vorm constructie",
        body: "Druk op de borstkas, niet in de nek. Handig als je hond nog leert lopen zonder te trekken.",
        accent: "#2C2217",
        ctaLabel: "Bekijk fit",
        href: "#pdtc-how",
        image:
          "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=600&q=80",
        source: "DERIVED_COPY",
      },
      {
        title: "Snel aan en uit",
        meta: "Dubbele buckles",
        body: "Buckles aan beide zijden. Ideaal als je hond ongeduldig is bij de deur.",
        accent: "#B79256",
        ctaLabel: "Zo werkt het",
        href: "#pdtc-how",
        source: "DERIVED_COPY",
      },
      {
        title: "Zichtbaar in het donker",
        meta: "Reflecterende stiksels",
        body: "Reflecterende details helpen bij vroege ochtend- en avondrondjes. Zichtbaar zonder extra lampje.",
        accent: "#45382C",
        ctaLabel: "Bekijk details",
        href: "#pdtc-features-title",
        image:
          "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80",
        source: "DERIVED_COPY",
      },
      {
        title: "Comfort op lange routes",
        meta: "Gewatteerde borst",
        body: "Zachte voering op de borst. Minder schuren bij langere stukken of joggen.",
        accent: "#6B5A46",
        source: "DERIVED_COPY",
      },
    ],
    story: {
      kicker: "Ontworpen voor dagelijks gebruik",
      title: "Minder frictie. Meer wandelingen.",
      body: "Een tuig dat blijft zitten, zacht aanvoelt en snel past. Dat is het hele punt.",
      ctaLabel: "Naar het koopblok",
      backgroundImage:
        "https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?auto=format&fit=crop&w=1600&q=80",
      source: "DERIVED_COPY",
    },
    featuresKicker: "Materialen & hardware",
    featuresTitle: "Wat je voelt, ziet en gebruikt",
    featuresLead:
      "Hover of tik een regel. De visual volgt mee, zoals een spectrum-detail op een premium PDP.",
    featuresChips: ["Ripstop", "Mesh voering", "Aluminium"],
    features: [
      {
        title: "Buitenstof",
        meta: "Ripstop nylon",
        body: "Licht en slijtvast. Geschikt voor regenachtige Nederlandse dagen zonder zwaar te worden.",
        accent: "#2C2217",
        image:
          "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1000&q=80",
        imageAlt: "Outdoor detail",
        source: "SOURCE_CONTENT",
      },
      {
        title: "Voering",
        meta: "Gewatteerd mesh",
        body: "Ademend op de borst, minder schuren bij langere routes of warm weer.",
        accent: "#B79256",
        image:
          "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1000&q=80",
        imageAlt: "Comfort detail",
        source: "SOURCE_CONTENT",
      },
      {
        title: "Hardware",
        meta: "Aluminium D-ring",
        body: "Lijnbevestiging op de rug. Stevig genoeg voor middelgrote tot grote honden.",
        accent: "#45382C",
        image:
          "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?auto=format&fit=crop&w=1000&q=80",
        imageAlt: "Hardware detail",
        source: "SOURCE_CONTENT",
      },
      {
        title: "Reflectie",
        meta: "360° stitching",
        body: "Reflecterende stiksels rondom. Zichtbaar vanuit meerdere hoeken in schemer.",
        accent: "#8A7A64",
        image:
          "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1000&q=80",
        imageAlt: "Reflectie detail",
        source: "SOURCE_CONTENT",
      },
    ],
    howSteps: [
      {
        n: 1,
        title: "Meet de borstomvang",
        body: "Meet net achter de voorpoten. Kies de maat die in het midden van het bereik valt.",
        source: "DERIVED_COPY",
      },
      {
        n: 2,
        title: "Stel de 4 punten af",
        body: "Nek en borst moeten strak genoeg zijn dat er twee vingers tussen passen.",
        source: "DERIVED_COPY",
      },
      {
        n: 3,
        title: "Klik de lijn vast",
        body: "Gebruik de rug-D-ring. Klaar voor de deur uit.",
        source: "DERIVED_COPY",
      },
    ],
    reviews: [
      {
        author: "Sanne",
        rating: 5,
        text: "Eindelijk een tuig dat niet verschuift als we joggen. Maat M paste meteen.",
        source: "SOURCE_CONTENT",
      },
      {
        author: "Mark",
        rating: 4,
        text: "Stevig spul. Reflectie is echt zichtbaar in het donker.",
        source: "SOURCE_CONTENT",
      },
      {
        author: "Lisa",
        rating: 5,
        text: "Aandoen duurt twee seconden. Dat scheelt 's ochtends.",
        source: "SOURCE_CONTENT",
      },
    ],
    faqs: [
      {
        question: "Welke maat past bij mijn hond?",
        answer:
          "Meet de borstomvang achter de voorpoten. Gebruik de maattabel op de productpagina. Twijfel je tussen twee maten, kies de grotere en stel strakker af.",
        source: "SOURCE_CONTENT",
      },
      {
        question: "Kan ik het tuig wassen?",
        answer:
          "Handwas of waszak op 30°. Laat aan de lucht drogen. Geen droger.",
        source: "SOURCE_CONTENT",
      },
      {
        question: "Wat als de maat niet klopt?",
        answer: "PLACEHOLDER",
        source: "PLACEHOLDER_REQUIRED",
      },
    ],
    finalTitle: "Klaar voor de volgende wandeling",
    finalBody:
      "TrailHarness Pro is gebouwd voor dagelijks gebruik. Bestel, stel af, deur uit.",
    finalCtaLabel: "Bestel TrailHarness Pro",
  },
  sectionPlan: [
    { section: "HERO_BUY_BLOCK", content_source: "SOURCE_CONTENT" },
    { section: "TRUST_BAR", content_source: "SOURCE_CONTENT" },
    { section: "BENEFIT_GRID", content_source: "DERIVED_COPY" },
    { section: "PRODUCT_STORY", content_source: "DERIVED_COPY" },
    { section: "FEATURE_DEEP_DIVE", content_source: "SOURCE_CONTENT" },
    { section: "SIZE_GUIDE", content_source: "DERIVED_COPY" },
    { section: "REVIEWS", content_source: "SOURCE_CONTENT" },
    { section: "FAQ", content_source: "SOURCE_CONTENT" },
    { section: "FINAL_PURCHASE", content_source: "DERIVED_COPY" },
    { section: "STICKY_ATC", content_source: "DERIVED_COPY" },
  ],
};
