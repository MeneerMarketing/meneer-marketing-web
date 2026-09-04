-- Milestone 5: lead scoring + city ranking (applied remotely)
alter table public.businesses
  add column if not exists lead_score numeric,
  add column if not exists score_components jsonb default '{}'::jsonb,
  add column if not exists city_rank integer,
  add column if not exists primary_candidate boolean not null default false,
  add column if not exists ranking_updated_at timestamptz,
  add column if not exists website_quality_score numeric,
  add column if not exists website_opportunity_score numeric;

create unique index if not exists businesses_one_primary_per_city_vertical
  on public.businesses (vertical_id, city_id)
  where primary_candidate = true;

create index if not exists businesses_lead_score_idx on public.businesses (lead_score desc nulls last);
create index if not exists businesses_city_rank_idx on public.businesses (city_id, city_rank);

alter table public.city_exclusivity drop constraint if exists city_exclusivity_status_check;
alter table public.city_exclusivity
  add constraint city_exclusivity_status_check
  check (status in ('AVAILABLE','PRIMARY_CANDIDATE','RESERVED','EXCLUSIVE','RELEASED'));
