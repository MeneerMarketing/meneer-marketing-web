# SPRINT 2A — Sjablonen deel 1: integratie-instructies

Besluiten onder mandaat van Okan, vastgelegd: **naamsysteem = JA** (Het Acneplan · Het Pigmentplan · Het Laserplan; De Nulmeting; Behandeling Nul). Voer overal door in copy en data.

## Bestanden

| Bestand | Plaats |
|---|---|
| schema.tsx | `diba/src/lib/schema.tsx` |
| HomeTemplate.tsx | `diba/src/components/templates/HomeTemplate.tsx` |
| PillarTemplate.tsx | `diba/src/components/templates/PillarTemplate.tsx` |

Imports gaan uit van `../ui/*` en `../../lib/schema` — pas aan indien de repo-structuur afwijkt, verder niets.

## 1. Schema-laag

- `DIBA_CITAAT` staat nu in `schema.tsx` — als site.ts al een kopie heeft: laat site.ts uit schema.tsx importeren (één bron, nooit twee definities).
- `medicalClinicSchema` renderen in de root-layout (of home): nap uit site.ts, url = productiedomein-constante `DIBA_SITE_URL` (toevoegen aan site.ts: `https://dibaclinics.nl`), sameAs = GBP/Instagram/TikTok-URL's `[GEGEVEN-NODIG]`.
- Telefoon pas doorgeven zodra echt `[GEGEVEN-NODIG]`.

## 2. Routes bouwen

**Homepage:** vervang de huidige `diba/src/app/page.tsx` door een page die `HomeTemplate` rendert met data uit een nieuw `diba/src/data/home.ts`. Alle content daarin met de bekende placeholder-tags; de teksten die al IN het template staan zijn canoniek of door Opus geschreven en blijven staan.

**Pillars:** `diba/src/app/huidproblemen/[slug]/page.tsx` + `diba/src/data/pillars.ts`:

```ts
import type { PillarContent } from "@/components/templates/PillarTemplate";

export const PILLARS: PillarContent[] = [
  {
    slug: "acne",
    titel: "Acne: eerst begrijpen, dan *behandelen*",
    herkenning: "[COPY-NODIG] [MENSELIJKE-ZIN] [MEDISCHE-CHECK-ROJDA]",
    beeld: { src: "/dev/behandeling.svg", alt: "[BEELD-NODIG: echte huidsituatie]" },
    uitleg: { kop: "Wat er in je huid *gebeurt*", alineas: ["[COPY-NODIG] [MEDISCHE-CHECK-ROJDA]"] },
    welNiet: { wel: ["[COPY-NODIG]"], niet: ["[COPY-NODIG]"] },
    pad: {
      naam: "Het Acneplan",
      belofte: "De Nulmeting + [x] behandelingen + thuisfase",
      stappen: [
        { titel: "De Nulmeting", tekst: "[COPY-NODIG]" },
        { titel: "Behandelplan", tekst: "[COPY-NODIG]" },
        { titel: "Behandelingen", tekst: "[COPY-NODIG]" },
        { titel: "Thuisfase", tekst: "[COPY-NODIG]" },
      ],
      // trajectPrijs/perMonth/losVanaf: [PRIJS-NODIG]
    },
    resultaten: [], // pas vullen bij echte voor/na-paren volgens protocol
    reviews: [],    // pas vullen uit Salonized-export
    vergoeding: { tekst: "[COPY-NODIG: zorgprofiel-uitleg] [MEDISCHE-CHECK-ROJDA]" },
    faq: [{ question: "[COPY-NODIG]", answer: "[COPY-NODIG]" }],
  },
  // 19 pillars: alleen dit acne-skelet + pigmentvlekken nu aanmaken;
  // de rest volgt zodra Opus de master-copy levert (sprint 3) — GEEN dunne pagina's.
];
```

`generateStaticParams` uit PILLARS; `generateMetadata` per pillar (title = titel zonder sterretjes + " | Diba Clinics", description `[COPY-NODIG]`). SSG, geen dynamic rendering.

**BELANGRIJK (regel §15/addendum):** maak NIET alvast 19 lege pillar-routes aan. Twee skeletten (acne, pigmentvlekken) voor review; live-uitrol pas met echte content.

## 3. Template-details die je niet mag "verbeteren"

- Hero-kop op home is canoniek: "Wij behandelen niet om te *behandelen*".
- Speerpunt-blok laser is bewust diep-den met salie-accentwoord (Green Touch op donker); dit is het enige donkere blok op de homepage.
- Proof-strip highlights: home = "Behandelingen", pillar = "Klantreviews". Eén per strip, niet uitbreiden.
- PillarTemplate heeft `pb-24 md:pb-0` op main voor de sticky balk — laten staan.
- StickyActionBar staat ALLEEN in PillarTemplate (en straks behandel-template), niet op home.

## 4. Checklist (rapporteer met de vier toetsen)

- [ ] lint ✓ · typecheck ✓ · build ✓ (alles SSG)
- [ ] `/` toont HomeTemplate volledig op 380px én desktop; hero-beeld priority, geen CLS
- [ ] `/huidproblemen/acne` toont alle 8 secties; sticky balk verschijnt bij omlaag scrollen
- [ ] View-source: MedicalClinic-, BreadcrumbList- en FAQPage-JSON-LD aanwezig en valide (test met Google Rich Results)
- [ ] DIBA_CITAAT exact identiek in schema, meta-description en llms.txt
- [ ] Screenshots home + acne-pillar (380px + desktop) → Opus

## Hierna: sprint 2b (Opus)

Behandelpagina-template · teampagina-template · /ons-verbond/ · /is-het-nodig/ · daarna sprint 3: master-copy voor de 19 pillars.
