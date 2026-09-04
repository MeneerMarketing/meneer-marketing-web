-- Meneer Marketing Social Engine — initial schema

create extension if not exists "pgcrypto";

-- Content formats with planner weights
create table if not exists social_formats (
  id text primary key,
  name text not null,
  description text not null,
  media_type text not null check (media_type in ('carousel', 'reel', 'story', 'single')),
  tier smallint not null default 3 check (tier between 1 and 3),
  weight_percent numeric(5,2) not null default 10,
  monthly_target smallint not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

insert into social_formats (id, name, description, media_type, tier, weight_percent, monthly_target) values
  ('DE_REKENING', 'De Rekening', 'Fout op een echte pagina, uitgedrukt in euros', 'carousel', 1, 22, 4),
  ('MENEER_FIXT', 'Meneer Fixt', 'Een element herbouwd, before en after', 'reel', 1, 20, 4),
  ('MENEER_ZEGT', 'Meneer Zegt', 'Contraire mening over marketing', 'carousel', 1, 18, 4),
  ('MENEER_METER', 'Meneer Meter', 'Sitescore met reveal aan het eind', 'carousel', 2, 12, 1),
  ('MENEER_ONTLEEDT', 'Meneer Ontleedt', 'Teardown van een groot merk', 'carousel', 2, 8, 1),
  ('DE_OFFERTE', 'De Offerte', 'Geanonimiseerde bureau-offerte ontleed', 'carousel', 3, 6, 1),
  ('ZESTIG_MINUTEN', 'Zestig Minuten', 'Timed build van leeg scherm naar live', 'reel', 3, 5, 1),
  ('BUREAU_BINGO', 'Bureau Bingo', 'Buzzwordhumor met zelfspot', 'carousel', 3, 4, 1),
  ('CASE_BUILD', 'Case', 'Opgeleverd werk met resultaat', 'carousel', 3, 3, 1),
  ('BUILD_LOG', 'Build in Public', 'Werk in uitvoering', 'story', 3, 1, 0),
  ('COMMERCIAL', 'Direct aanbod', 'Expliciete CTA', 'carousel', 3, 1, 0)
on conflict (id) do nothing;

-- Real projects as content source
create table if not exists social_projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  client_name text not null,
  industry text,
  services text[] not null default '{}',
  before_url text,
  after_url text,
  before_asset_path text,
  after_asset_path text,
  result_metric text,
  result_hint text,
  story_challenge text,
  story_move text,
  story_result text,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Content ideas (planner output)
create table if not exists social_content_ideas (
  id uuid primary key default gen_random_uuid(),
  format_id text not null references social_formats(id),
  hook text not null,
  angle text not null,
  project_id uuid references social_projects(id),
  planned_for date,
  status text not null default 'draft'
    check (status in ('draft', 'approved', 'rejected', 'used')),
  scores jsonb,
  created_at timestamptz not null default now()
);

-- Generated posts (writer output + approval queue)
create table if not exists social_posts (
  id uuid primary key default gen_random_uuid(),
  idea_id uuid references social_content_ideas(id),
  format_id text not null references social_formats(id),
  status text not null default 'awaiting_approval'
    check (status in (
      'draft', 'awaiting_approval', 'approved', 'scheduled',
      'published', 'rejected', 'archived'
    )),
  caption text not null,
  hashtags text[] not null default '{}',
  template_data jsonb not null default '{}',
  slides jsonb,
  reel_script jsonb,
  scheduled_at timestamptz,
  published_at timestamptz,
  instagram_media_id text,
  critic_scores jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Post performance (insights sync)
create table if not exists social_post_insights (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references social_posts(id) on delete cascade,
  captured_at timestamptz not null default now(),
  reach integer not null default 0,
  likes integer not null default 0,
  comments integer not null default 0,
  shares integer not null default 0,
  saves integer not null default 0,
  profile_visits integer not null default 0,
  website_clicks integer not null default 0
);

-- Engagement targets (outbound radar)
create table if not exists social_engagement_targets (
  id uuid primary key default gen_random_uuid(),
  business_name text not null,
  instagram_handle text not null,
  industry text,
  notes text,
  priority integer not null default 5 check (priority between 1 and 10),
  is_active boolean not null default true,
  last_engaged_at timestamptz,
  created_at timestamptz not null default now()
);

-- Suggested comments (AI draft, human posts)
create table if not exists social_engagement_suggestions (
  id uuid primary key default gen_random_uuid(),
  target_id uuid references social_engagement_targets(id),
  post_context text not null,
  suggested_comment text not null,
  status text not null default 'pending'
    check (status in ('pending', 'used', 'dismissed')),
  created_at timestamptz not null default now()
);

-- Brand settings (brutality scale, focus service, etc.)
create table if not exists social_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

insert into social_settings (key, value) values
  ('brutality_scale', '7'),
  ('monthly_focus_service', '"websites from scratch"'),
  ('default_posting_times', '["11:30", "17:00"]')
on conflict (key) do nothing;

-- Seed projects (public cases)
insert into social_projects (
  slug, client_name, industry, services, after_url,
  result_metric, result_hint, story_challenge, story_move, story_result, is_public
) values
(
  'skincomplete', 'SkinComplete', 'B2B beauty / LED',
  array['Shopify', 'B2B-portaal', 'SEO', 'Google Ads', 'Meta Ads', 'UGC'],
  'https://skincomplete.eu',
  '24/7', 'salons bestellen zelf via het portaal',
  'Salons bestelden via mail en Excel. Vindbaarheid en ads moesten meewerken zonder budget te verbranden.',
  'Custom B2B-portaal in Shopify. SEO eerst, e-mail erna. Ads pas op een fundament dat al verkocht.',
  'Salons bestellen zelfstandig. Organisch verkeer droeg omzet voordat ads opschalen.',
  true
),
(
  'bestrest', 'BestRest', 'E-commerce matrassen',
  array['Shopify', 'SEO', 'Google Ads', 'Meta Ads', 'E-mail'],
  'https://bestrest.nl',
  'Custom shop', 'Shopify from scratch tegen grote spelers',
  'Grote spelers domineren met budget. Standaard thema hield BestRest niet scherp genoeg.',
  'Custom Shopify from scratch. SEO, e-mail en ads per assortimentsstuk.',
  'Shop en marketinglijn die meetbaar is en klaar om op te schalen.',
  true
),
(
  'hills-pilates', 'Hills Pilates', 'Pilates studio',
  array['Website', 'E-mail', 'App', 'Boekingen'],
  'https://hillsstudio.nl',
  'Boekingsapp', 'website en mail in dezelfde lijn',
  'Lessen, aanmeldingen en communicatie liepen versnipperd.',
  'Custom website, automatische mails, app met agenda en boekingen.',
  'Klanten boeken via de app. Team ziet agenda op één plek.',
  true
)
on conflict (slug) do nothing;

create index if not exists idx_social_posts_status on social_posts(status);
create index if not exists idx_social_posts_scheduled on social_posts(scheduled_at);
create index if not exists idx_social_ideas_planned on social_content_ideas(planned_for);

-- RLS (applied on existing projects via LGE migration 20260821100000_security_rls_hardening.sql)
alter table public.social_formats enable row level security;
alter table public.social_projects enable row level security;
alter table public.social_content_ideas enable row level security;
alter table public.social_posts enable row level security;
alter table public.social_post_insights enable row level security;
alter table public.social_engagement_targets enable row level security;
alter table public.social_engagement_suggestions enable row level security;
alter table public.social_settings enable row level security;

do $$
declare
  t text;
begin
  foreach t in array array[
    'social_formats',
    'social_projects',
    'social_content_ideas',
    'social_posts',
    'social_post_insights',
    'social_engagement_targets',
    'social_engagement_suggestions',
    'social_settings'
  ]
  loop
    execute format('drop policy if exists lge_authenticated_all on public.%I', t);
    execute format(
      'create policy lge_authenticated_all on public.%I for all to authenticated using (true) with check (true)',
      t
    );
  end loop;
end $$;
