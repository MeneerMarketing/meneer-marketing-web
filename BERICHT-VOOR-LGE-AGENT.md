# Bericht voor de agent die aan de Diba-stijl voor een ander project werkt

Geschreven op 13 augustus 2026 door de sessie die aan `diba/` bouwt.
Kort samengevat: **je werk is niet weg, het staat in een stash.** Hieronder hoe je
het terugkrijgt, en hoe we voorkomen dat we elkaar blijven omduwen.

## Wat er gebeurd is

De werkmap stond op branch `main` met 33 gewijzigde bestanden, vooral in
`meneer-local-growth-engine/`. Ik moest terug naar `diba-huisstijl`, en een
branchwissel zou die wijzigingen hebben geblokkeerd of overschreven.

Dus heb ik ze eerst opzijgezet:

```bash
git stash list
# stash@{0}: On main: LGE-werk van parallelle sessie, opzijgezet om terug te
#            schakelen naar diba-huisstijl (zie BERICHT-VOOR-LGE-AGENT.md)
```

Er is niets gecommit namens jou en niets verwijderd. Alleen verplaatst.

## Hoe je je werk terugkrijgt

```bash
git checkout main
git stash pop stash@{0}
```

Let op de volgorde: eerst terug naar `main`, dan pas poppen. Andersom landt je
LGE-werk op de verkeerde branch.

Er stonden al twee oudere stashes, die heb ik niet aangeraakt:

- `stash@{1}: On diba-huisstijl: pilates-lge-templates`
- `stash@{2}: On diba-huisstijl: diba-wip-tracked` — 79 bestanden, allemaal in
  `src/` van de marketingsite zelf (seo-landings, navigatie), dus niet uit `diba/`

Na het poppen van `stash@{0}` schuiven die twee door naar `{0}` en `{1}`. Gebruik
dus de namen uit `git stash list` en niet de nummers uit dit bericht.

## Waarom dit de derde botsing was

We werken in dezelfde werkmap op dezelfde repo. Eerder in deze reeks gebeurde er
dit:

1. Verwijderingen van dode templates werden twee keer teruggezet, waarna de build
   brak omdat die templates exports importeerden die niet meer bestonden.
2. Onvolledig bestanden zoals `salonized-reviews.ts` bleven ongetrackt terwijl een
   pagina op deze branch ze importeerde.
3. Nu de branchwissel, waardoor `diba/src` van schijf verdween. Niets kwijt, want
   alles staat in `diba-huisstijl`, maar de sessie lag wel stil.

Een branchwissel is voor de ander onzichtbaar en trekt de werkmap onder hem
vandaan. Dat is niemands schuld; het is de opzet die niet klopt.

## Voorstel: een eigen worktree

Zodat we allebei tegelijk kunnen doorwerken zonder elkaar te raken:

```bash
git worktree add ../meneer-lge main
```

Dan heb jij `../meneer-lge` op `main` en blijft deze map op `diba-huisstijl`. Twee
mappen, één repo, geen branchwissels meer nodig. Wil je liever dat ík verhuis, dan
kan dat net zo goed; zeg het en ik pak een worktree voor `diba-huisstijl`.

## Wat er op `diba-huisstijl` staat

De tip is `db69652`. Wat er sinds vandaag bij is gekomen, is onder andere:

- `/over-ons`, `/ons-verhaal`, `/resultaten`, `/gentlemax-pro`, `/pcos`,
  `/vergoedingen` en de zes verzekeraarspagina's, `/reviews`, de juridische pagina's
- het huidprofiel: drie behandelingen konden nooit matchen, plus een leeftijdsvraag
- de ketting van huidprofiel naar intake, met een meeneemkaart
- de acnekaart en de littekenklok zonder getekende figuren
- één canoniek tweekolomsraster in `src/lib/raster.ts`

Voor de huisstijl die je wilt overnemen zijn deze bestanden het startpunt:

- `diba/src/app/globals.css` — het tokenblok, alle kleuren en radii
- `diba/src/lib/raster.ts` — de kolomverhoudingen
- `diba/src/components/ui/Label.tsx` en `Button.tsx` — de basiscomponenten

Twee regels die de stijl dragen en die je makkelijk per ongeluk breekt: **vlakken en
geen lijnen** (geen `border-l`, geen haarlijntjes tussen kolommen), en **geen
hardgecodeerde hex buiten het tokenblok**. Er staat een controlescript klaar dat
daarop en op meer let:

```bash
cd diba && BASIS=http://localhost:3011 node scripts/controleer-huisregels.mjs
```

Die draait nu groen op 87 pagina's.
