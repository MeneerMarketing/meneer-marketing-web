-- Local Growth Engine — Milestone 2
-- Extends Milestone 1 foundation. Does not touch Commerce Opportunity Engine tables.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------------
-- Core tables (idempotent from M1)
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

CREATE TABLE IF NOT EXISTS cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  country_code TEXT NOT NULL DEFAULT 'NL',
  region TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vertical_id UUID NOT NULL REFERENCES verticals (id) ON DELETE CASCADE,
  variant TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (vertical_id, variant)
);

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
  exclusive_status TEXT NOT NULL DEFAULT 'none'
    CHECK (exclusive_status IN ('none', 'reserved', 'active')),
  exclusive_started_at TIMESTAMPTZ,
  exclusive_ends_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Milestone 2 business columns
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS website_url TEXT;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS domain TEXT;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS qualification_score INTEGER;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS is_demo BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS selected_template_id UUID REFERENCES templates (id) ON DELETE SET NULL;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS lead_status TEXT;

-- Drop legacy status check if present, migrate, enforce new statuses
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'businesses' AND column_name = 'status'
  ) THEN
    UPDATE businesses SET lead_status = CASE status
      WHEN 'draft' THEN 'DISCOVERED'
      WHEN 'qualified' THEN 'QUALIFIED'
      WHEN 'previewed' THEN 'PREVIEW_READY'
      WHEN 'contacted' THEN 'CONTACTED'
      WHEN 'won' THEN 'CLIENT'
      WHEN 'lost' THEN 'REJECTED'
      WHEN 'archived' THEN 'DO_NOT_CONTACT'
      ELSE COALESCE(lead_status, 'DISCOVERED')
    END
    WHERE lead_status IS NULL;
  END IF;
END $$;

UPDATE businesses SET lead_status = 'DISCOVERED' WHERE lead_status IS NULL;

ALTER TABLE businesses ALTER COLUMN lead_status SET DEFAULT 'DISCOVERED';
ALTER TABLE businesses ALTER COLUMN lead_status SET NOT NULL;

ALTER TABLE businesses DROP CONSTRAINT IF EXISTS businesses_status_check;
ALTER TABLE businesses DROP CONSTRAINT IF EXISTS businesses_lead_status_check;
ALTER TABLE businesses ADD CONSTRAINT businesses_lead_status_check
  CHECK (lead_status IN (
    'DISCOVERED','QUALIFIED','PREVIEW_GENERATING','PREVIEW_READY',
    'READY_FOR_OUTREACH','CONTACTED','REPLIED','MEETING','CLIENT',
    'REJECTED','DO_NOT_CONTACT'
  ));

-- Drop legacy status column if it exists (after migration)
ALTER TABLE businesses DROP COLUMN IF EXISTS status;

CREATE INDEX IF NOT EXISTS idx_businesses_vertical_city ON businesses (vertical_id, city_id);
CREATE INDEX IF NOT EXISTS idx_businesses_lead_status ON businesses (lead_status);
CREATE INDEX IF NOT EXISTS idx_businesses_is_demo ON businesses (is_demo);
CREATE INDEX IF NOT EXISTS idx_businesses_domain ON businesses (domain);
CREATE UNIQUE INDEX IF NOT EXISTS idx_businesses_exclusive_vertical_city
  ON businesses (vertical_id, city_id)
  WHERE exclusive_status = 'active';

CREATE TABLE IF NOT EXISTS previews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses (id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES templates (id) ON DELETE RESTRICT,
  slug TEXT NOT NULL UNIQUE,
  template_variant TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'DRAFT',
  exclusive_status TEXT NOT NULL DEFAULT 'none'
    CHECK (exclusive_status IN ('none', 'reserved', 'active')),
  thumbnail_url TEXT,
  published_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Normalize preview statuses to M2 enum
UPDATE previews SET status = UPPER(status);
UPDATE previews SET status = 'READY' WHERE status IN ('READY', 'ready');
UPDATE previews SET status = 'DRAFT' WHERE status IN ('DRAFT', 'draft');
UPDATE previews SET status = 'ARCHIVED' WHERE status IN ('ARCHIVED', 'archived');

ALTER TABLE previews DROP CONSTRAINT IF EXISTS previews_status_check;
ALTER TABLE previews ADD CONSTRAINT previews_status_check
  CHECK (status IN ('DRAFT','GENERATING','READY','APPROVED','ARCHIVED'));

ALTER TABLE previews ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;

CREATE INDEX IF NOT EXISTS idx_previews_business ON previews (business_id);
CREATE INDEX IF NOT EXISTS idx_previews_status ON previews (status);

-- ---------------------------------------------------------------------------
-- contacts
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses (id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  role TEXT,
  source TEXT,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contacts_business ON contacts (business_id);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts (email);

-- ---------------------------------------------------------------------------
-- seo_opportunities
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS seo_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses (id) ON DELETE CASCADE,
  vertical_id UUID NOT NULL REFERENCES verticals (id) ON DELETE RESTRICT,
  city_id UUID NOT NULL REFERENCES cities (id) ON DELETE RESTRICT,
  primary_keyword TEXT NOT NULL,
  secondary_keywords TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'NOT_ANALYZED'
    CHECK (status IN ('NOT_ANALYZED','LOW','MEDIUM','HIGH','VERY_HIGH')),
  notes TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_seo_business ON seo_opportunities (business_id);
CREATE INDEX IF NOT EXISTS idx_seo_status ON seo_opportunities (status);

-- ---------------------------------------------------------------------------
-- outreach
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS outreach_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  vertical_id UUID REFERENCES verticals (id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS outreach_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES outreach_campaigns (id) ON DELETE SET NULL,
  business_id UUID NOT NULL REFERENCES businesses (id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts (id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  preview_url TEXT,
  status TEXT NOT NULL DEFAULT 'DRAFT'
    CHECK (status IN (
      'DRAFT','READY','SCHEDULED','SENT','DELIVERED','OPENED',
      'CLICKED','REPLIED','BOUNCED','UNSUBSCRIBED'
    )),
  provider TEXT,
  provider_message_id TEXT,
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  replied_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_outreach_messages_business ON outreach_messages (business_id);
CREATE INDEX IF NOT EXISTS idx_outreach_messages_status ON outreach_messages (status);

CREATE TABLE IF NOT EXISTS email_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  outreach_message_id UUID NOT NULL REFERENCES outreach_messages (id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_email_events_message ON email_events (outreach_message_id);

CREATE TABLE IF NOT EXISTS email_suppressions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- city_exclusivity (commercial model)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS city_exclusivity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vertical_id UUID NOT NULL REFERENCES verticals (id) ON DELETE CASCADE,
  city_id UUID NOT NULL REFERENCES cities (id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'AVAILABLE'
    CHECK (status IN ('AVAILABLE','RESERVED','EXCLUSIVE','RELEASED')),
  business_id UUID REFERENCES businesses (id) ON DELETE SET NULL,
  reserved_at TIMESTAMPTZ,
  exclusive_at TIMESTAMPTZ,
  released_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (vertical_id, city_id)
);

-- At most one EXCLUSIVE row claiming a business per vertical+city already unique;
-- also ensure only one EXCLUSIVE status... uniqueness on (vertical, city) handles slot.
CREATE UNIQUE INDEX IF NOT EXISTS idx_city_exclusivity_active_business
  ON city_exclusivity (vertical_id, city_id)
  WHERE status = 'EXCLUSIVE';

-- ---------------------------------------------------------------------------
-- activity_log
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses (id) ON DELETE SET NULL,
  activity_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activity_log_business ON activity_log (business_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created ON activity_log (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_log_type ON activity_log (activity_type);

-- ---------------------------------------------------------------------------
-- RLS: dashboard data only for authenticated users
-- ---------------------------------------------------------------------------
ALTER TABLE verticals ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE previews ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE outreach_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE outreach_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_suppressions ENABLE ROW LEVEL SECURITY;
ALTER TABLE city_exclusivity ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'verticals','cities','templates','businesses','previews','contacts',
    'seo_opportunities','outreach_campaigns','outreach_messages',
    'email_events','email_suppressions','city_exclusivity','activity_log'
  ]
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS lge_authenticated_all ON %I', t);
    EXECUTE format(
      'CREATE POLICY lge_authenticated_all ON %I FOR ALL TO authenticated USING (true) WITH CHECK (true)',
      t
    );
  END LOOP;
END $$;
