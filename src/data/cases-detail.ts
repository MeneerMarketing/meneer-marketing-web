import type { CaseSceneId } from "@/data/home-cases";
import { CASES_PAGE_STORIES } from "@/data/cases-page";
import { HOME_CASES, type HomeCase } from "@/data/home-cases";

export interface CaseDetail extends HomeCase {
  scene: CaseSceneId;
  story: (typeof CASES_PAGE_STORIES)[CaseSceneId];
}

export const CASE_DETAILS: CaseDetail[] = HOME_CASES.map((c) => ({
  ...c,
  story: CASES_PAGE_STORIES[c.scene],
}));

export function getAllCaseSlugs(): string[] {
  return CASE_DETAILS.map((c) => c.id);
}

export function getCaseBySlug(slug: string): CaseDetail | null {
  return CASE_DETAILS.find((c) => c.id === slug) ?? null;
}
