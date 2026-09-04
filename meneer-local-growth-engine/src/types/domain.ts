/**
 * Local Growth Engine — domain types
 */

export const LEAD_STATUSES = [
  "DISCOVERED",
  "QUALIFIED",
  "PREVIEW_GENERATING",
  "PREVIEW_READY",
  "READY_FOR_OUTREACH",
  "CONTACTED",
  "REPLIED",
  "INBOUND",
  "MEETING",
  "CLIENT",
  "REJECTED",
  "DO_NOT_CONTACT",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const PREVIEW_STATUSES = [
  "DRAFT",
  "ANALYZING",
  "GENERATING",
  "READY",
  "APPROVED",
  "FAILED",
  "ARCHIVED",
] as const;

export type PreviewStatus = (typeof PREVIEW_STATUSES)[number];

export const BUSINESS_PREVIEW_STATUSES = [
  "NOT_GENERATED",
  "ANALYZING",
  "GENERATING",
  "READY",
  "FAILED",
  "ARCHIVED",
  "DRAFT",
  "APPROVED",
] as const;

export type BusinessPreviewStatus = (typeof BUSINESS_PREVIEW_STATUSES)[number];

export const SEO_OPPORTUNITY_STATUSES = [
  "NOT_ANALYZED",
  "ANALYZING",
  "LOW",
  "MEDIUM",
  "HIGH",
  "VERY_HIGH",
  "FAILED",
] as const;

export type SeoOpportunityStatus = (typeof SEO_OPPORTUNITY_STATUSES)[number];

export const OUTREACH_MESSAGE_STATUSES = [
  "DRAFT",
  "REVIEW_REQUIRED",
  "APPROVED",
  "SENDING",
  "SENT",
  "DELIVERED",
  "OPENED",
  "CLICKED",
  "REPLIED",
  "BOUNCED",
  "FAILED",
  "SUPPRESSED",
  "READY",
  "SCHEDULED",
  "UNSUBSCRIBED",
] as const;

export type OutreachMessageStatus = (typeof OUTREACH_MESSAGE_STATUSES)[number];

export const EXCLUSIVITY_STATUSES = [
  "AVAILABLE",
  "PRIMARY_CANDIDATE",
  "RESERVED",
  "EXCLUSIVE",
  "RELEASED",
] as const;

export type ExclusivityStatus = (typeof EXCLUSIVITY_STATUSES)[number];

export const QUALIFICATION_STATUSES = [
  "UNQUALIFIED",
  "POTENTIAL",
  "QUALIFIED",
] as const;

export type QualificationStatus = (typeof QUALIFICATION_STATUSES)[number];

export const PROSPECT_TYPES = [
  "WEBSITE_TRANSFORMATION",
  "GROWTH_ONLY",
  "WEAK_BUSINESS",
  "NOT_ELIGIBLE",
  "UNKNOWN",
] as const;

/** Spiegelt `ProspectType` uit de Pilates-config, zodat databasetypes los blijven van de vertical. */
export type ProspectTypeValue = (typeof PROSPECT_TYPES)[number];

export const ACTIVITY_TYPES = [
  "DISCOVERY_STARTED",
  "BUSINESS_DISCOVERED",
  "BUSINESS_UPDATED",
  "BUSINESS_QUALIFIED",
  "BUSINESS_EXCLUDED",
  "DISCOVERY_COMPLETED",
  "PREVIEW_ANALYSIS_STARTED",
  "BRANDING_EXTRACTED",
  "SERVICES_EXTRACTED",
  "TEMPLATE_SELECTED",
  "PREVIEW_GENERATION_STARTED",
  "PREVIEW_CREATED",
  "PREVIEW_FAILED",
  "PREVIEW_REGENERATED",
  "TEMPLATE_CHANGED",
  "PREVIEW_APPROVED",
  "SEO_ANALYZED",
  "OUTREACH_CREATED",
  "OUTREACH_DRAFT_GENERATED",
  "OUTREACH_REGENERATED",
  "OUTREACH_EDITED",
  "OUTREACH_APPROVED",
  "OUTREACH_SCHEDULED",
  "OUTREACH_SCHEDULE_CANCELLED",
  "OUTREACH_BATCH_SCHEDULED",
  "FOLLOWUP_DRAFT_GENERATED",
  "FOLLOWUP_REGENERATED",
  "FOLLOWUP_APPROVED",
  "FOLLOWUP_SELECTED",
  "FOLLOWUP_DESELECTED",
  "TEST_EMAIL_SEND_STARTED",
  "TEST_EMAIL_SENT",
  "TEST_EMAIL_FAILED",
  "EMAIL_SEND_STARTED",
  "EMAIL_SENT",
  "EMAIL_DELIVERED",
  "EMAIL_OPENED",
  "EMAIL_CLICKED",
  "EMAIL_REPLIED",
  "INBOUND_FORM_RECEIVED",
  "EMAIL_BOUNCED",
  "EMAIL_COMPLAINED",
  "EMAIL_SUPPRESSED",
  "STATUS_CHANGED",
  "CITY_RESERVED",
  "CITY_WINNER_SELECTED",
  "CITY_WINNER_OVERRIDE",
  "CITY_WINNER_CLEARED",
  "CITY_RANKING_COMPLETED",
  "CITY_RERANKED",
  "PRIMARY_CANDIDATE_SELECTED",
  "SEO_ANALYSIS_STARTED",
  "KEYWORD_METRICS_FETCHED",
  "SERP_RANKINGS_FETCHED",
  "SEO_OPPORTUNITY_CALCULATED",
  "SEO_ANALYSIS_COMPLETED",
  "SEO_ANALYSIS_FAILED",
  "CLIENT_WON",
] as const;

export type ActivityType = (typeof ACTIVITY_TYPES)[number] | string;

export type TemplateVariant =
  | "editorial"
  | "reformer-minimal"
  | "soft-movement"
  | "clinical-atelier";

export interface Vertical {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  active: boolean;
}

export interface City {
  id: string;
  slug: string;
  name: string;
  country_code: string;
  region: string | null;
  region_group?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  is_active?: boolean;
}

export interface TemplateRecord {
  id: string;
  vertical_id: string;
  variant: TemplateVariant;
  name: string;
  description: string | null;
  active: boolean;
  thumbnail_url: string | null;
}

export interface Business {
  id: string;
  vertical_id: string;
  city_id: string;
  slug: string;
  studio_name: string;
  country: string;
  logo: string | null;
  website_url: string | null;
  domain: string | null;
  normalized_domain: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  accent_color: string | null;
  tagline: string | null;
  description: string | null;
  primary_service: string | null;
  services: unknown[];
  phone: string | null;
  email: string | null;
  email_confidence?: number | null;
  email_confidence_level?: "skip" | "low" | "medium" | "high" | null;
  address: string | null;
  postal_code: string | null;
  booking_url: string | null;
  instagram_url: string | null;
  review_rating: number | null;
  review_count: number;
  team: unknown[];
  images: unknown[];
  memberships: unknown[];
  reviews: unknown[];
  faqs: unknown[];
  benefits: unknown[];
  primary_seo_keyword: string | null;
  secondary_seo_keywords: string[];
  opening_hours: string | null;
  founded_year: number | null;
  lead_status: LeadStatus;
  qualification_score: number | null;
  qualification_status: QualificationStatus;
  qualification_evidence: Record<string, unknown>;
  exclusive_status: "none" | "reserved" | "active";
  exclusive_started_at: string | null;
  exclusive_ends_at: string | null;
  is_demo: boolean;
  selected_template_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  last_activity_at: string;
  latitude: number | null;
  longitude: number | null;
  google_place_id: string | null;
  google_cid: string | null;
  google_category: string | null;
  additional_categories: string[];
  google_rating: number | null;
  google_review_count: number | null;
  google_logo_url: string | null;
  google_main_image_url: string | null;
  google_claimed: boolean | null;
  google_status: string | null;
  source: string;
  discovered_at: string | null;
  last_seen_at: string | null;
  discovery_count: number;
  is_chain: boolean;
  chain_name: string | null;
  chain_location_count: number | null;
  lead_eligible: boolean;
  preview_status: BusinessPreviewStatus;
  raw_listing: Record<string, unknown>;
  brand_profile?: Record<string, unknown>;
  website_intelligence?: Record<string, unknown>;
  template_selection_confidence?: number | null;
  template_selection_reasoning?: string | null;
  lead_score?: number | null;
  score_components?: Record<string, unknown>;
  city_rank?: number | null;
  primary_candidate?: boolean;
  primary_candidate_source?: string | null;
  ranking_updated_at?: string | null;
  ranking_version?: string | null;
  website_quality_score?: number | null;
  website_opportunity_score?: number | null;
  seo_opportunity_score?: number | null;
  seo_visibility_score?: number | null;
  seo_readiness_score?: number | null;
  winner_confidence?: number | null;
  winner_reason?: string | null;
  winner_evidence?: Record<string, unknown>;
  winner_path?: string | null;

  /* Website transformation eligibility (M8.3) */
  prospect_type?: ProspectTypeValue | null;
  prospect_type_reason?: string | null;
  website_transformation_score?: number | null;
  website_modernity_score?: number | null;
  website_signals?: Record<string, unknown> | null;
  brand_asset_usability_score?: number | null;
  business_presentation_gap_score?: number | null;
  transformation_components?: Record<string, unknown> | null;
  transformation_city_rank?: number | null;
  transformation_primary_candidate?: boolean | null;
  transformation_winner_confidence?: number | null;
  transformation_winner_reason?: string | null;
  transformation_rank_updated_at?: string | null;
  preview_eligible?: boolean | null;
  preview_eligibility_reason?: string | null;
  screenshot_desktop_url?: string | null;
  screenshot_mobile_url?: string | null;
  screenshot_metadata?: Record<string, unknown> | null;
  screenshots_captured_at?: string | null;
  visual_assessment?: Record<string, unknown> | null;
  visual_assessed_at?: string | null;
  visual_assessment_source?: string | null;
  visual_assessment_model?: string | null;
  visual_assessment_confidence?: number | null;
  visual_assessment_cost?: number | null;
  visual_quality_score?: number | null;
  visual_modernity_score?: number | null;
  visual_mobile_score?: number | null;
  visual_booking_ux_score?: number | null;
  visual_transformation_fit?: string | null;

  /* Multi-prospect city outreach (M8.4) */
  selected_for_outreach?: boolean | null;
  selected_for_outreach_at?: string | null;
  selected_for_followup?: boolean | null;
  selected_for_followup_at?: string | null;
  template_fit_scores?: Record<string, number> | null;
  recommended_template?: string | null;
  recommended_template_score?: number | null;
  assigned_template?: string | null;
  template_assignment_score?: number | null;
  template_assignment_reason?: string | null;
  template_assignment_confidence?: number | null;
  template_assigned_at?: string | null;
}

export interface Contact {
  id: string;
  business_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: string | null;
  source: string | null;
  is_primary: boolean;
  email_confidence?: number | null;
  email_confidence_level?: "skip" | "low" | "medium" | "high" | null;
  email_confidence_reasons?: string[] | null;
  created_at: string;
}

export interface PreviewRecord {
  id: string;
  business_id: string;
  template_id: string;
  slug: string;
  template_variant: TemplateVariant;
  status: PreviewStatus;
  thumbnail_url: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  generated_at?: string | null;
  template_selection_confidence?: number | null;
  template_selection_reasoning?: string | null;
  brand_profile_snapshot?: Record<string, unknown>;
  generation_metadata?: Record<string, unknown>;
  /** Door Claude gegenereerde copy van de conceptsite, hergebruikt in de outreach. */
  content_snapshot?: Record<string, unknown>;
  studio_snapshot?: Record<string, unknown>;
}

export interface SeoOpportunity {
  id: string;
  business_id: string;
  vertical_id: string;
  city_id: string;
  primary_keyword: string;
  secondary_keywords: string[];
  status: SeoOpportunityStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  primary_search_volume?: number | null;
  total_clustered_demand?: number | null;
  current_rank?: number | null;
  current_ranking_url?: string | null;
  visibility_score?: number | null;
  seo_readiness_score?: number | null;
  seo_opportunity_score?: number | null;
  opportunity_components?: Record<string, unknown>;
  keyword_metrics?: unknown[];
  competitor_snapshot?: unknown[];
  analyzed_at?: string | null;
  seo_title?: string | null;
  meta_description?: string | null;
  h1_recommendation?: string | null;
}

export interface OutreachCampaign {
  id: string;
  name: string;
  vertical_id: string | null;
  status: string;
  created_at: string;
}

export type OutreachMessageKind = "initial" | "followup";

export type FollowupTemplateId = "check_in" | "last_ping" | "custom";

export interface OutreachMessage {
  id: string;
  campaign_id: string | null;
  business_id: string;
  contact_id: string | null;
  subject: string;
  body: string;
  body_text?: string | null;
  body_html?: string | null;
  preview_url: string | null;
  status: OutreachMessageStatus;
  provider: string | null;
  provider_message_id: string | null;
  scheduled_at: string | null;
  sent_at: string | null;
  delivered_at: string | null;
  opened_at: string | null;
  clicked_at: string | null;
  replied_at: string | null;
  created_at: string;
  updated_at: string;
  version?: number;
  previous_version_id?: string | null;
  generated_at?: string | null;
  approved_at?: string | null;
  personalization_metadata?: Record<string, unknown>;
  generation_cost?: number | null;
  generation_model?: string | null;
  generation_method?: string | null;
  is_test?: boolean;
  message_kind?: OutreachMessageKind;
  parent_message_id?: string | null;
  followup_template?: FollowupTemplateId | null;
  outreach_basis?: string | null;
  facts_used?: unknown[];
  facts_omitted?: unknown[];
  metadata?: Record<string, unknown>;
  send_lock_token?: string | null;
}

export interface CityExclusivity {
  id: string;
  vertical_id: string;
  city_id: string;
  status: ExclusivityStatus;
  business_id: string | null;
  reserved_at: string | null;
  exclusive_at: string | null;
  released_at: string | null;
  notes: string | null;
  updated_at: string;
  winner_confidence?: number | null;
  winner_reason?: string | null;
  winner_evidence?: Record<string, unknown>;
}

export interface ActivityLogEntry {
  id: string;
  business_id: string | null;
  activity_type: ActivityType;
  title: string;
  description: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface DiscoveryRun {
  id: string;
  vertical_id: string;
  city_id?: string | null;
  scope: string;
  mode: "TEST" | "FULL";
  launcher_mode?: string | null;
  pipeline_phase?: string | null;
  rerun_action?: string | null;
  status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED" | "CANCELLED";
  config_snapshot: Record<string, unknown>;
  coverage_summary?: Record<string, unknown>;
  started_at: string | null;
  completed_at: string | null;
  api_calls: number;
  api_cost: number;
  businesses_found: number;
  new_businesses: number;
  duplicates: number;
  qualified: number;
  excluded: number;
  errors: unknown[];
  created_at: string;
  updated_at: string;
}

export interface LeadListItem {
  business: Business;
  vertical: Vertical;
  city: City;
  template: TemplateRecord | null;
  preview: PreviewRecord | null;
  seo: SeoOpportunity | null;
  exclusivity: CityExclusivity | null;
}

export type PipelineStageId =
  | "discovered"
  | "preview_ready"
  | "mail_draft"
  | "sent"
  | "opened"
  | "inbound"
  | "client";

export interface PipelineKanbanOutreachSummary {
  id: string;
  status: OutreachMessageStatus;
  subject: string;
  sent_at: string | null;
  updated_at: string;
}

export interface PipelineKanbanItem {
  business: Business;
  vertical: Vertical;
  city: City;
  preview: PreviewRecord | null;
  latestOutreach: PipelineKanbanOutreachSummary | null;
  stage: PipelineStageId;
}
