import type { CSSProperties } from "react";
import type { StudioData, StudioImage } from "@/types/studio";
import { formatRating } from "@/lib/studio";
import { clampWords, plainText, quoteText, sentences } from "@/lib/text";

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
    team: boolean;
    socials: boolean;
    plans: boolean;
    faq: boolean;
  };
}

function toImage(image: StudioImage | undefined): ClinicImage | null {
  if (!image?.url) return null;
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

function instagramHandle(url: string): string {
  const match = url.match(/instagram\.com\/([^/?#]+)/i);
  return match?.[1] ? `@${match[1]}` : "@studio";
}

function buildSocials(studio: StudioData): ClinicModel["socials"] {
  const socials: ClinicModel["socials"] = [];
  const ig = plainText(studio.instagram_url);
  if (ig) {
    const handle = instagramHandle(ig);
    socials.push({
      id: "instagram",
      label: "Instagram",
      href: ig.startsWith("http") ? ig : `https://instagram.com/${ig.replace(/^@/, "")}`,
      handle,
      iconSrc: "/demo/social/instagram.png",
    });
    // Demo-TikTok naast Instagram; echte leads vullen dit later vanuit scrapes.
    socials.push({
      id: "tiktok",
      label: "TikTok",
      href: `https://www.tiktok.com/${handle}`,
      handle,
      iconSrc: "/demo/social/tiktok.png",
    });
  }
  return socials;
}

function buildUsps(studio: StudioData): string[] {
  const fromBenefits = studio.benefits
    .map((b) => plainText(b.title))
    .filter(Boolean)
    .slice(0, 3);
  if (fromBenefits.length >= 2) return fromBenefits;

  const services = studio.services
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
  const withImage = (index: number) =>
    images.length > 0 ? images[index % images.length]! : null;

  const fromBenefits = studio.benefits.slice(0, 4).map((benefit, index) => ({
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

function buildQuotes(studio: StudioData): ClinicQuote[] {
  return studio.reviews
    .map((review) => {
      const text = quoteText(review.text);
      if (wordCountSafe(text) < 8) return null;
      return {
        id: review.id,
        text,
        author: plainText(review.author) || "Lid",
        meta: plainText(review.date_label) || null,
        rating: review.rating > 0 ? review.rating : studio.review_rating,
      };
    })
    .filter((q): q is ClinicQuote => Boolean(q))
    .slice(0, 8);
}

function wordCountSafe(text: string): number {
  return text ? text.split(/\s+/).filter(Boolean).length : 0;
}

function roleImage(studio: StudioData, role: string): ClinicImage | null {
  return toImage(studio.images.find((image) => image.role === role));
}

/**
 * Template B gebruikt een eigen clinical beeldset, zodat A (warm editorial)
 * en B (Body Clinic-wit) niet dezelfde foto's delen.
 */
const CLINIC_DEMO: Record<string, ClinicImage> = {
  hero: {
    url: "/demo/pilates-warm-hero.webp",
    alt: "Reformer oefening bij hoge boogramen in een lichte boutique studio",
  },
  studio: {
    url: "/demo/pilates-warm-studio.webp",
    alt: "Studioruimte met reformers, eikenvloer en warme kalkwanden",
  },
  reformer: {
    url: "/demo/pilates-warm-reformer.webp",
    alt: "Detail van leren straps en veren op de reformer",
  },
  atmosphere: {
    url: "/demo/pilates-warm-atmosphere.webp",
    alt: "Instructeur die een houding corrigeert op de reformer",
  },
  gallery1: {
    url: "/demo/pilates-warm-movement.webp",
    alt: "Voeten in de straps tijdens een reformer oefening",
  },
  gallery2: {
    url: "/demo/pilates-warm-corner.webp",
    alt: "Rustige studiohoek met handdoeken en eikenbank",
  },
};

const CLINIC_TEAM: Record<string, string> = {
  lotte: "/demo/pilates-clinic-instructor-1.jpg",
  noah: "/demo/pilates-clinic-instructor-2b.jpg",
  saar: "/demo/pilates-clinic-instructor-3b.jpg",
};

export function buildClinicModel(studio: StudioData): ClinicModel {
  const studioName = plainText(studio.studio_name);
  const city = plainText(studio.city);
  const primaryService = plainText(studio.primary_service);
  const lead =
    clampWords(sentences(studio.description)[0] ?? studio.description, 28) ||
    `${studioName} in ${city}.`;

  const heroImage = CLINIC_DEMO.hero ?? roleImage(studio, "hero");
  const studioImage =
    CLINIC_DEMO.studio ?? roleImage(studio, "studio") ?? roleImage(studio, "atmosphere");
  const reformerImage = CLINIC_DEMO.reformer ?? roleImage(studio, "reformer");
  const galleryPool = [
    CLINIC_DEMO.atmosphere,
    CLINIC_DEMO.gallery1,
    CLINIC_DEMO.gallery2,
    CLINIC_DEMO.reformer,
  ].filter((image): image is ClinicImage => Boolean(image));

  const treatmentPool = [
    CLINIC_DEMO.reformer,
    CLINIC_DEMO.atmosphere,
    CLINIC_DEMO.gallery1,
    CLINIC_DEMO.studio,
    CLINIC_DEMO.gallery2,
  ].filter((image): image is ClinicImage => Boolean(image));

  const treatments: ClinicTreatment[] = studio.services.map((service, index) => ({
    id: service.id,
    name: plainText(service.name),
    description: plainText(service.description),
    duration: service.duration_minutes ? `${service.duration_minutes} min` : null,
    highlight: Boolean(service.highlight),
    image:
      treatmentPool[index % Math.max(1, treatmentPool.length)] ??
      reformerImage ??
      heroImage,
  }));

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

  const plans: ClinicPlan[] = studio.memberships.map((plan) => ({
    id: plan.id,
    name: plainText(plan.name),
    priceLabel: plainText(plan.price_label),
    period: plainText(plan.period),
    description: plainText(plan.description),
    features: plan.features.map((f) => plainText(f)).filter(Boolean),
    featured: Boolean(plan.featured),
  }));

  const steps = buildSteps(studio, [
    CLINIC_DEMO.reformer,
    CLINIC_DEMO.atmosphere,
    CLINIC_DEMO.gallery1,
    CLINIC_DEMO.studio,
    CLINIC_DEMO.gallery2,
  ].filter((image): image is ClinicImage => Boolean(image)));
  const quotes = buildQuotes(studio);
  const schedule = buildSchedule(treatments, studio.team);
  const gallery = uniqueImages([
    reformerImage,
    studioImage,
    ...galleryPool,
  ].filter((image): image is ClinicImage => Boolean(image))).slice(0, 6);

  const team = studio.team.map((member) => ({
    ...member,
    image_url: CLINIC_TEAM[member.id] ?? member.image_url,
  }));

  const navLinks: ClinicNavLink[] = [{ href: "#studio", label: "Studio" }];
  if (treatments.length > 0) navLinks.push({ href: "#lessen", label: "Lessen" });
  if (plans.length > 0) navLinks.push({ href: "#tarieven", label: "Tarieven" });
  navLinks.push({ href: "#contact", label: "Contact" });

  const address = [plainText(studio.address), city].filter(Boolean).join(", ") || null;
  const socials = buildSocials(studio);

  return {
    studioName,
    city,
    eyebrow: [city, primaryService].filter(Boolean).join(" · "),
    headline: splitHeadline(studio.tagline),
    lead,
    booking: {
      href: bookingHref,
      external: /^https?:\/\//i.test(bookingHref),
      label: "Plan je proefles",
    },
    ratingDisplay: studio.review_rating > 0 ? formatRating(studio.review_rating) : null,
    ratingValue: studio.review_rating,
    reviewCount: studio.review_count,
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
    pricingNote: plans.length > 0 ? null : "Actuele tarieven op aanvraag.",
    team,
    faqs: studio.faqs,
    heroImage,
    studioImage,
    reformerImage,
    gallery,
    socials,
    contact: {
      address,
      hours: plainText(studio.opening_hours) || null,
      phone: plainText(studio.phone) || null,
      email: plainText(studio.email) || null,
      instagram: plainText(studio.instagram_url) || null,
    },
    navLinks,
    show: {
      schedule: schedule.length > 0,
      treatments: treatments.length > 0,
      steps: steps.length > 0,
      about: Boolean(studio.description || studioImage),
      quotes: quotes.length > 0,
      team: team.length > 0,
      socials: socials.length > 0,
      plans: plans.length > 0,
      faq: studio.faqs.length > 0,
    },
  };
}
