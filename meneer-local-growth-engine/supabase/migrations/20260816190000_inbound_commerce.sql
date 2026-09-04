-- Inbound vertical landings + Mollie commerce (shared with meneermarketing.nl)

CREATE TABLE IF NOT EXISTS inbound_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL CHECK (source IN ('pilates-studios', 'huidklinieken')),
  studio_name TEXT NOT NULL,
  city TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  package_interest TEXT,
  booking_need TEXT,
  message TEXT,
  campaign_ref TEXT,
  campaign_id UUID,
  business_id UUID REFERENCES businesses (id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'contacted', 'qualified', 'won', 'lost')),
  payment_status TEXT NOT NULL DEFAULT 'none'
    CHECK (payment_status IN ('none', 'pending', 'paid', 'failed', 'waived')),
  launch_promo_active BOOLEAN NOT NULL DEFAULT false,
  launch_amount_cents INTEGER NOT NULL DEFAULT 0,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS commerce_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inbound_submission_id UUID REFERENCES inbound_submissions (id) ON DELETE SET NULL,
  campaign_ref TEXT,
  campaign_id UUID,
  business_id UUID REFERENCES businesses (id) ON DELETE SET NULL,
  mollie_payment_id TEXT UNIQUE,
  checkout_url TEXT,
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR',
  description TEXT,
  payment_kind TEXT NOT NULL DEFAULT 'launch_fee'
    CHECK (payment_kind IN ('launch_fee', 'other')),
  package_key TEXT,
  source TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'created'
    CHECK (
      status IN (
        'created',
        'open',
        'pending',
        'paid',
        'failed',
        'expired',
        'canceled'
      )
    ),
  paid_at TIMESTAMPTZ,
  payment_method TEXT,
  customer_name TEXT,
  customer_email TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_inbound_submissions_created
  ON inbound_submissions (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_inbound_submissions_campaign_ref
  ON inbound_submissions (campaign_ref)
  WHERE campaign_ref IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_inbound_submissions_email
  ON inbound_submissions (lower(email));

CREATE INDEX IF NOT EXISTS idx_inbound_submissions_payment_status
  ON inbound_submissions (payment_status);

CREATE INDEX IF NOT EXISTS idx_commerce_payments_status
  ON commerce_payments (status);

CREATE INDEX IF NOT EXISTS idx_commerce_payments_mollie
  ON commerce_payments (mollie_payment_id)
  WHERE mollie_payment_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_commerce_payments_submission
  ON commerce_payments (inbound_submission_id);

ALTER TABLE inbound_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE commerce_payments ENABLE ROW LEVEL SECURITY;
