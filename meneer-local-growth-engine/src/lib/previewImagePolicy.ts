import type { StudioImage } from "@/types/studio";

/**
 * Zelfde beelden als live Studio Forma op preview.meneermarketing.nl.
 * Lokale assets in public/demo/ — geen Unsplash, geen scrape.
 */
export const FORMA_PREVIEW_ASSETS = {
  hero: {
    url: "/demo/pilates-warm-hero.webp",
    alt: "Reformer Pilates bij hoge ramen in een lichte boutique studio",
  },
  studio: {
    url: "/demo/pilates-warm-studio.webp",
    alt: "Studioruimte met reformers en warme kalkwanden",
  },
  reformer: {
    url: "/demo/pilates-warm-reformer.webp",
    alt: "Detail van reformer en straps in warme studio",
  },
  atmosphere: {
    url: "/demo/pilates-warm-atmosphere.webp",
    alt: "Rustige sfeer in de Pilates studio",
  },
  movement: {
    url: "/demo/pilates-warm-movement.webp",
    alt: "Instructeur die begeleiding geeft op de reformer",
  },
  corner: {
    url: "/demo/pilates-warm-corner.webp",
    alt: "Studiohoek met reformer en warm licht",
  },
} as const;

/** @deprecated Gebruik FORMA_PREVIEW_ASSETS — alias voor bestaande imports. */
export const PILATES_LIFESTYLE_FALLBACKS = {
  hero: FORMA_PREVIEW_ASSETS.hero,
  studio: FORMA_PREVIEW_ASSETS.studio,
  reformer: FORMA_PREVIEW_ASSETS.reformer,
  atmosphere: FORMA_PREVIEW_ASSETS.atmosphere,
  gallery1: FORMA_PREVIEW_ASSETS.studio,
  gallery2: FORMA_PREVIEW_ASSETS.corner,
  movement: FORMA_PREVIEW_ASSETS.movement,
  corner: FORMA_PREVIEW_ASSETS.corner,
  detail: FORMA_PREVIEW_ASSETS.reformer,
} as const;

/** Premium stock voor huidkliniek-previews. Lokale assets in public/demo — stabiel, geen dode Unsplash-links. */
export const SKIN_CLINIC_PREVIEW_ASSETS = {
  hero: {
    url: "/demo/skin-clinic-hero.webp",
    alt: "Faciale behandeling in een lichte, moderne huidkliniek",
  },
  reception: {
    url: "/demo/skin-clinic-reception.webp",
    alt: "Rustige behandelruimte met warm licht en neutrale tinten",
  },
  treatment: {
    url: "/demo/skin-clinic-treatment.webp",
    alt: "Huidverbetering in een serene klinische setting",
  },
  consultation: {
    url: "/demo/skin-clinic-consultation.webp",
    alt: "Intake en behandeling door een specialist",
  },
  atmosphere: {
    url: "/demo/skin-clinic-atmosphere.webp",
    alt: "Spa-achtige sfeer met zacht licht en neutrale tinten",
  },
  detail: {
    url: "/demo/skin-clinic-detail.webp",
    alt: "Facial massage in een premium kliniekinterieur",
  },
} as const;

export const SKIN_CLINIC_PREVIEW_ASSET_PATHS = [
  "/demo/skin-clinic-hero.webp",
  "/demo/skin-clinic-reception.webp",
  "/demo/skin-clinic-treatment.webp",
  "/demo/skin-clinic-consultation.webp",
  "/demo/skin-clinic-atmosphere.webp",
  "/demo/skin-clinic-detail.webp",
] as const;

export const SKIN_CLINIC_LIFESTYLE_FALLBACKS = {
  hero: SKIN_CLINIC_PREVIEW_ASSETS.hero,
  reception: SKIN_CLINIC_PREVIEW_ASSETS.reception,
  treatment: SKIN_CLINIC_PREVIEW_ASSETS.treatment,
  consultation: SKIN_CLINIC_PREVIEW_ASSETS.consultation,
  atmosphere: SKIN_CLINIC_PREVIEW_ASSETS.atmosphere,
  gallery1: SKIN_CLINIC_PREVIEW_ASSETS.reception,
  gallery2: SKIN_CLINIC_PREVIEW_ASSETS.detail,
  detail: SKIN_CLINIC_PREVIEW_ASSETS.treatment,
} as const;

export const SKIN_CLINIC_PREVIEW_STOCK_IDS = [
  "skin-clinic-hero",
  "skin-clinic-reception",
  "skin-clinic-treatment",
  "skin-clinic-consultation",
  "skin-clinic-atmosphere",
  "skin-clinic-detail",
] as const;

export function isSkinClinicVerticalSlug(slug: string | null | undefined): boolean {
  const normalized = (slug ?? "").toLowerCase();
  return normalized === "skin-clinics" || normalized === "huidklinieken";
}

export function getCuratedSkinClinicPreviewImages(studioName: string): StudioImage[] {
  const roles: Array<StudioImage["role"]> = [
    "hero",
    "studio",
    "atmosphere",
    "gallery",
    "gallery",
    "team",
  ];
  const shots = [
    SKIN_CLINIC_LIFESTYLE_FALLBACKS.hero,
    SKIN_CLINIC_LIFESTYLE_FALLBACKS.reception,
    SKIN_CLINIC_LIFESTYLE_FALLBACKS.treatment,
    SKIN_CLINIC_LIFESTYLE_FALLBACKS.atmosphere,
    SKIN_CLINIC_LIFESTYLE_FALLBACKS.gallery1,
    SKIN_CLINIC_LIFESTYLE_FALLBACKS.gallery2,
  ];

  return roles.map((role, index) => ({
    id: `skin-clinic-${role}-${index}`,
    url: shots[index]!.url,
    alt: `${studioName} · ${shots[index]!.alt}`,
    role,
  }));
}

export function getCuratedPreviewImagesForVertical(
  studioName: string,
  verticalSlug?: string | null,
): StudioImage[] {
  if (isSkinClinicVerticalSlug(verticalSlug)) {
    return getCuratedSkinClinicPreviewImages(studioName);
  }
  return getCuratedPreviewImages(studioName);
}

export const CURATED_PREVIEW_ASSET_PATHS = [
  "/demo/pilates-warm-hero.webp",
  "/demo/pilates-warm-studio.webp",
  "/demo/pilates-warm-reformer.webp",
  "/demo/pilates-warm-atmosphere.webp",
  "/demo/pilates-warm-movement.webp",
  "/demo/pilates-warm-corner.webp",
] as const;

/** Legacy Unsplash IDs — alleen nog voor oude snapshots in DB. */
export const CURATED_PREVIEW_STOCK_IDS = [
  "1518611012118-696072aa579a",
  "1518310383802-640c2de311b2",
  "1544367567-0f2fcb009e0b",
  "1574680096145-d05b474e2155",
] as const;

export function isCuratedPreviewStock(url: string): boolean {
  if (CURATED_PREVIEW_ASSET_PATHS.some((path) => url.includes(path))) return true;
  if (SKIN_CLINIC_PREVIEW_ASSET_PATHS.some((path) => url.includes(path))) return true;
  if (SKIN_CLINIC_PREVIEW_STOCK_IDS.some((id) => url.includes(id))) return true;
  return CURATED_PREVIEW_STOCK_IDS.some((id) => url.includes(id));
}

export function getCuratedPreviewImages(studioName: string): StudioImage[] {
  const roles: Array<StudioImage["role"]> = [
    "hero",
    "studio",
    "reformer",
    "atmosphere",
    "gallery",
    "gallery",
  ];
  const shots = [
    PILATES_LIFESTYLE_FALLBACKS.hero,
    PILATES_LIFESTYLE_FALLBACKS.studio,
    PILATES_LIFESTYLE_FALLBACKS.reformer,
    PILATES_LIFESTYLE_FALLBACKS.atmosphere,
    PILATES_LIFESTYLE_FALLBACKS.gallery1,
    PILATES_LIFESTYLE_FALLBACKS.gallery2,
  ];

  return roles.map((role, index) => ({
    id: `curated-${role}-${index}`,
    url: shots[index]!.url,
    alt: `${studioName} · ${shots[index]!.alt}`,
    role,
  }));
}

/** Vaste volgorde voor huidkliniek-templates: clinical spa aesthetic, geen Pilates. */
export const CLINIC_CURATED_IMAGE_POOL = [
  SKIN_CLINIC_LIFESTYLE_FALLBACKS.hero,
  SKIN_CLINIC_LIFESTYLE_FALLBACKS.reception,
  SKIN_CLINIC_LIFESTYLE_FALLBACKS.treatment,
  SKIN_CLINIC_LIFESTYLE_FALLBACKS.consultation,
  SKIN_CLINIC_LIFESTYLE_FALLBACKS.atmosphere,
  SKIN_CLINIC_LIFESTYLE_FALLBACKS.gallery1,
  SKIN_CLINIC_LIFESTYLE_FALLBACKS.gallery2,
  SKIN_CLINIC_LIFESTYLE_FALLBACKS.detail,
] as const;

const LOW_AESTHETIC =
  /sunset|sunrise|silhouette|brick|yoga\b|crossfit|weight\s*room|treadmill|bodybuilding|stock.*fitness|dumbbell|dumbbells|kettlebell|weightlifting|aerobic|industrial\s+gym|gym\s+class|fitness\s+class|group\s+fitness|exposed\s+brick/i;
/** Ziekenhuislobby's, makeup-shots en off-topic stock: nooit in huidkliniek-previews. */
const SKIN_CLINIC_JUNK =
  /hospital|ziekenhuis|blood\s*bank|banco\s+de\s+sangre|ascensor|sanitario|neonatal|reception\s+desk|waiting\s+room|makeup|lipstick|cosmetic\s+tube|mascara|nail\s*polish|lip\s+gloss|beauty\s+product/i;
/** Promo-graphics, gift cards, UI-screenshots: nooit als sectiebeeld. */
const PROMO_JUNK =
  /gift[\s_-]?card|cadeau(?:kaart)?|voucher|coupon|waardebon|promo(?:tion|tional)?|korting|discount|flyer|poster|mockup|placeholder|digital[\s_-]?card|ontvangen|certificate|certificaat|badge|sticker|qr[\s_-]?code|newsletter|woocommerce|opengraph|og-image|social[\s_-]?share|screenshot|ui[\s_-]?mock|shop[\s_-]?banner|hero[\s_-]?banner|banner[\s_-]?(?:gift|card|promo|sale|actie)/i;

const OG_SOCIAL_SIZE = /\b(1200x628|1080x1080|800x418|600x315|1920x1080)\b/i;

export function imagePathBlob(url: string, alt = ""): string {
  try {
    const parsed = new URL(url.startsWith("//") ? `https:${url}` : url);
    return `${parsed.pathname} ${alt}`.toLowerCase();
  } catch {
    return `${url} ${alt}`.toLowerCase();
  }
}

export function isPromotionalOrUiGraphic(url: string, alt = ""): boolean {
  const blob = `${url} ${alt}`.toLowerCase();
  if (PROMO_JUNK.test(blob)) return true;
  if (OG_SOCIAL_SIZE.test(blob)) return true;
  if (/\.(svg|gif)(\?|$)/i.test(url) && !/reformer|studio interior/i.test(blob)) return true;
  return false;
}

/**
 * Template B gebruikt alleen studio-foto's die echt reformer/Pilates uitstralen.
 * Domeinnaam alleen (sculptpowerpilates.nl) telt niet: alleen pad + alt.
 */
export function isAestheticPilatesPhoto(url: string, alt = ""): boolean {
  if (!isUsableLifestyleImage(url, alt)) return false;
  if (isPromotionalOrUiGraphic(url, alt)) return false;
  if (isCuratedPreviewStock(url)) return true;

  const blob = imagePathBlob(url, alt);
  if (LOW_AESTHETIC.test(blob)) return false;
  if (/dumbbell|kettlebell|weight\s*lift|gym\b|fitness\s+center/.test(blob)) return false;
  if (/reformer|pilates|matwork|toestel/.test(blob)) return true;
  if (/yoga|gym|workout|fitness/.test(blob) && !/pilates|reformer/.test(blob)) {
    return false;
  }
  return false;
}
const LOGO_IN_PATH =
  /(?:^|[/_.-])(?:logo|logotype|wordmark|brandmark|site-icon|favicon)(?:[._-]|\.|$)/i;

const SKIP_DECORATIVE =
  /(?:^|[/_.-])(?:pixel|tracker|sprite|icon|favicon|badge|payment|ideal|paypal|visa|mastercard|facebook|twitter|linkedin|whatsapp|cookie|1x1|spacer|arrow|button)(?:[._-]|\.|$)/i;

/** Logo, icoon of merkbeeld: nooit als sectie-achtergrond. */
export function isLogoOrBrandAsset(url: string, alt = ""): boolean {
  const blob = `${url} ${alt}`.toLowerCase();
  if (LOGO_IN_PATH.test(blob)) return true;
  if (/\blogo\b/.test(blob) && !/reformer|studio interior|pilates (les|class|session)/i.test(blob)) {
    return true;
  }
  if (/\.svg(\?|$)/i.test(url) && !/reformer|studio|pilates/i.test(blob)) return true;
  if (SKIP_DECORATIVE.test(blob) && !/studio|reformer|pilates|les|class|trainer/i.test(blob)) {
    return true;
  }
  return false;
}

export function isUsableLifestyleImage(url: string, alt = ""): boolean {
  if (!url || url.startsWith("data:")) return false;
  if (!isTrustedPreviewImageUrl(url)) return false;
  return !isLogoOrBrandAsset(url, alt);
}

/** Studio Forma demo-assets en teamfoto's uit public/demo. */
export function isTrustedPreviewImageUrl(url: string): boolean {
  const raw = url.trim();
  if (!raw) return false;
  if (
    raw.startsWith("/demo/pilates-warm-") ||
    raw.startsWith("/demo/pilates-clinic-") ||
    raw.startsWith("/demo/skin-clinic-")
  ) {
    return true;
  }
  if (raw.startsWith("/") && !raw.startsWith("//")) return false;
  try {
    const parsed = new URL(raw.startsWith("//") ? `https:${raw}` : raw);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

const LOW_QUALITY_PATH =
  /(?:^|[/_.-])(?:thumbnail|thumb|small|icon-|sprite|favicon|emoji|avatar)(?:[._-]|\.|$)|-\d{2,3}x\d{2,3}\.(?:jpe?g|png|webp)/i;

/**
 * Lage resolutie, thumbs en gecomprimeerde embeds: niet geschikt voor premium previews.
 * Zonder fetch gebruiken we URL-patronen en bekende width/height params.
 */
export function isLowQualityImage(
  url: string,
  width: number | null = null,
  height: number | null = null
): boolean {
  if (!url) return true;
  if (LOW_QUALITY_PATH.test(url)) return true;

  const wpThumb = /-(\d{2,4})x(\d{2,4})\.(?:jpe?g|png|webp)/i.exec(url);
  if (wpThumb) {
    const tw = Number(wpThumb[1]);
    const th = Number(wpThumb[2]);
    if (tw < 720 || th < 480) return true;
  }

  const w = width ?? dimensionFromUrl(url, "w");
  const h = height ?? dimensionFromUrl(url, "h");

  const queryWidth = /[?&](?:w|width)=(\d{2,4})/i.exec(url)?.[1];
  if (queryWidth && Number(queryWidth) < 720) return true;

  const queryHeight = /[?&](?:h|height)=(\d{2,4})/i.exec(url)?.[1];
  if (queryHeight && Number(queryHeight) < 480) return true;

  if (/googleusercontent\.com/i.test(url)) {
    if (!w || w < 900 || (h && h < 500)) return true;
  }

  if (w && w < 720) return true;
  if (h && h < 480) return true;
  if (w && h && w * h < 520_000) return true;

  return false;
}

/**
 * Studio-foto die goed genoeg is om te tonen. Anders stock fallback.
 * Filtert logo's, thumbs én off-topic lage kwaliteit (willekeurige buitenfoto's).
 */
export function isSkinClinicJunkPhoto(url: string, alt = ""): boolean {
  const blob = imagePathBlob(url, alt);
  if (SKIN_CLINIC_JUNK.test(blob)) return true;
  if (/1515377905703|1519494026892|1516975080664/.test(url)) return true;
  return false;
}

export function isPreviewWorthyStudioPhoto(
  url: string,
  alt = "",
  width: number | null = null,
  height: number | null = null
): boolean {
  if (isTeamPortraitPhoto(url, alt)) return true;
  if (!isUsableLifestyleImage(url, alt)) return false;
  if (isPromotionalOrUiGraphic(url, alt)) return false;
  if (isSkinClinicJunkPhoto(url, alt)) return false;
  if (isLowQualityImage(url, width, height)) return false;
  if (isCuratedPreviewStock(url)) return true;
  if (isAestheticPilatesPhoto(url, alt)) return true;

  const blob = imagePathBlob(url, alt);
  const w = width ?? dimensionFromUrl(url, "w");
  if (w && w >= 1200 && /reformer|pilates|studio|les|class|matwork|session/.test(blob)) {
    return true;
  }

  return false;
}

/** Portret op Over mij / team-pagina: geen reformer-shot, wel geschikt voor instructors. */
export function isTeamPortraitPhoto(url: string, alt = ""): boolean {
  if (!isTrustedPreviewImageUrl(url)) return false;
  if (isPromotionalOrUiGraphic(url, alt)) return false;
  if (isLogoOrBrandAsset(url, alt)) return false;
  if (/favicon|tiktok|instagram|facebook|emoji|badge/i.test(url)) return false;
  if (/format=1500w|format=1000w|format=750w/i.test(url)) return true;
  if (/squarespace-cdn.*\.(?:jpe?g|webp)/i.test(url) && !isLowQualityImage(url)) {
    return true;
  }
  return false;
}

/** Fullscreen hero: geen promo-banners, geen zwakke thumbs. */
export function isHeroPhotoCandidate(
  url: string,
  alt = "",
  width: number | null = null,
  height: number | null = null
): boolean {
  if (!isPreviewWorthyStudioPhoto(url, alt, width, height)) return false;
  if (isWeakHeroCandidate(url, width, height)) return false;
  if (isPromotionalOrUiGraphic(url, alt)) return false;
  return true;
}

function dimensionFromUrl(url: string, axis: "w" | "h"): number | null {
  const pattern = axis === "w" ? /[/_,](?:w|width)[_=](\d{2,5})/i : /[/_,](?:h|height)[_=](\d{2,5})/i;
  const match = pattern.exec(url)?.[1];
  if (!match) return null;
  const value = Number(match);
  return Number.isFinite(value) && value > 0 ? value : null;
}

export function imageOrientation(
  url: string,
  width: number | null = null,
  height: number | null = null
): "landscape" | "portrait" | "unknown" {
  const w = width ?? dimensionFromUrl(url, "w");
  const h = height ?? dimensionFromUrl(url, "h");
  if (!w || !h) return "unknown";
  const ratio = w / h;
  if (!Number.isFinite(ratio) || ratio <= 0) return "unknown";
  return ratio >= 1.12 ? "landscape" : "portrait";
}

/** Kleine Google-thumbs en staande portretten zijn zwak voor fullscreen hero. */
export function isWeakHeroCandidate(
  url: string,
  width: number | null = null,
  height: number | null = null
): boolean {
  if (!isUsableLifestyleImage(url)) return true;

  const w = width ?? dimensionFromUrl(url, "w");
  const h = height ?? dimensionFromUrl(url, "h");

  if (/googleusercontent\.com/i.test(url)) {
    if ((w && w < 720) || (h && h < 480)) return true;
    if (imageOrientation(url, w, h) === "portrait") return true;
  }

  if (w && w < 400) return true;
  return false;
}

export function heroCandidateScore(
  url: string,
  alt: string,
  width: number | null,
  height: number | null,
  semantic: string
): number {
  if (!isUsableLifestyleImage(url, alt)) return 0;
  if (isPromotionalOrUiGraphic(url, alt)) return 0;
  if (isLowQualityImage(url, width, height)) return 0;
  if (isWeakHeroCandidate(url, width, height)) return 5;

  let score = 50;
  const blob = imagePathBlob(url, alt);
  const semanticBlob = `${blob} ${semantic}`.toLowerCase();

  if (/reformer|studio interior|pilates (les|class|session)|matwork/.test(blob)) {
    score += 22;
  }
  if (/hero|cover/i.test(semanticBlob) && !/banner|gift|card|promo/.test(blob)) {
    score += 10;
  }
  if (imageOrientation(url, width, height) === "landscape") score += 20;
  if (/images\.unsplash\.com/i.test(url)) score += 18;
  if (/\.(jpe?g|webp)(\?|$)/i.test(url) && !/googleusercontent/i.test(url)) {
    score += 8;
  }
  if (/googleusercontent/i.test(url)) score -= 12;
  if (/banner|gift|card|voucher|flyer|poster/.test(blob)) score -= 80;

  const w = width ?? 0;
  if (w >= 1200) score += 12;
  else if (w >= 800) score += 6;

  return score;
}

/** Behoud website-beelden; stock alleen als er geen echte foto's zijn. */
export function sanitizeStudioImages(
  images: StudioImage[],
  studioName: string,
  verticalSlug?: string | null,
): StudioImage[] {
  const websitePhotos = images.filter(
    (image) =>
      image.url &&
      !isCuratedPreviewStock(image.url) &&
      isTrustedPreviewImageUrl(image.url),
  );

  if (websitePhotos.length >= 2) {
    return images.filter(
      (image) =>
        image.url &&
        (isCuratedPreviewStock(image.url) || isTrustedPreviewImageUrl(image.url)),
    );
  }

  return getCuratedPreviewImagesForVertical(studioName, verticalSlug);
}
