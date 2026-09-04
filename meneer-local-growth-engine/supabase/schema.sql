-- Meneer Marketing Local Growth Engine
-- Milestone 1: foundation schema for verticals, cities, businesses, templates, previews.
-- Designed for city exclusivity: max one active exclusive client per (vertical + city).

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------------
-- verticals (e.g. pilates, physiotherapy, yoga)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS verticals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- cities
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  country_code TEXT NOT NULL DEFAULT 'NL',
  region TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- templates (design variants per vertical)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vertical_id UUID NOT NULL REFERENCES verticals (id) ON DELETE CASCADE,
  variant TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (vertical_id, variant)
);

-- ---------------------------------------------------------------------------
-- businesses (discovered / qualified local companies)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vertical_id UUID NOT NULL REFERENCES verticals (id) ON DELETE RESTRICT,
  city_id UUID NOT NULL REFERENCES cities (id) ON DELETE RESTRICT,
  slug TEXT NOT NULL UNIQUE,
  studio_name TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'Nederland',
  logo TEXT,
  primary_color TEXT,
  secondary_color TEXT,
  accent_color TEXT,
  tagline TEXT,
  description TEXT,
  primary_service TEXT,
  services JSONB NOT NULL DEFAULT '[]'::jsonb,
  phone TEXT,
  email TEXT,
  address TEXT,
  postal_code TEXT,
  booking_url TEXT,
  instagram_url TEXT,
  review_rating NUMERIC(2, 1),
  review_count INTEGER NOT NULL DEFAULT 0,
  team JSONB NOT NULL DEFAULT '[]'::jsonb,
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  memberships JSONB NOT NULL DEFAULT '[]'::jsonb,
  reviews JSONB NOT NULL DEFAULT '[]'::jsonb,
  faqs JSONB NOT NULL DEFAULT '[]'::jsonb,
  benefits JSONB NOT NULL DEFAULT '[]'::jsonb,
  primary_seo_keyword TEXT,
  secondary_seo_keywords TEXT[] NOT NULL DEFAULT '{}',
  opening_hours TEXT,
  founded_year INTEGER,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'qualified', 'previewed', 'contacted', 'won', 'lost', 'archived')),
  exclusive_status TEXT NOT NULL DEFAULT 'none'
    CHECK (exclusive_status IN ('none', 'reserved', 'active')),
  exclusive_started_at TIMESTAMPTZ,
  exclusive_ends_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_businesses_vertical_city
  ON businesses (vertical_id, city_id);

CREATE INDEX IF NOT EXISTS idx_businesses_status
  ON businesses (status);

-- At most one ACTIVE exclusive client per vertical + city
CREATE UNIQUE INDEX IF NOT EXISTS idx_businesses_exclusive_vertical_city
  ON businesses (vertical_id, city_id)
  WHERE exclusive_status = 'active';

-- ---------------------------------------------------------------------------
-- previews (generated concept websites)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS previews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses (id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES templates (id) ON DELETE RESTRICT,
  slug TEXT NOT NULL UNIQUE,
  template_variant TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'ready', 'archived')),
  exclusive_status TEXT NOT NULL DEFAULT 'none'
    CHECK (exclusive_status IN ('none', 'reserved', 'active')),
  published_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_previews_business ON previews (business_id);
CREATE INDEX IF NOT EXISTS idx_previews_status ON previews (status);

-- ---------------------------------------------------------------------------
-- Seed: Pilates vertical + Arnhem + three templates (optional demo seed)
-- ---------------------------------------------------------------------------
INSERT INTO verticals (slug, name, description)
VALUES (
  'pilates',
  'Pilates',
  'Eerste vertical van de Local Growth Engine'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO cities (slug, name, country_code, region)
VALUES ('arnhem', 'Arnhem', 'NL', 'Gelderland')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO templates (vertical_id, variant, name, description)
SELECT v.id, t.variant, t.name, t.description
FROM verticals v
CROSS JOIN (
  VALUES
    ('editorial', 'Editorial Pilates', 'Ultra premium editorial wellness / fashion'),
    ('reformer-minimal', 'Reformer Minimal', 'Architectural modern reformer-first'),
    ('soft-movement', 'Soft Movement', 'Warm minimalistisch organic wellness')
) AS t(variant, name, description)
WHERE v.slug = 'pilates'
ON CONFLICT (vertical_id, variant) DO NOTHING;
