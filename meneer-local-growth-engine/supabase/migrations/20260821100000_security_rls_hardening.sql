-- Security Advisor: enable RLS on every public table that still lacks it.
-- Server jobs (service role) keep working — service role bypasses RLS.
-- LGE dashboard (authenticated) gets explicit policies where needed.

-- ---------------------------------------------------------------------------
-- 1. Enable RLS on all public tables missing it (catch-all)
-- ---------------------------------------------------------------------------
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT c.relname AS tablename
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relkind = 'r'
      AND NOT c.relrowsecurity
  LOOP
    EXECUTE format(
      'ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY',
      r.tablename
    );
  END LOOP;
END $$;

-- ---------------------------------------------------------------------------
-- 2. Authenticated dashboard access (same posture as milestone2 tables)
-- ---------------------------------------------------------------------------
DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'seo_keyword_metrics',
    'seo_serp_cache',
    'seo_domain_metrics_cache',
    'outreach_inbound_replies',
    'brand_settings',
    'inbound_submissions',
    'commerce_payments',
    'preview_share_links',
    'discovery_coverage',
    'acquisition_fit_runs',
    'city_acquisition_settings',
    'campaigns',
    'campaign_events',
    'campaign_reservations',
    'social_formats',
    'social_projects',
    'social_content_ideas',
    'social_posts',
    'social_post_insights',
    'social_engagement_targets',
    'social_engagement_suggestions',
    'social_settings'
  ]
  LOOP
    IF to_regclass(format('public.%I', t)) IS NULL THEN
      CONTINUE;
    END IF;

    EXECUTE format('DROP POLICY IF EXISTS lge_authenticated_all ON public.%I', t);
    EXECUTE format(
      'CREATE POLICY lge_authenticated_all ON public.%I FOR ALL TO authenticated USING (true) WITH CHECK (true)',
      t
    );
  END LOOP;
END $$;

-- ---------------------------------------------------------------------------
-- 3. Revoke direct anon access on public tables (defense in depth)
-- ---------------------------------------------------------------------------
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON SEQUENCES TO service_role;

COMMENT ON SCHEMA public IS
  'RLS hardened 2026-08-21: anon blocked on tables; authenticated via policies; service_role for server jobs.';
