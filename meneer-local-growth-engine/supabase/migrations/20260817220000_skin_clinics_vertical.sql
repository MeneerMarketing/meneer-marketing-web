-- Skin clinics vertical pack (huidklinieken discovery + outreach)

INSERT INTO verticals (slug, name, description)
VALUES (
  'skin-clinics',
  'Huidklinieken',
  'Cosmetische en medisch-esthetische huidklinieken · discovery & outreach'
)
ON CONFLICT (slug) DO UPDATE
SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

INSERT INTO templates (vertical_id, variant, name, description)
SELECT v.id, t.variant, t.name, t.description
FROM verticals v
CROSS JOIN (
  VALUES
    ('editorial', 'Editorial Clinic', 'Premium editorial wellness voor huidklinieken'),
    ('soft-movement', 'Soft Clinic', 'Warm minimalistisch clinic design'),
    ('reformer-minimal', 'Minimal Clinic', 'Strak modern clinic-first design')
) AS t(variant, name, description)
WHERE v.slug = 'skin-clinics'
ON CONFLICT (vertical_id, variant) DO UPDATE
SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- City acquisition settings seed (geen handmatige blokkades standaard)
INSERT INTO city_acquisition_settings (vertical_id, city_id, acquisition_status, protection_reason)
SELECT v.id, c.id, 'ACQUISITION_ALLOWED', null
FROM verticals v
CROSS JOIN cities c
WHERE v.slug = 'skin-clinics'
ON CONFLICT (vertical_id, city_id) DO NOTHING;
