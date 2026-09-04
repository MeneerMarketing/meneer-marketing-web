# Meneer Marketing Video

Programmatische promo-video's voor Meneer Marketing, gebouwd met [Remotion](https://www.remotion.dev/).

## Brand

- Accent `#FF5722`, tekst `#0f172a`, lichte achtergrond met subtiel grid
- Grote bold typografie (Plus Jakarta Sans), veel witruimte, één boodschap per scene
- Animaties via `useCurrentFrame` + `interpolate` (geen CSS transitions)
- Tokens in [`src/brand.ts`](src/brand.ts)

## Compositions

| ID | Formaat | Afmetingen | FPS | Duur |
|---|---|---|---|---|
| `MM-Promo-15s` | Landscape promo | 1920×1080 | 30 | 15s |
| `MM-Reel-9x16` | Vertical reel | 1080×1920 | 30 | 15s |
| `MM-Square-1x1` | Square social | 1080×1080 | 30 | 15s |

## Setup

```bash
cd meneer-marketing-video
npm i
```

## Preview (Remotion Studio)

```bash
npm run dev
```

Open Studio en kies een composition in de sidebar onder **Meneer-Marketing**.

## Render commands

Alle formats:

```bash
npx remotion render MM-Promo-15s out/mm-promo-15s.mp4
npx remotion render MM-Reel-9x16 out/mm-reel-9x16.mp4
npx remotion render MM-Square-1x1 out/mm-square-1x1.mp4
```

Snelle still voor layout-check (1 seconde = frame 30):

```bash
npx remotion still MM-Promo-15s out/preview-promo.png --frame=30
npx remotion still MM-Reel-9x16 out/preview-reel.png --frame=30
npx remotion still MM-Square-1x1 out/preview-square.png --frame=30
```

ProRes (hogere kwaliteit, groter bestand):

```bash
npx remotion render MM-Promo-15s out/mm-promo-15s.mov --codec=prores
```

Transparante achtergrond (WebM):

```bash
npx remotion render MM-Square-1x1 out/mm-square-transparent.webm --image-format=png --codec=vp8
```

## Projectstructuur

```
src/
  brand.ts              # Kleuren, spacing, typografie-schaal
  fonts.ts              # Google Fonts (Plus Jakarta Sans)
  Root.tsx              # Composition-definities
  components/
    GridBackground.tsx  # Subtiel grid
    HeadlineScene.tsx   # Eén boodschap per scene
  compositions/
    MeneerPromoVideo.tsx
```

## Lint & typecheck

```bash
npm run lint
```
