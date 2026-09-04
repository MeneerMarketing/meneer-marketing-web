-- Milestone 8: Preview → offer bridge (campaigns, events, reservations)

-- ---------------------------------------------------------------------------
-- campaigns — per-business tracking ref (distinct from outreach_campaigns batch)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_ref TEXT NOT NULL UNIQUE,
  business_id UUID NOT NULL REFERENCES businesses (id) ON DELETE CASCADE,
  preview_id UUID REFERENCES previews (id) ON DELETE SET NULL,
  outreach_message_id UUID REFERENCES outreach_messages (id) ON DELETE SET NULL,
  vertical_id UUID REFERENCES verticals (id) ON DELETE SET NULL,
  city_id UUID REFERENCES cities (id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'ACTIVE'
    CHECK (status IN ('ACTIVE', 'REVOKED', 'EXPIRED', 'CONVERTED')),
  environment TEXT NOT NULL DEFAULT 'DEVELOPMENT'
    CHECK (environment IN ('DEVELOPMENT', 'PRODUCTION')),
  lifecycle_status TEXT NOT NULL DEFAULT 'QA'
    CHECK (
      lifecycle_status IN (
        'DRAFT',
        'QA',
        'LAUNCH_READY',
        'LIVE',
        'PAUSED',
        'COMPLETED',
        'REVOKED'
      )
    ),
  conversion_status TEXT NOT NULL DEFAULT 'NONE'
    CHECK (
      conversion_status IN (
        'NONE',
        'ENGAGED',
        'INTERESTED',
        'CONTACT_STARTED',
        'INBOUND_LEAD',
        'PROPOSAL',
        'WON',
        'LOST'
      )
    ),
  engagement_level TEXT NOT NULL DEFAULT 'COLD'
    CHECK (
      engagement_level IN (
        'COLD',
        'OPENED',
        'ENGAGED',
        'HIGH_INTENT',
        'INBOUND'
      )
    ),
  recommended_package TEXT,
  recommendation_reason TEXT,
  selected_package TEXT,
  selected_booking_option TEXT,
  city_status_snapshot TEXT,
  first_seen_at TIMESTAMPTZ,
  last_seen_at TIMESTAMPTZ,
  last_real_activity_at TIMESTAMPTZ,
  last_activity_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  event_count INTEGER NOT NULL DEFAULT 0,
  real_event_count INTEGER NOT NULL DEFAULT 0,
  test_event_count INTEGER NOT NULL DEFAULT 0,
  reservation_expires_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  launch_ready_at TIMESTAMPTZ,
  launch_blockers JSONB NOT NULL DEFAULT '[]'::jsonb,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS campaigns_business_idx
  ON campaigns (business_id, created_at DESC);

CREATE INDEX IF NOT EXISTS campaigns_activity_idx
  ON campaigns (last_activity_at DESC);

CREATE INDEX IF NOT EXISTS campaigns_environment_idx
  ON campaigns (environment, engagement_level)
  WHERE status = 'ACTIVE';

-- ---------------------------------------------------------------------------
-- campaign_events — append-only journey events (test isolation via is_test)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS campaign_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns (id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  idempotency_key TEXT NOT NULL UNIQUE,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  source TEXT NOT NULL DEFAULT 'public_api',
  is_test BOOLEAN NOT NULL DEFAULT false,
  environment TEXT NOT NULL DEFAULT 'production',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS campaign_events_campaign_idx
  ON campaign_events (campaign_id, created_at DESC);

CREATE INDEX IF NOT EXISTS campaign_events_real_idx
  ON campaign_events (campaign_id, event_type)
  WHERE is_test = false;

-- ---------------------------------------------------------------------------
-- campaign_reservations — soft business-specific window (M8.4, not city lock)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS campaign_reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns (id) ON DELETE CASCADE,
  city_id UUID NOT NULL REFERENCES cities (id) ON DELETE CASCADE,
  vertical_id UUID NOT NULL REFERENCES verticals (id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES businesses (id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'ACTIVE'
    CHECK (status IN ('ACTIVE', 'EXPIRED', 'RELEASED')),
  expires_at TIMESTAMPTZ NOT NULL,
  released_at TIMESTAMPTZ,
  release_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS campaign_reservations_active_idx
  ON campaign_reservations (campaign_id, status)
  WHERE status = 'ACTIVE';

CREATE INDEX IF NOT EXISTS campaign_reservations_city_idx
  ON campaign_reservations (vertical_id, city_id, status);

-- ---------------------------------------------------------------------------
-- businesses — denormalized campaign state for dashboard
-- ---------------------------------------------------------------------------
ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS active_campaign_id UUID REFERENCES campaigns (id) ON DELETE SET NULL;

ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS engagement_level TEXT NOT NULL DEFAULT 'COLD';

ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS conversion_status TEXT NOT NULL DEFAULT 'NONE';

ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS recommended_package TEXT;

CREATE INDEX IF NOT EXISTS businesses_active_campaign_idx
  ON businesses (active_campaign_id)
  WHERE active_campaign_id IS NOT NULL;

-- ---------------------------------------------------------------------------
-- inbound / commerce FK to campaigns (optional refs from M8.1)
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'inbound_submissions_campaign_id_fkey'
  ) THEN
    ALTER TABLE inbound_submissions
      ADD CONSTRAINT inbound_submissions_campaign_id_fkey
      FOREIGN KEY (campaign_id) REFERENCES campaigns (id) ON DELETE SET NULL;
  END IF;
EXCEPTION
  WHEN undefined_table THEN NULL;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'commerce_payments_campaign_id_fkey'
  ) THEN
    ALTER TABLE commerce_payments
      ADD CONSTRAINT commerce_payments_campaign_id_fkey
      FOREIGN KEY (campaign_id) REFERENCES campaigns (id) ON DELETE SET NULL;
  END IF;
EXCEPTION
  WHEN undefined_table THEN NULL;
END $$;

-- ---------------------------------------------------------------------------
-- RLS (service role pattern — matches other LGE tables)
-- ---------------------------------------------------------------------------
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_reservations ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'campaigns' AND policyname = 'campaigns_service_role'
  ) THEN
    CREATE POLICY campaigns_service_role ON campaigns
      FOR ALL USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'campaign_events' AND policyname = 'campaign_events_service_role'
  ) THEN
    CREATE POLICY campaign_events_service_role ON campaign_events
      FOR ALL USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'campaign_reservations' AND policyname = 'campaign_reservations_service_role'
  ) THEN
    CREATE POLICY campaign_reservations_service_role ON campaign_reservations
      FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;
