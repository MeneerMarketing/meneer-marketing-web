import type { StudioData, StudioSkinConcern } from "@/types/studio";
import {
  buildConceptClinicJourney,
  buildConceptClinicReviews,
  buildConceptClinicTeam,
  buildConceptClinicTreatments,
  buildConceptSkinConcerns,
} from "@/lib/clinicPreviewFallbacks";
import { isFitnessJargon, sanitizeClinicCopy } from "@/lib/clinicCopySanitizer";
import { SKIN_CLINIC_LIFESTYLE_FALLBACKS } from "@/lib/previewImagePolicy";
import { clinicImagesFromStudio } from "@/lib/mapPreviewImages";
import { formatRating } from "@/lib/studio";
import { clampWords, normalizeEmail, plainText, quoteText, sentences } from "@/lib/text";

export interface AtelierImage {
  url: string;
  alt: string;
}

export interface AtelierNavLink {
  label: string;
  href: string;
}

export interface AtelierTreatment {
  id: string;
  name: string;
  from: string;
  description: string;
}

export interface AtelierJourneyStep {
  id: string;
  num: string;
  title: string;
  desc: string;
  image: AtelierImage;
}

export interface AtelierExpert {
  id: string;
  name: string;
  role: string;
  locs: string[];
  image: AtelierImage;
}

export interface AtelierStat {
  label: string;
  value: string;
  progress: number;
}

export interface AtelierSkinMetric {
  label: string;
  result: string;
  sub: string;
  progress: number;
}

export interface AtelierReview {
  id: string;
  text: string;
  author: string;
  meta: string | null;
  rating: number;
}

export interface AtelierSocialPost {
  image: AtelierImage;
  likes: string;
  caption: string;
}

export interface ClinicalAtelierModel {
  studioName: string;
  shortName: string;
  city: string;
  phone: string;
  phoneDisplay: string;
  email: string | null;
  hoursShort: string;
  openingHoursLines: string[];
  ratingDisplay: string;
  ratingValue: number;
  reviewCount: number;
  reviewCountLabel: string;
  bookingHref: string;
  bookingExternal: boolean;
  hero: {
    headlineBold: string;
    headlineLight: string;
    lead: string;
  };
  images: {
    hero: AtelierImage;
    imageData: AtelierImage;
    journey: AtelierImage[];
    treatPortrait: AtelierImage;
    treatDetail: AtelierImage;
    treatHands: AtelierImage;
    campaign: AtelierImage;
    testimonial: AtelierImage;
  };
  medicalReviewer: {
    name: string;
    role: string;
    clinic: string;
    image: AtelierImage;
  };
  locationTags: string;
  approachCopy: string;
  stats: AtelierStat[];
  patientQuote: { text: string; author: string };
  skinMetrics: AtelierSkinMetric[];
  journeySteps: AtelierJourneyStep[];
  journeyIntro: string;
  treatments: AtelierTreatment[];
  featuredTreatment: AtelierTreatment;
  secondaryTreatment: AtelierTreatment;
  tertiaryTreatment: AtelierTreatment;
  experts: AtelierExpert[];
  testimonial: AtelierReview;
  reviewPlatforms: string[];
  campaign: {
    eyebrow: string;
    titleBold: string;
    titleLight: string;
    body: string;
  };
  instagram: {
    handle: string;
    followers: string;
    href: string | null;
  };
  socialPosts: AtelierSocialPost[];
  footerTagline: string;
  footerTreatments: string[];
  footerAddress: { city: string; lines: string[] };
  navLinks: AtelierNavLink[];
  skinConcerns: StudioSkinConcern[];
}

const FALLBACKS = [
  SKIN_CLINIC_LIFESTYLE_FALLBACKS.hero,
  SKIN_CLINIC_LIFESTYLE_FALLBACKS.reception,
  SKIN_CLINIC_LIFESTYLE_FALLBACKS.treatment,
  SKIN_CLINIC_LIFESTYLE_FALLBACKS.atmosphere,
  SKIN_CLINIC_LIFESTYLE_FALLBACKS.consultation,
  SKIN_CLINIC_LIFESTYLE_FALLBACKS.gallery1,
  SKIN_CLINIC_LIFESTYLE_FALLBACKS.gallery2,
  SKIN_CLINIC_LIFESTYLE_FALLBACKS.detail,
] as const;

const PRICE_LADDER = ["€ 149", "€ 129", "€ 159", "€ 119", "€ 169", "€ 249", "€ 139", "€ 189"] as const;

const JOURNEY_NUMS = ["01", "02", "03", "04", "05"] as const;

const SOCIAL_CAPTIONS = [
  "Gezichtsmassage",
  "Hydratatie masker",
  "Microneedling resultaat",
  "Enzyme peeling",
  "Even tot rust",
] as const;

const SOCIAL_LIKES = ["1.2K", "847", "2.1K", "964", "1.5K"] as const;

function pickImages(studio: StudioData, count: number): AtelierImage[] {
  return clinicImagesFromStudio(studio, count, FALLBACKS).map((img) => ({
    url: img.url,
    alt: img.alt,
  }));
}

function formatPhoneDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `${digits.slice(0, 3)} – ${digits.slice(3, 6)} ${digits.slice(6, 8)} ${digits.slice(8)}`;
  }
  return phone;
}

function splitHeadline(tagline: string): { bold: string; light: string } {
  const words = plainText(tagline).split(/\s+/).filter(Boolean);
  if (words.length < 3) {
    return { bold: plainText(tagline) || "Stralende huid begint", light: "met de juiste zorg" };
  }
  const mid = Math.ceil(words.length / 2);
  return {
    bold: words.slice(0, mid).join(" "),
    light: words.slice(mid).join(" "),
  };
}

function buildHero(studio: StudioData, city: string, primaryService: string) {
  const tagline = plainText(studio.tagline);
  if (tagline && tagline.split(/\s+/).length >= 4) {
    const split = splitHeadline(tagline);
    return {
      headlineBold: split.bold,
      headlineLight: split.light,
      lead: buildLead(studio, city, primaryService),
    };
  }
  return {
    headlineBold: primaryService ? `${primaryService} die past` : "Stralende huid begint",
    headlineLight: city ? `bij jou in ${city}` : "met de juiste zorg",
    lead: buildLead(studio, city, primaryService),
  };
}

function buildLead(studio: StudioData, city: string, primaryService: string): string {
  const description = plainText(studio.description);
  const first = sentences(description)[0] ?? description;
  if (first && first.length > 50) return clampWords(first, 38);

  const studioName = plainText(studio.studio_name);
  const service = primaryService || "huidbehandelingen";
  return `Gespecialiseerde ${service.toLowerCase()} door gediplomeerde huidtherapeuten${city ? ` in ${city}` : ""}. Bij ${studioName} start alles met analyse, een helder plan en behandelingen die bij jouw huid passen.`;
}

function mapTreatments(studio: StudioData): AtelierTreatment[] {
  const concept = buildConceptClinicTreatments(studio);
  return concept.slice(0, 8).map((item, index) => ({
    id: item.id,
    name: item.name,
    from: `Vanaf ${PRICE_LADDER[index % PRICE_LADDER.length]}`,
    description: clampWords(item.description, 22),
  }));
}

function mapJourney(studio: StudioData, images: AtelierImage[]): AtelierJourneyStep[] {
  const raw = buildConceptClinicJourney(studio);
  const journeyImages = [
    images[3] ?? FALLBACKS[3],
    images[4] ?? FALLBACKS[4],
    images[2] ?? FALLBACKS[2],
    images[1] ?? FALLBACKS[1],
    images[5] ?? FALLBACKS[5],
  ];

  return raw.slice(0, 5).map((step, index) => ({
    id: step.id,
    num: JOURNEY_NUMS[index] ?? String(index + 1).padStart(2, "0"),
    title: step.title,
    desc: clampWords(step.body, 32),
    image: journeyImages[index] ?? journeyImages[0],
  }));
}

function mapExperts(studio: StudioData, images: AtelierImage[], city: string): AtelierExpert[] {
  const team =
    (studio.team ?? []).length > 0 ? studio.team! : buildConceptClinicTeam(studio);

  const fallbackPortraits = [
    images[6] ?? FALLBACKS[0],
    images[7] ?? FALLBACKS[1],
    images[2] ?? FALLBACKS[2],
    images[3] ?? FALLBACKS[3],
  ];

  return team.slice(0, 4).map((member, index) => ({
    id: member.id,
    name: plainText(member.name),
    role: plainText(member.role) || "Huidspecialist",
    locs: city ? [city, ...(index > 1 ? ["+1"] : [])] : ["Nederland"],
    image: member.image_url
      ? { url: member.image_url, alt: plainText(member.name) }
      : fallbackPortraits[index % fallbackPortraits.length],
  }));
}

function mapReviews(studio: StudioData, city: string): AtelierReview[] {
  const fromReviews: AtelierReview[] = [];
  for (const review of studio.reviews ?? []) {
    const text = sanitizeClinicCopy(review.text);
    if (!text || isFitnessJargon(text)) continue;
    fromReviews.push({
      id: review.id,
      text: quoteText(text),
      author: plainText(review.author) || "Klant",
      meta: plainText(review.date_label) || (city ? city : null),
      rating: review.rating > 0 ? review.rating : 5,
    });
  }

  if (fromReviews.length >= 2) return fromReviews;

  return buildConceptClinicReviews(studio, 4).map((item) => ({
    id: item.id,
    text: quoteText(item.text),
    author: item.author,
    meta: item.date_label || (city ? city : null),
    rating: item.rating,
  }));
}

function buildStats(studio: StudioData, ratingDisplay: string): AtelierStat[] {
  const reviewCount = studio.review_count > 0 ? studio.review_count : 4800;
  return [
    { label: "Jaren ervaring", value: "10+", progress: 75 },
    { label: "Locaties", value: plainText(studio.city) || "1", progress: 55 },
    { label: "Behandelingen/jaar", value: "5.000+", progress: 88 },
    { label: "Klantscore", value: ratingDisplay.replace(".", ","), progress: 92 },
    { label: "BIG-geregistreerd", value: "100%", progress: 100 },
  ];
}

function buildSkinMetrics(studio: StudioData): AtelierSkinMetric[] {
  const service = plainText(studio.primary_service) || "behandeling";
  return [
    { label: "Hydratatie", result: "+22%", sub: "Na meerdere sessies", progress: 72 },
    { label: "Huidtextuur", result: "Egaler", sub: "Zichtbaar gladder na peeling", progress: 85 },
    { label: "Elasticiteit", result: "+18%", sub: "Verbetering na traject", progress: 68 },
    { label: "Pigmentatie", result: "Verminderd", sub: "Na laserbehandeling", progress: 78 },
    {
      label: "Behandelplan",
      result: "Helder",
      sub: `Afgestemd op jouw huid en ${service.toLowerCase()}`,
      progress: 100,
    },
  ];
}

function instagramHandle(studio: StudioData, studioName: string): string {
  const url = plainText(studio.instagram_url);
  if (url) {
    const match = url.match(/instagram\.com\/([^/?]+)/i);
    if (match?.[1]) return `@${match[1]}`;
  }
  const slug = studioName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 18);
  return `@${slug || "huidkliniek"}`;
}

export function buildClinicalAtelierModel(studio: StudioData): ClinicalAtelierModel {
  const studioName = plainText(studio.studio_name);
  const city = plainText(studio.city);
  const primaryService = plainText(studio.primary_service) || "Huidbehandelingen";
  const images = pickImages(studio, 12);

  const ratingValue = studio.review_rating > 0 ? studio.review_rating : 9.2;
  const reviewCount = studio.review_count > 0 ? studio.review_count : 4800;
  const ratingDisplay = formatRating(ratingValue);

  const phone = plainText(studio.phone) || "020 – 123 45 67";
  const phoneDisplay = formatPhoneDisplay(phone);

  const bookingRaw = plainText(studio.booking_url);
  const bookingHref = bookingRaw || "#contact";

  const treatments = mapTreatments(studio);
  const experts = mapExperts(studio, images, city);
  const reviews = mapReviews(studio, city);
  const journeySteps = mapJourney(studio, images);
  const skinConcerns = buildConceptSkinConcerns(studio.skin_concerns ? studio : undefined);

  const featured = treatments[0] ?? {
    id: "tx-1",
    name: "Microneedling",
    from: "Vanaf € 149",
    description: "Stimuleert huidvernieuwing voor een stralende, egale huid.",
  };
  const secondary = treatments[1] ?? featured;
  const tertiary = treatments[2] ?? featured;

  const leadReviewer = experts[0] ?? {
    id: "reviewer",
    name: "Dr. skin specialist",
    role: "Dermatoloog",
    locs: [city || "Nederland"],
    image: images[1] ?? FALLBACKS[1],
  };

  const testimonial = reviews[0] ?? {
    id: "review-fallback",
    text: "Na jaren strijd met mijn huid voelde ik me hier voor het eerst echt begrepen. Het resultaat heeft mijn zelfvertrouwen teruggegeven.",
    author: "Femke V., 41 jaar",
    meta: `${featured.name}${city ? ` · ${city}` : ""}`,
    rating: 5,
  };

  const patientQuote = reviews[1] ?? {
    id: "quote-fallback",
    text: "Mijn huid heeft een complete transformatie doorgemaakt. Ik voel me eindelijk zelfverzekerd in mijn eigen huid.",
    author: `Marieke, 38${city ? ` · ${city}` : ""}`,
    meta: null,
    rating: 5,
  };

  const socialGallery = images.slice(0, 5);
  const socialPosts: AtelierSocialPost[] = socialGallery.map((image, index) => ({
    image,
    likes: SOCIAL_LIKES[index % SOCIAL_LIKES.length],
    caption: SOCIAL_CAPTIONS[index % SOCIAL_CAPTIONS.length],
  }));

  const addressLine = plainText(studio.address);
  const footerAddress = {
    city: city || "Locatie",
    lines: addressLine ? [addressLine] : ["Adres volgt bij livegang"],
  };

  const hoursRaw = plainText(studio.opening_hours);
  const hoursShort = hoursRaw || "Ma–Vr. 09:00–17:30 · Za. 09:00–15:00";
  const openingHoursLines = hoursRaw
    ? [hoursRaw]
    : [
        "Maandag – vrijdag  09:00 – 17:30",
        "Zaterdag  10:00 – 15:00",
        "Zondag  Gesloten",
      ];

  const navLinks: AtelierNavLink[] = [
    { label: "Behandelingen", href: "#behandelingen" },
    { label: "Huidproblemen", href: "#huidproblemen" },
    { label: "Tarieven", href: "#tarieven" },
    { label: "Informatie", href: "#informatie" },
    { label: "Over ons", href: "#over-ons" },
  ];

  const shortName = studioName.split(/\s+/).slice(0, 2).join(" ") || studioName;

  return {
    studioName,
    shortName,
    city,
    phone,
    phoneDisplay,
    email: normalizeEmail(studio.email),
    hoursShort,
    openingHoursLines,
    ratingDisplay,
    ratingValue,
    reviewCount,
    reviewCountLabel: `uit ${reviewCount.toLocaleString("nl-NL")}+ ervaringen`,
    bookingHref,
    bookingExternal: /^https?:\/\//i.test(bookingHref),
    hero: buildHero(studio, city, primaryService),
    images: {
      hero: images[0] ?? FALLBACKS[0],
      imageData: images[1] ?? FALLBACKS[1],
      journey: journeySteps.map((s) => s.image),
      treatPortrait: images[2] ?? FALLBACKS[2],
      treatDetail: images[3] ?? FALLBACKS[3],
      treatHands: images[4] ?? FALLBACKS[4],
      campaign: images[5] ?? FALLBACKS[5],
      testimonial: images[6] ?? FALLBACKS[0],
    },
    medicalReviewer: {
      name: leadReviewer.name,
      role: leadReviewer.role,
      clinic: studioName,
      image: leadReviewer.image,
    },
    locationTags: city || "Nederland",
    approachCopy: `Elk behandelplan wordt individueel opgesteld bij ${studioName}. Afgestemd op jouw huid, wensen en levensstijl.`,
    stats: buildStats(studio, ratingDisplay),
    patientQuote: {
      text: patientQuote.text,
      author: patientQuote.author,
    },
    skinMetrics: buildSkinMetrics(studio),
    journeySteps,
    journeyIntro:
      "Van huidanalyse tot nazorg: we begeleiden je bij elke stap. Je huidspecialist blijft betrokken gedurende het volledige behandeltraject.",
    treatments,
    featuredTreatment: featured,
    secondaryTreatment: secondary,
    tertiaryTreatment: tertiary,
    experts,
    testimonial,
    reviewPlatforms: ["Google", "Kliniekervaringen", "Trustpilot"],
    campaign: {
      eyebrow: "Actie",
      titleBold: "Samen stralen.",
      titleLight: "Breng een vriendin mee.",
      body: "Plan een huidconsult samen met een vriendin en ontvang allebei 15% korting op jullie eerste behandeling.",
    },
    instagram: {
      handle: instagramHandle(studio, studioName),
      followers: "2,8K volgers",
      href: plainText(studio.instagram_url) || null,
    },
    socialPosts,
    footerTagline: `Gecertificeerde huidzorg voor een stralend en gezond resultaat. ${studioName} is jouw specialist in medische huidbehandelingen${city ? ` in ${city}` : ""}.`,
    footerTreatments: treatments.slice(0, 8).map((t) => t.name),
    footerAddress,
    navLinks,
    skinConcerns,
  };
}
