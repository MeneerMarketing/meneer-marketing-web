# DIBA-RULES.md — De wet voor dibaclinics.nl

> Dit bestand is de enige bron van waarheid voor alles wat je in deze repo bouwt.
> Het is gedistilleerd uit: Merkdocument v2.1, Diba Digitaal Masterplan v1.1, Design & Uiterlijk v1.0, De Tool-laag v1.0 en het Landingspagina-arsenaal v1.0.
> Afwijken mag NOOIT stilzwijgend. Twijfel je, stop en vraag het aan Okan.

---

## 0. Wie je bent in dit project

Je bent de uitvoerende developer van Diba Clinics' derde vestiging: de website. Hillegersberg behandelt, Instagram inspireert, de site is de vestiging die 24/7 open is. Je bouwt geen brochure maar een kliniek.

Je werkt in kleine, controleerbare stappen. Elke stap rapporteer je kort. Je verzint nooit content, cijfers of prijzen. Je voegt nooit dependencies toe zonder akkoord.

## 1. De drie toetsen (rapporteer bij ELKE oplevering)

1. **De meetlat-zin:** zou een Diba-behandelaar dit zo zeggen of doen in de stoel?
2. **De designtoets:** kan dit van een influencerkliniek zijn? Dan is het FOUT.
3. **De duim-toets:** werkt het éénhandig op een klein toestel (380px)? Mobiel eerst, desktop is de verruimde versie.

Sluit elke taak af met één regel per toets: ✓ of ✗ met reden.

## 2. Harde verboden (nooit, geen uitzonderingen)

- Pop-ups bij binnenkomst · exit-intent · nieuwsbrief-overlays
- Countdown-timers · "nog 2 plekken!" · elke vorm van nep-urgentie
- Carrousel-hero's · autoplay-video mét geluid
- Stockfoto's · AI-gegenereerde mensen
- Gradients als decoratie · trendkleuren · zwart-met-neongroen
  *(wél toegestaan: een verloop over een foto puur om tekst leesbaar te houden — dat is
  een leeslaag, geen versiering. Vuistregel: haal je de tekst weg en mis je het verloop
  niet, dan hoort het er niet.)*
- Confetti, emoji-regens, bouncende of draaiende animaties
- Chatbot-popup die zichzelf opent
- Sterretjes-prijzen of "prijs op aanvraag" — alle prijzen altijd volledig zichtbaar
- Meer dan één primaire knop per scherm(deel)
- "Ontdek jouw stralende huid"-taal en alle generieke AI-copy (zie §10)
- ~~Pill-buttons~~ — *vervallen 28-07-2026: pills zijn nu de knopvorm (§8)*
- Schaduwen als diepte-effect. Diepte komt van kleurvlakken en lijnen. Eén zachte
  schaduw op een zwevende kaart mag; stapels `shadow-2xl` niet.
- Puur zwart #000 voor tekst
- Losse Unicode-tekens als icoon (`↗`, `✦`, `⌁`) — zie §8
- Een hexcode in een component. Alles via de tokens uit §4.
- Gedachtestreepjes in marketingcopy
- Dunne doorslagpagina's: een pagina zonder unieke, echte content gaat niet live

## 3. Altijd verplicht

- Prijzen zichtbaar, trajectprijs naast losse prijs, termijnbedrag klein eronder ("of €62/mnd")
- Eén duidelijke volgende stap per pagina, nooit een doodlopende pagina
- De twijfel-route op elke pagina: zachte tweede uitgang (WhatsApp-vraag of plan mailen)
- Voor/na-beeld ALTIJD met drie labels: aantal sessies, tijdlijn, huidtype — zonder die drie mag het beeld niet live
- De proof-strip met de vier canonieke cijfers (zie §11) in het vaste format
- Witruimte. Altijd ruimer dan je denkt.

## 4. Design tokens (nooit een hex hardcoden buiten dit blok)

> **Herzien 06-09-2026.** De kleuren komen uit het brandbook van Diba Clinics
> (`dibaclinics-brandbook`, p. 8–10): Olive leaf `#434f3a` is primair, Dewy forest
> `#738369` het middengroen, Sea foam `#f7faf5` de sectietint, Almost black `#0a0a09`
> de leeslaag over foto's. De alternatieve kleuren uit het brandbook (`#555e4c`,
> `#919e88`, `#a1af97`, `#e8efe4`, `#dce5d6`) zijn de tussenstappen; wat het brandbook
> niet geeft (g-900, g-800, g-200, g-050, g-010 en de tekstkleuren) is afgeleid en
> gemeten. De opmaak (raster, typografie, vormen) blijft die van de Figma-homepage
> (28-07-2026). Elke tekstkleur is gemeten tegen het vlak waar hij op staat en haalt
> WCAG 2.2 AA. Bron: `src/app/globals.css`.
>
> *Kanttekening bij het brandbook:* p. 8 zet `#1d1d1b` onder Sea foam; p. 9 geeft voor
> dezelfde kleur RGB 247, 250, 245. Dat laatste is de lichte tint die bedoeld is; het
> eerste is een drukfout.

```css
:root {
  /* Merkgroen — één schaal, brandbook 06-09-2026 */
  --g-900:#2e3628; --g-800:#363f2f; --g-700:#434f3a; /* 700 = PRIMAIR, Olive leaf */
  --g-600:#555e4c; --g-500:#738369; --g-400:#919e88; /* 500 = Dewy forest */
  --g-300:#a1af97; --g-200:#cdd8c8; --g-100:#dce5d6;
  --g-050:#eff3eb; --g-025:#f7faf5; --g-010:#ffffff; /* 025 = Sea foam, 010 = wit */

  /* Tekst op licht (olijfgrijs, AA-gevalideerd; laagste ratio op --g-200) */
  --t-strong:#2e3628;  /*  8.51 */  --t-body:#525e4c;  /* 4.65 */
  --t-muted:#4f5c56;   /*  4.75 */  --t-label:#47613f; /* 4.67 */

  /* Tekst op --g-700 */
  --on-dark:#ffffff;          /* 8.68 */  --on-dark-body:#dce5d6;   /* 6.71 */
  --on-dark-label:#c3d0ba;    /* 5.40 */  --on-dark-accent:#c9d8bf; /* 5.81 */
  --on-dark-btn:#e8efe4;                  --on-dark-btn-text:#434f3a; /* 7.40 */

  /* Type */
  --font-figma-home:'DM Sans',ui-sans-serif,system-ui,sans-serif;

  /* Vorm */
  --r-sm:16px; --r-md:24px; --r-lg:32px; --r-xl:40px; --r-pill:9999px;

  /* Label-ondergrens */
  --fs-label:11px; --ls-label:0.14em;

  /* Beweging (ongewijzigd) */
  --ease-diba:cubic-bezier(0.25,0.8,0.25,1);
  --dur-micro:200ms; --dur-page:350ms;
}
```

In Tailwind gebruik je de klassen, niet de hex: `bg-g-700`, `text-t-label`, `rounded-lg`.

**Fonts self-hosted** via `next/font` (performance + AVG). Nooit via een CDN — ook niet
via `static.figma.com`, wat een Figma Make-export standaard doet. Controleer na elke
export dat er geen externe `@font-face` in `globals.css` is geslopen.

## 5. Kleurregels

De 80/15/5-regel is vervallen. Wat ervoor in de plaats komt houdt dezelfde logica
overeind: **groen verschijnt waar Diba iets waarmaakt** (Addendum A3), alleen nu op
sectieniveau in plaats van als accentje.

- **Maximaal twee donkergroene volvlakken (`--g-700`) per pagina**, en ze markeren
  altijd dezelfde twee momenten: **het bewijs** (de meting, het resultaat) en **de
  volgende stap** (de intake). Een derde donker vlak betekent dat je iets tot bewijs
  verklaart wat het niet is.
  *Uitzondering (Rojda, 06-09-2026): de hero van de homepage is donker, zodat de
  merkkleur er staat voordat iemand scrolt. Dat is de enige pagina met drie donkere
  vlakken, en ook daar staan ze nooit direct achter elkaar.*
- **De homepage is "opgevuld"** (Rojda): secties wisselen af tussen wit en een licht
  kleurvlak (`--g-050`), kaarten staan wit op dat vlak. Geen twee witte secties achter
  elkaar zonder dat een kleurvlak ertussen zit.
- Daartussen ademt de pagina in `--g-010` en `--g-025`; `--g-050` voor een zacht
  tussenvlak. Nooit twee donkere secties direct achter elkaar.
- Primaire actieknop op licht = `--g-700` met witte tekst. Op donker = `--on-dark-btn`
  met `--on-dark-btn-text`. Eén primaire knop per scherm blijft gelden.
- Diepte komt van kleurvlakken en 1px `--g-100`-lijnen — niet van schaduwen.
- **Elke nieuwe tekstkleur wordt gemeten voor hij in de code komt.** WCAG 2.2 AA is de
  ondergrens: 4.5:1 voor tekst onder 24px, 3:1 daarboven. Gebruik bij twijfel `--t-body`;
  die is voor alle lichte vlakken gevalideerd.
- `--warn` (oker) voor aandacht, nooit alarm-rood voor niet-fouten. `--error` (terracotta)
  alleen voor echte fouten.

## 6. Typografie

**Eén font: DM Sans.** Archivo en Fraunces zijn vervallen. De hiërarchie komt niet meer
uit drie lettertypes maar uit schaal — heel groot naast heel klein, met weinig ertussen.

**Het signatuur-patroon (herzien):** het accentwoord staat niet meer in serif-italic maar
in kleur. Een kop is één zin op twee regels, waarvan de tweede regel groen is:
"Wij gokken niet. / *Wij meten.*" met de tweede regel in `--on-dark-accent` (op donker)
of `--g-500` (op licht; Dewy forest, want het olijf van `--g-700` ligt te dicht bij de
kopkleur om nog als accent te lezen). Het gekleurde deel is altijd de belofte die Diba waarmaakt,
nooit het commerciële deel.

Schaal (mobiel → desktop). **De regel: hoe groter de tekst, hoe negatiever de tracking.**

| Rol | Grootte | line-height | letter-spacing |
|---|---|---|---|
| Display XL (hero H1) | 60 → 140px | 0.84 | −0.08em |
| Display L (bewijs, CTA) | 48 → 72px | 0.92 | −0.07em |
| Display M (sectiekop) | 36 → 60px | 0.98 | −0.06em |
| Kaartkop | 24 → 30px | 1.05 | −0.05em |
| Lead | 16px | 1.75 | normaal |
| Body | 15px | 1.70 | normaal |
| Label | **11px minimum** | 1.3 | +0.14em, CAPS |

Regels: body nooit CAPS, nooit gecentreerd bij >2 regels · max 68 tekens per regel ·
prijzen en proof-cijfers altijd `font-variant-numeric: tabular-nums` · **labels nooit
onder 11px** (de export gebruikte 9px; dat is onleesbaar en het staat overal) · gebruik
de klasse `.diba-label`, kopieer de stijl niet opnieuw.

## 7. Layout, grid & ruimte

- Grid: 4 kolommen mobiel, 12 desktop. Max contentbreedte **1800px**, leesbreedte 720px.
- Marges: `px-5` mobiel · `sm:px-9` · `lg:px-[7.5vw]` desktop. Die 7,5vw is de
  huisstijl-marge; op XL staan er twee dunne `--g-100`-lijnen op precies die posities.
- Breakpoints: 380 · 768 · 1024 · 1440.
- Sectie-afstanden: mobiel 80px, desktop 112px.
- **Radius: alleen `--r-sm/md/lg/xl` en `--r-pill`.** De export had zes willekeurige
  waarden (1.5/1.75/2/2.5rem); die zijn teruggebracht tot vier. Kies op grootte:
  metrictegel `sm`, kaart `md`, grote kaart of beeldvlak `lg`, CTA-band `xl`.
- **De asymmetrie-signatuur:** contentblokken bewust uit het midden. In de nieuwe stijl
  is dat de kolomverhouding: `.7fr 1.3fr` of `1.18fr .82fr`, nooit `1fr 1fr`.
- Het hero-beeldvlak heeft één afgeronde hoek linksonder (`rounded-bl-[9rem]`,
  `lg:rounded-bl-[14rem]`). Dat is een handtekening, geen decoratie — niet spiegelen,
  niet op andere vlakken herhalen.

## 8. Componentenbibliotheek (specs)

**Navigatie mobiel:** minimale topbalk (logo + menu + WhatsApp-icoon). Menu = volledig scherm in linnen met vier hoofdingangen groot: Huidproblemen · Laserontharing · Prijzen · Boek een intake.

**Sticky actiebalk (mobiel, signatuurcomponent):** onderin op behandel- en pillarpagina's. Links "Vraag stellen" (ghost, WhatsApp), rechts "Start intake" (olijf primair). Verdwijnt bij scrollen omhoog, verschijnt bij scrollen omlaag.

**Desktop-nav:** horizontaal, Prijzen altijd zichtbaar als menu-item, rechtsboven de primaire knop.

**Knoppen (48px hoog, 48px touch-targets overal, `--r-pill`):**
- Primair op licht: `--g-700` vlak, witte tekst — één per scherm
- Primair op donker: `--on-dark-btn` vlak, `--on-dark-btn-text` tekst
- Secundair: transparant, 1px `--g-300`-rand, `--g-700` tekst
- Ghost: alleen `--g-700` tekst met onderstreping — de twijfel-route
- Labels zeggen exact wat er gebeurt: "Start je intake (4 min)", "Bereken jouw prijs".
  NOOIT "Verstuur", "Klik hier", "Ontdek".

**Iconen: SVG, nooit tekst.** De export gebruikt `↗`, `✦` en `⌁` als losse tekens. Die
renderen per besturingssysteem anders, schalen niet mee met het font en zijn niet
voorspelbaar voor een screenreader. Elk icoon wordt een SVG-component met
`aria-hidden="true"`, of het verdwijnt.

**Proof-strip:** horizontale band, vier canonieke cijfers in cijfers-groot met kleine labels. Eén vaste vorm, overal identiek.

**Reviewkaart:** crème kaart, Fraunces-italic quote, naam + behandeling + sterren klein. Gefilterd per pagina-onderwerp.

**Voor/na-slider (signatuur-interactie):** swipebare verticale scheidingslijn met olijf handvat. Onder het beeld verplicht: sessies, tijdlijn, huidtype. Dit is de ENIGE plek met uitgesproken interactie.

**Meting-blok (Eve-M):** nulmeting vs. nu als rustige datavisual in groentinten. Eigen, herkenbare vorm.

**Formulieren:** één vraag per scherm (intake), grote tikbare antwoordkaarten, voortgang als dunne salielijn die olijf vult. Velden: linnen vlak, 1px salierand, olijf focus-ring 2px, label boven het veld (nooit alleen placeholder). Fouten concreet zonder drama: "Dit e-mailadres mist een @".

**Prijstabel:** volledige prijzen, trajectprijs naast losse prijs, termijnbedrag klein eronder. Geen voetnoten met addertjes.

**Behandelkaart:** echt beeld + naam + "voor wie" in één regel + vanaf-prijs + pijl. Hover: alleen 2px lift + randverdieping.

**FAQ-accordeon:** salielijnen, olijf plus/min. **Cookiebalk:** één regel, twee knoppen, geen muur. **Footer:** diep den achtergrond, crème tekst, proof-strip herhaald, NAP-gegevens (lokale SEO).

## 9. Beweging

- Micro-interacties 150–250ms, overgangen 300–400ms, easing `--ease-diba`. Nooit bouncen, nooit draaien.
- View Transitions tussen pagina's: crossfade + 8px verticaal.
- Scroll-reveals: 12px omhoog faden, één keer, subtiel. Proof-cijfers tellen eenmalig op (800ms).
- `prefers-reduced-motion`: alles statisch, tellers direct op eindwaarde. GEEN uitzonderingen.
- Laden: skeleton-vlakken in crème (geen spinners), beelden blur-up.

## 10. Copy & taal (geldt ook voor placeholder-teksten)

**De stem:** een deskundige behandelaar die naast je zit. Eerlijk, warm, direct, rustig zelfverzekerd, concreet en specifiek. NOOIT: schreeuwerig, vaag, influencerachtig, angst aanjagend, generiek AI-achtig.

**Verboden woorden/frases:** "ontdek", "verwen jezelf", "jouw stralende huid", "stralend de zomer in", superlatieven zonder bewijs, medische beloftes ("verdwijnt gegarandeerd").

**Verplicht:** klanttaal naast vaktaal ("puistjes op je kin" naast "acne mandibulair") · korte actieve zinnen · geen gedachtestreepjes · bij medische indicaties altijd de eerlijkheidsclausule (bijv. "bij melasma is beheersing realistischer dan verdwijning").

**Jij schrijft GEEN definitieve marketingcopy.** Gebruik `[COPY-NODIG: onderwerp]` placeholders en meld ze. Medische inhoud krijgt de vlag `[MEDISCHE-CHECK-ROJDA]`.

## 11. De canonieke proof points (de ENIGE cijfers die je ooit gebruikt)

| Proof point | Waarde |
|---|---|
| Actief sinds | 2017 |
| Geholpen klanten | 8.000+ |
| Uitgevoerde behandelingen | 50.000+ |
| Klantreviews | 4.000+ |

Nooit andere cijfers, nooit afronden naar vaagheid ("duizenden"), nooit zelf iets verzinnen. Locatie: Rotterdam (Hillegersberg).

## 12. Merkarchitectuur

- Diba Clinics = de kliniek. SkinComplete = de professionele thuisfase.
- Op Diba-kanalen is SkinComplete een aanbevolen product binnen het behandelplan ("de thuisfase van jouw traject") — nooit een tweede merk, nooit banners, nooit SkinComplete-styling in Diba-pagina's.
- Nooit expliciet afzetten tegen andere klinieken. Het contrast is voelbaar, nooit benoemd.
- Slogan extern: "Trust the green touch." Waardenregel/afsluiter: "Eerlijk. Deskundig. Menselijk."
- Fitzpatrick-schaal altijd volledig I–VI als gelijkwaardige tinten.

## 13. Toegankelijkheid (de vloer, niet het plafond)

WCAG 2.2 AA minimaal: focus-ringen 2px olijf zichtbaar · volledige toetsenbordnavigatie · labels altijd · alt-teksten beschrijvend (ook voor/na: "huid met melasma vóór behandeling, huidtype IV") · touch-targets ≥48px · tekst schaalbaar tot 200% zonder breuk · ondertiteling op alle video · getest op iPhone SE-formaat.

## 14. Techniek & performance

- Stack volgens masterplan: Next.js (SSG + ISR), headless CMS-klaar (content als getypeerde data, meertalig-klaar: NL nu, EN fase 2), Vercel-hosting, TypeScript.
- Laadtijd <2s. Core Web Vitals groen is een release-criterium, geen wens.
- Beelden AVIF/WebP, video via stream-dienst, lazy-load onder de vouw, geen CLS.
- Geen API-keys in de frontend. EU-hosting voor persoonsdata. Security-headers aan.
- Salonized blijft het boekings-hart (deeplinks/API), Mollie de betaallaag, Klaviyo de e-mailmotor (events vanaf dag één), WhatsApp Business als kanaal.
- `robots.txt`, XML-sitemaps, `llms.txt` aanwezig vanaf fase 1.

## 15. SEO-regels (per pagina afdwingbaar)

- Eén H1 per pagina, beschrijvende H2's, klanttaal in koppen.
- Interne linklogica: probleem → behandeling → bewijs → prijs → intake. Elke academy-pagina linkt naar exact één behandelpad; elke behandelpagina linkt terug naar de problemen die hij oplost.
- Structured data per paginatype: LocalBusiness + MedicalClinic (contact/lokaal), Physician (team), FAQPage (FAQ-secties), Service/behandelingen, BreadcrumbList overal. Reviews-schema op product/service-niveau, nooit self-serving op LocalBusiness.
- Programmatic pagina's (zones, verzekeraars, probleem×behandeling) alleen live met unieke, echte content. Overlapt een pagina met een bestaande zoekintentie: samenvoegen, niet dupliceren.
- Elk pillarpagina-sjabloon: herkenning → wat er in je huid gebeurt → wat wél/niet werkt (olijf vinkjes / oker kruisjes) → het Diba-pad met prijzen → bewijs (voor/na + reviews gefilterd) → vergoeding → FAQ → sticky intake-balk.

## 16. Jouw werkwijze (procesregels)

1. **Werk mobiel eerst.** Bouw en test op 380px, verruim daarna.
2. **Bouwvolgorde altijd:** tokens → primitives → componenten → templates → pagina's. Nooit een pagina bouwen met componenten die nog niet bestaan.
3. **Kleine stappen.** Eén component of één template per taak. Rapporteer kort: wat gebouwd, welke bestanden, de drie toetsen, open vragen.
4. **Nooit stilzwijgend afwijken.** Kan iets niet volgens deze regels, stop en leg het voor.
5. **Geen nieuwe dependencies** zonder expliciet akkoord.
6. **Placeholders:** content die je niet hebt markeer je als `[COPY-NODIG]`, `[PRIJS-NODIG]`, `[BEELD-NODIG: omschrijving]`, `[MEDISCHE-CHECK-ROJDA]`. Verzin niets.
7. **Definition of Done per pagina:** 380px perfect · drie toetsen ✓ · één H1 · één primaire knop · prijzen zichtbaar (waar relevant) · twijfel-route aanwezig · schema aanwezig · interne links volgens §15 · a11y-sweep (focus, labels, alt, contrast) · geen verboden elementen (§2) · CWV niet verslechterd.

---

*Diba Clinics — Trust the green touch. Rust is luxe. Bewijs is design. Groen is het merk.*
