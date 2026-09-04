-- Milestone 8.4: multi-prospect city outreach + unique template assignment

alter table businesses
  add column if not exists selected_for_outreach boolean not null default false,
  add column if not exists selected_for_outreach_at timestamptz,
  add column if not exists template_fit_scores jsonb not null default '{}'::jsonb,
  add column if not exists recommended_template text,
  add column if not exists recommended_template_score numeric,
  add column if not exists assigned_template text,
  add column if not exists template_assignment_score numeric,
  add column if not exists template_assignment_reason text,
  add column if not exists template_assignment_confidence numeric,
  add column if not exists template_assigned_at timestamptz;

create index if not exists businesses_selected_outreach_city_idx
  on businesses (vertical_id, city_id)
  where selected_for_outreach = true and is_demo = false;

create unique index if not exists businesses_active_template_per_city_idx
  on businesses (vertical_id, city_id, assigned_template)
  where selected_for_outreach = true
    and assigned_template is not null
    and is_demo = false;

create table if not exists city_acquisition_settings (
  id uuid primary key default gen_random_uuid(),
  vertical_id uuid not null references verticals(id) on delete cascade,
  city_id uuid not null references cities(id) on delete cascade,
  acquisition_status text not null default 'ACQUISITION_ALLOWED'
    check (acquisition_status in ('ACQUISITION_ALLOWED', 'MANUALLY_PROTECTED')),
  protection_reason text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (vertical_id, city_id)
);

create index if not exists city_acquisition_settings_city_idx
  on city_acquisition_settings (vertical_id, city_id);

alter table city_acquisition_settings enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'city_acquisition_settings' and policyname = 'city_acquisition_settings_service_role'
  ) then
    create policy city_acquisition_settings_service_role on city_acquisition_settings
      for all using (true) with check (true);
  end if;
end $$;

-- Apeldoorn: handmatige client protection (Hills Pilates), geen algemene city exclusivity
insert into city_acquisition_settings (vertical_id, city_id, acquisition_status, protection_reason, notes)
select v.id, c.id, 'MANUALLY_PROTECTED', 'existing_client', 'Hills Pilates klant — handmatige acquisition protection'
from verticals v
cross join cities c
where v.slug = 'pilates' and c.slug = 'apeldoorn'
on conflict (vertical_id, city_id) do update set
  acquisition_status = excluded.acquisition_status,
  protection_reason = excluded.protection_reason,
  notes = excluded.notes,
  updated_at = now();
