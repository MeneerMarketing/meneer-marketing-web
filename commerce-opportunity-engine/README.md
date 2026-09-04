# Meneer Marketing Commerce Opportunity Engine

Internal tooling to discover Dutch ecommerce advertisers in Google paid search, store leads in Supabase, and later audit landing pages.

## Milestones

| Milestone | Status |
| --- | --- |
| 1. Foundation + API connections | Done |
| 2. Google Ads discovery engine | Done |
| 3. Crawling, audits, outreach | Not built yet |

## Prerequisites

- Node.js 20 or newer
- npm
- DataForSEO, Supabase, and Anthropic accounts

## Setup

### 1. Install dependencies

```bash
cd commerce-opportunity-engine
npm install
```

### 2. Create `.env`

```powershell
Copy-Item .env.example .env
```

Fill in credentials (see `.env.example` for all keys). Never commit `.env`.

### 3. Supabase schema

Schema is applied via migration in Supabase. Local reference: [`supabase/schema.sql`](supabase/schema.sql).

Tables: `keywords`, `brands`, `ad_occurrences`, `pages`, `audits`, `runs`.

### 4. Test connections

```bash
npm run test:connections
```

## Google Ads discovery (Milestone 2)

Discovers advertisers from Google Netherlands SERPs via DataForSEO Live Advanced.

```bash
npm run discover:google
```

Optional seed only (10 development keywords):

```bash
npm run seed:keywords
```

The discovery job auto-seeds keywords if they are missing.

### What it does

1. Loads active keywords from Supabase (default max: 10)
2. Fetches Google SERP for Netherlands / Dutch / mobile
3. Extracts paid text ads (`type: paid`) and Google Shopping blocks (`popular_products`)
4. Normalizes domains, applies blacklist, stores brands + ad occurrences
5. Updates keyword `last_scanned_at` and run statistics
6. Prints a summary + top advertisers by paid keyword coverage

### Cost protection

| Variable | Default | Purpose |
| --- | --- | --- |
| `GOOGLE_DISCOVERY_MAX_KEYWORDS` | `10` | Max keywords per run |
| `DATAFORSEO_MAX_COST_PER_RUN` | `0.10` | Stop before exceeding this USD budget |
| `DATAFORSEO_CONCURRENCY` | `2` | Parallel keyword requests |

### Development helpers

| Variable | Purpose |
| --- | --- |
| `GOOGLE_DISCOVERY_KEYWORD_FILTER` | Exact keyword only (e.g. `led masker kopen`) |
| `DATAFORSEO_SERP_FIXTURE_PATH` | Parse saved JSON without API calls |
| `GOOGLE_DISCOVERY_INCLUDE_SHOPPING_ADS` | Include Shopping blocks (default `true`) |

### Configuration files

- [`src/config/blacklist.ts`](src/config/blacklist.ts) — excluded advertiser domains
- [`src/config/knownRetailers.ts`](src/config/knownRetailers.ts) — seller label → domain map for Shopping blocks

## Scripts

| Command | Description |
| --- | --- |
| `npm run build` | Compile TypeScript |
| `npm run test:connections` | Verify DataForSEO, Supabase, Anthropic |
| `npm run seed:keywords` | Upsert 10 development keywords |
| `npm run discover:google` | Run Google Ads discovery job |

## Project structure

```text
commerce-opportunity-engine/
├── src/
│   ├── config/
│   ├── jobs/
│   │   └── discoverGoogleAds.ts
│   ├── services/
│   │   ├── dataforseo/
│   │   ├── supabase/
│   │   └── anthropic/
│   ├── scripts/
│   └── utils/
├── supabase/
│   └── schema.sql
└── package.json
```

## Security

- API keys only in local `.env`
- Use Supabase **service_role** server-side only
- Credentials are never logged

## Not built yet

- Claude CRO auditing
- Screenshots and full crawling
- Outreach and contact enrichment
- Meta Ads, n8n, dashboard
