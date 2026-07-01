<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

> **Master copy & UI:** globale regels staan in Cursor **User Rules** (`~/.cursor/MASTER-RULES.md` op deze machine) en in `.cursor/rules/master-copy-ui.mdc`. Geen em-dash, geen 01/02/03, menselijk Nederlands. Geldt voor alle websites.

## Shopify theme scheiding

- **`shopify/`** = Skin Complete only (`sc-*` prefix). Werk hier in deze repo voor SC.
- **`shopify-theme-bestrest/`** = BestRest live theme (`br-*`). Niet mixen, niet aanpassen tenzij expliciet gevraagd.
- Geen BestRest-bestanden (`br-*`, `page.br-*`, BestRest page-sections) in `shopify/`.

## Skin Complete — copy & compliance (Shopify)

Bij alle consumenten- en SEO-teksten voor Skin Complete:

1. **Het Premium LED-Mask** — altijd *het* (niet *de*). Productnaam: Premium LED-Mask.
2. **Clinical, niet Medical** — gebruik `clinical-grade` / `klinisch`; nooit `medical-grade` of `medisch` als productclaim.
3. **Geen harde claims** — vermijd diagnoses en absolute beloftes. Gebruik helpende taal: *kunnen helpen*, *mogelijk*, *ondersteunen*, *kan*.
4. **Geen vaste behandeltijd** — geen "10 minuten per sessie"; verwijs naar het **LED Passport** (persoonlijk protocol).
5. **Golflengtes** — Premium LED-Mask: **7 golflengtes** (410, 460, 610, 630, 660, 830, 850, 880 nm). Precision Photonic System: **4 golflengtes**.
6. **Nabij-infrarood** — niet *infrarood* alleen; schrijf *nabij-infrarood (nir)*.
7. **FDA 510(k)** — alleen op **Premium LED-Mask** (SR-M4), niet op Neck & Décolleté of Precision Photonic System.
8. **Geen 30-dagen retour/geld-terug** in marketingcopy. Trust bar: *Gratis verzending · Professionele ondersteuning · Veilig betalen*.
9. **Hero badge:** *Clinical-grade ontwerp* + *Alleen verkrijgbaar via professionals* (niet "Klinisch-gericht" / "Gebruikt in klinieken").
10. **Golflengte-bolletjes:** kleur moet matchen met lichttype (geel = geel #F3C65B, rood = rood, nabij-infrarood = wit #FFFFFF).
11. **Nabij-infrarood-label:** schrijf *nabij-infrarood (nir)* — niet *INFRAROOD* of *(NIR)* alleen.
12. **FAQ vermijden**: "Kun je huidproblemen thuis behandelen met LED?" en vergelijkbare absolute thuisbehandel-claims.

## Skin Complete — design & typografie (Shopify)

Bij alle UI, secties en marketingcopy voor Skin Complete (volgt ook de **master copy rules** hierboven):

1. **Minimalistisch & editorial** — clean, high-end, veel witruimte, haarfijne lijnen, geen zware panelen, stats-blokken of drukke interactie tenzij gevraagd.
2. **Pill-labels** — uppercase (`PROFESSIONELE ONDERSTEUNING`), `font-weight: 300` (licht, niet bold), `letter-spacing: 0.15em`, inline naast lopende tekst, `border-radius: 50px`, subtiele border (`rgba(254,252,252,0.3)`), `transform: translateY(-3px)`.
3. **Cacao-palet** — `#2C2217`, `#45382C`, `#F5F0EA`, `#FEFCFC`; geen zwart-wit contrast of neon-accenten.
4. **Geen over-engineered UX** — geen auto-rotate carousels, progress bars of tab-rails als standaard; subtiele hover en scroll-reveal zijn voldoende.
