-- Milestone 3: Live discovery schema + geo seed
-- Applied remotely as lge_milestone3_discovery (+ coe_operator_tables_enable_rls)

-- Business discovery / qualification fields
alter table public.businesses
  add column if not exists normalized_domain text,
  add column if not exists latitude double precision,
  add column if not exists longitude double precision,
  add column if not exists google_place_id text,
  add column if not exists google_cid text,
  add column if not exists google_category text,
  add column if not exists additional_categories jsonb default '[]'::jsonb,
  add column if not exists google_rating numeric,
  add column if not exists google_review_count integer,
  add column if not exists google_logo_url text,
  add column if not exists google_main_image_url text,
  add column if not exists google_claimed boolean,
  add column if not exists google_status text,
  add column if not exists source text default 'DEMO',
  add column if not exists discovered_at timestamptz,
  add column if not exists last_seen_at timestamptz,
  add column if not exists discovery_count integer default 0,
  add column if not exists qualification_status text default 'UNQUALIFIED',
  add column if not exists qualification_evidence jsonb default '{}'::jsonb,
  add column if not exists is_chain boolean default false,
  add column if not exists chain_name text,
  add column if not exists chain_location_count integer,
  add column if not exists lead_eligible boolean default true,
  add column if not exists preview_status text default 'NOT_GENERATED',
  add column if not exists raw_listing jsonb default '{}'::jsonb,
  add column if not exists postal_code text;

create unique index if not exists businesses_google_place_id_uidx
  on public.businesses (vertical_id, google_place_id)
  where google_place_id is not null;

create unique index if not exists businesses_google_cid_uidx
  on public.businesses (vertical_id, google_cid)
  where google_cid is not null;

create index if not exists businesses_normalized_domain_idx
  on public.businesses (normalized_domain);

alter table public.cities
  add column if not exists latitude double precision,
  add column if not exists longitude double precision,
  add column if not exists region_group text,
  add column if not exists is_active boolean default true;

create table if not exists public.discovery_runs (
  id uuid primary key default gen_random_uuid(),
  vertical_id uuid not null references public.verticals(id),
  scope text not null,
  mode text not null default 'TEST',
  status text not null default 'PENDING',
  config_snapshot jsonb not null default '{}'::jsonb,
  started_at timestamptz,
  completed_at timestamptz,
  api_calls integer not null default 0,
  api_cost numeric not null default 0,
  businesses_found integer not null default 0,
  new_businesses integer not null default 0,
  duplicates integer not null default 0,
  qualified integer not null default 0,
  excluded integer not null default 0,
  errors jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.discovery_occurrences (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  discovery_run_id uuid references public.discovery_runs(id) on delete set null,
  vertical_id uuid not null references public.verticals(id),
  query text not null,
  source text not null default 'DATAFORSEO_BUSINESS_LISTINGS',
  city_name text,
  country_code text,
  raw_signal jsonb not null default '{}'::jsonb,
  found_at timestamptz not null default now()
);

create index if not exists discovery_occurrences_business_idx
  on public.discovery_occurrences (business_id);

alter table public.discovery_runs enable row level security;
alter table public.discovery_occurrences enable row level security;

do $$ begin
  create policy "authenticated_select_discovery_runs"
    on public.discovery_runs for select to authenticated using (true);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "authenticated_select_discovery_occurrences"
    on public.discovery_occurrences for select to authenticated using (true);
exception when duplicate_object then null;
end $$;

-- COE leftover tables: enable RLS (service key bypasses; anon denied)
alter table if exists public.engine_settings enable row level security;
alter table if exists public.operator_activity_log enable row level security;
alter table if exists public.operator_ai_feedback enable row level security;
alter table if exists public.operator_brand_tags enable row level security;
alter table if exists public.operator_notes enable row level security;
alter table if exists public.operator_opportunity_tags enable row level security;
alter table if exists public.operator_tags enable row level security;
