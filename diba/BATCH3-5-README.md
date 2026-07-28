# BATCH 3.5 — De handtekening-laag: integratie-instructies

Nieuwe merkdocumenten (Stijl & Stem, De Gracht, Het Verbond) zijn verwerkt. Twee dingen in deze batch: nieuwe wet + nieuwe/aangepaste componenten. Integreer EXACT.

## 1. Wet bijwerken

- Zet **DIBA-RULES-ADDENDUM-v1.1.md** naast DIBA-RULES.md in de repo-root. Beide zijn wet; bij conflict wint het addendum.
- **De vier toetsen vervangen de drie toetsen** in al je rapportages vanaf nu: logo-afplak · behandelaar · influencer · tien-jaar.

## 2. Bestanden

| Bestand | Actie |
|---|---|
| ProofStrip.tsx | **VERVANGT** v2 volledig |
| Heading.tsx | Nieuw → `diba/src/components/ui/Heading.tsx` |
| DeLijn.tsx | Nieuw → `diba/src/components/ui/DeLijn.tsx` |

## 3. ProofStrip v3 — call-sites bijwerken

- Cijfers zijn nu ink (Green Touch: groen alleen waar het ertoe doet).
- Nieuw optioneel `highlightLabel` — MAXIMAAL ÉÉN per strip. Gebruik per context het cijfer dat er dáár toe doet. Op de dev-pagina: `highlightLabel="Klantreviews"` als demonstratie. In de footer: GEEN highlight (rustig afsluiten).
- Teller start nu ~150px vóór zichtbaarheid; de footer-nullen uit de vorige screenshots zijn daarmee in de praktijk weg.

## 4. BeforeAfterSlider — handvat wordt de punt van De Lijn (A11.4)

In `diba/src/components/ui/BeforeAfterSlider.tsx`, in het handvat-`<span>`, vervang exact deze drie klassen:

```
border border-[var(--diba-green-700)] bg-[var(--diba-cream-50)]
text-[var(--diba-green-700)]
```

door:

```
border border-[var(--diba-cream-50)] bg-[var(--diba-green-700)]
text-[var(--diba-cream-50)]
```

Resultaat: olijf gevulde punt met crème pijlen — het meetmoment op de lijn. Verder NIETS wijzigen aan de slider.

## 5. `/dev/components` — toevoegen (bovenaan, vóór KNOPPEN)

```tsx
<Heading as="h1" text="Eerlijk advies voor *jouw* huid" lijn />
<Heading as="h2" text="Is het *nodig*?" />
<DeLijn length="lang" dot={62} />
```

Let op: `text` schrijf je in zin-case; CAPS komt uit CSS (zo blijft het accentwoord in kleine letters, precies het signatuur-patroon).

## 6. llms.txt + metadata voorbereiden (klein, nu doen)

Zet in `diba/src/lib/site.ts` de canonieke zin als exporteerbare constante `DIBA_CITAAT` — woord voor woord uit Addendum A8, niets herformuleren. Gebruik hem alvast als `description` in de root-metadata van `layout.tsx` en in `public/llms.txt` (aanmaken). De overige verplichte plekken volgen in sprint 2.

## 7. Sitemap-notitie (geen bouw nu)

Fase 1 krijgt twee extra pagina's: `/ons-verbond/` en `/is-het-nodig/`. Niet nu bouwen — Opus levert ze mét de sjablonen in sprint 2. Alleen noteren in je routeplanning; footer-/menu-links volgen dan ook.

## Checklist na integratie (rapporteer met de VIER toetsen)

- [ ] lint ✓ · typecheck ✓ · build ✓
- [ ] Heading: accentwoord olijf + Fraunces italic + kleine letters binnen CAPS-kop; De Lijn eronder met punt rechts
- [ ] Proof-strip dev-pagina: één cijfer olijf (Klantreviews), rest ink; footer-strip zonder highlight
- [ ] Slider: olijf handvat met crème pijlen
- [ ] `DIBA_CITAAT` in site.ts + meta-description + `public/llms.txt`
- [ ] Screenshot dev-pagina 380px + desktop → Opus

## De vier toetsen — zelfcheck Opus op deze batch

1. **Logo-afplak ✓** — accentwoord-in-olijf + De Lijn + de ink/olijf-proofstrip zijn precies de elementen die Diba zonder logo herkenbaar maken.
2. **Behandelaar ✓** — "Is het *nodig*?" als demo-kop is letterlijk de merkvraag; geen verkooptaal toegevoegd.
3. **Influencer ✓** — geen enkele toevoeging is kopieerbaar influencer-vocabulaire; de punt op de lijn komt uit het meetgedrag, niet uit decoratie.
4. **Tien-jaar ✓** — lijn, punt, accentwoord en het citaat zijn tijdloos vastgelegd in de merkdocumenten zelf.
