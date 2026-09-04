import type { ContentFormatId } from "@/services/types";

export interface TemplateEntry {
  /** Aantal slides in de carousel. Eén betekent een losse post. */
  slides: number;
}

export const TEMPLATE_REGISTRY: Partial<Record<ContentFormatId, TemplateEntry>> = {
  DE_REKENING: { slides: 6 },
  MENEER_FIXT: { slides: 1 },
  MENEER_ZEGT: { slides: 4 },
  MENEER_METER: { slides: 3 },
  MENEER_ONTLEEDT: { slides: 4 },
  DE_OFFERTE: { slides: 3 },
  BUREAU_BINGO: { slides: 2 },
  CASE_BUILD: { slides: 1 },
};

export function getTemplateForFormat(formatId: ContentFormatId): TemplateEntry | null {
  return TEMPLATE_REGISTRY[formatId] ?? null;
}

export function getSlideCount(formatId: ContentFormatId): number {
  return TEMPLATE_REGISTRY[formatId]?.slides ?? 1;
}
