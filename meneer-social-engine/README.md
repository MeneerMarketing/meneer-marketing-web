# Meneer Marketing Social Engine

Interne tool voor Instagram: strategie, templates, contentgeneratie, goedkeuring en render.

## Starten

```bash
cd meneer-social-engine
cp .env.example .env.local
npm install
npm run dev
```

Dashboard: http://localhost:3030/dashboard

## Documenten

| Doc | Waarvoor |
|-----|----------|
| [INSTAGRAM-STRATEGIE.md](./INSTAGRAM-STRATEGIE.md) | De creatieve bijbel. Begin hier. |
| [INSTAGRAM-SETUP.md](./INSTAGRAM-SETUP.md) | Account omzetten, avatar, API |
| [SOCIAL-ENGINE-PLAN.md](./SOCIAL-ENGINE-PLAN.md) | Technisch plan en fasering |
| [WHAT-YOU-NEED.md](./WHAT-YOU-NEED.md) | Checklist voor jou |
| [src/brand/BRAND-BRAIN.md](./src/brand/BRAND-BRAIN.md) | Merkregels die naar Claude gaan |

## De formats

**Tier 1, wekelijks vast**

| Dag | Format | Wat het doet |
|-----|--------|--------------|
| Dinsdag | De Rekening | Fout uitgedrukt in euro's per maand |
| Donderdag | Meneer Fixt | Eén element herbouwd, before en after |
| Zaterdag | Meneer Zegt | Contraire mening |

**Tier 2, maandelijks** · Meneer Meter (score met reveal), Meneer Ontleedt (groot merk)

**Tier 3, wildcard** · De Offerte, Zestig Minuten, Bureau Bingo, Case

## Renderen

Carousels als PNG op 1080×1350:

```bash
npm run dev
npm run export:slides                 # alles
npm run export:slides -- DE_REKENING  # één format
```

Reels als MP4 op 1080×1920:

```bash
cd remotion
npm run dev                                        # Studio
npx remotion render MeneerFixt ../out/fixt.mp4
```

Avatar:

```bash
cd remotion
npx remotion still AvatarOranje ../out/avatar-oranje.png
npx remotion still AvatarCheck ../out/avatar-check.png
```

## Contentplan genereren

```bash
npm run plan:month -- 2026-09
```

Of via de API: `POST /api/content/plan` en `POST /api/content/generate`.

## Fases

| Fase | Wat | Status |
|------|-----|--------|
| 1 | Strategie, Brand Brain, formats | klaar |
| 2 | Templates, dashboard, Claude-services | klaar |
| 3 | PNG-export en Reel-render | klaar |
| 4 | Supabase koppelen aan de queue | wacht op sleutels |
| 5 | Meta Instagram API, publiceren en insights | wacht op Meta App |
| 6 | Meneer Meter als publieke tool op de site | volgende |
