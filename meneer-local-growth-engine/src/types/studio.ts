export interface StudioTeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image_url: string;
}

export interface StudioService {
  id: string;
  name: string;
  description: string;
  duration_minutes?: number;
  highlight?: boolean;
}

export interface StudioMembership {
  id: string;
  name: string;
  price_label: string;
  period: string;
  description: string;
  features: string[];
  featured?: boolean;
}

export interface StudioReview {
  id: string;
  author: string;
  rating: number;
  text: string;
  date_label?: string;
}

export interface StudioFaq {
  id: string;
  question: string;
  answer: string;
}

export interface StudioBenefit {
  id: string;
  title: string;
  description: string;
}

/** Huidprobleem / concern — basis voor SEO-landings en preview-sectie. */
export interface StudioSkinConcern {
  id: string;
  slug: string;
  name: string;
  description: string;
  related_treatment: string | null;
}

export interface StudioImage {
  id: string;
  url: string;
  alt: string;
  role: "hero" | "studio" | "reformer" | "team" | "atmosphere" | "gallery";
}

export interface StudioData {
  id: string;
  slug: string;
  studio_name: string;
  city: string;
  country: string;
  logo: string | null;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  tagline: string;
  description: string;
  primary_service: string;
  services: StudioService[];
  phone: string;
  email: string;
  address: string;
  postal_code: string;
  booking_url: string;
  instagram_url: string;
  review_rating: number;
  review_count: number;
  team: StudioTeamMember[];
  images: StudioImage[];
  memberships: StudioMembership[];
  reviews: StudioReview[];
  faqs: StudioFaq[];
  benefits: StudioBenefit[];
  primary_seo_keyword: string;
  secondary_seo_keywords: string[];
  opening_hours: string;
  founded_year: number;
  /** LGE vertical slug — bepaalt clinic vs pilates template routing. */
  vertical_slug?: string;
  skin_concerns?: StudioSkinConcern[];
  /** Licht logo op donkere hero: geen CSS-invert in cinematic. */
  logo_light?: boolean;
  /** Logo met witte JPG-achtergrond: multiply-blend op donkere hero. */
  logo_on_light_background?: boolean;
}

export type TemplateVariant =
  | "editorial"
  | "reformer-minimal"
  | "soft-movement"
  | "clinical-atelier";

export interface PreviewRecord {
  id: string;
  slug: string;
  business_slug: string;
  template_variant: TemplateVariant;
  status: "draft" | "ready" | "archived";
  exclusive_status: "none" | "reserved" | "active";
}
