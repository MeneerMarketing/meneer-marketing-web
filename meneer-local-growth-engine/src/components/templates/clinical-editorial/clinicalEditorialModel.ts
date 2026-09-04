import type { CSSProperties } from "react";
import type { StudioData, StudioImage, StudioService, StudioSkinConcern } from "@/types/studio";
import { buildEditorialBrandStyle } from "@/lib/brandPalette";
import {
  buildConceptClinicFaqs,
  buildConceptClinicJourney,
  buildConceptClinicMembershipPlans,
  buildConceptClinicReviews,
  buildConceptClinicTreatments,
  buildConceptSkinConcerns,
} from "@/lib/clinicPreviewFallbacks";
import { normalizeClinicStudioCopy, resolveClinicPrimaryService, sanitizeClinicCopy } from "@/lib/clinicCopySanitizer";
import {
  SKIN_CLINIC_LIFESTYLE_FALLBACKS,
  isPreviewWorthyStudioPhoto,
  isSkinClinicVerticalSlug,
  sanitizeStudioImages,
} from "@/lib/previewImagePolicy";
import { formatRating } from "@/lib/studio";
import { resolveStudioLogoUrl } from "@/lib/studioLogo";
import { clampWords, normalizeEmail, plainText, quoteText, sentences } from "@/lib/text";

export type ClinicalEditorialStyle = CSSProperties & {
  [key: `--${string}`]: string;
};

export interface ClinicalImage {
  url: string;
  alt: string;
}

export interface ClinicalNavLink {
  href: string;
  label: string;
}

export interface ClinicalJourneyStep {
  id: string;
  title: string;
  body: string;
  image: ClinicalImage | null;
}

export interface ClinicalEditorialModel {
  studioName: string;
  city: string;
  logoUrl: string | null;
  eyebrow: string;
  headlineWords: string[];
  lead: string;
  primaryService: string;
  booking: { href: string; external: boolean; label: string };
  ratingDisplay: string | null;
  topBarUsps: string[];
  about: {
    heading: string;
    lead: string;
    paragraphs: string[];
    pillars: Array<{ title: string; body: string }>;
    facts: { value: string; label: string }[];
  };
  treatments: StudioService[];
  treatmentImages: ClinicalImage[];
  skinConcerns: StudioSkinConcern[];
  journeySteps: ClinicalJourneyStep[];
  journeyImages: ClinicalImage[];
  quotes: Array<{
    id: string;
    text: string;
    author: string;
    meta: string | null;
    rating: number;
    kind: "review" | "highlight";
  }>;
  memberships: ReturnType<typeof buildConceptClinicMembershipPlans>;
  faqs: ReturnType<typeof buildConceptClinicFaqs>;
  heroImage: ClinicalImage | null;
  aboutImage: ClinicalImage | null;
  contactImage: ClinicalImage | null;
  gallery: ClinicalImage[];
  contact: {
    address: string | null;
    hours: string | null;
    phone: string | null;
    email: string | null;
    instagram: string | null;
  };
  navLinks: ClinicalNavLink[];
  pricingNote: string | null;
  heroHasMedia: boolean;
  show: {
    treatments: boolean;
    concerns: boolean;
    journey: boolean;
    quotes: boolean;
    team: boolean;
    memberships: boolean;
    faq: boolean;
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

function toImage(image: StudioImage | undefined): ClinicalImage | null {
  if (!image?.url || !isPreviewWorthyStudioPhoto(image.url, image.alt)) return null;
  return { url: image.url, alt: plainText(image.alt) || "Kliniek" };
}

function pickImages(studio: StudioData, count: number): ClinicalImage[] {
  const clean = sanitizeStudioImages(
    studio.images ?? [],
    plainText(studio.studio_name),
    studio.vertical_slug,
  );
  const fromStudio = clean
    .filter((img) => img.role !== "team")
    .map(toImage)
    .filter((img): img is ClinicalImage => Boolean(img));

  const out: ClinicalImage[] = [];
  for (let i = 0; i < count; i += 1) {
    out.push(fromStudio[i] ?? FALLBACKS[i % FALLBACKS.length]!);
  }
  return out;
}

function buildHeadlineWords(_studioName: string, _city: string, _primaryService: string): string[] {
  return ["Jouw huid,", "onze zorg"];
}

function buildLead(studio: StudioData, city: string): string {
  const desc = sanitizeClinicCopy(studio.description);
  if (desc && desc.length > 40 && !/pilates|reformer|proefles/i.test(desc)) {
    return clampWords(desc, 42);
  }
  const service = resolveClinicPrimaryService(studio.primary_service);
  return `Clinical-grade ${service.toLowerCase()}${city ? ` in ${city}` : ""}. Persoonlijke intake, heldere plannen en behandelingen die passen bij jouw huid.`;
}

function buildAbout(studio: StudioData, city: string, treatments: StudioService[]) {
  const studioName = plainText(studio.studio_name);
  const paragraphs: string[] = [];
  const desc = sanitizeClinicCopy(studio.description);
  const tagline = sanitizeClinicCopy(studio.tagline);
  if (desc && !/pilates|reformer|proefles/i.test(desc)) {
    paragraphs.push(clampWords(desc, 55));
  }
  if (tagline && tagline !== desc && !/pilates|reformer|proefles/i.test(tagline)) {
    paragraphs.push(clampWords(tagline, 40));
  }
  if (paragraphs.length === 0) {
    paragraphs.push(
      `${studioName} is een huidkliniek${city ? ` in ${city}` : ""} waar intake, analyse en behandeling samenkomen. Je krijgt een plan dat bij je huid past, zonder harde beloftes.`,
    );
  }

  const treatmentLabels = treatments
    .slice(0, 3)
    .map((t) => plainText(t.name))
    .filter((name) => name && !/pilates|reformer/i.test(name));

  const facts: { value: string; label: string }[] = [];
  if (studio.review_rating > 0 && studio.review_count > 0) {
    facts.push({
      value: formatRating(studio.review_rating),
      label: `${studio.review_count} reviews`,
    });
  }
  if (treatmentLabels.length > 0) {
    facts.push({ value: treatmentLabels.join(" · "), label: "Specialisaties" });
  } else {
    facts.push({
      value: resolveClinicPrimaryService(studio.primary_service),
      label: "Focus",
    });
  }
  if (city) facts.push({ value: city, label: "Locatie" });

  const pillars = [
    {
      title: "Gratis intake",
      body: "Huidanalyse, verwachtingen helder en een plan zonder verrassingen achteraf.",
    },
    {
      title: "Clinical-grade",
      body: "Behandelingen met professionele protocollen en nazorg die bij je huid past.",
    },
    {
      title: "Transparant traject",
      body: "Van eerste gesprek tot onderhoud: je weet altijd wat de volgende stap is.",
    },
  ];

  return {
    heading: studioName,
    lead: `Jouw huid verdient meer dan een standaard menu. Bij ${studioName} in ${city} combineer je persoonlijke analyse met behandelingen die echt bij je passen.`,
    paragraphs: paragraphs.slice(0, 2),
    pillars,
    facts: facts.slice(0, 3),
  };
}

function buildUsps(studio: StudioData): string[] {
  const usps: string[] = [];
  const primary = resolveClinicPrimaryService(studio.primary_service);
  if (primary) usps.push(primary);
  for (const benefit of studio.benefits ?? []) {
    const title = sanitizeClinicCopy(benefit.title);
    if (title && !usps.includes(title) && !/pilates|reformer|proefles/i.test(title)) {
      usps.push(title);
    }
    if (usps.length >= 4) break;
  }
  if (usps.length < 3) {
    usps.push("Gratis intake", "Persoonlijk huidplan", "Clinical-grade aanpak");
  }
  return usps.slice(0, 4);
}

export function buildClinicalEditorialModel(studioInput: StudioData): ClinicalEditorialModel {
  const studio = normalizeClinicStudioCopy(studioInput);
  const studioName = plainText(studio.studio_name);
  const city = plainText(studio.city);
  const primaryService = resolveClinicPrimaryService(studio.primary_service);

  const images = pickImages(studio, 8);
  const heroImage = isSkinClinicVerticalSlug(studio.vertical_slug)
    ? SKIN_CLINIC_LIFESTYLE_FALLBACKS.hero
    : images[0] ?? null;

  const treatments = buildConceptClinicTreatments(studio).map((t) => ({
    id: t.id,
    name: t.name,
    description: t.description,
    duration_minutes: t.duration_minutes,
    highlight: t.highlight,
  }));

  const skinConcerns = buildConceptSkinConcerns(studio);
  const journeyRaw = buildConceptClinicJourney(studio);
  const journeyImages = images.slice(2, 6);

  const reviews = buildConceptClinicReviews(studio, 4);
  const quotes = reviews.map((r) => ({
    id: r.id,
    text: quoteText(r.text),
    author: r.author,
    meta: r.date_label,
    rating: r.rating,
    kind: "review" as const,
  }));

  const phone = plainText(studio.phone);
  const bookingHref =
    plainText(studio.booking_url) ||
    (phone ? `tel:${phone.replace(/\s/g, "")}` : "#contact");
  const bookingExternal = bookingHref.startsWith("http");

  const ratingDisplay =
    studio.review_rating > 0 && studio.review_count > 0
      ? `${formatRating(studio.review_rating)} · ${studio.review_count}`
      : null;

  const navLinks: ClinicalNavLink[] = [
    { href: "#behandelingen", label: "Behandelingen" },
    { href: "#huidproblemen", label: "Huidproblemen" },
    { href: "#traject", label: "Traject" },
    { href: "#reviews", label: "Reviews" },
    { href: "#team", label: "Team" },
    { href: "#faq", label: "FAQ" },
    { href: "#contact", label: "Contact" },
  ];

  return {
    studioName,
    city,
    logoUrl: resolveStudioLogoUrl(studio.logo),
    eyebrow: `Huidkliniek · ${city}`,
    headlineWords: buildHeadlineWords(studioName, city, primaryService),
    lead: buildLead(studio, city),
    primaryService,
    booking: {
      href: bookingHref,
      external: bookingExternal,
      label: "Plan gratis intake",
    },
    ratingDisplay,
    topBarUsps: buildUsps(studio),
    about: buildAbout(studio, city, treatments),
    treatments,
    treatmentImages: images.slice(1, 5),
    skinConcerns,
    journeySteps: journeyRaw.map((step, index) => ({
      id: step.id,
      title: step.title,
      body: step.body,
      image: journeyImages[index] ?? images[index % images.length] ?? null,
    })),
    journeyImages,
    quotes,
    memberships: buildConceptClinicMembershipPlans(studio),
    faqs: buildConceptClinicFaqs(studio),
    heroImage,
    aboutImage: images[1] ?? null,
    contactImage: images[5] ?? images[0] ?? null,
    gallery: images.slice(3, 7),
    contact: {
      address: plainText(studio.address)
        ? `${plainText(studio.address)}${plainText(studio.postal_code) ? `, ${plainText(studio.postal_code)}` : ""}`
        : null,
      hours: plainText(studio.opening_hours) || null,
      phone: phone || null,
      email: normalizeEmail(studio.email),
      instagram: plainText(studio.instagram_url) || null,
    },
    navLinks,
    pricingNote:
      "Prijzen zijn indicatief voor het concept. Definitieve tarieven volgen na intake en huidanalyse.",
    heroHasMedia: Boolean(heroImage),
    show: {
      treatments: treatments.length > 0,
      concerns: skinConcerns.length > 0,
      journey: journeyRaw.length > 0,
      quotes: quotes.length > 0,
      team: (studio.team ?? []).length > 0,
      memberships: true,
      faq: true,
    },
  };
}

export function buildClinicalEditorialStyle(studio: StudioData): ClinicalEditorialStyle {
  return buildEditorialBrandStyle(studio) as ClinicalEditorialStyle;
}

export function clinicalEditorialIntroSentence(studio: StudioData): string {
  const parts = sentences(plainText(studio.description));
  return parts[0] ?? buildLead(studio, plainText(studio.city));
}
