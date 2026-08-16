/**
 * Public LGE campaign contract types.
 * Source of truth: meneer-local-growth-engine/docs/vertical-landing-integration.md
 */

export const LGE_PACKAGE_KEYS = [
  "STUDIO_EDITION",
  "LOCAL_GROWTH",
  "GROWTH_PARTNER",
  "SIGNATURE_CUSTOM",
] as const;

export type LgePackageKey = (typeof LGE_PACKAGE_KEYS)[number];

export const LGE_BOOKING_OPTION_KEYS = [
  "EXISTING_BOOKING",
  "BRANDED_APP",
  "CUSTOM_FUNNEL",
  "CUSTOM_APP",
] as const;

export type LgeBookingOptionKey = (typeof LGE_BOOKING_OPTION_KEYS)[number];

export const LGE_CITY_STATUSES = [
  "AVAILABLE",
  "PRIMARY_CANDIDATE",
  "RESERVED",
  "EXCLUSIVE",
] as const;

export type LgeCityCampaignStatus = (typeof LGE_CITY_STATUSES)[number];

export const LGE_CAMPAIGN_EVENT_TYPES = [
  "PREVIEW_OPENED",
  "PREVIEW_CTA_CLICKED",
  "LANDING_PAGE_VIEWED",
  "PACKAGE_SECTION_VIEWED",
  "PACKAGE_SELECTED",
  "BOOKING_OPTION_VIEWED",
  "CONTACT_STARTED",
  "CONTACT_SUBMITTED",
] as const;

export type LgeCampaignEventType = (typeof LGE_CAMPAIGN_EVENT_TYPES)[number];

export interface LgeCampaignContextValid {
  valid: true;
  vertical: string;
  business_name: string;
  city: string;
  preview_url: string;
  selected_template: string | null;
  city_status: LgeCityCampaignStatus | string | null;
  primary_service: string | null;
  recommended_package: LgePackageKey | string | null;
  preview_cta_label?: string | null;
  landing_path?: string | null;
}

export interface LgeCampaignContextInvalid {
  valid: false;
  error?: string;
}

export type LgeCampaignContext =
  | LgeCampaignContextValid
  | LgeCampaignContextInvalid;

export type LgeCampaignEventMetadata = {
  package?: LgePackageKey;
  booking_option?: LgeBookingOptionKey;
  path?: string;
  section?: string;
};

export function isLgePackageKey(value: unknown): value is LgePackageKey {
  return (
    typeof value === "string" &&
    (LGE_PACKAGE_KEYS as readonly string[]).includes(value)
  );
}

export function isLgeBookingOptionKey(
  value: unknown,
): value is LgeBookingOptionKey {
  return (
    typeof value === "string" &&
    (LGE_BOOKING_OPTION_KEYS as readonly string[]).includes(value)
  );
}

export function isLgeCampaignEventType(
  value: unknown,
): value is LgeCampaignEventType {
  return (
    typeof value === "string" &&
    (LGE_CAMPAIGN_EVENT_TYPES as readonly string[]).includes(value)
  );
}

export function isValidCampaignContext(
  value: LgeCampaignContext | null | undefined,
): value is LgeCampaignContextValid {
  return Boolean(value && value.valid === true);
}
