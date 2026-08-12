# Local Growth Engine

Intern Meneer Marketing-project: gepersonaliseerde lokale conceptwebsites + acquisitie-dashboard.

## Milestone 1 — Templates
Publieke conceptpreviews (noindex): `/preview/[slug]`

## Milestone 2 — Dashboard
Privé acquisitie-app: `/dashboard/*` + `/login`

### Start

```bash
cd meneer-local-growth-engine
cp .env.example .env.local   # of gebruik bestaande .env.local
npm install
npm run dev
```

Open: http://localhost:3000/dashboard

### Auth

1. Vul Supabase URL + anon key in `.env.local`
2. Maak een user aan via `/login` (sign up) of in Supabase Auth
3. Zet `LGE_DEV_AUTH_BYPASS=false` voor echte auth-gate

Met `LGE_DEV_AUTH_BYPASS=true` kun je de UI lokaal bekijken zonder login.

### Preview URLs

- http://localhost:3000/preview/studio-forma-arnhem-editorial
- http://localhost:3000/preview/studio-forma-arnhem-reformer
- http://localhost:3000/preview/studio-forma-arnhem-soft

### Dashboard routes

- `/dashboard` — overzicht
- `/dashboard/leads` — pipeline
- `/dashboard/leads/[id]` — lead detail
- `/dashboard/discovery` — foundation (geen scraping)
- `/dashboard/previews`
- `/dashboard/templates`
- `/dashboard/seo`
- `/dashboard/outreach`
- `/dashboard/exclusivity`
- `/dashboard/analytics`
- `/dashboard/settings`

### Database

Migrations: `supabase/migrations/`  
Applied to linked Supabase project. RLS: authenticated only on LGE tables.

### Niet in scope (nog)

- Google Maps scraping
- Bulk discovery
- Echte e-mailverzending
