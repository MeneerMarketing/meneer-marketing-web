-- Inbox: reacties op info@meneermarketing.nl markeren als gelezen

alter table public.outreach_inbound_replies
  add column if not exists acknowledged_at timestamptz;

create unique index if not exists outreach_inbound_replies_provider_uidx
  on public.outreach_inbound_replies (provider_message_id)
  where provider_message_id is not null;

create index if not exists outreach_inbound_replies_unread_idx
  on public.outreach_inbound_replies (received_at desc)
  where acknowledged_at is null;
