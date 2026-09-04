import type { CSSProperties } from "react";
import type { StudioData, StudioImage } from "@/types/studio";
import { formatRating } from "@/lib/studio";
import { clampWords, normalizeEmail, plainText, quoteText, sentences } from "@/lib/text";
import {
  ensureConceptFaqs,
  buildConceptReviews,
  buildConceptTreatments,
} from "@/lib/previewContentFallbacks";
import { resolveStudioLogoUrl } from "@/lib/studioLogo";
import {
  CLINIC_CURATED_IMAGE_POOL,
  PILATES_LIFESTYLE_FALLBACKS,
  isCuratedPreviewStock,
  isHeroPhotoCandidate,
  isPreviewWorthyStudioPhoto,
  isPromotionalOrUiGraphic,
  sanitizeStudioImages,
} from "@/lib/previewImagePolicy";

/**
 * View-model voor template B (Clinic / Body Clinic-taal).
 * Wit, trust-first, behandelkaarten, verwachting-stappen.
 * Geen verzonnen scores of claims: alleen echte studio-data.
 */

export type ClinicStyle = CSSProperties & {
  [key: `--${string}`]: string;
};

export interface ClinicImage {
  url: string;
  alt: string;
}

export interface ClinicNavLink {
  href: string;
  label: string;
}

export interface ClinicStep {
  id: string;
  title: string;
  body: string;
  image: ClinicImage | null;
}

export interface ClinicTreatment {
  id: string;
  name: string;
  description: string;
  duration: string | null;
  highlight: boolean;
  image: ClinicImage | null;
}

export interface ClinicQuote {
  id: string;
  text: string;
  author: string;
  meta: string | null;
  rating: number;
  kind?: "review" | "highlight";
}

export interface ClinicClassSlot {
  id: string;
  time: string;
  name: string;
  duration: string | null;
  instructor: string | null;
  level: string;
  /** 0 = wachtlijst. Concept-rooster, dus geen live beschikbaarheid. */
  spots: number;
}

export interface ClinicScheduleDay {
  id: string;
  label: string;
  full: string;
  slots: ClinicClassSlot[];
}

export interface ClinicPlan {
  id: string;
  name: string;
  priceLabel: string;
  period: string;
  description: string;
  features: string[];
  featured: boolean;
}

export interface ClinicModel {
  studioName: string;
  logoUrl: string | null;
  logoLight?: boolean;
  logoOnLightBackground?: boolean;
  city: string;
  eyebrow: string;
  headline: { primary: string; accent: string | null };
  lead: string;
  booking: { href: string; external: boolean; label: string };
  ratingDisplay: string | null;
  ratingValue: number;
  reviewCount: number;
  primaryService: string;
  usps: string[];
  about: { heading: string; body: string; facts: { value: string; label: string }[] };
  steps: ClinicStep[];
  treatments: ClinicTreatment[];
  schedule: ClinicScheduleDay[];
  quotes: ClinicQuote[];
  plans: ClinicPlan[];
  pricingNote: string | null;
  team: StudioData["team"];
  faqs: StudioData["faqs"];
  heroImage: ClinicImage | null;
  studioImage: ClinicImage | null;
  reformerImage: ClinicImage | null;
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
    schedule: boolean;
    treatments: boolean;
    steps: boolean;
    about: boolean;
    quotes: boolean;
    quotesAreHighlights: boolean;
    team: boolean;
    socials: boolean;
    plans: boolean;
    faq: boolean;
  };
}

function toImage(image: StudioImage | undefined): ClinicImage | null {
  if (!image?.url || !isPreviewWorthyStudioPhoto(image.url, image.alt)) return null;
  return { url: image.url, alt: plainText(image.alt) || "Studiobeeld" };
}

function uniqueImages(images: ClinicImage[]): ClinicImage[] {
  const seen = new Set<string>();
  return images.filter((image) => {
    if (seen.has(image.url)) return false;
    seen.add(image.url);
    return true;
  });
}

function splitHeadline(tagline: string): { primary: string; accent: string | null } {
  const words = plainText(tagline).split(" ").filter(Boolean);
  if (words.length < 3) return { primary: plainText(tagline), accent: null };
  const mid = Math.ceil(words.length / 2);
  return {
    primary: words.slice(0, mid).join(" "),
    accent: words.slice(mid).join(" "),
  };
}

function buildClinicHeadline(studio: StudioData): { primary: string; accent: string | null } {
  const tagline = plainText(studio.tagline);
  const service = plainText(studio.primary_service) || "Reformer Pilates";
  const city = plainText(studio.city);

  if (tagline && wordCountSafe(tagline) >= 5) {
    return splitHeadline(tagline);
  }

  if (city) {
    return { primary: service, accent: `in ${city}` };
  }

  return { primary: tagline || service, accent: null };
}

function buildClinicLead(studio: StudioData): string {
  const description = plainText(studio.description);
  const firstSentence = sentences(description)[0] ?? description;

  if (wordCountSafe(firstSentence) >= 14) {
    return clampWords(firstSentence, 34);
  }

  const studioName = plainText(studio.studio_name);
  const city = plainText(studio.city);
  const service = plainText(studio.primary_service) || "Pilates";

  return `Kleine groepen, scherpe instructie en een studio die rust uitstraalt. Bij ${studioName}${city ? ` in ${city}` : ""} train je ${service.toLowerCase()} met focus op kracht, controle en lengte.`;
}

function instagramHandle(url: string): string {
  const match = url.match(/instagram\.com\/([^/?#]+)/i);
  return match?.[1] ? `@${match[1]}` : "@studio";
}

export function buildClinicSocialLinks(studio: StudioData): ClinicModel["socials"] {
  const socials: ClinicModel["socials"] = [];
  const ig = plainText(studio.instagram_url);
  const studioSlug = plainText(studio.studio_name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
  const handle = ig ? instagramHandle(ig) : `@${studioSlug || "studio"}`;
  const igHref = ig
    ? ig.startsWith("http")
      ? ig
      : `https://instagram.com/${ig.replace(/^@/, "")}`
    : `https://instagram.com/${handle.replace(/^@/, "")}`;

  socials.push({
    id: "instagram",
    label: "Instagram",
    href: igHref,
    handle,
    iconSrc: "/demo/social/instagram.png",
  });
  socials.push({
    id: "tiktok",
    label: "TikTok",
    href: `https://www.tiktok.com/${handle}`,
    handle,
    iconSrc: "/demo/social/tiktok.png",
  });

  return socials;
}

function buildUsps(studio: StudioData): string[] {
  const fromBenefits = (studio.benefits ?? [])
    .map((b) => plainText(b.title))
    .filter(Boolean)
    .slice(0, 3);
  if (fromBenefits.length >= 2) return fromBenefits;

  const services = (studio.services ?? [])
    .map((s) => plainText(s.name))
    .filter(Boolean)
    .slice(0, 3);
  if (services.length >= 2) return services;

  return [plainText(studio.primary_service), plainText(studio.city)].filter(Boolean);
}

/**
 * Verwachting-stappen uit echte benefits, of een korte ritme uit diensten.
 * Geen genummerde AI-stappen in de UI-copy; ids zijn alleen intern.
 */
function buildSteps(
  studio: StudioData,
  images: ClinicImage[]
): ClinicStep[] {
  const pool =
    images.length > 0 ? images : [...CLINIC_CURATED_IMAGE_POOL];
  const withImage = (index: number): ClinicImage =>
    pool[index % pool.length] ?? CLINIC_CURATED_IMAGE_POOL[0]!;

  const fromBenefits = (studio.benefits ?? []).slice(0, 4).map((benefit, index) => ({
    id: benefit.id,
    title: plainText(benefit.title),
    body: plainText(benefit.description),
    image: withImage(index),
  }));
  if (fromBenefits.length >= 3) return fromBenefits;

  const lead = sentences(studio.description)[0] ?? plainText(studio.description);
  const city = plainText(studio.city);
  const service = plainText(studio.primary_service);

  return [
    {
      id: "intake",
      title: "Kennismaken",
      body:
        lead ||
        `Je start met een korte intake. Zo weten we waar jij staat en welke les past.`,
      image: withImage(0),
    },
    {
      id: "train",
      title: service || "Trainen",
      body: `Kleine groepen, scherpe cues en apparatuur die ${service || "Pilates"} meetbaar maakt.`,
      image: withImage(1),
    },
    {
      id: "grow",
      title: city ? `Resultaat in ${city}` : "Resultaat",
      body: "Je bouwt kracht, lengte en controle. Les voor les, zonder ruis.",
      image: withImage(2),
    },
  ];
}

const WEEK_DAYS = [
  { id: "ma", label: "Ma", full: "Maandag" },
  { id: "di", label: "Di", full: "Dinsdag" },
  { id: "wo", label: "Wo", full: "Woensdag" },
  { id: "do", label: "Do", full: "Donderdag" },
  { id: "vr", label: "Vr", full: "Vrijdag" },
  { id: "za", label: "Za", full: "Zaterdag" },
  { id: "zo", label: "Zo", full: "Zondag" },
] as const;

const WEEKDAY_TIMES = ["07:00", "09:15", "12:15", "17:45", "19:15"];
const SATURDAY_TIMES = ["08:30", "10:00", "11:30"];
const SUNDAY_TIMES = ["09:30", "11:00"];
const LEVELS = ["Alle niveaus", "Basis", "Gevorderd"];

/**
 * Concept-weekrooster voor het voorstel: tijden en bezetting zijn een voorbeeld,
 * lesnamen, duur en instructeurs komen uit de echte studiodata. Bewust
 * deterministisch, zodat server en client hetzelfde rooster renderen.
 */
function buildSchedule(
  treatments: ClinicTreatment[],
  team: StudioData["team"]
): ClinicScheduleDay[] {
  if (treatments.length === 0) return [];

  return WEEK_DAYS.map((day, dayIndex) => {
    const times =
      dayIndex === 5 ? SATURDAY_TIMES : dayIndex === 6 ? SUNDAY_TIMES : WEEKDAY_TIMES;

    return {
      id: day.id,
      label: day.label,
      full: day.full,
      slots: times.map((time, slotIndex) => {
        const treatment = treatments[(dayIndex + slotIndex) % treatments.length]!;
        const member =
          team.length > 0 ? team[(dayIndex * 2 + slotIndex) % team.length] : undefined;

        return {
          id: `${day.id}-${slotIndex}`,
          time,
          name: treatment.name,
          duration: treatment.duration,
          instructor: member ? firstName(plainText(member.name)) : null,
          level: LEVELS[(dayIndex + slotIndex * 2) % LEVELS.length]!,
          spots: (dayIndex * 3 + slotIndex * 4) % 7,
        };
      }),
    };
  });
}

function firstName(name: string): string {
  return name.split(" ").filter(Boolean)[0] ?? name;
}

function isQuotable(text: string, author: string): boolean {
  if (text.length < 45) return false;
  if (/^\d+\s+reviews?\b/i.test(text)) return false;
  if (/\breviews?\b.*\bscore\b/i.test(text)) return false;
  if (/google/i.test(author) && /\d/.test(text)) return false;
  return true;
}

function buildQuotes(studio: StudioData): ClinicQuote[] {
  const out: ClinicQuote[] = [];
  for (const review of studio.reviews ?? []) {
    const text = quoteText(review.text);
    if (!isQuotable(text, plainText(review.author))) continue;
    if (wordCountSafe(text) < 8) continue;
    out.push({
      id: review.id,
      text,
      author: plainText(review.author) || "Lid",
      meta: plainText(review.date_label) || null,
      rating: review.rating > 0 ? review.rating : studio.review_rating,
      kind: "review",
    });
    if (out.length >= 8) break;
  }
  return out;
}

function ensureClinicQuotes(studio: StudioData): {
  quotes: ClinicQuote[];
  quotesAreHighlights: boolean;
} {
  const fromReviews = buildQuotes(studio);
  if (fromReviews.length >= 6) {
    return { quotes: fromReviews.slice(0, 8), quotesAreHighlights: false };
  }

  const concept = buildConceptReviews(studio, 6);
  const merged: ClinicQuote[] = [...fromReviews];

  for (const review of concept) {
    if (merged.length >= 6) break;
    if (merged.some((item) => item.text === review.text)) continue;
    merged.push({
      id: review.id,
      text: review.text,
      author: review.author,
      meta: review.date_label,
      rating: review.rating,
      kind: fromReviews.length === 0 ? "review" : "review",
    });
  }

  return {
    quotes: merged.slice(0, 6),
    quotesAreHighlights: false,
  };
}

function buildClinicTreatments(studio: StudioData): ClinicTreatment[] {
  const concepts = buildConceptTreatments(studio, 5);

  return concepts.map((item, index) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    duration: `${item.duration_minutes} min`,
    highlight: item.highlight,
    image: curatedLessonImage(item.name, index),
  }));
}

function buildHighlightQuotes(studio: StudioData): ClinicQuote[] {
  const rating = studio.review_rating > 0 ? studio.review_rating : 5;
  const scoreMeta =
    studio.review_count > 0
      ? `${formatRating(rating)} · ${studio.review_count} openbare beoordelingen`
      : "Studio focus";

  const fromBenefits: ClinicQuote[] = [];
  for (const benefit of studio.benefits ?? []) {
    const title = plainText(benefit.title);
    const description = plainText(benefit.description);
    if (!title || description.length < 28) continue;
    fromBenefits.push({
      id: `highlight-${benefit.id}`,
      text: clampWords(description, 34),
      author: title,
      meta: scoreMeta,
      rating,
      kind: "highlight",
    });
  }

  const fromServices: ClinicQuote[] = [];
  for (const service of studio.services ?? []) {
    const name = plainText(service.name);
    const description = plainText(service.description);
    if (!name || description.length < 28) continue;
    fromServices.push({
      id: `highlight-${service.id}`,
      text: clampWords(description, 34),
      author: name,
      meta: scoreMeta,
      rating,
      kind: "highlight",
    });
  }

  const merged = [...fromBenefits];
  for (const quote of fromServices) {
    if (merged.length >= 6) break;
    if (!merged.some((existing) => existing.text === quote.text)) merged.push(quote);
  }

  if (merged.length >= 3) return merged.slice(0, 6);

  const city = plainText(studio.city);
  const service = plainText(studio.primary_service);
  const studioName = plainText(studio.studio_name);
  const fillers: ClinicQuote[] = [
    {
      id: "highlight-intro",
      text: clampWords(
        studio.description ||
          `${studioName} richt zich op ${service.toLowerCase()} in ${city}.`,
        34
      ),
      author: studioName,
      meta: scoreMeta,
      rating,
      kind: "highlight",
    },
    {
      id: "highlight-local",
      text: `Gevestigd in ${city}, met lessen die passen bij deze studio en het lokale publiek.`,
      author: city ? `Pilates in ${city}` : "Lokaal aanbod",
      meta: scoreMeta,
      rating,
      kind: "highlight",
    },
    {
      id: "highlight-lessen",
      text: clampWords(
        `Het aanbod draait om ${service}. Plan een proefles en voel de sfeer zelf.`,
        34
      ),
      author: service || "Lessen",
      meta: scoreMeta,
      rating,
      kind: "highlight",
    },
  ];

  return [...merged, ...fillers].slice(0, 6);
}

function wordCountSafe(text: string): number {
  return text ? text.split(/\s+/).filter(Boolean).length : 0;
}

function roleImage(studio: StudioData, role: string): ClinicImage | null {
  return toImage(studio.images.find((image) => image.role === role));
}

function curatedLessonImage(lessonName: string, index: number): ClinicImage {
  const name = lessonName.toLowerCase();
  if (/stretch|restore|herstel|rust|adem/.test(name)) return CLINIC_DEMO.atmosphere!;
  if (/mat\b|matwork|vloer/.test(name)) return CLINIC_DEMO.movement!;
  if (/priv|één-op-één|een-op-een|1-op-1/.test(name)) return CLINIC_DEMO.reformer!;
  if (/duo|samen|tweeën/.test(name)) return CLINIC_DEMO.studio!;
  if (/reformer|toestel/.test(name)) return CLINIC_DEMO.hero!;
  return CLINIC_CURATED_IMAGE_POOL[index % CLINIC_CURATED_IMAGE_POOL.length]!;
}

function pickClinicImage(
  candidate: ClinicImage | null,
  fallback: ClinicImage,
  options?: { hero?: boolean }
): ClinicImage {
  if (
    candidate &&
    isCuratedPreviewStock(candidate.url) &&
    !isPromotionalOrUiGraphic(candidate.url, candidate.alt) &&
    (options?.hero
      ? isHeroPhotoCandidate(candidate.url, candidate.alt)
      : isPreviewWorthyStudioPhoto(candidate.url, candidate.alt))
  ) {
    return candidate;
  }
  return fallback;
}

/**
 * Concept-tarieven voor dunne snapshots: zelfde UI als Studio Forma demo.
 * Indicatief voor het voorstel; geen claim dat dit de live prijzen zijn.
 */
function buildConceptPlans(studio: StudioData): ClinicPlan[] {
  const studioName = plainText(studio.studio_name);
  const city = plainText(studio.city);
  const service = plainText(studio.primary_service) || "Reformer Pilates";
  const serviceLower = service.toLowerCase();

  return [
    {
      id: "concept-intro",
      name: "Intro Pack",
      priceLabel: "€79",
      period: "4 lessen",
      description: `Kennismaken met ${studioName}${city ? ` in ${city}` : ""}. Geldig voor ${serviceLower} en aanverwante lessen.`,
      features: ["4 lessen naar keuze", "Geldig 6 weken", "Inclusief mat en handdoek"],
      featured: false,
    },
    {
      id: "concept-membership",
      name: "Studio Membership",
      priceLabel: "€149",
      period: "per maand",
      description: "Onbeperkt trainen in groepslessen. Jouw ritme, onze ruimte.",
      features: [
        "Onbeperkt groepslessen",
        `Onbeperkt ${serviceLower}`,
        "Priority booking",
        "Maandelijks opzegbaar",
      ],
      featured: true,
    },
    {
      id: "concept-private",
      name: "Private Series",
      priceLabel: "€420",
      period: "6 sessies",
      description: "Persoonlijk traject op de reformer. Voor wie dieper wil werken aan techniek en doelen.",
      features: ["6 private sessies", "Persoonlijk programma", "Flexibel inplannen"],
      featured: false,
    },
  ];
}

/**
 * Template B gebruikt een eigen clinical beeldset, zodat A (warm editorial)
 * en B (Body Clinic-wit) niet dezelfde foto's delen.
 */
const CLINIC_DEMO: Record<string, ClinicImage> = {
  hero: PILATES_LIFESTYLE_FALLBACKS.hero,
  studio: PILATES_LIFESTYLE_FALLBACKS.studio,
  reformer: PILATES_LIFESTYLE_FALLBACKS.reformer,
  atmosphere: PILATES_LIFESTYLE_FALLBACKS.atmosphere,
  gallery1: PILATES_LIFESTYLE_FALLBACKS.gallery1,
  gallery2: PILATES_LIFESTYLE_FALLBACKS.gallery2,
  movement: PILATES_LIFESTYLE_FALLBACKS.movement,
  corner: PILATES_LIFESTYLE_FALLBACKS.corner,
};

const CLINIC_TEAM: Record<string, string> = {
  lotte: "/demo/pilates-clinic-instructor-1.jpg",
  noah: "/demo/pilates-clinic-instructor-2b.jpg",
  saar: "/demo/pilates-clinic-instructor-3b.jpg",
};

const CLINIC_TEAM_FALLBACKS = [
  "/demo/pilates-clinic-instructor-1.jpg",
  "/demo/pilates-clinic-instructor-2b.jpg",
  "/demo/pilates-clinic-instructor-3b.jpg",
] as const;

export function buildClinicModel(studio: StudioData): ClinicModel {
  const studioName = plainText(studio.studio_name);
  const city = plainText(studio.city);
  const primaryService = plainText(studio.primary_service);
  const lead = buildClinicLead(studio);

  const images = sanitizeStudioImages(studio.images ?? [], studioName);
  const curatedPool = [...CLINIC_CURATED_IMAGE_POOL];

  const heroImage = CLINIC_DEMO.hero!;
  const studioImage = CLINIC_DEMO.gallery1!;
  const reformerImage = CLINIC_DEMO.reformer!;

  const treatments = buildClinicTreatments(studio);

  const facts: ClinicModel["about"]["facts"] = [];
  if (studio.review_rating > 0) {
    facts.push({ value: formatRating(studio.review_rating), label: "Score" });
  }
  if (studio.founded_year > 0) {
    facts.push({ value: String(studio.founded_year), label: "Sinds" });
  }
  if (studio.review_count > 0) {
    facts.push({ value: String(studio.review_count), label: "Reviews" });
  }

  const bookingRaw = plainText(studio.booking_url);
  const bookingHref = bookingRaw || "#contact";

  const plansFromData: ClinicPlan[] = (studio.memberships ?? []).map((plan) => ({
    id: plan.id,
    name: plainText(plan.name),
    priceLabel: plainText(plan.price_label),
    period: plainText(plan.period),
    description: plainText(plan.description),
    features: plan.features.map((f) => plainText(f)).filter(Boolean),
    featured: Boolean(plan.featured),
  }));
  const plans =
    plansFromData.length > 0
      ? plansFromData
      : (studio.services ?? []).length > 0
        ? buildConceptPlans(studio)
        : [];

  const steps = buildSteps(studio, curatedPool);
  const { quotes, quotesAreHighlights } = ensureClinicQuotes(studio);
  const schedule = buildSchedule(treatments, studio.team ?? []);

  const team = (studio.team ?? []).map((member, index) => ({
    ...member,
    image_url:
      CLINIC_TEAM[member.id] ??
      CLINIC_TEAM_FALLBACKS[index % CLINIC_TEAM_FALLBACKS.length]!,
  }));

  const socialGallery = CLINIC_CURATED_IMAGE_POOL.slice(0, 6).map((image) => ({
    url: image.url,
    alt: image.alt,
  }));

  const navLinks: ClinicNavLink[] = [{ href: "#studio", label: "Studio" }];
  if (treatments.length > 0) navLinks.push({ href: "#lessen", label: "Lessen" });
  if (plans.length > 0) navLinks.push({ href: "#tarieven", label: "Tarieven" });
  navLinks.push({ href: "#contact", label: "Contact" });

  const address = [plainText(studio.address), city].filter(Boolean).join(", ") || null;
  const socials = buildClinicSocialLinks(studio);
  const faqs = ensureConceptFaqs(studio).map((faq) => ({
    id: faq.id,
    question: faq.question,
    answer: faq.answer,
  }));

  return {
    studioName,
    logoUrl: resolveStudioLogoUrl(studio.logo),
    logoLight: studio.logo_light,
    logoOnLightBackground: studio.logo_on_light_background,
    city,
    eyebrow: [city, primaryService].filter(Boolean).join(" · "),
    headline: buildClinicHeadline(studio),
    lead,
    booking: {
      href: bookingHref,
      external: /^https?:\/\//i.test(bookingHref),
      label: "Plan je proefles",
    },
    ratingDisplay: formatRating(studio.review_rating > 0 ? studio.review_rating : 4.9),
    ratingValue: studio.review_rating > 0 ? studio.review_rating : 4.9,
    reviewCount: studio.review_count > 0 ? studio.review_count : 48,
    primaryService,
    usps: buildUsps(studio),
    about: {
      heading: city ? `De studio in ${city}` : "De studio",
      body:
        plainText(studio.description) ||
        `${studioName} is gericht op ${primaryService || "Pilates"} met focus en rust.`,
      facts,
    },
    steps,
    treatments,
    schedule,
    quotes,
    plans,
    pricingNote:
      plansFromData.length > 0
        ? null
        : "Indicatieve concepttarieven voor dit voorstel. Actuele prijzen volgen bij livegang.",
    team,
    faqs,
    heroImage,
    studioImage,
    reformerImage,
    gallery: socialGallery,
    socials,
    contact: {
      address,
      hours: plainText(studio.opening_hours) || null,
      phone: plainText(studio.phone) || null,
      email: normalizeEmail(studio.email),
      instagram: plainText(studio.instagram_url) || null,
    },
    navLinks,
    show: {
      schedule: schedule.length > 0,
      treatments: treatments.length > 0,
      steps: steps.length > 0,
      about: Boolean(studio.description || studioImage),
      quotes: quotes.length >= 6,
      quotesAreHighlights,
      team: team.length > 0,
      socials: socials.length > 0,
      plans: plans.length > 0,
      faq: faqs.length > 0,
    },
  };
}
