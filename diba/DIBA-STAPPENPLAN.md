# DIBA-STAPPENPLAN.md — Uitvoeringsplan & rolverdeling

> Gebaseerd op de fasering uit het Diba Digitaal Masterplan v1.1.
> Drie rollen: **Okan** (beslissingen, assets, accounts) · **Opus** (Claude, de architect: complexe bouwstenen, referentie-code, copy-fundament) · **Agent** (Cursor/Composer: uitvoering in de repo, uitrol, integratie).

## Het principe van de rolverdeling

**Opus bouwt wat maar één keer goed hoeft:** het design system, de sjablonen, de signatuurcomponenten, de complexe logica (configurator-motor, intake-flow, tools), de SEO/schema-architectuur en de master-copy. Alles wat fout gebouwd het hele project vergiftigt.

**De agent bouwt wat vaak moet:** integreren van Opus' referentie-code in de repo, uitrollen van sjablonen over tientallen pagina's, CMS-koppelingen, beeldpipeline, lint/build/fixes, en alle mechanische varianten (zones, verzekeraars, wijken).

**Okan beslist en levert:** stack-akkoord, prijzen, content-feiten, Aleks-beelden, accounts (Salonized API, Mollie, Klaviyo, WhatsApp Business), en de wekelijkse review — op een telefoon, niet op een beamer.

---

## FASE 0 — Deze week (dag 1–3): fundament leggen

| # | Taak | Wie |
|---|---|---|
| 0.1 | DIBA-RULES.md + dit stappenplan in de repo-root zetten, kickoff-prompt naar de agent sturen | Okan |
| 0.2 | **Repo-audit:** stack, versies, structuur, wat herbruikbaar is, wat weg moet. Output: kort rapport. STOPT daarna en wacht op akkoord. | Agent |
| 0.3 | Besluit op audit: verder bouwen op bestaande repo of schoon Next.js-fundament | Okan (+ Opus adviseert o.b.v. rapport) |
| 0.4 | Design tokens + self-hosted fonts (Archivo, Fraunces, Inter) + basis-layout (container, grid, sectie-spacing) + CI (lint, typecheck, build) | Agent |
| 0.5 | Referentie-build kerncomponenten, batch 1: knoppen (3 types), proof-strip, reviewkaart, FAQ-accordeon, formulierveld + focus-stijlen | Opus |
| 0.6 | Los van de site: Google-reviewflow aanzetten (Salonized/Klaviyo + balie-QR), Search Console-check na hack-opschoning | Okan |

## FASE 1 — Fundament & livegang (week 1–8)

### Sprint 1 (week 1–2): het design system compleet
- **Opus:** referentie-build batch 2: sticky actiebalk · behandelkaart · prijstabel/prijs-componenten · voor/na-slider (signatuur!) · meting-blok (Eve-M) · navigatie mobiel + desktop · footer met proof-strip
- **Agent:** batch 1 + 2 integreren in de repo, Storybook-achtige componentenpagina (`/dev/components`) zodat alles visueel te reviewen is, View Transitions + scroll-reveal-systeem + reduced-motion
- **Okan:** Aleks shotlist fase 1 in gang zetten (team, hero's, per behandeling 5 foto's + 1 video, interieur)

### Sprint 2 (week 3–4): de sjablonen
- **Opus:** homepage-template (hero-these + intent-router "Wat speelt er bij jouw huid?" met 6 ingangen) · pillarpagina-template (het 8-staps sjabloon uit §15 van de rules) · behandelpagina-template · teampagina-template · SEO/schema-architectuur (alle JSON-LD-generatoren als typed functions)
- **Agent:** templates integreren, contentmodel opzetten (getypeerde content-bestanden of headless CMS-schema's, meertalig-klaar), beeldpipeline (AVIF/WebP, blur-up, alt-verplicht)
- **Okan:** prijzen en behandelfeiten aanleveren (per behandeling: prijs, sessies, duur, nazorg)

### Sprint 3 (week 5–6): content-uitrol kern
- **Opus:** master-copy voor de 19 pillars (structuur + eerlijkheidssecties + FAQ-vragen per pillar; medische vlag voor Rojda) · copy homepage, over-ons/ons-verhaal (founder story staat al in merkdocument §15), "Dit behandelen wij niet"
- **Agent:** 19 pillarpagina's uitrollen · doelgroeppagina's (jongeren, mannen, huid-van-kleur, bruiden) · prijzenpagina (filterbaar) · vergoedingen-hoofdpagina + top-6 verzekeraars · GentleMax Pro-bewijspagina · PCOS-pagina · team + resultatengalerij v1 · reviews on-site (Salonized-import) · nazorg-tijdlijnen top-5
- **Okan:** reviews-export uit Salonized, verzekeraars-feiten checken, Rojda's medische check inplannen

### Sprint 4 (week 7–8): polish & livegang
- **Agent:** technische SEO compleet (sitemaps, robots, llms.txt, canonicals, redirects van oude URL's!) · Salonized-boekflow · a11y-sweep · CWV-optimalisatie · 404/500 · analytics (GA4 server-side + Clarity)
- **Opus:** launch-review: elke pagina langs de Definition of Done, laatste copy-slag
- **Okan:** GO/NO-GO op de telefoon

## FASE 2 — Conversiemachine (week 8–16)

- **Opus bouwt de motoren:** laser-configurator (lichaamsmodel, zone-selectie, live prijsopbouw, pakketlogica, huidtype-vraag, deel/mail) · digitale intake (één vraag per scherm, foto-upload met begeleiding, uitkomst + Klaviyo-event) · de drie ster-tools: trajectplanner met einddatum, vergoedingschecker, scheerkosten-calculator — allemaal op één gedeelde tool-motor (vragenflow + resultaatkaart + prijsberekening)
- **Agent rolt uit:** trajecten vooraf boekbaar (Mollie aanbetaling + termijnen) · WhatsApp Business-integratie · review-mining op pillarpagina's · Academy-uitbouw · programmatic SEO (laserzones, verzekeraars, wijken — alléén met unieke content) · huidtype-test + acne-zelfcheck als tool-motor-varianten · cadeaubonnen · EN-versie
- **Okan:** Mollie/WhatsApp-accounts, tool-copy medisch laten checken, video-antwoordenbank opnamedag

## FASE 3 — Digitale kliniek (maand 4–8)

- **Opus (architectuur + kern):** Mijn Diba / Skin Passport · AI-concierge (Claude API, harde regels: nooit diagnoses, altijd route naar het team) · foto-pre-scan
- **Agent:** slimme wachtlijst · referral · Diba Circle · PWA · eerste Huid-Index-publicatiepagina

---

## Werkritme

- **Dagelijks:** jij stuurt de agent taak voor taak uit dit plan; complexe bouwstenen haal je bij Opus en geef je als "integreer dit exact" aan de agent.
- **Wekelijks (30 min):** Okan × dashboard × site op een telefoon. Meet: online intakes/week, configurator→boeking %, laadtijd, CWV, Google-reviews-teller.
- **Elke oplevering:** de drie toetsen + Definition of Done uit DIBA-RULES.md §16.7.

## De gouden overdrachtsregel Opus → Agent

Alles wat Opus levert is **referentie-code die exact gevolgd wordt**. De agent mag integreren, imports fixen en aan de repo-conventies aanpassen, maar mag design, spacing, copy of gedrag NIET "verbeteren". Wijzigingsvoorstellen gaan terug naar Okan/Opus.
