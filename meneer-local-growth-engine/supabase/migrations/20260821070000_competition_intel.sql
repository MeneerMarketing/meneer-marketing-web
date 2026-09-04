-- Domain authority cache for competition intel (DataForSEO backlinks rank → DR-like 0-100)
create table if not exists public.seo_domain_metrics_cache (
  domain text primary key,
  backlinks_rank integer,
  domain_rating integer,
  backlinks_total integer,
  fetched_at timestamptz not null default now()
);

create index if not exists idx_seo_domain_metrics_fetched
  on public.seo_domain_metrics_cache (fetched_at desc);

alter table public.seo_domain_metrics_cache enable row level security;
