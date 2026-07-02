================================================================
  BEST REST — PROJECT UPDATE & ROADMAP
  Voortgangsrapport | Opgesteld door: Yasin
================================================================

> **Bijgewerkt:** 19 juni 2026 (sessie 2)  
> **Cursor:** *"Update best-rest — [taak] klaar"* · *"Log X uur Best Rest — [omschrijving]"*  
> **Uren:** [best-rest-logboek.md](./best-rest-logboek.md)

**Store:** `e7d264-97.myshopify.com` · **Live theme:** `ecomus-v2-2-1-official` (#188460532058)  
**Repo:** alle BestRest-code in `shopify-theme-bestrest/` (prefix `br-*`) — **niet** mixen met `shopify/` (Skin Complete).

**Deploy-flow (Windows):**
```powershell
cd shopify-theme-bestrest
shopify theme push --store e7d264-97.myshopify.com --theme 188460532058 --allow-live --only <pad/naar/bestand>
```
Gebruik `;` i.p.v. `&&`. Per bestand een apart `--only`.

**Strategie:** *Motor eerst, dan gas* — site + tracking + feed op orde, **daarna** Google Ads
opschalen (campagnes draaien al; overname + optimalisatie = prioriteit week 26).

**Dev-uren tot nu toe:** ~18,5 uur (zie logboek). Strategie/meeting: ~1 uur.

================================================================
  NU OPEN — PRIORITEIT WEEK 26
================================================================

| # | Taak | Waar | Status |
|---|------|------|--------|
| 1 | Admin: 15+ pagina's aanmaken + `page.br-*` template (zie Fase 0) | Shopify Admin | ⏳ |
| 2 | Google Ads audit + campagnestructuur | Google Ads | ⏳ |
| 3 | Alle producten op `br-pdp` template | Shopify Admin | ⏳ |
| 4 | Merchant Center feed (titels, EAN, labels) | Merchant Center | ⏳ |
| 5 | 31 resterende maat-LP's uitrollen | Theme + Admin | 📋 template klaar |
| 6 | GA4 purchase tracking + Ads conversiekoppeling | GTM/GA4 | ⏳ |
| 7 | WordPress 301-redirects importeren | Shopify Admin | ⏳ |

================================================================
  FASE 0: DIRECTE ACTIE — ADMIN & VERIFICATIE
================================================================

Code staat grotendeels in repo + live theme. Onderstaande punten
zijn **Shopify Admin**-taken die nog handmatig moeten.

----------------------------------------------------------------
⏳ PAGINA'S AANMAKEN + JUISTE TEMPLATE TOEWIJZEN
----------------------------------------------------------------

Elke pagina → **Online winkel → Pagina's → Template** (niet default `page`).

| Pagina (handle) | Template | Section |
|-----------------|----------|---------|
| `/pages/kennisbank` | `page.br-kennisbank` | `page-kennisbank` |
| `/pages/slaapwijzer` | `page.br-slaapwijzer` | `page-slaapwijzer` |
| `/pages/slaapwijzer-resultaat` | `page.br-slaapwijzer-result` | `page-slaapwijzer-result` |
| `/pages/matras-kopen` | `page.br-matras-kopen` | `page-lp-matras-kopen` |
| `/pages/topdekmatras-kopen` | `page.br-topdekmatras-kopen` | `page-lp-topdekmatras` |
| `/pages/hr-koudschuim-matras` | `page.br-hr-koudschuim` | `page-lp-hr-koudschuim` |
| `/pages/boxspring-kopen` | `page.br-boxspring-kopen` | `page-lp-boxspring-kopen` |
| `/pages/nederlands-fabrikaat-matras` | `page.br-nl-fabrikaat` | `page-lp-nl-fabrikaat` |
| `/pages/matras-warm-slaper` | `page.br-warm-slaper` | `page-kb-warm-slaper` |
| `/pages/matras-rugpijn` | `page.br-rugpijn` | `page-kb-rugpijn` |
| `/pages/matras-zijslaper` | `page.br-zijslaper` | `page-kb-zijslaper` |
| `/pages/wat-is-hr45` | `page.br-glossary-hr45` | `page-kb-hr45` |
| `/pages/pocketvering-uitleg` | `page.br-glossary-pocketvering` | `page-kb-pocketvering` |
| `/pages/traagschuim-uitleg` | `page.br-glossary-traagschuim` | `page-kb-traagschuim` |
| `/pages/faq` | `page.br-faq` | `page-veelgestelde-vragen` |
| `/pages/proefslapen` | `page.br-proefslapen` | `page-proefslapen` |
| `/pages/over-ons` | `page.br-over-ons` | `page-over-ons` |
| `/pages/contact` | `page.br-contact` | `page-contact` |
| `/pages/certificeringen` | `page.br-certificeringen` | `page-certificeringen` |
| `/pages/showroom` | `page.br-showroom` | `page-showroom` |
| `/pages/sitemap` | `page.br-sitemap` | `page-sitemap` |
| `/pages/buikslaper` | `page.br-buikslaper` | `page-kb-buikslaper` |
| `/pages/apart-slapen` | `page.br-apart-slapen` | `page-kb-apart-slapen` |
| `/pages/matras-stevigheid` | `page.br-stevigheid` | `page-kb-stevigheid` |
| `/pages/matras-vervangen` | `page.br-matras-vervangen` | `page-kb-matras-vervangen` |
| `/pages/topper-vs-matras` | `page.br-topper-vs-matras` | `page-kb-topper-vs-matras` |
| `/pages/comfort-index` | `page.br-comfort-index` | `page-kb-comfort-index` |
| `/pages/matras-90x200` | `page.br-maat-90x200` | `page-lp-maat` |
| `/pages/matras-120x200` | `page.br-maat-120x200` | `page-lp-maat` |
| `/pages/matras-140x200` | `page.br-maat-140x200` | `page-lp-maat` |
| `/pages/matras-160x200` | `page.br-maat-160x200` | `page-lp-maat` |
| `/pages/matras-180x200` | `page.br-maat-180x200` | `page-lp-maat` |

**Maat-pagina's:** template `page-lp-maat` dekt alle maten; nu 5 pilotpagina's in repo.
Overige 31 maten = zelfde template dupliceren + handle instellen in Admin.

**Check:** pagina's die nog default `page` gebruiken tonen lege witte/zwarte blokken
(Ecomus `main-heading` + lege `main-page`). Fix = juiste `page.br-*` template.

----------------------------------------------------------------
⏳ PRODUCTEN — PDP-TEMPLATE UITROLLEN
----------------------------------------------------------------

1. **Producten** → open product → **Thema-template** → `br-pdp`
2. Theme editor: verberg standaard Ecomus **"Main product"**
3. Zichtbaar houden: **BestRest — Product koopblok** + **BestRest — Deep dive**
4. Pilot: Aloë Vera topdekmatras + Pocketveer Comfort Basic (volledige deep-dive branches)
5. Overige producten: generieke deep-dive fallback tot dedicated branch gebouwd is

**Formaat-varianten:** optie **Formaat** / **Maat** → dropdown (36 standaard maten).
Bulk-import CSV: `data/bestrest-formaat-varianten.csv` *(indien aanwezig in repo)*.

----------------------------------------------------------------
⏳ REDIRECTS & INDEXATIE
----------------------------------------------------------------

* 301-redirects importeren van oude WordPress-URL's (CSV klaar in repo-sessie)
* Google Search Console: sitemap indienen, kernpagina's indexeren
* Controleer live: `/pages/kennisbank`, SEO LPs, Slaapwijzer-resultaat

----------------------------------------------------------------
⏳ FOTOGRAFIE / ASSETS
----------------------------------------------------------------

Shotlist gemaakt voor fotograaf (Downloads: `BestRest_Shotlist_Fotograaf.txt`).
Deep-dive + PDP gebruiken placeholders tot shoot opgeleverd is:
packshots, macro/textuur, lagen-opbouw, lifestyle, fabriek, video.

================================================================
  FASE 1: VOLTOOIDE FUNDERING — WAT ER AL LIVE STAAT
================================================================

----------------------------------------------------------------
✅ STRATEGIE & MEETING (JUNI 2026)
----------------------------------------------------------------

* **BestRest_Meeting_Masterdocument.txt** — volledig groeiplan (24 secties)
* **BestRest_Voorstel_Simpel.txt** — klantversie in begrijpelijke taal
* **BestRest_Shotlist_Fotograaf.txt** — foto/video shotlist
* Positionering: *NL-fabrikaat, eerlijke fabrieksprijs, slaapexpertise*
* Roadmap: motor (site + tracking) → Google Ads overname & schalen → SEO + e-mail

----------------------------------------------------------------
✅ PRODUCTPAGINA'S (PDP) — KOOPBLOK + DEEP DIVE
----------------------------------------------------------------

| Bestand | Functie |
|---------|---------|
| `sections/br-product-master.liquid` | Custom koopblok (USP-stack, galerij, maat, ATC) |
| `sections/br-product-deep-dive.liquid` | SEO-laag 2: lagen, FAQ schema, maattabel, vergelijking |
| `snippets/br-product-master.liquid` | Koopblok markup |
| `snippets/br-product-schema.liquid` | Product JSON-LD |
| `templates/product.br-pdp.json` | Template: master + deep-dive |

**Product-specifieke deep dives (volledig):**
* Aloë Vera topdekmatras (`br_is_aloe_topper`)
* Pocketveer Comfort Basic (`br_is_pocketveer_matras`)

**Overige producten:** generieke fallback (geen dedicated HR-koudschuim-matras branch).

----------------------------------------------------------------
✅ HOMEPAGE — CINEMATIC + CONVERSIE
----------------------------------------------------------------

| Section | Functie |
|---------|---------|
| `br-homepage-hero` | Cinematic hero (video) via `snippets/br-hp-hero.liquid` |
| `br-homepage-trust-marquee` | Trust strip (WebwinkelKeur, proefslapen, NL-fabrikaat) |
| `br-homepage-featured` | Bestsellers (Aloë + Pocketveer) |
| `br-slaapwijzer` | Slaap-Architect quiz op homepage |
| `br-homepage-guides` | Links naar koopgidsen + kennisbank |
| `br-homepage-showroom` | Showroom Dieren (geen witte marge) |
| `br-homepage-sticky-cta` | Mobiele sticky CTA |

**Homepage-volgorde** (`templates/index.json` + `scripts/patch-homepage-clean.js`):
hero → trust marquee → featured → slaapwijzer → collecties → carousels →
guides → FAQ → testimonials → showroom → sticky CTA

**Opgeschoond:** USP-strip, dubbele map, legacy Ecomus-blokken disabled.
**Gap-fix:** `snippets/br-global-fixes.liquid` — section-marges + lege Ecomus-shells verbergen.

----------------------------------------------------------------
✅ SLAAP-ARCHITECT (SLAAPWIJZER)
----------------------------------------------------------------

* `sections/br-slaapwijzer.liquid` — 7 vragen, interactief
* `sections/page-slaapwijzer-result.liquid` — resultatenpagina met product-CTA
* `templates/page.br-slaapwijzer.json` + `page.br-slaapwijzer-result.json`
* Drie winsten: conversie ↑, e-mail capture, expert-positionering

----------------------------------------------------------------
✅ SEO LANDINGPAGES (5) — UNIEKE LAYOUTS
----------------------------------------------------------------

Gedeelde basis: `snippets/br-lp-tokens.liquid` (typografie, knoppen, scroll-reveal).

| Pagina | Section | Unieke elementen |
|--------|---------|------------------|
| Matras kopen | `page-lp-matras-kopen` | Maat-kiezer, stevigheid-tabs, timeline |
| Topdekmatras | `page-lp-topdekmatras` | Laag-stack, vergelijking, Aloë spotlight |
| HR koudschuim | `page-lp-hr-koudschuim` | Materiaal-toggle, cel-visualisatie, bento |
| Boxspring | `page-lp-boxspring-kopen` | Beddiagram, alternating bands |
| NL-fabrikaat | `page-lp-nl-fabrikaat` | Fabriek-timeline, trust wall |

Elk template: `templates/page.br-*.json` (alleen `main`-section).

----------------------------------------------------------------
✅ KENNISBANK — HUB + 11 PILLAR-PAGINA'S
----------------------------------------------------------------

**Hub:** `sections/page-kennisbank.liquid` — cinematic hero, zoek/filter,
sticky categorie-nav, featured cards, bento grids, tools, dark CTA.

**Pillar pages** (gedeelde styles: `snippets/br-kb-styles.liquid`):

| Section | Onderwerp |
|---------|-----------|
| `page-kb-warm-slaper` | Warme slapers |
| `page-kb-rugpijn` | Rugpijn |
| `page-kb-zijslaper` | Zijslapers |
| `page-kb-buikslaper` | Buikslapers *(nieuw 19 jun)* |
| `page-kb-apart-slapen` | Apart slapen / partnerverstoring *(nieuw)* |
| `page-kb-stevigheid` | Matras stevigheid kiezen *(nieuw)* |
| `page-kb-matras-vervangen` | Wanneer matras vervangen *(nieuw)* |
| `page-kb-topper-vs-matras` | Topper vs nieuw matras *(nieuw)* |
| `page-kb-hr45` | HR45 schuimdichtheid |
| `page-kb-traagschuim` | Traagschuim vs HR |
| `page-kb-pocketvering` | Pocketvering 7 zones |
| `page-kb-comfort-index` | BestRest Comfort Index |

Per pagina: hero, trust stats, TOC, lange SEO-blok, FAQ grid, JSON-LD.
Veilige productafbeeldingen: `snippets/br-kb-product-figure.liquid` (CDN-fallback).

**Copy polish:** "Glossarium" → **Begrippen**; AI-look nummers (01/02/03) verwijderd.

----------------------------------------------------------------
✅ TECHNISCHE SEO & CRO (FASE 1–4, ZONDER E-MAIL)
----------------------------------------------------------------

* **Collection SEO:** `snippets/br-collection-seo-head.liquid`
* **Page SEO:** `snippets/br-page-seo-head.liquid`
* **JSON-LD graph:** `snippets/br-jsonld-graph.liquid`
* **hreflang:** nl-NL / nl-BE / x-default in `layout/theme.liquid`
* **AEO:** `assets/llms.txt`
* **Cart upsells:** `sections/system-group.json` — "Maak je slaap compleet" (Aloë topper)
* **Footer kennisbank-link:** `sections/br-site-footer.liquid`
* **Hub links grid:** `snippets/br-seo-hub-links.liquid`
* **Default page.json:** lege Ecomus-shells verwijderd/verborgen

----------------------------------------------------------------
✅ BUGFIXES (KRITIEK)
----------------------------------------------------------------

**Lege SEO-secties (opacity: 0):**
* Oorzaak: `br-lp-tokens.liquid` script liep vóór DOM → geen `.br-lpt-reveal` gevonden
* Fix: progressive enhancement — zichtbaar by default, `DOMContentLoaded` + fallback

**Liquid error warm-slaper (regel 91):**
* `invalid url input` op `all_products[...].featured_image | image_url`
* Fix: `br-kb-product-figure.liquid` met `featured_media.preview_image` + fallback

**Homepage witte balken:** map + USP-strip margins → `br-global-fixes` + showroom section

**Featured Liquid syntax:** ontbrekende `endif` na pocket-product loop — gefixt

**PDP deep-dive stat alignment (19 jun):** NL-vlag + "Eigen productie" misalignment → flex + min-height op stat-blokken.

----------------------------------------------------------------
✅ SEO BATCH 2 — KB-UITBREIDING + MAAT-LP'S (19 JUN 2026)
----------------------------------------------------------------

**5 nieuwe kennisbank-pagina's** (templates + sections in repo, SEO head live):

| Pagina | Template | Section |
|--------|----------|---------|
| Buikslaper | `page.br-buikslaper` | `page-kb-buikslaper` |
| Apart slapen koppel | `page.br-apart-slapen` | `page-kb-apart-slapen` |
| Matras stevigheid | `page.br-stevigheid` | `page-kb-stevigheid` |
| Matras vervangen | `page.br-matras-vervangen` | `page-kb-matras-vervangen` |
| Topper vs matras | `page.br-topper-vs-matras` | `page-kb-topper-vs-matras` |

**Overige content-pagina's in repo:** Comfort Index, Showroom Dieren, HTML-sitemap.

**Programmatische maat-LP's (pilot 5):**

| Template | Maten |
|----------|-------|
| `page.br-maat-*` → `page-lp-maat` | 90×200, 120×200, 140×200, 160×200, 180×200 |

* Unieke title/meta per maat via `snippets/br-page-seo-head.liquid`
* Visual fix: matras-ratio in hero (aspect-ratio i.p.v. vaste hoogte)
* **Admin:** pagina's aanmaken + template toewijzen (zie Fase 0)

----------------------------------------------------------------
✅ HEADER V2 — SKY MODE + UX (19 JUN 2026)
----------------------------------------------------------------

| Onderdeel | Bestand | Status |
|-----------|---------|--------|
| Homepage | Transparante cinema-header (`br-sh--home`) | ✅ |
| Inner pages | Adaptieve sky-topbar + glazen pill (`br-sh--sky`) | ✅ live |
| Sky topbar | Gedeelde USP-marquee met homepage | ✅ |
| Mega menu | `syncMegaTop()` — positie vanaf pill, geen wit vlak | ✅ |
| Scroll | Hysteresis + sky-bar hide via transform | ✅ |
| Pill radius | 100px → **18px** (minder capsule-vorm) | ✅ |
| Slaapwijzer CTA | Periodieke aandacht-animatie op "Wat past bij mij?" | ✅ |

**Teruggedraaid (klantwens 19 jun):** curated nav met Deals + categorie-icoontjes → terug naar standaard Shopify `main-menu` loop. Snippets blijven in repo (`br-header-shop-nav`, etc.) maar zijn niet actief.

| Snippet | Functie |
|---------|---------|
| `br-header-sky-topbar.liquid` | Lucht-topbar inner pages |
| `br-header-sky-styles.liquid` | Sky CSS |
| `br-header-sky-script.liquid` | Dag/nacht sky + scroll |
| `br-header-topbar-marquee.liquid` | Gedeelde USP-marquee |

----------------------------------------------------------------
✅ CTA & CONVERSIE-UPGRADE (19 JUN 2026)
----------------------------------------------------------------

| Bestand | Functie |
|---------|---------|
| `snippets/br-cta-rich.liquid` | Rich buttons + trust row (herbruikbaar) |
| `snippets/br-cta-banner.liquid` | Banner-variant met rich CTAs |
| `sections/page-slaapwijzer-result.liquid` | Resultaatpagina UI + animaties |
| Homepage sections | Hero, showroom, featured, sticky CTA → rich buttons |

Slaapwijzer sessionStorage uitgebreid met profiel + productmeta voor resultaatpagina.

----------------------------------------------------------------
✅ OVERIGE PAGINA'S (BESTAAND)
----------------------------------------------------------------

* FAQ, Proefslapen, Over ons, Contact, Certificeringen
* Header/footer: `br-site-header.liquid`, `br-site-footer.liquid`

================================================================
  FASE 2: MARKETING MASTERPLAN — MAXIMUM UIT BESTREST HALEN
================================================================

Positionering: **Nederlands fabrikaat · eerlijke fabrieksprijs · echte slaapexpertise**
— zonder Emma-marketingopslag of Beter Bed-winkeloverhead.

**Huidige situatie (nulmeting):**
* ~€10k/maand eigen webshop · groot deel omzet via Bol.com (marge-lekkage)
* Google Ads draaien al → overname + herstructurering + budget opschalen
* Technische basis in theme grotendeels klaar; admin + tracking + feed = blocker vóór schaal

**KPI's (6 maanden):**

| KPI | Nu (indicatie) | Doel 6 mnd |
|-----|----------------|------------|
| D2C omzet/maand | ~€10k | €25k–€40k |
| ROAS Google Ads | meten | ≥ 4,0 (Shopping/PMax) |
| Organisch verkeer | baseline | +80% |
| Conversieratio PDP | meten | ≥ 2,5% |
| Gem. orderwaarde | meten | +15% (upsells) |
| Bol.com vs D2C mix | ~70/30 | 50/50 richting D2C |

----------------------------------------------------------------
1. WEEK 1–2 — FOUNDATION (VOOR BUDGET OPSCHALEN)
----------------------------------------------------------------

**Admin (blocker):**
* [ ] Pagina's + `page.br-*` templates (zie Fase 0)
* [ ] Redirects WordPress → Shopify
* [ ] Alle producten op `br-pdp`
* [ ] Search Console + GA4 property gekoppeld

**Tracking (non-negotiable vóór meer ad spend):**
* [ ] GA4 e-commerce events: `view_item`, `add_to_cart`, `begin_checkout`, `purchase`
* [ ] Google Ads conversiekoppeling (import GA4 purchases + enhanced conversions)
* [ ] Meta Pixel + CAPI (indien Meta later mee)
* [ ] UTM-template: `utm_source=google&utm_medium=cpc&utm_campaign={campaign}&utm_content={adgroup}`
* [ ] Conversiewaarde = werkelijke orderwaarde (niet vaste waarde)

**Merchant Center / feed (direct impact op Shopping ROAS):**
* [ ] Titels: `[Merk] [Product] [Type] [Maat] — NL Fabrikaat | 100 Nachten Proefslapen`
* [ ] GTIN/EAN per variant invullen (Bol.com-data hergebruiken)
* [ ] Hoofdafbeelding: witte achtergrond packshot (Google-eis)
* [ ] Extra afbeeldingen: lifestyle + lagen-opbouw
* [ ] Custom labels: marge, bestseller, voorraadstatus
* [ ] Exclude: out-of-stock varianten automatisch

**CRO quick wins (elke 0,1% CR = minder CPA):**
* [ ] Reviews zichtbaar bij koopknop (Judge.me/Kiyoh/WebwinkelKeur widget)
* [ ] "100 nachten proefslapen" + "Gratis verzending NL & BE" boven vouw
* [ ] Financiering: "of 3× €X" bij prijs
* [ ] Cart upsell: topper bij matras (system-group uitbreiden)

----------------------------------------------------------------
2. GOOGLE ADS — OVERNAME, OPTIMALISATIE & SCHAALPLAN
----------------------------------------------------------------

**Stap A — Audit bestaande campagnes (dag 1–3):**

Checklist bij overname:
* Welke campagnetypes draaien? (Search / Shopping / PMax / Display)
* Huidig dagbudget + maandspend
* Conversieacties: purchase vs. add_to_cart (alleen purchase optimaliseren)
* Search terms report: irrelevante queries?
* Landing pages: product vs. homepage vs. categorie
* Quality Score op top-keywords
* Impression share + lost IS (budget vs. rank)
* Device split (mobiel = 70%+ bij matrassen)

**Stap B — Nieuwe campagnestructuur:**

```
Account: BestRest NL (+ BE apart of geo-targeting)
│
├── 🛒 Performance Max — "PMax Core Products"
│   ├── Asset groups: Aloë Topper | Pocketveer Matras | Overige matrassen
│   ├── Listing groups: per producttype + marge-prioriteit
│   ├── Audience signals: converters, Slaapwijzer-bezoekers, remarketing
│   └── Doel: ROAS ≥ 4,0 · 60% van totaal budget
│
├── 🛒 Standard Shopping — "Shopping High-Margin"
│   ├── Alleen bestsellers + hoge marge
│   ├── Manual CPC → later tROAS wanneer data
│   └── Doel: controle + learning data naast PMax
│
├── 🔍 Search — "Brand + High Intent"
│   ├── Brand: "bestrest", "best rest matras", "bestrest topper"
│   ├── Non-brand high intent:
│   │     topdekmatras kopen | aloe vera topper | pocketveer matras
│   │     matras kopen nederland | matras nederlandse fabriek
│   ├── Ad copy: USP's (NL-fabrikaat, 100 nachten, 9,8 WebwinkelKeur)
│   └── Landing: PDP of dedicated LP (niet homepage)
│
├── 🔍 Search — "Problem-Aware" (fase 2, maand 2+)
│   ├── warm slaper matras | matras rugpijn | matras zijslaper
│   ├── hr45 matras | traagschuim vs koudschuim
│   └── Landing: kennisbank-pillar pages (al gebouwd)
│
├── 📺 Demand Gen / YouTube (maand 3+, als video assets er zijn)
│   └── Fabriek, unboxing, Slaapwijzer — awareness → remarketing
│
└── 🔄 Remarketing Display (laag budget)
    ├── Cart abandoners (7 dagen)
    ├── PDP viewers geen ATC (14 dagen)
    └── Slaapwijzer gestart, niet afgerond
```

**Stap C — Negatieve keywords (direct toevoegen):**

| Categorie | Voorbeelden |
|-----------|-------------|
| Gratis / goedkoop | gratis matras, matras gratis, goedkoop matras action |
| Vacatures | vacature, werk, job |
| Tweedehands | tweedehands, marktplaats, used |
| Concurrenten (optioneel) | emma matras, beter bed, ikea matras |
| Verkeerde intent | matras ophalen, matras wegbrengen, matras reinigen |
| B2B/wholesale | groothandel, inkopen bulk |

**Stap D — Budget-fasering (ROAS-gestuurd):**

| Fase | Periode | Dagbudget (indicatie) | Voorwaarde |
|------|---------|----------------------|------------|
| 1 Audit + fix | Week 1–2 | huidig budget behouden | Tracking + feed OK |
| 2 Herstructureren | Week 3–4 | +20–30% | Purchase tracking 100% |
| 3 Schalen | Maand 2 | +50% | ROAS ≥ 3,5 over 14 dagen |
| 4 Aggressief | Maand 3–4 | +100% vs. start | ROAS ≥ 4,0 + CR stabiel |
| 5 Seizoenspeak | Q4 (nov) | max budget | Black Friday / 11.11 prep |

**Regel:** nooit budget verdubbelen zonder 14 dagen stabiele ROAS + voldoende conversiedata
(min. 30 purchases/maand per campagne voor Smart Bidding).

**Stap E — Ad copy frameworks:**

*Headline-varianten (rotate):*
* `NL-Fabrikaat Matras — Direct uit Dieren`
* `100 Nachten Proefslapen — Gratis Retour`
* `9,8 WebwinkelKeur — BestRest Matrassen`
* `Aloë Vera Topper — Vanaf €XXX`

*Description:*
* Gratis verzending NL & BE · Achteraf betalen · Showroom in Dieren
* Geen tussenhandel — fabrieksprijs · Slaapwijzer: vind jouw matras in 2 min

**Stap F — Landing page ↔ keyword mapping:**

| Keyword-cluster | Landing page |
|-----------------|--------------|
| topdekmatras / aloe vera topper | PDP Aloë + `/pages/topdekmatras-kopen` |
| pocketveer matras | PDP Pocketveer + `/pages/matras-kopen` |
| matras kopen / matras kopen online | `/pages/matras-kopen` |
| hr koudschuim / koudschuim matras | `/pages/hr-koudschuim-matras` |
| boxspring kopen | `/pages/boxspring-kopen` |
| nederlands matras / nl fabrikaat | `/pages/nederlands-fabrikaat-matras` |
| warm slaper / rugpijn / zijslaper | KB pillar pages |
| merknaam | Homepage of bestseller PDP |

----------------------------------------------------------------
3. SEO — ORGANISCH GROEIPLAN (GRATIS VERKEER = LAGERE BLENDED CPA)
----------------------------------------------------------------

**Technisch (maand 1):**
* [ ] Core Web Vitals groen (LCP < 2,5s mobiel)
* [ ] Sitemap indienen + indexatie monitoren (Search Console)
* [ ] 301-redirects compleet (WordPress-migratie)
* [ ] Canonical + hreflang ✅ (al in theme)
* [ ] Schema audit: Product, FAQ, BreadcrumbList, Organization
* [ ] `llms.txt` ✅ — uitbreiden bij nieuwe pagina's

**On-page silo's (interne linkstructuur):**

```
Homepage
├── Koopgidsen (5 SEO LPs) ←→ PDP producten
├── Kennisbank hub
│   ├── Begrippen (HR45, pocketvering, traagschuim)
│   └── Slaapproblemen (warm, rugpijn, zijslaper)
├── Slaapwijzer → resultaat → PDP
└── Collecties (matrassen, toppers, boxsprings)
```

* [ ] Elke pagina: 1 primair keyword, unieke title/H1/meta
* [ ] Kannibalisatie-check: geen 2 pagina's op exact hetzelfde keyword
* [ ] Interne links: min. 3 contextuele links per pillar page
* [ ] Breadcrumbs op alle content-pagina's

**Content — uitbreiding (maand 1–3):**

| Prioriteit | Pagina / content | Keyword-focus | Status |
|------------|------------------|---------------|--------|
| P1 | Programmatische maat-pagina's | matras 160x200, matras 180x200, etc. | 📋 5/36 live in repo |
| P1 | 5 SEO LPs upgraden naar KB-niveau | zelfde keywords, diepere content | ⏳ |
| P2 | 5 nieuwe KB-pagina's (buikslaper, stevigheid, etc.) | longtail slaaphouding | 📋 repo klaar, admin nodig |
| P2 | HR koudschuim matras deep dive PDP | hr koudschuim matras kopen | ⏳ |
| P2 | Blog/kennisbank: "Hoe kies je stevigheid" | matras stevigheid kiezen | ✅ `page-kb-stevigheid` |
| P2 | Blog: "Topper of nieuw matras" | topper of matras vervangen | ✅ `page-kb-topper-vs-matras` |
| P3 | Blog: "Matras vervangen wanneer" | wanneer matras vervangen | ✅ `page-kb-matras-vervangen` |
| P3 | Blog: "Bol.com vs direct kopen" | (branded + vergelijking) | ⏳ |

**Programmatische maat-pagina's (grote SEO-kans):**
* Template: `sections/page-lp-maat.liquid` + `templates/page.br-maat-*.json`
* **5 pilot live in repo:** 90×200, 120×200, 140×200, 160×200, 180×200
* Nog **31 maten** uit te rollen (zelfde template, unieke handle + SEO defaults)
* Unieke intro per maat (niet duplicate content) + direct naar variant in PDP
* Schema: Product + FAQ ("Past 160x200 in mijn bed?")

**Local SEO (showroom Dieren = vertrouwen + "matras kopen dieren"):**
* [ ] Google Business Profiel: foto's, openingstijden, categorie, Q&A
* [ ] NAP consistent (Naam, Adres, Postcode) op site + GBP
* [ ] Reviews stimuleren op Google (niet alleen WebwinkelKeur)
* [ ] Lokale landing: "Matras kopen in Dieren / Gelderland / Arnhem regio"

**Off-page (maand 2–6):**
* Bol.com: profiel met link naar eigen shop ( waar toegestaan )
* Persbericht NL-fabrikaat / 100 nachten proefslapen → lifestyle/slaapmedia
* Guest posts: slaapbloggers, interieurblogs
* Leveranciers/partners: backlink van stofleveranciers, certificeringsinstanties

**Featured snippets & AEO:**
* FAQ-schema op elke pillar ✅ — uitbreiden met "People Also Ask"-vragen
* Korte definities bovenaan artikelen ("Wat is HR45? HR45 is…")
* Tabellen: stevigheid vs gewicht, matras vs topper vergelijking

----------------------------------------------------------------
4. META ADS — RETARGETING & CATALOG (MAAND 2+)
----------------------------------------------------------------

* **Catalog:** Shopify → Meta product feed (zelfde titels als Merchant Center)
* **Campaign 1 — DPA Retargeting:** PDP viewers 14d, cart abandoners 7d
* **Campaign 2 — Prospecting:** lookalike 1–3% van purchasers (pas bij 100+ sales)
* **Creatives:** UGC-style video (9:16), carousel met lagen-opbouw, Slaapwijzer CTA
* **Budget:** start 15–20% van totaal paid budget na Google stabiel is

----------------------------------------------------------------
5. E-MAIL & RETENTION (Klaviyo — MAAND 2+)
----------------------------------------------------------------

| Flow | Trigger | Doel |
|------|---------|------|
| Welkom | Nieuwsbrief / Slaapwijzer opt-in | Merk + Slaapwijzer + bestseller |
| Verlaten winkelwagen | Cart abandon 1u / 24u / 72u | Herstel 8–12% carts |
| Post-purchase | Order +14 dagen | Review request + verzorgtips |
| Cross-sell | Matras gekocht +30d | Topper / kussen aanbieden |
| Win-back | Geen aankoop 90d | Seizoensactie / nieuw product |

* Slaapwijzer-resultaat → e-mail capture → gepersonaliseerd advies mail
* Segmentatie: matras-kopers vs. topper-kopers vs. Slaapwijzer-only

----------------------------------------------------------------
6. CONVERSIE — NOG TE BOUWEN (TECH)
----------------------------------------------------------------

* HR koudschuim matras deep-dive branch + overige bestsellers
* PDP urgentie: voorraad / levertijd dynamisch
* Judge.me / Kiyoh: sterren + foto-reviews bij ATC
* Sticky ATC desktop
* Cart upsells uitbreiden (kussens, molton, hoeslaken)
* Slaapwijzer → e-mail gate vóór resultaat (A/B testen)
* 3D/exploded view wanneer fotoshoot binnen is

----------------------------------------------------------------
7. PERFORMANCE & MOBIEL
----------------------------------------------------------------

* Core Web Vitals groen vóór PMax-budget ×2
* Lazy load audit, ongebruikte Ecomus CSS/JS strippen
* Mobiel QA: 70%+ ad traffic = telefoon

----------------------------------------------------------------
8. CONTENT & SOCIAL (ORGANISCH BEREIK)
----------------------------------------------------------------

| Kanaal | Frequentie | Content |
|--------|------------|---------|
| Instagram/TikTok | 3×/week | Fabriek BTS, unboxing, Slaapwijzer clips |
| YouTube | 2×/maand | "Hoe kies je een matras", fabriek tour |
| Pinterest | 5 pins/week | Slaapkamer inspiratie → product pins |
| Blog/KB | 2×/maand | SEO-longtail artikelen |

* Hergebruik fotoshoot: 1 shoot → 50+ social assets
* Spark Ads / boost best performers (€5–10/dag test)

================================================================
  FASE 3: 12-WEKEN ACTIEPLAN (EXECUTIE)
================================================================

| Week | Focus | Deliverables |
|------|-------|--------------|
| **1** | Admin + tracking | Pagina's live, redirects, GA4/Ads conversies, feed audit |
| **2** | Google Ads audit | Campagnestructuur herzien, negatives, landing mapping |
| **3** | CRO + reviews | PDP rollout, review widget, cart upsell uitbreiden |
| **4** | Ads herlaunch | PMax + Shopping live, brand Search, baseline ROAS meten |
| **5** | SEO technisch | CWV fix, indexatie, resterende 31 maat-pagina's |
| **6** | SEO content | 5 maat-pilot's in Admin + LP-upgrades start |
| **7** | Ads schalen +20% | Als ROAS ≥ 3,5; Search non-brand problem-aware |
| **8** | E-mail flows | Klaviyo: cart abandon + welkom + post-purchase |
| **9** | Meta retargeting | Catalog + DPA live |
| **10** | SEO batch 2 | 20 maat-pagina's + 2 blogartikelen |
| **11** | Ads schalen +50% | Als ROAS ≥ 4,0; Demand Gen test (video) |
| **12** | Review + local | GBP optimalisatie, review-campagne, Q4 prep start |

**Maandelijkse rapportage aan klant:**
* Omzet D2C vs. vorige maand
* ROAS / CPA / conversieratio per campagne
* Organisch verkeer + top keywords (Search Console)
* Top 5 search terms (positief + negatief voorstel)
* A/B resultaten + volgende maand prioriteiten

================================================================
  BESTANDEN — SNELLE REFERENTIE
================================================================

```
shopify-theme-bestrest/
├── layout/theme.liquid          # hreflang, br-global-fixes, br-collection-seo
├── sections/
│   ├── br-homepage-*.liquid     # Homepage blocks
│   ├── br-slaapwijzer.liquid
│   ├── br-product-*.liquid      # PDP
│   ├── br-site-header.liquid    # Header V2 + sky mode
│   ├── page-lp-*.liquid         # 5 SEO LPs + page-lp-maat
│   ├── page-kb-*.liquid         # 11 KB pillars (+ comfort-index)
│   ├── page-kennisbank.liquid   # Hub
│   └── page-slaapwijzer-result.liquid
├── snippets/
│   ├── br-lp-tokens.liquid      # LP shared CSS/JS
│   ├── br-kb-styles.liquid      # KB shared CSS
│   ├── br-kb-product-figure.liquid
│   ├── br-cta-rich.liquid       # Rich CTA buttons
│   ├── br-cta-banner.liquid
│   ├── br-header-sky-*.liquid   # Sky header (inner pages)
│   ├── br-header-v2-styles.liquid
│   ├── br-global-fixes.liquid
│   └── br-*-seo-head.liquid
├── templates/
│   ├── index.json               # Homepage volgorde
│   ├── page.br-*.json           # 32 page templates
│   ├── page.br-maat-*.json      # 5 maat pilots
│   └── product.br-pdp.json
├── assets/llms.txt
└── sections/system-group.json   # Cart upsells

scripts/
├── patch-homepage-clean.js      # Homepage opschonen
├── patch-homepage-v2.js
└── patch-homepage-index.js
```

================================================================
  SAMENVATTING
================================================================

  UREN TOT NU:        ~18,5 uur dev (+ ~1 uur strategie/meeting)
  FASE 0 (NU):        Admin (15+ nieuwe pagina's), redirects, tracking, Merchant Center feed
  FASE 1 (LIVE):      Theme: PDP, homepage, Slaapwijzer, SEO LPs, kennisbank (11 pillars),
                      5 maat-LP pilots, sky-header, CTA-upgrade
  FASE 2 (MARKETING): Google Ads overname + schaalplan, SEO silo's (31 maat resterend),
                      Meta retargeting, e-mail, CRO, local SEO
  FASE 3 (12 WK):     Week-voor-week executie → €25k–€40k D2C/maand

  Kern: elke euro ad spend landt op een pagina die verkoopt.
  SEO bouwt gratis verkeer → blended CPA daalt → meer marge dan Bol.com.

  Doel: BestRest = dé Nederlandse slaapexpert — eigen merk, eigen klanten,
  eigen data. Bol.com = volume; webshop = marge + loyaliteit.

================================================================
