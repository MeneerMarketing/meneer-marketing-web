# Vertical landing integration (Meneer Marketing website)

Contract tussen **Local Growth Engine (LGE)** en de **Meneer Marketing Next.js site** (`src/` op meneermarketing.nl) voor publieke campaign- en preview-context.

## Breaking change — Milestone 8.4 (aug 2026)

### Verwijderd uit publieke copy en campaign UI

De MM-site mag **niet** meer impliceren dat een stad of vertical exclusief is gereserveerd voor één prospect.

**Niet meer tonen of formuleren:**

- één studio per stad / één Pilates studio per stad
- city reservation als commerciële exclusiviteit ("Arnhem is gereserveerd")
- exclusief voor jullie / exclusief voor je
- concurrenten niet helpen / geen directe concurrent in dezelfde stad
- "zolang we samenwerken bied ik dit niet ook aan een concurrent aan"

Dit is een **business strategy change**: LGE ondersteunt nu meerdere actieve redesign prospects per stad (capacity limit, geen exclusiviteit).

### Behouden in campaign context

Publieke campaign context (`/api/public/campaign-context/[ref]` en MM landing) mag nog steeds bevatten:

| Veld | Gebruik |
|------|---------|
| `business_name` | Personalisatie |
| `city` | Lokale context |
| `preview_url` | Terugkeerlink naar conceptwebsite |
| `recommended_package` | Commercieel pakket (mag gelijk zijn voor meerdere studios in dezelfde stad) |
| `primary_service` | Dienst-focus per studio |
| `campaign_ref` | Tracking |
| `landing_page_url` | Aanbodpagina Pilates |

### Wat de MM-agent moet aanpassen

1. **Pilates landing / campaign return pages** — verwijder exclusiviteit-claims en city-reservation badges.
2. **Hero / trust copy** — positioneer op: bewuste selectie, persoonlijk concept, eigen branding, lokale SEO, booking journey, 12 jaar ervaring, preview direct bekijken.
3. **Geen "jullie zijn onze enige studio in {city}"** in metadata, JSON-LD of zichtbare tekst.
4. **Campaign tracking** — ongewijzigd laten (ref, events, package selection).

### LGE-side (reeds gedaan in M8.4)

- Hardened outreach template zonder exclusiviteit-paragraaf
- Copy validation blokkeert exclusiviteit-frases
- `city_exclusivity` blijft audit/history, geen outreach gate
- `city_acquisition_settings.MANUALLY_PROTECTED` voor bewuste client protection (bv. Apeldoorn), los van multi-prospect strategy

## Template uniqueness (intern LGE, niet op MM-site)

Meerdere actieve prospects in dezelfde stad krijgen **verschillende** website templates (Editorial, Reformer Minimal, Soft Movement). Dit is een **interne** LGE-regel; de MM-site hoeft template-slugs niet te tonen tenzij voor QA.

## Manual city protection

Steden met `MANUALLY_PROTECTED` (bestaande klant) blokkeren nieuwe acquisition in LGE. Dit is **geen** algemene "max 1 per city" regel en hoeft niet als exclusiviteit op de MM-site te verschijnen.

## Environment

- `OUTREACH_REAL_SEND_ENABLED=false` blijft verplicht tot go-live review.
- Development campaigns/events tellen niet als echte prospect engagement (M8.2 test-event isolation).
