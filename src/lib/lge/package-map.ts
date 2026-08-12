import type { VerticalInterestId, VerticalPackageId } from "@/data/verticals/types";
import type { LgePackageKey } from "@/lib/lge/types";

export function packageKeyToInterest(
  key: LgePackageKey | string | null | undefined,
): VerticalInterestId | null {
  switch (key) {
    case "STUDIO_EDITION":
      return "studio-edition";
    case "LOCAL_GROWTH":
      return "local-growth";
    case "GROWTH_PARTNER":
      return "growth-partner";
    case "SIGNATURE_CUSTOM":
      return "signature-custom";
    default:
      return null;
  }
}

export function packageIdToKey(
  id: VerticalPackageId | "signature-custom" | string,
): LgePackageKey | null {
  switch (id) {
    case "studio-edition":
      return "STUDIO_EDITION";
    case "local-growth":
      return "LOCAL_GROWTH";
    case "growth-partner":
      return "GROWTH_PARTNER";
    case "signature-custom":
      return "SIGNATURE_CUSTOM";
    default:
      return null;
  }
}

export function packageKeyLabel(key: LgePackageKey | string | null): string {
  switch (key) {
    case "STUDIO_EDITION":
      return "Studio Edition";
    case "LOCAL_GROWTH":
      return "Local Growth";
    case "GROWTH_PARTNER":
      return "Growth Partner";
    case "SIGNATURE_CUSTOM":
      return "Signature Custom";
    default:
      return "pakket";
  }
}

export function buildPreviewReturnUrl(
  previewUrl: string,
  campaignRef: string,
): string {
  try {
    const url = new URL(previewUrl);
    url.searchParams.set("ref", campaignRef);
    return url.toString();
  } catch {
    const joiner = previewUrl.includes("?") ? "&" : "?";
    return `${previewUrl}${joiner}ref=${encodeURIComponent(campaignRef)}`;
  }
}
