import type { CSSProperties } from "react";
import type { StudioData, StudioSkinConcern } from "@/types/studio";
import { buildClinicBrandStyle } from "@/lib/brandPalette";
import {
  buildConceptClinicFaqs,
  buildConceptClinicJourney,
  buildConceptClinicMembershipPlans,
  buildConceptClinicReviews,
  buildConceptClinicTreatments,
  buildConceptSkinConcerns,
} from "@/lib/clinicPreviewFallbacks";
import { isFitnessJargon, sanitizeClinicCopy } from "@/lib/clinicCopySanitizer";
import { SKIN_CLINIC_LIFESTYLE_FALLBACKS } from "@/lib/previewImagePolicy";
import { clinicImagesFromStudio } from "@/lib/mapPreviewImages";
import { formatRating } from "@/lib/studio";
import { resolveStudioLogoUrl } from "@/lib/studioLogo";
import { clampWords, normalizeEmail, plainText, quoteText, sentences } from "@/lib/text";
import type {
  ClinicImage,
  ClinicNavLink,
  ClinicPlan,
  ClinicQuote,
  ClinicStep,
  ClinicTreatment,
} from "@/components/templates/reformer-minimal/clinicModel";
import { buildClinicSocialLinks } from "@/components/templates/reformer-minimal/clinicModel";

export type SkinClinicMinimalStyle = CSSProperties & {
  [key: `--${string}`]: string;
};

export interface SkinClinicTrustPillar {
  id: string;
  title: string;
  body: string;
  tag: string;
  image: ClinicImage;
  highlights: string[];
}

export interface SkinClinicMinimalModel {
  studioName: string;
  city: string;
  logoUrl: string | null;
  logoLight?: boolean;
  logoOnLightBackground?: boolean;
  eyebrow: string;
  headline: { primary: string; accent: string | null };
  lead: string;
  primaryService: string;
  usps: string[];
  booking: { href: string; external: boolean; label: string };
  ratingDisplay: string | null;
  ratingValue: number;
  reviewCount: number;
  about: {
    heading: string;
    body: string;
    paragraphs: string[];
    facts: { value: string; label: string }[];
  };
  treatments: ClinicTreatment[];
  skinConcerns: StudioSkinConcern[];
  trustPillars: SkinClinicTrustPillar[];
  steps: ClinicStep[];
  quotes: ClinicQuote[];
  plans: ClinicPlan[];
  pricingNote: string | null;
  team: StudioData["team"];
  faqs: StudioData["faqs"];
  heroImage: ClinicImage | null;
  studioImage: ClinicImage | null;
  treatmentImage: ClinicImage | null;
  gallery: ClinicImage[];
  socials: {
    id: string;
    label: string;
    href: string;
    handle: string;
    iconSrc: string;
  }[];
  contact: {
    address: string | null;
    hours: string | null;
    phone: string | null;
    email: string | null;
    instagram: string | null;
  };
  navLinks: ClinicNavLink[];
  show: {
    treatments: boolean;
    concerns: boolean;
    trust: boolean;
    steps: boolean;
    about: boolean;
    quotes: boolean;
    team: boolean;
    plans: boolean;
    faq: boolean;
    socials: boolean;
  };
}

const FALLBACKS = [
  SKIN_CLINIC_LIFESTYLE_FALLBACKS.hero,
  SKIN_CLINIC_LIFESTYLE_FALLBACKS.reception,
  SKIN_CLINIC_LIFESTYLE_FALLBACKS.treatment,
  SKIN_CLINIC_LIFESTYLE_FALLBACKS.atmosphere,
  SKIN_CLINIC_LIFESTYLE_FALLBACKS.gallery1,
  SKIN_CLINIC_LIFESTYLE_FALLBACKS.gallery2,
] as const;

function pickImages(studio: StudioData, count: number): ClinicImage[] {
  return clinicImagesFromStudio(studio, count, FALLBACKS);
}

function splitHeadline(tagline: string): { primary: string; accent: string | null } {
  const words = plainText(tagline).split(/\s+/).filter(Boolean);
  if (words.length < 3) return { primary: plainText(tagline), accent: null };
  const mid = Math.ceil(words.length / 2);
  return {
    primary: words.slice(0, mid).join(" "),
    accent: words.slice(mid).join(" "),
  };
}

function buildHeadline(studio: StudioData, city: string, primaryService: string) {
  const tagline = plainText(studio.tagline);
  if (tagline && tagline.split(/\s+/).length >= 4) {
    return splitHeadline(tagline);
  }
  if (city) {
    return {
      primary: primaryService || "Huidbehandelingen",
      accent: `in ${city}`,
    };
  }
  return { primary: primaryService || "Jouw huid, onze zorg", accent: null };
}

function buildLead(studio: StudioData, city: string): string {
  const description = plainText(studio.description);
  const first = sentences(description)[0] ?? description;
  if (first && first.length > 50) return clampWords(first, 38);

  const studioName = plainText(studio.studio_name);
  const service = plainText(studio.primary_service) || "huidbehandelingen";
  return `Clinical-grade ${service.toLowerCase()}${city ? ` in ${city}` : ""}. Bij ${studioName} start alles met huidanalyse, een helder plan en behandelingen die bij jouw huid passen.`;
}

function buildUsps(studio: StudioData): string[] {
  const fromBenefits = (studio.benefits ?? [])
    .map((b) => plainText(b.title))
    .filter(Boolean)
    .slice(0, 3);
  if (fromBenefits.length >= 2) return fromBenefits;

  const defaults = [
    "Gratis intake & huidanalyse",
    "Clinical-grade protocollen",
    "Transparant behandelplan",
  ];
  const service = plainText(studio.primary_service);
  if (service) defaults.unshift(service);
  return defaults.slice(0, 4);
}

function buildAbout(studio: StudioData, city: string) {
  const studioName = plainText(studio.studio_name);
  const paragraphs: string[] = [];
  const desc = plainText(studio.description);
  if (desc) paragraphs.push(clampWords(desc, 52));
  const tagline = plainText(studio.tagline);
  if (tagline && tagline !== desc) paragraphs.push(clampWords(tagline, 38));
  if (paragraphs.length === 0) {
    paragraphs.push(
      `${studioName} combineert medische esthetiek met een rustige kliniekervaring${city ? ` in ${city}` : ""}. Intake, analyse en behandeling lopen in één lijn, zonder harde beloftes.`,
      "Laser, injectables, peels en huidverbetering worden altijd afgestemd op jouw huidtype, hersteltijd en doel.",
    );
  }

  const facts: { value: string; label: string }[] = [];
  if (studio.review_rating > 0 && studio.review_count > 0) {
    facts.push({
      value: formatRating(studio.review_rating),
      label: `${studio.review_count} reviews`,
    });
  }
  facts.push({ value: "Intake", label: "Gratis start" });
  if (city) facts.push({ value: city, label: "Locatie" });

  return {
    heading: city ? `Kliniek in ${city}` : `Over ${studioName}`,
    body: paragraphs[0] ?? "",
    paragraphs: paragraphs.slice(0, 2),
    facts: facts.slice(0, 3),
  };
}

function buildTrustPillars(studio: StudioData): SkinClinicTrustPillar[] {
  const studioName = plainText(studio.studio_name);
  const service = plainText(studio.primary_service) || "huidbehandelingen";

  return [
    {
      id: "trust-analysis",
      tag: "Startpunt",
      title: "Huidanalyse eerst",
      body: `Elk traject bij ${studioName} begint met een analyse. Zo weten we welke ${service.toLowerCase()} veilig en logisch is voor jouw huid.`,
      image: SKIN_CLINIC_LIFESTYLE_FALLBACKS.consultation,
      highlights: ["Digitale huidscan", "Plan op maat", "Vrijblijvend advies"],
    },
    {
      id: "trust-protocol",
      tag: "Protocol",
      title: "Clinical-grade aanpak",
      body: "Protocollen, nazorg en productadvies sluiten op elkaar aan. Je weet wat je huid doet en waarom een behandeling past.",
      image: SKIN_CLINIC_LIFESTYLE_FALLBACKS.treatment,
      highlights: ["Klinische protocollen", "Productadvies", "Stap voor stap"],
    },
    {
      id: "trust-transparent",
      tag: "Transparantie",
      title: "Heldere verwachtingen",
      body: "Prijzen, hersteltijd en vervolgstappen bespreken we vooraf. Realistische doelen en een plan dat je begrijpt.",
      image: SKIN_CLINIC_LIFESTYLE_FALLBACKS.atmosphere,
      highlights: ["Duidelijke tarieven", "Hersteltijd besproken", "Realistische doelen"],
    },
    {
      id: "trust-care",
      tag: "Nazorg",
      title: "Nazorg die blijft",
      body: "Na je behandeling evalueren we het resultaat en sturen we bij. Onderhoud en thuisroutine horen bij het plan.",
      image: SKIN_CLINIC_LIFESTYLE_FALLBACKS.reception,
      highlights: ["Evaluatie na sessie", "Thuisroutine", "Onderhoudsplan"],
    },
  ];
}

function mapTreatments(studio: StudioData, images: ClinicImage[]): ClinicTreatment[] {
  const fromStudio = (studio.services ?? [])
    .filter((s) => plainText(s.name))
    .map((service, index) => ({
      id: service.id,
      name: plainText(service.name),
      description: clampWords(plainText(service.description), 28),
      duration: null as string | null,
      highlight: index === 0,
      image: images[index % images.length] ?? null,
    }));

  const concept = buildConceptClinicTreatments(studio).map((item, index) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    duration: item.duration_minutes ? `${item.duration_minutes} min` : null,
    highlight: item.highlight,
    image: images[(fromStudio.length + index) % images.length] ?? null,
  }));

  const merged = fromStudio.length >= 4 ? fromStudio : concept;
  return merged.slice(0, 8);
}

function mapJourneySteps(
  studio: StudioData,
  _images: ClinicImage[],
): ClinicStep[] {
  const raw = buildConceptClinicJourney(studio);
  const journeyImages = [
    SKIN_CLINIC_LIFESTYLE_FALLBACKS.consultation,
    SKIN_CLINIC_LIFESTYLE_FALLBACKS.atmosphere,
    SKIN_CLINIC_LIFESTYLE_FALLBACKS.treatment,
    SKIN_CLINIC_LIFESTYLE_FALLBACKS.reception,
  ] as const;

  return raw.slice(0, 4).map((step, index) => ({
    id: step.id,
    title: step.title,
    body: step.body,
    image: journeyImages[index] ?? null,
  }));
}

function mapPlans(studio: StudioData): ClinicPlan[] {
  const fromData = (studio.memberships ?? []).map((plan) => ({
    id: plan.id,
    name: plainText(plan.name),
    priceLabel: plainText(plan.price_label),
    period: plainText(plan.period),
    description: plainText(plan.description),
    features: plan.features.map((f) => plainText(f)).filter(Boolean),
    featured: Boolean(plan.featured),
  }));
  if (fromData.length > 0) return fromData;

  return buildConceptClinicMembershipPlans(studio).map((plan) => ({
    id: plan.id,
    name: plan.name,
    priceLabel: plan.priceLabel,
    period: plan.period,
    description: plan.description,
    features: plan.features,
    featured: plan.featured,
  }));
}

function mapQuotes(studio: StudioData): ClinicQuote[] {
  const fromReviews: ClinicQuote[] = [];
  for (const review of studio.reviews ?? []) {
    const text = sanitizeClinicCopy(review.text);
    if (!text || isFitnessJargon(text)) continue;
    fromReviews.push({
      id: review.id,
      text: quoteText(text),
      author: plainText(review.author) || "Klant",
      meta: plainText(review.date_label) || null,
      rating: review.rating > 0 ? review.rating : 5,
      kind: "review",
    });
  }

  if (fromReviews.length >= 4) return fromReviews.slice(0, 8);

  return buildConceptClinicReviews(studio, 6).map((item) => ({
    id: item.id,
    text: quoteText(item.text),
    author: item.author,
    meta: item.date_label,
    rating: item.rating,
    kind: "review" as const,
  }));
}

const JOURNEY_LABELS = ["Intake", "Plan", "Sessie", "Nazorg"] as const;

export function journeyLabelForIndex(index: number): string {
  return JOURNEY_LABELS[index] ?? "Traject";
}

export function buildSkinClinicMinimalModel(studio: StudioData): SkinClinicMinimalModel {
  const studioName = plainText(studio.studio_name);
  const city = plainText(studio.city);
  const primaryService = plainText(studio.primary_service) || "Huidbehandelingen";
  const images = pickImages(studio, 10);

  const bookingRaw = plainText(studio.booking_url);
  const bookingHref = bookingRaw || "#contact";

  const treatments = mapTreatments(studio, images);
  const skinConcerns = buildConceptSkinConcerns(studio.skin_concerns ? studio : undefined);
  const steps = mapJourneySteps(studio, images.slice(2));
  const plans = mapPlans(studio);
  const quotes = mapQuotes(studio);
  const faqs = buildConceptClinicFaqs(studio);
  const socials = buildClinicSocialLinks(studio);
  const socialGallery = images.slice(3, 7);

  const address = [plainText(studio.address), city].filter(Boolean).join(", ") || null;

  const navLinks: ClinicNavLink[] = [
    { href: "#over", label: "Kliniek" },
    { href: "#behandelingen", label: "Behandelingen" },
    { href: "#huidproblemen", label: "Huidproblemen" },
    { href: "#traject", label: "Traject" },
  ];
  if (plans.length > 0) navLinks.push({ href: "#tarieven", label: "Pakketten" });
  navLinks.push({ href: "#contact", label: "Contact" });

  const ratingValue = studio.review_rating > 0 ? studio.review_rating : 4.9;
  const reviewCount = studio.review_count > 0 ? studio.review_count : 52;

  return {
    studioName,
    city,
    logoUrl: resolveStudioLogoUrl(studio.logo),
    logoLight: studio.logo_light,
    logoOnLightBackground: studio.logo_on_light_background,
    eyebrow: [city, "Huidkliniek"].filter(Boolean).join(" · "),
    headline: buildHeadline(studio, city, primaryService),
    lead: buildLead(studio, city),
    primaryService,
    usps: buildUsps(studio),
    booking: {
      href: bookingHref,
      external: /^https?:\/\//i.test(bookingHref),
      label: "Gratis intake",
    },
    ratingDisplay: formatRating(ratingValue),
    ratingValue,
    reviewCount,
    about: buildAbout(studio, city),
    treatments,
    skinConcerns,
    trustPillars: buildTrustPillars(studio),
    steps,
    quotes,
    plans,
    pricingNote:
      (studio.memberships ?? []).length > 0
        ? null
        : "Indicatieve concepttarieven voor dit voorstel. Actuele prijzen volgen bij livegang.",
    team: studio.team ?? [],
    faqs,
    heroImage: images[0] ?? SKIN_CLINIC_LIFESTYLE_FALLBACKS.hero,
    studioImage: images[1] ?? SKIN_CLINIC_LIFESTYLE_FALLBACKS.reception,
    treatmentImage: images[2] ?? SKIN_CLINIC_LIFESTYLE_FALLBACKS.treatment,
    gallery: socialGallery.length >= 3 ? socialGallery : images.slice(0, 3),
    socials,
    contact: {
      address,
      hours: plainText(studio.opening_hours) || "Ma–vr 09:00–18:00 · Za op afspraak",
      phone: plainText(studio.phone) || null,
      email: normalizeEmail(studio.email),
      instagram: plainText(studio.instagram_url) || null,
    },
    navLinks,
    show: {
      treatments: treatments.length > 0,
      concerns: skinConcerns.length > 0,
      trust: true,
      steps: steps.length > 0,
      about: true,
      quotes: quotes.length >= 3,
      team: true,
      plans: plans.length > 0,
      faq: faqs.length > 0,
      socials: socials.length > 0,
    },
  };
}

export function buildSkinClinicMinimalStyle(studio: StudioData): SkinClinicMinimalStyle {
  return buildClinicBrandStyle(studio) as SkinClinicMinimalStyle;
}
