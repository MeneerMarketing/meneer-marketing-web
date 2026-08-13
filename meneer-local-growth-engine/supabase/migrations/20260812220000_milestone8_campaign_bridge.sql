-- Milestone 8: Preview-to-offer conversion bridge (campaigns)

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  campaign_ref text not null unique,
  business_id uuid not null references public.businesses(id) on delete cascade,
  preview_id uuid references public.previews(id) on delete set null,
  outreach_message_id uuid references public.outreach_messages(id) on delete set null,
  vertical_id uuid references public.verticals(id) on delete set null,
  city_id uuid references public.cities(id) on delete set null,
  status text not null default 'ACTIVE'
    check (status in ('ACTIVE', 'REVOKED', 'EXPIRED', 'CONVERTED')),
  conversion_status text not null default 'NONE'
    check (conversion_status in (
      'NONE', 'ENGAGED', 'INTERESTED', 'CONTACT_STARTED',
      'INBOUND_LEAD', 'PROPOSAL', 'WON', 'LOST'
    )),
  engagement_level text not null default 'COLD'
    check (engagement_level in ('COLD', 'OPENED', 'ENGAGED', 'HIGH_INTENT', 'INBOUND')),
  recommended_package text
    check (recommended_package is null or recommended_package in (
      'STUDIO_EDITION', 'LOCAL_GROWTH', 'GROWTH_PARTNER', 'SIGNATURE_CUSTOM'
    )),
  recommendation_reason text,
  selected_package text
    check (selected_package is null or selected_package in (
      'STUDIO_EDITION', 'LOCAL_GROWTH', 'GROWTH_PARTNER', 'SIGNATURE_CUSTOM'
    )),
  selected_booking_option text
    check (selected_booking_option is null or selected_booking_option in (
      'EXISTING_BOOKING', 'BRANDED_APP', 'CUSTOM_FUNNEL', 'CUSTOM_APP'
    )),
  city_status_snapshot text,
  first_seen_at timestamptz,
  last_seen_at timestamptz,
  event_count integer not null default 0,
  reservation_expires_at timestamptz,
  expires_at timestamptz,
  revoked_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_activity_at timestamptz not null default now()
);

create index if not exists campaigns_business_id_idx on public.campaigns (business_id);
create index if not exists campaigns_status_idx on public.campaigns (status);
create index if not exists campaigns_last_activity_idx on public.campaigns (last_activity_at desc);
create index if not exists campaigns_outreach_message_id_idx on public.campaigns (outreach_message_id);

create table if not exists public.campaign_events (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  event_type text not null,
  idempotency_key text,
  metadata jsonb not null default '{}'::jsonb,
  source text not null default 'public_api',
  created_at timestamptz not null default now()
);

create unique index if not exists campaign_events_idempotency_uidx
  on public.campaign_events (campaign_id, idempotency_key)
  where idempotency_key is not null;

create index if not exists campaign_events_campaign_id_idx
  on public.campaign_events (campaign_id, created_at desc);

create index if not exists campaign_events_type_idx
  on public.campaign_events (event_type);

create table if not exists public.campaign_reservations (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  city_id uuid not null references public.cities(id) on delete cascade,
  vertical_id uuid not null references public.verticals(id) on delete cascade,
  business_id uuid not null references public.businesses(id) on delete cascade,
  status text not null default 'ACTIVE'
    check (status in ('ACTIVE', 'EXPIRED', 'RELEASED', 'CONVERTED')),
  starts_at timestamptz not null default now(),
  expires_at timestamptz not null,
  released_at timestamptz,
  release_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists campaign_reservations_active_idx
  on public.campaign_reservations (city_id, vertical_id, status)
  where status = 'ACTIVE';

create index if not exists campaign_reservations_expires_idx
  on public.campaign_reservations (expires_at)
  where status = 'ACTIVE';

alter table public.businesses
  add column if not exists conversion_status text default 'NONE',
  add column if not exists engagement_level text default 'COLD',
  add column if not exists recommended_package text,
  add column if not exists active_campaign_id uuid;

-- RLS: service role only for campaign tables (dashboard uses admin client)
alter table public.campaigns enable row level security;
alter table public.campaign_events enable row level security;
alter table public.campaign_reservations enable row level security;
