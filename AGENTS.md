<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Hoofdregels voor alle websites

Geldt voor **elke site in deze workspace**: MeneerMarketing (`src/`), Skin Complete (`shopify/`), BestRest (`shopify-theme-bestrest/`), en overige mappen.

### Copy & tone

1. **Geen genummerde stappen:** nooit `01`, `02`, `03`, `Stap 1`, `1/3` of vergelijkbare AI-look nummering in UI tenzij de gebruiker dit expliciet vraagt.
2. **Geen em-dash in copy:** geen `—`, `&mdash;` of `--` in lopende tekst. Gebruik punten, komma's of korte zinnen.
3. **Menselijk Nederlands:** geen AI-jargon, geen lange streepjes, geen corporate fluff.
4. **Plain language:** vaktermen (SEO, CRO, etc.) in gewone taal uitleggen waar nodig.

### Documentatie & communicatie

5. **Klikbare bestandsnamen:** verwijs in chat, `.md`-bestanden en checklists altijd naar repo-bestanden als **markdown-links**, niet als platte backticks of losse paden.
   - Goed: `[shopify/snippets/sc-footer.liquid](shopify/snippets/sc-footer.liquid)`
   - Goed (vanuit `shopify/`): `[sc-footer.liquid](snippets/sc-footer.liquid)`
   - Fout: `` `sc-footer.liquid` `` of `shopify/snippets/sc-footer.liquid` zonder link
   - Zelfde voor mappen, templates, tasks en docs: elk pad dat de gebruiker moet openen of uploaden = klikbare link.
6. **Upload-checklists:** in `SEO-UPLOAD-CHECKLIST.md` en vergelijkbare docs elke bestandsregel als link naar het lokale bestand.

### Secties & layout

7. **Nieuwe secties moeten uitblinken.** Als de gebruiker een nieuwe sectie vraagt: geen saaie tekstblok. Maak er een bewuste eyecatcher van. Denk aan mooie vlakken/kaarten, subtiele interactie (hover, scroll-reveal, tilt), typografie met punch, en één uniek detail dat de sectie onthoudbaar maakt. Wees creatief binnen het merk.
8. **Twee kolommen = visueel in balans.** Bij layouts met foto/beeld links en tekst rechts (of omgekeerd): vul de tekstkolom rijk en satisfying. Gebruik kop, intro, bullets of mini-kaartjes, trust-elementen, CTA, pill-labels of metrics. Geen dunne kolom met drie regels naast een grote afbeelding.
9. **Kolommen even hoog.** Beide kolommen moeten verticaal netjes uitlijnen (`items-stretch`, `h-full`, flex/grid met gelijke hoogte). De kortste kolom vult visueel de ruimte (spacing, sub-elementen, padding), zodat het geheel afgewerkt oogt.
10. **Minimalistisch als basis, premium als sectie.** De site blijft clean en high-end. Een nieuwe sectie mag wél rijker en expressiever zijn, zolang het bij het merk past en niet rommelig wordt.

## MeneerMarketing — tone of voice & copy (Next.js, `src/`)

Bij alle teksten voor meneermarketing.nl (naast de hoofdregels hierboven):

1. **Schrijf als Meneer Marketing zelf.** Alsof hij bij de klant aan tafel zit: conversational, scherp, af en toe grappig, direct, expert-level. Hij is de onmisbare online marketing manager van de klant.
2. **Jij/je, nooit u/uw.**
3. **Onverwachte weetjes en harde feiten** af en toe gebruiken om aandacht vast te houden.
4. **Verboden:** AI-lijstjes (01/02/03), em-dashes, openers als "Laten we kijken naar...", corporate fluff.
5. **Cases natuurlijk verweven in copy:** SkinComplete (Shopify B2B-portaal gebouwd, e-mailmarketing opgezet, eerst met SEO organisch verkeer gedomineerd en daarna pas ads aangezet) en BestRest (matrassen en toppers, compleet eigen strategische aanpak, want elke klant krijgt een eigen plan).

## MeneerMarketing — diensten & naming

1. **Nooit "maatwerk websites":** schrijf **websites from scratch** of **custom build**. Geen templates, geen page builders, eigen code.
2. **Google Ads en Meta Ads expliciet benoemen.** Niet verstoppen achter "datagedreven adverteren". Dit is expertise, dus zichtbaar in titels.
3. **Automatisering in klanttaal:** "processen automatiseren", "systemen aan elkaar knopen", "e-commerce op autopilot". Tools als n8n/Make alleen als detail op de dienstpagina, nooit in de titel.
4. **WordPress niet promoten.** Alleen als migratie: van WordPress naar custom of Shopify.
5. **AI-zoek is een volwaardige dienst:** vindbaarheid in ChatGPT, Perplexity en andere AI-zoekmachines. Geen "later", dit staat live in het aanbod.
6. **Vijf dienstenblokken:** Strategie & groei · Bouwen from scratch · Vindbaarheid, content & autoriteit · Acquisitie & creators · Behoud & slimme koppelingen.

## MeneerMarketing — design & techniek

1. **Base aesthetic:** minimalistische grid-achtergrond, grote bold typografie, oranje accent `#FF5722`, ultra-clean en snel.
2. **Premium micro-interacties:** Framer Motion en GSAP, hardware-versneld (`transform`/`opacity`, `will-change`). Knoppen, hovers en transities voelen op maat, nooit als template.
3. **InteractiveLogo:** hoofd van Meneer Marketing naast het logo linksboven; pupillen volgen de cursor vloeiend over het hele scherm. Op mobiel reageert het op scroll/touch. `prefers-reduced-motion` respecteren.
4. **SEO-techniek feilloos:** Core Web Vitals, semantische HTML, JSON-LD schema markup, a11y. Ads worden opgeschaald, dus landingspagina's moeten technisch perfect zijn.

## Shopify theme scheiding

- **`shopify/`** = Skin Complete only (`sc-*` prefix). Werk hier in deze repo voor SC.
- **`shopify-theme-bestrest/`** = BestRest live theme (`br-*`). Niet mixen, niet aanpassen tenzij expliciet gevraagd.
- Geen BestRest-bestanden (`br-*`, `page.br-*`, BestRest page-sections) in `shopify/`.

## Skin Complete — copy & compliance (Shopify)

Bij alle consumenten- en SEO-teksten voor Skin Complete (naast de algemene regels hierboven):

1. **Het Premium LED-Mask:** altijd *het* (niet *de*). Productnaam: Premium LED-Mask.
2. **Jij, niet u:** nooit `u`, `uw`, `U` of andere formele aanspreekvorm. Schrijf informeel: `jij`, `je`, `jou`, `jouw`. Ook in CTAs, FAQ, e-mail en productcopy.
3. **Clinical, niet Medical:** gebruik `clinical-grade` / `klinisch`; nooit `medical-grade` of `medisch` als productclaim.
4. **Geen harde claims:** vermijd diagnoses en absolute beloftes. Gebruik helpende taal: *kunnen helpen*, *mogelijk*, *ondersteunen*, *kan*.
5. **Geen vaste behandeltijd:** geen "10 minuten per sessie"; verwijs naar het **LED Passport** (persoonlijk protocol).
6. **Golflengtes:** Premium LED-Mask: **7 golflengtes** (410, 460, 610, 630, 660, 830, 850, 880 nm). Precision Photonic System: **4 golflengtes**.
7. **Nabij-infrarood:** niet *infrarood* alleen; schrijf *nabij-infrarood (nir)*.
8. **FDA 510(k):** alleen op **Premium LED-Mask** (SR-M4), niet op Neck & Décolleté of Precision Photonic System.
9. **Geen 30-dagen retour/geld-terug** in marketingcopy. Trust bar: *Gratis verzending · Professionele ondersteuning · Veilig betalen*.
10. **Hero badge:** *Clinical-grade ontwerp* + *Alleen verkrijgbaar via professionals* (niet "Klinisch-gericht" / "Gebruikt in klinieken").
11. **Golflengte-bolletjes:** kleur moet matchen met lichttype (geel = geel #F3C65B, rood = rood, nabij-infrarood = wit #FFFFFF).
12. **Nabij-infrarood-label:** schrijf *nabij-infrarood (nir)*, niet *INFRAROOD* of *(NIR)* alleen.
13. **FAQ vermijden:** "Kun je huidproblemen thuis behandelen met LED?" en vergelijkbare absolute thuisbehandel-claims.

## Skin Complete — design & typografie (Shopify)

Bij UI en secties voor Skin Complete (naast de algemene regels hierboven):

1. **Pill-labels:** uppercase (`PROFESSIONELE ONDERSTEUNING`), `font-weight: 300` (licht, niet bold), `letter-spacing: 0.15em`, inline naast lopende tekst, `border-radius: 50px`, subtiele border (`rgba(254,252,252,0.3)`), `transform: translateY(-3px)`.
2. **Cacao-palet:** `#2C2217`, `#45382C`, `#F5F0EA`, `#FEFCFC`; geen zwart-wit contrast of neon-accenten.
3. **Geen over-engineered UX:** geen auto-rotate carousels, progress bars of tab-rails als standaard. Subtiele hover en scroll-reveal zijn voldoende. **Uitzondering:** expliciet gevraagde nieuwe secties volgen de hoofdregels voor uitblinkers (kaarten, interactie, rijke kolommen).
