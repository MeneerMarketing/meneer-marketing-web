-- Milestone 8.3 — Website Transformation Eligibility
-- Extra qualification layer on top of discovery/website/SEO/winner scoring.
-- Non-destructive: only additive columns, tables and indexes.

-- ============================================================
-- 1. Prospect classification + transformation scoring
-- ============================================================

alter table businesses
  add column if not exists prospect_type text not null default 'UNKNOWN',
  add column if not exists prospect_type_reason text,
  add column if not exists website_transformation_score numeric,
  add column if not exists transformation_components jsonb not null default '{}'::jsonb,
  add column if not exists preview_eligible boolean not null default false,
  add column if not exists preview_eligibility_reason text,
  add column if not exists transformation_city_rank integer,
  add column if not exists transformation_rank_updated_at timestamptz,
  add column if not exists acquisition_fit_updated_at timestamptz,
  add column if not exists acquisition_fit_version text;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'businesses_prospect_type_check'
  ) then
    alter table businesses
      add constraint businesses_prospect_type_check
      check (prospect_type in (
        'WEBSITE_TRANSFORMATION',
        'GROWTH_ONLY',
        'WEAK_BUSINESS',
        'NOT_ELIGIBLE',
        'UNKNOWN'
      ));
  end if;
end $$;

-- ============================================================
-- 2. Deterministic sub-scores used by the transformation score
-- ============================================================

alter table businesses
  add column if not exists brand_asset_usability_score numeric,
  add column if not exists booking_opportunity_score numeric,
  add column if not exists website_modernity_score numeric,
  add column if not exists website_signals jsonb not null default '{}'::jsonb;

-- ============================================================
-- 3. Claude visual transformation judge
-- ============================================================

alter table businesses
  add column if not exists visual_quality_score numeric,
  add column if not exists visual_modernity_score numeric,
  add column if not exists visual_mobile_score numeric,
  add column if not exists brand_potential_score numeric,
  add column if not exists visual_booking_ux_score numeric,
  add column if not exists business_presentation_gap_score numeric,
  add column if not exists redesign_impact_score numeric,
  add column if not exists visual_transformation_fit text,
  add column if not exists visual_assessment jsonb not null default '{}'::jsonb,
  add column if not exists visual_assessment_confidence numeric,
  add column if not exists visual_assessment_model text,
  add column if not exists visual_assessment_source text,
  add column if not exists visual_assessment_cost numeric,
  add column if not exists visual_assessed_at timestamptz;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'businesses_visual_fit_check'
  ) then
    alter table businesses
      add constraint businesses_visual_fit_check
      check (
        visual_transformation_fit is null
        or visual_transformation_fit in ('VERY_HIGH', 'HIGH', 'MEDIUM', 'LOW')
      );
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'businesses_visual_source_check'
  ) then
    alter table businesses
      add constraint businesses_visual_source_check
      check (
        visual_assessment_source is null
        or visual_assessment_source in ('CLAUDE_VISION', 'DETERMINISTIC_FALLBACK', 'CACHED')
      );
  end if;
end $$;

-- ============================================================
-- 4. Screenshots
-- ============================================================

alter table businesses
  add column if not exists screenshot_desktop_url text,
  add column if not exists screenshot_mobile_url text,
  add column if not exists screenshot_metadata jsonb not null default '{}'::jsonb,
  add column if not exists screenshots_captured_at timestamptz;

-- ============================================================
-- 5. Discovery coverage / saturation
-- ============================================================

alter table discovery_runs
  add column if not exists coverage_summary jsonb not null default '{}'::jsonb;

create table if not exists discovery_coverage (
  id uuid primary key default gen_random_uuid(),
  vertical_id uuid not null references verticals(id) on delete cascade,
  city_id uuid not null references cities(id) on delete cascade,
  discovery_run_id uuid references discovery_runs(id) on delete set null,
  queries jsonb not null default '[]'::jsonb,
  queries_run integer not null default 0,
  total_results integer not null default 0,
  unique_businesses integer not null default 0,
  duplicates integer not null default 0,
  relevant_businesses integer not null default 0,
  eligible_businesses integer not null default 0,
  new_businesses integer not null default 0,
  incremental_unique_by_query jsonb not null default '[]'::jsonb,
  coverage_confidence numeric not null default 0,
  coverage_label text not null default 'UNKNOWN',
  saturated boolean not null default false,
  api_cost numeric not null default 0,
  notes text,
  created_at timestamptz not null default now()
);

alter table discovery_coverage
  add column if not exists relevant_businesses integer not null default 0;

alter table businesses
  add column if not exists transformation_primary_candidate boolean not null default false,
  add column if not exists transformation_winner_confidence numeric,
  add column if not exists transformation_winner_reason text;

create index if not exists businesses_transformation_primary_idx
  on businesses (vertical_id, city_id) where transformation_primary_candidate;

create index if not exists discovery_coverage_city_idx
  on discovery_coverage (vertical_id, city_id, created_at desc);

-- ============================================================
-- 6. Acquisition fit runs (cost + audit trail)
-- ============================================================

create table if not exists acquisition_fit_runs (
  id uuid primary key default gen_random_uuid(),
  vertical_id uuid references verticals(id) on delete set null,
  city_id uuid references cities(id) on delete set null,
  scope text not null default 'CITY',
  status text not null default 'RUNNING',
  businesses_evaluated integer not null default 0,
  website_scans integer not null default 0,
  screenshots_captured integer not null default 0,
  visual_analyses integer not null default 0,
  visual_fallbacks integer not null default 0,
  cache_hits integer not null default 0,
  anthropic_cost numeric not null default 0,
  dataforseo_cost numeric not null default 0,
  classification_totals jsonb not null default '{}'::jsonb,
  thresholds_snapshot jsonb not null default '{}'::jsonb,
  errors jsonb not null default '[]'::jsonb,
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists acquisition_fit_runs_city_idx
  on acquisition_fit_runs (city_id, started_at desc);

-- ============================================================
-- 7. Indexes for dashboard filtering / ranking
-- ============================================================

create index if not exists businesses_prospect_type_idx
  on businesses (vertical_id, city_id, prospect_type);

create index if not exists businesses_transformation_score_idx
  on businesses (website_transformation_score desc nulls last);

create index if not exists businesses_transformation_rank_idx
  on businesses (vertical_id, city_id, transformation_city_rank);

create index if not exists businesses_preview_eligible_idx
  on businesses (preview_eligible) where preview_eligible = true;

-- ============================================================
-- 8. RLS — service role only, same posture as other LGE tables
-- ============================================================

alter table discovery_coverage enable row level security;
alter table acquisition_fit_runs enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'discovery_coverage' and policyname = 'discovery_coverage_service_role'
  ) then
    create policy discovery_coverage_service_role on discovery_coverage
      for all to service_role using (true) with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where tablename = 'acquisition_fit_runs' and policyname = 'acquisition_fit_runs_service_role'
  ) then
    create policy acquisition_fit_runs_service_role on acquisition_fit_runs
      for all to service_role using (true) with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where tablename = 'discovery_coverage' and policyname = 'discovery_coverage_read_authenticated'
  ) then
    create policy discovery_coverage_read_authenticated on discovery_coverage
      for select to authenticated using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where tablename = 'acquisition_fit_runs' and policyname = 'acquisition_fit_runs_read_authenticated'
  ) then
    create policy acquisition_fit_runs_read_authenticated on acquisition_fit_runs
      for select to authenticated using (true);
  end if;
end $$;

-- ============================================================
-- 9. Screenshot storage bucket
-- ============================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'lge-screenshots',
  'lge-screenshots',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and policyname = 'lge_screenshots_public_read'
  ) then
    create policy lge_screenshots_public_read on storage.objects
      for select using (bucket_id = 'lge-screenshots');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and policyname = 'lge_screenshots_service_write'
  ) then
    create policy lge_screenshots_service_write on storage.objects
      for all to service_role
      using (bucket_id = 'lge-screenshots')
      with check (bucket_id = 'lge-screenshots');
  end if;
end $$;

comment on column businesses.prospect_type is
  'M8.3 acquisition fit classification: WEBSITE_TRANSFORMATION | GROWTH_ONLY | WEAK_BUSINESS | NOT_ELIGIBLE | UNKNOWN';
comment on column businesses.website_transformation_score is
  'M8.3 explainable 0-100 score: how attractive is this business for the website redesign proposition';
comment on column businesses.transformation_components is
  'M8.3 per-component breakdown incl. weights, raw values and contributions';
