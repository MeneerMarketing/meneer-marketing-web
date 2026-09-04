/**
 * PREMIUM_DTC — SkinComplete → generic component mapping.
 *
 * Reference sources (Shopify theme):
 * - shopify/snippets/sc-product-master-led-mask.liquid  (buyblock / gallery / sticky ATC)
 * - shopify/sections/product-koopblok-led-mask.liquid
 * - shopify/sections/product-deep-dive-led-mask.liquid  (section pacing / FAQ / features)
 * - shopify/snippets/sc-product-master-mep.liquid       (shared buyblock skeleton)
 *
 * SC-specific (NOT hardcoded into components):
 * - LED Passport, FDA claims, golflengtes, clinic map, symptom silo links
 * - Skin Complete logo / cacao-as-brand-only (cacao is design language; logo is prospect)
 * - Product copy, certifications set, gift/upsell SKUs
 */

export const PREMIUM_DTC_SC_SOURCES = [
  "shopify/snippets/sc-product-master-led-mask.liquid",
  "shopify/sections/product-koopblok-led-mask.liquid",
  "shopify/sections/product-deep-dive-led-mask.liquid",
  "shopify/snippets/sc-product-master-mep.liquid",
  "shopify/snippets/sc-led-360.liquid",
  "shopify/snippets/sc-trustpilot-badge.liquid",
] as const;

export type Milestone9SectionType =
  | "HERO_BUY_BLOCK"
  | "TRUST_BAR"
  | "BENEFIT_GRID"
  | "PROBLEM_SOLUTION"
  | "PRODUCT_STORY"
  | "HOW_IT_WORKS"
  | "HOW_TO_USE"
  | "FEATURE_DEEP_DIVE"
  | "MATERIALS"
  | "INGREDIENTS"
  | "TECH_SPECS"
  | "SIZE_GUIDE"
  | "COMPARISON"
  | "BEFORE_AFTER"
  | "REVIEWS"
  | "TESTIMONIALS"
  | "UGC"
  | "DELIVERY_RETURNS"
  | "GUARANTEE"
  | "FAQ"
  | "STICKY_ATC"
  | "RELATED_PRODUCTS"
  | "FINAL_PURCHASE";

export type PremiumDtcComponentId =
  | "PremiumHeader"
  | "PremiumFooter"
  | "PremiumBuyBlock"
  | "PremiumMediaGallery"
  | "TrustStrip"
  | "EditorialIntroSection"
  | "SignatureFeatureExperience"
  | "ProductStorySection"
  | "DetailSequenceSection"
  | "ImmersiveStorySection"
  | "HowItWorksSection"
  | "ReviewSection"
  | "FAQSection"
  | "FinalPurchaseSection"
  | "StickyPurchaseBar";

export type ComponentMappingRow = {
  skinCompletePattern: string;
  scClasses: string[];
  component: PremiumDtcComponentId;
  sectionType: Milestone9SectionType;
  notes: string;
};

export const PREMIUM_DTC_COMPONENT_MAPPING: ComponentMappingRow[] = [
  {
    skinCompletePattern: "Announcement bar + sticky site header",
    scClasses: [".sc-ann-bar", "#header-component", ".sc-nav-fb"],
    component: "PremiumHeader",
    sectionType: "HERO_BUY_BLOCK",
    notes: "Site chrome: rotating announcements, brand, nav, cart; prospect-replaceable",
  },
  {
    skinCompletePattern: "Hero / koopblok 2-koloms (media + info)",
    scClasses: [".sc-product-master", ".sc-product-core", ".sc-col-info"],
    component: "PremiumBuyBlock",
    sectionType: "HERO_BUY_BLOCK",
    notes: "Purchase path first; title, price, ATC, reassure above fold",
  },
  {
    skinCompletePattern: "Gallery sticky + thumbs + stage 4/5",
    scClasses: [".sc-col-media", ".sc-gallery-sticky", ".sc-main-stage"],
    component: "PremiumMediaGallery",
    sectionType: "HERO_BUY_BLOCK",
    notes: "Media is part of buyblock; claims overlays optional per slide",
  },
  {
    skinCompletePattern: "Trustpilot + USP pills + reassure strip",
    scClasses: [".sc-m-trustline", ".sc-m-usp-pills", ".sc-m-reassure"],
    component: "TrustStrip",
    sectionType: "TRUST_BAR",
    notes: "Widget config / review count are prospect data",
  },
  {
    skinCompletePattern: "Indications / benefit grid (.pdd-ind-grid)",
    scClasses: [".pdd-indications", ".pdd-ind-grid"],
    component: "EditorialIntroSection",
    sectionType: "BENEFIT_GRID",
    notes: "Editorial statement + verified stat; no card grid",
  },
  {
    skinCompletePattern: "Passport / protocol story (.pdd-plan)",
    scClasses: [".pdd-plan", ".sc-m-passport-card"],
    component: "ProductStorySection",
    sectionType: "PRODUCT_STORY",
    notes: "Full-bleed editorial story, asymmetric media/typography",
  },
  {
    skinCompletePattern: "Waves / feature spectrum (.pdd-waves)",
    scClasses: [".pdd-waves", ".pdd-wave-list"],
    component: "SignatureFeatureExperience",
    sectionType: "FEATURE_DEEP_DIVE",
    notes: "Signature: media canvas driven by vertical feature navigator",
  },
  {
    skinCompletePattern: "Deep-dive detail sequence",
    scClasses: [".pdd-detail", ".pdd-usage-card"],
    component: "DetailSequenceSection",
    sectionType: "TECH_SPECS",
    notes: "Numbered practical sequence; facts not used in signature",
  },
  {
    skinCompletePattern: "Immersive dark narrative band",
    scClasses: [".pdd-hero-band"],
    component: "ImmersiveStorySection",
    sectionType: "PROBLEM_SOLUTION",
    notes: "Full-bleed dark moment; oversized type, no button",
  },
  {
    skinCompletePattern: "How to use (.pdd-usage)",
    scClasses: [".pdd-usage", ".pdd-usage-card"],
    component: "HowItWorksSection",
    sectionType: "HOW_TO_USE",
    notes: "Steps card over lifestyle; also maps to HOW_IT_WORKS",
  },
  {
    skinCompletePattern: "Reviews / proofrow Trustpilot",
    scClasses: [".sc-m-proofrow", ".sc-trustpilot-badge"],
    component: "ReviewSection",
    sectionType: "REVIEWS",
    notes: "SOURCE_CONTENT only; no invented ratings",
  },
  {
    skinCompletePattern: "FAQ accordion (.pdd-faq)",
    scClasses: [".pdd-faq-section", ".pdd-faq"],
    component: "FAQSection",
    sectionType: "FAQ",
    notes: "PLACEHOLDER_REQUIRED when brief has no FAQ",
  },
  {
    skinCompletePattern: "Contact / final CTA (.pdd-contact-card)",
    scClasses: [".pdd-contact-section", ".pdd-contact-card"],
    component: "FinalPurchaseSection",
    sectionType: "FINAL_PURCHASE",
    notes: "Mid/end funnel return to purchase",
  },
  {
    skinCompletePattern: "Mobile sticky ATC (#sc-m-sticky-buy)",
    scClasses: [".sc-m-sticky-buy", "#sc-m-sticky-buy"],
    component: "StickyPurchaseBar",
    sectionType: "STICKY_ATC",
    notes: "Desktop top bar / mobile bottom bar after primary ATC leaves viewport",
  },
];

/** SC-only concepts — never bake into PREMIUM_DTC as defaults. */
export const SKINCOMPLETE_ONLY_DO_NOT_HARDCODE = [
  "LED Passport / behandelplan product framing",
  "FDA 510(k) claims",
  "7 golflengtes / wavelength spectrum as default feature set",
  "60+ huidklinieken / clinic map",
  "Symptom silo links (/pages/acne, /pages/rimpels, …)",
  "Microchip Eye Patch gift / Complete LED Ritual upsell",
  "Skin Complete logo SVG and brand name",
  "CE/UKCA/FCC/RoHS cert set as mandatory",
  "UV before/after clinical imaging requirement",
] as const;
