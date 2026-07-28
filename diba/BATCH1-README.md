# BATCH 1 — Integratie-instructies voor de agent

Referentie-code van Opus (STAP 0.5). Integreer EXACT; alleen imports/paden aanpassen aan de repo. Design, spacing, copy en gedrag niet wijzigen (gouden overdrachtsregel, DIBA-STAPPENPLAN.md).

## Bestanden → plaats in `diba/src/components/ui/`

| Bestand | Component(en) | Type |
|---|---|---|
| Button.tsx | `Button` (primair · secundair · ghost) | server |
| ProofStrip.tsx | `ProofStrip` | client (count-up §9) |
| ReviewCard.tsx | `ReviewCard` | server |
| FaqAccordion.tsx | `FaqAccordion` | client (accordeon) |
| FormField.tsx | `TextField`, `TextareaField` | server |

## Verplichte wiring

1. **ProofStrip → site.ts.** Vervang de lokale `CANONIEK`-constante door een import uit `diba/src/lib/site.ts` (proof points leven op precies één plek, §11). De waarden moeten identiek blijven: 2017 · 8.000+ · 50.000+ · 4.000+.
2. **Fonts-check.** De componenten gebruiken `var(--font-display/accent/body)`. Controleer dat globals.css deze vars aan de self-hosted Archivo/Fraunces/Inter koppelt (Fraunces mét italic-as/bestand — de ReviewCard gebruikt italic).
3. **FAQ + schema.** FaqAccordion rendert alleen UI. FAQPage-JSON-LD komt uit de SchemaMarkup-laag (sprint 2, Opus) met dezelfde `FaqItem[]`-data als bron. Nu nog niets bouwen; alleen de data-vorm aanhouden.
4. **Geen nieuwe dependencies.** Batch 1 bewijst het: pijl, sterren en plus/min zijn inline SVG. Besluit open punt 9: `framer-motion` en `lucide-react` NIET toevoegen; View Transitions en scroll-reveals (sprint 1) doen we met CSS/native.

## `/dev/components` (jouw taak, sprint 1)

Maak `diba/src/app/dev/components/page.tsx` die alles toont op linnen (`--diba-cream-50`), secties gescheiden met salielijnen. Minimaal:

```tsx
<Button>Start je intake (4 min)</Button>
<Button variant="secundair">Bekijk alle prijzen</Button>
<Button variant="ghost">Nog niet zeker? Stel je vraag</Button>

<ProofStrip />

<ReviewCard
  quote="[COPY-NODIG: echte review uit Salonized-export]"
  name="[COPY-NODIG]" treatment="[COPY-NODIG]" stars={5}
/>

<FaqAccordion items={[
  { question: "[COPY-NODIG: echte FAQ-vraag]", answer: "[COPY-NODIG] [MEDISCHE-CHECK-ROJDA]" },
  { question: "[COPY-NODIG]", answer: "[COPY-NODIG]" },
]} />

<TextField id="email" label="E-mailadres" type="email" placeholder="naam@voorbeeld.nl" />
<TextField id="email-err" label="E-mailadres" type="email"
  defaultValue="naam.voorbeeld.nl" error="Dit e-mailadres mist een @" />
<TextareaField id="vraag" label="Jouw vraag" hint="Hoe concreter, hoe beter we kunnen helpen." />
```

Sluit `/dev/components` uit van sitemap en zet `robots: { index: false }` in de page-metadata.

## Checklist na integratie (rapporteer)

- [ ] lint ✓ · typecheck ✓ · build ✓
- [ ] 380px: alles éénhandig bruikbaar, targets ≥48px
- [ ] Toetsenbord: tab-volgorde logisch, focus-ring 2px olijf overal zichtbaar
- [ ] `prefers-reduced-motion`: proof-cijfers direct op eindwaarde, accordeon zonder transitie
- [ ] Geen hardcoded kleuren/maten buiten de tokens
- [ ] De drie toetsen (§1) per component: ✓/✗ + één regel

## De drie toetsen — zelfcheck Opus op deze batch

1. **Meetlat-zin ✓** — knoplabels in de voorbeelden zeggen exact wat er gebeurt; foutmelding is concreet zonder drama; geen verkoop-taal.
2. **Designtoets ✓** — geen pills, geen schaduwen, geen gradients, geen draai-animaties; salielijnen en crème-vlakken dragen de diepte; plus→min wisselt via opacity i.p.v. rotatie.
3. **Duim-toets ✓** — alle interactieve elementen ≥48px, accordeon-knoppen volle breedte, formulier-labels boven het veld.
