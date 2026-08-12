-- Milestone 6: Local SEO opportunity engine (applied remotely)
create table if not exists public.seo_keyword_metrics (
  id uuid primary key default gen_random_uuid(),
  vertical_slug text not null,
  city_slug text not null,
  keyword text not null,
  language_code text not null default 'nl',
  location_code integer,
  search_volume integer,
  competition text,
  competition_index numeric,
  cpc numeric,
  low_top_of_page_bid numeric,
  high_top_of_page_bid numeric,
  monthly_searches jsonb default '[]'::jsonb,
  keyword_cluster text,
  raw jsonb default '{}'::jsonb,
  fetched_at timestamptz not null default now(),
  unique (vertical_slug, city_slug, keyword)
);

create table if not exists public.seo_serp_cache (
  id uuid primary key default gen_random_uuid(),
  vertical_slug text not null,
  city_slug text not null,
  keyword text not null,
  location_code integer,
  language_code text not null default 'nl',
  items jsonb default '[]'::jsonb,
  local_pack jsonb default '[]'::jsonb,
  cost numeric default 0,
  raw jsonb default '{}'::jsonb,
  fetched_at timestamptz not null default now(),
  unique (vertical_slug, city_slug, keyword)
);

alter table public.seo_opportunities
  add column if not exists primary_search_volume integer,
  add column if not exists total_clustered_demand integer,
  add column if not exists current_rank integer,
  add column if not exists current_ranking_url text,
  add column if not exists visibility_score numeric,
  add column if not exists seo_readiness_score numeric,
  add column if not exists seo_opportunity_score numeric,
  add column if not exists opportunity_components jsonb default '{}'::jsonb,
  add column if not exists keyword_metrics jsonb default '[]'::jsonb,
  add column if not exists competitor_snapshot jsonb default '[]'::jsonb,
  add column if not exists analyzed_at timestamptz,
  add column if not exists ranking_version text default 'provisional';

alter table public.businesses
  add column if not exists seo_opportunity_score numeric,
  add column if not exists seo_visibility_score numeric,
  add column if not exists seo_readiness_score numeric,
  add column if not exists ranking_version text default 'provisional',
  add column if not exists primary_candidate_source text;

alter table public.seo_opportunities drop constraint if exists seo_opportunities_status_check;
alter table public.seo_opportunities
  add constraint seo_opportunities_status_check
  check (status in ('NOT_ANALYZED','ANALYZING','LOW','MEDIUM','HIGH','VERY_HIGH','FAILED'));
