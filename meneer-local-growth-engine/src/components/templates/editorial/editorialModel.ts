import type { CSSProperties } from "react";
import type { StudioData, StudioImage } from "@/types/studio";
import { resolveEditorialPalette } from "@/lib/brandPalette";
import {
  PILATES_LIFESTYLE_FALLBACKS,
  imageOrientation,
  isLogoOrBrandAsset,
  isPreviewWorthyStudioPhoto,
  isWeakHeroCandidate,
  sanitizeStudioImages,
} from "@/lib/previewImagePolicy";
import { formatRating } from "@/lib/studio";
import { clampWords, normalizeEmail, plainText, quoteText, sentences, wordCount } from "@/lib/text";
import { ensureConceptFaqs, ensureConceptServices } from "@/lib/previewContentFallbacks";
import type { StudioService } from "@/types/studio";

/**
 * View-model voor template A (Editorial).
 *
 * Snapshots van echte leads zijn dun: team, memberships, openingstijden en
 * oprichtingsjaar zijn vaak leeg. Dit model bepaalt daarom per sectie of er
 * genoeg echte data is, en leidt extra alinea's af uit feiten die er wel zijn.
 * Nooit verzonnen cijfers of claims.
 */


export interface EditorialPalette {
  ink: string;
  paper: string;
  accent: string;
}

/** Inline custom properties zonder any-cast. */
export type EditorialStyle = CSSProperties & {
  [key: `--${string}`]: string;
};

export interface EditorialFact {
  id: string;
  value: string;
  label: string;
}

export interface EditorialImage {
  url: string;
  alt: string;
}

export interface EditorialNavLink {
  href: string;
  label: string;
}

export interface EditorialQuote {
  id: string;
  text: string;
  author: string;
  meta: string | null;
  rating: number;
  /** Echte review of studio-highlight als er geen citeerbare reviews zijn. */
  kind: "review" | "highlight";
}

export interface EditorialContact {
  address: string | null;
  hours: string | null;
  phone: string | null;
  email: string | null;
  instagram: string | null;
}

export interface EditorialStatement {
  title: string;
  body: string;
}

/** Rond zegel over de collage. Alleen gevuld als er een echt cijfer is. */
export interface EditorialSealData {
  ring: string;
  value: string;
  caption: string;
}

export interface EditorialModel {
  palette: EditorialPalette;
  eyebrow: string;
  headlineWords: string[];
  lead: string;
  booking: { href: string; external: boolean; label: string };
  /** Korte USP-zinnen voor de top bar slider, uit echte studio-data. */
  topBarUsps: string[];
  about: {
    heading: string;
    paragraphs: string[];
    meta: EditorialFact[];
  };
  serviceImages: EditorialImage[];
  statement: EditorialStatement | null;
  bento: {
    band: EditorialImage | null;
    tiles: { id: string; title: string; description: string }[];
  };
  quotes: EditorialQuote[];
  ratingDisplay: string | null;
  gallery: EditorialImage[];
  heroImage: EditorialImage | null;
  /** True als de hero een bruikbaar lifestyle-beeld toont (nav-overlay + fullscreen). */
  heroHasMedia: boolean;
  collage: EditorialImage[];
  seal: EditorialSealData | null;
  statementImage: EditorialImage | null;
  contactImage: EditorialImage | null;
  contact: EditorialContact;
  pricingNote: string | null;
  navLinks: EditorialNavLink[];
  faqs: { id: string; question: string; answer: string }[];
  services: StudioService[];
  show: {
    statement: boolean;
    bento: boolean;
    quotes: boolean;
    quotesAreHighlights: boolean;
    team: boolean;
    gallery: boolean;
    memberships: boolean;
    offer: boolean;
    lessen: boolean;
    faq: boolean;
  };
}

function toImage(image: StudioImage | undefined): EditorialImage | null {
  if (!image?.url || !isPreviewWorthyStudioPhoto(image.url, image.alt)) return null;
  return { url: image.url, alt: plainText(image.alt) || "Studio" };
}

type EditorialImageRole =
  | "hero"
  | "studio"
  | "reformer"
  | "atmosphere"
  | "gallery";

const EDITORIAL_FALLBACKS: Record<string, EditorialImage> = {
  hero: PILATES_LIFESTYLE_FALLBACKS.hero,
  studio: PILATES_LIFESTYLE_FALLBACKS.studio,
  reformer: PILATES_LIFESTYLE_FALLBACKS.reformer,
  atmosphere: PILATES_LIFESTYLE_FALLBACKS.atmosphere,
  gallery1: PILATES_LIFESTYLE_FALLBACKS.gallery1,
  gallery2: PILATES_LIFESTYLE_FALLBACKS.gallery2,
};

/**
 * Eigen lifestyle-foto's eerst; demo-fallbacks vullen gaten zodat secties nooit leeg blijven.
 * Logo's en merkbeelden worden hard genegeerd.
 */
class EditorialImagery {
  private readonly byRole = new Map<EditorialImageRole, EditorialImage[]>();
  private readonly all: EditorialImage[] = [];
  private readonly used = new Set<string>();
  private readonly hasOwn: boolean;

  constructor(images: StudioImage[]) {
    const clean = images.filter(
      (image) => image.url && isPreviewWorthyStudioPhoto(image.url, image.alt)
    );

    for (const image of clean) {
      if (image.role === "team") continue;
      const entry = toImage(image);
      if (!entry || this.all.some((existing) => existing.url === entry.url)) continue;
      const bucket = this.byRole.get(image.role) ?? [];
      bucket.push(entry);
      this.byRole.set(image.role, bucket);
      this.all.push(entry);
    }

    this.hasOwn = this.all.length > 0;
  }

  pickWide(
    roles: EditorialImageRole[],
    fallbackKey: keyof typeof EDITORIAL_FALLBACKS
  ): EditorialImage {
    const landscape = this.all.find(
      (image) =>
        !this.used.has(image.url) &&
        imageOrientation(image.url) === "landscape" &&
        !isWeakHeroCandidate(image.url)
    );
    if (landscape) {
      this.used.add(landscape.url);
      return landscape;
    }
    return this.pick(roles, fallbackKey);
  }

  pick(
    roles: EditorialImageRole[],
    fallbackKey: keyof typeof EDITORIAL_FALLBACKS,
    avoid?: EditorialImage | null
  ): EditorialImage {
    const pools = [...roles.map((role) => this.byRole.get(role) ?? []), this.all];
    for (const pool of pools) {
      const fresh = pool.find((image) => !this.used.has(image.url) && image.url !== avoid?.url);
      if (fresh) {
        this.used.add(fresh.url);
        return fresh;
      }
    }
    const reusable = this.all.find((image) => image.url !== avoid?.url);
    if (reusable) return reusable;
    return EDITORIAL_FALLBACKS[fallbackKey] ?? EDITORIAL_FALLBACKS.hero;
  }

  list(count: number, keys: (keyof typeof EDITORIAL_FALLBACKS)[]): EditorialImage[] {
    const fallbacks = keys.map((key) => EDITORIAL_FALLBACKS[key]!);
    if (!this.hasOwn) return fallbacks.slice(0, count);

    const fresh = this.all.filter((image) => !this.used.has(image.url));
    const order = [...fresh, ...this.all];
    const out: EditorialImage[] = [];
    for (let index = 0; index < count; index += 1) {
      out.push(order[index % order.length] ?? fallbacks[index % fallbacks.length]!);
    }
    return out;
  }
}

function uniqueImages(images: (EditorialImage | null)[]): EditorialImage[] {
  const seen = new Set<string>();
  const out: EditorialImage[] = [];
  for (const image of images) {
    if (!image || seen.has(image.url)) continue;
    seen.add(image.url);
    out.push(image);
  }
  return out;
}

function resolvePalette(studio: StudioData): EditorialPalette {
  const palette = resolveEditorialPalette(studio);
  return {
    ink: palette.primary,
    paper: palette.secondary,
    accent: palette.accent,
  };
}

function servicesSentence(studio: StudioData): string | null {
  const names = studio.services.map((service) => plainText(service.name)).filter(Boolean);
  if (names.length === 0) return null;
  if (names.length === 1) {
    return `Het aanbod draait om ${names[0]!}.`;
  }
  const head = names.slice(0, -1).join(", ");
  const tail = names[names.length - 1]!;
  return `Op het programma staan ${head} en ${tail}.`;
}

function locationSentence(studio: StudioData): string | null {
  const city = plainText(studio.city);
  if (!city) return null;
  const address = plainText(studio.address);
  return address
    ? `De studio zit aan de ${address} in ${city}.`
    : `De studio zit in ${city}.`;
}

function foundedSentence(studio: StudioData): string | null {
  if (studio.founded_year <= 0) return null;
  return `${plainText(studio.studio_name)} draait sinds ${studio.founded_year}.`;
}

/** Maximaal drie korte regels voor de top bar, uit benefits of lesnamen. */
function buildTopBarUsps(studio: StudioData): string[] {
  const fromBenefits = studio.benefits
    .map((benefit) => plainText(benefit.title))
    .filter(Boolean)
    .slice(0, 3);
  if (fromBenefits.length >= 2) return fromBenefits;

  const fromServices = studio.services
    .map((service) => plainText(service.name))
    .filter(Boolean)
    .slice(0, 3);
  if (fromServices.length >= 2) return fromServices;

  const primary = plainText(studio.primary_service);
  const city = plainText(studio.city);
  return [primary, city ? `Pilates in ${city}` : null, "Plan je proefles"].filter(
    (value): value is string => Boolean(value)
  );
}

function buildAbout(studio: StudioData, lead: string): {
  heading: string;
  paragraphs: string[];
  meta: EditorialFact[];
} {
  const all = sentences(studio.description);
  const rest = all.filter((sentence) => sentence !== lead);

  const paragraphs: string[] = [];
  if (rest.length > 0) {
    paragraphs.push(rest.slice(0, 2).join(" "));
    if (rest.length > 2) paragraphs.push(rest.slice(2).join(" "));
  }

  const derived = [servicesSentence(studio), locationSentence(studio), foundedSentence(studio)]
    .filter((value): value is string => Boolean(value));

  if (paragraphs.length === 0) {
    // Dunne snapshot: bouw de alinea's uit feiten die wel bekend zijn.
    if (derived.length > 0) paragraphs.push(derived.slice(0, 2).join(" "));
    if (derived.length > 2) paragraphs.push(derived.slice(2).join(" "));
  } else if (paragraphs.length < 3 && derived.length > 0) {
    // Vul aan tot een volwaardige kolom, zonder iets te verzinnen.
    paragraphs.push(derived.slice(0, 2).join(" "));
  }

  const meta: EditorialFact[] = [];
  if (studio.city) {
    meta.push({ id: "meta-city", value: plainText(studio.city), label: "Locatie" });
  }
  if (studio.primary_service) {
    meta.push({
      id: "meta-focus",
      value: plainText(studio.primary_service),
      label: "Focus",
    });
  }
  if (studio.founded_year > 0) {
    meta.push({
      id: "meta-founded",
      value: String(studio.founded_year),
      label: "Sinds",
    });
  }

  return {
    heading: `Binnen bij ${plainText(studio.studio_name)}`,
    paragraphs: paragraphs.filter(Boolean),
    meta,
  };
}

/**
 * Filtert samenvattingen die als review zijn opgeslagen, zoals
 * "25 reviews met een score van 4.8" van auteur "Google reviews".
 * Die zeggen niets en staan naast het scoreblok dubbel.
 */
function isQuotable(text: string, author: string): boolean {
  if (text.length < 45) return false;
  if (/^\d+\s+reviews?\b/i.test(text)) return false;
  if (/\breviews?\b.*\bscore\b/i.test(text)) return false;
  if (/google/i.test(author) && /\d/.test(text)) return false;
  return true;
}

/**
 * Zegeltekst uit de ring plus één cijfer in het midden. Score gaat voor, anders
 * het oprichtingsjaar. Zonder beide blijft het zegel weg.
 */
function buildSeal(studio: StudioData): EditorialSealData | null {
  const ring =
    [plainText(studio.primary_service), plainText(studio.city)]
      .filter(Boolean)
      .join(" \u00B7 ") || plainText(studio.studio_name);
  if (!ring) return null;

  if (studio.review_rating > 0) {
    return {
      ring,
      value: formatRating(studio.review_rating),
      caption:
        studio.review_count > 0 ? `${studio.review_count} reviews` : "beoordeling",
    };
  }
  if (studio.founded_year > 0) {
    return { ring, value: String(studio.founded_year), caption: "sinds" };
  }
  return null;
}

function buildQuotes(studio: StudioData): EditorialQuote[] {
  return studio.reviews
    .filter((review) =>
      isQuotable(quoteText(review.text), plainText(review.author))
    )
    .slice(0, 3)
    .map((review) => ({
      id: review.id,
      text: clampWords(quoteText(review.text), 32),
      author: plainText(review.author) || "Lid van de studio",
      meta: review.date_label ? plainText(review.date_label) : null,
      rating: review.rating > 0 && review.rating <= 5 ? review.rating : 5,
      kind: "review" as const,
    }));
}

/** Vult de marquee als er wel een score is maar geen citeerbare reviewteksten. */
function buildHighlightQuotes(studio: StudioData): EditorialQuote[] {
  const rating = studio.review_rating > 0 ? studio.review_rating : 5;
  const scoreMeta =
    studio.review_count > 0
      ? `${formatRating(rating)} · ${studio.review_count} openbare beoordelingen`
      : "Studio focus";

  const fromBenefits: EditorialQuote[] = [];
  for (const benefit of studio.benefits) {
    const title = plainText(benefit.title);
    const description = plainText(benefit.description);
    if (!title || description.length < 28) continue;
    fromBenefits.push({
      id: `highlight-${benefit.id}`,
      text: clampWords(description, 32),
      author: title,
      meta: scoreMeta,
      rating,
      kind: "highlight",
    });
  }

  if (fromBenefits.length >= 3) return fromBenefits.slice(0, 3);

  const fromServices: EditorialQuote[] = [];
  for (const service of studio.services) {
    const name = plainText(service.name);
    const description = plainText(service.description);
    if (!name || description.length < 28) continue;
    fromServices.push({
      id: `highlight-${service.id}`,
      text: clampWords(description, 32),
      author: name,
      meta: scoreMeta,
      rating,
      kind: "highlight",
    });
  }

  const merged = [...fromBenefits];
  for (const quote of fromServices) {
    if (merged.length >= 3) break;
    if (!merged.some((existing) => existing.text === quote.text)) {
      merged.push(quote);
    }
  }

  if (merged.length >= 2) return merged.slice(0, 3);

  const city = plainText(studio.city);
  const service = plainText(studio.primary_service);
  const studioName = plainText(studio.studio_name);
  const fillers: EditorialQuote[] = [
    {
      id: "highlight-score",
      text: clampWords(
        studio.description ||
          `${studioName} richt zich op ${service.toLowerCase()} in ${city}.`,
        32
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
        servicesSentence(studio) ||
          `Het aanbod draait om ${service}. Plan een proefles en voel de sfeer zelf.`,
        32
      ),
      author: service || "Lessen",
      meta: scoreMeta,
      rating,
      kind: "highlight",
    },
  ];

  return [...merged, ...fillers].slice(0, 3);
}

export function buildEditorialModel(studio: StudioData): EditorialModel {
  const palette = resolvePalette(studio);
  const sanitizedImages = sanitizeStudioImages(
    studio.images ?? [],
    plainText(studio.studio_name)
  );
  const imagery = new EditorialImagery(sanitizedImages);

  const heroImage = imagery.pickWide(["hero", "studio", "atmosphere", "reformer"], "hero");
  const studioImage = imagery.pick(["studio", "atmosphere", "gallery"], "studio", heroImage);
  const reformerImage = imagery.pick(["reformer", "gallery", "atmosphere"], "reformer", studioImage);
  const statementImage = imagery.pick(
    ["atmosphere", "gallery", "studio", "reformer"],
    "atmosphere",
    heroImage
  );
  const bandImage = studioImage;
  const contactImage = imagery.pick(
    ["gallery", "atmosphere", "reformer"],
    "gallery2",
    statementImage
  );

  const collage = uniqueImages([studioImage, reformerImage]).slice(0, 2);

  const serviceImages = imagery.list(5, [
    "atmosphere",
    "studio",
    "hero",
    "reformer",
    "gallery1",
  ]);

  const gallery = uniqueImages([
    heroImage,
    studioImage,
    reformerImage,
    statementImage,
    ...imagery.list(3, ["gallery1", "gallery2", "atmosphere"]),
  ]).slice(0, 6);

  const heroHasMedia =
    Boolean(heroImage?.url) &&
    isPreviewWorthyStudioPhoto(heroImage.url, heroImage.alt) &&
    !isWeakHeroCandidate(heroImage.url) &&
    !isLogoOrBrandAsset(heroImage.url, heroImage.alt);

  const allSentences = sentences(studio.description);
  const firstSentence = allSentences[0] ?? "";
  // Korte eerste zin: pak er een tweede bij, zodat de hero niet mager blijft.
  const leadSource =
    wordCount(firstSentence) < 10 && allSentences[1]
      ? `${firstSentence} ${allSentences[1]}`
      : firstSentence;
  const lead =
    clampWords(leadSource, 24) ||
    clampWords(
      `${plainText(studio.primary_service)} in ${plainText(studio.city)}.`,
      24
    );

  const benefits = studio.benefits.filter((benefit) => plainText(benefit.title));
  const [firstBenefit, ...restBenefits] = benefits;

  const statement: EditorialStatement | null = firstBenefit
    ? {
        title: plainText(firstBenefit.title),
        body: plainText(firstBenefit.description),
      }
    : null;

  const tiles = restBenefits.slice(0, 4).map((benefit) => ({
    id: benefit.id,
    title: plainText(benefit.title),
    description: plainText(benefit.description),
  }));

  const quotesFromReviews = buildQuotes(studio);
  const quotesAreHighlights = quotesFromReviews.length === 0 && studio.review_rating > 0;
  const quotes =
    quotesFromReviews.length > 0
      ? quotesFromReviews
      : studio.review_rating > 0
        ? buildHighlightQuotes(studio)
        : [];

  const hasMemberships = studio.memberships.length > 0;
  const faqs = ensureConceptFaqs(studio);
  const services = ensureConceptServices(studio);
  const show = {
    statement: Boolean(statement),
    bento: tiles.length > 0,
    quotes: quotes.length > 0 || studio.review_rating > 0,
    quotesAreHighlights,
    team: studio.team.length > 0,
    gallery: gallery.length >= 3,
    memberships: hasMemberships,
    offer: !hasMemberships && services.length > 0,
    lessen: services.length > 0,
    faq: faqs.length > 0,
  };

  const navLinks: EditorialNavLink[] = [{ href: "#studio", label: "Studio" }];
  if (services.length > 0) navLinks.push({ href: "#lessen", label: "Lessen" });
  if (show.memberships || show.offer) {
    navLinks.push({ href: "#tarieven", label: hasMemberships ? "Tarieven" : "Aanbod" });
  }
  navLinks.push({ href: "#contact", label: "Contact" });

  const bookingRaw = plainText(studio.booking_url);
  const bookingHref = bookingRaw || "#contact";
  const contact: EditorialContact = {
    address: plainText(studio.address) || null,
    hours: plainText(studio.opening_hours) || null,
    phone: plainText(studio.phone) || null,
    email: normalizeEmail(studio.email),
    instagram: plainText(studio.instagram_url) || null,
  };

  return {
    palette,
    eyebrow: [plainText(studio.city), plainText(studio.primary_service)]
      .filter(Boolean)
      .join(" · "),
    headlineWords: plainText(studio.tagline).split(" ").filter(Boolean),
    lead,
    booking: {
      href: bookingHref,
      external: /^https?:\/\//i.test(bookingHref),
      label: "Plan je proefles",
    },
    topBarUsps: buildTopBarUsps(studio),
    about: buildAbout(studio, firstSentence),
    serviceImages,
    statement,
    bento: { band: bandImage, tiles },
    quotes,
    ratingDisplay: studio.review_rating > 0 ? formatRating(studio.review_rating) : null,
    gallery,
    heroImage: heroHasMedia ? heroImage : null,
    heroHasMedia,
    collage,
    seal: buildSeal(studio),
    statementImage,
    contactImage,
    contact,
    pricingNote: hasMemberships ? null : "Actuele tarieven op aanvraag.",
    navLinks,
    faqs,
    services,
    show,
  };
}
