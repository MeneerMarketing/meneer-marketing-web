# MeneerMarketing — meneermarketing.nl

Marketingwebsite van MeneerMarketing. Next.js App Router, Tailwind CSS, statische pagina's.

## Lokaal draaien

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

| Variabele | Waarde (productie) |
|-----------|-------------------|
| `NEXT_PUBLIC_SITE_URL` | `https://meneermarketing.nl` |

Zet deze in Vercel onder **Project → Settings → Environment Variables** (Production + Preview).

## Deploy (Vercel + Hostnet domein)

1. Push naar GitHub (`MeneerMarketing/meneer-marketing-web`).
2. Import project in [Vercel](https://vercel.com) → kies de repo → framework: Next.js (auto).
3. Environment variable: `NEXT_PUBLIC_SITE_URL=https://meneermarketing.nl`
4. Deploy.
5. Vercel → **Domains** → voeg `meneermarketing.nl` en `www.meneermarketing.nl` toe.
6. Hostnet → **DNS** voor `meneermarketing.nl`:
   - `@` → A → `76.76.21.21`
   - `www` → CNAME → `cname.vercel-dns.com`
7. Wacht op DNS (15 min – 24 uur). SSL regelt Vercel automatisch.

## Scripts

| Commando | Doel |
|----------|------|
| `npm run dev` | Development server |
| `npm run build` | Productie-build |
| `npm run start` | Productie-server lokaal |
| `npm run lint` | ESLint |
