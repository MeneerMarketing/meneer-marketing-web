# BATCH 3 — Integratie-instructies voor de agent

Sprint 1 wordt hiermee afgerond: navigatie + footer + één bugfix. Integreer EXACT.

## Bestanden

| Bestand | Actie |
|---|---|
| ProofStrip.tsx | **VERVANGT** `diba/src/components/ui/ProofStrip.tsx` volledig |
| SiteHeader.tsx | Nieuw → `diba/src/components/ui/SiteHeader.tsx` |
| SiteFooter.tsx | Nieuw → `diba/src/components/ui/SiteFooter.tsx` |

## 1. ProofStrip v2 — waarom vervangen (bugfix uit de visuele gate)

De screenshots toonden **negatieve proof-cijfers** ("-52 · -1.280+"). Oorzaak: v1 nam de starttijd met `performance.now()` vóór het eerste animatieframe; de rAF-timestamp kan daar nét vóór liggen → één frame negatieve teller. v2 fixt dit structureel:

1. Start = de eerste rAF-timestamp zelf; `t` dubbel geklemd → negatief onmogelijk.
2. **SSR rendert de definitieve waarden.** Crawlers, no-JS en screenshots tonen altijd 2017 · 8.000+ · 50.000+ · 4.000+. De animatie is progressive enhancement.
3. Nieuw: `onDark`-prop voor de footer.

**Let op:** `items` is nu een verplichte prop (geen interne default meer) — geef overal `DIBA_PROOF_STRIP_ITEMS` uit site.ts door. Een full-page screenshot kan de teller nog steeds mid-animatie vangen; dat is verwacht gedrag, niet "repareren".

## 2. SiteHeader — wiring

- `whatsappHref` = `DIBA_WHATSAPP_URL` uit site.ts (placeholder tot Okan het nummer levert).
- Wordmark is tekst tot het echte logo er is `[BEELD-NODIG: Diba-logo]`. Vervang t.z.t. het tekst-element, niet de structuur.
- Nav-hrefs volgen de masterplan-sitemap; veel routes bestaan pas in sprint 2/3 → 404 op dev is verwacht en ok. Hrefs NIET wijzigen naar bestaande pagina's.
- Scroll-lock + Escape zitten erin; menu-links sluiten het menu bij klik.
- Bewust géén sticky header en géén open/dicht-animatie: rust. Niet toevoegen.

## 3. SiteFooter — wiring

- `proofItems` = `DIBA_PROOF_STRIP_ITEMS`, `nap` = NAP-object uit site.ts (Weissenbruchlaan 166, 3054 HG Rotterdam — canoniek).
- `phone`, `phoneHref`, `kvk`: alleen doorgeven als echte gegevens in site.ts staan — `[GEGEVEN-NODIG van Okan]`, NOOIT invullen met placeholder-waarden die echt lijken (les uit de audit: verzonnen KvK).
- Footer-linkkolommen volgen de sitemap; zelfde 404-regel als de header.

## 4. In de layout zetten

Header + footer horen in `diba/src/app/layout.tsx` (of een `(site)`-groep-layout) rond `{children}`, zodat elke pagina ze krijgt. `/dev/components` mag ze ook tonen — dat is meteen de review.

## Checklist na integratie (rapporteer)

- [ ] lint ✓ · typecheck ✓ · build ✓
- [ ] ProofStrip: geen negatieve waarden meer mogelijk; met JS uit (DevTools) tonen alle strips direct de canonieke cijfers
- [ ] 380px: menu opent volledig scherm, scroll-lock actief, Escape sluit, vier hoofdingangen groot in display-caps
- [ ] Toetsenbord: menu-knop → Escape → focus blijft logisch; alle links focus-ring
- [ ] Desktop: Prijzen zichtbaar in de nav, primaire knop rechtsboven; header verbergt mobiele iconen
- [ ] Footer: proof-strip crème-op-den leesbaar (contrast), NAP klopt met site.ts, geen verzonnen KvK/telefoon
- [ ] Screenshots 380px (menu open én dicht) + desktop → naar Opus

## De drie toetsen — zelfcheck Opus

1. **Meetlat-zin ✓** — "Nog niet zeker? Stel je vraag" als zachte uitgang in het menu; Prijzen prominent (eerlijkheid als interface); geen verzonnen gegevens mogelijk door [GEGEVEN-NODIG]-constructie.
2. **Designtoets ✓** — geen mega-menu, geen sticky header, geen animatiegeweld; linnen vlak, salielijnen, vier grote rustige ingangen; footer diep den met crème.
3. **Duim-toets ✓** — alle targets ≥48px, hoofdingangen groot en tikbaar, WhatsApp direct in de topbalk, menu éénhandig te sluiten.

## Hierna: sprint 2 — de sjablonen

Opus levert: homepage-template (hero-these + intent-router), pillarpagina-template (8 stappen), behandelpagina-template en de schema/JSON-LD-laag. Vereist van Okan vóór sprint 2: WhatsApp-nummer, telefoonnummer, KvK → site.ts.
