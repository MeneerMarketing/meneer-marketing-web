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

Kopieer [`.env.example`](.env.example) naar `.env.local` voor lokaal testen.

| Variabele | Verplicht | Doel |
|-----------|-----------|------|
| `NEXT_PUBLIC_SITE_URL` | Ja | `https://meneermarketing.nl` (metadata, sitemap) |
| `RESEND_API_KEY` | **Ja (formulieren)** | API-key van [resend.com](https://resend.com) |
| `CONTACT_FROM_EMAIL` | Ja | Bijv. `MeneerMarketing <aanvragen@meneermarketing.nl>` |
| `CONTACT_TO_EMAIL` | Ja | `info@meneermarketing.nl` |

**Zonder `RESEND_API_KEY` werken geen formulieren op productie.** Alle aanvragen lopen via `/api/contact`.

### Formulieren op de site

| Pagina | Component |
|--------|-----------|
| `/contact` | ContactForm + chat |
| `/samenwerken` | ConversionForm |
| `/project-starten` | ConversionForm |
| `/intake` | ConversionForm |
| `/schaal-op` | ConversionForm |

### Resend + Vercel (eenmalig)

1. Account op [resend.com](https://resend.com).
2. Domein **meneermarketing.nl** verifiëren (DNS-records in Hostnet).
3. API key aanmaken.
4. Vercel → **Project → Settings → Environment Variables**:
   - `RESEND_API_KEY` = `re_...`
   - `CONTACT_FROM_EMAIL` = `MeneerMarketing <aanvragen@meneermarketing.nl>`
   - `CONTACT_TO_EMAIL` = `info@meneermarketing.nl`
   - `NEXT_PUBLIC_SITE_URL` = `https://meneermarketing.nl`
5. **Redeploy** na het toevoegen van variabelen.
6. Check: `https://meneermarketing.nl/api/contact` → `{ "configured": true, ... }`

Zet deze variabelen in **Production** én **Preview**.

## Deploy (Vercel + Hostnet domein)

1. Push naar GitHub (`MeneerMarketing/meneer-marketing-web`).
2. Import project in [Vercel](https://vercel.com) → kies de repo → framework: Next.js (auto).
3. Environment variables (zie tabel hierboven). **Minimaal `RESEND_API_KEY` + mail-variabelen**, anders falen formulieren.
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
