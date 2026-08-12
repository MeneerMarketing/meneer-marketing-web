-- Milestone 7.1: Outreach copy hardening
alter table public.outreach_messages
  add column if not exists generation_method text default 'LEGACY_AI';

update public.brand_settings
set value = jsonb_set(
  jsonb_set(
    jsonb_set(
      jsonb_set(
        jsonb_set(
          coalesce(value, '{}'::jsonb),
          '{outreach_sender_mode}', '"BRAND"'
        ),
        '{sender_brand_name}', '"Meneer Marketing"'
      ),
      '{formal_sender_name}', '"Dhr. Ertan"'
    ),
    '{sender_name}', '"Meneer Marketing"'
  ),
  '{years_experience_phrase}', '"Ik doe dit werk inmiddels {{years}} jaar en help bedrijven met webdesign en online vindbaarheid."'
),
updated_at = now()
where key = 'meneer_marketing';
