# Instagram @meneermarketing — setup & toegang

## Kan ik in jouw Instagram "zelf" dingen doen?

**Nee, niet direct.** Ik heb geen login op jouw account en kan niet in de Instagram-app browsen alsof ik jij ben.

**Wel kan het systeem straks namens jou publiceren** via de officiële **Meta Instagram Graph API**. Dat vereist een eenmalige setup door jou:

1. Meta Developer App aanmaken op [developers.facebook.com](https://developers.facebook.com)
2. Instagram Business/Creator account koppelen (heb je al: Professional + Facebook)
3. Access token genereren met rechten: `instagram_basic`, `instagram_content_publish`, `instagram_manage_insights`, `instagram_manage_comments`
4. Token + Account ID in `meneer-social-engine/.env.local`

Daarna kan de Social Engine:
- Posts, carousels en Reels plannen en publiceren
- Insights ophalen (reach, saves, shares)
- Comments op jouw posts beheren + reply-suggesties doen

**Wat ik nooit automatiseer:**
- Outbound comments bij andere bedrijven (jij plaatst, AI suggereert)
- DM's naar prospects
- Volgen/ontvolgen

## Account omtoveren (vandaag, ~30 min)

Handle is al goed: **@meneermarketing**

### Profiel

| Veld | Invullen |
|------|----------|
| **Naam** | `Meneer Marketing` (18 tekens, laat ruimte) of `Meneer · Websites & SEO` (24 tekens) |
| **Bio** | Zie opties hieronder |
| **Link** | `https://meneermarketing.nl` |
| **Categorie** | Marketingbureau |
| **Tijdelijk** | `Voorheen FlexDesigns` (2 weken, daarna weg) |

Het naamveld hoeft niet vol. `Meneer Marketing` alleen is sterker dan een dienstenlijstje. Mensen klikken op je foto en bio, niet op je naam.

### Bio

Instagram geeft je 150 tekens. Geen Shopify-opsomming meer. De bio moet voelen als iemand die je kent, niet als een bureaukaart.

**Optie 1, aanbevolen:**
```
Jouw site laat geld liggen. Ik zie waar.
12 jaar. Honderden webdesign + Google cases.
↓ Stuur je URL
```

Direct, persoonlijk, en de eerste regel raakt iedereen die onderneemt. Geen dienstenlijst, want die staat in je content.

**Optie 2, programmeur-verhaal (107 tekens):**
```
12 jaar geleden schreef ik mijn eerste regel code.
Nu schrijf ik funnels die geld opleveren.
↓ Stuur je URL
```

**Optie 3, anti-bureau met humor (104 tekens):**
```
Geen junior. Geen accountmanager. Geen bingo.
Ik ben het. Programmeur. Twaalf jaar groei.
↓ Stuur je URL
```

**Optie 4, kort en scherp (81 tekens):**
```
Programmeur die leerde verkopen.
Twaalf jaar. Shopify · SEO · Ads.
↓ Stuur je URL
```

**Optie 5, alleen een vraag (75 tekens):**
```
Waar blijven jouw bezoekers?
Ik zie het in vijftien minuten.
↓ Stuur je URL
```

Optie 5 werkt alleen als je pinned posts het verhaal vertellen. Zonder die context weet niemand wie je bent.

**Combinatie die ik zou zetten:** naam `Meneer Marketing`, bio optie 1, profielfoto [`avatar.png`](out/avatars/avatar.png).

### Profielfoto

Eén simpel logo: het Meneer-hoofd gecentreerd, niet te groot, op een lichtgrijze achtergrond (`#f3f7fb`, zelfde als de site).

| Bestand | Wat |
|---------|-----|
| [`avatar.png`](out/avatars/avatar.png) | **Dit uploaden.** Gecentreerd hoofd, oranje band op de hoed |

```bash
cd remotion
npm run render:avatar
```

Oudere experimenten (`site.png`, `letter.png`, `groeisnor.png`, etc.) kun je negeren.

### Highlights (covers minimalistisch)

- **START** — wie is Meneer
- **HET WERK** — cases
- **DE REKENING** — wat fouten kosten
- **MENING** — Meneer Zegt clips
- **WAT KOST HET** — prijzen open en bloot

Die laatste is bewust. Iedereen wil het weten, niemand durft het te vragen, en jij bent de enige die er open over is. Dat alleen al levert DM's op.

### Feed opschonen

- [ ] Oude FlexDesigns-posts **archiveren** (niet verwijderen)
- [ ] 3 posts **pinnen** (zie Launch Plan in dashboard)
- [ ] Eerste nieuwe post: overgangsverhaal FlexDesigns → Meneer

### Pinned posts (volgorde)

1. FlexDesigns is nu Meneer Marketing (het verhaal)
2. Sterkste before/after die je hebt (het bewijs)
3. Wat kost een website bij Meneer (de drempel weg)

Volgorde is bewust: verhaal, bewijs, drempel. Een dienstenlijstje op plek twee laat je lijken op precies het bureau waar de bingokaart over gaat.

## Reels / video's

Ja, die maak ik in **jouw stijl** via Remotion (geen Canva, geen random AI-video).

Locatie: [`meneer-social-engine/remotion/`](remotion/)

```bash
cd meneer-social-engine/remotion
npm run dev                    # Remotion Studio preview (1080×1920)
npm run render:reels           # alle drie renderen naar out/reels/
npm run render:de-rekening     # alleen De Rekening
npm run render:meneer-fixt     # alleen Meneer Fixt
npm run render:meneer-zegt     # alleen Meneer Zegt
```

Output: [`out/reels/`](out/reels/) — direct uploadbaar naar Instagram Reels.

### Beschikbare templates

| Composition | Duur | Gebruik |
|-------------|------|---------|
| `HonderdBezoekers` | 24s | **Vlaggenschip.** Honderd bezoekers lopen weg, Meneer legt uit waarom |
| `DeRekening` | 12s | Fout → €/maand → rekensom → fix |
| `MeneerFixt` | 11s | Before → after build reel |
| `MeneerZegt` | 10s | Contraire mening reel |

Props zijn aanpasbaar in Remotion Studio of via JSON vanuit de Social Engine. Elke reel heeft safe zones voor de Instagram UI en een watermerk met Meneer erin.

### Honderd Bezoekers, scene voor scene

De reel die je als eerste plaatst. Bestand: [`out/reels/honderd-bezoekers.mp4`](out/reels/honderd-bezoekers.mp4).

| Moment | Wat je ziet |
|--------|-------------|
| 0,0s | **100** slaat op zwart in beeld. Geen intro, geen logo. |
| 1,0s | Honderd bolletjes landen in het brand-grid. Teller loopt naar 100. |
| 3,0s | Zevenennegentig bolletjes vallen weg. Drie oranje blijven staan. |
| 6,0s | Drie redenen, elk met eigen beeld: hakkelende laadbalk, de vouw, een lege paginatitel. |
| 12,0s | Meneer leunt in beeld en scant de site mee. Zijn ogen volgen de scanner. |
| 14,5s | Drie fixes met vinkjes die zichzelf tekenen. |
| 18,5s | Dezelfde honderd bolletjes, nu elf oranje. Bedrag loopt op. |
| 22,0s | Oranje eindkaart met de vraag om je URL. |

**Waarom dit werkt.** Het getal staat er voor je kunt wegswipen. De leegloop is één beeld dat je niet hoeft uit te leggen. De redenen zijn concreet en de derde is grappig omdat iedereen die titel kent. En de payoff gebruikt dezelfde honderd bolletjes, dus je ziet dat het niet om meer verkeer gaat.

**Audio.** Alle cuts liggen op 120 BPM (vijftien frames per beat). Kies in Instagram een audio rond 120 BPM en de montage loopt synchroon zonder dat je iets hoeft te knippen. Zet de audio op ongeveer 60% zodat de tekst leesbaar blijft in de feed.

**Caption om te plakken:**

```
Honderd mensen op je site. Drie die iets doen.

Dat is geen slechte dag, dat is dinsdag bij de meeste bedrijven.

De reden is bijna nooit je verkeer. Je betaalt of werkt je al rot voor die bezoekers. De reden zit in drie dingen die je zelf niet meer ziet omdat je er elke dag naar kijkt:

Je site laadt te langzaam. Na drie seconden is de helft weg, en dat is niet mijn mening, dat is gedrag.

Je belangrijkste knop staat onder de vouw. Niemand scrolt voor iets waarvan hij het bestaan niet weet.

Je paginatitel zegt niets. Google leest hem ook, en denkt precies hetzelfde als je bezoeker.

Alle drie te fixen. Meestal binnen een dag, zonder je hele site opnieuw te bouwen.

Stuur je URL in een DM. Ik kijk vijftien minuten en zeg je waar het blijft liggen.
```

**Cijfers aanpassen.** Open Remotion Studio, kies `HonderdBezoekers`, en pas de props aan: `visitors`, `leadsBefore`, `leadsAfter`, `monthlyValue`, `loadSeconds`, `fixedLoadTime`, `lameTitle`. Voor een echte case vul je de cijfers van die klant in en render je opnieuw. Zo maak je van één template een hele serie.

## Carousels exporteren als PNG

Alle carousel-slides komen op 1080×1350 uit de dashboard-templates rollen.

```bash
npm run dev                        # server op 3030
npm run export:slides              # alles
npm run export:slides -- DE_REKENING
```

Resultaat staat in `out/slides/`, klaar om te uploaden.

### Screenshots toevoegen aan reels

Plaats bestanden in `remotion/public/` en geef mee als props:

```json
{
  "beforeImage": "cases/bestrest-before.png",
  "afterImage": "cases/bestrest-after.png"
}
```

## Meta API setup (fase 4 — wanneer jij klaar bent)

1. Ga naar [developers.facebook.com/apps](https://developers.facebook.com/apps) → Create App → Business
2. Voeg product **Instagram Graph API** toe
3. Koppel je Facebook-pagina (al gekoppeld aan @meneermarketing)
4. Graph API Explorer → genereer User Token met scopes hierboven
5. Wissel om naar Long-Lived Token (60 dagen, vernieuwbaar)
6. Noteer `INSTAGRAM_BUSINESS_ACCOUNT_ID` via `GET /me/accounts`

Stuur mij de env-vars (niet in chat; alleen in `.env.local`) en ik koppel publicatie aan het dashboard.

## Jouw wekelijkse rol (blijft klein)

| Taak | Tijd | Wie |
|------|------|-----|
| Posts goedkeuren in dashboard | 15 min/maandag | Jij |
| 3–5 echte reacties bij bedrijven | 5 min/dag | Jij |
| Screenshots/cases aanleveren | eenmalig | Jij |
| Content genereren + renderen | automatisch | Engine |
| Publiceren (na API-setup) | automatisch | Engine |
