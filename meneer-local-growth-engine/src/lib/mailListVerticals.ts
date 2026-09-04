import type { Business, Vertical } from "@/types/domain";

export interface MailListVerticalOption {
  id: string;
  slug: string;
  name: string;
  count: number;
}

export function activeMailListVerticals(verticals: Vertical[]): Vertical[] {
  return verticals.filter((v) => v.active);
}

export function countMailListByVertical(
  businesses: Business[],
  verticals: Vertical[]
): MailListVerticalOption[] {
  return activeMailListVerticals(verticals).map((vertical) => ({
    id: vertical.id,
    slug: vertical.slug,
    name: vertical.name,
    count: businesses.filter(
      (b) => !b.is_demo && b.selected_for_outreach && b.vertical_id === vertical.id
    ).length,
  }));
}

export function filterMailListBusinesses<T extends { vertical_id: string }>(
  rows: T[],
  verticalFilter: string | null | undefined
): T[] {
  if (!verticalFilter || verticalFilter === "all") return rows;
  return rows.filter((row) => row.vertical_id === verticalFilter);
}

export function resolveMailListVerticalFilter(
  verticals: Vertical[],
  slugOrId: string | null | undefined
): string | null {
  if (!slugOrId || slugOrId === "all") return null;
  const match = verticals.find((v) => v.id === slugOrId || v.slug === slugOrId);
  return match?.id ?? null;
}

export function mailListOutreachHref(verticalSlug?: string): string {
  if (!verticalSlug || verticalSlug === "all") {
    return "/dashboard/outreach?status=mail_list";
  }
  return `/dashboard/outreach?status=mail_list&vertical=${verticalSlug}`;
}
