# LUMEN — DESIGN & UITERLIJK

Het complete designsysteem voor de nieuwe LGE huidkliniek-template (codename **LUMEN**).  
Hoe de preview-site eruitziet, voelt en beweegt — op het niveau van DIBA template 2, maar visueel eigen.

**Versie 1.0 · augustus 2026 · Local Growth Engine · skin-clinics vertical**

> **Relatie tot DIBA:** zelfde diepgang en discipline (bewijs, rust, mobile-first, anti-influencer).  
> **Niet** dezelfde look: geen olijfgroen, geen crème/linnen-wereld, geen Archivo/Fraunces/Inter, geen mega-menu-DIBA-chrome.

---

## 1. DE DESIGNVISIE IN ÉÉN ALINEA

De site voelt als binnenlopen in een stille, lichte behandelstudio in de stad: precies, warm in de details, zelfverzekerd zonder te schreeuwen. Luxe zit in contrast (groot naast klein), in tempo (scroll als verhaal) en in één memorabel interactiemoment — niet in decoratie. Alles wat je ziet is echt: echte huid, echte cijfers, echte prijzen. De bezoeker moet binnen vijf seconden voelen: dit is geen spa-template en geen DIBA-kloon — dit is een kliniek die design serieus neemt.

**De designtoets:** ziet dit eruit alsof het uit een Webflow “aesthetic clinic” marketplace komt? Dan is het fout.

**De tweede toets:** lijkt het per ongeluk op dibaclinics.nl? Dan is het ook fout.

---

## 2. DE ZES DESIGNPRINCIPES

1. **Precisie is luxe.** Elke pixel heeft een reden. Witruimte is niet leeg maar gereserveerd. Liever één sterke compositie dan twaalf gelijke kaartjes.

2. **Contrast is het merk.** Het accentkleur-systeem (mineraal blauw) verschijnt alleen waar de site iets belangrijks markeert: actie, bewijs, navigatie-actief. Een pagina vol accent is een pagina zonder merk.

3. **Echte huid, altijd.** Fotografie toont textuur, poriën, lichtval — nooit plastic glam. Onze beelden mogen imperfect-echt zijn; dat is het bewijs.

4. **Bewijs is vorm, geen bijlage.** Reviews, cijfers, traject en voor/na krijgen een vaste, herkenbare visuele component — niet als generieke “social proof section”.

5. **De duim regeert.** Eerst ontwerp op 390px in één hand. Belangrijkste acties bereikbaar zonder reiken. Desktop is de verruimde versie, nooit andersom.

6. **Beweging heeft tempo.** Interactie mag speels en memorabel zijn op **één** plek per pagina. Verder fluistert alles. Geen carnaval, geen bounce.

---

## 3. KLEURSYSTEEM

### 3.1 Merkkleuren (LUMEN-palet)

| Token | Hex | Naam | Rol |
|-------|-----|------|-----|
| `--lumen-ink-900` | `#141820` | Diep grafiet | Koppen op licht, donkere secties, footer |
| `--lumen-ink-700` | `#2A3140` | Leisteen | Secundaire koppen, nav actief |
| `--lumen-mineral-600` | `#3D5A80` | Mineraal (primair) | Primaire knoppen, links, actieve states, accentregels |
| `--lumen-mineral-400` | `#6B8BA8` | Nevel | Eyebrows, iconen, subtiele accenten |
| `--lumen-stone-200` | `#E4E0DA` | Steenlijn | Randen, dividers |
| `--lumen-stone-100` | `#F4F2EE` | Warm papier | Secties, zachte vlakken |
| `--lumen-stone-50` | `#FAFAF8` | Linnen wit | Hoofdachtergrond |

### 3.2 Neutralen & functiekleuren

| Token | Hex | Rol |
|-------|-----|-----|
| `--lumen-text` | `#1A1D24` | Bodytekst (warm zwart — nooit puur `#000`) |
| `--lumen-text-soft` | `#5C6370` | Secundaire tekst |
| `--lumen-text-muted` | `#9CA3AF` | Labels, placeholders |
| `--lumen-white` | `#FFFFFF` | Kaarten op stone, tekst op donker |
| `--lumen-copper` | `#A67C52` | Menselijk warm accent (max 5%: quotes, highlights — nooit primaire knop) |
| `--lumen-success` | `#3D6B5A` | Bevestigingen |
| `--lumen-warn` | `#B0813C` | Aandacht (warm oker) |
| `--lumen-error` | `#9C4038` | Formulierfouten |

### 3.3 Kleurregels

- **70/25/5:** ±70% stone/wit, ±25% tekst, ±5% mineraal (+ copper alleen als menselijk accent in copy/blokken).
- **Maximaal twee donkere volvlakken per homepage:** één voor bewijs, één voor afsluitende CTA. Nooit drie donkere secties achter elkaar.
- Primaire knop = `--lumen-mineral-600` met witte tekst. **Eén** primaire knop per viewport.
- Geen gradients als decoratie. Overlay op foto alleen voor leesbaarheid.
- Geen olijfgroen, geen blush/sage spa-palet, geen neon.
- WCAG 2.2 AA: elke nieuwe tekstkleur meten vóór implementatie.

---

## 4. TYPOGRAFIE

Typografie draagt de persoonlijkheid: **stedelijk, helder, editorial** — professioneel met één speels gewichtsmoment.

### 4.1 De drie rollen

| Rol | Font | Fallback | Gebruik |
|-----|------|----------|---------|
| Display | **Outfit** SemiBold/Bold | system-ui | Hero, sectiekoppen, grote statements |
| Accent | **Newsreader** Italic | Georgia | Pull quotes, één regel per sectie, menselijke stem |
| Body | **IBM Plex Sans** Regular/Medium | system-ui | Lopende tekst, UI, formulieren, prijzen |

**Signatuur-patroon (anders dan DIBA):** geen ALL CAPS + italic woord in de kop.  
Wel: **mono label boven** (IBM Plex Mono 11px, uppercase, tracking) + **grote sentence-case headline** + **tweede regel in mineraal of licht gewicht**.

Voorbeeld:

```
HUIDKLINIEK · ROTTERDAM
Huidwerk met een plan.
Geen gok, wel protocol.
```

Regel: maximaal **één** italic Newsreader-moment per sectie (quote of subregel), nooit in elke kop.

### 4.2 Typografische schaal (mobiel → desktop)

| Niveau | Mobiel | Desktop | Regelafstand |
|--------|--------|---------|--------------|
| Display (H1) | 36px | 72px | 1.05 |
| H2 | 26px | 44px | 1.1 |
| H3 | 20px | 28px | 1.2 |
| Body | 16px | 17px | 1.65 |
| Klein / label | 11px | 11px | 1.4 |
| Cijfers-groot (proof) | 44px | 80px | 1.0 |

**Regel:** hoe groter de tekst, hoe negatiever de letter-spacing (display tot −0.04em).

### 4.3 Typografieregels

- Body nooit in CAPS. Geen gecentreerde lange tekstblokken.
- Geen gedachtestreepjes in marketingcopy.
- Prijzen en proof-cijfers: tabular lining (`font-variant-numeric: tabular-nums`).
- Max ~42 tekens per regel op body (strakker dan DIBA — editorialer).
- **Verboden AI-pairing:** Instrument Serif + Inter, Archivo + Fraunces (DIBA), Playfair + Lato.

---

## 5. LAY-OUT, GRID & RUIMTE

- Spacing: 4px-basis — 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128 / 160.
- Sectie-afstand mobiel 72px, desktop 112–160px. **Ruimer dan je denkt.**
- Grid: 4 kolommen mobiel, 12 desktop, max content 1280px, leesbreedte tekst 640px.
- Breakpoints: 390 · 768 · 1024 · 1440.
- Radius: **8px** kaarten/knoppen, **16px** grote media. Geen pill-knoppen (filter-chips mogen pill).
- Schaduw: bijna nooit. Diepte via vlakken (`stone-100` op `stone-50`) en 1px `--lumen-stone-200`.
- Eén float-shadow voor sticky header: `0 2px 20px rgba(20,24,32,0.08)`.

**Asymmetrie-signatuur (LUMEN):** hero en minstens één contentblok zijn bewust **off-grid** — beeld doorlopend tot rand, tekst in 5 kolommen met 7 kolommen negatieve ruimte of omgekeerd. Geen gestapelde symmetrische 50/50-blokken.

---

## 6. COMPONENTENBIBLIOTHEEK

### 6.1 Navigatie

**Mobiel:** minimale balk (logo + menu). Menu = fullscreen overlay in `--lumen-stone-50`, grote links (32px Outfit), onderaan contact + CTA. Geen mega-dropdowns.

**Desktop:** horizontale nav, tekstlinks met underline-grow hover (mineraal). Rechts één primaire knop. Optioneel: dunne progress-lijn (2px) onder header die vult bij scroll.

**Sticky (signatuur):** op lange pagina’s een **slanke onderbalk mobiel** (niet DIBA’s dubbele ghost+primary): alleen “Plan intake” + tekstlink “Vraag stellen”. Verschijnt na eerste scroll voorbij hero.

### 6.2 Knoppen

| Type | Stijl | Gebruik |
|------|-------|---------|
| Primair | Mineraal vlak, wit, 48px, radius 8px | Eén per viewport |
| Secundair | Stone-100 vlak, mineraal tekst, 1px rand | Alternatieve route |
| Ghost | Alleen mineraal tekst + pijl | Twijfel-route |

Knoppen zeggen wat er gebeurt: “Plan gratis consult”, “Bekijk tarieven”, “Stel je vraag”. Nooit “Ontdek” of “Klik hier”.

### 6.3 Bewijs-componenten (vaste bouwstenen)

**Proof-stack (LUMEN-variant):** verticaal of 2×2 grid met enorme cijfers + dunne steenlijn ertussen — géén horizontale groene band zoals DIBA.

**Review-blok:** één groot quote-moment (Newsreader italic, 28–36px) + naam eronder. Geen sterren-carousel.

**Voor/na-module (signatuur-interactie):** horizontale compare-slider met mineraal handvat; onder beeld verplicht: sessies · tijdlijn · huidtype.

**Protocol-strip:** 4 stappen als horizontale timeline met scroll-snap op mobiel (uniek LUMEN-moment).

### 6.4 Behandelingen

**Treatment-reveal-kaart:** beeld vult kaart, titel en prijs verschijnen bij hover/scroll (desktop) of altijd zichtbaar (mobiel). Subtiele mask-reveal, geen gradient overlay.

Per kaart: naam · 1 regel “voor wie” · vanaf-prijs · link.

### 6.5 Concern-rail (signatuur)

Horizontale scroll met snap: 6–8 huidproblemen als grote tikbare chips/karten. **Het eerste interactieve moment** op de homepage. Geen dropdown “wat is uw huidtype?”.

### 6.6 Formulieren

Labels boven velden, stone-100 achtergrond, 1px rand, mineraal focus-ring (2px). Fouten in `--lumen-error`, concreet geformuleerd.

### 6.7 Prijzen

Volledige prijzen zichtbaar. 2–3 pakketten: middelste “Meest gekozen” met mineraal rand (geen schreeuwerige badge). Trajectprijs + optioneel termijnbedrag klein eronder.

### 6.8 Overig

FAQ-accordeon (steenlijn, +/− mineraal) · team-kaart (portret + naam + 1 regel) · footer (`ink-900`, stone tekst, NAP) · cookiebalk minimaal.

---

## 7. HOMEPAGE-SJABLOON (LGE preview)

Volgorde is richting; compositie mag variëren zolang alle blokken aanwezig zijn.

1. **Hero — de these:** één sterk beeld (full-bleed of asymmetrisch). Mono label + grote kop + 1 zin sub. Primaire CTA. Geen carrousel.
2. **Concern-rail:** horizontale scroll huidproblemen (signatuur).
3. **Proof-stack:** 4 cijfers.
4. **Behandelingen:** 3–6 treatment-reveal-kaarten.
5. **Protocol-strip:** intake → analyse → plan → nazorg (horizontaal, scroll-snap mobiel).
6. **Over / vertrouwen:** korte tekst + 1 sfeerbeeld of team-foto.
7. **Reviews:** 1–3 quotes, editorial.
8. **Team:** 1–3 specialisten.
9. **Tarieven:** pakketten of tabel.
10. **FAQ:** 4–6 items.
11. **Afsluiting:** donker vlak (`ink-900`) met intake-CTA + twijfel-route (ghost).
12. **Footer.**

**Placeholder merk:** Atelier Huid · Rotterdam (generiek genoeg voor LGE previews).

---

## 8. FOTOGRAFIE & BEELD

**Drie woorden:** echt, licht, dichtbij.

- Echt: echte kliniek, echte huid, geen stock glam, geen AI-gezichten.
- Licht: groot raam, daglicht, koel-warm neutraal (past bij stone-palet).
- Dichtbij: macro textuur, handen bij behandeling, detail apparatuur.

**Niet:** kaarsen, handdoekstapels, roze filters, influencer poses.

**Voor/na:** zelfde protocol als DIBA (sessies, tijdlijn, huidtype labels verplicht).

---

## 9. BEWEGING & INTERACTIE

| Type | Duur | Easing |
|------|------|--------|
| Micro (hover, focus) | 150–220ms | `cubic-bezier(0.25, 0.8, 0.25, 1)` |
| Sectie-reveal | 400–500ms | zelfde |
| Signature interactie | 300–600ms | ease-out |

- Scroll-reveal: secties `translateY(16px)` + fade, once.
- Proof-cijfers: count-up bij eerste view (800ms, once).
- **Concern-rail + voor/na-slider** = de twee plekken met uitgesproken interactie. Rest subtiel.
- `prefers-reduced-motion`: alles statisch, geen count-up.
- Laden: skeleton in `stone-100`, images blur-up.

---

## 10. ICONOGRAFIE

- Dunne lijn (1.5px), Lucide-basis, `ink-700` of `mineral-600`.
- Geen gekleurde emoji-iconen, geen blob-illustraties.
- Functionele illustratie alleen: gezichtszones, tijdlijn — lijnstijl in `stone-200` + mineraal accent.

---

## 11. TOEGANKELIJKHEID

WCAG 2.2 AA: contrasten gevalideerd, focus zichtbaar (2px mineraal), keyboard-nav, labels op formulieren, alt-teksten beschrijvend, touch ≥48px, tekst tot 200% zoombaar. Test op iPhone SE + gemiddelde Android.

---

## 12. DO'S & DON'TS

**Nooit:** spa-template vibes · DIBA-kloon (groen, mega-menu, hero-in-kaartje) · pop-ups · countdown · carrousel-hero · verborgen prijzen · meerdere primaire knoppen · “glow up”-copy · pill-knoppen overal · bento met gradient overlays

**Altijd:** prijzen zichtbaar · één volgende stap · twijfel-route · echte beelden · proof als vorm · mobiel eerst · concern-rail of equivalent signatuur-moment

---

## 13. DESIGN TOKENS (VOOR DEVELOPER)

```css
:root {
  /* Kleur */
  --lumen-ink-900: #141820;
  --lumen-ink-700: #2a3140;
  --lumen-mineral-600: #3d5a80;
  --lumen-mineral-400: #6b8ba8;
  --lumen-stone-200: #e4e0da;
  --lumen-stone-100: #f4f2ee;
  --lumen-stone-50: #fafaf8;
  --lumen-text: #1a1d24;
  --lumen-text-soft: #5c6370;
  --lumen-copper: #a67c52;
  --lumen-error: #9c4038;

  /* Type */
  --font-display: "Outfit", system-ui, sans-serif;
  --font-accent: "Newsreader", Georgia, serif;
  --font-body: "IBM Plex Sans", system-ui, sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, monospace;

  /* Ruimte */
  --space-1: 4px;
  --space-2: 8px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;
  --space-24: 96px;
  --space-32: 128px;

  /* Vorm */
  --radius-sm: 8px;
  --radius-lg: 16px;
  --border-line: 1px solid var(--lumen-stone-200);
  --shadow-float: 0 2px 20px rgba(20, 24, 32, 0.08);

  /* Beweging */
  --ease-lumen: cubic-bezier(0.25, 0.8, 0.25, 1);
  --dur-micro: 200ms;
  --dur-reveal: 450ms;
}
```

Fonts via `next/font`, self-hosted, `font-display: swap`.

---

## 14. GOVERNANCE & FIGMA-WORKFLOW

1. Dit document is bron voor template **LUMEN** in `meneer-local-growth-engine`.
2. Elke pagina langs drie toetsen:
   - **Kliniek-toets:** zou een behandelaar dit zo presenteren?
   - **Anti-spa-toets:** kan dit een gratis Webflow template zijn?
   - **Anti-DIBA-toets:** lijkt het op dibaclinics.nl?
3. Figma: eerst hero + concern-rail tot het uniek voelt, dan rest van homepage.
4. Design frames: desktop 1440 + mobiel 390 + annotaties bij signature moments.
5. Code-implementatie: nieuwe variant onder `clinical-lumen/` (na goedkeuring design).

---

## 15. KORTE FIGMA-PROMPT (plak bovenaan je sessie)

```
Volg het LUMEN design document: premium huidkliniek, ultra high-end, modern, speels op 1-2 interactieplekken. Mineraal/stone palet, Outfit + IBM Plex + Newsreader. Geen spa-template, geen DIBA-kloon (geen groen, geen mega-menu, geen hero-in-wit-kaartje). Homepage met concern-rail, proof-stack, treatment-reveal cards, protocol-strip, voor/na-slider. Desktop 1440 + mobiel 390. Placeholder: Atelier Huid, Rotterdam.
```

---

*LUMEN — Design & Uiterlijk v1.0 · Local Growth Engine · Precisie is luxe. Bewijs is vorm. Contrast is het merk.*
