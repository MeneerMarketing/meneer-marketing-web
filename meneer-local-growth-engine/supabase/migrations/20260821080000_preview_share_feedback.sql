-- Preview share links (short URL, 30-day expiry, optional password)
-- Preview feedback events (via campaign_events PREVIEW_FEEDBACK_*)

create table if not exists public.preview_share_links (
  id uuid primary key default gen_random_uuid(),
  share_token text not null unique,
  business_id uuid not null references public.businesses(id) on delete cascade,
  preview_id uuid references public.previews(id) on delete set null,
  campaign_id uuid references public.campaigns(id) on delete set null,
  password_hash text,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  access_count integer not null default 0,
  last_accessed_at timestamptz,
  label text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists preview_share_links_business_idx
  on public.preview_share_links (business_id, created_at desc);

create index if not exists preview_share_links_active_idx
  on public.preview_share_links (share_token)
  where revoked_at is null;

alter table public.preview_share_links enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'preview_share_links' and policyname = 'preview_share_links_service_role'
  ) then
    create policy preview_share_links_service_role on public.preview_share_links
      for all using (true) with check (true);
  end if;
end $$;
