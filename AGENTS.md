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

### Secties & layout

5. **Nieuwe secties moeten uitblinken.** Als de gebruiker een nieuwe sectie vraagt: geen saaie tekstblok. Maak er een bewuste eyecatcher van. Denk aan mooie vlakken/kaarten, subtiele interactie (hover, scroll-reveal, tilt), typografie met punch, en één uniek detail dat de sectie onthoudbaar maakt. Wees creatief binnen het merk.
6. **Twee kolommen = visueel in balans.** Bij layouts met foto/beeld links en tekst rechts (of omgekeerd): vul de tekstkolom rijk en satisfying. Gebruik kop, intro, bullets of mini-kaartjes, trust-elementen, CTA, pill-labels of metrics. Geen dunne kolom met drie regels naast een grote afbeelding.
7. **Kolommen even hoog.** Beide kolommen moeten verticaal netjes uitlijnen (`items-stretch`, `h-full`, flex/grid met gelijke hoogte). De kortste kolom vult visueel de ruimte (spacing, sub-elementen, padding), zodat het geheel afgewerkt oogt.
8. **Minimalistisch als basis, premium als sectie.** De site blijft clean en high-end. Een nieuwe sectie mag wél rijker en expressiever zijn, zolang het bij het merk past en niet rommelig wordt.

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
