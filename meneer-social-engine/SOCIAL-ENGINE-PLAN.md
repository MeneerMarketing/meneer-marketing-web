# Social Engine — Masterplan

## Doel

Meneer Marketing op Instagram als **mini-mediabrand**: speels, deskundig, herkenbaar. Mensen volgen omdat de content leuk is. Acquisitie volgt vanzelf.

Jij bent **eindredacteur**, geen dagelijkse contentmaker. ~90% geautomatiseerd.

## Instagram-profiel (launch)

| Veld | Waarde |
|------|--------|
| Gebruikersnaam | `@meneermarketing` (of `@meneer.marketing`) |
| Naam | `Meneer Marketing \| Web & Groei` |
| Bio | `Websites, Shopify & online groei.` / `Ik zeg wat er misgaat. Daarna fix ik het.` / `↓ Laat Meneer naar je bedrijf kijken` |
| Link | meneermarketing.nl (of link-in-bio met groeiscan) |
| Avatar | Oranje vlak + `M` of `MM`, zwart/off-white typografie |
| Highlights | START · WERK · RESULTS · MENING · FAQ |

### Pinned posts (dag 1)

1. FlexDesigns → Meneer Marketing (overgangsverhaal)
2. Dit bouwt Meneer (beste cases)
3. Wat kan Meneer voor mij doen? (diensten in één carousel)

### Launch-checklist account

- [ ] Naam, avatar, bio, link wijzigen
- [ ] Oude FlexDesigns-posts archiveren (niet verwijderen)
- [ ] 3 pinned posts live
- [ ] Highlights aanmaken met minimalistische covers
- [ ] Bio-regel "Voorheen FlexDesigns" (2 weken, daarna weg)
- [ ] Eerste 12 posts uit launchplan publiceren (3 weken)

## Contentverdeling

| Type | % |
|------|---|
| Entertainment / mening | 35% |
| Builds / before-after | 30% |
| Kennis / audits | 20% |
| Cases / resultaten | 10% |
| Direct aanbod | 5% |

## Wat wél automatiseren

- Ideeën, hooks, captions, carousel-copy
- Kalender + planning
- Visual render via vaste templates
- Publicatie + scheduling (fase 4)
- Analytics ophalen + leren (fase 4)
- Inbound comment-suggesties op eigen posts

## Wat NIET automatiseren

- Outbound comments bij andere bedrijven (jij klikt, AI suggereert)
- Eindgoedkeuring van elke post
- DM's naar prospects

## Technische stack

- **Next.js** — dashboard + template preview
- **Supabase** — posts, ideas, analytics, projects
- **Anthropic Claude** — planner, writer, critic, analyst
- **React templates** — 1080×1350 carousels (geen Canva, geen AI-plaatjes)
- **Playwright** — PNG export (fase 3)
- **Remotion of ffmpeg** — Reels (fase 3)
- **Meta Instagram API** — publish + insights (fase 4)

## Maandag-routine (jij)

1. Open dashboard → Content Queue
2. Bekijk 3–5 gegenereerde posts (preview)
3. Approve / Edit / Reject
4. Engagement Radar: 5 minuten, 3–5 echte reacties plaatsen
5. Klaar (~15 minuten/week)

## Maandag-routine (systeem)

Elke maandag 06:00 (cron, fase 2):

1. Planner genereert weekplan op basis van performance + projecten
2. Writer vult templates
3. Critic filtert onder 75/100
4. Queue vult met `awaiting_approval`

## KPI's (eerste 90 dagen)

| Metric | Doel |
|--------|------|
| Posts/week | 3–4 |
| Profile visits/week | +20% vs baseline |
| Saves per post | > likes × 0.15 |
| Shares | meetbaar, format met hoogste share = meer |
| DM's/week | 1–2 kwalitatief |
| Volgers | +50/maand organisch |

## Toekomstproduct

Als dit werkt voor Meneer Marketing → **Social Content Engine** als dienst voor klanten.
