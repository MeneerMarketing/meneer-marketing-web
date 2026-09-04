-- Milestone 7: Outreach Engine V1
alter table public.outreach_messages drop constraint if exists outreach_messages_status_check;
alter table public.outreach_messages
  add constraint outreach_messages_status_check
  check (status in (
    'DRAFT','REVIEW_REQUIRED','APPROVED','SENDING','SENT','DELIVERED',
    'OPENED','CLICKED','REPLIED','BOUNCED','FAILED','SUPPRESSED',
    'READY','SCHEDULED','UNSUBSCRIBED'
  ));

alter table public.outreach_messages
  add column if not exists body_text text,
  add column if not exists body_html text,
  add column if not exists version integer not null default 1,
  add column if not exists previous_version_id uuid references public.outreach_messages(id),
  add column if not exists generated_at timestamptz,
  add column if not exists approved_at timestamptz,
  add column if not exists personalization_metadata jsonb default '{}'::jsonb,
  add column if not exists generation_cost numeric default 0,
  add column if not exists generation_model text,
  add column if not exists send_lock_token text,
  add column if not exists send_locked_at timestamptz,
  add column if not exists is_test boolean not null default false,
  add column if not exists outreach_basis text,
  add column if not exists facts_used jsonb default '[]'::jsonb,
  add column if not exists facts_omitted jsonb default '[]'::jsonb;

update public.outreach_messages set body_text = body where body_text is null and body is not null;
update public.outreach_messages set body_html = body where body_html is null and body is not null;

alter table public.email_suppressions
  add column if not exists business_id uuid references public.businesses(id),
  add column if not exists contact_id uuid references public.contacts(id),
  add column if not exists source text,
  add column if not exists unsubscribed_at timestamptz;

alter table public.email_events
  add column if not exists provider_event_id text,
  add column if not exists provider text default 'resend';

create unique index if not exists email_events_provider_event_uidx
  on public.email_events (provider, provider_event_id)
  where provider_event_id is not null;

create table if not exists public.outreach_inbound_replies (
  id uuid primary key default gen_random_uuid(),
  outreach_message_id uuid references public.outreach_messages(id),
  business_id uuid references public.businesses(id),
  contact_id uuid references public.contacts(id),
  from_email text,
  subject text,
  body_text text,
  provider_message_id text,
  raw jsonb default '{}'::jsonb,
  received_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.brand_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.brand_settings (key, value)
values (
  'meneer_marketing',
  '{
    "sender_name": "Yasmin",
    "brand_name": "Meneer Marketing",
    "tagline": "Webdesign & online vindbaarheid",
    "website": "https://meneermarketing.nl",
    "website_label": "meneermarketing.nl",
    "kvk": "",
    "from_email": "",
    "reply_to": "",
    "years_experience": 12,
    "allowed_sender_domains": ["meneermarketing.nl"],
    "preview_base_url": "",
    "preview_allowed_hosts": ["meneermarketing.nl", "localhost"]
  }'::jsonb
)
on conflict (key) do nothing;
