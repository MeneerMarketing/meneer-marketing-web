import type { StudioData, StudioImage } from "@/types/studio";

export function getImageByRole(
  studio: StudioData,
  role: StudioImage["role"]
): StudioImage | undefined {
  return studio.images.find((img) => img.role === role);
}

export function getImagesByRole(
  studio: StudioData,
  role: StudioImage["role"]
): StudioImage[] {
  return studio.images.filter((img) => img.role === role);
}

export function formatRating(rating: number): string {
  return rating.toFixed(1).replace(".", ",");
}

export function fullAddress(studio: StudioData): string {
  return `${studio.address}, ${studio.postal_code} ${studio.city}`;
}
