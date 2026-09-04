@SOCIAL-ENGINE-PLAN.md

## Agent-regels Social Engine

### Altijd

1. **Meneer is één persoon.** Nooit "wij" of "we" in content. Ik/jij-taal.
2. **Geen AI-slop.** Geen genummerde stappen (01/02/03), geen em-dashes, geen "Laten we kijken naar...".
3. **Geen "Geen X"-negatie** in UI-copy. Schrijf wat je wél levert.
4. **Templates, geen AI-afbeeldingen.** Visuals via React HTML/CSS, nooit DALL-E/Midjourney voor posts.
5. **Humor over marketing, niet over ondernemers.** Roast UX, bureaus, trends. Niet de klant.
6. **Nederlands, conversationeel.** Alsof Meneer aan tafel zit. Droog, scherp, af en toe grappig.
7. **Diensten expliciet:** websites from scratch, Shopify, Google Ads, Meta Ads, SEO, AI-antwoorden.
8. **Nooit "maatwerk websites"** — altijd "from scratch" of "custom build".

### Contentgeneratie

- Planner kiest format op basis van weights + recente performance.
- Writer volgt format-specifieke prompt + Brand Brain.
- Critic scoort: originaliteit, Meneer-fit, hook, deelbaarheid, AI-generic risk.
- Onder 75/100 → reject, opnieuw genereren (max 2 retries).
- Carousel max 6 slides. Reel max 14 sec script.

### Verboden woorden (auto-reject)

`til naar een hoger niveau`, `unlock`, `digitale groei`, `gamechanger`, `passie voor`, `wij geloven`, `synergie`, `full service`, `360°`, `🚀`

### Design

- Canvas: 1080×1350 (feed), 1080×1920 (reels/stories)
- Font: Plus Jakarta Sans
- Accent: `#c2410c` (WCAG) of `#FF5722` (social bold)
- Achtergrond: `#f3f7fb` of `#0c1222` (dark variant)
- Oranje markeerstift, GOEDGEKEURD/AFGEKEURD stamps, browser-frame mocks

### Code

- Strict TypeScript, Zod voor alle API-input/output
- Server Components default, `'use client'` alleen voor interactieve dashboard-delen
- Volg LGE-patronen voor Supabase en Anthropic

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
