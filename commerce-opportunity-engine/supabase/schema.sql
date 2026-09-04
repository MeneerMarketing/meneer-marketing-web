-- Meneer Marketing Commerce Opportunity Engine
-- Initial schema for lead discovery and audit pipeline.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------------
-- brands
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  domain TEXT,
  normalized_domain TEXT,
  first_seen_at TIMESTAMPTZ,
  last_seen_at TIMESTAMPTZ,
  scan_count INTEGER NOT NULL DEFAULT 0,
  confirmed_google_advertiser BOOLEAN NOT NULL DEFAULT false,
  confirmation_source TEXT,
  business_type TEXT NOT NULL DEFAULT 'UNKNOWN',
  lead_eligible BOOLEAN NOT NULL DEFAULT false,
  eligibility_status TEXT NOT NULL DEFAULT 'PENDING_QUALIFICATION',
  excluded_reason TEXT,
  manual_excluded BOOLEAN NOT NULL DEFAULT false,
  manual_excluded_at TIMESTAMPTZ,
  manual_exclusion_reason TEXT,
  manual_exclusion_note TEXT,
  transparency_confirmed BOOLEAN NOT NULL DEFAULT false,
  transparency_checked_at TIMESTAMPTZ,
  transparency_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_ecommerce BOOLEAN NOT NULL DEFAULT false,
  ecommerce_confidence NUMERIC(4, 3),
  platform TEXT,
  platform_confidence NUMERIC(4, 3),
  platform_candidate TEXT,
  platform_evidence JSONB NOT NULL DEFAULT '{}'::jsonb,
  shopify_confidence NUMERIC(4, 3),
  business_type_confidence NUMERIC(4, 3),
  business_type_reasoning TEXT,
  qualification_reason TEXT,
  qualification_evidence JSONB NOT NULL DEFAULT '{}'::jsonb,
  business_maturity_score INTEGER,
  business_maturity_components JSONB NOT NULL DEFAULT '{}'::jsonb,
  retailer_scale_score INTEGER,
  last_crawled_at TIMESTAMPTZ,
  crawl_status TEXT,
  crawl_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_brands_domain ON brands (domain);
CREATE UNIQUE INDEX IF NOT EXISTS idx_brands_normalized_domain ON brands (normalized_domain) WHERE normalized_domain IS NOT NULL;

-- ---------------------------------------------------------------------------
-- keywords
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword TEXT NOT NULL,
  locale TEXT,
  category TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  last_scanned_at TIMESTAMPTZ,
  search_volume INTEGER,
  search_metrics JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_keywords_keyword_locale ON keywords (keyword, locale);
CREATE INDEX IF NOT EXISTS idx_keywords_active ON keywords (active);

-- ---------------------------------------------------------------------------
-- pages
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  brand_id UUID REFERENCES brands (id) ON DELETE SET NULL,
  final_url TEXT,
  page_type TEXT,
  product_name TEXT,
  price NUMERIC(12, 2),
  currency TEXT,
  review_count INTEGER,
  rating NUMERIC(3, 2),
  availability TEXT,
  product_brand TEXT,
  product_description TEXT,
  product_resolution_confidence NUMERIC(4, 3),
  product_resolution_source TEXT,
  product_candidate_count INTEGER,
  extraction_evidence JSONB NOT NULL DEFAULT '{}'::jsonb,
  extracted_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  crawl_status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_pages_url ON pages (url);
CREATE INDEX IF NOT EXISTS idx_pages_brand_id ON pages (brand_id);

-- ---------------------------------------------------------------------------
-- runs (pipeline executions)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_runs_status ON runs (status);
CREATE INDEX IF NOT EXISTS idx_runs_run_type ON runs (run_type);

-- ---------------------------------------------------------------------------
-- ad_occurrences (ads found for keywords / brands / pages)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ad_occurrences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword_id UUID REFERENCES keywords (id) ON DELETE SET NULL,
  brand_id UUID REFERENCES brands (id) ON DELETE SET NULL,
  page_id UUID REFERENCES pages (id) ON DELETE SET NULL,
  run_id UUID REFERENCES runs (id) ON DELETE SET NULL,
  source TEXT,
  headline TEXT,
  description TEXT,
  landing_url TEXT,
  displayed_url TEXT,
  rank INTEGER,
  found_at TIMESTAMPTZ,
  serp_item_type TEXT,
  ad_signal_type TEXT,
  paid_confidence NUMERIC(4, 3),
  confirmation_source TEXT,
  raw_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  observed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ad_occurrences_keyword_id ON ad_occurrences (keyword_id);
CREATE INDEX IF NOT EXISTS idx_ad_occurrences_brand_id ON ad_occurrences (brand_id);
CREATE INDEX IF NOT EXISTS idx_ad_occurrences_run_id ON ad_occurrences (run_id);
CREATE INDEX IF NOT EXISTS idx_ad_occurrences_found_at ON ad_occurrences (found_at);
CREATE UNIQUE INDEX IF NOT EXISTS idx_ad_occurrences_run_dedup ON ad_occurrences (run_id, keyword_id, brand_id, landing_url, headline, rank) WHERE run_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ad_occurrences_signal_type ON ad_occurrences (ad_signal_type);
CREATE INDEX IF NOT EXISTS idx_brands_lead_eligible ON brands (lead_eligible);
CREATE INDEX IF NOT EXISTS idx_brands_business_type ON brands (business_type);
CREATE INDEX IF NOT EXISTS idx_brands_eligibility_status ON brands (eligibility_status);
CREATE INDEX IF NOT EXISTS idx_brands_manual_excluded ON brands (manual_excluded) WHERE manual_excluded = true;
CREATE INDEX IF NOT EXISTS idx_brands_transparency_confirmed ON brands (transparency_confirmed);

-- ---------------------------------------------------------------------------
-- opportunities (brand + landing/product target — not one audit per brand)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES brands (id) ON DELETE CASCADE,
  primary_ad_occurrence_id UUID REFERENCES ad_occurrences (id) ON DELETE SET NULL,
  keyword_id UUID REFERENCES keywords (id) ON DELETE SET NULL,
  resolved_page_id UUID REFERENCES pages (id) ON DELETE SET NULL,
  landing_url TEXT,
  resolved_url TEXT,
  target_key TEXT NOT NULL,
  ad_headline TEXT,
  ad_description TEXT,
  source TEXT,
  paid_signal_type TEXT,
  paid_confirmed BOOLEAN NOT NULL DEFAULT false,
  product_resolution_confidence NUMERIC(4, 3),
  supporting_keyword_count INTEGER NOT NULL DEFAULT 1,
  supporting_ad_count INTEGER NOT NULL DEFAULT 1,
  first_seen_at TIMESTAMPTZ,
  last_seen_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'NEW',
  status_updated_at TIMESTAMPTZ,
  opportunity_score NUMERIC(5, 2),
  opportunity_verdict TEXT,
  audit_confidence NUMERIC(5, 2),
  cro_gap NUMERIC(5, 2),
  ad_landing_gap NUMERIC(5, 2),
  rebuild_potential NUMERIC(5, 2),
  last_audited_at TIMESTAMPTZ,
  latest_audit_id UUID,
  primary_keyword_confidence NUMERIC(5, 2),
  primary_keyword_reason TEXT,
  source_quality_score NUMERIC(5, 2),
  source_type TEXT,
  discovery_serp_item_type TEXT,
  discovery_confirmation_source TEXT,
  source_integrity_notes JSONB NOT NULL DEFAULT '{}'::jsonb,
  source_validated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT opportunities_status_check CHECK (
    status IN ('NEW', 'REVIEWED', 'SHORTLISTED', 'REJECTED', 'CONTACTED', 'REPLIED', 'MEETING', 'WON', 'LOST')
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_opportunities_brand_target_key
  ON opportunities (brand_id, target_key);
CREATE INDEX IF NOT EXISTS idx_opportunities_brand_id ON opportunities (brand_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_status ON opportunities (status);
CREATE INDEX IF NOT EXISTS idx_opportunities_paid_confirmed ON opportunities (paid_confirmed);
CREATE INDEX IF NOT EXISTS idx_opportunities_last_seen ON opportunities (last_seen_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_opportunities_score ON opportunities (opportunity_score DESC NULLS LAST);

-- ---------------------------------------------------------------------------
-- audits (CRO intelligence per opportunity)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES pages (id) ON DELETE SET NULL,
  opportunity_id UUID REFERENCES opportunities (id) ON DELETE CASCADE,
  brand_id UUID REFERENCES brands (id) ON DELETE SET NULL,
  run_id UUID REFERENCES runs (id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  score NUMERIC(5, 2),
  findings JSONB NOT NULL DEFAULT '{}'::jsonb,
  audit_version TEXT,
  prompt_version TEXT,
  model TEXT,
  page_content_hash TEXT,
  audited_at TIMESTAMPTZ,
  anthropic_cost NUMERIC(10, 6),
  audit_confidence NUMERIC(5, 2),
  opportunity_score NUMERIC(5, 2),
  opportunity_verdict TEXT,
  cro_scores JSONB NOT NULL DEFAULT '{}'::jsonb,
  conversion_leaks JSONB NOT NULL DEFAULT '[]'::jsonb,
  strengths JSONB NOT NULL DEFAULT '[]'::jsonb,
  sales_angle TEXT,
  rebuild_potential NUMERIC(5, 2),
  ad_landing_analysis JSONB NOT NULL DEFAULT '{}'::jsonb,
  screenshot_paths JSONB NOT NULL DEFAULT '{}'::jsonb,
  page_representation JSONB NOT NULL DEFAULT '{}'::jsonb,
  scoring_breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
  score_formula_breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
  finding_validations JSONB NOT NULL DEFAULT '[]'::jsonb,
  raw_ai_response TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audits_page_id ON audits (page_id);
CREATE INDEX IF NOT EXISTS idx_audits_run_id ON audits (run_id);
CREATE INDEX IF NOT EXISTS idx_audits_status ON audits (status);
CREATE INDEX IF NOT EXISTS idx_audits_opportunity_id ON audits (opportunity_id);
CREATE INDEX IF NOT EXISTS idx_audits_brand_id ON audits (brand_id);
CREATE INDEX IF NOT EXISTS idx_audits_content_hash ON audits (opportunity_id, audit_version, page_content_hash);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'opportunities_latest_audit_id_fkey'
  ) THEN
    ALTER TABLE opportunities
      ADD CONSTRAINT opportunities_latest_audit_id_fkey
      FOREIGN KEY (latest_audit_id) REFERENCES audits (id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS opportunity_ad_occurrences (
  opportunity_id UUID NOT NULL REFERENCES opportunities (id) ON DELETE CASCADE,
  ad_occurrence_id UUID NOT NULL REFERENCES ad_occurrences (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (opportunity_id, ad_occurrence_id)
);

CREATE TABLE IF NOT EXISTS opportunity_keywords (
  opportunity_id UUID NOT NULL REFERENCES opportunities (id) ON DELETE CASCADE,
  keyword_id UUID NOT NULL REFERENCES keywords (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (opportunity_id, keyword_id)
);

-- ---------------------------------------------------------------------------
-- Milestone 5.2 — Paid Search Ground Truth
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS paid_search_targets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES brands (id) ON DELETE CASCADE,
  keyword TEXT NOT NULL,
  keyword_id UUID REFERENCES keywords (id) ON DELETE SET NULL,
  dedupe_key TEXT NOT NULL,
  source_type TEXT NOT NULL DEFAULT 'LABS_PAID_KEYWORD',
  source_quality_score NUMERIC(5, 2),
  ad_title TEXT,
  ad_description TEXT,
  landing_url TEXT,
  rank_group INTEGER,
  rank_absolute INTEGER,
  search_volume INTEGER,
  cpc NUMERIC(12, 4),
  estimated_paid_traffic NUMERIC(14, 4),
  estimated_paid_traffic_cost NUMERIC(14, 4),
  source_provider TEXT NOT NULL DEFAULT 'dataforseo_labs',
  source_observed_at TIMESTAMPTZ,
  source_data_freshness TEXT,
  data_updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  raw_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_paid_search_targets_dedupe_key
  ON paid_search_targets (dedupe_key);
CREATE INDEX IF NOT EXISTS idx_paid_search_targets_brand_id
  ON paid_search_targets (brand_id);
CREATE INDEX IF NOT EXISTS idx_paid_search_targets_landing
  ON paid_search_targets (landing_url);

ALTER TABLE brands
  ADD COLUMN IF NOT EXISTS paid_target_status TEXT,
  ADD COLUMN IF NOT EXISTS paid_targets_resolved_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS paid_targets_count INTEGER;

ALTER TABLE opportunities
  ADD COLUMN IF NOT EXISTS paid_search_target_id UUID REFERENCES paid_search_targets (id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS cro_ready BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS paid_target_status TEXT,
  ADD COLUMN IF NOT EXISTS ground_truth_source_type TEXT;

ALTER TABLE audits
  ADD COLUMN IF NOT EXISTS audit_valid BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS invalid_reason TEXT;

-- ---------------------------------------------------------------------------
-- Milestone 5.3 — Google Shopping Paid Ground Truth
-- ---------------------------------------------------------------------------
ALTER TABLE paid_search_targets
  ADD COLUMN IF NOT EXISTS channel TEXT NOT NULL DEFAULT 'SEARCH',
  ADD COLUMN IF NOT EXISTS seller TEXT,
  ADD COLUMN IF NOT EXISTS seller_domain TEXT,
  ADD COLUMN IF NOT EXISTS price NUMERIC(12, 2),
  ADD COLUMN IF NOT EXISTS currency TEXT,
  ADD COLUMN IF NOT EXISTS shop_ad_aclk TEXT,
  ADD COLUMN IF NOT EXISTS ad_url TEXT,
  ADD COLUMN IF NOT EXISTS ad_url_redirects JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS product_id TEXT,
  ADD COLUMN IF NOT EXISTS data_docid TEXT,
  ADD COLUMN IF NOT EXISTS google_product_id TEXT,
  ADD COLUMN IF NOT EXISTS domain_match_status TEXT,
  ADD COLUMN IF NOT EXISTS data_quality_issues JSONB NOT NULL DEFAULT '[]'::jsonb;

CREATE INDEX IF NOT EXISTS idx_paid_search_targets_channel ON paid_search_targets (channel);

ALTER TABLE opportunities
  ADD COLUMN IF NOT EXISTS source_evidence JSONB NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE paid_search_targets
  ADD COLUMN IF NOT EXISTS listing_target_confidence NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS paid_evidence_confidence NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS merchant_item_type TEXT,
  ADD COLUMN IF NOT EXISTS paid_evidence JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS free_listing_evidence JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS cro_readiness_level TEXT;

ALTER TABLE opportunities
  ADD COLUMN IF NOT EXISTS cro_readiness_level TEXT,
  ADD COLUMN IF NOT EXISTS listing_target_confidence NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS paid_evidence_confidence NUMERIC(5,2);

-- ---------------------------------------------------------------------------
-- Milestone 5.4 — Dual-Mode CRO Intelligence
-- ---------------------------------------------------------------------------
ALTER TABLE audits
  ADD COLUMN IF NOT EXISTS audit_type TEXT,
  ADD COLUMN IF NOT EXISTS keyword_intent TEXT,
  ADD COLUMN IF NOT EXISTS keyword_intent_confidence NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS keyword_intent_reason TEXT,
  ADD COLUMN IF NOT EXISTS ad_landing_match_quality NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS meneer_marketing_fit_score NUMERIC(5,2);

ALTER TABLE opportunities
  ADD COLUMN IF NOT EXISTS audit_type TEXT,
  ADD COLUMN IF NOT EXISTS keyword_intent TEXT,
  ADD COLUMN IF NOT EXISTS keyword_intent_confidence NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS ad_landing_match_quality NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS meneer_marketing_fit_score NUMERIC(5,2);

CREATE INDEX IF NOT EXISTS idx_opportunities_mm_fit
  ON opportunities (meneer_marketing_fit_score DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_opportunities_audit_type
  ON opportunities (audit_type);

-- ---------------------------------------------------------------------------
-- Milestone 5.4.1 — Audit Reliability Gate
-- ---------------------------------------------------------------------------
ALTER TABLE audits
  ADD COLUMN IF NOT EXISTS page_health_status TEXT,
  ADD COLUMN IF NOT EXISTS page_health_confidence NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS page_health_reason TEXT,
  ADD COLUMN IF NOT EXISTS page_health_evidence JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS screenshot_quality TEXT,
  ADD COLUMN IF NOT EXISTS brand_alias_mismatch BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS brand_alias_evidence JSONB NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE opportunities
  ADD COLUMN IF NOT EXISTS cro_audit_status TEXT,
  ADD COLUMN IF NOT EXISTS page_health_status TEXT,
  ADD COLUMN IF NOT EXISTS page_health_reason TEXT,
  ADD COLUMN IF NOT EXISTS screenshot_quality TEXT,
  ADD COLUMN IF NOT EXISTS brand_alias_mismatch BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS brand_alias_note TEXT;

CREATE INDEX IF NOT EXISTS idx_opportunities_cro_audit_status
  ON opportunities (cro_audit_status);

-- ---------------------------------------------------------------------------
-- Milestone 6 — Operator Control Center
-- ---------------------------------------------------------------------------
ALTER TABLE brands
  ADD COLUMN IF NOT EXISTS do_not_contact BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS do_not_contact_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS do_not_contact_note TEXT,
  ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS favorite_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS manual_override BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS manual_override_reason TEXT,
  ADD COLUMN IF NOT EXISTS manual_override_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS force_lead_eligible BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS operator_status TEXT,
  ADD COLUMN IF NOT EXISTS refresh_requested_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_refresh_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_refresh_status TEXT;

ALTER TABLE opportunities
  ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS favorite_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS is_shortlisted BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS shortlisted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS operator_status TEXT,
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS canonical_target_url TEXT,
  ADD COLUMN IF NOT EXISTS supporting_source_count INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS audit_retry_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_audit_attempt_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_audit_error TEXT,
  ADD COLUMN IF NOT EXISTS is_merged BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS merged_into_opportunity_id UUID REFERENCES opportunities (id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS operator_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brands (id) ON DELETE CASCADE,
  opportunity_id UUID REFERENCES opportunities (id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT operator_notes_target_check CHECK (brand_id IS NOT NULL OR opportunity_id IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS operator_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  color TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS operator_brand_tags (
  brand_id UUID NOT NULL REFERENCES brands (id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES operator_tags (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (brand_id, tag_id)
);

CREATE TABLE IF NOT EXISTS operator_opportunity_tags (
  opportunity_id UUID NOT NULL REFERENCES opportunities (id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES operator_tags (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (opportunity_id, tag_id)
);

CREATE TABLE IF NOT EXISTS operator_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brands (id) ON DELETE CASCADE,
  opportunity_id UUID REFERENCES opportunities (id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  title TEXT NOT NULL,
  detail TEXT,
  actor TEXT NOT NULL DEFAULT 'system',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS operator_ai_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brands (id) ON DELETE SET NULL,
  opportunity_id UUID REFERENCES opportunities (id) ON DELETE SET NULL,
  audit_id UUID REFERENCES audits (id) ON DELETE SET NULL,
  target_type TEXT NOT NULL,
  target_key TEXT NOT NULL,
  feedback TEXT NOT NULL CHECK (feedback IN ('UP', 'DOWN')),
  note TEXT,
  original_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS engine_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  label TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE paid_search_targets DROP CONSTRAINT IF EXISTS paid_search_targets_source_type_check;
ALTER TABLE paid_search_targets ADD CONSTRAINT paid_search_targets_source_type_check CHECK (
  source_type = ANY (ARRAY[
    'LIVE_PAID_SERP',
    'GOOGLE_SHOPPING_PAID_EXACT',
    'GOOGLE_SHOPPING_EXACT_LISTING',
    'GOOGLE_SHOPPING_FREE_LISTING',
    'GOOGLE_SHOPPING_CANDIDATE',
    'LABS_PAID_KEYWORD',
    'EXPLICIT_SPONSORED_SHOPPING',
    'TRANSPARENCY_CONFIRMED',
    'POPULAR_PRODUCTS_CANDIDATE'
  ])
);

-- ---------------------------------------------------------------------------
-- Milestone 7 — Keyword Intelligence Engine
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS keyword_categories (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  paused BOOLEAN NOT NULL DEFAULT false,
  seed_topics JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE keywords
  ADD COLUMN IF NOT EXISTS cluster TEXT,
  ADD COLUMN IF NOT EXISTS seed_keyword TEXT,
  ADD COLUMN IF NOT EXISTS normalized_keyword TEXT,
  ADD COLUMN IF NOT EXISTS cpc NUMERIC(12, 4),
  ADD COLUMN IF NOT EXISTS competition NUMERIC(8, 6),
  ADD COLUMN IF NOT EXISTS competition_index INTEGER,
  ADD COLUMN IF NOT EXISTS competition_level TEXT,
  ADD COLUMN IF NOT EXISTS commercial_intent_score INTEGER,
  ADD COLUMN IF NOT EXISTS product_intent_score INTEGER,
  ADD COLUMN IF NOT EXISTS keyword_quality_score INTEGER,
  ADD COLUMN IF NOT EXISTS volume_tier TEXT,
  ADD COLUMN IF NOT EXISTS keyword_source TEXT,
  ADD COLUMN IF NOT EXISTS discovery_status TEXT NOT NULL DEFAULT 'DISCOVERED',
  ADD COLUMN IF NOT EXISTS approved BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS rejected BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS paused BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
  ADD COLUMN IF NOT EXISTS manual_review_override BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS manual_review_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_metrics_update TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS monthly_searches JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS dfs_categories JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS search_intent_main TEXT,
  ADD COLUMN IF NOT EXISTS estimated_serp_cost NUMERIC(12, 6);

CREATE INDEX IF NOT EXISTS idx_keywords_normalized ON keywords (normalized_keyword);
CREATE INDEX IF NOT EXISTS idx_keywords_category_cluster ON keywords (category, cluster);
CREATE INDEX IF NOT EXISTS idx_keywords_quality ON keywords (keyword_quality_score DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_keywords_discovery_status ON keywords (discovery_status);

-- ---------------------------------------------------------------------------
-- Milestone 7.1 — Prospecting Quality & Keyword Yield
-- ---------------------------------------------------------------------------
ALTER TABLE keywords
  ADD COLUMN IF NOT EXISTS keyword_intent_type TEXT,
  ADD COLUMN IF NOT EXISTS keyword_intent_confidence INTEGER,
  ADD COLUMN IF NOT EXISTS keyword_intent_reason TEXT,
  ADD COLUMN IF NOT EXISTS prospecting_value_score INTEGER,
  ADD COLUMN IF NOT EXISTS prospecting_tier TEXT,
  ADD COLUMN IF NOT EXISTS prospect_yield_score INTEGER,
  ADD COLUMN IF NOT EXISTS keyword_efficiency_score INTEGER,
  ADD COLUMN IF NOT EXISTS eligible_for_auto_approval BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS serp_cost NUMERIC(12, 6),
  ADD COLUMN IF NOT EXISTS placements_found INTEGER,
  ADD COLUMN IF NOT EXISTS unique_domains_found INTEGER,
  ADD COLUMN IF NOT EXISTS new_domains_found INTEGER,
  ADD COLUMN IF NOT EXISTS general_retailers_found INTEGER,
  ADD COLUMN IF NOT EXISTS comparison_sites_found INTEGER,
  ADD COLUMN IF NOT EXISTS lead_eligible_found INTEGER,
  ADD COLUMN IF NOT EXISTS shopify_found INTEGER,
  ADD COLUMN IF NOT EXISTS confirmed_advertisers_found INTEGER,
  ADD COLUMN IF NOT EXISTS high_confidence_targets_found INTEGER,
  ADD COLUMN IF NOT EXISTS exact_paid_targets_found INTEGER,
  ADD COLUMN IF NOT EXISTS cost_per_new_brand NUMERIC(12, 6),
  ADD COLUMN IF NOT EXISTS cost_per_lead_eligible NUMERIC(12, 6),
  ADD COLUMN IF NOT EXISTS cost_per_shopify_prospect NUMERIC(12, 6),
  ADD COLUMN IF NOT EXISTS retailer_ratio NUMERIC(8, 4),
  ADD COLUMN IF NOT EXISTS yield_computed_at TIMESTAMPTZ;

CREATE TABLE IF NOT EXISTS keyword_scan_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword_id UUID NOT NULL REFERENCES keywords (id) ON DELETE CASCADE,
  run_id UUID REFERENCES runs (id) ON DELETE SET NULL,
  scan_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  cost NUMERIC(12, 6),
  placements INTEGER NOT NULL DEFAULT 0,
  unique_domains INTEGER NOT NULL DEFAULT 0,
  new_domains INTEGER NOT NULL DEFAULT 0,
  lead_eligible INTEGER NOT NULL DEFAULT 0,
  shopify INTEGER NOT NULL DEFAULT 0,
  general_retailers INTEGER NOT NULL DEFAULT 0,
  comparison_sites INTEGER NOT NULL DEFAULT 0,
  marketplaces INTEGER NOT NULL DEFAULT 0,
  confirmed_advertisers INTEGER NOT NULL DEFAULT 0,
  high_confidence_targets INTEGER NOT NULL DEFAULT 0,
  exact_paid_targets INTEGER NOT NULL DEFAULT 0,
  prospect_yield_score INTEGER,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_keyword_scan_stats_keyword ON keyword_scan_stats (keyword_id, scan_date DESC);
CREATE INDEX IF NOT EXISTS idx_keywords_prospecting_tier ON keywords (prospecting_tier);

-- ---------------------------------------------------------------------------
-- Milestone 7.2 — Controlled Multi-Category Scale
-- ---------------------------------------------------------------------------
ALTER TABLE brands
  ADD COLUMN IF NOT EXISTS prequalified_prospect BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS prequalified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS pre_fit_score INTEGER,
  ADD COLUMN IF NOT EXISTS pre_fit_reason TEXT,
  ADD COLUMN IF NOT EXISTS transparency_status TEXT;

ALTER TABLE keywords
  ADD COLUMN IF NOT EXISTS discovery_priority_score INTEGER;

CREATE TABLE IF NOT EXISTS category_prospect_yield (
  category_id TEXT PRIMARY KEY REFERENCES keyword_categories (id) ON DELETE CASCADE,
  keywords_scanned INTEGER NOT NULL DEFAULT 0,
  serp_cost NUMERIC(12, 6) NOT NULL DEFAULT 0,
  domains_found INTEGER NOT NULL DEFAULT 0,
  specialists_brands INTEGER NOT NULL DEFAULT 0,
  prequalified INTEGER NOT NULL DEFAULT 0,
  shopify INTEGER NOT NULL DEFAULT 0,
  confirmed_advertisers INTEGER NOT NULL DEFAULT 0,
  paid_targets INTEGER NOT NULL DEFAULT 0,
  category_prospect_yield_score INTEGER,
  last_run_id UUID REFERENCES runs (id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Milestone 7.2.1 — Scale cleanup + selective paid verification
-- ---------------------------------------------------------------------------
ALTER TABLE brands
  ADD COLUMN IF NOT EXISTS transparency_api_status TEXT,
  ADD COLUMN IF NOT EXISTS transparency_api_error TEXT,
  ADD COLUMN IF NOT EXISTS transparency_api_error_at TIMESTAMPTZ;

ALTER TABLE keywords
  ADD COLUMN IF NOT EXISTS category_relevance_score INTEGER,
  ADD COLUMN IF NOT EXISTS category_relevance_reasons JSONB NOT NULL DEFAULT '[]'::jsonb;

ALTER TABLE opportunities
  ADD COLUMN IF NOT EXISTS target_priority_score INTEGER;

ALTER TABLE opportunities
  ADD COLUMN IF NOT EXISTS cro_audit_eligible BOOLEAN DEFAULT false;

ALTER TABLE category_prospect_yield
  ADD COLUMN IF NOT EXISTS unique_ecommerce_domains INTEGER,
  ADD COLUMN IF NOT EXISTS unique_brand_specialist_domains INTEGER,
  ADD COLUMN IF NOT EXISTS unique_prequalified_domains INTEGER,
  ADD COLUMN IF NOT EXISTS unique_shopify_domains INTEGER,
  ADD COLUMN IF NOT EXISTS unique_confirmed_domains INTEGER;

CREATE TABLE IF NOT EXISTS controlled_scale_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID REFERENCES runs (id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'running',
  selected_keyword_ids UUID[] NOT NULL DEFAULT '{}',
  funnel JSONB NOT NULL DEFAULT '{}'::jsonb,
  category_stats JSONB NOT NULL DEFAULT '{}'::jsonb,
  best_prospects JSONB NOT NULL DEFAULT '[]'::jsonb,
  noise_report JSONB NOT NULL DEFAULT '{}'::jsonb,
  dataforseo_cost NUMERIC(12, 6) NOT NULL DEFAULT 0,
  anthropic_cost NUMERIC(12, 6) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- ---------------------------------------------------------------------------
-- Milestone 7.3 — Commercial fit (product/merchant + project type)
-- ---------------------------------------------------------------------------
ALTER TABLE opportunities
  ADD COLUMN IF NOT EXISTS product_merchant_relationship TEXT,
  ADD COLUMN IF NOT EXISTS product_merchant_relationship_confidence NUMERIC(5, 2),
  ADD COLUMN IF NOT EXISTS product_merchant_relationship_evidence JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS pdp_improvement_potential NUMERIC(5, 2),
  ADD COLUMN IF NOT EXISTS full_rebuild_potential NUMERIC(5, 2),
  ADD COLUMN IF NOT EXISTS recommended_project_type TEXT,
  ADD COLUMN IF NOT EXISTS recommended_project_reason TEXT;

ALTER TABLE audits
  ADD COLUMN IF NOT EXISTS product_merchant_relationship TEXT,
  ADD COLUMN IF NOT EXISTS product_merchant_relationship_confidence NUMERIC(5, 2),
  ADD COLUMN IF NOT EXISTS product_merchant_relationship_evidence JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS pdp_improvement_potential NUMERIC(5, 2),
  ADD COLUMN IF NOT EXISTS full_rebuild_potential NUMERIC(5, 2),
  ADD COLUMN IF NOT EXISTS recommended_project_type TEXT,
  ADD COLUMN IF NOT EXISTS recommended_project_reason TEXT;

-- ---------------------------------------------------------------------------
-- Milestone 8 — Contact enrichment + outreach (COE-prefixed tables)
-- ---------------------------------------------------------------------------
ALTER TABLE brands
  ADD COLUMN IF NOT EXISTS first_touch_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS contact_status TEXT,
  ADD COLUMN IF NOT EXISTS preferred_contact_id UUID,
  ADD COLUMN IF NOT EXISTS preferred_contact_reason TEXT;

ALTER TABLE opportunities
  ADD COLUMN IF NOT EXISTS outreach_eligible BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS outreach_eligible_reason TEXT,
  ADD COLUMN IF NOT EXISTS outreach_priority_score NUMERIC(5, 2),
  ADD COLUMN IF NOT EXISTS outreach_status TEXT;

CREATE TABLE IF NOT EXISTS coe_brand_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES brands (id) ON DELETE CASCADE,
  full_name TEXT,
  first_name TEXT,
  last_name TEXT,
  job_title TEXT,
  email TEXT,
  email_normalized TEXT,
  email_type TEXT,
  email_confidence NUMERIC(5, 2),
  contact_confidence NUMERIC(5, 2),
  phone TEXT,
  linkedin_url TEXT,
  instagram_url TEXT,
  source_url TEXT,
  source_type TEXT,
  source_evidence JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_preferred BOOLEAN NOT NULL DEFAULT false,
  is_usable_for_outreach BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS coe_contact_discovery_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID REFERENCES runs (id) ON DELETE SET NULL,
  brand_id UUID NOT NULL REFERENCES brands (id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'completed',
  pages_checked INTEGER NOT NULL DEFAULT 0,
  emails_found INTEGER NOT NULL DEFAULT 0,
  preferred_contact_id UUID REFERENCES coe_brand_contacts (id) ON DELETE SET NULL,
  contact_status TEXT,
  evidence JSONB NOT NULL DEFAULT '{}'::jsonb,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS coe_outreach_suppression (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_normalized TEXT,
  domain TEXT,
  reason TEXT NOT NULL,
  source TEXT,
  brand_id UUID REFERENCES brands (id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS coe_outreach_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES brands (id) ON DELETE CASCADE,
  opportunity_id UUID NOT NULL REFERENCES opportunities (id) ON DELETE CASCADE,
  contact_id UUID REFERENCES coe_brand_contacts (id) ON DELETE SET NULL,
  version INTEGER NOT NULL DEFAULT 1,
  parent_message_id UUID REFERENCES coe_outreach_messages (id) ON DELETE SET NULL,
  sequence_step INTEGER NOT NULL DEFAULT 1,
  next_followup_at TIMESTAMPTZ,
  strategy TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  body_html TEXT,
  status TEXT NOT NULL DEFAULT 'DRAFT',
  generator_model TEXT,
  prompt_version TEXT,
  copy_style TEXT,
  selected_finding_id TEXT,
  selected_finding_title TEXT,
  selected_strength_title TEXT,
  personalization_used JSONB NOT NULL DEFAULT '{}'::jsonb,
  claims_used JSONB NOT NULL DEFAULT '[]'::jsonb,
  claim_validation JSONB NOT NULL DEFAULT '{}'::jsonb,
  claim_validation_status TEXT,
  source_claim_level TEXT,
  idempotency_key TEXT,
  anthropic_cost NUMERIC(10, 6) NOT NULL DEFAULT 0,
  word_count INTEGER,
  generation_mode TEXT,
  fixed_copy TEXT,
  personalisation_copy TEXT,
  approved_at TIMESTAMPTZ,
  approved_by TEXT,
  approved_content_hash TEXT,
  blocked_at TIMESTAMPTZ,
  blocked_reason TEXT,
  approval_revoked_at TIMESTAMPTZ,
  feedback_vote TEXT,
  feedback_note TEXT,
  feedback_at TIMESTAMPTZ,
  manual_edits JSONB NOT NULL DEFAULT '[]'::jsonb,
  sent_at TIMESTAMPTZ,
  test_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS coe_outreach_test_sends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  outreach_message_id UUID REFERENCES coe_outreach_messages (id) ON DELETE SET NULL,
  brand_id UUID REFERENCES brands (id) ON DELETE SET NULL,
  to_email TEXT NOT NULL,
  from_email TEXT,
  subject TEXT NOT NULL,
  provider TEXT NOT NULL DEFAULT 'resend',
  provider_message_id TEXT,
  simulated BOOLEAN NOT NULL DEFAULT false,
  prospect_email_blocked TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS coe_outreach_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  outreach_message_id UUID REFERENCES coe_outreach_messages (id) ON DELETE CASCADE,
  brand_id UUID REFERENCES brands (id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Milestone 9.3.2 — versioned business classification + keyword lineage
-- ---------------------------------------------------------------------------
ALTER TABLE brands
  ADD COLUMN IF NOT EXISTS business_classifier_version TEXT,
  ADD COLUMN IF NOT EXISTS classification_needs_recompute BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS classification_recomputed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS classification_recompute_reason TEXT,
  ADD COLUMN IF NOT EXISTS prospect_gate_class TEXT,
  ADD COLUMN IF NOT EXISTS prospect_gate_reason TEXT,
  ADD COLUMN IF NOT EXISTS own_brand_signal_score INTEGER;

CREATE INDEX IF NOT EXISTS idx_brands_classifier_version ON brands (business_classifier_version);
CREATE INDEX IF NOT EXISTS idx_brands_needs_recompute ON brands (classification_needs_recompute) WHERE classification_needs_recompute = true;

ALTER TABLE keywords
  ADD COLUMN IF NOT EXISTS product_archetype_id TEXT,
  ADD COLUMN IF NOT EXISTS product_family_id TEXT,
  ADD COLUMN IF NOT EXISTS product_archetype_fit_score INTEGER,
  ADD COLUMN IF NOT EXISTS keyword_pre_gate_class TEXT,
  ADD COLUMN IF NOT EXISTS prospect_serp_quality_score INTEGER,
  ADD COLUMN IF NOT EXISTS keyword_prospect_status TEXT,
  ADD COLUMN IF NOT EXISTS keyword_prospect_reason TEXT,
  ADD COLUMN IF NOT EXISTS keyword_prospect_checked_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_keywords_archetype ON keywords (product_archetype_id);
CREATE INDEX IF NOT EXISTS idx_keywords_prospect_status ON keywords (keyword_prospect_status);


-- ---------------------------------------------------------------------------
-- Milestone 9.3.4 — concept contrast potential
-- Separates "is this a good business" from "will our preview look impressive".
-- ---------------------------------------------------------------------------
ALTER TABLE coe_concept_candidates
  ADD COLUMN IF NOT EXISTS concept_contrast_potential INTEGER,
  ADD COLUMN IF NOT EXISTS concept_contrast_band TEXT,
  ADD COLUMN IF NOT EXISTS concept_contrast_confidence INTEGER,
  ADD COLUMN IF NOT EXISTS concept_contrast_ceiling TEXT,
  ADD COLUMN IF NOT EXISTS concept_contrast_evidence JSONB,
  ADD COLUMN IF NOT EXISTS concept_contrast_computed_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_concept_candidates_contrast
  ON coe_concept_candidates (concept_contrast_potential DESC);


