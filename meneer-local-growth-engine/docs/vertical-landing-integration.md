# Vertical landing integration contract

Cross-repo bridge between **Local Growth Engine (LGE)** and **meneermarketing.nl**.

LGE owns lead intelligence, campaigns, attribution, exclusivity.
Meneer Marketing owns commercial copy, pricing UI, package presentation, forms.

## Base URLs

| Env | LGE API base | Marketing site |
|-----|--------------|----------------|
| Production | `https://preview.meneermarketing.nl` (or dedicated LGE host) | `https://meneermarketing.nl` |
| Development | `http://localhost:3000` | `http://localhost:3000` (MM) or configured |

Environment variables (LGE):

- `MENEER_MARKETING_BASE_URL` (default `https://meneermarketing.nl`)
- `OUTREACH_PREVIEW_BASE_URL` / `PREVIEW_BASE_URL`
- `CAMPAIGN_ALLOWED_ORIGINS` (comma-separated)
- `CAMPAIGN_RESERVATION_DAYS` (default `14`)

## Campaign refs

Format: `mmlg_` + opaque random token (base64url).

Rules:

- Not incremental
- No business id / email / city / name in plaintext
- Server-side resolve only
- Revocable via `campaigns.status = REVOKED`
- Optional `expires_at`

## GET /api/public/campaign-context/{ref}

Resolve public personalization for a Pilates (or other vertical) landing page.

### Allowed origins

Only origins in `CAMPAIGN_ALLOWED_ORIGINS`. Prefer server-side fetch from Meneer Marketing (no browser CORS needed).

Default allowlist:

- `https://meneermarketing.nl`
- `https://www.meneermarketing.nl`
- `http://localhost:3000`
- `http://127.0.0.1:3000`

### Example request

```http
GET /api/public/campaign-context/mmlg_xxxxxxxx HTTP/1.1
Origin: https://meneermarketing.nl
```

### Success response

```json
{
  "valid": true,
  "vertical": "pilates",
  "business_name": "Infinitum Pilates",
  "city": "Arnhem",
  "preview_url": "https://preview.meneermarketing.nl/infinitum-pilates-arnhem-reformer-minimal",
  "selected_template": "reformer-minimal",
  "city_status": "RESERVED",
  "primary_service": "Reformer Pilates",
  "recommended_package": "LOCAL_GROWTH",
  "preview_cta_label": "Wat kost deze website?",
  "landing_path": "/pilates-studios"
}
```

### Never returned

email, phone, lead_score, winner_confidence, SEO ranks, competitor lists, contact details, database UUIDs, internal notes.

### Error responses

| status | body |
|--------|------|
| 400 | `{ "valid": false, "error": "invalid" }` |
| 403 | `{ "ok": false, "error": "origin_not_allowed" }` |
| 404 | `{ "valid": false, "error": "not_found" }` |
| 410 | `{ "valid": false, "error": "revoked" \| "expired" }` |
| 429 | `{ "valid": false, "error": "rate_limited" }` |

## POST /api/public/campaign-events

First-party event ingestion from meneermarketing.nl (and preview CTA).

### Event types

- `PREVIEW_OPENED`
- `PREVIEW_CTA_CLICKED`
- `LANDING_PAGE_VIEWED`
- `PACKAGE_SECTION_VIEWED`
- `PACKAGE_SELECTED`
- `BOOKING_OPTION_VIEWED`
- `CONTACT_STARTED`
- `CONTACT_SUBMITTED`

### Payload

```json
{
  "campaign_ref": "mmlg_xxxxxxxx",
  "event_type": "PACKAGE_SELECTED",
  "idempotency_key": "optional-client-key",
  "metadata": {
    "package": "LOCAL_GROWTH"
  }
}
```

### Metadata whitelist

| event | allowed keys / values |
|-------|------------------------|
| PACKAGE_* | `package`: STUDIO_EDITION \| LOCAL_GROWTH \| GROWTH_PARTNER \| SIGNATURE_CUSTOM |
| BOOKING_OPTION_VIEWED | `booking_option`: EXISTING_BOOKING \| BRANDED_APP \| CUSTOM_FUNNEL \| CUSTOM_APP |
| any | optional `path` (string < 200), `section` (string < 80) |

Arbitrary JSON is stripped.

### Headers

- `Idempotency-Key` optional (also accepted in body)
- Rate limit ~40 writes / IP / minute

### CONTACT_SUBMITTED

Sets conversion to `INBOUND_LEAD`. No automatic sales email from LGE.

## Preview → landing URL

Landing destination (Pilates):

`https://meneermarketing.nl/pilates-studios?ref={{campaign_ref}}`

Preview URL with attribution:

`https://preview.meneermarketing.nl/{{slug}}?ref={{campaign_ref}}`

CTA on READY previews: subtle floating card (“Dit concept laten bouwen?”).

## Packages (keys only)

Source of truth for pricing/copy: meneermarketing.nl.

LGE keys:

- STUDIO_EDITION
- LOCAL_GROWTH
- GROWTH_PARTNER
- SIGNATURE_CUSTOM

## City status

Exposed only when real exclusivity engine status applies:

AVAILABLE | PRIMARY_CANDIDATE | RESERVED | EXCLUSIVE

Soft campaign reservation: configurable days (`CAMPAIGN_RESERVATION_DAYS`). Expires back to AVAILABLE unless EXCLUSIVE / inbound / proposal / won.

## Suggested MM implementation

1. Read `?ref=` on `/pilates-studios`
2. Server-side GET campaign-context
3. If valid: show personal hero strip + “Terug naar jullie concept”
4. On scroll/select/submit: POST campaign-events with same ref
5. Keep ref through form submit

## Test vs production events (Milestone 8.2)

### Fields

Every campaign event stores:

- `is_test` (boolean)
- `environment` (`development` | `production`)

### What counts for conversion

Only `is_test = false` events update:

- `engagement_level`
- `conversion_status`
- `selected_package` / booking interest
- `last_real_activity_at`
- commercial funnel metrics

Test events remain auditable in dashboard under **Test activity**.

### Security model (critical)

Browsers **cannot** set `is_test`.

Server resolves test mode as:

1. Campaign `environment = DEVELOPMENT` → all events are test
2. Trusted MM/server proxy with shared secret:
   - Header `X-LGE-Ingest-Secret: <LGE_EVENT_INGEST_SECRET>`
   - Header `X-LGE-Event-Mode: test`
3. Otherwise → production event (`is_test=false`)

Body field `is_test` from clients is ignored.

### MM cross-project requirement

| MM setting | Expected LGE event |
|------------|--------------------|
| `CONTACT_DRY_RUN=true` + ingest secret | test events |
| Production (`CONTACT_DRY_RUN=false`, no test mode) | real events |

Tracking failure must never block MM contact success.

### Campaign environment / lifecycle

- `environment`: `DEVELOPMENT` | `PRODUCTION`
- `lifecycle_status`: `DRAFT` | `QA` | `LAUNCH_READY` | `LIVE` | `PAUSED` | `COMPLETED` | `REVOKED`

Real prospect mail requires:

- `OUTREACH_REAL_SEND_ENABLED=true`
- campaign `environment=PRODUCTION`
- lifecycle `LAUNCH_READY` or `LIVE`

### Example production event

```http
POST /api/public/campaign-events
Origin: https://meneermarketing.nl
Content-Type: application/json

{
  "campaign_ref": "mmlg_xxxxxxxx",
  "event_type": "PACKAGE_SELECTED",
  "metadata": { "package": "LOCAL_GROWTH" }
}
```

### Example trusted test event (MM dry-run proxy)

```http
POST /api/public/campaign-events
X-LGE-Ingest-Secret: <server secret>
X-LGE-Event-Mode: test
Content-Type: application/json

{
  "campaign_ref": "mmlg_xxxxxxxx",
  "event_type": "CONTACT_SUBMITTED",
  "metadata": { "package": "LOCAL_GROWTH" }
}
```

## Security checklist

- [x] Opaque refs only
- [x] Origin allowlist / SSR preferred
- [x] Rate limits on public endpoints
- [x] Idempotent events
- [x] Previews noindex/nofollow
- [x] No PII in public payloads
- [x] is_test not client-controllable
- [x] Test events excluded from commercial journey/KPIs
