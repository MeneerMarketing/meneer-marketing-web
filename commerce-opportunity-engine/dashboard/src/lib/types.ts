export type OpportunityStatus =
  | "NEW"
  | "DISCOVERED"
  | "PENDING_QUALIFICATION"
  | "QUALIFIED"
  | "PENDING_AUDIT"
  | "AUDITED"
  | "NEEDS_RETRY"
  | "REVIEWED"
  | "SHORTLISTED"
  | "REJECTED"
  | "EXCLUDED"
  | "CONTACTED"
  | "REPLIED"
  | "MEETING"
  | "PROPOSAL"
  | "WON"
  | "LOST";

export const OPERATOR_WORKFLOW_STATUSES: OpportunityStatus[] = [
  "DISCOVERED",
  "PENDING_QUALIFICATION",
  "QUALIFIED",
  "PENDING_AUDIT",
  "AUDITED",
  "NEEDS_RETRY",
  "REVIEWED",
  "SHORTLISTED",
  "REJECTED",
  "EXCLUDED",
  "NEW",
  "CONTACTED",
  "REPLIED",
  "MEETING",
  "PROPOSAL",
  "WON",
  "LOST",
];

export const ACTIVE_STATUSES: OpportunityStatus[] = [
  "NEW",
  "DISCOVERED",
  "PENDING_QUALIFICATION",
  "QUALIFIED",
  "PENDING_AUDIT",
  "AUDITED",
  "NEEDS_RETRY",
  "REVIEWED",
  "SHORTLISTED",
  "REJECTED",
  "EXCLUDED",
];

export type EligibilityStatus =
  | "PENDING_QUALIFICATION"
  | "LEAD_ELIGIBLE"
  | "EXCLUDED";

export type BrandRow = {
  id: string;
  name: string;
  domain: string | null;
  normalized_domain: string | null;
  confirmed_google_advertiser: boolean;
  transparency_confirmed: boolean;
  confirmation_source: string | null;
  business_type: string;
  business_type_confidence: number | null;
  business_type_reasoning: string | null;
  lead_eligible: boolean;
  eligibility_status: EligibilityStatus | null;
  qualification_reason: string | null;
  excluded_reason: string | null;
  manual_excluded: boolean | null;
  manual_excluded_at: string | null;
  manual_exclusion_reason: string | null;
  manual_exclusion_note: string | null;
  platform: string | null;
  platform_confidence: number | null;
  platform_candidate: string | null;
  platform_evidence: Record<string, unknown> | null;
  shopify_confidence: number | null;
  is_ecommerce: boolean | null;
  ecommerce_confidence: number | null;
  business_maturity_score: number | null;
  business_maturity_components: Record<string, unknown> | null;
  retailer_scale_score: number | null;
  last_crawled_at: string | null;
  crawl_status: string | null;
  crawl_metadata: Record<string, unknown> | null;
  first_seen_at: string | null;
  last_seen_at: string | null;
  transparency_metadata: Record<string, unknown> | null;
  paid_target_status: string | null;
  paid_targets_resolved_at: string | null;
  paid_targets_count: number | null;
  do_not_contact: boolean | null;
  do_not_contact_at: string | null;
  do_not_contact_note: string | null;
  is_favorite: boolean | null;
  favorite_at: string | null;
  operator_status: string | null;
  force_lead_eligible: boolean | null;
  manual_override: boolean | null;
  manual_override_reason: string | null;
  manual_override_at: string | null;
  refresh_requested_at: string | null;
  last_refresh_status: string | null;
};

export type PageRow = {
  id: string;
  url: string;
  final_url: string | null;
  page_type: string | null;
  product_name: string | null;
  price: number | null;
  currency: string | null;
  review_count: number | null;
  rating: number | null;
  product_resolution_confidence: number | null;
  product_resolution_source: string | null;
  extracted_data: Record<string, unknown> | null;
  extraction_evidence: Record<string, unknown> | null;
  brand_id: string | null;
};

export type OpportunityRow = {
  id: string;
  brand_id: string;
  primary_ad_occurrence_id: string | null;
  keyword_id: string | null;
  resolved_page_id: string | null;
  landing_url: string | null;
  resolved_url: string | null;
  target_key: string;
  ad_headline: string | null;
  ad_description: string | null;
  source: string | null;
  paid_signal_type: string | null;
  paid_confirmed: boolean;
  product_resolution_confidence: number | null;
  supporting_keyword_count: number | null;
  supporting_source_count: number | null;
  supporting_ad_count: number;
  is_merged: boolean | null;
  merged_into_id: string | null;
  is_favorite: boolean | null;
  favorite_at: string | null;
  is_shortlisted: boolean | null;
  shortlisted_at: string | null;
  operator_status: string | null;
  audit_retry_count: number | null;
  last_audit_error: string | null;
  last_audit_attempt_at: string | null;
  first_seen_at: string | null;
  last_seen_at: string | null;
  status: OpportunityStatus;
  opportunity_score: number | null;
  opportunity_verdict: string | null;
  audit_confidence: number | null;
  cro_gap: number | null;
  ad_landing_gap: number | null;
  rebuild_potential: number | null;
  audit_type: string | null;
  keyword_intent: string | null;
  keyword_intent_confidence: number | null;
  ad_landing_match_quality: number | null;
  meneer_marketing_fit_score: number | null;
  cro_audit_status: string | null;
  page_health_status: string | null;
  page_health_reason: string | null;
  screenshot_quality: string | null;
  brand_alias_mismatch: boolean | null;
  brand_alias_note: string | null;
  last_audited_at: string | null;
  latest_audit_id: string | null;
  primary_keyword_confidence: number | null;
  primary_keyword_reason: string | null;
  source_quality_score: number | null;
  source_type: string | null;
  discovery_serp_item_type: string | null;
  discovery_confirmation_source: string | null;
  source_integrity_notes: Record<string, unknown> | null;
  paid_search_target_id: string | null;
  cro_ready: boolean | null;
  cro_readiness_level: string | null;
  paid_target_status: string | null;
  ground_truth_source_type: string | null;
  listing_target_confidence: number | null;
  paid_evidence_confidence: number | null;
  source_evidence: Record<string, unknown> | null;
  product_merchant_relationship: string | null;
  product_merchant_relationship_confidence: number | null;
  product_merchant_relationship_evidence: string[] | Record<string, unknown> | null;
  pdp_improvement_potential: number | null;
  full_rebuild_potential: number | null;
  recommended_project_type: string | null;
  recommended_project_reason: string | null;
  outreach_eligible: boolean | null;
  outreach_eligible_reason: string | null;
  outreach_priority_score: number | null;
  outreach_status: string | null;
  created_at: string;
  updated_at: string;
  brands?: BrandRow | BrandRow[] | null;
  pages?: PageRow | PageRow[] | null;
  keywords?:
    | { id: string; keyword: string; category?: string | null }
    | { id: string; keyword: string; category?: string | null }[]
    | null;
};

export type AuditRow = {
  id: string;
  opportunity_id: string | null;
  status: string;
  opportunity_score: number | null;
  opportunity_verdict: string | null;
  audit_confidence: number | null;
  cro_scores: Record<string, number | null> | null;
  conversion_leaks: Array<Record<string, unknown>> | null;
  strengths: Array<Record<string, unknown>> | null;
  sales_angle: string | null;
  rebuild_potential: number | null;
  ad_landing_analysis: Record<string, unknown> | null;
  screenshot_paths: Record<string, string | null> | null;
  scoring_breakdown: Record<string, unknown> | null;
  score_formula_breakdown: Record<string, unknown> | null;
  finding_validations: Array<Record<string, unknown>> | null;
  audit_type: string | null;
  keyword_intent: string | null;
  keyword_intent_confidence: number | null;
  keyword_intent_reason: string | null;
  ad_landing_match_quality: number | null;
  meneer_marketing_fit_score: number | null;
  page_health_status: string | null;
  page_health_confidence: number | null;
  page_health_reason: string | null;
  page_health_evidence: Record<string, unknown> | null;
  screenshot_quality: string | null;
  brand_alias_mismatch: boolean | null;
  brand_alias_evidence: Record<string, unknown> | null;
  audit_valid: boolean | null;
  invalid_reason: string | null;
  model: string | null;
  audit_version: string | null;
  audited_at: string | null;
  product_merchant_relationship: string | null;
  product_merchant_relationship_confidence: number | null;
  product_merchant_relationship_evidence: string[] | Record<string, unknown> | null;
  pdp_improvement_potential: number | null;
  full_rebuild_potential: number | null;
  recommended_project_type: string | null;
  recommended_project_reason: string | null;
};

export type EngineSettingRow = {
  key: string;
  value: unknown;
  label: string | null;
  description: string | null;
  updated_at: string | null;
};

export type KeywordIntelligenceRow = {
  id: string;
  keyword: string;
  category: string | null;
  cluster: string | null;
  seed_keyword: string | null;
  normalized_keyword: string | null;
  search_volume: number | null;
  cpc: number | null;
  competition: number | null;
  competition_index: number | null;
  commercial_intent_score: number | null;
  product_intent_score: number | null;
  keyword_quality_score: number | null;
  volume_tier: string | null;
  keyword_source: string | null;
  discovery_status: string | null;
  active: boolean | null;
  approved: boolean | null;
  rejected: boolean | null;
  paused: boolean | null;
  rejection_reason: string | null;
  last_scanned_at: string | null;
  last_metrics_update: string | null;
  estimated_serp_cost?: number | null;
  keyword_intent_type: string | null;
  keyword_intent_confidence: number | null;
  prospecting_value_score: number | null;
  prospecting_tier: string | null;
  prospect_yield_score: number | null;
  eligible_for_auto_approval: boolean | null;
  placements_found: number | null;
  unique_domains_found: number | null;
  lead_eligible_found: number | null;
  shopify_found: number | null;
  general_retailers_found: number | null;
  comparison_sites_found: number | null;
  retailer_ratio: number | null;
  serp_cost: number | null;
  cost_per_lead_eligible: number | null;
  cost_per_shopify_prospect: number | null;
  discovery_priority_score: number | null;
};

export type ControlledScaleFunnel = {
  keywords?: number | null;
  placements?: number | null;
  uniqueDomains?: number | null;
  ecommerce?: number | null;
  brandSpecialist?: number | null;
  prequalified?: number | null;
  shopify?: number | null;
  transparencyChecked?: number | null;
  confirmedAdvertisers?: number | null;
  targetResolutionChecked?: number | null;
  exactPaidFunnels?: number | null;
  highConfidenceTargets?: number | null;
  [key: string]: number | null | undefined;
};

export type ControlledScaleBestProspect = {
  domain?: string | null;
  businessType?: string | null;
  platform?: string | null;
  maturity?: number | null;
  retailerScale?: number | null;
  preFit?: number | null;
  shopify?: boolean | null;
  transparencyStatus?: string | null;
  leadEligible?: boolean | null;
  category?: string | null;
  sourceKeywords?: Array<{
    keyword?: string | null;
    category?: string | null;
  } | null> | null;
};

export type ControlledScaleCategoryStat = {
  keywordsScanned?: number | null;
  serpCost?: number | null;
  domainsFound?: number | null;
  uniqueDomains?: number | null;
  uniqueEcommerceDomains?: number | null;
  specialistsBrands?: number | null;
  uniqueBrandSpecialistDomains?: number | null;
  prequalified?: number | null;
  uniquePrequalifiedDomains?: number | null;
  shopify?: number | null;
  uniqueShopifyDomains?: number | null;
  confirmedAdvertisers?: number | null;
  uniqueConfirmedDomains?: number | null;
  categoryProspectYieldScore?: number | null;
  [key: string]: number | null | undefined;
};

export type PrequalifiedProspectRow = {
  domain?: string | null;
  category?: string | null;
  bestSourceKeyword?: string | null;
  platform?: string | null;
  businessType?: string | null;
  maturity?: number | null;
  retailerScale?: number | null;
  preFit?: number | null;
  keywordSignals?: number | null;
  adsStatus?: string | null;
  paidTargetStatus?: string | null;
  verificationPriority?: number | null;
};

export type ControlledScaleRunRow = {
  id: string;
  run_id: string | null;
  status: string | null;
  funnel: ControlledScaleFunnel | null;
  category_stats: Record<string, ControlledScaleCategoryStat> | null;
  best_prospects: ControlledScaleBestProspect[] | null;
  noise_report: Record<string, unknown> | null;
  dataforseo_cost: number | null;
  anthropic_cost: number | null;
  completed_at: string | null;
  created_at?: string | null;
};

export type CategoryProspectYieldRow = {
  category_id: string;
  keywords_scanned: number | null;
  serp_cost: number | null;
  domains_found: number | null;
  specialists_brands: number | null;
  prequalified: number | null;
  shopify: number | null;
  confirmed_advertisers: number | null;
  paid_targets: number | null;
  category_prospect_yield_score: number | null;
  last_run_id: string | null;
  updated_at: string | null;
};

export type DiscoveryFunnelMetrics = {
  total: number;
  ecommerce: number;
  brandOrSpecialist: number;
  generalRetailer: number;
  comparisonOrMarketplace: number;
  shopify: number;
  leadEligible: number;
};

export type KeywordProspectingQuality = {
  top: KeywordIntelligenceRow[];
  worst: KeywordIntelligenceRow[];
};

export type KeywordCategoryRow = {
  id: string;
  label: string;
  active: boolean;
  paused: boolean;
  seed_topics: string[] | null;
};

export type KeywordCategoryOverview = KeywordCategoryRow & {
  keywordCount: number;
  highQualityCount: number;
  approvedCount: number;
};

export type KeywordIntelligenceSummary = {
  total: number;
  qualified: number;
  approved: number;
  rejected: number;
  scanned: number;
  estimatedSerpCost: number;
};

export type OperatorNoteRow = {
  id: string;
  brand_id: string | null;
  opportunity_id: string | null;
  body: string;
  created_at: string;
  updated_at: string | null;
};

export type ActivityLogRow = {
  id: string;
  brand_id: string | null;
  opportunity_id: string | null;
  event_type: string;
  title: string;
  detail: string | null;
  actor: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
};

export type OperatorTagRow = {
  id: string;
  name: string;
  slug: string;
  created_at: string | null;
};

export type NeedsAttentionRow = {
  id: string;
  kind: "opportunity" | "brand";
  brand_id: string;
  opportunity_id: string | null;
  domain: string | null;
  product_name: string | null;
  issue_type: string;
  issue_label: string;
  cro_audit_status: string | null;
  page_health_status: string | null;
  last_audit_error: string | null;
  audit_retry_count: number | null;
  last_audit_attempt_at: string | null;
};

export function one<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? value[0] ?? null : value;
}
