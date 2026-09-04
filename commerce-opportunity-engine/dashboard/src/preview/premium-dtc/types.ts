/**
 * PREMIUM_DTC types — prospect-replaceable content slots.
 * Facts must come from SOURCE_CONTENT; missing → null / PLACEHOLDER_REQUIRED.
 */

export type ContentSource =
  | "SOURCE_CONTENT"
  | "DERIVED_COPY"
  | "PLACEHOLDER_REQUIRED";

export type MediaItem = {
  id: string;
  src: string;
  alt: string;
  kind: "image" | "video";
  claim?: { eyebrow?: string; title?: string; subtitle?: string } | null;
};

export type TrustItem = {
  label: string;
  source: ContentSource;
};

export type BenefitItem = {
  title: string;
  body: string;
  accent?: string;
  meta?: string;
  ctaLabel?: string;
  href?: string | null;
  image?: string | null;
  imageAlt?: string;
  source: ContentSource;
};

export type StoryBlock = {
  kicker?: string;
  title: string;
  body: string;
  ctaLabel?: string;
  backgroundImage?: string | null;
  /** Photographic assets bleed, product graphics are shown whole */
  mediaFit?: "cover" | "contain";
  source: ContentSource;
};

export type FeatureRow = {
  title: string;
  meta?: string;
  body: string;
  accent?: string;
  image?: string | null;
  imageAlt?: string;
  source: ContentSource;
};

export type HowStep = {
  n: number;
  title: string;
  body: string;
  source: ContentSource;
};

export type ReviewItem = {
  author: string;
  rating: number;
  text: string;
  source: "SOURCE_CONTENT";
};

export type FaqItem = {
  question: string;
  answer: string;
  source: ContentSource;
};

export type BrandThemeOverride = {
  ink?: string;
  accent?: string;
  accentSoft?: string;
  surface?: string;
  surfaceAlt?: string;
  cream?: string;
  logoUrl?: string | null;
  logoAlt?: string;
};

export type BuyBenefit = {
  title: string;
  body: string;
};

export type UspPill = {
  label: string;
  help?: string | null;
  href?: string | null;
};

export type OfferCard = {
  kicker: string;
  title: string;
  body: string;
  href?: string | null;
};

export type PaymentMethodId =
  | "ideal"
  | "visa"
  | "mastercard"
  | "klarna"
  | "apple_pay"
  | "paypal";

export type PremiumPdpProduct = {
  brandName: string;
  title: string;
  /** Editorial one-liner under the title (source-backed, human) */
  subline?: string;
  /** Legacy compact attribute line (fixture) */
  subtitle?: string;
  lead?: string;
  priceLabel: string;
  compareAtLabel?: string | null;
  discountLabel?: string | null;
  currencyNote?: string | null;
  klarnaLabel?: string | null;
  ctaLabel: string;
  inStock: boolean;
  media: MediaItem[];
  trustItems: TrustItem[];
  uspPills: Array<string | UspPill>;
  buyBenefits?: BuyBenefit[];
  socialProofLabel?: string | null;
  reassureItems: string[];
  paymentMethods?: PaymentMethodId[];
  offerCard?: OfferCard | null;
  miniFaqs?: FaqItem[];
  rating?: number | null;
  reviewCount?: number | null;
  ratingNote?: string | null;
  ratingHref?: string | null;
  /** Cutoff for "morgen in huis" messaging (Amsterdam time, 24h). */
  deliveryCutoffHour?: number;
  deliveryCutoffMinute?: number;
};

export type NavLink = {
  label: string;
  href: string;
};

export type AnnouncementSlide = {
  text: string;
  href?: string | null;
  hrefLabel?: string | null;
};

export type FooterColumn = {
  title: string;
  links?: NavLink[];
  /** Plain, non-clickable facts (used when no verified URL exists) */
  facts?: string[];
};

export type SiteChrome = {
  brandName: string;
  logoUrl?: string | null;
  logoAlt?: string;
  navLinks: NavLink[];
  announcements: AnnouncementSlide[];
  searchPlaceholder?: string;
  cartCount?: number;
  accountLabel?: string;
  ctaLabel?: string;
  ctaHref?: string;
  footerTagline?: string;
  footerLinks?: NavLink[];
  footerColumns?: FooterColumn[];
  legalNote?: string;
};

export type PremiumPdpContent = {
  benefits: BenefitItem[];
  benefitsKicker?: string;
  benefitsTitle?: string;
  benefitsLead?: string;
  benefitsChips?: string[];
  benefitsAsideImage?: string | null;
  benefitsAsideAlt?: string;
  /** Editorial intro stat (only when source-backed) */
  introStat?: { value: string; label: string } | null;
  introFacts?: string[];
  featuresKicker?: string;
  featuresTitle?: string;
  featuresLead?: string;
  featuresChips?: string[];
  features: FeatureRow[];
  /** Practical / anatomy sequence — separate facts from the signature features */
  detailKicker?: string;
  detailTitle?: string;
  detailLead?: string;
  detailItems?: FeatureRow[];
  detailMedia?: string[];
  /** Single product canvas for the signature experience */
  featureCanvas?: string | null;
  story: StoryBlock | null;
  secondaryStory?: StoryBlock | null;
  /** Verified one-liners shown beside the dark narrative moment */
  immersiveMeta?: string[];
  howSteps: HowStep[];
  reviews: ReviewItem[];
  faqs: FaqItem[];
  faqLead?: string;
  finalKicker?: string;
  finalTitle: string;
  finalBody: string;
  finalCtaLabel: string;
  finalImage?: string | null;
  finalReassure?: string[];
};

export type PremiumPdpModel = {
  theme: BrandThemeOverride;
  chrome: SiteChrome;
  product: PremiumPdpProduct;
  content: PremiumPdpContent;
  /** Ordered Milestone 9 section plan driving composition */
  sectionPlan: Array<{
    section: string;
    content_source?: ContentSource;
  }>;
};
