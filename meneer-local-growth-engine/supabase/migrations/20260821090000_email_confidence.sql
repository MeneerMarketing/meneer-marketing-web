-- Email confidence scoring (post-scrape deliverability signals)
alter table public.contacts
  add column if not exists email_confidence integer,
  add column if not exists email_confidence_level text
    check (email_confidence_level in ('skip', 'low', 'medium', 'high')),
  add column if not exists email_confidence_reasons jsonb default '[]'::jsonb;

alter table public.businesses
  add column if not exists email_confidence integer,
  add column if not exists email_confidence_level text
    check (email_confidence_level in ('skip', 'low', 'medium', 'high'));

create index if not exists idx_contacts_email_confidence
  on public.contacts (business_id, email_confidence_level);
