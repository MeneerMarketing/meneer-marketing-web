# Overdracht: nieuwe Diba-versie naar de Vercel-testlink

Voor de sessie die `diba-self.vercel.app` heeft opgezet.
Geschreven 14 augustus 2026.

Er staat een nieuwe versie van de site klaar. Hij is nog nooit gepusht, dus je hebt
hem nog niet gezien.

## Waar het staat

| | |
|---|---|
| Branch | `diba-huisstijl` |
| Tip | `d451686` |
| Map | `diba/` in deze repo |
| Gepusht | **nee**, 136+ commits voor op `origin/main` |
| `diba/` op `origin/main` | bestaat daar niet |

De branch bouwt op zichzelf. Ik heb dat geverifieerd met een losse worktree en een
schone `npm install` plus `npm run build`: 99 pagina's, groen.

## Wat ik aan jouw bestanden heb gedaan

Acht bestanden van jou stonden **ongetrackt** in de gedeelde werkmap. Ze werkten
lokaal, maar de branch bouwde daardoor niet vanuit een schone checkout. Ik heb ze
getrackt gemaakt, inhoudelijk onaangeroerd:

- `src/components/figma/FigmaReviewCard.tsx` — wordt geïmporteerd door het getrackte
  `FigmaReviewsExperience.tsx`
- `src/components/ui/SalonizedScorePanel.tsx` — geïmporteerd door `/laserontharing`
- `src/middleware.ts`, `src/lib/preview-auth.ts`, `src/app/preview-login/`,
  `src/app/api/preview-auth/`, `vercel.json` — de wachtwoordbeveiliging

Die laatste groep is de belangrijkste. Zonder die commit zou een deploy vanaf deze
branch de site **zonder wachtwoord** live hebben gezet, en dat wil je hier niet (zie
hieronder).

## Voor je deployt: het inhoudelijke risico

De site staat vol met dingen die nog langs de kliniek moeten:

- **247 `[MEDISCHE-CHECK-ROJDA]`** — waaronder de nazorgtermijnen, instructies waar
  mensen thuis naar handelen, en de koppeling huidtype naar laser-golflengte
- **22 `[BESLUIT-OKAN]`** — of de verzekeraarspagina's blijven, of de huidtherapeuten
  KP-geregistreerd genoemd mogen worden, de annuleringstermijnen
- **De algemene voorwaarden worden bindend zodra ze publiek staan.** 24 uur
  annuleren, 50 procent bij no-show, 14 dagen betaaltermijn: dat zijn voorstellen,
  geen besluiten van de kliniek
- `POORTJE_ACTIEF` in `src/lib/pagina-af.ts` staat op **`false`**, dus niets draagt
  `noindex`

Zolang de wachtwoordbeveiliging aanstaat is dat allemaal geen probleem: Google komt
er niet in. **Zet die dus niet uit** en zet `PREVIEW_PASSWORD` in Vercel voordat je
deployt.

Gaat het ooit naar productie zonder wachtwoord, zet dan eerst `POORTJE_ACTIEF` op
`true`. Dan blijft alles met een openstaande vlag uit de index terwijl de pagina's
via een directe link bereikbaar blijven. Die schakelaar is daar precies voor gebouwd.

## Wat er in deze versie zit

Nieuw of herschreven sinds jouw deploy:

- `/over-ons`, `/ons-verhaal`, `/resultaten`, `/gentlemax-pro`, `/pcos`,
  `/vergoedingen` plus de zes verzekeraarspagina's, `/reviews`, `/cookiebeleid`,
  `/privacybeleid`, `/algemene-voorwaarden`
- **Huidprofiel**: drie behandelingen konden nooit matchen (acne, haaruitval en
  steelwratjes bestonden niet als doel), plus een leeftijdsvraag omdat de twee
  acnetrajecten alleen daarin verschillen
- **Huidprofiel naar intake**: een meeneemkaart die je profiel naar je klembord
  kopieert, zodat je het zelf meestuurt. Bewust geen verzendknop, want het profiel
  hoort in de browser te blijven
- `/intake`: duur en prijs stonden leeg terwijl het bedrag in `behandelingen.ts`
  stond
- **Tools**: het getekende hoofd op de acnepagina en de kronkelstreep op de
  littekenpagina zijn vervangen; die waren bijna alleen lijn terwijl deze huisstijl
  met vlakken bouwt
- **Uitlijning**: er stonden negentien verschillende kolomverhoudingen door elkaar.
  Nu één canonieke maat in `src/lib/raster.ts`

## Controle voor je deployt

```bash
cd diba
npm run build
npm run start:lan          # poort 3011
BASIS=http://localhost:3011 node scripts/controleer-huisregels.mjs
```

Die laatste let op redactievlaggen die op het scherm belanden, de u-vorm buiten
juridische pagina's, em-streepjes en horizontale overflow op een iPhone SE. Draait
nu groen op 87 pagina's. Als hij iets meldt na jouw wijzigingen, is dat een echte
bevinding.

## Werkmap

We zaten in dezelfde map van branch te wisselen, wat drie keer misging. Er bestaan al
worktrees (`mm-main-deploy`, `mm-web-deploy`), dus dat patroon is hier al gangbaar:

```bash
git worktree add ../diba-deploy diba-huisstijl
```

Dan kun je deployen zonder dat iemands werkmap onder hem vandaan wordt geschakeld.
