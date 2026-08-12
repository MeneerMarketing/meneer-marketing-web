-- Milestone 6.1: City winner calibration (winner_confidence ≠ lead_score)
alter table public.businesses
  add column if not exists winner_confidence numeric,
  add column if not exists winner_reason text,
  add column if not exists winner_evidence jsonb default '{}'::jsonb,
  add column if not exists winner_path text;

alter table public.city_exclusivity
  add column if not exists winner_confidence numeric,
  add column if not exists winner_reason text,
  add column if not exists winner_evidence jsonb default '{}'::jsonb;
