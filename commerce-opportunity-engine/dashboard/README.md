# Commerce Opportunity Engine Dashboard

Interne Meneer Marketing app voor Google Ads discovery, webshop qualification en opportunities.

## Start

```bash
# vanuit commerce-opportunity-engine/
cp .env dashboard/.env.local   # eenmalig, als nog niet aanwezig
npm run generate:opportunities
npm run dashboard:dev
```

Dev server: http://localhost:3040 (of poort via `next dev -p …`)

## Routes

| Route | Doel |
|-------|------|
| `/` | Overzicht |
| `/opportunities` | Opportunity lijst + filters |
| `/opportunities/[id]` | Opportunity detail + status |
| `/brands` | Brand lijst |
| `/brands/[id]` | Brand detail |
| `/discovery` | Google Ads signalen |
| `/runs` | Pipeline runs |
| `/api-usage` | Kosten uit run metadata |

## Notes

- Server-side Supabase via `SUPABASE_URL` + `SUPABASE_SECRET_KEY`
- Geen CRO-scores in deze milestone
- Status updates: NEW / REVIEWED / SHORTLISTED / REJECTED
