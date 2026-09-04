import type { StudioData, StudioSkinConcern } from "@/types/studio";

function isSkinClinicVerticalSlug(slug: string | undefined): boolean {
  const normalized = (slug ?? "").toLowerCase();
  return normalized === "skin-clinics" || normalized === "huidklinieken";
}

/**
 * Supabase snapshots missen vaak velden (services, reviews, …).
 * Zonder defaults crasht de template-renderer op `.map()`.
 */
export function normalizeStudioSnapshot(
  input: Partial<StudioData> | Record<string, unknown>
): StudioData {
  const studio = input as Partial<StudioData>;
  const verticalSlug = studio.vertical_slug;
  const isClinic = isSkinClinicVerticalSlug(verticalSlug);

  return {
    id: studio.id ?? "preview",
    slug: studio.slug ?? "preview",
    studio_name: studio.studio_name ?? "Studio",
    city: studio.city ?? "",
    country: studio.country ?? "Nederland",
    logo: studio.logo ?? null,
    primary_color: studio.primary_color ?? "#1A1614",
    secondary_color: studio.secondary_color ?? "#F4EFE6",
    accent_color: studio.accent_color ?? "#C4A484",
    tagline: studio.tagline ?? "",
    description: studio.description ?? "",
    primary_service:
      studio.primary_service ?? (isClinic ? "Huidbehandelingen" : "Reformer Pilates"),
    services: Array.isArray(studio.services) ? studio.services : [],
    phone: studio.phone ?? "",
    email: studio.email ?? "",
    address: studio.address ?? "",
    postal_code: studio.postal_code ?? "",
    booking_url: studio.booking_url ?? "",
    instagram_url: studio.instagram_url ?? "",
    review_rating: typeof studio.review_rating === "number" ? studio.review_rating : 0,
    review_count: typeof studio.review_count === "number" ? studio.review_count : 0,
    team: Array.isArray(studio.team) ? studio.team : [],
    images: Array.isArray(studio.images) ? studio.images : [],
    memberships: Array.isArray(studio.memberships) ? studio.memberships : [],
    reviews: Array.isArray(studio.reviews) ? studio.reviews : [],
    faqs: Array.isArray(studio.faqs) ? studio.faqs : [],
    benefits: Array.isArray(studio.benefits) ? studio.benefits : [],
    primary_seo_keyword: studio.primary_seo_keyword ?? "",
    secondary_seo_keywords: Array.isArray(studio.secondary_seo_keywords)
      ? studio.secondary_seo_keywords
      : [],
    opening_hours: studio.opening_hours ?? "",
    founded_year: typeof studio.founded_year === "number" ? studio.founded_year : 0,
    vertical_slug: verticalSlug,
    skin_concerns: Array.isArray(studio.skin_concerns)
      ? (studio.skin_concerns as StudioSkinConcern[])
      : [],
  };
}
