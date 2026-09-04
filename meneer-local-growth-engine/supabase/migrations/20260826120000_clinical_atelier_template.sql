-- Template D: Atelier Clinical (Figma Setup project) — skin-clinics vertical
INSERT INTO templates (vertical_id, variant, name, description)
SELECT v.id, 'clinical-atelier', 'Atelier Clinical', 'Premium petrol editorial huidkliniek (Figma Setup)'
FROM verticals v
WHERE v.slug = 'skin-clinics'
ON CONFLICT (vertical_id, variant) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;
