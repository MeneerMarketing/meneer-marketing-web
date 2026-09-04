import {
  getCuratedPreviewImagesForVertical,
  isCuratedPreviewStock,
} from "@/lib/previewImagePolicy";
import { studioHasWebsitePhotos } from "@/lib/mapPreviewImages";
import { normalizeStudioSnapshot } from "@/lib/normalizeStudioSnapshot";
import { normalizeClinicStudioCopy } from "@/lib/clinicCopySanitizer";
import type { StudioData } from "@/types/studio";

/** Eén ingang voor alle preview-pagina's: veilige data + website-beelden waar beschikbaar. */
export function preparePreviewStudio(
  input: Partial<StudioData> | Record<string, unknown>
): StudioData {
  const normalized = normalizeStudioSnapshot(input);
  const clinicNormalized = normalizeClinicStudioCopy(normalized);
  const curated = getCuratedPreviewImagesForVertical(
    clinicNormalized.studio_name,
    clinicNormalized.vertical_slug,
  );

  const useWebsitePhotos = studioHasWebsitePhotos(clinicNormalized);

  return {
    ...clinicNormalized,
    images: useWebsitePhotos
      ? clinicNormalized.images
      : clinicNormalized.images.length > 0 && !clinicNormalized.images.every((image) =>
            isCuratedPreviewStock(image.url),
          )
        ? clinicNormalized.images
        : curated,
  };
}
