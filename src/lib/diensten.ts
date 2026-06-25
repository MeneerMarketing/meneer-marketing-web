import { megaMenuColumns } from "@/lib/navigation";

export interface DienstDetail {
  slug: string;
  name: string;
  description: string;
  pillar: string;
  pillarSubtitle: string;
}

const DIENST_PATH = /^\/diensten\/([^/]+)$/;

export function getAllDienstSlugs(): string[] {
  const slugs = new Set<string>();
  for (const col of megaMenuColumns) {
    for (const item of col.items) {
      const match = DIENST_PATH.exec(item.href);
      if (match) slugs.add(match[1]);
    }
  }
  return [...slugs];
}

export function getDienstBySlug(slug: string): DienstDetail | null {
  for (const col of megaMenuColumns) {
    for (const item of col.items) {
      const match = DIENST_PATH.exec(item.href);
      if (match && match[1] === slug) {
        return {
          slug,
          name: item.name,
          description: item.description,
          pillar: col.category,
          pillarSubtitle: col.subtitle,
        };
      }
    }
  }
  return null;
}

export function getRelatedDiensten(
  slug: string,
  limit = 3,
): DienstDetail[] {
  const current = getDienstBySlug(slug);
  if (!current) return [];
  const group = getDienstenByPillar().find((g) => g.pillar === current.pillar);
  if (!group) return [];
  return group.diensten.filter((d) => d.slug !== slug).slice(0, limit);
}

export function getDienstenByPillar(): { pillar: string; subtitle: string; diensten: DienstDetail[] }[] {
  return megaMenuColumns.map((col) => ({
    pillar: col.category,
    subtitle: col.subtitle,
    diensten: col.items
      .map((item) => {
        const match = DIENST_PATH.exec(item.href);
        if (!match) return null;
        return {
          slug: match[1],
          name: item.name,
          description: item.description,
          pillar: col.category,
          pillarSubtitle: col.subtitle,
        };
      })
      .filter((d): d is DienstDetail => d !== null),
  }));
}
