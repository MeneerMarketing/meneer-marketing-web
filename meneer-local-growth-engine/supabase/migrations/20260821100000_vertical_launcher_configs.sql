-- Vertical Launcher Wizard: DB-backed pack configs (blueprint = skin-clinics)

CREATE TABLE IF NOT EXISTS vertical_launcher_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  blueprint_slug text NOT NULL DEFAULT 'skin-clinics',
  status text NOT NULL DEFAULT 'ACTIVE'
    CHECK (status IN ('DRAFT', 'ACTIVE', 'ARCHIVED')),
  discovery_terms jsonb NOT NULL DEFAULT '[]'::jsonb,
  discovery_intents jsonb,
  category_hints jsonb NOT NULL DEFAULT '[]'::jsonb,
  negative_name_patterns jsonb NOT NULL DEFAULT '[]'::jsonb,
  landing_path text NOT NULL,
  inbound_source text NOT NULL,
  landing_live boolean NOT NULL DEFAULT false,
  template_variants jsonb NOT NULL DEFAULT '[]'::jsonb,
  pilot_city jsonb NOT NULL,
  business_label text NOT NULL DEFAULT 'studio',
  business_noun text NOT NULL DEFAULT 'studio',
  edition_label text NOT NULL DEFAULT 'Studio Edition',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vertical_launcher_configs_status
  ON vertical_launcher_configs (status);

CREATE INDEX IF NOT EXISTS idx_vertical_launcher_configs_blueprint
  ON vertical_launcher_configs (blueprint_slug);

COMMENT ON TABLE vertical_launcher_configs IS
  'Wizard-provisioned vertical packs. Runtime merges with code registry via dynamicVerticalPack cache.';

ALTER TABLE public.vertical_launcher_configs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS lge_authenticated_all ON public.vertical_launcher_configs;
CREATE POLICY lge_authenticated_all ON public.vertical_launcher_configs
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
