# BATCH 2 — Integratie-instructies voor de agent

Referentie-code van Opus (sprint 1, deel 2). Integreer EXACT; alleen imports/paden aanpassen. Design, spacing, copy en gedrag niet wijzigen.

## Bestanden → plaats in `diba/src/components/ui/`

| Bestand | Component | Type | Bijzonderheid |
|---|---|---|---|
| StickyActionBar.tsx | `StickyActionBar` | client | Signatuurcomponent §8. Gebruikt `Button` (import uit dezelfde map) |
| TreatmentCard.tsx | `TreatmentCard` | server | next/image |
| PriceTable.tsx | `PriceTable` | server | — |
| BeforeAfterSlider.tsx | `BeforeAfterSlider` | client | Signatuur-interactie §8. Drie labels type-verplicht |
| MeasurementBlock.tsx | `MeasurementBlock` | server | Eve-M-visual |

## Verplichte wiring

1. **WhatsApp-nummer → site.ts.** Voeg `DIBA_WHATSAPP_URL` toe aan `diba/src/lib/site.ts` als `[GEGEVEN-NODIG: wa.me-nummer van Okan]` en geef die door aan `StickyActionBar`. Nooit hardcoden in componenten.
2. **StickyActionBar-gedrag is spec, geen bug.** De balk VERSCHIJNT bij scrollen omlaag en VERDWIJNT bij scrollen omhoog (DIBA-RULES §8, letterlijk). Niet "omdraaien omdat het logischer voelt". Alleen op behandel- en pillarpagina's renderen — niet sitewide; nog nergens activeren tot de templates er zijn (sprint 2), behalve op /dev/components ter review.
3. **Primaire-knop-regel.** Op pagina's mét StickyActionBar telt diens intake-knop als primaire knop van het scherm. Bewaak dit straks in de templates (§5).
4. **BeforeAfterSlider beelden.** `sessions`, `timeline`, `skinType` en beide alt-teksten zijn verplicht by design — bouw daar niet omheen. Placeholder-beelden op de dev-pagina: gebruik twee lokale neutrale testbeelden in `public/dev/` gemarkeerd `[BEELD-NODIG: echt voor/na-paar volgens protocol]`. Geen externe/stock-URL's.
5. **Range-input styling.** De slider gebruikt een onzichtbare native range over het beeld. Check in Safari iOS dat er geen native thumb doorschemert; zo ja, voeg in globals.css toe (scoped is niet nodig, hij is toch onzichtbaar):
   ```css
   input[type="range"].appearance-none::-webkit-slider-thumb { -webkit-appearance: none; }
   ```
6. **`inert`.** StickyActionBar gebruikt het `inert`-attribuut wanneer verborgen (correcte focus-verwijdering). Vereist React 19+ — aanwezig in Next 16. Typecheck moet groen zijn; zo niet, melden, niet omzeilen.

## `/dev/components` — toevoegen

```tsx
<StickyActionBar
  whatsappHref={DIBA_WHATSAPP_URL /* [GEGEVEN-NODIG] */}
  intakeHref="/intake"
/>

<TreatmentCard
  href="/behandelingen/voorbeeld"
  image={{ src: "/dev/behandeling.jpg", alt: "[BEELD-NODIG: echte behandelfoto]" }}
  name="[COPY-NODIG: behandelnaam]"
  forWho="[COPY-NODIG: voor wie, één regel klanttaal]"
  priceFrom={0 /* [PRIJS-NODIG] */}
/>

<PriceTable
  caption="[COPY-NODIG: tabeltitel]"
  rows={[
    { name: "[COPY-NODIG]", single: 0, traject: { price: 0, sessions: "5 sessies", perMonth: 0 } }, // [PRIJS-NODIG]
    { name: "[COPY-NODIG]", traject: { price: 0, sessions: "3 sessies" } }, // [PRIJS-NODIG]
  ]}
/>

<BeforeAfterSlider
  before={{ src: "/dev/voor.jpg", alt: "[BEELD-NODIG: bv. huid met melasma vóór behandeling, huidtype IV]" }}
  after={{ src: "/dev/na.jpg", alt: "[BEELD-NODIG: dezelfde huid na behandeling]" }}
  sessions="[COPY-NODIG: x sessies]"
  timeline="[COPY-NODIG: x maanden]"
  skinType="[COPY-NODIG: huidtype x]"
/>

<MeasurementBlock
  context="[COPY-NODIG: traject + meetmoment] [MEDISCHE-CHECK-ROJDA]"
  metrics={[
    { label: "[COPY-NODIG: metriek]", baseline: 100, current: 60 },
    { label: "[COPY-NODIG: metriek]", baseline: 40, current: 70, lowerIsBetter: false },
  ]}
/>
```

(Metric-getallen op de dev-pagina zijn zichtbaar dummy-materiaal op een geblokte review-pagina; in productie uitsluitend echte Eve-M-data.)

## Checklist na integratie (rapporteer)

- [ ] lint ✓ · typecheck ✓ · build ✓ (let op `inert`-typing)
- [ ] 380px: slider met duim bedienbaar over volle breedte; sticky balk overlapt geen content (voeg op de dev-pagina onderaan `pb-24 md:pb-0` toe)
- [ ] Slider: pijltjestoetsen werken; focus zichtbaar op het handvat; iOS Safari geen native thumb
- [ ] StickyActionBar: verschijnt bij omlaag scrollen, weg bij omhoog; geen tab-stops wanneer verborgen
- [ ] `prefers-reduced-motion`: balk zonder translate-animatie; kaart-hover zonder lift
- [ ] Geen hardcoded kleuren/maten buiten tokens; geen nieuwe dependencies
- [ ] Screenshot /dev/components op 380px + desktop → naar Opus (visuele gate voor batch 1+2 samen)

## De drie toetsen — zelfcheck Opus op deze batch

1. **Meetlat-zin ✓** — prijstabel zonder addertjes; meting-blok toont meetcontext verplicht; voor/na kan technisch niet zonder sessies/tijdlijn/huidtype.
2. **Designtoets ✓** — de boldness zit op precies één plek (de slider); verder salielijnen, crème-vlakken, 2px lift maximaal; enige schaduw is het float-token op zwevende elementen.
3. **Duim-toets ✓** — sticky balk onderin duimbereik met safe-area; slider full-width bedienbaar; handvat 44px; tabelcijfers rechts uitgelijnd voor scanbaarheid.

## Volgende (batch 3, sprint 1 afronden)

Navigatie mobiel (volledig-scherm menu, 4 hoofdingangen) + desktop-nav + footer met proof-strip en NAP (Weissenbruchlaan 166, 3054 HG Rotterdam — uit site.ts). Daarna sprint 2: de sjablonen.
