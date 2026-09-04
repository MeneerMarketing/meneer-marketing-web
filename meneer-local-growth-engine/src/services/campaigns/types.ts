import { randomBytes } from "node:crypto";
import type {
  BookingOption,
  OfferPackage,
} from "@/config/verticalOffers";

export type CampaignStatus = "ACTIVE" | "REVOKED" | "EXPIRED" | "CONVERTED";

export type CampaignEnvironment = "DEVELOPMENT" | "PRODUCTION";

export type CampaignLifecycleStatus =
  | "DRAFT"
  | "QA"
  | "LAUNCH_READY"
  | "LIVE"
  | "PAUSED"
  | "COMPLETED"
  | "REVOKED";

export type ConversionStatus =
  | "NONE"
  | "ENGAGED"
  | "INTERESTED"
  | "CONTACT_STARTED"
  | "INBOUND_LEAD"
  | "PROPOSAL"
  | "WON"
  | "LOST";

export type EngagementLevel =
  | "COLD"
  | "OPENED"
  | "ENGAGED"
  | "HIGH_INTENT"
  | "INBOUND";

export const CAMPAIGN_EVENT_TYPES = [
  "PREVIEW_OPENED",
  "PREVIEW_CTA_CLICKED",
  "PREVIEW_FEEDBACK_UP",
  "PREVIEW_FEEDBACK_DOWN",
  "LANDING_PAGE_VIEWED",
  "PACKAGE_SECTION_VIEWED",
  "PACKAGE_SELECTED",
  "BOOKING_OPTION_VIEWED",
  "CONTACT_STARTED",
  "CONTACT_SUBMITTED",
] as const;

export type CampaignEventType = (typeof CAMPAIGN_EVENT_TYPES)[number];

export interface CampaignRow {
  id: string;
  campaign_ref: string;
  business_id: string;
  preview_id: string | null;
  outreach_message_id: string | null;
  vertical_id: string | null;
  city_id: string | null;
  status: CampaignStatus;
  environment: CampaignEnvironment;
  lifecycle_status: CampaignLifecycleStatus;
  conversion_status: ConversionStatus;
  engagement_level: EngagementLevel;
  recommended_package: OfferPackage | null;
  recommendation_reason: string | null;
  selected_package: OfferPackage | null;
  selected_booking_option: BookingOption | null;
  city_status_snapshot: string | null;
  first_seen_at: string | null;
  last_seen_at: string | null;
  last_real_activity_at: string | null;
  event_count: number;
  real_event_count: number;
  test_event_count: number;
  reservation_expires_at: string | null;
  expires_at: string | null;
  revoked_at: string | null;
  launch_ready_at: string | null;
  launch_blockers: string[] | unknown;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  last_activity_at: string;
}

/** Public personalization payload — no PII / internals */
export interface PublicCampaignContext {
  valid: true;
  vertical: string;
  business_name: string;
  city: string;
  preview_url: string;
  selected_template: string | null;
  city_status: string | null;
  primary_service: string | null;
  recommended_package: OfferPackage | null;
  preview_cta_label: string;
  landing_path: string;
}

export interface PublicCampaignContextInvalid {
  valid: false;
  error: "not_found" | "revoked" | "expired" | "invalid";
}

export function generateCampaignRef(): string {
  // Opaque, non-incremental, no PII
  return `mmlg_${randomBytes(18).toString("base64url")}`;
}

export function maskCampaignRef(ref: string): string {
  if (ref.length <= 10) return `${ref.slice(0, 4)}…`;
  return `${ref.slice(0, 8)}…${ref.slice(-4)}`;
}

export function campaignReservationDays(): number {
  const n = Number(process.env.CAMPAIGN_RESERVATION_DAYS ?? 14);
  return Number.isFinite(n) && n > 0 ? n : 14;
}

export function getAllowedCampaignOrigins(): string[] {
  const raw =
    process.env.CAMPAIGN_ALLOWED_ORIGINS ??
    "https://meneermarketing.nl,https://www.meneermarketing.nl,http://localhost:3000,http://127.0.0.1:3000";
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function isAllowedCampaignOrigin(origin: string | null): boolean {
  if (!origin) return false;
  return getAllowedCampaignOrigins().some((allowed) => allowed === origin);
}

const ENGAGEMENT_RANK: Record<EngagementLevel, number> = {
  COLD: 0,
  OPENED: 1,
  ENGAGED: 2,
  HIGH_INTENT: 3,
  INBOUND: 4,
};

export function maxEngagement(
  a: EngagementLevel,
  b: EngagementLevel
): EngagementLevel {
  return ENGAGEMENT_RANK[a] >= ENGAGEMENT_RANK[b] ? a : b;
}

export function engagementFromEvent(eventType: CampaignEventType): EngagementLevel {
  switch (eventType) {
    case "PREVIEW_OPENED":
      return "OPENED";
    case "PREVIEW_FEEDBACK_UP":
      return "HIGH_INTENT";
    case "PREVIEW_FEEDBACK_DOWN":
      return "ENGAGED";
    case "PREVIEW_CTA_CLICKED":
    case "LANDING_PAGE_VIEWED":
    case "PACKAGE_SECTION_VIEWED":
      return "ENGAGED";
    case "PACKAGE_SELECTED":
    case "BOOKING_OPTION_VIEWED":
    case "CONTACT_STARTED":
      return "HIGH_INTENT";
    case "CONTACT_SUBMITTED":
      return "INBOUND";
    default:
      return "COLD";
  }
}

export function conversionFromEvent(
  eventType: CampaignEventType
): ConversionStatus | null {
  switch (eventType) {
    case "PREVIEW_FEEDBACK_UP":
      return "INTERESTED";
    case "PREVIEW_FEEDBACK_DOWN":
      return "ENGAGED";
    case "PREVIEW_CTA_CLICKED":
    case "LANDING_PAGE_VIEWED":
      return "ENGAGED";
    case "PACKAGE_SELECTED":
    case "PACKAGE_SECTION_VIEWED":
    case "BOOKING_OPTION_VIEWED":
      return "INTERESTED";
    case "CONTACT_STARTED":
      return "CONTACT_STARTED";
    case "CONTACT_SUBMITTED":
      return "INBOUND_LEAD";
    default:
      return null;
  }
}

const CONVERSION_RANK: Record<ConversionStatus, number> = {
  NONE: 0,
  ENGAGED: 1,
  INTERESTED: 2,
  CONTACT_STARTED: 3,
  INBOUND_LEAD: 4,
  PROPOSAL: 5,
  WON: 6,
  LOST: 0,
};

export function maxConversion(
  a: ConversionStatus,
  b: ConversionStatus
): ConversionStatus {
  return CONVERSION_RANK[a] >= CONVERSION_RANK[b] ? a : b;
}
