-- Discovery Launcher (M8.3): pipeline phases, launcher mode, city link

alter table discovery_runs
  add column if not exists city_id uuid references cities(id) on delete set null,
  add column if not exists launcher_mode text,
  add column if not exists pipeline_phase text,
  add column if not exists rerun_action text;

create index if not exists discovery_runs_city_created_idx
  on discovery_runs (vertical_id, city_id, created_at desc);
