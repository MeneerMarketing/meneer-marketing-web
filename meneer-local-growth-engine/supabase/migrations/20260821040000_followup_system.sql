-- Handmatig follow-up systeem (selectie + draft + approve + send, net als outreach)

alter table public.businesses
  add column if not exists selected_for_followup boolean not null default false,
  add column if not exists selected_for_followup_at timestamptz;

alter table public.outreach_messages
  add column if not exists message_kind text not null default 'initial'
    check (message_kind in ('initial', 'followup')),
  add column if not exists parent_message_id uuid references public.outreach_messages (id) on delete set null,
  add column if not exists followup_template text
    check (
      followup_template is null
      or followup_template in ('check_in', 'last_ping', 'custom')
    );

create index if not exists idx_outreach_messages_kind
  on public.outreach_messages (message_kind);

create index if not exists idx_outreach_messages_parent
  on public.outreach_messages (parent_message_id);

create index if not exists idx_businesses_followup_list
  on public.businesses (selected_for_followup)
  where selected_for_followup = true and is_demo = false;
