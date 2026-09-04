import type { ImageCandidate } from "@/services/preview-generation/types";
import type { StudioData, StudioImage } from "@/types/studio";
import {
  getCuratedPreviewImagesForVertical,
  imagePathBlob,
  isCuratedPreviewStock,
  isHeroPhotoCandidate,
  isLowQualityImage,
  isPreviewWorthyStudioPhoto,
  isPromotionalOrUiGraphic,
  isSkinClinicJunkPhoto,
  isSkinClinicVerticalSlug,
  isUsableLifestyleImage,
} from "@/lib/previewImagePolicy";

const TARGET_ROLES: StudioImage["role"][] = [
  "hero",
  "studio",
  "atmosphere",
  "gallery",
  "gallery",
  "team",
];

export function isPreviewWorthyClinicPhoto(
  url: string,
  alt = "",
  width: number | null = null,
  height: number | null = null,
): boolean {
  if (!isUsableLifestyleImage(url, alt)) return false;
  if (isPromotionalOrUiGraphic(url, alt)) return false;
  if (isSkinClinicJunkPhoto(url, alt)) return false;
  if (isLowQualityImage(url, width, height)) return false;
  if (isCuratedPreviewStock(url)) return true;

  const blob = imagePathBlob(url, alt);
  if (
    /huid|skin|facial|gezicht|behandel|kliniek|clinic|aesthetic|peel|laser|botox|inject|microneed|wellness|beauty|consult|intake|receptie|behandelkamer|cabine|derma|esthet|praktijk/.test(
      blob,
    )
  ) {
    return true;
  }

  const w = width ?? 0;
  if (w >= 720 && /interior|interieur|studio|ruimte|team|about|over|locatie/.test(blob)) {
    return true;
  }

  return false;
}

export function isPreviewWorthyHarvestedPhoto(
  url: string,
  alt: string,
  width: number | null,
  height: number | null,
  verticalSlug?: string | null,
): boolean {
  if (isSkinClinicVerticalSlug(verticalSlug)) {
    return isPreviewWorthyClinicPhoto(url, alt, width, height);
  }
  return isPreviewWorthyStudioPhoto(url, alt, width, height);
}

export function mergeImageCandidates(
  staticCandidates: ImageCandidate[],
  renderedCandidates: ImageCandidate[],
): ImageCandidate[] {
  const merged = new Map<string, ImageCandidate>();
  for (const candidate of [...staticCandidates, ...renderedCandidates]) {
    const key = candidate.url.replace(/\?.*$/, "").toLowerCase();
    const existing = merged.get(key);
    if (!existing || candidate.score > existing.score) {
      merged.set(key, candidate);
    }
  }
  return [...merged.values()].sort((a, b) => b.score - a.score).slice(0, 20);
}

function roleForCandidate(
  candidate: ImageCandidate,
  verticalSlug?: string | null,
): StudioImage["role"] {
  if (candidate.semantic_type === "hero") return "hero";
  if (candidate.semantic_type === "team") return "team";
  if (candidate.semantic_type === "atmosphere") return "atmosphere";
  if (candidate.semantic_type === "reformer" || candidate.semantic_type === "studio") {
    return "studio";
  }
  if (isSkinClinicVerticalSlug(verticalSlug)) {
    const blob = imagePathBlob(candidate.url, candidate.alt_text);
    if (/behandel|treatment|facial|cabine|huid/.test(blob)) return "studio";
    if (/receptie|consult|intake|waiting|over ons/.test(blob)) return "atmosphere";
  }
  return "gallery";
}

export function mapHarvestedCandidatesToStudioImages(
  candidates: ImageCandidate[],
  studioName: string,
  verticalSlug?: string | null,
): StudioImage[] {
  const worthy = candidates.filter((candidate) =>
    isPreviewWorthyHarvestedPhoto(
      candidate.url,
      candidate.alt_text,
      candidate.width,
      candidate.height,
      verticalSlug,
    ),
  );

  if (worthy.length === 0) {
    return getCuratedPreviewImagesForVertical(studioName, verticalSlug);
  }

  const curated = getCuratedPreviewImagesForVertical(studioName, verticalSlug);
  const usedUrls = new Set<string>();
  const byRole = new Map<StudioImage["role"], StudioImage>();

  const pickCandidate = (predicate: (candidate: ImageCandidate) => boolean): ImageCandidate | null => {
    for (const candidate of worthy) {
      const key = candidate.url.replace(/\?.*$/, "");
      if (usedUrls.has(key)) continue;
      if (!predicate(candidate)) continue;
      usedUrls.add(key);
      return candidate;
    }
    return null;
  };

  const heroPick =
    pickCandidate(
      (candidate) =>
        candidate.semantic_type === "hero" &&
        isHeroPhotoCandidate(candidate.url, candidate.alt_text, candidate.width, candidate.height),
    ) ??
    pickCandidate((candidate) =>
      isHeroPhotoCandidate(candidate.url, candidate.alt_text, candidate.width, candidate.height),
    ) ??
    pickCandidate(() => true);

  if (heroPick) {
    byRole.set("hero", {
      id: "harvest-hero",
      url: heroPick.url,
      alt: heroPick.alt_text || `${studioName} · studio`,
      role: "hero",
    });
  }

  for (const role of TARGET_ROLES) {
    if (byRole.has(role)) continue;
    const match = pickCandidate((candidate) => roleForCandidate(candidate, verticalSlug) === role);
    if (match) {
      byRole.set(role, {
        id: `harvest-${role}-${byRole.size}`,
        url: match.url,
        alt: match.alt_text || `${studioName} · ${role}`,
        role,
      });
    }
  }

  for (const role of TARGET_ROLES) {
    if (byRole.has(role)) continue;
    const match = pickCandidate(() => true);
    if (match) {
      byRole.set(role, {
        id: `harvest-${role}-${byRole.size}`,
        url: match.url,
        alt: match.alt_text || `${studioName} · ${role}`,
        role,
      });
    }
  }

  return TARGET_ROLES.map((role, index) => {
    const harvested = byRole.get(role);
    if (harvested) return harvested;
    return curated[index] ?? curated[curated.length - 1]!;
  });
}

export function studioHasWebsitePhotos(studio: { images?: StudioImage[] }): boolean {
  return (studio.images ?? []).some(
    (image) => image.url && !isCuratedPreviewStock(image.url) && isUsableLifestyleImage(image.url, image.alt),
  );
}

export function clinicImagesFromStudio(
  studio: StudioData,
  count: number,
  fallbacks: ReadonlyArray<{ url: string; alt: string }>,
): Array<{ url: string; alt: string }> {
  const fromStudio = (studio.images ?? [])
    .filter((image) => image.url && !isCuratedPreviewStock(image.url))
    .filter((image) => isPreviewWorthyClinicPhoto(image.url, image.alt))
    .map((image) => ({ url: image.url, alt: image.alt }));

  const out = [...fromStudio];
  for (let index = out.length; index < count; index += 1) {
    out.push(fallbacks[index % fallbacks.length]!);
  }
  return out.slice(0, count);
}
