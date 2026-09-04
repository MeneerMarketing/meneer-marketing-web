-- Link inbound/commerce rows to campaigns (runs after inbound_commerce migration)

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
