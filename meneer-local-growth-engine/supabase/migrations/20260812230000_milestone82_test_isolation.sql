-- Milestone 8.2: test event isolation + launch readiness

alter table public.campaign_events
  add column if not exists is_test boolean not null default false;

alter table public.campaign_events
  add column if not exists environment text not null default 'production';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'campaign_events_environment_check'
  ) then
    alter table public.campaign_events
      add constraint campaign_events_environment_check
      check (environment in ('development', 'production'));
  end if;
end $$;

create index if not exists campaign_events_campaign_real_idx
  on public.campaign_events (campaign_id, created_at desc)
  where is_test = false;

create index if not exists campaign_events_campaign_test_idx
  on public.campaign_events (campaign_id, created_at desc)
  where is_test = true;

alter table public.campaigns
  add column if not exists environment text not null default 'DEVELOPMENT';

alter table public.campaigns
  add column if not exists lifecycle_status text not null default 'DRAFT';

alter table public.campaigns
  add column if not exists real_event_count integer not null default 0;

alter table public.campaigns
  add column if not exists test_event_count integer not null default 0;

alter table public.campaigns
  add column if not exists last_real_activity_at timestamptz;

alter table public.campaigns
  add column if not exists launch_ready_at timestamptz;

alter table public.campaigns
  add column if not exists launch_blockers jsonb not null default '[]'::jsonb;

-- Pre-pilot: all existing events are QA
update public.campaign_events
set
  is_test = true,
  environment = 'development'
where coalesce(is_test, false) = false;

-- Force DEVELOPMENT + QA on all current campaigns
update public.campaigns
set
  environment = 'DEVELOPMENT',
  lifecycle_status = case
    when status = 'REVOKED' then 'REVOKED'
    else 'QA'
  end;
