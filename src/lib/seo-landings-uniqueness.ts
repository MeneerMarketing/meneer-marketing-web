import type {
  SeoLandingCard,
  SeoLandingCategory,
  SeoLandingFaq,
  SeoLandingHotTake,
  SeoLandingPage,
  SeoLandingStep,
} from "@/data/seo-landings/types";
import { cityProfile, fill, hashSlug, pageVars, pick, pickMany } from "@/lib/seo-landings-voice";

type Card = SeoLandingCard;
type Step = SeoLandingStep;

function mergeCards(
  slug: string,
  base: readonly Card[],
  alts: readonly Card[],
  count: number,
  salt: string,
  vars: Record<string, string>,
): Card[] {
  const baseCount = (hashSlug(slug, `${salt}-split`) % 2) + 1;
  const fromBase = pickMany(slug, base, Math.min(baseCount, base.length, count), `${salt}-base`);
  const need = count - fromBase.length;
  const fromAlts = need > 0 ? pickMany(slug, alts, Math.min(need, alts.length), `${salt}-alt`) : [];
  const merged = [...fromBase, ...fromAlts].slice(0, count);
  const orderSalt = hashSlug(slug, `${salt}-order`);
  return merged
    .map((c, i) => ({
      title: fill(c.title, vars),
      body: fill(c.body, vars),
      _sort: (orderSalt + i * 13) % 997,
    }))
    .sort((a, b) => a._sort - b._sort)
    .map(({ title, body }) => ({ title, body }));
}

function mergeSteps(
  slug: string,
  base: readonly Step[],
  alts: readonly Step[],
  count: number,
  salt: string,
  vars: Record<string, string>,
): Step[] {
  const replaceCount = hashSlug(slug, `${salt}-replace`) % 2 === 0 ? 2 : 1;
  const keep = pickMany(slug, base, Math.max(1, count - replaceCount), `${salt}-keep`);
  const add = pickMany(slug, alts, Math.min(replaceCount, alts.length), `${salt}-add`);
  const merged = [...keep.slice(0, count - add.length), ...add].slice(0, count);
  return merged.map((s) => ({
    title: fill(s.title, vars),
    body: fill(s.body, vars),
  }));
}

const PAIN_ALTS: Record<SeoLandingCategory, readonly Card[]> = {
  "google-ads": [
    { title: "ROAS op papier, leegte in de kassa", body: "Je dashboard zegt 400%. Je boekhouder zegt iets anders. Meestal liegt je attributie, niet je gevoel." },
    { title: "Performance Max zonder controle", body: "Google beslist waar je geld naartoe gaat. Jij krijgt een mooie grafiek. Niemand legt uit welke zoektermen echt verkopen." },
    { title: "Landings die niet matchen", body: "Je ad belooft A. Je pagina vertelt B. Je betaalt voor mensen die binnen vijf seconden denken: verkeerde winkel." },
    { title: "Remarketing op iedereen", body: "Je stalkt mensen die alleen je openingstijden zochten. Ze haten je banner. Jij betaalt voor die haat." },
    { title: "Shopping feed vol fouten", body: "Merchant Center piept. Je negeert het. Dan stopt Shopping opeens alsof iemand de stekker eruit trok." },
    { title: "Negatievenlijst uit 2019", body: "Je betaalt nog steeds voor 'gratis', 'vacature' en 'wiki'. Dat geld had thuis kunnen blijven." },
    { title: "Conversietracking half", body: "Je optimaliseert op formulier-opens terwijl je echte winst in telefoontjes zit. Google leert op verkeerde signalen." },
    { title: "Agency die alleen opschaalt", body: "Meer budget, zelfde structuur. Als het niet werkt bij €500, werkt het zelden bij €5.000 zonder iets fundamenteels te veranderen." },
  ],
  seo: [
    { title: "Pagina 1 zonder leads", body: "Je rankt. Niemand belt. Meestal antwoordt je pagina de vraag niet hard genoeg of je CTA staat waar niemand kijkt." },
    { title: "Blogfabriek zonder route", body: "Veertien posts per kwartaal. Interne links ontbreken. Pagina's die echt geld opleveren? Die ontbreken ook. Volume is geen strategie." },
    { title: "Core Web Vitals genegeerd", body: "Google ziet traag. Jij ziet mooi design. Op mobiel wint vaak degene die het snelst laadt, niet degene met de mooiste hero." },
    { title: "GBP als spookhuis", body: "Je profiel bestaat. Je laatste post is ouder dan je laatste klant. Lokaal vertrouwen sterft in stilte." },
    { title: "Concurrent kopieert, jij ook", body: "Iedereen heeft dezelfde H1 met stadnaam erachter. Google kiest degene met het sterkste antwoord, niet degene die het hardst schreeuwt." },
    { title: "Schema markup mist", body: "Je laat rich results liggen alsof het luxe is. Het is gratis zichtbaarheid die je concurrent wél pakt." },
    { title: "Dunne dienstpagina's", body: "Honderd woorden over 'kwaliteit en service'. Google leest dat als: hier is niets unieks te vinden." },
    { title: "AI-zoek vergeten", body: "ChatGPT noemt je concurrent. Jij focust alleen op blauwe links. Vindbaarheid is breder geworden." },
  ],
  website: [
    { title: "Mooi design, stille inbox", body: "Award-waardige homepage. Nul aanvragen. Meestal is de boodschap te vaag of je formulier te veel werk op mobiel." },
    { title: "Page builder als eindstation", body: "Je site groeit trager naarmate je meer plugins stapel. Google merkt het. Klanten merken het. Jij betaalt voor upgrades." },
    { title: "Alles op één pagina", body: "Je homepage moet verkopen, informeren, werven en bloggen. Daarom snapt niemand wat je doet." },
    { title: "Campagnes zonder landings", body: "Je ads sturen naar je homepage. Die moet alles aan. Spoiler: dat kan geen enkele pagina." },
    { title: "Laadtijd op 4G vergeten", body: "Op kantoor-wifi voelt alles snel. Je klant scrollt in de trein. Die wacht niet op je hero-video." },
    { title: "Copy van je concurrent", body: "Zelfde woorden, andere kleur. Google en mensen ruiken template-gedrag. Beiden klikken door." },
    { title: "Tracking na livegang", body: "Je lanceert, dan pas meet je. Je eerste maand data is weg. Dat is duur lerengeld." },
    { title: "Mobiel als bijzaak", body: "Je CTA zit onder drie scrolls op je telefoon. 70% van je verkeer ziet hem nooit." },
  ],
  shopify: [
    { title: "Apps die je shop vertragen", body: "Elke app belooft +12% conversie. Samen geven ze je een CWV-probleem en een factuur van €400 per maand." },
    { title: "Checkout-frictie", body: "Mensen vullen hun mand. Dan vraagt je checkout om een account, drie velden extra en hun grootmoeders meisjesnaam." },
    { title: "Product-SEO als bijlage", body: "Titels uit de leverancier. Structuur ontbreekt. Google indexeert je wel, maar verkoopt voor je concurrent met betere copy." },
    { title: "Feed vs werkelijkheid", body: "Je Shopping-ad toont prijs A. Je site toont prijs B na kortingscode. Google houdt niet van verrassingen." },
    { title: "Theme-limitaties", body: "Je wilt iets unieks. Je theme zegt nee. Je lost het op met JavaScript-snippets die niemand meer begrijpt." },
    { title: "Winkelwagens zonder opvolging", body: "Mensen laten €80 liggen. Je stuurt geen mail. Dat is gratis geld dat elke week terugkomt." },
    { title: "B2B op B2C-logica", body: "Groothandel via mail en Excel terwijl je shop live staat. Dubbel werk, halve marge." },
    { title: "Migratie zonder plan", body: "Nieuwe shop, oude URL's dood. Organisch verkeer valt als een steen. Redirects zijn saai maar redden omzet." },
  ],
  content: [
    { title: "Volume zonder intentie", body: "Drie blogs per week. Koopwoorden ranken ze niet. Je team is moe. Google is ongeïnteresseerd." },
    { title: "AI-bulk zonder stem", body: "Honderd pagina's in een weekend. Je merk is onherkenbaar. AI-zoek citeert je ook niet." },
    { title: "Sterke pagina's zonder route", body: "Je sterke pagina's linken nergens naartoe. Je zwakke pagina's sterven alleen. Autoriteit lekt weg." },
    { title: "FAQ die niemand leest", body: "Vijftien vragen onderaan, copy-paste uit je branche. Ze beantwoorden niet wat je klant echt typt in Google." },
    { title: "Social zonder owned", body: "Al je content leeft op platforms die morgen het bereik kunnen dichtdraaien. Je domein blijft leeg." },
    { title: "Case studies zonder cijfers", body: "'We hielpen een klant groeien.' Welke klant? Welk getal? Zonder bewijs is het marketinggeruis." },
    { title: "Content los van ads", body: "Je blog praat over A. Je ads verkopen B. Bezoekers voelen die mismatch en vertrekken." },
    { title: "Update-skuld", body: "Posts uit 2022 met oude prijzen en verkeerde tools. Google ziet verouderd. Klanten zien onbetrouwbaar." },
  ],
  "b2b-portal": [
    { title: "Orders via mail en Excel", body: "Je team copy-pastet prijzen terwijl je shop al live staat. Fouten kosten marge. Tijd kost groei." },
    { title: "Leads in Gmail", body: "Aanvragen verdwijnen tussen nieuwsbrieven. Opvolging duurt dagen. Je concurrent antwoordt in uren." },
    { title: "Portal dat niemand gebruikt", body: "Duur gebouwd, leeg gelaten. Klanten bellen liever omdat inloggen harder is dan bellen." },
    { title: "Handmatige prijslijsten", body: "PDF versie 7. Site versie 4. Klant ziet andere prijs. Vertrouwen weg, marge onder druk." },
    { title: "CRM los van marketing", body: "Sales werkt in tool A. Marketing in tool B. Niemand weet welke lead warm is." },
    { title: "Automatisering uitgesteld", body: "'Volgend kwartaal.' Intussen betaal je mensen voor robotwerk." },
    { title: "Self-service te ingewikkeld", body: "Je wilde klanten zelf laten bestellen. Ze moeten vijf schermen door. Ze mailen je alsnog." },
    { title: "Verkopen zonder marge-inzicht", body: "Je verkoopt online zonder te weten welke klant winst oplevert. Opschalen wordt gokken." },
  ],
};

const DELIVERABLE_ALTS: Record<SeoLandingCategory, readonly Card[]> = {
  "google-ads": [
    { title: "Zoektermen-audit", body: "Welke queries kosten geld zonder oplevering? Die gaan eruit voordat ik opschaal." },
    { title: "Breakeven-rekening", body: "Marge, AOV, conversie. Pas als het klopt, gaat budget omhoog." },
    { title: "Ad copy die matcht", body: "Teksten die passen bij wat je landings beloven. Niet generieke headlines." },
    { title: "Merchant Center opschonen", body: "Feed, disapprovals, supplemental data. Shopping begint hier, niet in de campagne-knop." },
    { title: "Remarketing met grenzen", body: "Herkenning zonder stalken. Doelgroepen op koopintentie, niet op nieuwsgierigen." },
    { title: "Weekly tune-ups", body: "Elke week iets bijsturen op basis van echte data. Set-and-forget bestaat niet." },
    { title: "Landings from scratch", body: "Als je pagina niet converteert, bouw ik er een die wel past bij je sterkste ad." },
    { title: "Meta + Google één plan", body: "Twee kanalen, één strategie. Eén lijn, één stem." },
  ],
  seo: [
    { title: "Technische basis", body: "Indexatie, canonicals, sitemap, CWV. Saai tot het niet saai is." },
    { title: "Intentie-mapping", body: "Welke vraag hoort op welke URL? Structuur wint van keyword-stuffing." },
    { title: "Schema & rich results", body: "FAQ, LocalBusiness, Product waar het hoort. Gratis extra zichtbaarheid." },
    { title: "GBP + site sync", body: "Je profiel en website vertellen hetzelfde verhaal. Lokaal vertrouwen in één lijn." },
    { title: "Interne link-architectuur", body: "Je sterke pagina's tillen de rest. Elke pagina hangt ergens aan." },
    { title: "AI-zoek optimalisatie", body: "Duidelijke antwoorden die ChatGPT en Gemini kunnen citeren." },
    { title: "Content die één vraag wint", body: "Dieper dan de top 3, niet breder dan nodig." },
    { title: "Monitoring zonder drama", body: "Rankings, clicks, conversies. Actie per week, niet een maandrapport vol vage KPI's." },
  ],
  website: [
    { title: "Next.js from scratch", body: "Semantische HTML, snelheid en ruimte om te groeien. Alles custom, zonder theme-plafond." },
    { title: "Mobiel-first QA", body: "Ik test op telefoon vóór ik trots ben op desktop." },
    { title: "Landings per dienst", body: "Elke dienst krijgt een pagina die één ding goed doet: converteren." },
    { title: "Tracking vooraf", body: "GTM, conversies, events. Meetbaar vanaf dag één." },
    { title: "Schema ingebouwd", body: "Organization, Service, FAQ. SEO-basis zit in de code, niet in een plugin." },
    { title: "Core Web Vitals groen", body: "Snelheid is geen nice-to-have. Het is je eerste indruk." },
    { title: "Copy in Meneer-stem", body: "Jij/je, direct, soms droog. Meneer-stem, niet bureau-template." },
    { title: "Klaar voor campagnes", body: "Site staat strak vóór je eerste euro ad spend live gaat." },
  ],
  shopify: [
    { title: "Theme op maat", body: "Waar het theme stopt, begint custom. Zonder app-hel." },
    { title: "Product-SEO structuur", body: "Titels, collecties, filters die Google én klanten snappen." },
    { title: "Checkout optimalisatie", body: "Minder stappen, meer vertrouwen, hogere AOV." },
    { title: "Feed hygiene", body: "Shopping die niet random uitvalt omdat iemand vergat een veld in te vullen." },
    { title: "App-audit", body: "Weg met wat je CWV sloopt en je niets oplevert." },
    { title: "Klaviyo / e-mail flows", body: "Abandoned cart, post-purchase, win-back. Geld dat terugkomt." },
    { title: "B2B laag", body: "Groothandel, staffelprijzen, portal-koppeling waar het past." },
    { title: "Migratie met redirects", body: "Van WooCommerce of elders zonder organische dip te accepteren als norm." },
  ],
  content: [
    { title: "Vraag-onderzoek", body: "Wat typen klanten écht? Dat wordt je contentplan, niet giswerk." },
    { title: "Antwoord-pagina's", body: "Eén pagina per intentie. Rankbaar én citeerbaar." },
    { title: "Interne link-plan", body: "Nieuwe content heft bestaande pagina's op, niet andersom." },
    { title: "Stem & tone guide", body: "Herkenbaar als jij, niet als ChatGPT in bulk." },
    { title: "Update-ritme", body: "Oude posts versterken vóór ik nieuwe content stapel." },
    { title: "FAQ die rankt", body: "Vragen die mensen stellen, beantwoord op je domein." },
    { title: "Case-blokken met cijfers", body: "Cases met echte cijfers waar het past. Meetbare resultaten die je bank begrijpt." },
    { title: "AI-zoek ready", body: "Structuur die machines kunnen samenvatten zonder je te misquoten." },
  ],
  "b2b-portal": [
    { title: "Proces-mapping", body: "Van lead tot order teken ik waar tijd lekt." },
    { title: "Portal UX", body: "Inloggen moet makkelijker zijn dan mailen. Anders gebruikt niemand het." },
    { title: "Shopify B2B laag", body: "Groothandel, staffels, klantgroepen zonder Excel-chaos." },
    { title: "n8n / Make flows", body: "Systemen aan elkaar knopen zodat data niet dubbel getypt wordt." },
    { title: "CRM-koppeling", body: "Leads komen aan waar sales ze ziet, niet in een inbox-graf." },
    { title: "Self-service bestellen", body: "Herbestellen in drie klikken. Minder telefoon, meer marge." },
    { title: "Automatische prijslijsten", body: "Eén bron van waarheid. Altijd actueel, niet PDF versie 12." },
    { title: "Training & overdracht", body: "Je team snapt het systeem. Volledige overdracht, jij kunt het ook bedienen." },
  ],
};

const PROCESS_ALTS: Record<SeoLandingCategory, readonly Step[]> = {
  "google-ads": [
    { title: "Account autopsie", body: "Wat lekt, wat werkt, wat weg mag. Feiten op tafel, geen schuldspel." },
    { title: "Landings check", body: "Ad + pagina naast elkaar. Mismatch = eerst fixen, dan budget." },
    { title: "Testbudget strak", body: "Klein, meetbaar, één hypothese per keer. Leren zonder branden." },
    { title: "Opschalen op bewijs", body: "ROAS/CPA op orde? Dan gas. Niet omdat de maand om is." },
    { title: "Negatieven schoonmaken", body: "Gratis-zoekers eruit. Budget naar koopintentie." },
    { title: "Remarketing aanscherpen", body: "Doelgroepen die echt warm zijn. Herkenning zonder stalking." },
  ],
  seo: [
    { title: "Technische scan", body: "Indexatie, snelheid, errors. Fundament vóór content." },
    { title: "Intentie per URL", body: "Welke pagina wint welke vraag? Elke URL zijn eigen intentie." },
    { title: "Quick wins", body: "Titels, interne links, dunne pagina's. Snel resultaat, dan dieper." },
    { title: "Content die wint", body: "Eén sterke pagina per zoekvraag. Dieper dan de top 3." },
    { title: "GBP + lokaal", body: "Profiel, posts, reviews. Site en kaart in sync." },
    { title: "Monitoren & bijsturen", body: "Rankings zijn niet het einddoel. Leads wel." },
  ],
  website: [
    { title: "Doel scherp", body: "Wat moet de site doen? Leads, sales, beide? Geen 'alles een beetje'." },
    { title: "Wireframe & copy", body: "Boodschap vóór pixels. CTA zichtbaar zonder scrollen." },
    { title: "Build in Next.js", body: "Snel, schoon, schaalbaar. Code die je durft aan te raken." },
    { title: "Tracking live", body: "Meten vóór campagnes. Anders gok je." },
    { title: "Mobiel QA", body: "Telefoon-test is de echte test." },
    { title: "Launch + iteratie", body: "Live is begin, niet eind. Data bepaalt volgende stap." },
  ],
  shopify: [
    { title: "Shop audit", body: "Snelheid, apps, checkout, feed. Waar lekt omzet?" },
    { title: "Structuur & SEO", body: "Collecties, producttitels, filters die Google snapt." },
    { title: "Theme / custom", body: "Build wat je nodig hebt, niet wat een theme toelaat." },
    { title: "Flows & e-mail", body: "Abandoned cart en post-purchase. Gratis geld activeren." },
    { title: "Shopping live", body: "Feed schoon, campagnes strak, landings matchen." },
    { title: "Opschalen", body: "Meer SKU's, B2B, international. Fundament houdt stand." },
  ],
  content: [
    { title: "Vragen verzamelen", body: "Sales, support, Google Search Console. Echt wat mensen vragen." },
    { title: "Prioriteit", body: "Welke antwoorden leveren geld op? Daar begin ik." },
    { title: "Schrijven & structureren", body: "Eén pagina, één intentie. Interne links mee." },
    { title: "Publiceren op owned", body: "Op je domein, niet alleen op LinkedIn." },
    { title: "Promoten slim", body: "Ads naar je sterkste antwoord-pagina, niet naar homepage." },
    { title: "Updaten", body: "Oude posts versterken. Kwaliteit boven eindeloos nieuw." },
  ],
  "b2b-portal": [
    { title: "Proces in kaart", body: "Lead tot factuur tekenen. Waar zit handmatig werk?" },
    { title: "Prioriteit kiezen", body: "Eén automatisering die direct uren teruggeeft." },
    { title: "Bouwen & koppelen", body: "Portal, flows, CRM. Eén waarheid, geen dubbel typen." },
    { title: "Testen met echt team", body: "Workflow met je medewerkers. Niet alleen een demo voor de board." },
    { title: "Live & trainen", body: "Je team snapt het. Iedereen kan ermee verder." },
    { title: "Meten & uitbreiden", body: "Uren bespaard, orders sneller. Dan volgende stap." },
  ],
};

const HOT_TAKE_ALTS: Record<SeoLandingCategory, readonly SeoLandingHotTake[]> = {
  "google-ads": [
    { label: "Heet take", body: "Als je bureau je site niet wil aanraken, koop je een thermometer terwijl het huis lekt." },
    { label: "Onpopular opinion", body: "Soms is stoppen met ads slimmer dan opschalen. Dat zeg ik ook. Liever eerlijk dan retainer." },
    { label: "Hard waar", body: "Broad match zonder negatieven is een verrassingsbox voor je rekening. Leuk voor Google, minder voor jou." },
    { label: "Meneer zegt", body: "Performance Max zonder schone feed is een slotmachine. Je weet niet waar het geld blijft." },
  ],
  seo: [
    { label: "Heet take", body: "Bloggen zonder intentie is een diary die niemand leest, behalve je moeder." },
    { label: "Onpopular opinion", body: "Pagina 1 zonder conversie is trofee SEO. Mooi op LinkedIn, nutteloos in je bank." },
    { label: "Hard waar", body: "Je concurrent rankt niet omdat hij slimmer is. Omdat zijn pagina een beter antwoord is." },
    { label: "Meneer zegt", body: "Lokaal SEO met alleen je adres in de footer is alsof je visitekaartje in de brievenbus gooit en wacht op klanten." },
  ],
  website: [
    { label: "Heet take", body: "Een page builder is geen website. Het is een huurcontract met trage groei." },
    { label: "Onpopular opinion", body: "Mooi design zonder CTA is een museum. Bezoekers kijken, niemand koopt." },
    { label: "Hard waar", body: "Als je site op mobiel traag is, betaal je dubbel: aan Google én aan gemiste klanten." },
    { label: "Meneer zegt", body: "From scratch klinkt duur tot je drie keer een theme hebt vervangen." },
  ],
  shopify: [
    { label: "Heet take", body: "Elke app belooft groei. Samen geven ze je een trage shop en een dikke Stripe-factuur." },
    { label: "Onpopular opinion", body: "Shopify is geen magie. Het is een platform. Jouw feed, copy en checkout bepalen of het werkt." },
    { label: "Hard waar", body: "Migreren zonder redirects is organische zelfmoord. Saai werk redt omzet." },
    { label: "Meneer zegt", body: "B2B op Shopify kan. Excel naast je shop is een keuze, geen wet." },
  ],
  content: [
    { label: "Heet take", body: "AI-bulk content is ruis in een zee van ruis. Je stem is je enige filter." },
    { label: "Onpopular opinion", body: "Drie blogs per week is een gewoonte, geen strategie." },
    { label: "Hard waar", body: "Content zonder interne links is een eiland. Niemand komt er, Google ook niet." },
    { label: "Meneer zegt", body: "Als ChatGPT je concurrent citeert en jou niet, is je content te vaag of te generiek." },
  ],
  "b2b-portal": [
    { label: "Heet take", body: "Leads in Gmail is alsof je goud in een emmer met gaten bewaart." },
    { label: "Onpopular opinion", body: "Automatisering is geen luxe voor later. Het is marge die je nu lekt." },
    { label: "Hard waar", body: "Een portal dat niemand gebruikt is duurder dan geen portal." },
    { label: "Meneer zegt", body: "Copy-pasten tussen Excel en je shop is een parttime baan die niemand wil." },
  ],
};

const PROOF_TWISTS = [
  " Eerst organisch bewijs, dan pas ads. Die volgorde houdt stand.",
  " Elk product verdient een eigen plan. Niet één account voor alles.",
  " Bij {kw} kopieer ik geen playbook. Wel principes die in eerdere trajecten bewezen zijn.",
  " Referenties zijn geen trofeeën. Het zijn voorbeelden van volgorde: fundament, dan schalen.",
  " Als {kw} niet past bij je marge, zeg ik het. Liever eerlijk dan je budget verbranden.",
] as const;

const CTA_TITLE_ALTS = [
  "{kw} zonder gokken?",
  "Klaar om {kw} serieus te nemen?",
  "Even checken of {kw} nu slim is?",
  "{kw}: plan of passen?",
  "Zullen we {kw} eerlijk doornemen?",
] as const;

const CTA_BODY_ALTS = [
  "Vertel waar je nu zit. Ik kijk eerlijk of dit nu slim is, of dat je eerst ergens anders winst pakt.",
  "Een gesprek over marge, timing en wat je site nu doet.",
  "Stuur je situatie. Ik reageer met eerlijk advies, soms ook met: doe dit eerst zelf.",
  "Intake is geen verkooptruc. Het is kijken of jij en ik samen iets kunnen bouwen dat je bank snapt.",
  "Liever een kort gesprek dan een vage offerte. Jij vertelt, ik reken hardop mee.",
] as const;

const UNIQUE_OPENERS: readonly string[] = [
  "Fun fact: de meeste pagina's over {kw} klinken alsof dezelfde AI vijf bureaus tegelijk bedient. Deze niet.",
  "Als je via Google hier bent beland, heb je waarschijnlijk al drie sites gezien die hetzelfde beloven. Ik begin met een vraag terug.",
  "Ik schrijf {kw} niet voor Google's algoritme alleen. Ik schrijf het voor jou, om 22:00, met je telefoon in je hand en twijfel in je hoofd.",
  "Direct over wat ik doe: wat het kost aan tijd en waar het misgaat als je het verkeerd aanpakt.",
  "Deze pagina staat op /zoeken/{slug}. Bewust uniek. Cannibalisatie met generieke bureau-copy is zinloos voor ons allebei.",
  "Meneer Marketing-stijl: direct, soms droog grappig, altijd met je marge in gedachten. {kw} included.",
  "Je zocht op {kw}. Google stuurde je hier. Ik beloof geen pagina 1 in een week. Wel een plan dat je begrijpt.",
  "Sommige bureaus beginnen met een deck. Ik begin met je cijfers, je site en de vraag: mag dit überhaupt?",
  "Dit is geen template met {city} ingevuld. Oké, {city} staat er wel in als het relevant is. De rest is op maat geschreven.",
  "Hot take vooraf: als {kw} niet past bij je situatie, zeg ik dat. Retainer zonder plan is niet mijn ding.",
  "Volgorde is alles: SEO, site, dan ads. Niet andersom.",
  "Ik ben geen bureau met twintig stagiairs. Ik ben Meneer Marketing: bouwen, campagnes, eerlijk advies. Eén lijn.",
  "Standaard FAQ's over {kw}? Die staan verderop. Eerst even menselijk.",
  "Je concurrent heeft waarschijnlijk ook een landingspagina over {kw}. Het verschil zit in uitvoering, niet in woorden.",
  "Als je alleen een prijs wilt vergelijken, klik gerust door. Als je wilt weten of het gaat werken, blijf even.",
];

const PAIN_SECTION_INTROS = [
  "Dit hoor ik wanneer iemand zoekt op {kw}. Herkenbaar? Dat mag. Wel een teken dat het anders mag.",
  "Deze drie dingen komen terug bij {kw}. Niet omdat je het verkeerd doet. Omdat de markt vol generieke adviezen zit.",
  "Als {kw} frustreert, zit je waarschijnlijk in één van deze situaties. Ik zie het wekelijks.",
  "Herkenning eerst. Dit zijn de patronen die ik zie rond {kw}{loc}.",
  "Voordat ik oplossingen bespreek: dit zijn de klachten die echt binnenkomen over {kw}.",
] as const;

const SCHEMA_FAQ_QUESTIONS = [
  "Wat is {kw} bij Meneer Marketing?",
  "Hoe pakt Meneer Marketing {kw} aan?",
  "Waarom {kw} via Meneer Marketing?",
  "Wat maakt {kw} hier anders dan bij een standaard bureau?",
  "Voor wie is {kw} bij Meneer Marketing bedoeld?",
] as const;

export const EXTRA_FAQ_POOL: Record<SeoLandingCategory, readonly SeoLandingFaq[]> = {
  "google-ads": [
    { question: "Wat maakt mijn {kw} anders dan een standaard bureau?", answer: "Ik bouw en optimaliseer zelf: site, landings, tracking, campagnes. Eén lijn van intake tot livegang." },
    { question: "Werk je ook voor kleinere budgetten?", answer: "Ja, als de rekensom klopt. Liever €800 strak dan €8.000 zonder plan." },
    { question: "Hoe snel kunnen we starten met {kw}?", answer: "Intake en plan vaak binnen een week. Een audit is sneller dan een volledige site rebuild vóór ads." },
    { question: "Moet ik al verkeer hebben voor {kw}?", answer: "Niet per se. Wel meetpunten. Zonder data is strategie gokken." },
    { question: "Wat als het niet werkt?", answer: "Dan zeg ik waarom en wat ik anders doe of stop. Cijfers bepalen, niet de kalender." },
    { question: "Beheer je Performance Max?", answer: "Ja, met schone feeds en duidelijke doelen. PMax zonder input is een gokautomaat." },
    { question: "Doe je ook Google Shopping?", answer: "Ja. Feed eerst, campagnes daarna. Anders betaal je voor producten die Google niet wil tonen." },
    { question: "Kun je mijn bestaande account overnemen?", answer: "Vaak wel. Eerst audit: wat lekt, wat blijft, wat weg mag." },
    { question: "Hoeveel kost {kw}?", answer: "Hangt af van markt, scope en advertentiebudget. Na intake krijg je een voorstel zonder pakketten die niet bij je passen." },
    { question: "Werk je op ROAS of CPA?", answer: "Wat past bij je marge. Soms is CPA leidend, soms ROAS. Ik kies vóór ik opschaal." },
    { question: "Moet mijn site af zijn vóór ads?", answer: "Hoeft niet perfect, wel converteerbaar. Anders vermenigvuldig je alleen je problemen." },
    { question: "Doe je ook remarketing?", answer: "Ja, met grenzen. Herkenning zonder stalken." },
    { question: "Kun je landingspagina's bouwen?", answer: "Dat is vaak stap één. Ad en pagina moeten hetzelfde verhaal vertellen." },
    { question: "Hoe vaak stuur je rapportages?", answer: "Zoals jij het nodig hebt. Ik stuur liever actie dan dertig pagina's groen." },
    { question: "Werk je met vaste contracten?", answer: "Nee verplichte lange contracten. Wel afspraken over scope en verwachting." },
  ],
  seo: [
    { question: "Hoe lang duurt {kw}?", answer: "Technische fixes: weken. Autoriteit en content: maanden. Garantie op pagina 1 beloof ik niet." },
    { question: "Doe je ook lokale SEO?", answer: "Ja. GBP, site, reviews in één lijn. Alleen je adres in de footer is niet genoeg." },
    { question: "Schrijf je content zelf?", answer: "Ja, in jouw stem waar mogelijk. AI helpt, redactie blijft menselijk." },
    { question: "Wat is het verschil met een SEO-bureau?", answer: "Ik bouw ook je site. SEO zonder technische controle is half werk." },
    { question: "Help je met AI-zoek?", answer: "Ja. ChatGPT en Gemini citeren duidelijke antwoorden op je domein." },
    { question: "Doe je linkbuilding?", answer: "Alleen kwaliteit boven kwantiteit. Slechte links zijn erger dan geen." },
    { question: "Moet ik WordPress houden?", answer: "Niet per se. Migratie naar Next.js kan slimmer zijn als je groeit." },
    { question: "Wat als ik al een SEO-partner heb?", answer: "Dan kijk ik wat ontbreekt: techniek, content, of uitvoering. Soms is samenwerken slimmer." },
    { question: "Hoe meet je succes?", answer: "Leads, omzet, rankings die converteren. Niet alleen impressions." },
    { question: "Doe je SEO-audits?", answer: "Ja. Snel inzicht in wat lekt en wat winst geeft." },
    { question: "Werk je voor e-commerce?", answer: "Ja. Shopify SEO is een specialiteit, inclusief productpagina's." },
    { question: "Hoe zit het met Core Web Vitals?", answer: "Die horen groen. Traag is geen SEO-probleem alleen, het is een conversie-probleem." },
    { question: "Kun je mijn concurrent analyseren?", answer: "Ja. Niet om te kopiëren, wel om te zien waar jij kunt winnen." },
    { question: "Is SEO nog zinvol met ads?", answer: "Juist samen. Organisch fundament eerst, ads daarna als het past." },
    { question: "Wat kost {kw}?", answer: "Scope-afhankelijk. Na intake een voorstel, geen standaardpakket uit de lade." },
  ],
  website: [
    { question: "Bouw je in WordPress?", answer: "Nee als eindstation. Custom build in Next.js of Shopify waar het past." },
    { question: "Hoe lang duurt een website?", answer: "Hangt af van scope. Landings sneller dan volledige corporate site met portal." },
    { question: "Doe je ook design?", answer: "Ja. Minimalistisch, premium, snel. Custom build, niet template met je logo erop." },
    { question: "Is mijn site daarna vindbaar?", answer: "SEO zit in de basis: semantiek, schema, snelheid. Ingebouwd vanaf dag één." },
    { question: "Kun je mijn huidige site migreren?", answer: "Ja, met redirects en plan. Organische dip hoef je niet te accepteren als norm." },
    { question: "Wat kost {kw}?", answer: "Projectmatig na intake. Geen €299-template prijzen, wel eerlijk voor custom work." },
    { question: "Lever je ook teksten?", answer: "Ja, in Meneer-stem of afgestemd op jouw merk. Echte copy, geen lorem ipsum live." },
    { question: "Kun je landingspagina's apart bouwen?", answer: "Ja. Vaak slimmer dan alles op de homepage proppen." },
    { question: "Werk je met bestaande huisstijl?", answer: "Ja. Design volgt merk, performance volgt best practice." },
    { question: "Is onderhoud inbegrepen?", answer: "Ik spreek hosting en updates met je af. Heldere afspraken, geen verrassingen achteraf." },
    { question: "Bouw je webshops?", answer: "Ja, vaak Shopify. Zie ook webshop-laten-maken als dat je pad is." },
    { question: "Hoe zit het met toegankelijkheid?", answer: "Semantische HTML en a11y-basics horen standaard. Ingebouwd, niet achteraf geplakt." },
    { question: "Kun je koppelen met mijn CRM?", answer: "Ja. Formulieren, webhooks, automatisering waar nodig." },
    { question: "Moet ik content aanleveren?", answer: "Kan. Ik help ook met structuur en copy als je wilt." },
    { question: "Wat na oplevering?", answer: "Meten, itereren, campagnes als het past. Live is begin." },
  ],
  shopify: [
    { question: "Migreer je van WooCommerce?", answer: "Ja, met redirect-plan. Anders betaal je dubbel in organische dip." },
    { question: "Bouw je custom themes?", answer: "Waar nodig. Snelle shop zonder app-hel die je CWV sloopt." },
    { question: "Doe je Shopify SEO?", answer: "Ja. Producten, collecties, techniek." },
    { question: "Kun je B2B op Shopify?", answer: "Ja. Groothandel, staffels, portal-koppeling." },
    { question: "Hoe zit het met Shopify apps?", answer: "Alleen met business case. Elke app kost snelheid en geld." },
    { question: "Doe je Google Shopping?", answer: "Ja, feed hygiene eerst." },
    { question: "Wat kost {kw}?", answer: "Scope-afhankelijk. Theme-tweak vs volledige rebuild vs migratie." },
    { question: "Lever je ook e-mail flows?", answer: "Ja, Klaviyo en abandoned cart waar het past." },
    { question: "Hoe snel kan een shop live?", answer: "Hangt af van catalogus en custom work. Eerlijke planning, geen valse beloftes." },
    { question: "Werk je met bestaande Shopify?", answer: "Ja. Audit, opschonen, optimaliseren." },
    { question: "Kun je checkout verbeteren?", answer: "Ja. Frictie zie je in omzet, niet in design mockups." },
    { question: "Doe je international?", answer: "Kan, met plan voor feeds, talen en structuur." },
    { question: "Is Shopify Plus nodig?", answer: "Niet altijd. Eerst kijken wat je echt nodig hebt." },
    { question: "Hoe meet je shop succes?", answer: "Conversie, AOV, ROAS, niet alleen bezoekers." },
    { question: "Wat na launch?", answer: "Marketing, SEO, ads. Shop is fundament, geen eindpunt." },
  ],
  content: [
    { question: "Schrijf je blogs?", answer: "Antwoord-pagina's die ranken en converteren. Blogs alleen als het past bij intentie." },
    { question: "Gebruik je AI?", answer: "Als hulpmiddel, niet als bulk-vervanger. Stem en redactie blijven menselijk." },
    { question: "Hoe vaak moet ik publiceren?", answer: "Kwaliteit boven ritme. Eén sterke pagina wint van vijf dunne." },
    { question: "Doe je content voor SEO én ads?", answer: "Ja. Landings die matchen met campagnes." },
    { question: "Wat kost {kw}?", answer: "Per project of retainer na intake. Voorstel op maat, geen woordprijs uit de lade." },
    { question: "Kun je bestaande content updaten?", answer: "Ja. Vaak slimmer dan nieuwe stapelen." },
    { question: "Hoe meet je content succes?", answer: "Rankings, clicks, leads. Niet alleen pageviews." },
    { question: "Doe je video scripts?", answer: "Kan, als het past in je plan." },
    { question: "Werk je met mijn tone of voice?", answer: "Ja. Of we ontwikkelen er een die bij je past." },
    { question: "Help je met AI-zoek?", answer: "Content die citeerbaar is voor ChatGPT en Gemini." },
    { question: "Doe je social content?", answer: "Owned first. Social als versterker, niet als enige basis." },
    { question: "Kun je case studies?", answer: "Ja, met echte cijfers waar mogelijk." },
    { question: "Hoe lang duurt een contentplan?", answer: "Intake en plan: kort. Uitvoering: doorlopend met prioriteiten." },
    { question: "Is content genoeg zonder ads?", answer: "Soms. Organisch groeien kan eerst. Timing verschilt per merk." },
    { question: "Wat als ik al een contentteam heb?", answer: "Dan versterk ik strategie, SEO en landings. Samenwerking, geen dubbel werk." },
  ],
  "b2b-portal": [
    { question: "Bouw je custom portalen?", answer: "Ja. Shopify B2B, koppelingen, flows waar je stack het toelaat." },
    { question: "Werk je met n8n of Make?", answer: "Ja. Systemen aan elkaar knopen zonder handmatig gedoe." },
    { question: "Hoe lang duurt automatisering?", answer: "Eerste flow vaak binnen weken. Portal groter, plan afhankelijk." },
    { question: "Moet ik Shopify gebruiken?", answer: "Niet altijd. Wel vaak slim voor B2B e-commerce." },
    { question: "Wat kost {kw}?", answer: "Scope-afhankelijk. Tel eerst uren die je nu verliest." },
    { question: "Kun je CRM koppelen?", answer: "Ja. Leads horen niet in Gmail te sterven." },
    { question: "Doe je training?", answer: "Ja. Je team moet het snappen, niet alleen ik." },
    { question: "Wat als we Excel blijven gebruiken?", answer: "Dan reken ik door of automatisering terugverdient." },
    { question: "Is een portal altijd nodig?", answer: "Nee. Soms is een slimmere orderflow genoeg." },
    { question: "Hoe meet je succes?", answer: "Uren bespaard, snellere orders, minder fouten." },
    { question: "Werk je met bestaande ERP?", answer: "Koppelingen afhankelijk van API's. Eerst haalbaarheid checken." },
    { question: "Kunnen klanten zelf bestellen?", answer: "Dat is vaak het doel. Minder mail, meer marge." },
    { question: "Hoe zit het met beveiliging?", answer: "Standaard best practices. Klantdata verdient zorgvuldige behandeling." },
    { question: "Doe je ook B2C naast B2B?", answer: "Ja, met juiste scheiding en prijslogica." },
    { question: "Wat na oplevering?", answer: "Monitoring, uitbreiden, optimaliseren. Automatisering groeit mee." },
  ],
};

function variateBaseFaqs(page: SeoLandingPage, vars: Record<string, string>): SeoLandingFaq[] {
  const baseCount = Math.min(page.faq.length, (hashSlug(page.slug, "faq-base") % 2) + 2);
  const fromBase = pickMany(page.slug, page.faq, baseCount, "faq-from-base");
  const fromPool = pickMany(
    page.slug,
    EXTRA_FAQ_POOL[page.category],
    4 - fromBase.length,
    "faq-from-pool",
  );
  const merged = [...fromBase, ...fromPool];
  const seen = new Set<string>();
  return merged
    .map((f) => ({
      question: fill(f.question, vars),
      answer: fill(f.answer, vars),
    }))
    .filter((f) => {
      if (seen.has(f.question)) return false;
      seen.add(f.question);
      return true;
    });
}

export function buildUniqueOpener(page: SeoLandingPage): string {
  const vars = pageVars(page);
  const opener = fill(pick(page.slug, UNIQUE_OPENERS, "unique-opener"), vars);
  if (page.location?.city && page.location.city !== "Apeldoorn") {
    const profile = cityProfile(page.location.city);
    return `${opener} ${profile.ondernemerstype.charAt(0).toUpperCase()}${profile.ondernemerstype.slice(1)}.`;
  }
  return opener;
}

export function buildPainSectionIntro(page: SeoLandingPage): string {
  const vars = pageVars(page);
  return fill(pick(page.slug, PAIN_SECTION_INTROS, "pain-intro"), vars);
}

export function buildSchemaPrimaryQuestion(page: SeoLandingPage): string {
  const vars = pageVars(page);
  return fill(pick(page.slug, SCHEMA_FAQ_QUESTIONS, "schema-q"), vars);
}

export function buildExpandedExtraFaqs(page: SeoLandingPage): readonly SeoLandingFaq[] {
  const vars = pageVars(page);
  const pool = EXTRA_FAQ_POOL[page.category];
  const count = 3 + (hashSlug(page.slug, "extra-faq-count") % 2);
  const picked = pickMany(page.slug, pool, count, "extra-faq-pick");

  if (page.location?.city) {
    const cityQ =
      page.location.city === "Apeldoorn"
        ? {
            question: "Zit Meneer Marketing echt in Apeldoorn?",
            answer: fill(
              "Ja. Apeldoorn is thuisbasis op de Veluwe. {kw} bespreek ik met je cijfers open, niet vanuit een postbus in de Randstad.",
              vars,
            ),
          }
        : {
            question: `Waarom {kw} via iemand die ${page.location.city} kent?`,
            answer: fill(
              `Omdat generieke copy met '{city}' in de titel niemand overtuigt. Ik schrijf voor ondernemers in {city} en {region}, met dezelfde principes als in elk traject: eerst fundament, dan schalen.`,
              vars,
            ),
          };
    picked.push(cityQ);
  }

  const seen = new Set<string>();
  return picked
    .map((f) => ({
      question: fill(f.question, vars),
      answer: fill(f.answer, vars),
    }))
    .filter((f) => {
      if (seen.has(f.question)) return false;
      seen.add(f.question);
      return true;
    });
}

/** Maakt base page-secties uniek per slug vóór enrich-lagen. */
export function variateSeoLandingPage(page: SeoLandingPage): SeoLandingPage {
  if (page.lockContent) {
    return page;
  }

  const vars = pageVars(page);

  const pains = mergeCards(page.slug, page.pains, PAIN_ALTS[page.category], 3, "pains", vars);
  const deliverables = mergeCards(
    page.slug,
    page.deliverables,
    DELIVERABLE_ALTS[page.category],
    Math.min(4, page.deliverables.length),
    "deliverables",
    vars,
  );
  const processSteps = mergeSteps(
    page.slug,
    page.processSteps,
    PROCESS_ALTS[page.category],
    page.processSteps.length,
    "process",
    vars,
  );

  const hotTake = pick(page.slug, HOT_TAKE_ALTS[page.category], "hot-take");
  const proofTwist = fill(pick(page.slug, PROOF_TWISTS, "proof"), vars);

  const subheadline = `${page.subheadline}${proofTwist}`;

  const visualCaption =
    page.visualCaption ??
    fill(
      pick(
        page.slug,
        [
          `Zo pak ik {kw} aan{loc}. Op maat, met plan.`,
          `{kw}: wat ik in accounts en shops echt zie{loc}.`,
          `Illustratie bij {kw}. Onder de hood draait het om marge en snelheid.`,
        ],
        "visual-cap",
      ),
      vars,
    );

  const baseFaqs = variateBaseFaqs(page, vars);

  return {
    ...page,
    subheadline,
    pains,
    deliverables,
    processSteps,
    hotTake: {
      label: hotTake.label,
      body: fill(hotTake.body, vars),
    },
    proofBody: `${page.proofBody}${proofTwist}`,
    ctaTitle: fill(pick(page.slug, CTA_TITLE_ALTS, "cta-title"), vars),
    ctaBody: fill(pick(page.slug, CTA_BODY_ALTS, "cta-body"), vars),
    visualCaption,
    faq: baseFaqs,
    metaDescription: page.metaDescription,
  };
}
