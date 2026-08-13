import type { CSSProperties } from "react";
import type { StudioData, StudioImage } from "@/types/studio";
import { guardColor } from "@/lib/color";
import { formatRating } from "@/lib/studio";
import { clampWords, plainText, quoteText, sentences, wordCount } from "@/lib/text";

/**
 * View-model voor template A (Editorial).
 *
 * Snapshots van echte leads zijn dun: team, memberships, openingstijden en
 * oprichtingsjaar zijn vaak leeg. Dit model bepaalt daarom per sectie of er
 * genoeg echte data is, en leidt extra alinea's af uit feiten die er wel zijn.
 * Nooit verzonnen cijfers of claims.
 */

/** Warm Pilates-palet: espresso, zand-wit en één bronzen accent. */
const FALLBACK_PALETTE = {
  ink: "#2a211a",
  paper: "#f8f4ee",
  accent: "#9c6b45",
} as const;

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
  collage: EditorialImage[];
  seal: EditorialSealData | null;
  statementImage: EditorialImage | null;
  contactImage: EditorialImage | null;
  contact: EditorialContact;
  pricingNote: string | null;
  navLinks: EditorialNavLink[];
  show: {
    statement: boolean;
    bento: boolean;
    quotes: boolean;
    team: boolean;
    gallery: boolean;
    memberships: boolean;
    offer: boolean;
    faq: boolean;
  };
}

function toImage(image: StudioImage | undefined): EditorialImage | null {
  if (!image?.url) return null;
  return { url: image.url, alt: plainText(image.alt) || "Studio" };
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

function byRole(studio: StudioData, role: StudioImage["role"]): StudioImage[] {
  return studio.images.filter((image) => image.role === role && Boolean(image.url));
}

function resolvePalette(studio: StudioData): EditorialPalette {
  const paper = guardColor(studio.secondary_color, {
    fallback: FALLBACK_PALETTE.paper,
    minLuminance: 0.72,
  });
  const ink = guardColor(studio.primary_color, {
    fallback: FALLBACK_PALETTE.ink,
    maxLuminance: 0.22,
  });
  const accent = guardColor(studio.accent_color, {
    fallback: FALLBACK_PALETTE.accent,
    contrastAgainst: paper,
    minContrast: 3,
  });
  return { ink, paper, accent };
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
    }));
}

export function buildEditorialModel(studio: StudioData): EditorialModel {
  const palette = resolvePalette(studio);

  const heroImage = toImage(byRole(studio, "hero")[0] ?? studio.images[0]);
  const studioImage = toImage(byRole(studio, "studio")[0]);
  const reformerImage = toImage(byRole(studio, "reformer")[0]);
  const atmosphereImage = toImage(byRole(studio, "atmosphere")[0]);
  const galleryImages = byRole(studio, "gallery").map(toImage);

  const pool = uniqueImages([
    studioImage,
    reformerImage,
    atmosphereImage,
    ...galleryImages,
  ]).filter((image) => image.url !== heroImage?.url);

  /** Voorkeursrol, met een index uit de pool als de rol ontbreekt. */
  const pick = (
    preferred: EditorialImage | null,
    index: number
  ): EditorialImage | null => preferred ?? pool[index] ?? heroImage;

  const collage = uniqueImages([
    pick(studioImage, 0),
    pick(reformerImage, 1),
  ]).slice(0, 2);
  const statementImage = pick(atmosphereImage, 2);
  const bandImage = pick(studioImage, 0);
  const contactImage = pool[pool.length - 1] ?? heroImage;

  // Eerst de beelden waarop mensen of ruimte te zien zijn, detailshots achteraan.
  const serviceImages = uniqueImages([
    atmosphereImage,
    studioImage,
    heroImage,
    reformerImage,
    ...galleryImages,
  ]);

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

  const quotes = buildQuotes(studio);
  const gallery = uniqueImages([heroImage, ...pool]);

  const bookingRaw = plainText(studio.booking_url);
  const bookingHref = bookingRaw || "#contact";
  const contact: EditorialContact = {
    address: plainText(studio.address) || null,
    hours: plainText(studio.opening_hours) || null,
    phone: plainText(studio.phone) || null,
    email: plainText(studio.email) || null,
    instagram: plainText(studio.instagram_url) || null,
  };

  const hasMemberships = studio.memberships.length > 0;
  const show = {
    statement: Boolean(statement),
    bento: tiles.length > 0,
    quotes: quotes.length > 0,
    team: studio.team.length > 0,
    gallery: gallery.length >= 3,
    memberships: hasMemberships,
    offer: !hasMemberships && studio.services.length > 0,
    faq: studio.faqs.length > 0,
  };

  const navLinks: EditorialNavLink[] = [{ href: "#studio", label: "Studio" }];
  if (studio.services.length > 0) navLinks.push({ href: "#lessen", label: "Lessen" });
  if (show.memberships || show.offer) {
    navLinks.push({ href: "#tarieven", label: hasMemberships ? "Tarieven" : "Aanbod" });
  }
  navLinks.push({ href: "#contact", label: "Contact" });

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
    heroImage,
    collage,
    seal: buildSeal(studio),
    statementImage,
    contactImage,
    contact,
    pricingNote: hasMemberships ? null : "Actuele tarieven op aanvraag.",
    navLinks,
    show,
  };
}
