-- Interne notities op inbound aanvragen (LGE klanten detail)

ALTER TABLE inbound_submissions
  ADD COLUMN IF NOT EXISTS internal_notes TEXT;

COMMENT ON COLUMN inbound_submissions.internal_notes IS
  'Interne LGE-notities; niet zichtbaar op meneermarketing.nl';
