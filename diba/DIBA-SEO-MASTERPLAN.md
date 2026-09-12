# Diba Clinics: SEO-masterplan

*Opgesteld 11 september 2026, de dag na de livegang van dibaclinics.nl. Bijgewerkt op 12 september 2026: golf 1 tot en met 4 zijn af. Zeventien landingspagina's, en tien bestaande pagina's dragen nu de zoekvraag die ze al beantwoordden (zie hoofdstuk 5).*
*Voor Yasin, Okan en Rojda. Dit document is het plan; `DIBA-RULES.md` en `DIBA-COPY-STYLE-GUIDE.md` blijven de wet.*

---

## Waar dit plan over gaat, en wat het niet belooft

Het doel dat Yasin stelde: bovenaan staan in Rotterdam, landelijk gevonden worden op de
onderwerpen waar we iets van weten, en genoemd worden als iemand het aan ChatGPT vraagt.

Dat eerste is haalbaar. Het tweede deels. Het derde is te beïnvloeden maar niet te sturen.

Wat niemand kan leveren is een gegarandeerde positie, en wie dat wel aanbiedt verkoopt iets
anders. Wat we wel kunnen doen is dit: over deze kliniek en deze behandelingen in Rotterdam
de duidelijkste, volledigste en meest consistente bron van het internet zijn. Als je dat
bent, volgt de positie meestal vanzelf, en als hij niet volgt weet je tenminste waarom.

Dit plan is daarom geen lijst trucs. Het is een bouwvolgorde.

---

## 1. Wat er al staat

Belangrijk om mee te beginnen, want de meeste SEO-plannen doen alsof er niets is. Hier ligt
al een fundament dat de meeste klinieksites niet hebben.

| Wat | Stand |
|---|---|
| Pagina's met eigen inhoud | 155 |
| Sitemap | Leidt zichzelf af uit de routes; een nieuwe pagina staat er vanzelf in |
| Canonical, Open Graph, Twitter-kaart | Op elke pagina, uit één functie (`lib/seo.ts`) |
| Schema | LocalBusiness/MedicalClinic, BreadcrumbList, FAQPage, MedicalProcedure, JobPosting, en sinds vandaag Service met tarieven en MedicalWebPage |
| Openingstijden | Uit één bron, ook in het schema |
| Reviews | 3.893 uit Salonized, 2.467 met tekst, per onderwerp te tonen |
| Fotografie | Eigen materiaal, geen stock |
| Eigen uitlegmiddelen | 25 doorsnedes, testen en vergelijkers verspreid over de site |
| Geautomatiseerde controles | 8 scripts: huisregels, stijl, koppen, kaarten, knoppen, tekst buiten zijn vlak, hover-contrast, mobiel |
| robots.txt | Alles open behalve /dev, met de AI-crawlers sinds vandaag met naam toegestaan |

**Wat ontbrak, en waarom dat de kern van dit plan is.** Er was geen enkele pagina gericht op
een zoekopdracht met een plaatsnaam erin. De site legt uitstekend uit wát een behandeling is,
maar nergens stond wat die bij ons in Rotterdam kost, wie hem doet en hoe een afspraak gaat.
Dat is precies de vraag waarmee iemand zoekt op het moment dat hij een kliniek kiest.

Daar gaat hoofdstuk 3 en 4 over, en de HydraFacial-pagina is het eerste voorbeeld.

---

## 2. Drie speelvelden, drie spellen

Ze worden vaak op één hoop gegooid en dat is de duurste fout in elk SEO-plan. Ze belonen
verschillende dingen.

### 2a. De kaartjes bovenaan (het lokale pakket)

De drie bedrijven met een kaartje erbij, boven de gewone resultaten. Dit is waar het meeste
verkeer voor "huidkliniek rotterdam" naartoe gaat.

**Wat het bepaalt:** afstand tot de zoeker, bekendheid van het bedrijf, en relevantie. De
site doet hier maar een deel van het werk; het Google-bedrijfsprofiel doet de rest.

**De belangrijkste knop:** het bedrijfsprofiel zelf. Zie hoofdstuk 7.

### 2b. De gewone tien

**Wat het bepaalt:** of je pagina het antwoord is op de vraag, of de site technisch gezond
is, hoe de pagina intern verbonden is, en of anderen ernaar verwijzen.

**Waar wij winnen:** diepte en eerlijkheid. Een pagina die ook zegt wanneer een behandeling
níet past, is zeldzaam in deze branche en wordt beloond, door Google én door de bezoeker.

### 2c. De antwoordmachines

AI Overviews in Google, ChatGPT, Perplexity, Gemini, Copilot. Hier is geen positie. Hier
word je genoemd of niet.

**Wat het bepaalt, voor zover we het weten:**

1. **Bereikbaarheid.** De crawler moet binnen mogen. Staat vandaag met naam in robots.txt.
2. **Aanhaalbaarheid.** Een model haalt een alinea aan, geen pagina. Een alinea die los van
   de rest te lezen is en het hele antwoord bevat, wordt aangehaald; een alinea die begint
   met "zoals we hierboven zagen" nooit.
3. **Machineleesbare feiten.** Een bedrag in een `Offer` is een feit. Hetzelfde bedrag in
   een plaatje is niets.
4. **Consistentie.** Vindt een model drie verschillende prijzen voor dezelfde behandeling,
   dan noemt het er geen enkele. Eén bron voor elk getal is daarom niet netheid maar de
   voorwaarde om aangehaald te worden.
5. **Bevestiging van buitenaf.** Een model vertrouwt een feit dat op drie plekken staat meer
   dan een feit dat alleen op je eigen site staat. Zorgkaart, het bedrijfsprofiel, de
   ledenlijst van de NVH: elk daarvan dat hetzelfde zegt, telt.

**Wat niet werkt:** teksten "voor AI" schrijven, zoekwoorden herhalen, verborgen tekst,
gegenereerde artikelen in bulk. Modellen worden getraind op mensentekst en herkennen de rest.

---

## 3. De architectuur: naaf en spaken

De site heeft drie bestaande reeksen, en die blijven zoals ze zijn:

- `/huidproblemen/*` — de klacht waarmee iemand zoekt (30 pagina's)
- `/behandelingen/*` — wat we eraan doen (58 pagina's)
- `/apparatuur/*` — waarmee (12 pagina's)

Daar komt nu een vierde bij:

- `/kennisbank/*` — **de landingspagina's**: wat een behandeling bij ons in Rotterdam
  inhoudt, kost en oplevert.

### Waarom een aparte laag, en niet de behandelpagina's aanpassen

Omdat het twee verschillende vragen zijn.

> `/behandelingen/hydrafacial` beantwoordt **"wat is een HydraFacial"**.
> `/kennisbank/hydrafacial-rotterdam` beantwoordt **"waar in Rotterdam laat ik dit doen,
> bij wie, met welk apparaat, wat kost het daar en hoe gaat een afspraak"**.

Die tweede vraag heeft een ander antwoord, een andere lengte en een andere lezer.

### De regel tegen elkaar beconcurreren

Twee pagina's over hetzelfde onderwerp op één site is geen dubbele kans maar een halve:
Google kiest er dan zelf één, en vaak niet degene die je bedoelde. Daarom, zonder
uitzondering:

1. **Eén zoekvraag, één pagina.** Geen tweede pagina voor een variant van dezelfde vraag.
2. **Verplichte verwijzing heen en terug**, met een ankertekst die zegt waar je uitkomt.
   Niet "lees meer". Dit is in de code afgedwongen met het veld `landing` op een
   behandeling, zodat de verwijzing terug er automatisch staat.
3. **De behandelpagina blijft het antwoord op de algemene term.** De landingspagina is het
   antwoord op de term met de plaats erin.
4. **Geen overgeschreven alinea's.** Wat op allebei hoort (tarief, duur) komt uit dezelfde
   bron in de data en staat er dus nooit twee keer als tekst.

### Interne verwijzingen: de ondergrens

Een landingspagina waar niets naartoe wijst wordt traag gevonden en zelden herbezocht.
**Elke landingspagina heeft minimaal vijf inhoudelijke verwijzingen vanaf andere pagina's.**
Dat gaat nu vanzelf, langs vier wegen:

1. de kennisbank, waar ze bovenaan staan;
2. het rijtje onderaan elke landingspagina, dat naar alle andere wijst;
3. de behandelpagina, via het veld `landing`;
4. het behandelblok op de negenentwintig huidprobleempagina's: staat daar een behandeling
   met een landingspagina, dan staat die link erbij, met de naam van de pagina als
   ankertekst. Microneedling krijgt daarmee in één keer een verwijzing vanaf elke klacht
   waar de SkinPen of de Dermapen bij hoort. Per landingspagina staat die link maar één
   keer in het blok, ook als er meer behandelingen naar dezelfde pagina wijzen.

Na golf 2 krijgt elke landingspagina er 12 tot 27, en is er geen enkele pagina op de site
meer waar niets naartoe wijst. De laatste was /pcos; die wordt nu gevonden via de pagina
over elektrische epilatie.

---

## 4. Het sjabloon: hoe elke landingspagina eruitziet

De HydraFacial-pagina is het model. Dit is de checklist waarmee de volgende twintig
hetzelfde worden.

### Opbouw

1. **H1** = de zoekvraag, natuurlijk geschreven. "HydraFacial in Rotterdam", niet
   "HydraFacial Rotterdam prijs beste kliniek".
2. **Het antwoordblok.** Eén alinea van 45 tot 60 woorden, direct onder de H1, die los van
   de pagina te lezen is en het hele antwoord bevat: wat het is, waar, hoe lang, wat het
   kost. Dit is het belangrijkste onderdeel van de hele pagina. Het is wat in een uitgelicht
   zoekresultaat komt en wat een taalmodel aanhaalt.
3. **Vier feiten** in beeld: duur, tarief, hersteltijd, apparaat.
4. **De werking**, beginnend bij de huid en niet bij het apparaat.
5. **Het apparaat of de methode** als onderscheid, geschreven zodat het ook bruikbaar is
   voor wie níet bij ons komt.
6. **Tarieven** met de intakeregeling er compleet bij, uit één bron.
7. **Wat wel en wat niet.** De "niet"-lijst is even lang als de "wel"-lijst. Dit is het
   deel dat vertrouwen wint en tegelijk het deel dat wordt aangehaald.
8. **Een vergelijkingstabel** met de alternatieven die wij zelf doen. Een tabel is het enige
   wat letterlijk overgenomen wordt als iemand de vergelijking aan een model vraagt.
9. **Het lokale blok:** adres, openingstijden, wie de behandeling doet, onder welke
   registraties.
10. **Reviews** over dat onderwerp, uit Salonized.
11. **Acht tot twaalf vragen**, elk met het antwoord in de eerste zin.
12. **Laatst bijgewerkt**, met de datum.
13. **De uitnodiging**, zonder druk.

### Schema (verplicht, alle vijf)

`BreadcrumbList`, `MedicalWebPage` met `dateModified`, `MedicalProcedure`, `Service` met
een `Offer` per variant, en `FAQPage`.

De generatoren staan in `lib/schema.tsx`. Een bedrag in een `Offer` moet ook zichtbaar op
de pagina staan; een verschil daartussen is een reden voor een handmatige maatregel.

### Maat en controle

- 1.500 tot 2.500 woorden zichtbare tekst. De HydraFacial-pagina zit op 1.718.
- Het sjabloon staat in de code en niet alleen hier: `LandingPagina.tsx` met één
  databestand per pagina. Het register in `src/data/landings/index.ts` controleert bij
  elke build de titellengte, de omschrijving, de lengte van het antwoordblok, het aantal
  feiten en vragen, en of de wel- en niet-lijst even lang zijn. Haalt een pagina de maat
  niet, dan faalt de build met een zin die zegt wat er mis is.
- Titel maximaal 60 tekens inclusief " | Diba Clinics".
- Omschrijving maximaal 158 tekens.
- Minimaal tien uitgaande inhoudelijke verwijzingen.
- Alle acht controlescripts groen, zonder uitzondering.
- Medische passages gemarkeerd met `[MEDISCHE-CHECK-ROJDA]` tot Rojda ze heeft nagekeken.

---

## 5. Het bouwplan: welke pagina's, in welke volgorde

**Eerst dit.** De volgorde hieronder is opgesteld op commerciële logica en op wat de kliniek
daadwerkelijk doet, niet op zoekvolume, want dat hebben we nog niet. Zet Search Console en
Keyword Planner erop voordat de volgorde vastligt; het kan dat "microneedling rotterdam"
drie keer zoveel oplevert als "dermaplaning rotterdam", en dan wisselen ze van plaats.

### Een correctie op de eerste versie van dit plan

De eerste versie zette acne en pigment in golf 1. Dat was fout. Bij het bouwen bleek dat
`/huidproblemen/acne` al "Acne behandelen in Rotterdam" heet en `/huidproblemen/pigmentvlekken`
"Pigmentvlekken behandelen in Rotterdam". Die zoekvragen hebben dus al een pagina, en een
tweede zou precies de kannibalisatie opleveren die hoofdstuk 3 verbiedt.

Hetzelfde geldt voor rosacea, couperose, melasma, littekens, acnelittekens, striae,
rimpels, huidveroudering, huidverslapping, ouderdomsvlekken, ingegroeide haren,
steelwratjes en keloïden: allemaal al "… behandelen in Rotterdam". **De klachtlaag is dus
al lokaal.** Landingspagina's zijn voor wat die laag niet dekt: behandelingen, methodes en
het vak zelf.

De regel die daaruit volgt, voor elke volgende pagina: kijk eerst of er al een pagina met
die zoekvraag in de titel bestaat. Is dat zo, dan versterk je die en bouw je er geen naast.

### Golf 1: af op 11 september 2026

| Pagina | Zoekvraag | Mag niet botsen met |
|---|---|---|
| ✅ `/kennisbank/huidtherapeut-rotterdam` | huidtherapeut rotterdam | /team, /kwaliteit-en-registraties |
| ✅ `/kennisbank/huidanalyse-rotterdam` | huidanalyse rotterdam | /behandelingen/huidanalyse, /intake |
| ✅ `/kennisbank/hydrafacial-rotterdam` | hydrafacial rotterdam | /behandelingen/hydrafacial |
| ✅ `/kennisbank/microneedling-rotterdam` | microneedling rotterdam | /behandelingen/skinpen, /behandelingen/dermapen-4 |
| ✅ `/kennisbank/chemische-peeling-rotterdam` | chemische peeling rotterdam | /behandelingen/peelings |
| ✅ `/kennisbank/ipl-rotterdam` | ipl rotterdam | /behandelingen/nordlys-pigment, /behandelingen/nordlys-roodheid |

`laserontharing rotterdam` staat er niet bij: `/laserontharing` draagt die titel al en is de
grootste pagina van de site. Die versterken is beter dan er een tweede naast zetten.

### Golf 2: af op 11 september 2026

| Pagina | Zoekvraag | Mag niet botsen met |
|---|---|---|
| ✅ `/kennisbank/oxygeneo-rotterdam` | oxygeneo rotterdam | /behandelingen/oxygeneo |
| ✅ `/kennisbank/dermaplaning-rotterdam` | dermaplaning rotterdam | /behandelingen/dermaplaning |
| ✅ `/kennisbank/skinboosters-rotterdam` | skinboosters rotterdam | /behandelingen/skinboosters |
| ✅ `/kennisbank/fotona-4d-rotterdam` | fotona 4d rotterdam | /behandelingen/fotona-4d en de vier stappen |
| ✅ `/kennisbank/cosmelan-dermamelan-rotterdam` | cosmelan rotterdam, dermamelan rotterdam | /behandelingen/cosmelan, /behandelingen/dermamelan |
| ✅ `/kennisbank/elektrische-epilatie-rotterdam` | elektrische epilatie rotterdam | /behandelingen/elektrische-epilatie |

Drie keuzes in deze golf:

- **Cosmelan en Dermamelan staan op één pagina.** Zelfde merk en dezelfde opzet van zes
  maanden; twee pagina's zouden voor het grootste deel hetzelfde zeggen en elkaar
  beconcurreren. Beide namen staan in de titel, en het verschil tussen de twee is een eigen
  sectie.
- **LED-therapie heeft geen eigen pagina gekregen.** Een toevoeging van € 30 die bijna
  altijd naast iets anders gebeurt, levert een dunne pagina op. Hij staat in de
  vergelijkingstabellen van IPL en OxyGeneo.
- **Snurken ook niet.** `/snurken` heet al "Snurken behandelen met laser in Rotterdam".

Pagina's zonder reviews over hun onderwerp tonen geen reviewsectie: Cosmelan, Fotona, IPL en
elektrische epilatie. Over pigment en huidveroudering is in de reviews niets geschreven, en
"laser" gaat daar vrijwel altijd over ontharen. De vier gezichtspagina's tonen elk een ander
drietal reviews, zodat wie doorklikt niet steeds dezelfde drie leest.

### Golf 3: af op 12 september 2026

De laag zonder plaatsnaam: de vraag die iemand stelt voordat hij weet welke kliniek hij
zoekt. Deze pagina's verkopen niets direct en dat is het punt; ze bouwen de autoriteit
waarop golf 1 en 2 rusten, en ze zijn het soort antwoord dat aangehaald wordt.

| Pagina | Zoekvraag | Wat de pagina draagt |
|---|---|---|
| ✅ `/kennisbank/fitzpatrick-huidtype` | fitzpatrick huidtype, welk huidtype heb ik | De zes types, met per type de golflengte uit de apparaatdata |
| ✅ `/kennisbank/hoeveel-sessies` | hoeveel sessies microneedling, hoeveel sessies laserontharing | Tien behandelingen met hun aantal en tarief, uit één bron |
| ✅ `/kennisbank/zon-en-je-huid` | mag ik in de zon na laseren, hoe lang wachten na de zon | Acht behandelingen, met een gebruinde huid en erna |
| ✅ `/kennisbank/zwanger-of-borstvoeding` | huidbehandeling tijdens zwangerschap | Tien behandelingen met wat wel en wat wacht |
| ✅ `/kennisbank/huidkliniek-kiezen` | hoe kies je een huidkliniek | Zeven punten die je zelf kunt nakijken, bij elke kliniek |

**Vier zoekvragen uit de eerste opzet zijn niet gebouwd, en dat is geen uitstel.** Bij het
nalopen bleken ze al bezet, en een tweede pagina ernaast is precies de kannibalisatie die
hoofdstuk 3 verbiedt:

- **wordt huidtherapie vergoed.** `/vergoedingen` beantwoordt dat als route van drie vragen,
  inclusief de nee-tak. Versterken is beter dan een tweede pagina.
- **wat kost laserontharing.** `/laserontharing` draagt die titel, met alle zones op
  `/tarieven` en een configurator ernaast.
- **huidtherapeut of schoonheidsspecialist.** Staat als vergelijkingstabel op
  `/kennisbank/huidtherapeut-rotterdam`, met vier beroepen naast elkaar.
- **welke behandeling bij welk acnestadium.** `/huidproblemen/acne` heet al "Acne behandelen
  in Rotterdam" en heeft de doorsnede door de vier stadia.

**Wat er technisch veranderde.** Het sjabloon kent nu twee soorten: een plaatspagina met een
tariefblok, en een vraagpagina zonder. Op een vraagpagina staat dus ook geen Service in het
schema; een aanbod zonder bedrag hoort daar niet in. De build laat een plaatspagina zonder
tarieven falen, en tarieven zonder dienst ook. In de kennisbank kregen de vraagpagina's een
eigen hoofdstuk ("Wat voor elke behandeling geldt"), en de pagina over het kiezen van een
kliniek staat onder "Zelf beoordelen wat je voorgeschoteld krijgt". Dat hoofdstuk beloofde
tot nu toe iets wat er niet stond.

Elke vraagpagina krijgt zeventien verwijzingen binnen, alle uit de kennisbanklaag: het
register, de zestien andere landingspagina's, en daarnaast inhoudelijke zinnen vanaf de
plaatspagina's waar de vraag opkomt.

### Golf 4: af op 12 september 2026

Geen nieuwe pagina's. Deze golf gaat over de pagina's die er al stonden en hun zoekvraag
niet claimden, en over twee plekken waar twee pagina's dezelfde vraag claimden. Dat is
regel 3 van hoofdstuk 3, nu toegepast op de site zelf: bestaat de vraag al als pagina, dan
versterk je die.

**Twee keer twee pagina's op één zoekvraag, opgelost.**

- `/over-ons` en `/ons-verhaal` droegen allebei letterlijk de kop "Een huidkliniek in
  Rotterdam", terwijl de homepage die zoekvraag al draagt. Drie pagina's op één term is
  geen drie keer zoveel kans; Google kiest er dan zelf een. Nu draagt `/over-ons` de feiten
  over de kliniek en `/ons-verhaal` de werkwijze, met een eigen kop en omschrijving.
- `/gentlemax-pro` heette net zo als `/apparatuur/gentlemax-pro`. De apparaatpagina houdt
  het apparaat; de andere draagt nu de vraag welke van de twee golflengtes bij jouw huidtype
  hoort, met de kiezer erbij. Ze wijzen naar elkaar, en de nieuwe pagina over het
  Fitzpatrick-huidtype wijst er ook naartoe.

**Tien titels die niets claimden.**

| Pagina | Was | Is |
|---|---|---|
| `/tarieven` | Tarieven | Tarieven huidbehandelingen Rotterdam |
| `/behandelingen` | Behandelingen | Huidbehandelingen in Rotterdam |
| `/nazorg` | Nazorg | Nazorg: wat mag wanneer weer |
| `/intake` | Het huidconsult | Het huidconsult: wat er gebeurt |
| `/apparatuur` | Onze apparatuur | Apparatuur in onze huidkliniek |
| `/reviews` | Reviews | Ervaringen van onze klanten |
| `/kennisbank` | Kennisbank | Kennisbank: alles wat we uitleggen |
| `/gentlemax-pro` | GentleMax Pro | Welke laser past bij jouw huidtype |
| `/over-ons` | Over ons | Over Diba Clinics in Rotterdam |
| `/ons-verhaal` | Ons verhaal | Hoe wij werken |

Elke titel blijft met " | Diba Clinics" erachter binnen de zestig tekens, en de titelscan
meldt nog steeds nul dubbele titels en nul dubbele omschrijvingen.

**En de intro van de kennisbank.** Die telde op hoeveel huidprobleem-, apparaat- en
behandelpagina's er zijn. Yasin: dat slaat nergens op om te benoemen. Hoeveel pagina's er
zijn is ons probleem; de bezoeker wil weten wat hij er vindt. De intro zegt dat nu, het
uitklapblok eronder is weg en de tweede link staat gecentreerd onder de knop.

### Wat we níet bouwen: pagina's per wijk

"hydrafacial kralingen", "hydrafacial hillegersberg", "hydrafacial rotterdam noord": dat
heet een doorway page en Google heeft er een eigen beleidsregel voor. Je krijgt er tijdelijk
verkeer mee en daarna een handmatige maatregel op de hele site. Eén kliniek, één plaats.

Wel toegestaan, en effectief: de wijk noemen ín de tekst waar hij er echt toe doet, zoals de
route en het parkeren. Dat staat er nu ook zo.

---

## 6. Technisch: wat er nog moet

In volgorde van belang. Twee dingen zijn op 11 september al opgelost en staan er voor de
volledigheid bij.

### ✅ Opgelost: 46 behandelpagina's zonder eigen titel

Gevonden met een scan over de hele sitemap. Alle 46 pagina's onder `/behandelingen/` hadden
de titel en de omschrijving van de homepage, geen canonical en geen deelbeeld: in de
zoekresultaten stond boven elke behandeling "Diba Clinics | Rotterdam". De functie die dat
had moeten regelen werd geïmporteerd en nooit aangeroepen. Nu heeft elke behandeling een
eigen titel (de naam, zonder "in Rotterdam", zodat hij niet concurreert met de klacht- en
landingspagina's) en een omschrijving met het tarief erin. De scan meldt 0 pagina's met de
standaardtitel, 0 zonder canonical en 0 dubbele titels.

### ✅ Opgelost: de sitemap loog over `lastmod`

Elke pagina meldde bij elke build dat hij vandaag gewijzigd was. Nu komt de datum uit git:
de laatste commit die het bestand van de pagina of zijn databestand raakte. Een
landingspagina draagt daarnaast zijn eigen datum. Staat er geen git-geschiedenis op de
bouwmachine, dan blijft het veld weg in plaats van dat er een datum verzonnen wordt.

### 6a. De hero-video is het grootste risico voor de snelheid (hoog)

`hero-breed.mp4` is 5,8 MB en laadt op het eerste scherm van de homepage. Dat is de pagina
waar Google de snelheid van meet. Concreet:

- Poster eerst tonen, video pas daarna laden.
- Een WebM- of AV1-versie ernaast; dat halveert het bestand meestal.
- `preload="none"` op mobiel.

### 6b. 24,7 MB dode video in de deploy (hoog, en makkelijk)

`public/videos/hero-hydrafacial.mp4` is 24,7 MB en wordt alleen gebruikt door
`HeroVariantVideo`, dat in de variant zit die sinds de livegang niet meer getoond wordt. Het
bestand gaat wel mee in elke deploy. Nakijken en weghalen.

### 6c. hreflang, zodra er een tweede taal is (later, maar nu al plannen)

De taalkiezer belooft Engels, Spaans en Frans. Zodra de eerste er staat, is hreflang
verplicht; zonder dat gaan de vertalingen met het Nederlands concurreren in plaats van het
te versterken. Plan de URL-structuur (`/en/...`) vóór de eerste vertaling en niet erna.

### 6e. Doorlopend

- Search Console: het dekkingsrapport en het rapport over structuurdata maandelijks nalopen.
- Beeld: alles loopt via `next/image`, dus AVIF en WebP komen automatisch. Goed zo.
- 404's en doorverwijzingen: `redirects.ts` doet dit netjes. Bij elke verwijderde route hoort
  daar een regel bij.

---

## 7. Buiten de site, en dit is waar de lokale winst zit

De site is ongeveer de helft van het verhaal. Voor het lokale pakket is het minder dan dat.

### 7a. Het Google-bedrijfsprofiel (het hoogste rendement van alles in dit plan)

**Eerst de fout die er nu in staat:** het profiel vermeldt postcode **3054 HG**, het juiste
adres is **3054 LS**. NAP-consistentie (naam, adres, telefoon overal identiek) is een direct
signaal voor het lokale pakket, en dit breekt het. Dit repareren is het eerste wat er moet
gebeuren en het kost tien minuten.

Daarna, op volgorde:

1. **Categorieën.** Hoofdcategorie "Huidtherapeut" of "Medische kliniek", niet
   "Schoonheidssalon". Dit is het zwaarste enkele veld in het hele profiel.
2. **Diensten**, met tarief, voor elke behandeling die een landingspagina krijgt. Elke dienst
   koppelen aan de bijbehorende pagina.
3. **Foto's**, wekelijks een paar. Eigen materiaal, en dat is er.
4. **Vragen en antwoorden** zelf aanmaken: dezelfde tien vragen als op de landingspagina's.
   Dat mag en het werkt.
5. **Berichten** bij elke nieuwe landingspagina.

### 7b. Google-reviews, niet alleen Salonized-reviews

3.893 reviews in Salonized is een schat, maar het lokale pakket leest Google-reviews. Het
verschil tussen die twee getallen is waarschijnlijk het grootste onbenutte voordeel dat deze
kliniek heeft. Een vaste vraag na de afspraak, met een korte link, verandert dat binnen een
kwartaal.

Belangrijk: nooit sturen op alleen tevreden klanten en nooit iets teruggeven voor een review.
Dat is in strijd met het beleid van Google en met wat er in de stijlgids staat.

### 7c. De oude WordPress-site opruimen (hoog, en het is een risico)

Op dibaclinics.nl stond gokspam in de voettekst en onder `/wp-includes/`. Zolang daar iets
van overeind staat, loopt het domein kans op een "deze site is mogelijk gehackt"-melding, en
dat kost meer verkeer dan dit hele plan oplevert. Opschonen of volledig uitzetten,
en daarna een herbeoordeling aanvragen in Search Console.

### 7d. Vermeldingen elders, met exact dezelfde gegevens

Elke plek die hetzelfde adres, telefoonnummer en aanbod noemt, verhoogt het vertrouwen, bij
Google én bij de taalmodellen. Op volgorde van waarde voor een zorgaanbieder:

ZorgkaartNederland, de ledenlijst van de NVH, het Kwaliteitsregister Paramedici, ANBOS,
Apple Maps, Bing Places, Treatwell, het Salonized-profiel en de branchegidsen van Rotterdam.

Precies dezelfde schrijfwijze overal. "Diba Clinics", niet "DIBA Clinics" en niet "Diba
Beauty Center". Dat laatste staat nu nog in het Facebook-adres; de pagina zelf heet al goed.

---

## 8. Meten, en wanneer

Zonder dit is de rest een gevoel.

| Wat | Waar | Hoe vaak |
|---|---|---|
| Vertoningen, kliks, positie per zoekvraag | Search Console | wekelijks 15 minuten |
| De 24 doelzoekvragen, positie | Search Console, gefilterd | maandelijks |
| Verkeer en afspraken per pagina | GA4 (na toestemming) | maandelijks |
| Aanvragen via het profiel | Google Business Profile | maandelijks |
| Nieuwe Google-reviews | Google Business Profile | maandelijks |
| Snelheid van de homepage | PageSpeed Insights, veldgegevens | maandelijks |

### Hoe je zichtbaarheid in de antwoordmachines meet

Er is nog geen betrouwbaar gereedschap voor. De werkbare methode is handwerk en duurt een
half uur per maand: stel aan ChatGPT, Perplexity, Gemini en Google AI Overviews steeds
dezelfde tien vragen, en noteer twee dingen.

1. Wordt Diba Clinics genoemd?
2. Klopt wat er genoemd wordt? Het tarief, het adres, het apparaat?

Die tweede is de belangrijkste en wordt bijna altijd vergeten. Een model dat je noemt met een
tarief van vier jaar geleden schaadt meer dan dat het oplevert, en het is te repareren door
de juiste versie duidelijker en op meer plekken te zetten.

De tien vragen om mee te beginnen:

1. Waar kan ik in Rotterdam een HydraFacial laten doen?
2. Wat kost een HydraFacial in Rotterdam?
3. Wat is een goede huidkliniek in Rotterdam voor acne?
4. Welke kliniek in Rotterdam doet laserontharing met de GentleMax Pro?
5. Wat is het verschil tussen een huidtherapeut en een schoonheidsspecialist?
6. Hoeveel sessies laserontharing heb ik nodig?
7. Wordt huidtherapie vergoed door de zorgverzekering?
8. Wat kost een microneedlingbehandeling in Nederland?
9. Welke huidkliniek in Rotterdam werkt met de HydraFacial Syndeo?
10. Hoe weet ik of een kliniek aangesloten is bij een beroepsvereniging?

---

## 9. Wat we niet doen

Deze lijst is net zo belangrijk als de rest, want elk van deze dingen werkt op de korte
termijn en kost je daarna het domein.

- Pagina's per wijk of per buurt voor dezelfde behandeling.
- Teksten laten genereren en in bulk publiceren.
- Links kopen, linkruil, artikelen op netwerken.
- Reviews vragen in ruil voor iets, of alleen aan wie tevreden is.
- "De beste huidkliniek van Rotterdam" zonder controleerbaar bewijs. Ook niet in een
  paginatitel, ook niet in een advertentie.
- Zoekwoorden herhalen tot een gewone lezer het zou opmerken.
- Een medische passage publiceren voordat Rojda hem heeft nagekeken.
- Een tarief in het schema zetten dat niet op de pagina staat.

---

## 10. De eerste twee weken, concreet

| # | Wat | Wie | Duur |
|---|---|---|---|
| 1 | Postcode in het Google-profiel naar 3054 LS | Okan | 10 min |
| 2 | Hoofdcategorie van het profiel nalopen | Okan | 15 min |
| 3 | De oude WordPress-site opschonen of uitzetten | Yasin | — |
| 4 | De HydraFacial-pagina inhoudelijk nakijken (medische passages) | Rojda | 30 min |
| 5 | Wat er in Deluxe en Platinum zit aanleveren | Okan | 10 min |
| 6 | Search Console koppelen en de 24 doelzoekvragen vastleggen | Yasin | 1 uur |
| 7 | ✅ Interne verwijzingen naar de landingspagina's, nu vanzelf via vier wegen | Claude | af |
| 8 | ✅ Zestien landingspagina's erbij in golf 1, 2 en 3, samen zeventien met HydraFacial | Claude | af |
| 9 | Diensten met tarief in het bedrijfsprofiel zetten | Okan | 1 uur |
| 10 | De hero-video verkleinen en de dode video weghalen | Claude | — |
| 11 | De tien vragen van hoofdstuk 8 voor het eerst stellen, als nulmeting | Yasin | 30 min |
| 12 | ✅ Golf 4: tien bestaande pagina's die hun zoekvraag niet claimden, en twee dubbele pagina's uit elkaar | Claude | af |

---

## Bijlage: waar het in de code staat

| Onderdeel | Bestand |
|---|---|
| Titels, omschrijvingen, canonical, Open Graph | `src/lib/seo.ts` |
| Alle schema-generatoren | `src/lib/schema.tsx` |
| Sitemap | `src/app/sitemap.ts` |
| robots.txt met de AI-crawlers | `src/app/robots.ts` |
| Bedrijfsgegevens, NAP, openingstijden | `src/lib/site.ts` |
| Het sjabloon voor een landingspagina | `src/components/kennisbank/LandingPagina.tsx` |
| De route van alle landingspagina's | `src/app/kennisbank/[slug]/page.tsx` |
| De teksten, één bestand per pagina | `src/data/landings/*.ts` |
| Het register met de bouwcontroles | `src/data/landings/index.ts` |
| De vorm en de gedeelde regels | `src/data/landings/types.ts` |
| De naaf waar ze aan hangen | `src/data/kennisbank.ts` |
| De verwijzing terug vanaf een behandeling | veld `landing` in `src/data/behandelingen.ts` |
| De acht controlescripts | `scripts/controleer-*.mjs` |
