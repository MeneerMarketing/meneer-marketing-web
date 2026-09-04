-- Milestone 4: preview generation snapshots (applied remotely)
alter table public.businesses
  add column if not exists brand_profile jsonb default '{}'::jsonb,
  add column if not exists website_intelligence jsonb default '{}'::jsonb,
  add column if not exists template_selection_confidence numeric,
  add column if not exists template_selection_reasoning text;

alter table public.previews
  add column if not exists brand_profile_snapshot jsonb default '{}'::jsonb,
  add column if not exists content_snapshot jsonb default '{}'::jsonb,
  add column if not exists services_snapshot jsonb default '[]'::jsonb,
  add column if not exists images_snapshot jsonb default '[]'::jsonb,
  add column if not exists seo_snapshot jsonb default '{}'::jsonb,
  add column if not exists generation_metadata jsonb default '{}'::jsonb,
  add column if not exists template_selection_confidence numeric,
  add column if not exists template_selection_reasoning text,
  add column if not exists generated_at timestamptz,
  add column if not exists error_details text,
  add column if not exists studio_snapshot jsonb default '{}'::jsonb;

create unique index if not exists previews_slug_uidx on public.previews (slug);

alter table public.seo_opportunities
  add column if not exists seo_title text,
  add column if not exists meta_description text,
  add column if not exists h1_recommendation text;

alter table public.previews drop constraint if exists previews_status_check;
alter table public.previews add constraint previews_status_check
  check (status in ('DRAFT','GENERATING','READY','APPROVED','ARCHIVED','FAILED','ANALYZING'));
